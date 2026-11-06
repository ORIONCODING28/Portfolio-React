export interface ProjectFeature { title: string; body: string; label?: string; href?: string }
interface ProjectCaseStudy { context: string; role: string; overviewTitle: string; overview: string; features: ProjectFeature[] }
const it: Record<string, ProjectCaseStudy> = {
  'progetto-parco-del-verismo': {
    context: 'Progetto di gruppo alla Steve Jobs Academy', role: 'Sviluppo dell’interfaccia e integrazione con il backend',
    overviewTitle: 'Un sito per esplorare il Verismo',
    overview: 'Il patrimonio letterario di Giovanni Verga e Luigi Capuana, raccolto in un unico spazio: luoghi, itinerari, opere, eventi e risorse culturali.',
    features: [
      {title:'Luoghi e itinerari',body:'Vizzini, Mineo e Licodia Eubea: luoghi e percorsi legati agli autori e alle loro opere.',label:'Esplora Vizzini',href:'https://parcovergacapuana.it/vizzini/'},
      {title:'Opere e patrimonio letterario',body:'Pagine dedicate a Verga e Capuana, con opere, personaggi e risorse per approfondire.',label:'Scopri le opere di Verga',href:'https://parcovergacapuana.it/opere/giovanni-verga/'},
      {title:'Eventi e notizie',body:'Attività e aggiornamenti raccolti in sezioni dedicate, con una pagina di dettaglio per ogni contenuto.',label:'Consulta gli eventi',href:'https://parcovergacapuana.it/eventi/'}
    ]
  }
};
const en: Record<string, ProjectCaseStudy> = {
  'progetto-parco-del-verismo': {
    context:'Team project at Steve Jobs Academy',role:'Interface development and backend integration',
    overviewTitle:'A website for exploring Verismo',
    overview:'The literary heritage of Giovanni Verga and Luigi Capuana, brought together in one place: towns, themed itineraries, works, events and cultural resources.',
    features:[
      {title:'Places and itineraries',body:'Vizzini, Mineo and Licodia Eubea: places and routes connected to the authors and their works.',label:'Explore Vizzini',href:'https://parcovergacapuana.it/vizzini/'},
      {title:'Works and literary heritage',body:'Pages dedicated to Verga and Capuana, with works, characters and resources for further reading.',label:'Discover Verga’s works',href:'https://parcovergacapuana.it/opere/giovanni-verga/'},
      {title:'Events and news',body:'Activities and updates collected in dedicated sections, with a detail page for each entry.',label:'See events',href:'https://parcovergacapuana.it/eventi/'}
    ]
  }
};
export function getProjectCaseStudy(slug: string, english: boolean): ProjectCaseStudy | undefined { return (english ? en : it)[slug]; }
