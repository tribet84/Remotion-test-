import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {
  INTRO_FRAMES,
  OUTRO_FRAMES,
  Scene,
  TRANSITION_FRAMES,
  scenes,
} from './scenes';

// Fuentes del sistema (sin descargas de red). DejaVu/Free cubren los acentos
// portugueses (ã, à, ô) y dan un look serif cinemático para los títulos.
const titleFont = 'Georgia, "DejaVu Serif", "FreeSerif", serif';
const bodyFont = 'Helvetica, "DejaVu Sans", "FreeSans", Arial, sans-serif';

// ---------------------------------------------------------------------------
//  Efecto Ken Burns (zoom + paneo lento, look cinemático)
// ---------------------------------------------------------------------------
const KenBurns: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const durationInFrames = scene.durationInFrames;
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (scene.kenBurns) {
    case 'in':
      scale = interpolate(p, [0, 1], [1.05, 1.22]);
      break;
    case 'out':
      scale = interpolate(p, [0, 1], [1.22, 1.05]);
      break;
    case 'left':
      scale = 1.18;
      translateX = interpolate(p, [0, 1], [40, -40]);
      break;
    case 'right':
      scale = 1.18;
      translateX = interpolate(p, [0, 1], [-40, 40]);
      break;
  }
  translateY = interpolate(p, [0, 1], [-15, 15]);

  const transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;

  return (
    <AbsoluteFill style={{transform, willChange: 'transform'}}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : (
        // Placeholder con degradado mientras no haya foto real
        <AbsoluteFill
          style={{
            background: `linear-gradient(160deg, ${scene.gradient[0]} 0%, ${scene.gradient[1]} 100%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  Capa de texto con título + subtítulo (entrada animada)
// ---------------------------------------------------------------------------
const Caption: React.FC<{title: string; subtitle: string}> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 25});
  const titleY = interpolate(enter, [0, 1], [60, 0]);
  const subEnter = spring({
    frame: frame - 8,
    fps,
    config: {damping: 200},
    durationInFrames: 25,
  });
  const subY = interpolate(subEnter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: '0 90px 220px 90px',
      }}
    >
      <div
        style={{
          width: 70,
          height: 6,
          borderRadius: 3,
          background: '#ffd166',
          marginBottom: 28,
          opacity: enter,
          transform: `scaleX(${enter})`,
          transformOrigin: 'left',
        }}
      />
      <h1
        style={{
          fontFamily: titleFont,
          fontSize: 96,
          lineHeight: 1.02,
          color: 'white',
          margin: 0,
          fontWeight: 700,
          letterSpacing: -1,
          textShadow: '0 4px 30px rgba(0,0,0,0.55)',
          opacity: enter,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: bodyFont,
          fontSize: 38,
          color: 'rgba(255,255,255,0.92)',
          margin: '18px 0 0 0',
          fontWeight: 400,
          textShadow: '0 2px 18px rgba(0,0,0,0.6)',
          opacity: subEnter,
          transform: `translateY(${subY}px)`,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};

// Oscurecido inferior + viñeta para legibilidad del texto sobre cualquier foto
const Overlay: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0) 62%)',
      }}
    />
    <AbsoluteFill
      style={{
        boxShadow: 'inset 0 0 350px rgba(0,0,0,0.55)',
      }}
    />
  </>
);

const PhotoScene: React.FC<{scene: Scene}> = ({scene}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <KenBurns scene={scene} />
    <Overlay />
    <Caption title={scene.title} subtitle={scene.subtitle} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
//  Tarjeta de intro
// ---------------------------------------------------------------------------
const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 30});
  const sub = spring({
    frame: frame - 12,
    fps,
    config: {damping: 200},
    durationInFrames: 30,
  });
  const scale = interpolate(frame, [0, INTRO_FRAMES], [1.08, 1.18]);

  return (
    <AbsoluteFill style={{backgroundColor: '#05080f'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 35%, #16324f 0%, #05080f 70%)',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: 32,
            letterSpacing: 10,
            color: '#ffd166',
            textTransform: 'uppercase',
            margin: 0,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
          }}
        >
          Mis vacaciones en
        </p>
        <h1
          style={{
            fontFamily: titleFont,
            fontSize: 150,
            color: 'white',
            margin: '14px 0 0 0',
            fontWeight: 700,
            letterSpacing: -2,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          }}
        >
          Madeira
        </h1>
        <div
          style={{
            width: interpolate(sub, [0, 1], [0, 160]),
            height: 4,
            background: '#ffd166',
            margin: '34px 0',
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: 34,
            color: 'rgba(255,255,255,0.85)',
            margin: 0,
            opacity: sub,
          }}
        >
          La isla del Atlántico · 2026
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  Tarjeta final
// ---------------------------------------------------------------------------
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 30});

  return (
    <AbsoluteFill style={{backgroundColor: '#05080f'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #2c5364 0%, #05080f 75%)',
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            fontFamily: titleFont,
            fontSize: 92,
            color: 'white',
            margin: 0,
            fontWeight: 700,
            textAlign: 'center',
            opacity: enter,
            transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
          }}
        >
          Até à próxima,
          <br />
          Madeira
        </h1>
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: 30,
            letterSpacing: 4,
            color: '#ffd166',
            marginTop: 30,
            opacity: enter,
          }}
        >
          ♥ Obrigado
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
//  Composición principal
// ---------------------------------------------------------------------------
export const MadeiraVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/*
        ¿Tienes música? Descomenta y coloca el archivo en public/music.mp3
        import {Audio} from 'remotion'; (añádelo arriba)
        <Audio src={staticFile('music.mp3')} volume={0.6} />
      */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <IntroCard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        {scenes.map((scene) => (
          <TransitionSeries.Sequence
            key={scene.title}
            durationInFrames={scene.durationInFrames}
          >
            <PhotoScene scene={scene} />
          </TransitionSeries.Sequence>
        )).flatMap((seq, i) => [
          seq,
          // Transición tras cada escena (incluye antes del outro)
          <TransitionSeries.Transition
            key={`t-${i}`}
            presentation={fade()}
            timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
          />,
        ])}

        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <OutroCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
