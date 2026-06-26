import Link from 'next/link';

export function Section({ children, className = '' }) {
  return <section className={`section-padding ${className}`}>{children}</section>;
}

export function Container({ children, className = '' }) {
  return <div className={`max-w-7xl mx-auto px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-red-200">{children}</span>;
}

export function Pill({ children, tone = 'default' }) {
  const tones = {
    default: 'border-white/10 bg-white/[0.04] text-slate-300',
    red: 'border-red-500/20 bg-red-500/10 text-red-200',
    green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tones[tone] || tones.default}`}>{children}</span>;
}

export function SectionTitle({ eyebrow, title, desc, align = 'center' }) {
  return <div className={`${align === 'center' ? 'mx-auto text-center' : 'text-left'} max-w-3xl mb-12`}>{eyebrow && <Badge>{eyebrow}</Badge>}<h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">{title}</h2>{desc && <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-400">{desc}</p>}</div>;
}

export function ButtonLink({ href, children, variant = 'primary', className = '' }) {
  return <Link href={href} className={`${variant === 'primary' ? 'btn-primary' : 'btn-outline'} inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold no-underline text-center ${className}`}>{children}</Link>;
}

export function Card({ children, className = '' }) {
  return <div className={`card rounded-3xl p-6 ${className}`}>{children}</div>;
}

export function Stat({ value, label }) {
  return <Card className="p-4 text-center"><div className="text-3xl font-black text-white">{value}</div><div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">{label}</div></Card>;
}

export function CheckItem({ children }) {
  return <li className="flex gap-3 text-sm leading-relaxed text-slate-300"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-300">✓</span><span>{children}</span></li>;
}
