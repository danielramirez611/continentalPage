// pages/ProjectPage.tsx
import React, { useState } from "react";
import Navbar from '../components/Navbar';
import Hero from '../components/proyect/HeroSection';
import { AdvantagesSection } from '../components/proyect/AdvantagesSection';
import FeaturesSection from '../components/proyect/FeaturesSection';
import WorkflowSection from '../components/proyect/WorkflowSection';
import TeamSection from '../components/proyect/TeamSection';
import ContactForm from '../components/proyect/ContactForm';
import Footer from '../components/Footer';
import ProjectForm from '../components/Forms/ProjectForm';
import { ProjectData, initialProjectData } from '../data/project';

const ProjectPage = () => {
  const [project, setProject] = useState<ProjectData>(initialProjectData);
  const [showForm, setShowForm] = useState(true); // Controla la visibilidad del formulario

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Sección de Ventajas */}
        {project.showAdvantages && (
          <AdvantagesSection
            title={project.advantagesTitle}
            subtitle={project.advantagesSubtitle}
            advantages={project.advantages}
            onEdit={() => setShowForm(true)}
          />
        )}

        {/* Formulario de edición ubicado correctamente debajo de la sección de ventajas */}
        {showForm && (
          <div className="relative z-10 bg-white shadow-lg p-6 mt-6 mx-auto max-w-4xl rounded-lg">
            <ProjectForm
              project={project}
              setProject={setProject}
              onFinish={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Otras secciones */}
        {project.showFeatures && <FeaturesSection features={project.features} />}
        {project.showWorkflow && <WorkflowSection workflow={project.workflow} />}
        {project.showTeam && <TeamSection team={project.team} />}
        {project.showContact && <ContactForm email={project.contactEmail} />}
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPage;

