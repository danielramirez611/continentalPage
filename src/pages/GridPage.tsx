import { useState } from "react";
import { HeroGrid } from "../components/grid/HeroGrid";
import { ProjectSlider } from "../components/grid/ProjectSlider";
import { useAuth } from "../context/AuthContext";
import { FiEdit, FiTrash, FiPlus, FiSave, FiX } from "react-icons/fi";

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
  const [heroData, setHeroData] = useState({
    title: "Innovación en Ingeniería",
    description: "Soluciones tecnológicas que transforman la industria moderna",
    backgroundImage: "/public/assets/images/herogrid.jpg",
  });
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
          description:
            "Integración completa de sistemas IoT en cadena de montaje",
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
      ],
    },
  ]);

  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  );

  const [newSection, setNewSection] = useState<Partial<ProjectSection>>({
    category: "",
    projects: [],
  });
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "",
    image: "",
    description: "",
  });
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleAddSection = () => {
    if (newSection.category) {
      setSections((prev) => [...prev, newSection as ProjectSection]);
      setShowAddSectionModal(false);
      setNewSection({ category: "", projects: [] });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleHeroSave = (newData: {
    title: string;
    description: string;
    image: string;
  }) => {
    setHeroData((prev) => ({
      ...prev,
      ...newData,
      backgroundImage: newData.image || prev.backgroundImage,
    }));
  };

  const handleAddProject = (sectionIndex: number) => {
    if (sectionIndex < 0 || sectionIndex >= sections.length) {
      alert("Sección no válida.");
      return;
    }

    if (newProject.title && newProject.category && newProject.image) {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].projects =
        updatedSections[sectionIndex].projects || [];
      updatedSections[sectionIndex].projects.push(newProject as Project);
      setSections(updatedSections);
      setShowAddProjectModal(false);
      setNewProject({ title: "", category: "", image: "", description: "" });
      setImagePreview(null);
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleDeleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteProject = (sectionIndex: number, projectIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].projects = updatedSections[
      sectionIndex
    ].projects.filter((_, i) => i !== projectIndex);
    setSections(updatedSections);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setNewProject({ ...newProject, image: url });
      setImagePreview(url);
    }
  };

  const handleEditProject = (
    sectionIndex: number,
    projectIndex: number,
    updatedProject: Project
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].projects[projectIndex] = updatedProject;
    setSections(updatedSections);
  };

  return (
    <main className="overflow-hidden">
      <HeroGrid
        title={heroData.title}
        description={heroData.description}
        backgroundImage={heroData.backgroundImage}
        isAdmin={user?.role === "admin"}
        onSave={handleHeroSave}
      />

      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="relative">
          {user?.role === "admin" && (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleDeleteSection(sectionIndex)}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <FiTrash className="text-xl text-red-600" />
              </button>
              <button
                onClick={() => {
                  setEditingSectionIndex(sectionIndex);
                  setShowAddProjectModal(true);
                }}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <FiPlus className="text-xl text-[var(--color-primario)]" />
              </button>
            </div>
          )}

          <ProjectSlider
            title={section.category}
            projects={section.projects}
            onDeleteProject={(projectIndex) =>
              handleDeleteProject(sectionIndex, projectIndex)
            }
            onEditProject={(projectIndex, updatedProject) =>
              handleEditProject(sectionIndex, projectIndex, updatedProject)
            }
            isAdmin={user?.role === "admin"}
          />
        </div>
      ))}

      {user?.role === "admin" && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="px-6 py-3 bg-[var(--color-primario)] text-white rounded-full hover:bg-[#5a2fc2] transition-colors shadow-lg hover:shadow-xl flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-3" />
            <span className="text-sm md:text-base">
              Agregar Nueva Seccion
            </span>
          </button>
        </div>
      )}

      {/* Modal para agregar nueva categoría */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-6">
            <h3 className="text-2xl font-bold mb-6">Agregar Nueva Sección</h3>
            <input
              placeholder="Nombre de la Sección"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
              value={newSection.category ?? ""}
              onChange={(e) =>
                setNewSection({ ...newSection, category: e.target.value })
              }
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
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <input
              placeholder="Nombre de la categoría"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)]"
              value={newProject.category ?? ""}
              onChange={(e) =>
                setNewProject({ ...newProject, category: e.target.value })
              }
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
              rows="4"
              value={newProject.description ?? ""}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
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
                  if (
                    editingSectionIndex !== null &&
                    editingSectionIndex >= 0
                  ) {
                    handleAddProject(editingSectionIndex);
                  } else {
                    alert(
                      "Selecciona una sección válida antes de agregar un proyecto."
                    );
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
