import { useState, useEffect, useRef } from 'react';
import p1 from './pics/p1.png';
import hamza2 from './pics/HR.jpeg';
import p2 from './pics/p2.png';
import p3 from './pics/p3.png';
import t1 from './pics/t1.jpeg';
import t2 from './pics/t2.jpeg';
import {
  Menu, X, Home, Code2, Briefcase, Mail, Github, Linkedin, ChevronRight, ChevronLeft,
  MapPin, Zap, FileText, GitBranch, Settings, Monitor, Globe,
  ArrowRight, Layers, Terminal, Bot, ShieldCheck, GraduationCap,
  CheckCircle2, Sparkles, Activity
} from 'lucide-react';
import { marked } from 'marked';
import article1Raw from './article-1-email-automation.md?raw';
import article2Raw from './article-2-document-intelligence.md?raw';
import article3Raw from './article-3-workflow-orchestration.md?raw';
import Loader from './components/Loader';

const SOCIAL = {
  github: 'https://github.com/HamzaRaies?tab=repositories',
  linkedin: 'https://www.linkedin.com/in/hamza-raies-/',
  calendly: 'https://calendly.com/hamzaraies-info/30min',
};

function useIntersect(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12, ...options });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [options]);
  return [ref, visible] as const;
}

function cleanArticleMarkdown(raw: string) {
  return raw
    .replace(/^\*\*Meta Title:\*\*.*$/gm, '')
    .replace(/^\*\*Meta Description:\*\*.*$/gm, '')
    .replace(/^\*\*Target Keywords:\*\*.*$/gm, '')
    .replace(/^---$/gm, '')
    .trim();
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, visible] = useIntersect();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
      <span className="w-4 h-px bg-emerald-400" />
      {children}
      <span className="w-4 h-px bg-emerald-400" />
    </span>
  );
}

