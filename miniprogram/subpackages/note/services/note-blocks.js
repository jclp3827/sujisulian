const {fingerprint}=require('./learning-content');
const {isCloudNoteAsset}=require('./note-assets');
const CLOUD_IMG_PREFIX='https://636c-cloud1-d8gw5r2il0c0f198a-1317757209.tcb.qcloud.la/note-resources/';
const THEME_GREEN='#33c47a',WARNING_ORANGE='#d97706';
function getReadingReview(readingMeta) {
  if (!readingMeta) return []
  return readingMeta.review || []
}

function shouldUseAssetPrefix(src) {
  return src &&
    !src.startsWith('http://') &&
    !src.startsWith('https://') &&
    !src.startsWith('cloud://') &&
    !src.startsWith('/') &&
    !src.startsWith('./') &&
    !src.startsWith('../') &&
    !isCloudNoteAsset(src)
}

function decorateMindMapNodes(nodes, depth = 1) {
  return (nodes || []).map((node) => {
    const children = decorateMindMapNodes(node.children, depth + 1)
    let image = node.image
    if (node.image && isCloudNoteAsset(node.image.src)) {
      image = { ...node.image, originalSrc: node.image.src, src: '', isResolvingImage: true }
    } else if (node.image && shouldUseAssetPrefix(node.image.src)) {
      image = { ...node.image, src: CLOUD_IMG_PREFIX + node.image.src }
    }

    return {
      ...node,
      image,
      pointEntries: decorateTextEntries(node.points, node.highlights, node.warningHighlights),
      children,
      hasChildren: children.length > 0,
      isCollapsed: depth >= 3,
    }
  })
}

function setMindMapNodesCollapseDeep(nodes, collapsed) {
  return (nodes || []).map((node) => ({
    ...node,
    isCollapsed: collapsed,
    children: setMindMapNodesCollapseDeep(node.children, collapsed),
  }))
}

function resetMindMapChildrenDefault(nodes, depth = 1) {
  return (nodes || []).map((node) => ({
    ...node,
    isCollapsed: depth >= 3,
    children: resetMindMapChildrenDefault(node.children, depth + 1),
  }))
}

function decorateFormulaBlock(block) {
  if (block.type !== "formula" || !block.content) return block
  const parts = String(block.content).split(/。(.+)?/).filter(Boolean)
  const content = parts[0] || ""
  const description = parts.length > 1 ? parts.slice(1).join("。") : ""
  const hasSemicolon = content.includes("；")
  return {
    ...block,
    content,
    description: description || block.description || "",
    contentLines: hasSemicolon ? content.split(/；/).map((s) => s.trim()).filter(Boolean) : null,
  }
}

