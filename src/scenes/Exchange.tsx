import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp} from '../anim';
import {Arrow, Card, Label, Stage} from '../components/primitives';
import {EDot, densityURL, rho1s, rhoAtoms} from '../components/vbB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 4: kerapatan |a ± b|² (1s ∝ e^(−r/a₀), R = 1,4 a₀ ≈ 74 pm).
// + : menumpuk di antara inti (dua proton menarik) · − : simpul di tengah (tolak) → efek pertukaran.

const R0 = 1.4; // a₀
const X = 3.2;
const Y = 3.2 * (400 / 1120);
const MW = 1120;
const MH = 400;
const MCX = 960;
const MCY = 400;
const S = MW / (2 * X); // px per a₀
const NA = MCX - (R0 / 2) * S;
const NB = MCX + (R0 / 2) * S;

// profil sepanjang sumbu
const PB = 850; // garis dasar
const PHt = 170;
const N = 220;
const xs = Array.from({length: N + 1}, (_, i) => -X + (2 * X * i) / N);
const rP = xs.map((x) => rho1s(x, 0, R0, 1));
const rM = xs.map((x) => rho1s(x, 0, R0, -1));
const rA = xs.map((x) => rhoAtoms(x, 0, R0));
const kP = 1 / Math.max(...rA, ...rP);
const kM = 1 / Math.max(...rM);
const PXof = (x: number) => MCX + x * S;
const PYof = (v: number) => PB - v * PHt;
const poly = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${PXof(xs[i]).toFixed(1)},${PYof(v).toFixed(1)}`).join(' ');

// titik sampel (penolakan, deterministik)
const sampleDots = (sign: 1 | -1, n: number) => {
  const out: {x: number; y: number; ph: number}[] = [];
  const max = rho1s(-R0 / 2, 0, R0, sign) * 1.05;
  let k = 0;
  while (out.length < n && k < 40000) {
    const x = (rand(k * 3.1 + sign) * 2 - 1) * X * 0.9;
    const y = (rand(k * 7.7 + 2 * sign) * 2 - 1) * Y * 0.9;
    if (rand(k * 1.37 + 5 * sign) * max < rho1s(x, y, R0, sign)) out.push({x, y, ph: rand(k * 9.1) * 6.28});
    k++;
  }
  return out;
};
const DOTS_P = sampleDots(1, 130);
const DOTS_M = sampleDots(-1, 130);

const DensityPanel: React.FC<{sign: 1 | -1; t: number; opacity: number; cx: number; cy: number; sc: number; dots: number}> = ({sign, t, opacity, cx, cy, sc, dots}) => {
  if (opacity <= 0.001) return null;
  const D = sign > 0 ? DOTS_P : DOTS_M;
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${sc}) translate(${-MCX} ${-MCY})`}>
      <image href={densityURL(sign, R0, X, Y)} x={MCX - MW / 2} y={MCY - MH / 2} width={MW} height={MH} preserveAspectRatio="none" />
      <g opacity={dots}>
        {D.map((d, i) => (
          <circle
            key={i}
            cx={MCX + d.x * S + 7 * Math.sin(t * 1.3 + d.ph)}
            cy={MCY + d.y * S + 7 * Math.cos(t * 1.1 + d.ph * 1.7)}
            r={3.2}
            fill="#e8fbff"
            opacity={0.35 + 0.3 * Math.sin(t * 2 + d.ph)}
          />
        ))}
      </g>
      {[NA, NB].map((x, k) => (
        <g key={k}>
          <circle cx={x} cy={MCY} r={15} fill={C.red} stroke="#fff" strokeWidth={2.5} />
          <text x={x} y={MCY + 1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={22} fill="#fff">
            +
          </text>
          <text x={x} y={MCY + 44} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={26} fill={C.ink} opacity={0.8}>
            {k ? 'B' : 'A'}
          </text>
        </g>
      ))}
    </g>
  );
};

