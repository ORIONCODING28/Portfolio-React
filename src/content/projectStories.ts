export interface ProjectStory { objective: string; contribution: string; choices: string }
const it: Record<string, ProjectStory> = {
  'progetto-parco-del-verismo': {
    objective: 'Valorizzare luoghi e percorsi del Verismo attraverso una piattaforma culturale con mappe e itinerari tematici.',
    contribution: 'Ho curato l’interfaccia web e l’integrazione con il backend, collegando i contenuti culturali alla navigazione e alle mappe.',
    choices: 'Django per il backend, JavaScript per l’interazione e Leaflet per le mappe. Il layout si adatta a desktop e dispositivi mobili.',
  },
  'anime-app': {
    objective: 'Rendere consultabili contenuti e personaggi anime con ricerca, filtri e informazioni di dettaglio.',
    contribution: 'Ho realizzato l’interfaccia responsive e gestito il caricamento dei dati e l’aggiornamento dei risultati attraverso i filtri.',
    choices: 'Angular e Bootstrap per l’interfaccia; JavaScript e Fetch API per il caricamento asincrono dei dati, senza ricaricare la pagina.',
  },
  'auto-app': {
    objective: 'Esplorare modelli e caratteristiche delle auto da corsa storiche attraverso un archivio interattivo.',
    contribution: 'Ho sviluppato il catalogo, la navigazione fra le schede e i filtri dinamici per consultare i modelli.',
    choices: 'HTML e CSS per la struttura e il layout; JavaScript per aggiornare i contenuti e applicare i filtri senza ricaricare la pagina.',
  },
};
const en: Record<string, ProjectStory> = {
  'progetto-parco-del-verismo': {
    objective: 'Explore the places and literary heritage of Verismo through a cultural platform with maps and themed itineraries.',
    contribution: 'I built the web interface and integrated it with the backend, connecting cultural content, navigation and maps.',
    choices: 'Django for the backend, JavaScript for interaction and Leaflet for maps. The layout adapts to desktop and mobile devices.',
  },
  'anime-app': {
    objective: 'Make anime content and characters easy to explore with search, filters and detailed information.',
    contribution: 'I developed the responsive interface, asynchronous data loading and dynamic filtering of results.',
    choices: 'Angular and Bootstrap for the interface; JavaScript and Fetch API to load data without reloading the page.',
  },
  'auto-app': {
    objective: 'Explore historic racing cars and their specifications through an interactive archive.',
    contribution: 'I developed the catalog, navigation between model details and dynamic filters.',
    choices: 'HTML and CSS for structure and layout; JavaScript to update content and apply filters without reloading the page.',
  },
};
export function getProjectStory(slug: string, isEnglish: boolean): ProjectStory | undefined { return (isEnglish ? en : it)[slug]; }
