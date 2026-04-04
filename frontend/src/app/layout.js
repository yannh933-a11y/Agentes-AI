import './globals.css';

export const metadata = {
  title: 'AgentesIA — Automatize seu negócio com Inteligência Artificial',
  description: 'Agentes de IA prontos para o seu negócio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{backgroundColor:'#0b0d1a',color:'#fff',margin:0,fontFamily:'system-ui,sans-serif'}}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <header style={{position:'fixed',top:0,left:0,right:0,zIndex:50,borderBottom:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',backgroundColor:'rgba(11,13,26,0.9)'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#7c3aed,#2563eb)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🤖</div>
          <span style={{fontWeight:800,fontSize:18,color:'#fff'}}>AgentesIA</span>
        </a>
        <nav style={{display:'flex',alignItems:'center',gap:32}}>
          {[['Agentes','/agentes'],['Como funciona','#como-funciona'],['Preços','#precos']].map(([l,h])=>(
            <a key={l} href={h} style={{color:'#94a3b8',textDecoration:'none',fontSize:14,fontWeight:500}}>{l}</a>
          ))}
        </nav>
        <a href="/agentes" style={{background:'linear-gradient(135deg,#7c3aed,#2563eb)',color:'#fff',textDecoration:'none',fontWeight:700,padding:'10px 22px',borderRadius:999,fontSize:14}}>
          Começar agora
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'48px 24px',backgroundColor:'#0b0d1a'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#7c3aed,#2563eb)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
          <span style={{fontWeight:700,color:'#fff'}}>AgentesIA</span>
        </div>
        <p style={{color:'#475569',fontSize:13}}>© {new Date().getFullYear()} AgentesIA — Todos os direitos reservados</p>
        <div style={{display:'flex',gap:24}}>
          {['Agentes','Termos','Privacidade'].map(l=>(
            <a key={l} href="#" style={{color:'#64748b',textDecoration:'none',fontSize:13}}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
