import { MARKETING_EMAIL } from "@shared/contact";

const updatedAt = "26 de outubro de 2025";

export function PrivacyPolicyPt() {
  return (
    <>
      <p className="legal-updated">Última atualização: {updatedAt}</p>
      <h2>1. Quem somos</h2>
      <p>
        Esta Política de Privacidade descreve como a <strong>Onsmart.AI</strong>
        , empresa do Grupo Onsmart, trata dados pessoais no site{" "}
        <strong>onsmart.ai</strong> e canais associados. Endereços: Rua Arizona,
        1349, Conj. 1B, Cidade Monções, São Paulo/SP; Rua Comendador Araújo,
        499, Cj. 1003, Centro, Curitiba/PR.
      </p>
      <h2>2. Dados que podemos tratar</h2>
      <ul>
        <li>
          <strong>Navegação:</strong> endereço IP, tipo de navegador, páginas
          visitadas, data e hora de acesso e dados técnicos similares gerados
          pelo uso do site.
        </li>
        <li>
          <strong>Contato e marketing:</strong> nome, e-mail, telefone, empresa,
          assunto e mensagem quando você preenche formulários ou solicita
          conteúdos.
        </li>
        <li>
          <strong>Preferências de cookies:</strong> categorias aceitas e data
          da escolha, armazenadas localmente no navegador.
        </li>
        <li>
          <strong>CMS e administração:</strong> dados de autenticação de
          usuários autorizados no painel administrativo, quando aplicável.
        </li>
      </ul>
      <h2>3. Finalidades e bases legais</h2>
      <p>Tratamos dados pessoais para:</p>
      <ul>
        <li>
          responder solicitações comerciais e de suporte (execução de
          procedimentos preliminares ou consentimento);
        </li>
        <li>
          enviar conteúdos e comunicações sobre IA corporativa, quando
          autorizado por você (consentimento);
        </li>
        <li>
          operar, proteger e melhorar o site, incluindo métricas de uso quando
          cookies de análise forem aceitos (legítimo interesse ou
          consentimento, conforme a categoria);
        </li>
        <li>
          cumprir obrigações legais e exercer direitos em processos
          judiciais ou administrativos (obrigação legal ou legítimo interesse).
        </li>
      </ul>
      <h2 id="cookies">4. Cookies e tecnologias similares</h2>
      <p>
        Utilizamos cookies essenciais para o funcionamento do site e, com sua
        autorização, cookies de análise e marketing. Suas preferências podem ser
        gerenciadas pelo banner de cookies ou pelo link{" "}
        <strong>Preferências de cookies</strong> no rodapé. A chave local{" "}
        <code>onsmart-consent-v1</code> registra sua escolha no navegador.
      </p>
      <h2>5. Compartilhamento</h2>
      <p>
        Podemos compartilhar dados com prestadores de hospedagem, ferramentas de
        análise, CRM, comunicação e armazenamento, sempre dentro das finalidades
        desta política e com obrigações de confidencialidade e segurança. Não
        vendemos dados pessoais.
      </p>
      <h2>6. Retenção</h2>
      <p>
        Mantemos os dados pelo tempo necessário às finalidades descritas, para
        cumprimento de obrigações legais ou exercício de direitos, observados
        critérios de minimização e revisão periódica.
      </p>
      <h2>7. Seus direitos (LGPD)</h2>
      <p>
        Você pode solicitar confirmação de tratamento, acesso, correção,
        anonimização, portabilidade, eliminação, informação sobre
        compartilhamentos, revogação de consentimento e revisão de decisões
        automatizadas, nos termos da Lei nº 13.709/2018. Para exercer seus
        direitos, escreva para{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>.
      </p>
      <h2>8. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais compatíveis com a natureza
        dos dados tratados. Nenhum ambiente digital é totalmente isento de
        riscos; em caso de incidente relevante, adotaremos as medidas previstas
        em lei.
      </p>
      <h2>9. Links externos</h2>
      <p>
        O site pode conter links para WhatsApp, redes sociais, YouTube e sites
        de terceiros, com políticas próprias. A Onsmart.AI não controla o
        tratamento de dados nesses ambientes.
      </p>
      <h2>10. Alterações</h2>
      <p>
        Esta política pode ser atualizada. A data da última revisão será
        indicada no topo da página. Alterações relevantes poderão ser
        comunicadas por meio do site.
      </p>
      <h2>11. Contato</h2>
      <p>
        Encarregado / canal de privacidade:{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>
        <br />
        Contato comercial:{" "}
        <a href={`mailto:${MARKETING_EMAIL}`}>{MARKETING_EMAIL}</a>
      </p>
    </>
  );
}