export const Exchange: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  const nuc = ramp(t, -0.4, 0.6);
  const map = ramp(t, wordOf(0, 'kerapatan') - 0.4, wordOf(0, 'kerapatan') + 0.9);
  const dots = ramp(t, wordOf(0, 'dijumlahkan') - 0.2, wordOf(0, 'dijumlahkan') + 0.8);

  // baris 1: profil, kerapatan berpindah ke tengah
  const prof = ramp(t, cue(1) - 0.2, cue(1) + 0.5) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.4, EASE_IN_OUT));
  const grow = ramp(t, wordOf(1, 'menumpuk') - 0.2, wordOf(1, 'antara') + 0.6, EASE_IN_OUT);
  const glue = ramp(t, wordOf(1, 'lem') - 0.3, wordOf(1, 'lem') + 0.4) * (1 - ramp(t, cue(2) - 0.2, cue(2) + 0.2));

  // baris 2: tarikan dua proton
  const pull = ramp(t, wordOf(2, 'tarikan') - 0.4, wordOf(2, 'tarikan') + 0.4, BACK) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.3, EASE_IN_OUT));
  const low = ramp(t, wordOf(2, 'rendah') - 0.4, wordOf(2, 'rendah') + 0.4) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.3, EASE_IN_OUT));

  // baris 3: dikurangkan → simpul
  const m = ramp(t, wordOf(3, 'dikurangkan') - 0.3, wordOf(3, 'dikurangkan') + 1.0, EASE_IN_OUT);
  const node = ramp(t, wordOf(3, 'simpul') - 0.3, wordOf(3, 'simpul') + 0.4) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.2, EASE_IN_OUT));
  const repel = ramp(t, wordOf(3, 'tolak') - 0.5, wordOf(3, 'tolak') + 0.3) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.2, EASE_IN_OUT));

  // baris 4: keduanya berdampingan + kartu efek pertukaran
  const sp = ramp(t, cue(4) - 0.2, cue(4) + 1.0, EASE_IN_OUT);
  const card = ramp(t, wordOf(4, 'pertukaran') - 0.4, wordOf(4, 'pertukaran') + 0.4, BACK);
  const klasik = ramp(t, wordOf(4, 'klasik') - 0.5, wordOf(4, 'klasik') + 0.3);

  // profil yang tergambar (campuran halus antar-fungsi)
  const fP = rP.map((v, i) => mix(rA[i] * kP, v * kP, grow));
  const fv = fP.map((v, i) => mix(v, rM[i] * kM, m));
  const ref = rA.map((v) => v * kP);
  const gain = fv.map((v, i) => Math.max(v, ref[i]));
  const loss = fv.map((v, i) => Math.min(v, ref[i]));
  const back = (vals: number[]) =>
    vals
      .map((v, i) => [PXof(xs[i]), PYof(v)] as const)
      .reverse()
      .map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
  const refOp = 1 - m;

  const pulseL = 0.5 + 0.5 * Math.sin(t * 4);
  const ex = MCX;
  const ey = MCY + 4 * Math.sin(t * 2.2);

  return (
    <AbsoluteFill>
      <Stage>
        <DensityPanel sign={1} t={t} opacity={map * (1 - m + m * sp)} cx={mix(MCX, 545, sp)} cy={mix(MCY, 420, sp)} sc={mix(1, 0.66, sp) * (0.95 + 0.05 * map)} dots={dots} />
        <DensityPanel sign={-1} t={t} opacity={map * m} cx={mix(MCX, 1375, sp)} cy={mix(MCY, 420, sp)} sc={mix(1, 0.66, sp)} dots={dots} />
        {/* inti sebelum peta muncul */}
        <g opacity={nuc * (1 - map)}>
          {[NA, NB].map((x, k) => (
            <circle key={k} cx={x} cy={MCY} r={15} fill={C.red} stroke="#fff" strokeWidth={2.5} />
          ))}
        </g>

        {/* label peta */}
        <g opacity={map * (1 - sp)}>
          <text x={1520} y={186} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={36} fill={C.cyan} opacity={1 - m}>
            |a + b|<tspan baselineShift="super" fontSize={24}>2</tspan>
            <tspan fontFamily={FONT.sans} fontStyle="normal" fontSize={24} fill={C.muted} dx={14}>
              dijumlahkan
            </tspan>
          </text>
          <text x={1520} y={186} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={36} fill={C.red} opacity={m}>
            |a − b|<tspan baselineShift="super" fontSize={24}>2</tspan>
            <tspan fontFamily={FONT.sans} fontStyle="normal" fontSize={24} fill={C.muted} dx={14}>
              dikurangkan
            </tspan>
          </text>
        </g>

        {/* baris 2: elektron di tengah ditarik dua proton */}
        <g opacity={pull}>
          <Arrow x1={ex - 22} y1={ey} x2={NA + 26 - 10 * pulseL} y2={MCY} color="gold" width={6} />
          <Arrow x1={ex + 22} y1={ey} x2={NB - 26 + 10 * pulseL} y2={MCY} color="gold" width={6} />
          <EDot x={ex} y={ey} r={15} />
          <Label x={MCX} y={MCY - 120} size={30} color={C.gold} weight={600}>
            tarikan dua proton
          </Label>
        </g>
        <g opacity={low}>
          <Label x={1690} y={340} size={30} color={C.mint} weight={700}>
            energi
          </Label>
          <Arrow x1={1690} y1={370} x2={1690} y2={470 + 8 * pulseL} color="mint" width={6} />
          <Label x={1690} y={510} size={26} color={C.mint}>
            lebih rendah
          </Label>
        </g>

        {/* baris 3: simpul & tolak */}
        <g opacity={node}>
          <line x1={MCX} y1={MCY - 170} x2={MCX} y2={MCY + 170} stroke={C.red} strokeWidth={4} strokeDasharray="10 9" />
          <Label x={MCX} y={MCY - 192} size={30} color={C.red} weight={700}>
            simpul
          </Label>
        </g>
        <g opacity={repel}>
          <Arrow x1={NA - 30} y1={MCY} x2={NA - 120 - 14 * pulseL} y2={MCY} color="red" width={7} />
          <Arrow x1={NB + 30} y1={MCY} x2={NB + 120 + 14 * pulseL} y2={MCY} color="red" width={7} />
          <Label x={MCX} y={MCY + 196} size={28} color={C.red} weight={600}>
            atom saling tolak
          </Label>
        </g>

        {/* profil kerapatan sepanjang sumbu */}
        <g opacity={prof}>
          <line x1={PXof(-X)} y1={PB} x2={PXof(X)} y2={PB} stroke={C.muted} strokeWidth={3} />
          <path d={`${poly(gain)} ${back(ref)} Z`} fill={C.cyan} opacity={0.35 * refOp * grow} />
          <path d={`${poly(ref)} ${back(loss)} Z`} fill={C.red} opacity={0.3 * refOp * grow} />
          <path d={poly(ref)} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" opacity={refOp} />
          <path d={poly(fv)} fill="none" stroke={mix(0, 1, m) > 0.5 ? C.red : C.cyan} strokeOpacity={0} />
          <path d={poly(fv)} fill="none" stroke={C.cyan} strokeWidth={5} opacity={1 - m} />
          <path d={poly(fv)} fill="none" stroke={C.red} strokeWidth={5} opacity={m} />
          {[NA, NB].map((x, k) => (
            <line key={k} x1={x} y1={PB - 6} x2={x} y2={PB + 10} stroke={C.ink} strokeWidth={3} />
          ))}
          <Label x={PXof(-X) - 14} y={PB - 70} size={24} color={C.muted} anchor="end">
            kerapatan
          </Label>
          <Label x={PXof(-X) - 14} y={PB - 40} size={24} color={C.muted} anchor="end">
            di sumbu
          </Label>
          <g opacity={refOp}>
            <Label x={PXof(X) + 14} y={PB - 70} size={22} color={C.muted} anchor="start">
              - - atom terpisah
            </Label>
          </g>
          <g opacity={glue}>
            <Label x={MCX} y={PYof(gain[N / 2]) - 34} size={26} color={C.cyan} weight={700}>
              + lem
            </Label>
          </g>
        </g>

        {/* baris 4: label dua peta */}
        <g opacity={sp}>
          <Label x={545} y={585} size={30} color={C.cyan} weight={600}>
            dijumlahkan → ikat
          </Label>
          <Label x={1375} y={585} size={30} color={C.red} weight={600}>
            dikurangkan → tolak
          </Label>
        </g>
      </Stage>

      <Card x={960} y={760} opacity={card} scale={0.9 + 0.1 * card} accent={C.gold} style={{padding: '22px 44px', textAlign: 'center'}}>
        <div style={{fontSize: 58, fontWeight: 700, color: C.gold, fontFamily: FONT.sans}}>efek pertukaran</div>
        <div style={{fontSize: 28, color: C.muted, marginTop: 8, opacity: klasik}}>tidak ada padanannya dalam fisika klasik</div>
      </Card>
    </AbsoluteFill>
  );
};
