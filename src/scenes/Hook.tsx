import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE, EASE_IN, EASE_IN_OUT, cyc, mix, rand, ramp} from '../anim';
import {Card, Glow, Label, Stage, Sub} from '../components/primitives';
import {Cross, Stars} from '../components/grupA';
import {H2Pair, VbDefs, WriteText} from '../components/vbA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Pembuka: dua atom H mendekat → terkunci menjadi H₂ (≈ 436 kJ/mol dilepas) → bukan tarik-menarik
// muatan seperti NaCl → Lewis H–H "mengapa?" → 1927 mekanika kuantum → teori ikatan valensi.
const CY = 450;
const SEP0 = 860; // jarak awal antar-inti (px)
const SEP1 = 150; // jarak dalam molekul

export const Hook: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- atom & molekul ----------
  const enter = ramp(t, -0.4, 1.8);
  const approach = ramp(t, wordOf(1, 'mendekat') - 0.3, wordOf(1, 'terkunci') + 0.1, EASE_IN);
  const lockAt = wordOf(1, 'terkunci') + 0.1;
  const merge = ramp(t, lockAt - 0.15, lockAt + 0.9, EASE);
  const sep = mix(SEP0, SEP1, approach);
  const shift = ramp(t, cue(2) - 0.2, cue(2) + 1.1, EASE_IN_OUT) * (1 - ramp(t, cue(5) - 0.3, cue(5) + 1.1, EASE_IN_OUT));
  const cx = mix(960, 540, shift);
  const drift = 10 * Math.sin(t * 0.7) * (1 - merge * 0.6);
  const molOp = enter * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.6, EASE_IN_OUT)) + ramp(t, cue(5) - 0.2, cue(5) + 0.8);
  const molScale = mix(1, 0.85, shift);
  const yMol = CY + drift + mix(0, -40, ramp(t, cue(5) - 0.2, cue(5) + 0.8, EASE_IN_OUT));
  const x1 = cx - sep / 2 + 6 * Math.sin(t * 1.1) * (1 - approach);
  const x2 = cx + sep / 2 - 6 * Math.sin(t * 0.9 + 1) * (1 - approach);

  const lblOne = ramp(t, wordOf(0, 'satu') - 0.3, wordOf(0, 'satu') + 0.5) * (1 - ramp(t, wordOf(1, 'mendekat'), wordOf(1, 'mendekat') + 0.6, EASE_IN_OUT));
  const lblNet = ramp(t, wordOf(0, 'netral') - 0.3, wordOf(0, 'netral') + 0.5) * (1 - ramp(t, wordOf(1, 'mendekat'), wordOf(1, 'mendekat') + 0.6, EASE_IN_OUT));
  const since = t - lockAt;
  const flash = since > -0.1 ? Math.max(0, 1 - since / 1.6) * ramp(t, lockAt - 0.1, lockAt + 0.15) : 0;
  const energy = ramp(t, wordOf(1, 'empat') - 0.3, wordOf(1, 'empat') + 0.5, BACK) * (1 - ramp(t, cue(2) - 0.3, cue(2) + 0.3, EASE_IN_OUT));
  const h2lbl = ramp(t, lockAt + 0.3, lockAt + 1.0) * (1 - ramp(t, cue(3) - 0.3, cue(3) + 0.3, EASE_IN_OUT));

  // ---------- NaCl ----------
  const salt = ramp(t, wordOf(2, 'muatan') - 0.3, wordOf(2, 'muatan') + 0.6, BACK) * (1 - ramp(t, cue(3) - 0.3, cue(3) + 0.4, EASE_IN_OUT));
  const pull = ramp(t, wordOf(2, 'tarik') - 0.2, wordOf(2, 'tarik') + 0.6);
  const cross = ramp(t, wordOf(2, 'dapur') + 0.1, wordOf(2, 'dapur') + 0.8, EASE_IN_OUT);
  const notThis = ramp(t, wordOf(2, 'dapur') + 0.5, wordOf(2, 'dapur') + 1.0, BACK);
  const ask = ramp(t, wordOf(2, 'apa') - 0.2, wordOf(2, 'apa') + 0.5, BACK) * (1 - ramp(t, cue(3) - 0.3, cue(3) + 0.3, EASE_IN_OUT));
  const naclGap = mix(150, 112, pull * (0.5 + 0.5 * Math.sin(t * 2.6) ** 2));

  // ---------- Lewis H–H ----------
  const lewisIn = ramp(t, cue(3) + 0.1, cue(3) + 1.0);
  const lewisOut = 1 - ramp(t, cue(4) - 0.2, cue(4) + 0.8, EASE_IN_OUT);
  const lewisUp = ramp(t, cue(4) - 0.2, cue(4) + 0.9, EASE_IN_OUT);
  const wH1 = ramp(t, wordOf(3, 'menggambar') - 0.3, wordOf(3, 'menggambar') + 0.9);
  const wH2 = ramp(t, wordOf(3, 'menggambar') + 0.2, wordOf(3, 'menggambar') + 1.3);
  const wLine = ramp(t, wordOf(3, 'ikatan') - 0.1, wordOf(3, 'ikatan') + 0.6, EASE_IN_OUT);
  const wDots = ramp(t, wordOf(3, 'sepasang') - 0.2, wordOf(3, 'sepasang') + 0.5, BACK);
  const share = ramp(t, wordOf(3, 'bersama') - 0.3, wordOf(3, 'bersama') + 0.5);
  const why = ramp(t, wordOf(3, 'mengapa') - 0.2, wordOf(3, 'mengapa') + 0.6, BACK);
  const whyCard = ramp(t, wordOf(3, 'menurunkan') - 0.3, wordOf(3, 'menurunkan') + 0.5);

  // ---------- 1927 ----------
  const tl = ramp(t, wordOf(4, 'tahun') - 0.3, wordOf(4, 'seribu') + 0.6, EASE_IN_OUT) * (1 - ramp(t, cue(5) - 0.3, cue(5) + 0.5, EASE_IN_OUT));
  const y1927 = ramp(t, wordOf(4, 'tujuh') - 0.2, wordOf(4, 'tujuh') + 0.6, BACK);
  const qm = ramp(t, wordOf(4, 'mekanika') - 0.3, wordOf(4, 'kuantum') + 0.4);

  // ---------- penutup ----------
  const vbt = ramp(t, wordOf(5, 'teori') - 0.3, wordOf(5, 'teori') + 0.7, BACK);
  const hand = ramp(t, wordOf(5, 'jabat') - 0.3, wordOf(5, 'jabat') + 0.6);
  const lineW = ramp(t, wordOf(5, 'teori'), wordOf(5, 'valensi') + 0.5, EASE_IN_OUT);

  const TLX0 = 520;
  const TLX1 = 1400;
  const TLY = 640;
  const yrX = (y: number) => mix(TLX0, TLX1, (y - 1910) / 25);

  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Stars t={t} n={80} y1={860} opacity={0.8 * enter} />

        {/* ===== atom H & molekul H₂ ===== */}
        <Glow x={cx} y={yMol} r={420} color="cyan" opacity={0.18 * merge * molOp} />
        <H2Pair x1={x1} x2={x2} y={yMol} t={t} merge={merge} opacity={Math.min(1, molOp)} scale={molScale} spinP={enter} />
        <g opacity={lblOne}>
          {[x1, x2].map((x, k) => (
            <Label key={k} x={x} y={CY - 175} size={28} color={C.cyan} weight={600}>
              1 proton + 1 elektron
            </Label>
          ))}
        </g>
        <g opacity={lblNet}>
          {[x1, x2].map((x, k) => (
            <Label key={k} x={x} y={CY + 180} size={26} color={C.muted}>
              netral · muatan total 0
            </Label>
          ))}
        </g>
        {/* kilatan energi saat terkunci */}
        {flash > 0 ? (
          <g>
            <circle cx={cx} cy={yMol} r={260 * (1 - flash) + 60} fill="url(#vbA-flash)" opacity={flash} />
            {[0, 1, 2].map((k) => {
              const ph = Math.min(1, Math.max(0, (since - k * 0.22) / 1.4));
              return <circle key={k} cx={cx} cy={yMol} r={80 + 420 * ph} fill="none" stroke={C.gold} strokeWidth={4 * (1 - ph) + 0.5} opacity={cyc(ph) * 0.9} />;
            })}
          </g>
        ) : null}
        {/* butir energi yang dilepas, terbang keluar */}
        {since > 0 && since < 4.5
          ? Array.from({length: 16}, (_, i) => {
              const a = (i / 16) * Math.PI * 2 + rand(i) * 0.3;
              const ph = Math.min(1, (since - rand(i * 3.1) * 0.5) / 3.2);
              if (ph <= 0) return null;
              const r = 90 + 560 * ph;
              return <circle key={i} cx={cx + r * Math.cos(a)} cy={yMol + r * 0.62 * Math.sin(a)} r={5 + 3 * rand(i * 7)} fill={C.gold} opacity={cyc(ph) * 0.85} />;
            })
          : null}
        <g opacity={h2lbl}>
          <text x={cx} y={yMol + 150} textAnchor="middle" fontFamily={FONT.sans} fontWeight={700} fontSize={44} fill={C.ink}>
            H<tspan baselineShift="sub" fontSize={28}>2</tspan>
          </text>
        </g>
        {/* tanda tanya di atas H₂ */}
        <g opacity={ask} transform={`translate(${cx} ${CY - 210}) scale(${0.7 + 0.3 * ask})`}>
          <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={110} fill={C.gold}>
            ?
          </text>
        </g>
        <Label x={cx} y={CY + 205} size={30} color={C.gold} weight={600} opacity={ask}>
          apa yang mengikat?
        </Label>

        {/* ===== pembanding: NaCl ===== */}
        <g opacity={salt} transform={`translate(${(1 - salt) * 40} 0)`}>
          <rect x={1080} y={250} width={600} height={420} rx={28} fill="rgba(12,18,40,0.75)" stroke={C.faint} strokeWidth={2} />
          <Label x={1380} y={300} size={28} color={C.muted} weight={600}>
            garam dapur (NaCl)
          </Label>
          {(() => {
            const nx = 1380 - naclGap;
            const clx = 1380 + naclGap * 0.75;
            const yy = 460;
            return (
              <g>
                <circle cx={nx} cy={yy} r={70} fill="url(#soft-violet)" opacity={0.6} />
                <circle cx={nx} cy={yy} r={36} fill="#8f6bff" stroke="#cdbfff" strokeWidth={2} />
                <text x={nx} y={yy} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={28} fill="#fff">
                  Na<tspan baselineShift="super" fontSize={18}>+</tspan>
                </text>
                <circle cx={clx} cy={yy} r={100} fill="url(#soft-mint)" opacity={0.45} />
                <circle cx={clx} cy={yy} r={56} fill="#3fbf6a" stroke="#a6f5c0" strokeWidth={2} />
                <text x={clx} y={yy} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={32} fill="#fff">
                  Cl<tspan baselineShift="super" fontSize={20}>−</tspan>
                </text>
                <g opacity={pull}>
                  <path d={`M${nx + 46},${yy} L${nx + 86},${yy}`} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
                  <path d={`M${nx + 92},${yy} l-14,-10 l0,20 z`} fill={C.gold} />
                  <path d={`M${clx - 66},${yy} L${clx - 102},${yy}`} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
                  <path d={`M${clx - 108},${yy} l14,-10 l0,20 z`} fill={C.gold} />
                </g>
              </g>
            );
          })()}
          <Label x={1380} y={600} size={26} color={C.gold} opacity={pull}>
            tarik-menarik muatan + dan −
          </Label>
          <Cross x={1380} y={460} r={150} p={cross} width={14} />
          <g opacity={notThis} transform={`translate(1380 ${235}) rotate(-6) scale(${0.8 + 0.2 * notThis})`}>
            <rect x={-130} y={-34} width={260} height={68} rx={14} fill="rgba(40,8,18,0.92)" stroke={C.red} strokeWidth={3} />
            <text x={0} y={2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={34} fill={C.red} letterSpacing={2}>
              BUKAN INI
            </text>
          </g>
        </g>

        {/* ===== Lewis H–H ===== */}
        <g opacity={lewisIn * lewisOut} transform={`translate(0 ${-150 * lewisUp}) `}>
          <WriteText x={780} y={430} p={wH1} size={130} weight={600}>
            H
          </WriteText>
          <WriteText x={1140} y={430} p={wH2} size={130} weight={600}>
            H
          </WriteText>
          <line x1={850} y1={432} x2={850 + 220 * wLine} y2={432} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
          {[-1, 1].map((k) => {
            const jig = 3 * Math.sin(t * 3.1 + k * 2);
            return (
              <g key={k} opacity={wDots} transform={`translate(${960 + k * 26} ${386 + jig}) scale(${wDots})`}>
                <circle r={26} fill="url(#soft-cyan)" opacity={0.6 + 0.4 * share} />
                <circle r={11} fill={C.cyan} />
              </g>
            );
          })}
          <Label x={960} y={555} size={30} color={C.cyan} opacity={share * (1 - lewisUp)}>
            sepasang elektron dipakai bersama
          </Label>
          <g opacity={why} transform={`translate(1290 ${330}) rotate(${8 * Math.sin(t * 1.4)}) scale(${0.6 + 0.4 * why})`}>
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={150} fill={C.gold}>
              ?
            </text>
          </g>
        </g>

        {/* ===== garis waktu 1916 → 1927 ===== */}
        <g opacity={tl}>
          <line x1={TLX0} y1={TLY} x2={mix(TLX0, TLX1, tl)} y2={TLY} stroke={C.faint} strokeWidth={4} strokeLinecap="round" />
          {[1910, 1915, 1920, 1925, 1930, 1935].map((y) => (
            <g key={y} opacity={ramp(tl, (y - 1910) / 25 - 0.05, (y - 1910) / 25 + 0.05)}>
              <line x1={yrX(y)} y1={TLY - 10} x2={yrX(y)} y2={TLY + 10} stroke={C.faint} strokeWidth={3} />
              <Label x={yrX(y)} y={TLY + 36} size={22} color={C.muted} font="mono">
                {String(y)}
              </Label>
            </g>
          ))}
          <circle cx={yrX(1916)} cy={TLY} r={12} fill={C.ink} />
          <Label x={yrX(1916)} y={TLY - 46} size={26} color={C.muted}>
            1916 · Lewis: titik &amp; garis
          </Label>
          <g opacity={y1927}>
            <circle cx={yrX(1927)} cy={TLY} r={36 * y1927 + 6 * Math.sin(t * 3)} fill="url(#soft-gold)" />
            <circle cx={yrX(1927)} cy={TLY} r={14} fill={C.gold} />
            <text x={yrX(1927)} y={TLY - 110} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={800} fontSize={110} fill={C.gold} opacity={y1927}>
              1927
            </text>
          </g>
          <g opacity={qm}>
            {/* gelombang ψ yang berjalan */}
            <path
              d={Array.from({length: 121}, (_, i) => {
                const x = yrX(1927) - 240 + i * 4;
                const env = Math.exp(-(((i - 60) / 40) ** 2));
                const y = TLY + 120 + 34 * env * Math.sin(i * 0.32 - t * 5);
                return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke={C.violet}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Label x={yrX(1927) + 290} y={TLY + 120} size={34} color={C.violet} anchor="start" weight={600}>
              mekanika kuantum
            </Label>
            <text x={yrX(1927) - 290} y={TLY + 120} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={56} fill={C.violet}>
              ψ
            </text>
          </g>
        </g>

        {/* ===== penutup: teori ikatan valensi ===== */}
        <g opacity={vbt}>
          <Glow x={960} y={yMol} r={300} color="gold" opacity={0.25 * hand * (0.8 + 0.2 * Math.sin(t * 2.4))} />
          <rect x={960 - 380 * lineW} y={738} width={760 * lineW} height={2} fill={C.gold} opacity={0.7} />
        </g>
      </Stage>

      {/* kartu energi yang dilepas */}
      <Card x={960} y={210} opacity={energy} scale={0.9 + 0.1 * energy} accent={C.gold}>
        <div style={{fontFamily: FONT.serif, fontSize: 56, color: C.gold, textAlign: 'center'}}>
          ≈ 436 <span style={{fontSize: 40}}>kJ/mol</span>
        </div>
        <div style={{fontSize: 24, color: C.muted, textAlign: 'center', marginTop: 4}}>energi dilepas saat H + H → H<Sub>2</Sub></div>
      </Card>

      {/* kartu pertanyaan */}
      <Card x={960} y={640} opacity={whyCard * lewisOut} scale={0.94 + 0.06 * whyCard} accent={C.gold}>
        <div style={{fontSize: 40, fontWeight: 600, textAlign: 'center'}}>
          mengapa <span style={{color: C.cyan}}>berbagi elektron</span> <span style={{color: C.mint}}>menurunkan energi</span>?
        </div>
      </Card>

      {/* judul teori */}
      <div
        style={{
          position: 'absolute',
          top: 660,
          width: '100%',
          textAlign: 'center',
          opacity: vbt,
          translate: `0px ${(1 - vbt) * 24}px`,
        }}
      >
        <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 76, color: C.gold, letterSpacing: 3, textShadow: '0 0 40px rgba(255,194,74,0.4)'}}>TEORI IKATAN VALENSI</div>
        <div style={{fontFamily: FONT.sans, fontSize: 34, color: C.ink, marginTop: 30, opacity: hand}}>
          jabat tangan <span style={{color: C.cyan}}>dua</span> <span style={{color: C.pink}}>elektron</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
