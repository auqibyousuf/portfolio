import React, { useState } from "react";
import {
  Server,
  Layout,
  CheckCircle2,
  RefreshCw,
  Database,
  Cloud,
  Terminal,
  Activity,
  GitBranch,
} from "lucide-react";
import { motion } from "framer-motion";

export const DecoupledVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedStepIndex, setSimulatedStepIndex] = useState<number>(-1);
  const [deployCount, setDeployCount] = useState(152);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([
    "✓ System ready: S3 remote state verified.",
    "✓ ArgoCD sync: apps in synced and healthy state.",
    "✓ Core Web Vitals: LCP 0.8s, CLS 0.01, INP 42ms.",
  ]);

  const stepExecutionLogs: Record<string, string[]> = {
    cms: [
      "[01/07 CMS] Fetching schema definitions & publishing webhook received...",
      "[01/07 CMS] Content revision tagged: cache-tags invalidated for edge nodes.",
    ],
    api: [
      "[02/07 API] Dispatching Kafka event to topics 'content.published' & 'cdn.purge'...",
      "[02/07 API] API Gateway health: 200 OK across REST & GraphQL resolvers.",
    ],
    iac: [
      "[03/07 IaC] terraform init -backend-config=s3-backend.tfvars...",
      "[03/07 IaC] Acquiring state lock in DynamoDB table: e-state-lock... OK.",
      "[03/07 IaC] ansible-playbook -i inventories/prod site.yml --syntax-check: PASSED.",
    ],
    cicd: [
      "[04/07 CI/CD] Jenkins Pipeline trigger: commit verified on master.",
      "[04/07 CI/CD] Gradle build executing with daemon cache... (saved 20% runtime).",
      "[04/07 CI/CD] Docker build -t 7006599249.dkr.ecr.aws/portal:v2.4.1 . -> Pushed ECR.",
    ],
    k8s: [
      "[05/07 K8s] Helm upgrade --install portal ./chart -f values-prod.yaml...",
      "[05/07 K8s] ArgoCD reconciling GitOps state: Pods rolling update 6/6 Ready.",
      "[05/07 K8s] Ingress ALB route active: TLS Cert valid.",
    ],
    obs: [
      "[06/07 OBS] ELK log shipper (Logstash/Filebeat) connected. Ingesting 2.4k events/sec.",
      "[06/07 OBS] DataDog APM & CloudWatch Alarms: Error rate 0.001%, latency p99: 48ms.",
    ],
    frontend: [
      "[07/07 EDGE] Next.js ISR on-demand revalidation succeeded on Edge CDN.",
      "[07/07 EDGE] Core Web Vitals test: LCP 0.65s (Sub-second), CLS 0.00, INP 38ms.",
      "🚀 DEPLOYMENT COMPLETED SUCCESSFULLY ACROSS ALL CLUSTER REGIONS!",
    ],
  };

  const triggerDeploy = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setPipelineLogs(["⚡ Triggering Full Automated Pipeline Run..."]);
    
    const stepOrder = ["cms", "api", "iac", "cicd", "k8s", "obs", "frontend"];
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < stepOrder.length) {
        const stepId = stepOrder[currentIdx];
        setActiveStep(stepId);
        setSimulatedStepIndex(currentIdx);
        setPipelineLogs((prev) => [
          ...prev.slice(-4),
          ...(stepExecutionLogs[stepId] || []),
        ]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setSimulatedStepIndex(-1);
        setActiveStep(null);
        setIsSimulating(false);
        setDeployCount((c) => c + 1);
      }
    }, 750);
  };

  const steps = [
    {
      id: "cms",
      title: "Backend CMS & Content Layer",
      subtitle: "Headless Content Mesh",
      icon: <Database className="w-4 h-4 text-blue-500 dark:text-[#89AACC]" />,
      desc: "Structured content models, taxonomy, revisions, editorial workflows & component schemas across any backend CMS.",
      badge: "CMS Layer",
      tech: "Headless CMS / Content APIs",
    },
    {
      id: "api",
      title: "API Gateway & Messaging",
      subtitle: "REST, GraphQL & Kafka",
      icon: <Server className="w-4 h-4 text-sky-500 dark:text-[#4E85BF]" />,
      desc: "Normalized query responses with cache-tags, Kafka event-driven messaging, and clean separation of concerns.",
      badge: "API & Event Streaming",
      tech: "REST / GraphQL / Kafka",
    },
    {
      id: "iac",
      title: "IaC & Automated Provisioning",
      subtitle: "Terraform & Ansible",
      icon: <Terminal className="w-4 h-4 text-purple-500 dark:text-purple-400" />,
      desc: "Terraform remote state backend with AWS S3 & DynamoDB state locking; Ansible automated host configuration.",
      badge: "Infrastructure as Code",
      tech: "Terraform / Ansible",
    },
    {
      id: "cicd",
      title: "CI/CD & Container Build",
      subtitle: "Jenkins, GitHub Actions & Docker",
      icon: <GitBranch className="w-4 h-4 text-orange-500 dark:text-orange-400" />,
      desc: "Automated pipelines, Gradle build optimization (-20% build time), test suites, and Docker container packaging.",
      badge: "Continuous Integration",
      tech: "Jenkins / GitHub Actions / Docker",
    },
    {
      id: "k8s",
      title: "Cloud & GitOps Orchestration",
      subtitle: "AWS EKS, Helm & ArgoCD",
      icon: <Cloud className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
      desc: "Kubernetes workloads on AWS EKS, standardized Helm deployment charts, and ArgoCD declarative GitOps delivery.",
      badge: "Container Orchestration",
      tech: "Kubernetes / Helm / ArgoCD",
    },
    {
      id: "obs",
      title: "Telemetry & Observability",
      subtitle: "ELK Stack, DataDog & CloudWatch",
      icon: <Activity className="w-4 h-4 text-rose-500 dark:text-rose-400" />,
      desc: "Centralized logging with ELK, production monitoring with DataDog & CloudWatch, alerting, and incident response.",
      badge: "Observability",
      tech: "ELK Stack / DataDog / CloudWatch",
    },
    {
      id: "frontend",
      title: "Frontend Presentation Layer",
      subtitle: "React & Next.js Edge UI",
      icon: <Layout className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
      desc: "Decoupled SSR/ISR edge delivery, design systems (Storybook), WCAG accessibility, and sub-second Core Web Vitals.",
      badge: "Edge Presentation",
      tech: "React / Next.js / Tailwind CSS",
    },
  ];

  return (
    <div className="w-full rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] p-6 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-colors">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[hsl(var(--muted))]">
              Architecture Sandbox
            </span>
            <span className="opacity-30">•</span>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
              End-to-End Delivery Pipeline
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--text))]">
            Headless CMS to Cloud Delivery Engine
          </h3>
          <p className="text-xs sm:text-sm text-[hsl(var(--muted))] mt-1 max-w-2xl font-sans">
            Interactive visualization of Auqib's production pipeline: integrating headless CMS content layers with event APIs, Terraform & Ansible IaC, Jenkins CI/CD, AWS Kubernetes GitOps, ELK observability, and modern React/Next.js edge presentation.
          </p>
        </div>

        <button
          onClick={triggerDeploy}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[hsl(var(--bg))] hover:opacity-80 border border-[hsl(var(--stroke))] text-xs font-semibold text-[hsl(var(--text))] transition-all self-start sm:self-auto cursor-pointer font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isSimulating ? "animate-spin" : ""}`} />
          <span>{isSimulating ? "Running GitOps Pipeline..." : "Trigger Full Pipeline"}</span>
        </button>
      </div>

      {/* 7-Step Interactive Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 relative font-mono">
        {steps.map((st, i) => {
          const isActive = activeStep === st.id;
          const isCurrentlyProcessing = isSimulating && simulatedStepIndex === i;
          const isCompletedInRun = isSimulating && simulatedStepIndex > i;

          return (
            <div
              key={st.id}
              onClick={() => setActiveStep((curr) => (curr === st.id ? null : st.id))}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isCurrentlyProcessing
                  ? "bg-blue-500/10 border-blue-500 shadow-xl scale-[1.03] ring-2 ring-blue-500/50"
                  : isActive
                  ? "bg-[hsl(var(--bg))] border-blue-500 shadow-lg scale-[1.02]"
                  : "bg-[hsl(var(--surface))] border-[hsl(var(--stroke))] hover:border-[hsl(var(--muted))]"
              } ${i === 6 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl border transition-colors ${
                    isCurrentlyProcessing 
                      ? "bg-blue-500 text-white border-blue-400 animate-pulse" 
                      : isCompletedInRun
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
                      : "bg-[hsl(var(--bg))] border-[hsl(var(--stroke))]"
                  }`}>
                    {st.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isCurrentlyProcessing && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    )}
                    {isCompletedInRun && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[hsl(var(--muted))]">
                      0{i + 1} / 07
                    </span>
                  </div>
                </div>

                <div className="text-[9px] uppercase tracking-wider font-semibold text-blue-500 dark:text-[#89AACC] mb-1">
                  {st.badge}
                </div>
                <h4 className="text-sm font-bold text-[hsl(var(--text))] leading-tight mb-1">
                  {st.title}
                </h4>
                <p className="text-[11px] text-[hsl(var(--muted))] mb-2.5">
                  {st.subtitle}
                </p>
                <p className="text-[11px] text-[hsl(var(--text))]/80 leading-relaxed font-sans mb-3">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[hsl(var(--stroke))]/60 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-[hsl(var(--muted))]">
                  {st.tech}
                </span>
                {isCurrentlyProcessing && (
                  <span className="text-[9px] font-bold text-blue-500 animate-pulse">Running...</span>
                )}
              </div>

              {isActive && !isCurrentlyProcessing && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-2xl border-2 border-blue-500 pointer-events-none"
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Live Pipeline Terminal Stream Console */}
      <div className="mb-6 rounded-2xl bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[hsl(var(--stroke))]/60 text-[10px] text-[hsl(var(--muted))]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold uppercase tracking-wider text-[hsl(var(--text))]">
              Execution Terminal Log Stream
            </span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))]">
            {isSimulating ? "STATUS: EXECUTING" : "STATUS: IDLE / READY"}
          </span>
        </div>

        <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-[11px]">
          {pipelineLogs.map((log, lIdx) => (
            <div key={lIdx} className="flex items-start gap-2">
              <span className="text-blue-500 select-none">&gt;</span>
              <span className={log.includes("✓") || log.includes("SUCCESS") ? "text-emerald-500" : log.includes("⚡") ? "text-sky-400 font-bold" : "text-[hsl(var(--text))]/90"}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Pipeline Telemetry Footer */}
      <div className="p-5 rounded-2xl bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-[hsl(var(--text))] flex items-center gap-2">
              <span>Cloud & CI/CD Pipeline: Terraform • Jenkins • AWS EKS • ArgoCD • ELK</span>
            </div>
            <p className="text-[11px] text-[hsl(var(--muted))]">
              Automated deployments: <span className="text-[hsl(var(--text))] font-bold">{deployCount}</span> • Real-world TTFB: <span className="text-emerald-500 font-bold">68ms</span> • Build duration reduction: <span className="text-blue-500 font-bold">20%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto text-[11px] text-[hsl(var(--muted))]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Observability Health: <code className="text-[hsl(var(--text))] font-bold">Passing (ELK/DataDog)</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};
