import { motion } from "framer-motion";

const TeamSection = () => {
  const teamMembers = [
    {
      initials: "EF",
      name: "Ing. Eduardo Falla",
      role: "Líder de Proyecto",
      description: "Especialista en fabricación digital.",
    },
    {
      initials: "JC",
      name: "Dr. Juan Cerrón",
      role: "Director Técnico",
      description: "Experto en ingeniería mecánica.",
    },
    {
      initials: "AM",
      name: "Ing. Ana Martínez",
      role: "Diseñadora Industrial",
      description: "Especialista en diseño 3D y prototipado.",
    },
 
  ];

  return (
    <section id="equipo" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.h3
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Equipo de Innovación
          </motion.h3>
          <motion.p
            className="text-[var(--color-primario)] text-lg md:text-2xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Profesionales especializados en fabricación digital e ingeniería industrial.
          </motion.p>
        </div>

        {/* Grid de Miembros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center text-center hover:shadow-xl hover:border-[var(--color-primario)] transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[var(--color-primario)]">
                  {member.initials}
                </span>
              </div>

              {/* Nombre y Rol */}
              <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {member.name}
              </h4>
              <p className="text-[var(--color-primario)] text-sm md:text-base mb-4">
                {member.role}
              </p>

              {/* Descripción */}
              <p className="text-gray-600 text-sm md:text-base">
                {member.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;