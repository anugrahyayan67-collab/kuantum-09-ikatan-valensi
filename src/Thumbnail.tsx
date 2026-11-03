import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Stage} from './components/primitives';
import {C, FONT, H, W} from './theme';

// Kurva energi potensial H₂ (Morse): V(r) = Dₑ[(1 − e^(−a(r − rₑ)))² − 1], Dₑ = 4,75 eV, rₑ = 74 pm.
const DE = 4.75;
const RE = 74;
const A = 0.0194; // pm⁻¹ (≈ 1,94 Å⁻¹)
const V = (r: number) => DE * ((1 - Math.exp(-A * (r - RE))) ** 2 - 1);
const R0 = 35.3; // V(R0) ≈ +1,2 eV (batas atas gambar)
const R1 = 320;
const gx = (r: number) => 1110 + (r - R0) * 2.35;
const Y_ZERO = 600; // V = 0
const PX_EV = 48;
const gy = (v: number) => Y_ZERO - v * PX_EV;
const AX_Y = 880; // sumbu r

const MorseH2: React.FC = () => {
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const r = R0 + ((R1 - R0) * i) / 160;
    pts.push(`${gx(r).toFixed(1)},${gy(V(r)).toFixed(1)}`);
  }
  const d = `M ${pts.join(' L ')}`;
  const xm = gx(RE);
  const ym = gy(-DE);
  return (
    <g>
      {/* sumbu */}
      <line x1={1080} y1={AX_Y} x2={1820} y2={AX_Y} stroke={C.muted} strokeWidth={3} />
      <path d={`M 1820 ${AX_Y - 9} L 1836 ${AX_Y} L 1820 ${AX_Y + 9} Z`} fill={C.muted} />
      <text x={1836} y={AX_Y + 40} textAnchor="end" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.muted}>
        r
      </text>
      <line x1={1080} y1={AX_Y} x2={1080} y2={530} stroke={C.muted} strokeWidth={3} />
      <path d={`M 1071 530 L 1080 514 L 1089 530 Z`} fill={C.muted} />
      <text x={1062} y={540} textAnchor="end" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.muted}>
        E
      </text>
      {/* E = 0: dua atom H terpisah jauh */}
      <line x1={1080} y1={Y_ZERO} x2={1810} y2={Y_ZERO} stroke={C.faint} strokeWidth={3} strokeDasharray="10 10" />
      <circle cx={1700} cy={Y_ZERO - 42} r={14} fill="#eef2ff" />
      <circle cx={1790} cy={Y_ZERO - 42} r={14} fill="#eef2ff" />
      <text x={1745} y={Y_ZERO - 32} textAnchor="middle" fontFamily={FONT.sans} fontWeight={600} fontSize={30} fill={C.muted}>
        +
      </text>
      {/* kurva energi */}
      <path d={d} fill="none" stroke={C.cyan} strokeWidth={14} opacity={0.18} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      {/* kedalaman sumur 4,75 eV */}
      <line x1={xm} y1={Y_ZERO + 6} x2={xm} y2={ym - 22} stroke={C.gold} strokeWidth={4} />
      <path d={`M ${xm - 10} ${Y_ZERO + 18} L ${xm} ${Y_ZERO + 2} L ${xm + 10} ${Y_ZERO + 18} Z`} fill={C.gold} />
      <path d={`M ${xm - 10} ${ym - 28} L ${xm} ${ym - 12} L ${xm + 10} ${ym - 28} Z`} fill={C.gold} />
      <text x={xm + 22} y={Y_ZERO + 52} fontFamily={FONT.mono} fontWeight={700} fontSize={34} fill={C.gold}>
        4,75 eV
      </text>
      {/* minimum di 74 pm */}
      <line x1={xm} y1={ym} x2={xm} y2={AX_Y} stroke={C.gold} strokeWidth={3} strokeDasharray="6 8" opacity={0.8} />
      <circle cx={xm} cy={ym} r={22} fill={C.gold} opacity={0.25} />
      <circle cx={xm - 9} cy={ym} r={11} fill="#eef2ff" />
      <circle cx={xm + 9} cy={ym} r={11} fill="#eef2ff" />
      <text x={xm} y={AX_Y + 40} textAnchor="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={32} fill={C.gold}>
        74 pm
      </text>
      <text x={1460} y={AX_Y + 92} textAnchor="middle" fontFamily={FONT.mono} fontSize={30} fill={C.muted}>
        H₂ · 74 pm · 4,75 eV
      </text>
    </g>
  );
};

/** Gambar sampul video (2560×1440 lewat skala 4/3, lihat Root.tsx). */
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 70% at 70% 45%, #4a2f0a 0%, ${C.bg2} 45%, ${C.bg} 100%)`}}>
    <Stage>
      <Glow x={1420} y={420} r={520} color="gold" opacity={0.2} />
      <MorseH2 />
    </Stage>
    <div style={{position: 'absolute', left: 1080, top: 150, width: 700, textAlign: 'center', fontFamily: FONT.serif, color: C.gold, textShadow: '0 0 40px rgba(255,194,74,0.5)'}}>
      <span style={{fontSize: 260, fontStyle: 'italic'}}>sp</span>
      <span style={{fontSize: 130, position: 'relative', top: -110}}>3</span>
    </div>
    <div style={{position: 'absolute', left: 110, top: 220, width: 900}}>
      <div style={{fontFamily: FONT.mono, fontSize: 30, letterSpacing: 8, color: C.gold}}>KIMIA KUANTUM · IKATAN VALENSI</div>
      <div style={{fontFamily: FONT.sans, fontSize: 70, fontWeight: 800, color: C.ink, lineHeight: 1.05, marginTop: 10}}>Teori Ikatan Valensi</div>
      <div style={{fontFamily: FONT.sans, fontSize: 140, fontWeight: 800, color: C.gold, lineHeight: 1, marginTop: 24, textShadow: '0 0 50px rgba(255,194,74,0.45)'}}>
        Jabat Tangan
        <br />
        Elektron
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 44}}>
        {[
          ['Heitler–London', C.cyan],
          ['hibridisasi', C.violet],
          ['resonansi', C.amber],
        ].map(([t, col]) => (
          <div key={t} style={{padding: '10px 22px', borderRadius: 999, border: `2px solid ${col}`, color: col, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30}}>
            {t}
          </div>
        ))}
      </div>
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${2560 / W})`, transformOrigin: '0 0'}}>
      <Cover />
    </div>
  </AbsoluteFill>
);
