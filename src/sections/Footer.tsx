import { SITE } from "../data/site";
import { Ticker } from "../components/Ticker";
import { GithubIcon, LinkedinIcon } from "../components/icons";

export function Footer() {
  const { profile, footer } = SITE;
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <Ticker items={footer.ticker} className="border-b border-white/10 py-3 text-white/60" />

      <div className="mx-auto max-w-[1280px] px-6 pt-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="label !text-white/50">Focus areas</p>
            <ul className="mt-4 space-y-2 text-sm font-semibold">
              {footer.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label !text-white/50">Location</p>
            <p className="mt-4 text-sm font-semibold">{profile.location}</p>
          </div>
          <div>
            <p className="label !text-white/50">Status</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {profile.availability}
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-display text-[clamp(2.6rem,10.4vw,9.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em]">{profile.name}</p>
          <p className="mt-2 font-script text-4xl text-accent sm:text-6xl">{profile.title}</p>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/10 py-8 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-white"><GithubIcon /> GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-white"><LinkedinIcon /> LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="transition-colors hover:text-white">Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
