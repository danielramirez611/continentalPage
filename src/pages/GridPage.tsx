// GridPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { HeroGrid } from "../components/grid/HeroGrid";
import { ProjectSlider } from "../components/grid/ProjectSlider";
import { useAuth } from "../context/AuthContext";
import { FiTrash, FiPlus } from "react-icons/fi";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

interface ProjectSection {
  category: string;
  projects: Project[];
}

export default function GridPage() {
  const { user } = useAuth();

  // Hero principal
  const [heroData, setHeroData] = useState({
    title: "Innovación en Ingeniería",
    description: "Soluciones tecnológicas que transforman la industria moderna",
    backgroundImage: "/public/assets/images/herogrid.jpg",
  });

  // Secciones con proyectos
  const [sections, setSections] = useState<ProjectSection[]>([
    {
      category: "Automatización Industrial",
      projects: [
        {
          id: "1",
          title: "Brazo Robótico de Precisión",
          category: "Robótica",
          image: "/public/assets/images/proyecto1.jpg",
          description:
            "Sistema de manipulación automatizada para líneas de producción",
        },
        {
          id: "2",
          title: "Línea de Ensamblaje Automatizada",
          category: "Manufactura",
          image: "/public/assets/images/proyecto2.jpg",
          description: "Integración completa de sistemas IoT en cadena de montaje",
        },
        {
          id: "5",
          title: "Sistema de Detección de Anomalías",
          category: "Big Data Industrial",
          image: "/public/assets/images/proyecto5.jpg",
          description:
            "Motor de análisis para identificar fallas en tiempo real en procesos industriales.",
        },
        {
          id: "6",
          title: "Dashboard Predictivo",
          category: "Machine Learning",
          image: "/public/assets/images/proyecto6.png",
          description:
            "Visualización interactiva de métricas de rendimiento y alertas predictivas.",
        },
      ],
    },
    {
      category: "Prototipado Avanzado",
      projects: [
        {
          id: "3",
          title: "Impresión 3D Industrial",
          category: "Manufactura Aditiva",
          image: "/public/assets/images/proyecto5.jpg",
          description: "Prototipado rápido con materiales compuestos",
        },
        {
          id: "4",
          title: "Modelado CAD Preciso",
          category: "Diseño",
          image: "/public/assets/images/proyecto6.png",
        },
        {
          id: "7",
          title: "Plataforma IoT en la Nube",
          category: "Conectividad",
          image: "/public/assets/images/proyecto7.jpg",
          description:
            "Control y monitoreo remoto de sensores y actuadores a través de una solución IoT escalable.",
        },
        {
          id: "8",
          title: "Gestión de Energía Remota",
          category: "Eficiencia Energética",
          image: "/public/assets/images/proyecto8.jpg",
          description:
            "Supervisión en línea del consumo energético y ajustes automáticos para reducir costes.",
        },
      ],
    },
  ]);

  // Estados para el filtrado
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Para saber a qué sección (índice) del array original agregar proyecto
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Nueva sección
  const [newSection, setNewSection] = useState<Partial<ProjectSection>>({
    category: "",
    projects: [],
  });

  // Nuevo proyecto
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "",
    image: "",
    description: "",
  });

  // Modales
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 1) Mapeamos cada sección con su índice original
  const sectionsWithIndex = sections.map((section, index) => ({
    ...section,
    originalIndex: index, // guardamos aquí el índice en el array
  }));

  // 2) Filtramos según la sección seleccionada y el searchTerm
  const filteredSections = sectionsWithIndex
    .filter((s) => (selectedSection === "" ? true : s.category === selectedSection))
    .map((s) => {
      const filteredProjects = s.projects.filter((proj) =>
        proj.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...s, projects: filteredProjects };
    });

  /* ======================
   * Funciones principales
   * ====================== */

  // Guardar el Hero
  const handleHeroSave = (newData: { title: string; description: string; image: string }) => {
    setHeroData((prev) => ({
      ...prev,
      ...newData,
      backgroundImage: newData.image || prev.backgroundImage,
    }));
  };

  // Secciones
  const handleAddSection = () => {
    if (newSection.category) {
      setSections((prev) => [...prev, newSection as ProjectSection]);
      setShowAddSectionModal(false);
      setNewSection({ category: "", projects: [] });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleDeleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  // Proyectos
  const handleAddProject = (sectionIndex: number) => {
    // Verificamos que el índice sea válido dentro del array sections
    if (sectionIndex < 0 || sectionIndex >= sections.length) {
      alert("Sección no válida.");
      return;
    }

    // Checamos que los campos del nuevo proyecto estén completos
    if (newProject.title && newProject.category && newProject.image) {
      // Clonamos las secciones
      const updatedSections = [...sections];
      updatedSections[sectionIndex].projects = updatedSections[sectionIndex].projects || [];
      updatedSections[sectionIndex].projects.push(newProject as Project);

      setSections(updatedSections);
      setShowAddProjectModal(false);
      // Limpiamos
      setNewProject({ title: "", category: "", image: "", description: "" });
      setImagePreview(null);
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleDeleteProject = (sectionIndex: number, projectIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].projects = updatedSections[sectionIndex].projects.filter(
      (_, i) => i !== projectIndex
    );
    setSections(updatedSections);
  };

  const handleEditProject = (sectionIndex: number, projectIndex: number, updatedProject: Project) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].projects[projectIndex] = updatedProject;
    setSections(updatedSections);
  };

  // Manejo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setNewProject({ ...newProject, image: url });
      setImagePreview(url);
    }
  };

  // Para el combo de secciones
  const allCategories = sections.map((s) => s.category);

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <HeroGrid
        title={heroData.title}
        description={heroData.description}
        backgroundImage={heroData.backgroundImage}
        isAdmin={user?.role === "admin"}
        onSave={handleHeroSave}
      />

      {/* Controles de Búsqueda / Filtro */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mt-6 mb-4">
        {/* Input para buscar por nombre */}
        <input
          type="text"
          placeholder="Buscar proyectos por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
        />

        {/* Filtro de sección */}
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full sm:w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
        >
          <option value="">Todas las secciones</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </section>

      {/* ANIMATEPRESENCE para animar la entrada/salida de secciones */}
      <AnimatePresence mode="sync">
        {filteredSections.map((section) => (
          <motion.div
            // Usamos un key único basado en la categoría y originalIndex
            key={`${section.category}-${section.originalIndex}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Botones de admin en la esquina */}
            {user?.role === "admin" && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleDeleteSection(section.originalIndex)}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FiTrash className="text-xl text-red-600" />
                </button>
                <button
                  onClick={() => {
                    // Ajustamos editingSectionIndex con el índice original
                    setEditingSectionIndex(section.originalIndex);
                    setShowAddProjectModal(true);
                  }}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FiPlus className="text-xl text-[var(--color-primario)]" />
                </button>
              </div>
            )}

            {/* Renderizamos la grilla de proyectos */}
            <ProjectSlider
              title={section.category}
              projects={section.projects}
              onDeleteProject={(projectIndex) =>
                handleDeleteProject(section.originalIndex, projectIndex)
              }
              onEditProject={(projectIndex, updatedProject) =>
                handleEditProject(section.originalIndex, projectIndex, updatedProject)
              }
              isAdmin={user?.role === "admin"}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {user?.role === "admin" && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="px-6 py-3 bg-[var(--color-primario)] text-white rounded-full hover:bg-[#5a2fc2] transition-colors shadow-lg hover:shadow-xl flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-3" />
            <span className="text-sm md:text-base">Agregar Nueva Sección</span>
          </button>
        </div>
      )}

      {/* Modal para agregar nueva sección */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-6">
            <h3 className="text-2xl font-bold mb-6">Agregar Nueva Sección</h3>
            <input
              placeholder="Nombre de la Sección"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
              value={newSection.category ?? ""}
              onChange={(e) => setNewSection({ ...newSection, category: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSection}
                className="px-5 py-2 bg-[var(--color-primario)] text-white rounded-lg hover:bg-[#5a2fc2] transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar nuevo proyecto */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-6">
            <h3 className="text-2xl font-bold mb-6">Agregar Nuevo Proyecto</h3>
            <input
              placeholder="Título"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
              value={newProject.title ?? ""}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            <input
              placeholder="Nombre de la categoría"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
              value={newProject.category ?? ""}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
            />
            <div className="flex flex-col items-center">
              <label className="w-full p-3 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="text-gray-600">Subir imagen</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
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
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
              rows={4}
              value={newProject.description ?? ""}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Usamos editingSectionIndex para agregar proyecto en la sección original
                  if (editingSectionIndex !== null && editingSectionIndex >= 0) {
                    handleAddProject(editingSectionIndex);
                  } else {
                    alert("Selecciona una sección válida antes de agregar un proyecto.");
                  }
                }}
                className="px-5 py-2 bg-[var(--color-primario)] text-white rounded-lg hover:bg-[#5a2fc2] transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
