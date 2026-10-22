# Diagnóstico — proposta de evolução em 22/10

Status: desenho para revisão, não implementado. Eduardo pediu melhorar o fluxo hoje percebido como três perguntas simples. A versão fonte c3e70f9 tem quatro fases (dor, driver, base, urgência) e resultado; a divergência de contagem não muda a necessidade de aprofundamento. Home/Sobre estão em etapa separada no Geral.

**Aprovado pelo Eduardo em22/10:** “Prioridades e plano inicial” e “Sim, com prioridades e plano inicial”, nas duas respostas de validação. Implementação autorizada pelo método já escolhido:Geral prepara,Codex revisa. Não pedir nova aprovação da mesma direção.

Revisão independente concluída em diagnostico-builder-check-2026-10-22.md: nenhuma questão adicional necessária ao planejamento além da preferência de resultado principal já consultada. Isso não equivale a aprovação do dono nem a implementação pronta.

## Objetivo

Entregar uma leitura inicial útil sobre a operação e ajudar o visitante a escolher o próximo passo com a Miranda Faria. Proposta do Codex: prioridades e plano inicial como resultado principal; estimativa financeira complementar somente com dados suficientes. Essa preferência está sendo consultada ao Eduardo.

Preservar identidade, paleta e contexto do Claude; aprimorar perguntas, lógica e resultado. Não transformar em orçamento automático, auditoria certificada ou promessa de economia. Não criar pontuação de maturidade com falsa precisão. Não utilizar APIs pagas ou LLM remoto por resposta; lógica determinística local e revisável.

## Experiência proposta

Uma pergunta por tela, com confirmação explícita em Continuar, Voltar e revisão final das respostas. Progresso acompanha o caminho efetivo. Mudança de resposta invalida apenas as respostas dependentes. Oferecer Não sei/Não se aplica quando legítimo, sem converter ausência de dado em zero. Não prometer duração antes de medi-la em uso.

Fluxo com oito perguntas principais e até duas complementares conforme o problema escolhido. Essa quantidade é decisão proposta pelo Codex, sujeita à revisão na prévia; não adicionar perguntas sem consequência no resultado.

1. **Atividade da empresa**: comércio/distribuição, indústria, serviços, alimentação ou outra. Usada para exemplos e aplicabilidade, sem presumir margem pelo setor.
2. **O que precisa melhorar primeiro?**: pedidos/vendas, atendimento/presença digital, estoque/informação, tarefas repetitivas ou continuidade da operação. Direciona o ramo e a recomendação.
3. **Como essa rotina funciona hoje?**: conversa/papel, planilha, sistema com etapas manuais ou sistemas integrados. Explicação da recomendação cita a resposta.
4. **Qual é o tamanho da rotina?**: unidade e período correspondem ao ramo, por exemplo pedidos por semana ou atendimentos por mês. Faixa deve ser marcada como aproximada; opcional informar valor. Não misturar faturamento com lucro, salário com perda mensal ou volume anual com mensal.
5. **Onde o trabalho precisa ser refeito?**: redigitar, procurar/conferir informação, corrigir erro, esperar alguém ou nenhum desses. Prioridade sugerida indica ação específica desse gargalo.
6. **Quanto tempo isso ocupa?**: estimativa direta do visitante por semana ou Não sei. Para interrupção, não presumir15min por conversa nem usar multiplicador de pesquisa como custo individual confirmado.
7. **Quão confiáveis e acessíveis são as informações?**: atualizadas/compartilhadas, precisam conferência, só uma pessoa sabe ou Não sei. Orienta pré-requisitos e dependência humana, sem inventar probabilidade de desligamento.
8. **Quando faz sentido começar?**: agora, próximos meses ou explorando. Ajusta próximo passo, sem chamar o visitante de desqualificado ou criar pressão financeira artificial.

