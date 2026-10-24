import type { ReactNode } from "react";

type Track = "Foundations" | "Manual QA" | "Professional QA" | "Automation QA";

/** Every cover uses the primary blue: soft background, strong accent, lighter accent and a deep tone. */
const BRAND_PALETTE = { bg: "#e6efff", a: "#0066ff", soft: "#b5d0ff", deep: "#0a3d99" };
const PAL: Record<Track, { bg: string; a: string; soft: string; deep: string }> = {
  Foundations: BRAND_PALETTE,
  "Manual QA": BRAND_PALETTE,
  "Professional QA": BRAND_PALETTE,
  "Automation QA": BRAND_PALETTE,
};

const INK = "#1b1b1f";
const LINE = "#d8d8de";
const GREEN = "#22a45d";
const RED = "#e5484d";
const BLUE = "#0066ff";

type C = (typeof PAL)[Track];

/* ── drawing helpers (all on a 320 × 200 canvas) ── */

const Card = ({ x, y, w, h, r = 12, fill = "#fff" }: { x: number; y: number; w: number; h: number; r?: number; fill?: string }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke="#00000014" strokeWidth="1" filter="url(#sh)" />
);

const Lines = ({ x, y, ws, gap = 9, c = LINE, h = 4 }: { x: number; y: number; ws: number[]; gap?: number; c?: string; h?: number }) => (
  <>
    {ws.map((w, i) => (
      <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={h / 2} fill={c} />
    ))}
  </>
);

const Tick = ({ x, y, r = 8, c = GREEN }: { x: number; y: number; r?: number; c?: string }) => (
  <>
    <circle cx={x} cy={y} r={r} fill={c} />
    <path d={`M${x - r * 0.45} ${y} L${x - r * 0.1} ${y + r * 0.38} L${x + r * 0.5} ${y - r * 0.35}`} fill="none" stroke="#fff" strokeWidth={r * 0.28} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const Win = ({ x, y, w, h, bar = LINE }: { x: number; y: number; w: number; h: number; bar?: string }) => (
  <>
    <Card x={x} y={y} w={w} h={h} />
    <path d={`M${x} ${y + 16} V${y + 12} a12 12 0 0 1 12 -12 H${x + w - 12} a12 12 0 0 1 12 12 V${y + 16} Z`} fill={bar} opacity=".55" />
    <circle cx={x + 11} cy={y + 8} r="2.6" fill="#ff6b6b" />
    <circle cx={x + 20} cy={y + 8} r="2.6" fill="#ffc53d" />
    <circle cx={x + 29} cy={y + 8} r="2.6" fill="#34c759" />
  </>
);

const Chip = ({ x, y, w, c, t }: { x: number; y: number; w: number; c: string; t?: string }) => (
  <>
    <rect x={x} y={y} width={w} height="13" rx="6.5" fill={c} />
    {t && (
      <text x={x + w / 2} y={y + 9.4} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">
        {t}
      </text>
    )}
  </>
);

const Arrow = ({ x1, y1, x2, y2, c = INK }: { x1: number; y1: number; x2: number; y2: number; c?: string }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d: number) => x2 - 7 * Math.cos(a + d);
  const hy = (d: number) => y2 - 7 * Math.sin(a + d);
  return (
    <g stroke={c} strokeWidth="2" strokeLinecap="round" fill="none">
      <path d={`M${x1} ${y1} L${x2} ${y2}`} />
      <path d={`M${hx(0.5)} ${hy(0.5)} L${x2} ${y2} L${hx(-0.5)} ${hy(-0.5)}`} />
    </g>
  );
};

