# Spaziature del portfolio

Aggiornato: 6 novembre 2026.

La scala condivisa è in `src/styles/spacing.css`. Modificare i token prima di aggiungere nuove distanze nelle singole pagine.

| Ruolo | Telefono | Desktop | Schermi da 1920 px |
| --- | --- | --- | --- |
| Margine laterale minimo | 20 px; 16 px sotto 360 px | 32 px | 48–96 px |
| Titolo → testo | 12 px | 16 px | 24 px |
| Testo → azione | 20 px | 24 px | 32 px |
| Gruppi di contenuto | 24 px | 32 px | 40 px |
| Spazio verticale di sezione | 40 px | 56 px | 64–88 px |
| Inizio pagina | 32 px | 40 px | 64 px |
| Colonne e griglie | 24 px | 32 px | 48 px |

Navbar, contenuti e footer condividono `--content-width`, con limite di 1680 px e di 2400 px sugli schermi grandi. Il margine effettivo cresce quando si raggiunge questo limite. I separatori restano a tutta larghezza.

La Privacy conserva il limite di 76ch per la lettura. Dimensioni dei canvas, area delle orbite, spazi delle etichette animate e altezza stabile del percorso restano indipendenti dalla scala tipografica: non ridurli per recuperare spazio senza verificare le inquadrature. I canvas che arrivano ai bordi usano lo stesso margine laterale del contenitore.

Verifica del 6 novembre nel browser integrato: allineamenti e assenza di overflow orizzontale alle larghezze 320, 390, 768, 1024, 1280 e 2560 px, su Home, Profilo e Progetti; case study e Privacy controllati alle larghezze rappresentative. Controllata anche la modale Crediti in tema chiaro. Il controllo automatico di layout non ha segnalato problemi.

Su telefono, tablet e dispositivi con puntatore touch, le animazioni della Home restano attive ma sono più rapide: i testi si spostano di soli 4 px in 160 ms, senza dissolvenza o ritardi tra elementi. I modelli completano l’ingresso nel primo 20% del passaggio nello schermo (36% su desktop) e mantengono più a lungo la posa frontale. Uno scroll veloce aggiorna direttamente la posa, senza accodare animazioni. La vista interattiva rimane nella modale.
