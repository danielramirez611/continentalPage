import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "../../WorkflowSection.module.css";
import "swiper/swiper-bundle.css";
import Diseño from "../../../public/assets/images/DiseñoI.png";
import ModelCad from "../../../public/assets/images/ModelCad.png";
import Piezas from "../../../public/assets/images/3dprinter.jpg";
import Corte from "../../../public/assets/images/CorteL.png";
import Final from "../../../public/assets/images/PFina.png";

const WorkflowSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const swiperNavPrevRef = useRef(null);
  const swiperNavNextRef = useRef(null);
  const swiperPaginationRef = useRef(null);
  const slides = [
    {
      image: Diseño,
      title: "Diseño Conceptual",
      description:
        "Modelado 3D inicial con especificaciones técnicas detalladas.",
    },
    {
      image: ModelCad,
      title: "Ingeniería CAD",
      description:
        "Desarrollo de planos técnicos y simulaciones de funcionamiento.",
    },
    {
      image: Corte,
      title: "Fabricación Digital",
      description: "Corte láser de precisión y mecanizado CNC.",
    },
    {
      image: Piezas,
      title: "Prototipado Rápido",
      description: "Producción de piezas para prototipos funcionales.",
    },
    {
      image: Final,
      title: "Control de Calidad",
      description: "Validación del diseño y rendimiento del producto final.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="workflowSection"
      className="py-20 overflow-hidden"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Nuestro Proceso Creativo
          </h3>
          <p className="text-[#6802C1] text-lg md:text-2xl max-w-3xl mx-auto">
            De la idea a la realidad: un workflow de precisión industrial.
          </p>
        </div>

        {/* Slider Container */}
        <div
          className={`transition-all duration-700 ease-out delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: swiperNavPrevRef.current,
              nextEl: swiperNavNextRef.current,
            }}
            pagination={{
              clickable: true,
              el: swiperPaginationRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = swiperNavPrevRef.current;
                swiper.params.navigation.nextEl = swiperNavNextRef.current;
              }
              if (
                swiper.params.pagination &&
                typeof swiper.params.pagination !== "boolean"
              ) {
                swiper.params.pagination.el = swiperPaginationRef.current;
              }
            }}
            loop
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                      {slide.title}
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Flechas de Navegación - Versión corregida */}
          <div ref={swiperNavPrevRef} className={`${styles.swiperButtonPrev}`}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="w-8 h-8 p-2 rounded-full bg-white shadow-lg"
              style={{ color: "#6802C1" }}
            />
          </div>
          <div ref={swiperNavNextRef} className={`${styles.swiperButtonNext}`}>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-8 h-8 p-2 rounded-full bg-white shadow-lg"
              style={{ color: "#6802C1" }}
            />
          </div>

          {/* Paginación */}
          <div ref={swiperPaginationRef} className={`${styles.swiperPagination}`}></div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
