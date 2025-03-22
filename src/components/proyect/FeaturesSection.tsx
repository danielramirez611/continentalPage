import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthContext";
import { getFeatures, getStats, getProjectExtras } from "../../../api";
import {
  faEdit,
  faTrash,
  faTrophy,
  faStar,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

// Mapeo de iconos para las estadísticas
const iconMap: Record<string, any> = {
  FiZap: faStar, // 🔹 Mapea correctamente FiZap a faStar
  Chart: faChartBar,
  Trophy: faTrophy,
};

interface Feature {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  media_type: string;
  media_url: string;
}

interface Extra {
  id: number;
  title: string;
  stat?: string;
  description?: string;
}

interface Stat {
  id: number;
  icon_key: string;
  title: string;
  text: string;
}

interface FeaturesSectionProps {
  projectId?: number;
  onEdit: (featureId: number) => void;
  onDelete: (featureId: number) => void;
}

export const FeaturesSection = ({ projectId, onEdit, onDelete }: FeaturesSectionProps) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [featuresVideoUrl, setFeaturesVideoUrl] = useState<string>("");

  useEffect(() => {
    if (typeof projectId === "number" && !isNaN(projectId)) {
      fetchData();
    } else {
      console.error("❌ projectId no válido o no recibido:", projectId);
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      if (!projectId || isNaN(projectId)) throw new Error("ID de proyecto inválido");

      const featuresData = await getFeatures(projectId);
      const extrasData = await getProjectExtras(projectId);
      const statsData = await getStats(projectId);

      setFeatures(featuresData);
      setExtras(extrasData);
      setStats(statsData);

      // Obtener el primer video disponible
      const videoFeature = featuresData.find((feature) => feature.media_type === "video");
      if (videoFeature) {
        setFeaturesVideoUrl(videoFeature.media_url);
      }
    } catch (error) {
      console.error("❌ Error al obtener datos:", error);
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
            Características del Proyecto
          </motion.h3>
        </div>

        {!projectId || isNaN(projectId) ? (
          <p className="text-red-500 text-center font-bold">
            ❌ Error: No se pudo cargar la información del proyecto.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* 🟢 SECCIÓN DE CARACTERÍSTICAS */}
            <div className="lg:col-span-1 space-y-6">
              <AnimatePresence>
                {features.length === 0 ? (
                  <p className="text-gray-500 text-center">No hay características registradas.</p>
                ) : (
                  features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      className="p-6 bg-white border rounded-xl hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* 🔹 Opciones para Admin */}
                      {user?.role === "admin" && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button onClick={() => onEdit(feature.id)} className="text-blue-600 hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={() => onDelete(feature.id)} className="text-red-600 hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      )}

                      {/* 🔹 Título y Subtítulo */}
                      <h4 className="text-xl font-bold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-700">{feature.subtitle}</p>

                      {/* 🔹 Descripción */}
                      <p className="text-gray-600">{feature.description}</p>

                      {/* 🔹 Estado */}
                      <span className="text-lg font-semibold text-purple-500">{feature.stat}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* 🟢 SECCIÓN DEL VIDEO */}
            <div className="lg:col-span-1">
              {featuresVideoUrl ? (
                <motion.div
                  className="relative w-full rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <video ref={videoRef} className="w-full h-auto object-cover rounded-lg" autoPlay muted loop playsInline src={featuresVideoUrl} />
                </motion.div>
              ) : (
                <p className="text-gray-500 text-center">No hay videos disponibles.</p>
              )}
            </div>

            {/* 🟢 SECCIÓN DE EXTRAS Y ESTADÍSTICAS */}
            <div className="lg:col-span-1 space-y-6">
              {/* 🔹 Extras */}
              <div className="p-6 bg-gray-100 border rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Extras</h4>
                {extras.length === 0 ? (
                  <p className="text-gray-500">No hay extras registrados.</p>
                ) : (
                  extras.map((extra) => (
                    <div key={extra.id} className="p-2 border-b last:border-b-0">
                      <h5 className="font-semibold">{extra.title}</h5>
                      {extra.description && <p className="text-gray-700">{extra.description}</p>}
                      {extra.stat && <span className="text-purple-500">{extra.stat}</span>}
                    </div>
                  ))
                )}
              </div>

              {/* 🔹 Estadísticas */}
              <div className="p-6 bg-gray-100 border rounded-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Estadísticas</h4>
                {stats.length === 0 ? (
                  <p className="text-gray-500">No hay estadísticas registradas.</p>
                ) : (
                  stats.map((stat) => (
                    <div key={stat.id} className="flex items-center space-x-4 p-3 border-b last:border-b-0">
                      {/* 🔹 Icono correctamente renderizado */}
                      <FontAwesomeIcon icon={iconMap[stat.icon_key] || faChartBar} className="text-3xl text-primary" />

                      {/* 🔹 Contenido textual alineado */}
                      <div>
                        <h5 className="font-semibold text-gray-900">{stat.title}</h5>
                        <p className="text-gray-700">{stat.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};



