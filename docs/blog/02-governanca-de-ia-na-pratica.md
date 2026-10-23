# Governança de IA na prática: dados, responsabilidades e supervisão humana

**Rascunho para aprovação — não publicado**

**Redação Onsmart.AI**

**Resumo:** Governança de IA é definir quais dados entram, quem autoriza cada uso, como os resultados são monitorados e quando uma pessoa deve intervir. Este guia propõe práticas para gestores e distingue orientação voluntária de obrigações legais aplicáveis.

## Governança começa pelo uso, não pela ferramenta

Governança de IA não é apenas aprovar uma política. É tomar decisões verificáveis sobre finalidade, risco, acesso e resposta a falhas. Antes de escolher um modelo, descreva o processo que será apoiado, quem pode ser afetado, qual resultado será produzido e o que aconteceria se ele estiver errado. Essa descrição ajuda a decidir se a IA deve sugerir, classificar, redigir ou apenas organizar informações.

O NIST AI Risk Management Framework (AI RMF) oferece uma referência voluntária para incorporar confiabilidade ao desenho, desenvolvimento, uso e avaliação de sistemas de IA. Ele organiza o trabalho em Governar, Mapear, Medir e Gerenciar. O próprio NIST ressalta que o framework não substitui uma avaliação de contexto nem cria, por si só, uma obrigação legal. [1]

## Dados: finalidade, qualidade e acesso

Comece pelo inventário: quais dados entram, de onde vêm, quem pode consultá-los, por quanto tempo precisam ficar disponíveis e para que finalidade serão usados. Registre também limitações conhecidas, dados ausentes e possíveis distorções. Um conjunto grande não é automaticamente adequado; qualidade depende do uso e do contexto.

Acesso deve seguir a necessidade da tarefa, não a conveniência da ferramenta. Uma prática sugerida é separar leitura de escrita, reduzir campos ao mínimo necessário, controlar exportações e manter registros de consultas e alterações. Para dados sensíveis ao negócio, avalie ainda segregação de ambientes e retenção. Esses controles são decisões de gestão e segurança; não devem ser apresentados como uma fórmula universal de conformidade.

## Responsabilidades e aprovações sem criar cargos fictícios

Uma matriz simples evita que “a IA decidiu” vire a explicação quando algo dá errado. Para cada uso, defina internamente quem responde pela finalidade de negócio, quem mantém dados e configurações, quem avalia riscos técnicos, quem aprova uma ação sensível e quem recebe incidentes. As pessoas podem acumular funções, desde que a acumulação não elimine a revisão necessária.

A aprovação deve estar ligada a uma ação concreta. Um sistema pode preparar uma resposta, recomendar uma prioridade ou preencher um rascunho sem autorização para enviar, contratar, excluir ou alterar um registro. Em ações financeiras, externas, irreversíveis ou com possível impacto sobre pessoas, a organização pode exigir revisão explícita e registrar quem aprovou, o que foi visto e quais ressalvas existiam.

## Supervisão humana que funciona

Supervisão humana não é carimbo automático. A pessoa precisa ter tempo, informação e autoridade para aceitar, corrigir, devolver ou interromper a saída. Mostre a solicitação recebida, o resultado, as fontes usadas quando disponíveis, as limitações conhecidas e o efeito esperado da ação. Não trate uma pontuação de confiança do modelo como prova suficiente de correção.

Um exemplo hipotético: uma IA pode organizar pedidos de compras e sugerir a rota de aprovação, mas uma pessoa verifica exceções, valores e conflitos antes de qualquer compromisso. Se faltarem dados, se a recomendação fugir do escopo ou se houver impacto maior que o previsto, a saída deve voltar para análise. Defina antes quando a intervenção é obrigatória e como desfazer ou conter uma ação.

## Monitoramento, mudanças e incidentes

