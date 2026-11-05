export const terminalCommands = ['help', 'bio', 'stack', 'projects', 'contact', 'whoami', 'clear'] as const;
export type TerminalLanguage = 'it' | 'en';
const help = {
  it: 'help       Tutti i comandi\nbio        Chi sono\nstack      Tecnologie\nprojects   I progetti\ncontact    Come contattarmi\nwhoami     Chi sta visitando\nclear      Pulisci la console',
  en: 'help       All commands\nbio        About me\nstack      Technologies\nprojects   My projects\ncontact    Get in touch\nwhoami     Current visitor\nclear      Clear the console',
};
export interface TerminalContext { language: TerminalLanguage; biography: string; projects: { title: string; slug: string }[]; email: string }
export function terminalResponse(raw: string, context: TerminalContext): string | null {
  const command = raw.trim().toLowerCase().replace(/^\/\s*/, '').replace(/[?!.,;]+$/g, '');
  const en = context.language === 'en';
  if (command === 'clear' || command === 'cls') return null;
  if (['help', 'aiuto', 'comandi', ''].includes(command)) return help[context.language];
  if (['bio', 'about', 'chi sei'].includes(command)) return `Giuseppe Cairone — ${en ? 'junior full-stack developer.' : 'sviluppatore full-stack junior.'}\n\n${context.biography}`;
  if (['stack', 'tecnologie'].includes(command)) return 'Frontend: Angular, React, TypeScript, HTML, CSS\nBackend: Python, Django, Node.js\nData & tools: SQL, Git\nMobile: Flutter, React Native';
  if (['projects', 'progetti'].includes(command)) return context.projects.map(project => `${project.title}\n/projects/${project.slug}`).join('\n\n');
  if (command === 'contact' || command === 'contatti') return `Email: ${context.email}\nGitHub: github.com/ORIONCODING28\nLinkedIn: linkedin.com/in/giuseppe-cairone-a50943390/`;
  if (command === 'whoami') return en ? 'A curious visitor. Welcome to the lab.' : 'Un visitatore curioso. Benvenuto nel laboratorio.';
  if (command.startsWith('bot ')) {
    if (/formazione|education|course/.test(command)) return en ? 'Steve Jobs Academy course completed. Certifications: HTML Essentials (Cisco) and Pandas (Kaggle).' : 'Percorso Steve Jobs Academy concluso. Certificazioni: HTML Essentials (Cisco) e Pandas (Kaggle).';
    if (/disponibil|opportun|lavor|availability|work/.test(command)) return en ? 'I am looking for an opportunity in software development. Use contact to get in touch.' : 'Cerco un’opportunità nello sviluppo software. Usa contact per contattarmi.';
    return en ? 'This is a local terminal, not an AI chat. Try bio, stack, projects or contact.' : 'Questo è un terminale locale, non una chat AI. Prova bio, stack, projects o contact.';
  }
  return en ? `Unknown command: ${raw}. Type help to see the commands.` : `Comando non riconosciuto: ${raw}. Digita help per vedere i comandi.`;
}
