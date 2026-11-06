export const JOURNEY_HOLD_SECONDS = 1.4;
export const JOURNEY_TRAVEL_SECONDS = 1.1;
export const JOURNEY_PULSE_SECONDS = 15;
export const JOURNEY_STAGE_SECONDS = JOURNEY_HOLD_SECONDS + JOURNEY_TRAVEL_SECONDS;
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const smooth=(value:number)=>{const t=clamp(value);return t*t*(3-2*t);};

export interface JourneyFrame {
  progress:number; builtProgress:number; index:number; travel:number;
  continuous:boolean; pulseOpacity:number; labelOpacity:number; arrival:number; linkIndex:number; energy:number; revealed:number;
}

export function journeyNodeReveal(elapsed:number,index:number) {
  return smooth((elapsed-index*JOURNEY_STAGE_SECONDS)/.35);
}

/** Construction never wraps. Only the light travelling on the completed route repeats. */
export function journeyFrame(elapsed:number,phases:readonly number[]):JourneyFrame {
  const empty={progress:0,builtProgress:0,index:0,travel:0,continuous:false,pulseOpacity:0,labelOpacity:0,arrival:0,linkIndex:0,energy:0,revealed:0};
  if(!phases.length)return empty;
  const time=Math.max(0,elapsed),lastStart=(phases.length-1)*JOURNEY_STAGE_SECONDS;
  const constructionEnd=lastStart+JOURNEY_HOLD_SECONDS;
  if(phases.length===1)return {...empty,progress:phases[0],builtProgress:phases[0],labelOpacity:1,revealed:1};
  if(time>constructionEnd){
    const after=time-constructionEnd;
    // Let the final construction highlight dissolve before the first full sweep.
    const progress=after<.6?phases[phases.length-1]:-.06+((after-.6)%JOURNEY_PULSE_SECONDS)/JOURNEY_PULSE_SECONDS*1.12;
    const pulseOpacity=after<.6?1-smooth(after/.6):smooth((progress+.06)/.035)*(1-smooth((progress-1.025)/.035));
    let index=0;
    for(let i=1;i<phases.length;i++)if(Math.abs(phases[i]-progress)<Math.abs(phases[index]-progress))index=i;
    const previous=index>0?phases[index]-phases[index-1]:1;
    const next=index<phases.length-1?phases[index+1]-phases[index]:1;
    const labelWidth=Math.min(.065,previous*.45,next*.45);
    return {progress,builtProgress:phases[phases.length-1],index,travel:1,continuous:true,pulseOpacity,
      labelOpacity:journeyIllumination(progress,phases[index],labelWidth)*pulseOpacity,
      arrival:0,linkIndex:Math.max(0,index-1),energy:pulseOpacity,revealed:phases.length};
  }
  const lightTime=time;
  const index=Math.min(phases.length-1,Math.floor((lightTime+1e-10)/JOURNEY_STAGE_SECONDS));
  const local=lightTime-index*JOURNEY_STAGE_SECONDS;
  const travel=index<phases.length-1?clamp((local-JOURNEY_HOLD_SECONDS)/JOURNEY_TRAVEL_SECONDS):0;
  const progress=phases[index]+((phases[index+1]??phases[index])-phases[index])*smooth(travel);
  const labelOpacity=1-smooth(travel/.18),arrival=Math.exp(-Math.max(0,local)*5);
  return {progress,
    builtProgress:time>=lastStart?phases[phases.length-1]:index===0?progress*smooth(time/.35):progress,
    index,travel,continuous:false,pulseOpacity:1,labelOpacity,arrival,
    linkIndex:travel>0?index:Math.max(0,index-1),
    energy:travel>0?Math.min(1,travel/.08):index>0?arrival:0,
    revealed:Math.max(0,Math.min(phases.length,Math.floor((time-.1)/JOURNEY_STAGE_SECONDS)+1)),
  };
}

/** A smooth, local brightness envelope, independent of caption ownership. */
export function journeyIllumination(progress:number,phase:number,width=.075) {
  return width>0?smooth(1-Math.abs(progress-phase)/width):0;
}