A governança continua depois da entrada em operação. Acompanhe qualidade das respostas, erros, recusas, revisões humanas, tentativas de acesso indevido, mudanças nos dados e sinais de uso fora do propósito. Compare o comportamento com critérios definidos para o caso, sem transformar uma métrica isolada em garantia de segurança ou resultado.

Registros devem permitir reconstruir o que aconteceu, mas não devem coletar dados indiscriminadamente. Ao detectar um incidente, preserve evidências, limite o acesso afetado, interrompa a ação de risco quando necessário e encaminhe o caso para as áreas internas pertinentes. Depois, avalie causa, impacto, comunicação e correção. Obrigações de notificação e outras medidas dependem do contexto, dos contratos e das leis aplicáveis; não devem ser presumidas neste artigo. O NIST e a OCDE tratam monitoramento, rastreabilidade e gestão contínua de riscos como partes do ciclo de vida. [1] [4]

## Fornecedores também fazem parte do controle

Um fornecedor de modelo, dados, hospedagem ou integração altera o risco do sistema. Antes de contratar ou ampliar o uso, pergunte quais dados serão enviados, se há retenção, quem pode acessá-los, como mudanças são comunicadas e quais recursos existem para auditoria, exclusão, reversão e resposta a incidentes. Documente limites de serviço e dependências relevantes.

Essas verificações são boas práticas sugeridas, não uma lista universal de requisitos contratuais. NIST e OCDE destacam a necessidade de considerar terceiros, cadeia de fornecimento, rastreabilidade e cooperação entre os atores conforme o contexto. [2] [4]

## Um ciclo prático para começar

Um ciclo enxuto pode seguir cinco movimentos:

- Registrar finalidade, usuários, dados, ação permitida e tolerância a risco.
- Classificar acessos e testar entradas representativas, ambíguas e fora do escopo.
- Definir aprovação humana, condição de parada, retorno seguro e trilha de evidências.
- Medir qualidade, erros, revisões, incidentes e mudanças relevantes após o uso.
- Reavaliar fornecedor, dados e controles antes de ampliar o escopo.

O resultado esperado é visibilidade para decidir, não um certificado automático. O Playbook do NIST apresenta ações sugeridas para os resultados do AI RMF, mas esclarece que não é checklist nem conjunto obrigatório de etapas. [2]

## LGPD: contexto, não atalho

Quando o uso envolve informação relacionada a pessoa natural identificada ou identificável, pode haver tratamento de dados pessoais no contexto da LGPD. A ANPD explica que controlador é quem toma as principais decisões e define finalidade e elementos essenciais; operador atua em nome do controlador e segundo suas instruções. A própria ANPD também descreve o encarregado como canal de comunicação com titulares e com a Autoridade. [3]

Isso não permite concluir, sem examinar o caso, qual base legal, contrato, retenção, transferência ou medida de segurança deve ser adotada. Também não cabe transformar uma prática interna em “exigência da LGPD” sem fundamento específico. NIST, OCDE e este artigo oferecem orientação de governança; não substituem a análise das normas efetivamente aplicáveis. Este texto é informativo e não constitui aconselhamento jurídico específico.

## A decisão de gestão

Governança de IA funciona quando conecta dados, permissões, aprovações, monitoramento e resposta a incidentes ao processo real. Comece com escopo controlado, mantenha uma pessoa capaz de intervir e amplie somente quando as evidências do próprio uso justificarem. A responsabilidade não desaparece porque uma ferramenta produziu a primeira sugestão.

## Fontes e leituras

[1] NIST — AI Risk Management Framework

[2] NIST — AI RMF Playbook

[3] ANPD — Titular de Dados

[4] OECD — AI principles

[1]: https://www.nist.gov/itl/ai-risk-management-framework "AI Risk Management Framework"
[2]: https://airc.nist.gov/airmf-resources/playbook/ "NIST AI RMF Playbook"
[3]: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados "Titular de Dados"
[4]: https://www.oecd.org/en/topics/ai-principles.html "OECD AI principles"
