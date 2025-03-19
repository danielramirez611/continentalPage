import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface Advantage {
  title: string;
  description: string;
  icon: React.ReactNode;
  stat: string;
}

interface AdvantagesSectionProps {
  title: string;
  subtitle: string;
  advantages: Advantage[];
  onEdit: () => void;
  onDelete: (index: number) => void;
}

export const AdvantagesSection = ({
  title,
  subtitle,
  advantages,
  onEdit,
  onDelete
}: AdvantagesSectionProps) => {
  const { user } = useAuth();

  return (
    <section id="ventajas" className="py-20 bg-[#F8F8F8]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h3
            className="text-7xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h3>
          
          <motion.p
            className="text-gray-600 text-lg md:text-3xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <AnimatePresence>
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                className="relative bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                {user?.role === "admin" && (
                  <div className="absolute top-2 right-2 flex gap-2 bg-white/90 p-1 rounded-full">
                    <button 
                      onClick={onEdit}
                      className="p-1 hover:text-blue-600 transition-colors"
                      aria-label="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="p-1 hover:text-red-600 transition-colors"
                      aria-label="Eliminar"
                    >
                      <FiTrash />
                    </button>
                  </div>
                )}

                <div className="w-20 h-20 text-primario  bg-purple-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {advantage.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {advantage.title}
                </h4>
                <p className="text-gray-600 mb-6 text-center">
                  {advantage.description}
                </p>
                <div className="bg-purple-50 rounded-xl p-4 w-full text-center">
                  <span className="text-[var(--color-primario)] font-semibold">
                    {advantage.stat}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};