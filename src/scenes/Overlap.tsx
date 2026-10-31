import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Label, Stage} from '../components/primitives';
import {HBar, OrbShape, OverlapGlow, overlapArea, type Orb} from '../components/vbB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 7: kekuatan ikatan ∝ tumpang tindih. σ ujung ke ujung (s–s, s–p, p–p); π dari samping (atas–bawah sumbu);
// irisan π lebih kecil → umumnya lebih lemah.

type Kind = 'ss' | 'sp' | 'pp' | 'pi';
const RS = 95;
const LP = 170;
const AMAX = 9000;

const orbs = (kind: Kind, d: number): [Orb, Orb] => {
  if (kind === 'ss') return [{kind: 's', x: -d / 2, y: 0, size: RS}, {kind: 's', x: d / 2, y: 0, size: RS}];
  if (kind === 'sp') return [{kind: 's', x: -d / 2, y: 0, size: RS}, {kind: 'p', x: d / 2, y: 0, ang: Math.PI, size: LP}];
  if (kind === 'pp') return [{kind: 'p', x: -d / 2, y: 0, ang: 0, size: LP}, {kind: 'p', x: d / 2, y: 0, ang: Math.PI, size: LP}];
  return [{kind: 'p', x: -d / 2, y: 0, ang: -Math.PI / 2, size: LP}, {kind: 'p', x: d / 2, y: 0, ang: -Math.PI / 2, size: LP}];
};
const strength = (kind: Kind, d: number) => {
  const [A, B] = orbs(kind, d);
  return Math.min(1, overlapArea(A, B, 4) / AMAX);
};

