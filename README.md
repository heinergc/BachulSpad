# Bachúl Spa y Estética — Landing page

Página de una sola pantalla en HTML, CSS y JavaScript, sin dependencias ni proceso de compilación. Lista para publicarse con GitHub Pages.

## Ver la página

**Localmente:** abrí una terminal en esta carpeta y ejecutá `python3 -m http.server 8000`; luego entrá a `http://localhost:8000`.

**En GitHub Pages:**
1. En el repositorio: **Settings → Pages**.
2. En *Build and deployment*, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. Guardá. En un par de minutos la página queda en `https://lksa2014.github.io/BachulSpad/`.

## Estructura

```
index.html              Contenido y estructura
assets/css/styles.css   Estilos (paleta tomada del logotipo)
assets/js/config.js     Teléfonos, Instagram y WhatsApp de cada sede
assets/js/main.js       Menú, pestañas, visor de imágenes y bloque de contacto
assets/img/             Logotipo, fotografías e íconos
assets/fonts/           Instrument Serif e Inter (alojadas localmente)
```

## Cómo se edita

- **Teléfonos e Instagram:** `assets/js/config.js` (para la sección de contacto) y `index.html` (tarjetas de sedes, pie de página y datos estructurados para buscadores). Si cambiás un número, actualizá los tres lugares.
- **WhatsApp:** está preparado pero apagado. Cuando se confirme el número de cada sede, escribilo en `config.js` (solo dígitos, con código de país, por ejemplo `"50612345678"`) y los botones aparecen solos.
- **Fotografías:** reemplazá los archivos de `assets/img/` conservando el nombre, o editá las etiquetas `<img>` de la galería. Las imágenes se pueden ampliar en el visor.
- **Servicios:** cada tarjeta de `index.html` con `data-service` alimenta también el selector del formulario.

## Pendientes de confirmar (no aparecen en la página pública)

- **Teléfono de Cartago.** Los datos del solicitante indican +506 2552 1010; los afiches muestran 8318 0003. La página usa el primero.
- **Sedes.** Los afiches mencionan también una sede en Pérez Zeledón (7123 9639); el documento de la solicitud solo lista Cartago y Paseo Colón. La página muestra solo esas dos.
- **WhatsApp.** Los afiches muestran ícono de WhatsApp junto a 8318 0003, 7123 9639 y 7252 8996. No se activó nada hasta que se confirme.
- **Segundo teléfono de Paseo Colón.** Los afiches muestran 7252 8996 además de 7237 3736.
- **Precios y promociones.** No se publicaron: los afiches tienen vigencia limitada (octubre, diciembre) y la solicitud pide no incluir precios no confirmados.
- **Direcciones exactas, horarios y enlaces de mapas** de cada sede.
- **Fotografías propias** de las instalaciones y del equipo. Las imágenes actuales son recortes de los afiches (sin texto) y tienen resolución limitada.
- **Logotipo original** en vector o PNG con fondo transparente. El usado se extrajo del archivo JPG recibido.
- **Reels de Facebook.** Se enlazan como "Ver en Facebook"; no se incrustan.

## Calidad

Revisada en escritorio (1440 px) y móvil (390 px): navegación por teclado, foco visible, contraste, movimiento reducido, imágenes con texto alternativo y sin desbordes horizontales. El bloque de contacto **no envía** formularios: arma un mensaje que se copia o se usa al llamar o escribir por Instagram.
