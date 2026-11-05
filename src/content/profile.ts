export interface ProfileStep {
  date: string; short: string; title: string; sub: string; context: string;
  body: string; points: string[]; note?: string;
}
export const profileSteps: Record<'it' | 'en', ProfileStep[]> = {
  "it": [
    {
      "date": "2013–2016",
      "short": "Qualifica IPSIA",
      "title": "Qualifica professionale triennale",
      "sub": "Operatore impianti termoidraulici",
      "context": "I.I.P.S.I.A. «Carlo Alberto Dalla Chiesa»",
      "body": "La prima tappa della mia formazione tecnica: un percorso dedicato agli impianti termoidraulici e alle attività pratiche di settore.",
      "points": [
        "Qualifica professionale di livello EQF 3",
        "Percorso triennale",
        "Formazione tecnica e pratica"
      ]
    },
    {
      "date": "2016–2018",
      "short": "Diploma IPSIA",
      "title": "Diploma di maturità",
      "sub": "Manutentore e Assistente Tecnico",
      "context": "I.I.P.S.I.A. «Carlo Alberto Dalla Chiesa»",
      "body": "Ho proseguito gli studi fino al diploma, approfondendo manutenzione e assistenza tecnica. Nel 2017 ho svolto anche esperienze di alternanza scuola-lavoro.",
      "points": [
        "Diploma di livello EQF 4",
        "Tornitura e fresatura: 96 ore",
        "Impiantistica elettrica: 87 ore",
        "Lavorazioni da fabbro: 120 ore"
      ]
    },
    {
      "date": "2018–2022",
      "short": "Meccanica",
      "title": "Meccanica di veicoli industriali",
      "sub": "Manutenzione, diagnosi e riparazioni",
      "context": "Esperienza lavorativa · Caltagirone",
      "body": "Ho lavorato nella manutenzione e riparazione di veicoli industriali, occupandomi della diagnosi dei guasti e degli interventi sui componenti. Un’esperienza concreta di analisi dei problemi e lavoro in officina.",
      "points": [
        "Componenti meccaniche, oleodinamiche e pneumatiche",
        "Manutenzione e controllo degli impianti frenanti",
        "Tagliandi e sostituzione delle parti usurate",
        "Assistenza al cliente e spiegazione degli interventi"
      ]
    },
    {
      "date": "2022–2023",
      "short": "Edilizia",
      "title": "Esperienza nel settore edile",
      "sub": "Attività operative in cantiere",
      "context": "Esperienza lavorativa · Caltagirone",
      "body": "Ho lavorato come manovale edile, partecipando alle attività quotidiane di cantiere e alla preparazione dei materiali e delle attrezzature.",
      "points": [
        "Movimentazione di materiali e attrezzature",
        "Preparazione di cementi e composti per l’edilizia",
        "Supporto alle demolizioni e agli scavi"
      ]
    },
    {
      "date": "2024–2026",
      "short": "Steve Jobs Academy",
      "title": "Tecnico superiore sviluppatore software",
      "sub": "Web and Mobile Development",
      "context": "Steve Jobs Academy · Architetture software e Data Management",
      "body": "Un biennio dedicato allo sviluppo web e mobile, alle architetture software e alla gestione dei dati, concluso con il diploma e un’esperienza di tirocinio full stack.",
      "points": [
        "1.800 ore complessive",
        "1.080 ore di formazione e 720 di tirocinio",
        "Livello EQF 5",
        "Diploma conseguito con 97/110"
      ]
    },
    {
      "date": "Durante il biennio",
      "short": "Parco del Verismo",
      "title": "Il Parco del Verismo",
      "sub": "Sviluppo web in team",
      "context": "Progetto di gruppo · Django, Python e JavaScript",
      "body": "Ho partecipato allo sviluppo del sito collaborando alla definizione delle attività e all’integrazione del lavoro del gruppo. Mi sono occupato delle pagine dei luoghi, delle mappe interattive e dei percorsi tematici.",
      "points": [
        "Mappe interattive e logica JavaScript",
        "CSS personalizzato e responsive con Bootstrap",
        "Animazioni AOS e navigazione",
        "Collaborazione e versionamento con Git"
      ]
    },
    {
      "date": "720 ore",
      "short": "Tirocinio full stack",
      "title": "Dalle interfacce alla logica applicativa",
      "sub": "Gestionale e piattaforma ecommerce",
      "context": "Tirocinio formativo · React, PHP 8 e MySQL",
      "body": "Ho sviluppato da zero un gestionale per centri estetici e una piattaforma ecommerce con più template e gestione degli aggiornamenti. Il lavoro ha coinvolto interfacce, backend, database e verifiche dei flussi principali.",
      "points": [
        "Prenotazioni singole e multiple, agenda e disponibilità",
        "Aree cliente, amministrazione e operatori",
        "Pagamenti con Stripe e PayPal",
        "Verifiche dei flussi di prenotazione e pagamento"
      ],
      "note": "Nel processo ho utilizzato anche Claude, Gemini e GPT a supporto dello sviluppo, dell’analisi dei problemi e dei test."
    }
  ],
  "en": [
    {
      "date": "2013–2016",
      "short": "IPSIA qualification",
      "title": "Three-year vocational qualification",
      "sub": "Plumbing and heating systems operator",
      "context": "I.I.P.S.I.A. «Carlo Alberto Dalla Chiesa»",
      "body": "The first stage of my technical education, focused on plumbing and heating systems and practical workshop activities.",
      "points": [
        "EQF level 3 vocational qualification",
        "Three-year programme",
        "Technical and practical training"
      ]
    },
    {
      "date": "2016–2018",
      "short": "IPSIA diploma",
      "title": "Upper secondary school diploma",
      "sub": "Maintenance and technical assistance",
      "context": "I.I.P.S.I.A. «Carlo Alberto Dalla Chiesa»",
      "body": "I continued my studies in maintenance and technical assistance. In 2017, I also completed school-to-work placements.",
      "points": [
        "EQF level 4 diploma",
        "Turning and milling: 96 hours",
        "Electrical installations: 87 hours",
        "Metalworking: 120 hours"
      ]
    },
    {
      "date": "2018–2022",
      "short": "Mechanics",
      "title": "Industrial vehicle mechanics",
      "sub": "Maintenance, diagnostics and repairs",
      "context": "Work experience · Caltagirone",
      "body": "I worked on industrial vehicle maintenance and repairs, diagnosing faults and servicing components. A practical experience in problem analysis and workshop operations.",
      "points": [
        "Mechanical, hydraulic and pneumatic components",
        "Brake system maintenance and checks",
        "Servicing and replacement of worn parts",
        "Customer assistance and explanations of repairs"
      ]
    },
    {
      "date": "2022–2023",
      "short": "Construction",
      "title": "Work in construction",
      "sub": "On-site activities",
      "context": "Work experience · Caltagirone",
      "body": "I worked as a construction labourer, taking part in daily site activities and preparing materials and equipment.",
      "points": [
        "Handling materials and equipment",
        "Preparing cement and building compounds",
        "Supporting demolition and excavation work"
      ]
    },
    {
      "date": "2024–2026",
      "short": "Steve Jobs Academy",
      "title": "Higher technical diploma in software development",
      "sub": "Web and Mobile Development",
      "context": "Steve Jobs Academy · Software architecture and Data Management",
      "body": "A two-year programme in web and mobile development, software architecture and data management, completed with a diploma and a full-stack internship.",
      "points": [
        "1,800 hours in total",
        "1,080 hours of training and 720 of internship",
        "EQF level 5",
        "Final grade: 97/110"
      ]
    },
    {
      "date": "During the programme",
      "short": "Parco del Verismo",
      "title": "Il Parco del Verismo",
      "sub": "Web development in a team",
      "context": "Team project · Django, Python and JavaScript",
      "body": "I contributed to the website, coordinating tasks and integrating work with the team. I worked on location pages, interactive maps and themed routes.",
      "points": [
        "Interactive maps and JavaScript logic",
        "Custom CSS and responsive Bootstrap layouts",
        "AOS animations and navigation",
        "Collaboration and version control with Git"
      ]
    },
    {
      "date": "720 hours",
      "short": "Full-stack internship",
      "title": "From interfaces to application logic",
      "sub": "Management software and ecommerce platform",
      "context": "Training internship · React, PHP 8 and MySQL",
      "body": "I built a management application for beauty centres and an ecommerce platform with multiple templates and update management from scratch. My work covered interfaces, backend, databases and validation of the main user flows.",
      "points": [
        "Single and multiple bookings, schedules and availability",
        "Customer, administrator and staff areas",
        "Stripe and PayPal payments",
        "Booking and payment flow testing"
      ],
      "note": "I also used Claude, Gemini and GPT to support development, problem analysis and testing."
    }
  ]
};
