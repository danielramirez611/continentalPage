const ContactForm = () => {
  return (
    <section id="contacto" className="py-24 bg-[#F8F8F8]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto llamativo */}
          <div className="text-center lg:text-left">
            <h3 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              ¡Hablemos!
            </h3>
            <p className="text-[var(--color-primario)] text-xl md:text-4xl mb-8">
              ¿Listo para llevar tu proyecto al siguiente nivel? Estamos aquí para ayudarte. Cuéntanos sobre tu idea y nos pondremos en contacto contigo en menos de 24 horas.
            </p>
            <p className="text-gray-600 text-2xl">
              O escríbenos directamente a:{" "}
              <a
                href="mailto:info@algunlado.com"
                className="text-[var(--color-primario)]  hover:text-[#5a2fc2] font-medium transition-colors"
              >
                info@algunlado.com
              </a>
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-lg p-8 sm:p-10">
            <form id="contactForm" className="space-y-8">
              {/* Grupo de Nombre */}
              <div className="space-y-3">
                <label htmlFor="nombre" className="text-xl font-medium text-gray-900">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  className="w-full px-5 py-4 bg-white rounded-none border border-gray-300 focus:border-[var(--color-primario)] focus:ring-2 focus:ring-[var(--color-primario)] outline-none text-black placeholder-gray-500 transition-all text-lg"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              {/* Grupo de Email */}
              <div className="space-y-3">
                <label htmlFor="email" className="text-xl font-medium text-gray-900">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-5 py-4 bg-white rounded-none border border-gray-300 focus:border-[var(--color-primario)] focus:ring-2 focus:ring-[var(--color-primario)] outline-none text-black placeholder-gray-500 transition-all text-lg"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>

              {/* Grupo de Mensaje */}
              <div className="space-y-3">
                <label htmlFor="mensaje" className="text-xl font-medium text-gray-900">
                  Tu Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={6}
                  required
                  className="w-full px-5 py-4 bg-white rounded-none border border-gray-300 focus:border-[var(--color-primario)] focus:ring-2 focus:ring-[var(--color-primario)] outline-none text-black placeholder-gray-500 transition-all resize-none text-lg"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                className="w-full mt-8 bg-[#6802C1] text-white px-6 py-4 rounded-full font-medium hover:bg-[#7b2fc2] transition-all duration-300 text-xl"
              >
                Enviar Mensaje
              </button>
            </form>

            {/* Mensaje de éxito (oculto inicialmente) */}
            <div id="successMessage" className="hidden mt-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 text-center">
              <p>¡Mensaje enviado con éxito!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;