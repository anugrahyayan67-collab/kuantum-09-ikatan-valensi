import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot, smoothPath} from '../anim';
import {Atom, Badge, DrawPath, Formula, Label, Stage} from '../components/primitives';
import {SpinUD} from '../components/grupA';
import {EDot, PlotFrame, morse} from '../components/vbB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 5: Pauli → ψ total antisimetris. Ruang simetris × spin singlet → ikat (sumur);
// ruang antisimetris × spin triplet → tolak (kurva naik). Pasangan Lewis = ↑↓.

const R1 = 400;
const R2 = 725;
const CR = 430; // kolom ruang
const CS = 900; // kolom spin
const PXa = 1270; // kotak kurva kecil
const PWa = 420;
const PHa = 190;

const singlet = (R: number) => morse(R, 4.75, 74, 0.0194);
const triplet = (R: number) => 2.2 * Math.exp(-0.022 * (R - 74));

/** Kurva mini dalam kotak (R 40..300 pm, E −5,5..+3 eV). */
const miniPath = (f: (R: number) => number, x: number, y: number, w: number, h: number) => {
  const pts: [number, number][] = [];
  for (let R = 40; R <= 300; R += 4) {
    const E = f(R);
    if (E > 3.1) continue;
    pts.push([x + ((R - 40) / 260) * w, y + ((3 - E) / 8.5) * h]);
  }
  return smoothPath(pts);
};

// grafik besar baris 4
const BX = 1110;
const BY = 260;
const BW = 600;
const BH = 500;
const bRX = (R: number) => BX + ((R - 40) / 260) * BW;
const bEY = (E: number) => BY + ((5 - E) / 6.5) * BH;
const D_TRI_BIG = (() => {
  const pts: [number, number][] = [];
  for (let R = 40; R <= 300; R += 3) {
    const E = triplet(R);
    if (E < 5.2) pts.push([bRX(R), bEY(E)]);
  }
  return smoothPath(pts);
})();

/** Pasangan spin; mix = superposisi ↑↓ ⇄ ↓↑ (silang-pudar halus). */
const Pair: React.FC<{x: number; y: number; kind: 'mix' | 'uu'; t: number; opacity: number; len?: number}> = ({x, y, kind, t, opacity, len = 64}) => {
  if (opacity <= 0.001) return null;
  const b = (k: number) => 4 * Math.sin(t * 2.3 + k + y * 0.01);
  if (kind === 'uu')
    return (
      <g opacity={opacity}>
        <SpinUD x={x - 22} y={y + b(0)} up len={len} width={6} />
        <SpinUD x={x + 22} y={y + b(1)} up len={len} width={6} />
      </g>
    );
  const w = 0.5 + 0.5 * Math.sin(t * 2.2);
  return (
    <g opacity={opacity}>
      <g opacity={w}>
        <SpinUD x={x - 22} y={y + b(0)} up len={len} width={6} />
        <SpinUD x={x + 22} y={y + b(1)} up={false} len={len} width={6} />
      </g>
      <g opacity={1 - w}>
        <SpinUD x={x - 22} y={y + b(0)} up={false} len={len} width={6} />
        <SpinUD x={x + 22} y={y + b(1)} up len={len} width={6} />
      </g>
    </g>
  );
};

const Serif: React.FC<{x: number; y: number; size?: number; color?: string; opacity?: number; children: React.ReactNode}> = ({x, y, size = 34, color = C.ink, opacity = 1, children}) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={size} fill={color} opacity={opacity} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: size * 0.1}}>
    {children}
  </text>
);

