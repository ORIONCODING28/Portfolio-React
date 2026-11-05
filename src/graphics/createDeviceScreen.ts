import { publicAsset } from '../domain/deployment.ts';
import * as THREE from 'three';

/** Curated views of Sfizi & Delizie, rather than full-page screenshots reduced to thumbnails. */
export function createDeviceScreen(phone: boolean, anisotropy: number, onChange: () => void) {
  const canvas = document.createElement('canvas');
  const width = phone ? 480 : 1280, height = phone ? 960 : 800;
  const scale = phone ? 3 : 2;
  canvas.width = width * scale; canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Screen canvas unavailable');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  const logo = new Image(), food = new Image();
  let disposed = false;
  function draw() {
    if (disposed || !ctx) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, width, height);
    const yellow = '#ffbf00', white = '#fffaf0', muted = '#ded7c8';
    const text = (value: string, x: number, y: number, size: number, color = white, weight = 700) => {
      ctx.fillStyle = color; ctx.font = `${weight} ${size}px "Space Grotesk", sans-serif`; ctx.fillText(value, x, y);
    };
    const panel = (x: number, y: number, w: number, h: number, color: string, radius = 18) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
    };
    const brand = (x: number, y: number, w: number, h: number) => {
      if (logo.complete && logo.naturalWidth) {
        const ratio = Math.min(w / logo.naturalWidth, h / logo.naturalHeight);
        ctx.drawImage(logo, x, y, logo.naturalWidth * ratio, logo.naturalHeight * ratio);
      } else text('Sfizi & Delizie', x, y + h * .75, phone ? 43 : 64, yellow);
    };
    if (phone) {
      text('9:41', 34, 43, 25);
      brand(26, 76, 428, 95);
      text('Il tuo menu.', 28, 255, 68);
      panel(28, 283, 230, 59, yellow, 13); text('Arancini', 48, 325, 39, '#15120b');
      panel(26, 367, 428, 258, '#242321', 18);
      if (food.complete && food.naturalWidth) {
        ctx.save(); ctx.beginPath(); ctx.roundRect(26, 367, 428, 258, 18); ctx.clip();
        const ratio = Math.max(428 / food.naturalWidth, 258 / food.naturalHeight);
        ctx.drawImage(food, 26 + (428 - food.naturalWidth * ratio) / 2, 367 + (258 - food.naturalHeight * ratio) / 2, food.naturalWidth * ratio, food.naturalHeight * ratio);
        ctx.restore();
      }
      text('Arancino', 28, 684, 49); text('al ragù', 28, 740, 49);
      text('3,00 €', 28, 810, 59, yellow);
      panel(329, 756, 125, 67, yellow, 14); text('+', 369, 807, 57, '#15120b');
      panel(26, 853, 428, 60, yellow, 13); text('Carrello', 46, 897, 38, '#15120b');
      panel(157, 937, 166, 5, white, 3);
    } else {
      brand(44, 26, 490, 105);
      text('Gestione ordini', 44, 242, 94);
        // The staff workspace: navigation, status filters, queue and selected order.
        panel(648, 43, 170, 70, yellow, 14); text('Ordini', 674, 91, 39, '#15120b');
        text('Prodotti', 852, 91, 38, muted); text('Categorie', 1040, 91, 38, muted);
        panel(40, 149, 1200, 2, '#38352e', 0);
        panel(40, 278, 157, 65, yellow, 14); text('Tutti', 80, 324, 39, '#15120b');
        panel(213, 278, 252, 65, '#242321', 14); text('Ricevuto', 242, 324, 39);
        panel(481, 278, 430, 65, '#242321', 14); text('In preparazione', 508, 324, 39);
        panel(927, 278, 313, 65, '#242321', 14); text('Pronto', 1003, 324, 39);
        const orders = [
          { number: '#101', status: 'Ricevuto', total: '6,00 €', color: yellow },
          { number: '#102', status: 'In preparazione', total: '4,00 €', color: '#f4c788' },
          { number: '#103', status: 'Pronto', total: '3,50 €', color: '#90d9a4' },
        ];
        orders.forEach((order, index) => {
          const y = 374 + index * 132;
          panel(40, y, 459, 115, index === 0 ? '#3a3015' : '#242321', 17);
          if (index === 0) panel(40, y + 21, 5, 73, yellow, 2);
          text(order.number, 66, y + 53, 55);
          text(order.total, 315, y + 53, 44, muted);
          text(order.status, 68, y + 94, 34, order.color);
        });
        panel(525, 374, 715, 379, '#242321', 20);
        text('Ordine #101', 558, 435, 57);
        text('Ricevuto', 1010, 433, 35, yellow);
        panel(558, 460, 649, 2, '#454039', 0);
        text('2 × Arancino al ragù', 558, 530, 54);
        text('Totale al ritiro', 558, 614, 43, muted);
        text('6,00 €', 992, 622, 66, yellow);
        panel(558, 662, 649, 65, yellow, 13);
        text('Metti in preparazione', 590, 708, 46, '#15120b');
    }
    texture.needsUpdate = true; onChange();
  }
  logo.onload = draw; food.onload = draw;
  logo.src = publicAsset('/assets/screens/sfizi-logo.png');
  if (phone) food.src = publicAsset('/assets/screens/sfizi-arancino.webp');
  draw();
  void document.fonts.ready.then(draw);
  return { texture, dispose() {
    disposed = true;
    logo.onload = null; food.onload = null; texture.dispose();
  } };
}
