import { publicAsset } from '../domain/deployment.ts';
import type { Project, Skill, Experience, Education, Certification, SiteSettings } from '../types';

export const CV_URL = 'https://res.cloudinary.com/dms3df1hk/image/upload/v1793889899/Giuseppe_Cairone_Ultimo_2026_nrmotb.pdf';

export const siteSettingsIT: SiteSettings = {
  site_title: 'Giuseppe Cairone - Portfolio',
  site_description: 'Sviluppatore Web & Mobile in formazione',
  author_bio: 'Benvenuto sono Giuseppe Cairone, uno sviluppatore full-stack junior con una forte passione per la tecnologia e per la creazione di esperienze digitali moderne, performanti e ben strutturate. Mi occupo dello sviluppo di applicazioni web complete, curando sia il frontend che il backend, con particolare attenzione alla qualità del codice, all\'organizzazione dell\'architettura e all\'esperienza utente. Credo in uno sviluppo orientato alla crescita: studio costantemente nuove tecnologie, sperimento soluzioni innovative e trasformo ogni progetto in un\'occasione per migliorare, imparare e costruire basi solide per il futuro.',
  author_image: publicAsset('/assets/images/profile.jpg'),
  cv_file: CV_URL,
  email: 'giuseppecairone23@gmail.com',
  location: 'Caltagirone, Italia',
  social_links: {
    github: 'https://github.com/ORIONCODING28',
    linkedin: 'https://www.linkedin.com/in/giuseppe-cairone-a50943390/'
  }
};

export const siteSettingsEN: SiteSettings = {
  site_title: 'Giuseppe Cairone - Portfolio',
  site_description: 'Web & Mobile Developer in Training',
  author_bio: 'Welcome I am Giuseppe Cairone, a junior full-stack developer with a strong passion for technology and for creating modern, high-performance and well-structured digital experiences. I take care of the development of complete web applications, caring for both frontend and backend, with particular attention to code quality, architecture organization and user experience. I believe in growth-oriented development: I constantly study new technologies, experiment innovative solutions and transform every project into an opportunity to improve, learn and build solid foundations for the future.',
  author_image: publicAsset('/assets/images/profile.jpg'),
  cv_file: CV_URL,
  email: 'giuseppecairone23@gmail.com',
  location: 'Caltagirone, Italy',
  social_links: {
    github: 'https://github.com/ORIONCODING28',
    linkedin: 'https://www.linkedin.com/in/giuseppe-cairone-a50943390/'
  }
};

