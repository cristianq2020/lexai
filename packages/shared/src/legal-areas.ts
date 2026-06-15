export const LEGAL_AREA_IDS = [
  'laboral',
  'civil',
  'penal',
  'familia',
  'fiscal',
  'trafico',
  'consumidor',
  'mercantil',
  'extranjeria',
] as const;

export type LegalAreaId = (typeof LEGAL_AREA_IDS)[number];

export interface LegalAreaDefinition {
  id: LegalAreaId;
  label: string;
  description: string;
  agentName: string;
  legislation: string[];
  strictDisclaimer: boolean;
}

export const LEGAL_AREAS: readonly LegalAreaDefinition[] = [
  {
    id: 'laboral',
    label: 'Laboral',
    description: 'Despidos, contratos, acoso, horas extra y conflictos laborales',
    agentName: 'Dra. Elena Vargas',
    legislation: ['Estatuto de los Trabajadores', 'LRJS', 'EBEP'],
    strictDisclaimer: false,
  },
  {
    id: 'civil',
    label: 'Civil y Contratos',
    description: 'Contratos, responsabilidad civil, arrendamientos y reclamaciones',
    agentName: 'Dr. Miguel Ortega',
    legislation: ['Código Civil', 'LEC'],
    strictDisclaimer: false,
  },
  {
    id: 'penal',
    label: 'Penal',
    description: 'Denuncias, defensa, delitos y procedimiento penal',
    agentName: 'Dr. Javier Morales',
    legislation: ['Código Penal', 'LECrim'],
    strictDisclaimer: true,
  },
  {
    id: 'familia',
    label: 'Familia',
    description: 'Divorcios, custodia, pensiones y mediación familiar',
    agentName: 'Dra. Laura Sánchez',
    legislation: ['Código Civil Libro I', 'Ley de Jurisdicción Voluntaria'],
    strictDisclaimer: false,
  },
  {
    id: 'fiscal',
    label: 'Fiscal',
    description: 'IRPF, IVA, inspecciones, sanciones y planificación fiscal',
    agentName: 'Dr. Andrés Ruiz',
    legislation: ['LIRPF', 'LIVA', 'LGT', 'RGPD'],
    strictDisclaimer: true,
  },
  {
    id: 'trafico',
    label: 'Tráfico',
    description: 'Multas, puntos, accidentes y recursos administrativos',
    agentName: 'Dra. Carmen Díaz',
    legislation: ['Ley de Seguridad Vial', 'RGC'],
    strictDisclaimer: false,
  },
  {
    id: 'consumidor',
    label: 'Consumidor',
    description: 'Reclamaciones, garantías, cláusulas abusivas y ODR',
    agentName: 'Dr. Pablo Navarro',
    legislation: ['LGDCU', 'LCGC', 'ODR'],
    strictDisclaimer: false,
  },
  {
    id: 'mercantil',
    label: 'Mercantil',
    description: 'Sociedades, concursos, contratos mercantiles y compliance',
    agentName: 'Dra. Isabel Torres',
    legislation: ['LSC', 'Código de Comercio', 'Ley Concursal'],
    strictDisclaimer: false,
  },
  {
    id: 'extranjeria',
    label: 'Extranjería',
    description: 'Residencia, nacionalidad, visados y recursos administrativos',
    agentName: 'Dr. Roberto Gil',
    legislation: ['LOEx', 'Reglamento de Extranjería'],
    strictDisclaimer: false,
  },
] as const;

export function getLegalAreaById(id: LegalAreaId): LegalAreaDefinition | undefined {
  return LEGAL_AREAS.find((area) => area.id === id);
}