/** Resume existing scenes after page-cache navigation or GPU context restoration. */
export function bindSceneRecovery(canvas: EventTarget, resume: () => void, page: EventTarget = window): () => void {
  const lost = (event: Event) => {
    event.preventDefault(); // Allow the browser to restore this WebGL context.
    resume(); // The scene cancels its loop while the context is lost.
  };
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', resume);
  page.addEventListener('pageshow', resume);
  page.addEventListener('focus', resume);
  return () => {
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', resume);
    page.removeEventListener('pageshow', resume);
    page.removeEventListener('focus', resume);
  };
}
