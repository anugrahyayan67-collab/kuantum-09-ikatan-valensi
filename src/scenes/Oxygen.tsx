import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp, slot} from '../anim';
import {Atom, Bond, Card, Formula, Glow, Label, Stage, Sup} from '../components/primitives';
import {Stamp} from '../components/grupD';
import {Box, HORSESHOE, Horseshoe, RichLabel, Spin} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 17: O₂ menurut Lewis/VBT semua elektron berpasangan → harusnya tak tertarik magnet; eksperimen: O₂ cair menggantung di kutub → paramagnetik, triplet ³Σg⁻ → butuh orbital molekul.
const LX = 440;
const MCX = 1400;
const MTOP = 470;
const LOX = '#bfe4ff';

/** ³Σg⁻ (HTML): − di atas, g di bawah. */
const Triplet: React.FC = () => (
  <span style={{whiteSpace: 'nowrap'}}>
    <Sup color={C.violet}>3</Sup>
    <span style={{color: C.gold}}>Σ</span>
    <span style={{display: 'inline-block', verticalAlign: '-0.34em', fontSize: '0.6em', lineHeight: 1.0, textAlign: 'left'}}>
      <span style={{display: 'block', color: C.amber}}>−</span>
      <span style={{display: 'block', color: C.mint, fontStyle: 'italic'}}>g</span>
    </span>
  </span>
);

