import { PORTFOLIO_DATA } from "../data/portfolioData";
import { Reveal } from "../components/Reveal";

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee overflow-hidden py-2" aria-hidden="true">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {doubled.map((t, i) => (
          <span key={i} className="mx-2 shrink-0 rounded-full border border-line bg-white/[0.03] px-5 py-2 text-sm text-ink/85">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  const groups = Object.entries(PORTFOLIO_DATA.skillsMatrix);
  const all = groups.flatMap(([, items]) => items);
  const half = Math.ceil(all.length / 2);

  return (
    <section id="stack" className="relative z-10 bg-bg/80 py-24 sm:py-32 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-12">
        <Reveal className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Toolkit</p>
            <h2 className="section-title">Frontend to infrastructure</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Four areas I work across every day, from component libraries to Kubernetes clusters.
          </p>
        </Reveal>
      </div>

      <div className="space-y-2 mb-16">
        <Row items={all.slice(0, half)} />
        <Row items={all.slice(half)} reverse />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map(([name, items], i) => (
          <Reveal key={name} delay={i * 0.07}>
            <article className="h-full rounded-3xl border border-line bg-white/[0.03] p-6">
              <p className="eyebrow !text-mute mb-1">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-lg font-light tracking-tight text-ink mb-5">{name}</h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <li key={s} className="chip">{s}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
