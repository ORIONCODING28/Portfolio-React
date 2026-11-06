const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export const HERO_INTRO_MS = 1800;

/** A centred galaxy, not an oversized opening sphere. */
export function heroOpeningScale(width: number, height: number, viewportWidth: number, availableHeight: number) {
  if (width <= 0 || height <= 0) return 1;
  return Math.max(.65, Math.min(1.3, (viewportWidth - 32) / width, (availableHeight - 100) / height));
}

/** Time, never wheel distance, controls formation → placement → copy on every screen. */
export function heroIntroFrame(elapsed: number) {
  const progress = clamp(elapsed / HERO_INTRO_MS);
  return {
    progress,
    formation: smooth(progress / .55),
    remaining: 1 - smooth((progress - .55) / .3),
    copy: smooth((progress - .85) / .15),
  };
}

export type HeroDirection = 1 | -1;
export type HeroPhase = 'constellation' | 'galaxy' | 'moving';

/** Shared input rules: arriving at the top is not itself a request to reverse. */
export function heroGestureAction(phase:HeroPhase, atTop:boolean, direction:HeroDirection, needsFreshGesture=false, freshGesture=true) {
  if (phase === 'moving') return 'block';
  if (!atTop) return 'pass';
  if (phase === 'constellation' && direction === 1) return 'forward';
  if (phase === 'galaxy' && direction === -1) return needsFreshGesture && !freshGesture ? 'block' : 'reverse';
  return 'pass';
}

export function advanceHeroIntro(elapsed:number, direction:HeroDirection, delta:number) {
  return Math.max(0,Math.min(HERO_INTRO_MS,elapsed+direction*Math.max(0,delta)));
}
