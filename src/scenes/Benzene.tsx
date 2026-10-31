import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Atom, Formula, Glow, Label, Stage, Sub, Sup} from '../components/primitives';
import {HexIcon, POrb, ResArrow, RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 14: benzena — 6 C sp² + 6 orbital p; dua struktur Kekulé ↔; semua C–C 139 pm; awan π; energi resonansi ≈ 150 kJ/mol.
const CX = 560;
const CY = 540;
const R = 230;
const SY = 0.42;
const PX = 1420; // pusat panel kanan

export const Benzene: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const ring = ramp(t, 0.2, 1.4);
  const hyb = ramp(t, wordOf(0, 'sp') - 0.2, wordOf(0, 'sp') + 0.6);
  const pIn = ramp(t, wordOf(0, 'orbital') - 0.2, wordOf(0, 'orbital') + 0.9, BACK);
  const kek = ramp(t, wordOf(1, 'Kekulé') - 0.2, wordOf(1, 'Kekulé') + 0.8);
  const tDua = wordOf(1, 'dua');
  const alt = ramp(t, tDua - 0.4, tDua + 0.4);
  const swing = alt * (0.5 - 0.5 * Math.cos((2 * Math.PI * Math.max(0, t - tDua + 0.4)) / 3.6));
  const uni = ramp(t, wordOf(2, 'sama') - 0.3, wordOf(2, 'sama') + 1.0, EASE_IN_OUT);
  const cloud = ramp(t, wordOf(3, 'resonansi') - 0.4, wordOf(3, 'resonansi') + 1.2, EASE_IN_OUT);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const th0 = 0.12 * t - 0.3;
  const atoms = Array.from({length: 6}, (_, k) => {
    const th = th0 + (k * Math.PI) / 3;
    return {k, x: CX + R * Math.cos(th), y: CY + R * SY * Math.sin(th), hx: CX + (R + 92) * Math.cos(th), hy: CY + (R + 92) * SY * Math.sin(th), d: Math.sin(th)};
  });
  const order = [...atoms].sort((a, b) => a.d - b.d);
  const wA = (1 - swing) * kek * (1 - uni);
  const wB = swing * kek * (1 - uni);
  const lobeL = 96 * pIn;
  const breath = 1 + 0.04 * Math.sin(t * 2.2);

  // slot panel kanan
  const s0 = slot(t, cue(0) + 0.4, cue(1));
  const s1 = slot(t, cue(1) + 0.4, cue(2));
  const s2 = slot(t, cue(2) + 0.2, cue(3));
  const s3 = slot(t, cue(3) + 0.2, cue(4));
  const s4 = ramp(t, cue(4) + 0.2, cue(4) + 0.9);

  // batang panjang ikatan (sumbu terpotong dari 120 pm)
  const X0 = 1200;
  const sc = 14;
  const bars = [
    {lab: 'C–C', pm: 154, col: '#8b97b8', y: 340, p: ramp(t, cue(2) + 0.5, cue(2) + 1.4)},
    {lab: 'benzena', pm: 139, col: C.gold, y: 460, p: ramp(t, wordOf(2, 'sembilan') - 0.6, wordOf(2, 'sembilan') + 0.6)},
    {lab: 'C=C', pm: 134, col: C.amber, y: 580, p: ramp(t, cue(2) + 0.9, cue(2) + 1.8)},
  ];
  const between = ramp(t, wordOf(2, 'antara') - 0.2, wordOf(2, 'antara') + 0.6);

  // diagram energi
  const yK = 380;
  const yB = 380 + 260 * ramp(t, wordOf(4, 'stabil') - 0.6, wordOf(4, 'stabil') + 0.8, EASE_IN_OUT);
  const eLab = ramp(t, wordOf(4, 'lima') - 0.3, wordOf(4, 'lima') + 0.5);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={CX} y={CY} r={420} color="gold" opacity={0.08 + 0.04 * Math.sin(t)} />
        <g opacity={ring}>
          {/* awan π bawah (fase −) */}
          <ellipse cx={CX} cy={CY + 74} rx={R} ry={R * SY} fill="none" stroke={C.violet} strokeWidth={70 * breath} opacity={0.32 * cloud} />
          <ellipse cx={CX} cy={CY + 74} rx={R} ry={R * SY} fill="none" stroke={C.violet} strokeWidth={26} opacity={0.35 * cloud} />
          {/* ikatan σ cincin */}
          {atoms.map((a, k) => {
            const b = atoms[(k + 1) % 6];
            return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8b97b8" strokeWidth={10} strokeLinecap="round" opacity={0.9} />;
          })}
          {/* garis rangkap Kekulé (silang-pudar A ↔ B) */}
          {atoms.map((a, k) => {
            const b = atoms[(k + 1) % 6];
            const w = k % 2 === 0 ? wA : wB;
            if (w <= 0.002) return null;
            const f = 0.78;
            const ax = mix(CX, a.x, f);
            const ay = mix(CY, a.y, f);
            const bx = mix(CX, b.x, f);
            const by = mix(CY, b.y, f);
            const s = 0.16;
            return <line key={k} x1={mix(ax, bx, s)} y1={mix(ay, by, s)} x2={mix(bx, ax, s)} y2={mix(by, ay, s)} stroke={C.amber} strokeWidth={8} strokeLinecap="round" opacity={w} />;
          })}
          {/* hibrida: cincin putus-putus seragam */}
          <ellipse cx={CX} cy={CY} rx={R * 0.78} ry={R * 0.78 * SY} fill="none" stroke={C.amber} strokeWidth={7} strokeDasharray="16 12" strokeDashoffset={-t * 30} opacity={uni} />
          {order.map((a) => (
            <g key={a.k}>
              <line x1={a.x} y1={a.y} x2={a.hx} y2={a.hy} stroke="#8b97b8" strokeWidth={7} strokeLinecap="round" />
              <Atom x={a.hx} y={a.hy} el="H" r={22 + 3 * a.d} glow={0.5} />
              <POrb x={a.x} y={a.y} L={lobeL * (1 + 0.05 * a.d)} w={25} opacity={pIn * (1 - 0.55 * cloud)} glow={0.4 + 0.3 * Math.sin(t * 2 + a.k)} />
              <Atom x={a.x} y={a.y} el="C" r={34 + 4 * a.d} />
            </g>
          ))}
          {/* awan π atas (fase +) */}
          <ellipse cx={CX} cy={CY - 74} rx={R} ry={R * SY} fill="none" stroke={C.gold} strokeWidth={70 * breath} opacity={0.3 * cloud} />
          <ellipse cx={CX} cy={CY - 74} rx={R} ry={R * SY} fill="none" stroke={C.gold} strokeWidth={26} opacity={0.35 * cloud} />
          {Array.from({length: 6}, (_, k) => {
            const th = t * 0.9 + (k * Math.PI) / 3;
            const top = k % 2 === 0;
            return <circle key={k} cx={CX + R * Math.cos(th)} cy={CY + (top ? -74 : 74) + R * SY * Math.sin(th)} r={7} fill={C.cyan} opacity={cloud * 0.9} />;
          })}
        </g>
        <RichLabel x={CX} y={225} parts={[['6 karbon sp'], ['2', 'sup'], [' · tiap C satu orbital p']]} size={32} color={C.mint} opacity={hyb * (1 - cloud)} />
        <RichLabel x={CX} y={225} parts={[['awan π: hibrida resonansi']]} size={34} color={C.gold} opacity={cloud} />

        {/* s1: dua struktur Kekulé */}
        <g opacity={s1}>
          <HexIcon x={PX - 190} y={430} r={105} mode={0} width={6} opacity={0.55 + 0.45 * (1 - swing)} />
          <ResArrow x={PX} y={430} w={110} />
          <HexIcon x={PX + 190} y={430} r={105} mode={1} width={6} opacity={0.55 + 0.45 * swing} />
          <Label x={PX - 190} y={600} size={30} color={C.muted}>
            Kekulé I
          </Label>
          <Label x={PX + 190} y={600} size={30} color={C.muted}>
            Kekulé II
          </Label>
          <Label x={PX} y={690} size={32} color={C.amber} opacity={alt}>
            dua cara menaruh ikatan rangkap
          </Label>
        </g>

        {/* s2: panjang ikatan */}
        <g opacity={s2}>
          <Label x={PX} y={250} size={32} color={C.ink} weight={600}>
            panjang ikatan karbon–karbon
          </Label>
          <line x1={X0} y1={290} x2={X0} y2={630} stroke={C.muted} strokeWidth={3} />
          <Label x={X0} y={660} size={22} color={C.muted} font="mono">
            120 pm
          </Label>
          {[134, 154].map((pm) => (
            <line key={pm} x1={X0 + (pm - 120) * sc} y1={300} x2={X0 + (pm - 120) * sc} y2={620} stroke={pm === 154 ? '#8b97b8' : C.amber} strokeWidth={2} strokeDasharray="6 8" opacity={0.25 + 0.5 * between} />
          ))}
          {bars.map((b) => (
            <g key={b.lab} opacity={Math.min(1, b.p * 2)}>
              <Label x={X0 - 18} y={b.y} size={30} anchor="end" color={b.col} weight={600}>
                {b.lab}
              </Label>
              {b.pm === 139 ? <rect x={X0} y={b.y - 30} width={(b.pm - 120) * sc * b.p} height={60} rx={10} fill={C.gold} opacity={0.18 + 0.1 * Math.sin(t * 3)} /> : null}
              <rect x={X0} y={b.y - 20} width={(b.pm - 120) * sc * b.p} height={40} rx={8} fill={b.col} opacity={0.9} />
              <Label x={X0 + (b.pm - 120) * sc * b.p + 16} y={b.y} size={32} anchor="start" font="mono" color={b.col} opacity={b.p}>
                {`${b.pm} pm`}
              </Label>
            </g>
          ))}
          <Label x={PX} y={740} size={32} color={C.gold} opacity={bars[1].p}>
            keenam ikatan sama: ≈ 139 pm
          </Label>
        </g>

        {/* s3: resonansi → hibrida */}
        <g opacity={s3}>
          <HexIcon x={PX - 190} y={340} r={84} mode={0} width={5} />
          <ResArrow x={PX} y={340} w={100} />
          <HexIcon x={PX + 190} y={340} r={84} mode={1} width={5} />
          <path d={`M${PX},${450} L${PX},${520}`} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${PX - 14},${510} L${PX},${532} L${PX + 14},${510} Z`} fill={C.gold} />
          <circle cx={PX} cy={650} r={130} fill="url(#soft-gold)" opacity={0.35 * cloud} />
          <HexIcon x={PX} y={650} r={100} mode="ring" width={6} />
          <Label x={PX} y={800} size={32} color={C.gold}>
            hibrida resonansi
          </Label>
        </g>

        {/* s4: energi resonansi */}
        <g opacity={s4}>
          <Label x={PX} y={250} size={32} color={C.ink} weight={600}>
            energi
          </Label>
          <HexIcon x={1150} y={yK} r={36} mode={0} width={3} />
          <line x1={1210} y1={yK} x2={1500} y2={yK} stroke="#8b97b8" strokeWidth={6} strokeLinecap="round" />
          <Label x={1520} y={yK} size={28} anchor="start" color={C.muted}>
            satu struktur Kekulé
          </Label>
          <HexIcon x={1150} y={yB} r={36} mode="ring" width={3} />
          <line x1={1210} y1={yB} x2={1500} y2={yB} stroke={C.gold} strokeWidth={18} strokeOpacity={0.16} strokeLinecap="round" />
          <line x1={1210} y1={yB} x2={1500} y2={yB} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
          <Label x={1520} y={yB} size={28} anchor="start" color={C.gold}>
            benzena nyata
          </Label>
          <g opacity={eLab}>
            <line x1={1260} y1={yK + 10} x2={1260} y2={yB - 26} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
            <path d={`M${1246},${yB - 30} L${1260},${yB - 8} L${1274},${yB - 30} Z`} fill={C.red} />
            <Label x={1294} y={(yK + yB) / 2 - 20} size={56} anchor="start" font="serif" color={C.red}>
              ≈ 150 kJ/mol
            </Label>
            <Label x={1296} y={(yK + yB) / 2 + 36} size={28} anchor="start" color={C.muted}>
              energi resonansi
            </Label>
          </g>
          <Label x={PX} y={760} size={30} color={C.gold} opacity={eLab}>
            lebih stabil daripada satu struktur Kekulé
          </Label>
        </g>
      </Stage>
      <Formula x={PX} y={400} p={s0} size={84} caption={<>6 C sp<Sup>2</Sup> · tiap C menyisakan 1 orbital p</>}>
        C<Sub>6</Sub>H<Sub>6</Sub>
      </Formula>
    </AbsoluteFill>
  );
};
