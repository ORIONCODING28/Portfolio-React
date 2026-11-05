import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const objectNames = ['Chiave a pappagallo', 'Diploma', 'Ingranaggio', 'Cazzuola', 'Libro tecnico', 'Mappa del Verismo', 'MacBook Pro'] as const;
export function createProfileObject(index: number, accent: T.MeshStandardMaterial): T.Group {
  const root = new T.Group();
  const steel = new T.MeshStandardMaterial({ color: 0x9ba7b0, metalness: .93, roughness: .27 });
  const edge = new T.MeshStandardMaterial({ color: 0x46515b, metalness: .9, roughness: .33 });
  const paper = new T.MeshStandardMaterial({ color: 0xf0e7d2, roughness: .89, side: T.DoubleSide });
  const wood = new T.MeshStandardMaterial({ color: 0x75482d, roughness: .48 });
  const mesh = (g: T.BufferGeometry, m: T.Material, parent: T.Object3D = root) => { const value = new T.Mesh(g, m); parent.add(value); return value; };
  const box = (w: number, h: number, d: number, r: number, m: T.Material, x = 0, y = 0, z = 0, parent: T.Object3D = root) => { const v = mesh(new RoundedBoxGeometry(w, h, d, 4, r), m, parent); v.position.set(x, y, z); return v; };
  const cylinder = (r1: number, r2: number, h: number, m: T.Material, x = 0, y = 0, z = 0) => { const v = mesh(new T.CylinderGeometry(r1, r2, h, 48), m); v.position.set(x, y, z); return v; };
  const tube = (points: number[][], radius: number, m: T.Material, parent: T.Object3D = root, closed = false) => mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p as [number, number, number])), closed), 48, radius, 12, closed), m, parent);
  const extrude = (shape: T.Shape, depth: number, m: T.Material, bevel = .035) => mesh(new T.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 36 }), m);
  if (index === 1) {
    // A rigid diploma portfolio, rather than a rolled scroll.
    const folder = new T.MeshStandardMaterial({ color: 0x152d40, roughness: .57, metalness: .12 });
    box(2.1, 2.7, .095, .055, folder, 0, 0, -.08);
    box(1.92, 2.5, .025, .012, paper, 0, 0, -.015);
    const sheet = document.createElement('canvas'); sheet.width = 768; sheet.height = 1024; const ctx = sheet.getContext('2d')!;
    ctx.fillStyle = '#f3eddf'; ctx.fillRect(0, 0, 768, 1024); ctx.strokeStyle = '#b19b65'; ctx.lineWidth = 3; ctx.strokeRect(42, 42, 684, 940);
    ctx.textAlign = 'center'; ctx.fillStyle = '#1d3445'; ctx.font = 'bold 57px serif'; ctx.fillText('DIPLOMA', 384, 230); ctx.font = '30px sans-serif'; ctx.fillText('DI MATURITÀ', 384, 290);
    ctx.font = 'bold 39px serif'; ctx.fillText('Giuseppe Cairone', 384, 465); ctx.font = '28px sans-serif'; ctx.fillText('Manutenzione e', 384, 555); ctx.fillText('assistenza tecnica', 384, 600); ctx.font = 'bold 43px serif'; ctx.fillText('2018', 384, 800);
    const texture = new T.CanvasTexture(sheet); texture.colorSpace = T.SRGBColorSpace;
    const front = mesh(new T.PlaneGeometry(1.91, 2.49), new T.MeshBasicMaterial({ map: texture, toneMapped: false })); front.position.z = .004;
    // Small corner retainers and a narrow spine add depth without covering the text.
    for (const x of [-.88, .88]) for (const y of [-1.16, 1.16]) box(.17, .17, .025, .01, folder, x, y, .025);
    box(.1, 2.68, .14, .035, folder, -1.02, 0, -.075);
    root.rotation.set(-.04, -.24, -.08);
  } else if (index === 2) {
    const shape = new T.Shape();
    for (let i = 0; i < 112; i++) { const a = i / 112 * Math.PI * 2, r = i % 8 < 2 || i % 8 > 5 ? 1.12 : .96; const x = Math.cos(a) * r, y = Math.sin(a) * r; if (i) shape.lineTo(x, y); else shape.moveTo(x, y); } shape.closePath();
    const hole = new T.Path(); hole.absarc(0, 0, .36, 0, Math.PI * 2, true); shape.holes.push(hole);
    const gear = extrude(shape, .28, steel, .028); gear.position.z = -.14;
    const hub = mesh(new T.TorusGeometry(.43, .085, 16, 80), edge); hub.position.z = .19;
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const bolt = cylinder(.055, .055, .045, edge, Math.cos(a) * .69, Math.sin(a) * .69, .2); bolt.rotation.x = Math.PI / 2; }
    root.rotation.set(.18, -.4, -.12);
  } else if (index === 3) {
    const blade = new T.Shape(); blade.moveTo(0, -1.37); blade.quadraticCurveTo(.025, -1.37, .055, -1.29); blade.lineTo(.79, .4); blade.quadraticCurveTo(.87, .62, .62, .62); blade.lineTo(-.62, .62); blade.quadraticCurveTo(-.87, .62, -.79, .4); blade.lineTo(-.055, -1.29); blade.quadraticCurveTo(-.025, -1.37, 0, -1.37); blade.closePath();
    const steelBlade = extrude(blade, .025, steel, .018); steelBlade.rotation.x = -Math.PI / 2; steelBlade.position.y = -.4;
    tube([[0, -.36, .05], [0, -.24, .23], [0, .1, .32], [0, .25, -.1]], .048, edge);
    const points = [new T.Vector2(0, -.56), new T.Vector2(.11, -.56), new T.Vector2(.15, -.5), new T.Vector2(.16, -.26), new T.Vector2(.145, .23), new T.Vector2(.12, .5), new T.Vector2(.07, .56), new T.Vector2(0, .56)];
    const handle = mesh(new T.LatheGeometry(points, 56), wood); handle.rotation.x = Math.PI / 2; handle.position.set(0, .29, -.51);
    for (let i = 0; i < 8; i++) { const line = mesh(new T.TorusGeometry(.148, .004, 6, 48), edge); line.position.set(0, .29, -.92 + i * .11); }
    root.rotation.set(.42, -.55, -.28);
  } else if (index === 4) {
    const cover = new T.MeshStandardMaterial({ color: 0x183448, roughness: .45, metalness: .15 });
    for (const sign of [-1, 1]) {
      const half = new T.Group(); root.add(half); half.rotation.z = sign * .16;
      box(1.3, .08, 1.85, .035, cover, sign * .66, -.13, 0, half);
      box(1.24, .16, 1.76, .025, paper, sign * .64, -.015, 0, half);
      for (let i = 0; i < 8; i++) box(1.22, .004, 1.73, .001, new T.MeshStandardMaterial({ color: i % 2 ? 0xd0c7b4 : 0xf6efdf, roughness: .95 }), sign * .64, -.07 + i * .018, 0, half);
      const page = document.createElement('canvas'); page.width = 768; page.height = 1024; const ctx = page.getContext('2d')!;
      ctx.fillStyle = '#f1ecdf'; ctx.fillRect(0, 0, 768, 1024);
      ctx.fillStyle = '#607079'; ctx.font = '30px monospace'; ctx.fillText(sign < 0 ? 'diploma.c' : 'main.c', 50, 62); ctx.strokeStyle = '#c7c4b8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 91); ctx.lineTo(718, 91); ctx.stroke();
      const lines = sign < 0
        ? ['#include <stdio.h>', '', 'int diploma(int voto)', '{', '    return voto;', '}']
        : ['int main(void)', '{', '  int voto =', '    diploma(97);', '', '  printf("Diplomato\\n");', '  printf(', '    "Voto: %d/110\\n",', '    voto', '  );', '    return 0;', '}'];
      ctx.font = 'bold 42px monospace';
      lines.forEach((line, i) => { ctx.fillStyle = /#include|int |return/.test(line) ? '#62416e' : line.includes('"') ? '#276253' : '#203547'; ctx.fillText(line, 50, 162 + i * 65); });
      const texture = new T.CanvasTexture(page); texture.colorSpace = T.SRGBColorSpace;
      const surface = mesh(new T.PlaneGeometry(1.21, 1.73), new T.MeshBasicMaterial({ map: texture, toneMapped: false }), half); surface.rotation.x = -Math.PI / 2; surface.position.set(sign * .64, .102, 0);
    }
    box(.11, .24, 1.9, .04, cover, 0, -.04); root.rotation.set(.95, -.1, -.025);
  } else if (index === 5) {
    const map = document.createElement('canvas'); map.width = 1536; map.height = 768; const ctx = map.getContext('2d')!;
    ctx.fillStyle = '#e8e2d2'; ctx.fillRect(0, 0, 1536, 768);
    ctx.fillStyle = '#b2c5a5'; ctx.fillRect(120, 110, 310, 220); ctx.fillRect(920, 420, 350, 200); ctx.fillRect(600, 120, 260, 220);
    ctx.strokeStyle = '#fffaf0'; ctx.lineWidth = 25; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * 220, 0); ctx.lineTo(i * 220 + 150, 768); ctx.stroke(); } for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, i * 210); ctx.lineTo(1536, i * 210 + 100); ctx.stroke(); }
    ctx.strokeStyle = '#3c849b'; ctx.lineWidth = 10; ctx.setLineDash([20, 14]); ctx.beginPath(); ctx.moveTo(160, 590); ctx.bezierCurveTo(470, 680, 580, 130, 1160, 200); ctx.stroke();
    const texture = new T.CanvasTexture(map); texture.colorSpace = T.SRGBColorSpace;
    // One continuous sheet: shared vertices keep the accordion folds connected.
    const geometry = new T.PlaneGeometry(2.7, 1.9, 12, 4), positions = geometry.getAttribute('position'), colours: number[] = [];
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i); const fold = x < -.45 ? (x + 1.35) * .13 : x < .45 ? .117 - (x + .45) * .13 : (x - .45) * .13;
      positions.setZ(i, fold); const shade = x < -.45 || x > .45 ? .94 : 1; colours.push(shade, shade, shade);
    }
    geometry.setAttribute('color', new T.Float32BufferAttribute(colours, 3)); geometry.computeVertexNormals();
    const sheet = mesh(geometry, new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide, vertexColors: true, toneMapped: false })); sheet.rotation.x = -Math.PI / 2;
    const pin = new T.Shape(); pin.moveTo(0, -.42); pin.bezierCurveTo(-.15, -.23, -.29, -.02, -.29, .17); pin.absarc(0, .17, .29, Math.PI, 0, true); pin.bezierCurveTo(.29, -.02, .15, -.23, 0, -.42); pin.closePath(); const center = new T.Path(); center.absarc(0, .18, .105, 0, Math.PI * 2, true); pin.holes.push(center);
    const marker = extrude(pin, .08, accent, .018); marker.position.set(.29, .7, 0); root.rotation.set(.55, -.18, -.05);
  }
  return root;
}