function stripHtml(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHighlightedRichText(value, highlights = [], warningHighlights = []) {
  const text = String(value ?? '')
  const tokens = []
  ;(highlights || []).forEach((word) => word && tokens.push({ word: String(word), color: THEME_GREEN }))
  ;(warningHighlights || []).forEach((word) => word && tokens.push({ word: String(word), color: WARNING_ORANGE }))
  if (!tokens.length) return null
  const unique = []
  const seen = new Set()
  tokens.sort((a, b) => b.word.length - a.word.length).forEach((token) => {
    if (!seen.has(token.word)) {
      seen.add(token.word)
      unique.push(token)
    }
  })
  const pattern = unique.map((token) => token.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  if (!pattern) return null
  const tokenMap = new Map(unique.map((token) => [token.word, token]))
  return text.split(new RegExp(`(${pattern})`, 'g')).map((part) => {
    const token = tokenMap.get(part)
    return token
      ? `<span style="color:${token.color};font-weight:700;">${escapeHtml(part)}</span>`
      : escapeHtml(part)
  }).join('')
}

function decorateTextEntries(items, blockHighlights = [], blockWarningHighlights = []) {
  return (items || []).map((item) => {
    const isObject = item && typeof item === 'object' && !Array.isArray(item)
    const text = isObject ? item.text : item
    const highlights = isObject ? (item.highlights || blockHighlights) : blockHighlights
    const warningHighlights = isObject ? (item.warningHighlights || blockWarningHighlights) : blockWarningHighlights
    return {
      text: String(text ?? ''),
      richText: buildHighlightedRichText(text, highlights, warningHighlights),
    }
  })
}

function stripRepeatedHierarchyPrefix(entry) {
  const prefixPattern = /^\s*(?:[（(]\s*(?:\d+(?:\.\d+)*|[一二三四五六七八九十]+)\s*[）)]|\d+(?:\.\d+)+(?=\s)|\d+[.、．]|[一二三四五六七八九十]+[.、．])\s*/
  const text = String(entry.text || '').replace(prefixPattern, '')
  if (text === entry.text) return entry
  const richText = String(entry.richText || '').replace(prefixPattern, '')
  return { ...entry, text, richText }
}

function decorateHierarchicalListEntries(block) {
  const entries = decorateTextEntries(block.items, block.highlights, block.warningHighlights)
  const subsectionByHeading = new Map()
  const childMeta = new Map()

  ;(block.subsections || []).forEach((subsection) => {
    const headingIndex = Number(subsection.headingIndex)
    const childIndexes = (subsection.childIndexes || []).map(Number)
    subsectionByHeading.set(headingIndex, childIndexes)
    childIndexes.forEach((childIndex, childOffset) => {
      childMeta.set(childIndex, { headingIndex, childOffset })
    })
  })

  let topLevelNumber = 0
  const headingNumbers = new Map()
  return entries.map((entry, itemIndex) => {
    const child = childMeta.get(itemIndex)
    if (child) {
      const parentNumber = headingNumbers.get(child.headingIndex) || ''
      return {
        ...stripRepeatedHierarchyPrefix(entry),
        hierarchyRole: 'child',
        displayNumber: parentNumber ? `${parentNumber}.${child.childOffset + 1}` : '',
      }
    }

    topLevelNumber += 1
    const isHeading = subsectionByHeading.has(itemIndex)
    if (isHeading) headingNumbers.set(itemIndex, topLevelNumber)
    return {
      ...stripRepeatedHierarchyPrefix(entry),
      hierarchyRole: isHeading ? 'heading' : 'item',
      displayNumber: String(topLevelNumber),
    }
  })
}

function measureTextUnits(value) {
  return Array.from(stripHtml(value)).reduce((total, char) => {
    return total + (/^[\x00-\x7F]$/.test(char) ? 0.55 : 1)
  }, 0)
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getTableColumnKind(column) {
  const name = String(column || '').trim()
  if (name === '序号' || name === '编号') return 'index'
  if (name === '成语' || name === '词语') return 'term'
  return 'content'
}

function isTableAccentColumn(column, kind) {
  const name = String(column || '').trim()
  return kind === 'term' || name === '口诀' || name === '误用' || name === '易错点'
}

function getTableColumnMeta(columns = [], rows = []) {
  const columnCount = columns.length
  return columns.map((column, columnIndex) => {
    const kind = getTableColumnKind(column)
    const maxUnits = Math.max(
      measureTextUnits(column),
      ...(rows || []).map((row) => measureTextUnits(row?.[columnIndex]))
    )
    let template = columnCount > 2 ? 'minmax(220rpx, 1fr)' : 'minmax(0, 1fr)'

    if (kind === 'index') {
      template = `${Math.round(clampNumber(maxUnits * 28 + 44, 96, 124))}rpx`
    } else if (kind === 'term') {
      template = `${Math.round(clampNumber(maxUnits * 26 + 36, 104, 168))}rpx`
    }

    const kindClass = `note-table-cell-${kind}`
    const accentClass = isTableAccentColumn(column, kind) ? ' note-table-cell-accent' : ''
    return {
      kind,
      template,
      headerClassName: kindClass,
      cellClassName: `${kindClass}${accentClass}`,
    }
  })
}

function getTableGridTemplate(columnMeta = []) {
  return columnMeta.map((column) => column.template).join(' ')
}

function getTableMinWidth(columnMeta = []) {
  const columnCount = columnMeta.length
  if (columnCount <= 2) return '100%'
  if (columnMeta.some((column) => column.kind === 'term')) return '100%'
  const minWidth = columnMeta.reduce((total, column) => {
    const fixed = /^([0-9]+)rpx$/.exec(column.template)
    return total + (fixed ? Number(fixed[1]) : 220)
  }, 0)
  return `${Math.max(720, minWidth)}rpx`
}

function extractHighlightWords(text) {
  if (!text) return []
  const words = []
  const matches = text.match(/用([^\uff0c,]+)/g)
  if (matches) {
    for (const m of matches) {
      const word = m.slice(1).trim()
      if (word) words.push(word)
    }
  }
  return words
}

function highlightText(text, words) {
  if (!text || !words.length) return null
  let result = text
  const sorted = [...words].sort((a, b) => b.length - a.length)
  for (const word of sorted) {
    if (!word) continue
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(
      new RegExp(escaped, 'g'),
      `<span style="color:${THEME_GREEN};font-weight:700;">${word}</span>`
    )
  }
  return result
}

function normalizeThemeGreenRichText(text) {
  return String(text).replace(/color\s*:\s*#c0392b/gi, `color:${THEME_GREEN}`)
}

function getTableCellRichText(text, columnMeta, isWordRhyme, allWords, highlights = [], warningHighlights = []) {
  if (isWordRhyme) return highlightText(text, allWords)
  if (columnMeta?.kind === 'term') {
    if (typeof text === 'string' && /<\w+/.test(text)) return normalizeThemeGreenRichText(text)
    return `<span style="color:${THEME_GREEN};font-weight:700;">${escapeHtml(text)}</span>`
  }
  if (typeof text === 'string' && /<\w+/.test(text)) return normalizeThemeGreenRichText(text)
  return buildHighlightedRichText(text, highlights, warningHighlights)
}

function decorateTableBlock(block) {
  if (block.type !== 'table') return block
  const isWordRhyme = block.label && String(block.label).includes('常考实词口诀')
  const columnMeta = getTableColumnMeta(block.columns || [], block.rows || [])
  let allWords = []
  if (isWordRhyme) {
    for (const row of (block.rows || [])) {
      for (const cell of row) {
        allWords = allWords.concat(extractHighlightWords(cell))
      }
    }
    allWords = [...new Set(allWords)]
  }
  const rows = (block.rows || []).map((row, rowIndex) => row.map((cell, cellIndex) => {
    const text = cell
    const richText = getTableCellRichText(text, columnMeta[cellIndex], isWordRhyme, allWords, block.highlights, block.warningHighlights)
    return {
      text,
      richText,
      className: columnMeta[cellIndex]?.cellClassName || 'note-table-cell-content',
      nodes: block.cellNodes ? block.cellNodes[`${rowIndex}-${cellIndex}`] || null : null
    }
  }))
  const cardTitleColumn = clampNumber(Number(block.cardTitleColumn) || 0, 0, Math.max(columnMeta.length - 1, 0))
  const hasCardGroupColumn = Number.isInteger(Number(block.cardGroupColumn))
  const cardGroupColumn = hasCardGroupColumn
    ? clampNumber(Number(block.cardGroupColumn), 0, Math.max(columnMeta.length - 1, 0))
    : null
  let activeCardGroup = null
  const cardRows = block.mobileLayout === 'cards'
    ? rows.map((row) => {
      const ownGroup = cardGroupColumn === null ? null : row[cardGroupColumn]
      if (ownGroup?.text) activeCardGroup = ownGroup
      let titleColumn = cardTitleColumn
      if (!row[titleColumn]?.text) {
        const fallbackColumn = row.findIndex((cell) => cell?.text)
        if (fallbackColumn >= 0) titleColumn = fallbackColumn
      }
      const title = row[titleColumn]
      const showGroup = cardGroupColumn !== null && titleColumn !== cardGroupColumn && activeCardGroup?.text
      return {
        title,
        groupTitle: showGroup ? activeCardGroup : null,
        fields: row
          .map((cell, cellIndex) => ({ label: block.columns?.[cellIndex], cell, cellIndex }))
          .filter((field) => field.cellIndex !== titleColumn && field.cellIndex !== cardGroupColumn && field.cell?.text),
      }
    })
    : null
  return {
    ...block,
    columnMeta,
    gridTemplateColumns: getTableGridTemplate(columnMeta),
    tableMinWidth: getTableMinWidth(columnMeta),
    rows,
    cardRows,
    cardClassName: block.mobileLayout === 'cards' && block.cardVariant ? `note-table-cards-${block.cardVariant}` : '',
  }
}

function decorateBlockImage(image) {
  if (!image) return image
  if (isCloudNoteAsset(image.src)) {
    return { ...image, originalSrc: image.src, src: '', isResolvingImage: true }
  }
  if (shouldUseAssetPrefix(image.src)) {
    return { ...image, src: CLOUD_IMG_PREFIX + image.src }
  }
  return image
}

function decorateTimelineEntries(items, blockHighlights = [], blockWarningHighlights = []) {
  return (items || []).map((item) => ({
    ...item,
    contentRichText: buildHighlightedRichText(item.content, item.highlights || blockHighlights, item.warningHighlights || blockWarningHighlights),
  }))
}

function getBlockAnchorLabel(block) {
  return String(block.label || block.title || '').trim()
}

function buildSectionAnchors(blocks) {
  return (blocks || [])
    .filter((block) => block.anchorLabel)
    .map((block) => ({ id: block.anchorId, title: block.anchorLabel }))
}

function decorateBlocks(blocks) {
  return (blocks || []).filter((block) => block.type !== "image-note" || Boolean(block.src)).map((block, blockIndex) => {
    let processedBlock = decorateFormulaBlock(block)
    processedBlock = decorateTableBlock(processedBlock)
    const hasOptions = processedBlock.type === "example" && Array.isArray(processedBlock.options) && processedBlock.options.length > 0
    let decorated = {
      ...processedBlock,
      sourceBlockFingerprint: fingerprint(block),
      anchorId: `note-anchor-${blockIndex}`,
      anchorLabel: getBlockAnchorLabel(processedBlock),
      hasFormulaNodes: processedBlock.type === "formula" && Array.isArray(processedBlock.nodes) && processedBlock.nodes.length > 0,
      hasFormulaContent: processedBlock.type === "formula" && Boolean(processedBlock.content),
      hasFormulaLines: processedBlock.type === "formula" && Array.isArray(processedBlock.contentLines) && processedBlock.contentLines.length > 1,
      hasOptions
    }
    if (["steps", "signal", "rule"].includes(processedBlock.type)) {
      decorated.items = decorateTextEntries(processedBlock.items, processedBlock.highlights, processedBlock.warningHighlights)
    }
    if (processedBlock.type === "list") {
      decorated.items = decorateHierarchicalListEntries(processedBlock)
    }
    if (processedBlock.displayMode === 'timeline') {
      decorated.timelineItems = decorateTimelineEntries(processedBlock.timelineItems, processedBlock.highlights, processedBlock.warningHighlights)
    }
    if (processedBlock.type === "tip") {
      decorated.contentRichText = buildHighlightedRichText(processedBlock.content, processedBlock.highlights, processedBlock.warningHighlights)
    }
    if (processedBlock.type === "image-note" && isCloudNoteAsset(processedBlock.src)) {
      decorated.originalSrc = processedBlock.src
      decorated.src = ''
      decorated.isResolvingImage = true
    } else if (processedBlock.type === "image-note" && shouldUseAssetPrefix(processedBlock.src)) {
      decorated.src = CLOUD_IMG_PREFIX + processedBlock.src
    }
    if (processedBlock.type === "example" && processedBlock.image) {
      decorated.image = decorateBlockImage(processedBlock.image)
    }
    if (processedBlock.type === "mind-map") {
      decorated.nodes = decorateMindMapNodes(processedBlock.nodes)
      decorated.allCollapsed = getMindMapAllCollapsed(decorated.nodes)
    }
    return decorated
  })
}

function getMindMapAllCollapsed(nodes) {
  return (nodes || []).every((node) => {
    return !node.hasChildren || node.isCollapsed === true
  })
}

function getMindMapNodeByPath(nodes, path) {
  let currentNode = nodes?.[path[0]]
  for (let index = 1; index < path.length && currentNode; index += 1) {
    currentNode = currentNode.children?.[path[index]]
  }
  return currentNode
}

function cloneWithResolvedImage(block, resolveImage) {
  if (block.type === 'image-note') {
    const source = block.originalSrc || block.src
    return resolveImage(source).then((src) => ({ ...block, src, loadFailed: !src, isResolvingImage: false }))
  }
  if (block.type === 'example' && block.image) {
    const source = block.image.originalSrc || block.image.src
    return resolveImage(source).then((src) => ({
      ...block,
      image: { ...block.image, src: src || '', loadFailed: !src, isResolvingImage: false }
    }))
  }
  if (block.type !== 'mind-map') return Promise.resolve(block)
  return resolveMindMapNodes(block.nodes, resolveImage).then((nodes) => ({ ...block, nodes }))
}

function resolveMindMapNodes(nodes, resolveImage) {
  return Promise.all((nodes || []).map((node) => {
    const imageSource = node.image?.originalSrc || node.image?.src
    return Promise.all([
      imageSource ? resolveImage(imageSource) : Promise.resolve(null),
      resolveMindMapNodes(node.children, resolveImage)
    ]).then(([src, children]) => ({
      ...node,
      image: node.image ? { ...node.image, src: src || '', loadFailed: !src, isResolvingImage: false } : node.image,
      children
    }))
  }))
}


module.exports={getReadingReview,shouldUseAssetPrefix,decorateMindMapNodes,setMindMapNodesCollapseDeep,resetMindMapChildrenDefault,decorateFormulaBlock,stripHtml,escapeHtml,buildHighlightedRichText,decorateTextEntries,stripRepeatedHierarchyPrefix,decorateHierarchicalListEntries,measureTextUnits,clampNumber,getTableColumnKind,isTableAccentColumn,getTableColumnMeta,getTableGridTemplate,getTableMinWidth,extractHighlightWords,highlightText,normalizeThemeGreenRichText,getTableCellRichText,decorateTableBlock,decorateBlockImage,decorateTimelineEntries,getBlockAnchorLabel,buildSectionAnchors,decorateBlocks,getMindMapAllCollapsed,getMindMapNodeByPath,cloneWithResolvedImage,resolveMindMapNodes};
