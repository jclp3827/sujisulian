// Touch coordinates are CanvasTouch x/y in CSS pixels. Geometry still comes
// from the existing processor; no second crop/encode implementation is used.
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
function points(touches) {
  return Array.from(touches || []).slice(0, 2).map(t => ({ id: t.identifier, x: t.x, y: t.y }))
    .filter(t => Number.isFinite(t.x) && Number.isFinite(t.y))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}
function center(p) { return p.length === 1 ? p[0] : { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 }; }
function distance(p) { return p.length === 2 ? Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y) : 0; }
function begin(touches, state, viewport, processor, source) {
  const p = points(touches);
  if (!p.length || viewport.width <= 0 || viewport.height <= 0) return null;
  return { points: p, state: Object.assign({}, state), viewport,
    rect: processor.cropRect(source.width, source.height, { zoom: state.zoom / 100, x: state.cropX / 100, y: state.cropY / 100 }) };
}
function move(gesture, touches, processor, source, maxZoom) {
  const p = points(touches);
  if (!gesture || !p.length) return null;
  if (p.length !== gesture.points.length || p.some((t, i) => t.id !== gesture.points[i].id)) return { rebase: true };
  const oldCenter = center(gesture.points), current = center(p), view = gesture.viewport;
  const oldDistance = distance(gesture.points);
  const zoom = clamp(gesture.state.zoom * (oldDistance > 1 ? distance(p) / oldDistance : 1), 100, maxZoom);
  const rect = processor.cropRect(source.width, source.height, { zoom: zoom / 100 });
  // Keep the source point beneath the initial centroid under the moving fingers.
  const anchorX = gesture.rect.x + oldCenter.x / view.width * gesture.rect.width;
  const anchorY = gesture.rect.y + oldCenter.y / view.height * gesture.rect.height;
  const rangeX = source.width - rect.width, rangeY = source.height - rect.height;
  return { zoom,
    cropX: rangeX > 0.000001 ? clamp((anchorX - current.x / view.width * rect.width) / rangeX * 100, 0, 100) : 50,
    cropY: rangeY > 0.000001 ? clamp((anchorY - current.y / view.height * rect.height) / rangeY * 100, 0, 100) : 50 };
}
module.exports = { begin, move };
