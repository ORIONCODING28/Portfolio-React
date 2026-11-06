export const JOURNEY_HOLD_SECONDS = 1.8;
export const JOURNEY_TRAVEL_SECONDS = 1.4;
export const JOURNEY_STAGE_SECONDS = JOURNEY_HOLD_SECONDS + JOURNEY_TRAVEL_SECONDS;
const RESET_SECONDS = .4;
const smooth = (value:number) => { const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t); };

export interface JourneyFrame { progress:number; index:number; travel:number; labelOpacity:number; fade:number }

/** Hold at a star, travel only its outgoing link, then activate the next star on arrival. */
export function journeyFrame(elapsed:number,phases:readonly number[]):JourneyFrame {
  if(!phases.length)return {progress:0,index:0,travel:0,labelOpacity:0,fade:0};
  if(phases.length===1)return {progress:phases[0],index:0,travel:0,labelOpacity:1,fade:1};
  const lastStart=(phases.length-1)*JOURNEY_STAGE_SECONDS;
  const cycle=lastStart+JOURNEY_HOLD_SECONDS+RESET_SECONDS;
  const time=Math.max(0,elapsed)%cycle;
  if(time>=lastStart){
    const fade=1-smooth((time-lastStart-JOURNEY_HOLD_SECONDS)/RESET_SECONDS);
    return {progress:phases[phases.length-1],index:phases.length-1,travel:0,labelOpacity:fade,fade};
  }
  const index=Math.min(phases.length-2,Math.floor((time+1e-10)/JOURNEY_STAGE_SECONDS));
  const local=time-index*JOURNEY_STAGE_SECONDS;
  const travel=Math.max(0,Math.min(1,(local-JOURNEY_HOLD_SECONDS)/JOURNEY_TRAVEL_SECONDS));
  const progress=phases[index]+(phases[index+1]-phases[index])*smooth(travel);
  return {progress,index,travel,labelOpacity:1-smooth(travel/.18),fade:1};
}
