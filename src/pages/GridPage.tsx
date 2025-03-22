import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroGrid } from "../components/grid/HeroGrid";
import { ProjectSlider } from "../components/grid/ProjectSlider";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FiTrash, FiPlus} from "react-icons/fi";
import {
  getSections,
  createSection,
  deleteSection,
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from "../../api";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  section_id: string;
  category: string;
  image: string;
  description?: string;
}

interface ProjectSection {
  id: string;
  name: string;
  projects: Project[];
}

export default function GridPage() {
  const { user, token } = useAuth();
  const [sections, setSections] = useState<ProjectSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null); // 🆕 Identificador del proyecto en edición
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    section_id: "",
    category: "",
    image: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newSectionName, setNewSectionName] = useState("");

  useEffect(() => {
    fetchSections();
  }, []);
  const [heroData, setHeroData] = useState({
    title: "Innovación en Ingeniería",
    description: "Soluciones tecnológicas que transforman la industria moderna",
    backgroundImage: "/public/assets/images/herogrid.jpg",
  });
  const fetchSections = async () => {
    try {
      const sectionsData = await getSections();
      const projectsData = await getProjects();

      // 🔹 Ahora se filtran los proyectos por `section_id` en lugar de `category`
      const formattedSections = sectionsData.map((section: any) => ({
        ...section,
        projects: projectsData.filter(
          (p: Project) => p.section_id === section.id
        ),
      }));

      setSections(formattedSections);
    } catch (error) {
      console.error("❌ Error al obtener secciones y proyectos:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  // 🔹 Eliminar sección
  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta sección?")) return;
    try {
      await deleteSection(sectionId, token);
      fetchSections();
    } catch (error) {
      console.error("❌ Error al eliminar sección:", error);
    }
  };

  // 🔹 Agregar nueva sección
  const handleAddSection = async () => {
    if (!newSectionName.trim()) {
      alert("El nombre de la sección es obligatorio.");
      return;
    }
    try {
      await createSection(newSectionName, token);
      setNewSectionName("");
      setShowAddSectionModal(false);
      fetchSections();
    } catch (error) {
      console.error("❌ Error al agregar sección:", error);
    }
  };
  const handleAddProject = async () => {
    if (
      !newProject.title ||
      !selectedImage ||
      !selectedSectionId ||
      !newProject.category ||
      !newProject.description
    ) {
      alert("Completa todos los campos antes de agregar un proyecto.");
      return;
    }

    try {
      await createProject(
        {
          title: newProject.title,
          category: newProject.category,
          description: newProject.description,
          section_id: selectedSectionId, // 🔹 Asegurar que section_id se pase
        },
        selectedImage,
        token
      );

      setShowAddProjectModal(false);
      setNewProject({ title: "", category: "", description: "", image: "" });
      setImagePreview(null);
      setSelectedImage(null);
      setSelectedSectionId(null);
      fetchSections();
    } catch (error) {
      console.error("❌ Error al agregar proyecto:", error);
    }
  };

  // 🔹 Función para eliminar un proyecto
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto?")) return;

    try {
      // Verificar si el proyecto existe antes de eliminarlo
      const projectExists = sections.some((section) =>
        section.projects.some((p) => p.id === projectId)
      );
      if (!projectExists) {
        alert("El proyecto ya no existe.");
        return;
      }

      await deleteProject(projectId, token);
      fetchSections();
    } catch (error) {
      console.error("❌ Error al eliminar proyecto:", error);
    }
  };

  const handleSaveProject = async () => {
    if (
      !newProject.title ||
      !selectedSectionId ||
      !newProject.category ||
      !newProject.description
    ) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    try {
      if (editingProjectId) {
        // Verificar si el proyecto aún existe antes de actualizar
        const projectExists = sections.some((section) =>
          section.projects.some((p) => p.id === editingProjectId)
        );
        if (!projectExists) {
          alert("El proyecto no existe.");
          setEditingProjectId(null);
          return;
        }

        await updateProject(
          editingProjectId,
          {
            title: newProject.title,
            category: newProject.category,
            description: newProject.description,
            section_id: selectedSectionId,
          },
          selectedImage,
          token
        );
      } else {
        await createProject(
          {
            title: newProject.title,
            category: newProject.category,
            description: newProject.description,
            section_id: selectedSectionId,
          },
          selectedImage,
          token
        );
      }

      setShowAddProjectModal(false);
      setNewProject({ title: "", category: "", description: "", image: "" });
      setImagePreview(null);
      setSelectedImage(null);
      setEditingProjectId(null);
      fetchSections();
    } catch (error) {
      console.error("❌ Error al guardar proyecto:", error);
    }
  };

  const handleEditProject = (project: Project) => {
    setNewProject({
      title: project.title,
      category: project.category,
      description: project.description,
      section_id: project.section_id,
      image: project.image, // Mantener la imagen previa si no se cambia
    });

    setEditingProjectId(project.id);
    setSelectedSectionId(project.section_id);

    // 🔹 Verificar si la imagen ya tiene una URL completa
    const imageUrl = project.image.startsWith("http")
      ? project.image
      : `http://localhost:5000${project.image}`;

    setImagePreview(imageUrl); // Mostrar imagen existente
    setShowAddProjectModal(true);
  };

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <HeroGrid
        title={heroData.title}
        description={heroData.description}
        backgroundImage={heroData.backgroundImage}
      />

      {/* Filtro de Búsqueda */}
      <section className="flex flex-col focus:outline-0 focus:ring-2 sm:flex-row items-center justify-center gap-4 px-4 mt-6 mb-4">
        <input
          type="text"
          placeholder="Buscar proyectos por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded focus:outline-0 focus:ring-2 focus:ring-[var(--color-primario)]"
        />

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full sm:w-1/4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primario)]"
        >
          <option value="">Todas las secciones</option>
          {sections.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </section>

      {/* Renderizar Secciones */}
      <AnimatePresence>
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="relative p-6 border-b border-gray-300"
          >
            {/* 🔹 Botones de Acción (solo visibles si es admin) */}
            {user?.role === "admin" && (
              <div className="absolute top-4 right-4 flex gap-2">
                {/* Botón para eliminar sección */}
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition"
                >
                  <FiTrash className="text-xl" />
                </button>
                {/* Botón para agregar proyecto */}
                <button
                  onClick={() => {
                    console.log("✅ Sección seleccionada:", section);
                    setSelectedSectionId(section.id);
                    setNewProject({
                      title: "",
                      section_id: section.id,
                      category: section.name,
                      image: "",
                      description: "",
                    });
                    setShowAddProjectModal(true);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <FiPlus className="text-xl" />
                </button>
              </div>
            )}

            {/* 🔹 Renderizar proyectos dentro de la sección */}
            <ProjectSlider
              title={section.name}
              projects={section.projects}
              onDeleteProject={handleDeleteProject}
              onEditProject={handleEditProject}
              onProjectClick={handleProjectClick} // ✅ Agregar función de clic
              isAdmin={user?.role === "admin"}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Botón Agregar Sección */}
      {user?.role === "admin" && (
        <button
          onClick={() => setShowAddSectionModal(true)}
          className="mt-8 px-6 py-3 flex ml-4 bg-[var(--color-primario)] text-white rounded-full hover:bg-[#5a2fc2] transition"
        >
          <FiPlus className="mr-2" /> Agregar Sección
        </button>
      )}

      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-8 max-w-md h-[90vh] overflow-y-auto w-full space-y-6 relative"
          >
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => {
                setShowAddProjectModal(false);
                setEditingProjectId(null); // Resetear modo edición al cerrar
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900">
              {editingProjectId ? "Editar Proyecto" : "Agregar Nuevo Proyecto"}
            </h3>

            <p className="text-gray-600 mb-4">
              <strong>Sección:</strong>{" "}
              {sections.find((s) => s.id === selectedSectionId)?.name || "N/A"}
            </p>

            <input
              placeholder="Título"
              className="w-full p-3 border focus:outline-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primario)] focus:border-transparent text-lg"
              value={newProject.title ?? ""}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />

            <input
              placeholder="Categoría"
              className="w-full p-3 border focus:outline-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primario)] focus:border-transparent text-lg"
              value={newProject.category ?? ""}
              onChange={(e) =>
                setNewProject({ ...newProject, category: e.target.value })
              }
            />

            <div className="flex flex-col items-center">
              <label className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                <span className="text-gray-600">Subir imagen (opcional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden "
                />
              </label>

              {/* Mostrar imagen previa si existe */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="mt-4 w-48 h-48 object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            <textarea
              placeholder="Descripción"
              className="w-full p-3 border focus:outline-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primario)] focus:border-transparent text-lg"
              rows={4}
              value={newProject.description ?? ""}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddProjectModal(false);
                  setEditingProjectId(null); // Resetear modo edición al cerrar
                }}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProject}
                className="px-5 py-2 bg-[var(--color-primario)] text-white rounded-lg hover:bg-[#5a2fc2] transition-colors text-lg"
              >
                {editingProjectId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Agregar Sección */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-8 max-w-md w-full space-y-6 relative"
          >
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setShowAddSectionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900">
              Agregar Sección
            </h3>

            <input
              placeholder="Nombre de la sección"
              className="w-full p-3 border focus:outline-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primario)] focus:border-transparent text-lg"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSection}
                className="px-5 py-2 bg-[var(--color-primario)] text-white rounded-lg hover:bg-[#5a2fc2] transition-colors text-lg"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