export const Oxygen: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const mol = ramp(t, wordOf(0, 'oksigen') - 0.4, wordOf(0, 'oksigen') + 0.8, BACK);
  const lewis = ramp(t, wordOf(1, 'Lewis') - 0.3, wordOf(1, 'Lewis') + 0.9);
  const sig = ramp(t, wordOf(1, 'sigma') - 0.2, wordOf(1, 'sigma') + 0.5);
  const pi = ramp(t, wordOf(1, 'pi') - 0.2, wordOf(1, 'pi') + 0.5);
  const paired = ramp(t, wordOf(1, 'berpasangan') - 0.6, wordOf(1, 'berpasangan') + 0.6);
  const magnet = ramp(t, wordOf(2, 'magnet') - 0.8, wordOf(2, 'magnet') + 0.4);
  const tPour = wordOf(3, 'tuang');
  const pourIn = ramp(t, tPour - 0.6, tPour + 0.4);
  const tilt = ramp(t, tPour - 0.2, tPour + 0.8, EASE_IN_OUT) * (1 - ramp(t, cue(4) - 0.8, cue(4) + 0.2, EASE_IN_OUT));
  const pouring = ramp(t, tPour + 0.5, tPour + 0.9) * (1 - ramp(t, cue(4) - 1.0, cue(4) - 0.4));
  const fill = ramp(t, tPour + 0.9, wordOf(3, 'menggantung') + 0.6, EASE_IN_OUT);
  const hang = ramp(t, wordOf(3, 'menggantung') - 0.2, wordOf(3, 'menggantung') + 0.6);
  const flaskOut = ramp(t, cue(4) - 0.4, cue(4) + 0.4, EASE_IN_OUT);
  const para = ramp(t, wordOf(4, 'paramagnetik') - 0.2, wordOf(4, 'paramagnetik') + 0.5);
  const unp = ramp(t, wordOf(4, 'tak') - 0.4, wordOf(4, 'tak') + 0.6, BACK);
  const toMO = ramp(t, cue(5) - 0.3, cue(5) + 0.8, EASE_IN_OUT);
  const mo = ramp(t, wordOf(5, 'orbital') - 1.4, wordOf(5, 'orbital') + 0.4);
  const fail = ramp(t, wordOf(5, 'tidak') - 0.2, wordOf(5, 'tidak') + 0.5);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const sPred = slot(t, wordOf(2, 'seharusnya') - 0.3, cue(4));
  const sTrip = slot(t, wordOf(4, 'triplet') - 0.4, cue(5));
  const leftOp = 1 - toMO;
  const rowOld = 1 - 0.85 * unp;

  const g = HORSESHOE(MCX, MTOP);
  const bob = 4 * Math.sin(t * 1.3);
  // gelas: putar terhadap pusat (BX, BY); bibir di kiri atas
  const BX = 1496;
  const BY = 300;
  const a = (-50 * tilt * Math.PI) / 180;
  const lip = [BX + -60 * Math.cos(a) - -75 * Math.sin(a), BY + -60 * Math.sin(a) + -75 * Math.cos(a)];
  const levelTop = g.gapBot - 74 * fill;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={LX} y={360} r={300} color="red" opacity={0.08 * mol} />
        {/* ---------- kiri: O₂ Lewis + kotak spin ---------- */}
        <g opacity={leftOp}>
          <RichLabel x={LX} y={215} parts={[['O'], ['2', 'sub']]} size={52} color={C.ink} opacity={mol} font="serif" />
          <g transform={`translate(0 ${bob})`} opacity={mol}>
            <g opacity={lewis}>
              <Bond x1={LX - 80} y1={340} x2={LX + 80} y2={340} order={2} width={14} />
            </g>
            <Atom x={LX - 80} y={340} el="O" r={52} />
            <Atom x={LX + 80} y={340} el="O" r={52} />
            {/* pasangan elektron bebas */}
            {[-1, 1].map((s) =>
              [-55, 55].map((deg) => {
                const ang = ((s < 0 ? 180 : 0) + deg * s) * (Math.PI / 180);
                const ox = LX + s * 80 + Math.cos(ang) * 76;
                const oy = 340 - Math.sin(ang) * 76;
                const px = -Math.sin(ang) * 9;
                const py = -Math.cos(ang) * 9;
                return (
                  <g key={`${s}${deg}`} opacity={lewis}>
                    <circle cx={ox + px} cy={oy + py} r={7} fill={C.cyan} />
                    <circle cx={ox - px} cy={oy - py} r={7} fill={C.cyan} />
                  </g>
                );
              }),
            )}
            <Label x={LX} y={286} size={32} color={C.cyan} opacity={sig} font="serif" italic>
              σ
            </Label>
            <Label x={LX} y={394} size={32} color={C.amber} opacity={pi} font="serif" italic>
              π
            </Label>
          </g>
          {/* 6 pasangan ↑↓ */}
          <g opacity={paired * rowOld}>
            {Array.from({length: 6}, (_, k) => {
              const x = LX - 180 + k * 72;
              const j = 3 * Math.sin(t * 3 + k);
              return (
                <g key={k}>
                  <Box x={x} y={530} s={60} color={C.cyan} />
                  <Spin x={x - 11} y={530 + j} up len={40} width={4} />
                  <Spin x={x + 11} y={530 - j} up={false} len={40} width={4} />
                </g>
              );
            })}
            <Label x={LX} y={598} size={28} color={C.cyan}>
              semua elektron berpasangan
            </Label>
          </g>
          {/* dua elektron tak berpasangan */}
          <g opacity={unp}>
            {[-1, 1].map((s) => {
              const x = LX + s * 52;
              return (
                <g key={s}>
                  <Box x={x} y={530} s={72} color={C.amber} lit={0.6 + 0.4 * Math.sin(t * 3 + s)} />
                  <Spin x={x} y={530 + 3 * Math.sin(t * 2.5)} up len={46} width={5} />
                </g>
              );
            })}
            <Label x={LX - 140} y={530} size={30} color={C.amber} font="serif" italic anchor="end">
              π*
            </Label>
            <Label x={LX} y={604} size={28} color={C.amber}>
              2 elektron tak berpasangan ↑↑
            </Label>
          </g>
        </g>

        {/* ---------- kiri (akhir): cuplikan diagram orbital molekul ---------- */}
        <g opacity={mo}>
          <Label x={LX} y={215} size={30} color={C.violet} weight={600}>
            O₂ menurut orbital molekul (cuplikan)
          </Label>
          {[
            {y: 280, n: 1, lab: 'σ*', e: [] as number[], col: C.muted},
            {y: 380, n: 2, lab: 'π*', e: [1, 1], col: C.amber},
            {y: 490, n: 2, lab: 'π', e: [2, 2], col: C.cyan},
            {y: 590, n: 1, lab: 'σ', e: [2], col: C.cyan},
          ].map((L, i) => (
            <g key={i}>
              <Label x={LX - 150} y={L.y} size={34} color={L.col} font="serif" italic anchor="end">
                {L.lab}
              </Label>
              {Array.from({length: L.n}, (_, k) => {
                const x = L.n === 1 ? LX : LX - 44 + k * 88;
                const e = L.e[k] ?? 0;
                const j = 2.5 * Math.sin(t * 3 + i + k);
                const hot = L.lab === 'π*';
                return (
                  <g key={k}>
                    <Box x={x} y={L.y} s={66} color={L.col} lit={hot ? 0.6 + 0.4 * Math.sin(t * 3 + k) : 0} />
                    {e === 1 ? <Spin x={x} y={L.y + j} up len={44} width={5} /> : null}
                    {e === 2 ? (
                      <>
                        <Spin x={x - 12} y={L.y + j} up len={40} width={4} />
                        <Spin x={x + 12} y={L.y - j} up={false} len={40} width={4} />
                      </>
                    ) : null}
                  </g>
                );
              })}
            </g>
          ))}
          <Label x={LX + 140} y={380} size={26} color={C.amber} anchor="start">
            ↑↑ sejajar
          </Label>
        </g>

        {/* ---------- kanan: magnet & oksigen cair ---------- */}
        <g opacity={magnet}>
          <Glow x={MCX} y={g.gapTop + 37} r={160} color="cyan" opacity={0.35 * hang + 0.15 * para} />
          <Horseshoe cx={MCX} top={MTOP} t={t} field={magnet} />
          {/* prediksi: molekul O₂ kecil yang tidak tertarik */}
          <g opacity={(1 - pourIn) * ramp(t, wordOf(2, 'tidak') - 0.4, wordOf(2, 'tidak') + 0.4)}>
            {[-1, 1].map((s) => (
              <Atom key={s} x={MCX + s * 22 + 30 * Math.sin(t * 0.8)} y={330 + 10 * Math.sin(t * 1.3)} el="O" r={22} label={null} />
            ))}
            <path d={`M${MCX + 30 * Math.sin(t * 0.8)},${370} L${MCX},${450}`} stroke={C.muted} strokeWidth={3} strokeDasharray="6 8" />
            <Label x={MCX + 90} y={410} size={44} color={C.red} weight={700}>
              ✕
            </Label>
          </g>
          {/* oksigen cair di celah */}
          {fill > 0.01 ? (
            <g>
              <rect x={g.gapL} y={levelTop} width={g.gapR - g.gapL} height={g.gapBot - levelTop} fill={LOX} opacity={0.85} />
              <ellipse cx={MCX} cy={g.gapBot} rx={(g.gapR - g.gapL) / 2} ry={10 * fill + 2 * Math.sin(t * 3)} fill={LOX} opacity={0.85} />
              <ellipse cx={MCX} cy={levelTop} rx={(g.gapR - g.gapL) / 2} ry={4} fill="#ffffff" opacity={0.5} />
              {Array.from({length: 4}, (_, k) => {
                const ph = (((t * 0.6 + rand(k) ) % 1) + 1) % 1;
                return <circle key={k} cx={g.gapL + 10 + rand(k * 3.3) * 32} cy={g.gapBot - ph * (g.gapBot - levelTop)} r={2.5} fill="#fff" opacity={0.6 * cyc(ph)} />;
              })}
            </g>
          ) : null}
        </g>
        {/* gelas dan aliran */}
        <g opacity={pourIn * (1 - flaskOut)}>
          {pouring > 0.01
            ? Array.from({length: 14}, (_, k) => {
                const ph = (((t * 1.6 + k / 14) % 1) + 1) % 1;
                const y = mix(lip[1], levelTop - 4, ph * ph);
                return <circle key={k} cx={lip[0] + 3 * Math.sin(k * 2.1)} cy={y} r={5 + 2 * rand(k)} fill={LOX} opacity={pouring * 0.9} />;
              })
            : null}
          <g transform={`translate(${BX} ${BY}) rotate(${-50 * tilt})`}>
            <path d="M-50,-20 L-50,70 Q-50,80 -40,80 L40,80 Q50,80 50,70 L50,-20 Z" fill={LOX} opacity={0.55 * (1 - 0.6 * fill)} />
            <path d="M-60,-75 L-50,-65 L-50,70 Q-50,80 -40,80 L40,80 Q50,80 50,70 L50,-70" fill="rgba(200,215,255,0.06)" stroke="#c8d6ff" strokeWidth={3} strokeOpacity={0.7} />
            {/* uap dingin */}
            {Array.from({length: 5}, (_, k) => {
              const ph = (((t * 0.4 + k / 5) % 1) + 1) % 1;
              return <circle key={k} cx={-20 + k * 12 + 8 * Math.sin(t + k)} cy={-70 - ph * 60} r={8 + ph * 10} fill="#e8f4ff" opacity={0.18 * cyc(ph)} />;
            })}
          </g>
          <Label x={1650} y={200} size={26} color={LOX} anchor="middle">
            oksigen cair
          </Label>
        </g>
        <Label x={1170} y={g.gapTop + 37} size={30} color={LOX} anchor="end" opacity={hang * (1 - toMO)} weight={600}>
          menggantung di kutub
        </Label>
        <Label x={1170} y={g.gapTop + 37} size={30} color={C.violet} anchor="end" opacity={toMO} weight={600}>
          tertarik magnet
        </Label>
      </Stage>
      <Card x={LX} y={730} opacity={sPred} accent={C.red} style={{padding: '18px 30px'}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 3, color: C.muted, textAlign: 'center'}}>PREDIKSI VBT</div>
        <div style={{fontSize: 36, color: C.ink, textAlign: 'center', marginTop: 4}}>tidak tertarik magnet</div>
      </Card>
      <Formula x={LX} y={730} p={sTrip} size={80} accent={C.amber} caption="keadaan dasar triplet">
        <Triplet />
      </Formula>
      <Stamp x={MCX} y={260} p={para} text="PARAMAGNETIK" color={C.violet} size={44} rot={-6} />
      <Card x={LX} y={730} opacity={fail} accent={C.violet} style={{padding: '18px 30px'}}>
        <div style={{fontSize: 34, color: C.ink, textAlign: 'center'}}>
          ikatan valensi gagal <span style={{color: C.violet}}>→ orbital molekul</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
