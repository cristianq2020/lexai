export const LEGAL_VERSION = '1.0';
export const LEGAL_EFFECTIVE_DATE = '15 de junio de 2026';
export const COMPANY_NAME = 'LexAI Technologies S.L.';
export const COMPANY_ADDRESS = 'Calle de la Justicia Digital, 1, 28001 Madrid, España';
export const COMPANY_EMAIL = 'legal@lexai.es';
export const DPO_EMAIL = 'dpo@lexai.es';

export const COOKIE_POLICY_SECTIONS = [
  {
    id: 'que-son',
    title: '1. ¿Qué son las cookies?',
    content:
      'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita lexai.es. ' +
      'Permiten recordar preferencias, mantener sesiones seguras y —solo con su consentimiento— medir el uso de la plataforma.',
  },
  {
    id: 'tipos',
    title: '2. Tipos de cookies que utilizamos',
    content:
      '**Estrictamente necesarias:** autenticación JWT, preferencias de consentimiento y seguridad CSRF. No requieren consentimiento.\n\n' +
      '**Funcionales:** idioma, tema y estado del onboarding.\n\n' +
      '**Analíticas (opcionales):** métricas agregadas de navegación para mejorar el producto. Solo se activan si acepta "Cookies analíticas".\n\n' +
      '**Marketing (opcionales):** remarketing y newsletters personalizadas. Requieren consentimiento explícito.',
  },
  {
    id: 'gestion',
    title: '3. Gestión y revocación',
    content:
      'Puede aceptar, rechazar o configurar cookies desde el banner inicial o en Ajustes → Privacidad. ' +
      'También puede eliminar cookies desde su navegador. La revocación no afecta a la licitud del tratamiento previo.',
  },
  {
    id: 'terceros',
    title: '4. Cookies de terceros',
    content:
      'En producción podemos utilizar Stripe (pagos), Sentry (monitorización de errores) y Resend (emails transaccionales). ' +
      'Cada proveedor dispone de su propia política de privacidad conforme al RGPD.',
  },
];

export const PRIVACY_SECTIONS = [
  {
    id: 'responsable',
    title: '1. Responsable del tratamiento',
    content: `${COMPANY_NAME}\n${COMPANY_ADDRESS}\nEmail: ${DPO_EMAIL}`,
  },
  {
    id: 'datos',
    title: '2. Datos que tratamos',
    content:
      'Identificación (email, nombre), credenciales cifradas, expedientes jurídicos, consultas con IA, documentos cifrados (AES-256-GCM), ' +
      'consentimientos RGPD, logs de auditoría, datos de facturación (Stripe) y —opcionalmente— grabaciones de voz con consentimiento explícito.',
  },
  {
    id: 'finalidad',
    title: '3. Finalidad y base legal',
    content:
      'Prestación del servicio jurídico digital (ejecución contractual, art. 6.1.b RGPD). ' +
      'Cumplimiento legal y auditoría (obligación legal, art. 6.1.c). ' +
      'Mejora del producto y analítica (consentimiento, art. 6.1.a). ' +
      'Comunicaciones comerciales (consentimiento, art. 6.1.a).',
  },
  {
    id: 'retencion',
    title: '4. Plazos de conservación',
    content:
      'Consultas: 2 años · Documentos: 3 años · Auditoría: 7 años · Consentimientos: 7 años · Voz: 1 año (con consentimiento).',
  },
  {
    id: 'derechos',
    title: '5. Sus derechos',
    content:
      'Acceso, rectificación, supresión, portabilidad, oposición y limitación. ' +
      'Ejercítelos desde Ajustes → Exportar datos / Eliminar cuenta o escribiendo a ' + DPO_EMAIL + '. ' +
      'Puede reclamar ante la AEPD (www.aepd.es).',
  },
  {
    id: 'ia',
    title: '6. Tratamiento con IA',
    content:
      'Las consultas pueden procesarse con modelos de IA (xAI Grok o motor local). ' +
      'No sustituyen asesoramiento de abogado colegiado. Los prompts no se usan para entrenar modelos de terceros sin consentimiento.',
  },
];

export const TERMS_SECTIONS = [
  {
    id: 'objeto',
    title: '1. Objeto',
    content:
      'Estos Términos regulan el acceso y uso de LexAI, plataforma SaaS de asistencia jurídica con inteligencia artificial. ' +
      'Al registrarse acepta estos términos en su versión vigente.',
  },
  {
    id: 'servicio',
    title: '2. Naturaleza del servicio',
    content:
      'LexAI proporciona orientación jurídica automatizada. **No constituye relación abogado-cliente** salvo contratación expresa de servicios profesionales. ' +
      'Las respuestas incluyen disclaimers legales obligatorios.',
  },
  {
    id: 'cuentas',
    title: '3. Cuentas y planes',
    content:
      'Debe proporcionar información veraz. Los planes FREE, STARTER, PROFESSIONAL y ENTERPRISE tienen límites de uso descritos en la página de precios. ' +
      'El impago puede suspender el acceso.',
  },
  {
    id: 'uso',
    title: '4. Uso prohibido',
    content:
      'Queda prohibido: uso para actividades ilícitas, scraping masivo, ingeniería inversa, suplantación, spam o intentos de eludir rate limits y controles anti-abuso.',
  },
  {
    id: 'propiedad',
    title: '5. Propiedad intelectual',
    content:
      'LexAI retiene los derechos sobre la plataforma. Usted conserva la propiedad de sus documentos y expedientes. ' +
      'Nos otorga licencia limitada para procesarlos con el fin de prestar el servicio.',
  },
  {
    id: 'limitacion',
    title: '6. Limitación de responsabilidad',
    content:
      'El servicio se presta "tal cual". No garantizamos resultados procesales. ' +
      'La responsabilidad máxima se limita a las cuotas pagadas en los 12 meses anteriores al incidente.',
  },
  {
    id: 'ley',
    title: '7. Ley aplicable',
    content: 'Legislación española. Jurisdicción: tribunales de Madrid, salvo normativa imperativa de consumo.',
  },
];

export const LEGAL_NOTICE_SECTIONS = [
  {
    id: 'titular',
    title: 'Titular del sitio web',
    content: `${COMPANY_NAME}\nNIF: B12345678\n${COMPANY_ADDRESS}\nContacto: ${COMPANY_EMAIL}`,
  },
  {
    id: 'registro',
    title: 'Registro mercantil',
    content: 'Inscrita en el Registro Mercantil de Madrid, Tomo 00000, Folio 000, Hoja M-000000.',
  },
  {
    id: 'alojamiento',
    title: 'Alojamiento',
    content: 'Infraestructura cloud UE (región Frankfurt/Irlanda) con cifrado en tránsito TLS 1.3 y en reposo AES-256.',
  },
];