// ─── Animated automation pipeline ───────────────────────────────────
function PipelineSVG() {
  return (
    <svg viewBox="0 0 760 100" className="w-full max-w-3xl mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.15" />
        </linearGradient>
        <filter id="ng"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <line x1="60" y1="50" x2="700" y2="50" stroke="url(#pg)" strokeWidth="1.5" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="3s" repeatCount="indefinite"/>
      </line>
      {[
        { x: 60,  label: 'Inbox' },
        { x: 220, label: 'Documents' },
        { x: 380, label: 'Extract' },
        { x: 540, label: 'Approvals' },
        { x: 700, label: 'Actions' },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={50} r={22} fill="rgba(16,185,129,0.08)" filter="url(#ng)">
            <animate attributeName="r" values="20;24;20" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
          <circle cx={n.x} cy={50} r={13} fill="#0A0E14" stroke="#10B981" strokeWidth="1.5" filter="url(#ng)"/>
          <circle cx={n.x} cy={50} r={4} fill="#2DD4BF">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
          </circle>
          <text x={n.x} y={82} textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="Plus Jakarta Sans">{n.label}</text>
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <circle key={i} r="3.5" fill="#10B981" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite" begin={`${i * 1.35}s`} path="M60,50 L220,50 L380,50 L540,50 L700,50"/>
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" begin={`${i * 1.35}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────
function Navbar({ onHomeClick }: { onHomeClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'home',     label: 'Home',       icon: <Home size={15}/>,      href: '#' },
    { id: 'services', label: 'Services',   icon: <Code2 size={15}/>,     href: '#services' },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={15}/>, href: '#experience' },
    { id: 'contact',  label: 'Contact',    icon: <Mail size={15}/>,      href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0E14]/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <button
          onClick={() => { onHomeClick(); setActive('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-[#0A0E14] font-display font-black text-sm shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            HR
          </div>
          <div className="leading-none">
            <p className="font-display font-bold text-white text-[15px]">Hamza Raies</p>
            <p className="text-gray-500 text-[11px] tracking-widest uppercase font-body mt-0.5">AI Workflow Automation</p>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => {
                setActive(l.id);
                if (l.id === 'home' || l.href.startsWith('#')) onHomeClick();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${active === l.id
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {l.icon}{l.label}
            </a>
          ))}
        </div>

        <a
          href={SOCIAL.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-[#0A0E14] font-semibold text-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Book a Call <ArrowRight size={15}/>
        </a>

        <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0F151C]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1">
          {links.map(l => (
            <a key={l.id} href={l.href} className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm" onClick={() => {
              onHomeClick();
              setOpen(false);
            }}>
              {l.icon}{l.label}
            </a>
          ))}
          <a href={SOCIAL.calendly} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 mt-3 px-5 py-3 rounded-xl bg-emerald-500 text-[#0A0E14] font-semibold text-sm">
            Book a Call <ArrowRight size={15}/>
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-16 left-1/4 w-40 h-40 bg-teal-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-emerald-400/30 via-emerald-400/10 to-transparent p-[3px] shadow-[0_0_40px_rgba(16,185,129,0.35)]">
            <div className="w-full h-full rounded-full bg-[#141B23] flex items-center justify-center overflow-hidden">
              <img
                src={hamza2}
                alt="Hamza Raies"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0A0E14] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>

        <div className="flex items-center gap-3 mb-6">
          {[
            { icon: <Github size={16}/>, href: SOCIAL.github },
            { icon: <Linkedin size={16}/>, href: SOCIAL.linkedin },
            { icon: <Mail size={16}/>, href: '#contact' },
          ].map((s, i) => (
            <a key={i} href={s.href} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-200">
              {s.icon}
            </a>
          ))}
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-emerald-300 text-xs font-semibold tracking-[0.18em] uppercase mb-6">
          <Activity size={13}/> AI Workflow Automation
        </span>

        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-white mb-5">
          Helping Operations Teams Automate{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Email, Documents &amp; Workflows
            </span>
            <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Email triage, document extraction, workflow orchestration — one platform.
          I build{' '}
          <span className="text-white font-semibold">ClaimOS</span> to eliminate
          the manual work that drags operations teams down.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a href="#experience" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-[#0A0E14] font-bold text-base hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all duration-200">
            See My Work <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </a>
          <a href={SOCIAL.calendly} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 text-white font-bold text-base hover:bg-emerald-400/10 hover:border-emerald-400/60 hover:-translate-y-1 transition-all duration-200">
            Book a Free Audit
          </a>
        </div>

        <p className="text-gray-500 text-base sm:text-lg mb-14">
          Faster Turnarounds. Zero Bottlenecks. Scalable Operations.
        </p>

        <div className="w-full">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">The Automation Pipeline</p>
          <PipelineSVG/>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-1.5">
          <div className="w-0.5 h-1.5 bg-gray-400 rounded-full animate-bounce"/>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>About Me</SectionLabel>
          <div className="grid lg:grid-cols-2 gap-16 items-start mt-12">
            <div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-8">
                From 0 Dirhams to{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Automated Operations
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                At REIVEX Technologies, I build AI automation that helps operations
                teams move faster — email intake and triage, document extraction,
                workflow orchestration, and reporting. These systems handle the
                repetitive work so your people can focus on judgment.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                I worked three years without earning a single dirham to build
                this. Today, operations teams use it to cut turnaround times,
                reduce cost, and let people do the work they signed up for —
                judgment, not data entry.
              </p>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Terminal size={16} className="text-emerald-400"/>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-emerald-400 font-bold">Full-Stack Builder</span> — I don't just
                    consult, I build. Custom automation portals, dashboards, and
                    workflows that bridge operations with implementation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { pct: 80, label: 'Less Manual Data Entry', color: 'from-emerald-400 to-teal-300' },
                { pct: 40, label: 'Reduction in Ops Costs', color: 'from-teal-300 to-emerald-500' },
                { pct: 60, label: 'Better Risk & Fraud Detection', color: 'from-emerald-400 to-teal-400' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="p-6 rounded-2xl bg-[#0F151C] border border-white/5 hover:border-emerald-400/20 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 font-medium">{s.label}</span>
                      <span className={`font-display font-black text-3xl bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <Reveal delay={200 + i * 150}>
                        <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width: `${s.pct}%` }} />
                      </Reveal>
                    </div>
                  </div>
                </Reveal>
              ))}

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { n: '3+', label: 'Years in Ops Automation' },
                  { n: '15+', label: 'Automation Projects' },
                  { n: '40%', label: 'Avg Cost Reduction' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-[#0F151C] border border-white/5">
                    <p className={`font-display font-black text-2xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent`}>{s.n}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────
function Services() {
  const services = [
    { icon: <Zap size={22}/>, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', title: 'Email Automation', desc: 'Automated inbox triage, classification, and routing across email, forms, and portals. Zero manual entry, instant task creation.', pct: 95 },
    { icon: <FileText size={22}/>, color: 'from-teal-400/20 to-teal-400/5', iconColor: 'text-teal-300', title: 'Document Intelligence (OCR)', desc: 'Intelligent classification and extraction from any document. Structured data from PDFs, scans, and email attachments.', pct: 88 },
    { icon: <ShieldCheck size={22}/>, color: 'from-rose-500/20 to-rose-500/5', iconColor: 'text-rose-400', title: 'Fraud & Scam Alerts', desc: 'Scam Alert System flags suspicious emails before they reach your team. Fraud costs billions a year — AI catches what humans miss.', pct: 90 },
    { icon: <GitBranch size={22}/>, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', title: 'Workflow Orchestration', desc: 'AI-driven routing of work to the right people and systems based on type, complexity, and workload.', pct: 90 },
    { icon: <Layers size={22}/>, color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-400', title: 'AI Agents & Platforms', desc: 'End-to-end process orchestration — intake, documents, risk screening, approvals, and action on one platform.', pct: 92 },
    { icon: <Monitor size={22}/>, color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-400', title: 'Full-Stack Development', desc: 'Custom automation portals, dashboards, and UIs built full-stack for rapid deployment.', pct: 85 },
  ];

  return (
    <section id="services" className="py-28 px-4 bg-[#0F151C]/60">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>What I Do</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Services</h2>
            <p className="text-gray-400 mt-4 max-w-2xl">Every automation is built to plug into your existing stack — not replace it.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-[#0A0E14] border border-white/5 hover:border-emerald-400/25 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 ${s.iconColor} group-hover:scale-110 transition-transform duration-200`}>
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-emerald-400 transition-colors">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 uppercase tracking-wider">Proficiency</span>
                    <span className="text-gray-400 font-semibold">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <Reveal delay={i * 80}>
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" style={{ width: `${s.pct}%` }} />
                    </Reveal>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Process ──────────────────────────────────────────────────────────
function Process() {
  const steps = [
    { num: '01', title: 'Audit', desc: 'Map existing workflow gaps and identify automation opportunities', icon: <Bot size={20}/> },
    { num: '02', title: 'Design', desc: 'Build automation logic, document pipelines, and integration architecture', icon: <GitBranch size={20}/> },
    { num: '03', title: 'Integrate', desc: 'Connect to existing tools, CRMs, and business systems with clean API layers', icon: <Globe size={20}/> },
    { num: '04', title: 'Deploy', desc: 'Live system with monitoring, optimization, and ongoing support', icon: <Zap size={20}/> },
  ];

  return (
    <section id="process" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>Process</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 left-[calc(100%-12px)] w-6 h-px bg-gradient-to-r from-emerald-400/40 to-transparent z-10" />
                )}
                <div className="p-6 rounded-2xl bg-[#0F151C] border border-white/5 group-hover:border-emerald-400/25 group-hover:-translate-y-1.5 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">{s.icon}</div>
                    <span className="font-display font-black text-5xl text-white/5 leading-none">{s.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Experience & Education ───────────────────────────────────────────
function Experience() {
  const jobs = [
    {
      role: 'AI Workflow Automation Lead — ClaimOS',
      company: 'REIVEX Technologies',
      period: '2024 — Present',
      desc: 'Leading development of an AI-powered automation platform for operations teams — email intake, document extraction, workflow orchestration, fraud screening, routing, and reporting.',
      current: true,
    },
    {
      role: 'Founder & CEO',
      company: 'DevZyte',
      period: '2023 — 2024',
      desc: 'Built and scaled a software agency delivering web, app, and AI solutions for international clients across e-commerce and SaaS.',
      current: false,
    },
    {
      role: 'MERN Stack Developer',
      company: 'Upwork',
      period: '2022 — 2023',
      desc: 'Delivered full-stack MERN applications for US-based clients — dashboards, portals, and e-commerce platforms.',
      current: false,
    },
    {
      role: 'Senior Web Developer',
      company: 'HT Group Companies LLC',
      period: '2021 — 2022',
      desc: 'Built production web applications and internal tools in a fast-paced remote team environment.',
      current: false,
    },
    {
      role: 'Junior Web Developer',
      company: 'Technoid Horizon',
      period: '2020 — 2021',
      desc: 'Started my career building responsive websites and landing pages, mastering the fundamentals of web development.',
      current: false,
    },
  ];

  return (
    <section id="experience" className="py-28 px-4 bg-[#0F151C]/60">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>Career</SectionLabel>
          <div className="mt-4 mb-14">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Experience &amp; Education</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-0">
              {jobs.map((j, i) => (
                <div key={i} className="relative flex gap-5">
                  {i < jobs.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-px bg-gradient-to-b from-emerald-400/40 to-white/5" />
                  )}
                  <div className="relative shrink-0">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${j.current ? 'bg-emerald-400/15 border-emerald-400/50' : 'bg-[#0A0E14] border-white/10'}`}>
                      <div className={`w-2 h-2 rounded-full ${j.current ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                    </div>
                  </div>
                  <div className="pb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-display font-bold text-xl text-white">{j.role}</h3>
                      {j.current && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-semibold">
                          <Sparkles size={11}/> Current
                        </span>
                      )}
                    </div>
                    <p className="text-emerald-400 font-medium text-sm mb-2">{j.company} · <span className="text-gray-500">{j.period}</span></p>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{j.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="p-7 rounded-2xl bg-[#0A0E14] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-5">
                  <GraduationCap size={22} className="text-emerald-400"/>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-1">BSc Computer Science</h3>
                <p className="text-emerald-400 text-sm font-medium mb-2">COMSATS University</p>
                <p className="text-gray-500 text-sm mb-4">2019 — 2023</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Focused on building AI-driven automation solutions and improving business workflows.
                </p>
              </div>

              <div className="mt-6 p-7 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/8 to-transparent">
                <h3 className="font-display font-bold text-xl text-white mb-3">The Story</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  "I worked 3 years without earning a single dirham. Today, I built one of the most
                  cost-efficient automation systems in the UAE."
                </p>
                <p className="text-gray-600 text-xs mt-3">— Hamza Raies, on LinkedIn</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Case Study / Results ─────────────────────────────────────────────
function Results() {
  const projectImages = [p1, p2, p3];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => () => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % projectImages.length);
  };
  const showPrevImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + projectImages.length) % projectImages.length);
  };

  return (
    <section id="results" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>Case Study</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Real Impact.<br/>Measurable Results.</h2>
          </div>

          <div className="rounded-3xl bg-[#0F151C] border border-emerald-400/15 p-8 lg:p-10 mb-6">
            <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#0A0E14] cursor-pointer" onClick={openLightbox(0)}>
                    <img src={p1} alt="workflow automation project screenshot 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#0A0E14] cursor-pointer" onClick={openLightbox(1)}>
                    <img src={p2} alt="workflow automation project screenshot 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="sm:col-span-2 aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0A0E14] cursor-pointer" onClick={openLightbox(2)}>
                    <img src={p3} alt="workflow automation project screenshot 3" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4">Featured Project</span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-6">UAE Operations Team — Workflow Transformation</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-red-500/8 border border-red-500/15">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-3">Before</p>
                    <ul className="space-y-2 text-gray-500 text-sm">
                      {['30-day average cycle time', 'Manual email & document processing', 'Team overload & bottlenecks', 'High operational cost'].map((t, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-red-500 mt-0.5">×</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-400/8 border border-emerald-400/15">
                    <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-3">After</p>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      {['7.5-day average cycle time', 'Automated intake & extraction', 'Intelligent routing & workflows', '40% cost reduction'].map((t, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {projectImages.map((src, i) => (
              i === 1 ? (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F151C] p-2">
                  <div className="grid grid-rows-2 gap-2 h-64">
                    <div className="rounded-lg overflow-hidden border border-white/5 bg-black flex items-center justify-center">
                      <img src={t1} alt="testimonial 1" className="w-full h-full object-contain" />
                    </div>
                    <div className="rounded-lg overflow-hidden border border-white/5 bg-black flex items-center justify-center">
                      <img src={t2} alt="testimonial 2" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F151C] cursor-pointer" onClick={openLightbox(i)}>
                  <img
                    src={src}
                    alt={`workflow automation project screenshot ${i + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )
            ))}
          </div>

          {lightboxIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6" onClick={closeLightbox}>
              <div className="relative mx-auto flex items-center justify-center gap-6" onClick={(event) => event.stopPropagation()}>
                <button
                  className="absolute top-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  onClick={closeLightbox}
                  aria-label="Close image"
                >
                  <X size={20} />
                </button>
                <button
                  className="z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                  onClick={showPrevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="max-w-[80vw] max-h-[80vh] overflow-hidden rounded-3xl bg-[#0B1118] p-4 shadow-2xl shadow-black/40">
                  <img
                    src={projectImages[lightboxIndex]}
                    alt={`workflow automation project screenshot ${lightboxIndex + 1}`}
                    className="block max-h-[72vh] max-w-[72vw] w-full rounded-3xl object-contain"
                  />
                </div>
                <button
                  className="z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                  onClick={showNextImage}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Tech Stack ───────────────────────────────────────────────────────
function TechStack() {
  const cols = [
    {
      title: 'AI Workflow Automation',
      bg: 'from-emerald-500/5 to-transparent',
      border: 'border-emerald-400/15',
      iconBg: 'bg-emerald-400/15',
      icon: <Bot size={20} className="text-emerald-400"/>,
      gradient: 'from-emerald-400 to-teal-300',
      skills: [
        { name: 'Python', pct: 90 },
        { name: 'OCR/Document AI', pct: 88 },
        { name: 'n8n / Make.com', pct: 92 },
        { name: 'Zapier', pct: 88 },
        { name: 'REST APIs', pct: 95 },
        { name: 'Email APIs (Gmail/Outlook)', pct: 85 },
      ],
    },
    {
      title: 'Workflow & Platforms',
      bg: 'from-teal-400/5 to-transparent',
      border: 'border-teal-300/15',
      iconBg: 'bg-teal-300/15',
      icon: <Settings size={20} className="text-teal-300"/>,
      gradient: 'from-teal-300 to-emerald-400',
      skills: [
        { name: 'Workflow Orchestration', pct: 93 },
        { name: 'CRM Integration', pct: 88 },
        { name: 'Business System Connectors', pct: 85 },
        { name: 'AI Agents', pct: 92 },
        { name: 'AI/ML Pipelines', pct: 82 },
      ],
    },
    {
      title: 'MERN Stack (30% of work)',
      bg: 'from-violet-500/5 to-transparent',
      border: 'border-violet-500/15',
      iconBg: 'bg-violet-500/15',
      icon: <Code2 size={20} className="text-violet-400"/>,
      gradient: 'from-violet-400 to-fuchsia-400',
      skills: [
        { name: 'MongoDB', pct: 88 },
        { name: 'Express.js', pct: 87 },
        { name: 'React.js', pct: 90 },
        { name: 'Node.js', pct: 88 },
        { name: 'Next.js', pct: 85 },
        { name: 'Tailwind CSS', pct: 92 },
      ],
    },
  ];

  return (
    <section id="techstack" className="py-28 px-4 bg-[#0F151C]/60">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>Stack</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Built on the Stack That Powers<br/>Modern Operations Automation</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {cols.map((col, ci) => (
              <div key={ci} className={`rounded-2xl bg-gradient-to-b ${col.bg} border ${col.border} p-6 overflow-hidden`}>
                <div className={`w-12 h-12 rounded-xl ${col.iconBg} flex items-center justify-center mb-5`}>
                  {col.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-6">{col.title}</h3>
                <div className="space-y-5">
                  {col.skills.map((sk, si) => (
                    <div key={si}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm font-medium">{sk.name}</span>
                        <span className="text-xs font-bold text-gray-500">{sk.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <Reveal delay={ci * 100 + si * 70}>
                          <div className={`h-full rounded-full bg-gradient-to-r ${col.gradient}`} style={{ width: `${sk.pct}%` }} />
                        </Reveal>
                      </div>
                    </div>
                  ))}
                </div>
                {col.title.includes('MERN') && (
                  <p className="mt-6 text-xs text-gray-600 leading-relaxed">I build the systems I consult on — full-stack capability means faster implementation.</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Thought Leadership / Testimonials ────────────────────────────────
function Testimonials() {
  const quotes = [
    { text: "The biggest operational cost isn't headcount — it's invisible manual drag.", label: "On operational efficiency" },
    { text: "Your best people didn't sign up to be data entry clerks.", label: "On automation purpose" },
    { text: "Teams think they have a speed problem. They have a waiting problem.", label: "On turnaround time" },
  ];
  return (
    <section className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>Thought Leadership</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Industry Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <div key={i} className="group relative p-7 rounded-2xl bg-[#0F151C] border border-white/5 hover:border-emerald-400/25 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-transparent via-emerald-400 to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center mb-5">
                  <Linkedin size={15} className="text-emerald-400"/>
                </div>
                <p className="text-white text-lg font-display font-bold leading-snug mb-5">"{q.text}"</p>
                <div>
                  <p className="text-emerald-400 text-xs font-semibold">Hamza Raies on LinkedIn</p>
                  <p className="text-gray-600 text-xs mt-0.5">{q.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────
type BlogArticle = {
  title: string;
  description: string;
  tag: string;
  date: string;
  author: string;
  contentHtml: string;
};

const BLOG_ARTICLES: BlogArticle[] = [
  {
    title: 'How AI-Powered Email Automation Is Eliminating Manual Inbox Work for Operations Teams',
    description: 'A practical guide to reducing manual inbox handling and accelerating response times with AI-powered email triage and routing.',
    tag: 'Email Automation',
    date: 'June 2026',
    author: 'Hamza Raies',
    contentHtml: marked.parse(cleanArticleMarkdown(article1Raw)) as string,
  },
  {
    title: 'Document Intelligence: How AI-Powered OCR Eliminates Manual Data Entry Across the Business',
    description: 'How intelligent document processing and AI OCR are transforming document workflows for every department.',
    tag: 'Document Intelligence',
    date: 'May 2026',
    author: 'Hamza Raies',
    contentHtml: marked.parse(cleanArticleMarkdown(article2Raw)) as string,
  },
  {
    title: 'Workflow Automation: The Complete Guide to AI-Driven Process Orchestration for Operations Teams',
    description: 'A complete guide to intelligent process orchestration, automated routing, and straight-through processing for modern operations.',
    tag: 'Workflow Orchestration',
    date: 'April 2026',
    author: 'Hamza Raies',
    contentHtml: marked.parse(cleanArticleMarkdown(article3Raw)) as string,
  },
];

function Blogs() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  return (
    <>
      <section id="blogs" className="py-28 px-4 bg-[#0A0E14]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionLabel>Insights</SectionLabel>
            <div className="mt-4 mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Latest Articles</h2>
                <p className="text-gray-400 max-w-2xl mt-4">Stories, playbooks and frameworks for AI workflow automation, digital transformation, and faster operations.</p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-[#0A0E14] font-semibold text-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all duration-200">
                Talk About Your Project <ArrowRight size={16} />
              </a>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {BLOG_ARTICLES.map((article, index) => (
                <div key={index} className="group rounded-3xl bg-[#0F151C] border border-white/5 p-6 hover:border-emerald-400/25 hover:-translate-y-1 transition-all duration-300">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs uppercase tracking-[0.2em] font-semibold mb-5">{article.tag}</span>
                  <h3 className="font-display font-bold text-2xl text-white mb-4">{article.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{article.description}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:text-white"
                  >
                    Read article <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02060f]/95 backdrop-blur-xl px-4 py-6 animate-blog-enter">
          <div className="relative w-full max-w-5xl max-h-[calc(100vh-120px)] overflow-y-auto rounded-[32px] border border-white/10 bg-[#07100c] shadow-[0_0_80px_rgba(16,185,129,0.22)] transform transition-transform duration-500">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0A0E14]/80 text-white transition hover:bg-[#0A0E14]"
              aria-label="Close article"
            >
              <X size={18} />
            </button>
            <div className="px-8 py-8 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-emerald-400 text-xs uppercase tracking-[0.2em] font-semibold">{selectedArticle.tag}</span>
                <span className="text-gray-500 text-xs">{selectedArticle.date}</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-500 text-xs">By {selectedArticle.author}</span>
              </div>
              <h2 className="font-display font-black text-4xl text-white mb-4">{selectedArticle.title}</h2>
              <p className="text-gray-400 text-lg max-w-3xl">{selectedArticle.description}</p>
            </div>
            <div className="px-8 py-8">
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: selectedArticle.contentHtml }} />
            </div>
            <div className="flex flex-col gap-4 border-t border-white/10 px-8 py-6 sm:flex-row sm:justify-between sm:items-center">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0A0E14] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F151C] transition"
              >
                Back to Articles
              </button>
              <a
                href="#contact"
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#0A0E14] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition"
              >
                Talk to me about this
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '', bottleneck: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const buildMailtoLink = (currentForm: typeof form) => {
    const subject = encodeURIComponent(
      currentForm.company ? `${currentForm.company} - ${currentForm.bottleneck || 'Inquiry'}` : (currentForm.bottleneck || 'Inquiry')
    );
    const body = encodeURIComponent([
      `Name: ${currentForm.name || 'N/A'}`,
      `Email: ${currentForm.email || 'N/A'}`,
      `Company: ${currentForm.company || 'N/A'}`,
      `Bottleneck: ${currentForm.bottleneck || 'N/A'}`,
      '',
      currentForm.message || '',
    ].join('\n'));

    return `mailto:info@hamzaraies.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSending(true);

    const mailtoLink = buildMailtoLink(form);

    if (typeof window !== 'undefined') {
      try {
        const popup = window.open(mailtoLink, '_blank', 'noopener,noreferrer');
        if (!popup) {
          window.location.href = mailtoLink;
        }
      } catch {
        window.location.href = mailtoLink;
      }
    }

    setFeedback({
      type: 'info',
      text: 'Your email app has been opened with your message ready to send to info@hamzaraies.com.'
    });
    setSent(true);
    setForm({ name: '', company: '', email: '', message: '', bottleneck: '' });
    setSending(false);
  };

  return (
    <section id="contact" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel>Get In Touch</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Let's Remove the<br/><span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Bottlenecks</span></h2>
            <p className="text-gray-400 mt-4 max-w-xl">Whether you run operations, finance, or customer service — if your team still relies on manual steps, let's talk.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {sent ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-[#0F151C] border border-emerald-400/20 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mb-4">
                  <Mail size={28} className="text-emerald-400"/>
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Name', key: 'name', type: 'text', placeholder: 'Your name', required: true },
                    { label: 'Company', key: 'company', type: 'text', placeholder: 'Company name', required: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-gray-500 text-sm mb-2">{f.label}</label>
                      <input
                        type={f.type} required={f.required} placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0F151C] border border-white/8 text-white placeholder-gray-600 focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:outline-none focus:ring-1 focus:ring-emerald-400/20 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Email</label>
                  <input type="email" required placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F151C] border border-white/8 text-white placeholder-gray-600 focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:outline-none focus:ring-1 focus:ring-emerald-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Biggest operational bottleneck?</label>
                  <select value={form.bottleneck} onChange={e => setForm({ ...form, bottleneck: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F151C] border border-white/8 text-gray-400 focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:outline-none focus:ring-1 focus:ring-emerald-400/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    {['Email Processing', 'Document Handling', 'Data Entry', 'Approvals & Routing', 'Reporting', 'Other'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Message</label>
                  <textarea rows={4} placeholder="Tell me about your project..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F151C] border border-white/8 text-white placeholder-gray-600 focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:outline-none focus:ring-1 focus:ring-emerald-400/20 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full py-4 rounded-xl bg-emerald-500 text-[#0A0E14] font-bold text-base transition-all duration-200 ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] hover:-translate-y-0.5'}`}
                >
                  {sending ? 'Sending…' : 'Send Message'}
                </button>

                {feedback && (
                  <div className={`text-sm mt-3 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`} role="status">
                    {feedback.text}
                  </div>
                )}
              </form>
            )}

            <div className="space-y-6">
              <div className="p-7 rounded-2xl bg-[#0F151C] border border-white/5">
                <h3 className="font-display font-bold text-xl text-white mb-6">Contact Information</h3>
                <div className="space-y-5">
                  {[
                    { icon: <Linkedin size={18}/>, label: 'LinkedIn', value: 'linkedin.com/in/hamza-raies-', href: SOCIAL.linkedin },
                    { icon: <Mail size={18}/>, label: 'Email', value: 'info@hamzaraies.com', href: 'mailto:info@hamzaraies.com' },
                    { icon: <MapPin size={18}/>, label: 'Location', value: 'Lahore, Pakistan', href: null },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#141B23] border border-white/5 flex items-center justify-center text-emerald-400 shrink-0">{c.icon}</div>
                      <div>
                        <p className="text-gray-600 text-xs">{c.label}</p>
                        {c.href ? (
                          <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium text-sm">{c.value}</a>
                        ) : (
                          <p className="text-gray-300 font-medium text-sm">{c.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/8 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                  <p className="text-emerald-400 font-bold text-sm">Available for Consulting</p>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">Currently accepting new AI workflow automation and full-stack development engagements.</p>
                <a href={SOCIAL.calendly} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-emerald-500 text-[#0A0E14] font-semibold text-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-200">
                  <CheckCircle2 size={15}/> Book a Call
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer({ onReadBlogs }: { onReadBlogs: () => void }) {
  return (
    <footer className="py-10 px-4 border-t border-white/5 bg-[#0F151C]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-[#0A0E14] font-display font-black text-xs">
            HR
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">Hamza Raies &copy; 2026</p>
            <p className="text-gray-600 text-xs">AI Workflow Automation Specialist</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center">Automated Email. Intelligent Documents. Zero Manual Drag.</p>
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
          <button
            onClick={(e) => { e.preventDefault(); onReadBlogs(); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-400/10 transition-all duration-200"
          >
            Read Blogs
            <ArrowRight size={14} />
          </button>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-400 transition-colors text-sm">LinkedIn</a>
          <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-400 transition-colors text-sm">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'blogs'>('home');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleReadBlogs = () => {
    setView('blogs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    setView('home');
  };

  return (
    <div className="bg-[#0A0E14] min-h-screen font-body">
      <Loader visible={loading} />
      <div className={`${loading ? 'pointer-events-none blur-sm select-none' : ''}`}>
      <Navbar onHomeClick={handleHome} />
      {view === 'blogs' ? (
        <div className="pt-20">
          <Blogs />
        </div>
      ) : (
        <>
          <Hero />
          <About />
          <Services />
          <Process />
          <Experience />
          <Results />
          <TechStack />
          <Testimonials />
          <Contact />
        </>
      )}
      <Footer onReadBlogs={handleReadBlogs} />
      </div>
    </div>
  );
}
