module.exports = [
  {
    "id": "mixed-growth",
    "categoryId": "special",
    "type": "method",
    "title": "混合增长率",
    "summary": "多个部分合成整体时，整体增长率一定介于各部分增长率之间。",
    "preview": "整体增速介于各部分增速之间，且偏向基量更大的部分",
    "relatedTraining": {
      "sectionId": "data-analysis",
      "itemId": "percent-calc",
      "title": "百分化计算"
    },
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "formula",
            "label": "核心判断",
            "content": "整体增长率介于各部分增长率之间"
          },
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干问整体增速，材料给出多个部分的增速。",
              "出现“其中 A、B 分别增长”“合计增长率约为多少”。",
              "选项中有明显高于所有部分或低于所有部分的值。"
            ]
          },
          {
            "type": "rule",
            "title": "判断规则",
            "items": [
              "整体增长率不能超过最高的部分增长率，也不能低于最低的部分增长率。",
              "哪个部分基期量更大，整体增速就更偏向哪个部分。",
              "如果只问范围，先用夹逼排除，不急着精算。"
            ]
          },
          {
            "type": "compare",
            "label": "偏向判断",
            "left": {
              "title": "A 基量更大",
              "content": "整体增速更靠近 A",
              "items": [
                "A 对整体影响更大",
                "A 的增速权重更高"
              ]
            },
            "right": {
              "title": "B 基量更大",
              "content": "整体增速更靠近 B",
              "items": [
                "B 对整体影响更大",
                "B 的增速权重更高"
              ]
            }
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "混合增长率不是把几个增长率简单平均；权重取决于各部分基期量。"
          }
        ]
      },
      {
        "id": "example",
        "title": "例题讲解",
        "blocks": [
          {
            "type": "example",
            "label": "例题 1",
            "stem": "A 类收入同比增长 10%，B 类收入同比增长 30%，两类合计增长率可能是多少？",
            "analysis": "合计增长率一定介于 10% 和 30% 之间。若 A 的基期收入更大，则合计增速更靠近 10%。"
          },
          {
            "type": "example",
            "source": "2021 国考",
            "label": "真题示例",
            "stem": "某市 2020 年外贸进出口总额中，出口增速 8%，进口增速 3%，整体增速约为 5%，判断出口额和进口额哪个更大。",
            "options": [
              {
                "key": "A",
                "text": "出口额更大"
              },
              {
                "key": "B",
                "text": "进口额更大"
              },
              {
                "key": "C",
                "text": "两者相等"
              },
              {
                "key": "D",
                "text": "无法判断"
              }
            ],
            "answer": "A",
            "analysis": "整体增速 5% 介于出口 8% 和进口 3% 之间，且更靠近出口 8%，说明出口基期量更大（混合值偏向量大的一方）。"
          }
        ]
      }
    ],
    "keywords": [
      "混合增长率",
      "整体增速"
    ],
    "aliases": [
      "混合增速",
      "加权增长率"
    ],
    "tags": [
      "资料分析",
      "特殊考点",
      "增长"
    ],
    "indexText": "部分增长率的加权混合决定整体增长率，混合增速介于各部分增速之间。"
  },
  {
    "id": "multiple-growth",
    "categoryId": "special",
    "type": "method",
    "title": "倍数增长",
    "summary": "题干出现“是几倍”“增长几倍”“翻几番”时，先区分倍数和增长率。",
    "preview": "现期是基期的 A 倍，则增长率 = A - 1",
    "relatedTraining": {
      "sectionId": "data-analysis",
      "itemId": "fraction-large",
      "title": "分数计算（分子>分母）"
    },
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "formula",
            "label": "核心关系",
            "content": "现期量 = 基期量 × 倍数；增长率 = 倍数 - 1"
          },
          {
            "type": "compare",
            "label": "易混表达",
            "left": {
              "title": "是几倍",
              "content": "现期 / 基期",
              "items": [
                "是 3 倍，增长率为 200%",
                "包含原来的 1 倍"
              ]
            },
            "right": {
              "title": "增长几倍",
              "content": "增长量 / 基期",
              "items": [
                "增长 3 倍，现期是 4 倍",
                "不包含原来的 1 倍"
              ]
            }
          },
          {
            "type": "rule",
            "title": "读题规则",
            "items": [
              "问“是几倍”，直接比较现期和基期的倍数关系。",
              "问“增长几倍”，先求增长量相当于基期的几倍。",
              "问“翻一番”，表示变为原来的 2 倍；翻两番表示变为原来的 4 倍。"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "“增长 2 倍”和“是 2 倍”不是一回事：前者现期是基期的 3 倍，后者增长率是 100%。"
          }
        ]
      },
      {
        "id": "example",
        "title": "例题讲解",
        "blocks": [
          {
            "type": "example",
            "label": "例题 1",
            "stem": "某指标由 50 增至 150，问现期是基期的几倍，增长了几倍。",
            "analysis": "现期是基期的 150/50 = 3 倍；增长量为 100，增长了 100/50 = 2 倍。"
          },
          {
            "type": "example",
            "source": "2020 国考",
            "label": "真题示例",
            "stem": "2019 年某地区 GDP 为 800 亿元，2015 年为 200 亿元，问 2019 年 GDP 是 2015 年的几倍。",
            "options": [
              {
                "key": "A",
                "text": "2 倍"
              },
              {
                "key": "B",
                "text": "3 倍"
              },
              {
                "key": "C",
                "text": "4 倍"
              },
              {
                "key": "D",
                "text": "5 倍"
              }
            ],
            "answer": "C",
            "analysis": "800 / 200 = 4，现期是基期的 4 倍，增长了 3 倍。"
          }
        ]
      }
    ],
    "keywords": [
      "倍数增长率",
      "翻番"
    ],
    "aliases": [
      "翻几倍",
      "倍数增速"
    ],
    "tags": [
      "资料分析",
      "特殊考点",
      "增长"
    ],
    "indexText": "倍数和增长率关系为倍数等于增长率加1，翻n番为原来的2的n次方倍。"
  },
  {
    "id": "percentage-point",
    "categoryId": "special",
    "type": "method",
    "title": "百分点",
    "summary": "两个百分数相减时使用“百分点”，常见于比重变化和增速差。",
    "preview": "百分点 = 两个百分数的差",
    "relatedTraining": {
      "sectionId": "data-analysis",
      "itemId": "percent-calc",
      "title": "百分化计算"
    },
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "formula",
            "label": "核心概念",
            "content": "百分点表示两个百分数之间的差值"
          },
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干出现“提高几个百分点”“回落几个百分点”。",
              "材料比较的是两个比重、两个增长率或两个百分数。",
              "选项常写作“百分点”，而不是单纯的“%”。"
            ]
          },
          {
            "type": "table",
            "label": "常见表达",
            "columns": [
              "变化",
              "说法"
            ],
            "rows": [
              [
                "20% 到 25%",
                "提高 5 个百分点"
              ],
              [
                "30% 到 27%",
                "下降 3 个百分点"
              ],
              [
                "比重为 15%",
                "这是百分数"
              ],
              [
                "比重差为 2%",
                "应说 2 个百分点"
              ]
            ]
          },
          {
            "type": "compare",
            "label": "百分数与百分点",
            "left": {
              "title": "百分数",
              "content": "表示比例大小",
              "items": [
                "例如占比 40%",
                "增长率 12%"
              ]
            },
            "right": {
              "title": "百分点",
              "content": "表示百分数差值",
              "items": [
                "40% 到 45% 相差 5 个百分点",
                "用于描述变化幅度"
              ]
            }
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "两个百分数相减得到的是百分点；两个数相除得到的才是相对增长率。"
          }
        ]
      },
      {
        "id": "example",
        "title": "例题讲解",
        "blocks": [
          {
            "type": "example",
            "label": "例题 1",
            "stem": "某指标占比由 18% 提高到 23%，问提高了多少。",
            "analysis": "23% - 18% = 5%，表达为提高 5 个百分点。"
          },
          {
            "type": "example",
            "source": "2021 国考",
            "label": "真题示例",
            "stem": "2019 年东部地区GDP占全国比重 51.9%，2020 年占 52.4%，比重比上年提高了多少个百分点？",
            "options": [
              {
                "key": "A",
                "text": "0.3"
              },
              {
                "key": "B",
                "text": "0.5"
              },
              {
                "key": "C",
                "text": "0.7"
              },
              {
                "key": "D",
                "text": "1.0"
              }
            ],
            "answer": "B",
            "analysis": "比重差 = 52.4% - 51.9% = 0.5 个百分点。注意比重差也可以用公式：现期比重×(部分增速-整体增速)/(1+部分增速) 验证。"
          }
        ]
      }
    ],
    "keywords": [
      "百分点",
      "百分加减"
    ],
    "aliases": [
      "百分数之差",
      "百分点理解"
    ],
    "tags": [
      "资料分析",
      "特殊考点",
      "术语"
    ],
    "indexText": "百分点是两个百分数相减的结果，不是相对增长率。"
  },
  {
    "id": "pulling-contribution",
    "categoryId": "special",
    "type": "formula",
    "title": "拉动增长与贡献率",
    "summary": "拉动增长看部分增量占整体基期，贡献率看部分增量占整体增量。",
    "preview": "拉动增长率 = 部分增量 / 整体基期；贡献率 = 部分增量 / 整体增量",
    "relatedTraining": {
      "sectionId": "data-analysis",
      "itemId": "growth-inc",
      "title": "估算增长量"
    },
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "formula",
            "label": "拉动增长率",
            "content": "拉动增长率 = 部分增量 / 整体基期"
          },
          {
            "type": "formula",
            "label": "增量贡献率",
            "content": "增量贡献率 = 部分增量 / 整体增量"
          },
          {
            "type": "compare",
            "label": "分母辨析",
            "left": {
              "title": "拉动增长率",
              "content": "看部分增量拉动整体增长了多少",
              "items": [
                "分母是整体基期",
                "常用于问“拉动整体增长几个百分点”"
              ]
            },
            "right": {
              "title": "增量贡献率",
              "content": "看部分增量占整体增量的比例",
              "items": [
                "分母是整体增量",
                "常用于问“贡献了百分之几”"
              ]
            }
          },
          {
            "type": "example",
            "label": "示例",
            "stem": "早市铺昨天卖出包子 100 元、油条 50 元；今天卖出包子 150 元、油条 100 元。",
            "analysis": "整体基期 = 100+50=150，整体现期 = 150+100=250，整体增量 = 100。包子增量 50，油条增量 50。包子拉动增长率 = 50/150 = 33.3%，油条拉动增长率 = 50/150 = 33.3%；包子增量贡献率 = 50/100 = 50%，油条增量贡献率 = 50/100 = 50%。"
          }
        ]
      }
    ],
    "keywords": [
      "拉动增长",
      "拉动率"
    ],
    "aliases": [
      "拉动点",
      "拉动增长点"
    ],
    "tags": [
      "资料分析",
      "特殊考点",
      "增长"
    ],
    "indexText": "拉动增长率是某部分增量除以整体基期量。"
  },
  {
    "id": "data-inclusion",
    "categoryId": "special",
    "type": "method",
    "title": "资料容斥问题",
    "summary": "占比和超过 100% 时，一定存在交集；问至少和至多时用包含关系判断。",
    "preview": "至少 = a + b - 100%；至多取较小比重",
    "relatedTraining": {
      "sectionId": "data-analysis",
      "itemId": "percent-calc",
      "title": "百分化计算"
    },
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "rule",
            "title": "有交集",
            "items": [
              "两个占比之和超过 100%，则一定有交集。"
            ]
          },
          {
            "type": "formula",
            "label": "至少",
            "content": "两个比重交集最小值 = a + b - 100%"
          },
          {
            "type": "formula",
            "label": "至多",
            "content": "两个比重交集最大值 = 较小的那个比重"
          },
          {
            "type": "rule",
            "title": "三种问法",
            "items": [
              "占比不超过 100%，不一定有交集；占比之和超过 100%，一定有交集。",
              "问至多：看占比更小的一方，交集最大不能超过较小比重。",
              "问至少：用 a + b - 100%，若是具体人数则用 a + b - 总量。"
            ]
          },
          {
            "type": "example",
            "label": "示例",
            "stem": "班级有 100 人，男生占 50%，来自南方的同学占 80%。",
            "analysis": "50% + 80% > 100%，一定有来自南方的男生。至多看更小的一方，最多 50% 即 50 人；至少用 80% + 50% - 100% = 30%，即至少 30 人。"
          }
        ]
      }
    ]
  }
]
