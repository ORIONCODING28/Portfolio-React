# Protezione del form - 5 novembre 2026

Gli identificativi pubblici sono centralizzati in src/config/contact.ts. Sono sovrascrivibili con VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY, VITE_RECAPTCHA_SITE_KEY. I valori pubblici di fallback mantengono la configurazione anche nella build GitHub Pages.

La chiave segreta reCAPTCHA resta esclusivamente in EmailJS, template → Settings → Enable reCAPTCHA v2 verification. L'utente ha confermato l'attivazione e il salvataggio. Mai inserire la chiave segreta in variabili VITE_, repository o chat.

Per le prove usare http://localhost:5174. Autorizzare localhost e giuseppecairone.dev nel pannello Google; eventuali altri domini vanno aggiunti prima del rilascio.

## Controlli

- Validazione e normalizzazione dei dati prima della consegna.
- Campo trappola escluso dalla navigazione da tastiera.
- Blocco degli invii simultanei nel componente.
- Limite SDK: un tentativo ogni 30 secondi, chiave localStorage portfolio-contact, errore dedicato per HTTP 429.
- Verifica Google caricata soltanto dopo Attiva verifica antispam. Nessun caricamento Google sulla sola apertura della pagina.
- Token assente/scaduto o verifica fallita: invio bloccato. Token cancellato dopo ciascun tentativo perché non riutilizzabile.
- Errori della consegna propagati e bozza conservata; nessun successo simulato.
- Informativa accessibile e spiegazione dell'attivazione Google. Nessuna checkbox generica aggiunta per la sola risposta alla richiesta.

L'API reCAPTCHA ufficiale è dinamica e non dispone di un hash SRI statico come una dipendenza CDN immutabile.

## Limiti e costi

Honeypot e intervallo SDK sono controlli nel browser, aggirabili: non costituiscono una protezione DDoS. La verifica obbligatoria del token deve restare attiva lato EmailJS; disponibilità del sito e limiti distribuiti dipendono dai fornitori.

Non è stato attivato alcun piano a pagamento dall'agente. EmailJS Free: 200 richieste/mese. Google offre una quota gratuita: non abilitare la fatturazione per evitare addebiti. La allowlist EmailJS è una funzione a pagamento e non è stata attivata.

## Verifiche

Widget reale visualizzato su localhost; blocco senza token controllato con dati fittizi. Test locale dell'inoltro del token con delivery sostitutiva. Nessun CAPTCHA risolto e nessuna email reale inviata dall'agente. Resta una prova manuale completa dell'utente, con CAPTCHA e recapito del messaggio.

Fonti: https://www.emailjs.com/docs/user-guide/adding-captcha-verification/ ; https://www.emailjs.com/pricing/ ; https://docs.cloud.google.com/recaptcha/docs/billing-information


Revisione visiva: checkbox di presa visione dell’informativa (non consenso generico al trattamento). La spunta attiva Google reCAPTCHA; la verifica resta distinta. Widget orizzontale, ridotto proporzionalmente solo sotto i 304 pixel disponibili, senza overflow.
