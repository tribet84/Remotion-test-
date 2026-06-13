import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  TransitionPresentation,
  TransitionSeries,
  linearTiming,
  springTiming,
} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {fade} from '@remotion/transitions/fade';
import {COLORS, FONT_MONO, condensed} from './theme';
import {
  Clip,
  HEIGHT,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  Section,
  TRANSITION_FRAMES,
  WIDTH,
  accentHex,
  allClips,
  sections,
  totalDurationInFrames,
} from './scenes';
import {
  CornerBrackets,
  Grade,
  Grain,
  Kicker,
  KineticTitle,
  Particles,
  ProgressBar,
  TopBar,
} from './graphics';

// ---------------------------------------------------------------------------
//  Ken Burns (zoom + paneo) que rellena su contenedor
// ---------------------------------------------------------------------------
const KenBurns: React.FC<{src: string; dir: Clip['kenBurns']; dur: number}> = ({
  src,
  dir,
  dur,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {extrapolateRight: 'clamp'});
  let scale = 1.12;
  let x = 0;
  let y = 0;
  switch (dir) {
    case 'in':
      scale = interpolate(p, [0, 1], [1.06, 1.22]);
      break;
    case 'out':
      scale = interpolate(p, [0, 1], [1.22, 1.06]);
      break;
    case 'left':
      x = interpolate(p, [0, 1], [4, -4]);
      break;
    case 'right':
      x = interpolate(p, [0, 1], [-4, 4]);
      break;
    case 'up':
      y = interpolate(p, [0, 1], [4, -4]);
      break;
    case 'down':
      y = interpolate(p, [0, 1], [-4, 4]);
      break;
  }
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale}) translate(${x}%, ${y}%)`,
        willChange: 'transform',
      }}
    />
  );
};

// Bloque de texto inferior compartido (kicker + titular + meta + índice)
const ClipCaption: React.FC<{clip: Clip; index: number; accent: string; titleSize: number}> = ({
  clip,
  index,
  accent,
  titleSize,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const barGrow = spring({frame: frame - 6, fps, config: {damping: 200}, durationInFrames: 22});
  const metaIn = spring({frame: frame - 16, fps, config: {damping: 200}, durationInFrames: 20});
  const n = String(index + 1).padStart(2, '0');
  const total = String(allClips.length).padStart(2, '0');
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
      <div>
        <Kicker label={clip.kicker} accent={accent} delay={2} />
      </div>
      <div style={{display: 'flex', alignItems: 'stretch', gap: 26}}>
        <div
          style={{
            width: 8,
            borderRadius: 4,
            background: accent,
            transform: `scaleY(${barGrow})`,
            transformOrigin: 'bottom',
            boxShadow: `0 0 16px ${accent}`,
          }}
        />
        <KineticTitle text={clip.title} accent={accent} size={titleSize} delay={4} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: metaIn}}>
        <span style={{fontFamily: FONT_MONO, fontSize: 26, color: accent, letterSpacing: 2}}>
          {n}
          <span style={{color: COLORS.haze}}> / {total}</span>
        </span>
        {clip.meta ? (
          <>
            <div style={{width: 40, height: 2, background: 'rgba(255,255,255,0.4)'}} />
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 26,
                color: COLORS.white,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {clip.meta}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
//  Clip de foto — layout FULL (a sangre) y CARD (tarjeta editorial)
// ---------------------------------------------------------------------------
const PhotoClip: React.FC<{clip: Clip; index: number}> = ({clip, index}) => {
  const accent = accentHex(clip.accent);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (clip.layout === 'card') {
    const cardIn = spring({frame, fps, config: {damping: 200, mass: 0.8}, durationInFrames: 24});
    const tilt = index % 2 === 0 ? -1.6 : 1.6;
    return (
      <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
        {/* Fondo difuminado de la misma foto */}
        <AbsoluteFill>
          <Img
            src={staticFile(clip.image)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.25)',
              filter: 'blur(40px) brightness(0.42) saturate(1.2)',
            }}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'rgba(8,11,17,0.35)'}} />
        <Particles accent={accent} count={14} />

        {/* Tarjeta con la foto */}
        <div
          style={{
            position: 'absolute',
            top: 300,
            left: 80,
            right: 80,
            height: 640,
            borderRadius: 30,
            overflow: 'hidden',
            border: `2px solid rgba(255,255,255,0.18)`,
            boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 0 6px rgba(8,11,17,0.25)`,
            transform: `translateY(${interpolate(cardIn, [0, 1], [80, 0])}px) rotate(${interpolate(
              cardIn,
              [0, 1],
              [tilt * 2, tilt],
            )}deg) scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`,
            opacity: cardIn,
          }}
        >
          <KenBurns src={clip.image} dir={clip.kenBurns} dur={clip.durationInFrames} />
          <CornerBrackets accent={accent} inset={20} delay={10} />
        </div>

        {/* Texto */}
        <div style={{position: 'absolute', left: 80, right: 80, top: 1010}}>
          <ClipCaption clip={clip} index={index} accent={accent} titleSize={112} />
        </div>
      </AbsoluteFill>
    );
  }

  // FULL
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill>
        <KenBurns src={clip.image} dir={clip.kenBurns} dur={clip.durationInFrames} />
      </AbsoluteFill>
      {/* Degradado inferior para legibilidad */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(8,11,17,0.92) 0%, rgba(8,11,17,0.55) 26%, rgba(8,11,17,0) 52%)',
        }}
      />
      <Grade />
      <CornerBrackets accent={accent} inset={44} delay={6} />
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 150}}>
        <ClipCaption clip={clip} index={index} accent={accent} titleSize={132} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  INTRO — revelado de marca con anillos, ruta y tipografía
