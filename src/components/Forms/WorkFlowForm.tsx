import React, { useState, useRef, useEffect } from "react";
import { ProjectData, WorkflowStep } from "../../data/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faSave, faSync } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { saveOrUpdateWorkflow, addWorkflowStep, getWorkflowSteps, deleteWorkflowStep,updateWorkflowStep } from "../../../api";

interface WorkflowFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
  token: string;
}

const WorkflowForm = ({ project, setProject, token }: WorkflowFormProps) => {
  const [newStep, setNewStep] = useState<Partial<WorkflowStep>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [editingStepData, setEditingStepData] = useState<Partial<WorkflowStep>>({});
  const editingFileInputRef = useRef<HTMLInputElement>(null);
  
  const fetchSteps = async () => {
    try {
      const stepsFromServer = await getWorkflowSteps(project.id);
      const formattedSteps: WorkflowStep[] = stepsFromServer.map((step: any) => ({
        step: step.step_number,
        title: step.title,
        description: step.description,
        image: step.image_url ? `http://localhost:5000${step.image_url}` : null,
        id: step.id,
      }));

      setProject((prev) => ({
        ...prev,
        workflow: formattedSteps,
        workflowTitle: stepsFromServer[0]?.workflow_title || prev.workflowTitle,
        workflowSubtitle: stepsFromServer[0]?.workflow_subtitle || prev.workflowSubtitle,
        showWorkflow: formattedSteps.length > 0,
      }));
    } catch (error) {
      console.error("Error al cargar los pasos del workflow:", error);
    }
  };

  useEffect(() => {
    if (project.id) {
      fetchSteps();
    }
  }, [project.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStep({ ...newStep, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveWorkflowTitle = async () => {
    try {
      await saveOrUpdateWorkflow(project.id, {
        title: project.workflowTitle,
        subtitle: project.workflowSubtitle,
      }, token);
      await fetchSteps();
      alert("Título del workflow guardado en la base de datos");
    } catch (error) {
      console.error("Error al guardar título/subtítulo:", error);
    }
  };

  const handleAddStep = async () => {
    if (!newStep.title || !newStep.description || !newStep.image) {
      alert("Completa todos los campos del paso incluyendo imagen");
      return;
    }

    try {
      const imageBlob = await fetch(newStep.image).then(r => r.blob());
      const file = new File([imageBlob], `step-${Date.now()}.jpg`, { type: imageBlob.type });

      const step_number = (project.workflow?.length || 0) + 1;
      await addWorkflowStep(project.id, { ...newStep, step_number }, file, token);
      await fetchSteps();
      setNewStep({});
    } catch (error) {
      console.error("Error al agregar paso:", error);
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este paso?")) return;
    try {
      await deleteWorkflowStep(project.id, stepId, token);
      await fetchSteps();
    } catch (error) {
      console.error("Error al eliminar paso:", error);
    }
  };
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStepData(prev => ({ ...prev, image: reader.result as string, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveEditedStep = async () => {
    if (!editingStepId) return;
  
    try {
      const stepToEdit = project.workflow?.find(step => step.id === editingStepId);
      const updatedStepData = {
        title: editingStepData.title || stepToEdit?.title,
        description: editingStepData.description || stepToEdit?.description,
        step_number: stepToEdit?.step,
      };
  
      await updateWorkflowStep(
        project.id,
        editingStepId,
        updatedStepData,
        editingStepData.imageFile, // Enviar archivo si se cambió
        token
      );
  
      await fetchSteps();
      setEditingStepId(null);
      setEditingStepData({});
    } catch (error) {
      console.error("Error al actualizar paso:", error);
    }
  };
    
  return (
    <div className="space-y-8">
      {/* Sección de Configuración General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Configuración del Workflow</h3>
          <button
            onClick={fetchSteps}
            title="Recargar pasos"
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FontAwesomeIcon icon={faSync} /> Recargar Pasos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Título Principal</label>
            <input
              value={project.workflowTitle}
              onChange={(e) => setProject({ ...project, workflowTitle: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Subtítulo</label>
            <input
              value={project.workflowSubtitle}
              onChange={(e) => setProject({ ...project, workflowSubtitle: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveWorkflowTitle}
            className="bg-primario text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar Título
          </button>
        </div>
      </motion.div>

      {/* Lista de pasos guardados */}
      <AnimatePresence>
      {(project.workflow || []).map((step, index) => (
  <motion.div key={step.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-lg font-semibold text-gray-800">Paso {step.step}</h4>
      <button
        onClick={() => handleDeleteStep(step.id)}
        className="text-red-500 hover:text-red-700"
        title="Eliminar paso"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-600">Imagen</label>
        {editingStepId === step.id ? (
          <div className="border-2 border-dashed rounded-lg p-2">
            <input type="file" ref={editingFileInputRef} onChange={handleEditImageUpload} />
            {editingStepData.image && (
              <img src={editingStepData.image as string} className="mt-4 rounded-lg max-h-40" />
            )}
          </div>
        ) : (
          step.image && (
            <img src={step.image} alt={`Paso ${step.step}`} className="mt-4 rounded-lg max-h-40" />
          )
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600">Título</label>
          <input
            value={editingStepId === step.id ? editingStepData.title || "" : step.title}
            disabled={editingStepId !== step.id}
            onChange={(e) => setEditingStepData({ ...editingStepData, title: e.target.value })}
            className={`w-full p-3 border rounded-lg ${
              editingStepId === step.id ? "border-indigo-300" : "bg-gray-50 border-gray-200"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600">Descripción</label>
          <textarea
            value={editingStepId === step.id ? editingStepData.description || "" : step.description}
            disabled={editingStepId !== step.id}
            onChange={(e) => setEditingStepData({ ...editingStepData, description: e.target.value })}
            className={`w-full p-3 border rounded-lg ${
              editingStepId === step.id ? "border-indigo-300" : "bg-gray-50 border-gray-200"
            }`}
            rows={3}
          />
        </div>
      </div>
    </div>

    <div className="flex justify-end gap-4 mt-4">
      {editingStepId === step.id ? (
        <>
          <button
            onClick={handleSaveEditedStep}
            className="bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar Cambios
          </button>
          <button
            onClick={() => {
              setEditingStepId(null);
              setEditingStepData({});
            }}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
          >
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setEditingStepId(step.id);
            setEditingStepData({ title: step.title, description: step.description, image: step.image });
          }}
          className="bg-indigo-500 text-white py-2 px-4 rounded-lg"
        >
          Editar Paso
        </button>
      )}
    </div>
  </motion.div>
))}

      </AnimatePresence>

      {/* Formulario para Nuevo Paso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Agregar Nuevo Paso</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Imagen</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                id="new-image-upload"
              />
              <label
                htmlFor="new-image-upload"
                className="cursor-pointer text-primary hover:text-primary-dark"
              >
                {newStep.image ? "Cambiar Imagen" : "Subir Imagen"}
              </label>
              {newStep.image && (
                <img
                  src={newStep.image}
                  alt="Nuevo paso"
                  className="mt-4 rounded-lg max-h-40 mx-auto"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Título</label>
              <input
                value={newStep.title || ""}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Descripción</label>
              <textarea
                value={newStep.description || ""}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleAddStep}
            className="flex items-center gap-2 bg-primario text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} /> Agregar Paso
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkflowForm;
