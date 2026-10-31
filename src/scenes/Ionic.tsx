import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Atom, Card, Label, Stage} from '../components/primitives';
import {EDot, HBar} from '../components/vbB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 6: kovalen H–H + ionik H⁺H⁻ / H⁻H⁺ (bobot kecil) + orbital disesuaikan → D_e 3,1 → ≈ 4,0 eV (eksp. 4,75).
// Resonansi = satu keadaan campuran, bukan berganti-ganti.

const SY = 330;
const SX = [400, 960, 1520];
const GAP = 78;

const rgb = (c: [number, number, number]) => `rgb(${c.map((v) => Math.round(v)).join(',')})`;
const CYAN: [number, number, number] = [79, 214, 255];
const PINK: [number, number, number] = [255, 122, 217];
const VIOL: [number, number, number] = [160, 131, 255];
const blend = (ws: number[], cs: [number, number, number][]) => {
  const tot = ws.reduce((a, b) => a + b, 0) || 1;
  return [0, 1, 2].map((k) => cs.reduce((a, c, i) => a + c[k] * ws[i], 0) / tot) as [number, number, number];
};

/** Satu struktur: kind 0 kovalen, 1 = H⁺ H⁻, 2 = H⁻ H⁺. */
const Struct: React.FC<{x: number; y: number; kind: 0 | 1 | 2; t: number; opacity: number; sc?: number}> = ({x, y, kind, t, opacity, sc = 1}) => {
  if (opacity <= 0.001) return null;
  const L = {x: -GAP, y: 0};
  const R = {x: GAP, y: 0};
  const w = t * 2.4 + kind;
  const orb = (c: {x: number; y: number}, ph: number, r = 44) => ({x: c.x + r * Math.cos(w + ph), y: c.y + r * 0.5 * Math.sin(w + ph)});
  const col = [C.cyan, C.pink, C.violet][kind];
  let es: {x: number; y: number}[];
  if (kind === 0) es = [orb(L, 0), orb(R, Math.PI)];
  else if (kind === 1) es = [orb(R, 0, 48), orb(R, Math.PI, 48)];
  else es = [orb(L, 0, 48), orb(L, Math.PI, 48)];
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${sc})`}>
      <ellipse cx={0} cy={0} rx={190} ry={86} fill={col} opacity={0.06} />
      {kind === 0 ? <line x1={L.x} y1={0} x2={R.x} y2={0} stroke={C.muted} strokeWidth={6} strokeLinecap="round" /> : null}
      <Atom x={L.x} y={0} el="H" r={30} />
      <Atom x={R.x} y={0} el="H" r={30} />
      {kind !== 0 ? (
        <>
          <text x={L.x + 28} y={-38} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={30} fill={kind === 1 ? C.red : C.cyan}>
            {kind === 1 ? '+' : '−'}
          </text>
          <text x={R.x + 28} y={-38} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={30} fill={kind === 1 ? C.cyan : C.red}>
            {kind === 1 ? '−' : '+'}
          </text>
        </>
      ) : null}
      {es.map((e, i) => (
        <EDot key={i} x={e.x} y={e.y} r={10} />
      ))}
      <text x={0} y={92} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={600} fontSize={32} fill={col}>
        {kind === 0 ? (
          'H–H kovalen'
        ) : kind === 1 ? (
          <>
            H<tspan baselineShift="super" fontSize={22}>+</tspan> H<tspan baselineShift="super" fontSize={22}>−</tspan> ionik
          </>
        ) : (
          <>
            H<tspan baselineShift="super" fontSize={22}>−</tspan> H<tspan baselineShift="super" fontSize={22}>+</tspan> ionik
          </>
        )}
      </text>
    </g>
  );
};

// meter energi
const MX = 520;
const MW = 900;
const MY = 700;
const ex = (E: number) => MX + (E / 5) * MW;

export const Ionic: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  const cov = ramp(t, -0.4, 0.6);
  const covMove = ramp(t, cue(1) - 0.2, cue(1) + 0.8, EASE_IN_OUT);
  const only = ramp(t, wordOf(0, 'satu') - 0.3, wordOf(0, 'satu') + 0.4);
  const ion1 = ramp(t, wordOf(1, 'plus') - 0.5, wordOf(1, 'plus') + 0.3, BACK);
  const ion2 = ramp(t, wordOf(1, 'minus') - 0.4, wordOf(1, 'minus') + 0.4, BACK);
  const same = ramp(t, wordOf(1, 'sama') - 0.4, wordOf(1, 'sama') + 0.3) * (1 - ramp(t, cue(2) - 0.2, cue(2) + 0.3));

  // baris 2: bobot & energi
  const bars = ramp(t, wordOf(2, 'sedikit') - 0.4, wordOf(2, 'sedikit') + 0.8, EASE_IN_OUT);
  const meter = slot(t, cue(2) - 0.1, cue(3) + 0.15, 0.6, 0.45);
  const tune = ramp(t, wordOf(2, 'penyesuaian') - 0.3, wordOf(2, 'penyesuaian') + 0.4);
  const rise = ramp(t, wordOf(2, 'mendekati') - 0.4, wordOf(2, 'empat') + 0.8, EASE_IN_OUT);
  const E = mix(3.1, 4.0, rise);
  const shimmer = 0.5 + 0.5 * Math.sin(t * 3);

  // baris 3: resonansi (tetes warna bercampur)
  const reso = ramp(t, wordOf(3, 'resonansi') - 0.5, wordOf(3, 'resonansi') + 0.3);
  const arrows = ramp(t, wordOf(3, 'Pencampuran') - 0.3, wordOf(3, 'Pencampuran') + 0.5);
  const pour = ramp(t, wordOf(3, 'Pencampuran'), cue(4) - 0.2, EASE_IN_OUT);
  const mixFill = ramp(t, wordOf(3, 'Pencampuran') + 0.6, cue(4), EASE_IN_OUT);

  // baris 4: bukan berkedip
  const l4 = ramp(t, cue(4) - 0.1, cue(4) + 0.8, EASE_IN_OUT);
  const card = ramp(t, cue(4) + 0.1, cue(4) + 0.7, BACK);
  const wrong = ramp(t, wordOf(4, 'berganti-ganti') - 0.4, wordOf(4, 'berganti-ganti') + 0.4);
  const cross = ramp(t, wordOf(4, 'berganti-ganti') + 0.5, wordOf(4, 'berganti-ganti') + 1.0, EASE_IN_OUT);
  const right = ramp(t, wordOf(4, 'campuran') - 0.4, wordOf(4, 'campuran') + 0.4, BACK);
  const stab = ramp(t, wordOf(4, 'stabil') - 0.4, wordOf(4, 'stabil') + 0.6, EASE_IN_OUT);

  const ws = [0.84, 0.08, 0.08];
  const mixed = rgb(blend(ws, [CYAN, PINK, VIOL]));
  const flick = 0.5 + 0.5 * Math.sin(t * 5);
  const mcx = mix(960, 1300, l4);
  const mcy = mix(730, 760, l4);

  return (
    <AbsoluteFill>
      <Stage>
        {/* struktur */}
        <Struct x={mix(960, SX[0], covMove)} y={mix(470, SY, covMove)} kind={0} t={t} opacity={cov} sc={mix(1.4, 1, covMove)} />
        <g opacity={only * (1 - covMove)}>
          <Label x={960} y={680} size={30} color={C.muted}>
            satu elektron di tiap atom
          </Label>
        </g>
        <Struct x={SX[1]} y={SY} kind={1} t={t} opacity={ion1} />
        <Struct x={SX[2]} y={SY} kind={2} t={t + 0.7} opacity={ion2} />
        <g opacity={same}>
          <Label x={(SX[1] + SX[2]) / 2} y={SY - 140} size={28} color={C.pink}>
            dua elektron di atom yang sama
          </Label>
        </g>

        {/* panah resonansi ↔ */}
        <g opacity={arrows}>
          {[0, 1].map((k) => {
            const x1 = SX[k] + 200;
            const x2 = SX[k + 1] - 200;
            return (
              <g key={k}>
                <line x1={x1 + 12} y1={SY} x2={x2 - 12} y2={SY} stroke={C.gold} strokeWidth={4} />
                <path d={`M${x1 + 22},${SY - 12} L${x1},${SY} L${x1 + 22},${SY + 12}`} fill="none" stroke={C.gold} strokeWidth={4} strokeLinejoin="round" />
                <path d={`M${x2 - 22},${SY - 12} L${x2},${SY} L${x2 - 22},${SY + 12}`} fill="none" stroke={C.gold} strokeWidth={4} strokeLinejoin="round" />
              </g>
            );
          })}
        </g>

        {/* bobot */}
        <g opacity={bars}>
          {SX.map((x, k) => (
            <g key={k}>
              <HBar x={x - 130} y={485} w={260} v={(k === 0 ? 1 : 0.1) * bars} color={[C.cyan, C.pink, C.violet][k]} h={22} />
              <Label x={x} y={520} size={22} color={C.muted}>
                {k === 0 ? 'bobot besar' : 'bobot kecil'}
              </Label>
            </g>
          ))}
        </g>

        {/* meter energi ikatan */}
        <g opacity={meter}>
          <Label x={MX - 30} y={MY} size={28} color={C.ink} anchor="end" weight={600}>
            energi ikatan
          </Label>
          <rect x={MX} y={MY - 22} width={MW} height={44} rx={22} fill="rgba(20,28,56,0.9)" stroke={C.faint} strokeWidth={2} />
          <rect x={MX} y={MY - 22} width={ex(E) - MX} height={44} rx={22} fill={C.mint} opacity={0.85} />
          <rect x={ex(E) - 30} y={MY - 22} width={30} height={44} rx={15} fill="#fff" opacity={0.25 * shimmer} />
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <g key={v}>
              <line x1={ex(v)} y1={MY + 28} x2={ex(v)} y2={MY + 40} stroke={C.muted} strokeWidth={2} />
              <text x={ex(v)} y={MY + 60} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} fill={C.muted}>
                {v}
              </text>
            </g>
          ))}
          <text x={MX + MW + 20} y={MY + 60} fontFamily={FONT.sans} fontSize={20} fill={C.muted}>
            eV
          </text>
          {/* penanda HL & eksperimen */}
          <line x1={ex(3.1)} y1={MY - 40} x2={ex(3.1)} y2={MY - 22} stroke={C.violet} strokeWidth={4} />
          <Label x={ex(3.1)} y={MY - 62} size={24} color={C.violet} weight={600}>
            HL 3,1
          </Label>
          <line x1={ex(4.75)} y1={MY - 40} x2={ex(4.75)} y2={MY + 22} stroke={C.cyan} strokeWidth={4} strokeDasharray="6 5" />
          <Label x={ex(4.75)} y={MY - 62} size={24} color={C.cyan} weight={600}>
            eksperimen 4,75
          </Label>
          <g opacity={rise}>
            <Label x={ex(E)} y={MY + 100} size={30} color={C.mint} weight={700}>
              ≈ 4,0 eV
            </Label>
          </g>
          <g opacity={tune}>
            <Label x={MX} y={MY + 130} size={24} color={C.muted} anchor="start">
              + struktur ionik + ukuran orbital disesuaikan
            </Label>
          </g>
        </g>

        {/* tetes warna dari tiap struktur → satu campuran */}
        <g opacity={reso}>
          {SX.map((x, k) => {
            const p = Math.min(1, Math.max(0, pour * 1.15 - k * 0.07));
            const dx = mix(x, mcx, p);
            const dy = mix(560, mcy, p) - 60 * Math.sin(Math.PI * p);
            const col = [C.cyan, C.pink, C.violet][k];
            return <circle key={k} cx={dx} cy={dy} r={(k === 0 ? 22 : 12) * (1 - p * 0.9)} fill={col} opacity={1 - ramp(p, 0.85, 1)} />;
          })}
          <circle cx={mcx} cy={mcy} r={84} fill="rgba(10,16,36,0.85)" stroke={C.ink} strokeOpacity={0.5} strokeWidth={3} />
          <circle cx={mcx} cy={mcy} r={78 * mixFill} fill={mixed} opacity={0.85} />
          <circle cx={mcx} cy={mcy} r={110} fill="url(#soft-cyan)" opacity={0.3 * mixFill} />
          <Label x={mcx} y={mcy + 108} size={26} color={C.ink} weight={600} opacity={mixFill}>
            satu keadaan campuran
          </Label>
        </g>

        {/* baris 4: yang keliru — berkedip */}
        <g opacity={wrong * l4}>
          <circle cx={620} cy={760} r={84} fill="rgba(10,16,36,0.85)" stroke={C.ink} strokeOpacity={0.5} strokeWidth={3} />
          <circle cx={620} cy={760} r={78} fill={C.cyan} opacity={0.85 * flick} />
          <circle cx={620} cy={760} r={78} fill={C.pink} opacity={0.85 * (1 - flick)} />
          <Label x={620} y={868} size={26} color={C.muted} weight={600}>
            berganti-ganti
          </Label>
          <g opacity={cross}>
            <line x1={540} y1={680} x2={700} y2={840} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
            <line x1={700} y1={680} x2={540} y2={840} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
          </g>
        </g>
        {/* tanda benar + tingkat energi lebih rendah */}
        <g opacity={right * l4}>
          <path d={`M${mcx - 34},${mcy - 4} L${mcx - 8},${mcy + 24} L${mcx + 40},${mcy - 30}`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g opacity={stab * l4}>
          {[0, 1, 2].map((k) => (
            <line key={k} x1={1490 + k * 6} y1={700 + k * 8} x2={1590 + k * 6} y2={700 + k * 8} stroke={[C.cyan, C.pink, C.violet][k]} strokeWidth={5} strokeLinecap="round" />
          ))}
          <Label x={1660} y={712} size={22} color={C.muted} anchor="start">
            tiap struktur
          </Label>
          <line x1={1490} y1={820} x2={1600} y2={820} stroke={mixed} strokeWidth={7} strokeLinecap="round" />
          <Label x={1660} y={820} size={22} color={C.mint} anchor="start" weight={600}>
            campuran
          </Label>
          <line x1={1545} y1={730} x2={1545} y2={800} stroke={C.mint} strokeWidth={4} />
          <path d={`M1533,788 L1545,806 L1557,788`} fill="none" stroke={C.mint} strokeWidth={4} strokeLinejoin="round" />
          <Label x={1660} y={766} size={22} color={C.mint} anchor="start">
            lebih stabil
          </Label>
        </g>
      </Stage>

      <Card x={960} y={600} opacity={card * l4} scale={0.9 + 0.1 * card} accent={C.gold} style={{padding: '16px 40px'}}>
        <div style={{fontSize: 56, fontWeight: 700, fontFamily: FONT.sans}}>
          resonansi <span style={{color: C.red}}>≠</span> berganti-ganti
        </div>
      </Card>
    </AbsoluteFill>
  );
};
