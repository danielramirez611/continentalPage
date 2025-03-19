// FeaturesForm.tsx
import React, { useState } from "react";
import { ProjectData } from "../../data/project";

/**
 * Este selector de íconos debe permitirte elegir íconos de React Icons,
 * FontAwesome u otro set. Ajusta la implementación interna de IconSelector
 * según tu librería de íconos.
 */
import { IconSelector } from "../common/IconSelector";

/**
 * El formulario maneja:
 *   - Título y Subtítulo de la sección (opcional).
 *   - URL del Video (tomado de un <input type='file' />).
 *   - Lista de Features (cada una con icon, stat, title, description).
 *   - Íconos técnicos (si lo requieres).
 *
 * Todos los cambios se reflejan en `project` via `setProject`.
 * Esto te permitirá ver el contenido al dar clic en “Siguiente” en `ProjectForm`.
 */
interface FeaturesFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
}

const FeaturesForm: React.FC<FeaturesFormProps> = ({ project, setProject }) => {
  // Para crear una nueva característica (Feature)
  const [newFeature, setNewFeature] = useState({
    icon: "",
    stat: "",
    title: "",
    description: "",
  });

  // Para crear un nuevo ícono técnico (si lo usas)
  const [newTechnicalIcon, setNewTechnicalIcon] = useState({
    icon: "",
    text: "",
  });

  /**
   * Maneja el cambio del archivo de video y genera una URL local con URL.createObjectURL.
   * Esto permitirá que, en tu componente final (FeaturesSection), puedas reproducir el video
   * sin necesidad de un hosting externo.
   */
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      setProject({
        ...project,
        featuresVideoUrl: localUrl,
        showFeatures: true,
      });
    }
  };

  // Agregar una nueva característica
  const handleAddFeature = () => {
    const { icon, stat, title, description } = newFeature;
    // Verifica que los campos importantes estén llenos
    if (icon && stat && title && description) {
      const updatedFeatures = [...(project.features || []), { ...newFeature }];
      setProject({
        ...project,
        features: updatedFeatures,
        showFeatures: true, // Asegura que la sección se muestre
      });
      // Limpia el formulario local
      setNewFeature({ icon: "", stat: "", title: "", description: "" });
    }
  };

  // Eliminar característica existente
  const handleDeleteFeature = (index: number) => {
    const updated = [...(project.features || [])];
    updated.splice(index, 1);
    setProject({
      ...project,
      features: updated,
    });
  };

  // Agregar ícono técnico
  const handleAddTechnicalIcon = () => {
    const { icon, text } = newTechnicalIcon;
    if (icon && text) {
      const updatedTechnical = [...(project.technicalIcons || []), { ...newTechnicalIcon }];
      setProject({
        ...project,
        technicalIcons: updatedTechnical,
        showFeatures: true,
      });
      setNewTechnicalIcon({ icon: "", text: "" });
    }
  };

  // Eliminar ícono técnico
  const handleDeleteTechnicalIcon = (index: number) => {
    const updated = [...(project.technicalIcons || [])];
    updated.splice(index, 1);
    setProject({
      ...project,
      technicalIcons: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3">
        <h2 className="text-2xl font-bold">Configurar Sección de Características</h2>
        <p className="text-gray-600 text-sm">
          Edita y agrega stats, íconos e incluso sube un video de fondo.
        </p>
      </div>

      {/* Campos de Título y Subtítulo (opcional) */}
      <div>
        <label className="block text-sm font-medium mb-1">Título de la Sección</label>
        <input
          value={project.featuresTitle || ""}
          onChange={(e) => setProject({ ...project, featuresTitle: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. Ingeniería de Alto Rendimiento"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtítulo</label>
        <textarea
          value={project.featuresSubtitle || ""}
          onChange={(e) => setProject({ ...project, featuresSubtitle: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. Diseño innovador que supera los sistemas convencionales."
        />
      </div>

      {/* Carga de Video */}
      <div>
        <label className="block text-sm font-medium mb-1">Subir Video (Opcional)</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {project.featuresVideoUrl && (
          <p className="text-sm text-gray-500 mt-1">
            Video actual: <code>{project.featuresVideoUrl}</code>
          </p>
        )}
      </div>

      {/* Lista de Características */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Características Existentes</h3>
        {project.features?.map((feat, i) => (
          <div key={i} className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Ícono (React Icons)</label>
              <IconSelector
                selected={feat.icon}
                onSelect={(selectedIcon) => {
                  const updated = [...project.features];
                  updated[i].icon = selectedIcon;
                  setProject({ ...project, features: updated });
                }}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Stat / Porcentaje</label>
              <input
                value={feat.stat}
                onChange={(e) => {
                  const updated = [...project.features];
                  updated[i].stat = e.target.value;
                  setProject({ ...project, features: updated });
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. 85%"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                value={feat.title}
                onChange={(e) => {
                  const updated = [...project.features];
                  updated[i].title = e.target.value;
                  setProject({ ...project, features: updated });
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Eficiencia Maximizada"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={feat.description}
                onChange={(e) => {
                  const updated = [...project.features];
                  updated[i].description = e.target.value;
                  setProject({ ...project, features: updated });
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Flujo de trabajo optimizado con automatización inteligente."
                rows={3}
              />
            </div>

            <button
              onClick={() => handleDeleteFeature(i)}
              className="mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        ))}

        {/* Agregar nueva característica */}
        <div className="border p-4 rounded-lg bg-gray-100 shadow-inner mt-6">
          <h4 className="font-medium mb-4 text-lg">Agregar Nueva Característica</h4>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Ícono (React Icons)</label>
            <IconSelector
              selected={newFeature.icon}
              onSelect={(icon) => setNewFeature({ ...newFeature, icon })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Stat / Porcentaje</label>
            <input
              value={newFeature.stat}
              onChange={(e) => setNewFeature({ ...newFeature, stat: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 60%"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Operación Continua"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Sistema autónomo con mantenimiento predictivo."
              rows={3}
            />
          </div>

          <button
            onClick={handleAddFeature}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Agregar Característica
          </button>
        </div>
      </div>

      {/* Íconos Técnicos (Opcional) */}
      <div className="space-y-4 mt-8">
        <h3 className="font-semibold text-lg">Íconos Técnicos</h3>
        {project.technicalIcons?.map((tech, i) => (
          <div
            key={i}
            className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Ícono</label>
              <IconSelector
                selected={tech.icon}
                onSelect={(icon) => {
                  const updated = [...project.technicalIcons];
                  updated[i].icon = icon;
                  setProject({ ...project, technicalIcons: updated });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Texto</label>
              <input
                value={tech.text}
                onChange={(e) => {
                  const updated = [...project.technicalIcons];
                  updated[i].text = e.target.value;
                  setProject({ ...project, technicalIcons: updated });
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Alto Rendimiento"
              />
            </div>
            <button
              onClick={() => handleDeleteTechnicalIcon(i)}
              className="mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        ))}

        {/* Agregar un Ícono Técnico */}
        <div className="border p-4 rounded-lg bg-gray-100 shadow-inner mt-6">
          <h4 className="font-medium mb-4 text-lg">Agregar Ícono Técnico</h4>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Ícono</label>
            <IconSelector
              selected={newTechnicalIcon.icon}
              onSelect={(icon) => setNewTechnicalIcon({ ...newTechnicalIcon, icon })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Texto</label>
            <input
              value={newTechnicalIcon.text}
              onChange={(e) => setNewTechnicalIcon({ ...newTechnicalIcon, text: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Operación Autónoma"
            />
          </div>
          <button
            onClick={handleAddTechnicalIcon}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Agregar Ícono
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesForm;
