/** Readable fictional agenda: large type, two columns, no real client data. */
export function createAppointmentCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1280;
  const c = canvas.getContext('2d')!;
  const rect = (x: number, y: number, w: number, h: number, fill: string, radius = 0) => {
    c.fillStyle = fill; c.beginPath(); c.roundRect(x,y,w,h,radius); c.fill();
  };
  const text = (value: string, x: number, y: number, size: number, color = '#e6eef4', bold = false) => {
    c.fillStyle = color; c.font = `${bold ? '700' : '400'} ${size}px Arial, sans-serif`; c.fillText(value,x,y);
  };
  rect(0,0,2048,1280,'#101b26'); rect(0,0,280,1280,'#1b2c3a');
  text('Studio',32,105,65,'#ffffff',true);
  ['Agenda','Clienti','Servizi'].forEach((item,i) => {
    const y=289+i*142;
    if(i===0)rect(18,y-66,244,105,'#365969',12);
    text(item,39,y,54,i===0?'#ffffff':'#c8d8e4',i===0);
  });
  text('Agenda',355,110,96,'#ffffff',true);
  text('Giovedì 5 novembre',355,185,53,'#d5e2eb');
  rect(1500,60,488,108,'#a4e1e0',12); text('+ Prenotazione',1535,132,51,'#102b33',true);
  const left=438,top=336,column=766,row=204;
  ['Giorgia','Elena'].forEach((name,i)=>text(name,left+30+i*column,292,65,'#ffffff',true));
  c.strokeStyle='#3b5264'; c.lineWidth=3;
  for(let i=0;i<=4;i++){
    const y=top+i*row;c.beginPath();c.moveTo(left,y);c.lineTo(1982,y);c.stroke();
    if(i<4)text(`${String(9+i).padStart(2,'0')}:00`,307,y+52,39,'#c3d4df');
  }
  c.beginPath();c.moveTo(left+column,244);c.lineTo(left+column,top+row*4);c.stroke();
  const bookings=[
    {column:0,y:352,name:'Sofia Rinaldi',service:'Trattamento viso',time:'09:00 – 10:30',status:'Confermato'},
    {column:1,y:557,name:'Alice Moretti',service:'Massaggio',time:'10:00 – 11:30',status:'Da confermare'},
    {column:0,y:760,name:'Emma Ferri',service:'Consulenza viso',time:'11:00 – 12:30',status:'Confermato'},
  ];
  bookings.forEach(b=>{
    const x=left+b.column*column+15;rect(x,b.y,column-30,355,'#2d4c5d',13);
    text(b.time,x+28,b.y+64,60,'#d0e4ec');
    text(b.name,x+28,b.y+157,96,'#ffffff',true);
    text(b.service,x+28,b.y+236,68,'#e3eef4');
    text(b.status,x+28,b.y+312,54,b.status==='Confermato'?'#a5efde':'#ffdf9c',true);
  });
  text('AGENDA DIMOSTRATIVA · DATI FITTIZI',355,1233,34,'#c2d3df');
  return canvas;
}