Perguntas condicionais adicionais, no máximo duas:
- Tarefas manuais: custo da hora e/ou ocorrência/custo de erros observados, opcionais. Se não há custo informado, mostrar horas e evitar dinheiro.
- Canal com comissão: taxa efetivamente cobrada e parcela que o visitante considera viável migrar. Distinguir comissão total de economia possível; considerar custos novos antes de afirmar economia líquida. Se faltarem dados, explicar a conta e pedir medição, sem inventar percentuais.
- Dependência de pessoa: rotina documentada e acessível a outra pessoa. Não converter automaticamente risco em perda recorrente mensal.
- Presença digital/atendimento: destino atual dos contatos e problema de acompanhamento/triagem. Não inferir receita perdida ou taxa de conversão sem dados.

## Resultado

- Resumo editável do contexto informado.
- Até três prioridades ordenadas por regra explícita de dependência: primeiro organizar informação/processo quando isso bloqueia a solução; depois automatizar a etapa elegível; por fim acompanhar indicadores e ajustes. Não repetir a mesma recomendação para todos.
- Cada prioridade contém **o que fazer**, **qual resposta motivou isso**, **pré-requisito** e **como verificar melhora**.
- Próximo passo prático que a empresa pode executar: registrar volume/tempo, mapear processo ou reunir dados necessários. Serviço da Miranda Faria relacionado, sem recomendar compra quando um ajuste simples atende.
- Estimativas separadas de fatos: entradas, unidade, fórmula e hipóteses visíveis. Não somar impactos sobrepostos; não apresentar gasto de tempo como economia realizável garantida. Sem dado suficiente, “Ainda faltam dados para estimar o valor” e indicar qual medir.
- Copiar resumo pelo visitante; CTA PT WhatsApp e EN Calendly, preservando email exato Eduardo@mirandafaria.com.br. Contato opcional após resultado; não condicionar resultado a email/telefone.

## Dados e ambiente

O fonte atual grava DiagnosticoLead automaticamente ao chegar ao resultado, inclusive sem contato, e dispara trackDiagnosis. Não executar esse fluxo em produção durante testes. Na prévia, bloquear/interceptar gravação de teste de forma verificável. Não ampliar coleta nem inventar consentimento novo.

Proposta técnica: respostas e avaliação calculadas no cliente; não enviar novos campos sem mapeamento explícito de necessidade, finalidade e compatibilidade com o backend existente. Preservar política e preferências de consentimento, sem declarar conformidade por hipótese. Não modificar RLS, autenticação ou permissões nesta etapa. Redesenhar a gravação automática é decisão separada caso seja necessária.

## Arquitetura proposta

Insights.jsx apresenta o fluxo; configuração de perguntas PT/EN e regras em módulos próprios. Tipos de respostas normalizados com identificadores estáveis, unidades explícitas e valores desconhecidos distintos de zero. Resultados determinísticos e explicáveis. Motor financeiro atual deve ser preservado até revisão das fórmulas/fontes; usar funções novas apenas para cálculos diretamente sustentados pelas novas entradas. Não adaptar o resultado novo a classificações ICP antigas sem verificar compatibilidade.

Preservar rotas /pt/insights e /en/insights. Atualizar teaser Home e menu só depois de aprovar fluxo, quantidade real e copy final. Não prometer 3perguntas/40segundos na nova experiência.

## Critérios de conferência

Todos os ramos, Não sei, zero válido, voltar/editar/trocar ramo, reiniciar, PT/EN, teclado/foco, leitor de tela, reduced-motion, mobile320/390 e desktop. Resultado não contém NaN, valores negativos ou falsa precisão; não soma perdas sobrepostas; conta usa unidades e entradas corretas. Gravação duplicada ou lead real de teste deve ser zero. CTA não envia mensagem automaticamente.

Hash revisado com diff e build, prova visual da prévia e caminho de rollback antes de publicação. Após aprovação do desenho pelo dono, plano de implementação e execução em uma etapa por vez com Geral. Nota final do site continua pendente da revisão completa.

