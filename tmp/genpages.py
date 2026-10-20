import json, html, os
OUT='/app/public'
ORIGIN='https://mirandafaria.com.br'
CSS='''<style>
:root{--bg:#F5F1EA;--ink:#1A1A18;--mut:#4a4a45;--cu:#B5502E;--line:rgba(26,26,24,.18)}
@media (prefers-color-scheme:dark){:root{--bg:#161614;--ink:#F5F1EA;--mut:#c9c4ba;--cu:#E0805A;--line:rgba(245,241,234,.2)}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:300 1.0625rem/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:46rem;margin:0 auto;padding:2.5rem 1rem 4rem}
h1{font:400 clamp(1.9rem,5vw,2.8rem)/1.15 Georgia,serif;margin:.5rem 0 1rem}h2{font:400 1.5rem/1.25 Georgia,serif;margin:2.5rem 0 .5rem;padding-top:1rem;border-top:1px solid var(--line)}
p,li{color:var(--mut)}a{color:var(--cu)}.k{font:.75rem ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--cu)}
.resp{border-left:2px solid var(--cu);padding:.2rem 0 .2rem 1rem;color:var(--ink)}.nota{font-size:.9rem}
.ilus{border:1px dashed var(--cu);padding:.2rem 1rem;margin:1rem 0}
table{border-collapse:collapse;width:100%;font-size:.95rem}th,td{border-bottom:1px solid var(--line);padding:.45rem .5rem;text-align:left;color:var(--mut)}th{color:var(--ink);font-weight:400}.tw{overflow-x:auto}
details{border-bottom:1px solid var(--line);padding:.9rem 0}summary{cursor:pointer;color:var(--ink)}
</style>'''
e=html.escape
def build(p):
    url=ORIGIN+p['path']
    faq=[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in p['faq']]
    graph=[
     {"@type":"Article","@id":url+"#article","headline":p['h1'],"description":p['desc'],"inLanguage":p['lang'],"datePublished":"2026-10-20","dateModified":"2026-10-20","mainEntityOfPage":url,"author":{"@id":ORIGIN+"/#eduardo"},"publisher":{"@id":ORIGIN+"/#org"},"about":{"@id":ORIGIN+p['about']},"citation":[{"@type":"CreativeWork","name":n,"url":u} for n,u in p['sources']]},
     {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Miranda Faria","item":ORIGIN+p['home']},{"@type":"ListItem","position":2,"name":p['crumb2'][0],"item":ORIGIN+p['crumb2'][1]},{"@type":"ListItem","position":3,"name":p['crumb3']}]},
     {"@type":"FAQPage","inLanguage":p['lang'],"mainEntity":faq}]
    ld=json.dumps({"@context":"https://schema.org","@graph":graph},ensure_ascii=False,indent=0)
    faqh=''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>\n' for q,a in p['faq'])
    srcs=''.join(f'<li><a href="{e(u)}" rel="noopener">{e(n)}</a>{e(x)}</li>\n' for (n,u),x in zip(p['sources'],p['source_notes']))
    return f'''<!doctype html>
<html lang="{p['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(p['title'])}</title>
<meta name="description" content="{e(p['desc'])}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Miranda Faria">
<meta property="og:locale" content="{p['locale']}">
<meta property="og:title" content="{e(p['h1'])}">
<meta property="og:description" content="{e(p['desc'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{ORIGIN}/og.png">
<meta name="twitter:card" content="summary_large_image">
{CSS}
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
<main>
<p class="k">{p['kicker']}</p>
<h1>{e(p['h1'])}</h1>
<p class="resp">{p['resp']}</p>
{p['body']}
<h2>{p['h_src']}</h2>
<ul>
{srcs}</ul>
<p class="nota">{p['disclaimer']}</p>
<h2>{p['h_faq']}</h2>
{faqh}
<p class="nota" style="margin-top:2.5rem">{p['byline']}</p>
</main>
</body>
</html>
'''
PORT=("Portaria MTP nº 671, de 8 de novembro de 2021 (Imprensa Nacional)","https://www.in.gov.br/web/dou/-/portaria-359094139")
PORTQA=("Perguntas e Respostas sobre a Portaria nº 671/2021 (Ministério do Trabalho e Emprego)","https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/fiscalizacao-do-trabalho/Perguntas%20e%20Respostas%20REP")

afd=dict(path='/guias/arquivo-afd-portaria-671.html',lang='pt-BR',locale='pt_BR',
 title='O que é o arquivo AFD da Portaria 671 e o que dá para tirar dele | Miranda Faria',
 h1='O que é o arquivo AFD da Portaria 671 e o que dá para tirar dele',
 desc='O AFD (Arquivo Fonte de Dados) é o arquivo que o sistema de ponto eletrônico gera segundo a Portaria MTP 671/2021. Veja o que ele é, o que a norma diz e o que dá para medir com ele.',
 about='/pt/apontador#app',home='/pt',crumb2=('Apontador','/pt/apontador'),crumb3='Arquivo AFD da Portaria 671',
 kicker='<a href="/pt/apontador">Apontador</a> · guia para indústrias',
 resp='<strong>Resposta curta:</strong> o AFD (Arquivo Fonte de Dados) é o arquivo que todo sistema de registro eletrônico de ponto deve gerar, segundo o artigo 81 da Portaria MTP nº 671/2021, e é nele que ficam as marcações registradas. Dele dá para tirar faltas, atrasos, horas extras e pontos de atenção por dia, setor e mês, sem trocar o relógio.',
 body='''<h2>O que a Portaria 671 diz sobre o AFD</h2>
<ul>
<li>O art. 81 manda todos os tipos de sistema de registro eletrônico de ponto (REP-C, REP-A e REP-P) gerarem o Arquivo Fonte de Dados, conforme as especificações publicadas no portal gov.br.</li>
<li>No REP-C, o equipamento convencional, o AFD é gravado em dispositivo externo pela porta USB chamada Porta Fiscal, de uso exclusivo do Auditor-Fiscal do Trabalho (art. 81, § 1º).</li>
<li>No REP-A e no REP-P, o AFD deve ser gerado e entregue prontamente quando o Auditor-Fiscal do Trabalho pedir (art. 81, § 2º).</li>
<li>O programa de tratamento de registro de ponto usa os dados do AFD para gerar o espelho de ponto e o Arquivo Eletrônico de Jornada, o AEJ (art. 82).</li>
<li>Segundo o Ministério do Trabalho e Emprego, equipamentos REP-C já certificados sob a Portaria 1.510/2009 podem continuar gerando o AFD no leiaute da época da certificação. Por isso a fábrica pode ter relógios com formatos diferentes.</li>
</ul>

<h2>O que tem dentro do arquivo</h2>
<p>Em regra, uma linha por marcação, com o número sequencial de registro (NSR), a data e a hora e a identificação do trabalhador. Como identifica pessoas, o AFD é dado pessoal e deve ser tratado conforme a LGPD. O leiaute completo, campo por campo, é o das especificações oficiais do gov.br e varia entre a versão da Portaria 671 e a da 1.510.</p>

<h2>O que dá para tirar dele</h2>
<ul>
<li>Absenteísmo por dia, setor e mês, separando atestado e abono de falta sem justificativa (veja <a href="/guias/calculo-absenteismo-fabrica.html">como calcular o absenteísmo da fábrica</a>).</li>
<li>Atrasos, horas extras e faltantes por dia e por mês, o custo das extras pagas e o que vai para o banco de horas.</li>
<li>Batidas faltando, repetidas ou ímpares, que precisam de conferência.</li>
<li>Pontos de atenção da jornada, como mais de duas horas extras no dia, intervalo de almoço menor que uma hora, menos de onze horas entre jornadas e sete dias seguidos sem folga.</li>
<li>Quem mais faltou e quem mais fez hora extra, por período.</li>
</ul>
<p class="nota">O AFD registra marcações. Ele não sabe por que alguém faltou: atestado, abono e férias vêm de outros registros, e a análise do contador ou do advogado trabalhista continua necessária para qualquer decisão.</p>

<h2>Diagnóstico grátis do seu AFD</h2>
<ol>
<li>Exporte o AFD do último mês no relógio ou no sistema de ponto.</li>
<li>Mande o arquivo pelo WhatsApp.</li>
<li>Receba em até dois dias úteis um PDF com faltas, horas extras e pontos de atenção. No diagnóstico grátis, o arquivo é apagado depois do envio do PDF.</li>
</ol>
<p>Prefere não mandar dados? Importe o arquivo na <a href="https://apontador-demo.base44.app" rel="noopener">demonstração pública</a>: ele é lido no seu navegador e não sai do seu computador. <a href="/pt/apontador">Página do Apontador e contato</a>.</p>''',
 h_src='Fontes oficiais',
 sources=[PORT,PORTQA],source_notes=[': arts. 73 a 82 (sistemas de registro eletrônico, AFD e programa de tratamento).',': pergunta 11 (leiaute de REP-C certificado sob a Portaria 1.510) e pergunta 18 (AEJ no lugar do AFDT e do ACJEF).'],
 disclaimer='Este texto resume normas publicadas para ajudar a entender o arquivo. Não é parecer jurídico: confira sempre o texto vigente da portaria.',
 h_faq='Perguntas frequentes',
 faq=[("O que é o AFD?","AFD é o Arquivo Fonte de Dados, o arquivo com as marcações registradas pelo sistema de ponto eletrônico. A Portaria MTP nº 671/2021 (art. 81) manda todo tipo de sistema de registro eletrônico de ponto gerá-lo."),
 ("Qual a diferença entre AFD, AFDT, ACJEF e AEJ?","O AFD traz as marcações. Segundo o Ministério do Trabalho e Emprego, o AFDT e o ACJEF foram substituídos pelo AEJ, Arquivo Eletrônico de Jornada, que o programa de tratamento gera a partir do AFD."),
 ("Preciso trocar o relógio de ponto para analisar o absenteísmo?","Não. O Apontador lê o arquivo que o relógio já gera, no leiaute da Portaria 671 ou no da antiga Portaria 1.510, ou os relatórios que o sistema de ponto exporta em CSV, Excel, HTML ou PDF."),
 ("O que dá para medir a partir do AFD?","Absenteísmo por dia, setor e mês, atrasos, horas extras e faltantes, o custo das extras pagas, batidas faltando e pontos de atenção da jornada. Atestado e abono dependem de outros registros."),
 ("Onde ficam os dados dos funcionários?","Na demonstração pública, o arquivo é lido no navegador do seu computador e não é guardado. No diagnóstico grátis, o arquivo é apagado depois do envio do PDF. Na versão contratada, onde os dados ficam e quem acessa é explicado antes da implantação.")],
 byline='Por <a href="/pt/about">Eduardo Miranda Faria</a>, Miranda Faria, Piumhi/MG. Atualizado em 20/10/2026. Veja também a <a href="/fatos/">ficha de fatos da Miranda Faria</a>.')

absn=dict(path='/guias/calculo-absenteismo-fabrica.html',lang='pt-BR',locale='pt_BR',
 title='Como calcular o absenteísmo da fábrica (fórmula e exemplo) | Miranda Faria',
 h1='Como calcular o absenteísmo da fábrica (fórmula e exemplo)',
 desc='A taxa de absenteísmo é a ausência dividida pelo tempo que deveria ter sido trabalhado, vezes 100. Veja a fórmula, um exemplo ilustrativo e como separar atestado, abono e falta.',
 about='/pt/apontador#app',home='/pt',crumb2=('Apontador','/pt/apontador'),crumb3='Cálculo do absenteísmo',
 kicker='<a href="/pt/apontador">Apontador</a> · guia para indústrias',
 resp='<strong>Resposta curta:</strong> a taxa de absenteísmo é o tempo de ausência dividido pelo tempo que deveria ter sido trabalhado no período, multiplicado por 100. Em uma fábrica fictícia de 120 pessoas com 66 dias de ausência em 2.640 dias previstos, a taxa do mês é 2,5%.',
 body='''<h2>A fórmula</h2>
<p><strong>Taxa de absenteísmo (%) = ausências ÷ tempo previsto de trabalho × 100</strong></p>
<p>Use a mesma unidade nos dois lados: dias com dias, ou horas com horas. Horas são mais justas quando há jornadas diferentes ou ausências parciais. O tempo previsto é o número de pessoas vezes os dias (ou horas) que cada uma deveria trabalhar no período.</p>

<h2>Exemplo ilustrativo</h2>
<div class="ilus"><p><strong>Atenção: os números abaixo são inventados, só para mostrar a conta. Não descrevem nenhuma empresa real.</strong></p></div>
<p>Uma fábrica fictícia tem 120 pessoas e 22 dias úteis no mês, então o tempo previsto é 120 × 22 = 2.640 dias de trabalho.</p>
<div class="tw"><table>
<tr><th>Motivo da ausência (fictício)</th><th>Dias</th><th>Taxa sobre 2.640</th></tr>
<tr><td>Atestado médico</td><td>20</td><td>0,76%</td></tr>
<tr><td>Falta abonada</td><td>8</td><td>0,30%</td></tr>
<tr><td>Falta sem justificativa</td><td>38</td><td>1,44%</td></tr>
<tr><td><strong>Total</strong></td><td><strong>66</strong></td><td><strong>2,5%</strong></td></tr>
</table></div>
<p>Conta: 66 ÷ 2.640 = 0,025, ou 2,5%. Se um dia de trabalho custasse R$ 120 em salário (valor hipotético), os 66 dias representariam R$ 7.920 no mês, sem contar a produção perdida nem a hora extra paga para cobrir a falta.</p>

<h2>O que entra e o que fica de fora</h2>
<ul>
<li>Defina por escrito o que conta como ausência no numerador e use sempre a mesma regra, senão os meses não se comparam.</li>
<li>Misturar atestado, abono e falta sem justificativa esconde onde está o problema. Calcule a taxa total e também a de cada motivo.</li>
<li>Férias e afastamentos legais costumam ficar fora do numerador e do tempo previsto. Confirme o tratamento com o seu contador.</li>
<li>Calcule por setor e por mês. A média da fábrica pode estar em 2,5% enquanto um setor passa muito disso.</li>
</ul>
<p>Não existe um número oficial único de absenteísmo aceitável. O mais útil é comparar a fábrica com ela mesma, mês a mês e setor a setor.</p>

<h2>De onde tirar os dados</h2>
<p>As marcações vêm do arquivo AFD do relógio de ponto (<a href="/guias/arquivo-afd-portaria-671.html">o que é o AFD e o que dá para tirar dele</a>). O motivo da ausência, como atestado ou abono, vem dos registros do RH. O Apontador lê o AFD ou o relatório do ponto e mostra absenteísmo por dia, setor e mês, com atestado separado de falta sem justificativa.</p>
<p>Quer ver com os números da sua fábrica? Peça o diagnóstico grátis na <a href="/pt/apontador">página do Apontador</a>.</p>''',
 h_src='Fontes',
 sources=[PORT],source_notes=[': arts. 81 e 82, que tratam do AFD e do programa de tratamento do registro de ponto, de onde saem as marcações usadas no cálculo.'],
 disclaimer='A fórmula acima é uma convenção de gestão amplamente usada, não uma definição fixada em lei; empresas e convenções coletivas podem adotar regras próprias. O exemplo é ilustrativo e não é parecer contábil nem jurídico.',
 h_faq='Perguntas frequentes',
 faq=[("Qual é a fórmula do absenteísmo?","Taxa de absenteísmo = ausências ÷ tempo previsto de trabalho × 100, com dias ou horas nos dois lados da conta."),
 ("Calculo em dias ou em horas?","Pode ser em dias ou em horas, desde que a unidade seja a mesma no numerador e no denominador. Horas são mais precisas quando há ausências parciais ou jornadas diferentes."),
 ("Atestado e abono entram no absenteísmo?","Depende da regra que a empresa definir. O recomendado é calcular a taxa total e também separar atestado, abono e falta sem justificativa, para ver onde está o problema."),
 ("Qual é uma taxa de absenteísmo boa?","Não há um número oficial único. Compare a fábrica com o próprio histórico, mês a mês e por setor, em vez de comparar com uma média genérica."),
 ("Dá para calcular direto do arquivo do relógio de ponto?","Sim, para as marcações. O Apontador lê o AFD da Portaria 671 e mostra faltas por dia, setor e mês. O motivo da ausência, como atestado, vem de outros registros.")],
 byline='Por <a href="/pt/about">Eduardo Miranda Faria</a>, Miranda Faria, Piumhi/MG. Atualizado em 20/10/2026. Veja também a <a href="/fatos/">ficha de fatos da Miranda Faria</a>.')

TR=("TrustEd Ireland Scheme and Immigration Requirements: Information for Education Providers","https://www.trustedireland.ie/")
IMM=("Irish Immigration: coming to study in Ireland","https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-visa-options/")
en=dict(path='/guides/ilep-trusted-attendance-85-percent.html',lang='en',locale='en_IE',
 title='ILEP and TrustEd attendance rules: the 85% requirement explained | Miranda Faria',
 h1='ILEP and TrustEd attendance rules: the 85% requirement explained',
 desc='What the TrustEd Ireland scheme and ILEP require of English language providers on attendance: the 85% minimum, the 15-minute rule, the six-week 25% alert and what records to keep. A summary with sources.',
 about='/en/eightyfive#app',home='/en',crumb2=('Eightyfive','/en/eightyfive'),crumb3='ILEP and TrustEd attendance rules',
 kicker='<a href="/en/eightyfive">Eightyfive</a> · guide for English language schools',
 resp='<strong>Short answer:</strong> the TrustEd Ireland requirements say English language providers must have mandatory attendance requirements of a minimum 85% attendance for all enrolled students, and students must demonstrate at least 85% attendance for their immigration permission. Attendance is recorded in every class, and a student who arrives more than 15 minutes late or leaves before the class ends is marked absent.',
 body='''<h2>What the 85% requirement says</h2>
<p>The scheme document sets out the 85% rule in two places. Providers "must have mandatory attendance requirements of a minimum 85% attendance for all enrolled students", and students "must progress in their studies and demonstrate at least 85% attendance". Providers still listed on ILEP must keep complying with the relevant ILEP criteria until they are authorised to use the TrustEd Ireland mark or the listing ends.</p>

<h2>How attendance is defined</h2>
<ul>
<li><strong>15-minute rule:</strong> attending means the full designated tuition hours. Arriving more than 15 minutes late, or leaving before the class has concluded, means the student is marked absent for that class or class segment.</li>
<li><strong>No routine leeway:</strong> the 15 minutes must not become a way to let students arrive late regularly without being marked absent.</li>
<li><strong>Every class:</strong> attendance is recorded in each class, and the class teacher also records the overall number of students in attendance.</li>
<li><strong>Documented system:</strong> providers need a clear system, with the nominated responsible people and the rules on punctuality and penalties for lateness, documented and publicly available.</li>
<li><strong>Records:</strong> manual attendance sheets must be kept for at least 12 months and are checked against computer records. The records must be available for inspection by Immigration Service Delivery (ISD).</li>
</ul>

<h2>The first six weeks and the 85% line</h2>
<ul>
<li>If a student has 25% or more uncertified absence in the first six weeks, the provider must communicate this to ISD, together with the attendance policy being applied and the measures taken to address non-attendance.</li>
<li>If a student cannot make up attendance to 85% before the programme ends, the student must be told they do not meet the requirement, and this must be communicated to ISD.</li>
<li>The document states that there is no mechanism for students to make up uncertified absences through additional classes, during or after the programme.</li>
</ul>

<h2>Illustrative arithmetic</h2>
<div class="ilus"><p><strong>Illustration only, with invented numbers. It is not an official calculation method.</strong> Which unit attendance is measured in must follow the provider's documented policy.</p></div>
<p>Suppose a student is timetabled for 100 class hours in a period. At 85% attendance the student attends at least 85 of them, so no more than 15 hours can be missed. Once the missed hours pass 15, the student can no longer reach 85% in that period, and in practice the school needs to know that early, not at the end.</p>

<h2>Inspections</h2>
<p>The document says Immigration Service Delivery (ISD), in the Department of Justice, Home Affairs and Migration, reserves the right to conduct unannounced inspections, spot checks and monitoring of providers at any time. Attendance monitoring records are among the evidence they may ask for.</p>

<h2>How a register can help</h2>
<p>Eightyfive is an attendance register for these schools. It applies the 15-minute rule, records the class teacher's student count, flags students at 25% or more uncertified absence in the first six weeks, forecasts each student against 85% and exports the full record. The demo runs on sample data: <a href="https://eightyfive.base44.app" rel="noopener">eightyfive.base44.app</a>. Where real data would be stored, and who can access it, is agreed in writing before any student record goes in. <a href="/en/eightyfive">Eightyfive page and contact</a>.</p>''',
 h_src='Official sources',
 sources=[TR,IMM],source_notes=[': sections "Programme duration and attendance requirements for English Language Programmes" and "Recording of attendance for English Language Programmes". Read the current version on the official site.',': official guidance for students, referred to by the scheme document.'],
 disclaimer='This page summarises published requirements to help you prepare. It is not legal advice and the rules can change. Always read the current official text.',
 h_faq='Frequently asked questions',
 faq=[("What is the 85% attendance requirement?","English language providers must have mandatory attendance requirements of a minimum 85% attendance for all enrolled students, and students must demonstrate at least 85% attendance, according to the TrustEd Ireland scheme and immigration requirements document."),
 ("What is the 15-minute rule?","A student who arrives more than 15 minutes late, or leaves before the class has concluded, is marked absent for that class or class segment. The leeway must not become a way to allow regular lateness."),
 ("What happens at 25% uncertified absence in the first six weeks?","The provider must communicate it to ISD, setting out the attendance policy applied and the measures taken to address non-attendance."),
 ("Can a student make up missed attendance with extra classes?","No. The document states that students cannot make up uncertified absences through additional classes, either during or after the programme."),
 ("Can inspections be unannounced?","Yes. The document says unannounced inspections, spot checks and monitoring can take place."),
 ("Does Eightyfive guarantee we pass an inspection?","No tool can promise that. Eightyfive keeps the attendance record complete and easy to show, but compliance stays with the school.")],
 byline='By <a href="/en/about">Eduardo Miranda Faria</a>, Miranda Faria, Piumhi, Brazil, working remotely with schools in Ireland and the UK. Updated 20 October 2026. See also the <a href="/facts/">Miranda Faria fact sheet</a>.')
for p in (afd,absn,en):
    open(OUT+p['path'],'w').write(build(p))
    print(p['path'])
