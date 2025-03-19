// project.ts

/**
 * Cada entidad del proyecto está adaptada a los nuevos requerimientos:
 *  - Feature con icon, stat, title, description (en vez de image)
 *  - technicalIcons para soportar los íconos técnicos
 *  - featuresTitle, featuresSubtitle, featuresVideoUrl para el título, subtítulo y video de la sección de Features
 */

export interface Advantage {
  title: string;
  description: string;
  icon: string; // URL o nombre de ícono
}

/**
 * Nueva versión de Feature para ajustarse a:
 *  - icon: string  (o lo que uses para FontAwesome u otro selector)
 *  - stat: string  (porcentaje, cifras, etc.)
 *  - title: string
 *  - description: string
 */
export interface Feature {
  icon: string;
  stat: string;
  title: string;
  description: string;
}

/**
 * Si deseas manejar íconos técnicos en la misma sección:
 */
export interface TechnicalIcon {
  icon: string; // URL o nombre de ícono
  text: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string; // URL del avatar
}

export interface ProjectData {
  // Nombre o título general del proyecto
  projectName: string;

  // Ventajas
  advantages: Advantage[];
  showAdvantages: boolean;

  // Características / Features
  features: Feature[];            // Array de objetos con icon, stat, title, description
  technicalIcons: TechnicalIcon[]; // Array de objetos con icon, text
  showFeatures: boolean;          // Para controlar si se ve la sección
  featuresTitle?: string;         // Título opcional de la sección
  featuresSubtitle?: string;      // Subtítulo opcional
  featuresVideoUrl?: string;      // Ruta o URL del video

  // Flujo de trabajo
  workflow: WorkflowStep[];
  showWorkflow: boolean;

  // Equipo
  team: TeamMember[];
  showTeam: boolean;

  // Sección de contacto
  contactEmail: string;
  showContact: boolean;
}

// Datos iniciales vacíos
export const initialProjectData: ProjectData = {
  projectName: "",
  advantages: [],
  showAdvantages: false,

  // Sección de características
  features: [],
  technicalIcons: [],
  showFeatures: false,
  featuresTitle: "",
  featuresSubtitle: "",
  featuresVideoUrl: "",

  // Flujo de trabajo
  workflow: [],
  showWorkflow: false,

  // Equipo
  team: [],
  showTeam: false,

  // Contacto
  contactEmail: "",
  showContact: false,
};
