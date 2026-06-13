# 🌺 Madeira — Vídeo promocional (Remotion)

Promo vertical **1080×1920**, **~35 s**, 30 fps, estilo moderno y dinámico:
intro con animación de marca, **3 secciones temáticas** (Natureza · Oceano ·
Vida & Sabor), **12 fotos** reales con efecto Ken Burns y dos tipos de plano
(a sangre y tarjeta editorial), tipografía cinética, lower-thirds animados,
barra de progreso, transiciones variadas (slide/wipe/fade), grano de cine y
una outro con tira de miniaturas.

## 🚀 Uso

```bash
npm install
npm run studio     # Remotion Studio: previsualizar y editar en vivo
npm run render     # Renderiza a out/madeira-promo.mp4
```

> En entornos sin descarga de Chromium, pásale un navegador instalado:
> `npx remotion render Madeira out/madeira-promo.mp4 --browser-executable=/ruta/a/chrome`

## ✍️ Editar el vídeo

Todo el guion está en **`src/scenes.ts`**: orden de fotos, textos (`kicker`,
`title`, `meta`), color de acento, layout (`full` | `card`), dirección del
Ken Burns y duración de cada clip. Cambia ahí lo que quieras.

- **Añadir/cambiar fotos:** coloca los archivos en `public/photos/` y apunta el
  campo `image` de cada clip a la ruta correspondiente.
- **Reprocesar fotos** (orientación EXIF + optimización): edita el mapa en
  `scripts/process-photos.mjs` y ejecuta `node scripts/process-photos.mjs`.
- **Colores y tipografía:** `src/theme.ts`.
- **Música (opcional):** pon `public/music.mp3` y añade en `src/MadeiraVideo.tsx`
  `import {Audio} from 'remotion'` y `<Audio src={staticFile('music.mp3')} />`.

## 🗂️ Estructura

```
src/
  index.ts          # registerRoot
  Root.tsx          # Composición "Madeira" (tamaño, fps, duración)
  scenes.ts         # ⭐ Guion: secciones, clips, textos, tiempos
  theme.ts          # Paleta y tipografía
  graphics.tsx      # UI: tipografía cinética, chips, brackets, progreso, grano
  MadeiraVideo.tsx  # Intro, secciones, clips (full/card), outro y montaje
public/photos/      # Fotos (ya orientadas y optimizadas)
scripts/
  process-photos.mjs# Auto-orienta + optimiza las fotos de origen
```

> Nota: usa **fuentes del sistema** (no Google Fonts) para que el render no
> dependa de la red.