export const projectsIT: Project[] = [
  {
    id: 1,
    title: 'Progetto Parco del Verismo',
    slug: 'progetto-parco-del-verismo',
    status: 'published',
    collaboration: 'team',
    media: { mobile: publicAsset('/assets/projects/parco-mobile.png'), domain: 'parcovergacapuana.it', desktopVideo: publicAsset('/assets/projects/parco-desktop.mp4'), mobileVideo: publicAsset('/assets/projects/parco-mobile.mp4'), desktopPoster: publicAsset('/assets/projects/parco-desktop-poster.jpg'), mobilePoster: publicAsset('/assets/projects/parco-mobile-poster.jpg') },
    description: 'Il Parco del Verismo Piattaforma culturale full-stack (Django/JS) con mappe interattive e itinerari tematici. Design responsive e animazioni avanzate per un\'esperienza utente immersiva e fluida.',
    long_description: 'Il Parco del Verismo – Innovative Web Experience. Progettazione di una piattaforma interattiva che fonde letteratura e tecnologia. Ho curato l\'intero ciclo del frontend e l\'integrazione backend, ottimizzando l\'interattività delle mappe e la fluidità delle animazioni per garantire un\'esperienza utente immersiva senza compromessi tecnici.',
    short_description: 'Piattaforma culturale full-stack con mappe interattive',
    category: 'full stack',
    image: publicAsset('/assets/images/parco.jpg'),
    featured: true,
    technologies: 'Python, Django, HTML, CSS, Bootstrap, Leaflet, JavaScript',
    live_url: 'https://parcovergacapuana.it/',
    github_url: undefined,
    completed_date: '2026-01-01',
    order: 1,
    features: [
      'Piattaforma culturale full-stack',
      'Mappe interattive e itinerari tematici',
      'Design responsive e moderno',
      'Integrazione backend Django',
      'Esperienza utente immersiva'
    ]
  },
  {
    id: 2,
    title: 'AnimeCommunity',
    slug: 'anime-app',
    status: 'draft',
    collaboration: 'personal',
    description: 'AnimeCommunity è una web app dedicata agli appassionati di anime, che permette di cercare, esplorare e filtrare titoli, con anteprime, dettagli e informazioni principali. L’interfaccia è intuitiva e responsive, adatta a desktop e dispositivi mobili.',
    long_description: 'Ho creato una piattaforma web che consente agli utenti di cercare anime tramite un’API pubblica, visualizzare risultati con immagini e informazioni dettagliate, e filtrare i contenuti in tempo reale. Sfida principale: Gestire il caricamento dinamico dei dati senza rallentare la pagina: ho risolto implementando fetch asincrono e aggiornamenti del DOM in tempo reale, garantendo interazioni rapide e una navigazione senza interruzioni.',
    short_description: 'Piattaforma per appassionati di anime',
    category: 'web development',
    image: publicAsset('/assets/images/Anime.jpg'),
    featured: true,
    technologies: 'Angular, Bootstrap, HTML, SCSS, JavaScript, Fetch API',
    live_url: 'https://anime.giuseppecairone.dev/',
    github_url: 'https://github.com/ORIONCODING28/nime-characters-explorer',
    completed_date: '2025-12-15',
    order: 2,
    features: [
      'Ricerca evoluta di titoli anime',
      'Filtri dinamici per genere e popolarità',
      'Anteprime e informazioni dettagliate',
      'Interfaccia responsive con Angular & Bootstrap',
      'Animazioni fluide e interattive'
    ]
  },
  {
    id: 3,
    title: 'Vintage Racers',
    slug: 'auto-app',
    status: 'draft',
    collaboration: 'personal',
    description: 'Vintage Racers è una web app che consente di esplorare auto da corsa storiche, con schede dettagliate su modelli, anni e caratteristiche tecniche. Include filtri per categoria e anno, ideale per appassionati di motori e gare classiche.',
    long_description: 'Ho sviluppato una web app interattiva per visualizzare schede di auto da corsa storiche, con possibilità di filtrare per anno e categoria. Ho gestito il rendering dinamico dei dati e la navigazione tra le schede, creando un’esperienza immersiva e intuitiva. Sfida principale: Creare filtri dinamici senza ricaricare la pagina: ho implementato JavaScript puro per aggiornare i contenuti in tempo reale, mantenendo l’esperienza utente sempre fluida e veloce.',
    short_description: 'Archivio interattivo di auto da corsa storiche',
    category: 'web development',
    image: publicAsset('/assets/images/Auto D\'Epoca.jpg'),
    featured: true,
    technologies: 'HTML, CSS, JavaScript, Filtri Interattivi',
    live_url: 'https://auto.giuseppecairone.dev/',
    github_url: 'https://github.com/ORIONCODING28/Auto-D-epoca',
    completed_date: '2025-11-20',
    order: 3,
    features: [
      'Esplorazione auto da corsa storiche',
      'Schede tecniche dettagliate per modello',
      'Filtri avanzati per categoria e anno',
      'Rendering dati in tempo reale (JS puro)',
      'Design ottimizzato e interazioni hover'
    ]
  }
];

