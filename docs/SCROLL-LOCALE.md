# Home: prova locale delle animazioni

Branch: `local/scroll-choreography`. Base pubblicata: `e515190`.

Questa modifica non va pubblicata finché Giuseppe non approva la versione locale.

- Canvas WebGL esteso a tutta la prima schermata: costellazione in movimento continuo e SCORRI composto da particelle (SCROLL in inglese). Le particelle convergono da tutta la superficie nella galassia centrale, che raggiunge la composizione originale mentre appaiono i testi. Il tutto è reversibile, senza intercettare wheel/touch. Lo scroll massimo è 180px su mobile, 230px su tablet, 320px su desktop; non esiste un tratto finale di attesa.
- Invito SCORRI/SCROLL più grande, font Orbitron locale (SIL OFL inclusa), luce cyan/zaffiro e barra verticale di particelle con bagliore in movimento. Il font della scritta nella sfera resta invariato.
- Su mobile: titolo, descrizione e pulsanti visibili subito; galassia sotto, che si forma nella sua posizione durante il normale scroll. Nessun pinning, nessun altezza aggiunta alla pagina, nessuno spostamento della galassia attraverso i testi. La progressione delle particelle resta reversibile.
- Rimossa l’altezza minima di una viewport dalla composizione finale. L’intro iniziale resta a tutto schermo usando una maschera del canvas, senza mantenere vuoto nel flusso della pagina. A 2560x1440 si eliminano 541px di altezza forzata; la sezione successiva segue il fondo della hero.
- Testo centrale: WEB & MOBILE / DEVELOPER. Colori e geometria delle orbite conservati.
- Rotazione continua dei dispositivi: comincia quando il centro del modello entra nella zona visibile, rallenta nella posizione frontale al centro dello schermo e prosegue nella stessa direzione durante l’uscita. Nessun tratto fermo. Esplorazione manuale solo nella modale.
- Percorso: sosta di lettura su ogni stella, poi viaggio della scia soltanto sul collegamento verso la successiva. Stella e testo si attivano all’arrivo; l’ultima fase ha la stessa sosta prima della dissolvenza e del nuovo ciclo. Il resto del percorso resta discreto e la polvere è ferma. La modale mette in pausa il punto corrente e lo riprende alla chiusura. Uscendo dalla sezione la sequenza si azzera per il prossimo ingresso.
- Le brevi entrate dei contenuti si ripetono dopo l’uscita dalla viewport.

## Verifica

- Build, lint e 38 test automatici, inclusi avanzamento/ritorno, durata breve e proiezione del canvas esteso che mantiene la posizione finale della galassia. Verificato il movimento a pagina ferma confrontando due screenshot (oltre 16.000 pixel cambiano nell’area della costellazione).
- Ultima verifica nel browser: 390, 1280 e 2560px, senza overflow orizzontale rilevato; verifica di raccolta, chiusura breve e ritorno all’invito iniziale. I test della progressione includono anche i formati tablet e laptop.
- Raccolta delle particelle e spostamento della galassia, pose frontali, apertura e chiusura della modale del laptop, pausa/ripresa del percorso e ritorno alla prima fase al nuovo ingresso.
- Tema chiaro e scuro. Nessun errore registrato nel browser nella verifica finale.
- Queste sono verifiche del browser e dei formati responsive, non test fisici su iPhone/iPad/Android.

Anteprima: http://127.0.0.1:5180/

Questa iterazione comprende il nuovo viaggio tra le stelle approvato da Giuseppe. Verificati nel browser avanzamento della sequenza e pausa/ripresa della modale, oltre alla lettura immediata della home mobile e alla composizione desktop a 2560px. Nessun push o deploy eseguito.
