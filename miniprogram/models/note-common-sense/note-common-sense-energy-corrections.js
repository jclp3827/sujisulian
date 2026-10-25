module.exports = function applyEnergyCorrection(points) {
  const p = points.find(p => p.id === "current-main-energy");
  if (!p) throw new Error("Missing current-main-energy");
  const update = {
  "tabs": [
    {
      "id": "nuclear-energy",
      "title": "核能",
      "blocks": [
        {
          "type": "list",
          "label": "核能",
          "items": [
            "核能：",
            "核能可通过核裂变、核聚变等核反应释放，是能源技术的重要研究和利用方向，不能称为替代化石燃料的唯一能源。",
            "核裂变是较重原子核分裂并释放能量的过程。裂变核电站以受控链式反应产生热量，再通过热机和发电机发电；铀是常用燃料。",
            "核聚变是轻原子核结合成较重原子核并释放能量的过程。氢弹中的聚变是不受控制的例子；受控聚变研究已开展，实验进展不等于商业电站已普遍运行。",
            "氘和氚是氢的同位素，也是多种聚变反应方案采用的燃料。"
          ],
          "subsections": [
            {
              "headingIndex": 0,
              "childIndexes": [
                1,
                2,
                3,
                4
              ]
            }
          ],
          "highlights": [
            "裂变能",
            "聚变能",
            "核能转换成内能",
            "电能",
            "铀",
            "氢弹",
            "氘",
            "氚"
          ],
          "sourceUnitIds": [
            "cs-16-22-p29-nuclear-energy-list"
          ]
        }
      ]
    },
    {
      "id": "solar-energy",
      "title": "太阳能",
      "blocks": [
        {
          "type": "list",
          "label": "太阳能",
          "items": [
            "太阳能：",
            "太阳辐射能的利用有间接利用和直接利用两种。",
            "（1）间接利用是指利用草木燃料、化石燃料、风力、水力、海洋热能等各种被固定的太阳辐射能中的能量。",
            "（2）直接利用是直接利用太阳辐射的能量，主要是光—热转换、光—电转换和光—化学转换。"
          ],
          "subsections": [
            {
              "headingIndex": 0,
              "childIndexes": [
                1,
                2,
                3
              ]
            }
          ],
          "highlights": [
            "间接利用",
            "直接利用",
            "光—热转换",
            "光—电转换",
            "光—化学转换"
          ],
          "sourceUnitIds": [
            "cs-16-22-p29-solar-energy-list"
          ]
        }
      ]
    }
  ],
  "readingMeta": {
    "label": "学习导读",
    "takeaway": "核能区分裂变与聚变：裂变核电站通过受控链式反应释放热量；聚变由轻核结合释放能量。太阳能可直接转换，也可经自然过程间接利用。",
    "focus": [
      {
        "label": "核能",
        "note": "核裂变使较重原子核分裂，裂变核电站用受控链式反应产生热量并发电，铀是常用燃料；核聚变使轻原子核结合，氘和氚是常见研究燃料。",
        "sourceUnitIds": [
          "cs-16-22-p29-nuclear-energy-list"
        ]
      },
      {
        "label": "太阳能",
        "note": "太阳能间接利用草木、化石燃料、风水力和海洋热能中固定的太阳辐射能；直接利用包括光—热、光—电、光—化学转换。",
        "sourceUnitIds": [
          "cs-16-22-p29-solar-energy-list"
        ]
      }
    ],
    "route": [
      "核能",
      "太阳能"
    ],
    "review": [
      "核裂变与核聚变分别通过较重原子核分裂和轻原子核结合释放能量。",
      "裂变核电站以受控链式反应产生热量，经热机和发电机转为电能，铀是常用燃料。",
      "氢弹中的聚变是不受控制的例子；受控聚变研究不能与商业化运行混同，氘和氚是常见研究燃料。",
      "太阳能间接利用包括草木、化石燃料、风力、水力、海洋热能；直接利用是光—热、光—电、光—化学转换。"
    ]
  }
};
  p.tabs = update.tabs;
  p.readingMeta = update.readingMeta;
};
