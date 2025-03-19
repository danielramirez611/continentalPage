// components/ProjectForm.tsx
import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import AdvantagesForm from "./AdvantagesForm";
import { ProjectData } from "../../data/project";

interface ProjectFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
  onFinish: () => void;
}

const ProjectForm = ({ project, setProject, onFinish }: ProjectFormProps) => {
  const [currentSection, setCurrentSection] = useState<number>(0);

  const sections = [
    {
      name: "Ventajas",
      component: <AdvantagesForm project={project} setProject={setProject} />,
    },
    {
      name: "Características",
      component: <div className="text-gray-500">Características (próximamente)</div>,
    },
    {
      name: "Flujo de trabajo",
      component: <div className="text-gray-500">Flujo de trabajo (próximamente)</div>,
    },
    {
      name: "Equipo",
      component: <div className="text-gray-500">Equipo (próximamente)</div>,
    },
    {
      name: "Contacto",
      component: <div className="text-gray-500">Contacto (próximamente)</div>,
    },
  ];

  const progress = ((currentSection + 1) / sections.length) * 100;

  const goNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto   p-6 my-8 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Configuración del Proyecto</h2>
        <p className="text-gray-600 text-sm">
          Explora las distintas secciones para personalizar tu proyecto.
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Progreso: {currentSection + 1}/{sections.length}
        </p>
      </div>

      {/* Contenido de la sección actual */}
      <div className="mb-6 p-4 rounded-lg ">
        <h3 className="text-xl font-bold mb-4">{sections[currentSection].name}</h3>
        {sections[currentSection].component}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8">
        {/* Botón Anterior */}
        <button
          onClick={goPrev}
          disabled={currentSection === 0}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-300"
        >
          <FiChevronLeft className="mr-2" /> Anterior
        </button>

        {/* Botón Siguiente o Finalizar */}
        {currentSection === sections.length - 1 ? (
          <button
            onClick={onFinish}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <FiCheck className="mr-2" /> Finalizar
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Siguiente <FiChevronRight className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
