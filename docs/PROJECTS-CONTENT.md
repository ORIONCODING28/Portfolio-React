# Gestione dei progetti

Decisione del 5 novembre 2026: pubblicare soltanto il Parco del Verismo. Sfizi & Delizie, Vintage Racers e Salon Flow verranno aggiunti dopo il loro completamento. AnimeCommunity non viene presentato al momento.

## Dati e pubblicazione

Le schede sono in `src/data/portfolioData.ts`, negli elenchi italiano e inglese. `status: 'draft'` esclude un progetto da catalogo, dettagli pubblici e terminale; `status: 'published'` lo rende disponibile. L'ordine è determinato da `order`.

Per aggiungere un lavoro:

1. Aggiungere la voce in entrambe le lingue, inizialmente in bozza, con uno slug univoco e le sole funzionalità effettivamente realizzate.
2. Indicare `collaboration: 'personal'` oppure `'team'` e i collegamenti reali disponibili. Non inserire collegamenti fittizi.
3. Aggiungere immagine desktop e, se disponibile, `media.mobile`; `media.domain` mostra il dominio nella cornice browser. Senza immagine mobile viene mostrata solo la vista desktop.
4. Inserire i testi sintetici in `src/content/projectPresentation.ts`, il racconto in `projectStories.ts` e i dettagli opzionali del caso in `projectCaseStudies.ts`. I dati specifici del Parco non vengono riutilizzati come descrizione degli altri lavori.
5. Impostare `status: 'published'` in entrambe le lingue quando pronto e verificare catalogo e dettaglio.

Le rotte sono `/projects` e `/projects/:slug`. Il progetto successivo compare soltanto quando esistono almeno due lavori pubblicati. WhatsApp condivide il collegamento del progetto senza numero personale.

## Media del Parco e riproduzione

Versione corrente: nuove registrazioni con scroll automatico fornite da Giuseppe il 5 novembre 2026, ritagliate senza accelerazione o interpolazione.

- media.desktopVideo: /assets/projects/parco-desktop.mp4 — 1600×1008, 49 secondi, 30 fps, circa 8,6 MB.
- media.mobileVideo: /assets/projects/parco-mobile.mp4 — 638×1268, 49 secondi, 30 fps, circa 6,1 MB.
- Poster JPEG derivati dai primi fotogrammi. Provenienza: assets-source/projects/parco-video.json.
- Desktop: rimossa scrollbar destra e tagliati 1,2 secondi iniziali per allineare l'avvio. Mobile: rimossi bordi/maniglie DevTools, crop x6/y8/638×1268.
- File condivisi tra catalogo e dettaglio, originali sul Desktop intatti. Senza video restano immagini statiche.

Un solo controller attende il buffer di entrambe le anteprime, avvia e mette in pausa la coppia, gestisce insieme fine/ripartenza del ciclo e corregge lievi derive di clock senza seek continui. Il buffering di un video ferma entrambi. Caricamento entro300px dalla vista, pausa fuori schermo/scheda nascosta e avvio volontario con movimento ridotto. Errori media mostrano il poster. Stesso tempo di riproduzione non implica che i due layout mostrino sempre la stessa sezione.

Cornici Safari/iPhone decorative, comando pausa/riproduzione e link al sito realmente utilizzabili. La soluzione intermedia con catture complete animate e relativi asset/hook è stata rimossa.

## Carosello del catalogo

Un progetto per volta, cambio manuale, nessun timer automatico. Solo la slide corrente è montata. Con almeno due pubblicati compaiono frecce e contatore; swipe orizzontale touch/penna senza impedire scroll verticale o pinch zoom. Con zero compare il messaggio vuoto; con uno nessun controllo inutile. Il ciclo si richiude nelle due direzioni.

Per aggiungere anteprime a un progetto, impostare in entrambe le lingue catture complete desktop/mobile e poster, mantenendo `media.mobile` per abilitare la cornice telefono. Lasciare il progetto draft fino al completamento. Senza catture complete vengono mostrate le immagini statiche.

## Verifiche

Build, lint e 26 test passano dopo l’integrazione dello scorrimento condiviso e della navigazione ciclica. I test controllano anche che soltanto il Parco sia pubblicato nelle due lingue e che le bozze non compaiano nell'elenco. Controllati catalogo e dettaglio da 320 a 2560 px, tema chiaro/italiano e scuro/inglese. Il controllo su dispositivi fisici resta distinto dall'emulazione dei viewport.