const Bug = ({ x, y, s = 1, c = RED }: { x: number; y: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
      <path d="M-13 -6 L-22 -12 M-14 2 L-24 2 M-13 10 L-22 17 M13 -6 L22 -12 M14 2 L24 2 M13 10 L22 17 M-5 -17 L-9 -25 M5 -17 L9 -25" />
    </g>
    <ellipse cx="0" cy="3" rx="14" ry="17" fill={c} stroke={INK} strokeWidth="2.4" />
    <circle cx="0" cy="-16" r="8" fill={c} stroke={INK} strokeWidth="2.4" />
    <path d="M0 -10 V20" stroke={INK} strokeWidth="2" opacity=".55" />
    <circle cx="-3" cy="-17" r="1.7" fill="#fff" />
    <circle cx="3" cy="-17" r="1.7" fill="#fff" />
  </g>
);

const Magnifier = ({ x, y, s = 1, c }: { x: number; y: number; s?: number; c: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M17 17 L34 34" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <circle cx="0" cy="0" r="22" fill="#ffffffcc" stroke={INK} strokeWidth="4" />
    <circle cx="0" cy="0" r="22" fill={c} opacity=".18" />
  </g>
);

const Db = ({ x, y, c }: { x: number; y: number; c: string }) => (
  <g>
    <path d={`M${x} ${y} v34 a22 8 0 0 0 44 0 v-34`} fill={c} stroke={INK} strokeWidth="2.4" />
    <ellipse cx={x + 22} cy={y} rx="22" ry="8" fill="#fff" stroke={INK} strokeWidth="2.4" />
    <path d={`M${x} ${y + 12} a22 8 0 0 0 44 0 M${x} ${y + 24} a22 8 0 0 0 44 0`} fill="none" stroke={INK} strokeWidth="2" opacity=".5" />
  </g>
);

const Mono = ({ x, y, t, c = INK, s = 9 }: { x: number; y: number; t: string; c?: string; s?: number }) => (
  <text x={x} y={y} fontSize={s} fontWeight="700" fill={c} fontFamily="ui-monospace, Menlo, monospace">
    {t}
  </text>
);

/* ── one scene per lesson ── */

const SCENES: Record<string, (p: C) => ReactNode> = {
  "1.1": (p) => (
    <>
      <Win x={58} y={34} w={150} h={132} bar={p.soft} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Tick x={80} y={72 + i * 28} r={9} c={i === 2 ? p.a : GREEN} />
          <Lines x={96} y={68 + i * 28} ws={[78 - i * 10, 50]} gap={9} />
        </g>
      ))}
      <Magnifier x={214} y={108} s={1.05} c={p.a} />
      <circle cx="262" cy="52" r="15" fill={p.a} />
      <path d="M262 43 l3 6.5 7 1 -5 5 1.3 7 -6.3 -3.4 -6.3 3.4 1.3 -7 -5 -5 7 -1z" fill="#fff" />
    </>
  ),
  "1.2": (p) => {
    const pts = [0, 1, 2, 3, 4].map((i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return [160 + Math.cos(a) * 62, 100 + Math.sin(a) * 62] as const;
    });
    return (
      <>
        <circle cx="160" cy="100" r="62" fill="none" stroke={p.soft} strokeWidth="14" />
        <circle cx="160" cy="100" r="62" fill="none" stroke={p.a} strokeWidth="4" strokeDasharray="10 8" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 21} y={y - 11} width="42" height="22" rx="11" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x={x - 12} y={y - 3} width="24" height="6" rx="3" fill={i % 2 ? p.a : p.deep} />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={142 + i * 18} cy="94" r="7" fill={[p.a, p.deep, p.soft][i]} stroke={INK} strokeWidth="1.6" />
            <path d={`M${142 + i * 18 - 9} 114 a9 9 0 0 1 18 0 z`} fill={[p.a, p.deep, p.soft][i]} stroke={INK} strokeWidth="1.6" />
          </g>
        ))}
      </>
    );
  },
  "1.3": (p) => (
    <>
      <Card x={40} y={30} w={96} h={140} />
      <rect x="40" y="30" width="96" height="22" rx="12" fill={p.soft} />
      <Mono x={52} y={45} t="BRD" c={p.deep} />
      <Lines x={52} y={64} ws={[70, 58, 66, 44, 62, 52]} gap={13} />
      <rect x="160" y="40" width="50" height="40" rx="6" fill="#cfe0ff" transform="rotate(-5 185 60)" />
      <Lines x={168} y={52} ws={[32, 24, 28]} gap={9} c="#7aa6f0" />
      <rect x="164" y="104" width="54" height="40" rx="6" fill={p.a} transform="rotate(4 191 124)" opacity=".9" />
      <Lines x={172} y={116} ws={[34, 26]} gap={9} c="#ffffffcc" />
      <Card x={238} y={64} w={52} h={70} r={10} />
      <Tick x={252} y={82} r={6} />
      <Tick x={252} y={100} r={6} />
      <Tick x={252} y={118} r={6} c={p.a} />
      <Lines x={262} y={79} ws={[20]} />
      <Lines x={262} y={97} ws={[20]} />
      <Lines x={262} y={115} ws={[20]} />
      <path d="M136 80 C150 80 150 62 160 62 M136 110 C150 110 150 124 164 124 M210 62 C224 62 224 82 238 82 M218 124 C228 124 228 100 238 100" fill="none" stroke={INK} strokeWidth="1.8" strokeDasharray="4 4" />
    </>
  ),
  "2.1": (p) => (
    <>
      <Card x={36} y={30} w={248} h={140} />
      <rect x="36" y="30" width="248" height="24" rx="12" fill={p.soft} />
      {["ID", "Steps", "Result"].map((h, i) => (
        <Mono key={h} x={[50, 96, 232][i]} y={46} t={h} c={p.deep} s={8.5} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1="44" x2="276" y1={64 + i * 26} y2={64 + i * 26} stroke={LINE} />
          <Mono x={50} y={82 + i * 26} t={`TC-0${i + 1}`} s={8.5} />
          <Lines x={96} y={76 + i * 26} ws={[96 - i * 8, 60]} gap={8} h={3.5} />
          <Chip x={232} y={73 + i * 26} w={38} c={i === 2 ? RED : GREEN} t={i === 2 ? "FAIL" : "PASS"} />
        </g>
      ))}
    </>
  ),
  "2.2": (p) => (
    <>
      {[
        { x: 60, y: 44, t: "SMOKE", c: p.deep },
        { x: 78, y: 78, t: "SANITY", c: p.a },
        { x: 96, y: 112, t: "REGRESSION", c: RED },
      ].map((s, i) => (
        <g key={s.t}>
          <Card x={s.x} y={s.y} w={168} h={46} />
          <circle cx={s.x + 24} cy={s.y + 23} r="12" fill={s.c} opacity=".18" />
          <Tick x={s.x + 24} y={s.y + 23} r={8} c={s.c} />
          <Mono x={s.x + 46} y={s.y + 20} t={s.t} s={10} c={INK} />
          <Lines x={s.x + 46} y={s.y + 28} ws={[70 - i * 10]} h={3.5} />
        </g>
      ))}
      <path d="M244 60 q20 -22 36 -4 q-6 20 -22 14 q-14 -4 -14 -10z" fill={p.soft} stroke={INK} strokeWidth="2" />
      <path d="M262 120 h30 M262 132 h22" stroke={p.a} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  "2.3": (p) => (
    <>
      <Card x={30} y={34} w={260} h={64} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={46 + i * 80} y={52} width="74" height="18" rx="4" fill={[p.soft, p.a, p.soft][i]} stroke={INK} strokeWidth="1.6" />
      ))}
      {[120, 126, 200, 206].map((x, i) => (
        <path key={i} d={`M${x} 46 V76`} stroke={INK} strokeWidth="1.6" />
      ))}
      <Mono x={46} y={90} t="0..9" s={8.5} />
      <Mono x={124} y={90} t="10..99" s={8.5} />
      <Mono x={212} y={90} t="100+" s={8.5} />
      <Card x={30} y={108} w={260} h={62} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c2) => (
          <rect key={`${r}${c2}`} x={42 + c2 * 50} y={116 + r * 13.5} width="44" height="9.5" rx="2.5" fill={r === 0 ? p.soft : (r + c2) % 3 === 0 ? p.a : "#efeff3"} />
        )),
      )}
    </>
  ),
  "3.1": (p) => (
    <>
      <Win x={28} y={30} w={170} h={136} bar={p.soft} />
      <rect x="40" y="44" width="146" height="14" rx="7" fill="#f1f1f5" />
      <circle cx="49" cy="51" r="3" fill={p.a} />
      <Lines x={40} y={70} ws={[110, 90, 120, 70]} gap={14} />
      <rect x="40" y="132" width="52" height="22" rx="11" fill={p.a} />
      <rect x="170" y="48" width="132" height="124" rx="12" fill={INK} />
      <Mono x={180} y={66} t="Network" c="#ffffff" s={8.5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="180" y={76 + i * 17} width="112" height="11" rx="3" fill="#ffffff14" />
          <Chip x={184} y={76 + i * 17 - 1} w={22} c={i === 3 ? RED : GREEN} t={i === 3 ? "404" : "200"} />
          <rect x={212} y={79 + i * 17} width={[50, 36, 62, 28, 44][i]} height="5" rx="2.5" fill={p.soft} />
        </g>
      ))}
    </>
  ),
  "3.2": (p) => (
    <>
      <Card x={30} y={44} w={130} h={92} />
      <rect x="40" y="54" width="110" height="60" rx="6" fill={p.soft} />
      <rect x="78" y="136" width="34" height="8" rx="3" fill={INK} opacity=".7" />
      <Card x={172} y={62} w={62} h={82} r={9} />
      <rect x="180" y="72" width="46" height="52" rx="5" fill={p.soft} />
      <Card x={246} y={82} w={40} h={64} r={9} />
      <rect x="252" y="92" width="28" height="40" rx="4" fill={p.soft} />
      <circle cx="268" cy="48" r="17" fill={p.a} />
      <circle cx="268" cy="41" r="3" fill="#fff" />
      <path d="M259 47 h18 M268 47 v7 M263 62 l5 -8 5 8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <Tick x={96} y={84} r={11} c={p.a} />
    </>
  ),
  "3.3": (p) => (
    <>
      <Card x={44} y={28} w={168} h={144} />
      <Mono x={58} y={48} t="BUG-142" c={p.deep} s={10} />
      <Lines x={58} y={60} ws={[130, 100]} gap={9} />
      <Chip x={58} y={90} w={54} c={RED} t="CRITICAL" />
      <Chip x={118} y={90} w={42} c="#3d85ff" t="HIGH" />
      <rect x="58" y="114" width="140" height="42" rx="8" fill="#f6f6f9" />
      <Lines x={66} y={122} ws={[104, 88, 70]} gap={10} h={3.5} />
      <Bug x={256} y={96} s={1.5} c={RED} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={224 + i * 16} cy="162" r="4.5" fill={i < 3 ? p.a : LINE} />
      ))}
    </>
  ),
  "4.1": (p) => (
    <>
      <Card x={26} y={30} w={170} h={140} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Lines x={36} y={50 + i * 24} ws={[28]} h={4} />
          <rect x={72 + [0, 22, 40, 66, 86][i]} y={45 + i * 24} width={[44, 58, 50, 40, 36][i]} height="13" rx="6.5" fill={[p.a, p.deep, p.a, RED, p.soft][i]} />
        </g>
      ))}
      <Card x={208} y={46} w={88} h={108} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c2) => (
          <rect key={`${r}${c2}`} x={218 + c2 * 25} y={58 + r * 25} width="22" height="22" rx="5" fill={[p.soft, "#9ec2ff", "#8bb4f7"][(r + c2 > 2 ? 2 : r + c2) % 3]} />
        )),
      )}
      <circle cx="268" cy="64" r="6" fill={RED} />
    </>
  ),
  "4.2": (p) => (
    <>
      {[0, 1, 2].map((c2) => (
        <g key={c2}>
          <rect x={26 + c2 * 90} y="30" width="82" height="140" rx="12" fill="#ffffffaa" stroke="#00000012" />
          <rect x={26 + c2 * 90} y="30" width="82" height="20" rx="10" fill={[p.soft, p.a, GREEN][c2]} />
          {Array.from({ length: [3, 2, 1][c2] }).map((_, i) => (
            <g key={i}>
              <Card x={34 + c2 * 90} y={58 + i * 36} w={66} h={30} r={8} />
              <Lines x={42 + c2 * 90} y={66 + i * 36} ws={[44, 30]} gap={8} h={3.5} />
              <circle cx={90 + c2 * 90} cy={78 + i * 36} r="4" fill={[p.deep, p.a, GREEN][c2]} />
            </g>
          ))}
        </g>
      ))}
    </>
  ),
  "4.3": (p) => (
    <>
      <Card x={24} y={34} w={112} h={64} />
      <Chip x={34} y={44} w={30} c={p.a} t="GET" />
      <Mono x={70} y={54} t="/users" s={9.5} />
      <Lines x={34} y={70} ws={[84, 62]} gap={9} h={3.5} />
      <Card x={24} y={110} w={112} h={64} />
      <Mono x={34} y={132} t={'{ "id": 7 }'} c={p.deep} s={9.5} />
      <Chip x={34} y={142} w={34} c={GREEN} t="200" />
      <Arrow x1={140} y1={66} x2={176} y2={96} />
      <Arrow x1={176} y1={116} x2={140} y2={142} />
      <Db x={184} y={64} c={p.soft} />
      <Card x={238} y={50} w={62} h={92} r={9} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="244" y={58 + i * 20} width="50" height="14" rx="3" fill={i === 0 ? p.soft : "#f1f1f5"} />
          <Lines x={248} y={63 + i * 20} ws={[i === 0 ? 24 : 34]} h={3.5} />
        </g>
      ))}
    </>
  ),
  "5.1": (p) => (
    <>
      <path d="M52 134 A74 74 0 0 1 200 134" fill="none" stroke={p.soft} strokeWidth="18" strokeLinecap="round" />
      <path d="M52 134 A74 74 0 0 1 164 70" fill="none" stroke={p.a} strokeWidth="18" strokeLinecap="round" />
      <path d="M126 134 L162 86" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="126" cy="134" r="9" fill={INK} />
      <Card x={218} y={44} w={72} h={86} r={12} />
      <rect x="236" y="84" width="36" height="30" rx="7" fill={p.a} stroke={INK} strokeWidth="2.4" />
      <path d="M242 84 v-10 a12 12 0 0 1 24 0 v10" fill="none" stroke={INK} strokeWidth="3" />
      <circle cx="254" cy="98" r="3.5" fill="#fff" />
      <Lines x={36} y={156} ws={[60, 44, 80]} gap={11} c={p.soft} h={6} />
      <Tick x={236} y={152} r={9} c={p.a} />
    </>
  ),
  "5.2": (p) => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 30 + (i % 3) * 88;
        const y = 36 + Math.floor(i / 3) * 76;
        return (
          <g key={i}>
            <Card x={x} y={y} w={80} h={66} r={12} />
            <rect x={x + 8} y={y + 8} width="64" height="18" rx="6" fill={[p.soft, p.a, "#9ec2ff", p.soft, "#cfe0ff", p.a][i]} />
            {[0, 1, 2, 3, 4].map((b) => (
              <rect key={b} x={x + 10 + b * 13} y={y + 58 - [14, 22, 12, 28, 18][(b + i) % 5]} width="9" height={[14, 22, 12, 28, 18][(b + i) % 5]} rx="2.5" fill={INK} opacity={0.15 + ((b + i) % 3) * 0.12} />
            ))}
          </g>
        );
      })}
    </>
  ),
  "5.3": (p) => (
    <>
      <path d="M30 150 C80 150 80 70 130 70 S190 130 240 100" fill="none" stroke={p.soft} strokeWidth="12" strokeLinecap="round" />
      <path d="M30 150 C80 150 80 70 130 70 S190 130 240 100" fill="none" stroke={p.a} strokeWidth="3.5" strokeDasharray="2 9" strokeLinecap="round" />
      {[[48, 148], [118, 76], [186, 118]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="13" fill="#fff" stroke={INK} strokeWidth="2.2" />
          <Tick x={x} y={y} r={8} />
        </g>
      ))}
      <path d="M244 100 V44" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M246 44 h40 l-9 12 9 12 h-40z" fill={RED} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <Card x={196} y={142} w={92} h={34} r={17} />
      <Tick x={216} y={159} r={8} />
      <Mono x={230} y={163} t="GO" s={11} c={p.deep} />
    </>
  ),
  "6.1": (p) => (
    <>
      <rect x="28" y="30" width="264" height="140" rx="14" fill={INK} />
      <circle cx="44" cy="44" r="3" fill="#ff6b6b" />
      <circle cx="54" cy="44" r="3" fill="#ffc53d" />
      <circle cx="64" cy="44" r="3" fill="#34c759" />
      {[
        [0, [40, p.a], [60, "#ffffff"], [36, p.soft]],
        [1, [24, "#ffffff"], [50, p.soft]],
        [2, [24, "#ffffff"], [32, p.a], [60, "#ffffff55"]],
        [3, [48, "#ffffff55"]],
        [4, [40, p.a], [30, "#ffffff"]],
        [5, [60, p.soft]],
      ].map((row) => {
        const [i, ...segs] = row as [number, ...[number, string][]];
        let x = 44 + (i === 1 || i === 2 ? 14 : i === 3 ? 28 : 0);
        return (
          <g key={i}>
            <text x="38" y={74 + i * 14} fontSize="7" fill="#ffffff55" fontFamily="ui-monospace, monospace" textAnchor="end">
              {i + 1}
            </text>
            {segs.map(([w, c], j) => {
              const r = <rect key={j} x={x} y={69 + i * 14} width={w} height="6" rx="3" fill={c} />;
              x += w + 6;
              return r;
            })}
          </g>
        );
      })}
      <text x="238" y="132" fontSize="64" fontWeight="800" fill={p.a} fontFamily="ui-monospace, monospace" opacity=".9">
        {"{}"}
      </text>
    </>
  ),
  "6.2": (p) => (
    <>
      <rect x="28" y="30" width="170" height="140" rx="14" fill={INK} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Mono x={40} y={56 + i * 22} t="$" c={p.a} s={11} />
          <rect x="54" y={49 + i * 22} width={[88, 64, 100, 46][i]} height="7" rx="3.5" fill={i === 3 ? p.a : "#ffffffcc"} />
        </g>
      ))}
      <Card x={212} y={40} w={84} h={120} r={12} />
      <path d="M232 62 V138" stroke={INK} strokeWidth="2.6" />
      <path d="M232 98 C250 98 250 80 266 80" fill="none" stroke={INK} strokeWidth="2.6" />
      {[[232, 62], [232, 98], [232, 138], [266, 80]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" fill={[p.a, p.deep, p.soft, "#9ec2ff"][i]} stroke={INK} strokeWidth="2" />
      ))}
      <Mono x={244} y={146} t="main" s={8.5} />
    </>
  ),
  "6.3": (p) => (
    <>
      <Win x={30} y={30} w={188} h={140} bar={p.soft} />
      <rect x="44" y="52" width="160" height="12" rx="6" fill="#f1f1f5" />
      <rect x="44" y="76" width="94" height="22" rx="6" fill="#f1f1f5" />
      <rect x="40" y="72" width="102" height="30" rx="8" fill="none" stroke={p.a} strokeWidth="3" strokeDasharray="6 4" />
      <rect x="44" y="114" width="70" height="22" rx="11" fill={p.a} />
      <path d="M126 112 l34 34 -14 3 8 14 -9 5 -8 -14 -11 9z" fill={INK} stroke="#fff" strokeWidth="1.5" />
      <Card x={232} y={46} w={62} h={50} r={12} />
      <path d="M252 62 l18 11 -18 11z" fill={p.a} />
      <Card x={232} y={110} w={62} h={50} r={12} />
      <Tick x={250} y={135} r={9} />
      <Lines x={264} y={131} ws={[22]} h={4} />
    </>
  ),
  "7.1": (p) => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 90} y="42" width="80" height="106" rx="14" fill="#ffffffaa" stroke={INK} strokeWidth="2" strokeDasharray="6 5" />
          <Card x={40 + i * 90} y={54} w={60} h={34} r={8} />
          <Lines x={48 + i * 90} y={62} ws={[40, 28]} gap={9} h={3.5} />
          <rect x={46 + i * 90} y="98" width="48" height="16" rx="8" fill={[p.a, p.deep, p.soft][i]} />
          <Mono x={54 + i * 90} y={110} t="setup" c="#fff" s={7.5} />
          <Tick x={70 + i * 90} y={134} r={7} />
        </g>
      ))}
      <Mono x={30} y={176} t="class LoginPage { }" c={p.deep} s={9} />
    </>
  ),
  "7.2": (p) => (
    <>
      <Card x={22} y={46} w={78} h={108} />
      <rect x="32" y="58" width="58" height="14" rx="5" fill="#f1f1f5" />
      <rect x="32" y="78" width="58" height="14" rx="5" fill="#f1f1f5" />
      <rect x="32" y="102" width="58" height="18" rx="9" fill={p.a} />
      <Arrow x1={104} y1={100} x2={120} y2={100} />
      <Card x={122} y={46} w={78} h={108} />
      <rect x="134" y="60" width="54" height="40" rx="6" fill={p.soft} stroke={INK} strokeWidth="1.8" strokeDasharray="4 3" />
      <path d="M154 90 l7 -9 6 6 8 -11" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <Lines x={134} y={112} ws={[54, 40]} gap={9} />
      <Arrow x1={204} y1={100} x2={220} y2={100} />
      <Card x={222} y={46} w={78} h={108} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="232" y={58 + i * 28} width="58" height="22" rx="6" fill={[p.soft, "#f1f1f5", "#f1f1f5"][i]} />
          <Lines x={238} y={65 + i * 28} ws={[28]} h={3.5} />
        </g>
      ))}
      <Tick x={282} y={62} r={6} c={p.a} />
    </>
  ),
  "7.3": (p) => (
    <>
      <Card x={26} y={30} w={268} h={72} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={36 + i * 42} y="42" width="36" height="28" rx="5" fill={i === 3 ? "#ffd9dc" : p.soft} stroke={i === 3 ? RED : "none"} strokeWidth="2" />
          <circle cx={54 + i * 42} cy="86" r="4.5" fill={i === 3 ? RED : GREEN} />
        </g>
      ))}
      <path d="M36 86 H270" stroke={LINE} strokeWidth="1.5" />
      <Magnifier x={86} y={146} s={0.9} c={p.a} />
      <Bug x={196} y={146} s={0.9} c={p.a} />
      <Chip x={226} y={128} w={58} c={"#3d85ff"} t="FLAKY" />
      <Chip x={226} y={148} w={58} c={GREEN} t="STABLE" />
    </>
  ),
  "8.1": (p) => (
    <>
      <path d="M160 28 L270 168 H50 Z" fill="#ffffffaa" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M160 28 L196 74 H124 Z" fill={p.a} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M124 74 H196 L233 122 H87 Z" fill={p.soft} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <Mono x={146} y={64} t="E2E" c="#fff" s={11} />
      <Mono x={146} y={104} t="API" c={p.deep} s={11} />
      <Mono x={136} y={152} t="UNIT" c={p.deep} s={11} />
      <Card x={238} y={40} w={56} h={38} r={10} />
      <Tick x={252} y={59} r={7} />
      <Lines x={264} y={55} ws={[20]} h={4} />
    </>
  ),
  "8.2": (p) => (
    <>
      {["Build", "Test", "Deploy"].map((t2, i) => (
        <g key={t2}>
          <Card x={28 + i * 98} y={70} w={80} h={60} r={14} />
          <circle cx={68 + i * 98} cy={92} r="11" fill={[p.soft, p.a, p.deep][i]} />
          <Tick x={68 + i * 98} y={92} r={8} c={[p.soft, p.a, p.deep][i] === p.soft ? p.deep : "#ffffff00"} />
          <Mono x={46 + i * 98} y={120} t={t2} s={10} />
          {i < 2 && <Arrow x1={110 + i * 98} y1={100} x2={124 + i * 98} y2={100} />}
        </g>
      ))}
      <path d="M232 52 a14 14 0 0 1 4 -26 a18 18 0 0 1 34 4 a12 12 0 0 1 0 22z" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <circle cx="56" cy="160" r="10" fill="none" stroke={INK} strokeWidth="2.4" strokeDasharray="4 3" />
      <Lines x={74} y={156} ws={[100, 60]} gap={9} c={p.soft} h={5} />
    </>
  ),
  lab: (p) => (
    <>
      <Win x={36} y={30} w={190} h={138} bar={p.soft} />
      <rect x="48" y="52" width="166" height="14" rx="7" fill="#f1f1f5" />
      <rect x="48" y="76" width="74" height="40" rx="8" fill={p.soft} />
      <Lines x={130} y={80} ws={[78, 62, 70]} gap={11} />
      <rect x="48" y="128" width="62" height="22" rx="11" fill={p.a} />
      <circle cx="176" cy="138" r="13" fill="none" stroke={RED} strokeWidth="3" strokeDasharray="5 4" />
      <Bug x={252} y={96} s={1.7} c={RED} />
      <Magnifier x={226} y={142} s={0.9} c={p.a} />
      <Tick x={266} y={160} r={10} />
    </>
  ),
  "8.3": (p) => (
    <>
      <Card x={26} y={34} w={120} h={86} />
      <rect x="36" y="44" width="100" height="40" rx="6" fill={p.soft} />
      <Lines x={36} y={94} ws={[78, 54]} gap={9} />
      <Card x={158} y={52} w={92} h={68} />
      <Mono x={168} y={72} t="</>" c={p.deep} s={14} />
      <Lines x={168} y={82} ws={[60, 44, 52]} gap={9} h={3.5} />
      <g transform="translate(262 110)">
        <path d="M0 -26 H34 V0 a17 17 0 0 1 -34 0z" fill={p.a} stroke={INK} strokeWidth="2.4" />
        <path d="M0 -20 H-10 a8 8 0 0 0 8 16 M34 -20 H44 a8 8 0 0 1 -8 16" fill="none" stroke={INK} strokeWidth="2.4" />
        <rect x="9" y="18" width="16" height="8" fill={INK} />
        <rect x="3" y="26" width="28" height="7" rx="2" fill={INK} />
      </g>
      <rect x="26" y="138" width="150" height="38" rx="14" fill="#fff" stroke="#00000014" filter="url(#sh)" />
      <circle cx="46" cy="157" r="9" fill={p.a} />
      <Lines x={64} y={150} ws={[84, 56]} gap={10} c={LINE} h={4} />
      <Chip x={196} y={148} w={64} c={BLUE} t="APPROVED" />
    </>
  ),
};

/** A drawn cover illustration for a lesson. It fills its parent and crops to fit. */
export function LessonCover({ n, track, className }: { n: string; track: Track; className?: string }) {
  const p = PAL[track];
  const scene = SCENES[n];
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <filter id="sh" x="-10%" y="-10%" width="125%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000" floodOpacity=".12" />
        </filter>
      </defs>
      <rect width="320" height="200" fill={p.bg} />
      <circle cx="292" cy="22" r="64" fill={p.soft} opacity=".45" />
      <circle cx="18" cy="188" r="52" fill={p.soft} opacity=".35" />
      {scene ? scene(p) : null}
    </svg>
  );
}
