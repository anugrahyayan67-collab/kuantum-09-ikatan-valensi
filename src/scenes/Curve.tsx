import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {Formula, Glow, Label, Stage, Sub} from '../components/primitives';
import {DE, H2Pair, RE, VbDefs, morse} from '../components/vbA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 2: kurva energi potensial H₂ (Morse: Dₑ = 4,75 eV, Rₑ = 74 pm, a = 1,94 Å⁻¹).
// Sumbu R literal: atom kiri di R = 0 (sumbu tegak), atom kanan di x(R) → jarak di layar = R.
const X0 = 380; // x untuk R = 0
const PX = 3.6; // px per pm
const RMAX = 345;
const Y0 = 390; // y untuk E = 0
const SYV = 78; // px per eV
const YTOP = 300; // batas atas plot
const YBOT = 830;
const xR = (R: number) => X0 + R * PX;
const yE = (E: number) => Y0 - E * SYV;
const ATY = 224;
const DX = xR(16); // baris atom

const curvePts = (Ra: number, Rb: number, n = 220) =>
  Array.from({length: n + 1}, (_, i) => {
    const R = Rb + ((Ra - Rb) * i) / n; // dari kanan ke kiri
    return [xR(R), yE(morse(R))] as [number, number];
  }).filter((p) => p[1] >= YTOP);
const pathOf = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

