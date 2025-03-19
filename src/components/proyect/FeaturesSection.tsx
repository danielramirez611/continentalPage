import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
  faExpand,
  faCompress,
  faBolt,
  faCheckCircle,
  faCogs,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de importar el contexto de autenticación

interface FeatureItem {
  icon: any;
  stat: string;
  title: string;
  description: string;
}

interface TechnicalIcon {
  icon: any;
  text: string;
}

interface FeaturesSectionProps {
  isAdmin?: boolean;
  onSave?: (newData: {
    title: string;
    subtitle: string;
    videoUrl: string;
    features: FeatureItem[];
    technicalIcons: TechnicalIcon[];
  }) => void;
}

const FeaturesSection = ({ onSave }: FeaturesSectionProps) => {
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación
  const isAdmin = user?.role === "admin"; // Verifica si el usuario es administrador
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado para los datos editables
  const [title, setTitle] = useState("Ingeniería de Alto Rendimiento");
  const [subtitle, setSubtitle] = useState(
    "Diseño innovador que supera los sistemas convencionales."
  );
  const [videoUrl, setVideoUrl] = useState("/public/media/video3.mp4");
  const [features, setFeatures] = useState<FeatureItem[]>([
    {
      icon: faBolt,
      stat: "85%",
      title: "Eficiencia Maximizada",
      description:
        "Flujo de trabajo optimizado con automatización inteligente.",
    },
    {
      icon: faCheckCircle,
      stat: "60%",
      title: "Operación Continua",
      description: "Sistema autónomo con mantenimiento predictivo.",
    },
    {
      icon: faCogs,
      stat: "5x",
      title: "Adaptabilidad Total",
      description: "Configuraciones múltiples para diferentes materiales.",
    },
  ]);
  const [technicalIcons, setTechnicalIcons] = useState<TechnicalIcon[]>([
    { icon: faBolt, text: "Alto Rendimiento" },
    { icon: faCheckCircle, text: "Operación Autónoma" },
    { icon: faCogs, text: "Adaptabilidad" },
  ]);

  // Funciones de control de video
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

  // Funciones de edición
  const handleSave = () => {
    if (onSave) {
      onSave({
        title,
        subtitle,
        videoUrl,
        features,
        technicalIcons,
      });
    }
    setIsEditing(false);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Funciones para agregar/eliminar stats
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        icon: faBolt,
        stat: "Nuevo %",
        title: "Nuevo Título",
        description: "Nueva descripción",
      },
    ]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  // Funciones para agregar/eliminar iconos técnicos
  const addTechnicalIcon = () => {
    setTechnicalIcons([
      ...technicalIcons,
      { icon: faBolt, text: "Nueva Característica" },
    ]);
  };

  const removeTechnicalIcon = (index: number) => {
    const newIcons = technicalIcons.filter((_, i) => i !== index);
    setTechnicalIcons(newIcons);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <section className="py-20 bg-white" id="beneficios">
      <div className="container mx-auto px-4">
        {isAdmin && ( // Solo muestra los botones de edición si el usuario es admin
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
              {isEditing && isAdmin ? ( // Solo permite editar si el usuario es admin
                <div className="space-y-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1] text-4xl md:text-6xl font-bold"
                  />
                  <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6802C1] text-lg md:text-3xl"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-lg md:text-3xl">
                    {subtitle}
                  </p>
                </>
              )}
            </motion.div>

            {/* Items Interactivos */}
            <div className="space-y-6">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  className="group flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-[var(--color-primario)] transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {isEditing && isAdmin ? ( // Solo permite editar si el usuario es admin
                    <div className="w-full space-y-4">
                      <div className="flex justify-between items-center">
                        <input
                          value={item.stat}
                          onChange={(e) => {
                            const newFeatures = [...features];
                            newFeatures[index].stat = e.target.value;
                            setFeatures(newFeatures);
                          }}
                          className="w-full p-2 border border-gray-200 rounded-lg"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                      <input
                        value={item.title}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index].title = e.target.value;
                          setFeatures(newFeatures);
                        }}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index].description = e.target.value;
                          setFeatures(newFeatures);
                        }}
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
              {isEditing &&
                isAdmin && ( // Botón para agregar nueva estadística
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

          {/* Contenedor de Video */}
          <motion.div
  className="relative w-full max-w-4xl mx-auto"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
>
  {/* Input para cambiar el video (solo en modo edición) */}
  {isEditing && isAdmin && (
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
      <source src={videoUrl} type="video/mp4" />
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
                  {isEditing && isAdmin ? ( // Solo permite editar si el usuario es admin
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          value={item.text}
                          onChange={(e) => {
                            const newIcons = [...technicalIcons];
                            newIcons[index].text = e.target.value;
                            setTechnicalIcons(newIcons);
                          }}
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
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="w-11 h-11 text-[var(--color-primario)]"
                        />
                      </div>
                      <p className="text-gray-700 mt-2 text-2xl">{item.text}</p>
                    </>
                  )}
                </div>
              ))}
              {isEditing &&
                isAdmin && ( // Botón para agregar nuevo ícono técnico
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
