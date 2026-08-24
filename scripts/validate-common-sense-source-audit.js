const fs = require('fs');
const path = require('path');
const commonSense = require('../miniprogram/models/note-common-sense/index');

const auditDirectory = path.resolve(__dirname, '../docs/common-sense-source-audit');
const detailTemplate = path.resolve(__dirname, '../miniprogram/subpackages/common-sense/detail/index.wxml');

function normalize(value) {
  return String(value ?? '').replace(/\s+/g, '');
}

function sameText(left, right) {
  return normalize(left) === normalize(right);
}

function splitFillAnswers(answer) {
  return String(answer || '').split(/[；;、，,\/]+/).map((item) => item.trim()).filter((item) => item && item !== '—');
}

function getBlocks(point) {
  return (point.tabs || []).flatMap((tab) => tab.blocks || []);
}

function normalizePathSegment(value) {
  return String(value ?? '').replace(/[\s、，,。．·：:（）()《》]/g, '');
}

function routeTitle(item) {
  if (typeof item === 'string') return item;
  return item?.label || item?.title || '';
}

function collectPublishedPoints(problems) {
  const categoryById = new Map((commonSense.categories || []).map((category) => [category.id, category]));
  const published = new Map();

  (commonSense.directory || []).forEach((part) => {
    (part.chapters || []).forEach((chapter) => {
      (chapter.sections || []).forEach((section) => {
        const category = section.categoryId ? categoryById.get(section.categoryId) : null;
        if (section.categoryId && !category) problems.push(`directory: missing section category ${section.categoryId}`);
        const pointIds = section.pointId ? [section.pointId] : (category?.pointIds || []);
        if (!pointIds.length) problems.push(`directory: ${part.order} ${chapter.order} ${section.order} has no published small sections`);
        const officialPrefix = [
          `${part.order} ${part.title}`,
          `${chapter.order} ${chapter.title}`,
          `${section.order} ${section.title}`,
        ];
        pointIds.forEach((pointId) => {
          if (published.has(pointId)) {
            problems.push(`directory: point ${pointId} is published under more than one section`);
            return;
          }
          published.set(pointId, officialPrefix);
        });
      });
    });
  });

  return published;
}