export const SpinPair: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // baris 0: Pauli
  const fPauli = slot(t, -0.2, cue(1) + 0.05);
  const sw = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, t - wordOf(0, 'ditukar') + 0.6) * 0.7);
  const swOn = ramp(t, wordOf(0, 'ditukar') - 0.6, wordOf(0, 'ditukar'));
  const minus = ramp(t, wordOf(0, 'tanda') - 0.3, wordOf(0, 'tanda') + 0.4, BACK);

  // tabel
  const table = ramp(t, cue(1) - 0.1, cue(1) + 0.6) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.6, EASE_IN_OUT));
  const r1a = ramp(t, wordOf(1, 'simetris', 0) - 0.4, wordOf(1, 'simetris', 0) + 0.4);
  const r1b = ramp(t, wordOf(1, 'antisimetris') - 0.4, wordOf(1, 'antisimetris') + 0.4);
  const sing = ramp(t, wordOf(1, 'singlet') - 0.4, wordOf(1, 'singlet') + 0.4, BACK);
  const hl1 = ramp(t, cue(1), cue(1) + 0.5) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.4));
  const bondCurve = ramp(t, wordOf(2, 'ikatan') - 0.2, wordOf(2, 'ikatan') + 1.4, EASE_IN_OUT);
  const opp = ramp(t, wordOf(2, 'berlawanan') - 0.3, wordOf(2, 'berlawanan') + 0.4);
  const lewisIn = ramp(t, wordOf(2, 'pasangan') - 0.4, wordOf(2, 'pasangan') + 0.3);
  const lewisM = ramp(t, wordOf(2, 'Lewis') - 0.1, wordOf(2, 'Lewis') + 0.9, EASE_IN_OUT);
  const r2 = ramp(t, wordOf(3, 'sejajar') - 0.4, wordOf(3, 'sejajar') + 0.4);
  const trip = ramp(t, wordOf(3, 'triplet') - 0.4, wordOf(3, 'triplet') + 0.4, BACK);
  const r2a = ramp(t, wordOf(3, 'antisimetris') - 0.4, wordOf(3, 'antisimetris') + 0.4);
  const nodeOn = ramp(t, wordOf(3, 'simpul') - 0.3, wordOf(3, 'simpul') + 0.4);
  const repCurve = ramp(t, wordOf(3, 'kurva') - 0.4, wordOf(3, 'naik') + 0.5, EASE_IN_OUT);
  const hl2 = ramp(t, cue(3), cue(3) + 0.5);

  // baris 4: dua H spin sejajar terpental
  const big = ramp(t, cue(4) - 0.1, cue(4) + 0.7);
  const tau = Math.max(0, t - cue(4) + 0.3);
  const om = (2 * Math.PI) / 3.2;
  const dR = 85 + 125 * (0.5 + 0.5 * Math.cos(om * tau)); // pm
  const half = dR * 1.5;
  const close = Math.pow(0.5 - 0.5 * Math.cos(om * tau), 8);
  const never = ramp(t, wordOf(4, 'pernah') - 0.4, wordOf(4, 'pernah') + 0.4, BACK);

  const e1x = mix(860, 1060, sw);
  const e2x = mix(1060, 860, sw);
  const arcY = 70 * Math.sin(Math.PI * sw);

  return (
    <AbsoluteFill>
      <Stage>
        {/* ---------- baris 0: tukar dua elektron ---------- */}
        <g opacity={fPauli}>
          <EDot x={e1x} y={290 - arcY * swOn} n={1} r={22} />
          <EDot x={e2x} y={290 + arcY * swOn} n={2} r={22} />
          <path d="M880,360 Q960,400 1040,360" fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="6 8" opacity={swOn} />
          <Label x={960} y={650} size={30} color={C.muted} opacity={swOn}>
            tukar 1 ⇄ 2 → fungsi gelombang berganti tanda
          </Label>
        </g>

        {/* ---------- tabel ruang × spin ---------- */}
        <g opacity={table}>
          {/* kepala */}
          <Label x={CR} y={240} size={28} color={C.muted} weight={600}>
            bagian ruang
          </Label>
          <Label x={CS} y={240} size={28} color={C.muted} weight={600}>
            bagian spin
          </Label>
          <Label x={PXa + PWa / 2} y={240} size={28} color={C.muted} weight={600}>
            kurva energi
          </Label>
          <line x1={150} y1={268} x2={1770} y2={268} stroke={C.faint} strokeWidth={2} />
          <Label x={(CR + CS) / 2} y={R1} size={44} color={C.muted} opacity={r1a}>
            ×
          </Label>
          <Label x={(CR + CS) / 2} y={R2} size={44} color={C.muted} opacity={r2}>
            ×
          </Label>

          {/* sorotan baris */}
          <rect x={160} y={R1 - 115} width={1600} height={230} rx={22} fill={C.cyan} opacity={0.06 * hl1} />
          <rect x={160} y={R2 - 115} width={1600} height={230} rx={22} fill={C.red} opacity={0.06 * hl2} />

          {/* baris 1: simetris × singlet → ikat */}
          <g opacity={r1a}>
            <Label x={CR} y={R1 - 62} size={30} color={C.cyan} weight={700}>
              simetris
            </Label>
            <Serif x={CR} y={R1} size={34}>
              a(1)b(2) + b(1)a(2)
            </Serif>
            <ellipse cx={CR} cy={R1 + 62} rx={120} ry={22} fill={C.cyan} opacity={0.25} />
            <ellipse cx={CR} cy={R1 + 62} rx={50} ry={16} fill={C.cyan} opacity={0.35} />
          </g>
          <g opacity={r1b}>
            <Label x={CS} y={R1 - 70} size={30} color={C.violet} weight={700} opacity={1}>
              antisimetris
            </Label>
          </g>
          <g opacity={sing}>
            <Pair x={CS} y={R1 + 5} kind="mix" t={t} opacity={1} />
            <Serif x={CS} y={R1 + 72} size={28} color={C.violet}>
              singlet: ↑↓ − ↓↑
            </Serif>
          </g>
          <g opacity={opp}>
            <Label x={1150} y={R1} size={44} color={C.mint} weight={700}>
              →
            </Label>
          </g>
          <g opacity={opp}>
            <rect x={PXa} y={R1 - PHa / 2} width={PWa} height={PHa} rx={14} fill="rgba(10,16,36,0.75)" stroke={C.faint} strokeWidth={2} />
            <line x1={PXa + 10} y1={R1 - PHa / 2 + (3 / 8.5) * PHa} x2={PXa + PWa - 10} y2={R1 - PHa / 2 + (3 / 8.5) * PHa} stroke={C.faint} strokeWidth={2} strokeDasharray="6 7" />
            <DrawPath d={miniPath(singlet, PXa, R1 - PHa / 2, PWa, PHa)} p={bondCurve} stroke={C.cyan} width={5} />
            <Label x={PXa + PWa - 20} y={R1 + 58} size={32} color={C.mint} anchor="end" weight={700} opacity={bondCurve}>
              ikat
            </Label>
          </g>
          {/* pasangan Lewis H:H → ↑↓ */}
          <g opacity={lewisIn * (1 - r2 * 0.6)}>
            <Label x={CS - 80} y={R1 + 150} size={40} color={C.ink} weight={700} opacity={1}>
              H
            </Label>
            <Label x={CS + 80} y={R1 + 150} size={40} color={C.ink} weight={700}>
              H
            </Label>
            <g opacity={1 - lewisM}>
              <circle cx={CS - 14} cy={R1 + 150} r={8} fill={C.cyan} />
              <circle cx={CS + 14} cy={R1 + 150} r={8} fill={C.cyan} />
            </g>
            <g opacity={lewisM}>
              <SpinUD x={CS - 16} y={R1 + 150} up len={mix(16, 52, lewisM)} width={5} />
              <SpinUD x={CS + 16} y={R1 + 150} up={false} len={mix(16, 52, lewisM)} width={5} />
            </g>
            <Label x={CS + 150} y={R1 + 150} size={24} color={C.muted} anchor="start" opacity={lewisM}>
              pasangan Lewis
            </Label>
          </g>

          {/* baris 2: antisimetris × triplet → tolak */}
          <g opacity={r2a}>
            <Label x={CR} y={R2 - 62} size={30} color={C.red} weight={700}>
              antisimetris
            </Label>
            <Serif x={CR} y={R2} size={34}>
              a(1)b(2) − b(1)a(2)
            </Serif>
            <ellipse cx={CR - 62} cy={R2 + 62} rx={56} ry={20} fill={C.red} opacity={0.25} />
            <ellipse cx={CR + 62} cy={R2 + 62} rx={56} ry={20} fill={C.red} opacity={0.25} />
            <line x1={CR} y1={R2 + 36} x2={CR} y2={R2 + 88} stroke={C.red} strokeWidth={3} strokeDasharray="5 5" opacity={nodeOn} />
            <Label x={CR + 150} y={R2 + 62} size={22} color={C.red} anchor="start" opacity={nodeOn}>
              simpul
            </Label>
          </g>
          <g opacity={trip}>
            <Label x={CS} y={R2 - 70} size={30} color={C.violet} weight={700}>
              simetris
            </Label>
            <Pair x={CS} y={R2 + 5} kind="uu" t={t + 1.3} opacity={1} />
            <Serif x={CS} y={R2 + 72} size={28} color={C.violet}>
              triplet: ↑↑
            </Serif>
          </g>
          <g opacity={Math.min(1, repCurve * 3)}>
            <Label x={1150} y={R2} size={44} color={C.red} weight={700}>
              →
            </Label>
            <rect x={PXa} y={R2 - PHa / 2} width={PWa} height={PHa} rx={14} fill="rgba(10,16,36,0.75)" stroke={C.faint} strokeWidth={2} />
            <line x1={PXa + 10} y1={R2 - PHa / 2 + (3 / 8.5) * PHa} x2={PXa + PWa - 10} y2={R2 - PHa / 2 + (3 / 8.5) * PHa} stroke={C.faint} strokeWidth={2} strokeDasharray="6 7" />
            <DrawPath d={miniPath(triplet, PXa, R2 - PHa / 2, PWa, PHa)} p={repCurve} stroke={C.red} width={5} />
            <Label x={PXa + PWa - 20} y={R2 - 40} size={32} color={C.red} anchor="end" weight={700} opacity={repCurve}>
              tolak
            </Label>
          </g>
        </g>

        {/* ---------- baris 4: dua H spin sejajar terpental ---------- */}
        <g opacity={big}>
          <circle cx={650} cy={500} r={60 + 140 * close} fill="none" stroke={C.red} strokeWidth={4} opacity={0.8 * close} />
          <circle cx={650} cy={500} r={120 * close} fill="url(#soft-red)" opacity={0.6 * close} />
          <Atom x={650 - half} y={500} el="H" r={38} />
          <Atom x={650 + half} y={500} el="H" r={38} />
          <SpinUD x={650 - half} y={395} up len={90} width={7} />
          <SpinUD x={650 + half} y={395} up len={90} width={7} />
          <Label x={650} y={640} size={30} color={C.violet} weight={600}>
            spin sejajar (triplet)
          </Label>
          <PlotFrame x={BX} y={BY} w={BW} h={BH} zeroY={bEY(0)} xlabel="R (pm)" ylabel="energi" />
          <path d={D_TRI_BIG} fill="none" stroke={C.red} strokeWidth={6} />
          <circle cx={bRX(dR)} cy={bEY(triplet(dR))} r={30} fill="url(#soft-red)" />
          <circle cx={bRX(dR)} cy={bEY(triplet(dR))} r={12} fill={C.red} stroke="#fff" strokeWidth={2} />
          <Label x={bRX(250)} y={bEY(0) - 40} size={26} color={C.red} weight={600}>
            tanpa sumur
          </Label>
        </g>
      </Stage>

      <Formula x={960} y={480} p={fPauli} caption="larangan Pauli">
        <span style={{fontStyle: 'italic'}}>ψ</span>(2, 1) = <span style={{color: C.red, opacity: 0.25 + 0.75 * minus}}>−</span>
        <span style={{fontStyle: 'italic'}}>ψ</span>(1, 2)
      </Formula>
      <Badge x={650} y={790} text="tidak akan pernah berikatan" color={C.red} opacity={never * big} scale={0.85 + 0.15 * never} />
    </AbsoluteFill>
  );
};
