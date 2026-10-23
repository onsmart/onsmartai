# Como começar a usar IA na empresa: da escolha do problema ao primeiro projeto

**Rascunho para aprovação — não publicado**

**Redação Onsmart.AI**

**Resumo:** Um roteiro prático para gestores escolherem um problema de negócio, prepararem processo, dados e pessoas, testarem IA com segurança e decidirem quando faz sentido escalar.

## Comece pelo problema, não pela ferramenta

A adoção de IA costuma começar com uma demonstração impressionante. Para virar projeto, porém, precisa começar por uma dor observável no trabalho diário. Pergunte qual etapa consome tempo, repete esforço ou cria atrasos e o que uma melhoria mudaria na operação e para o cliente.

Considere um exemplo hipotético: uma equipe recebe solicitações internas por vários canais, classifica cada pedido e encaminha a área responsável. O projeto pode sugerir uma categoria, resumir o pedido e indicar a fila provável, sempre com revisão humana. O problema fica mais claro do que “queremos usar um chatbot”, e o risco fica limitado ao escopo definido.

Antes de escolher a tecnologia, registre uma frase de problema, o processo atual, o resultado esperado e o que ficará fora do projeto. O NIST descreve seu AI Risk Management Framework como uma forma voluntária de incorporar confiança ao desenho, desenvolvimento, uso e avaliação de sistemas de IA. Suas funções — Govern, Map, Measure e Manage — ajudam a organizar esse raciocínio sem substituir o julgamento da empresa. [1]

## Priorize um caso pequeno e mensurável

Nem todo processo frequente é um bom primeiro caso. Prefira uma atividade com objetivo compreensível, volume para gerar observações e comparação com a rotina atual. Evite decisões irreversíveis, processos sem responsável ou integrações que dependam de muitos sistemas.

Uma triagem de documentos, um rascunho de resposta ou a busca em uma base interna podem ser candidatos quando o usuário confere o resultado. Uma recomendação que altere crédito, contratação, segurança ou atendimento crítico exige análise de risco e controles proporcionais antes de automação.

Para cada candidato, responda:

- Qual etapa será assistida e qual decisão continuará humana?
- Que entrada a IA receberá e que saída deverá produzir?
- Como uma pessoa verificará erro, omissão ou informação inventada?
- Qual evidência permitirá dizer que o processo melhorou?

## Examine processo, dados e pessoas juntos

Mapeie o fluxo real, não apenas o procedimento escrito. Identifique quem abre a demanda, fornece contexto, revisa a saída e recebe as exceções. As planilhas paralelas, permissões incompletas e aprovações obrigatórias costumam aparecer nesse mapeamento.

Depois, verifique os dados necessários. Há duplicidade, campos vazios, versões antigas ou informações que não deveriam entrar na ferramenta? Use somente o conjunto necessário e confirme controles de acesso, retenção e registros. A Microsoft recomenda acesso seguro e governado aos dados, junto com treinamento para usar recursos aprovados. [2]

Inclua quem executa e recebe o processo. O gestor define prioridade, o dono da operação conhece exceções e tecnologia avalia integração e suporte. O Google Cloud ressalta mudança organizacional, capacitação e apoio multifuncional para a solução entrar no trabalho cotidiano. [3]

## Transforme risco em limites operacionais

Não espere o piloto falhar para decidir o que a IA pode fazer. Descreva usos permitidos, usos proibidos, fontes aceitas e situações que exigem encaminhamento humano. Defina quem aprova mudanças, acompanha incidentes e pode interromper o fluxo.

Uma tradução prática das funções do NIST é: governar com responsabilidades explícitas; mapear contexto, usuários afetados e dependências; medir qualidade, segurança e comportamento em situações-limite; e gerenciar exceções com correção, registro e revisão. [1] Teste amostras representativas antes de liberar o uso e procure respostas incompletas, classificações erradas, vazamento de informação e excesso de confiança. O objetivo não é prometer uma IA perfeita, mas tornar os limites conhecidos e tratáveis.

Em uma triagem, a saída pode ser sugestão, nunca o envio automático de uma solicitação sensível. Uma pessoa confirma a categoria, corrige o resumo e registra rejeições. Esse circuito preserva uma alternativa manual quando a ferramenta estiver indisponível.

## Desenhe o piloto com uma linha de base

Um piloto útil tem escopo, responsável, período e critério de decisão definidos antes do teste. Limite-o a uma equipe, etapa ou volume acompanhável. Registre a situação atual: tempo até o encaminhamento, retrabalho, erros, reaberturas ou outra medida relevante.

Escolha poucas métricas que conectem operação e risco. Além de tempo e volume, acompanhe qualidade, correção humana, exceções, uso efetivo e incidentes. Converse com quem executa para saber se a ferramenta reduziu esforço ou criou outra etapa de conferência.

Não invente retorno sobre investimento. Some custos observáveis, como licença, integração, treinamento, revisão e suporte, e compare-os com resultados medidos e oportunidades concorrentes. Registre variáveis ausentes como lacunas, não como ganhos. O Google Cloud recomenda examinar indicadores, custos, integração, suporte e manutenção antes da expansão; um resultado inicial sozinho não basta. [3]

## Aprenda durante a operação e decida com evidências

Durante o piloto, mantenha um canal para reportar respostas ruins, dúvidas e efeitos inesperados. Revise amostras, registre alterações na instrução ou na base e veja se os erros se concentram em algum tipo de solicitação. Treine usuários para revisar criticamente.

Ao final, escolha entre escalar, redesenhar ou interromper. Escalar faz sentido quando o resultado alcança o limiar, o risco é controlável, o dono está definido, dados e integração são sustentáveis e há suporte contínuo. Caso contrário, reduza o escopo, corrija a base, ajuste o fluxo ou pare. A Microsoft recomenda direção comum, governança central e o caminho com menor responsabilidade operacional compatível. [2]

O primeiro projeto não precisa provar uma transformação inteira. Precisa ensinar a empresa a escolher problemas, cuidar dos dados, envolver quem trabalha no processo e decidir com evidências. Depois, cada novo caso começa com mais clareza e limites responsáveis.

## Fontes e leituras

[1] NIST AI Risk Management Framework
[2] Microsoft Cloud Adoption Framework — AI strategy
[3] Google Cloud — Organizational readiness for AI adoption and scale

[1]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"
[2]: https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy "Microsoft Cloud Adoption Framework — AI strategy"
[3]: https://cloud.google.com/transform/organizational-readiness-for-ai-adoption-and-scale "Google Cloud — Organizational readiness for AI adoption and scale"
