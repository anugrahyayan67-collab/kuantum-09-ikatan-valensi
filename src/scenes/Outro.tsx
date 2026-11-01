import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, rand, ramp} from '../anim';
import {Atom, Glow, Stage} from '../components/primitives';
import {HexIcon, POrb} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const REFS = [
  'RPS Kimia Kuantum S1 Kimia UNESA — pertemuan 9: teori ikatan valensi (VBT)',
  'I. N. Levine, Quantum Chemistry, ed. 7 — bab 13 (H₂, Heitler–London, resonansi ionik)',
  'P. Atkins & J. de Paula, Physical Chemistry — teori ikatan valensi & hibridisasi',
  'W. Heitler & F. London, Z. Phys. 44, 455 (1927) — molekul hidrogen',
  'G. N. Lewis, J. Am. Chem. Soc. 38, 762 (1916) — pasangan elektron',
  'L. Pauling, J. Am. Chem. Soc. 53, 1367 (1931) — hibridisasi',
  'NIST CCCBDB & CRC Handbook — panjang ikatan (H₂ 74 pm; C–C 154, C=C 134, C≡C 120, benzena 139 pm)',
  'Energi ikatan rata-rata ≈ 348 / 614 / 839 kJ/mol (C–C, C=C, C≡C); H₂ 436 kJ/mol',
  'Sudut ikatan: CH₄ 109,5°, NH₃ ≈ 107°, H₂O 104,5° (data struktur gas)',
  'The Nobel Prize in Physics 2010 (A. Geim, K. Novoselov) — grafena',
  'The Nobel Prize in Chemistry 2000 (A. Heeger, A. MacDiarmid, H. Shirakawa) — polimer penghantar',
  'Oksigen paramagnetik: keadaan dasar triplet ³Σg⁻ (Atkins; NIST)',
];

export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0, 1.6);
  const waves = ramp(t, 0, 4, EASE_IN_OUT);
  const refs = ramp(t, 2.4, 3.4);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={300} r={500} color="violet" opacity={0.15} />
        {/* hiasan: dua atom H berjabat tangan + molekul/orbital melayang */}
        <g opacity={waves}>
          {(() => {
            const d = 46 + 4 * Math.sin(t * 1.6);
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + Math.PI);
            return (
              <g>
                <ellipse cx={960} cy={92} rx={d + 40} ry={30} fill={C.cyan} opacity={0.12 + 0.08 * pulse} />
                <ellipse cx={960} cy={92} rx={d * 0.6} ry={18} fill={C.cyan} opacity={0.25 + 0.15 * pulse} />
                <Atom x={960 - d} y={92} el="H" r={20} label={null} glow={0.5} />
                <Atom x={960 + d} y={92} el="H" r={20} label={null} glow={0.5} />
                {[0, 1].map((k) => (
                  <circle key={k} cx={960 + 22 * Math.cos(t * 2 + k * Math.PI)} cy={92 + 9 * Math.sin(t * 2 + k * Math.PI)} r={4.5} fill={C.cyan} />
                ))}
              </g>
            );
          })()}
          {Array.from({length: 14}, (_, k) => {
            const ph = ((t * (0.035 + 0.02 * rand(k)) + rand(k * 3.1)) % 1 + 1) % 1;
            const bottom = k < 8;
            const side = k % 2 ? 1 : -1;
            const x = bottom ? 140 + ph * 1640 + 40 * rand(k * 5.1) : 960 + side * (560 + 300 * rand(k * 7.3));
            const y = bottom ? 850 + 150 * rand(k * 7.3) + 12 * Math.sin(t * 0.7 + k) : 360 - ph * 220;
            const op = 0.3 * cyc(ph);
            const kind = k % 3;
            const rot = t * 20 * (rand(k * 2.2) - 0.5);
            return (
              <g key={k} opacity={op} transform={`rotate(${rot} ${x} ${y})`}>
                {kind === 0 ? <HexIcon x={x} y={y} r={30} mode="ring" width={3} /> : kind === 1 ? <POrb x={x} y={y} L={34} w={12} ang={rand(k) * 60 - 30} /> : (
                  <g>
                    <line x1={x - 22} y1={y} x2={x + 22} y2={y} stroke="#8b97b8" strokeWidth={5} />
                    <circle cx={x - 22} cy={y} r={12} fill="#ff4d63" />
                    <circle cx={x + 22} cy={y} r={12} fill="#ff4d63" />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
        <div style={{fontFamily: FONT.sans, fontSize: 30, letterSpacing: 18, color: C.ink, fontWeight: 300, opacity: a}}>KIMIA KUANTUM · IKATAN VALENSI</div>
        <div style={{fontFamily: FONT.sans, fontSize: 100, fontWeight: 800, color: C.gold, lineHeight: 1.05, opacity: a, textShadow: '0 0 50px rgba(255,194,74,0.4)'}}>JABAT TANGAN ELEKTRON</div>
        <div style={{marginTop: 22, fontFamily: FONT.sans, fontSize: 34, color: C.ink, opacity: ramp(t, 1.2, 2.2)}}>Terima kasih telah menonton</div>
        <div style={{marginTop: 46, textAlign: 'center', opacity: refs}}>
          <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: 4, color: C.muted, marginBottom: 14}}>RUJUKAN</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56, rowGap: 6, width: 1720, textAlign: 'left'}}>
            {REFS.map((r, i) => (
              <div key={r} style={{fontFamily: FONT.sans, fontSize: 22, color: C.muted, lineHeight: 1.4, opacity: ramp(t, 2.4 + i * 0.08, 3.2 + i * 0.08)}}>
                {r}
              </div>
            ))}
          </div>
          <div style={{marginTop: 20, fontFamily: FONT.sans, fontSize: 22, color: C.muted, opacity: 0.8}}>
            Angka dari buku teks & NIST · energi Heitler–London ≈ 3,1 eV vs eksperimen 4,75 eV · nilai ukur ditandai “≈” · ilustrasi orbital skematis
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
