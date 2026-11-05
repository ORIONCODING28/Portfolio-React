# Controllo responsive — 5 novembre 2026

## Ambito

Controllo del portfolio React esistente, senza ridisegnare le pagine o modificare i movimenti delle animazioni.

- Home: hero/galassia, modelli Web/Mobile/Backend, caroselli tecnologie, formazione e pratica, footer.
- Profilo: presentazione/foto, percorso, competenze, certificazioni e attestati.
- Progetti e tutti e tre i dettagli: Verismo, AnimeCommunity, Vintage Racers.
- Privacy Policy e pagina non trovata.
- Sidebar con tema e lingua; modali contatti/antispam, crediti, terminale, certificazioni e fasi del percorso; viste 3D a schermo intero.
- Tema chiaro in italiano e tema scuro in inglese; preferenze infine riportate a italiano/chiaro come all’inizio.

## Dimensioni esaminate

La matrice copre 320, 375, 390, 425, 640, 768, 1024, 1366, 1920, 2560 e 3840 px, con controlli aggiuntivi a 640×360 e 844×390 in orizzontale e altezze ridotte di 500 px. Le pagine principali e le modali sono state controllate a mobile, tablet, laptop e desktop; la home e i componenti condivisi anche a 3840 px. Non ogni combinazione di pagina, lingua e dimensione è stata ripetuta: la copertura usa i breakpoint e i componenti condivisi.

Verifiche: geometria DOM, overflow orizzontale, testo tagliato, dimensioni dei controlli, contenimento delle immagini e controllo visivo delle sezioni rappresentative. Sono stati provati apertura/chiusura delle modali, cambio tema/lingua e collegamento dal footer alle certificazioni.

## Problemi corretti

1. **Canvas 3D della home oltre il viewport dopo il ridimensionamento.** A 320–390 px il laptop poteva conservare una larghezza di 480 px; durante altri passaggi anche gli altri modelli mantenevano la precedente dimensione. Il renderer aggiorna ora il buffer senza scrivere dimensioni CSS in pixel: il canvas segue sempre il contenitore al 100%. Lo stesso criterio è applicato ai modelli del profilo e alle viste a schermo intero. Verificati canvas caricati larghi 270 px dentro contenitori di 270 px a viewport 320 px.
2. **Link Certificazioni del footer.** Portava al profilo, ma lasciava lo scroll all’inizio. Ora l’ancora viene raggiunta anche quando la pagina viene caricata in modo differito; l’observer viene rimosso quando trova la sezione o cambia la navigazione.
3. **Intestazioni delle modali.** Il testo può restringersi e andare a capo senza spingere fuori il pulsante di chiusura; il pulsante mantiene la propria area. Stesso contenimento per le intestazioni dei modelli 3D e del percorso.
4. **Tocchi nei contatti e nei crediti.** Link privacy/termini e autori brevi hanno area minima 44×44 px. La checkbox resta visivamente di 22 px, ma è associata a un’etichetta cliccabile alta almeno 44 px.
5. **Schermi bassi.** Spazi della sidebar ridotti in orizzontale, mantenendo lo scorrimento naturale; campo del terminale a 16 px su schermi compatti per evitare l’ingrandimento automatico all’ingresso su iOS.

Non sono stati aggiunti overflow nascosti globali per mascherare difetti, né modificati colori, contenuti o traiettorie delle animazioni. I caroselli conservano il proprio scorrimento orizzontale intenzionale.

## Esito

Nei controlli finali non sono emersi sbordi orizzontali o testi troncati sulle superfici esaminate. Gli attestati usano object-fit: contain e mantengono il contenuto intero, senza zoom; il testo della modale scorre quando l’altezza è ridotta.

- Build TypeScript/Vite: superata.
- Lint: superato.
- Test: 20 superati, 0 falliti.
- Resta il precedente avviso sul chunk Three.js oltre 500 kB.

## Limiti della verifica

Controllo effettuato nel browser integrato con viewport ridimensionati. Le altezze ridotte simulano lo spazio ridotto disponibile, senza provare una tastiera software reale. Safari/iOS e Android, swipe e pinch fisici, notch/safe area e prestazioni sui telefoni reali richiedono la prova su dispositivo. Non è stata risolta una CAPTCHA né inviata un’email durante questo controllo. Non è possibile garantire ogni dispositivo/browser esistente attraverso la sola simulazione.

## Correzione successiva: composizione su schermi grandi

Il primo controllo di overflow non aveva rilevato una composizione incoerente: a 2560 px il profilo era ancora largo 1200 px (margini laterali 675 px), mentre navbar e footer erano larghi 2400 px (margini 75 px). Corretto dopo la segnalazione dell’utente.

- Profilo allineato alle larghezze della home e del footer: massimo 1680 px, poi massimo 2400 px sui desktop ampi, conservando i gutter mobile.
- Certificazioni: tre visibili da 1280 px, due tra 640 e 1279 px, una sotto 640 px. Quando il numero di certificazioni non supera quelle visibili, non vengono creati duplicati e le frecce sono disabilitate. Se vengono aggiunti attestati, il carosello ciclico rimane disponibile.
- Footer ampio con proporzioni e leggibilità aggiornate. Verificati a 2560 px allineamento profilo/footer a x=75, larghezza 2400 px, copyright centrato, crediti a sinistra e privacy a destra.
- Verificato il passaggio 2560→1024→390→2560 px: rispettivamente 3/2/1/3 elementi visibili, corretto aggiornamento dei duplicati e nessuno sbordo mobile.
- Build e lint superati dopo queste correzioni.
