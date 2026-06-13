import { useState, useEffect, useRef } from 'react';
import hamzaPhoto from './pics/Hamza.jpeg';
import {
  Menu, X, Home, Code2, Briefcase, Mail, Github, Linkedin, ChevronRight,
  MapPin, Zap, FileText, GitBranch, Settings, Monitor, Database, Globe,
  ArrowRight, ExternalLink, Layers, Terminal, Bot
} from 'lucide-react';
import { marked } from 'marked';
import article1Raw from './article-1-fnol-automation.md?raw';
import article2Raw from './article-2-document-intelligence.md?raw';
import article3Raw from './article-3-claims-workflow-orchestration.md?raw';
import Loader from './components/Loader';

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

// ─── Animated pipeline SVG ───────────────────────────────────────────
function PipelineSVG() {
  return (
    <svg viewBox="0 0 760 100" className="w-full max-w-3xl mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#00C2FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.15" />
        </linearGradient>
        <filter id="ng"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <line x1="60" y1="50" x2="700" y2="50" stroke="url(#pg)" strokeWidth="1.5" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="3s" repeatCount="indefinite"/>
      </line>
      {[
        { x: 60,  label: 'FNOL' },
        { x: 220, label: 'Documents' },
        { x: 380, label: 'Triage' },
        { x: 540, label: 'Routing' },
        { x: 700, label: 'Closure' },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={50} r={22} fill="rgba(0,194,255,0.08)" filter="url(#ng)">
            <animate attributeName="r" values="20;24;20" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
          <circle cx={n.x} cy={50} r={13} fill="#0F1318" stroke="#00C2FF" strokeWidth="1.5" filter="url(#ng)"/>
          <circle cx={n.x} cy={50} r={4} fill="#00C2FF">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
          </circle>
          <text x={n.x} y={82} textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="DM Sans">{n.label}</text>
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <circle key={i} r="3.5" fill="#00C2FF" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite" begin={`${i * 1.35}s`} path="M60,50 L220,50 L380,50 L540,50 L700,50"/>
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" begin={`${i * 1.35}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'home',      label: 'Home',       icon: <Home size={15}/>,      href: '#' },
    { id: 'services',  label: 'Services',   icon: <Code2 size={15}/>,     href: '#services' },
    { id: 'work',      label: 'Experience', icon: <Briefcase size={15}/>, href: '#work' },
    { id: 'contact',   label: 'Contact',    icon: <Mail size={15}/>,      href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0D14]/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-cyan/40 flex items-center justify-center text-[#0A0D14] font-display font-black text-sm shrink-0 shadow-[0_0_20px_rgba(0,194,255,0.4)]">
            HR
          </div>
          <div className="leading-none">
            <p className="font-display font-bold text-white text-[15px]">Hamza Raies</p>
            <p className="text-gray-500 text-[11px] tracking-widest uppercase font-body mt-0.5">Claims Automation</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => setActive(l.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${active === l.id
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {l.icon}{l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://calendly.com/hamzaraies-info/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan text-[#0A0D14] font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,194,255,0.5)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Book a Call <ArrowRight size={15}/>
        </a>

        <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}        
        </button>
      </div>

      {/* Mobile */}
      {open && (
        <div className="md:hidden bg-[#0F1318]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1">
          {links.map(l => (
            <a key={l.id} href={l.href} className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm" onClick={() => setOpen(false)}>
              {l.icon}{l.label}
            </a>
          ))}
          <a href="https://calendly.com/hamzaraies-info/30min" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 mt-3 px-5 py-3 rounded-xl bg-cyan text-[#0A0D14] font-semibold text-sm">
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
      {/* Subtle grid */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(0,194,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,194,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

        {/* Avatar ring */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-cyan/30 via-cyan/10 to-transparent p-[3px] shadow-[0_0_40px_rgba(0,194,255,0.35)]">
            <div className="w-full h-full rounded-full bg-[#141820] flex items-center justify-center overflow-hidden">
              {/* Your profile photo */}
              <img 
                src={hamzaPhoto}
                alt="Hamza Raies"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-[#0A0D14] shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3 mb-6">
          {[
            { icon: <Github size={16}/>, href: 'https://github.com/HamzaRaies?tab=repositories' },
            { icon: <Linkedin size={16}/>, href: 'https://www.linkedin.com/in/hamza-raies/' },
            { icon: <Mail size={16}/>, href: '#contact' },
          ].map((s, i) => (
            <a key={i} href={s.href} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan hover:border-cyan/40 hover:bg-cyan/10 hover:shadow-[0_0_15px_rgba(0,194,255,0.2)] transition-all duration-200">
              {s.icon}
            </a>
          ))}
        </div>

        {/* Role badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan/20 bg-cyan/5 text-cyan text-xs font-semibold tracking-[0.18em] uppercase mb-6">
          Insurance Claims Automation Specialist
        </span>

        {/* Headline */}
        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-8xl leading-[1.0] tracking-tight text-white mb-4">
          Hi, I'm{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-cyan to-[#00E5FF] bg-clip-text text-transparent [text-shadow:none]">
              Hamza Raies
            </span>
            <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
          </span>
        </h1>

        <p className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-8">
          I{' '}<span className="text-gray-400">eliminate</span>{' '}manual work{' '}
          <span className="bg-gradient-to-r from-cyan to-[#00E5FF] bg-clip-text text-transparent">in claims!</span>
        </p>

        <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Faster Closures. Zero Bottlenecks. Scalable Operations.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a href="#work" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-cyan text-[#0A0D14] font-bold text-base hover:shadow-[0_0_40px_rgba(0,194,255,0.5)] hover:-translate-y-1 transition-all duration-200">
            See My Work <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </a>
          <a href="#contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-cyan/30 bg-cyan/5 text-white font-bold text-base hover:bg-cyan/10 hover:border-cyan/60 hover:-translate-y-1 transition-all duration-200">
            Let's Talk Automation
          </a>
        </div>

        {/* Pipeline */}
        <div className="w-full">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">Claims Automation Pipeline</p>
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
  const [ref, visible] = useIntersect();
  return (
    <section id="about" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>About Me</SectionLabel>
          <div className="grid lg:grid-cols-2 gap-16 items-start mt-12">
            <div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-8">
                3 Years Building{' '}
                <span className="bg-gradient-to-r from-cyan to-[#00E5FF] bg-clip-text text-transparent">
                  Automation
                </span>{' '}
                for UAE Insurers
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                At REIVEX Technologies, I've built cost-efficient claims automation systems that help insurers reduce processing costs and close claims faster. From intelligent document pipelines to full workflow orchestration — I design systems that remove every manual step.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                My work spans FNOL automation, AI-driven triage, OCR document intelligence, and seamless integrations with CMS/TPA/MGA platforms.
              </p>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Terminal size={16} className="text-gold"/>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-gold font-bold">MERN Stack Developer</span> — I don't just consult, I build. 30% of my work is full-stack development: custom insurance portals, dashboards, and automation UIs that bridge operations with implementation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { pct: 70, label: 'Faster Claims Processing',   color: 'from-cyan to-[#00E5FF]' },
                { pct: 40, label: 'Reduction in Ops Costs',     color: 'from-gold to-[#E8C76D]' },
                { pct: 60, label: 'Better Fraud Detection',      color: 'from-cyan to-gold' },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#0F1318] border border-white/5 hover:border-cyan/20 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300 font-medium">{s.label}</span>
                    <span className={`font-display font-black text-3xl bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-1000 ease-out`}
                      style={{ width: visible ? `${s.pct}%` : '0%', transitionDelay: `${i * 150}ms` }}
                    />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { n: '3+', label: 'Years in UAE Insurance' },
                  { n: '15+', label: 'Automation Projects' },
                  { n: '40%', label: 'Avg Cost Reduction' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-[#0F1318] border border-white/5">
                    <p className={`font-display font-black text-2xl bg-gradient-to-r from-cyan to-[#00E5FF] bg-clip-text text-transparent`}>{s.n}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────
function Services() {
  const [ref, visible] = useIntersect();
  const services = [
    { icon: <Zap size={22}/>, color: 'from-cyan/20 to-cyan/5', iconColor: 'text-cyan', title: 'FNOL Automation', desc: 'Automated first notice of loss intake across all channels — email, portal, SMS. Zero manual entry.', pct: 95 },
    { icon: <FileText size={22}/>, color: 'from-[#00C2FF]/20 to-[#00C2FF]/5', iconColor: 'text-cyan', title: 'Document Intelligence (OCR)', desc: 'Intelligent classification and extraction from claims documents. Structured data from any format.', pct: 88 },
    { icon: <GitBranch size={22}/>, color: 'from-gold/20 to-gold/5', iconColor: 'text-gold', title: 'Claims Triage & Routing', desc: 'AI-driven assignment to the right adjusters and units based on complexity, type, and workload.', pct: 90 },
    { icon: <Settings size={22}/>, color: 'from-green-500/20 to-green-500/5', iconColor: 'text-green-400', title: 'Workflow Automation', desc: 'End-to-end claims workflow with zero manual handoffs. Automated status, escalations, notifications.', pct: 92 },
    { icon: <Layers size={22}/>, color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400', title: 'ClaimOS Integration', desc: 'Connect automation layers to existing claims management systems via clean API integrations.', pct: 87 },
    { icon: <Monitor size={22}/>, color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-400', title: 'MERN Stack Development', desc: 'Custom insurance portals, dashboards, and automation UIs built full-stack for rapid deployment.', pct: 85 },
  ];

  return (
    <section id="services" className="py-28 px-4 bg-[#0F1318]/60">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>What I Do</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Services</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-[#0A0D14] border border-white/5 hover:border-cyan/20 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 ${s.iconColor} group-hover:scale-110 transition-transform duration-200`}>
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-cyan transition-colors">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 uppercase tracking-wider">Proficiency</span>
                    <span className="text-gray-400 font-semibold">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan to-[#00E5FF] transition-all duration-1000 ease-out"
                      style={{ width: visible ? `${s.pct}%` : '0%', transitionDelay: `${300 + i * 80}ms` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────
function HowItWorks() {
  const [ref, visible] = useIntersect();
  const steps = [
    { num: '01', title: 'Audit', desc: 'Map existing claims workflow gaps and identify automation opportunities', icon: <Bot size={20}/> },
    { num: '02', title: 'Design', desc: 'Build automation logic, document pipelines, and integration architecture', icon: <GitBranch size={20}/> },
    { num: '03', title: 'Integrate', desc: 'Connect to existing CMS/TPA/MGA systems with clean API layers', icon: <Globe size={20}/> },
    { num: '04', title: 'Deploy', desc: 'Live system with monitoring, optimization, and ongoing support', icon: <Zap size={20}/> },
  ];

  return (
    <section id="work" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>Process</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 left-[calc(100%-12px)] w-6 h-px bg-gradient-to-r from-cyan/40 to-transparent z-10" />
                )}
                <div className="p-6 rounded-2xl bg-[#0F1318] border border-white/5 group-hover:border-cyan/25 group-hover:-translate-y-1.5 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">{s.icon}</div>
                    <span className="font-display font-black text-5xl text-white/5 leading-none">{s.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Results ──────────────────────────────────────────────────────────
function Results() {
  const [ref, visible] = useIntersect();
  return (
    <section id="results" className="py-28 px-4 bg-[#0F1318]/60">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>Case Studies</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Real Impact.<br/>Measurable Results.</h2>
          </div>

          {/* Featured */}
          <div className="rounded-3xl bg-[#0A0D14] border border-cyan/15 p-8 lg:p-10 mb-6">
            <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#141820] to-[#0F1318] border border-white/5 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-cyan/10 flex items-center justify-center">
                    <ExternalLink size={22} className="text-cyan"/>
                  </div>
                  <span className="text-gray-600 text-sm">UAE Carrier Project</span>
                </div>
              </div>
              <div className="lg:col-span-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-semibold tracking-wider uppercase mb-4">Featured Project</span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-6">UAE Insurance Carrier — Claims Transformation</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-red-500/8 border border-red-500/15">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-3">Before</p>
                    <ul className="space-y-2 text-gray-500 text-sm">
                      {['30-day average cycle time', 'Manual FNOL processing', 'Adjuster overload & bottlenecks', 'High operational cost'].map((t, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-red-500 mt-0.5">×</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-cyan/8 border border-cyan/15">
                    <p className="text-cyan font-bold text-sm uppercase tracking-wider mb-3">After</p>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      {['7.5-day average cycle time', 'Fully automated intake', 'Intelligent routing & triage', '40% cost reduction'].map((t, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-cyan mt-0.5">✓</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholders */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl border border-dashed border-white/10 bg-[#0A0D14] p-6">
                <div className="aspect-video rounded-xl bg-[#0F1318] border border-white/5 flex flex-col items-center justify-center gap-2 mb-4">
                  <Database size={24} className="text-gray-700"/>
                  <p className="text-gray-700 text-xs uppercase tracking-wider">Image Upload</p>
                  <p className="text-gray-600 text-sm">Project #{i + 1}</p>
                </div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-[#141820] w-3/4"/>
                  <div className="h-3 rounded bg-[#141820] w-1/2"/>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-700 text-sm mt-6">[Sample project images will be added here]</p>
        </div>
      </div>
    </section>
  );
}

type BlogArticle = {
  title: string;
  description: string;
  tag: string;
  date: string;
  author: string;
  contentHtml: string;
};

function Blogs() {
  const [ref, visible] = useIntersect();
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const articles: BlogArticle[] = [
    {
      title: 'How AI-Powered FNOL Automation Is Transforming Insurance Claims Processing in 2025',
      description: 'A practical guide to reducing manual intake bottlenecks and accelerating claims triage with AI-powered FNOL automation.',
      tag: 'Claims Automation',
      date: 'June 2026',
      author: 'Hamza Raies',
      contentHtml: marked.parse(cleanArticleMarkdown(article1Raw)),
    },
    {
      title: 'Insurance Document Intelligence: How AI-Powered OCR Is Eliminating Manual Claims Processing',
      description: 'How intelligent document processing and AI OCR are transforming claims document workflows for insurance carriers.',
      tag: 'Document Intelligence',
      date: 'May 2026',
      author: 'Hamza Raies',
      contentHtml: marked.parse(cleanArticleMarkdown(article2Raw)),
    },
    {
      title: 'Claims Workflow Automation: The Complete Guide to AI-Driven Insurance Claims Orchestration',
      description: 'A complete guide to intelligent claims orchestration, automated routing, and STP optimization for modern carriers.',
      tag: 'Claims Orchestration',
      date: 'April 2026',
      author: 'Hamza Raies',
      contentHtml: marked.parse(cleanArticleMarkdown(article3Raw)),
    },
  ];

  return (
    <>
      <section id="blogs" className="py-28 px-4 bg-[#0A0D14]">
        <div className="max-w-6xl mx-auto">
          <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <SectionLabel>Insights</SectionLabel>
            <div className="mt-4 mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Latest Articles</h2>
                <p className="text-gray-400 max-w-2xl mt-4">Stories, playbooks and frameworks for insurance claims automation, digital transformation, and faster operations.</p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan text-[#0A0D14] font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,194,255,0.35)] transition-all duration-200">
                Talk About Your Project <ArrowRight size={16} />
              </a>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div key={index} className="group rounded-3xl bg-[#0F1318] border border-white/5 p-6 hover:border-cyan/25 hover:-translate-y-1 transition-all duration-300">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs uppercase tracking-[0.2em] font-semibold mb-5">{article.tag}</span>
                  <h3 className="font-display font-bold text-2xl text-white mb-4">{article.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{article.description}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-2 text-cyan font-semibold text-sm hover:text-white"
                  >
                    Read article <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02060f]/95 backdrop-blur-xl px-4 py-6 animate-blog-enter">
          <div className="relative w-full max-w-5xl max-h-[calc(100vh-120px)] overflow-y-auto rounded-[32px] border border-white/10 bg-[#07101a] shadow-[0_0_80px_rgba(0,194,255,0.22)] transform transition-transform duration-500">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0A0D14]/80 text-white transition hover:bg-[#0A0D14]"
              aria-label="Close article"
            >
              <X size={18} />
            </button>
            <div className="px-8 py-8 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-cyan text-xs uppercase tracking-[0.2em] font-semibold">{selectedArticle.tag}</span>
                <span className="text-gray-500 text-xs">{selectedArticle.date}</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-500 text-xs">By {selectedArticle.author}</span>
              </div>
              <h2 className="font-display font-black text-4xl text-white mb-4">{selectedArticle.title}</h2>
              <p className="text-gray-400 text-lg max-w-3xl">{selectedArticle.description}</p>
            </div>
            <div className="px-8 py-8 text-gray-300 prose prose-invert prose-a:text-cyan prose-a:no-underline prose-blockquote:border-l-cyan prose-blockquote:border-l-4 prose-blockquote:px-4 prose-blockquote:text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.contentHtml }} />
            </div>
            <div className="flex flex-col gap-4 border-t border-white/10 px-8 py-6 sm:flex-row sm:justify-between sm:items-center">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0A0D14] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F1318] transition"
              >
                Back to Articles
              </button>
              <a
                href="#contact"
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center justify-center rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-[#0A0D14] hover:shadow-[0_0_30px_rgba(0,194,255,0.35)] transition"
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

// ─── Tech Stack ───────────────────────────────────────────────────────
function TechStack() {
  const [ref, visible] = useIntersect();
  const cols = [
    {
      title: 'Claims & AI Automation',
      bg: 'from-cyan/5 to-transparent',
      border: 'border-cyan/15',
      iconBg: 'bg-cyan/15',
      icon: <Bot size={20} className="text-cyan"/>,
      gradients: ['from-cyan to-[#00E5FF]', 'from-cyan to-[#00E5FF]', 'from-cyan to-[#00E5FF]', 'from-cyan to-[#00E5FF]', 'from-cyan to-[#00E5FF]', 'from-cyan to-[#00E5FF]'],
      skills: [
        { name: 'Python', pct: 90 },
        { name: 'OCR/Document AI', pct: 88 },
        { name: 'n8n / Make.com', pct: 92 },
        { name: 'Zapier', pct: 88 },
        { name: 'REST APIs', pct: 95 },
        { name: 'Claims APIs', pct: 85 },
      ],
    },
    {
      title: 'Automation Platforms',
      bg: 'from-gold/5 to-transparent',
      border: 'border-gold/15',
      iconBg: 'bg-gold/15',
      icon: <Settings size={20} className="text-gold"/>,
      gradients: ['from-gold to-[#E8C76D]', 'from-gold to-[#E8C76D]', 'from-gold to-[#E8C76D]', 'from-gold to-[#E8C76D]', 'from-gold to-[#E8C76D]'],
      skills: [
        { name: 'Workflow Orchestration', pct: 93 },
        { name: 'CMS Integration', pct: 88 },
        { name: 'TPA/MGA Connectors', pct: 85 },
        { name: 'ClaimOS', pct: 87 },
        { name: 'AI/ML Pipelines', pct: 82 },
      ],
    },
    {
      title: 'MERN Stack (30% of work)',
      bg: 'from-purple-500/5 to-transparent',
      border: 'border-purple-500/15',
      iconBg: 'bg-purple-500/15',
      icon: <Code2 size={20} className="text-purple-400"/>,
      gradients: ['from-purple-500 to-pink-400', 'from-purple-500 to-pink-400', 'from-purple-500 to-pink-400', 'from-purple-500 to-pink-400', 'from-purple-500 to-pink-400', 'from-purple-500 to-pink-400'],
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
    <section id="techstack" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>Stack</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Built on the Stack That Powers<br/>Modern Insurance Operations</h2>
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
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${col.gradients[si]} transition-all duration-1000 ease-out`}
                          style={{ width: visible ? `${sk.pct}%` : '0%', transitionDelay: `${200 + ci * 100 + si * 70}ms` }}
                        />
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
        </div>
      </div>
    </section>
  );
}

// ─── LinkedIn Proof ───────────────────────────────────────────────────
function LinkedInProof() {
  const [ref, visible] = useIntersect();
  const quotes = [
    { text: "The biggest claims cost isn't fraud — it's invisible operational drag.", label: "On operational efficiency" },
    { text: "Adjusters didn't sign up to be data entry clerks.", label: "On automation purpose" },
    { text: "AI handles repetitive work. Humans focus on judgment.", label: "On the human-AI balance" },
  ];
  return (
    <section className="py-28 px-4 bg-[#0F1318]/60">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>Thought Leadership</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Industry Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <div key={i} className="group relative p-7 rounded-2xl bg-[#0A0D14] border border-white/5 hover:border-cyan/25 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-transparent via-cyan to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center mb-5">
                  <Linkedin size={15} className="text-cyan"/>
                </div>
                <p className="text-white text-lg font-display font-bold leading-snug mb-5">"{q.text}"</p>
                <div>
                  <p className="text-cyan text-xs font-semibold">Hamza Raies on LinkedIn</p>
                  <p className="text-gray-600 text-xs mt-0.5">{q.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────
function Contact() {
  const [ref, visible] = useIntersect();
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '', bottleneck: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSending(true);

    // EmailJS service and template IDs were provided by the user
    const SERVICE_ID = 'service_192z8ue';
    const TEMPLATE_ID = 'template_a2wg1ed';

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      subject: form.company ? `${form.company} - ${form.bottleneck || 'Inquiry'}` : (form.bottleneck || 'Inquiry'),
      message: form.message,
      to_email: 'info@hamzaraies.com'
    };

    try {
      // Ensure EmailJS SDK loaded on window (initialized in index.html)
      const emailjs = (window as any).emailjs;
      if (!emailjs || !emailjs.send) throw new Error('EmailJS not available');

      console.log('EmailJS send', { SERVICE_ID, TEMPLATE_ID, templateParams, emailjsReady: !!emailjs });
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      setFeedback({ type: 'success', text: "Message sent! I'll get back to you shortly." });
      setSent(true);
      setForm({ name: '', company: '', email: '', message: '', bottleneck: '' });
    } catch (err: any) {
      console.error('Email send error', err);
      const extra = err && (err.text || err.message || err.status || err.statusText);
      setFeedback({
        type: 'error',
        text: extra ? `Something went wrong. ${extra}. Please try info@hamzaraies.com directly.` : 'Something went wrong. Please try info@hamzaraies.com directly.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionLabel>Get In Touch</SectionLabel>
          <div className="mt-4 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Let's Remove the<br/><span className="bg-gradient-to-r from-cyan to-[#00E5FF] bg-clip-text text-transparent">Bottlenecks</span></h2>
            <p className="text-gray-400 mt-4 max-w-xl">Whether you're a carrier, TPA, MGA, or InsurTech — if your claims operation still relies on manual steps, let's talk.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {sent ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-[#0F1318] border border-cyan/20 text-center">
                <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
                  <Mail size={28} className="text-cyan"/>
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
                        className="w-full px-4 py-3 rounded-xl bg-[#0F1318] border border-white/8 text-white placeholder-gray-600 focus:border-cyan/50 focus:bg-cyan/5 focus:outline-none focus:ring-1 focus:ring-cyan/20 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Email</label>
                  <input type="email" required placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F1318] border border-white/8 text-white placeholder-gray-600 focus:border-cyan/50 focus:bg-cyan/5 focus:outline-none focus:ring-1 focus:ring-cyan/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Biggest claims bottleneck?</label>
                  <select value={form.bottleneck} onChange={e => setForm({ ...form, bottleneck: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F1318] border border-white/8 text-gray-400 focus:border-cyan/50 focus:bg-cyan/5 focus:outline-none focus:ring-1 focus:ring-cyan/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    {['FNOL', 'Document Handling', 'Triage', 'Reporting', 'Other'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Message</label>
                  <textarea rows={4} placeholder="Tell me about your project..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F1318] border border-white/8 text-white placeholder-gray-600 focus:border-cyan/50 focus:bg-cyan/5 focus:outline-none focus:ring-1 focus:ring-cyan/20 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full py-4 rounded-xl bg-cyan text-[#0A0D14] font-bold text-base transition-all duration-200 ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(0,194,255,0.45)] hover:-translate-y-0.5'}`}
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
              <div className="p-7 rounded-2xl bg-[#0F1318] border border-white/5">
                <h3 className="font-display font-bold text-xl text-white mb-6">Contact Information</h3>
                <div className="space-y-5">
                  {[
                    { icon: <Linkedin size={18}/>, label: 'LinkedIn', value: 'linkedin.com/in/hamza-raies', href: 'https://www.linkedin.com/in/hamza-raies/' },
                    { icon: <Mail size={18}/>, label: 'Email', value: 'info@hamzaraies.com', href: 'mailto:info@hamzaraies.com' },
                    { icon: <MapPin size={18}/>, label: 'Location', value: 'Lahore, Pakistan', href: null },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#141820] border border-white/5 flex items-center justify-center text-cyan shrink-0">{c.icon}</div>
                      <div>
                        <p className="text-gray-600 text-xs">{c.label}</p>
                        {c.href ? (
                          <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-gray-300 hover:text-cyan transition-colors font-medium text-sm">{c.value}</a>
                        ) : (
                          <p className="text-gray-300 font-medium text-sm">{c.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/8 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                  <p className="text-gold font-bold text-sm">Available for Consulting</p>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">Currently accepting new automation consulting and MERN stack development engagements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-white/5 bg-[#0F1318]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan to-cyan/40 flex items-center justify-center text-[#0A0D14] font-display font-black text-xs">
            HR
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">Hamza Raies &copy; 2026</p>
            <p className="text-gray-600 text-xs">Insurance Claims Automation Specialist</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center">Faster Claims. Smarter Operations. Zero Manual Drag.</p>
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
          <a href="#blogs" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/20 text-cyan text-sm font-semibold hover:bg-cyan/10 transition-all duration-200">
            Read Blogs
            <ArrowRight size={14} />
          </a>
          <a href="https://www.linkedin.com/in/hamza-raies/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan transition-colors text-sm">LinkedIn</a>
          <a href="https://github.com/HamzaRaies?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan transition-colors text-sm">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Shared Section Label ─────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan">
      <span className="w-4 h-px bg-cyan"/>
      {children}
      <span className="w-4 h-px bg-cyan"/>
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bg-[#0A0D14] min-h-screen font-body">
      <Loader visible={loading} />
      <div className={`${loading ? 'pointer-events-none blur-sm select-none' : ''}`}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <Results />
      <Blogs />
      <TechStack />
      <LinkedInProof />
      <Contact />
      <Footer />
      </div>
    </div>
  );
}
