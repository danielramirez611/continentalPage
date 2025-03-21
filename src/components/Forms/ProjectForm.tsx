import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import AdvantagesForm from "./AdvantagesForm";
import FeaturesForm from "./FeaturesForm";
import WorkflowForm from "./WorkFlowForm";
import TeamForm from "./TeamForm";
import { useAuth } from "../../context/AuthContext";
import { 
  getProjectConfig, 
  createProjectConfig, 
  updateProjectConfig 
} from "../../../api"; // Asegúrate de la ruta correcta

// Tu interfaz ProjectData podría lucir así (ajusta según tu proyecto)
interface ProjectData {
  id: number;
  project_name?: string;
  showAdvantages?: boolean;
  showFeatures?: boolean;
  showWorkflow?: boolean;
  showTeam?: boolean;
  showContact?: boolean;
  // ... y más campos si necesitas
}

interface ProjectFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
  onFinish: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, setProject, onFinish }) => {
  const { user } = useAuth();
  const token = user?.token || "";

  // Sección actual; -1 para mostrar pantalla de selección de checkboxes
  const [currentSection, setCurrentSection] = useState<number>(-1);

  // Estado local para los checkboxes: 
  // "advantages", "features", "workflow", "team", "contact"
  const [selectedSections, setSelectedSections] = useState<{
    [key: string]: boolean;
  }>({
    advantages: false,
    features: false,
    workflow: false,
    team: false,
    contact: false,
  });

  // =============================
  // 1. Cargar la config al montar
  // =============================
  useEffect(() => {
    if (!project.id) return; // Aún no existe proyecto => no cargar
    
    // Intentar obtener la config
    getProjectConfig(project.id, token)
      .then((config) => {
        // config: { config_id, project_id, showAdvantages, showFeatures, etc. }

        setSelectedSections({
          advantages: !!config.showAdvantages,
          features: !!config.showFeatures,
          workflow: !!config.showWorkflow,
          team: !!config.showTeam,
          contact: !!config.showContact,
        });

        // También actualizamos el estado global del proyecto, 
        // para que "project.showAdvantages" sea true/false
        setProject({
          ...project,
          showAdvantages: !!config.showAdvantages,
          showFeatures: !!config.showFeatures,
          showWorkflow: !!config.showWorkflow,
          showTeam: !!config.showTeam,
          showContact: !!config.showContact,
        });
      })
      .catch(async (err) => {
        if (err.response?.status === 404) {
          // => No existe configuración => la creas
          await createProjectConfig(project.id, {
            showAdvantages: 0,
            showFeatures: 0,
            showWorkflow: 0,
            showTeam: 0,
            showContact: 0
          }, token);
                  }
        else if (
          err.response?.status === 400 && 
          err.response?.data?.message === "Ya existe una configuración para este proyecto."
        ) {
          // => Significa que SÍ existe config
          //  -> Realmente NO necesitas crearla.
          //  -> Tal vez mejor hacer getProjectConfig otra vez o simplemente ignorar.
          console.log("La configuración ya existe. No es necesario crearla.");
        }
        else {
          console.error("Error al obtener configuración:", err);
        }
      });
      

  }, [project.id]); // Solo cuando el project.id cambie

  // ===============================
  // 2. Manejo de checkboxes locales
  // ===============================
  const handleSectionToggle = async (key: string) => {
    const newValue = !selectedSections[key];

    // 2.1 Actualizar estado local de checkboxes
    setSelectedSections((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    // 2.2 Actualizar el "project" en tu estado global (para que coincida)
    setProject({
      ...project,
      [`show${key.charAt(0).toUpperCase() + key.slice(1)}`]: newValue,
    });

    // 2.3 Llamar a la API para actualizar en la BD
    // (Pasamos 1 si "true", 0 si "false")
    let fieldName = "";
    switch (key) {
      case "advantages":
        fieldName = "showAdvantages";
        break;
      case "features":
        fieldName = "showFeatures";
        break;
      case "workflow":
        fieldName = "showWorkflow";
        break;
      case "team":
        fieldName = "showTeam";
        break;
      case "contact":
        fieldName = "showContact";
        break;
    }
    const payload = { [fieldName]: newValue ? 1 : 0 };

    try {
      await updateProjectConfig(project.id, payload, token);
    } catch (err) {
      console.error("❌ Error al actualizar configuración:", err);
    }
  };

  // =============================================
  // 3. Lógica de filtrar secciones + avanzar/retro
  // =============================================
  const sections = [
    {
      name: "Ventajas",
      key: "advantages",
      component: <AdvantagesForm projectId={project.id || 0} token={token} />,
      validation: () => true,
    },
    {
      name: "Características",
      key: "features",
      component: <FeaturesForm project={project} setProject={setProject} />,
      validation: () => true,
    },
    {
      name: "Flujo de trabajo",
      key: "workflow",
      component: <WorkflowForm project={project} setProject={setProject} />,
      validation: () => true,
    },
    {
      name: "Equipo",
      key: "team",
      component: <TeamForm project={project} setProject={setProject} />,
      validation: () => true,
    },
    {
      name: "Contacto",
      key: "contact",
      component: null, // o un form si necesitas
      validation: () => true,
    },
  ];

  // Filtrar secciones que estén marcadas en "true"
  const filteredSections = sections.filter(
    (section) => selectedSections[section.key] && section.component
  );

  // Barra de progreso
  const progress = filteredSections.length > 0
    ? ((currentSection + 1) / filteredSections.length) * 100
    : 0;

  // Navegación
  const goNext = () => {
    if (currentSection < filteredSections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };
  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  // Iniciar el formulario
  const handleStartForm = () => {
    setCurrentSection(0);
  };

  // Si no hay secciones seleccionadas o currentSection == -1, pantalla inicial
  if (currentSection === -1 || filteredSections.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl p-6 my-8 rounded-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">
            Configuración del Proyecto
          </h2>
          <p className="text-gray-600 text-sm">
            Selecciona las secciones que deseas incluir en tu proyecto.
          </p>
        </div>

        {/* Lista de secciones con checkboxes */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.key} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSections[section.key]}
                onChange={() => handleSectionToggle(section.key)}
                className="mr-2"
              />
              <label className="text-lg">{section.name}</label>
            </div>
          ))}
        </div>

        {/* Botón para continuar */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleStartForm}
            disabled={filteredSections.length === 0}
            className="flex items-center px-4 py-2 bg-primario text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
          >
            Siguiente
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Vista de cada sección seleccionada
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl p-6 my-8 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">
          Configuración del Proyecto
        </h2>
        <p className="text-gray-600 text-sm">
          Explora las distintas secciones para personalizar tu proyecto.
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primario rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Progreso: {currentSection + 1}/{filteredSections.length}
        </p>
      </div>

      {/* Contenido de la sección actual */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="text-xl font-bold mb-4">
          {filteredSections[currentSection].name}
        </h3>
        {filteredSections[currentSection].component}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={goPrev}
          disabled={currentSection === 0}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          <FiChevronLeft className="mr-2" />
          Anterior
        </button>

        {currentSection === filteredSections.length - 1 ? (
          <button
            onClick={onFinish}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <FiCheck className="mr-2" />
            Finalizar
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center px-4 py-2 bg-primario text-white rounded-lg hover:bg-purple-600 transition"
          >
            Siguiente
            <FiChevronRight className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
