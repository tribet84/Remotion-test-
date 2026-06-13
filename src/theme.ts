// Paleta y tipografía del promo. Look moderno: 2 acentos (coral atlántico +
// turquesa) sobre fondo oscuro, con detalles en dorado de "golden hour".
export const COLORS = {
  bg: '#080B11',
  ink: '#0A0E14',
  white: '#FFFFFF',
  coral: '#FF4D2E', // acento principal (sol / volcán)
  teal: '#15E0C8', // acento secundario (Atlántico)
  gold: '#FFC24B', // golden hour
  haze: 'rgba(255,255,255,0.6)',
};

// Fuentes del sistema (sin red). Mono para la "UI" (índices, coordenadas, tags)
// → estética editorial/tech; sans en negrita con falso condensado para titulares.
export const FONT_DISPLAY = '"DejaVu Sans", "FreeSans", Arial, sans-serif';
export const FONT_MONO = '"DejaVu Sans Mono", "FreeMono", monospace';

// Falso condensado: estiramos vertical y comprimimos horizontal para emular
// las grotescas de cartel (estilo Anton/Bebas) sin depender de fuentes externas.
export const condensed = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  textTransform: 'uppercase',
  transform: 'scale(0.86, 1.18)',
  transformOrigin: 'left center',
  letterSpacing: '-0.01em',
  ...extra,
});
