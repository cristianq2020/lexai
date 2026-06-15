import {
  getDisclaimerForArea,
  getLegalAreaById,
  type LegalAreaId,
} from '@lexai/shared';
import type { LegalResponse } from '@lexai/shared';
import { classifyQuery } from '../orchestrator/classifyQuery.js';
import type { SelectedAgent } from '../orchestrator/selectAgent.js';
import type { ConsultationExecutionMode } from '../orchestrator/types.js';

export interface IntelligentMockInput {
  query: string;
  areaId: LegalAreaId;
  agent: SelectedAgent;
  mode: ConsultationExecutionMode;
  classificationConfidence: number;
  fallbackReason?: string;
}

interface TopicMatch {
  id: string;
  keywords: readonly string[];
  diagnostico: string;
  derechos: readonly string[];
  plazos: { descripcion: string; urgencia: 'alta' | 'media' | 'baja'; fechaLimite?: string }[];
  acciones: { prioridad: number; accion: string; plazo?: string }[];
  legislacion: { norma: string; articulo: string; texto: string }[];
  riesgo: { nivel: 'alto' | 'medio' | 'bajo'; score: number; semaforo: 'rojo' | 'amarillo' | 'verde' };
  irac: { issue: string; rule: string; application: string; conclusion: string };
}

const URGENCY_KEYWORDS = ['urgente', 'mañana', 'hoy', 'plazo', 'caduca', 'caducidad', '20 días', '10 días'];

