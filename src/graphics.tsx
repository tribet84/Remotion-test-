import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONT_MONO, condensed} from './theme';

// ---------------------------------------------------------------------------
//  Titular cinético: revelado por líneas con máscara (slide-up) + escala punch
// ---------------------------------------------------------------------------
export const KineticTitle: React.FC<{
  text: string;
  accent: string;
  size?: number;
  delay?: number;
  color?: string;
}> = ({text, accent, size = 132, delay = 0, color = COLORS.white}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = text.split('\n');

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: size * 0.02}}>
      {lines.map((line, i) => {
        const local = frame - delay - i * 5;
        const rise = spring({
          frame: local,
          fps,
          config: {damping: 200, mass: 0.7},
          durationInFrames: 22,
        });
        const y = interpolate(rise, [0, 1], [110, 0]);
        // resalta la última línea con el color de acento
        const isAccent = i === lines.length - 1 && lines.length > 1;
        return (
          <div key={i} style={{overflow: 'hidden', padding: '0.04em 0'}}>
            <div
              style={{
                ...condensed(),
                fontSize: size,
                lineHeight: 0.92,
                color: isAccent ? accent : color,
                transform: `translateY(${y}%) scale(0.86, 1.18)`,
                transformOrigin: 'left center',
                textShadow: '0 6px 40px rgba(0,0,0,0.55)',
                whiteSpace: 'nowrap',
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
//  Chip de etiqueta (mono) con barra de acento y punto animado
// ---------------------------------------------------------------------------
export const Kicker: React.FC<{label: string; accent: string; delay?: number}> = ({
  label,
  accent,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 18});
  const blink = 0.4 + 0.6 * Math.abs(Math.sin(frame / 7));
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 20px',
        background: 'rgba(8,11,17,0.55)',
        backdropFilter: 'blur(6px)',
        border: `1.5px solid ${accent}`,
        borderRadius: 100,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-30, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 8,
          background: accent,
          opacity: blink,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 26,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: COLORS.white,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
//  Esquinas animadas (se "dibujan")
// ---------------------------------------------------------------------------
export const CornerBrackets: React.FC<{accent: string; inset?: number; delay?: number}> = ({
  accent,
  inset = 48,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 26});
  const len = interpolate(draw, [0, 1], [0, 70]);
  const thick = 5;
  return (
    <>
      {/* TL */}
      <div style={{position: 'absolute', top: inset, left: inset, opacity: draw}}>
        <div style={{position: 'absolute', width: len, height: thick, background: accent}} />
        <div style={{position: 'absolute', width: thick, height: len, background: accent}} />
      </div>
      {/* TR */}
      <div style={{position: 'absolute', top: inset, right: inset, opacity: draw}}>
        <div style={{position: 'absolute', right: 0, width: len, height: thick, background: accent}} />
        <div style={{position: 'absolute', right: 0, width: thick, height: len, background: accent}} />
      </div>
      {/* BL */}
      <div style={{position: 'absolute', bottom: inset, left: inset, opacity: draw}}>
        <div style={{position: 'absolute', bottom: 0, width: len, height: thick, background: accent}} />
        <div style={{position: 'absolute', bottom: 0, width: thick, height: len, background: accent}} />
      </div>
      {/* BR */}
      <div style={{position: 'absolute', bottom: inset, right: inset, opacity: draw}}>
        <div style={{position: 'absolute', bottom: 0, right: 0, width: len, height: thick, background: accent}} />
        <div style={{position: 'absolute', bottom: 0, right: 0, width: thick, height: len, background: accent}} />
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
//  Grano de película (sutil, mejora el look "cine")
// ---------------------------------------------------------------------------
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 8;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: '420px 420px',
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

// Viñeta + gradación de color (sombras frías / luces cálidas)
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{boxShadow: 'inset 0 0 420px rgba(0,0,0,0.55)', pointerEvents: 'none'}} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 80% at 50% 30%, rgba(255,170,90,0.10), rgba(0,0,0,0) 55%)',
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
      }}
    />
  </>
);

// ---------------------------------------------------------------------------
//  Barra superior persistente (marca + timecode)
// ---------------------------------------------------------------------------
export const TopBar: React.FC<{accent: string; opacity: number}> = ({accent, opacity}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const secs = frame / fps;
  const total = durationInFrames / fps;
  const tc = (t: number) => `0:${String(Math.floor(t)).padStart(2, '0')}`;
  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        left: 56,
        right: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 16, height: 16, borderRadius: 10, background: accent, boxShadow: `0 0 14px ${accent}`}} />
        <span style={{...condensed(), fontSize: 34, color: COLORS.white, transform: 'scale(0.86,1.18)'}}>Madeira</span>
      </div>
      <span style={{fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 2, color: COLORS.haze}}>
        {tc(secs)} / {tc(total)}
      </span>
    </div>
  );
};

// Barra de progreso inferior persistente
export const ProgressBar: React.FC<{accent: string; opacity: number}> = ({accent, opacity}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', bottom: 56, left: 56, right: 56, opacity}}>
      <div style={{position: 'relative', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.18)'}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${p * 100}%`,
            background: accent,
            borderRadius: 3,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${p * 100}%`,
            width: 14,
            height: 14,
            marginLeft: -7,
            marginTop: -7,
            borderRadius: 10,
            background: COLORS.white,
            boxShadow: `0 0 14px ${accent}`,
          }}
        />
      </div>
    </div>
  );
};

// Pequeño "ruido" de partículas decorativas (puntos que flotan)
export const Particles: React.FC<{accent: string; count?: number}> = ({accent, count = 18}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 100;
        const baseY = random(`y${i}`) * 100;
        const speed = 0.04 + random(`s${i}`) * 0.08;
        const y = (baseY - frame * speed + 100) % 100;
        const size = 2 + random(`r${i}`) * 4;
        const op = 0.15 + random(`o${i}`) * 0.35;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: size,
              background: i % 3 === 0 ? accent : COLORS.white,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
