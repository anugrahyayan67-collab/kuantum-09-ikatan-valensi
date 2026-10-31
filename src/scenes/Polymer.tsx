import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp} from '../anim';
import {Atom, Badge, Bond, Glow, Label, Stage} from '../components/primitives';
import {BagIcon, Battery, Bulb, RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 16: polietilena (sp³, σ terkunci, penyekat) vs poliasetilena (terkonjugasi, awan π); iodin → menghantar; Nobel Kimia 2000; OLED.
const N = 12;
const X0 = 200;
const DX = 96;
const Y_PE = 330;
const Y_PA = 620;
const zig = (k: number) => (k % 2 ? 30 : -30);
const cx = (k: number) => X0 + k * DX;
/** titik di sepanjang rantai (s = 0..N-1) */
const along = (s: number, y0: number): [number, number] => {
  const k = Math.max(0, Math.min(N - 2, Math.floor(s)));
  const f = Math.max(0, Math.min(1, s - k));
  return [mix(cx(k), cx(k + 1), f), y0 + mix(zig(k), zig(k + 1), f)];
};
// jalur rangkaian: ujung kanan rantai → lampu → bawah → baterai → kiri → ujung kiri rantai
const BULB: [number, number] = [1470, Y_PA];
const WIRE: [number, number][] = [
  [cx(N - 1), Y_PA + zig(N - 1)],
  [BULB[0] - 34, Y_PA + zig(N - 1)],
  [BULB[0], Y_PA + 40],
  [BULB[0], 800],
  [130, 800],
  [130, Y_PA - 30],
  [X0, Y_PA - 30],
];
const wireLen = WIRE.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - WIRE[i][0], p[1] - WIRE[i][1]), 0);
const onWire = (f: number): [number, number] => {
  let d = f * wireLen;
  for (let i = 1; i < WIRE.length; i++) {
    const L = Math.hypot(WIRE[i][0] - WIRE[i - 1][0], WIRE[i][1] - WIRE[i - 1][1]);
    if (d <= L) return [mix(WIRE[i - 1][0], WIRE[i][0], d / L), mix(WIRE[i - 1][1], WIRE[i][1], d / L)];
    d -= L;
  }
  return WIRE[WIRE.length - 1];
};