export const projectsEN: Project[] = [
  {
    id: 1,
    title: 'Verismo Park Project',
    slug: 'progetto-parco-del-verismo',
    status: 'published',
    collaboration: 'team',
    media: { mobile: publicAsset('/assets/projects/parco-mobile.png'), domain: 'parcovergacapuana.it', desktopVideo: publicAsset('/assets/projects/parco-desktop.mp4'), mobileVideo: publicAsset('/assets/projects/parco-mobile.mp4'), desktopPoster: publicAsset('/assets/projects/parco-desktop-poster.jpg'), mobilePoster: publicAsset('/assets/projects/parco-mobile-poster.jpg') },
    description: 'Verismo Park - A full-stack cultural platform (Django/JS) with interactive maps and thematic itineraries. Responsive design and advanced animations for an immersive and fluid user experience.',
    long_description: 'Verismo Park – Innovative Web Experience. Design of an interactive platform that merges literature and technology. I curated the entire frontend cycle and backend integration, optimizing map interactivity and animation fluidity to ensure an immersive user experience without technical compromises.',
    short_description: 'Full-stack cultural platform with interactive maps',
    category: 'full stack',
    image: publicAsset('/assets/images/parco.jpg'),
    featured: true,
    technologies: 'Python, Django, HTML, CSS, Bootstrap, Leaflet, JavaScript',
    live_url: 'https://parcovergacapuana.it/',
    github_url: undefined,
    completed_date: '2026-01-01',
    order: 1,
    features: [
      'Full-stack cultural platform',
      'Interactive maps and thematic itineraries',
      'Responsive and modern design',
      'Django backend integration',
      'Immersive user experience'
    ]
  },
  {
    id: 2,
    title: 'AnimeCommunity',
    slug: 'anime-app',
    status: 'draft',
    collaboration: 'personal',
    description: 'AnimeCommunity is a web app dedicated to anime fans, allowing them to search, explore, and filter titles, with previews, details, and key information. The interface is intuitive and responsive, suitable for desktop and mobile devices.',
    long_description: 'I created a web platform that allows users to search for anime via a public API, view results with images and detailed information, and filter content in real-time. Main challenge: Managing dynamic data loading without slowing down the page: I solved it by implementing asynchronous fetch and real-time DOM updates, ensuring fast interactions and seamless navigation.',
    short_description: 'Platform for anime enthusiasts',
    category: 'web development',
    image: publicAsset('/assets/images/Anime.jpg'),
    featured: true,
    technologies: 'Angular, Bootstrap, HTML, SCSS, JavaScript, Fetch API',
    live_url: 'https://anime.giuseppecairone.dev/',
    github_url: 'https://github.com/ORIONCODING28/nime-characters-explorer',
    completed_date: '2025-12-15',
    order: 2,
    features: [
      'Advanced search for anime titles',
      'Dynamic filters by genre and popularity',
      'Detailed previews and information',
      'Responsive interface with Angular & Bootstrap',
      'Smooth and interactive animations'
    ]
  },
  {
    id: 3,
    title: 'Vintage Racers',
    slug: 'auto-app',
    status: 'draft',
    collaboration: 'personal',
    description: 'Vintage Racers is a web app that explores historical racing cars, with detailed sheets on models, years, and technical specifications. It includes filters by category and year, ideal for racing enthusiasts and classic competitions.',
    long_description: 'I developed an interactive web app to display historical racing car sheets, with the ability to filter by year and category. I managed dynamic data rendering and navigation between sheets, creating an immersive and intuitive experience. Main challenge: Creating dynamic filters without reloading the page: I implemented pure JavaScript to update content in real-time, keeping the user experience always fluid and fast.',
    short_description: 'Interactive archive of historical racing cars',
    category: 'web development',
    image: publicAsset('/assets/images/Auto D\'Epoca.jpg'),
    featured: true,
    technologies: 'HTML, CSS, JavaScript, Interactive Filters',
    live_url: 'https://auto.giuseppecairone.dev/',
    github_url: 'https://github.com/ORIONCODING28/Auto-D-epoca',
    completed_date: '2025-11-20',
    order: 3,
    features: [
      'Exploration of historical racing cars',
      'Detailed technical sheets by model',
      'Advanced filters by category and year',
      'Real-time data rendering (Pure JS)',
      'Optimized design and hover interactions'
    ]
  }
];

