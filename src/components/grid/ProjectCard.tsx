import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  description?: string;
}

export const ProjectCard = ({ title, category, image }: ProjectCardProps) => {
  return (
    <motion.div
      className="group relative rounded-none overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm font-medium text-[#6802C1]">{category}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-[#6802C1] text-white px-6 py-2 rounded-full hover:bg-[#4d018f] transition-colors">
          Ver Proyecto
        </button>
      </div>
    </motion.div>
  );
};