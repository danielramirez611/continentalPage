// data/project.ts
import { FiSmile, FiStar, FiHeart, FiCode, FiCamera, FiZap, FiCloud, FiSun } from "react-icons/fi";

// Mapa de íconos para referencia
export const iconMap = {
  FiSmile,
  FiStar,
  FiHeart,
  FiCode,
  FiCamera,
  FiZap,
  FiCloud,
  FiSun,
};

export type IconKey = keyof typeof iconMap;

export interface Advantage {
  title: string;
  description: string;
  icon: string; // URL o nombre de ícono
}

/**
 * Nueva versión de Feature para ajustarse a:
 *  - icon: string  (key del ícono, ej: "FiSmile")
 *  - stat: string  (porcentaje, cifras, etc.)
 *  - title: string
 *  - description: string
 *  - media?: string (URL de imagen o video adicional)
 */
export interface Feature {
  icon: string; // Clave del ícono (ej: "FiSmile")
  stat: string;
  title: string;
  description: string;
  media?: string; // Opcional: URL de imagen o video
}

/**
 * Íconos técnicos para la sección de características.
 * Pueden ser íconos (FontAwesome, React Icons) o imágenes.
 */
export interface TechnicalIcon {
  icon: string; // Clave del ícono o URL de imagen
  text: string;
  type: 'icon' | 'image'; // Tipo: ícono o imagen
}

/**
 * Pasos del flujo de trabajo.
 */
export interface WorkflowStep {
  step: number; // Número del paso (ej: 1, 2, 3)
  title: string; // Título del paso (ej: "Diseño Conceptual")
  description: string; // Descripción del paso
  image?: string; // URL de la imagen (opcional)
}

/**
 * Miembros del equipo.
 */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string; // URL del avatar
}

/**
 * Datos completos del proyecto.
 */

export interface Stat {
  icon: any; // Ícono de FontAwesome o React Icons
  text: string; // Texto de la estadística
}
export interface ProjectData {
  // Nombre o título general del proyecto
  projectName: string;

  // Ventajas
  advantages: Advantage[];
  showAdvantages: boolean;

  // Características / Features
  features: Feature[];
  technicalIcons: TechnicalIcon[];
  showFeatures: boolean;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresVideoUrl: string;
  
  // Estadísticas e íconos
  stats: Stat[]; // Nueva propiedad


  // Flujo de trabajo
  workflow: WorkflowStep[]; // Lista de pasos del flujo de trabajo
  showWorkflow: boolean; // Mostrar/ocultar la sección
  workflowTitle: string; // Título de la sección (ej: "Nuestro Proceso Creativo")
  workflowSubtitle: string; // Subtítulo de la sección (ej: "De la idea a la realidad")
  workflowTextLeft?: string;    // Nueva prop opcional
  workflowTextRight?: string;

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

  // Ventajas
  advantages: [],
  showAdvantages: false,

  // Características
  features: [],
  technicalIcons: [],
  showFeatures: false,
  featuresTitle: "",
  featuresSubtitle: "",
  featuresVideoUrl: "",

  // Estadísticas e íconos
  stats: [], // Inicializado como array vacío

  // Flujo de trabajo
  workflow: [],
  showWorkflow: false,
  workflowTitle: "",
  workflowSubtitle: "",

  // Equipo
  team: [],
  showTeam: false,

  // Contacto
  contactEmail: "",
  showContact: false,
};