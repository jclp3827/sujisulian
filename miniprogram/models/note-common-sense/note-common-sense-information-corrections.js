module.exports = function applyInformationCorrections(points) {
  const updates = [
  {
    "pointId": "communication-technology",
    "tabs": [
      {
        "id": "five-g",
        "title": "5G技术",
        "blocks": [
          {
            "type": "list",
            "label": "5G技术",
            "items": [
              "5G是第五代蜂窝移动通信技术。2019年6月6日，我国发放5G商用牌照，标志我国进入5G商用元年；不以“最新一代”作为长期定义。",
              "优点：",
              "高速率。",
              "低时延。",
              "大连接。"
            ],
            "subsections": [
              {
                "headingIndex": 1,
                "childIndexes": [
                  2,
                  3,
                  4
                ]
              }
            ],
            "highlights": [
              "第五代移动通信技术",
              "2019年",
              "5G商用元年",
              "高速率",
              "低时延",
              "大连接"
            ],
            "sourceUnitIds": [
              "cs-23-30-p1-5g-list"
            ]
          }
        ]
      },
      {
        "id": "fiber-communication",
        "title": "光纤通信",
        "blocks": [
          {
            "type": "list",
            "label": "光纤通信",
            "items": [
              "光纤通信：利用光波（主要是激光）在光导纤维中传递各种信息，利用了光的全反射现象。",
              "优点：",
              "通信容量大。",
              "传输损耗低。",
              "经济。",
              "轻便。",
              "抗干扰能力强。"
            ],
            "subsections": [
              {
                "headingIndex": 1,
                "childIndexes": [
                  2,
                  3,
                  4,
                  5,
                  6
                ]
              }
            ],
            "highlights": [
              "激光",
              "光导纤维",
              "全反射",
              "通信容量大",
              "传输损耗低",
              "抗干扰能力强"
            ],
            "sourceUnitIds": [
              "cs-23-30-p1-fiber-communication-list"
            ]
          }
        ]
      }
    ],
    "readingMeta": {
      "label": "学习导读",
      "takeaway": "5G是第五代蜂窝移动通信技术，光纤则利用光在光导纤维中的传播传递信息。二者分别描述移动通信代际和传输介质，不能作为同一分类维度混用。",
      "focus": [
        {
          "label": "5G技术",
          "note": "5G是第五代蜂窝移动通信技术。我国于2019年6月6日发放5G商用牌照；高速率、低时延和大连接是代表能力，实际表现受网络与终端等条件影响。",
          "sourceUnitIds": [
            "cs-23-30-p1-5g-list"
          ]
        },
        {
          "label": "光纤通信",
          "note": "光纤通信主要用激光在光导纤维中传递信息，物理原理是光的全反射，优势为容量大、损耗低、经济轻便、抗干扰强。",
          "sourceUnitIds": [
            "cs-23-30-p1-fiber-communication-list"
          ]
        }
      ],
      "route": [
        "5G技术",
        "光纤通信"
      ],
      "review": [
        "5G是第五代蜂窝移动通信技术；2019年6月6日我国发放5G商用牌照。",
        "高速率、低时延和大连接是5G的代表能力，不是每次使用都达到同一性能的保证。",
        "光纤通信主要用激光在光导纤维中传递信息，利用全反射。",
        "光纤优势：容量大、传输损耗低、经济、轻便、抗干扰能力强。"
      ]
    }
  },
  {
    "pointId": "information-technology-applications",
    "tabs": [
      {
        "id": "big-data",
        "title": "大数据",
        "blocks": [
          {
            "type": "list",
            "label": "大数据",
            "items": [
              "大数据是规模、类型、流入速度或变化等特征使传统处理方式面临挑战，需要可扩展架构进行存储、处理与分析的数据集合。容量大、类型多、速度快是代表特征；数据质量、准确性和分析价值仍需验证，不由数据量直接保证。"
            ],
            "highlights": [
              "规模",
              "类型",
              "速度",
              "可扩展架构",
              "数据质量"
            ],
            "sourceUnitIds": [
              "cs-23-30-p1-p2-big-data-list"
            ]
          }
        ]
      },
      {
        "id": "cloud-computing",
        "title": "云计算",
        "blocks": [
          {
            "type": "list",
            "label": "云计算",
            "items": [
              "云计算通过网络按需提供共享的可配置计算资源池，包括计算、存储、网络等资源或服务，可按需求快速分配和释放。资源池化、按需服务和快速弹性是重要特征；虚拟化是常见实现技术。接入受网络与权限等条件约束，成本和可靠性取决于具体方案，不能视为无条件保证。"
            ],
            "highlights": [
              "网络",
              "按需",
              "资源池",
              "快速弹性",
              "虚拟化"
            ],
            "sourceUnitIds": [
              "cs-23-30-p2-cloud-computing-list"
            ]
          }
        ]
      },
      {
        "id": "internet-of-things",
        "title": "物联网",
        "blocks": [
          {
            "type": "list",
            "label": "物联网",
            "items": [
              "物联网通过传感、计算、网络连接等能力，使设备与物理世界交互并交换数据。传感器、控制器和家用设备是代表对象；连接需要相应设备、协议和网络条件，不表示所有物品已自动联网。"
            ],
            "highlights": [
              "传感",
              "网络连接",
              "交换数据",
              "设备"
            ],
            "sourceUnitIds": [
              "cs-23-30-p2-iot-list"
            ]
          }
        ]
      },
      {
        "id": "artificial-intelligence",
        "title": "人工智能",
        "blocks": [
          {
            "type": "list",
            "label": "人工智能",
            "items": [
              "人工智能：是研究如何应用计算机的软硬件来模拟人类某些智能行为的基本理论、方法和技术。其目标是让机器能够胜任一些通常需要人类智能才能完成的复杂工作。"
            ],
            "highlights": [
              "计算机的软硬件",
              "模拟人类某些智能行为",
              "复杂工作"
            ],
            "sourceUnitIds": [
              "cs-23-30-p2-ai-list"
            ]
          }
        ]
      }
    ],
    "readingMeta": {
      "label": "学习导读",
      "takeaway": "大数据关注数据集合及处理挑战，云计算提供可按需调度的资源，物联网连接设备与物理世界，人工智能研究机器执行智能任务。这些技术可配合使用，但处理对象和作用不同。",
      "focus": [
        {
          "label": "大数据",
          "note": "大数据的规模、类型、流入速度或变化可能超出传统处理方式的能力，因此需要可扩展架构。数据量大不自动保证准确性或分析价值，仍需检查数据质量与方法。",
          "sourceUnitIds": [
            "cs-23-30-p1-p2-big-data-list"
          ]
        },
        {
          "label": "云计算",
          "note": "云计算通过网络按需提供共享的计算资源池，可快速分配和释放资源。资源池、按需服务与弹性是关键特征，成本、可靠性和访问权限仍取决于具体条件。",
          "sourceUnitIds": [
            "cs-23-30-p2-cloud-computing-list"
          ]
        },
        {
          "label": "物联网",
          "note": "物联网使设备通过传感、计算与网络连接同物理世界交互并交换数据。它扩展了网络连接对象，但设备需要相应接口、协议和网络条件。",
          "sourceUnitIds": [
            "cs-23-30-p2-iot-list"
          ]
        },
        {
          "label": "人工智能",
          "note": "人工智能研究用计算机软硬件模拟人类某些智能行为，使机器完成通常需要人类智能的复杂工作。",
          "sourceUnitIds": [
            "cs-23-30-p2-ai-list"
          ]
        }
      ],
      "route": [
        "大数据",
        "云计算",
        "物联网",
        "人工智能"
      ],
      "review": [
        "大数据：规模、类型、流入速度等带来处理挑战；可扩展处理不等于准确性和价值自然提高。",
        "云计算：共享资源池、按需服务和快速弹性；可靠性、成本与访问受具体条件约束。",
        "物联网：设备感知物理世界并交换数据，需要相应设备、接口、协议和网络条件。",
        "人工智能：以计算机软硬件模拟人类智能行为，让机器完成复杂智能工作。"
      ]
    },
    "keywords": [
      "大数据",
      "容量大",
      "类型多",
      "速度快",
      "云计算",
      "资源池",
      "物联网",
      "人工智能"
    ]
  },
  {
    "pointId": "information-tech",
    "tabs": [
      {
        "id": "computer-system",
        "title": "系统构成",
        "blocks": [
          {
            "type": "list",
            "label": "计算机系统的构成",
            "items": [
              "硬件系统：",
              "运算器：进行运算的部件，计算机中的数值运算采用二进制。",
              "控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。",
              "存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。",
              "输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。",
              "输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。",
              "软件系统：",
              "系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。",
              "应用软件：为解决各类实际问题而设计的程序软件。"
            ],
            "subsections": [
              {
                "headingIndex": 0,
                "childIndexes": [
                  1,
                  2,
                  3,
                  4,
                  5
                ]
              },
              {
                "headingIndex": 6,
                "childIndexes": [
                  7,
                  8
                ]
              }
            ],
            "highlights": [
              "二进制",
              "中央处理器",
              "CPU",
              "内存储器",
              "输入设备",
              "输出设备",
              "系统软件",
              "应用软件"
            ],
            "sourceUnitIds": [
              "cs-23-30-p1-computer-system-list"
            ]
          }
        ]
      },
      {
        "id": "computer-concepts",
        "title": "常见概念",
        "blocks": [
          {
            "type": "list",
            "label": "计算机常见概念",
            "items": [
              "字节（Byte）是计算机用于计量存储容量的基本单位。",
              "二进制位（bit）是计算机用于计量存储容量的最小单位。",
              "现代计量中1B=8bit。十进制前缀：1kB=1000B，1MB=1000kB，1GB=1000MB；二进制前缀：1KiB=1024B，1MiB=1024KiB，1GiB=1024MiB。传统教材和部分系统可能用KB、MB、GB指二进制倍数，题目明确采用此约定时按给定口径计算，不能把未注明的GB一概换成1024MB。",
              "计算机病毒是一段计算机程序，这种程序能依附在其他程序上自我繁殖，并能修改正常运行的程序，破坏其功能，或复制和侵入到别的程序中，令其遭到破坏。"
            ],
            "highlights": [
              "Byte",
              "bit",
              "1B=8bit",
              "1000",
              "1024",
              "KiB",
              "MiB",
              "GiB",
              "计算机病毒",
              "自我繁殖"
            ],
            "sourceUnitIds": [
              "cs-23-30-p1-computer-concepts-list"
            ]
          }
        ]
      }
    ],
    "readingMeta": {
      "label": "学习导读",
      "takeaway": "计算机系统由硬件与软件协同工作，输入和输出按信息流向区分。存储容量既要区分bit与Byte，也要确认十进制与二进制单位约定。",
      "focus": [
        {
          "label": "计算机系统的构成",
          "note": "计算机系统包括硬件和软件；运算器与控制器是CPU的核心组成。输入设备把信息送入系统，输出设备呈现处理结果；系统软件支持运行，应用软件服务具体任务。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ]
        },
        {
          "label": "计算机常见概念",
          "note": "1B=8bit。标准十进制单位按1000逐级换算，KiB、MiB、GiB按1024逐级换算；教材或题目采用传统二进制约定时按明确口径计算。计算机病毒具有依附和自我复制等特征。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-concepts-list"
          ]
        }
      ],
      "route": [
        "系统构成",
        "常见概念"
      ],
      "review": [
        "运算器执行运算，控制器协调执行；二者是CPU核心组成，硬件与软件共同完成计算任务。",
        "输入设备把人的意图传给机器；输出设备把机器结果传给人。",
        "软件：系统软件控制协调并支持应用软件；应用软件解决实际问题。",
        "1B=8bit；1MB=1000kB、1GB=1000MB，1KiB=1024B、1MiB=1024KiB、1GiB=1024MiB。先确认题目约定。",
        "计算机病毒是能依附、自我繁殖、修改或侵入其他程序并破坏功能的程序。"
      ]
    }
  }
];
  for (const u of updates) {
    const p = points.find(p => p.id === u.pointId);
    if (!p) throw new Error("Missing information point: " + u.pointId);
    p.tabs = u.tabs; p.readingMeta = u.readingMeta;
    if (u.keywords) p.keywords = u.keywords;
  }
};
