// components/AdvantagesForm.tsx
import React, { useState } from "react";
import { IconSelector } from "../common/IconSelector";
import { ProjectData } from "../../data/project";

interface AdvantagesFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
}

const AdvantagesForm = ({ project, setProject }: AdvantagesFormProps) => {
  const [newAdvantage, setNewAdvantage] = useState<Partial<Advantage>>({});

  const handleAddAdvantage = () => {
    // Verifica que todos los campos necesarios estén llenos antes de agregar
    if (
      newAdvantage.title &&
      newAdvantage.description &&
      newAdvantage.icon &&
      newAdvantage.stat
    ) {
      setProject({
        ...project,
        advantages: [...project.advantages, newAdvantage as Advantage],
        showAdvantages: true,
      });
      setNewAdvantage({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-gray-300 border-b pb-3">
        <h2 className="text-2xl font-bold">Configurar Ventajas</h2>
        <p className="text-gray-600 text-sm">
          Agrega o edita las ventajas competitivas de tu proyecto.
        </p>
      </div>

      {/* Título y subtítulo de la sección */}
      <div>
        <label className="block text-sm font-medium mb-1">Título de la sección</label>
        <input
          value={project.advantagesTitle}
          onChange={(e) => setProject({ ...project, advantagesTitle: e.target.value })}
          className="w-full p-2 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. Nuestras Ventajas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subtítulo</label>
        <textarea
          value={project.advantagesSubtitle}
          onChange={(e) => setProject({ ...project, advantagesSubtitle: e.target.value })}
          className="w-full p-2 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. Descubre lo que hace especial a nuestro proyecto"
        />
      </div>

      {/* Lista de ventajas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Ventajas Existentes</h3>
        <p className="text-gray-500 text-sm">
          Edita la información de cada ventaja según sea necesario.
        </p>

        {project.advantages.map((advantage, index) => (
          <div
            key={index}
            className="border-gray-300 border p-4 rounded-lg bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                value={advantage.title}
                onChange={(e) => {
                  const newAdvantages = [...project.advantages];
                  newAdvantages[index].title = e.target.value;
                  setProject({ ...project, advantages: newAdvantages });
                }}
                className="w-full p-2 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Rapidez"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={advantage.description}
                onChange={(e) => {
                  const newAdvantages = [...project.advantages];
                  newAdvantages[index].description = e.target.value;
                  setProject({ ...project, advantages: newAdvantages });
                }}
                className="w-full p-2 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Ofrecemos el servicio más rápido del mercado"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Icono</label>
              <IconSelector
                selected={advantage.icon}
                onSelect={(icon) => {
                  const newAdvantages = [...project.advantages];
                  newAdvantages[index].icon = icon;
                  setProject({ ...project, advantages: newAdvantages });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estadística</label>
              <input
                value={advantage.stat}
                onChange={(e) => {
                  const newAdvantages = [...project.advantages];
                  newAdvantages[index].stat = e.target.value;
                  setProject({ ...project, advantages: newAdvantages });
                }}
                className="w-full p-2 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. 100+ clientes satisfechos"
              />
            </div>
          </div>
        ))}

        {/* Formulario para nueva ventaja */}
        <div className="border-gray-300 border p-4 rounded-lg bg-white shadow-inner mt-6">
          <h4 className="font-medium mb-4 text-lg">Agregar Nueva Ventaja</h4>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            value={newAdvantage.title || ""}
            onChange={(e) => setNewAdvantage({ ...newAdvantage, title: e.target.value })}
            className="w-full p-2 mb-2 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Alta seguridad"
          />
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={newAdvantage.description || ""}
            onChange={(e) => setNewAdvantage({ ...newAdvantage, description: e.target.value })}
            className="w-full p-2 mb-2 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Protegemos tus datos con encriptación de nivel bancario"
          />
          <label className="block text-sm font-medium mb-1">Icono</label>
          <IconSelector
            selected={newAdvantage.icon}
            onSelect={(icon) => setNewAdvantage({ ...newAdvantage, icon })}
          />
          <label className="block text-sm font-medium mb-1 mt-2">Estadística</label>
          <input
            value={newAdvantage.stat || ""}
            onChange={(e) => setNewAdvantage({ ...newAdvantage, stat: e.target.value })}
            className="w-full p-2 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 99.9% de efectividad"
          />
          <button
            onClick={handleAddAdvantage}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Agregar Ventaja
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvantagesForm;

