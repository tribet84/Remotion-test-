// ============================================================================
//  GUION DEL PROMO — "Madeira"
// ----------------------------------------------------------------------------
//  Las fotos viven en public/photos/ (ya orientadas y optimizadas).
//  Para cambiar textos, orden, duración o estilo, edita este archivo.
// ============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const TRANSITION_FRAMES = 13;
export const INTRO_FRAMES = 78;
export const OUTRO_FRAMES = 96;

export type Accent = 'coral' | 'teal' | 'gold';
export type KenBurns = 'in' | 'out' | 'left' | 'right' | 'up' | 'down';
export type Layout = 'full' | 'card';

export type Clip = {
  image: string;
  /** Etiqueta pequeña superior (mono): lugar / categoría. */
  kicker: string;
  /** Titular grande (cinético). */
  title: string;
  /** Dato extra pequeño a la derecha (opcional). */
  meta?: string;
  accent: Accent;
  layout: Layout;
  kenBurns: KenBurns;
  durationInFrames: number;
};

export type Section = {
  part: string; // '01'
  label: string; // 'NATUREZA'
  accent: Accent;
  durationInFrames: number;
  clips: Clip[];
};

const D = 78; // duración por defecto de cada clip (frames)

export const sections: Section[] = [
  {
    part: '01',
    label: 'Natureza',
    accent: 'teal',
    durationInFrames: 50,
    clips: [
      {
        image: 'photos/pico-arieiro.jpg',
        kicker: 'Pico do Arieiro',
        title: 'Sobre el mar\nde nubes',
        meta: '1 818 m',
        accent: 'teal',
        layout: 'full',
        kenBurns: 'in',
        durationInFrames: D,
      },
      {
        image: 'photos/levada-bosque.jpg',
        kicker: 'Levadas · Laurisilva',
        title: 'Bosque\nencantado',
        meta: 'UNESCO',
        accent: 'teal',
        layout: 'full',
        kenBurns: 'up',
        durationInFrames: D,
      },
      {
        image: 'photos/ponta-sao-lourenco.jpg',
        kicker: 'Ponta de São Lourenço',
        title: 'Tierra de\nvolcanes',
        accent: 'coral',
        layout: 'card',
        kenBurns: 'right',
        durationInFrames: D,
      },
    ],
  },
  {
    part: '02',
    label: 'Oceano',
    accent: 'teal',
    durationInFrames: 50,
    clips: [
      {
        image: 'photos/costa-norte.jpg',
        kicker: 'Costa Norte',
        title: 'Donde rompe\nel Atlántico',
        accent: 'teal',
        layout: 'full',
        kenBurns: 'out',
        durationInFrames: D,
      },
      {
        image: 'photos/costa-mar.jpg',
        kicker: 'Miradores',
        title: 'Brisa\ndel oeste',
        accent: 'teal',
        layout: 'full',
        kenBurns: 'down',
        durationInFrames: D,
      },
      {
        image: 'photos/atardecer.jpg',
        kicker: 'Costa Oeste',
        title: 'Atardeceres\nde oro',
        meta: 'golden hour',
        accent: 'gold',
        layout: 'card',
        kenBurns: 'left',
        durationInFrames: D,
      },
    ],
  },
  {
    part: '03',
    label: 'Vida & Sabor',
    accent: 'coral',
    durationInFrames: 50,
    clips: [
      {
        image: 'photos/plaza-palmeras.jpg',
        kicker: 'Monte · Funchal',
        title: 'Jardines\ncon vistas',
        accent: 'teal',
        layout: 'full',
        kenBurns: 'in',
        durationInFrames: D,
      },
      {
        image: 'photos/mural-flores.jpg',
        kicker: 'Arte urbano',
        title: 'La isla de\nlas flores',
        accent: 'coral',
        layout: 'full',
        kenBurns: 'down',
        durationInFrames: D,
      },
      {
        image: 'photos/pueblo.jpg',
        kicker: 'Pueblos',
        title: 'Rincones\ncon encanto',
        accent: 'gold',
        layout: 'card',
        kenBurns: 'left',
        durationInFrames: D,
      },
      {
        image: 'photos/espetada.jpg',
        kicker: 'Gastronomía',
        title: 'Espetada\nmadeirense',
        meta: 'sabor local',
        accent: 'coral',
        layout: 'full',
        kenBurns: 'up',
        durationInFrames: D,
      },
      {
        image: 'photos/brindis-coral.jpg',
        kicker: 'Cerveja Coral',
        title: 'Saúde!',
        accent: 'gold',
        layout: 'card',
        kenBurns: 'right',
        durationInFrames: D,
      },
      {
        image: 'photos/cocteles-mar.jpg',
        kicker: 'Poncha & amigos',
        title: 'Brindis al\nAtlántico',
        accent: 'coral',
        layout: 'card',
        kenBurns: 'in',
        durationInFrames: D,
      },
    ],
  },
];

export const accentHex = (a: Accent): string =>
  a === 'coral' ? '#FF4D2E' : a === 'teal' ? '#15E0C8' : '#FFC24B';

// Lista plana de clips (para índices "01 / 12").
export const allClips: Clip[] = sections.flatMap((s) => s.clips);

// Duración total contemplando que cada transición solapa dos elementos.
export const totalDurationInFrames = (() => {
  const sceneFrames =
    INTRO_FRAMES +
    OUTRO_FRAMES +
    sections.reduce(
      (acc, s) =>
        acc + s.durationInFrames + s.clips.reduce((a, c) => a + c.durationInFrames, 0),
      0,
    );
  // nº de elementos: intro + outro + (1 card + n clips) por sección
  const numElements =
    2 + sections.reduce((acc, s) => acc + 1 + s.clips.length, 0);
  const numTransitions = numElements - 1;
  return sceneFrames - numTransitions * TRANSITION_FRAMES;
})();
