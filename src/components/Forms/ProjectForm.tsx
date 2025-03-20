import React, { useState, useEffect} from "react";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import AdvantagesForm from "./AdvantagesForm";
import FeaturesForm from "./FeaturesForm";
import WorkflowForm from "./WorkFlowForm";
import TeamForm from "./TeamForm";
import { ProjectData } from "../../data/project";
import { useAuth } from "../../context/AuthContext";

interface ProjectFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
  onFinish: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, setProject, onFinish }) => {

  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState<number>(-1); // Inicia en -1 para mostrar la pantalla de selección
  const [selectedSections, setSelectedSections] = useState<{ [key: string]: boolean }>({
    advantages: project.showAdvantages,
    features: project.showFeatures,
    workflow: project.showWorkflow,
    team: project.showTeam,
    contact: project.showContact, // Sincronizado con project.showContact
  });

  useEffect(() => {
    setSelectedSections((prev) => ({
      ...prev,
      contact: project.showContact,
    }));
  }, [project.showContact]);

  // Función para alternar secciones
  const handleSectionToggle = (key: string) => {
    const newValue = !selectedSections[key];
    setSelectedSections((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  
    // Actualizar el estado del proyecto
    if (key === "contact") {
      setProject({
        ...project,
        showContact: newValue,
      });
    } else {
      setProject({
        ...project,
        [`show${key.charAt(0).toUpperCase() + key.slice(1)}`]: newValue,
      });
    }
  };
  const sections = [
    {
      name: "Ventajas",
      key: "advantages",
      component: <AdvantagesForm project={project} setProject={setProject} />,
      validation: (p: ProjectData) =>
        !!p.advantagesTitle && p.advantages.length > 0,
    },
    {
      name: "Características",
      key: "features",
      component: <FeaturesForm project={project} setProject={setProject} />,
      validation: (p: ProjectData) =>
        !!p.featuresTitle && p.features.length > 0,
    },
    {
      name: "Flujo de trabajo",
      key: "workflow",
      component: <WorkflowForm project={project} setProject={setProject} />,
      validation: (p: ProjectData) =>
        !!p.workflowTitle && p.workflow.length > 0,
    },
    {
      name: "Equipo",
      key: "team",
      component: <TeamForm project={project} setProject={setProject} />,
      validation: (p: ProjectData) => p.team.length > 0,
    },
    {
      name: "Contacto",
      key: "contact",
      component: null, // No hay formulario para contacto
      validation: () => true, // Siempre válido
    },
  ];

  // Filtrar secciones seleccionadas
  const filteredSections = sections.filter(
    (section) => selectedSections[section.key] && section.component
  );

  const progress =
    filteredSections.length > 0
      ? ((currentSection + 1) / filteredSections.length) * 100
      : 0;

  const goNext = () => {
    const currentValidation = filteredSections[currentSection]?.validation;
    if (!currentValidation || currentValidation(project)) {
      if (currentSection < filteredSections.length - 1) {
        setCurrentSection((prev) => prev + 1);
      }
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };


  const handleStartForm = () => {
    // Actualizar el estado del proyecto para ocultar/mostrar las secciones seleccionadas
    setProject({
      ...project,
      showAdvantages: selectedSections.advantages,
      showFeatures: selectedSections.features,
      showWorkflow: selectedSections.workflow,
      showTeam: selectedSections.team,
    });
    setCurrentSection(0); // Comenzar con la primera sección seleccionada
  };

  // Si no hay secciones seleccionadas o currentSection es -1, mostrar la pantalla inicial
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
            disabled={filteredSections.length === 0} // Deshabilitar si no hay secciones seleccionadas
            className="flex items-center px-4 py-2 bg-primario text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
          >
            Siguiente
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

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
