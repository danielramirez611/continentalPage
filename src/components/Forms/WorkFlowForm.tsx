import React, { useState, useRef } from "react";
import { ProjectData, WorkflowStep } from "../../data/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

interface WorkflowFormProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
}

const WorkflowForm = ({ project, setProject }: WorkflowFormProps) => {
  const [newStep, setNewStep] = useState<Partial<WorkflowStep>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCount = project.workflow.filter(step => step.image).length;
  const workflow = project.workflow || []; // ✅ Asegurar que `workflow` siempre sea un array

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

  const handleAddStep = () => {
    if (newStep.title && newStep.description) {
      // Generar el número de paso automáticamente
      const stepNumber = project.workflow.length + 1;
      const updatedWorkflow = [
        ...project.workflow,
        { ...newStep, step: stepNumber } as WorkflowStep,
      ];

      setProject({
        ...project,
        workflow: updatedWorkflow,
        showWorkflow: updatedWorkflow.length > 0,
      });
      setNewStep({}); // Limpiar el formulario después de agregar
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  const handleDeleteStep = (index: number) => {
    const newWorkflow = project.workflow.filter((_, i) => i !== index);
    setProject({ ...project, workflow: newWorkflow });
  };

  const updateStep = (index: number, field: keyof WorkflowStep, value: string) => {
    const updatedWorkflow = [...project.workflow];
    updatedWorkflow[index] = { ...updatedWorkflow[index], [field]: value };
    setProject({ ...project, workflow: updatedWorkflow });
  };

  return (
    <div className="space-y-8">
      {/* Sección de Configuración General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Configuración del Workflow</h3>
        
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
      </motion.div>


      {/* Lista de Pasos Existentes */}
      <AnimatePresence>
        {project.workflow.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Paso {step.step}</h4>
              <button
                onClick={() => handleDeleteStep(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subida de Imagen */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">Imagen</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateStep(index, 'image', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id={`image-upload-${index}`}
                  />
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="cursor-pointer text-primary hover:text-primary-dark"
                  >
                    {step.image ? "Cambiar Imagen" : "Subir Imagen"}
                  </label>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Paso ${step.step}`}
                      className="mt-4 rounded-lg max-h-40 mx-auto"
                    />
                  )}
                </div>
              </div>
              
              {/* Campos Editables */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Título</label>
                  <input
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Descripción</label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
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
          {/* Subida de Imagen */}
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
          
          {/* Campos del Nuevo Paso */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Título</label>
              <input
                value={newStep.title || ""}
                onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Descripción</label>
              <textarea
                value={newStep.description || ""}
                onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleAddStep}
            className="flex items-center gap-2 bg-primario text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Paso
          </button>
      
        </div>
      </motion.div>
    </div>
  );
};

export default WorkflowForm;