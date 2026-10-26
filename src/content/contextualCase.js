// Keep every real asset once, beside the part of the story it supports.
// Specific captures may supply explicit rows; existing galleries keep their order.
export function contextualCase(p) {
  const sections = ['problem', 'process', 'decisions', 'impact'];
  if (p.media.length === 1) {
    return { ...p, leadMode: 'identity', leadSections: sections, chapters: [] };
  }
  if (p.contextRows) return { ...p, leadSections: [], chapters: p.contextRows.map(c => ({ ...c, contextual: true })) };
  const leadSections = p.leadMode === 'identity' ? ['problem'] : [];
  const remaining = sections.filter(s => !leadSections.includes(s));
  const groups = p.chapters.filter(c => c.media.length);
  let cursor = 0;
  const chapters = groups.map((group, i) => {
    const divide = leadSections.length ? Math.floor : Math.ceil;
    const count = divide((remaining.length - cursor) / (groups.length - i));
    const row = { ...group, title: null, sections: remaining.slice(cursor, cursor + count), contextual: true };
    cursor += count;
    return row;
  });
  return { ...p, leadSections, chapters };
}
