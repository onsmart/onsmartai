import { Link } from "wouter";
import { MARKETING_EMAIL } from "@shared/contact";

const updatedAt = "26 de outubro de 2025";

export function TermsOfUsePt() {
  return (
    <>
      <p className="legal-updated">Última atualização: {updatedAt}</p>
      <h2>1. Aceitação</h2>
      <p>
        Ao acessar e utilizar o site da Onsmart.AI, você concorda com estes
        Termos de Uso. Se não concordar, interrompa a navegação.
      </p>
      <h2>2. Objeto</h2>
      <p>
        O site apresenta informações institucionais e comerciais sobre educação,
        consultoria, desenvolvimento de soluções de inteligência artificial e a
        plataforma SON.IA. Conteúdos têm caráter informativo; condições
        contratuais definitivas constam de propostas e contratos específicos.
      </p>
      <h2>3. Uso permitido</h2>
      <p>Você deve utilizar o site de forma lícita, sem:</p>
      <ul>
        <li>
          tentar violar segurança, sobrecarregar infraestrutura ou acessar áreas
          restritas;
        </li>
        <li>
          reproduzir materiais protegidos sem autorização, salvo uso pessoal e
          não comercial limitado;
        </li>
        <li>
          inserir conteúdo ilícito, ofensivo ou que viole direitos de terceiros
          em formulários ou canais de contato.
        </li>
      </ul>
      <h2>4. Propriedade intelectual</h2>
      <p>
        Marcas, logotipos, textos, imagens, vídeos, layout e demais conteúdos
        do site pertencem à Onsmart.AI, ao Grupo Onsmart ou a licenciadores, e
        são protegidos pela legislação aplicável. Uso não autorizado pode
        configurar violação de direitos.
      </p>
      <h2>5. Formulários e comunicações</h2>
      <p>
        Ao enviar formulários, você declara que as informações são verídicas e
        autoriza o contato da Onsmart.AI conforme a{" "}
        <Link href="/legal/privacidade">Política de Privacidade</Link>. Canais
        oficiais incluem WhatsApp comercial (+55 11 93068-3562) e{" "}
        <a href={`mailto:${MARKETING_EMAIL}`}>{MARKETING_EMAIL}</a>.
      </p>
      <h2>6. Limitação de responsabilidade</h2>
      <p>
        Empregamos esforços razoáveis para manter informações atualizadas, mas
        não garantimos ausência de erros ou interrupções. Decisões de negócio
        devem considerar due diligence e propostas formais. A Onsmart.AI não se
        responsabiliza por danos indiretos decorrentes do uso do site, na
        extensão permitida pela lei.
      </p>
      <h2>7. Links de terceiros</h2>
      <p>
        Links externos são fornecidos para conveniência. A Onsmart.AI não
        endossa nem responde por conteúdos ou práticas de sites de terceiros.
      </p>
      <h2>8. Alterações dos termos</h2>
      <p>
        Podemos revisar estes Termos a qualquer momento. O uso continuado após
        publicação de alterações implica ciência da versão vigente.
      </p>
      <h2>9. Lei e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil.
        Fica eleito o foro da Comarca de São Paulo/SP, salvo disposição legal
        em contrário aplicável ao consumidor.
      </p>
      <h2>10. Contato</h2>
      <p>
        Dúvidas sobre estes Termos:{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>
      </p>
    </>
  );
}
