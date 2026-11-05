# Portfolio React — Giuseppe Cairone

Portfolio personale IT/EN con tema scuro/chiaro, React, TypeScript, Vite, Tailwind CSS e Three.js.

## Avvio

Richiesti Node.js 24 e npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

La porta5174 è usata anche dalla copia originale: per eseguirle contemporaneamente scegliere un'altra porta.

```sh
npm run build
npm run preview
npm run lint
npm test
```

## Contenuto della copia

- src: applicazione e contenuti; tests: verifiche di dominio; scripts: strumenti di build.
- public: asset referenziati, modelli ottimizzati, licenze e crediti.
- docs: manutenzione contenuti, sicurezza contatti e note di verifica.
- Nessun node_modules, dist, Git precedente, file .env.local, cache, backup o modello sorgente pesante incluso.
- CNAME escluso: il dominio del portfolio attuale non viene trasferito automaticamente.

Pagine principali: home, profilo, progetti, dettaglio progetto e privacy policy. Contatti, crediti, attestati e terminale usano finestre modali.

## Contatti e servizi esterni

EmailJS e reCAPTCHA usano identificatori browser pubblici; eventuali override sono elencati in .env.example. Non inserire chiavi private, password o segreti nelle variabili VITE_*: vengono esposti nel bundle. La chiave segreta reCAPTCHA resta nel pannello EmailJS. Prima della pubblicazione autorizzare il dominio GitHub Pages nei servizi e provare manualmente l'invio.

## Pubblicazione

Repository prevista: https://github.com/ORIONCODING28/Portfolio-React

Workflow GitHub Actions su main, con lint/test/build e pubblicazione di dist. URL previsto: https://orioncoding28.github.io/Portfolio-React/ . Pages deve usare GitHub Actions come sorgente.

BASE_PATH=/Portfolio-React/ è impostato nel workflow. Per un server alla radice omettere BASE_PATH (default /). I percorsi degli asset, BrowserRouter, manifest, condivisioni e fallback404 gestiscono il sottopercorso.

Per provare la build Pages in PowerShell: impostare $env:BASE_PATH='/Portfolio-React/', eseguire npm run build e npm run preview; aprire /Portfolio-React/. Il fallback404 preserva percorso, query e hash. Non è un rewrite server: GitHub risponde404 al primo accesso profondo e il documento di fallback riapre l'app sulla rotta richiesta.

Per un futuro server proprio sarà possibile pubblicare la build con configurazione appropriata al dominio e fallback SPA. Non serve includere dipendenze di sviluppo nella cartella servita.

## Asset e verifiche

Conservare i crediti e le licenze di font, icone e modelli presenti in public/assets. Le registrazioni del Parco sono le riprese reali fornite dall'autore, ritagliate senza accelerazioni. I contenuti dei progetti e gli stati draft/published sono descritti in docs/PROJECTS-CONTENT.md.

Il collaudo locale non sostituisce la prova finale su telefono e sul dominio effettivo. Nessun risultato di Core Web Vitals sul campo è dichiarato.
