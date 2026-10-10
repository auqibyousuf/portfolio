import { PORTFOLIO_DATA } from "./portfolioData";

/**
 * Everything the page renders that is not already in portfolioData.ts. Facts, numbers and claims are derived from
 * portfolioData wherever possible so there is a single source of truth; edit either file and the page follows.
 */
const { profile, stats, projects, experiences, skillsMatrix, certifications } = PORTFOLIO_DATA;

export const SITE = {
  monogram: "AY",
  firstName: "Auqib",
  watermark: "AUQIB",
  nav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Achievements", href: "#achievements" },
  ],

  preloader: {
    status: [
      "// SYSTEM BOOT SEQUENCE",
      "mounting components",
      "warming up the cluster",
      "compiling design tokens",
      "ready for deployment",
    ],
  },

  hero: {
    greeting: `Hi, I'm ${profile.name}`,
    headline: ["I build", "resilient", "web platforms."],
    emphasis: "resilient",
    intro: `${profile.experienceYears} years across React, Next.js, headless Drupal, Kubernetes and AWS, delivering enterprise platforms that are fast, accessible and straightforward to operate.`,
    chips: [
      { value: `${stats[0].number}${stats[0].suffix}`, label: stats[0].label },
      { value: `${stats[1].number}${stats[1].suffix}`, label: stats[1].label },
    ],
    marqueeTop: ["React", "Next.js", "TypeScript", "Drupal 10/11", "Tailwind CSS", "GraphQL", "Storybook", "WCAG AA"],
    marqueeBottom: ["Kubernetes", "AWS EKS", "Terraform", "ArgoCD", "Helm", "Jenkins", "Docker", "ELK Stack"],
  },

  about: {
    title: "Frontend craft, backed by cloud fluency.",
    paragraphs: [
      profile.bio,
      `Most recently at ${experiences[0].company} I re-engineered a Drupal front end into a decoupled Next.js architecture and cut CI/CD build times by 20%, while running the AWS EKS clusters it shipped on.`,
    ],
    facts: [
      { label: "Education", value: `${profile.education.degree}, ${profile.education.institution} (${profile.education.years})` },
      { label: "Based in", value: profile.location },
      { label: "Languages", value: profile.languages },
      { label: "Training", value: certifications.map((c) => c.issuer.split(" / ")[0]).join(", ") + " certified" },
    ],
    selected: projects.filter((p) => p.featured).slice(0, 3),
  },

  experience: {
    title: "Seven years of shipping.",
    intro: "From component libraries to Kubernetes clusters: the roles that shaped how I build.",
    items: experiences,
  },

  projects: {
    title: "Selected work",
    intro: "Enterprise platforms and cloud infrastructure, delivered for client accounts and product teams.",
    ticker: [
      `${projects.length} PROJECTS`,
      "ENTERPRISE PLATFORMS",
      "HEADLESS CMS",
      "CLOUD INFRASTRUCTURE",
      "ACCESSIBLE BY DEFAULT",
    ],
    items: projects,
  },

  skills: {
    title: "A toolkit built across the stack.",
    descriptions: {
      "Frontend Engineering": "Component-driven interfaces in React and Next.js, built for accessibility and strong Core Web Vitals.",
      "Headless CMS & Architecture": "Decoupled Drupal and Next.js systems with clean API boundaries and reusable component libraries.",
      "Cloud & DevOps (AWS)": "Containers, Kubernetes, GitOps and infrastructure as code on AWS, automated end to end.",
      "Observability & Testing": "Logging, monitoring and test suites that keep releases uneventful.",
    } as Record<string, string>,
    ticker: ["FRONTEND", "HEADLESS CMS", "CLOUD", "DEVOPS", "OBSERVABILITY", "TESTING"],
    matrix: skillsMatrix,
  },

  achievements: {
    title: "Results I am proud of.",
    feature: {
      value: "18+",
      label: "Enterprise migrations",
      text: "WordPress to Drupal migrations delivered with 100% WCAG AA compliance.",
      source: "Axelerant Technologies",
    },
    highlights: [
      { value: "20%", label: "Faster CI/CD builds", text: "Gradle pipeline optimisation on Java applications.", source: experiences[0].company },
      { value: "20%", label: "Lower infrastructure cost", text: "Kubernetes adoption with ArgoCD GitOps.", source: "Learntastic" },
      { value: "350k+", label: "Learners served", text: "Healthcare certification portals used by active trainees.", source: "AHCA / ACCA / ACLS" },
      { value: "50%", label: "Faster processing", text: "Student management system for an institution.", source: "Earlier role" },
    ],
    certifications,
    ticker: ["CERTIFIED", "COMMENDED", "SHIPPED", "ACCESSIBLE", "AUTOMATED"],
  },

  contact: {
    title: "Let's build something resilient.",
    intro: "Open to senior frontend consulting, decoupled React and Next.js with Drupal, and cloud DevOps engineering.",
    ticker: ["OPEN CHANNEL", "AVAILABLE FOR SENIOR ROLES", `BASED IN ${profile.location.toUpperCase()}`, "REPLIES WITHIN A DAY"],
    /** Optional form endpoint (for example a Formspree URL). Without it the form opens the visitor's email app. */
    endpoint: (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) || undefined,
  },

  footer: {
    ticker: ["// TRANSMISSION", "STATUS: AVAILABLE", "ALL SYSTEMS NOMINAL"],
    focus: ["Frontend architecture", "Headless CMS", "Cloud & DevOps"],
  },

  profile,
};