const PairView: React.FC<{id: string; kind: Kind; d: number; cx: number; cy: number; sc: number; t: number; opacity: number; axis?: number}> = ({id, kind, d, cx, cy, sc, t, opacity, axis = 0}) => {
  if (opacity <= 0.001) return null;
  const [A, B] = orbs(kind, d);
  const col = kind === 'pi' ? C.amber : C.cyan;
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.4);
  const span = d / 2 + LP + 40;
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${sc})`}>
      <line x1={-span} y1={0} x2={span} y2={0} stroke={C.muted} strokeWidth={2.5} strokeDasharray="10 9" opacity={0.25 + 0.75 * axis} />
      <OrbShape o={A} t={t} />
      <OrbShape o={B} t={t + 0.8} />
      <OverlapGlow id={id} A={A} B={B} color={col} pulse={pulse} />
    </g>
  );
};

/** Batang kekuatan tegak. */
const VBar: React.FC<{x: number; y0: number; h: number; v: number; color: string; opacity: number}> = ({x, y0, h, v, color, opacity}) =>
  opacity <= 0.001 ? null : (
    <g opacity={opacity}>
      <Label x={x} y={y0 - h - 40} size={26} color={C.muted} weight={600}>
        kekuatan
      </Label>
      <rect x={x - 24} y={y0 - h} width={48} height={h} rx={24} fill="rgba(20,28,56,0.9)" stroke={C.faint} strokeWidth={2} />
      <rect x={x - 24} y={y0 - Math.max(48, h * v)} width={48} height={Math.max(48, h * v)} rx={24} fill={color} opacity={0.9 * Math.min(1, v * 30)} />
      <rect x={x - 24} y={y0 - Math.max(48, h * v)} width={48} height={14} rx={7} fill="#fff" opacity={0.3 * Math.min(1, v * 30)} />
    </g>
  );

export const Overlap: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // baris 0: dua s mendekat-menjauh, batang mengikuti irisan
  const v0 = ramp(t, -0.4, 0.6) * (1 - ramp(t, cue(1) - 0.2, cue(1) + 0.5, EASE_IN_OUT));
  const dSS = 210 + 72 * Math.cos(0.95 * Math.max(0, t));
  // baris 1: p–p ujung ke ujung (σ)
  const v1 = ramp(t, cue(1) - 0.1, cue(1) + 0.6) * (1 - ramp(t, cue(2) - 0.3, cue(2) + 0.4, EASE_IN_OUT));
  const app1 = ramp(t, cue(1) - 0.1, wordOf(1, 'sumbu') + 0.4, EASE_IN_OUT);
  const dPP1 = mix(360, 255, app1) + 6 * Math.sin(t * 2);
  const axis1 = ramp(t, wordOf(1, 'sumbu') - 0.4, wordOf(1, 'sumbu') + 0.4);
  const sig = ramp(t, wordOf(1, 'sigma') - 0.4, wordOf(1, 'sigma') + 0.4, BACK);
  // baris 2: tiga panel σ
  const v2 = ramp(t, cue(2) - 0.1, cue(2) + 0.6) * (1 - ramp(t, cue(3) - 0.3, cue(3) + 0.4, EASE_IN_OUT));
  const pan = [0, 1, 2].map((k) => ramp(t, wordOf(2, 'dengan', k) - 0.6, wordOf(2, 'dengan', k) + 0.9, EASE_IN_OUT));
  const dPan = [mix(330, 140, pan[0]), mix(400, 205, pan[1]), mix(480, 255, pan[2])].map((d, k) => d + 5 * Math.sin(t * 2 + k));
  const kinds: Kind[] = ['ss', 'sp', 'pp'];
  const PX = [400, 960, 1500];
  // baris 3: π
  const v3 = ramp(t, cue(3) - 0.1, cue(3) + 0.6) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.4, EASE_IN_OUT));
  const app3 = ramp(t, wordOf(3, 'samping') - 1.0, wordOf(3, 'samping') + 0.8, EASE_IN_OUT);
  const dPI = mix(300, 108, app3) + 4 * Math.sin(t * 2.1);
  const piLab = ramp(t, wordOf(3, 'pi', 1) - 0.4, wordOf(3, 'pi', 1) + 0.4, BACK);
  const upDown = ramp(t, wordOf(3, 'atas') - 0.4, wordOf(3, 'bawah') + 0.4);
  // baris 4: σ vs π
  const v4 = ramp(t, cue(4) - 0.1, cue(4) + 0.7);
  const cmp = ramp(t, wordOf(4, 'kecil') - 0.4, wordOf(4, 'kecil') + 0.8, EASE_IN_OUT);
  const weak = ramp(t, wordOf(4, 'lemah') - 0.4, wordOf(4, 'lemah') + 0.4, BACK);
  const d4s = 255 + 5 * Math.sin(t * 2);
  const d4p = 108 + 4 * Math.sin(t * 2.1);

  // batang kanan (baris 0, 1, 3)
  const bar0 = strength('ss', dSS);
  const bar1 = strength('pp', dPP1);
  const bar3 = strength('pi', dPI);
  const barS = (v0 * bar0 + v1 * bar1) / Math.max(0.001, v0 + v1);

  return (
    <AbsoluteFill>
      <Stage>
        {/* baris 0 */}
        <PairView id="ov-ss" kind="ss" d={dSS} cx={860} cy={490} sc={1.4} t={t} opacity={v0} />
        <g opacity={v0}>
          <Label x={860} y={250} size={32} color={C.ink} weight={600}>
            tumpang tindih makin besar → ikatan makin kuat
          </Label>
          <Label x={860} y={760} size={26} color={C.blue}>
            dua orbital s
          </Label>
        </g>

        {/* baris 1: σ ujung ke ujung */}
        <PairView id="ov-pp1" kind="pp" d={dPP1} cx={860} cy={490} sc={1.15} t={t} opacity={v1} axis={axis1} />
        <g opacity={v1}>
          <Label x={860 + 330} y={540} size={24} color={C.muted} opacity={axis1}>
            sumbu ikatan
          </Label>
          <g opacity={sig}>
            <text x={860} y={270} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={92} fill={C.cyan}>
              σ
            </text>
            <Label x={860} y={760} size={30} color={C.cyan} weight={600}>
              ujung ke ujung
            </Label>
          </g>
        </g>

        {/* baris 2: s–s, s–p, p–p */}
        {kinds.map((k, i) => (
          <g key={k} opacity={v2}>
            <PairView id={`ov-p${i}`} kind={k} d={dPan[i]} cx={PX[i]} cy={470} sc={0.78} t={t + i} opacity={0.35 + 0.65 * Math.min(1, pan[i] * 1.5)} axis={1} />
            <text x={PX[i]} y={260} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={40} fill={C.ink} opacity={0.4 + 0.6 * pan[i]}>
              {['s – s', 's – p', 'p – p'][i]}
            </text>
            <HBar x={PX[i] - 120} y={690} w={240} v={strength(k, dPan[i])} color={C.cyan} h={24} opacity={pan[i]} />
          </g>
        ))}
        <g opacity={v2}>
          <Label x={960} y={770} size={28} color={C.cyan} weight={600}>
            semuanya σ: kerapatan di sepanjang sumbu
          </Label>
        </g>

        {/* baris 3: π dari samping */}
        <PairView id="ov-pi" kind="pi" d={dPI} cx={860} cy={480} sc={1.15} t={t} opacity={v3} axis={1} />
        <g opacity={v3}>
          <g opacity={piLab}>
            <text x={560} y={300} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={92} fill={C.amber}>
              π
            </text>
            <Label x={560} y={370} size={28} color={C.amber} weight={600}>
              dari samping
            </Label>
          </g>
          <g opacity={upDown}>
            <Label x={1130} y={300} size={26} color={C.amber} anchor="start">
              ← di atas sumbu
            </Label>
            <Label x={1130} y={660} size={26} color={C.amber} anchor="start">
              ← di bawah sumbu
            </Label>
          </g>
        </g>

        <VBar x={1660} y0={720} h={400} v={barS} color={C.cyan} opacity={Math.max(v0, v1)} />
        <VBar x={1660} y0={720} h={400} v={bar3} color={C.amber} opacity={v3} />

        {/* baris 4: σ vs π */}
        <g opacity={v4}>
          <PairView id="ov-s4" kind="pp" d={d4s} cx={560} cy={460} sc={0.85} t={t} opacity={1} axis={1} />
          <PairView id="ov-pi4" kind="pi" d={d4p} cx={1360} cy={460} sc={0.85} t={t} opacity={1} axis={1} />
          <text x={560} y={235} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={56} fill={C.cyan}>
            σ
          </text>
          <text x={1360} y={235} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={56} fill={C.amber}>
            π
          </text>
          <HBar x={560 - 180} y={720} w={360} v={strength('pp', d4s) * cmp} color={C.cyan} h={30} />
          <HBar x={1360 - 180} y={720} w={360} v={strength('pi', d4p) * cmp} color={C.amber} h={30} />
          <Label x={560} y={770} size={26} color={C.muted} opacity={cmp}>
            irisan besar
          </Label>
          <Label x={1360} y={770} size={26} color={C.muted} opacity={cmp}>
            irisan kecil
          </Label>
          <g opacity={weak}>
            <Label x={1360} y={830} size={34} color={C.red} weight={700}>
              umumnya lebih lemah
            </Label>
          </g>
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