## Fontes inspecionadas

- GitHub Dudurateston/miranda-faria-consultoria, c3e70f9: src/pages/Insights.jsx e src/lib/diagnostico.js (parte inicial do motor).
- Pedidos do Eduardo nesta conversa e mapa-editorial-fase2.md.
- Skills CRO/form e brainstorming. As referências genéricas das skills são orientação de desenho, não evidência de aumento de conversão desta proposta.
# Diagnóstico — plano de implementação

**Goal:** implementar o desenho8–10perguntas aprovado pelo Eduardo, com prioridades explicadas e plano inicial.

**Architecture:** perguntas localizadas e motor determinístico separados da apresentação; Insights.jsx mantém a rota pública e usa os módulos novos. Motor financeiro legado permanece intocado, sem reaproveitar benchmarks como perdas individuais. Construir em branch da última versão conferida, sem misturar piloto de mídia.

**Tech Stack:** React/ReactRouter/CSS existentes, JavaScript puro para regras; sem nova dependência, API paga ou geração remota por resposta.

**Spec:** diagnostico-design-2026-10-22.md, aprovado pelo dono em22/10. Execução já escolhida:Geral/Base44 implementa em passos curtos,Codex revisa/testa. Não pedir que o dono escolha outro método.

## Estrutura proposta

- `src/content/diagnosticoV2.js`: perguntas PT/EN, opções, unidades e textos das recomendações.
- `src/lib/diagnosticoV2.js`: `getDiagnosisQuestions(answers)` e `evaluateDiagnosis(answers)` puros; regras de dependência, prioridades e estimativa.
- `src/pages/Insights.jsx`: wizard, voltar/revisar, resultado, copiar e CTAs. Manter /:lang/insights.
- `src/lib/diagnostico.js`: legado NÃO alterado. Não importar fórmula de benchmark para preencher resposta desconhecida.
- Teste puro compatível com runtime já disponível; Geral decide caminho exato e informa comando reproduzível, sem instalar framework.

## Contrato de respostas e resultado

`answers` usa identificadores estáveis: `sector`, `goal`, `currentTools`, `volume`, `bottleneck`, `hoursPerWeek`, `dataAccess`, `urgency`; complementos quando aplicáveis: `hourlyCost`, `commissionRate`, `migratableShare`. Valor desconhecido énull/enumunknown, nunca0. Objetos numéricos indicam unidade/período/moeda; custo da hora explicita moeda. PT/EN não faz conversão de moeda ou país implícita.

As oito telas principais seguem a spec. Para canal com comissão, incluir objetivo específico entre as opções degoal e fazer volume representar receita mensal desse canal; duas telas complementares pedem taxa real e parcela viável de migração. No ramo de tarefa manual com tempo conhecido, apenas uma complementar opcional de custo/hora; demais ramos não precisam completar dez perguntas. Esses são detalhes de implementação propostos pelo Codex dentro do limite aprovado; apresentar na prévia.

`getDiagnosisQuestions(answers)` devolve lista ordenada `{id,type,required,dependsOn,unit?,options?}`. A UI localiza peloid. Alterar setor/objetivo invalida somente respostas condicionadas; fase e progresso são derivados da lista. Não usar timers para avançar automaticamente.

`evaluateDiagnosis(answers)` devolve `{version,summary,priorities,estimate,missingData,nextStep}`. `priorities` tem até3itens únicos com `{id,reasonAnswerIds,action,prerequisite,measure}`; a UI mostra as respostas que justificam a ação. Sem score artificial, rótulo de desqualificado, compra obrigatória ou três recomendações preenchidas à força.

Regras mínimas: informação inacessível/inconsistente vem antes de automação dependente dela; retrabalho manual recorrente leva ao mapeamento e organização da rotina; objetivo define ação específica posterior. Se rotina integrada, dados confiáveis e nenhum retrabalho/tempo relevante, indicar acompanhamento/validação em vez de inventar problema. Urgência ajusta plano/próximo passo, não valor financeiro.

