import { useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { LiquidMetalButton } from "@designcodeio/threeui/components/LiquidMetalButton";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { GithubIcon, LinkedinIcon } from "../components/icons";
import { Reveal } from "../components/Reveal";

export function Contact() {
  const p = PORTFOLIO_DATA.profile;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${p.email}`;
    }
  };

  return (
    <footer id="contact" className="relative z-10 bg-bg/85 pt-28 sm:pt-40 pb-10 px-6 sm:px-12 border-t border-line">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <p className="eyebrow mb-6">Contact</p>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-[1.02] text-ink max-w-4xl">
            Let&rsquo;s build something resilient.
          </h2>
          <p className="mt-8 max-w-xl text-sm sm:text-base leading-relaxed text-mute">
            Open to senior frontend consulting, decoupled React and Next.js with Drupal, and cloud DevOps engineering.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-5">
          <LiquidMetalButton variant="pill" text={copied ? "Email copied" : "Copy my email"} onClick={copy} />
          <a href={`mailto:${p.email}`} className="inline-flex items-center gap-2 text-sm text-ink hover:text-leaf transition-colors">
            <Mail className="h-4 w-4" /> {p.email}
          </a>
          <span className="inline-flex items-center gap-2 text-sm text-mute">
            <Phone className="h-4 w-4" /> {p.phone}
          </span>
          <span role="status" className="sr-only">{copied ? "Email address copied to clipboard" : ""}</span>
        </Reveal>

        <div className="mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-t border-line pt-8 text-xs text-mute">
          <div className="flex items-center gap-6">
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink transition-colors">
              <GithubIcon /> GitHub
            </a>
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink transition-colors">
              <LinkedinIcon /> LinkedIn
            </a>
            <button type="button" onClick={copy} className="inline-flex items-center gap-2 hover:text-ink transition-colors cursor-pointer">
              {copied ? <Check className="h-4 w-4 text-leaf" /> : <Copy className="h-4 w-4" />} Copy email
            </button>
          </div>
          <p>
            &copy; {new Date().getFullYear()} {p.name} · {p.education.degree}
          </p>
        </div>
      </div>
    </footer>
  );
}
