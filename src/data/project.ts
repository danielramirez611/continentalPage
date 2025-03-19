// project.ts

export interface Advantage {
    title: string;
    description: string;
    icon: string; // Puede ser una URL o un nombre de ícono
  }
  
  export interface Feature {
    title: string;
    description: string;
    image: string; // URL de la imagen
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
    projectName: string;
    advantages: Advantage[];
    features: Feature[];
    workflow: WorkflowStep[];
    team: TeamMember[];
    contactEmail: string;
    showAdvantages: boolean;
    showFeatures: boolean;
    showWorkflow: boolean;
    showTeam: boolean;
    showContact: boolean;
  }
  
  // Datos iniciales vacíos
  export const initialProjectData: ProjectData = {
    projectName: "",
    advantages: [],
    features: [],
    workflow: [],
    team: [],
    contactEmail: "",
    showAdvantages: false,
    showFeatures: false,
    showWorkflow: false,
    showTeam: false,
    showContact: false,
  };