export const Polymer: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const pe = ramp(t, wordOf(0, 'Polietilena') - 0.3, wordOf(0, 'Polietilena') + 1.4);
  const bag = ramp(t, wordOf(0, 'kantong') - 0.3, wordOf(0, 'kantong') + 0.6, BACK);
  const lock = ramp(t, wordOf(0, 'terkunci') - 0.3, wordOf(0, 'terkunci') + 0.6);
  const ins = ramp(t, wordOf(0, 'penyekat') - 0.3, wordOf(0, 'penyekat') + 0.5);
  const pa = ramp(t, wordOf(1, 'Poliasetilena') - 0.3, wordOf(1, 'Poliasetilena') + 1.4);
  const alt = ramp(t, wordOf(1, 'berselang') - 0.5, wordOf(1, 'berselang') + 0.6);
  const conj = ramp(t, wordOf(1, 'terkonjugasi') - 0.5, wordOf(1, 'terkonjugasi') + 1.0, EASE_IN_OUT);
  const tI = wordOf(2, 'iodin');
  const dope = ramp(t, tI - 0.4, tI + 1.0);
  const flow = ramp(t, wordOf(2, 'mengalir') - 0.4, wordOf(2, 'mengalir') + 0.8);
  const lamp = ramp(t, wordOf(2, 'menghantarkan') - 0.3, wordOf(2, 'menghantarkan') + 0.6);
  const circuit = ramp(t, cue(2) - 0.3, cue(2) + 0.6);
  const top2 = ramp(t, cue(3) - 0.3, cue(3) + 0.7, EASE_IN_OUT);
  const nobel = ramp(t, wordOf(3, 'Nobel') - 0.3, wordOf(3, 'Nobel') + 0.5, BACK);
  const oled = ramp(t, wordOf(3, 'OLED') - 1.2, wordOf(3, 'OLED') + 0.2);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const grow = (p: number, k: number) => ramp(p, (k / N) * 0.7, (k / N) * 0.7 + 0.3);
  const peOp = 1 - top2;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* ---------- polietilena ---------- */}
        <g opacity={peOp}>
          <RichLabel x={X0 - 30} y={215} anchor="start" parts={[['polietilena · C sp'], ['3', 'sup'], [' · hanya ikatan σ']]} size={30} color={C.ink} opacity={pe} />
          {Array.from({length: N}, (_, k) => {
            const g = grow(pe, k);
            const up = zig(k) < 0;
            const y = Y_PE + zig(k);
            return (
              <g key={k} opacity={g}>
                {[-1, 1].map((s) => (
                  <g key={s}>
                    <Bond x1={cx(k)} y1={y} x2={cx(k) + s * 34} y2={y + (up ? -52 : 52)} width={6} />
                    <Atom x={cx(k) + s * 34} y={y + (up ? -52 : 52)} el="H" r={13} glow={0.3} label={null} />
                  </g>
                ))}
              </g>
            );
          })}
          {Array.from({length: N - 1}, (_, k) => (
            <g key={k} opacity={grow(pe, k + 1)}>
              <Bond x1={cx(k)} y1={Y_PE + zig(k)} x2={cx(k + 1)} y2={Y_PE + zig(k + 1)} width={9} color={C.cyan} />
            </g>
          ))}
          {Array.from({length: N}, (_, k) => (
            <Atom key={k} x={cx(k)} y={Y_PE + zig(k)} el="C" r={20} label={null} opacity={grow(pe, k)} />
          ))}
          {/* pasangan elektron σ terkunci di tiap ikatan */}
          {Array.from({length: N - 1}, (_, k) => {
            const [mx, my] = along(k + 0.5, Y_PE);
            const j = 3 * Math.sin(t * 7 + k * 1.9);
            return (
              <g key={k} opacity={lock}>
                <circle cx={mx - 7 + j} cy={my - 16} r={5.5} fill={C.cyan} />
                <circle cx={mx + 7 - j} cy={my - 16} r={5.5} fill={C.cyan} />
              </g>
            );
          })}
          <BagIcon x={1560} y={320} t={t} opacity={bag} s={0.95} />
          <g opacity={ins}>
            <circle cx={1420} cy={330} r={30} fill="none" stroke={C.red} strokeWidth={5} />
            <path d="M1424,308 L1412,332 L1426,332 L1414,354" fill="none" stroke={C.gold} strokeWidth={4} strokeLinejoin="round" />
            <line x1={1399} y1={309} x2={1441} y2={351} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
            <Label x={1560} y={455} size={32} color={C.red} weight={700}>
              penyekat
            </Label>
          </g>
        </g>

        {/* ---------- Nobel & OLED (menggantikan baris atas) ---------- */}
        <g opacity={oled}>
          <Label x={1150} y={205} size={28} color={C.ink} weight={600}>
            layar OLED
          </Label>
          <rect x={990} y={235} width={320} height={190} rx={14} fill="#0b1022" stroke="#c8d6ff" strokeOpacity={0.6} strokeWidth={3} />
          {Array.from({length: 8 * 5}, (_, k) => {
            const i = k % 8;
            const j = Math.floor(k / 8);
            const col = [C.red, C.mint, C.blue][(i + j) % 3];
            const b = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4 + i * 0.7 - j * 0.9));
            return <rect key={k} x={1006 + i * 37} y={250 + j * 33} width={30} height={26} rx={4} fill={col} opacity={b * 0.85} />;
          })}
          {/* tumpukan lapisan */}
          {[
            {c: '#8c96bb', n: 'katoda'},
            {c: C.mint, n: 'emisif'},
            {c: C.amber, n: 'polimer penghantar'},
            {c: '#9fd8ff', n: 'anoda'},
            {c: '#c8d6ff', n: 'kaca'},
          ].map((L, k) => {
            const y = 250 + k * 38 + (k === 2 ? 4 * Math.sin(t * 2) : 0);
            const hot = k === 2;
            return (
              <g key={k}>
                <path d={`M1420,${y + 14} L1460,${y} L1640,${y} L1600,${y + 14} Z`} fill={L.c} opacity={hot ? 0.9 : 0.45} stroke={hot ? '#fff' : 'none'} strokeOpacity={0.5} />
                {hot ? <path d={`M1420,${y + 14} L1460,${y} L1640,${y} L1600,${y + 14} Z`} fill="none" stroke={C.amber} strokeWidth={10} opacity={0.2 + 0.1 * Math.sin(t * 3)} /> : null}
              </g>
            );
          })}
          <Label x={1530} y={455} size={28} color={C.amber} weight={600}>
            lapisan polimer penghantar
          </Label>
        </g>
        <Label x={470} y={360} size={26} color={C.muted} opacity={nobel}>
          Heeger · MacDiarmid · Shirakawa
        </Label>
        <Label x={470} y={405} size={26} color={C.muted} opacity={nobel}>
          poliasetilena + iodin menghantar (1977)
        </Label>

        {/* ---------- poliasetilena ---------- */}
        <RichLabel x={X0 - 30} y={Y_PA - 120} anchor="start" parts={[['poliasetilena · C sp'], ['2', 'sup'], [' · tunggal–rangkap berselang-seling']]} size={30} color={C.ink} opacity={pa} />
        <g opacity={pa}>
          <path
            d={Array.from({length: N}, (_, k) => `${k ? 'L' : 'M'}${cx(k)},${Y_PA + zig(k)}`).join(' ')}
            fill="none"
            stroke={C.amber}
            strokeWidth={64}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={(0.16 + 0.06 * Math.sin(t * 2.4)) * conj + 0.12 * flow}
          />
          {Array.from({length: N}, (_, k) => {
            const up = zig(k) < 0;
            const y = Y_PA + zig(k);
            return (
              <g key={k} opacity={grow(pa, k)}>
                <Bond x1={cx(k)} y1={y} x2={cx(k)} y2={y + (up ? -56 : 56)} width={6} />
                <Atom x={cx(k)} y={y + (up ? -56 : 56)} el="H" r={13} glow={0.3} label={null} />
              </g>
            );
          })}
          {Array.from({length: N - 1}, (_, k) => {
            const g = grow(pa, k + 1);
            const a = [cx(k), Y_PA + zig(k)];
            const b = [cx(k + 1), Y_PA + zig(k + 1)];
            const dbl = k % 2 === 0;
            return (
              <g key={k} opacity={g}>
                <Bond x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} width={9} color={C.cyan} order={1} />
                {dbl ? (() => {
                  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
                  let nx = -(b[1] - a[1]) / L;
                  let ny = (b[0] - a[0]) / L;
                  if (ny < 0) {
                    nx = -nx;
                    ny = -ny;
                  }
                  const o = 15;
                  return (
                    <line x1={mix(a[0], b[0], 0.2) + nx * o} y1={mix(a[1], b[1], 0.2) + ny * o} x2={mix(a[0], b[0], 0.8) + nx * o} y2={mix(a[1], b[1], 0.8) + ny * o} stroke={C.amber} strokeWidth={6} strokeLinecap="round" opacity={alt} />
                  );
                })() : null}
              </g>
            );
          })}
          {Array.from({length: N}, (_, k) => (
            <Atom key={k} x={cx(k)} y={Y_PA + zig(k)} el="C" r={20} label={null} opacity={grow(pa, k)} />
          ))}
          {/* elektron π: diam di ikatan rangkap → mengalir setelah didoping */}
          {Array.from({length: 10}, (_, k) => {
            const home = 2 * Math.floor(k / 2) + 0.5;
            const ph = (((t * 0.12 + k / 10) % 1) + 1) % 1;
            const s = mix(home + (k % 2 ? 0.12 : -0.12) + 0.06 * Math.sin(t * 5 + k), ph * (N - 1), flow);
            const [x, y] = along(s, Y_PA);
            const fade = mix(1, cyc(ph) * 1.1, flow);
            return <circle key={k} cx={x} cy={y - 30} r={6} fill={C.cyan} opacity={Math.min(1, fade) * conj} />;
          })}
        </g>

        {/* iodin dopan */}
        {[2.5, 5, 7.5, 9.6].map((s, k) => {
          const p = ramp(t, tI - 0.3 + k * 0.25, tI + 0.6 + k * 0.25, BACK);
          const x = X0 + s * DX + 12 * Math.sin(t * 1.1 + k);
          const y = mix(440, 478, p) + 4 * Math.sin(t * 1.7 + k * 2);
          return (
            <g key={k} opacity={Math.min(1, p * 1.5)}>
              <circle cx={x} cy={y} r={44} fill="url(#soft-violet)" opacity={0.5} />
              <Atom x={x} y={y} el="D" r={22} label="I" glow={0} />
            </g>
          );
        })}
        <Label x={X0 + 10.3 * DX} y={478} size={28} anchor="start" color={C.violet} opacity={dope} weight={600}>
          + iodin
        </Label>

        {/* rangkaian lampu */}
        <g opacity={circuit}>
          <path d={WIRE.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')} fill="none" stroke="#6a7494" strokeWidth={4} strokeLinejoin="round" />
          <Battery x={700} y={800} />
          <Bulb x={BULB[0]} y={BULB[1]} on={lamp} t={t} />
          {Array.from({length: 16}, (_, k) => {
            const ph = (((t * 0.09 + k / 16) % 1) + 1) % 1;
            const [x, y] = onWire(ph);
            return <circle key={k} cx={x} cy={y} r={5} fill={C.cyan} opacity={0.9 * flow * (0.6 + 0.4 * rand(k))} />;
          })}
        </g>
        <Glow x={BULB[0]} y={BULB[1]} r={160} color="gold" opacity={0.3 * lamp} />
        <Label x={BULB[0] + 60} y={BULB[1] - 70} size={28} anchor="middle" color={C.gold} opacity={lamp} weight={600}>
          menyala!
        </Label>
      </Stage>
      <Badge x={470} y={295} text="NOBEL KIMIA 2000" color={C.gold} opacity={nobel} scale={0.85 + 0.15 * nobel} />
    </AbsoluteFill>
  );
};
