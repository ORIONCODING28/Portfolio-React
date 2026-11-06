# Home: prova locale delle animazioni

Branch: `local/scroll-choreography`. Base pubblicata: `e515190`.

Questa modifica non va pubblicata finché Giuseppe non approva la versione locale.

- Canvas WebGL esteso a tutta la prima schermata: costellazione in movimento continuo e SCORRI composto da particelle (SCROLL in inglese). Le particelle convergono da tutta la superficie nella galassia centrale, che raggiunge la composizione originale mentre appaiono i testi. Il tutto è reversibile, senza intercettare wheel/touch. Lo scroll massimo è 180px su mobile, 230px su tablet, 320px su desktop; non esiste un tratto finale di attesa.
- Invito SCORRI/SCROLL più grande, font Orbitron locale (SIL OFL inclusa), luce cyan/zaffiro e barra verticale di particelle con bagliore in movimento. Il font della scritta nella sfera resta invariato.
- Su mobile: galassia prima, poi titolo, descrizione e pulsanti. Altezza del modello più compatta per far entrare i testi dopo un gesto rapido.
- Rimossa l’altezza minima di una viewport dalla composizione finale. L’intro iniziale resta a tutto schermo usando una maschera del canvas, senza mantenere vuoto nel flusso della pagina. A 2560x1440 si eliminano 541px di altezza forzata; la sezione successiva segue il fondo della hero.
- Testo centrale: WEB & MOBILE / DEVELOPER. Colori e geometria delle orbite conservati.
- Rotazione continua dei dispositivi: comincia quando il centro del modello entra nella zona visibile, rallenta nella posizione frontale al centro dello schermo e prosegue nella stessa direzione durante l’uscita. Nessun tratto fermo. Esplorazione manuale solo nella modale.
- Percorso: collegamento luminoso, coda e testa in movimento tra le stelle; polvere ferma. La modale mette in pausa il punto corrente e lo riprende alla chiusura. Uscendo dalla sezione la sequenza si azzera per il prossimo ingresso.
- Le brevi entrate dei contenuti si ripetono dopo l’uscita dalla viewport.

## Verifica

- Build, lint e 38 test automatici, inclusi avanzamento/ritorno, durata breve e proiezione del canvas esteso che mantiene la posizione finale della galassia. Verificato il movimento a pagina ferma confrontando due screenshot (oltre 16.000 pixel cambiano nell’area della costellazione).
- Ultima verifica nel browser: 390, 1280 e 2560px, senza overflow orizzontale rilevato; verifica di raccolta, chiusura breve e ritorno all’invito iniziale. I test della progressione includono anche i formati tablet e laptop.
- Raccolta delle particelle e spostamento della galassia, pose frontali, apertura e chiusura della modale del laptop, pausa/ripresa del percorso e ritorno alla prima fase al nuovo ingresso.
- Tema chiaro e scuro. Nessun errore registrato nel browser nella verifica finale.
- Queste sono verifiche del browser e dei formati responsive, non test fisici su iPhone/iPad/Android.

Anteprima: http://127.0.0.1:5180/

La sezione Dalla formazione alla pratica non viene modificata in questa iterazione: resta quella del precedente branch locale, da rivedere successivamente. Nessun push o deploy eseguito.