const AREA_TOPICS: Record<LegalAreaId, readonly TopicMatch[]> = {
  laboral: [
    {
      id: 'despido',
      keywords: ['despido', 'despedido', 'despedida', 'finiquito', 'carta de despido', 'improcedente'],
      diagnostico:
        'En un despido sin preaviso ni indemnización, el trabajador debe verificar si recibió comunicación escrita ' +
        'y si la causa alegada encaja en las causas del art. 54 ET. Un despido sin forma puede ser improcedente o nulo.',
      derechos: [
        'Derecho a la tutela judicial efectiva y a impugnar el despido',
        'Derecho a indemnización si el despido es improcedente',
        'Derecho a salarios de tramitación si se solicita la readmisión',
        'Derecho a la prestación por desempleo si concurren los requisitos',
      ],
      plazos: [
        { descripcion: 'Demanda por despido (caducidad)', urgencia: 'alta', fechaLimite: '20 días hábiles desde la notificación' },
        { descripcion: 'Conciliación previa (SMAC)', urgencia: 'alta', fechaLimite: 'Antes de la demanda o en paralelo según estrategia' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Solicitar por escrito la carta de despido y finiquito detallado', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Acudir al SMAC para intentar conciliación', plazo: 'Antes de demandar' },
        { prioridad: 3, accion: 'Consultar con abogado laboralista para evaluar improcedencia/nulidad', plazo: 'Esta semana' },
        { prioridad: 4, accion: 'Reunir contrato, nóminas, comunicaciones y testigos', plazo: 'Antes del plazo de 20 días' },
      ],
      legislacion: [
        { norma: 'Estatuto de los Trabajadores', articulo: '55', texto: 'Presunción de improcedencia si no se acredita la causa' },
        { norma: 'LRJS', articulo: '105', texto: 'Procedimiento monitorio laboral y plazos de impugnación' },
      ],
      riesgo: { nivel: 'alto', score: 7, semaforo: 'rojo' },
      irac: {
        issue: 'Impugnación de despido y determinación de su calificación',
        rule: 'ET arts. 52-56 y LRJS — plazo de caducidad de 20 días hábiles',
        application: 'La falta de carta de despido formal y de indemnización sugiere posible improcedencia',
        conclusion: 'Actuar con urgencia en plazos y documentación antes de demandar',
      },
    },
  ],
  civil: [
    {
      id: 'impago',
      keywords: ['impago', 'deuda', 'factura', 'reclamación', 'cantidad', 'monitorio'],
      diagnostico:
        'Ante un impago de factura o deuda líquida, el ordenamiento permite el procedimiento monitorio ' +
        'como vía rápida para obtener título ejecutivo si el deudor no se opone.',
      derechos: [
        'Derecho a reclamar el principal, intereses y costas',
        'Derecho al procedimiento monitorio si la deuda es líquida y exigible',
        'Derecho a medidas cautelares si existe riesgo de insolvencia del deudor',
      ],
      plazos: [
        { descripcion: 'Prescripción de acciones personales', urgencia: 'media', fechaLimite: '5 años (art. 1964 CC)' },
        { descripcion: 'Oposición del deudor al monitorio', urgencia: 'media', fechaLimite: '20 días desde requerimiento' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Enviar burofax o requerimiento fehaciente de pago', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Valorar procedimiento monitorio con facturas y contrato', plazo: '2-4 semanas' },
        { prioridad: 3, accion: 'Calcular intereses legales o pactados', plazo: 'Antes de reclamar' },
      ],
      legislacion: [
        { norma: 'LEC', articulo: '812', texto: 'Procedimiento monitorio para deudas líquidas' },
        { norma: 'Código Civil', articulo: '1101', texto: 'Incumplimiento de obligaciones' },
      ],
      riesgo: { nivel: 'medio', score: 5, semaforo: 'amarillo' },
      irac: {
        issue: 'Recuperación de cantidad adeudada',
        rule: 'Monitorio LEC y prescripción del art. 1964 CC',
        application: 'Deuda documentada facilita vía monitoria',
        conclusion: 'Requerimiento previo y monitorio si no hay pago voluntario',
      },
    },
  ],
  penal: [
    {
      id: 'denuncia',
      keywords: ['denuncia', 'estafa', 'delito', 'denunciar', 'víctima'],
      diagnostico:
        'Como víctima de un posible delito, puede interponer denuncia en Guardia Civil, Policía Nacional, ' +
        'o Juzgado de Guardia. La valoración penal requiere acreditación de elementos del tipo delictivo.',
      derechos: [
        'Derecho a denunciar y a la asistencia jurídica gratuita si cumple requisitos',
        'Derecho a ser informado del estado de la investigación',
        'Derecho a personarse como acusación particular',
      ],
      plazos: [
        { descripcion: 'Denuncia por delitos menos graves', urgencia: 'alta', fechaLimite: 'Sin plazo estricto, pero cuanto antes' },
        { descripcion: 'Prescripción del delito', urgencia: 'media', fechaLimite: 'Depende del delito (ej. estafa: 5 años)' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Conservar pruebas: capturas, transferencias, comunicaciones', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Interponer denuncia con relato cronológico y documentos', plazo: 'Esta semana' },
        { prioridad: 3, accion: 'Valorar abogado penalista para acusación particular', plazo: 'Antes de declarar' },
      ],
      legislacion: [
        { norma: 'Código Penal', articulo: '248', texto: 'Estafa — elementos del tipo' },
        { norma: 'LECrim', articulo: '277', texto: 'Denuncia y querella' },
      ],
      riesgo: { nivel: 'alto', score: 8, semaforo: 'rojo' },
      irac: {
        issue: 'Iniciación de acción penal como perjudicado',
        rule: 'CP y LECrim — tipicidad, antijuridicidad y culpabilidad',
        application: 'Prueba documental y testifical será determinante',
        conclusion: 'Denuncia formal con asesoramiento penal especializado',
      },
    },
  ],
  familia: [
    {
      id: 'divorcio',
      keywords: ['divorcio', 'separación', 'custodia', 'pensión', 'alimentos'],
      diagnostico:
        'En procedimientos de familia con menores, el interés superior del menor prima. ' +
        'Puede optarse por mutuo acuerdo (más rápido) o contencioso.',
      derechos: [
        'Derecho a la guarda y custodia conforme al interés del menor',
        'Derecho a pensión de alimentos proporcional a ingresos',
        'Derecho a régimen de visitas y comunicación',
      ],
      plazos: [
        { descripcion: 'Mediación familiar previa (si aplica)', urgencia: 'media' },
        { descripcion: 'Medidas provisionales urgentes', urgencia: 'alta', fechaLimite: 'Si hay riesgo para menores' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Intentar acuerdo regulador con mediación', plazo: '1-2 meses' },
        { prioridad: 2, accion: 'Documentar ingresos y gastos de menores', plazo: 'Antes de negociar' },
        { prioridad: 3, accion: 'Solicitar medidas provisionales si hay urgencia', plazo: 'Inmediato si hay riesgo' },
      ],
      legislacion: [
        { norma: 'Código Civil', articulo: '92', texto: 'Guarda y custodia de los hijos' },
        { norma: 'Código Civil', articulo: '142', texto: 'Pensión de alimentos' },
      ],
      riesgo: { nivel: 'medio', score: 6, semaforo: 'amarillo' },
      irac: {
        issue: 'Regulación de efectos del divorcio o separación',
        rule: 'CC Libro I — interés superior del menor',
        application: 'Acuerdo mutuo reduce conflicto y costes',
        conclusion: 'Mediación preferible; contencioso si no hay acuerdo',
      },
    },
  ],
  fiscal: [
    {
      id: 'liquidacion',
      keywords: ['hacienda', 'aeat', 'liquidación', 'iva', 'irpf', 'sanción', 'recurso'],
      diagnostico:
        'Ante una liquidación o sanción de la AEAT, dispone de vías administrativas (alegaciones, reposición, ' +
        'económico-administrativo) antes de la vía contenciosa.',
      derechos: [
        'Derecho a presentar alegaciones en el procedimiento de comprobación',
        'Derecho a recurso de reposición y reclamación económico-administrativa',
        'Derecho a suspensión del acto en determinados supuestos',
      ],
      plazos: [
        { descripcion: 'Alegaciones a propuesta de liquidación', urgencia: 'alta', fechaLimite: '15 días hábiles' },
        { descripcion: 'Recurso de reposición', urgencia: 'alta', fechaLimite: '1 mes desde notificación' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Revisar la notificación y el expediente completo', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Presentar alegaciones con documentación contable', plazo: 'Dentro del plazo' },
        { prioridad: 3, accion: 'Consultar asesor fiscal colegiado', plazo: 'Antes de recurrir' },
      ],
      legislacion: [
        { norma: 'LGT', articulo: '139', texto: 'Recurso de reposición' },
        { norma: 'LIVA', articulo: '97', texto: 'Liquidación de oficio' },
      ],
      riesgo: { nivel: 'alto', score: 7, semaforo: 'rojo' },
      irac: {
        issue: 'Impugnación de acto tributario',
        rule: 'LGT — procedimiento y plazos administrativos',
        application: 'Plazos perentorios — riesgo de firmeza del acto',
        conclusion: 'Actuar dentro de plazos con asesor fiscal',
      },
    },
  ],
  trafico: [
    {
      id: 'multa',
      keywords: ['multa', 'dgt', 'puntos', 'radar', 'tráfico', 'recurso'],
      diagnostico:
        'Las sanciones de tráfico pueden recurrirse en vía administrativa (reposición) y, posteriormente, ' +
        'ante la Jurisdicción Contencioso-Administrativa.',
      derechos: [
        'Derecho a recurso de reposición ante la Jefatura de Tráfico',
        'Derecho a la presunción de inocencia en vía penal si hay delito contra la seguridad vial',
        'Derecho a suspensión de la ejecución en determinados casos',
      ],
      plazos: [
        { descripcion: 'Recurso de reposición', urgencia: 'alta', fechaLimite: '20 días desde notificación' },
        { descripcion: 'Pago con descuento voluntario', urgencia: 'media', fechaLimite: '20 días (50% reducción)' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Verificar notificación y datos del vehículo/conductor', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Valorar recurso de reposición con prueba', plazo: 'Antes de 20 días' },
        { prioridad: 3, accion: 'Evaluar curso de sensibilización para recuperar puntos', plazo: 'Si aplica' },
      ],
      legislacion: [
        { norma: 'Ley de Seguridad Vial', articulo: '76', texto: 'Recursos contra sanciones' },
        { norma: 'RGC', articulo: '45', texto: 'Infracciones y sanciones' },
      ],
      riesgo: { nivel: 'medio', score: 4, semaforo: 'amarillo' },
      irac: {
        issue: 'Impugnación de sanción de tráfico',
        rule: 'LSV y RGC — plazo de reposición 20 días',
        application: 'Errores en notificación o identificación pueden anular la sanción',
        conclusion: 'Recurso oportuno o pago con descuento según estrategia',
      },
    },
  ],
  consumidor: [
    {
      id: 'reclamacion',
      keywords: ['consumidor', 'reclamación', 'devolución', 'garantía', 'cláusula abusiva'],
      diagnostico:
        'El consumidor dispone de vías extrajudiciales (hojas de reclamación, ODR) y judiciales. ' +
        'Las cláusulas abusivas son nulas de pleno derecho.',
      derechos: [
        'Derecho de desistimiento en contratos a distancia (14 días)',
        'Derecho a garantía legal de 3 años en bienes de consumo',
        'Derecho a reclamar ante servicios de consumo de la comunidad autónoma',
      ],
      plazos: [
        { descripcion: 'Desistimiento contrato a distancia', urgencia: 'media', fechaLimite: '14 días naturales' },
        { descripcion: 'Reclamación judicial', urgencia: 'baja', fechaLimite: '5 años prescripción' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Presentar hoja de reclamaciones o reclamación al comercio', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Acudir a consumo de su CCAA o plataforma ODR', plazo: '2-4 semanas' },
        { prioridad: 3, accion: 'Valorar demanda si no hay respuesta satisfactoria', plazo: 'Tras agotar vía extrajudicial' },
      ],
      legislacion: [
        { norma: 'LGDCU', articulo: '86', texto: 'Cláusulas abusivas' },
        { norma: 'LGDCU', articulo: '102', texto: 'Garantía de conformidad' },
      ],
      riesgo: { nivel: 'bajo', score: 3, semaforo: 'verde' },
      irac: {
        issue: 'Reclamación por incumplimiento del empresario',
        rule: 'LGDCU — protección del consumidor',
        application: 'Documentar compra, defecto y comunicaciones',
        conclusion: 'Vía extrajudicial preferente; judicial si persiste el incumplimiento',
      },
    },
  ],
  mercantil: [
    {
      id: 'sociedad',
      keywords: ['sociedad', 'socio', 'administrador', 'concurso', 'impago mercantil'],
      diagnostico:
        'En conflictos societarios o situaciones de insolvencia, la Ley Concursal y la LSC regulan ' +
        'responsabilidades del administrador y opciones de reestructuración.',
      derechos: [
        'Derecho a información societaria (cuentas, actas)',
        'Derecho a impugnar acuerdos sociales lesivos',
        'Derecho a solicitar concurso voluntario si hay insolvencia actual o inminente',
      ],
      plazos: [
        { descripcion: 'Solicitud de concurso voluntario', urgencia: 'alta', fechaLimite: '2 meses desde insolvencia actual' },
        { descripcion: 'Impugnación de acuerdos sociales', urgencia: 'media', fechaLimite: '1 año desde el acuerdo' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Auditar situación de tesorería y pasivo', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Consultar abogado mercantilista sobre responsabilidad del administrador', plazo: 'Esta semana' },
        { prioridad: 3, accion: 'Valorar concurso o acuerdo extrajudicial de pagos', plazo: 'Antes de insolvencia' },
      ],
      legislacion: [
        { norma: 'LSC', articulo: '241', texto: 'Deber de diligencia del administrador' },
        { norma: 'Ley Concursal', articulo: '5', texto: 'Deber de solicitud de concurso' },
      ],
      riesgo: { nivel: 'alto', score: 7, semaforo: 'rojo' },
      irac: {
        issue: 'Gestión de crisis o conflicto societario',
        rule: 'LSC y Ley Concursal',
        application: 'Retraso en concurso puede generar responsabilidad personal',
        conclusion: 'Asesoramiento mercantil urgente',
      },
    },
  ],
  extranjeria: [
    {
      id: 'residencia',
      keywords: ['residencia', 'nie', 'nacionalidad', 'visado', 'arraigo', 'extranjería'],
      diagnostico:
        'Los procedimientos de extranjería tienen requisitos documentales estrictos. ' +
        'El arraigo, la residencia por trabajo o la reagrupación tienen vías y plazos distintos.',
      derechos: [
        'Derecho a solicitar autorización de residencia conforme a la LOEx',
        'Derecho a recurrir resoluciones denegatorias',
        'Derecho a asistencia jurídica si es persona vulnerable',
      ],
      plazos: [
        { descripcion: 'Recurso reposición resolución denegatoria', urgencia: 'alta', fechaLimite: '1 mes desde notificación' },
        { descripcion: 'Renovación de autorización', urgencia: 'media', fechaLimite: '60 días antes del vencimiento' },
      ],
      acciones: [
        { prioridad: 1, accion: 'Verificar requisitos del supuesto (arraigo, trabajo, etc.)', plazo: 'Inmediato' },
        { prioridad: 2, accion: 'Reunir empadronamiento, contratos, seguros y antecedentes', plazo: 'Antes de solicitar' },
        { prioridad: 3, accion: 'Presentar solicitud o recurso con abogado de extranjería', plazo: 'Dentro de plazos' },
      ],
      legislacion: [
        { norma: 'LOEx', articulo: '31', texto: 'Autorización de residencia temporal' },
        { norma: 'Reglamento de Extranjería', articulo: '123', texto: 'Arraigo social' },
      ],
      riesgo: { nivel: 'medio', score: 5, semaforo: 'amarillo' },
      irac: {
        issue: 'Obtención o renovación de autorización de residencia',
        rule: 'LOEx y Reglamento de Extranjería',
        application: 'Documentación incompleta es causa principal de denegación',
        conclusion: 'Expediente completo y recurso si procede',
      },
    },
  ],
};

function detectTopic(query: string, areaId: LegalAreaId): TopicMatch | null {
  const normalized = query.toLowerCase();
  const topics = AREA_TOPICS[areaId];

  let best: TopicMatch | null = null;
  let bestScore = 0;

  for (const topic of topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (normalized.includes(kw)) {
        score += kw.split(' ').length > 1 ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

function buildGenericAreaResponse(
  areaId: LegalAreaId,
  query: string,
  mode: ConsultationExecutionMode,
): Omit<LegalResponse, 'disclaimer' | 'confidenceScore'> {
  const area = getLegalAreaById(areaId);
  const legislation = area?.legislation ?? ['legislación española aplicable'];
  const hasUrgency = URGENCY_KEYWORDS.some((k) => query.toLowerCase().includes(k));

  const modeNote =
    mode === 'fallback'
      ? ' El análisis con Grok no está disponible temporalmente; esta orientación se genera con el motor jurídico local de LexAI.'
      : ' Esta orientación preliminar se genera con el motor jurídico local de LexAI mientras no hay conexión con Grok.';

  return {
    diagnostico:
      `Hemos analizado su consulta en materia de ${area?.label ?? areaId}. ` +
      `Según la información proporcionada, recomendamos revisar la normativa aplicable (${legislation.join(', ')}) ` +
      `y acudir a un profesional colegiado para asesoramiento vinculante.${modeNote}`,
    derechos: [
      'Derecho a la tutela judicial efectiva (art. 24 CE)',
      'Derecho a la defensa y asistencia letrada',
      'Derecho a obtener información clara sobre plazos y procedimientos',
    ],
    plazos: hasUrgency
      ? [{ descripcion: 'Verificar plazos procesales aplicables a su caso', urgencia: 'alta' as const }]
      : [{ descripcion: 'Identificar plazos de caducidad según el procedimiento', urgencia: 'media' as const }],
    riesgo: hasUrgency
      ? { nivel: 'alto', score: 7, semaforo: 'rojo' as const }
      : { nivel: 'medio', score: 5, semaforo: 'amarillo' as const },
    accionesRecomendadas: [
      { prioridad: 1, accion: 'Documentar todos los hechos, fechas y comunicaciones relevantes' },
      { prioridad: 2, accion: `Consultar con abogado especializado en ${area?.label ?? areaId}` },
      { prioridad: 3, accion: 'Verificar plazos legales antes de tomar decisiones irreversibles' },
    ],
    legislacionCitada: legislation.slice(0, 2).map((norma) => ({
      norma,
      articulo: '—',
      texto: 'Normativa de referencia en esta materia',
    })),
    jurisprudencia: [],
    irac: {
      issue: `Consulta en materia ${area?.label ?? areaId}`,
      rule: legislation.join('; '),
      application: 'Análisis preliminar basado en hechos relatados y clasificación por área',
      conclusion: 'Se recomienda asesoramiento profesional para decisión definitiva',
    },
  };
}

export function buildIntelligentMockResponse(input: IntelligentMockInput): LegalResponse {
  const { query, areaId, mode, classificationConfidence, fallbackReason } = input;
  const topic = detectTopic(query, areaId);
  const classification = classifyQuery(query, areaId);
  const disclaimer = getDisclaimerForArea(areaId);

  const baseConfidence =
    mode === 'fallback'
      ? Math.min(classificationConfidence, 0.55)
      : Math.min(classificationConfidence, 0.65);

  if (topic) {
    const topicConfidence = Math.min(0.75, baseConfidence + 0.15);
    return {
      diagnostico:
        topic.diagnostico +
        (mode === 'fallback'
          ? ' (Respuesta generada por motor local — servicio Grok temporalmente no disponible.)'
          : ' (Orientación preliminar — motor jurídico local LexAI.)'),
      derechos: [...topic.derechos],
      plazos: topic.plazos.map((p) => ({ ...p })),
      riesgo: { ...topic.riesgo },
      accionesRecomendadas: topic.acciones.map((a) => ({ ...a })),
      legislacionCitada: topic.legislacion.map((l) => ({ ...l })),
      jurisprudencia: [],
      confidenceScore: topicConfidence,
      disclaimer,
      irac: { ...topic.irac },
    };
  }

  const generic = buildGenericAreaResponse(areaId, query, mode);
  return {
    ...generic,
    confidenceScore: baseConfidence,
    disclaimer,
    irac: {
      ...generic.irac,
      application:
        mode === 'fallback'
          ? `${classification.reasoning}. ${fallbackReason ? 'Causa técnica: servicio Grok no disponible.' : ''}`
          : classification.reasoning,
    },
  };
}