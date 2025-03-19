// FeaturesSection.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
  faExpand,
  faCompress,
  faBolt,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { ProjectData } from "../../data/project";

/**
 * Para la edición dentro de esta sección:
 * - Lee todos los datos desde `project` (sin usar estados internos para title, video, etc.).
 * - Cuando se edite en esta sección, actualiza directamente el estado global con `setProject`.
 *   Así, los cambios se ven reflejados al instante y no se mezclan con viejos defaults locales.
 */

interface FeatureItem {
  icon: string; // o el tipo que uses (React Icons, FontAwesome key, etc.)
  stat: string;
  title: string;
  description: string;
}

interface TechnicalIcon {
  icon: string; // o el tipo que uses
  text: string;
}

interface FeaturesSectionProps {
  // Datos globales de tu proyecto
  project: ProjectData;
  setProject: (data: ProjectData) => void;
  isAdmin?: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ project, setProject, isAdmin }) => {
  const { user } = useAuth();
  // Determina si un usuario logueado es admin (puede ser redundante si ya pasas isAdmin)
  const canEdit = isAdmin || user?.role === "admin";

  // Control de modo edición local
  const [isEditing, setIsEditing] = useState(false);

  // Extrae los datos del proyecto para mayor comodidad
  const {
    featuresTitle = "Ingeniería de Alto Rendimiento",
    featuresSubtitle = "Diseño innovador que supera los sistemas convencionales.",
    featuresVideoUrl = "/public/media/video3.mp4",
    features = [],
    technicalIcons = [],
  } = project;

  // Video y fullscreen
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Listener para saber si salimos de fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* =================
   * FUNCIONES DE EDICIÓN
   * ================= */

  // Guarda cambios (desactiva edición)
  const handleSave = () => {
    setIsEditing(false);
  };

  // Cambiar el video subiendo un archivo
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProject({
        ...project,
        featuresVideoUrl: url,
      });
    }
  };

  // Seccion Features: agregar o eliminar
  const addFeature = () => {
    const updatedFeatures = [
      ...features,
      {
        icon: faBolt.toString(), // Por defecto, un icono
        stat: "Nuevo %",
        title: "Nuevo Título",
        description: "Nueva descripción",
      },
    ];
    setProject({ ...project, features: updatedFeatures });
  };

  const removeFeature = (index: number) => {
    const updated = [...features];
    updated.splice(index, 1);
    setProject({ ...project, features: updated });
  };

  // Seccion TechnicalIcons: agregar o eliminar
  const addTechnicalIcon = () => {
    const updated = [
      ...technicalIcons,
      { icon: faBolt.toString(), text: "Nueva Característica" },
    ];
    setProject({ ...project, technicalIcons: updated });
  };

  const removeTechnicalIcon = (index: number) => {
    const updated = [...technicalIcons];
    updated.splice(index, 1);
    setProject({ ...project, technicalIcons: updated });
  };

  // Actualizar los campos del Feature i-ésimo
  const handleUpdateFeature = (i: number, field: keyof FeatureItem, value: string) => {
    const updated = [...features];
    // El icono se guarda como string (por ejemplo, nombre del icono)
    (updated[i] as any)[field] = value;
    setProject({ ...project, features: updated });
  };

  // Actualizar los campos del TechnicalIcon i-ésimo
  const handleUpdateTechnicalIcon = (i: number, value: string) => {
    const updated = [...technicalIcons];
    updated[i].text = value;
    setProject({ ...project, technicalIcons: updated });
  };

  // Actualizar el título y subtítulo de la sección
  const handleChangeTitle = (newVal: string) => {
    setProject({ ...project, featuresTitle: newVal });
  };
  const handleChangeSubtitle = (newVal: string) => {
    setProject({ ...project, featuresSubtitle: newVal });
  };

  /* =================
   * CONTROLES DE VIDEO
   * ================= */
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

  /* =================
   * RENDER
   * ================= */
  return (
    <section className="py-20 bg-white" id="beneficios">
      <div className="container mx-auto px-4">
        {canEdit && (
          <div className="flex justify-end mb-6">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Guardar
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[var(--color-primario)] text-white rounded-lg hover:bg-[#5a2fc2] transition-colors"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Editar Sección
              </button>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido Textual */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {isEditing && canEdit ? (
                <div className="space-y-4">
                  <input
                    value={featuresTitle}
                    onChange={(e) => handleChangeTitle(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1] text-4xl md:text-6xl font-bold"
                  />
                  <input
                    value={featuresSubtitle}
                    onChange={(e) => handleChangeSubtitle(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1] text-lg md:text-3xl"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                    {featuresTitle}
                  </h3>
                  <p className="text-gray-600 text-lg md:text-3xl">
                    {featuresSubtitle}
                  </p>
                </>
              )}
            </motion.div>

            {/* Items Interactivos (FEATURES) */}
            <div className="space-y-6">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  className="group flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-[var(--color-primario)] transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {isEditing && canEdit ? (
                    <div className="w-full space-y-4">
                      {/* STAT */}
                      <div className="flex justify-between items-center">
                        <input
                          value={item.stat}
                          onChange={(e) => handleUpdateFeature(index, "stat", e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>

                      {/* TITLE */}
                      <input
                        value={item.title}
                        onChange={(e) => handleUpdateFeature(index, "title", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                      />

                      {/* DESCRIPTION */}
                      <textarea
                        value={item.description}
                        onChange={(e) => handleUpdateFeature(index, "description", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="bg-purple-50 p-3 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <span className="text-2xl font-bold text-[var(--color-primario)]">
                          {item.stat}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl md:text-3xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-700 md:text-xl font-medium">
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}

              {/* Botón para agregar nueva Feature */}
              {isEditing && canEdit && (
                <button
                  onClick={addFeature}
                  className="w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Agregar Estadística
                </button>
              )}
            </div>
          </div>

          {/* Contenedor de Video + Íconos Técnicos */}
          <motion.div
            className="relative w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Input para cambiar el video (solo en modo edición) */}
            {isEditing && canEdit && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1]"
                />
              </div>
            )}

            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg group transform hover:scale-[0.98] transition-transform duration-500">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/assets/images/poster.jpg"
              >
                <source src={featuresVideoUrl} type="video/mp4" />
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

            {/* Iconos de Características Técnicas */}
            <div className="flex justify-center gap-8 mt-6">
              {technicalIcons.map((item, index) => (
                <div key={index} className="text-center">
                  {isEditing && canEdit ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          value={item.text}
                          onChange={(e) => handleUpdateTechnicalIcon(index, e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg"
                        />
                        <button
                          onClick={() => removeTechnicalIcon(index)}
                          className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-3 rounded-xl inline-block hover:bg-gray-100 transition-colors">
                        {/* Convertimos el string del icono a algo presentable, si tienes un parser. 
                            Si sigues usando FA icons directos, podrías mapearlos. */}
                        <FontAwesomeIcon
                          icon={item.icon as any}
                          className="w-11 h-11 text-[var(--color-primario)]"
                        />
                      </div>
                      <p className="text-gray-700 mt-2 text-2xl">{item.text}</p>
                    </>
                  )}
                </div>
              ))}
              {isEditing && canEdit && (
                <button
                  onClick={addTechnicalIcon}
                  className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
