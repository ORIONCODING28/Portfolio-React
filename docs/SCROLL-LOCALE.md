# Home: prova locale delle animazioni

Branch: `local/scroll-choreography`. Base pubblicata: `e515190`.

Questa modifica non va pubblicata finché Giuseppe non approva la versione locale.

- Sfera a tutta scena, riduzione e spostamento nella composizione originale guidati dallo scroll nativo. La progressione è reversibile, senza intercettare wheel/touch.
- Testo centrale: WEB & APP / DEVELOPER. Colori e geometria delle orbite conservati.
- Ingresso più evidente dei tre dispositivi, con rotazione e scala. Ampia zona frontale ferma per leggere gli schermi. Esplorazione manuale solo nella modale.
- Percorso: collegamento luminoso, coda e testa in movimento tra le stelle; polvere ferma. La modale mette in pausa il punto corrente e lo riprende alla chiusura. Uscendo dalla sezione la sequenza si azzera per il prossimo ingresso.
- Le brevi entrate dei contenuti si ripetono dopo l’uscita dalla viewport.

## Verifica

- Build, lint e 38 test automatici, inclusi avanzamento/ritorno esatto e inquadratura dell’intro.
- Controlli nel browser a 320, 390, 768, 1024, 1280 e 2560px: nessun overflow orizzontale rilevato.
- Apertura/riduzione della sfera, pose frontali, apertura e chiusura della modale del laptop, pausa/ripresa del percorso e ritorno alla prima fase al nuovo ingresso.
- Tema chiaro e scuro. Nessun errore registrato nel browser nella verifica finale.
- Queste sono verifiche del browser e dei formati responsive, non test fisici su iPhone/iPad/Android.

Anteprima: http://127.0.0.1:5180/
