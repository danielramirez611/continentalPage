// ProjectCard.tsx
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  description?: string;
  onClick?: () => void;
}

export const ProjectCard = ({
  title,
  category,
  image,
  onClick,
}: ProjectCardProps) => {
  return (
    <motion.div
      className="group relative w-full aspect-square rounded-none overflow-hidden 
                 shadow-md hover:shadow-xl bg-white transition"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Imagen de fondo con zoom al hover */}
      <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        />
      </div>

      {/* Categoría (flotante en la parte superior izquierda) */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded 
                      opacity-0 group-hover:opacity-100 transition duration-300">
        {category}
      </div>

      {/* Franja inferior morada con el título */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-8 
                   bg-[var(--color-primario)] text-white flex items-center justify-between
                   translate-y-full group-hover:translate-y-0 transition-transform duration-300"
      >
        <span className="font-semibold w-5/6 truncate">
          {title}
        </span>
        <FiArrowRight className="w-5 h-5" />
      </div>
    </motion.div>
  );
};
