# 🌺 Vídeo de vacaciones en Madeira — Remotion

Vídeo cinemático de prueba (vertical **1080×1920**, **30 s**, 30 fps) creado con
[Remotion](https://www.remotion.dev/). Pensado para Reels / TikTok / Stories.

Incluye intro, 6 escenas de localizaciones de Madeira con efecto **Ken Burns**
(zoom + paneo) y fundidos cinemáticos, y una tarjeta final.

## 🚀 Uso

```bash
npm install
npm run studio     # Abre Remotion Studio para previsualizar y editar en vivo
npm run render     # Renderiza a out/madeira.mp4
```

## 🖼️ Añadir TUS fotos y vídeos de Madeira

Ahora mismo el vídeo usa **degradados de marcador de posición** para poder
renderizar sin archivos. Para poner tus fotos:

1. Copia tus imágenes/vídeos en `public/photos/`.
2. Abre `src/scenes.ts` y rellena el campo `image` de cada escena con la ruta
   relativa a `public/`, por ejemplo:

   ```ts
   {
     image: 'photos/funchal.jpg',
     title: 'Funchal',
     subtitle: 'La capital, entre flores y mar',
     ...
   }
   ```

3. (Opcional) Pon música en `public/music.mp3` y descomenta el bloque
   `<Audio ... />` en `src/MadeiraVideo.tsx`.

Puedes cambiar libremente títulos, subtítulos, duración (`durationInFrames`),
colores y la dirección del efecto Ken Burns (`'in' | 'out' | 'left' | 'right'`).

## ⚙️ Render en entornos sin descarga de Chromium

Si el entorno bloquea la descarga del navegador de Remotion, usa un Chromium ya
instalado con `--browser-executable`:

```bash
npx remotion render Madeira out/madeira.mp4 \
  --browser-executable=/ruta/a/chrome
```

> Nota: este proyecto usa **fuentes del sistema** (serif/sans) en lugar de
> Google Fonts para no depender de la red durante el render.

## 🗂️ Estructura

```
src/
  index.ts          # Punto de entrada (registerRoot)
  Root.tsx          # Composición "Madeira" (tamaño, fps, duración)
  scenes.ts         # ⭐ Configura aquí tus escenas, fotos y textos
  MadeiraVideo.tsx  # Lógica visual: Ken Burns, transiciones, intro/outro
public/photos/      # Coloca aquí tu media
```
