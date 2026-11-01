import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Card, Glow, Label, Stage} from '../components/primitives';
import {
  Render3D,
  SvgChem,
  TETRA,
  VbDefs,
  add,
  angleArc,
  bent,
  dot3,
  lobe,
  molItems,
  mul,
  norm,
  proj,
  pyramid,
  type Cam,
  type Item,
  type MAtom,
  type MBond,
  type V3,
} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 12: pasangan elektron bebas pada NH₃ dan H₂O; sudut 109,5° → ≈107° → 104,5°; air polar.
const XS = [440, 960, 1480];
const CY = 560;
const fmt = (v: number) => v.toFixed(1).replace('.', ',');

export const LonePair: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  const molIn = [0, 1, 2].map((k) => ramp(t, 0.3 + k * 0.35, 1.0 + k * 0.35, BACK));
  const notAll = ramp(t, wordOf(0, 'tidak') - 0.2, wordOf(0, 'berikatan') + 0.2);
  const lpN = ramp(t, wordOf(1, 'amonia') - 0.2, wordOf(1, 'amonia') + 0.5);
  const lpO = ramp(t, wordOf(1, 'air') - 0.2, wordOf(1, 'dua') + 0.4);
  const fat = ramp(t, wordOf(2, 'gemuk') - 0.3, wordOf(2, 'inti') + 0.2, EASE_IN_OUT);
  const squeeze = ramp(t, wordOf(2, 'mendorong') - 0.2, wordOf(2, 'merapat') + 0.6, EASE_IN_OUT);
  const arcsIn = ramp(t, wordOf(2, 'mendorong') - 0.5, wordOf(2, 'mendorong') + 0.2);
  const finals = [wordOf(3, 'sembilan'), wordOf(3, 'tujuh'), wordOf(3, 'empat')].map((w) => ramp(t, w - 0.3, w + 0.4));
  const fin = ramp(t, cue(3) - 0.2, cue(3) + 0.3);
  // baris 4: air ke tengah, dipol
  const solo = ramp(t, cue(4) - 0.3, cue(4) + 0.9, EASE_IN_OUT);
  const dip = ramp(t, wordOf(4, 'membengkok') - 0.2, wordOf(4, 'air', 0) + 0.3);
  const polar = ramp(t, wordOf(4, 'polar') - 0.3, wordOf(4, 'polar') + 0.4, BACK);

  const angN = mix(109.47, 106.7, squeeze);
  const angO = mix(109.47, 104.5, squeeze);
  const lpWid = mix(0.48, 0.66, fat);
  const lpLen = mix(1.15, 1.0, fat);

  const cams: Cam[] = XS.map((x, k) => {
    const isO = k === 2;
    return {
      cx: isO ? mix(x, 960, solo) : x,
      cy: isO ? mix(CY, 540, solo) : CY,
      s: isO ? mix(130, 185, solo) : 130,
      yaw: k === 0 ? 0.3 + t * 0.3 : k === 1 ? 0.9 + t * 0.25 : 0.55 * Math.sin(t * 0.35),
      pitch: -0.3,
    };
  });

  const lonePair = (cam: Cam, origin: V3, dir: V3, op: number, glow: number, seed: number): Item[] => {
    const d = norm(dir);
    const perp = norm(Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [d[1], -d[0], 0]);
    const out: Item[] = [];
    const L = lobe(cam, {origin, dir: d, len: lpLen, wid: lpWid, color: 'cyan', opacity: (0.42 - 0.12 * solo) * op, profile: 'hybrid', glow});
    if (L) out.push(L);
    for (const sgn of [-1, 1]) {
      const j = 0.06 * Math.sin(t * 2.3 + seed + sgn);
      const e = dot3(cam, {pos: add(add(origin, mul(d, lpLen * 0.62 + j)), mul(perp, sgn * 0.17)), r: 6, opacity: op});
      if (e) out.push(e);
    }
    return out;
  };

  // CH₄
  const ch4: MAtom[] = [{pos: [0, 0, 0], el: 'C'}, ...TETRA.map((v) => ({pos: mul(v, 1.09), el: 'H'}))];
  const b4: MBond[] = [1, 2, 3, 4].map((i) => ({a: 0, b: i}));
  // NH₃: pasangan bebas ke atas, tiga H piramida
  const nh = pyramid(angN);
  const nh3: MAtom[] = [{pos: [0, 0, 0], el: 'N'}, ...nh.map((v) => ({pos: mul(v, 1.01), el: 'H'}))];
  const b3: MBond[] = [1, 2, 3].map((i) => ({a: 0, b: i}));
  // H₂O: dua H di bidang xz, dua pasangan bebas di bidang yz
  const oh = bent(angO);
  const h2o: MAtom[] = [{pos: [0, 0, 0], el: 'O'}, ...oh.map((v) => ({pos: mul(v, 0.96), el: 'H'}))];
  const b2: MBond[] = [1, 2].map((i) => ({a: 0, b: i}));
  const lpH = (mix(109.47, 118, squeeze) / 2) * (Math.PI / 180);
  const lpO2: V3[] = [
    [0, Math.sin(lpH), Math.cos(lpH)],
    [0, -Math.sin(lpH), Math.cos(lpH)],
  ];

  const others = 1 - solo;
  const glowLP = (k: number) => Math.max(notAll * pulse * (1 - lpN), k === 1 ? lpN * (1 - squeeze * 0.5) * pulse : lpO * (1 - squeeze * 0.5) * pulse, fat * (1 - fin) * 0.6);

  const angTxt = [
    {live: fmt(109.47), fin: '109,5°'},
    {live: fmt(angN), fin: '≈ 107°'},
    {live: fmt(angO), fin: '104,5°'},
  ];

  // label arc positions
  const arcLab = (k: number) => {
    const cam = cams[k];
    return {X: cam.cx, Y: cam.cy + cam.s * 1.6 + 10};
  };

  // dipol air (δ− → δ+, IUPAC), di samping molekul
  const camW = cams[2];
  const pO = proj([0, 0, 0], camW);
  const pH1 = proj(mul(oh[0], 0.96), camW);
  const pH2 = proj(mul(oh[1], 0.96), camW);
  const ax = camW.cx + 330;
  const yTop = pO.Y - 40;
  const yBot = (pH1.Y + pH2.Y) / 2 + 40;

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        {/* CH₄ */}
        <g opacity={others}>
          <Render3D opacity={molIn[0]} items={[...molItems(cams[0], ch4, b4)]} />
        </g>
        {/* NH₃ */}
        <g opacity={others}>
          <Render3D opacity={molIn[1]} items={[...molItems(cams[1], nh3, b3), ...lonePair(cams[1], [0, 0, 0], [0, 0, 1], 1, glowLP(1), 1)]} />
        </g>
        {/* H₂O */}
        <Render3D opacity={molIn[2]} items={[...molItems(cams[2], h2o, b2), ...lpO2.flatMap((d, i) => lonePair(cams[2], [0, 0, 0], d, 1, glowLP(2), 3 + i * 2))]} />

        {/* busur sudut H–X–H */}
        {[0, 1, 2].map((k) => {
          const cam = cams[k];
          const [u, v] = k === 0 ? [TETRA[1], TETRA[2]] : k === 1 ? [nh[0], nh[1]] : [oh[0], oh[1]];
          const op = arcsIn * (k === 2 ? 1 - solo * 0.6 : others);
          const it = angleArc(cam, {center: [0, 0, 0], u, v, r: 0.5, color: C.gold, opacity: op, width: 4});
          const L = arcLab(k);
          const hi = finals[k];
          return (
            <g key={k}>
              <Render3D items={[it]} />
              <g opacity={op}>
                {hi > 0.01 ? <Glow x={L.X} y={L.Y} r={110} color="gold" opacity={0.35 * hi * (1 - ramp(t, cue(4) - 0.3, cue(4)))} /> : null}
                <Label x={L.X} y={L.Y} size={56} color={C.gold} weight={700} opacity={1 - fin}>
                  {angTxt[k].live}°
                </Label>
                <Label x={L.X} y={L.Y} size={56} color={C.gold} weight={700} opacity={fin * (0.55 + 0.45 * Math.max(hi, k === 2 ? solo : 0))}>
                  {angTxt[k].fin}
                </Label>
              </g>
            </g>
          );
        })}

        {/* nama molekul */}
        {(
          [
            [['CH'], ['4', 'sub']],
            [['NH'], ['3', 'sub']],
            [['H'], ['2', 'sub'], ['O']],
          ] as [string, ('sub' | 'sup')?][][]
        ).map((parts, k) => (
          <SvgChem key={k} x={XS[k]} y={300} parts={parts} size={52} weight={700} color={C.ink} opacity={molIn[k] * (k === 2 ? others : others)} />
        ))}
        <Label x={XS[1]} y={360} size={30} color={C.cyan} weight={700} opacity={lpN * others}>
          1 pasangan bebas
        </Label>
        <Label x={XS[2]} y={360} size={30} color={C.cyan} weight={700} opacity={lpO * others}>
          2 pasangan bebas
        </Label>
        <Label x={960} y={850} size={34} color={C.cyan} weight={600} opacity={fat * (1 - fin)}>
          pasangan bebas lebih gemuk → ikatan merapat
        </Label>

        {/* dipol air */}
        <g opacity={dip * solo}>
          <Label x={pO.X + 90} y={pO.Y - 70} size={44} color={C.red} weight={700} font="serif" italic>
            δ−
          </Label>
          <Label x={pH1.X - 60} y={pH1.Y + 50} size={40} color={C.blue} weight={700} font="serif" italic>
            δ+
          </Label>
          <Label x={pH2.X + 60} y={pH2.Y + 50} size={40} color={C.blue} weight={700} font="serif" italic>
            δ+
          </Label>
          <line x1={ax} y1={yTop} x2={ax} y2={yTop + (yBot - yTop) * dip} stroke={C.gold} strokeWidth={8} strokeLinecap="round" markerEnd="url(#arrow-gold)" />
          <line x1={ax - 18} y1={yTop} x2={ax + 18} y2={yTop} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
          <Label x={ax + 40} y={(yTop + yBot) / 2} size={48} color={C.gold} font="serif" italic anchor="start">
            μ
          </Label>
          <Label x={ax + 40} y={(yTop + yBot) / 2 + 52} size={24} color={C.muted} anchor="start">
            δ− → δ+ (IUPAC)
          </Label>
        </g>
      </Stage>

      <Card x={480} y={420} opacity={polar} scale={0.9 + 0.1 * polar} accent={C.red} style={{padding: '20px 44px', textAlign: 'center'}}>
        <div style={{fontSize: 64, fontWeight: 800, color: C.red, letterSpacing: 1}}>polar</div>
        <div style={{fontSize: 26, color: C.muted, marginTop: 6, fontFamily: FONT.sans}}>bengkok → dipol tidak saling hapus</div>
      </Card>
    </AbsoluteFill>
  );
};