export const skillsList: Skill[] = [
  { id: 1, name: 'HTML & CSS', category: 'frontend', proficiency: 90, icon: 'html', order: 1, category_order: 1 },
  { id: 2, name: 'Angular', category: 'frontend', proficiency: 85, icon: 'angular', order: 2, category_order: 2 },
  { id: 3, name: 'React', category: 'frontend', proficiency: 85, icon: 'react', order: 3, category_order: 3 },
  { id: 4, name: 'JavaScript', category: 'backend', proficiency: 80, icon: 'javascript', order: 4, category_order: 1 },
  { id: 5, name: 'TypeScript', category: 'backend', proficiency: 80, icon: 'typescript', order: 5, category_order: 2 },
  { id: 6, name: 'Python', category: 'backend', proficiency: 85, icon: 'python', order: 6, category_order: 3 },
  { id: 7, name: 'C', category: 'backend', proficiency: 75, icon: 'c', order: 7, category_order: 4 },
  { id: 8, name: 'Flutter', category: 'mobile', proficiency: 75, icon: 'flutter', order: 8, category_order: 1 },
  { id: 9, name: 'React Native', category: 'mobile', proficiency: 80, icon: 'react', order: 9, category_order: 2 },
  { id: 10, name: 'SQL & NoSQL', category: 'database', proficiency: 80, icon: 'database', order: 10, category_order: 1 },
  { id: 11, name: 'Bootstrap', category: 'frameworks', proficiency: 85, icon: 'bootstrap', order: 11, category_order: 1 },
  { id: 12, name: 'Tailwind CSS', category: 'frameworks', proficiency: 85, icon: 'tailwind', order: 12, category_order: 2 },
  { id: 13, name: 'Sass / SCSS', category: 'frameworks', proficiency: 85, icon: 'sass', order: 13, category_order: 3 },
  { id: 14, name: 'Node / Express', category: 'frameworks', proficiency: 75, icon: 'node', order: 14, category_order: 4 },
  { id: 15, name: 'Django', category: 'frameworks', proficiency: 80, icon: 'django', order: 15, category_order: 5 }
];

export const experiencesIT: Experience[] = [
  {
    id: 1,
    title: 'Sviluppatore Web & Mobile',
    company: 'Freelance',
    location: 'Caltagirone, Italia',
    start_date: '2024 - Presente',
    is_current: true,
    description: 'Sviluppo di applicazioni web e mobile per clienti. Focus su qualità del codice, architettura solida, user experience e scalabilità.',
    order: 1
  }
];

export const experiencesEN: Experience[] = [
  {
    id: 1,
    title: 'Web & Mobile Developer',
    company: 'Freelance',
    location: 'Caltagirone, Italy',
    start_date: '2024 - Present',
    is_current: true,
    description: 'Development of web and mobile applications for clients. Focus on code quality, robust architecture, user experience and scalability.',
    order: 1
  }
];

export const educationsIT: Education[] = [
  {
    id: 1,
    title: 'C',
    institution: 'Steve Jobs Academy',
    description: 'Linguaggio di basso livello per il controllo totale dell\'hardware e della memoria. Ideale per sistemi embedded, driver e ottimizzazione estrema delle performance.',
    hours: 80,
    order: 1
  },
  {
    id: 2,
    title: 'Web Front End',
    institution: 'Steve Jobs Academy',
    description: 'Web Front-End (HTML, CSS, JS): Sviluppo di interfacce utente moderne e responsive. Integrazione tra struttura semantica, design avanzato e logica interattiva lato client.',
    hours: 100,
    order: 2
  },
  {
    id: 3,
    title: 'Data Management',
    institution: 'Steve Jobs Academy',
    description: 'Data Management (SQL & NoSQL): Progettazione e amministrazione di database strutturati e distribuiti. Competenza nel bilanciare integrità dei dati e scalabilità in base alle esigenze applicative.',
    hours: 80,
    order: 3
  },
  {
    id: 4,
    title: 'Flutter I.A.',
    institution: 'Steve Jobs Academy',
    description: 'Flutter: Sviluppo app cross-platform ad alte prestazioni con UI nativa e reattiva.',
    hours: 55,
    order: 4
  },
  {
    id: 5,
    title: 'Python',
    institution: 'Steve Jobs Academy',
    description: 'Versatile e leggibile, focalizzato sulla rapidità di sviluppo e l\'automazione. Standard di settore per Data Science, Intelligenza Artificiale e scripting backend.',
    hours: 60,
    order: 5
  },
  {
    id: 6,
    title: 'Angular I.A.',
    institution: 'Steve Jobs Academy',
    description: 'Framework enterprise per lo sviluppo di Single Page Application (SPA) robuste e scalabili. Architettura modulare in TypeScript per la gestione di logiche frontend complesse e strutturate.',
    hours: 70,
    order: 6
  },
  {
    id: 7,
    title: 'Web Architecture & Back-End',
    institution: 'Steve Jobs Academy',
    description: 'Web Architecture & Back-End: Design di infrastrutture scalabili e sviluppo di API robuste lato server. JS / TS: Programmazione versatile e tipizzata per interfacce moderne e backend affidabili.',
    hours: 90,
    order: 7
  },
  {
    id: 8,
    title: 'React & React Native',
    institution: 'Steve Jobs Academy',
    description: 'React & React Native: Sviluppo di ecosistemi completi Web e Mobile basati su componenti. Massimizzazione del riutilizzo del codice e coerenza della UI su ogni tipologia di dispositivo.',
    hours: 60,
    order: 8
  }
];

