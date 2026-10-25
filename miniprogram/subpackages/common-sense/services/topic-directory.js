function buildDirectory(body) {
  const points = Object.fromEntries(body.points.map((p) => [p.id, p]));
  const categories = Object.fromEntries(body.categories.map((c) => [c.id, c]));
  return body.directory.map((part) => ({
    id: part.id, title: part.title.replace("常识", ""),
    chapters: part.chapters.map((chapter, i) => ({
      id: `${part.id}-${i}`, title: chapter.title,
      sections: (chapter.sections && chapter.sections.length ? chapter.sections : [chapter]).map((section, j) => {
        const ids = section.pointId ? [section.pointId] : (categories[section.categoryId] || {}).pointIds || [];
        return { id: `${part.id}-${i}-${j}`, title: section.title, expanded: true,
          points: ids.filter((id) => points[id]).map((id) => ({
            id, title: points[id].title, summary: points[id].summary,
            tabs: points[id].tabs.map((t) => ({ id: t.id, title: t.title })),
          })) };
      }),
    })),
  }));
}
module.exports = { buildDirectory };
