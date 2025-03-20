import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/proyect/HeroSection";
import { AdvantagesSection } from "../components/proyect/AdvantagesSection";
import { FeaturesSection } from "../components/proyect/FeaturesSection";
import WorkflowSection from "../components/proyect/WorkflowSection";
import TeamSection from "../components/proyect/TeamSection";
import ContactForm from "../components/proyect/ContactForm";
import Footer from "../components/Footer";
import ProjectForm from "../components/Forms/ProjectForm";
import { ProjectData, initialProjectData } from "../data/project";
import { useAuth } from "../context/AuthContext";
import { FiSettings } from "react-icons/fi";

const ProjectPage = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectData>(initialProjectData);
  const [showForm, setShowForm] = useState(false); // Inicialmente oculto

  // Función para eliminar una ventaja
  const handleDeleteAdvantage = (index: number) => {
    const newAdvantages = project.advantages.filter((_, i) => i !== index);
    setProject((prev) => ({
      ...prev,
      advantages: newAdvantages,
      showAdvantages: newAdvantages.length > 0,
    }));
  };

  // Función para eliminar una característica
  const handleDeleteFeature = (index: number) => {
    const newFeatures = project.features.filter((_, i) => i !== index);
    setProject((prev) => ({
      ...prev,
      features: newFeatures,
      showFeatures: newFeatures.length > 0,
    }));
  };

  // Función para eliminar un paso del flujo de trabajo
  const handleDeleteWorkflowStep = (index: number) => {
    const newWorkflow = project.workflow.filter((_, i) => i !== index);
    setProject((prev) => ({
      ...prev,
      workflow: newWorkflow,
      showWorkflow: newWorkflow.length > 0,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
     <Navbar project={project} />
      <main className="flex-grow">
        <Hero />

        {/* Sección de Ventajas */}
        {project.showAdvantages && (
          <AdvantagesSection
            title={project.advantagesTitle}
            subtitle={project.advantagesSubtitle}
            advantages={project.advantages}
            onEdit={() => setShowForm(true)}
            onDelete={handleDeleteAdvantage}
          />
        )}

        {/* Sección de Características */}
        {project.showFeatures && (
          <FeaturesSection
            featuresTitle={project.featuresTitle}
            featuresSubtitle={project.featuresSubtitle}
            features={project.features}
            stats={project.stats}
            featuresVideoUrl={project.featuresVideoUrl}
            onEdit={() => setShowForm(true)}
            onDelete={handleDeleteFeature}
          />
        )}

        {/* Sección de Flujo de Trabajo */}
        {project.showWorkflow && (
          <WorkflowSection
            workflow={project.workflow}
            workflowTitle={project.workflowTitle}
            workflowSubtitle={project.workflowSubtitle}
            onEdit={() => setShowForm(true)}
            onDelete={handleDeleteWorkflowStep}
          />
        )}

        {/* Sección de Equipo */}
        {project.showTeam && (
          <TeamSection
            team={project.team}
            onEdit={() => setShowForm(true)}
            onDelete={(index) => {
              const newTeam = project.team.filter((_, i) => i !== index);
              setProject({ ...project, team: newTeam });
            }}
          />
        )}

        {/* Sección de Contacto */}
        {project.showContact && <ContactForm email={project.contactEmail} />}
      </main>
      <Footer />

      {/* Botón flotante para mostrar/ocultar el formulario (solo para admin) */}
      {user?.role === "admin" && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-8 right-8 bg-primario text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition z-50"
          aria-label="Configuración"
        >
          <FiSettings className="text-2xl" />
        </button>
      )}

      {/* Formulario de edición (solo para admin) */}
      {user?.role === "admin" && showForm && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/20 flex justify-center items-center p-4 z-[1000]"
          onClick={(e) => {
            // Cerrar solo si se hace clic en el overlay (no en el contenido)
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Evitar cierre al hacer clic dentro
          >
            <ProjectForm
              project={project}
              setProject={setProject}
              onFinish={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
