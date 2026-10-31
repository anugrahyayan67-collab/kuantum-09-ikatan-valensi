import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {NA_YELLOW} from '../components/grupA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const Letters: React.FC<{text: string; t: number; start: number; step: number; style: React.CSSProperties}> = ({text, t, start, step, style}) => (
  <div style={{display: 'flex', justifyContent: 'center', ...style}}>
    {text.split('').map((ch, i) => {
      const p = ramp(t, start + i * step, start + i * step + 0.9);
      return (
        <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, translate: `0px ${(1 - p) * 40}px`, scale: String(0.92 + 0.08 * p)}}>
          {ch}
        </span>
      );
    })}
  </div>
);

// Simbol term yang melayang samar di latar: [multiplisitas, huruf L, J].
const TERMS: [string, string, string][] = [
  ['2', 'S', '1/2'],
  ['3', 'P', '0'],
  ['6', 'S', '5/2'],
  ['4', 'F', '3/2'],
  ['5', 'D', '4'],
  ['1', 'S', '0'],
  ['2', 'P', '3/2'],
  ['3', 'F', '2'],
  ['7', 'S', '3'],
  ['4', 'I', '9/2'],
];

export const Title: React.FC = () => {
  const {t} = useScene();
  const bg = ramp(t, 0.1, 2.0, EASE_IN_OUT);
  const sub = ramp(t, 2.6, 3.6);
  const line = ramp(t, 1.8, 3.2, EASE_IN_OUT);
  const pulse = 0.8 + 0.2 * Math.sin(t * 2.4);
  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={960} y={470} r={640} color="gold" opacity={0.12 * bg} />
        {/* dua garis kuning natrium samar di belakang judul */}
        {[-34, 34].map((dx, k) => (
          <g key={k} opacity={bg * 0.35 * pulse}>
            <rect x={960 + dx - 18} y={120} width={36} height={760} fill={NA_YELLOW} opacity={0.12} rx={18} />
            <rect x={960 + dx - 3} y={120} width={6} height={760} fill={NA_YELLOW} opacity={0.6} rx={3} />
          </g>
        ))}
        {TERMS.map(([m, L, J], i) => {
          const x = 140 + ((rand(i * 3.3) * 1640 + t * (14 + rand(i) * 18)) % 1640);
          const y = 150 + rand(i * 5.1 + 2) * 680;
          const edge = Math.min(1, (x - 140) / 120, (1780 - x) / 120);
          const s = 44 + rand(i * 7.7) * 30;
          return (
            <text key={i} x={x} y={y} fontFamily={FONT.serif} fontSize={s} fill={C.ink} opacity={0.13 * bg * Math.max(0, edge)} textAnchor="middle">
              <tspan fontSize={s * 0.6} baselineShift="super" fill={C.violet}>
                {m}
              </tspan>
              <tspan fill={C.gold}>{L}</tspan>
              <tspan fontSize={s * 0.55} baselineShift="sub" fill={C.mint}>
                {J}
              </tspan>
            </text>
          );
        })}
      </Stage>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 120}}>
        <Letters
          text="JABAT TANGAN ELEKTRON"
          t={t}
          start={0.6}
          step={0.05}
          style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 120, letterSpacing: 4, lineHeight: 1.08, color: C.gold, textShadow: '0 0 60px rgba(255,194,74,0.45)'}}
        />
        <div style={{width: 700 * line, height: 2, margin: '30px 0 24px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 36, color: C.muted, letterSpacing: 1, opacity: sub, translate: `0px ${(1 - sub) * 16}px`}}>
          Kimia Kuantum · Teori Ikatan Valensi — dari H₂ sampai hibridisasi
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
