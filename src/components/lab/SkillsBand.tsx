import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Check } from "lucide-react";

/** Simplified tool marks drawn as inline SVG (Word, Figma, Chrome, Postman, Excel) used as each skill's badge. */
const Word = () => (
  <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
    <rect width="48" height="48" rx="11" fill="#2b579a" />
    <rect x="17" y="9" width="24" height="30" rx="3" fill="#fff" opacity=".18" />
    <path d="M9 14h18v20H9z" fill="#1e3f78" />
    <text x="18" y="30.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">W</text>
    <path d="M30 18h9M30 24h9M30 30h9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
  </svg>
);
const Figma = () => (
  <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
    <rect width="48" height="48" rx="11" fill="#fff" />
    <g transform="translate(14 8)">
      <path d="M0 5a5 5 0 0 1 5-5h5v10H5a5 5 0 0 1-5-5z" fill="#f24e1e" />
      <path d="M10 0h5a5 5 0 0 1 0 10h-5z" fill="#ff7262" />
      <path d="M0 15a5 5 0 0 1 5-5h5v10H5a5 5 0 0 1-5-5z" fill="#a259ff" />
      <circle cx="15" cy="15" r="5" fill="#1abcfe" />
      <path d="M0 25a5 5 0 0 1 5-5h5v5a5 5 0 0 1-10 0z" fill="#0acf83" />
    </g>
  </svg>
);
const Chrome = () => (
  <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
    <rect width="48" height="48" rx="11" fill="#fff" />
    <g transform="translate(24 24)">
      <path d="M0 0L-20.8-12A24 24 0 0 1 20.8-12z" fill="#ea4335" transform="scale(.8)" />
      <path d="M0 0L20.8-12A24 24 0 0 1 0 24z" fill="#fbbc04" transform="scale(.8)" />
      <path d="M0 0L0 24A24 24 0 0 1 -20.8-12z" fill="#34a853" transform="scale(.8)" />
      <circle r="8.5" fill="#fff" />
      <circle r="6.2" fill="#4285f4" />
    </g>
  </svg>
);
const Postman = () => (
  <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
    <rect width="48" height="48" rx="11" fill="#fff" />
    <circle cx="24" cy="24" r="17" fill="#ff6c37" />
    <path d="M17 32l9-9" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M26 23l3.5-3.5a3.2 3.2 0 1 1 4.5 4.5L30.5 27.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <circle cx="16" cy="33" r="2.4" fill="#fff" />
  </svg>
);
const Excel = () => (
  <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
    <rect width="48" height="48" rx="11" fill="#217346" />
    <rect x="17" y="9" width="24" height="30" rx="3" fill="#fff" opacity=".2" />
    <path d="M9 14h18v20H9z" fill="#185c37" />
    <text x="18" y="30.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">X</text>
    <path d="M30 17h9M30 23h9M30 29h9M34.5 14v18" stroke="#fff" strokeWidth="1.6" opacity=".85" />
  </svg>
);

const skills = [
  { logo: <Word />, tool: "Word", title: "Read BRD & Documents", items: ["Understand requirements", "Spot gaps and ambiguity", "Turn them into test ideas"] },
  { logo: <Figma />, tool: "Figma", title: "Design Testing", items: ["Layout and consistency", "Visual and spacing checks", "Usability and accessibility"] },
  { logo: <Chrome />, tool: "Chrome", title: "Frontend Testing", items: ["Forms and validation", "Navigation and links", "Search, filters and sorting"] },
  { logo: <Postman />, tool: "Postman", title: "Backend Testing (API)", items: ["Requests and responses", "Status codes", "Data and error handling"] },
  { logo: <Excel />, tool: "Excel", title: "Bug Reporting", items: ["Steps to reproduce", "Expected vs. actual", "Severity and evidence"] },
];

/** Dark band of five skill cards, each with an initials badge and a short check list. */
export function SkillsBand() {
  return (
    <section className="bg-[#141414] py-20 text-white sm:py-28" aria-labelledby="skills-title">
      <div className="container-x">
        <Reveal>
          <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-white/60">
            <span className="size-2 rounded-full bg-lime" /> By skill
          </p>
        </Reveal>
        <SplitText id="skills-title" className="h-section mt-4 max-w-[760px] text-balance" parts={[{ text: "Skills you'll practice." }]} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {skills.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 70} className="h-full">
                <article className="flex h-full flex-col rounded-[32px] border border-white/[0.07] bg-[#262626] p-6">
                  <span role="img" aria-label={`${s.tool} logo`} className="block size-[56px] overflow-hidden rounded-full">{s.logo}</span>
                  <h3 className="mt-6 min-h-[3.2rem] text-[1.25rem] font-medium leading-snug tracking-[-0.03em]">{s.title}</h3>
                  <ul className="mt-4 grid gap-3">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-[15px] leading-snug text-white/70">
                        <Check className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={2.6} aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
