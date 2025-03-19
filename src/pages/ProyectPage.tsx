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

const ProjectPage = () => {
  const [project, setProject] = useState<ProjectData>(initialProjectData);
  const [showForm, setShowForm] = useState(true);

  const handleDeleteAdvantage = (index: number) => {
    const newAdvantages = project.advantages.filter((_, i) => i !== index);
    setProject((prev) => ({
      ...prev,
      advantages: newAdvantages,
      showAdvantages: newAdvantages.length > 0,
    }));
  };
  const handleDeleteFeature = (index: number) => {
    const newFeatures = project.features.filter((_, i) => i !== index);
    setProject((prev) => ({
      ...prev,
      features: newFeatures,
      showFeatures: newFeatures.length > 0,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />

        {project.showAdvantages && (
          <AdvantagesSection
            title={project.advantagesTitle}
            subtitle={project.advantagesSubtitle}
            advantages={project.advantages}
            onEdit={() => setShowForm(true)}
            onDelete={handleDeleteAdvantage}
          />
        )}

        {project.showFeatures && (
          <FeaturesSection
            featuresTitle={project.featuresTitle}
            featuresSubtitle={project.featuresSubtitle}
            features={project.features}
            stats={project.stats} // Pasar stats correctamente
            featuresVideoUrl={project.featuresVideoUrl}
            onEdit={() => setShowForm(true)}
            onDelete={handleDeleteFeature}
          />
        )}
        {project.showWorkflow && (
          <WorkflowSection workflow={project.workflow} />
        )}
        {project.showTeam && <TeamSection team={project.team} />}
        {project.showContact && <ContactForm email={project.contactEmail} />}
      </main>
      <Footer />

      {showForm && (
        <ProjectForm
          project={project}
          setProject={setProject}
          onFinish={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectPage;