// ---------------------------------------------------------------------------
const LetterReveal: React.FC<{text: string; size: number; color: string}> = ({
  text,
  size,
  color,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {text.split('').map((ch, i) => {
        const s = spring({frame: frame - 8 - i * 3, fps, config: {damping: 200, mass: 0.6}, durationInFrames: 18});
        return (
          <span
            key={i}
            style={{
              ...condensed(),
              fontSize: size,
              color,
              display: 'inline-block',
              transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(0.86, 1.18)`,
              opacity: s,
              textShadow: '0 8px 50px rgba(0,0,0,0.6)',
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const teal = COLORS.teal;
  const coral = COLORS.coral;
  const kIn = spring({frame: frame - 2, fps, config: {damping: 200}, durationInFrames: 18});
  const subIn = spring({frame: frame - 30, fps, config: {damping: 200}, durationInFrames: 22});
  const lineW = interpolate(subIn, [0, 1], [0, 220]);
  const route = interpolate(frame, [6, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(circle at 50% 42%, #0d2a31 0%, #05070b 68%)'}}
      />
      <Particles accent={teal} count={26} />
      {/* Anillos concéntricos */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {[0, 1, 2, 3].map((i) => {
          const r = interpolate((frame + i * 16) % 64, [0, 64], [0, 1]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 420 + r * 1100,
                height: 420 + r * 1100,
                borderRadius: '50%',
                border: `2px solid ${teal}`,
                opacity: (1 - r) * 0.22,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Ruta punteada decorativa + punto que avanza */}
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <path
          d="M 120 1500 C 380 1200, 520 980, 760 760 S 980 360, 940 300"
          fill="none"
          stroke={coral}
          strokeOpacity={0.5}
          strokeWidth={4}
          strokeDasharray="14 18"
        />
        <circle cx={120 + route * 820} cy={1500 - route * 1200} r={9} fill={coral}>
        </circle>
        <circle cx={120 + route * 820} cy={1500 - route * 1200} r={18} fill="none" stroke={coral} strokeOpacity={0.5} strokeWidth={3} />
      </svg>

      {/* Texto central */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div style={{opacity: kIn, transform: `translateY(${interpolate(kIn, [0, 1], [20, 0])}px)`, marginBottom: 24}}>
          <span style={{fontFamily: FONT_MONO, fontSize: 28, letterSpacing: 8, color: teal, textTransform: 'uppercase'}}>
            Portugal · Atlántico
          </span>
        </div>
        <LetterReveal text="MADEIRA" size={210} color={COLORS.white} />
        <div style={{width: lineW, height: 4, background: coral, margin: '30px 0', borderRadius: 2}} />
        <div style={{opacity: subIn, textAlign: 'center'}}>
          <div style={{...condensed(), fontSize: 40, color: COLORS.white, transform: 'scale(0.86,1.18)'}}>
            Isla de la primavera eterna
          </div>
          <div style={{fontFamily: FONT_MONO, fontSize: 26, letterSpacing: 6, color: COLORS.haze, marginTop: 18}}>
            32.7°N · 16.9°W — VLOG 2026
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  TARJETA DE SECCIÓN
// ---------------------------------------------------------------------------
const SectionCard: React.FC<{section: Section}> = ({section}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = accentHex(section.accent);
  const wipe1 = spring({frame, fps, config: {damping: 200}, durationInFrames: 18});
  const numIn = spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 22});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 30% 40%, ${accent}22 0%, #05070b 70%)`}} />
      {/* Franjas diagonales en movimiento */}
      <AbsoluteFill style={{opacity: 0.12}}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: -200,
              bottom: -200,
              left: ((i * 220 + frame * 4) % 1400) - 200,
              width: 70,
              background: accent,
              transform: 'rotate(18deg)',
            }}
          />
        ))}
      </AbsoluteFill>
      <Particles accent={accent} count={18} />

      {/* Número gigante de la parte */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 470,
          ...condensed(),
          fontSize: 640,
          color: 'transparent',
          WebkitTextStroke: `3px ${accent}55`,
          transform: `scale(0.86,1.18) translateX(${interpolate(numIn, [0, 1], [120, 0])}px)`,
          opacity: numIn,
        }}
      >
        {section.part}
      </div>

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 80px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, opacity: wipe1}}>
          <div style={{width: 60, height: 5, background: accent}} />
          <span style={{fontFamily: FONT_MONO, fontSize: 30, letterSpacing: 6, color: accent, textTransform: 'uppercase'}}>
            Parte {section.part}
          </span>
        </div>
        <KineticTitle text={section.label} accent={accent} size={170} delay={3} color={COLORS.white} />
      </AbsoluteFill>

      {/* Bloque que barre al entrar */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: accent,
          transformOrigin: 'right',
          transform: `scaleX(${1 - Math.min(1, frame / 12)})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  OUTRO
// ---------------------------------------------------------------------------
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const coral = COLORS.coral;
  const teal = COLORS.teal;
  const titleIn = spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 24});
  const thumbs = ['photos/pico-arieiro.jpg', 'photos/mural-flores.jpg', 'photos/atardecer.jpg', 'photos/cocteles-mar.jpg'];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #2a1810 0%, #05070b 72%)'}} />
      <Particles accent={coral} count={26} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        {/* Tira de miniaturas */}
        <div style={{display: 'flex', gap: 16, marginBottom: 70}}>
          {thumbs.map((t, i) => {
            const s = spring({frame: frame - 6 - i * 5, fps, config: {damping: 200}, durationInFrames: 22});
            return (
              <div
                key={t}
                style={{
                  width: 150,
                  height: 200,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.25)',
                  transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) rotate(${(i - 1.5) * 4}deg)`,
                  opacity: s,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
                }}
              >
                <Img src={staticFile(t)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            );
          })}
        </div>

        <span style={{fontFamily: FONT_MONO, fontSize: 28, letterSpacing: 8, color: teal, textTransform: 'uppercase', opacity: titleIn}}>
          Até à próxima
        </span>
        <div style={{marginTop: 16, transform: `scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`, opacity: titleIn}}>
          <LetterReveal text="MADEIRA" size={150} color={COLORS.white} />
        </div>
        <div style={{width: 200, height: 4, background: coral, margin: '34px 0', borderRadius: 2, opacity: titleIn}} />
        <span style={{...condensed(), fontSize: 40, color: COLORS.white, transform: 'scale(0.86,1.18)', opacity: titleIn}}>
          ¡Hasta el próximo viaje!
        </span>
        <span style={{fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 4, color: COLORS.haze, marginTop: 22, opacity: titleIn}}>
          Hecho con Remotion · 2026
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  COMPOSICIÓN PRINCIPAL
// ---------------------------------------------------------------------------
type Item =
  | {kind: 'intro'}
  | {kind: 'section'; section: Section}
  | {kind: 'clip'; clip: Clip; index: number}
  | {kind: 'outro'};

