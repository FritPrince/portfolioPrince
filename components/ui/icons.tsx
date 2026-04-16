/* ─── SVG Icon system ───────────────────────────────────────────
   All icons: 24×24 viewBox, stroke-based, strokeWidth 1.5
   Usage: <Icon.Arrow size={16} /> or <Icon.Mail className="..." />
──────────────────────────────────────────────────────────────── */

type IconProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
};

const base = (size = 20, sw = 1.5) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/* ── Navigation & UI ─────────────────────────────────────────── */
export function ArrowRight({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ArrowDown({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function Close({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function Check({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Star({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function Dot({ size = 8, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill="currentColor" className={className} style={style}>
      <circle cx="4" cy="4" r="3" />
    </svg>
  );
}

export function Spinner({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );
}

export function ExternalLink({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

/* ── Contact channels ────────────────────────────────────────── */
export function Mail({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

export function GitHub({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

export function LinkedIn({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <line x1="8" y1="11" x2="8" y2="21" />
      <circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsApp({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

/* ── Services ────────────────────────────────────────────────── */
export function Globe({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function Mobile({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5} />
    </svg>
  );
}

export function Brush({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94C5.79 16.44 4.5 17.5 3 18c.5-1.5 1.56-2.79 3.06-3.93" />
      <path d="M5.5 20.5c1.5-.5 2.5-1.5 2.5-3s-1-2.5-2.5-2.5C3.5 15 2 16 2 17.5S3 20 5 20.5z" />
    </svg>
  );
}

export function Cpu({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

export function Shield({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function Tool({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/* ── Design service cards ────────────────────────────────────── */
export function Layout({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

export function Layers({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function Grid({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

export function Monitor({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function Eye({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Share({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ── IoT nodes ───────────────────────────────────────────────── */
export function Bulb({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14" />
    </svg>
  );
}

export function Lock({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export function Thermometer({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
    </svg>
  );
}

export function Camera({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function Zap({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/* ── Phone library app icons ─────────────────────────────────── */
export function Ambulance({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="2" y="8" width="20" height="10" rx="2" />
      <path d="M9 8V5l3-3 3 3v3" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M9 13h6M12 10v6" />
    </svg>
  );
}

export function BookOpen({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

export function Heart({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export function Ticket({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M2 9a3 3 0 010-6h20a3 3 0 010 6" />
      <path d="M2 15a3 3 0 000 6h20a3 3 0 000-6" />
      <path d="M2 9h20v6H2z" />
      <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
  );
}

export function Film({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );
}

export function Phone({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5} />
    </svg>
  );
}

/* ── Music notes ─────────────────────────────────────────────── */
export function MusicNote({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

/* ── Location pin ────────────────────────────────────────────── */
export function MapPin({ size, className, style, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className} style={style}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
