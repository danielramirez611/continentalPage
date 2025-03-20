// ProjectSlider.tsx
import React from "react";
import { ProjectCard } from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

interface ProjectSliderProps {
  title?: string;
  projects: Project[];
  onDeleteProject?: (projectIndex: number) => void;
  onEditProject?: (projectIndex: number, updatedProject: Project) => void;
  isAdmin?: boolean;
}

export const ProjectSlider: React.FC<ProjectSliderProps> = ({
  title,
  projects,
  onDeleteProject,
  onEditProject,
  isAdmin,
}) => {
  return (
    <section className="py-10 px-4 md:px-8 lg:px-16">
      {title && (
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>
      )}

      {/* Grilla Responsive (tarjetas más grandes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard
                title={project.title}
                category={project.category}
                image={project.image}
                onClick={() => {
                  // Podrías redirigir a la página de detalle
                  console.log("Ir al proyecto:", project.id);
                }}
              />
              {/* Botones de edición/ eliminación, sólo si admin */}
              {isAdmin && (
                <div className="mt-2 flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      if (onDeleteProject) onDeleteProject(index);
                    }}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      if (onEditProject) {
                        const updatedProject = {
                          ...project,
                          title: project.title + " (Editado)",
                        };
                        onEditProject(index, updatedProject);
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
                  >
                    Editar
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
