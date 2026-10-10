import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MetalButton } from "../components/MetalButton";
import { SectionScene } from "../components/SectionScene";
import { Reveal } from "../components/Reveal";

const STEPS = [
  { id: "cms", title: "Backend CMS & Content Layer", subtitle: "Headless content mesh", tech: "Headless CMS / Content APIs", desc: "Structured content models, taxonomy, revisions, editorial workflows and component schemas across any backend CMS." },
  { id: "api", title: "API Gateway & Messaging", subtitle: "REST, GraphQL & Kafka", tech: "REST / GraphQL / Kafka", desc: "Normalised query responses with cache tags, Kafka event-driven messaging and a clean separation of concerns." },
  { id: "iac", title: "IaC & Automated Provisioning", subtitle: "Terraform & Ansible", tech: "Terraform / Ansible", desc: "Terraform remote state on S3 with DynamoDB locking, and Ansible host configuration." },
  { id: "ci", title: "CI/CD & Container Build", subtitle: "Jenkins, GitHub Actions & Docker", tech: "Jenkins / GitHub Actions / Docker", desc: "Automated pipelines, Gradle build optimisation (20% faster), test suites and Docker packaging." },
  { id: "k8s", title: "Cloud & GitOps Orchestration", subtitle: "AWS EKS, Helm & ArgoCD", tech: "EKS / Helm / ArgoCD", desc: "Kubernetes workloads on EKS, standard Helm charts and ArgoCD declarative GitOps delivery." },
  { id: "obs", title: "Telemetry & Observability", subtitle: "ELK, DataDog & CloudWatch", tech: "ELK / DataDog / CloudWatch", desc: "Centralised logging with ELK, production monitoring, alerting and incident response." },
  { id: "ui", title: "Frontend Presentation Layer", subtitle: "React & Next.js edge UI", tech: "React / Next.js / Storybook", desc: "Decoupled SSR and ISR edge delivery, design systems, WCAG accessibility and sub-second Core Web Vitals." },
];

export function Architecture() {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => {
        if (i >= STEPS.length - 1) {
          setRunning(false);
          return i;
        }
        return i + 1;
      });
    }, 1100);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running]);

  const run = () => {
    setIndex(0);
    setRunning(true);
  };

  const step = STEPS[index];

  return (
    <section id="architecture" className="overflow-hidden relative py-24 sm:py-32 px-6 sm:px-12 border-t border-line">
      <SectionScene scene="infrastructure" strength={0.8} />
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-14 max-w-3xl">
          <p className="eyebrow mb-4">Engineering sandbox</p>
          <h2 className="section-title mb-6">From headless CMS to cloud delivery</h2>
          <p className="text-sm sm:text-base leading-relaxed text-mute">
            How a decoupled React and Next.js front end meets any backend CMS, Terraform and Ansible provisioning, Jenkins
            pipelines, GitOps on EKS and observability. Run the pipeline to walk through each layer.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-start">
          <ol className="relative">
            <span aria-hidden="true" className="absolute left-[15px] top-3 bottom-3 w-px bg-line" />
            <motion.span
              aria-hidden="true"
              className="absolute left-[15px] top-3 w-px origin-top bg-leaf"
              animate={{ height: `calc(${(index / (STEPS.length - 1)) * 100}% - 0.5rem)` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    setIndex(i);
                  }}
                  aria-current={i === index ? "step" : undefined}
                  className="relative flex w-full items-center gap-5 py-3 text-left cursor-pointer"
                >
                  <span
                    className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs tabular-nums transition-colors ${
                      i <= index ? "border-leaf bg-leaf text-bg" : "border-line bg-bg text-mute"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-base sm:text-lg font-light tracking-tight transition-colors ${i === index ? "text-ink" : "text-mute"}`}>
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-line bg-white/[0.03] backdrop-blur-sm p-7 sm:p-9">
              <motion.div key={step.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <p className="eyebrow mb-3">{`Layer ${index + 1} of ${STEPS.length}`}</p>
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-ink">{step.title}</h3>
                <p className="mt-1 text-sm text-leaf">{step.subtitle}</p>
                <p className="mt-6 text-sm sm:text-base leading-relaxed text-mute">{step.desc}</p>
                <p className="mt-8 inline-flex rounded-full border border-line px-4 py-1.5 text-xs text-ink/80">{step.tech}</p>
              </motion.div>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <MetalButton text={running ? "Running…" : "Run pipeline"} onClick={run} />
              <span className="text-xs text-mute">{running ? "Deploying through every layer" : "Walk through the full delivery chain"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
