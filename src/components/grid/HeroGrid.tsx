import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage: string;
  ctaButtons?: ReactNode;
  isAdmin?: boolean;
  onSave?: (newData: { title: string; description: string; image: string }) => void;
}

export const HeroGrid = ({
  title,
  description,
  backgroundImage,
  ctaButtons,
  isAdmin = false,
  onSave,
}: HeroSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      // Simular carga de imagen
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (updatedTitle.trim() && updatedDescription.trim()) {
      onSave?.({
        title: updatedTitle,
        description: updatedDescription,
        image: imagePreview || backgroundImage
      });
      setIsEditing(false);
    } else {
      // Animación de error
      document.querySelectorAll('.hero-edit-input').forEach(input => {
        if (!input.value) {
          input.parentElement?.classList.add('animate-shake');
          setTimeout(() => input.parentElement?.classList.remove('animate-shake'), 500);
        }
      });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-start text-left text-white overflow-hidden px-4">
      {/* Fondo de la imagen con efecto de edición */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('${imagePreview || backgroundImage}')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isAdmin && (
          <motion.label
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 cursor-pointer transition-opacity"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={!isEditing}
            />
            <motion.div
              animate={isUploading ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl"
            >
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-white/50 border-t-white rounded-full" />
              ) : (
                <FontAwesomeIcon icon={faUpload} className="text-4xl opacity-75" />
              )}
            </motion.div>
          </motion.label>
        )}
      </motion.div>

      <div className="absolute inset-0 bg-black/30 z-10" />

      <LayoutGroup>
        <motion.div
          className="relative z-20 max-w-4xl px-4 md:px-6 flex flex-col items-start space-y-8"
          layout
        >
          {isAdmin && (
            <motion.div
              className="flex gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-green-500/80 backdrop-blur-sm rounded-lg"
                    onClick={handleSave}
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg"
                    onClick={() => setIsEditing(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <input
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="hero-edit-input w-full bg-transparent text-5xl md:text-7xl xl:text-8xl font-black border-b-2 border-white/50 focus:outline-none focus:border-white"
                />
              </motion.div>
            ) : (
              <motion.h1
                key="title"
                className="text-5xl md:text-7xl xl:text-8xl font-black leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {updatedTitle}
              </motion.h1>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-desc"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <textarea
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  className="hero-edit-input w-full bg-transparent text-xl md:text-2xl border-b-2 border-white/50 focus:outline-none focus:border-white resize-none"
                  rows={3}
                />
              </motion.div>
            ) : (
              <motion.p
                key="description"
                className="text-xl md:text-2xl max-w-2xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {updatedDescription}
              </motion.p>
            )}
          </AnimatePresence>

          {ctaButtons && (
            <motion.div
              className="flex flex-col md:flex-row gap-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {ctaButtons}
            </motion.div>
          )}
        </motion.div>
      </LayoutGroup>
    </section>
  );
};