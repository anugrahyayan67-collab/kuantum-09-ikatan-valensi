import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp} from '../anim';
import {Badge, Glow, Label, Stage} from '../components/primitives';
import {project} from '../components/viz';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 15: hibridisasi menentukan wujud karbon — intan sp³ (kisi tetrahedral), grafit sp² (lembaran + elektron π), grafena (satu lembar).
const PX = [340, 960, 1580];
const PW = 520;
const PY0 = 190;
const PY1 = 850;

/* ---------- kisi intan (kubus intan, koordinat −1..1) ---------- */
const DIAMOND = (() => {
  const base: [number, number, number][] = [
    [0, 0, 0],
    [0, 0.5, 0.5],
    [0.5, 0, 0.5],
    [0.5, 0.5, 0],
  ];
  const pts: [number, number, number][] = [];
  const R = 0.9;
  for (let i = -2; i <= 2; i++)
    for (let j = -2; j <= 2; j++)
      for (let k = -2; k <= 2; k++)
        for (const b of base)
          for (const off of [0, 0.25]) {
            const p: [number, number, number] = [b[0] + i + off, b[1] + j + off, b[2] + k + off];
            if (Math.hypot(p[0] - 0.25, p[1] - 0.25, p[2] - 0.25) <= R + 1e-6) pts.push(p);
          }
  const uniq = pts.filter((p, i) => pts.findIndex((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 0.01) === i);
  const atoms = uniq.map((p) => ({x: (p[0] - 0.25) / R, y: (p[1] - 0.25) / R, z: (p[2] - 0.25) / R}));
  const bonds: [number, number][] = [];
  for (let i = 0; i < uniq.length; i++)
    for (let j = i + 1; j < uniq.length; j++) {
      const d = Math.hypot(uniq[i][0] - uniq[j][0], uniq[i][1] - uniq[j][1], uniq[i][2] - uniq[j][2]);
      if (Math.abs(d - Math.sqrt(3) / 4) < 0.02) bonds.push([i, j]);
    }
  const deg = atoms.map((_, i) => bonds.filter((b) => b[0] === i || b[1] === i).length);
  const keep = atoms.map((_, i) => deg[i] > 0);
  return {atoms, bonds, keep};
})();

/* ---------- lembaran heksagonal (sarang lebah) ---------- */
const SHEET = (() => {
  const atoms: {u: number; v: number}[] = [];
  const idx = new Map<string, number>();
  const add = (u: number, v: number) => {
    const key = `${u.toFixed(2)},${v.toFixed(2)}`;
    if (!idx.has(key)) {
      idx.set(key, atoms.length);
      atoms.push({u, v});
    }
    return idx.get(key) as number;
  };
  const bonds: [number, number][] = [];
  const s3 = Math.sqrt(3);
  const inside = (u: number, v: number) => Math.abs(u) <= 4.4 && Math.abs(v) <= 3.1;
  for (let i = -6; i <= 6; i++)
    for (let j = -5; j <= 5; j++) {
      const ax = i * s3 + j * (s3 / 2);
      const ay = j * 1.5;
      const A: [number, number] = [ax, ay];
      const nb: [number, number][] = [
        [ax, ay + 1],
        [ax + s3 / 2, ay - 0.5],
        [ax - s3 / 2, ay - 0.5],
      ];
      if (!inside(A[0], A[1])) continue;
      for (const B of nb) {
        if (!inside(B[0], B[1])) continue;
        bonds.push([add(A[0], A[1]), add(B[0], B[1])]);
      }
    }
  return {atoms, bonds};
})();

/** Lembaran grafit/grafena dalam proyeksi miring. */
const Sheet: React.FC<{cx: number; cy: number; s: number; t: number; shift?: number; wave?: number; opacity?: number; pi?: number; flow?: number; seed?: number; atomR?: number}> = ({
  cx,
  cy,
  s,
  t,
  shift = 0,
  wave = 0,
  opacity = 1,
  pi = 0,
  flow = 0,
  seed = 0,
  atomR = 5,
}) => {
  const yaw = 0.42 + 0.06 * Math.sin(t * 0.3);
  const P = (u: number, v: number) => {
    const uu = u + shift;
    const z = wave * Math.sin(uu * 0.9 + t * 1.4) * Math.cos(v * 0.7);
    return {X: cx + (uu * Math.cos(yaw) - v * Math.sin(yaw)) * s, Y: cy + (uu * Math.sin(yaw) + v * Math.cos(yaw)) * s * 0.36 - z};
  };
  const pts = SHEET.atoms.map((a) => P(a.u, a.v));
  const corners = [P(-4.6, -3.3), P(4.6, -3.3), P(4.6, 3.3), P(-4.6, 3.3)];
  const quad = (dy: number) => corners.map((c) => `${c.X.toFixed(1)},${(c.Y + dy).toFixed(1)}`).join(' ');
  return (
    <g opacity={opacity}>
      {pi > 0 ? (
        <>
          <polygon points={quad(10)} fill={C.violet} opacity={0.16 * pi} />
          <polygon points={quad(-10)} fill={C.amber} opacity={0.2 * pi * (0.85 + 0.15 * Math.sin(t * 2 + seed))} />
        </>
      ) : null}
      {SHEET.bonds.map(([i, j], k) => (
        <line key={k} x1={pts[i].X} y1={pts[i].Y} x2={pts[j].X} y2={pts[j].Y} stroke="#9aa6c8" strokeWidth={2.4} opacity={0.85} />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.X} cy={p.Y} r={atomR} fill="#8e9ab8" />
      ))}
      {flow > 0
        ? Array.from({length: 12}, (_, k) => {
            const ph = (((t * 0.22 + k / 12 + seed * 0.13) % 1) + 1) % 1;
            const v = -2.6 + ((k * 5) % 12) * 0.47;
            const u = mix(-4.4, 4.4, ph);
            const q = P(u - shift, v);
            return <circle key={k} cx={q.X} cy={q.Y - 8} r={6} fill={C.cyan} opacity={flow * cyc(ph)} />;
          })
        : null}
    </g>
  );
};

