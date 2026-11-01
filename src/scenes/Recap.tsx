import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Atom, Glow, Stage, Sub, Sup} from '../components/primitives';
import {HexIcon, POrb, Spin, lobePath} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 18: enam poin rangkuman (2 kolom × 3 baris) dengan ikon bergerak; ditutup O₂ + magnet → orbital molekul.
const COLX = [80, 990];
const CW = 850;
const CH = 196;
const ROWY = [285, 505, 725];
const pos = (i: number) => ({x: COLX[Math.floor(i / 3)], y: ROWY[i % 3]});

const ROWS: {title: React.ReactNode; detail: React.ReactNode; col: string}[] = [
  {title: 'Efek pertukaran', detail: 'elektron menumpuk di antara dua inti', col: C.cyan},
  {title: 'Pasangan spin (Pauli)', detail: 'dua elektron sepasang, spin berlawanan ↑↓', col: C.pink},
  {title: <>Ikatan σ dan π</>, detail: 'σ: tumpang tindih ujung · π: samping', col: C.amber},
  {
    title: 'Hibridisasi',
    detail: (
      <>
        sp<Sup>3</Sup> 109,5° · sp<Sup>2</Sup> 120° · sp 180°
      </>
    ),
    col: C.mint,
  },
  {title: 'Resonansi & wujud karbon', detail: 'benzena · intan · grafit · plastik penghantar', col: C.gold},
  {
    title: (
      <>
        O<Sub>2</Sub> tertarik magnet
      </>
    ),
    detail: 'VBT gagal → orbital molekul (video berikutnya)',
    col: C.violet,
  },
];

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    return (
      <g>
        <ellipse cx={x} cy={y} rx={62 + 6 * pulse} ry={30 + 4 * pulse} fill={C.cyan} opacity={0.18} />
        <ellipse cx={x} cy={y} rx={30 + 4 * pulse} ry={18} fill={C.cyan} opacity={0.4} />
        <Atom x={x - 44} y={y} el="H" r={17} label={null} glow={0.4} />
        <Atom x={x + 44} y={y} el="H" r={17} label={null} glow={0.4} />
        {[0, 1].map((k) => (
          <circle key={k} cx={x + 18 * Math.cos(t * 2.2 + k * Math.PI)} cy={y + 8 * Math.sin(t * 2.2 + k * Math.PI)} r={5} fill={C.cyan} />
        ))}
      </g>
    );
  }
  if (i === 1) {
    const j = 4 * Math.sin(t * 3);
    return (
      <g>
        <rect x={x - 46} y={y - 46} width={92} height={92} rx={10} fill="rgba(14,20,44,0.9)" stroke={C.ink} strokeOpacity={0.6} strokeWidth={3} />
        <Spin x={x - 16} y={y + j} up len={56} width={5} />
        <Spin x={x + 16} y={y - j} up={false} len={56} width={5} />
      </g>
    );
  }
  if (i === 2) {
    const w = 0.5 + 0.5 * Math.sin(t * 2);
    return (
      <g>
        {/* σ: ujung ke ujung */}
        <path d={lobePath(x - 8, y - 40, 44, 15, 90)} fill={C.gold} fillOpacity={0.6} stroke={C.gold} strokeWidth={1.5} />
        <path d={lobePath(x - 8, y - 40, 34, 12, -90)} fill={C.violet} fillOpacity={0.6} stroke={C.violet} strokeWidth={1.5} />
        <path d={lobePath(x + 8, y - 40, 44, 15, -90)} fill={C.gold} fillOpacity={0.6} stroke={C.gold} strokeWidth={1.5} />
        <path d={lobePath(x + 8, y - 40, 34, 12, 90)} fill={C.violet} fillOpacity={0.6} stroke={C.violet} strokeWidth={1.5} />
        <circle cx={x} cy={y - 40} r={9 + 3 * w} fill={C.cyan} opacity={0.7} />
        {/* π: samping */}
        <POrb x={x - 20} y={y + 42} L={36} w={13} />
        <POrb x={x + 20} y={y + 42} L={36} w={13} />
        <ellipse cx={x} cy={y + 14} rx={30} ry={8} fill={C.amber} opacity={0.35 + 0.3 * w} />
        <ellipse cx={x} cy={y + 70} rx={30} ry={8} fill={C.amber} opacity={0.35 + 0.3 * w} />
      </g>
    );
  }
  if (i === 3) {
    const ph = (t * 0.35) % 3;
    const wgt = (k: number) => {
      const d = Math.min(Math.abs(ph - k), 3 - Math.abs(ph - k));
      return Math.max(0, 1 - d * 1.6);
    };
    const yaw = t * 0.8;
    const sets: [number, number, number][][] = [
      [
        [0, 0, 1],
        [0.943, 0, -0.333],
        [-0.471, 0.816, -0.333],
        [-0.471, -0.816, -0.333],
      ],
      [
        [1, 0, 0],
        [-0.5, 0.866, 0],
        [-0.5, -0.866, 0],
      ],
      [
        [1, 0, 0],
        [-1, 0, 0],
      ],
    ];
    return (
      <g>
        {sets.map((s, k) => (
          <g key={k} opacity={wgt(k)}>
            {s.map((v, m) => {
              const X = v[0] * Math.cos(yaw) - v[1] * Math.sin(yaw);
              const D = v[0] * Math.sin(yaw) + v[1] * Math.cos(yaw);
              const Y = -v[2] * 0.9 + D * 0.3;
              const L = 58;
              return (
                <g key={m}>
                  <line x1={x} y1={y} x2={x + X * L} y2={y + Y * L} stroke={C.mint} strokeWidth={6} strokeLinecap="round" opacity={0.75 + 0.25 * D} />
                  <circle cx={x + X * L} cy={y + Y * L} r={10} fill="#f2f5ff" />
                </g>
              );
            })}
            <text x={x} y={y + 76} textAnchor="middle" fontFamily={FONT.sans} fontSize={22} fontWeight={700} fill={C.mint}>
              {['sp', 'sp', 'sp'][k]}
              {k < 2 ? (
                <tspan fontSize={14} baselineShift="45%">
                  {k === 0 ? '3' : '2'}
                </tspan>
              ) : null}
            </text>
          </g>
        ))}
        <circle cx={x} cy={y} r={14} fill="url(#atom-C)" />
      </g>
    );
  }
  if (i === 4) {
    return (
      <g>
        <circle cx={x} cy={y} r={70} fill="url(#soft-gold)" opacity={0.25 + 0.1 * Math.sin(t * 2)} />
        <HexIcon x={x} y={y} r={58} mode="ring" width={5} rot={-Math.PI / 2 + t * 0.25} />
      </g>
    );
  }
  // i === 5: O₂ menggantung di celah magnet
  const sway = 3 * Math.sin(t * 2);
  return (
    <g>
      <path d={`M${x - 62},${y - 30} L${x - 62},${y + 30} A62,48 0 0 0 ${x + 62},${y + 30} L${x + 62},${y - 30} L${x + 36},${y - 30} L${x + 36},${y + 30} A36,26 0 0 1 ${x - 36},${y + 30} L${x - 36},${y - 30} Z`} fill="#7d879f" />
      <rect x={x - 62} y={y - 56} width={50} height={26} fill={C.red} />
      <rect x={x + 12} y={y - 56} width={50} height={26} fill={C.blue} />
      <rect x={x - 12} y={y - 54} width={24} height={22} fill="#bfe4ff" opacity={0.9} />
      <circle cx={x - 8} cy={y - 74 + sway} r={9} fill={C.red} />
      <circle cx={x + 8} cy={y - 74 + sway} r={9} fill={C.red} />
    </g>
  );
};

