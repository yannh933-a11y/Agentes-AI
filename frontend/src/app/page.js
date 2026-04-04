import Link from 'next/link';
import { agentes } from '../lib/agentes';

const s = {
  section: { padding: '100px 24px', maxWidth: 1200, margin: '0 auto' },
  center: { textAlign: 'center' },
  tag: { display:'inline-block', background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.3)', borderRadius:999, padding:'6px 16px', fontSize:13, fontWeight:600, marginBottom:24 },
  h1: { fontSize:64, fontWeight:900, lineHeight:1.05, letterSpacing:'-2px', marginBottom:24 },
  h2: { fontSize:40, fontWeight:800, letterSpacing:'-1px', marginBottom:16 },
  sub: { color:'#94a3b8', fontSize:20, lineHeight:1.6, maxWidth:600, margin:'0 auto 40px' },
  btn: { display:'inline-block', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', fontWeight:700, padding:'16px 36px', borderRadius:999, fontSize:18, textDecoration:'none', border:'none', cursor:'pointer' },
  btnSm: { display:'inline-block', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', fontWeight:600, padding:'10px 20px', borderRadius:999, fontSize:14, textDecoration:'none' },
  card: { background:'#131629', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:32 },
  cardHover: { background:'#131629', border:'1px solid rgba(124,58,237,0.2)', borderRadius:20, padding:28, transition:'all 0.3s' },
  grid3: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 },
  grid4: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 },
  stat: { background:'#131629', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 16px', textAlign:'center' },
  purple: { background:'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  label: { color:'#7c3aed', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:3, marginBottom:12 },
};

export default function Home() {
  return (
    <main style={{paddingTop:64}}>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'0 24px',position:'relative',overflow:'hidden',background:'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%)'}}>
        <div style={{...s.center,maxWidth:800,position:'relative',zIndex:1}}>
          <div style={s.tag}>⚡ Inteligência Artificial para negócios</div>
          <h1 style={s.h1}>
            Automatize seu negócio com <span style={s.purple}>Agentes de IA</span>
          </h1>
          <p style={s.sub}>
            Atendimento 24h, vendas automáticas e agendamentos. Seu agente fica pronto em minutos, sem contratar ninguém.
          </p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/agentes" style={s.btn}>Ver agentes disponíveis →</Link>
            <a href="#como-funciona" style={{...s.btnSm,background:'transparent',border:'1px solid rgba(255,255,255,0.15)',color:'#94a3b8'}}>Como funciona ↓</a>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:80}}>
            {[['7','Tipos de agentes'],['24h','Sempre disponível'],['5min','Para ativar'],['100%','Automático']].map(([n,l])=>(
              <div key={l} style={s.stat}>
                <p style={{fontSize:32,fontWeight:800,...s.purple}}>{n}</p>
                <p style={{color:'#64748b',fontSize:13,marginTop:4}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGOS / CONFIANÇA */}
      <section style={{padding:'60px 24px',borderTop:'1px solid rgba(255,255,255,0.04)',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
        <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
          <p style={{color:'#475569',fontSize:13,fontWeight:500,marginBottom:24}}>Empresas que já automatizaram com AgentesIA</p>
          <div style={{display:'flex',justifyContent:'center',gap:48,flexWrap:'wrap',opacity:0.4}}>
            {['🏪 Barbearias','🏥 Clínicas','🍕 Restaurantes','🏋️ Academias','👔 Lojas'].map(n=>(
              <span key={n} style={{fontSize:16,color:'#64748b',fontWeight:600}}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{...s.section,...s.center}}>
        <p style={s.label}>Simples assim</p>
        <h2 style={s.h2}>Como funciona</h2>
        <p style={{...s.sub,marginBottom:60}}>3 passos para ter seu agente funcionando</p>
        <div style={s.grid3}>
          {[
            ['01','🎯','Escolha o agente','Selecione entre nossos 7 modelos especializados para seu tipo de negócio.'],
            ['02','💳','Realize o pagamento','Pague via PIX de forma rápida e 100% segura. Aprovação instantânea.'],
            ['03','🚀','Receba em minutos','Seu agente é criado e as credenciais são enviadas direto no seu email.'],
          ].map(([num,icon,titulo,desc])=>(
            <div key={num} style={{...s.card,position:'relative',textAlign:'left'}}>
              <span style={{position:'absolute',top:24,right:24,fontSize:64,fontWeight:900,color:'rgba(255,255,255,0.03)'}}>{num}</span>
              <span style={{fontSize:40,display:'block',marginBottom:16}}>{icon}</span>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{titulo}</h3>
              <p style={{color:'#94a3b8',lineHeight:1.7,fontSize:15}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTES */}
      <section id="precos" style={{padding:'100px 24px',background:'#0d0f22'}}>
        <div style={{maxWidth:1200,margin:'0 auto',...s.center}}>
          <p style={s.label}>Catálogo</p>
          <h2 style={s.h2}>Nossos Agentes</h2>
          <p style={{...s.sub,marginBottom:60}}>Escolha o agente certo para o seu negócio</p>
          <div style={s.grid4}>
            {agentes.map((a)=>(
              <div key={a.slug} style={{...s.cardHover,display:'flex',flexDirection:'column',textAlign:'left'}}>
                <div style={{width:48,height:48,background:'rgba(124,58,237,0.12)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:20}}>
                  {a.emoji}
                </div>
                <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>{a.nome}</h3>
                <p style={{color:'#94a3b8',fontSize:14,lineHeight:1.6,flex:1,marginBottom:20}}>{a.descricao}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  <div>
                    <p style={{color:'#64748b',fontSize:11}}>a partir de</p>
                    <p style={{color:'#a78bfa',fontWeight:700,fontSize:20}}>R$ {a.preco}<span style={{fontSize:12,color:'#64748b'}}>/mês</span></p>
                  </div>
                  <Link href={`/agentes/${a.slug}`} style={s.btnSm}>Contratar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{...s.section,...s.center}}>
        <p style={s.label}>Clientes</p>
        <h2 style={s.h2}>O que nossos clientes dizem</h2>
        <div style={{...s.grid3,marginTop:48}}>
          {[
            ['Carlos M.','Barbearia Premium','O agente de agendamento mudou minha vida. Não perco mais cliente por não atender o telefone. Funciona 24h!'],
            ['Ana L.','Clínica Estética','Meu atendimento agora é automático. Os clientes adoram poder tirar dúvidas a qualquer hora do dia.'],
            ['Pedro S.','Loja Online','As vendas aumentaram 40% depois que coloquei o agente de vendas. Melhor investimento que fiz.'],
          ].map(([nome,cargo,texto])=>(
            <div key={nome} style={{...s.card,textAlign:'left'}}>
              <div style={{display:'flex',gap:4,marginBottom:16}}>
                {[1,2,3,4,5].map(i=><span key={i} style={{color:'#facc15',fontSize:16}}>★</span>)}
              </div>
              <p style={{color:'#cbd5e1',lineHeight:1.7,fontSize:15,marginBottom:24}}>"{texto}"</p>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:16}}>
                <p style={{fontWeight:700,fontSize:15}}>{nome}</p>
                <p style={{color:'#64748b',fontSize:13}}>{cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'100px 24px'}}>
        <div style={{maxWidth:800,margin:'0 auto',textAlign:'center',background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.1))',border:'1px solid rgba(124,58,237,0.2)',borderRadius:28,padding:'80px 48px',boxShadow:'0 0 80px rgba(124,58,237,0.1)'}}>
          <h2 style={{fontSize:44,fontWeight:900,letterSpacing:'-1px',marginBottom:16}}>Pronto para automatizar?</h2>
          <p style={{color:'#94a3b8',fontSize:18,marginBottom:40,maxWidth:500,margin:'0 auto 40px'}}>Escolha seu agente e tenha ele funcionando em menos de 5 minutos.</p>
          <Link href="/agentes" style={{...s.btn,fontSize:20,padding:'18px 44px'}}>Começar agora →</Link>
        </div>
      </section>

    </main>
  );
}
