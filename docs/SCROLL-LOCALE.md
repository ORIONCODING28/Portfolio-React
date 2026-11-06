# Home: prova locale delle animazioni

Branch: `local/scroll-choreography`. Base pubblicata: `e515190`.

Questa modifica non va pubblicata finché Giuseppe non approva la versione locale.

- Costellazione iniziale, raccolta delle particelle in galassia centrale, poi spostamento nella composizione originale e comparsa dei testi. La sequenza occupa un tratto breve di scroll nativo ed è reversibile, senza intercettare wheel/touch.
- Testo centrale: WEB & MOBILE / DEVELOPER. Colori e geometria delle orbite conservati.
- Rotazione continua dei dispositivi: comincia quando il centro del modello entra nella zona visibile, rallenta nella posizione frontale al centro dello schermo e prosegue nella stessa direzione durante l’uscita. Nessun tratto fermo. Esplorazione manuale solo nella modale.
- Percorso: collegamento luminoso, coda e testa in movimento tra le stelle; polvere ferma. La modale mette in pausa il punto corrente e lo riprende alla chiusura. Uscendo dalla sezione la sequenza si azzera per il prossimo ingresso.
- Le brevi entrate dei contenuti si ripetono dopo l’uscita dalla viewport.

## Verifica

- Build, lint e 36 test automatici, inclusi avanzamento/ritorno esatto e inquadratura dell’intro.
- Controlli nel browser a 320, 390, 768, 1024, 1280 e 2560px: nessun overflow orizzontale rilevato.
- Raccolta delle particelle e spostamento della galassia, pose frontali, apertura e chiusura della modale del laptop, pausa/ripresa del percorso e ritorno alla prima fase al nuovo ingresso.
- Tema chiaro e scuro. Nessun errore registrato nel browser nella verifica finale.
- Queste sono verifiche del browser e dei formati responsive, non test fisici su iPhone/iPad/Android.

Anteprima: http://127.0.0.1:5180/
