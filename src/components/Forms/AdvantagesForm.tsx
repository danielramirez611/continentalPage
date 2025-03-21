import React, { useState, useEffect } from "react";
import { IconSelector } from "../common/IconSelector";
import { Advantage } from "../../data/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faTrash, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getAdvantages, addAdvantage, deleteAdvantage, updateAdvantage } from "../../../api"; // 🔹 Importar funciones de API

interface AdvantagesFormProps {
  projectId: string; // 📌 Asegúrate de que `projectId` esté incluido aquí
  token: string;
}

const AdvantagesForm = ({ projectId, token }: AdvantagesFormProps) => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");
  const [newAdvantage, setNewAdvantage] = useState<Partial<Advantage>>({
    title: "",
    description: "",
    icon: "",
    stat: "",
  });
  const [editingAdvantageId, setEditingAdvantageId] = useState<number | null>(null);
  const [isAdvantagesExpanded, setIsAdvantagesExpanded] = useState(true);

  useEffect(() => {
    if (!projectId) {
      console.warn("⚠ projectId no está definido. No se pueden cargar ventajas.");
      return;
    }

    const fetchAdvantages = async () => {
      try {
        const data = await getAdvantages(projectId);
        if (data.length > 0) {
          setSectionTitle(data[0].section_title || "");
          setSectionSubtitle(data[0].section_subtitle || "");
        }
        setAdvantages(data);
      } catch (error) {
        console.error("❌ Error al obtener ventajas:", error);
      }
    };
    fetchAdvantages();
  }, [projectId]);

  // 📌 Guardar título y subtítulo en la base de datos
  const handleUpdateSectionInfo = async () => {
    if (!sectionTitle || !sectionSubtitle) {
      alert("Título y subtítulo de la sección son obligatorios.");
      return;
    }

    try {
      await Promise.all(
        advantages.map((adv) =>
          updateAdvantage(projectId, adv.id!, { section_title: sectionTitle, section_subtitle: sectionSubtitle }, token)
        )
      );
      alert("Sección actualizada correctamente.");
    } catch (error) {
      console.error("❌ Error al actualizar la sección:", error);
    }
  };

  // 📌 Agregar o actualizar una ventaja
  const handleSaveAdvantage = async () => {
    if (!projectId) {
      console.error("❌ Error: No se ha definido un ID de proyecto.");
      alert("Error: No se ha definido un ID de proyecto.");
      return;
    }

    if (!newAdvantage.title || !newAdvantage.description || !newAdvantage.icon || !newAdvantage.stat) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (editingAdvantageId) {
        // 📝 Actualizar ventaja existente
        await updateAdvantage(projectId, editingAdvantageId, {
          section_title: sectionTitle || "",
          section_subtitle: sectionSubtitle || "",
          title: newAdvantage.title,
          description: newAdvantage.description,
          icon: newAdvantage.icon, 
          stat: newAdvantage.stat,
        }, token);

        alert("Ventaja actualizada correctamente.");
      } else {
        // ➕ Agregar nueva ventaja
        await addAdvantage(projectId, {
          section_title: sectionTitle || "",
          section_subtitle: sectionSubtitle || "",
          title: newAdvantage.title,
          description: newAdvantage.description,
          icon: newAdvantage.icon, 
          stat: newAdvantage.stat,
        }, token);

        alert("Ventaja agregada correctamente.");
      }

      // 🔹 Recargar ventajas después de agregar o actualizar
      const updatedAdvantages = await getAdvantages(projectId);
      setAdvantages(updatedAdvantages);

      // 🔄 Resetear el formulario
      setNewAdvantage({ title: "", description: "", icon: "", stat: "" });
      setEditingAdvantageId(null);
    } catch (error) {
      console.error("❌ Error al guardar ventaja:", error);
    }
  };

  // 📌 Eliminar una ventaja
  const handleDeleteAdvantage = async (advantageId: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta ventaja?")) return;
    try {
      await deleteAdvantage(projectId, advantageId, token);
      setAdvantages(advantages.filter((adv) => adv.id !== advantageId));
    } catch (error) {
      console.error("❌ Error al eliminar ventaja:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-gray-300 border-b pb-3">
        <h2 className="text-2xl font-bold">Configurar Ventajas</h2>
        <p className="text-gray-600 text-sm">Agrega o edita las ventajas competitivas de tu proyecto.</p>
      </div>

      {/* Lista de ventajas */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-lg">Ventajas Existentes</h4>
        <div className="mt-4 space-y-4">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="border-gray-300 border p-4 rounded-lg bg-white shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{advantage.title}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setNewAdvantage(advantage);
                      setEditingAdvantageId(advantage.id);
                    }} 
                    className="text-blue-500 hover:text-blue-700">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteAdvantage(advantage.id!)} className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario para agregar o editar ventaja */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-4 text-lg">{editingAdvantageId ? "Editar Ventaja" : "Agregar Nueva Ventaja"}</h4>
        <div className="space-y-4">
          <input
            placeholder="Título"
            value={newAdvantage.title}
            onChange={(e) => setNewAdvantage({ ...newAdvantage, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Descripción"
            value={newAdvantage.description}
            onChange={(e) => setNewAdvantage({ ...newAdvantage, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <IconSelector 
            selected={newAdvantage.icon} 
            onSelect={(icon) => setNewAdvantage({ ...newAdvantage, icon: icon })} 
          />
          <input
            placeholder="Estadística"
            value={newAdvantage.stat}
            onChange={(e) => setNewAdvantage({ ...newAdvantage, stat: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleSaveAdvantage} className="w-full bg-green-500 text-white py-2 rounded">
            {editingAdvantageId ? "Guardar Cambios" : "Agregar Ventaja"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvantagesForm;
