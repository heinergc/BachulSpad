/* Configuración editable de Bachúl Spa y Estética.
   Para activar WhatsApp en una sede, escribí el número solo con dígitos
   (código de país incluido), por ejemplo "50612345678". Mientras el valor
   esté vacío, no se muestra ningún botón de WhatsApp. */
window.BACHUL_CONFIG = {
  business: "Bachúl Spa y Estética",
  // Botones "Solicitar cita": abren este WhatsApp con el mensaje indicado.
  citaWhatsapp: "50683180003",
  citaMensaje: "Hola, quisiera solicitar una cita en Bachúl Spa y Estética.",
  sedes: {
    cartago: {
      name: "Cartago",
      phoneDisplay: "+506 2552 1010",
      phoneHref: "tel:+50625521010",
      instagram: "https://www.instagram.com/bachul_spa/",
      instagramHandle: "@bachul_spa",
      whatsapp: "50683180003"
    },
    paseo: {
      name: "Paseo Colón",
      phoneDisplay: "+506 7237 3736",
      phoneHref: "tel:+50672373736",
      instagram: "https://www.instagram.com/bachul_paseo_colon/",
      instagramHandle: "@bachul_paseo_colon",
      whatsapp: "50672528996"
    }
  }
};
