import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {SpinVec} from '../components/grupA';
import {DE, RE, morse} from '../components/vbA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Peta video: tiga bagian (prinsip dasar → implementasi dalam kimia → penerapan).
const O2 = (
  <>
    O<tspan baselineShift="sub" fontSize={17}>
      2
    </tspan>
  </>
);
const CARDS: {n: string; title: string; items: React.ReactNode[]; words: string[]; color: string; glow: 'cyan' | 'violet' | 'gold'; x: number}[] = [
  {n: '1', title: 'Prinsip dasar', items: ['kurva energi', 'Heitler–London', 'pasangan spin', 'tumpang tindih orbital'], words: ['kurva', 'Heitler', 'spin', 'tumpang'], color: C.cyan, glow: 'cyan', x: 420},
  {n: '2', title: 'Implementasi dalam kimia', items: ['hibridisasi', 'bentuk molekul', 'pasangan elektron bebas', 'resonansi'], words: ['hibridisasi', 'bentuk', 'bebas', 'resonansi'], color: C.violet, glow: 'violet', x: 960},
  {n: '3', title: 'Penerapan', items: ['wujud karbon', 'plastik penghantar listrik', <>kegagalan: {O2} paramagnetik</>], words: ['karbon', 'plastik', 'kegagalan'], color: C.amber, glow: 'gold', x: 1500},
];
const Y = 560;
const CW = 480;
const CH = 380;

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    // kurva energi mini dengan titik yang berayun di dasar sumur
    const R0 = 30;
    const R1 = 260;
    const X = (R: number) => x - 60 + ((R - R0) / (R1 - R0)) * 120;
    const Yv = (E: number) => y - 40 - (E / DE) * 60;
    const pts = Array.from({length: 61}, (_, k) => {
      const R = R0 + ((R1 - R0) * k) / 60;
      return `${k ? 'L' : 'M'}${X(R).toFixed(1)},${Math.max(y - 72, Yv(morse(R))).toFixed(1)}`;
    }).join(' ');
    const Rd = RE + 16 * Math.sin(t * 2.4);
    return (
      <g>
        <line x1={x - 62} y1={y - 40} x2={x + 62} y2={y - 40} stroke={C.faint} strokeWidth={1.5} strokeDasharray="4 4" />
        <path d={pts} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={X(Rd)} cy={Yv(morse(Rd))} r={6} fill={C.gold} />
      </g>
    );
  }
  if (i === 1) {
    // tetrahedron sp³ yang berputar pelan
    const yaw = t * 0.8;
    const dirs = [
      [0, 1, 0],
      [0.943, -0.333, 0],
      [-0.471, -0.333, 0.816],
      [-0.471, -0.333, -0.816],
    ];
    const lobes = dirs
      .map(([dx, dy, dz]) => {
        const rx = dx * Math.cos(yaw) + dz * Math.sin(yaw);
        const rz = -dx * Math.sin(yaw) + dz * Math.cos(yaw);
        return {px: x + rx * 46, py: y - 10 - dy * 46 + rz * 8, z: rz};
      })
      .sort((a, b) => a.z - b.z);
    return (
      <g>
        {lobes.map((l, k) => (
          <g key={k} opacity={0.55 + 0.35 * (l.z + 1) * 0.5}>
            <line x1={x} y1={y - 10} x2={l.px} y2={l.py} stroke={C.mint} strokeWidth={4} strokeLinecap="round" />
            <circle cx={l.px} cy={l.py} r={10} fill={C.mint} />
          </g>
        ))}
        <circle cx={x} cy={y - 10} r={11} fill="#6a7390" stroke="#aeb7d6" strokeWidth={1.5} />
      </g>
    );
  }
  // O₂ dengan dua elektron tak berpasangan (spin sejajar)
  const bob = 4 * Math.sin(t * 2.2);
  return (
    <g>
      <circle cx={x - 26} cy={y - 6} r={20} fill="#ff4d63" />
      <circle cx={x + 26} cy={y - 6} r={20} fill="#ff4d63" />
      <SpinVec x1={x - 20} y1={y - 40 + bob} x2={x - 20} y2={y - 80 + bob} color={C.cyan} width={3.5} head={12} />
      <SpinVec x1={x + 20} y1={y - 40 - bob} x2={x + 20} y2={y - 80 - bob} color={C.cyan} width={3.5} head={12} />
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const head = ramp(t, -0.2, 0.9);
  const next = ramp(t, wordOf(3, 'membuka') - 0.3, wordOf(3, 'berikutnya') + 0.5, EASE_IN_OUT);
  const nextP = ramp(t, wordOf(3, 'berikutnya') - 0.2, wordOf(3, 'berikutnya') + 0.6, BACK);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', opacity: head, translate: `0px ${(1 - head) * 20}px`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 6, color: C.gold}}>PETA PERJALANAN · PERTEMUAN 9</div>
        <div style={{fontFamily: FONT.sans, fontSize: 60, fontWeight: 700, color: C.ink, marginTop: 6}}>Teori Ikatan Valensi</div>
      </div>
      <Stage>
        {CARDS.map((c, i) => {
          const p = ramp(t, cue(0) + 0.2 + i * 0.25, cue(0) + 1.0 + i * 0.25, BACK);
          const on = ramp(t, cue(i + 1) - 0.1, cue(i + 1) + 0.5);
          const off = i < 2 ? ramp(t, cue(i + 2) - 0.1, cue(i + 2) + 0.5, EASE_IN_OUT) : 0;
          const lit = on * (1 - off);
          const dim = 0.55 + 0.45 * Math.max(lit, 1 - ramp(t, cue(1) - 0.2, cue(1) + 0.4));
          const top = Y - CH / 2;
          const left = c.x - CW / 2;
          return (
            <g key={i} opacity={p * dim} transform={`translate(0 ${(1 - p) * 40 - 10 * lit})`}>
              <Glow x={c.x} y={Y} r={280} color={c.glow} opacity={0.2 * lit} />
              <rect x={left} y={top} width={CW} height={CH} rx={28} fill="rgba(12,18,40,0.85)" stroke={c.color} strokeOpacity={0.3 + 0.6 * lit} strokeWidth={2.5} />
              <text x={left + 36} y={top + 66} fontFamily={FONT.mono} fontSize={64} fontWeight={600} fill={c.color} dominantBaseline="central">
                {c.n}
              </text>
              <Icon i={i} x={left + CW - 100} y={top + 90} t={t} />
              <text x={left + 36} y={top + 150} fontFamily={FONT.sans} fontSize={31} fontWeight={700} fill={C.ink}>
                {c.title}
              </text>
              <rect x={left + 36} y={top + 172} width={(CW - 72) * on} height={2} fill={c.color} opacity={0.6} />
              {c.items.map((it, k) => {
                const w = ramp(t, wordOf(i + 1, c.words[k]) - 0.25, wordOf(i + 1, c.words[k]) + 0.35);
                const yy = top + 216 + k * 40;
                return (
                  <g key={k} opacity={0.35 + 0.65 * w}>
                    <circle cx={left + 46} cy={yy} r={5 + 2 * w} fill={c.color} />
                    <text x={left + 66} y={yy} dominantBaseline="central" fontFamily={FONT.sans} fontSize={25} fill={C.ink}>
                      {it}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* jembatan ke teori berikutnya */}
        <g opacity={next}>
          <path d={`M1500,${Y + CH / 2 + 8} L1500,${Y + CH / 2 + 34}`} stroke={C.amber} strokeWidth={3} strokeDasharray="6 6" strokeDashoffset={-t * 20} />
          <g transform={`translate(1500 ${Y + 262}) scale(${mix(0.85, 1, nextP)})`}>
            <rect x={-230} y={-30} width={460} height={60} rx={30} fill="rgba(12,18,40,0.92)" stroke={C.amber} strokeWidth={2} />
            <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={25} fontWeight={600} fill={C.ink}>
              → membuka <tspan fill={C.amber}>teori orbital molekul</tspan>
            </text>
          </g>
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
