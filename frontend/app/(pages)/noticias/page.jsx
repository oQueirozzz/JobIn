import React from "react";

export default function Noticias() {
  const noticias = [
    {
      imagem: "/img/noticias/noticia1.webp",
      titulo: "Mercado de TI segue aquecido em 2025",
      meta: "há 2h • 1.245 leitores",
      texto: " O mercado de Tecnologia da Informação (TI) manteve-se aquecido em 2025, confirmando as previsões de analistas e especialistas do setor. A crescente digitalização dos negócios, impulsionada pelas transformações pós-pandemia, tem gerado uma forte demanda por profissionais qualificados. Áreas como desenvolvimento de software, segurança cibernética, ciência de dados e inteligência artificial estão entre as mais requisitadas. Empresas de todos os portes, de startups a grandes corporações, seguem em busca de talentos para liderar projetos de inovação e garantir competitividade no ambiente digital. A tendência é que esse movimento continue em 2026, com foco na automação, computação em nuvem e soluções de big data."
    },
    {
      imagem: "/img/noticias/noticia2.webp",
      titulo: "Novas tendências em entrevistas de emprego",
      meta: "há 5h • 876 leitores",
      texto: "As entrevistas de emprego estão passando por mudanças significativas. Cada vez mais empresas têm reformulado seus processos seletivos, abandonando métodos tradicionais e investindo em abordagens mais modernas e interativas. Além do currículo, os recrutadores passaram a avaliar com mais atenção o perfil comportamental dos candidatos. Etapas como dinâmicas de grupo, entrevistas por videoconferência, testes situacionais e desafios práticos se tornaram comuns. O objetivo é identificar não apenas a capacidade técnica, mas também competências como comunicação, criatividade, empatia e capacidade de adaptação — habilidades que ganharam destaque no ambiente de trabalho contemporâneo."
    },
    {
      imagem: "/img/noticias/noticia3.webp",
      titulo: "Como se destacar no LinkedIn",
      meta: "há 1d • 3.421 leitores",
      texto: "Com mais de 65 milhões de usuários só no Brasil, o LinkedIn tornou-se uma das principais plataformas para quem busca novas oportunidades no mercado de trabalho. No entanto, destacar-se em meio a tantos perfis exige mais do que simplesmente estar presente. Especialistas em recrutamento recomendam que os usuários mantenham o perfil sempre atualizado, com experiências detalhadas, certificações relevantes e um resumo claro de suas competências. Além disso, publicar conteúdos, compartilhar opiniões sobre o setor de atuação e interagir com a rede são ações que aumentam a visibilidade. Recomendações e conexões estratégicas também são diferenciais que podem atrair a atenção de recrutadores e abrir portas para novas oportunidades."
    },
    {
      imagem: "/img/noticias/noticia4.jpg",
      titulo: "Salários em alta para desenvolvedores",
      meta: "há 3h • 2.156 leitores",
      texto: "A valorização dos profissionais da área de tecnologia segue em alta, especialmente entre os desenvolvedores. Segundo dados de consultorias de RH, a escassez de mão de obra qualificada fez com que os salários para esses profissionais apresentassem aumentos expressivos em 2023. Desenvolvedores com experiência em linguagens modernas e conhecimentos em áreas como inteligência artificial, cloud computing e segurança da informação estão entre os mais procurados. Empresas têm oferecido não apenas salários mais altos, mas também pacotes de benefícios mais robustos, como bônus por performance, trabalho remoto integral e oportunidades de capacitação. A expectativa é que essa valorização continue nos próximos anos, acompanhando a crescente digitalização dos negócios."
    },
    {
      imagem: "/img/noticias/noticia5.jpg",
      titulo: "Empresas buscam profissionais com soft skills",
      meta: "há 6h • 1.890 leitores",
      texto: "As chamadas 'soft skills', ou habilidades comportamentais, ganharam protagonismo no mercado de trabalho. Se antes o foco dos recrutadores estava quase exclusivamente no conhecimento técnico, hoje as competências interpessoais passaram a ter peso igual — ou até maior — durante os processos seletivos. Comunicação clara, inteligência emocional, capacidade de trabalhar em equipe, proatividade e flexibilidade são algumas das qualidades mais valorizadas pelas empresas. A mudança de perspectiva está ligada à complexidade dos ambientes de trabalho atuais, que exigem profissionais capazes de colaborar em equipes multidisciplinares e lidar com situações desafiadoras de forma estratégica e equilibrada."
    },
    {
      imagem: "/img/noticias/noticia6.jpg",
      titulo: "Tendências de trabalho remoto em 2025",
      meta: "há 4h • 3.245 leitores",
      texto: "O trabalho remoto, que ganhou força durante a pandemia, continua a se transformar e promete ser ainda mais relevante em 2025. Muitas empresas adotaram definitivamente modelos híbridos, combinando a flexibilidade do home office com a interação presencial nos escritórios. Entre as principais tendências estão a valorização do bem-estar dos colaboradores, o uso de ferramentas digitais mais integradas, a flexibilização de horários e a adoção de métodos de gestão mais horizontais. Especialistas apontam que a cultura organizacional também está passando por ajustes, com mais foco na confiança, autonomia e resultados. Com isso, o modelo remoto deixa de ser apenas uma alternativa emergencial e passa a integrar a estratégia de longo prazo das organizações."
    }
  ];

  return ( 
    <div style={{ fontFamily: "Arial, sans-serif", margin: 0, paddingBottom: "50px" }}>
      <main style={{maxWidth: "1200px", margin: "40px auto 0", padding: "0 20px" }}>
        {noticias.map((noticia, index) => (
          <div key={index} style={{ marginBottom: "50px" }}>
            <img src={noticia.imagem} alt={noticia.titulo} style={{ width: "100%", maxHeight: "600px", height: "auto", borderRadius: "8px", marginBottom: "20px", objectFit: "cover" }} />
            <h2 style={{ fontSize: "1.9em", marginBottom: "10px", color: "#333" }}>{noticia.titulo}</h2>
            <p style={{ color: "#999", fontSize: "0.85em", marginBottom: "15px" }}>{noticia.meta}</p>
            <p style={{ color: "#555", lineHeight: "1.6" }}>{noticia.texto}</p>
          </div>
        ))}
      </main>
    </div>
  );
 
}
