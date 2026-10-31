import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Card, Glow, Label, Stage, Sup} from '../components/primitives';
import {VbDefs, WriteText} from '../components/vbA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 1: Lewis 1916 — ikatan = sepasang elektron bersama; titik & garis; dua pertanyaan; elektron saling tolak.
const SY = 470;
const COL = {H: C.ink, O: '#ff7085', C: '#b9c2dc'};
const DOT = 7;

/** Sepasang titik elektron di (x, y) yang bersilang-pudar menjadi garis ikatan. */
const Pair: React.FC<{x: number; y: number; vertical?: boolean; dot: number; line?: number; t: number; len?: number; glow?: number; seed?: number}> = ({
  x,
  y,
  vertical,
  dot,
  line = 0,
  t,
  len = 70,
  glow = 0,
  seed = 0,
}) => {
  const jig = 1.6 * Math.sin(t * 3.2 + seed);
  const d = 11;
  const p1 = vertical ? [x + jig, y - d] : [x - d, y + jig];
  const p2 = vertical ? [x - jig, y + d] : [x + d, y - jig];
  return (
    <g>
      {glow > 0 ? <circle cx={x} cy={y} r={40} fill="url(#soft-cyan)" opacity={glow * (0.7 + 0.3 * Math.sin(t * 2.6))} /> : null}
      <g opacity={dot * (1 - line)}>
        <circle cx={p1[0]} cy={p1[1]} r={DOT} fill={C.cyan} />
        <circle cx={p2[0]} cy={p2[1]} r={DOT} fill={C.cyan} />
      </g>
      {line > 0 ? (
        vertical ? (
          <line x1={x} y1={y - (len / 2) * line} x2={x} y2={y + (len / 2) * line} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        ) : (
          <line x1={x - (len / 2) * line} y1={y} x2={x + (len / 2) * line} y2={y} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        )
      ) : null}
    </g>
  );
};

