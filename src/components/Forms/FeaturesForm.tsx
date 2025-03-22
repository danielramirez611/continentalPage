import React, { useState, useEffect } from "react";
import { IconSelector } from "../common/IconSelector";
import {
  uploadFeatureMedia, createFeature, getFeatures, deleteFeature,
  getStats, addStat, deleteStat, getProjectExtras, addProjectExtra, deleteProjectExtra, updateFeature, updateStat, updateProjectExtra
} from "../../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash, faPlus, faEdit, faTrophy,
  faStar,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

interface Feature {
  id?: number;
  icon_key: string;
  title: string;
  subtitle: string;
  media_type: "video";
  media_url?: string;
}

interface Stat {
  id?: number;
  icon_key: string;
  title: string;
  description: string;
  text: string;
}

interface Extra {
  id?: number;
  title: string;
  stat?: string;
  description?: string;
}

interface FeaturesFormProps {
  projectId?: number;
}
const iconMap: Record<string, any> = {
  FiZap: faStar, // 🔹 Mapea correctamente FiZap a faStar
  Chart: faChartBar,
  Trophy: faTrophy,
};
const FeaturesForm = ({ projectId }: FeaturesFormProps) => {
  const params = useParams<{ id?: string }>();
  const paramProjectId = params.id ? Number(params.id) : undefined;
  const finalProjectId = projectId ?? paramProjectId;

  if (!finalProjectId || isNaN(finalProjectId)) {
    console.error("❌ Error: projectId no fue recibido o no es válido.", { finalProjectId });
    return (
      <div className="text-red-500 font-bold p-4 border border-red-600 rounded-lg bg-red-100">
        ❌ Error: No se pudo cargar la configuración del proyecto. Verifica la URL o selecciona un proyecto válido.
      </div>
    );
  }


  const [features, setFeatures] = useState<Feature[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [newFeature, setNewFeature] = useState<Partial<Feature>>({});
  const [newStat, setNewStat] = useState<Partial<Stat>>({});
  const [newExtra, setNewExtra] = useState<Partial<Extra>>({});
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [activeTab, setActiveTab] = useState("features");
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null);
  const isEditingFeature = !!editingFeature;
  const isEditingStat = !!editingStat;
  const isEditingExtra = !!editingExtra;


  useEffect(() => {
    fetchFeatures();
    fetchStats();
    fetchExtras();
  }, [finalProjectId]);

  const fetchFeatures = async () => {
    try {
      const data = await getFeatures(finalProjectId);
      setFeatures(data);
    } catch (error) {
      console.error("❌ Error al obtener features:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getStats(finalProjectId);
      setStats(data);
    } catch (error) {
      console.error("❌ Error al obtener stats:", error);
    }
  };

  const fetchExtras = async () => {
    try {
      const data = await getProjectExtras(finalProjectId);
      setExtras(data);
    } catch (error) {
      console.error("❌ Error al obtener extras:", error);
    }
  };

  const handleAddExtra = async () => {
    if (!newExtra.title) {
      alert("El título del extra es obligatorio.");
      return;
    }
    if (!selectedFeatureId) {
      console.error("❌ Error: No se ha seleccionado una característica para el extra.");
      return;
    }

    try {
      await addProjectExtra(finalProjectId, newExtra, "");
      fetchExtras();
      setShowExtraModal(false);
      setNewExtra({});
    } catch (error) {
      console.error("❌ Error al agregar extra:", error);
    }
  };


  interface Extra {
    id?: number;
    title: string;
    stat?: string;
    description?: string;
  }
  const handleAddFeature = async () => {
    console.log("📌 Datos actuales de newFeature:", newFeature);

    // 🔹 Verificar que los campos obligatorios existan
    if (!newFeature.title || !newFeature.media_type) {
      console.warn("❌ Falta completar algunos campos:", newFeature);
      alert("El título y el tipo de media son obligatorios.");
      return;
    }

    try {
      let mediaUrl = null;
      if (newFeature.media_type && newFeature.media_file) {
        console.log("🔄 Subiendo archivo...", newFeature.media_file);
        mediaUrl = await uploadFeatureMedia(newFeature.media_file, newFeature.media_type, "");
        console.log("✅ Archivo subido con URL:", mediaUrl);
      }

      if (!mediaUrl) {
        console.error("❌ No se pudo obtener la URL del archivo subido.");
        alert("Hubo un problema al subir el archivo.");
        return;
      }

      const featureData = {
        project_id: finalProjectId,
        title: newFeature.title,
        subtitle: newFeature.subtitle ?? "", // 🔹 Si está `undefined`, lo convierte en ""
        icon_key: newFeature.icon_key ?? "", // 🔹 Si está `undefined`, lo convierte en ""
        media_type: newFeature.media_type,
        media_url: mediaUrl,
      };

      console.log("📤 Enviando datos al backend:", featureData);

      if (!finalProjectId || isNaN(finalProjectId)) {
        console.error("❌ Error: `finalProjectId` es inválido antes de enviar la solicitud.", { finalProjectId });
        alert("Error: No se pudo obtener el ID del proyecto.");
        return;
      }

      await createFeature(finalProjectId, featureData, newFeature.media_file, "");
      fetchFeatures();
      setShowFeatureModal(false);
      setNewFeature({}); // 🔹 Limpiar el formulario después de enviar
      console.log("✅ Característica agregada correctamente.");
    } catch (error) {
      console.error("❌ Error al agregar feature:", error);
    }
  };


  const handleAddStat = async () => {
    if (!newStat.icon_key || !newStat.title || !newStat.description || !newStat.text) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!finalProjectId || isNaN(finalProjectId)) {
      console.error("❌ Error: `finalProjectId` es inválido antes de enviar la solicitud.", { finalProjectId });
      alert("Error: No se pudo obtener el ID del proyecto.");
      return;
    }

    await addStat(finalProjectId, newStat, "");
    fetchStats();
    setShowStatModal(false);
    setNewStat({});
  };
  const handleDeleteStat = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta estadística?")) {
      await deleteStat(id);
      fetchStats();
    }
  };
  // 🔹 Función para eliminar una característica
  const handleDeleteFeature = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta característica?")) {
      await deleteFeature(id);
      fetchFeatures();
    }
  };
  const handleEditStat = async (updatedStat: Stat) => {
    if (!updatedStat.id) return;

    try {
      await updateStat(updatedStat.id, updatedStat); // 🔹 Usa la API para actualizar
      fetchStats(); // 🔄 Recarga las estadísticas
      setShowStatModal(false);
      setNewStat({});
      console.log("✅ Estadística editada con éxito.");
    } catch (error) {
      console.error("❌ Error al editar stat:", error);
      alert("Ocurrió un error al editar la estadística.");
    }
  };

  // Para rellenar los campos al editar una característica
  useEffect(() => {
    if (editingFeature) {
      setNewFeature(editingFeature);
    }
  }, [editingFeature, showFeatureModal]);

  // Para rellenar los campos al editar una estadística
  useEffect(() => {
    if (editingStat) {
      setNewStat(editingStat);
    }
  }, [editingStat, showStatModal]);

  // Para rellenar los campos al editar un extra
  useEffect(() => {
    if (editingExtra) {
      setNewExtra(editingExtra);
    }
  }, [editingExtra, showExtraModal]);

  // 🔹 Función para editar una característica
  const handleEditFeature = async (updatedFeature: Feature) => {
    if (!updatedFeature.id) return;

    try {
      await updateFeature(updatedFeature.id, updatedFeature); // 🔹 Usa la API para actualizar
      fetchFeatures(); // 🔄 Recarga las características
      setShowFeatureModal(false);
      setNewFeature({});
      console.log("✅ Característica editada con éxito.");
    } catch (error) {
      console.error("❌ Error al editar feature:", error);
      alert("Ocurrió un error al editar la característica.");
    }
  };
  const handleEditExtra = async (updatedExtra: Extra) => {
    if (!updatedExtra.id) return;

    try {
      await updateProjectExtra(updatedExtra.id, updatedExtra); // 🔹 Usa la API para actualizar
      fetchExtras(); // 🔄 Recarga los extras
      setShowExtraModal(false);
      setNewExtra({});
      console.log("✅ Extra editado con éxito.");
    } catch (error) {
      console.error("❌ Error al editar extra:", error);
      alert("Ocurrió un error al editar el extra.");
    }
  };

  const handleDeleteExtra = async (extraId: number) => {
    if (!extraId) return;

    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este extra?");
    if (!confirm) return;

    try {
      await deleteProjectExtra(extraId);
      fetchExtras(); // 🔄 Recarga los extras después de eliminar
      console.log("✅ Extra eliminado con éxito.");
    } catch (error) {
      console.error("❌ Error al eliminar extra:", error);
      alert("Ocurrió un error al eliminar el extra.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Pestañas */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2 ${activeTab === "features" ? "border-b-2 border-purple-500 text-purple-500" : "text-gray-500"}`}
        >
          Características
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 ${activeTab === "stats" ? "border-b-2 border-purple-500 text-purple-500" : "text-gray-500"}`}
        >
          Estadísticas
        </button>
      </div>
      {/* Estadísticas */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <button onClick={() => setShowStatModal(true)} className="w-full p-4 bg-purple-500 text-white rounded">
            <FontAwesomeIcon icon={faPlus} /> Agregar Estadística
          </button>

          {stats.length === 0 ? (
            <p className="text-gray-500">No hay estadísticas registradas.</p>
          ) : (
            stats.map((stat) => (
              <div key={stat.id} className="flex items-center space-x-4 p-3 border-b last:border-b-0">
                {/* 🔹 Icono correctamente renderizado */}
                <FontAwesomeIcon icon={iconMap[stat.icon_key] || faChartBar} className="text-3xl text-primary" />

                {/* 🔹 Contenido textual alineado */}
                <div>
                  <h5 className="font-semibold text-gray-900">{stat.title}</h5>
                  <p className="text-gray-700">{stat.text}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => {
                    setEditingStat(stat);
                    setNewStat(stat);
                    setShowStatModal(true);
                  }} className="...">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button onClick={() => handleDeleteStat(stat.id!)} className="px-3 py-1 bg-red-500 text-white rounded">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Características */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <button onClick={() => setShowFeatureModal(true)} className="w-full p-4 bg-purple-500 text-white rounded">
            <FontAwesomeIcon icon={faPlus} /> Agregar Característica
          </button>

          {features.map((feature) => (
            <div key={feature.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{feature.title}</h3>
                <p>{feature.subtitle}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedFeatureId(feature.id || null);
                    setShowExtraModal(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  + Agregar Extra
                </button>
                <button onClick={() => {
                  setEditingFeature(feature);
                  setNewFeature(feature);
                  setShowFeatureModal(true);
                }} className="...">
                  <FontAwesomeIcon icon={faEdit} />
                </button>

                <button onClick={() => handleDeleteFeature(feature.id!)} className="px-3 py-1 bg-red-500 text-white rounded">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
          {/* 🔽 Extras vinculados al proyecto */}
          <div className="p-6 bg-gray-100 border rounded-xl">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Extras</h4>
            {extras.length === 0 ? (
              <p className="text-gray-500">No hay extras registrados.</p>
            ) : (
              extras.map((extra) => (
                <div key={extra.id} className="p-3 border rounded-lg flex justify-between items-center mb-2 bg-white">
                  <div>
                    <h5 className="font-semibold text-gray-900">{extra.title}</h5>
                    {extra.description && <p className="text-gray-700">{extra.description}</p>}
                    {extra.stat && <span className="text-purple-500">{extra.stat}</span>}
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => {
                      setEditingExtra(extra);
                      setNewExtra(extra);
                      setShowExtraModal(true);
                    }} className="...">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button
                      onClick={() => handleDeleteExtra(extra.id!)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Modal para agregar Característica */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold mb-4">Agregar Seccion</h3>
            <input
              placeholder="Título"
              className="w-full p-2 border rounded"
              value={newFeature.title || ""} // ✅ Se muestra el valor actual
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
            />

            <input
              placeholder="Subtítulo"
              className="w-full p-2 border rounded"
              value={newFeature.subtitle || ""} // ✅ Se muestra el valor actual
              onChange={(e) => setNewFeature({ ...newFeature, subtitle: e.target.value })}
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const isVideo = file.type.startsWith("video/");
                  setNewFeature({
                    ...newFeature,
                    media_file: file,
                    media_type: isVideo ? "video" : "image",
                  });
                }
              }}
            />

            {/* ✅ Mostrar una previsualización de imagen o nombre del archivo existente */}
            {newFeature.media_url && newFeature.media_type === "image" && (
              <img
                src={newFeature.media_url}
                alt="Vista previa"
                className="mt-2 w-full h-auto rounded"
              />
            )}

            {newFeature.media_url && newFeature.media_type === "video" && (
              <video
                src={newFeature.media_url}
                controls
                className="mt-2 w-full h-auto rounded"
              />
            )}

            <h3 className="text-xl font-bold mb-4">Agregar Nueva Característica</h3>

            <IconSelector
              selected={newFeature.icon_key}
              onSelect={(icon) => setNewFeature({ ...newFeature, icon_key: icon })}
            />
            <button
              onClick={isEditingFeature ? () => handleEditFeature(newFeature as Feature) : handleAddFeature}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {isEditingFeature ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </div>
      )}
      {/* Modal para agregar Extra */}
      {showExtraModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {editingExtra ? "Editar Extra" : "Agregar Nuevo Extra"}
      </h3>

      <input
        placeholder="Título"
        className="w-full p-2 border rounded"
        value={newExtra.title || ""}
        onChange={(e) => setNewExtra({ ...newExtra, title: e.target.value })}
      />
      <textarea
        placeholder="Descripción"
        className="w-full p-2 border rounded"
        value={newExtra.description || ""}
        onChange={(e) => setNewExtra({ ...newExtra, description: e.target.value })}
      />
      <input
        placeholder="Stat (opcional)"
        className="w-full p-2 border rounded"
        value={newExtra.stat || ""}
        onChange={(e) => setNewExtra({ ...newExtra, stat: e.target.value })}
      />

      <button
        onClick={() =>
          editingExtra
            ? handleEditExtra(newExtra as Extra)
            : handleAddExtra()
        }
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        {editingExtra ? "Guardar Cambios" : "Agregar"}
      </button>
    </div>
  </div>
)}

      {/* Modal para agregar Estadística */}
      {showStatModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {editingStat ? "Editar Estadística" : "Agregar Nueva Estadística"}
      </h3>

      {/* 🔹 Icono */}
      <IconSelector
        selected={newStat.icon_key}
        onSelect={(icon) => setNewStat({ ...newStat, icon_key: icon })}
      />

      {/* 🔹 Título */}
      <input
        placeholder="Título"
        className="w-full p-2 border rounded"
        value={newStat.title || ""}
        onChange={(e) => setNewStat({ ...newStat, title: e.target.value })}
      />

   

      {/* 🔹 Texto */}
      <input
        placeholder="Texto"
        className="w-full p-2 border rounded"
        value={newStat.text || ""}
        onChange={(e) => setNewStat({ ...newStat, text: e.target.value })}
      />

      {/* 🔹 Botón */}
      <button
        onClick={
          editingStat
            ? () => handleEditStat(newStat as Stat)
            : handleAddStat
        }
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        {editingStat ? "Guardar Cambios" : "Agregar"}
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default FeaturesForm;