export const Recap: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const intro = ramp(t, cue(0) - 0.4, cue(0) + 0.6);
  const lit = ROWS.map((_, i) => ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 0.5, BACK));
  const cur = (i: number) => Math.min(1, ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 0.4)) * (1 - 0.35 * ramp(t, cue(i + 2) - 0.3, cue(i + 2) + 0.4));
  const finale = ramp(t, wordOf(6, 'orbital') - 0.3, wordOf(6, 'orbital') + 0.6);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={500} r={700} color="gold" opacity={0.05 + 0.03 * Math.sin(t)} />
        {ROWS.map((r, i) => {
          const p = pos(i);
          const hot = cur(i);
          return (
            <g key={i} opacity={intro * (0.12 + 0.88 * lit[i])}>
              <rect x={p.x} y={p.y - CH / 2} width={CW} height={CH} rx={22} fill="rgba(12,18,40,0.72)" stroke={r.col} strokeWidth={2.5} strokeOpacity={0.25 + 0.6 * hot + (i === 5 ? 0.3 * finale * (0.6 + 0.4 * Math.sin(t * 4)) : 0)} />
              <rect x={p.x} y={p.y - CH / 2 + 24} width={6} height={CH - 48} rx={3} fill={r.col} opacity={0.4 + 0.6 * hot} />
              <circle cx={p.x + 120} cy={p.y} r={84} fill="rgba(6,10,24,0.8)" stroke={r.col} strokeOpacity={0.3 + 0.4 * hot} strokeWidth={2} />
              <g opacity={lit[i]}>
                <Icon i={i} x={p.x + 120} y={p.y} t={t} />
              </g>
            </g>
          );
        })}
        <Glow x={pos(5).x + 120} y={pos(5).y} r={150} color="violet" opacity={0.45 * finale} />
      </Stage>
      {ROWS.map((r, i) => {
        const p = pos(i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + 232,
              top: p.y,
              width: CW - 262,
              transform: `translate(${(1 - lit[i]) * -24}px, -50%)`,
              opacity: lit[i] * intro * (0.6 + 0.4 * cur(i)),
            }}
          >
            <div style={{fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: r.col, lineHeight: 1.15}}>{r.title}</div>
            <div style={{fontFamily: FONT.sans, fontSize: 30, color: C.ink, lineHeight: 1.3, marginTop: 6}}>{r.detail}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