export const Lewis: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- A: struktur Lewis ----------
  const grpA = slot(t, -0.3, cue(3) + 0.2, 0.6, 0.6);
  const year = ramp(t, wordOf(0, 'seribu') - 0.2, wordOf(0, 'enam') + 0.4, BACK);
  const name = ramp(t, wordOf(0, 'Gilbert') - 0.2, wordOf(0, 'Gilbert') + 0.5);
  const wHH = ramp(t, wordOf(0, 'kovalen') - 0.4, wordOf(0, 'kovalen') + 0.9);
  const dHH = ramp(t, wordOf(0, 'sepasang') - 0.2, wordOf(0, 'sepasang') + 0.5, BACK);
  const own = ramp(t, wordOf(0, 'dimiliki') - 0.2, wordOf(0, 'dimiliki') + 0.5);
  const wH2O = ramp(t, wordOf(1, 'Gambar') - 0.3, wordOf(1, 'titik') + 0.7);
  const wCH4 = ramp(t, wordOf(1, 'titik') - 0.1, wordOf(1, 'titik') + 1.1);
  const dOthers = ramp(t, wordOf(1, 'titik') + 0.1, wordOf(1, 'titik') + 0.8);
  const lines = ramp(t, wordOf(1, 'garisnya') - 0.1, wordOf(1, 'garisnya') + 0.8, EASE_IN_OUT);
  const up = ramp(t, cue(2) - 0.2, cue(2) + 0.9, EASE_IN_OUT);
  const sc = mix(1, 0.72, up);
  const sy = mix(SY, 330, up);
  const q1 = ramp(t, wordOf(2, 'berpasangan') - 0.4, wordOf(2, 'berpasangan') + 0.4, BACK);
  const q2 = ramp(t, wordOf(2, 'stabil') - 0.6, wordOf(2, 'stabil') + 0.3, BACK);
  const qLbl = ramp(t, wordOf(2, 'dua') - 0.3, wordOf(2, 'dua') + 0.5);

  // ---------- B: elektron saling tolak ----------
  const grpB = ramp(t, cue(3) + 0.1, cue(3) + 0.8);
  const push = ramp(t, wordOf(3, 'tolak') - 0.2, wordOf(3, 'tolak') + 0.5);
  const squeeze = ramp(t, wordOf(3, 'Menaruh') - 0.2, wordOf(3, 'sama') + 0.4, EASE_IN_OUT);
  const rise = ramp(t, wordOf(3, 'menaikkan') - 0.3, wordOf(3, 'menaikkan') + 0.8, EASE_IN_OUT);
  const fall = ramp(t, wordOf(3, 'menurunkannya') - 0.3, wordOf(3, 'menurunkannya') + 0.8, EASE_IN_OUT);
  const ask = ramp(t, wordOf(3, 'menurunkannya') + 0.2, wordOf(3, 'menurunkannya') + 0.8, BACK);

  const tx = (cx: number) => `translate(${cx} ${sy}) scale(${sc}) translate(${-cx} ${-SY})`;

  // dua elektron: dari agak berjauhan → dipaksa ke satu tempat
  const EC = {x: 700, y: 500};
  const sepE = mix(150, 46, squeeze) + 8 * Math.sin(t * 5.1) * squeeze;
  const wob = (k: number) => 6 * Math.sin(t * (3.3 + k) + k * 2);
  const e1 = {x: EC.x - sepE + wob(0), y: EC.y + wob(1) * 0.7};
  const e2 = {x: EC.x + sepE + wob(2), y: EC.y + wob(3) * 0.7};
  const fLen = mix(40, 110, squeeze) * push;

  // tingkat energi
  const GX = 1320;
  const G0 = 560;
  const levelUp = G0 - 190 * rise;
  const levelDn = G0 + 170 * fall;

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        {/* ================= A ================= */}
        <g opacity={grpA}>
          <g opacity={year * (1 - up)} transform={`translate(960 ${240}) scale(${0.85 + 0.15 * year})`}>
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={84} fill={C.gold}>
              1916
            </text>
            <text x={0} y={62} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={30} fill={C.muted} opacity={name}>
              Gilbert N. Lewis
            </text>
          </g>

          {/* H:H */}
          <g transform={tx(430)}>
            <WriteText x={350} y={SY} p={wHH} size={84} weight={600} color={COL.H}>
              H
            </WriteText>
            <WriteText x={510} y={SY} p={wHH * 1.1 - 0.1} size={84} weight={600} color={COL.H}>
              H
            </WriteText>
            <Pair x={430} y={SY} dot={dHH} line={lines} t={t} len={70} glow={dHH * (1 - lines) * 0.9} />
            <Label x={430} y={SY + 110} size={28} color={C.cyan} opacity={own * (1 - up)}>
              sepasang elektron milik bersama
            </Label>
          </g>

          {/* H–O–H dengan dua pasangan bebas */}
          <g transform={tx(960)}>
            <WriteText x={800} y={SY} p={wH2O} size={84} weight={600} color={COL.H}>
              H
            </WriteText>
            <WriteText x={960} y={SY} p={wH2O * 1.2 - 0.1} size={84} weight={600} color={COL.O}>
              O
            </WriteText>
            <WriteText x={1120} y={SY} p={wH2O * 1.4 - 0.4} size={84} weight={600} color={COL.H}>
              H
            </WriteText>
            <Pair x={880} y={SY} dot={dOthers} line={lines} t={t} len={60} seed={1} />
            <Pair x={1040} y={SY} dot={dOthers} line={lines} t={t} len={60} seed={2} />
            <Pair x={960} y={SY - 66} dot={dOthers} t={t} seed={3} />
            <Pair x={960} y={SY + 66} dot={dOthers} t={t} seed={4} />
          </g>

          {/* CH₄ */}
          <g transform={tx(1490)}>
            <WriteText x={1490} y={SY} p={wCH4} size={84} weight={600} color={COL.C}>
              C
            </WriteText>
            {[
              [-150, 0],
              [150, 0],
              [0, -150],
              [0, 150],
            ].map(([dx, dy], k) => (
              <g key={k}>
                <WriteText x={1490 + dx} y={SY + dy} p={wCH4 * 1.3 - 0.1 - k * 0.08} size={70} weight={600} color={COL.H}>
                  H
                </WriteText>
                <Pair x={1490 + dx * 0.5} y={SY + dy * 0.5} vertical={dx === 0} dot={dOthers} line={lines} t={t} len={56} seed={5 + k} />
              </g>
            ))}
          </g>

          <Label x={960} y={480} size={28} color={C.gold} opacity={qLbl} spacing={2}>
            DUA PERTANYAAN YANG TAK TERJAWAB
          </Label>
        </g>

        {/* ================= B ================= */}
        <g opacity={grpB}>
          <circle cx={EC.x} cy={EC.y} r={190} fill="none" stroke={C.faint} strokeWidth={2.5} strokeDasharray="8 10" strokeDashoffset={-t * 12} />
          <Label x={EC.x} y={EC.y - 225} size={28} color={C.muted}>
            satu tempat yang sama
          </Label>
          <Glow x={EC.x} y={EC.y} r={190} color="red" opacity={0.25 * squeeze * push} />
          {[e1, e2].map((e, k) => (
            <g key={k}>
              <circle cx={e.x} cy={e.y} r={34} fill="url(#soft-cyan)" />
              <circle cx={e.x} cy={e.y} r={18} fill={C.cyan} />
              <text x={e.x} y={e.y + 1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={18} fill="#04212e">
                e<tspan baselineShift="super" fontSize={12}>−</tspan>
              </text>
            </g>
          ))}
          {/* panah gaya tolak (merah), menjauhi pasangan */}
          {fLen > 4 ? (
            <g>
              <line x1={e1.x - 26} y1={e1.y} x2={e1.x - 26 - fLen} y2={e1.y} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${e1.x - 34 - fLen},${e1.y} l16,-11 l0,22 z`} fill={C.red} />
              <line x1={e2.x + 26} y1={e2.y} x2={e2.x + 26 + fLen} y2={e2.y} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${e2.x + 34 + fLen},${e2.y} l-16,-11 l0,22 z`} fill={C.red} />
            </g>
          ) : null}
          <Label x={EC.x} y={EC.y + 120} size={30} color={C.red} weight={600} opacity={push}>
            saling tolak
          </Label>

          {/* tingkat energi: dugaan vs kenyataan */}
          <line x1={GX - 120} y1={790} x2={GX - 120} y2={300} stroke={C.muted} strokeWidth={3} />
          <path d={`M${GX - 120},290 l-10,18 l20,0 z`} fill={C.muted} />
          <Label x={GX - 150} y={300} size={24} color={C.muted} anchor="end">
            energi
          </Label>
          <line x1={GX - 80} y1={G0} x2={GX + 220} y2={G0} stroke={C.ink} strokeWidth={3} strokeDasharray="10 8" opacity={0.8} />
          <Label x={GX + 240} y={G0} size={24} color={C.muted} anchor="start">
            2 atom terpisah
          </Label>
          <g opacity={rise}>
            <line x1={GX} y1={levelUp} x2={GX + 140} y2={levelUp} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
            <line x1={GX + 45} y1={G0 - 6} x2={GX + 45} y2={levelUp + 22} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
            <path d={`M${GX + 45},${levelUp + 8} l-10,18 l20,0 z`} fill={C.red} />
            <Label x={GX + 160} y={levelUp} size={26} color={C.red} anchor="start">
              dugaan: naik
            </Label>
          </g>
          <g opacity={fall}>
            <line x1={GX} y1={levelDn} x2={GX + 140} y2={levelDn} stroke={C.mint} strokeWidth={6} strokeLinecap="round" />
            <line x1={GX + 95} y1={G0 + 6} x2={GX + 95} y2={levelDn - 22} stroke={C.mint} strokeWidth={4} strokeLinecap="round" />
            <path d={`M${GX + 95},${levelDn - 8} l-10,-18 l20,0 z`} fill={C.mint} />
            <Label x={GX + 160} y={levelDn} size={26} color={C.mint} anchor="start">
              kenyataan: turun
            </Label>
          </g>
          <g opacity={ask} transform={`translate(${GX + 70} ${250}) rotate(${6 * Math.sin(t * 1.5)}) scale(${0.7 + 0.3 * ask})`}>
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={100} fill={C.gold}>
              ?
            </text>
          </g>
        </g>
      </Stage>

      {/* dua pertanyaan */}
      <Card x={600} y={640} opacity={q1 * grpA} scale={0.9 + 0.1 * q1} accent={C.cyan}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, fontSize: 40, fontWeight: 600}}>
          <span style={{fontFamily: FONT.mono, color: C.cyan, fontSize: 48}}>1</span>
          <span>
            Mengapa harus <span style={{color: C.cyan}}>berpasangan</span>?
          </span>
        </div>
      </Card>
      <Card x={1320} y={640} opacity={q2 * grpA} scale={0.9 + 0.1 * q2} accent={C.mint}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, fontSize: 40, fontWeight: 600}}>
          <span style={{fontFamily: FONT.mono, color: C.mint, fontSize: 48}}>2</span>
          <span>
            Mengapa berbagi <span style={{color: C.mint}}>lebih stabil</span>?
          </span>
        </div>
      </Card>
      <div style={{position: 'absolute', left: EC.x, top: EC.y + 170, transform: 'translate(-50%, 0)', opacity: grpB * push, fontFamily: FONT.sans, fontSize: 26, color: C.muted, whiteSpace: 'nowrap'}}>
        muatan sejenis: e<Sup>−</Sup> dan e<Sup>−</Sup>
      </div>
    </AbsoluteFill>
  );
};
