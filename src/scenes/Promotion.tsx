import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Glow, Label, Stage, Sup} from '../components/primitives';
import {OrbBox, SpinUD, SpinVec} from '../components/grupA';
import {Render3D, SvgChem, VbDefs, ball, bond, methane, pOrb, sphere, type Cam, type V3} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 08: karbon 2s²2p² hanya punya dua elektron tak berpasangan → promosi → neraca energi → masalah bentuk.
const S_BOX = {x: 330, y: 680};
const P_BOX = [500, 640, 780].map((x) => ({x, y: 470}));

export const Promotion: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  // diagram kotak orbital (baris 0–3)
  const diag = ramp(t, 0.2, 1.0) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.4, EASE_IN_OUT));
  const unp = ramp(t, wordOf(0, 'tak') - 0.2, wordOf(0, 'berpasangan') + 0.3);
  const promo = ramp(t, wordOf(2, 'naik') - 0.25, wordOf(2, 'kosong') + 0.1, EASE_IN_OUT);
  const four = ramp(t, wordOf(2, 'empat') - 0.1, wordOf(2, 'empat') + 0.5);
  const cardB = wordOf(2, 'kosong') + 0.2;
  const card1 = slot(t, 0.4, cardB);
  const card2 = slot(t, cardB, cue(4) - 0.1);

  // panel kanan baris 1: CH₂? vs CH₄
  const r1 = slot(t, cue(1) + 0.2, cue(2) + 0.6, 0.6, 0.5);
  const ch2 = ramp(t, wordOf(1, 'dua') - 0.3, wordOf(1, 'ikatan') + 0.2, BACK);
  const ch4 = ramp(t, wordOf(1, 'metana') - 0.2, wordOf(1, 'metana') + 0.6);
  const fourB = ramp(t, wordOf(1, 'empat', 1) - 0.2, wordOf(1, 'empat', 1) + 0.5);

  // panel kanan baris 3: neraca energi
  const r3 = slot(t, cue(3) - 0.1, cue(4), 0.6, 0.4);
  const cost = ramp(t, wordOf(3, 'butuh') - 0.2, wordOf(3, 'energi') + 0.4, EASE_IN_OUT);
  const gain = ramp(t, wordOf(3, 'melepaskan') - 0.2, wordOf(3, 'besar') + 0.2, EASE_IN_OUT);
  const win = ramp(t, wordOf(3, 'untung') - 0.3, wordOf(3, 'untung') + 0.4, BACK);

  // baris 4: s & p berbeda bentuk vs 4 ikatan identik
  const r4 = ramp(t, cue(4) + 0.1, cue(4) + 0.8);
  const shapeIn = [0, 1, 2, 3].map((k) => ramp(t, cue(4) + 0.3 + k * 0.35, cue(4) + 0.9 + k * 0.35, BACK));
  const iden = ramp(t, wordOf(4, 'metana') - 0.3, wordOf(4, 'identik') + 0.2);
  const idPulse = ramp(t, wordOf(4, 'identik') - 0.1, wordOf(4, 'identik') + 0.4);

  const yaw = 0.5 + t * 0.32;
  const camCH4: Cam = {cx: 1560, cy: 470, s: 150, yaw, pitch: 0.32};
  const camCH2: Cam = {cx: 1180, cy: 470, s: 130, yaw: -0.4 + 0.25 * Math.sin(t * 0.7), pitch: 0.25};
  const ch2Atoms: V3[] = [
    [0, 0, 0],
    [-0.75, 0, -0.72],
    [0.75, 0, -0.72],
  ];

  // elektron 2s kedua → kotak 2p kosong
  const ex = mix(S_BOX.x + 22, P_BOX[2].x, promo);
  const ey = mix(S_BOX.y, P_BOX[2].y, promo) - Math.sin(Math.PI * promo) * 60;

  // orbital baris 4
  const ox = [300, 540, 780, 1020];
  const camO = (k: number): Cam => ({cx: ox[k], cy: 470, s: 120, yaw: 0.6 + t * 0.3, pitch: 0.35});
  const camM: Cam = {cx: 1520, cy: 480, s: 165, yaw: 0.3 + t * 0.3, pitch: 0.3};
  const pDirs: V3[] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        {/* --- diagram kotak orbital --- */}
        <g opacity={diag}>
          <line x1={180} y1={780} x2={180} y2={360} stroke={C.faint} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <Label x={180} y={330} size={28} color={C.muted} font="serif" italic>
            E
          </Label>
          {[...P_BOX.map((b, k) => ({...b, k})), {...S_BOX, k: 3}].map((b) => {
            const isP = b.k < 3;
            const lit = isP ? (b.k < 2 ? Math.max(unp, four) : four) : 0;
            return (
              <g key={b.k}>
                {lit > 0.01 ? <Glow x={b.x} y={b.y} r={95} color="cyan" opacity={0.45 * lit * (0.6 + 0.4 * pulse)} /> : null}
                <OrbBox x={b.x} y={b.y} w={110} h={100} color={isP ? C.gold : C.blue} />
              </g>
            );
          })}
          <SvgChem x={P_BOX[1].x} y={P_BOX[1].y + 88} parts={[['2p']]} size={34} color={C.gold} font="serif" />
          <SvgChem x={S_BOX.x} y={S_BOX.y + 88} parts={[['2s']]} size={34} color={C.blue} font="serif" />
          {/* elektron */}
          <SpinUD x={S_BOX.x - 22} y={S_BOX.y} up len={64} />
          <SpinUD x={P_BOX[0].x} y={P_BOX[0].y} up len={64} />
          <SpinUD x={P_BOX[1].x} y={P_BOX[1].y} up len={64} />
          {/* elektron yang naik: turun (merah muda) → naik (sian) sambil berpindah */}
          <SpinVec x1={ex} y1={ey - 32} x2={ex} y2={ey + 32} color={C.pink} width={6} opacity={1 - promo} />
          <SpinVec x1={ex} y1={ey + 32} x2={ex} y2={ey - 32} color={C.cyan} width={6} opacity={promo} />
          {/* panah biaya promosi */}
          <g opacity={ramp(t, wordOf(2, 'naik') - 0.2, wordOf(2, 'naik') + 0.5) * (1 - ramp(t, cue(3) + 0.5, cue(3) + 1))}>
            <line x1={880} y1={680} x2={880} y2={485} stroke={C.red} strokeWidth={5} markerEnd="url(#arrow-red)" />
            <Label x={895} y={600} size={30} color={C.red} anchor="start" weight={700}>
              biaya
            </Label>
            <Label x={895} y={640} size={26} color={C.red} anchor="start" opacity={0.85}>
              energi
            </Label>
          </g>
          <Label x={560} y={820} size={32} color={C.cyan} weight={700} opacity={Math.max(unp * (1 - four), 0) * (1 - promo)}>
            2 elektron tak berpasangan
          </Label>
          <Label x={560} y={820} size={32} color={C.mint} weight={700} opacity={four}>
            4 elektron tak berpasangan
          </Label>
        </g>

        {/* --- baris 1: CH₂ ? vs CH₄ --- */}
        <g opacity={r1}>
          <Render3D
            opacity={ch2 * (1 - 0.55 * fourB)}
            items={[
              ball(camCH2, {pos: ch2Atoms[0], el: 'C'}),
              ball(camCH2, {pos: ch2Atoms[1], el: 'H'}),
              ball(camCH2, {pos: ch2Atoms[2], el: 'H'}),
              bond(camCH2, {a: ch2Atoms[0], b: ch2Atoms[1]}),
              bond(camCH2, {a: ch2Atoms[0], b: ch2Atoms[2]}),
            ]}
          />
          <SvgChem x={1180} y={680} parts={[['CH'], ['2', 'sub'], [' ?']]} size={56} color={C.muted} opacity={ch2} weight={700} />
          <Label x={1180} y={330} size={30} color={C.muted} opacity={ch2}>
            seharusnya?
          </Label>
          <Render3D opacity={ch4} items={methane(camCH4, {})} />
          <SvgChem x={1560} y={700} parts={[['CH'], ['4', 'sub']]} size={60} color={C.ink} opacity={ch4} weight={700} />
          <Label x={1560} y={770} size={32} color={C.mint} weight={700} opacity={fourB}>
            4 ikatan (nyata)
          </Label>
        </g>

        {/* --- baris 3: neraca energi --- */}
        <g opacity={r3}>
          <Label x={1420} y={300} size={30} color={C.muted}>
            neraca energi
          </Label>
          {/* tingkat awal */}
          <line x1={1060} y1={560} x2={1200} y2={560} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <Label x={1130} y={595} size={26} color={C.muted}>
            awal
          </Label>
          {/* promosi (naik sedikit) */}
          <g opacity={cost}>
            <line x1={1200} y1={560} x2={1250} y2={560} stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" />
            <line x1={1250} y1={mix(560, 450, cost)} x2={1390} y2={mix(560, 450, cost)} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
            <line x1={1320} y1={556} x2={1320} y2={mix(556, 460, cost)} stroke={C.red} strokeWidth={5} markerEnd="url(#arrow-red)" />
            <Label x={1320} y={405} size={30} color={C.red} weight={700}>
              biaya promosi
            </Label>
          </g>
          {/* dua ikatan tambahan (turun jauh) */}
          <g opacity={gain}>
            <line x1={1390} y1={450} x2={1440} y2={450} stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" />
            <line x1={1440} y1={mix(450, 800, gain)} x2={1580} y2={mix(450, 800, gain)} stroke={C.mint} strokeWidth={6} strokeLinecap="round" />
            <line x1={1510} y1={456} x2={1510} y2={mix(456, 790, gain)} stroke={C.mint} strokeWidth={7} markerEnd="url(#arrow-mint)" />
            <Label x={1600} y={600} size={30} color={C.mint} weight={700} anchor="start">
              +2 ikatan
            </Label>
            <Label x={1600} y={640} size={26} color={C.mint} anchor="start" opacity={0.85}>
              energi lepas
            </Label>
          </g>
          {/* hasil bersih */}
          <g opacity={win}>
            <line x1={1200} y1={560} x2={1200} y2={800} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" />
            <line x1={1200} y1={800} x2={1440} y2={800} stroke={C.gold} strokeWidth={2} strokeDasharray="6 6" />
            <line x1={1160} y1={566} x2={1160} y2={792} stroke={C.gold} strokeWidth={6} markerEnd="url(#arrow-gold)" />
            <Glow x={1100} y={690} r={120} color="gold" opacity={0.35 * (0.6 + 0.4 * pulse)} />
            <Label x={1130} y={690} size={44} color={C.gold} weight={800} anchor="end">
              untung
            </Label>
          </g>
        </g>

        {/* --- baris 4: s dan tiga p berbeda vs empat ikatan identik --- */}
        <g opacity={r4}>
          <Render3D opacity={shapeIn[0]} items={[sphere(camO(0), {center: [0, 0, 0], r: 0.75, color: 'blue', opacity: 0.88})]} />
          {[1, 2, 3].map((k) => (
            <Render3D key={k} opacity={shapeIn[k]} items={pOrb(camO(k), {origin: [0, 0, 0], dir: pDirs[k - 1], len: 1.25, wid: 0.5, opacity: 0.9})} />
          ))}
          <SvgChem x={ox[0]} y={680} parts={[['2s']]} size={40} color={C.blue} opacity={shapeIn[0]} font="serif" />
          {['x', 'y', 'z'].map((ax, k) => (
            <SvgChem key={ax} x={ox[k + 1]} y={680} parts={[['2p'], [ax, 'sub']]} size={40} color={C.gold} opacity={shapeIn[k + 1]} font="serif" />
          ))}
          <Label x={660} y={770} size={32} color={C.muted} opacity={shapeIn[3]}>
            bola · dumbel — beda bentuk
          </Label>
          <Label x={1250} y={480} size={96} color={C.red} weight={700} opacity={iden}>
            ≠
          </Label>
          <Render3D opacity={iden} items={methane(camM, {bondColor: C.cyan})} />
          <Glow x={1520} y={480} r={260} color="cyan" opacity={0.3 * idPulse * (0.6 + 0.4 * pulse)} />
          <Label x={1520} y={740} size={36} color={C.cyan} weight={700} opacity={iden}>
            4 ikatan identik
          </Label>
        </g>
      </Stage>

      <Formula x={520} y={265} p={card1} accent={C.gold}>
        C : 2s<Sup>2</Sup> 2p<Sup>2</Sup>
      </Formula>
      <Formula x={520} y={265} p={card2} accent={C.mint}>
        C* : 2s<Sup>1</Sup> 2p<Sup>3</Sup>
      </Formula>
    </AbsoluteFill>
  );
};
