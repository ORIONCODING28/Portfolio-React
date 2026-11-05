import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { terminalCommands, terminalResponse } from '../domain/terminal';
interface Entry { id: number; command: string; output: string }
export function TerminalWindow() {
  const { copy, language, projects, settings } = usePortfolio();
  const [command, setCommand] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const draft = useRef('');
  const scrollFrame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), []);
  const nextId = useRef(0);
  const output = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const context = { language: language as 'it' | 'en', biography: `${copy.completed}: Steve Jobs Academy. ${copy.contactIntro}`, projects, email: settings.email || '' };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;
    if (history.current.at(-1) !== value) history.current = [...history.current.slice(-49), value];
    historyIndex.current = history.current.length;
    draft.current = '';
    const response = terminalResponse(value, context);
    if (response === null) { setEntries([]); setShowIntro(false); }
    else setEntries(previous => [...previous.slice(-39), { id: nextId.current++, command: value, output: response }]);
    setCommand(''); input.current?.focus();
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(() => output.current?.scrollTo({ top: output.current.scrollHeight, behavior: 'instant' }));
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Tab' && !event.shiftKey) {
      const prefix = command.trim().toLowerCase();
      if (!prefix) return;
      const slash = prefix.startsWith('/') ? '/' : '';
      const matches = terminalCommands.filter(name => name.startsWith(prefix.replace(/^\//, '')));
      if (matches.length === 1) {
        event.preventDefault();
        setCommand(slash + matches[0]);
      }
    }
    if ((event.key !== 'ArrowUp' && event.key !== 'ArrowDown') || !history.current.length) return;
    event.preventDefault();
    if (historyIndex.current === history.current.length) draft.current = command;
    historyIndex.current = Math.max(0, Math.min(history.current.length, historyIndex.current + (event.key === 'ArrowUp' ? -1 : 1)));
    setCommand(history.current[historyIndex.current] ?? draft.current);
  };
  return <div className="terminal-window"><div className="terminal-toolbar"><span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span><span>Orion · {language === 'en' ? 'Terminal' : 'Terminale'}</span></div>
      <div className="terminal-output" ref={output} role="log" aria-live="polite" aria-relevant="additions" tabIndex={0} aria-label={copy.lab}>
        {showIntro && <><p className="terminal-prompt">$ help</p><dl className="terminal-help">{terminalResponse('help', context)?.split('\n').map(line => { const [name, ...description] = line.trim().split(/\s+/); return <div key={name}><dt>{name}</dt><dd>{description.join(' ')}</dd></div>; })}</dl><div className="terminal-entry"><p className="terminal-prompt">$ bio</p><pre>{terminalResponse('bio', context)}</pre></div></>}
        {entries.map(entry => <div className="terminal-entry" key={entry.id}><p className="terminal-prompt">$ {entry.command}</p><pre>{entry.output}</pre></div>)}<span className="terminal-cursor" aria-hidden="true">$ ▌</span>
      </div>
      <form className="terminal-form" onSubmit={submit}><p id="terminal-input-hint">{language === 'en' ? 'Commands with or without /. Tab: complete · ↑/↓: history.' : 'Comandi con o senza /. Tab: completa · ↑/↓: cronologia.'}</p><div><label htmlFor="terminal-command">{copy.command}</label><input ref={input} id="terminal-command" name="command" autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={500} aria-describedby="terminal-input-hint" onKeyDown={handleKeyDown} value={command} placeholder={language === 'en' ? 'Try /help or /projects…' : 'Prova /help o /progetti…'} onChange={event => { setCommand(event.target.value); historyIndex.current = history.current.length; draft.current = event.target.value; }} /><button className="button terminal-submit" type="submit">{copy.execute}</button></div></form>
    </div>;
}