export const Carbon: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const frames = ramp(t, 0.2, 1.2);
  const pD = ramp(t, wordOf(1, 'intan') - 0.3, wordOf(1, 'intan') + 0.9);
  const tetra = ramp(t, wordOf(1, 'tetrahedral') - 0.3, wordOf(1, 'tetrahedral') + 0.6);
  const hard = ramp(t, wordOf(1, 'terkeras') - 0.3, wordOf(1, 'terkeras') + 0.5);
  const pG = ramp(t, wordOf(2, 'grafit') - 0.3, wordOf(2, 'grafit') + 0.9);
  const sea = ramp(t, wordOf(2, 'lautan') - 0.4, wordOf(2, 'lautan') + 1.0);
  const flow = ramp(t, wordOf(3, 'bebas') - 0.4, wordOf(3, 'bebas') + 0.6);
  const cond = ramp(t, wordOf(3, 'menghantarkan') - 0.3, wordOf(3, 'menghantarkan') + 0.5);
  const slide = ramp(t, wordOf(3, 'bergeser') - 0.5, wordOf(3, 'bergeser') + 0.4);
  const pF = ramp(t, wordOf(4, 'grafena') - 0.3, wordOf(4, 'grafena') + 0.9);
  const nobel = ramp(t, wordOf(4, 'Nobel') - 0.3, wordOf(4, 'Nobel') + 0.5, BACK);
  const yr = ramp(t, wordOf(4, 'empat') - 0.3, wordOf(4, 'empat') + 0.5);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  // sorotan panel aktif
  const focus = [
    Math.min(1, ramp(t, cue(1) - 0.2, cue(1) + 0.5)) * (1 - 0.45 * ramp(t, cue(2) - 0.2, cue(2) + 0.5)),
    Math.min(1, ramp(t, cue(2) - 0.2, cue(2) + 0.5)) * (1 - 0.45 * ramp(t, cue(4) - 0.2, cue(4) + 0.5)),
    ramp(t, cue(4) - 0.2, cue(4) + 0.5),
  ];

  // intan
  const yaw = t * 0.32;
  const pitch = 0.38 + 0.08 * Math.sin(t * 0.4);
  const dp = DIAMOND.atoms.map((a) => project(a, PX[0], 500, 175, yaw, pitch));
  const dOrder = DIAMOND.atoms.map((_, i) => i).filter((i) => DIAMOND.keep[i]).sort((a, b) => dp[b].depth - dp[a].depth);
  const grow = (i: number) => ramp(pD, (i / DIAMOND.atoms.length) * 0.6, (i / DIAMOND.atoms.length) * 0.6 + 0.4);

  const shiftTop = 0.9 * slide * Math.sin(Math.max(0, t - wordOf(3, 'bergeser') + 0.5) * 1.3);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {PX.map((x, i) => (
          <g key={i} opacity={frames}>
            <rect x={x - PW / 2} y={PY0} width={PW} height={PY1 - PY0} rx={22} fill="rgba(12,18,40,0.55)" stroke={[C.cyan, C.amber, C.mint][i]} strokeOpacity={0.15 + 0.5 * focus[i]} strokeWidth={2.5} />
            <Glow x={x} y={520} r={260} color={(['cyan', 'gold', 'mint'] as const)[i]} opacity={0.12 * focus[i]} />
          </g>
        ))}
        {['INTAN', 'GRAFIT', 'GRAFENA'].map((s, i) => (
          <Label key={s} x={PX[i]} y={PY0 + 44} size={34} weight={700} spacing={6} color={[C.cyan, C.amber, C.mint][i]} opacity={frames * (0.5 + 0.5 * Math.max(focus[i], [pD, pG, pF][i]))}>
            {s}
          </Label>
        ))}
        <RichLabel x={PX[0]} y={PY0 + 92} parts={[['karbon sp'], ['3', 'sup']]} size={30} color={C.mint} opacity={pD} />
        <RichLabel x={PX[1]} y={PY0 + 92} parts={[['karbon sp'], ['2', 'sup']]} size={30} color={C.mint} opacity={pG} />
        <RichLabel x={PX[2]} y={PY0 + 92} parts={[['karbon sp'], ['2', 'sup'], [' · satu lapis atom']]} size={30} color={C.mint} opacity={pF} />

        {/* intan */}
        <g opacity={pD * (0.55 + 0.45 * focus[0])}>
          {DIAMOND.bonds.map(([i, j], k) => {
            const g = Math.min(grow(i), grow(j));
            const back = (dp[i].depth + dp[j].depth) / 2;
            return <line key={k} x1={dp[i].X} y1={dp[i].Y} x2={mix(dp[i].X, dp[j].X, g)} y2={mix(dp[i].Y, dp[j].Y, g)} stroke={C.cyan} strokeWidth={4.5 - back * 1.5} opacity={(0.55 - back * 0.25) * g + 0.15 * tetra * g} />;
          })}
          {dOrder.map((i) => {
            const d = dp[i].depth;
            return <circle key={i} cx={dp[i].X} cy={dp[i].Y} r={(15 - d * 4) * grow(i)} fill="url(#atom-C)" stroke="#c8d3ef" strokeOpacity={0.5} strokeWidth={1.5} opacity={0.75 - d * 0.2} />;
          })}
        </g>
        <Label x={PX[0]} y={740} size={28} color={C.ink} opacity={hard}>
          terkeras alami · penyekat
        </Label>
        <Label x={PX[0]} y={782} size={26} color={C.muted} opacity={tetra}>
          4 tetangga · jaringan tetrahedral
        </Label>

        {/* grafit */}
        <g opacity={pG * (0.55 + 0.45 * focus[1])}>
          {[2, 1, 0].map((L) => (
            <Sheet key={L} cx={PX[1] + (L === 1 ? 18 : 0)} cy={400 + L * 105} s={33} t={t} shift={L === 0 ? shiftTop : 0} pi={sea} flow={L === 0 ? flow : 0} seed={L} opacity={L === 0 ? 1 : 0.75} atomR={4.5} />
          ))}
        </g>
        <Label x={PX[1]} y={740} size={28} color={C.ink} opacity={cond}>
          menghantar listrik
        </Label>
        <Label x={PX[1]} y={782} size={26} color={C.amber} opacity={sea * (1 - slide)}>
          lautan elektron π
        </Label>
        <Label x={PX[1]} y={782} size={26} color={C.muted} opacity={slide}>
          lembaran mudah bergeser
        </Label>

        {/* grafena */}
        <g opacity={pF}>
          <Sheet cx={PX[2]} cy={500} s={36} t={t} wave={10} pi={0.8} flow={0.8} seed={4} atomR={5} />
        </g>
      </Stage>
      <Badge x={PX[2]} y={735} text="diisolasi 2004" color={C.mint} opacity={yr} scale={0.9 + 0.1 * yr} />
      <Badge x={PX[2]} y={795} text="NOBEL FISIKA 2010" color={C.gold} opacity={nobel} scale={0.85 + 0.15 * nobel} />
    </AbsoluteFill>
  );
};
