import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ProjectData } from "../data/project";

interface NavbarProps {
  project: ProjectData; // Recibe el estado del proyecto
}

const Navbar = ({ project }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  // Función para desplazarse a una sección
  const handleScrollTo = (target: string) => {
    const element = document.getElementById(target);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveLink(target);
      setMenuOpen(false);
    }
  };

  // Efecto para detectar la sección activa al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
      const sections = [
        "hero",
        "ventajas",
        "beneficios",
        "workflowSection",
        "equipo",
        "contacto",
      ];
      let foundSection = "hero";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            foundSection = section;
            break;
          }
        }
      }

      setActiveLink(foundSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enlaces del Navbar (filtrados según las secciones activas)
  const navLinks = [
    { name: "Inicio", target: "hero" },
    project.showAdvantages && { name: "Ventajas", target: "ventajas" },
    project.showFeatures && { name: "Beneficios", target: "beneficios" },
    project.showWorkflow && { name: "Proceso", target: "workflowSection" },
    project.showTeam && { name: "Equipo", target: "equipo" },
    project.showContact && { name: "Contacto", target: "contacto" },
  ].filter(Boolean); // Filtra los enlaces que no están activos

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="w-40">
          <img
            src={
              scrolled
                ? "/assets/images/conti-negro.png"
                : "/assets/images/conti-blanco.png"
            }
            alt="Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Menú en pantallas grandes */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleScrollTo(link.target)}
              className={`text-3xl font-medium transition-colors hover:text-[#6802C1] duration-300 cursor-pointer ${
                scrolled ? "text-gray-800" : "text-white"
              } ${
                activeLink === link.target
                  ? "text-[#6802C1]"
                  : "hover:text-[var(--color-primario)]"
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Botón de menú hamburguesa en móviles */}
        {!menuOpen && (
          <button
            className={`md:hidden text-3xl transition-colors duration-300 ${
              scrolled ? "text-gray-800" : "text-white"
            }`}
            onClick={() => setMenuOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
      </div>

      {/* Fondo para cerrar el menú al hacer clic afuera */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Menú móvil */}
      <div
        className={`fixed top-0 left-0 w-2/3 h-screen bg-white shadow-md transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex flex-col items-center pt-10`}
      >
        {/* Botón para cerrar el menú */}
        <button
          className="absolute top-4 right-4 text-3xl text-gray-800"
          onClick={() => setMenuOpen(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Logo en el menú móvil */}
        <div className="w-40 mb-6">
          <img
            src="/assets/images/conti-negro.png"
            alt="Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Enlaces del menú */}
        <nav className="flex flex-col items-center space-y-6">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleScrollTo(link.target)}
              className={`text-3xl font-semibold transition-colors duration-300 ${
                activeLink === link.target
                  ? "text-[var(--color-primario)]"
                  : "text-gray-800 hover:text-[var(--color-primario)]"
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;