export const educationsEN: Education[] = [
  {
    id: 1,
    title: 'C',
    institution: 'Steve Jobs Academy',
    description: 'Low-level language for complete control of hardware and memory. Ideal for embedded systems, drivers and extreme performance optimization.',
    hours: 80,
    order: 1
  },
  {
    id: 2,
    title: 'Web Front End',
    institution: 'Steve Jobs Academy',
    description: 'Web Front-End (HTML, CSS, JS): Development of modern and responsive user interfaces. Integration between semantic structure, advanced design and interactive client-side logic.',
    hours: 100,
    order: 2
  },
  {
    id: 3,
    title: 'Data Management',
    institution: 'Steve Jobs Academy',
    description: 'Data Management (SQL & NoSQL): Design and administration of structured and distributed databases. Expertise in balancing data integrity and scalability based on application needs.',
    hours: 80,
    order: 3
  },
  {
    id: 4,
    title: 'Flutter I.A.',
    institution: 'Steve Jobs Academy',
    description: 'Flutter: High-performance cross-platform app development with native and reactive UI.',
    hours: 55,
    order: 4
  },
  {
    id: 5,
    title: 'Python',
    institution: 'Steve Jobs Academy',
    description: 'Versatile and readable, focused on rapid development and automation. Industry standard for Data Science, Artificial Intelligence and backend scripting.',
    hours: 60,
    order: 5
  },
  {
    id: 6,
    title: 'Angular I.A.',
    institution: 'Steve Jobs Academy',
    description: 'Enterprise framework for developing robust and scalable Single Page Applications (SPAs). Modular architecture in TypeScript for managing complex and structured frontend logic.',
    hours: 70,
    order: 6
  },
  {
    id: 7,
    title: 'Web Architecture & Back-End',
    institution: 'Steve Jobs Academy',
    description: 'Web Architecture & Back-End: Design of scalable infrastructures and development of robust server-side APIs. JS / TS: Versatile and typed programming for modern interfaces and reliable backend.',
    hours: 90,
    order: 7
  },
  {
    id: 8,
    title: 'React & React Native',
    institution: 'Steve Jobs Academy',
    description: 'React & React Native: Development of complete Web and Mobile ecosystems based on components. Maximizing code reuse and UI consistency across every device type.',
    hours: 60,
    order: 8
  }
];

export const certificationsIT: Certification[] = [
  {
    id: 1,
    title: 'HTML Essentials',
    issuing_organization: 'Cisco Networking Academy',
    issue_date: 'Gennaio 2026',
    description: 'Certificazione in HTML5 che attesta la conoscenza delle strutture di markup, degli elementi semantici, dei moduli, delle tabelle, degli attributi e delle migliori pratiche per lo sviluppo di contenuti web accessibili e semanticamente corretti.',
    image: publicAsset('/assets/certification/Attestato_Certificazione_Html.jpg'),
    badge: publicAsset('/assets/badge/html-essentials.jpg'),
    credential_url: 'https://www.credly.com/badges/be92eea3-b417-4ec1-a1da-690d39dc635c/public_url',
    order: 1
  },
  {
    id: 2,
    title: 'Pandas',
    issuing_organization: 'Kaggle',
    issue_date: 'Novembre 2025',
    description: 'Libreria Python per la manipolazione e l\'analisi di dati strutturati tramite DataFrame. Essenziale per il data cleaning, la trasformazione di dataset complessi e la preparazione dei dati.',
    image: publicAsset('/assets/certification/Attestato_Pandas.jpg'),
    badge: publicAsset('/assets/badge/pandas.jpg'),
    credential_url: 'https://www.kaggle.com/learn/certification/giuseppecairone28/pandas',
    order: 2
  },
  {
      "id": 3,
      "title": "Claude Code 101",
      "issuing_organization": "Claude Academy",
      "issue_date": "5 novembre 2026",
      "description": "Attestato di completamento del corso Claude Code 101, dedicato all’utilizzo di Claude Code come strumento di supporto nello sviluppo software.",
      "image": publicAsset("/assets/certification/Attestato_Claude_Code_101.png"),
      "badge": publicAsset("/assets/certification/Attestato_Claude_Code_101.png"),
      "credential_url": "https://academy.claude.com/verify/350526e1eec246b9a4d7992357af1d9a",
      "order": 3
  }
];

