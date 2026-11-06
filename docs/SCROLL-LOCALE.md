# Home: prova locale delle animazioni

Branch: `local/scroll-choreography`. Online invariato, nessun push/deploy autorizzato.

## Intro a tempo, identica su tutti i formati

- All’apertura: soltanto costellazione in movimento e invito SCORRI/SCROLL composto da particelle.
- Il primo gesto (rotella, swipe singolo o tasti di scorrimento) avvia una sequenza di 1800 ms: formazione centrale della galassia, spostamento nella posizione finale, comparsa dei testi.
- Su mobile la composizione finale ha titolo, descrizione e pulsanti sopra, galassia sotto. Nessun testo visibile sopra SCORRI durante l’apertura.
- Lo scroll viene trattenuto soltanto per la sequenza iniziale; il gesto che l’ha avviata non trascina la pagina al footer. Nessuna altezza/spacer per completare l’effetto. Dopo l’intro, scorrimento normale.
- La velocità del gesto non modifica il tempo della sequenza. Non ci sono code di animazioni a ogni evento wheel/touch.
- Escape e accesso da tastiera ai contenuti chiudono l’intro; link diretti rimangono accessibili. Se WebGL non carica, il contenuto viene liberato.
- Dalla hero composta, un gesto verso l’alto avvia immediatamente la sequenza al contrario, anche senza essere prima scesi. Tornando da sezioni inferiori, ci si ferma sulla hero composta: serve un nuovo gesto verso l’alto, senza usare l’inerzia del gesto precedente. Lo swipe iniziato sotto non avvia il ritorno; i tasti tenuti premuti non lo avviano tramite autorepeat.
- Testo nella sfera sempre WEB & MOBILE / DEVELOPER. Geometria e colori approvati conservati.

## Dispositivi e percorso

- Dispositivi: rotazione continua con lo scroll, posizione frontale al centro della viewport e ritorno reversibile; esplorazione manuale soltanto nella modale.
- Percorso: scia stretta e continua lungo una sola connessione, con coda che si dissolve all’arrivo. Stella bianca a riposo, cyan/zaffiro quando attiva, piccolo impulso all’arrivo e tempo di lettura. Il testo segue la stella raggiunta.
- Ridotte le particelle del percorso da 5000 a 1600; aggiornamento visivo fino a 60 fps. Risorse e listener eliminati alla distruzione del componente.
- La modale del percorso mantiene la pausa/ripresa nello stesso punto. Nessun blocco dello scroll nelle altre sezioni.

Anteprima: http://127.0.0.1:5180/

Le verifiche responsive nel browser non equivalgono a prove fisiche su iPhone/iPad/Android.
