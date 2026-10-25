module.exports = {
  "schemaVersion": 1,
  "batchId": "common-sense-guide-expansion-batch-50",
  "purpose": "逐组检查概念、适用条件与实例能否从单卡读出；不是实际用户研究。",
  "cases": [
    {
      "cardId": "administrative-litigation::administrative-litigation-concept",
      "question": "行政诉讼由哪个机关解决哪类争议？",
      "requiredTermGroups": [
        [
          "人民法院"
        ],
        [
          "行政行为"
        ],
        [
          "行政争议"
        ]
      ]
    },
    {
      "cardId": "administrative-litigation::maintained",
      "question": "复议维持后应以谁为被告？",
      "requiredTermGroups": [
        [
          "共同被告"
        ],
        [
          "原行政机关"
        ],
        [
          "复议机关"
        ]
      ]
    },
    {
      "cardId": "administrative-litigation::evidence",
      "question": "行政诉讼证据是否只限纸面文件？",
      "requiredTermGroups": [
        [
          "电子数据"
        ],
        [
          "证人证言"
        ],
        [
          "现场笔录"
        ]
      ]
    },
    {
      "cardId": "administrative-litigation::administrative-litigation-burden-of-proof",
      "question": "被告负举证是否原告什么都不用证明？",
      "requiredTermGroups": [
        [
          "合法"
        ],
        [
          "原告"
        ],
        [
          "除外"
        ]
      ]
    }
  ]
};
