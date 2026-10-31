import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Label, Stage, Sub} from '../components/primitives';
import {Render3D, VbDefs, angleArc, ball, cloud, hybrid, molItems, pOrb, proj, rotX, type Cam, type Item, type MAtom, type MBond, type V3} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 11: asetilena — dua hibrida sp 180°, dua ikatan π saling tegak lurus; panjang & energi ikatan.
const CC = 0.6; // setengah jarak C≡C (120 pm)
const CH = 1.06;
const ROWS = [
  {name: 'tunggal', f: 'C–C', pm: 154, kj: 348, order: 1},
  {name: 'rangkap dua', f: 'C=C', pm: 134, kj: 614, order: 2},
  {name: 'rangkap tiga', f: 'C≡C', pm: 120, kj: 839, order: 3},
];

export const Sp: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  // baris 0: satu karbon, dua hibrida sp berlawanan arah
  const card0 = slot(t, 0.3, wordOf(0, 'hibrida') - 0.1);
  const cin = ramp(t, wordOf(0, 'karbon') - 0.3, wordOf(0, 'karbon') + 0.4);
  const hyb = ramp(t, wordOf(0, 'hibrida') - 0.3, wordOf(0, 'sp') + 0.4, EASE_IN_OUT);
  const arc = ramp(t, wordOf(0, 'seratus') - 0.2, wordOf(0, 'derajat') + 0.2, EASE_IN_OUT);
  const pIn = ramp(t, wordOf(0, 'mencampur') - 0.2, wordOf(0, 'mencampur') + 0.5);
  // baris 1: dua karbon, dua π
  const two = ramp(t, cue(1) - 0.2, cue(1) + 1.0, EASE_IN_OUT);
  const pi = ramp(t, wordOf(1, 'ikatan') - 0.2, wordOf(1, 'membungkus') + 0.3, EASE_IN_OUT);
  // baris 2: kerangka bola-batang + σ + 2π
  const skel = ramp(t, cue(2) - 0.2, cue(2) + 0.7, EASE_IN_OUT);
  const card2 = slot(t, cue(2) + 0.1, cue(3) + 0.1);
  // baris 3–4: diagram
  const molOut = 1 - ramp(t, cue(3) - 0.3, cue(3) + 0.4, EASE_IN_OUT);
  const chart = ramp(t, cue(3) + 0.1, cue(3) + 0.8);
  const rowIn = [wordOf(3, 'tunggal'), wordOf(3, 'dua'), wordOf(3, 'rangkap', 1)].map((w) => ramp(t, w - 0.3, w + 0.5, BACK));
  const enIn = [wordOf(4, 'tiga'), wordOf(4, 'enam'), wordOf(4, 'delapan')].map((w) => ramp(t, w - 0.3, w + 0.8, EASE_IN_OUT));
  const enTitle = ramp(t, cue(4) - 0.2, cue(4) + 0.5);

  const roll = t * 0.45;
  const R = (v: V3) => rotX(v, roll);
  const cam: Cam = {cx: 960, cy: 590, s: mix(190, 150, two), yaw: 0.28 + 0.12 * Math.sin(t * 0.4), pitch: -0.35};
  const c1: V3 = [-CC * two, 0, 0];
  const c2: V3 = [mix(5, CC, two), 0, 0];

  const items: Item[] = [];
  if (molOut > 0.01) {
    // hibrida sp
    const hOp = hyb * (1 - skel) * molOut;
    if (hOp > 0.01) {
      items.push(...hybrid(cam, {origin: c1, dir: [1, 0, 0], len: 1.2, wid: 0.46, opacity: 0.88 * hOp}));
      items.push(...hybrid(cam, {origin: c1, dir: [-1, 0, 0], len: 1.2, wid: 0.46, opacity: 0.88 * hOp}));
      if (two > 0.01) {
        items.push(...hybrid(cam, {origin: c2, dir: [-1, 0, 0], len: 1.2, wid: 0.46, opacity: 0.88 * hOp * two}));
        items.push(...hybrid(cam, {origin: c2, dir: [1, 0, 0], len: 1.2, wid: 0.46, opacity: 0.88 * hOp * two}));
      }
    }
    // dua p tersisa per karbon (berputar mengelilingi sumbu)
    const pOp = pIn * (1 - pi) * molOut;
    if (pOp > 0.01) {
      for (const [c, w] of [
        [c1, 1],
        [c2, two],
      ] as [V3, number][]) {
        if (w < 0.01) continue;
        items.push(...pOrb(cam, {origin: c, dir: R([0, 0, 1]), len: 0.95, wid: 0.36, opacity: 0.85 * pOp * w}));
        items.push(...pOrb(cam, {origin: c, dir: R([0, 1, 0]), len: 0.95, wid: 0.36, opacity: 0.85 * pOp * w}));
      }
    }
    // dua awan π saling tegak lurus
    const piOp = pi * molOut;
    if (piOp > 0.01) {
      for (const d of [
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, 0],
        [0, -1, 0],
      ] as V3[]) {
        const it = cloud(cam, {center: R([0, d[1] * 0.46, d[2] * 0.46]), axis: [1, 0, 0], a: 1.15, b: 0.33, color: d[2] !== 0 ? 'amber' : 'gold', opacity: 0.78 * piOp, glow: 0.4 + 0.3 * pulse});
        if (it) items.push(it);
      }
    }
    // kerangka
    if (skel > 0.01) {
      const atoms: MAtom[] = [
        {pos: c1, el: 'C'},
        {pos: c2, el: 'C'},
        {pos: [-CC - CH, 0, 0], el: 'H'},
        {pos: [CC + CH, 0, 0], el: 'H'},
      ];
      const bonds: MBond[] = [{a: 0, b: 1, color: C.cyan, width: 0.15}, {a: 0, b: 2}, {a: 1, b: 3}];
      items.push(...molItems(cam, atoms, bonds, skel * molOut));
    }
    if (skel < 0.99) {
      const b1 = ball(cam, {pos: c1, el: 'C', r: 0.3, opacity: cin * molOut * (1 - skel)});
      if (b1) items.push(b1);
      const b2 = ball(cam, {pos: c2, el: 'C', r: 0.3, opacity: two * molOut * (1 - skel)});
      if (b2) items.push(b2);
    }
    // busur 180° (dua setengah busur lewat atas)
    const aOp = arc * (1 - two) * molOut;
    const a1 = angleArc(cam, {center: [0, 0, 0], u: [1, 0, 0], v: [0, 0, 1], r: 0.7, p: Math.min(1, arc * 2), opacity: aOp, color: C.gold});
    const a2 = angleArc(cam, {center: [0, 0, 0], u: [0, 0, 1], v: [-1, 0, 0], r: 0.7, p: Math.max(0.001, arc * 2 - 1), opacity: aOp * ramp(arc, 0.5, 0.55), color: C.gold});
    if (a1) items.push(a1);
    if (a2) items.push(a2);
  }
  const top = proj([0, 0, 1.05], cam);

  // diagram
  const LX = 330;
  const PX = 3.0; // px per pm
  const BASE = 800;
  const KJ = 0.52; // px per kJ/mol
  const bx = [1250, 1450, 1650];

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Render3D items={items} />
        <Label x={top.X} y={top.Y - 60} size={56} color={C.gold} weight={700} opacity={arc * (1 - two) * molOut}>
          180°
        </Label>
        <Label x={960} y={860} size={34} color={C.amber} weight={700} opacity={pi * molOut * (1 - skel)}>
          dua π saling tegak lurus, membungkus sumbu
        </Label>

        {/* panjang ikatan */}
        <g opacity={chart}>
          <Label x={LX + 230} y={290} size={34} color={C.cyan} weight={700}>
            panjang ikatan (pm)
          </Label>
          {ROWS.map((r, k) => {
            const y = 410 + k * 160;
            const p = rowIn[k];
            const x2 = LX + 100 + r.pm * PX * mix(1.15, 1, p);
            const gap = 14;
            const offs = r.order === 1 ? [0] : r.order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap];
            return (
              <g key={k} opacity={p}>
                <Label x={LX - 40} y={y - 22} size={36} color={C.ink} weight={700} anchor="end" font="serif">
                  {r.f}
                </Label>
                <Label x={LX - 40} y={y + 20} size={24} color={C.muted} anchor="end">
                  {r.name}
                </Label>
                {offs.map((o, i) => (
                  <line key={i} x1={LX + 40} y1={y + o} x2={x2 - 40} y2={y + o} stroke={r.order === 1 ? C.cyan : i === 0 && r.order === 2 ? C.cyan : i === 1 && r.order === 3 ? C.cyan : C.amber} strokeWidth={7} strokeLinecap="round" />
                ))}
                <circle cx={LX + 40} cy={y} r={32} fill="url(#atom-C)" />
                <circle cx={x2 - 40} cy={y} r={32} fill="url(#atom-C)" />
                <Label x={(LX + x2) / 2} y={y - 52} size={34} color={C.cyan} weight={700} font="mono">
                  {String(r.pm)}
                </Label>
              </g>
            );
          })}
          <Label x={LX + 230} y={860} size={30} color={C.muted} opacity={rowIn[2]}>
            makin pendek →
          </Label>
        </g>

        {/* energi ikatan */}
        <g opacity={chart * enTitle}>
          <Label x={1450} y={290} size={34} color={C.red} weight={700}>
            energi ikatan (kJ/mol) — makin kuat
          </Label>
          <line x1={1150} y1={BASE} x2={1750} y2={BASE} stroke={C.faint} strokeWidth={3} />
          {ROWS.map((r, k) => {
            const h = r.kj * KJ * enIn[k];
            return (
              <g key={k} opacity={ramp(enIn[k], 0, 0.15)}>
                <rect x={bx[k] - 60} y={BASE - h} width={120} height={h} rx={10} fill={C.red} opacity={0.35 + 0.15 * k} />
                <rect x={bx[k] - 60} y={BASE - h} width={120} height={6} rx={3} fill={C.red} />
                <Label x={bx[k]} y={BASE - h - 34} size={34} color={C.ink} weight={700} font="mono">
                  ≈ {Math.round(r.kj * enIn[k])}
                </Label>
                <Label x={bx[k]} y={BASE + 36} size={32} color={C.muted} font="serif">
                  {r.f}
                </Label>
              </g>
            );
          })}
        </g>
      </Stage>

      <Formula x={960} y={260} p={card0} accent={C.gold} caption="asetilena">
        C<Sub>2</Sub>H<Sub>2</Sub>
      </Formula>
      <Formula x={960} y={250} p={card2} accent={C.amber} caption="ikatan rangkap tiga">
        C≡C : <span style={{color: C.cyan}}>σ</span> + 2<span style={{color: C.amber}}>π</span>
      </Formula>
    </AbsoluteFill>
  );
};
