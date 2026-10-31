import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Stage} from './components/primitives';
import {C, FONT, H, W} from './theme';

/** Gambar sampul video (2560×1440 lewat skala 4/3, lihat Root.tsx). */
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 70% at 70% 45%, #4a2f0a 0%, ${C.bg2} 45%, ${C.bg} 100%)`}}>
    <Stage>
      <Glow x={1420} y={460} r={560} color="gold" opacity={0.22} />
      <rect x={1020} y={620} width={800} height={150} rx={12} fill="rgba(6,10,24,0.85)" stroke={C.faint} strokeWidth={3} />
      {[1310, 1340].map((x) => (
        <rect key={x} x={x} y={636} width={9} height={118} fill="#ffd23a" opacity={0.95} />
      ))}
      <text x={1420} y={810} textAnchor="middle" fontFamily={FONT.mono} fontSize={30} fill={C.muted}>
        H₂ · 74 pm · 4,75 eV
      </text>
    </Stage>
    <div style={{position: 'absolute', left: 1080, top: 150, width: 700, textAlign: 'center', fontFamily: FONT.serif, color: C.gold, textShadow: '0 0 40px rgba(255,194,74,0.5)'}}>
      <span style={{fontSize: 260, fontStyle: 'italic'}}>sp</span>
      <span style={{fontSize: 130, verticalAlign: 'super'}}>3</span>
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