export const certificationsEN: Certification[] = [
  {
    id: 1,
    title: 'HTML Essentials',
    issuing_organization: 'Cisco Networking Academy',
    issue_date: 'January 2026',
    description: 'Certification in HTML5 that attests to knowledge of markup structures, semantic elements, forms, tables, attributes and best practices for developing accessible and semantically correct web content.',
    image: publicAsset('/assets/certification/Attestato_Certificazione_Html.jpg'),
    badge: publicAsset('/assets/badge/html-essentials.jpg'),
    credential_url: 'https://www.credly.com/badges/be92eea3-b417-4ec1-a1da-690d39dc635c/public_url',
    order: 1
  },
  {
    id: 2,
    title: 'Pandas',
    issuing_organization: 'Kaggle',
    issue_date: 'November 2025',
    description: 'Python library for manipulation and analysis of structured data via DataFrames. Essential for data cleaning, transformation of complex datasets and data preparation.',
    image: publicAsset('/assets/certification/Attestato_Pandas.jpg'),
    badge: publicAsset('/assets/badge/pandas.jpg'),
    credential_url: 'https://www.kaggle.com/learn/certification/giuseppecairone28/pandas',
    order: 2
  },
  {
      "id": 3,
      "title": "Claude Code 101",
      "issuing_organization": "Claude Academy",
      "issue_date": "5 November 2026",
      "description": "Certificate of completion for Claude Code 101, a course on using Claude Code to support software development.",
      "image": publicAsset("/assets/certification/Attestato_Claude_Code_101.png"),
      "badge": publicAsset("/assets/certification/Attestato_Claude_Code_101.png"),
      "credential_url": "https://academy.claude.com/verify/350526e1eec246b9a4d7992357af1d9a",
      "order": 3
  }
];

export const faqItemsIT = [
  {
    q: 'Quali sono i tuoi orari di disponibilità per nuovi progetti?',
    a: 'Sono disponibile per collaborazioni freelance, full-time e contratti a progetto. Rispondo solitamente entro 24 ore via email o LinkedIn.'
  },
  {
    q: 'Ti occupi sia di frontend che di backend?',
    a: 'Sì, sviluppo soluzioni Full Stack complete: frontend moderni e reattivi (React, Angular, Tailwind) e backend solidi (Python/Django, Node.js/Express, database SQL/NoSQL).'
  },
  {
    q: 'Lavori anche da remoto?',
    a: 'Certamente! Lavoro con metodo agile in full-remote con strumenti collaborativi (Git, Slack, Trello, Jira, Meet/Zoom).'
  }
];

export const faqItemsEN = [
  {
    q: 'What is your availability for new projects?',
    a: 'I am open to freelance collaborations, full-time roles, and contract work. I usually respond within 24 hours via email or LinkedIn.'
  },
  {
    q: 'Do you handle both frontend and backend?',
    a: 'Yes, I build full-stack applications: modern, responsive frontends (React, Angular, Tailwind) and robust backends (Python/Django, Node.js/Express, SQL/NoSQL databases).'
  },
  {
    q: 'Do you work remotely?',
    a: 'Definitely! I work remotely using agile methodologies and modern collaborative tools (Git, Slack, Trello, Jira, Meet/Zoom).'
  }
];
