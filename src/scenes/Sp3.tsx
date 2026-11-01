import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Card, Formula, Glow, Label, Stage, Sub, Sup} from '../components/primitives';
import {Render3D, SvgChem, TETRA, VbDefs, angleArc, ball, bond, hybrid, lerp3, mul, norm, pOrb, proj, sphere, wire, type Cam, type Item, type V3} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 09: Pauling 1931 — s + 3p → 4 hibrida sp³ identik, tetrahedral 109,5°, metana.
const ROW = [480, 800, 1120, 1440];
const CY = 580;
const D0: V3 = norm([0.55, -0.35, 0.75]);
const PDIR: V3[] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
const CHOSEN = 1;

export const Sp3: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
  const yawSpin = 0.4 + t * 0.3;
  const yawRow = 0.3 + 0.25 * Math.sin(t * 0.5);
  const pitch = -0.32;

  // baris 0: Pauling, lalu s + 3p bergerak ke tengah & melebur
  const badge = slot(t, wordOf(0, 'Pauling') - 0.4, cue(1) + 0.2, 0.6, 0.4);
  const orbIn = [0, 1, 2, 3].map((k) => ramp(t, 0.3 + k * 0.3, 0.9 + k * 0.3, BACK));
  const merge = ramp(t, wordOf(0, 'campurkan') - 0.1, cue(1) + 0.3, EASE_IN_OUT);
  const blob = Math.sin(Math.PI * Math.min(1, ramp(t, wordOf(0, 'campurkan'), wordOf(1, 'empat') + 0.4))) * 1;

  // baris 1: empat hibrida identik
  const emerge = ramp(t, wordOf(1, 'menghasilkan') - 0.2, wordOf(1, 'empat') + 0.7, EASE_IN_OUT);
  const iden = ramp(t, wordOf(1, 'identik') - 0.2, wordOf(1, 'identik') + 0.4);
  const card1 = slot(t, cue(1) + 0.1, cue(2) + 0.2);

  // baris 2: satu hibrida diperbesar
  const focus = ramp(t, cue(2) - 0.1, cue(2) + 0.9, EASE_IN_OUT) * (1 - ramp(t, cue(3) - 0.1, cue(3) + 0.6, EASE_IN_OUT));
  const big = ramp(t, wordOf(2, 'lobus') - 0.2, wordOf(2, 'besar') + 0.3);
  const small = ramp(t, wordOf(2, 'menonjol'), wordOf(2, 'arah') + 0.2);
  const strong = ramp(t, wordOf(2, 'tumpang') - 0.2, wordOf(2, 'kuat') + 0.3);

  // baris 3: menyusun tetrahedron
  const tet = ramp(t, cue(3) + 0.1, wordOf(3, 'tetrahedron') + 0.3, EASE_IN_OUT);
  const frame = ramp(t, wordOf(3, 'sudut-sudut') - 0.2, wordOf(3, 'tetrahedron') + 0.6);
  const arc = ramp(t, wordOf(3, 'seratus') - 0.2, wordOf(3, 'derajat') + 0.2, EASE_IN_OUT);

  // baris 4: hidrogen datang → metana
  const hIn = ramp(t, cue(4) - 0.1, wordOf(4, 'hidrogen') + 0.4, EASE_IN_OUT);
  const sig = ramp(t, wordOf(4, 'ikatan') - 0.3, wordOf(4, 'sigma') + 0.4);
  const done = ramp(t, wordOf(4, 'Metana') - 0.2, wordOf(4, 'Metana') + 0.6);
  const card4 = slot(t, wordOf(4, 'ikatan') - 0.1, 999);
  const frameOut = 1 - ramp(t, cue(4) - 0.2, cue(4) + 0.6);

  const yaw = mix(yawRow, yawSpin, Math.max(tet, hIn));
  const items: Item[] = [];
  // s + 3p (sebelum melebur)
  const orbOp = 1 - ramp(merge, 0.55, 0.95);
  if (orbOp > 0.01) {
    ROW.forEach((x, k) => {
      const cam: Cam = {cx: mix(x, 960, merge), cy: CY, s: mix(110, 70, merge), yaw, pitch};
      const op = orbIn[k] * orbOp;
      if (k === 0) {
        const it = sphere(cam, {center: [0, 0, 0], r: 0.75, color: 'blue', opacity: 0.88 * op});
        if (it) items.push(it);
      } else items.push(...pOrb(cam, {origin: [0, 0, 0], dir: PDIR[k - 1], len: 1.05, wid: 0.44, opacity: 0.9 * op}));
    });
  }

  // empat hibrida: baris → (fokus) → tetrahedron
  const hybOp = emerge * (1 - sig * 0.85) * (1 - 0.5 * hIn);
  if (hybOp > 0.01) {
    for (let k = 0; k < 4; k++) {
      const isC = k === CHOSEN;
      const rowX = mix(960, ROW[k], emerge);
      const cx = mix(isC ? mix(rowX, 960, focus) : rowX, 960, tet);
      const s = mix(isC ? mix(110, 210, focus) : 110, 175, tet);
      const cam: Cam = {cx, cy: mix(CY, 560, tet), s, yaw, pitch};
      const dir = norm(lerp3(D0, TETRA[k], tet));
      const op = hybOp * (isC ? 1 : 1 - focus * 0.9);
      items.push(...hybrid(cam, {origin: [0, 0, 0], dir, len: mix(1.3, 1.1, tet), wid: mix(0.55, 0.4, tet), opacity: 0.88 * op, glow: Math.max(iden * pulse * (1 - tet), isC ? big * focus : 0)}));
    }
  }

  // kerangka tetrahedron + kubus
  const camT: Cam = {cx: 960, cy: 560, s: 175, yaw, pitch};
  const R = 1.1;
  const A = TETRA.map((v) => mul(v, R));
  const B = TETRA.map((v) => mul(v, -R));
  const frOp = frame * frameOut;
  if (frOp > 0.01) {
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        if (i !== j) {
          const w = wire(camT, {a: A[i], b: B[j], color: C.muted, opacity: 0.35 * frOp, width: 1.8, dashBack: true});
          if (w) items.push(w);
        }
        if (j > i) {
          const w = wire(camT, {a: A[i], b: A[j], color: C.gold, opacity: 0.8 * frOp, width: 2.6, dashBack: true});
          if (w) items.push(w);
        }
      }
  }
  const arcIt = angleArc(camT, {center: [0, 0, 0], u: TETRA[0], v: TETRA[1], r: 0.6, labelR: 1.0, p: arc, opacity: arc * (1 - hIn), label: '109,5°', size: 56, color: C.gold});
  if (arcIt) items.push(arcIt);

  // hidrogen + ikatan σ
  if (hIn > 0.01) {
    TETRA.forEach((v, k) => {
      const pos = mul(v, mix(3.2, 1.09, hIn));
      const b = ball(camT, {pos, el: 'H', opacity: hIn});
      if (b) items.push(b);
      const s1 = sphere(camT, {center: pos, r: 0.42, color: 'blue', opacity: 0.45 * hIn * (1 - sig)});
      if (s1) items.push(s1);
      const bd = bond(camT, {a: [0, 0, 0], b: pos, color: C.cyan, opacity: sig, width: 0.14});
      if (bd) items.push(bd);
    });
    const cb = ball(camT, {pos: [0, 0, 0], el: 'C', opacity: Math.max(hIn, 0)});
    if (cb) items.push(cb);
  }

  // label lobus besar / kecil (baris 2)
  const camF: Cam = {cx: 960, cy: CY, s: 210, yaw, pitch};
  const tip = proj(mul(D0, 1.45), camF);
  const back = proj(mul(D0, -0.55), camF);

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Glow x={960} y={CY} r={mix(40, 260, blob)} color="mint" opacity={0.8 * blob} />
        {ROW.map((x, k) => (
          <SvgChem
            key={k}
            x={x}
            y={CY + 170}
            parts={k === 0 ? [['s']] : [['p'], [['x', 'y', 'z'][k - 1], 'sub']]}
            size={40}
            color={k === 0 ? C.blue : C.gold}
            font="serif"
            opacity={orbIn[k] * (1 - merge)}
          />
        ))}
        <Render3D items={items} />
        {/* identik */}
        <Label x={960} y={CY + 200} size={36} color={C.mint} weight={700} opacity={iden * (1 - focus) * (1 - tet)}>
          empat hibrida identik
        </Label>
        {/* lobus besar / kecil */}
        <g opacity={focus}>
          <g opacity={big}>
            <line x1={tip.X + 30} y1={tip.Y - 10} x2={tip.X + 140} y2={tip.Y - 60} stroke={C.mint} strokeWidth={3} />
            <Label x={tip.X + 150} y={tip.Y - 70} size={40} color={C.mint} weight={700} anchor="start">
              lobus besar
            </Label>
          </g>
          <g opacity={small}>
            <line x1={back.X - 20} y1={back.Y + 10} x2={back.X - 120} y2={back.Y + 70} stroke={C.muted} strokeWidth={3} />
            <Label x={back.X - 130} y={back.Y + 85} size={32} color={C.muted} anchor="end">
              lobus kecil
            </Label>
          </g>
          <Label x={960} y={850} size={34} color={C.cyan} weight={600} opacity={strong}>
            menonjol ke satu arah → tumpang tindih kuat
          </Label>
        </g>
        {/* tetrahedron */}
        <Label x={1440} y={420} size={34} color={C.gold} weight={600} opacity={frame * frameOut} anchor="start">
          tetrahedron
        </Label>
        <Label x={1440} y={465} size={28} color={C.muted} opacity={frame * frameOut} anchor="start">
          saling menjauh sejauh mungkin
        </Label>
        <Label x={960} y={850} size={36} color={C.cyan} weight={700} opacity={done}>
          metana terjelaskan ✓
        </Label>
      </Stage>

      <Card x={960} y={260} opacity={badge} scale={0.92 + 0.08 * badge} accent={C.gold} style={{padding: '18px 40px', textAlign: 'center'}}>
        <div style={{fontSize: 46, fontWeight: 700, letterSpacing: 0.5}}>Linus Pauling</div>
        <div style={{fontSize: 26, color: C.muted, marginTop: 4, fontFamily: FONT.mono}}>1931 · J. Am. Chem. Soc. 53, 1367</div>
      </Card>
      <Formula x={960} y={260} p={card1} accent={C.mint}>
        <span style={{color: C.blue}}>s</span> + 3<span style={{color: C.gold}}>p</span> → 4{' '}
        <span style={{color: C.mint}}>
          sp<Sup>3</Sup>
        </span>
      </Formula>
      <Formula x={960} y={250} p={card4} accent={C.cyan}>
        CH<Sub>4</Sub> : 4 ikatan <span style={{color: C.cyan}}>σ</span>
      </Formula>
    </AbsoluteFill>
  );
};
