// ============================================================================
//  CONFIGURACIÓN DE ESCENAS — Vídeo de vacaciones en Madeira
// ----------------------------------------------------------------------------
//  Para usar TUS fotos/vídeos:
//   1. Copia tus archivos dentro de la carpeta `public/photos/`.
//   2. En cada escena, rellena el campo `image` con la ruta relativa a
//      `public/`. Ejemplo:  image: 'photos/funchal.jpg'
//   3. (Opcional) Pon música en `public/music.mp3` (ver src/MadeiraVideo.tsx).
//
//  Mientras `image` esté vacío se mostrará un degradado de marcador de
//  posición (placeholder) para que el vídeo renderice sin tus archivos.
// ============================================================================

export type Scene = {
  /** Ruta a tu imagen/foto dentro de public/. Vacío = placeholder con degradado. */
  image?: string;
  /** Nombre del lugar (título grande). */
  title: string;
  /** Frase descriptiva (subtítulo). */
  subtitle: string;
  /** Duración de la escena en frames (30 fps → 30 frames = 1 s). */
  durationInFrames: number;
  /** Colores del degradado placeholder [arriba, abajo]. */
  gradient: [string, string];
  /** Dirección del efecto Ken Burns (zoom + paneo). */
  kenBurns: 'in' | 'out' | 'left' | 'right';
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Duración del cruce/fundido entre escenas (en frames). */
export const TRANSITION_FRAMES = 20;

export const scenes: Scene[] = [
  {
    image: '', // p.ej. 'photos/funchal.jpg'
    title: 'Funchal',
    subtitle: 'La capital, entre flores y mar',
    durationInFrames: 140,
    gradient: ['#1e3c72', '#2a5298'],
    kenBurns: 'in',
  },
  {
    image: '', // p.ej. 'photos/pico-arieiro.jpg'
    title: 'Pico do Arieiro',
    subtitle: 'Sobre las nubes, a 1818 m',
    durationInFrames: 140,
    gradient: ['#614385', '#516395'],
    kenBurns: 'out',
  },
  {
    image: '', // p.ej. 'photos/cabo-girao.jpg'
    title: 'Cabo Girão',
    subtitle: 'El mirador de cristal más alto de Europa',
    durationInFrames: 140,
    gradient: ['#0f2027', '#2c5364'],
    kenBurns: 'left',
  },
  {
    image: '', // p.ej. 'photos/levadas.jpg'
    title: 'Levadas & Laurisilva',
    subtitle: 'Bosques Patrimonio de la Humanidad',
    durationInFrames: 140,
    gradient: ['#134e5e', '#71b280'],
    kenBurns: 'right',
  },
  {
    image: '', // p.ej. 'photos/porto-moniz.jpg'
    title: 'Porto Moniz',
    subtitle: 'Piscinas naturales de lava',
    durationInFrames: 140,
    gradient: ['#1a2980', '#26d0ce'],
    kenBurns: 'in',
  },
  {
    image: '', // p.ej. 'photos/camara-de-lobos.jpg'
    title: 'Câmara de Lobos',
    subtitle: 'Atardecer de pescadores',
    durationInFrames: 140,
    gradient: ['#ff512f', '#f09819'],
    kenBurns: 'out',
  },
];

export const INTRO_FRAMES = 100;
export const OUTRO_FRAMES = 100;

/**
 * Duración total de la composición teniendo en cuenta que cada transición
 * solapa dos escenas (TransitionSeries resta la duración de cada transición).
 */
export const totalDurationInFrames = (() => {
  const sceneFrames =
    INTRO_FRAMES +
    scenes.reduce((acc, s) => acc + s.durationInFrames, 0) +
    OUTRO_FRAMES;
  const numTransitions = scenes.length + 1; // intro→s1, ..., s6→outro
  return sceneFrames - numTransitions * TRANSITION_FRAMES;
})();
