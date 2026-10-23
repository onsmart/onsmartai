# Agentes de IA nas empresas: o que são e quando fazem sentido

**Rascunho para aprovação — não publicado**

**Redação Onsmart.AI**

**Resumo:** Agentes de IA combinam um modelo de linguagem, ferramentas e instruções para executar tarefas de várias etapas. Este artigo explica a diferença para workflows, os controles necessários e quando começar com um escopo menor.

## O que é um agente de IA

Um agente de IA é um sistema que usa um modelo de linguagem para conduzir a execução de um trabalho, escolher entre ferramentas disponíveis e decidir os próximos passos dentro de instruções e limites definidos. Em vez de apenas responder a uma pergunta, ele pode consultar dados, propor uma ação, observar o resultado e continuar ou interromper a tarefa. A definição da OpenAI enfatiza modelo, ferramentas e instruções; a Anthropic descreve o agente como um modelo que dirige dinamicamente o processo e o uso das ferramentas. [1] [2]

Isso não significa autonomia irrestrita. Um agente precisa de objetivo verificável, acesso delimitado, condições de parada e forma clara de devolver o controle a uma pessoa. Ele pode errar ao interpretar pedido, escolher ferramenta ou avaliar resultado. “Agente” descreve uma organização de software, não garantia de inteligência perfeita, resultado automático ou retorno financeiro.

## Workflow e agente não são sinônimos

Em um workflow, o código define previamente o caminho: receber uma solicitação, buscar dados, aplicar uma regra, gerar uma saída e registrar o resultado. Um modelo de linguagem pode participar de uma ou mais etapas, mas a sequência continua principalmente determinada pelo sistema. Na distinção da Anthropic, workflows seguem caminhos de código predefinidos, enquanto agentes direcionam dinamicamente o próprio processo e o uso de ferramentas. [1]

A diferença prática é a previsibilidade. Um workflow serve quando etapas e regras são conhecidas. Um agente ganha espaço quando há exceções, dados não estruturados e número de passos imprevisível. Os formatos podem conviver: um workflow chama um agente para interpretar um documento e aplica validação determinística antes de seguir.

## Ferramentas, memória e controle

O modelo é apenas uma parte da solução. Ferramentas de dados permitem ler documentos ou consultar um CRM; ferramentas de ação podem atualizar um registro ou preparar uma mensagem; ferramentas de orquestração podem delegar uma parte do trabalho a outro componente. Cada ferramenta deve ter nome, parâmetros, escopo e limites compreensíveis, além de testes que revelem usos indevidos. [1] [2]

Memória pode preservar contexto útil entre etapas, mas não deve ser tratada como uma lembrança confiável por padrão. Antes de armazenar algo, é prudente validar o conteúdo, separar sessões e usuários, limitar retenção e revisar dados sensíveis. A OWASP alerta para envenenamento de memória, vazamento de dados e abuso de privilégios entre os riscos de aplicações agentic. [3]

Controle inclui autenticação, autorização fora do modelo, auditoria e condições de parada. Classifique cada ferramenta como leitura ou escrita, avalie sua reversibilidade e estime o impacto financeiro ou operacional. Acesso mínimo, limites de tentativas e de encadeamento ajudam a conter falhas.

## Quando um agente faz sentido

O melhor ponto de partida é um processo que combina linguagem ou documentos não estruturados com decisões de várias etapas e um critério observável de conclusão. Um exemplo hipotético seria uma triagem interna de solicitações de compras: o agente poderia ler a justificativa, buscar a política aplicável, pedir informação ausente e encaminhar uma recomendação. A aprovação final, se houver gasto ou exceção, permaneceria com uma pessoa.

Também pode fazer sentido em suporte interno, revisão inicial de documentos ou investigação de incidentes, desde que haja fontes autorizadas, ferramentas delimitadas e rota de escalonamento. A OpenAI recomenda priorizar fluxos com decisão complexa, regras difíceis de manter ou forte dependência de dados não estruturados, em vez de automatizar por moda. [2]

## Quando não é necessário

Se o processo é uma sequência curta, previsível e baseada em regras claras, um workflow convencional, uma consulta ou uma automação determinística tende a ser mais simples de testar e operar. Uma chamada única ao modelo com recuperação de contexto também pode bastar para uma resposta informativa. A Anthropic recomenda começar pela solução mais simples e aumentar a complexidade somente quando ela melhorar o resultado de forma demonstrável. [1]

Um agente pode ser inadequado quando não há autoridade para agir, os dados são insuficientes ou o custo de um erro supera o benefício da velocidade. Não conceda acesso amplo para compensar instruções vagas. Se a tarefa exige decisão irreversível sem revisão, repense o desenho antes do piloto.

## Comece com baixo escopo

Um piloto responsável pode limitar o agente a um processo, uma fonte de dados e poucas ferramentas. Defina o que ele pode ler, sugerir e nunca executar. Para ações sensíveis, mostre uma prévia com alvo, parâmetros e efeito esperado; exija aprovação explícita vinculada à ação exata. OpenAI e OWASP recomendam intervenção humana para ações de alto risco, irreversíveis ou que ultrapassem limites de falhas e tentativas. [2] [3]

Começar com um único agente e ferramentas claras costuma facilitar manutenção e avaliação. A divisão em vários agentes só deve entrar quando a lógica ou o conjunto de ferramentas estiver realmente difícil de controlar. Em todos os casos, estabeleça máximo de iterações, tempo, chamadas, tokens e custo, além de uma interrupção manual e de um retorno seguro quando o sistema não souber prosseguir.

## Como avaliar custo, risco e valor

Antes de ampliar o uso, monte uma avaliação com casos reais representativos e casos-limite. Compare o agente com o processo atual em qualidade, tempo, custo por tarefa, taxa de escalonamento, erros e tentativas de acesso indevido. A OpenAI sugere estabelecer uma linha de base com um modelo capaz e depois testar modelos menores quando a qualidade continuar aceitável; isso ajuda a discutir custo e latência sem assumir que o modelo mais caro é sempre necessário. [2]

Teste também entradas maliciosas ou ambíguas, documentos contaminados e falhas de ferramenta em ambiente isolado. A OWASP recomenda tratar mensagens, documentos, respostas de APIs e outras entradas externas como não confiáveis, aplicar privilégio mínimo, controlar loops e não depender apenas da saída do modelo para autorizar uma operação. [3] O objetivo não é prometer ROI antes da medição, mas descobrir se o ganho operacional compensa os riscos e a supervisão exigida.

## Uma decisão de gestão

Para gestores, a pergunta útil não é “onde colocar um agente?”, mas “qual decisão ou tarefa precisa de flexibilidade que um workflow não oferece?”. Se a resposta for clara, delimite o menor escopo capaz de testá-la. Mantenha pessoas responsáveis por aprovações de impacto, registre o que o sistema fez e revise o desenho quando ferramentas, dados ou regras mudarem.

Agentes podem tornar processos mais adaptáveis, mas continuam sendo sistemas probabilísticos que operam com permissões concretas. O caminho mais seguro é combinar flexibilidade com controles verificáveis: começar pequeno, medir, limitar e ampliar somente quando as evidências justificarem.

## Fontes e leituras

[1] Anthropic — Building effective agents

[2] OpenAI — A practical guide to building agents

[3] OWASP — AI Agent Security Cheat Sheet

[1]: https://www.anthropic.com/research/building-effective-agents "Building effective agents"
[2]: https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/ "A practical guide to building agents"
[3]: https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html "AI Agent Security Cheat Sheet"
