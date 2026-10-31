import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {SpectrumDefs} from '../components/grupD';
import {wlColor} from '../components/viz';
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
        <SpectrumDefs id="outro-spec" />
        {/* hiasan: pita spektrum tipis dengan dua garis kuning natrium yang berdenyut */}
        <g opacity={waves}>
          <rect x={360} y={96} width={1200} height={14} rx={7} fill="url(#outro-spec)" opacity={0.35} />
          {[588.995, 589.592].map((nm, k) => {
            const x = 360 + ((nm - 380) / 380) * 1200 + (k ? 9 : -9);
            const pulse = 0.75 + 0.25 * Math.sin(t * 2.2 + k * 1.3);
            return (
              <g key={nm}>
                <circle cx={x} cy={103} r={46} fill="url(#soft-gold)" opacity={0.35 * pulse} />
                <rect x={x - 3} y={70} width={6} height={66} rx={3} fill={wlColor(589)} opacity={pulse} />
                <rect x={x - 1} y={74} width={2} height={58} rx={1} fill="#fff6c0" opacity={pulse} />
              </g>
            );
          })}
          {Array.from({length: 26}, (_, k) => {
            const ph = ((t * (0.05 + 0.04 * rand(k)) + rand(k * 3.1)) % 1 + 1) % 1;
            return <circle key={k} cx={120 + rand(k * 7.3) * 1680} cy={1040 - ph * 1000} r={1.5 + 2 * rand(k * 1.7)} fill={wlColor(589)} opacity={0.35 * Math.min(1, ph * 6) * (1 - ph)} />;
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
