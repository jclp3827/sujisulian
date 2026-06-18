Component({
  properties: {
    nodes: {
      type: Array,
      value: [],
    },
    content: {
      type: String,
      value: "",
    },
    compact: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    formulaNodes: [],
  },
  lifetimes: {
    attached() {
      this.updateFormulaNodes();
    },
  },
  observers: {
    "nodes, content": function () {
      this.updateFormulaNodes();
    },
  },
  methods: {
    updateFormulaNodes() {
      const nodes = this.properties.nodes || [];
      if (nodes.length) {
        this.setData({ formulaNodes: normalizeNodes(nodes) });
        return;
      }

      const content = this.properties.content || "";
      this.setData({ formulaNodes: parseFormulaText(content) });
    },
  },
});

function normalizeNodes(nodes) {
  return (nodes || []).map((node) => {
    if (node.type === "frac") {
      return {
        type: "frac",
        numNodes: node.numNodes ? normalizeNodes(node.numNodes) : parseFormulaText(String(node.num || "")),
        denNodes: node.denNodes ? normalizeNodes(node.denNodes) : parseFormulaText(String(node.den || "")),
      };
    }
    if (node.type === "group") {
      return { ...node, items: normalizeNodes(node.items || []) };
    }
    if (node.type === "script" && node.baseNodes) {
      return {
        ...node,
        base: node.baseNodes[0] || { type: "text", value: "" },
      };
    }
    return node;
  });
}

function parseFormulaText(text) {
  if (!text) return [];
  // 全角括号统一为半角，避免分组解析遗漏
  const normalized = String(text).replace(/（/g, '(').replace(/）/g, ')');
  return normalized
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((segment, index, segments) => {
      const nodes = parseInline(segment);
      return index === segments.length - 1 ? nodes : nodes.concat({ type: "text", value: "；" });
    });
}

function parseInline(text) {
  const nodes = [];
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (char === " ") {
      index += 1;
      continue;
    }

    if (char === "(") {
      const group = readGroup(text, index);
      if (group) {
        nodes.push({ type: "group", items: parseInline(group.value) });
        index = group.next;
        continue;
      }
    }

    if (char === "^") {
      const base = nodes.pop();
      const script = readScriptContent(text, index + 1);
      if (base && script.value) {
        nodes.push({ type: "script", base, sup: script.value });
      } else {
        if (base) nodes.push(base);
        nodes.push({ type: "text", value: "^" });
      }
      index = script.next;
      continue;
    }

    if (char === "_") {
      const base = nodes.pop();
      const script = readScriptContent(text, index + 1);
      if (base && script.value) {
        nodes.push({ type: "script", base, sub: script.value });
      } else {
        if (base) nodes.push(base);
        nodes.push({ type: "text", value: "_" });
      }
      index = script.next;
      continue;
    }

    if (char === "/" && shouldBuildFraction(text, index)) {
      const numerator = takeNumerator(nodes);
      const denominator = readDenominator(text, index + 1);
      if (numerator.length && denominator.value) {
        nodes.push({
          type: "frac",
          numNodes: numerator,
          denNodes: parseInline(denominator.value),
        });
        index = denominator.next;
        continue;
      }
      nodes.push(...numerator);
    }

    if (isOperator(char)) {
      nodes.push({ type: "op", value: char });
      index += 1;
      continue;
    }

    const token = readToken(text, index);
    nodes.push(...decorateToken(token.value));
    index = token.next;
  }

  return mergeTextNodes(nodes);
}

function shouldBuildFraction(text, index) {
  return text[index - 1] === " " || text[index + 1] === " ";
}

function takeNumerator(nodes) {
  while (nodes.length && nodes[nodes.length - 1].type === "op" && nodes[nodes.length - 1].value === " ") {
    nodes.pop();
  }
  const last = nodes.pop();
  if (!last) return [];
  return last.type === "group" ? last.items : [last];
}

function readDenominator(text, start) {
  let index = start;
  while (index < text.length && text[index] === " ") index += 1;

  if (text[index] === "(") {
    const group = readGroup(text, index);
    if (group) return { value: group.value, next: group.next };
  }

  const begin = index;
  while (index < text.length) {
    const char = text[index];
    if (char === " " || char === "；" || char === ";" || char === "，" || char === "," || char === "。") break;
    if (isOperator(char) && char !== "+" && char !== "-" && char !== "×") break;
    index += 1;
  }
  return { value: text.slice(begin, index).trim(), next: index };
}

function readGroup(text, start) {
  let depth = 1;
  for (let index = start + 1; index < text.length; index += 1) {
    if (text[index] === "(") depth += 1;
    if (text[index] === ")") {
      depth -= 1;
      if (depth === 0) return { value: text.slice(start + 1, index), next: index + 1 };
    }
  }
  return null;
}

function readScriptContent(text, start) {
  if (text[start] === "(") {
    const group = readGroup(text, start);
    if (group) return group;
  }

  let index = start;
  while (index < text.length) {
    const char = text[index];
    if (char === " " || isOperator(char) || char === "^" || char === "_" || char === "；" || char === ";" || char === "，" || char === "。") break;
    index += 1;
  }
  return { value: text.slice(start, index), next: index };
}

function readToken(text, start) {
  let index = start;
  while (index < text.length) {
    const char = text[index];
    if (char === " " || isOperator(char) || char === "^" || char === "_") break;
    index += 1;
  }
  return { value: text.slice(start, index), next: index };
}

function decorateToken(token) {
  if (!token) return [];

  const digitSubscript = token.match(/^([a-zA-Zπ])([0-9]+)$/);
  if (digitSubscript) {
    return [{
      type: "script",
      base: { type: "text", value: digitSubscript[1].toUpperCase() },
      sub: digitSubscript[2],
    }];
  }

  const abrxBusinessSubscript = token.match(/^R([abc])$/);
  if (abrxBusinessSubscript) {
    return [{
      type: "script",
      base: { type: "text", value: "R" },
      sub: abrxBusinessSubscript[1],
    }];
  }

  const singleLetter = token.match(/^[a-zA-Zπ]$/);
  if (singleLetter) {
    return [{ type: "text", value: token.toUpperCase() }];
  }

  return [{ type: "text", value: token }];
}

function isOperator(char) {
  return /[=+\-×÷*<>≈±∓()[\]（）]/.test(char);
}

function mergeTextNodes(nodes) {
  return nodes.reduce((merged, node) => {
    const last = merged[merged.length - 1];
    if (node.type === "text" && last?.type === "text") {
      last.value += node.value;
    } else {
      merged.push(node);
    }
    return merged;
  }, []);
}