const buildItems = (): Item[] => {
  const items: Item[] = [{kind: 'intro'}];
  let idx = 0;
  for (const section of sections) {
    items.push({kind: 'section', section});
    for (const clip of section.clips) {
      items.push({kind: 'clip', clip, index: idx});
      idx += 1;
    }
  }
  items.push({kind: 'outro'});
  return items;
};

const durationOf = (it: Item): number =>
  it.kind === 'intro'
    ? INTRO_FRAMES
    : it.kind === 'outro'
      ? OUTRO_FRAMES
      : it.kind === 'section'
        ? it.section.durationInFrames
        : it.clip.durationInFrames;

const renderItem = (it: Item) => {
  switch (it.kind) {
    case 'intro':
      return <IntroCard />;
    case 'outro':
      return <OutroCard />;
    case 'section':
      return <SectionCard section={it.section} />;
    case 'clip':
      return <PhotoClip clip={it.clip} index={it.index} />;
  }
};

const presFor = (i: number): TransitionPresentation<any> => {
  switch (i % 5) {
    case 0:
      return slide({direction: 'from-right'});
    case 1:
      return wipe({direction: 'from-bottom-right'});
    case 2:
      return slide({direction: 'from-bottom'});
    case 3:
      return fade();
    default:
      return slide({direction: 'from-left'});
  }
};

export const MadeiraVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const items = buildItems();

  // La UI global aparece tras la intro y se desvanece en el outro
  const uiOpacity = interpolate(
    frame,
    [INTRO_FRAMES - 16, INTRO_FRAMES + 6, totalDurationInFrames - OUTRO_FRAMES - 6, totalDurationInFrames - OUTRO_FRAMES + 18],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const children = items.flatMap((it, i) => {
    const seq = (
      <TransitionSeries.Sequence key={`seq-${i}`} durationInFrames={durationOf(it)}>
        {renderItem(it)}
      </TransitionSeries.Sequence>
    );
    if (i === items.length - 1) return [seq];
    const timing =
      i % 5 === 3
        ? linearTiming({durationInFrames: TRANSITION_FRAMES})
        : springTiming({config: {damping: 200}, durationInFrames: TRANSITION_FRAMES});
    return [
      seq,
      <TransitionSeries.Transition key={`tr-${i}`} presentation={presFor(i)} timing={timing} />,
    ];
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <TransitionSeries>{children}</TransitionSeries>

      {/* UI global persistente */}
      <TopBar accent={COLORS.teal} opacity={uiOpacity} />
      <ProgressBar accent={COLORS.coral} opacity={uiOpacity} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
