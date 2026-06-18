module.exports = [
  {
    "id": "concentration-cross",
    "categoryId": "concentration",
    "type": "method",
    "title": "浓度与十字相乘",
    "summary": "浓度问题先抓溶质、溶液、浓度三者关系，混合题常用十字相乘。",
    "preview": "浓度 = 溶质 / 溶液；混合比例看目标浓度与两端浓度差",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "formula",
            "label": "核心公式",
            "content": "浓度 = 溶质 / 溶液；溶质 = 溶液 × 浓度；溶液 = 溶质 + 溶剂"
          },
          {
            "type": "rule",
            "title": "溶质不变法",
            "items": [
              "无论溶液如何加水、蒸发或混合，溶质质量不会凭空发生改变。",
              "题干出现加水、蒸发、稀释、浓缩时，优先围绕溶质列等量关系。"
            ]
          },
          {
            "type": "formula",
            "label": "十字相乘",
            "content": "溶液A质量 / 溶液B质量 = (R - B) / (A - R)"
          },
          {
            "type": "image-note",
            "label": "方法示意",
            "title": "十字交叉法与线段法",
            "src": "data-analysis/mixture-cross-01-cross-line-method.png"
          },
          {
            "type": "rule",
            "title": "类浓度问题",
            "items": [
              "凡是能表示成 A = B / C 形式的比例关系，都可以看成类浓度问题。",
              "利用十字相乘求出的比例关系，一定是 C（即分母）之比。",
              "目标值 R 必须位于两端值 A、B 之间，交叉相减后对应另一端的量。"
            ]
          },
          {
            "type": "tip",
            "variant": "success",
            "title": "速记提示",
            "content": "浓度题看溶质是否不变；类浓度题先判断分子、分母和比例值，再用十字相乘求分母之比。"
          }
        ]
      },
      {
        "id": "真题示例",
        "title": "真题示例",
        "blocks": [
          {
            "type": "example",
            "source": "2020 山东",
            "label": "真题示例·类浓度",
            "stem": "由于改良了种植技术，农场 2017 年种植的 A 和 B 两种作物，产量分别增加了 10% 和 25%。已知 2017 年两种作物总产量增加了 18%，问 2017 年 A 和 B 两种作物的产量之比为：",
            "options": [
              {
                "key": "A",
                "text": "7:8"
              },
              {
                "key": "B",
                "text": "8:7"
              },
              {
                "key": "C",
                "text": "176:175"
              },
              {
                "key": "D",
                "text": "77:100"
              }
            ],
            "answer": "D",
            "analysis": "把增长率看成类浓度：A 为 10%，B 为 25%，混合增长率 R 为 18%。十字相乘求出的是前期量之比，A:B = (25%-18%):(18%-10%) = 7:8。题目问 2017 年产量之比，所以用 2016 年比例乘增长后产量：(7×1.1):(8×1.25)=77:100。"
          }
        ]
      }
    ],
    "keywords": [
      "浓度问题",
      "十字相乘"
    ],
    "aliases": [
      "十字交叉",
      "溶液混合",
      "类浓度"
    ],
    "tags": [
      "数量关系",
      "浓度",
      "公式"
    ],
    "indexText": "浓度题先看溶质是否不变，混合比例题常用十字相乘或类浓度思路。"
  }
]
