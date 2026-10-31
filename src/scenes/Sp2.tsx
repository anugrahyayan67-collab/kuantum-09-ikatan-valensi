import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Glow, Label, Stage, Sub, Sup} from '../components/primitives';
import {
  Render3D,
  SvgChem,
  VbDefs,
  add,
  angleArc,
  ball,
  cloud,
  hybrid,
  molItems,
  mul,
  pOrb,
  proj,
  rotX,
  sphere,
  wire,
  type Cam,
  type Item,
  type MAtom,
  type MBond,
  type V3,
} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 10: etilena — sp² datar 120°, p tegak lurus → ikatan π; rangkap = σ + π; rotasi memutus π → cis/trans.
const H120: V3[] = [0, 1, 2].map((k) => [Math.cos((2 * Math.PI * k) / 3), Math.sin((2 * Math.PI * k) / 3), 0] as V3);
const CC = 0.67; // setengah jarak C=C (134 pm)

export const Sp2: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
  const yaw = -0.35 + 0.28 * Math.sin(t * 0.35) + t * 0.05;
  const pitch = -0.5;

  // baris 0
  const card0 = slot(t, 0.3, cue(1) + 0.1);
  const orbIn = ramp(t, wordOf(0, 'karbon') - 0.3, wordOf(0, 'karbon') + 0.5);
  const mixP = ramp(t, wordOf(0, 'mencampur') - 0.1, cue(1) + 0.4, EASE_IN_OUT);
  // baris 1
  const hyb = ramp(t, cue(1) - 0.1, wordOf(1, 'hibrida') + 0.5, EASE_IN_OUT);
  const plane = ramp(t, wordOf(1, 'bidang') - 0.3, wordOf(1, 'bidang') + 0.4);
  const arc = ramp(t, wordOf(1, 'seratus') - 0.2, wordOf(1, 'derajat') + 0.2, EASE_IN_OUT);
  // baris 2
  const pHi = ramp(t, cue(2), wordOf(2, 'tegak') + 0.4) * (1 - ramp(t, wordOf(2, 'Dua') - 0.2, wordOf(2, 'Dua') + 0.3));
  const two = ramp(t, wordOf(2, 'Dua') - 0.2, wordOf(2, 'karbon') + 0.4, EASE_IN_OUT);
  const pi = ramp(t, wordOf(2, 'samping') - 0.3, wordOf(2, 'pi') + 0.3, EASE_IN_OUT);
  // baris 3
  const skel = ramp(t, cue(3) - 0.2, cue(3) + 0.8, EASE_IN_OUT);
  const card3 = slot(t, cue(3) + 0.1, wordOf(4, 'isomer') - 0.2);
  const sigHi = ramp(t, wordOf(3, 'sigma') - 0.2, wordOf(3, 'sigma') + 0.3) * (1 - ramp(t, wordOf(3, 'ditambah'), wordOf(3, 'ditambah') + 0.4));
  const piHi = ramp(t, wordOf(3, 'pi') - 0.2, wordOf(3, 'pi') + 0.3) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.3));
  // baris 4: putar → π robek → kembali; lalu isomer
  const twistP = ramp(t, wordOf(4, 'Memutar') - 0.1, wordOf(4, 'memutus') + 0.5, EASE_IN_OUT) * (1 - ramp(t, wordOf(4, 'kaku') - 0.6, wordOf(4, 'kaku') + 0.3, EASE_IN_OUT));
  const tau = (Math.PI / 2) * twistP;
  const piAmt = Math.cos(tau) ** 2;
  const isoT = wordOf(4, 'isomer');
  const ethOut = 1 - ramp(t, isoT - 0.3, isoT + 0.4, EASE_IN_OUT);
  const isoIn = ramp(t, isoT - 0.1, isoT + 0.6);
  const cisIn = ramp(t, wordOf(4, 'cis') - 0.2, wordOf(4, 'cis') + 0.4, BACK);
  const transIn = ramp(t, wordOf(4, 'trans') - 0.2, wordOf(4, 'trans') + 0.4, BACK);
  const meter = ramp(t, wordOf(4, 'Memutar') - 0.2, wordOf(4, 'Memutar') + 0.3) * ethOut;

  const items: Item[] = [];
  const cam: Cam = {cx: 960, cy: 600, s: mix(170, 150, two), yaw, pitch};
  // posisi karbon: tunggal di origin → C1 di −CC; C2 masuk dari kanan
  const c1: V3 = [-CC * two, 0, 0];
  const c2: V3 = [mix(5, CC, two), 0, 0];
  const twist = (v: V3) => rotX(v, tau);

  if (ethOut > 0.01) {
    // baris 0: s + px + py + pz (sebelum dicampur)
    const pre = orbIn * (1 - mixP);
    if (pre > 0.01) {
      const s0 = sphere(cam, {center: [0, 0, 0], r: 0.6, color: 'blue', opacity: 0.8 * pre});
      if (s0) items.push(s0);
      items.push(...pOrb(cam, {origin: [0, 0, 0], dir: [1, 0, 0], len: 1.0, wid: 0.4, opacity: 0.85 * pre}));
      items.push(...pOrb(cam, {origin: [0, 0, 0], dir: [0, 1, 0], len: 1.0, wid: 0.4, opacity: 0.85 * pre}));
    }
    // hibrida sp² karbon 1 (dan karbon 2)
    const hOp = hyb * (1 - skel) * ethOut;
    if (hOp > 0.01) {
      H120.forEach((d, k) => items.push(...hybrid(cam, {origin: c1, dir: d, len: 1.15, wid: 0.46, opacity: 0.88 * hOp, glow: k === 0 ? 0 : 0})));
      if (two > 0.01) H120.forEach((d) => items.push(...hybrid(cam, {origin: c2, dir: mul(d, -1), len: 1.15, wid: 0.46, opacity: 0.88 * hOp * two})));
    }
    // orbital p tegak lurus bidang
    const pOp = orbIn * ethOut * (1 - pi * piAmt);
    if (pOp > 0.01) {
      items.push(...pOrb(cam, {origin: c1, dir: [0, 0, 1], len: 1.05, wid: 0.4, opacity: 0.9 * pOp, glow: pHi * pulse}));
      if (two > 0.01) items.push(...pOrb(cam, {origin: c2, dir: twist([0, 0, 1]), len: 1.05, wid: 0.4, opacity: 0.9 * pOp * two}));
    }
    // awan π (atas & bawah bidang)
    const piOp = pi * piAmt * ethOut;
    if (piOp > 0.01) {
      for (const z of [0.5, -0.5]) {
        const it = cloud(cam, {center: [0, 0, z], axis: [1, 0, 0], a: 1.25, b: 0.36, color: 'amber', opacity: 0.85 * piOp, glow: piHi * pulse + 0.3});
        if (it) items.push(it);
      }
    }
    // kerangka bola-batang (H + σ)
    if (skel > 0.01) {
      const atoms: MAtom[] = [
        {pos: c1, el: 'C'},
        {pos: c2, el: 'C'},
        ...[1, 2].map((k) => ({pos: add(c1, mul(H120[k], 1.08)), el: 'H'})),
        ...[1, 2].map((k) => ({pos: add(c2, twist(mul(H120[k], -1.08))), el: 'H'})),
      ];
      const bonds: MBond[] = [{a: 0, b: 1, color: C.cyan, width: 0.15}, {a: 0, b: 2}, {a: 0, b: 3}, {a: 1, b: 4}, {a: 1, b: 5}];
      items.push(...molItems(cam, atoms, bonds, skel * ethOut));
    }
    if (skel < 0.99) {
      const b1 = ball(cam, {pos: c1, el: 'C', r: 0.3, opacity: orbIn * ethOut * (1 - skel)});
      if (b1) items.push(b1);
      const b2 = ball(cam, {pos: c2, el: 'C', r: 0.3, opacity: two * ethOut * (1 - skel)});
      if (b2) items.push(b2);
    }
    // bidang molekul (lingkaran tipis) & busur 120°
    const plOp = plane * (1 - two) * ethOut;
    if (plOp > 0.01) {
      const N = 40;
      for (let i = 0; i < N; i++) {
        const a0 = (2 * Math.PI * i) / N;
        const a1 = (2 * Math.PI * (i + 1)) / N;
        const w = wire(cam, {a: [1.5 * Math.cos(a0), 1.5 * Math.sin(a0), 0], b: [1.5 * Math.cos(a1), 1.5 * Math.sin(a1), 0], color: C.mint, opacity: 0.5 * plOp, width: 2, dashBack: true});
        if (w) items.push(w);
      }
    }
    const ar = angleArc(cam, {center: [0, 0, 0], u: H120[0], v: H120[1], r: 0.55, labelR: 0.95, p: arc, opacity: arc * (1 - two), label: '120°', size: 56, color: C.gold});
    if (ar) items.push(ar);
  }

  // label σ / π
  const sigP = proj([0, 0, 0], cam);
  const piP = proj([0, 0, 0.95], cam);
  const pTop = proj([0, 0, 1.15], cam);

  // isomer cis / trans 2-butena (bidang molekul menghadap penonton)
  const butene = (cis: boolean): {atoms: MAtom[]; bonds: MBond[]} => {
    const L: V3 = [-CC, 0, 0];
    const Rr: V3 = [CC, 0, 0];
    const up: V3 = [0.5, 0, 0.866];
    const dn: V3 = [0.5, 0, -0.866];
    const atoms: MAtom[] = [
      {pos: L, el: 'C'},
      {pos: Rr, el: 'C'},
      {pos: add(L, mul([-up[0], 0, up[2]], 1.5)), el: 'Me'},
      {pos: add(L, mul([-dn[0], 0, dn[2]], 1.08)), el: 'H'},
      {pos: add(Rr, mul(cis ? up : dn, 1.5)), el: 'Me'},
      {pos: add(Rr, mul(cis ? dn : up, 1.08)), el: 'H'},
    ];
    return {atoms, bonds: [{a: 0, b: 1, order: 2, color: C.amber}, {a: 0, b: 2}, {a: 0, b: 3}, {a: 1, b: 4}, {a: 1, b: 5}]};
  };
  const camIso = (cx: number): Cam => ({cx, cy: 560, s: 135, yaw: 0.35 * Math.sin(t * 0.5 + cx), pitch: -0.15});
  const cisM = butene(true);
  const trM = butene(false);

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Glow x={960} y={600} r={260} color="mint" opacity={0.5 * Math.sin(Math.PI * mixP)} />
        <Render3D items={items} />
        {/* label tahap */}
        <SvgChem
          x={960}
          y={860}
          size={34}
          color={C.muted}
          weight={500}
          opacity={orbIn * (1 - ramp(mixP, 0.6, 1)) * ethOut}
          parts={[['s + p'], ['x', 'sub'], [' + p'], ['y', 'sub'], [' dicampur · p'], ['z', 'sub'], [' disisihkan']]}
        />
        <g opacity={pHi}>
          <Label x={pTop.X + 70} y={pTop.Y} size={34} color={C.gold} weight={700} anchor="start">
            p tersisa ⊥ bidang
          </Label>
        </g>
        <Label x={960} y={860} size={34} color={C.amber} weight={700} opacity={pi * (1 - skel) * ethOut}>
          tumpang tindih samping → ikatan π
        </Label>
        <g opacity={skel * ethOut * (1 - twistP)}>
          <Label x={sigP.X} y={sigP.Y + 70} size={44} color={C.cyan} weight={700} opacity={0.6 + 0.4 * sigHi}>
            σ
          </Label>
          <Label x={piP.X + 230} y={piP.Y - 20} size={44} color={C.amber} weight={700} opacity={0.6 + 0.4 * piHi}>
            π
          </Label>
        </g>
        {/* meter energi saat diputar */}
        <g opacity={meter}>
          <rect x={1560} y={360} width={48} height={400} rx={12} fill="rgba(12,18,40,0.85)" stroke={C.faint} strokeWidth={2} />
          <rect x={1564} y={756 - 392 * Math.sin(tau) ** 2} width={40} height={392 * Math.sin(tau) ** 2} rx={9} fill={C.red} opacity={0.85} />
          <Label x={1584} y={325} size={30} color={C.red} weight={700}>
            energi
          </Label>
          <Label x={1584} y={800} size={26} color={C.muted}>
            sudut putar {Math.round((tau * 180) / Math.PI)}°
          </Label>
          <Label x={1400} y={860} size={34} color={C.red} weight={700} opacity={ramp(twistP, 0.5, 0.9)}>
            π putus → kaku
          </Label>
        </g>
        {/* isomer */}
        <g opacity={isoIn}>
          <Render3D opacity={cisIn} items={molItems(camIso(600), cisM.atoms, cisM.bonds)} />
          <Render3D opacity={transIn} items={molItems(camIso(1320), trM.atoms, trM.bonds)} />
          <Label x={600} y={330} size={60} color={C.cyan} weight={700} italic opacity={cisIn}>
            cis
          </Label>
          <Label x={1320} y={330} size={60} color={C.pink} weight={700} italic opacity={transIn}>
            trans
          </Label>
          <SvgChem x={600} y={800} parts={[['CH'], ['3', 'sub'], [' sepihak']]} size={32} color={C.muted} opacity={cisIn} weight={500} />
          <SvgChem x={1320} y={800} parts={[['CH'], ['3', 'sub'], [' berseberangan']]} size={32} color={C.muted} opacity={transIn} weight={500} />
          <Label x={960} y={560} size={34} color={C.amber} weight={700} opacity={transIn}>
            ≠
          </Label>
          <Label x={960} y={860} size={30} color={C.muted} opacity={transIn}>
            2-butena: dua senyawa berbeda
          </Label>
        </g>
      </Stage>

      <Formula x={960} y={260} p={card0} accent={C.gold} caption="etilena">
        C<Sub>2</Sub>H<Sub>4</Sub>
      </Formula>
      <Formula x={960} y={250} p={card3} accent={C.amber} caption="ikatan rangkap dua">
        C=C : <span style={{color: C.cyan}}>σ</span> + <span style={{color: C.amber}}>π</span>
      </Formula>
      <Formula x={960} y={250} p={slot(t, cue(1) + 0.3, cue(2))} accent={C.mint}>
        s + 2p → 3{' '}
        <span style={{color: C.mint}}>
          sp<Sup>2</Sup>
        </span>
      </Formula>
    </AbsoluteFill>
  );
};
