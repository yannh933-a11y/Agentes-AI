import Link from 'next/link';
export function Section({ children, className='' }){ return <section className={`section-padding ${className}`}>{children}</section>; }
export function Container({ children, className='' }){ return <div className={`max-w-7xl mx-auto px-5 sm:px-8 ${className}`}>{children}</div>; }
export function Badge({ children }){ return <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-red-200">{children}</span>; }
export function SectionTitle({ eyebrow, title, desc, align='center' }){ return <div className={`${align==='center'?'mx-auto text-center':'text-left'} max-w-3xl mb-12`}>{eyebrow && <Badge>{eyebrow}</Badge>}<h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">{title}</h2>{desc && <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-400">{desc}</p>}</div>; }
export function ButtonLink({ href, children, variant='primary', className='' }){ return <Link href={href} className={`${variant==='primary'?'btn-primary':'btn-outline'} rounded-full px-6 py-3.5 text-sm font-bold no-underline text-center ${className}`}>{children}</Link>; }
export function Card({ children, className='' }){ return <div className={`card rounded-3xl p-6 ${className}`}>{children}</div>; }
