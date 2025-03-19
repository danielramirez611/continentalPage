// components/proyect/FeaturesSection.tsx
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthContext";
import { ProjectData, Stat } from "../../data/project";
import {
  faCompress,
  faEdit,
  faExpand,
  faPause,
  faPlay,
  faTrash,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

interface FeaturesSectionProps {
  featuresTitle: string;
  featuresSubtitle: string;
  features: {
    icon: React.ReactNode; // Cambiar de `any` a `React.ReactNode`
    title: string;
    description: string;
    stat: string;
  }[];
  stats?: Stat[]; // Hacer stats opcional con un valor por defecto
  featuresVideoUrl: string;
  onEdit: () => void;
  onDelete: (index: number) => void;
}

export const FeaturesSection = ({
  featuresTitle,
  featuresSubtitle,
  features,
  stats = [], // Valor por defecto: array vacío
  featuresVideoUrl,
  onEdit,
  onDelete,
}: FeaturesSectionProps) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <section className="py-10 bg-white" id="caracteristicas">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.h3
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {featuresTitle}
          </motion.h3>
          <motion.p
            className="text-gray-600 text-lg md:text-2xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {featuresSubtitle}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido Textual */}
          <div className="space-y-8">
            <AnimatePresence>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group flex flex-col space-y-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  layout
                >
                  {user?.role === "admin" && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={onEdit}
                        className="p-1 hover:text-blue-600"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => onDelete(index)}
                        className="p-1 hover:text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-50 p-3 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <span className="text-[var(--color-primario)] text-xl font-semibold">
                        {feature.stat}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-700 md:text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Contenedor de Video */}
          <motion.div
            className="relative w-full max-w-4xl mt-24 mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-lg group transform hover:scale-[0.98] transition-transform duration-500">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                src={featuresVideoUrl}
              >
                Tu navegador no soporta videos HTML5.
              </video>

              {/* Overlay y Controles Personalizados */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent flex items-end p-6">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayPause}
                      className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className="w-6 h-6 text-white"
                      />
                    </button>
                    <button
                      onClick={toggleMute}
                      className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={isMuted ? faVolumeMute : faVolumeUp}
                        className="w-6 h-6 text-white"
                      />
                    </button>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={isFullscreen ? faCompress : faExpand}
                      className="w-6 h-6 text-white"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Estadísticas e Íconos debajo del video */}
            <div className="flex justify-center gap-8 mt-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center flex-1 flex flex-col items-center"
                >
                  <div className="bg-gray-50 text-primario p-3 rounded-xl inline-block hover:bg-gray-100 transition-colors">
                    {stat.icon} {/* Renderizar el ícono directamente */}
                  </div>
                  <p className="text-gray-700 mt-2 text-lg flex-grow">
                    {stat.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
