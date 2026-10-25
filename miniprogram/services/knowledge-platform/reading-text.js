function readingPartValue(payload, fallbackText, part) {
  if (part === "text") return typeof payload.text === "string" ? payload.text : fallbackText;
  const item = String(part || "").match(/^items\/(\d+)$/);
  if (item) return Array.isArray(payload.items) ? payload.items[Number(item[1])] ?? null : null;
  const cell = String(part || "").match(/^rows\/(\d+)\/(\d+)$/);
  if (cell) return Array.isArray(payload.rows?.[Number(cell[1])])
    ? payload.rows[Number(cell[1])][Number(cell[2])] ?? null
    : null;
  return null;
}

function readingSelectorRange(value, selector) {
  if (typeof value !== "string" || !selector || typeof selector.quote !== "string" || !selector.quote.length) return null;
  const occurrence = Number(selector.occurrence);
  if (!Number.isInteger(occurrence) || occurrence < 1) return null;
  let start = -1;
  let cursor = 0;
  for (let count = 0; count < occurrence; count += 1) {
    start = value.indexOf(selector.quote, cursor);
    if (start < 0) return null;
    cursor = start + selector.quote.length;
  }
  return { start, end: start + selector.quote.length };
}

function projectTextRuns(payload, fallbackText, reading, part) {
  const value = readingPartValue(payload, fallbackText, part);
  if (typeof value !== "string") return [];
  const selections = [];
  if (reading?.heading?.part === part) {
    const range = readingSelectorRange(value, reading.heading);
    if (range) selections.push({ ...range, role: "heading", level: reading.heading.level });
  }
  for (const emphasis of reading?.emphasis || []) {
    if (emphasis?.part !== part || !["key", "boundary"].includes(emphasis.role)) continue;
    const range = readingSelectorRange(value, emphasis);
    if (range) selections.push({ ...range, role: emphasis.role, level: null });
  }
  selections.sort((left, right) => left.start - right.start || left.end - right.end);
  const accepted = [];
  for (const selection of selections) {
    if (accepted.some((item) => selection.start < item.end && item.start < selection.end)) continue;
    accepted.push(selection);
  }
  if (!accepted.length) return [{ text: value, role: "plain", level: null }];
  const runs = [];
  let cursor = 0;
  for (const selection of accepted) {
    if (selection.start > cursor) runs.push({ text: value.slice(cursor, selection.start), role: "plain", level: null });
    runs.push({ text: value.slice(selection.start, selection.end), role: selection.role, level: selection.level });
    cursor = selection.end;
  }
  if (cursor < value.length) runs.push({ text: value.slice(cursor), role: "plain", level: null });
  return runs;
}

module.exports = { projectTextRuns, readingSelectorRange };
