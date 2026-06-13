# Tus fotos y vídeos de Madeira

Coloca aquí tus archivos de imagen (`.jpg`, `.png`) o vídeo (`.mp4`).

Después, abre `src/scenes.ts` y rellena el campo `image` de cada escena con la
ruta relativa a `public/`. Por ejemplo, si copias `funchal.jpg` en esta carpeta:

```ts
{
  image: 'photos/funchal.jpg',
  title: 'Funchal',
  ...
}
```

Mientras el campo `image` esté vacío, se mostrará un degradado de marcador de
posición para que el vídeo se pueda renderizar sin tus archivos.

## Música (opcional)

Coloca un `music.mp3` en `public/` y descomenta el bloque `<Audio ... />`
dentro de `src/MadeiraVideo.tsx`.
