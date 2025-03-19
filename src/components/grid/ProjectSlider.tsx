import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { useAuth } from "../../context/AuthContext";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

interface ProjectSliderProps {
  title: string;
  projects: Project[];
  onDeleteProject: (index: number) => void;
  onEditProject: (index: number, updatedProject: Project) => void;
  isAdmin: boolean;
}

export const ProjectSlider = ({
  title,
  projects,
  onDeleteProject,
  onEditProject,
  isAdmin,
}: ProjectSliderProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [updatedProject, setUpdatedProject] = useState<Partial<Project>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setUpdatedProject(projects[index]);
  };

  const handleSave = () => {
    if (editingIndex !== null && updatedProject.title && updatedProject.category && updatedProject.image) {
      onEditProject(editingIndex, updatedProject as Project);
      setEditingIndex(null);
      setUpdatedProject({});
      setImagePreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUpdatedProject({ ...updatedProject, image: url });
      setImagePreview(url);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>

          <div className="flex gap-4">
            <button
              ref={prevRef}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors hover:scale-105"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-2xl text-[#6802C1]"
              />
            </button>
            <button
              ref={nextRef}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors hover:scale-105"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-2xl text-[#6802C1]"
              />
            </button>
          </div>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{ clickable: true }}
          onSwiper={setSwiperInstance}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {projects.map((project, index) => (
            <SwiperSlide key={project.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors hover:scale-110"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-xl text-blue-600"
                      />
                    </button>
                    <button
                      onClick={() => onDeleteProject(index)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors hover:scale-110"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-xl text-red-600"
                      />
                    </button>
                  </div>
                )}
                <ProjectCard {...project} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Modal de Edición */}
        <AnimatePresence>
          {editingIndex !== null && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl p-6 max-w-md w-full space-y-6"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-bold mb-6">Editar Proyecto</h3>
                <div className="space-y-4">
                  <input
                    value={updatedProject.title ?? ""}
                    onChange={(e) =>
                      setUpdatedProject({
                        ...updatedProject,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1]"
                    placeholder="Título"
                  />
                  <input
                    value={updatedProject.category ?? ""}
                    onChange={(e) =>
                      setUpdatedProject({
                        ...updatedProject,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1]"
                    placeholder="Categoría"
                  />
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border border-gray-200 rounded-lg"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </div>
                  <textarea
                    value={updatedProject.description ?? ""}
                    onChange={(e) =>
                      setUpdatedProject({
                        ...updatedProject,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1]"
                    placeholder="Descripción"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-[#6802C1] text-white rounded-lg hover:bg-[#4d018f] transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};