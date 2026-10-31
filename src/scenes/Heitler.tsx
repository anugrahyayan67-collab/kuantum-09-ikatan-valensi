import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot, smoothPath} from '../anim';
import {Atom, Badge, DrawPath, Formula, Glow, Label, Stage} from '../components/primitives';
import {EDot, PlotFrame, morse} from '../components/vbB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 3: Heitler & London 1927 — dua susunan elektron, ψ = a(1)b(2) + b(1)a(2),
// elektron bertukar tempat; kurva HL (≈ 3,1 eV, 87 pm) vs eksperimen (4,75 eV, 74 pm).

const AX = 720;
const BX = 1200;
const AY = 450;

// grafik energi
const PX = 420;
const PY = 250;
const PW = 1080;
const PH = 550;
const RX = (R: number) => PX + ((R - 30) / 270) * PW;
const EY = (E: number) => PY + ((2 - E) / 7.5) * PH;
const HL = (R: number) => morse(R, 3.14, 87, 0.016);
const EXP = (R: number) => morse(R, 4.75, 74, 0.0194);
const curve = (f: (R: number) => number) => {
  const pts: [number, number][] = [];
  for (let R = 30; R <= 300; R += 2.5) {
    const E = f(R);
    if (E < 2.3) pts.push([RX(R), EY(E)]);
  }
  return smoothPath(pts);
};
const D_HL = curve(HL);
const D_EXP = curve(EXP);