function main() {
  const files = fs.readdirSync(auditDirectory).filter((file) => file.endsWith('.json')).sort();
  const problems = [];
  const summaries = [];
  const publishedPoints = collectPublishedPoints(problems);
  const auditCounts = new Map();

  const detailTemplateText = fs.readFileSync(detailTemplate, 'utf8');
  if (!detailTemplateText.includes('源文所有填空补全内容均为重点')) {
    problems.push('detail page: missing the global explanation that every source fill completion is a key point');
  }

  files.forEach((file) => {
    const audit = JSON.parse(fs.readFileSync(path.join(auditDirectory, file), 'utf8'));
    auditCounts.set(audit.pointId, (auditCounts.get(audit.pointId) || 0) + 1);
    const point = commonSense.points.find((item) => item.id === audit.pointId);
    if (!point) {
      problems.push(`${file}: missing point ${audit.pointId}`);
      return;
    }

    if (!Array.isArray(audit.officialPath) || audit.officialPath.length !== 4) {
      problems.push(`${audit.pointId}: official path must contain exactly 篇、章、节、小节`);
    }
    const expectedPathPrefix = publishedPoints.get(audit.pointId);
    if (!expectedPathPrefix) {
      problems.push(`${audit.pointId}: audited point is not published in the directory`);
    } else if (expectedPathPrefix.some((segment, index) => normalizePathSegment(segment) !== normalizePathSegment(audit.officialPath?.[index]))) {
      problems.push(`${audit.pointId}: official 篇、章、节 path differs from the directory`);
    }

    const route = (point.readingMeta?.route || []).map(routeTitle);
    const tabTitles = (point.tabs || []).map((tab) => tab.title || '');
    if (JSON.stringify(route.map(normalize)) !== JSON.stringify(tabTitles.map(normalize))) {
      problems.push(`${audit.pointId}: reading route must exactly match the tab titles and order`);
    }

    const blocks = getBlocks(point);
    const pointSourceIds = new Set(point.sourceUnitIds || []);
    let mappedUnits = 0;
    let tableRows = 0;
    let tableCells = 0;
    let listItems = 0;
    let mappedKnowledgeGuides = 0;
    let knowledgeSubsections = 0;
    let subdivisionChildItems = 0;
    let anchoredKnowledgeSubdivisions = 0;
    let images = 0;

    audit.contentUnits.forEach((unit) => {
      if (unit.type === 'heading') {
        if (pointSourceIds.has(unit.id)) mappedUnits += 1;
        else problems.push(`${audit.pointId}: heading ${unit.id} is not mapped to the point`);
        return;
      }

      if (!['table', 'list', 'image'].includes(unit.type)) {
        problems.push(`${audit.pointId}: unsupported source unit type ${unit.type} for ${unit.id}`);
        return;
      }
      const block = blocks.find((item) => (item.sourceUnitIds || []).includes(unit.id));
      if (!block) {
        problems.push(`${audit.pointId}: ${unit.type} ${unit.id} has no mapped block`);
        return;
      }
      mappedUnits += 1;
      const expectedBlockType = unit.type === 'image' ? 'image-note' : unit.type;
      if (block.type !== expectedBlockType) problems.push(`${audit.pointId}: ${unit.id} must map to a ${expectedBlockType} block`);
      if (!sameText(block.label, unit.label)) problems.push(`${audit.pointId}: ${unit.id} label differs from source`);
      if (unit.type === 'image') {
        if (!sameText(block.title, unit.title)) problems.push(`${audit.pointId}: ${unit.id} image title differs from source`);
        if (block.src !== unit.src) problems.push(`${audit.pointId}: ${unit.id} image source differs from audit`);
        if (!sameText(block.description, unit.description)) problems.push(`${audit.pointId}: ${unit.id} image description differs from audit`);
        images += 1;
      }
      if (unit.type === 'table') {
        if (JSON.stringify(block.columns || []) !== JSON.stringify(unit.columns || [])) problems.push(`${audit.pointId}: ${unit.id} columns differ from source`);
        if (JSON.stringify(block.rows || []) !== JSON.stringify(unit.rows || [])) problems.push(`${audit.pointId}: ${unit.id} rows differ from source`);
        if (JSON.stringify(block.headerMergedCells || []) !== JSON.stringify(unit.headerMergedCells || [])) problems.push(`${audit.pointId}: ${unit.id} header merged cells differ from source`);
        if (JSON.stringify(block.mergedCells || []) !== JSON.stringify(unit.mergedCells || [])) problems.push(`${audit.pointId}: ${unit.id} merged cells differ from source`);
        const headerMergedCellReduction = (unit.headerMergedCells || []).reduce((sum, cell) => {
          const column = Number(cell.column);
          const columnSpan = Number(cell.columnSpan || 1);
          if (!Number.isInteger(column) || column < 0 || column >= (unit.columns || []).length || !Number.isInteger(columnSpan) || columnSpan < 1 || column + columnSpan > (unit.columns || []).length) {
            problems.push(`${audit.pointId}: ${unit.id} header merged cell span is invalid`);
            return sum;
          }
          return sum + columnSpan - 1;
        }, 0);
        const mergedCellReduction = (unit.mergedCells || []).reduce((sum, cell) => {
          const row = Number(cell.row);
          const column = Number(cell.column);
          const rowSpan = Number(cell.rowSpan || 1);
          const columnSpan = Number(cell.columnSpan || 1);
          if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || column < 0 || row >= (unit.rows || []).length || column >= (unit.columns || []).length) {
            problems.push(`${audit.pointId}: ${unit.id} merged cell origin is invalid`);
            return sum;
          }
          if (!Number.isInteger(rowSpan) || !Number.isInteger(columnSpan) || rowSpan < 1 || columnSpan < 1 || row + rowSpan > (unit.rows || []).length || column + columnSpan > (unit.columns || []).length) {
            problems.push(`${audit.pointId}: ${unit.id} merged cell span is invalid`);
            return sum;
          }
          return sum + rowSpan * columnSpan - 1;
        }, 0);
        tableRows += (unit.rows || []).length;
        tableCells += (unit.columns || []).length + (unit.rows || []).reduce((sum, row) => sum + row.length, 0) - headerMergedCellReduction - mergedCellReduction;
      }
      if (unit.type === 'list') {
        const expectedItems = unit.displayItems || unit.items || [];
        if (JSON.stringify(block.items || []) !== JSON.stringify(expectedItems)) problems.push(`${audit.pointId}: ${unit.id} items differ from audited display text`);
        if (JSON.stringify(block.subsections || []) !== JSON.stringify(unit.subsections || [])) problems.push(`${audit.pointId}: ${unit.id} knowledge-point subdivisions differ from audit`);
        const requiredHeadingIndexes = expectedItems
          .map((item, itemIndex) => ({ text: String(item || '').trim(), itemIndex }))
          .filter(({ text }) => /[：:]$/.test(text) || /(主要制度|重要制度)$/.test(text))
          .map(({ itemIndex }) => itemIndex);
        const auditedHeadingIndexes = new Set((unit.subsections || []).map((subsection) => Number(subsection.headingIndex)));
        requiredHeadingIndexes.forEach((headingIndex) => {
          if (!auditedHeadingIndexes.has(headingIndex)) problems.push(`${audit.pointId}: ${unit.id} standalone heading at ${headingIndex} is rendered as a peer item`);
        });
        const claimedChildIndexes = new Set();
        (unit.subsections || []).forEach((subsection) => {
          knowledgeSubsections += 1;
          const headingIndex = Number(subsection.headingIndex);
          const childIndexes = subsection.childIndexes || [];
          subdivisionChildItems += childIndexes.length;
          if (!Number.isInteger(headingIndex) || headingIndex < 0 || headingIndex >= expectedItems.length) problems.push(`${audit.pointId}: ${unit.id} subdivision heading index is invalid`);
          if (!childIndexes.length) problems.push(`${audit.pointId}: ${unit.id} subdivision at ${headingIndex} has no children`);
          childIndexes.forEach((childIndex) => {
            if (!Number.isInteger(childIndex) || childIndex <= headingIndex || childIndex >= expectedItems.length) problems.push(`${audit.pointId}: ${unit.id} subdivision child index ${childIndex} is invalid`);
            if (claimedChildIndexes.has(childIndex)) problems.push(`${audit.pointId}: ${unit.id} subdivision child index ${childIndex} is claimed more than once`);
            claimedChildIndexes.add(childIndex);
          });
        });
        listItems += (unit.items || []).length;
      }
    });

    const knowledgePointIds = audit.knowledgePointIds || [];
    const anchoredKnowledgePoints = audit.knowledgePoints || [];
    const knowledgeUnits = new Map(
      anchoredKnowledgePoints.length
        ? anchoredKnowledgePoints.map((unit) => [unit.id, unit])
        : audit.contentUnits.filter((unit) => knowledgePointIds.includes(unit.id)).map((unit) => [unit.id, unit])
    );
    const guides = point.readingMeta?.focus || [];

    anchoredKnowledgePoints.forEach((knowledgePoint) => {
      const sourceUnit = audit.contentUnits.find((unit) => unit.id === knowledgePoint.sourceUnitId);
      const row = Number(knowledgePoint.row);
      const column = Number(knowledgePoint.column);
      if (!sourceUnit || sourceUnit.type !== 'table') {
        problems.push(`${audit.pointId}: anchored knowledge point ${knowledgePoint.id} has no source table`);
        return;
      }
      if (knowledgePoint.header === true) {
        if (!Number.isInteger(column) || column < 0 || column >= (sourceUnit.columns || []).length) {
          problems.push(`${audit.pointId}: anchored knowledge point ${knowledgePoint.id} has an invalid table-header anchor`);
          return;
        }
        if (!sameText(knowledgePoint.label, sourceUnit.columns[column])) {
          problems.push(`${audit.pointId}: anchored knowledge point ${knowledgePoint.id} label differs from its source header`);
        }
        return;
      }
      if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || column < 0 || row >= (sourceUnit.rows || []).length || column >= (sourceUnit.columns || []).length) {
        problems.push(`${audit.pointId}: anchored knowledge point ${knowledgePoint.id} has an invalid table-cell anchor`);
        return;
      }
      if (!sameText(knowledgePoint.label, sourceUnit.rows[row][column])) {
        problems.push(`${audit.pointId}: anchored knowledge point ${knowledgePoint.id} label differs from its source cell`);
      }
      (knowledgePoint.subdivisions || []).forEach((subdivision) => {
        const subdivisionRow = Number(subdivision.row);
        const subdivisionColumn = Number(subdivision.column);
        anchoredKnowledgeSubdivisions += 1;
        if (!Number.isInteger(subdivisionRow) || !Number.isInteger(subdivisionColumn) || subdivisionRow < 0 || subdivisionColumn < 0 || subdivisionRow >= (sourceUnit.rows || []).length || subdivisionColumn >= (sourceUnit.columns || []).length) {
          problems.push(`${audit.pointId}: knowledge-point subdivision under ${knowledgePoint.id} has an invalid table-cell anchor`);
          return;
        }
        if (!sameText(subdivision.label, sourceUnit.rows[subdivisionRow][subdivisionColumn])) {
          problems.push(`${audit.pointId}: knowledge-point subdivision under ${knowledgePoint.id} differs from its source cell`);
        }
      });
    });

    if (knowledgeUnits.size !== knowledgePointIds.length) {
      problems.push(`${audit.pointId}: knowledgePointIds contains an unknown or duplicate source unit`);
    }
    if (guides.length !== knowledgePointIds.length) {
      problems.push(`${audit.pointId}: ${knowledgePointIds.length} knowledge points require exactly ${knowledgePointIds.length} guide summaries, found ${guides.length}`);
    }

    knowledgePointIds.forEach((knowledgePointId) => {
      const unit = knowledgeUnits.get(knowledgePointId);
      const matchingGuides = guides.filter((guide) => (guide.sourceUnitIds || []).includes(knowledgePointId));
      if (matchingGuides.length !== 1) {
        problems.push(`${audit.pointId}: knowledge point ${knowledgePointId} must map to exactly one guide summary`);
        return;
      }
      const guide = matchingGuides[0];
      if ((guide.sourceUnitIds || []).length !== 1) {
        problems.push(`${audit.pointId}: guide ${guide.label || knowledgePointId} must summarize one knowledge point independently`);
      }
      if (!sameText(guide.label, unit?.label)) {
        problems.push(`${audit.pointId}: guide label for ${knowledgePointId} differs from the source knowledge-point label`);
      }
      if (!guide.note || normalize(guide.note).length < 12 || sameText(guide.note, guide.label)) {
        problems.push(`${audit.pointId}: guide for ${knowledgePointId} is missing an effective memory summary`);
        return;
      }
      mappedKnowledgeGuides += 1;
    });

    if (!(point.readingMeta?.review || []).length) {
      problems.push(`${audit.pointId}: point is missing its global 30-second review`);
    }
    if (point.readingMeta?.reviewTab || point.readingMeta?.reviewByTab) {
      problems.push(`${audit.pointId}: 30-second review must be global and cannot be bound or split by tab`);
    }

    const expectedFillHighlights = (audit.fillCompletions || []).flatMap((item) => splitFillAnswers(item.answer));
    expectedFillHighlights.forEach((answer) => {
      const mappedAsHighlight = blocks.some((block) => JSON.stringify(block).includes(answer) && (block.highlights || []).includes(answer));
      if (!mappedAsHighlight) problems.push(`${audit.pointId}: filled answer is not highlighted in its displayed content: ${answer}`);
    });

    summaries.push({
      pointId: audit.pointId,
      sourcePages: audit.source.pages,
      sourceUnits: audit.contentUnits.length,
      mappedUnits,
      tableRows,
      tableCells,
      listItems,
      knowledgePoints: knowledgePointIds.length,
      mappedKnowledgeGuides,
      knowledgeSubsections,
      subdivisionChildItems,
      anchoredKnowledgeSubdivisions,
      images,
    });
  });

  (commonSense.points || []).forEach((point) => {
    if (!publishedPoints.has(point.id)) problems.push(`${point.id}: current small section is not published in the directory`);
    const auditCount = auditCounts.get(point.id) || 0;
    if (auditCount !== 1) problems.push(`${point.id}: requires exactly one source audit, found ${auditCount}`);
  });
  publishedPoints.forEach((_officialPrefix, pointId) => {
    if (!(commonSense.points || []).some((point) => point.id === pointId)) problems.push(`directory: published point ${pointId} does not exist`);
  });

  console.log(JSON.stringify(process.argv.includes('--problems-only') ? { problems } : { audits: summaries, problems }, null, 2));
  if (problems.length) process.exit(1);
}

main();
