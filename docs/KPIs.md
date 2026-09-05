# KPIs do site — medição própria (SiteEvent)

Tudo nasce da entidade `SiteEvent` (app 6a74f6e6). Nenhum dado pessoal:
sessão anônima (30 min), evento, rota, origem, aparelho, idioma.

## Eventos gravados
| event_type | quando | extra |
|---|---|---|
| `consent` | decisão no aviso LGPD | `{granted: true/false}` |
| `session_start` | primeiro evento da sessão | referrer + UTMs |
| `page_view` | cada troca de rota | rota |
| `cta_whatsapp` | clique em qualquer link wa.me | elemento clicado |
| `diag_complete` | diagnóstico concluído | dores escolhidas |

## KPIs e como calcular
- **Visitas** = `session_start` distintos por período (`session_id` único)
- **Pageviews** = `page_view` por rota → ranquear rotas
- **Páginas/visita** = pageviews ÷ visitas
- **Conversão WhatsApp** = visitas com `cta_whatsapp` ÷ total (a métrica nº 1)
- **Conclusão do diagnóstico** = `diag_complete` ÷ visitas em `/pt/insights`
- **Origem do tráfego** = `referrer` + `utm_source/medium/campaign`
- **Mix** = `device` e `lang` (mobile x desktop, pt x en)
- **Taxa de aceite LGPD** = consent granted ÷ decisões
- **Trajeto** = sequência de rotas por `session_id` (onde a pessoa sai antes do WhatsApp)

## Como ver
Pedir ao agente: *"me manda o relatório do site"* — ele lê a entidade e
resume. Relatórios possíveis: diário, semanal, por campanha (UTM), por rota.
