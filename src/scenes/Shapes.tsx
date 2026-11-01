import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, slot} from '../anim';
import {Card, Glow, Label, Stage} from '../components/primitives';
import {Render3D, SvgChem, VbDefs, bent, lobe, methane, molItems, mul, pyramid, type Cam, type Item, type MAtom, type MBond, type V3} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 13: galeri bentuk — BF₃ (sp², datar), CO₂ (sp, lurus), CH₄/NH₃/H₂O (sp³: tetrahedral, piramida, bengkok).
const XS = [250, 605, 960, 1315, 1670];
const CY = 400;
type P = [string, ('sub' | 'sup')?][];
const NAMES: P[] = [
  [['BF'], ['3', 'sub']],
  [['CO'], ['2', 'sub']],
  [['CH'], ['4', 'sub']],
  [['NH'], ['3', 'sub']],
  [['H'], ['2', 'sub'], ['O']],
];
const HYB: P[] = [[['sp'], ['2', 'sup']], [['sp']], [['sp'], ['3', 'sup']], [['sp'], ['3', 'sup']], [['sp'], ['3', 'sup']]];
const SHAPE = ['segitiga datar', 'lurus', 'tetrahedral', 'piramida', 'bengkok'];

export const Shapes: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  const molAt = [wordOf(1, 'Boron', 0), wordOf(2, 'Karbon', 0), wordOf(3, 'Metana'), wordOf(3, 'amonia'), wordOf(3, 'air')];
  const hybAt = [wordOf(1, 'sp'), wordOf(2, 'sp'), wordOf(3, 'sp'), wordOf(3, 'sp'), wordOf(3, 'sp')];
  const shpAt = [wordOf(1, 'segitiga'), wordOf(2, 'lurus'), wordOf(3, 'tetrahedral'), wordOf(3, 'piramida'), wordOf(3, 'bengkok')];
  const molIn = molAt.map((w) => ramp(t, w - 0.3, w + 0.5, BACK));
  const hybIn = hybAt.map((w) => ramp(t, w - 0.2, w + 0.4));
  const shpIn = shpAt.map((w) => ramp(t, w - 0.2, w + 0.4));
  // sorotan molekul yang sedang dibahas
  const focusEnd = [cue(2), cue(3), shpAt[3] - 0.2, shpAt[4] - 0.2, cue(4)];
  const hi = molAt.map((w, k) => ramp(t, w - 0.2, w + 0.4) * (1 - ramp(t, focusEnd[k] - 0.2, focusEnd[k] + 0.3)));
  const slots = [0, 1, 2, 3, 4].map((k) => ramp(t, 0.3 + k * 0.15, 0.9 + k * 0.15) * (1 - molIn[k]));
  const dimAll = ramp(t, cue(4) - 0.2, cue(4) + 0.6);

  const card0 = slot(t, 0.4, cue(1) + 0.4);
  const card4 = slot(t, cue(4) + 0.1, 999);
  const exp = ramp(t, wordOf(4, 'eksperimen') - 0.3, wordOf(4, 'eksperimen') + 0.4);

  const cam = (k: number): Cam => ({
    cx: XS[k],
    cy: CY,
    s: 92,
    yaw: k === 4 ? 0.5 * Math.sin(t * 0.4) : k === 1 ? 0.25 + 0.45 * Math.sin(t * 0.45) : 0.4 + t * (0.22 + 0.03 * k) + k,
    pitch: k === 0 ? -0.6 : -0.3,
  });

  const lp = (c: Cam, dir: V3, k: number): Item[] => {
    const L = lobe(c, {origin: [0, 0, 0], dir, len: 1.0, wid: 0.6, color: 'cyan', opacity: 0.4, glow: 0.3 + 0.3 * Math.sin(t * 2 + k)});
    return L ? [L] : [];
  };

  // BF₃
  const bf: MAtom[] = [{pos: [0, 0, 0], el: 'B', r: 0.36}, ...[0, 1, 2].map((k) => ({pos: [1.31 * Math.cos((2 * Math.PI * k) / 3), 1.31 * Math.sin((2 * Math.PI * k) / 3), 0] as V3, el: 'F', r: 0.36}))];
  const bfB: MBond[] = [1, 2, 3].map((i) => ({a: 0, b: i}));
  // CO₂
  const co: MAtom[] = [
    {pos: [0, 0, 0], el: 'C', r: 0.36},
    {pos: [-1.16, 0, 0], el: 'O', r: 0.38},
    {pos: [1.16, 0, 0], el: 'O', r: 0.38},
  ];
  const coB: MBond[] = [
    {a: 0, b: 1, order: 2},
    {a: 0, b: 2, order: 2},
  ];
  // NH₃
  const nh = pyramid(107);
  const nhA: MAtom[] = [{pos: [0, 0, 0], el: 'N'}, ...nh.map((v) => ({pos: mul(v, 1.01), el: 'H'}))];
  const nhB: MBond[] = [1, 2, 3].map((i) => ({a: 0, b: i}));
  // H₂O
  const oh = bent(104.5);
  const ohA: MAtom[] = [{pos: [0, 0, 0], el: 'O'}, ...oh.map((v) => ({pos: mul(v, 0.96), el: 'H'}))];
  const ohB: MBond[] = [1, 2].map((i) => ({a: 0, b: i}));
  const lpa = (118 / 2) * (Math.PI / 180);

  const mols: Item[][] = [
    molItems(cam(0), bf, bfB),
    molItems(cam(1), co, coB),
    methane(cam(2), {}),
    [...molItems(cam(3), nhA, nhB), ...lp(cam(3), [0, 0, 1], 0)],
    [...molItems(cam(4), ohA, ohB), ...lp(cam(4), [0, Math.sin(lpa), Math.cos(lpa)], 1), ...lp(cam(4), [0, -Math.sin(lpa), Math.cos(lpa)], 2)],
  ];

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        {XS.map((x, k) => (
          <g key={k} opacity={1 - 0.35 * dimAll}>
            {/* tempat kosong sebelum molekul muncul */}
            <circle cx={x} cy={CY} r={110} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 10" opacity={slots[k]} />
            <Label x={x} y={CY} size={56} color={C.faint} weight={700} opacity={slots[k]}>
              ?
            </Label>
            {hi[k] > 0.01 ? <Glow x={x} y={CY} r={200} color="gold" opacity={0.3 * hi[k] * (0.7 + 0.3 * pulse)} /> : null}
            <Render3D opacity={molIn[k]} items={mols[k]} />
            <SvgChem x={x} y={570} parts={NAMES[k]} size={48} weight={700} color={C.ink} opacity={molIn[k]} />
            <SvgChem x={x} y={620} parts={HYB[k]} size={38} weight={700} color={C.mint} opacity={hybIn[k]} />
            <Label x={x} y={665} size={30} color={C.gold} weight={600} opacity={shpIn[k]}>
              {SHAPE[k]}
            </Label>
          </g>
        ))}
      </Stage>

      <Card x={960} y={815} opacity={card0} scale={0.92 + 0.08 * card0} accent={C.mint} style={{padding: '16px 40px'}}>
        <div style={{fontSize: 44, fontWeight: 700}}>
          pasangan elektron → <span style={{color: C.mint}}>hibrida</span> → <span style={{color: C.gold}}>bentuk</span>
        </div>
      </Card>
      <Card x={960} y={818} opacity={card4} scale={0.92 + 0.08 * card4} accent={C.gold} style={{padding: '16px 44px', textAlign: 'center'}}>
        <div style={{fontSize: 56, fontWeight: 700, lineHeight: 1.1}}>
          hibridisasi = <span style={{color: C.mint}}>deskripsi</span>, bukan penyebab
        </div>
        <div style={{fontSize: 30, color: C.muted, marginTop: 8, fontFamily: FONT.sans, opacity: 0.4 + 0.6 * exp}}>
          bentuk molekul tetap <span style={{color: C.gold}}>diukur dari eksperimen</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
