import { useCallback, useEffect, useState } from 'react';
import { marked } from 'marked';
import { Menu, X, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Mail, Linkedin, Github, CalendarDays, MapPin } from 'lucide-react';

import portrait from './pics/HR.jpeg';
import claimDashboard from './pics/p1.png';
import claimList from './pics/p2.png';
import claimReports from './pics/p3.png';
import article1Raw from './article-1-email-automation.md?raw';
import article2Raw from './article-2-document-intelligence.md?raw';
import article3Raw from './article-3-workflow-orchestration.md?raw';

// ─── Content ─────────────────────────────────────────────────────────

const LINKS = {
  email: 'hamza.raies@reivex.io',
  linkedin: 'https://www.linkedin.com/in/hamza-raies-/',
  github: 'https://github.com/HamzaRaies?tab=repositories',
  calendly: 'https://calendly.com/hamzaraies-info/30min',
};

const NAV = [
  { href: '#bid-built', label: 'Bid Built' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#writing', label: 'Writing' },
];

const HERO_SERVICES = ['Permit and tender alerts', 'Estimating and takeoffs', 'Document handling', 'Lead follow-ups'];

const TOOLS = ['n8n', 'Make', 'Zapier', 'Python', 'Node.js', 'React'];

type Alert = {
  kind: 'Permit' | 'Tender';
  title: string;
  place: string;
  size: string;
  value: string;
  status: string;
};

// Illustrative feed. The Waco tender comes from Hamza's Oct 13 post; the rest are examples.
const ALERTS: Alert[] = [
  { kind: 'Tender', title: 'Warehouse expansion', place: 'Waco, TX', size: '42,000 sq ft', value: '$1,846,500', status: 'Bids due Nov 5' },
  { kind: 'Permit', title: 'Medical office build-out', place: 'Austin, TX', size: '18,500 sq ft', value: '$1,240,000', status: 'Filed this morning' },
  { kind: 'Tender', title: 'School HVAC replacement', place: 'San Antonio, TX', size: '3 campuses', value: '$2,310,000', status: 'Bids due Nov 19' },
  { kind: 'Permit', title: 'Retail shell and parking', place: 'Houston, TX', size: '26,000 sq ft', value: '$1,075,000', status: 'Filed this morning' },
  { kind: 'Tender', title: 'Fire station renovation', place: 'Fort Worth, TX', size: '11,200 sq ft', value: '$1,390,000', status: 'Bids due Dec 2' },
];

const BOTTLENECKS = [
  { title: 'Finding bid opportunities', body: 'New permits and tenders matched to your trade and area, the moment they go live.' },
  { title: 'Estimating and takeoffs', body: 'Less time pulling quantities and prices together by hand.' },
  { title: 'Document handling', body: 'Plans, specs and paperwork read, sorted and filed without someone retyping them.' },
  { title: 'Subcontractor coordination', body: 'Quote requests and updates sent and tracked, not chased over email.' },
  { title: 'Client follow-ups', body: 'Every lead and open bid gets a follow-up on time, even in a busy week.' },
];

const BID_STEPS = [
  { title: 'It watches', body: 'Bid Built checks construction permits and tenders across the US, all day.' },
  { title: 'It matches', body: 'Each new project is compared against your trade, location, project size and type of work.' },
  { title: 'It tells you', body: 'When one fits, it reaches your phone within minutes and you can apply with one tap.' },
];

const PROJECTS = [
  {
    name: 'Cold email and follow-up automation',
    when: 'Apr to Jun 2026',
    body: 'Upload a lead list and the system runs the outreach. It sends emails, handles follow-ups and spreads volume across several connected Gmail accounts, so larger campaigns don’t need anyone sending by hand.',
    tags: ['Workflow automation', 'Gmail API', 'AI personalization'],
  },
  {
    name: 'AI voice calling and lead follow-up',
    when: 'Feb to Mar 2026',
    body: 'An AI calling agent that makes outbound calls, follows up with referred leads, qualifies prospects and books meetings with the ones who are interested. Built with Ahad Nawaz.',
    tags: ['AI voice agent', 'Lead qualification', 'Scheduling'],
  },
];

const CLAIM_SHOTS = [
  { src: claimDashboard, label: 'Dashboard', alt: 'ClaimOS dashboard with open claims, claims in review, SLA and FNOL time, and a weekly claims volume chart' },
  { src: claimList, label: 'Claims queue', alt: 'ClaimOS claims list with claim IDs, members, claim types, status and assigned adjusters' },
  { src: claimReports, label: 'Reports', alt: 'ClaimOS reports view with claims by type and a monthly trend chart' },
];

const EXPERIENCE = [
  {
    role: 'AI Workflow Automation Specialist',
    org: 'REIVEX Technologies',
    when: 'Jan 2025 to now',
    body: 'I build AI workflow automation that takes manual work out of operations: email and document processing, routing and follow-ups. I built ClaimOS here, and now Bid Built for US contractors.',
  },
  {
    role: 'AI and ML Developer',
    org: 'Binary Brains',
    when: 'Aug 2022 to Aug 2024',
    body: 'Built full-stack MERN applications with AI features, automated manual workflows and built data processing pipelines. This is where I moved from standard web apps to systems that do work on their own.',
  },
  {
    role: 'Web Developer',
    org: 'Technoid Horizon',
    when: 'Sep 2018 to Apr 2022',
    body: 'Built and maintained client websites across industries, from front end to database. Learned web architecture, deployment and how to turn client requirements into working products.',
  },
];

const SKILLS = [
  { group: 'Automation', items: ['Business process automation', 'Workflow automation', 'n8n, Make and Zapier', 'Gmail and Outlook APIs', 'CRM integrations'] },
  { group: 'AI', items: ['LLM workflows and AI agents', 'AI voice agents', 'OCR and document extraction', 'Machine learning'] },
  { group: 'Engineering', items: ['Python', 'Node.js and Express', 'React and Next.js', 'MongoDB', 'REST APIs'] },
];

function cleanArticle(raw: string) {
  return raw
    .replace(/^\*\*Meta Title:\*\*.*$/gm, '')
    .replace(/^\*\*Meta Description:\*\*.*$/gm, '')
    .replace(/^\*\*Target Keywords:\*\*.*$/gm, '')
    .replace(/^---$/gm, '')
    .trim();
}

function articleTitle(raw: string) {
  const m = raw.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Article';
}

const ARTICLES = [
  { raw: article1Raw, summary: 'How AI triage, extraction and routing take repetitive inbox work off operations teams.' },
  { raw: article2Raw, summary: 'What document AI and OCR actually do once they’re running, and where they connect.' },
  { raw: article3Raw, summary: 'A practical guide to orchestrating multi-step workflows, and where to start.' },
].map((a) => ({ title: articleTitle(a.raw), summary: a.summary, html: marked.parse(cleanArticle(a.raw)) as string }));

// ─── Shared bits ─────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

// Pill button with the arrow disc, in two tones
function Pill({ href, children, tone = 'flame', external = false, small = false }: {
  href: string; children: React.ReactNode; tone?: 'flame' | 'white'; external?: boolean; small?: boolean;
}) {
  const shell = tone === 'flame' ? 'bg-flame text-white hover:bg-flame-hot' : 'bg-white text-ink hover:bg-[#F1F1F1]';
  const disc = tone === 'flame' ? 'bg-white text-flame' : 'bg-flame text-white';
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group inline-flex items-center gap-3 rounded-full font-semibold transition-colors ${small ? 'py-1.5 pl-4 pr-1.5 text-[14px]' : 'py-2 pl-5 pr-2 text-[15px]'} ${shell}`}
    >
      {children}
      <span className={`inline-flex items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 ${small ? 'h-7 w-7' : 'h-9 w-9'} ${disc}`} aria-hidden="true">
        <ArrowRight size={small ? 15 : 17} strokeWidth={2.5} />
      </span>
    </a>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[17px] font-semibold text-flame">{children}</p>;
}

// ─── Hero ────────────────────────────────────────────────────────────

function HeroNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20">
      <div className="flex h-[76px] items-center justify-between px-6 sm:px-10">
        <a href="#top" className="text-[19px] font-bold tracking-tight text-white">Hamza Raies</a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-semibold text-white/85 hover:text-white">{l.label}</a>
          ))}
          <Pill href="#contact" tone="white" small>Get in touch</Pill>
        </nav>
        <button
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="mx-4 mb-2 rounded-3xl bg-ink/95 p-5 backdrop-blur md:hidden">
          {[...NAV, { href: '#contact', label: 'Contact' }].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-edge py-3.5 text-[17px] font-semibold text-white last:border-0">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-frame">
        <div className="hero-glow relative isolate z-10 flex flex-col overflow-hidden rounded-[32px] sm:rounded-[40px] lg:min-h-[calc(100svh-2rem)]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-black/10 to-transparent" aria-hidden="true" />

          <HeroNav />

          <div className="flex flex-1 flex-col gap-10 px-6 pb-10 pt-16 sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:pb-6 lg:pt-6">
            <div className="lg:shrink-0">
              <p className="text-[22px] font-bold text-white sm:text-[26px]">Hey, I’m Hamza, an</p>
              <h1 className="mt-3 text-[3.3rem] font-extrabold leading-[0.98] sm:text-[5rem] lg:whitespace-nowrap lg:text-[4.3rem] xl:text-[4.7rem]">
                AI Automation <br className="hidden lg:block" />Specialist
              </h1>
            </div>
            <div className="max-w-[30rem] lg:ml-auto lg:min-w-0 lg:max-w-[29rem] lg:flex-1">
              <p className="text-[24px] font-bold leading-snug text-white sm:text-[28px]">
                I help US contractors find $1M+ projects before competitors do.
              </p>
              <p className="mt-5 text-[16px] leading-relaxed text-white/85 sm:text-[17px]">
                Custom systems for general contractors and builders, from spotting new permits and tenders to estimating,
                paperwork and follow-ups. Built at REIVEX Technologies.
              </p>
              <div className="mt-8">
                <Pill href={LINKS.calendly} tone="white" external>Book a 30 minute call</Pill>
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 px-6 pb-9 sm:px-10 lg:grid-cols-4 lg:pb-11 short:pb-8" aria-label="What I build">
            {HERO_SERVICES.map((s, i) => (
              <li key={s} className="text-[15px] font-semibold text-white">
                <span className="text-[13px] font-bold"><span className="text-flame-hot">#</span>0{i + 1}</span>
                <span className="mt-1.5 block">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative -mt-12 flex flex-col gap-5 rounded-b-[32px] bg-panel px-6 pb-8 pt-20 sm:rounded-b-[40px] sm:px-10 md:flex-row md:items-center md:gap-12">
          <p className="max-w-[9rem] shrink-0 text-[14px] font-semibold leading-snug text-white">Tools I build with every week</p>
          <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-3 md:justify-between">
            {TOOLS.map((t) => (
              <li key={t} className="text-[22px] font-bold tracking-tight text-white/85">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── What I do ───────────────────────────────────────────────────────

function WhatIDo() {
  return (
    <section className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Label>Behind the systems</Label>
          <h2 className="mt-4 text-[2.6rem] sm:text-[3.4rem]">Slow processes quietly cost you bids.</h2>
        </div>
        <div className="lg:pt-10">
          <p className="text-[22px] font-bold leading-snug text-white">
            Missed permits, slow estimating, paperwork pileups and late follow-ups eat into your win rate every week.
            It doesn’t have to be part of the job.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-[16rem] text-[15px] text-dim">I build around the bottlenecks that slow bidding teams down.</p>
            <Pill href="#contact" small>Get in touch</Pill>
          </div>
        </div>
      </div>

      <ul className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BOTTLENECKS.map((b) => (
          <li key={b.title} className="rounded-[28px] bg-panel p-6">
            <h3 className="text-[19px] leading-tight">{b.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-dim">{b.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Bid Built with the live alert feed ──────────────────────────────

const AGES = ['Just now', '4 min ago', '11 min ago'];

function AlertCard({ alert, age, fresh }: { alert: Alert; age: string; fresh: boolean }) {
  return (
    <li className={`rounded-[22px] border px-4 py-3.5 ${fresh ? 'alert-in border-flame/60 bg-raised' : 'border-edge bg-panel'}`}>
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="flex items-center gap-2 font-semibold text-white">
          <span className={`h-2 w-2 rounded-full ${fresh ? 'ping-soft bg-flame' : 'bg-white/25'}`} aria-hidden="true" />
          New {alert.kind.toLowerCase()}
        </span>
        <span className="text-dim">{age}</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[18px] font-bold leading-tight text-white">{alert.title}</p>
          <p className="mt-1 text-[14px] text-dim">{alert.place}, {alert.size}</p>
        </div>
        <p className="shrink-0 text-[18px] font-bold tabular-nums text-white">{alert.value}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-edge pt-2.5 text-[13px]">
        <span className="text-soft">{alert.status}</span>
        <span className={`rounded-full px-3 py-1 font-semibold ${fresh ? 'bg-flame text-white' : 'bg-white/10 text-white'}`} aria-hidden="true">Apply</span>
      </div>
    </li>
  );
}

function AlertFeed() {
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 3800);
    return () => window.clearInterval(id);
  }, [reduced]);

  const n = ALERTS.length;
  const visible = [0, 1, 2].map((i) => ALERTS[(((n - tick + i) % n) + n) % n]);

  return (
    <div>
      <div className="rounded-[32px] border border-edge bg-ink p-3 sm:p-4">
        <div className="flex items-center justify-between px-2 pb-3 pt-1">
          <p className="text-[15px] font-bold text-white">Bid Built</p>
          <p className="text-[13px] text-dim">General contractor, Texas, $1M+</p>
        </div>
        <ul className="space-y-2.5" aria-label="Example bid alerts">
          {visible.map((a, i) => (
            <AlertCard key={`${tick}-${i}`} alert={a} age={AGES[i]} fresh={i === 0} />
          ))}
        </ul>
      </div>
      <p className="mt-3 text-center text-[13px] text-dim">Example alerts. Real ones match your trade, area and project size.</p>
    </div>
  );
}

function BidBuilt() {
  return (
    <section id="bid-built" className="px-3 sm:px-4">
      <div className="mx-auto max-w-frame rounded-[32px] bg-panel sm:rounded-[40px]">
        <div className="mx-auto grid max-w-page gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <Label>Bid Built</Label>
            <h2 className="mt-4 text-[2.6rem] sm:text-[3.4rem]">See the right projects first.</h2>
            <p className="mt-6 max-w-[32rem] text-[18px] leading-relaxed">
              Bid Built watches for new construction permits and tenders across the US and tells you the moment one matches
              what you’re looking for. No refreshing county websites or digging through bid boards.
            </p>
            <ol className="mt-10 space-y-3">
              {BID_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-5 rounded-[24px] bg-raised p-5">
                  <span className="text-[15px] font-bold text-white"><span className="text-flame">#</span>0{i + 1}</span>
                  <div>
                    <h3 className="text-[19px]">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] text-dim">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Pill href={LINKS.calendly} external>Get a walkthrough for your area</Pill>
            </div>
          </div>
          <div className="lg:pt-14">
            <AlertFeed />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Work ────────────────────────────────────────────────────────────

function Lightbox({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (d: number) => void }) {
  useLockScroll(true);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onMove]);

  const shot = CLAIM_SHOTS[index];
  return (
    <div role="dialog" aria-modal="true" aria-label="ClaimOS screenshots" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <div className="overlay-in relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={shot.src} alt={shot.alt} className="max-h-[78vh] w-full rounded-[24px] bg-white object-contain" />
        <div className="mt-4 flex items-center justify-between text-white">
          <button onClick={() => onMove(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous screenshot"><ChevronLeft size={20} /></button>
          <span className="text-[14px] font-semibold text-white/70">{index + 1} of {CLAIM_SHOTS.length}</span>
          <div className="flex gap-2">
            <button onClick={() => onMove(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Next screenshot"><ChevronRight size={20} /></button>
            <button onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close"><X size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  const [shot, setShot] = useState<number | null>(null);
  const move = useCallback((d: number) => {
    setShot((s) => (s === null ? s : (s + d + CLAIM_SHOTS.length) % CLAIM_SHOTS.length));
  }, []);
  const close = useCallback(() => setShot(null), []);

  return (
    <section id="work" className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Label>Selected work</Label>
          <h2 className="mt-4 text-[2.6rem] sm:text-[3.4rem]">ClaimOS, an AI claims platform.</h2>
        </div>
        <div className="lg:pt-10">
          <p className="text-[22px] font-bold leading-snug text-white">
            It pulls claim data from emails, PDFs, images, portals and forms, then handles FNOL intake, extraction, routing
            and fraud checks.
          </p>
          <p className="mt-5 text-[15px] text-dim">Built at REIVEX Technologies. Screens show demo data.</p>
        </div>
      </div>

      <div className="mt-14 grid gap-3 sm:grid-cols-3">
        {CLAIM_SHOTS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setShot(i)}
            className="mono-parent group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white text-left"
            aria-label={`Open ${s.label} screenshot`}
          >
            <img src={s.src} alt={s.alt} loading="lazy" className="mono h-full w-full object-cover object-left-top" />
            <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-ink/85 py-1.5 pl-4 pr-1.5 text-[14px] font-semibold text-white backdrop-blur">
              {s.label}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-flame" aria-hidden="true"><ArrowUpRight size={15} strokeWidth={2.5} /></span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <article key={p.name} className="rounded-[28px] bg-panel p-7 sm:p-9">
            <p className="text-[14px] font-semibold text-flame">{p.when}</p>
            <h3 className="mt-2 text-[26px]">{p.name}</h3>
            <p className="mt-4 text-[16px] leading-relaxed">{p.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full bg-white/[0.07] px-3 py-1 text-[13px] font-semibold text-white">{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {shot !== null && <Lightbox index={shot} onClose={close} onMove={move} />}
    </section>
  );
}

// ─── Experience ──────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" className="px-3 sm:px-4">
      <div className="mx-auto max-w-frame rounded-[32px] bg-panel sm:rounded-[40px]">
        <div className="mx-auto grid max-w-page gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[21rem_1fr] lg:gap-20 lg:py-24">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <img src={portrait} alt="Hamza Raies" className="aspect-[4/5] w-full max-w-[21rem] rounded-[28px] object-cover object-[50%_30%] grayscale" />
            <p className="mt-6 text-[16px]">
              I’m based in Lahore and work with teams in the US. Before construction, I spent years building AI automation
              for insurance and sales teams.
            </p>
            <div className="mt-6 rounded-[22px] bg-raised p-5">
              <p className="font-bold text-white">COMSATS University Islamabad</p>
              <p className="text-[15px]">BS Computer Science, Grade A</p>
              <p className="text-[14px] text-dim">Sep 2020 to Feb 2024</p>
            </div>
          </aside>

          <div>
            <Label>Experience</Label>
            <h2 className="mt-4 text-[2.6rem] sm:text-[3.4rem]">Eight years of building software.</h2>
            <ol className="mt-12">
              {EXPERIENCE.map((e) => (
                <li key={e.org} className="grid gap-2 border-t border-edge py-8 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-8">
                  <p className="text-[14px] font-semibold text-dim">{e.when}</p>
                  <div>
                    <h3 className="text-[24px]">{e.role}</h3>
                    <p className="mt-1 font-semibold text-flame">{e.org}</p>
                    <p className="mt-3 max-w-[38rem] text-[16px] leading-relaxed">{e.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {SKILLS.map((s) => (
                <div key={s.group} className="rounded-[24px] bg-raised p-6">
                  <h3 className="text-[19px]">{s.group}</h3>
                  <ul className="mt-3 space-y-1.5 text-[15px]">
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Recommendations ─────────────────────────────────────────────────

function Recommendations() {
  return (
    <section className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:py-32">
      <Label>What people say</Label>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <figure>
          <blockquote className="text-[26px] font-bold leading-snug text-white sm:text-[34px]">
            “He has a strong ability to help insurance carriers, TPAs, and MGAs automate claims through FNOL processing,
            document extraction, and fraud detection. I highly recommend Hamza to anyone seeking a knowledgeable and
            dependable expert in insurance claims automation.”
          </blockquote>
          <figcaption className="mt-6 text-[15px]">
            <span className="font-bold text-white">Ahad Nawaz</span>, Founder and CEO, REIVEX Technologies. Managed Hamza directly.
          </figcaption>
        </figure>
        <figure className="self-end rounded-[28px] bg-panel p-7">
          <blockquote className="text-[18px] font-semibold leading-relaxed text-white">
            “After reviewing our system with Hamza we realized how much time we were wasting on repetitive tasks. His
            automation approach showed us how to speed up claims handling and improve response time. Really impressive.”
          </blockquote>
          <figcaption className="mt-4 text-[15px] text-dim">Insurance operations client, via LinkedIn</figcaption>
        </figure>
      </div>
    </section>
  );
}

// ─── Writing ─────────────────────────────────────────────────────────

function Reader({ index, onClose }: { index: number; onClose: () => void }) {
  useLockScroll(true);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={ARTICLES[index].title} className="fixed inset-0 z-50 overflow-y-auto bg-ink">
      <div className="sticky top-0 z-10 border-b border-edge bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <span className="text-[17px] font-bold text-white">Hamza Raies</span>
          <button onClick={onClose} autoFocus className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-ink hover:bg-[#F1F1F1]">
            <X size={16} /> Close
          </button>
        </div>
      </div>
      <article className="overlay-in article mx-auto max-w-[42rem] px-5 py-14 sm:px-8" dangerouslySetInnerHTML={{ __html: ARTICLES[index].html }} />
    </div>
  );
}

function Writing() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section id="writing" className="mx-auto max-w-page px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <Label>Writing</Label>
          <h2 className="mt-4 text-[2.6rem] sm:text-[3.4rem]">Notes from client work.</h2>
        </div>
        <ul className="grid gap-3">
          {ARTICLES.map((a, i) => (
            <li key={a.title}>
              <button onClick={() => setOpen(i)} className="group flex w-full items-center justify-between gap-6 rounded-[28px] bg-panel p-6 text-left hover:bg-raised sm:p-7">
                <span>
                  <span className="block text-[19px] font-bold leading-snug text-white">{a.title}</span>
                  <span className="mt-2 block text-[15px] text-dim">{a.summary}</span>
                </span>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flame text-white transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <ArrowRight size={18} strokeWidth={2.5} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open !== null && <Reader index={open} onClose={close} />}
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────

function Contact() {
  const rows = [
    { icon: <Mail size={18} />, label: 'Email', value: LINKS.email, href: `mailto:${LINKS.email}` },
    { icon: <CalendarDays size={18} />, label: 'Book a call', value: '30 minutes on Calendly', href: LINKS.calendly },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', value: 'linkedin.com/in/hamza-raies-', href: LINKS.linkedin },
    { icon: <MapPin size={18} />, label: 'Based in', value: 'Lahore, working with US teams', href: '' },
  ];
  return (
    <section id="contact" className="px-3 sm:px-4">
      <div className="hero-glow relative mx-auto max-w-frame overflow-hidden rounded-[32px] sm:rounded-[40px]">
        <div className="mx-auto grid max-w-page gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:py-24">
          <div>
            <h2 className="text-[2.8rem] sm:text-[4rem]">Losing time or bids to slow processes?</h2>
            <p className="mt-6 max-w-[32rem] text-[18px] text-white/85">
              Tell me how your team finds and bids on work today. I’ll show you what could change in your operation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill href={`mailto:${LINKS.email}`} tone="white">Email me</Pill>
              <Pill href={LINKS.calendly} tone="white" external>Book a call</Pill>
            </div>
          </div>
          <ul className="self-end rounded-[28px] bg-black/35 p-2 backdrop-blur-sm">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="text-flame-hot">{r.icon}</span>
                  <span className="w-24 shrink-0 text-[14px] font-semibold text-white/70">{r.label}</span>
                  <span className="min-w-0 break-words text-[15px] font-semibold text-white">{r.value}</span>
                </>
              );
              return (
                <li key={r.label}>
                  {r.href ? (
                    <a href={r.href} {...(r.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center gap-4 rounded-[20px] px-4 py-4 hover:bg-white/10">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-4 py-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-[14px] text-dim">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© 2026 Hamza Raies. AI Workflow Automation Specialist at REIVEX Technologies.</p>
        <div className="flex items-center gap-5">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-white"><Linkedin size={16} /> LinkedIn</a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-white"><Github size={16} /> GitHub</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a href="#bid-built" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <main>
        <Hero />
        <WhatIDo />
        <BidBuilt />
        <Work />
        <Experience />
        <Recommendations />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
