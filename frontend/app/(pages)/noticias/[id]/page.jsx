"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

export default function Noticias({ params }) {
  const { id } = use(params);
  const parsedId = parseInt(id);

 const noticias = [
  {
    id: 1,
    imagem: "/img/noticias/noticia1.webp",
    titulo: "Mercado de TI segue aquecido em 2025",
    meta: "há 2h • 1.245 leitores",
    texto: "O mercado de Tecnologia da Informação (TI) manteve-se intensamente aquecido em 2025, superando até mesmo projeções otimistas de analistas do setor. A digitalização contínua dos negócios, aliada à crescente demanda por inovação tecnológica, impulsionou contratações em ritmo acelerado. Setores como fintechs, healthtechs, agritechs e indústrias 4.0 expandiram suas equipes para atender à transformação digital, com destaque para o aumento no investimento em automação de processos, machine learning e integração de sistemas baseados em cloud computing. A carência de mão de obra qualificada permanece como um dos principais desafios, levando empresas a investirem em programas de capacitação interna, parcerias com universidades e até importação de talentos internacionais. Profissionais especializados em DevOps, segurança da informação, ciência de dados, e inteligência artificial são os mais requisitados. Em paralelo, cresce a valorização das certificações técnicas e do domínio de metodologias ágeis. A expectativa é de que esse cenário se intensifique em 2026, à medida que novas tecnologias emergentes, como computação quântica e 6G, entrem no radar das corporações. Além disso, fusões e aquisições em setores tecnológicos continuam impulsionando o ecossistema de startups, o que gera ainda mais demanda por engenheiros de software, gestores de produto e especialistas em cloud. Em ambientes corporativos mais maduros, o investimento em requalificação de times internos e integração entre áreas de TI e negócio torna-se fundamental para garantir a sustentabilidade da inovação. Organizações que conseguirem alinhar tecnologia e estratégia de negócios terão maior competitividade no cenário nacional e internacional."
  },
  {
    id: 2,
    imagem: "/img/noticias/noticia2.webp",
    titulo: "Novas tendências em entrevistas de emprego",
    meta: "há 5h • 876 leitores",
    texto: "O processo de recrutamento tem passado por uma verdadeira revolução. As entrevistas de emprego, tradicionalmente centradas em perguntas-padrão e análise de currículo, vêm sendo reformuladas com o uso de tecnologias e novas metodologias. Ferramentas de inteligência artificial agora ajudam a filtrar candidatos, analisar padrões de comportamento e prever compatibilidade com a cultura organizacional da empresa. Além disso, muitas companhias vêm adotando o conceito de candidate experience, preocupando-se com a jornada do candidato desde o primeiro contato. Isso inclui feedbacks mais rápidos, entrevistas mais humanizadas e maior transparência sobre o processo. Entrevistas assíncronas em vídeo, desafios técnicos gamificados e até avaliações em realidade virtual são algumas das inovações em curso. Soft skills como resiliência, empatia, pensamento crítico e liderança situacional são avaliadas com tanto peso quanto as competências técnicas. Essa abordagem visa criar um ambiente mais inclusivo, adaptado às necessidades contemporâneas dos trabalhadores e à busca por talentos alinhados a valores organizacionais. A diversidade e inclusão também se tornaram pilares fundamentais nos processos seletivos, com a implementação de entrevistas anônimas e análise cega de currículos. Além disso, plataformas automatizadas de vídeo-entrevistas com análise emocional e de linguagem estão cada vez mais sendo utilizadas, gerando dados comportamentais que auxiliam na tomada de decisão. Empresas que adotam essas práticas relatam maior engajamento dos candidatos, redução de turnover e melhoria na reputação da marca empregadora."
  },
  {
    id: 3,
    imagem: "/img/noticias/noticia3.webp",
    titulo: "Como se destacar no LinkedIn",
    meta: "há 1d • 3.421 leitores",
    texto: "Com mais de 65 milhões de usuários no Brasil e mais de 900 milhões no mundo, o LinkedIn consolidou-se como a principal rede profissional global. Para se destacar nesse ambiente competitivo, é essencial ir além de um simples perfil atualizado. Especialistas recomendam a construção de uma marca pessoal forte, com uma imagem de capa atrativa, um resumo estratégico e a inclusão de palavras-chave relevantes para seu setor. Postagens regulares com insights, artigos autorais e comentários pertinentes em discussões do setor ajudam a aumentar o engajamento. Participar de grupos profissionais, interagir com publicações de líderes da indústria e solicitar recomendações de colegas e gestores são estratégias eficazes para ampliar a visibilidade e credibilidade. Também é importante seguir empresas do seu interesse e se candidatar diretamente por meio da plataforma. A adesão ao LinkedIn Learning, para adquirir novas competências e obter certificações, é um diferencial valorizado. Além disso, o algoritmo da plataforma favorece usuários ativos, que interagem de forma consistente com conteúdos de relevância. Investir em storytelling profissional, mostrando resultados reais, trajetória de carreira e valores, gera identificação com recrutadores. A curadoria de conexões e a troca de experiências autênticas também fortalecem o networking. Especialistas recomendam revisar o perfil a cada três meses, destacando conquistas recentes e ajustando palavras-chave às vagas pretendidas. Quem usa a plataforma de forma estratégica tende a ser abordado por recrutadores com mais frequência, muitas vezes antes mesmo de abrir processos seletivos."
  },
  {
    id: 4,
    imagem: "/img/noticias/noticia4.jpg",
    titulo: "Salários em alta para desenvolvedores",
    meta: "há 3h • 2.156 leitores",
    texto: "A escassez de profissionais de TI altamente qualificados resultou em uma valorização acelerada dos salários, especialmente para desenvolvedores. Segundo levantamentos de empresas de consultoria em RH, houve um aumento médio de 20% nos salários base em áreas como desenvolvimento full-stack, mobile e backend em 2024, tendência que se manteve em 2025. As tecnologias mais valorizadas incluem JavaScript (React, Node.js), Python, Go, Rust e Kotlin, bem como experiência com plataformas como AWS, Azure e Google Cloud. Profissionais com domínio de containers (Docker, Kubernetes), arquitetura de microsserviços, e práticas de DevSecOps também são extremamente valorizados. A competição com empresas internacionais aumentou, muitas delas oferecendo salários em moeda forte e modelos remotos. Como resposta, empresas brasileiras estão adotando políticas de benefícios mais robustas, com bônus por desempenho, participação nos lucros, stock options, jornadas flexíveis, licenças estendidas e foco em bem-estar físico e mental. Startups e empresas de médio porte têm inovado em pacotes personalizados para atrair talentos específicos, oferecendo planos de desenvolvimento profissional, mentorias e subsídios para cursos e certificações. A tendência é que essa valorização continue crescendo, especialmente em áreas como inteligência artificial, realidade aumentada e blockchain, onde a demanda global ainda supera em muito a oferta."
  },
  {
    id: 5,
    imagem: "/img/noticias/noticia5.jpg",
    titulo: "Empresas buscam profissionais com soft skills",
    meta: "há 6h • 1.890 leitores",
    texto: "A transformação digital, aliada ao surgimento de modelos de trabalho mais colaborativos e flexíveis, fez com que as soft skills se tornassem prioridade nas contratações. Empresas perceberam que o sucesso dos times depende não apenas do conhecimento técnico, mas da habilidade de se comunicar com clareza, resolver problemas complexos, agir com empatia e lidar com situações de pressão. Pensamento crítico, adaptabilidade, criatividade e escuta ativa estão entre as habilidades mais procuradas. Programas de desenvolvimento de lideranças e treinamentos em inteligência emocional têm sido incorporados às estratégias de RH. Ferramentas como DISC, MBTI e avaliações de inteligência emocional são utilizadas para mapear comportamentos e desenvolver planos personalizados de crescimento. Além disso, a cultura do feedback contínuo e da aprendizagem constante tem substituído avaliações tradicionais de desempenho. Empregadores estão cada vez mais preocupados com o fit cultural e a capacidade de trabalhar em equipes diversas e multidisciplinares. As soft skills também impactam diretamente a experiência do cliente, sendo valorizadas mesmo em áreas técnicas. Colaboradores com inteligência emocional elevada costumam gerar mais confiança e engajamento nos times, o que reflete em melhor performance organizacional. Essa mudança cultural também impulsiona a revisão dos processos seletivos, tornando-os mais inclusivos, humanos e focados em propósito e valores."
  },
  {
    id: 6,
    imagem: "/img/noticias/noticia6.jpg",
    titulo: "Tendências de trabalho remoto em 2025",
    meta: "há 4h • 3.245 leitores",
    texto: "O modelo de trabalho remoto evoluiu significativamente desde seu início emergencial durante a pandemia. Em 2025, consolidou-se como um dos pilares da estratégia organizacional em diversas empresas. Modelos híbridos com liberdade para escolha dos dias presenciais tornaram-se padrão em setores como tecnologia, finanças, educação e economia criativa. Ferramentas como Slack, Zoom, Notion, Miro, Jira e Trello foram aprimoradas e integradas, criando ecossistemas digitais completos que sustentam a colaboração remota. A segurança da informação tornou-se prioridade, com políticas de VPN, autenticação multifator, gestão de dispositivos e governança de dados rígidas. Mais do que infraestrutura tecnológica, o fator humano passou a ocupar o centro das discussões. Empresas investem em programas de bem-estar, saúde mental, ergonomia e formação de líderes para gestão remota. A cultura da confiança vem substituindo o controle rígido, com foco em entregas e autonomia. Profissionais têm mais liberdade geográfica, o que ampliou a diversidade nos times. Empresas que adotaram políticas remotas permanentes relatam redução de custos operacionais, aumento da produtividade e maior retenção de talentos. Para 2026, espera-se a ampliação do uso de ambientes imersivos, como escritórios virtuais em realidade aumentada, e maior integração de inteligência artificial nas rotinas de trabalho remoto."
  }
];


  const noticia = noticias.find((n) => n.id === parsedId);


  if (!noticia) return (
    <section className="bg-gradient-to-b from-[#e8edf1] to-[#ffffff] py-20 px-4 h-200 lg:flex-row items-center justify-center">
      <div className="max-w-screen-xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-center gap-12 h-full">

        <div className="flex flex-col lg:block items-center justify-center h-screen lg:h-auto px-4">
          <div className="text-center lg:text-left max-w-lg">
            <img
              className="w-60 mx-auto lg:mx-0 mb-6 drop-shadow-md"
              src="/img/global/logo_completa.svg"
              alt="Logo da empresa"
            />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Noticia não encontrada
            </h1>
            <p className="text-gray-600 text-base lg:text-lg mb-6">
              Desculpe, não conseguimos encontrar a noticia que você está procurando.<br />
            </p>
            <a
              href="/"
              className="inline-block text-white bg-[#7A3E3E] hover:bg-[#5e2f2f] focus:ring-4 focus:outline-none focus:ring-[#caa] font-medium rounded-lg text-sm px-6 py-3 transition"
            >
              Voltar para a página inicial
            </a>
          </div>
        </div>


        <div className="max-w-sm hidden lg:block">
          <svg width="500" height="auto" viewBox="0 0 752 557" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M680.15 553.837H520.885V548.95C520.885 544.707 522.57 540.637 525.571 537.636C528.572 534.636 532.641 532.95 536.885 532.95H664.15C668.394 532.95 672.464 534.636 675.464 537.636C678.465 540.637 680.15 544.707 680.15 548.95V553.837Z" fill="#E6E6E6" />
            <path d="M596.791 533.925L601.634 531.975C550.957 406.186 555.839 247.493 598.678 111.362C603.767 95.5892 604.134 78.673 599.734 62.6945C595.334 46.7159 586.359 32.3721 573.914 21.4276C549.049 -0.761345 514.769 -6.16676 484.447 7.31934C454.516 20.6333 450.391 43.8243 450.391 66.9025H455.612C455.612 42.2677 460.877 23.519 486.569 12.0905C514.988 -0.548442 547.124 4.52105 570.436 25.3242C582.126 35.6034 590.556 49.0756 594.689 64.0833C598.821 79.091 598.477 94.9795 593.697 109.794C550.364 247.496 545.768 407.28 596.791 533.925Z" fill="#E6E6E6" />
            <path d="M454.307 143.924C464.4 143.924 472.583 135.742 472.583 125.648C472.583 115.554 464.4 107.372 454.307 107.372C444.213 107.372 436.03 115.554 436.03 125.648C436.03 135.742 444.213 143.924 454.307 143.924Z" fill="#E7EABB" />
            <path d="M426.159 157.509V122.879H431.544V157.509C433.088 158.134 434.367 159.276 435.162 160.741C435.956 162.205 436.217 163.9 435.899 165.536C435.58 167.171 434.703 168.645 433.418 169.705C432.132 170.764 430.518 171.344 428.851 171.344C427.185 171.344 425.571 170.764 424.285 169.705C423 168.645 422.122 167.171 421.804 165.536C421.486 163.9 421.746 162.205 422.541 160.741C423.335 159.276 424.615 158.134 426.159 157.509Z" fill="#E6E6E6" />
            <path d="M400.13 96.275C400.139 88.3145 403.306 80.6827 408.935 75.0538C414.564 69.4249 422.195 66.2586 430.156 66.2495H479.763C487.726 66.2495 495.364 69.4129 500.994 75.0438C506.625 80.6747 509.789 88.3118 509.789 96.275C509.789 104.238 506.625 111.875 500.994 117.506C495.364 123.137 487.726 126.301 479.763 126.301H430.156C422.195 126.291 414.564 123.125 408.935 117.496C403.306 111.867 400.139 104.235 400.13 96.275Z" fill="#7B2D26" />
            <path d="M330.235 282.212C335.216 218.489 360.682 188.129 344.376 169.089C328.756 150.851 284.759 154.619 256.504 172.119C180.291 219.321 152.37 407.452 250.443 499.368C343.638 586.712 520.26 558.737 559.512 487.247C568.67 470.567 575.946 441.325 562.542 423.616C529.263 379.649 408.271 459.285 354.476 409.475C322.596 379.956 327.502 317.183 330.235 282.212Z" fill="#7B2D26" />
            <path d="M388.493 250.554C386.642 251.406 385.196 252.946 384.464 254.847C383.731 256.748 383.769 258.86 384.569 260.734C384.738 261.112 384.938 261.476 385.167 261.821L368.809 283.663L376.971 295.863L396.145 263.52C397.503 262.46 398.473 260.981 398.902 259.313C399.331 257.644 399.196 255.881 398.518 254.297C398.123 253.4 397.556 252.589 396.848 251.911C396.14 251.233 395.305 250.701 394.392 250.345C393.478 249.99 392.504 249.818 391.524 249.839C390.543 249.86 389.577 250.074 388.68 250.469C388.617 250.497 388.555 250.525 388.493 250.554Z" fill="#FFB6B6" />
            <path d="M388.48 288.213C389.55 289.162 386.581 290.334 383.44 288.485C382.541 287.95 382.157 287.728 382.056 287.869C381.803 288.223 383.278 290.829 382.884 296.616C382.642 300.07 376.905 306.565 370.39 312.898C361.583 321.463 351.341 329.725 351.341 329.725L347.745 326.846L310.041 296.616L303.678 287.809C304.26 284.331 305.135 280.908 306.294 277.577C307.889 272.967 309.785 268.466 311.97 264.103C313.142 261.73 314.344 259.467 315.495 257.387L335.696 279.648L352.624 298.293C352.624 298.293 357.553 290.354 361.37 288.193C361.857 287.882 362.411 287.691 362.987 287.637C366.845 287.455 367.077 285.354 362.603 280.779C358.128 276.204 363.774 280.476 367.754 279.244C371.733 278.011 367.754 279.244 368.592 276.163C369.431 273.083 380.591 266.901 380.591 266.901L381.056 267.315L389.49 274.759L391.904 276.89C391.904 276.89 389.267 284.122 388.54 285.647C387.813 287.172 387.419 287.253 388.48 288.213Z" fill="#E6E6E6" fill-opacity="0.823529" />
            <path d="M610.804 428.521L611.215 417.38L568.439 410.493L567.832 426.935L610.804 428.521Z" fill="#FFB6B6" />
            <path d="M603.039 431.875L602.633 414.037L610.259 414.319L622.57 397.828C623.178 397.014 624.031 396.415 625.003 396.119C625.975 395.823 627.017 395.846 627.975 396.184C628.934 396.522 629.759 397.158 630.331 397.998C630.903 398.838 631.191 399.84 631.153 400.855L630.371 422.045L622.694 425.419L630.184 427.124L629.889 435.113L603.039 431.875Z" fill="#2F2E41" />
            <path d="M370.055 432.858L505.543 436.294C505.543 436.294 564.051 439.673 577.779 430.743L592.255 428.915L593.039 407.652C593.039 407.652 584.187 407.717 579.098 405.346C574.008 402.974 577.545 400.073 572.693 402.926C567.84 405.779 568.353 406.122 564.601 404.811C560.85 403.5 388.806 377.276 388.806 377.276L370.055 432.858Z" fill="#090814" />
            <path d="M548.592 423.631L556.471 415.744L529.796 381.601L518.168 393.243L548.592 423.631Z" fill="#FFB6B6" />
            <path d="M540.619 416.769L552.453 403.417L557.852 408.809L578.093 405.093C579.093 404.91 580.125 405.05 581.039 405.495C581.953 405.939 582.701 406.664 583.174 407.564C583.647 408.464 583.819 409.491 583.667 410.496C583.515 411.501 583.045 412.431 582.327 413.15L567.342 428.153L559.418 425.404L563.75 431.748L558.1 437.405L540.619 416.769Z" fill="#2F2E41" />
            <path d="M316.601 358.657L317.948 389.967C319.533 426.826 360.126 449.135 391.602 429.89C392.182 429.535 392.764 429.168 393.348 428.788C393.348 428.788 405.281 425.583 404.919 420.508C404.556 415.433 407.471 412.964 410.051 414.347C412.631 415.731 446.408 367.795 446.408 367.795C446.408 367.795 516.586 402.801 532.068 411.042C532.068 411.042 546.624 388.283 545.569 388.521C544.514 388.76 458.75 328.733 458.75 328.733C458.75 328.733 444.778 314.593 427.447 323.929C427.086 325.3 427.394 325.348 427.394 325.348L370.141 372L362.052 356.637L316.601 358.657Z" fill="#090814" />
            <path d="M370.582 319.513C370.473 320.96 370.267 322.397 369.966 323.816C369.553 325.87 368.889 327.864 367.986 329.755C367.986 329.755 367.986 331.866 363.946 338.936C359.906 346.006 364.956 342.976 367.986 348.228C371.016 353.47 367.986 351.056 364.623 354.43C363.654 355.412 362.967 356.635 362.631 357.972C362.295 359.31 362.324 360.713 362.714 362.035C362.714 362.035 319.323 362.066 311.243 359.036C303.163 356.006 301.324 338.936 308.566 337.249C315.798 335.563 306.375 333.886 302.122 329.997C297.87 326.109 306.374 319.746 306.374 319.746C306.374 319.746 302.87 313.696 303.163 293.384C303.204 291.516 303.376 289.653 303.678 287.808C304.26 284.33 305.135 280.908 306.294 277.577C307.889 272.966 309.785 268.465 311.97 264.103C313.142 261.73 314.344 259.467 315.495 257.386C315.677 257.063 315.848 256.75 316.03 256.437C318.222 252.559 320.222 249.387 321.545 247.357C322.565 245.781 323.181 244.892 323.181 244.892L330.534 232.105L355.078 243.61L353.684 262.426L357.916 276.617L359.865 283.152L361.37 288.192L363.694 296C363.694 296 363.057 296.03 363.815 297.07C367.303 301.709 369.565 307.152 370.39 312.897C370.681 315.09 370.745 317.307 370.582 319.513Z" fill="#E6E6E6" />
            <path d="M441.462 321.541L441.001 321.392L382.257 302.476L403.904 231.459C404.335 230.045 405.081 228.747 406.087 227.663C407.092 226.579 408.331 225.738 409.709 225.202C411.087 224.667 412.568 224.451 414.042 224.571C415.515 224.692 416.943 225.145 418.215 225.897L455.755 248.076C458.727 249.83 460.988 252.572 462.143 255.823C463.298 259.075 463.273 262.629 462.074 265.864L441.462 321.541Z" fill="#7B2D26" />
            <path d="M441.7 326.056L382.483 306.987L404.13 235.97C404.561 234.556 405.308 233.258 406.313 232.174C407.319 231.091 408.557 230.249 409.935 229.714C411.313 229.178 412.795 228.962 414.269 229.083C415.742 229.203 417.169 229.656 418.442 230.408L457.774 250.046C463.683 253.536 463.545 262.569 460.801 269.981L441.7 326.056Z" fill="#E6E6E6" />
            <path d="M435.771 331.196C434.408 331.965 432.899 332.443 431.341 332.597C429.783 332.752 428.21 332.582 426.721 332.096L388.871 319.907C385.967 318.958 383.549 316.912 382.134 314.204C380.719 311.497 380.418 308.343 381.296 305.417L400.273 243.162C400.652 241.918 401.276 240.763 402.107 239.763C402.939 238.764 403.962 237.94 405.116 237.341C406.27 236.742 407.532 236.38 408.828 236.275C410.124 236.17 411.428 236.325 412.663 236.731L451.887 249.61C453.756 250.223 455.483 251.205 456.966 252.497C458.45 253.79 459.659 255.366 460.522 257.133C461.386 258.901 461.887 260.823 461.995 262.787C462.103 264.751 461.817 266.717 461.153 268.569L440.863 325.134C439.952 327.702 438.144 329.855 435.771 331.196Z" fill="#7B2D26" />
            <path d="M353.691 232.324C368.664 232.324 380.801 220.186 380.801 205.214C380.801 190.242 368.664 178.104 353.691 178.104C338.719 178.104 326.581 190.242 326.581 205.214C326.581 220.186 338.719 232.324 353.691 232.324Z" fill="#FFB6B6" />
            <path d="M262.017 232.732C264.505 237.555 268.584 241.368 273.563 243.526C275.55 244.431 277.639 245.092 279.785 245.495C280.392 243.089 281.363 240.791 282.664 238.679C282.231 241.059 282.231 243.498 282.664 245.879C285.934 246.146 289.223 245.738 292.327 244.679C295.376 243.642 298.142 241.909 300.404 239.617C302.667 237.325 304.364 234.537 305.361 231.475C307.521 224.289 305.195 216.614 305.011 209.113C304.823 201.611 308.385 192.639 315.832 191.711C321.503 191.003 320.802 191.552 324.877 195.559C319.177 201.891 333.073 229.936 340.529 228.697C344.745 227.996 347.847 224.649 348.681 224.765C352.951 235.221 340.107 250.051 350.294 254.919L349.538 253.919C344.206 245.11 359.983 230.233 354.651 221.425C353.165 218.961 351.619 216.072 352.539 213.346C353.412 210.754 357.832 209.934 358.765 212.293C357.249 206.886 361.481 200.541 367.102 199.989C372.096 199.496 371.808 200.919 376.57 202.218C377.178 200.167 378.055 198.205 379.177 196.384C378.798 198.462 378.751 200.587 379.039 202.68C380.756 202.885 382.493 202.517 383.98 201.634C388.377 198.998 388.508 192.194 385.487 188.053C382.461 183.911 377.393 181.866 372.503 180.318C372.458 169.977 344.631 165.026 339.513 174.641C338.987 166.856 330.063 161.612 322.375 162.934C314.688 164.257 308.623 170.421 304.925 177.291C301.229 184.156 299.393 191.844 296.687 199.156C293.981 206.469 290.112 213.76 283.631 218.099C277.152 222.432 267.522 222.826 262.112 217.209C260.878 219.608 260.226 222.263 260.21 224.96C260.193 227.656 260.813 230.319 262.017 232.732Z" fill="#2F2E41" />
            <path d="M289.834 356.705C290.395 356.256 291.004 355.871 291.649 355.556C302.026 350.391 334.294 336.986 359.526 337.536C408.074 338.594 469.858 392.173 455.479 428.153C444.537 455.531 390.142 471.107 350.436 458.649C294.81 441.197 272.854 370.244 289.834 356.705Z" fill="#7B2D26" />
            <path d="M88.2914 553.941C72.4279 550.948 58.3859 479.48 89.5969 444.282C100.29 432.223 113.629 426.974 131.371 422.09C233.493 393.975 311.383 420.769 321.85 427.311C332.293 433.839 350.602 532.187 327.19 546.108C314.017 553.941 287.908 557.857 274.972 548.719C255.937 535.273 287.887 500.395 273.666 476.919C257.529 450.278 172.551 441.304 129.948 467.781C84.494 496.028 178.25 570.912 88.2914 553.941Z" fill="#F2F2F2" />
            <path d="M194.353 432.43H133.749C118.788 418.092 108.091 404.274 116.655 392.804C116.655 389.507 117.965 386.345 120.296 384.014C122.628 381.682 125.79 380.373 129.087 380.373H199.015C202.312 380.373 205.474 381.682 207.805 384.014C210.137 386.345 211.446 389.507 211.446 392.804C214.707 405.874 208.882 419.084 194.353 432.43Z" fill="#CCCCCC" />
            <path d="M183.469 364.722C182.894 364.749 182.325 364.598 181.838 364.29C181.352 363.982 180.972 363.532 180.75 363.001C180.528 362.47 180.474 361.883 180.597 361.321C180.719 360.759 181.012 360.247 181.434 359.857L181.627 359.092C181.601 359.031 181.576 358.969 181.55 358.908C180.971 357.54 180 356.373 178.76 355.555C177.52 354.737 176.065 354.303 174.58 354.308C173.094 354.314 171.643 354.758 170.409 355.586C169.175 356.414 168.213 357.587 167.643 358.96C165.369 364.438 162.473 369.925 161.76 375.718C161.446 378.278 161.578 380.873 162.152 383.388C156.809 371.735 154.035 359.069 154.017 346.249C154.016 343.033 154.195 339.818 154.553 336.621C154.848 334 155.259 331.398 155.783 328.815C158.647 314.797 164.794 301.658 173.721 290.477C178.042 288.12 181.536 284.495 183.733 280.09C184.529 278.507 185.092 276.817 185.403 275.072C184.916 275.136 183.565 267.713 183.933 267.258C183.254 266.227 182.038 265.715 181.296 264.709C177.607 259.707 172.524 260.58 169.87 267.377C164.201 270.238 164.147 274.983 167.625 279.547C169.838 282.45 170.142 286.378 172.083 289.486C171.884 289.742 171.676 289.99 171.476 290.246C167.825 294.941 164.642 299.983 161.974 305.299C162.623 299.344 161.848 293.319 159.715 287.721C157.552 282.503 153.498 278.11 149.928 273.599C145.641 268.182 136.848 270.546 136.093 277.414C136.085 277.48 136.078 277.547 136.071 277.613C136.602 277.912 137.121 278.23 137.628 278.565C138.266 278.992 138.761 279.601 139.047 280.313C139.333 281.025 139.397 281.806 139.231 282.556C139.065 283.305 138.676 283.986 138.117 284.511C137.557 285.035 136.851 285.378 136.093 285.495L136.015 285.507C136.204 287.418 136.538 289.312 137.014 291.173C132.435 308.883 142.321 315.333 156.438 315.623C156.75 315.783 157.054 315.942 157.365 316.094C154.685 323.691 153.003 331.603 152.364 339.633C152.001 344.371 152.023 349.13 152.427 353.864L152.403 353.696C151.381 348.432 148.572 343.682 144.453 340.249C138.335 335.223 129.691 333.372 123.091 329.332C122.389 328.882 121.573 328.642 120.74 328.639C119.906 328.637 119.089 328.874 118.386 329.321C117.682 329.768 117.121 330.407 116.768 331.162C116.416 331.917 116.287 332.758 116.396 333.584C116.405 333.643 116.414 333.702 116.423 333.761C117.407 334.161 118.365 334.623 119.292 335.143C119.822 335.442 120.341 335.76 120.849 336.095C121.487 336.522 121.981 337.131 122.267 337.843C122.553 338.555 122.617 339.336 122.451 340.085C122.285 340.835 121.897 341.516 121.337 342.041C120.777 342.565 120.072 342.909 119.314 343.025L119.236 343.037C119.18 343.045 119.132 343.053 119.076 343.061C120.757 347.076 123.117 350.77 126.052 353.984C128.915 369.444 141.213 370.911 154.369 366.409H154.377C155.82 372.681 157.912 378.787 160.617 384.627H182.91C182.99 384.379 183.062 384.123 183.134 383.876C181.071 384.005 178.999 383.882 176.966 383.508C178.62 381.479 180.273 379.433 181.927 377.403C181.964 377.366 181.999 377.325 182.031 377.284C182.87 376.245 183.717 375.214 184.556 374.175L184.557 374.174C184.601 370.99 184.235 367.813 183.469 364.722Z" fill="#CCCCCC" />
            <path d="M259.506 429.183C259.875 430.259 260.577 431.191 261.509 431.844C262.441 432.497 263.557 432.838 264.695 432.818L286.928 432.245C288.074 432.223 289.182 431.83 290.087 431.126C290.992 430.421 291.644 429.443 291.947 428.337L295.093 394.695C296.209 395.2 297.425 395.45 298.65 395.425C300.799 395.371 302.84 394.466 304.322 392.907C305.804 391.349 306.606 389.266 306.552 387.116C306.498 384.967 305.592 382.926 304.034 381.444C302.476 379.963 300.392 379.16 298.243 379.214C297.753 379.213 297.265 379.264 296.786 379.366C296.265 378.802 295.632 378.354 294.927 378.05C294.223 377.746 293.463 377.593 292.695 377.601L258.496 378.484C258.212 378.494 257.93 378.529 257.653 378.589C256.903 378.729 256.191 379.027 255.566 379.465C254.942 379.903 254.418 380.469 254.03 381.127C253.643 381.784 253.401 382.516 253.32 383.275C253.239 384.034 253.322 384.801 253.563 385.525L259.506 429.183ZM295.738 392.41L297.977 384.393C298.232 383.467 298.238 382.49 297.994 381.561C298.103 381.561 298.199 381.509 298.307 381.509C299.842 381.478 301.327 382.056 302.436 383.118C303.545 384.179 304.188 385.637 304.224 387.172C304.26 388.706 303.686 390.193 302.628 391.305C301.569 392.417 300.113 393.064 298.579 393.105C297.586 393.136 296.604 392.896 295.738 392.41Z" fill="#CCCCCC" />
            <path d="M257.652 378.589C258.381 382.755 266.573 385.683 276.422 385.174C285.48 384.757 292.886 381.577 294.243 377.807C293.741 377.659 293.219 377.589 292.695 377.601L258.496 378.484C258.212 378.494 257.93 378.53 257.652 378.589Z" fill="white" />
            <path d="M1.19067 555.518L749.941 555.825C750.256 555.825 750.559 555.7 750.783 555.477C751.006 555.253 751.131 554.951 751.131 554.635C751.131 554.319 751.006 554.016 750.783 553.793C750.559 553.57 750.256 553.444 749.941 553.444L1.19067 553.137C0.874886 553.137 0.572035 553.262 0.34874 553.485C0.125444 553.709 0 554.012 0 554.327C0 554.643 0.125444 554.946 0.34874 555.169C0.572035 555.393 0.874886 555.518 1.19067 555.518Z" fill="#CACACA" />
            <path d="M421.141 289.414C419.105 289.488 417.178 290.354 415.77 291.827C414.363 293.3 413.586 295.265 413.604 297.302C413.615 297.716 413.659 298.129 413.738 298.535L390.239 312.409L393.084 326.809L423.219 304.324C424.88 303.869 426.344 302.876 427.382 301.501C428.42 300.126 428.973 298.446 428.956 296.723C428.937 295.743 428.724 294.777 428.332 293.878C427.939 292.98 427.373 292.168 426.666 291.489C425.959 290.81 425.126 290.276 424.213 289.919C423.3 289.561 422.326 289.387 421.346 289.407C421.277 289.408 421.209 289.41 421.141 289.414Z" fill="#FFB6B6" />
            <path d="M401.892 322.487C401.263 321.645 400.993 321.292 400.85 321.389C400.482 321.611 400.836 324.586 398.248 329.772C394.605 337.056 356.404 348.214 356.404 348.214L351.701 339.603L331.013 301.764L323.882 271.434C323.633 270.376 323.512 269.293 323.522 268.206C329.879 263.732 336.631 259.846 343.693 256.595C346.515 258.196 348.666 260.759 349.753 263.816L363.994 303.745L369.677 319.687C369.677 319.687 379.701 312.519 383.337 313.835C386.967 315.159 387.999 313.302 385.626 307.36C383.253 301.417 386.815 307.534 390.959 307.923C395.113 308.318 390.959 307.923 392.921 305.401C394.883 302.88 407.566 301.461 407.566 301.461L407.835 302.024L412.75 312.134L414.157 315.039C414.157 315.039 408.947 320.692 407.69 321.819C406.427 322.954 406.036 322.875 406.655 324.168C407.265 325.456 404.075 325.397 401.892 322.487Z" fill="#E6E6E6" />
          </svg>

        </div>

      </div>
    </section>
  );

  return (
    <div style={{
      margin: 0,
      paddingBottom: "50px",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      <main style={{
        maxWidth: "1400px",
        margin: "60px auto 0",
        padding: "0 5%",
        boxSizing: "border-box"
      }}>
        <img
          src={noticia.imagem}
          alt={noticia.titulo}
          style={{
            width: "100%",
            maxHeight: "700px",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "25px",
            objectFit: "cover"
          }}
        />
        <h2 style={{
          fontSize: "clamp(2em, 2.8vw, 2.5em)",
          marginBottom: "15px",
          color: "#7B2D26",
          textAlign: 'justify'
        }}>{noticia.titulo}</h2>
        <p style={{
          color: "#999",
          fontSize: "clamp(0.9em, 1.5vw, 1em)",
          marginBottom: "20px"
        }}>{noticia.meta}</p>
        <p style={{
          color: "#555",
          lineHeight: "1.7",
          fontSize: "clamp(1.05em, 2vw, 1.3em)",
          textAlign: 'justify'
        }}>{noticia.texto}</p>
      </main>
    </div>
  );
}