export const Curve: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  const axes = ramp(t, cue(0) - 0.4, cue(0) + 1.2, EASE_IN_OUT);
  const axR = ramp(t, wordOf(0, 'datar') - 0.2, wordOf(0, 'antarinti') + 0.4);
  const axE = ramp(t, wordOf(0, 'tegak') - 0.2, wordOf(0, 'energi', 1) + 0.4);
  const atoms = ramp(t, cue(0) + 0.5, cue(0) + 1.6);
  const zero = ramp(t, wordOf(1, 'nol') - 0.4, wordOf(1, 'nol') + 0.4);
  const tail = ramp(t, cue(1) + 0.3, wordOf(1, 'nol') + 0.4, EASE_IN_OUT);

  // gerak jarak antarinti R(t)
  const inA = ramp(t, wordOf(2, 'mendekat') - 0.3, wordOf(2, 'terendah') + 0.5, EASE_IN_OUT);
  const inB = ramp(t, wordOf(3, 'dekat') - 0.3, wordOf(3, 'melonjak') + 0.2, EASE_IN_OUT);
  const back = ramp(t, wordOf(3, 'naik') + 0.4, cue(4) + 0.6, EASE_IN_OUT);
  const vib = ramp(t, cue(4) - 0.2, cue(4) + 1.2);
  let R = mix(RMAX - 15, RE, inA);
  R = mix(R, 41, inB);
  R = mix(R, RE, back);
  R += vib * 7 * Math.sin(t * 4.2) + (1 - inA) * 6 * Math.sin(t * 1.3);
  // kurva tergambar mengikuti titik (dari kanan), lalu lengkap sampai dinding
  const full = ramp(t, wordOf(3, 'melonjak') - 0.1, wordOf(3, 'melonjak') + 0.9);
  const leftEnd = mix(Math.min(mix(RMAX, RMAX - 70, tail), R), 28, full);
  const pts = curvePts(leftEnd, RMAX);
  const E = morse(R);
  const dotX = xR(R);
  const dotY = Math.max(YTOP, yE(E));

  const minMark = ramp(t, wordOf(2, 'tujuh') - 0.3, wordOf(2, 'pikometer') + 0.3);
  const wall = ramp(t, wordOf(3, 'tolak') - 0.3, wordOf(3, 'tolak') + 0.5) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.4, EASE_IN_OUT));
  const de = ramp(t, wordOf(4, 'Kedalaman') - 0.2, wordOf(4, 'sumur') + 0.5, EASE_IN_OUT);
  const deCard = ramp(t, wordOf(4, 'empat') - 0.3, wordOf(4, 'empat') + 0.5);
  const bondLbl = ramp(t, wordOf(4, 'kekuatan') - 0.3, wordOf(4, 'kekuatan') + 0.5);
  const fallGlow = ramp(t, wordOf(2, 'turun') - 0.3, wordOf(2, 'turun') + 0.6) * (1 - ramp(t, cue(3), cue(3) + 0.6));

  // atom: kiri tetap di R = 0, kanan di x(R); awan menyatu bila dekat
  const merge = 1 - ramp(R, 70, 190);
  const xA = X0;
  const xB = xR(R);

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        {/* ---------- sumbu ---------- */}
        <g opacity={axes}>
          <line x1={X0} y1={YBOT} x2={X0} y2={mix(YBOT, YTOP - 20, axes)} stroke={C.muted} strokeWidth={3} />
          <path d={`M${X0},${YTOP - 30} l-9,18 l18,0 z`} fill={C.muted} opacity={axes} />
          <line x1={X0} y1={YBOT} x2={mix(X0, xR(RMAX) + 30, axes)} y2={YBOT} stroke={C.muted} strokeWidth={3} />
          <path d={`M${xR(RMAX) + 40},${YBOT} l-18,-9 l0,18 z`} fill={C.muted} opacity={axes} />
          {[0, 100, 200, 300].map((r) => (
            <g key={r} opacity={axR}>
              <line x1={xR(r)} y1={YBOT} x2={xR(r)} y2={YBOT + 10} stroke={C.muted} strokeWidth={2} />
              <Label x={xR(r)} y={YBOT + 32} size={22} color={C.muted} font="mono">
                {String(r)}
              </Label>
            </g>
          ))}
          <Label x={xR(RMAX) + 30} y={YBOT - 34} size={28} color={C.ink} anchor="end" opacity={axR} weight={600}>
            jarak antarinti R (pm)
          </Label>
          {[0, -1, -2, -3, -4, -5].map((e) => (
            <g key={e} opacity={axE}>
              <line x1={X0 - 10} y1={yE(e)} x2={X0} y2={yE(e)} stroke={C.muted} strokeWidth={2} />
              <Label x={X0 - 20} y={yE(e)} size={22} color={C.muted} font="mono" anchor="end">
                {e === 0 ? '0' : `−${-e}`}
              </Label>
            </g>
          ))}
          <g opacity={axE} transform={`translate(${X0 - 92} ${yE(-2.4)}) rotate(-90)`}>
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={600} fontSize={28} fill={C.ink}>
              energi E (eV)
            </text>
          </g>
        </g>
        {/* garis E = 0 */}
        <line x1={X0} y1={Y0} x2={xR(RMAX)} y2={Y0} stroke={C.ink} strokeWidth={2} strokeDasharray="8 10" opacity={0.25 * axes + 0.45 * zero} />
        <Label x={xR(RMAX) - 10} y={Y0 + 30} size={26} color={C.ink} anchor="end" opacity={zero} weight={600}>
          E = 0 · tidak saling merasakan
        </Label>

        {/* ---------- kurva ---------- */}
        <Glow x={dotX} y={dotY} r={160} color="mint" opacity={0.35 * fallGlow} />
        {leftEnd < RMAX - 1 ? (
          <g>
            <path d={pathOf(pts)} fill="none" stroke={C.cyan} strokeWidth={14} strokeOpacity={0.12} strokeLinejoin="round" strokeLinecap="round" />
            <path d={pathOf(pts)} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ) : null}

        {/* minimum 74 pm */}
        <g opacity={minMark}>
          <line x1={xR(RE)} y1={yE(-DE)} x2={xR(RE)} y2={YBOT} stroke={C.gold} strokeWidth={2.5} strokeDasharray="6 7" />
          <circle cx={xR(RE)} cy={yE(-DE)} r={30 + 4 * Math.sin(t * 3)} fill="url(#soft-gold)" />
          <g transform={`translate(${xR(RE) + 14} ${YBOT - 26})`}>
            <rect x={0} y={-22} width={150} height={44} rx={22} fill="rgba(12,18,40,0.9)" stroke={C.gold} strokeWidth={2} />
            <text x={75} y={1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontWeight={600} fontSize={24} fill={C.gold}>
              R
              <tspan baselineShift="sub" fontSize={16}>
                e
              </tspan>{' '}
              = 74 pm
            </text>
          </g>
        </g>

        {/* dinding tolak */}
        <g opacity={wall}>
          <Label x={xR(28) + 70} y={YTOP + 30} size={28} color={C.red} anchor="start" weight={600}>
            tolakan inti–inti
          </Label>
          <Glow x={xR(41)} y={dotY} r={120} color="red" opacity={0.4} />
        </g>

        {/* Dₑ (panah di kiri sumur, di luar kurva) */}
        <g opacity={de}>
          <line x1={DX} y1={Y0} x2={DX} y2={mix(Y0, yE(-DE), de)} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${DX},${Y0 - 2} l-11,20 l22,0 z`} fill={C.red} />
          <path d={`M${DX},${yE(-DE) + 2} l-11,-20 l22,0 z`} fill={C.red} opacity={ramp(de, 0.85, 1)} />
          <line x1={DX} y1={yE(-DE)} x2={xR(RE)} y2={yE(-DE)} stroke={C.red} strokeWidth={2} strokeDasharray="5 6" opacity={0.7} />
          <text x={DX + 16} y={yE(-DE * 0.62)} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={40} fill={C.red}>
            D<tspan baselineShift="sub" fontSize={26}>e</tspan>
          </text>
        </g>

        {/* titik di kurva + garis tegak ke atom */}
        <g opacity={atoms}>
          <line x1={dotX} y1={ATY + 60} x2={dotX} y2={dotY - 16} stroke={C.gold} strokeWidth={2} strokeDasharray="4 7" opacity={0.6} />
          <circle cx={dotX} cy={dotY} r={22} fill="url(#soft-gold)" />
          <circle cx={dotX} cy={dotY} r={11} fill={C.gold} stroke="#fff" strokeWidth={2} />
          <text x={dotX + 22} y={dotY - 30} fontFamily={FONT.mono} fontSize={22} fill={C.gold} opacity={0.9}>
            {`${(E < 0 ? '−' : '+') + Math.abs(E).toFixed(2).replace('.', ',')} eV`}
          </text>
        </g>

        {/* dua atom H di atas grafik (skala sama dengan sumbu R) */}
        <g opacity={atoms}>
          <H2Pair x1={xA} x2={xB} y={ATY} t={t} R={58} merge={merge} />
          {wall > 0.01 ? (
            <g opacity={wall}>
              <line x1={xA - 22} y1={ATY} x2={xA - 80} y2={ATY} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${xA - 90},${ATY} l16,-11 l0,22 z`} fill={C.red} />
              <line x1={xB + 22} y1={ATY} x2={xB + 80} y2={ATY} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${xB + 90},${ATY} l-16,-11 l0,22 z`} fill={C.red} />
            </g>
          ) : null}
        </g>
      </Stage>

      <Formula x={1330} y={610} p={deCard} accent={C.red}>
        <span style={{color: C.red}}>
          <i>D</i>
          <Sub>e</Sub>
        </span>{' '}
        ≈ 4,75 eV
      </Formula>
      <div
        style={{
          position: 'absolute',
          left: 1330,
          top: 700,
          transform: 'translate(-50%, 0)',
          opacity: bondLbl,
          fontFamily: FONT.sans,
          fontSize: 30,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        kedalaman sumur = kekuatan ikatan H<Sub>2</Sub>
      </div>
    </AbsoluteFill>
  );
};
