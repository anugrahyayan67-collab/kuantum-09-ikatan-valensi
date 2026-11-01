import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {H2Pair, VbDefs} from '../components/vbA';
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

// Rumus & simbol ikatan yang melayang samar di latar.
const sub = (s: number, v: string, col?: string) => (
  <tspan fontSize={s * 0.6} baselineShift="sub" fill={col}>
    {v}
  </tspan>
);
const sup = (s: number, v: string, col?: string) => (
  <tspan fontSize={s * 0.6} baselineShift="super" fill={col}>
    {v}
  </tspan>
);
const FLOATS: ((s: number) => React.ReactNode)[] = [
  (s) => (
    <>
      <tspan fill={C.mint}>sp</tspan>
      {sup(s, '3', C.mint)}
    </>
  ),
  (s) => <tspan fill={C.cyan}>σ</tspan>,
  (s) => (
    <>
      <tspan fill={C.ink}>H</tspan>
      {sub(s, '2')}
    </>
  ),
  () => <tspan fill={C.amber}>π</tspan>,
  () => <tspan fill={C.gold}>74 pm</tspan>,
  (s) => (
    <>
      <tspan fill={C.mint}>sp</tspan>
      {sup(s, '2', C.mint)}
    </>
  ),
  () => <tspan fill={C.violet}>ψ = a(1)b(2) + b(1)a(2)</tspan>,
  () => <tspan fill={C.mint}>109,5°</tspan>,
  () => (
    <>
      <tspan fill={C.cyan}>↑</tspan>
      <tspan fill={C.pink}>↓</tspan>
    </>
  ),
  (s) => (
    <>
      <tspan fill={C.red}>D</tspan>
      {sub(s, 'e', C.red)}
      <tspan fill={C.red}> ≈ 4,75 eV</tspan>
    </>
  ),
];

export const Title: React.FC = () => {
  const {t} = useScene();
  const bg = ramp(t, 0.1, 2.0, EASE_IN_OUT);
  const sub = ramp(t, 2.6, 3.6);
  const line = ramp(t, 1.8, 3.2, EASE_IN_OUT);
  const meet = ramp(t, 0.2, 4.0, EASE_IN_OUT);
  const flashP = ramp(t, 3.6, 5.2);
  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Glow x={960} y={470} r={640} color="gold" opacity={0.12 * bg} />
        {/* dua atom H yang mendekat di belakang judul, awannya menyatu */}
        <g opacity={0.5 * bg}>
          <H2Pair x1={mix(330, 885, meet)} x2={mix(1590, 1035, meet)} y={470} t={t} R={150} merge={ramp(t, 3.4, 4.6)} />
        </g>
        <circle cx={960} cy={470} r={420 * flashP + 80} fill="url(#vbA-flash)" opacity={0.35 * Math.max(0, 1 - Math.abs(t - 4.0) / 1.2) * bg} />
        {FLOATS.map((f, i) => {
          const x = 140 + ((rand(i * 3.3) * 1640 + t * (14 + rand(i) * 18)) % 1640);
          const y = 150 + rand(i * 5.1 + 2) * 680;
          const edge = Math.min(1, (x - 140) / 120, (1780 - x) / 120);
          const s = 40 + rand(i * 7.7) * 26;
          return (
            <text key={i} x={x} y={y} fontFamily={FONT.serif} fontSize={s} fill={C.ink} opacity={0.16 * bg * Math.max(0, edge)} textAnchor="middle">
              {f(s)}
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
