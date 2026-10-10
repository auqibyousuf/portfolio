import { Award, GraduationCap, Languages } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { Reveal } from "../components/Reveal";

export function Credentials() {
  const { certifications, profile } = PORTFOLIO_DATA;
  return (
    <section id="credentials" className="relative z-10 bg-bg/80 py-24 sm:py-32 px-6 sm:px-12 border-t border-line">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-14 max-w-3xl">
          <p className="eyebrow mb-4">Credentials</p>
          <h2 className="section-title">Verified and certified</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <article className="h-full rounded-3xl border border-line bg-white/[0.03] p-7 flex flex-col">
                <Award className="h-6 w-6 text-leaf mb-8" aria-hidden="true" />
                <h3 className="text-xl font-light tracking-tight text-ink">{c.name}</h3>
                <p className="mt-auto pt-8 text-xs text-mute">{c.issuer}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Reveal>
            <div className="flex items-start gap-4 rounded-3xl border border-line bg-white/[0.03] p-7">
              <GraduationCap className="h-6 w-6 shrink-0 text-bloom" aria-hidden="true" />
              <div>
                <p className="text-lg font-light text-ink">{profile.education.degree}</p>
                <p className="mt-1 text-sm text-mute">
                  {profile.education.institution} · {profile.education.years}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex items-start gap-4 rounded-3xl border border-line bg-white/[0.03] p-7">
              <Languages className="h-6 w-6 shrink-0 text-bloom" aria-hidden="true" />
              <div>
                <p className="text-lg font-light text-ink">Languages</p>
                <p className="mt-1 text-sm text-mute">{profile.languages}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