`estimate=null` quando dados insuficientes. Tempo declarado pode resultar em horas/mês com4,33semanas por mês explicitadas, sem chamar todo tempo de economia realizável. Custo/hora opcional permite mostrar custo do tempo informado, não promessa de recuperação. Comissão: receita mensal do canal×taxa informada×parcela viável de migração = comissão potencialmente evitável BRUTA; custos novos não conhecidos impedem afirmar economia líquida. Não somar cálculos de gargalos sobrepostos. Zero informado permanece0 válido; recusar negativos/NaN/Infinity/percentuaisfora0–100.

## Etapa1 — configuração e motor puros

- [ ] Geral lê desenho aprovado e mapeia schema/consumidores atuais, inclusive auto-gravação DiagnosticoLead, analytics e CTAs.
- [ ] Implementar módulos de perguntas/regras com os contratos acima em branch isolada.
- [ ] Testar: caminho8/9/10,unknown≠0,mudança de ramo limpa dependentes,horas/unidades coerentes,sem dinheiro sem custo,comissão apenas com3entradas,deduplicação de prioridades e cenário sem problema inventado. Mostrar comando/saída.
- [ ] Commit/hash no GitHub e diff; Codex revisa regras antes de conectar UI.

## Etapa2 — wizard e resultado em prévia

- [ ] Conectar Insights com Continuar explícito,Voltar,progresso dinâmico e revisão das respostas; preservar respostas em retorno dentro do fluxo. Não persistir dados de negócio em storage sem decisão explícita.
- [ ] Resultado primeiro, sem exigir contato; prioridades,razões,ações,pré-requisitos e como medir. Copiar resumo é ação explícita. CTA PTWhatsApp/ENCalendly/email exato; não enviar mensagem automaticamente.
- [ ] Mapear compatibilidade de DiagnosticoLead antes de qualquer gravação: schema legado de dor/perda/ICP não representa o novo plano. Na prévia, nenhuma gravação de teste ou analytics de produção. Apresentar decisão concreta de integração para revisão; não preencher campos antigos com dados novos de semântica diferente nem expandir RLS/coleta/permissões.
- [ ] Capturas PT/EN desktop/mobile de perguntas,voltar/revisar,unknown e resultado; layout paletaClaude sem alterar ordem daHome ou transições.
- [ ] Testes por interação real em preview:todosobjetivos,teclado/foco,erro numérico,revisão/reinício,zero válido,unknown,320/390/1440,reduced-motion;interceptar writes e comprovar0leadsteste.

## Etapa3 — conferência e publicação

- [ ] Atualizar teaserHome/menu somente conforme fluxo efetivo;sem promessa de número fixo de perguntas/duração não medida.
- [ ] Revisar todos os arquivos do hash final,build,testes e decisão da integração;sem alterações de produtosApontador/Eightyfive ou outrasapps.
- [ ] Preservar tag/snapshot e caminho de rollback;conferir artefato sitemap do gerador,não confundir generatedlastmod com fonte limpa.
- [ ] Publicar somente candidato revisado conforme autorização persistente do dono. Verificação pósdeploy sem produzir leads reais:rotas renderizando,perguntas anteriores ao resultado,assets/erros;resultado completo já conferido em preview com writes bloqueados.
- [ ] Relatório honesto de cobertura e limites;nota9.5 depende da revisão global, não da contagem de perguntas.

## Autorrevisão

Oito perguntas e atéduascondicionais;razões e ações sem scorefalso;dadosfaltantes explícitos;PTEN/moeda/unidades;foco/navegação;semAPIpaga;preview semleads;schema/RLSnãoexpandido;hash/rollback/provas. Integração com gravação antiga precisa decisão revisável antes do deploy, não improviso durante teste de produção. Planejamento não cria autorização de envio a pessoas.
