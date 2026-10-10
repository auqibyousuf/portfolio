import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { SITE } from "../data/site";
import { Character } from "../components/Character";
import { Ticker } from "../components/Ticker";
import { Reveal } from "../components/Reveal";
import { GithubIcon, LinkedinIcon } from "../components/icons";

type Status = "idle" | "loading" | "success" | "error";
type Values = { firstName: string; lastName: string; email: string; message: string; consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { firstName: "", lastName: "", email: "", message: "", consent: false };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.lastName.trim()) e.lastName = "Enter your last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Write at least 10 characters.";
  if (!v.consent) e.consent = "Please agree so I can reply to you.";
  return e;
}

export function Contact() {
  const { contact, profile } = SITE;
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const wmX = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"]);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("loading");
    try {
      if (contact.endpoint) {
        const res = await fetch(contact.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        // No form backend configured: hand the message to the visitor's email app instead.
        const subject = encodeURIComponent(`Portfolio enquiry from ${values.firstName} ${values.lastName}`);
        const body = encodeURIComponent(`${values.message}\n\n${values.firstName} ${values.lastName}\n${values.email}`);
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const field = (id: keyof Values) =>
    `w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mute/60 focus:border-accent ${
      errors[id] ? "border-accent" : "border-line"
    }`;

  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-white py-24 sm:py-32">
      <motion.span
        aria-hidden="true"
        style={{ x: wmX, fontSize: "clamp(8rem, 26vw, 24rem)", color: "transparent", WebkitTextStroke: "2px rgba(15,18,24,0.06)" }}
        className="pointer-events-none absolute top-4 left-0 select-none whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.05em]"
      >
        CONTACT
      </motion.span>

      <Ticker items={contact.ticker} className="absolute inset-x-0 top-0 border-b border-line py-3 text-mute" />

      <div className="relative mx-auto mt-6 grid max-w-[1280px] gap-12 px-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col">
          <Reveal>
            <p className="section-no mb-5">06 &nbsp;/&nbsp; CONTACT</p>
            <h2 className="h-display text-[clamp(2.4rem,5.6vw,4.6rem)]">{contact.title}</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-mute sm:text-lg">{contact.intro}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3 text-sm">
              <li><a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 font-semibold hover:text-accent"><Mail className="h-4 w-4 text-accent" /> {profile.email}</a></li>
              <li className="flex items-center gap-3 text-mute"><Phone className="h-4 w-4 text-accent" /> {profile.phone}</li>
              <li className="flex items-center gap-3 text-mute"><MapPin className="h-4 w-4 text-accent" /> {profile.location}</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper transition-colors hover:bg-ink hover:text-white"><GithubIcon /></a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper transition-colors hover:bg-ink hover:text-white"><LinkedinIcon /></a>
            </div>
          </Reveal>

          <div className="mt-10 hidden w-[230px] lg:block" aria-hidden="true">
            <Character pose="present" className="float-slow h-auto w-full drop-shadow-[0_22px_28px_rgba(15,18,24,0.16)]" />
          </div>
        </div>

        <Reveal delay={0.08}>
          <form onSubmit={submit} noValidate className="glass rounded-card !bg-white/80 p-6 sm:p-9" aria-describedby="cf-status">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cf-firstName" className="label mb-2 block">First name</label>
                <input id="cf-firstName" name="firstName" autoComplete="given-name" value={values.firstName} onChange={(e) => set("firstName", e.target.value)} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "cf-firstName-err" : undefined} className={field("firstName")} placeholder="Ada" />
                {errors.firstName && <p id="cf-firstName-err" className="mt-1.5 text-xs font-semibold text-accent">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="cf-lastName" className="label mb-2 block">Last name</label>
                <input id="cf-lastName" name="lastName" autoComplete="family-name" value={values.lastName} onChange={(e) => set("lastName", e.target.value)} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? "cf-lastName-err" : undefined} className={field("lastName")} placeholder="Lovelace" />
                {errors.lastName && <p id="cf-lastName-err" className="mt-1.5 text-xs font-semibold text-accent">{errors.lastName}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="cf-email" className="label mb-2 block">Email</label>
              <input id="cf-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} className={field("email")} placeholder="you@company.com" />
              {errors.email && <p id="cf-email-err" className="mt-1.5 text-xs font-semibold text-accent">{errors.email}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="cf-message" className="label mb-2 block">Message</label>
              <textarea id="cf-message" name="message" rows={5} value={values.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "cf-message-err" : undefined} className={`${field("message")} resize-y`} placeholder="Tell me about the project, the team and the timeline." />
              {errors.message && <p id="cf-message-err" className="mt-1.5 text-xs font-semibold text-accent">{errors.message}</p>}
            </div>

            <div className="mt-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-mute">
                <input id="cf-consent" type="checkbox" checked={values.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4223A]" />
                <span>I agree to be contacted about this enquiry. Your details are used only to reply to you.</span>
              </label>
              {errors.consent && <p className="mt-1.5 text-xs font-semibold text-accent">{errors.consent}</p>}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={status === "loading"} className="btn btn-accent disabled:opacity-70">
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {status === "loading" ? "Sending" : "Send message"}
              </motion.button>
              <p id="cf-status" role="status" aria-live="polite" className="text-sm">
                {status === "success" && (
                  <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> {contact.endpoint ? "Thanks. Your message is on its way." : "Your email app should open with the message ready to send."}
                  </span>
                )}
                {status === "error" && (
                  <span className="inline-flex items-center gap-2 font-semibold text-accent">
                    <AlertCircle className="h-4 w-4" /> Something went wrong. Please email {profile.email} directly.
                  </span>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
