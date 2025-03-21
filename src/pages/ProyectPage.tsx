
import React, { useState, useEffect } from "react";
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
import { useLocation, useParams, useNavigate } from "react-router-dom"; // <-- Importar useNavigate
import { getProjectById, deleteAdvantage } from "../../api"; // 🔹 Agregar función para obtener proyecto desde la API


const ProjectPage = () => {
  const { user, token } = useAuth(); // 🔹 Asegurar que se obtiene el token
  const navigate = useNavigate(); // <-- Hook para navegar
  const [project, setProject] = useState<ProjectData>(initialProjectData);
  const [showForm, setShowForm] = useState(false); // Inicialmente oculto
  const { id } = useParams();
  const location = useLocation();
  const [advantages, setAdvantages] = useState<Advantage[]>([]); // ✅ Asegurar que advantages inicia como un array vacío

  useEffect(() => {
    if (location.state?.project) {
      // 🔹 Si el usuario llegó desde `GridPage.tsx`, usa los datos del estado
      setProject(location.state.project);

    } else if (id) {
      // 🔹 Si no hay datos en el estado, obtenerlos desde la API
      getProjectById(id)
        .then((data) => setProject(data))
        .catch((error) => console.error("❌ Error al cargar proyecto:", error));
    }
  }, [id, location.state]);


  // Función para eliminar una ventaja
  const handleDeleteAdvantage = async (advantageId: number) => {
    if (!user || !token) {
      console.error("❌ Error: El usuario no está autenticado o el token no está disponible.");
      alert("Debe iniciar sesión para eliminar una ventaja.");
      return;
    }
  
    if (!window.confirm("¿Seguro que deseas eliminar esta ventaja?")) return;
  
    try {
      await deleteAdvantage(project.id, advantageId, token);
  
      // ✅ ACTUALIZAR EL ESTADO LOCAL INMEDIATAMENTE SIN RECARGA
      setAdvantages((prevAdvantages) =>
        prevAdvantages.filter((adv) => adv.id !== advantageId)
      );
  
      setProject((prev) => {
        const updatedAdvantages = prev.advantages
          ? prev.advantages.filter((adv) => adv.id !== advantageId)
          : [];
  
        return {
          ...prev,
          advantages: updatedAdvantages,
          showAdvantages: updatedAdvantages.length > 0,
        };
      });
  
      console.log(`✅ Ventaja con ID ${advantageId} eliminada`);
    } catch (error) {
      console.error("❌ Error al eliminar ventaja:", error);
      alert("No se pudo eliminar la ventaja. Intente nuevamente.");
    }
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
    const newWorkflow = (project.workflow || []).filter((_, i) => i !== index);

    setProject((prev) => ({
      ...prev,
      workflow: newWorkflow,
      showWorkflow: newWorkflow.length > 0,
    }));
  };
  const handleEditAdvantage = async (updatedAdvantage: Advantage) => {
    setAdvantages((prevAdvantages) =>
      prevAdvantages.map((adv) =>
        adv.id === updatedAdvantage.id ? updatedAdvantage : adv
      )
    );
  
    setProject((prev) => ({
      ...prev,
      advantages: prev.advantages
        ? prev.advantages.map((adv) =>
            adv.id === updatedAdvantage.id ? updatedAdvantage : adv
          )
        : [],
    }));
  };
  
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar project={project} />
      <main className="flex-grow">
        <Hero title={project.title} image={project.image} description={project.description} />

        {/* Sección de Ventajas */}
        {project.showAdvantages && (
          <AdvantagesSection
          projectId={id} // ✅ Pasamos el ID correcto
          title={project.advantagesTitle}
            subtitle={project.advantagesSubtitle}
            advantages={advantages} // ✅ Se pasa el estado actualizado de ventajas
            onEdit={handleEditAdvantage} // ✅ Edita sin recargar
            onDelete={handleDeleteAdvantage} // ✅ Se llama correctamente
            />
        )}


        {/* Sección de Características */}
{project.showFeatures && (
  <FeaturesSection
    projectId={project.id}  // 🔴 Asegura que `project.id` sea un número válido
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
            team={project.team || []}
            onEdit={() => setShowForm(true)}
            onDelete={(index) => {
              const newTeam = (project.team || []).filter((_, i) => i !== index);
              setProject({ ...project, team: newTeam });
            }}
          />
        )}

        {/* Sección de Contacto */}
        {project.showContact && <ContactForm email={project.contactEmail} />}
      </main>
      <Footer />

      {/* Sección de botones flotantes */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-3 z-50">

        {/* Botón "Ingresar" para TODOS los roles */}
        <div className="relative group">
        {user?.role !== "admin" && (
            <div
              className="absolute right-full mr-2 px-2 py-1 bg-black text-white text-xs rounded
                         opacity-0 group-hover:opacity-100 transition pointer-events-none"
            >
              Ingresar Solo Administradores
            </div>
          )}
          <button
            className="bg-primario text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition"
            onClick={() => {
              // Navegar a /login, sin importar el rol
              navigate("/login");
            }}
          >
            Ingresar
          </button>
          {/* Tooltip "Solo Administradores" si deseas mostrar algo en hover, 
              por ejemplo, si user?.role !== "admin" */}
          
        </div>

        {/* Botón de Configuración (solo admin) */}
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primario text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition"
          >
            <FiSettings className="text-2xl" />
          </button>
        )}
      </div>

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