export const Heitler: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // medali 1927
  const med = ramp(t, -0.4, 0.6, BACK);
  const medMove = ramp(t, cue(1) - 0.3, cue(1) + 0.9, EASE_IN_OUT);
  const medX = mix(960, 1690, medMove);
  const medY = mix(440, 250, medMove);
  const medS = mix(1, 0.55, medMove);
  const names = ramp(t, wordOf(0, 'Heitler') - 0.3, wordOf(0, 'Heitler') + 0.5);
  const schr = slot(t, wordOf(0, 'Schrödinger') - 0.3, cue(1) + 0.2);

  // dua atom & elektron
  const atoms = ramp(t, cue(1) - 0.1, cue(1) + 0.7) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.5, EASE_IN_OUT));
  const e1 = ramp(t, wordOf(1, 'satu') - 0.3, wordOf(1, 'satu') + 0.4, BACK);
  const e2 = ramp(t, wordOf(1, 'dua') - 0.3, wordOf(1, 'dua') + 0.4, BACK);
  const lab1 = ramp(t, wordOf(1, 'B.') - 0.2, wordOf(1, 'B.') + 0.5);
  const lab2 = ramp(t, wordOf(2, 'sebaliknya') + 0.6, wordOf(2, 'sebaliknya') + 1.2);
  const labsOut = ramp(t, cue(3) - 0.3, cue(3) + 0.1, EASE_IN_OUT);
  const swap1 = ramp(t, wordOf(2, 'sebaliknya') - 0.2, wordOf(2, 'sebaliknya') + 1.3, EASE_IN_OUT);
  const keep = Math.max(0, t - wordOf(3, 'menjumlahkan')) * 0.42;
  const phi = swap1 + keep;
  const s = 0.5 - 0.5 * Math.cos(Math.PI * phi);
  const arc = Math.sin(Math.PI * s);
  const w = t * 2.6;
  const orbit = 52 * (1 - 0.6 * arc);
  const E1 = {x: mix(AX, BX, s) + orbit * Math.cos(w), y: AY - 120 * arc + orbit * 0.55 * Math.sin(w)};
  const E2 = {x: mix(BX, AX, s) + orbit * Math.cos(w + 2.4), y: AY + 120 * arc + orbit * 0.55 * Math.sin(w + 2.4)};
  const shuttle = ramp(t, wordOf(3, 'bertukar') - 0.4, wordOf(3, 'bertukar') + 0.4);

  const fPsi = slot(t, wordOf(3, 'menjumlahkan') - 0.3, cue(4) + 0.05);

  // grafik energi
  const plot = ramp(t, cue(4) - 0.1, cue(4) + 0.6);
  const dHL = ramp(t, wordOf(4, 'sumur') - 0.3, wordOf(4, 'sumur') + 1.6, EASE_IN_OUT);
  const depth = ramp(t, wordOf(4, 'tiga') - 0.3, wordOf(4, 'tiga') + 0.5);
  const dEXP = ramp(t, wordOf(4, 'Belum') - 0.2, wordOf(4, 'Belum') + 1.2, EASE_IN_OUT);
  const first = ramp(t, wordOf(4, 'pertama') - 0.4, wordOf(4, 'pertama') + 0.4, BACK);
  const rr = 87 + 20 * Math.sin(t * 2.4);
  const rider = {x: RX(rr), y: EY(HL(rr))};

  const ringRot = t * 14;

  return (
    <AbsoluteFill>
      <Stage>
        {/* ---------- medali 1927 (tanpa wajah) ---------- */}
        <g opacity={med} transform={`translate(${medX} ${medY}) scale(${medS * (0.85 + 0.15 * med)})`}>
          <circle r={190} fill="url(#soft-gold)" opacity={0.25} />
          <circle r={150} fill="rgba(14,18,38,0.92)" stroke={C.gold} strokeWidth={4} />
          <circle r={128} fill="none" stroke={C.gold} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="4 10" transform={`rotate(${ringRot})`} />
          <circle r={112} fill="none" stroke={C.gold} strokeOpacity={0.3} strokeWidth={1.5} />
          <text y={-22} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontWeight={600} fontSize={86} fill={C.gold}>
            1927
          </text>
          <g opacity={names}>
            <text y={42} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={600} fontSize={28} fill={C.ink}>
              Heitler &amp; London
            </text>
            <text y={78} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={18} fill={C.muted} letterSpacing={2}>
              ZÜRICH · H₂
            </text>
          </g>
        </g>
        <g opacity={schr}>
          <Label x={960} y={690} size={34} color={C.muted}>
            persamaan Schrödinger
          </Label>
          <text x={960} y={750} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={40} fontWeight={600} fill={C.ink}>
            → molekul H<tspan baselineShift="sub" fontSize={28}>2</tspan>
          </text>
        </g>

        {/* ---------- dua inti & dua elektron ---------- */}
        <g opacity={atoms}>
          <Glow x={AX} y={AY} r={170 + 6 * Math.sin(t * 1.7)} color="cyan" opacity={0.22} />
          <Glow x={BX} y={AY} r={170 + 6 * Math.sin(t * 1.7 + 1)} color="cyan" opacity={0.22} />
          {/* lintasan tukar (muncul saat bertukar) */}
          <path d={`M${AX},${AY} Q960,${AY - 240} ${BX},${AY}`} fill="none" stroke={C.cyan} strokeWidth={2.5} strokeDasharray="6 10" opacity={0.5 * shuttle} />
          <path d={`M${BX},${AY} Q960,${AY + 240} ${AX},${AY}`} fill="none" stroke={C.cyan} strokeWidth={2.5} strokeDasharray="6 10" opacity={0.5 * shuttle} />
          <Atom x={AX} y={AY} el="H" r={36} label="A" />
          <Atom x={BX} y={AY} el="H" r={36} label="B" />
          <EDot x={E1.x} y={E1.y} n={1} opacity={e1} />
          <EDot x={E2.x} y={E2.y} n={2} opacity={e2} />
          <Label x={960} y={AY - 230} size={28} color={C.cyan} opacity={shuttle} weight={600}>
            elektron identik · bertukar tempat
          </Label>
        </g>
        {/* label susunan */}
        <g opacity={lab1 * (1 - labsOut) * atoms}>
          <text x={mix(960, AX, lab2)} y={660} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={48} fill={C.ink}>
            a(1) b(2)
          </text>
          <Label x={mix(960, AX, lab2)} y={720} size={24} color={C.muted}>
            1 di A, 2 di B
          </Label>
        </g>
        <g opacity={lab2 * (1 - labsOut) * atoms}>
          <text x={BX} y={660} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={48} fill={C.ink}>
            b(1) a(2)
          </text>
          <Label x={BX} y={720} size={24} color={C.muted}>
            2 di A, 1 di B
          </Label>
          <Label x={960} y={662} size={40} color={C.gold} weight={700}>
            =
          </Label>
          <Label x={960} y={705} size={20} color={C.gold}>
            sama sah
          </Label>
        </g>

        {/* ---------- kurva energi HL vs eksperimen ---------- */}
        <g opacity={plot}>
          <clipPath id="hl-clip">
            <rect x={PX} y={PY - 10} width={PW} height={PH + 10} />
          </clipPath>
          <PlotFrame x={PX} y={PY} w={PW} h={PH} zeroY={EY(0)} xlabel="jarak antarinti R (pm)" ylabel="energi (eV)" />
          <Label x={PX - 16} y={EY(0)} size={22} color={C.muted} anchor="end" font="mono">
            0
          </Label>
          <g clipPath="url(#hl-clip)">
            <DrawPath d={D_EXP} p={dEXP} stroke={C.cyan} width={5} />
            <DrawPath d={D_HL} p={dHL} stroke={C.violet} width={6} />
          </g>
          {/* garis kedalaman sumur */}
          <g opacity={depth}>
            <line x1={RX(87)} y1={EY(-3.14)} x2={PX + PW - 10} y2={EY(-3.14)} stroke={C.violet} strokeWidth={2} strokeDasharray="7 8" />
            <Label x={PX + PW - 10} y={EY(-3.14) - 26} size={30} color={C.violet} anchor="end" weight={700}>
              ≈ 3,1 eV
            </Label>
            <Label x={RX(87) + 40} y={EY(-3.14) + 30} size={26} color={C.violet} anchor="start" weight={600}>
              Heitler–London 1927 · 87 pm
            </Label>
            <circle cx={rider.x} cy={rider.y} r={30} fill="url(#soft-violet)" />
            <circle cx={rider.x} cy={rider.y} r={11} fill={C.violet} stroke="#fff" strokeWidth={2} />
          </g>
          <g opacity={dEXP}>
            <line x1={RX(74)} y1={EY(-4.75)} x2={PX + PW - 10} y2={EY(-4.75)} stroke={C.cyan} strokeWidth={2} strokeDasharray="7 8" />
            <Label x={PX + PW - 10} y={EY(-4.75) - 26} size={30} color={C.cyan} anchor="end" weight={700}>
              4,75 eV
            </Label>
            <Label x={RX(74) + 30} y={EY(-4.75) + 30} size={26} color={C.cyan} anchor="start" weight={600}>
              eksperimen · 74 pm
            </Label>
            <path
              d={`M${PX + PW - 230},${EY(-3.14) + 14} L${PX + PW - 230},${EY(-4.75) - 14}`}
              stroke={C.red}
              strokeWidth={3}
              strokeDasharray="5 6"
              opacity={0.8}
            />
            <Label x={PX + PW - 245} y={(EY(-3.14) + EY(-4.75)) / 2} size={24} color={C.red} anchor="end">
              belum tepat
            </Label>
          </g>
        </g>
      </Stage>

      <Formula x={960} y={700} p={fPsi} caption={<span>a, b = orbital 1s atom A dan B</span>}>
        <span style={{fontStyle: 'italic'}}>ψ</span> = <span style={{fontStyle: 'italic'}}>a</span>(1) <span style={{fontStyle: 'italic'}}>b</span>(2){' '}
        <span style={{color: C.gold}}>+</span> <span style={{fontStyle: 'italic'}}>b</span>(1) <span style={{fontStyle: 'italic'}}>a</span>(2)
      </Formula>
      <Badge x={1180} y={310} text="ikatan kovalen terjelaskan" color={C.gold} opacity={first * plot} scale={0.8 + 0.2 * first} />
    </AbsoluteFill>
  );
};
