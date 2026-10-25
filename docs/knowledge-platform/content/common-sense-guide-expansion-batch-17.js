module.exports = {
  "schemaVersion": 1,
  "id": "common-sense-guide-expansion-batch-17",
  "title": "知识导读扩库第17批：生活现象与生物技术",
  "status": "candidate",
  "purpose": "将篇幅较小的完整知识组合批，避免凑数重复；技术定义按主要操作对象讲明，医学效果和不可靠机理不强行生成。",
  "groups": [
    {
      "pointId": "other-life-common-sense",
      "overview": "生活中的一些现象可由温度、气压、挥发或生物行为解释。本组保留能讲清直接原因的衣物、出行和动物行为实例，排除缺少条件的最佳做法与未经核实的身体结构断言。",
      "relation": "classification",
      "cards": [
        {
          "id": "gum-cooling",
          "title": "冷冻后较易去除口香糖",
          "explanation": "口香糖经冷冻后会变硬、变脆，因而较容易从衣物上轻轻剥离。这是利用温度改变黏附状态；实际处理还要考虑衣物材质是否允许冷冻和轻搓。",
          "productionMode": "light-edit",
          "learningGoal": "说明冷冻帮助去除口香糖的物理原因。",
          "sourceUnitIds": [
            "cs-16-22-p27-life-gum-list"
          ],
          "sourceEvidence": [
            "1.衣物上粘有口香糖难以去除，可将衣服放入冰箱，口香糖经冷冻后变脆，轻搓即可去除。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "flight-pressure",
          "title": "飞机升降时咀嚼与气压变化",
          "explanation": "飞机升降时外界气压变化可能引起耳部不适，咀嚼、吞咽有助于耳内外压力平衡。这是与气压差有关的现象，不能理解为口香糖本身具有药物作用。",
          "productionMode": "light-edit",
          "learningGoal": "说明飞机升降时咀嚼动作与气压差的关系。",
          "sourceUnitIds": [
            "cs-16-22-p27-life-flight-gum-list"
          ],
          "sourceEvidence": [
            "3.乘飞机时，乘务员发给乘客口香糖，是为了通过咀嚼动作减轻因气压差异所带来的不适。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "wine-swirling",
          "title": "摇杯为什么有助于散香",
          "explanation": "摇动酒杯会增加酒液与空气的接触并促进挥发，使香气更容易散发，同时也会影响氧化过程。该解释针对物理化学现象，不表示摇得越久品质就越好。",
          "productionMode": "light-edit",
          "learningGoal": "说明摇杯与接触空气、香气挥发的关系。",
          "sourceUnitIds": [
            "cs-16-22-p27-life-wine-list"
          ],
          "sourceEvidence": [
            "6.喝红酒前摇杯是为了增加酒与空气的接触面，让它的香味充分散发，促进它的氧化。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "blinking-protection",
          "title": "眨眼的保护作用",
          "explanation": "眨眼能帮助泪液铺展，使眼表保持湿润并减少摩擦，是眼睛的自我保护活动。它既涉及湿润，也有助于维持眼表的清洁和舒适。",
          "productionMode": "light-edit",
          "learningGoal": "说明眨眼对湿润和减少摩擦的作用。",
          "sourceUnitIds": [
            "cs-16-22-p27-life-blink-list"
          ],
          "sourceEvidence": [
            "8.眨眼能保持眼球湿润，使眼球转动时不会发生过多摩擦，是人眼的一种自我保护功能。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "dragonfly-oviposition",
          "title": "蜻蜓点水与产卵",
          "explanation": "常见的蜻蜓点水是产卵行为，卵可直接进入水中或附着在水草上。这类接触水面的行为服务于繁殖，不能简单解释为蜻蜓在饮水。",
          "productionMode": "reuse",
          "learningGoal": "识别蜻蜓点水的典型生物学含义。",
          "sourceUnitIds": [
            "cs-16-22-p27-life-dragonfly-list"
          ],
          "sourceEvidence": [
            "9.蜻蜓点水就是蜻蜓产卵，卵直接产入水中，或产于水草上。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    },
    {
      "pointId": "biotech-new-energy",
      "overview": "生物技术综合运用生命科学方法服务生产。基因、细胞、发酵和酶工程是代表方向，应先分清各自的主要操作对象，再理解它们之间的配合。",
      "relation": "classification",
      "cards": [
        {
          "id": "biotechnology-fields",
          "title": "生物技术的四类代表工程",
          "explanation": "基因工程、细胞工程、发酵工程和酶工程是生物技术的四类代表。它们分别侧重遗传信息、细胞操作、微生物生产过程和酶催化，具体技术可以相互配合。",
          "productionMode": "synthesized",
          "learningGoal": "区分四类生物技术的主要操作对象。",
          "sourceUnitIds": [
            "cs-16-22-p28-biotechnology-overview-list"
          ],
          "sourceEvidence": [
            "生物技术是20世纪70年代初开始兴起的一门新兴的综合性应用学科，以基因工程、细胞工程、酶工程、发酵工程为代表。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    },
    {
      "pointId": "gene-engineering",
      "overview": "基因工程以遗传信息操作为重点，DNA重组是代表技术。农业和医学是其应用方向，蛋白质工程则利用相关技术进一步面向蛋白质性能改进。",
      "relation": "classification",
      "cards": [
        {
          "id": "recombinant-dna",
          "title": "基因工程与DNA重组",
          "explanation": "基因工程以DNA重组等操作为代表，通过操作遗传信息获得需要的生物学功能。它以基因为主要对象，与直接操作细胞的细胞工程侧重点不同。",
          "productionMode": "light-edit",
          "learningGoal": "说明基因工程的操作对象和代表技术。",
          "sourceUnitIds": [
            "cs-16-22-p28-gene-engineering-definition-list"
          ],
          "sourceEvidence": [
            "基因工程，又称DNA重组技术，基因工程是生物工程技术的核心。现代生物技术的技术特征就是以基因工程为首要标志。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "gene-applications",
          "title": "基因工程的农业和医学应用",
          "explanation": "转基因农作物和基因治疗是基因工程的应用方向，分别面向农业性状改良和特定疾病研究、治疗。医学用途需要具体技术与适应证，不能推出所有疾病都能用基因治疗。",
          "productionMode": "light-edit",
          "learningGoal": "识别基因工程的农业和医学应用方向。",
          "sourceUnitIds": [
            "cs-16-22-p28-gene-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。转基因农作物。。基因治疗等。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "protein-engineering-relation",
          "title": "蛋白质工程与基因工程的关系",
          "explanation": "蛋白质工程在基因工程的基础上发展，利用遗传信息与蛋白质结构、功能的联系改进蛋白质性能。因此两者有技术联系，但讨论的目标层次有所不同。",
          "productionMode": "synthesized",
          "learningGoal": "说明蛋白质工程与基因工程的技术联系。",
          "sourceUnitIds": [
            "cs-16-22-p28-protein-engineering-list"
          ],
          "sourceEvidence": [
            "【知识链接】蛋白质工程。由于蛋白质工程是在基因工程的基础上发展起来的，在技术方面有诸多同基因工程技术相似的地方，因此蛋白质工程也被称为“第二代基因工程”。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    },
    {
      "pointId": "cell-engineering",
      "overview": "细胞工程以细胞层面的操作和培养为重点。体细胞杂交、核移植和干细胞技术是代表方向，学习时要区分操作对象、繁殖方式和研究用途。",
      "relation": "classification",
      "cards": [
        {
          "id": "somatic-cell-hybrid",
          "title": "体细胞杂交属于细胞工程",
          "explanation": "体细胞杂交以细胞为操作对象，通过细胞融合等方式结合不同细胞的特点。它属于细胞工程，与把不同植株组织接在一起的嫁接不是同一种技术。",
          "productionMode": "light-edit",
          "learningGoal": "识别体细胞杂交的技术类别并与嫁接区分。",
          "sourceUnitIds": [
            "cs-16-22-p28-cell-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。体细胞杂交技术，如用番茄和马铃薯培育成“番茄—马铃薯”。。核移植技术（克隆）。。干细胞技术（再生医疗技术）。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "nuclear-transfer-cloning",
          "title": "核移植与克隆",
          "explanation": "核移植技术属于细胞工程，也是建立某些克隆个体的重要途径。它通过转移细胞核实现特定操作，不能据此认为克隆个体的所有性状和经历都会与供体相同。",
          "productionMode": "light-edit",
          "learningGoal": "说明核移植的技术归属并限定克隆相同的含义。",
          "sourceUnitIds": [
            "cs-16-22-p28-cell-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。体细胞杂交技术，如用番茄和马铃薯培育成“番茄—马铃薯”。。核移植技术（克隆）。。干细胞技术（再生医疗技术）。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "stem-cell-direction",
          "title": "干细胞技术的研究方向",
          "explanation": "干细胞技术是细胞工程的重要方向，可用于细胞分化、组织修复和再生医学等研究。研究方向不等于任意商业治疗已获验证或批准。",
          "productionMode": "light-edit",
          "learningGoal": "识别干细胞技术的研究方向与临床准入区别。",
          "sourceUnitIds": [
            "cs-16-22-p28-cell-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。体细胞杂交技术，如用番茄和马铃薯培育成“番茄—马铃薯”。。核移植技术（克隆）。。干细胞技术（再生医疗技术）。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    },
    {
      "pointId": "fermentation-engineering",
      "overview": "发酵工程通过生产菌与过程控制制造产品。食品中的酵母菌、乳酸菌、霉菌、米曲霉和醋酸菌可作为代表实例，但完整工艺可能包含多类微生物。",
      "relation": "classification",
      "cards": [
        {
          "id": "microbial-production",
          "title": "发酵工程如何生产产品",
          "explanation": "发酵工程又称微生物工程，通过选择、研究或改造生产菌，并控制培养和发酵过程，实现产品的规模化生产。它强调菌种、过程条件与工业化三个环节。",
          "productionMode": "light-edit",
          "learningGoal": "说明发酵工程的菌种和过程控制特点。",
          "sourceUnitIds": [
            "cs-16-22-p28-fermentation-engineering-definition-list"
          ],
          "sourceEvidence": [
            "发酵工程，又被称为“微生物工程”，就是通过研究改造发酵所用的菌以及应用技术手段控制发酵过程来大规模工业化生产发酵产品。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "yeast-rice-wine",
          "title": "酵母菌与酒酿",
          "explanation": "酒酿制作涉及酵母菌发酵，是微生物参与食品生产的实例。传统食品可能存在多种微生物共同作用，识别代表菌不等于整个工艺只有一种菌。",
          "productionMode": "reuse",
          "learningGoal": "识别酒酿发酵中的代表微生物。",
          "sourceUnitIds": [
            "cs-16-22-p28-fermentation-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。酱油、醋、味精。。酒酿（酵母菌发酵）。。酸奶（乳酸菌发酵）。。泡菜（乳酸菌发酵）。。腐乳（霉菌发酵）。。目前近200个品种的医用抗生素、农用抗生素中，绝大多数是发酵工程的产品。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "lactic-fermentation-foods",
          "title": "酸奶和泡菜中的乳酸菌",
          "explanation": "酸奶和泡菜都与乳酸菌发酵有关，但原料、菌群和工艺不同。共同的代表菌类可以帮助识别发酵原理，不能把两种食品的生产条件直接互换。",
          "productionMode": "reuse",
          "learningGoal": "识别酸奶与泡菜共同关联的微生物类群。",
          "sourceUnitIds": [
            "cs-16-22-p28-fermentation-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。酱油、醋、味精。。酒酿（酵母菌发酵）。。酸奶（乳酸菌发酵）。。泡菜（乳酸菌发酵）。。腐乳（霉菌发酵）。。目前近200个品种的医用抗生素、农用抗生素中，绝大多数是发酵工程的产品。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "mold-fermented-tofu",
          "title": "腐乳与霉菌发酵",
          "explanation": "腐乳制作涉及霉菌发酵，是霉菌在食品加工中的应用实例。可用于食品生产的受控菌种，与食品失控霉变并不能等同。",
          "productionMode": "light-edit",
          "learningGoal": "区分腐乳受控发酵与一般食物霉变。",
          "sourceUnitIds": [
            "cs-16-22-p28-fermentation-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。酱油、醋、味精。。酒酿（酵母菌发酵）。。酸奶（乳酸菌发酵）。。泡菜（乳酸菌发酵）。。腐乳（霉菌发酵）。。目前近200个品种的医用抗生素、农用抗生素中，绝大多数是发酵工程的产品。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "soy-sauce-koji",
          "title": "酱油生产中的米曲霉",
          "explanation": "米曲霉是酱油发酵的重要微生物，可通过产生酶参与原料分解。它是代表生产菌，完整工艺还可能有其他微生物参与。",
          "productionMode": "light-edit",
          "learningGoal": "识别酱油生产中的代表菌及其作用边界。",
          "sourceUnitIds": [
            "cs-16-22-p28-fermentation-engineering-supplement-list"
          ],
          "sourceEvidence": [
            "补充：。酱油（米曲霉发酵）。。醋（醋酸菌发酵）。。味精（谷氨酸盐杆菌发酵）。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "vinegar-acetic-bacteria",
          "title": "醋生产中的醋酸菌",
          "explanation": "醋的生产与醋酸菌有关，是发酵工程的食品应用实例。醋酸菌与酒酿关联的酵母菌、酸奶关联的乳酸菌属于不同的代表微生物类群。",
          "productionMode": "light-edit",
          "learningGoal": "区分醋、酒酿和酸奶的代表微生物。",
          "sourceUnitIds": [
            "cs-16-22-p28-fermentation-engineering-supplement-list"
          ],
          "sourceEvidence": [
            "补充：。酱油（米曲霉发酵）。。醋（醋酸菌发酵）。。味精（谷氨酸盐杆菌发酵）。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    },
    {
      "pointId": "enzyme-engineering",
      "overview": "酶工程围绕酶的获得、处理和催化应用展开。它可以服务食品、轻工等生产，蛋白酶洗涤剂是日常实例，具体效果仍取决于底物和使用条件。",
      "relation": "classification",
      "cards": [
        {
          "id": "enzyme-catalysis",
          "title": "酶工程的主要工作",
          "explanation": "酶工程通过分离、提纯、固定化或改造酶，利用其催化功能服务生产。它以酶的催化作用为重点，与以整个微生物生产过程为重点的发酵工程不同。",
          "productionMode": "synthesized",
          "learningGoal": "区分酶工程与发酵工程的主要操作对象。",
          "sourceUnitIds": [
            "cs-16-22-p29-enzyme-engineering-definition-list"
          ],
          "sourceEvidence": [
            "酶工程就是用人工的方法对酶进行分离、提纯、固化以及加工改造，使其能够充分发挥快速、高效、特异的催化功能，更好地为人类生产出各种有用的产品，或促进某些生化反应过程的进行，从而达到所需要的目的。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "protease-detergent",
          "title": "蛋白酶用于加酶洗涤剂",
          "explanation": "蛋白酶可用于洗涤剂工业，帮助分解相应的蛋白质污渍。加酶洗衣粉体现了酶催化在日常产品中的应用，不表示一种酶能分解所有类型污渍。",
          "productionMode": "light-edit",
          "learningGoal": "说明蛋白酶在洗涤剂中的应用。",
          "sourceUnitIds": [
            "cs-16-22-p29-enzyme-engineering-application-list"
          ],
          "sourceEvidence": [
            "应用：。酶工程的应用主要集中于食品工业、轻工业以及医药工业中。。蛋白酶可用于洗涤剂工业。。固定化酶可以治疗先天性缺酶病或因器官缺损引起的某些功能衰竭。。日常生活中见到的加酶洗衣粉，也是酶工程的成果。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    }
  ],
  "exclusions": [
    {
      "pointId": "other-life-common-sense",
      "id": "dog-tongue-glands",
      "title": "舌头汗腺散热说",
      "reason": "正文把狗伸舌与汗腺长在舌头上直接相连，不能由行为现象推出器官分布，当前没有足够可核验证据支持原句。",
      "requiredEvidence": "先取得可直接访问的权威兽医生理资料并完成正文纠正，再评估是否建立卡片。",
      "sourceUnitIds": [
        "cs-16-22-p27-life-dog-cooling-list"
      ]
    },
    {
      "pointId": "other-life-common-sense",
      "id": "cold-water-best-thaw",
      "title": "接近零度冷水解冻最好",
      "reason": "最佳解冻方式受食品大小、密封、时间与温控影响，原句缺少条件，不能作为普遍食品安全建议。",
      "requiredEvidence": "若建设此知识点，先核验食品安全主管机构对冷藏和冷水解冻的具体条件。",
      "sourceUnitIds": [
        "cs-16-22-p27-life-meat-thaw-list"
      ]
    },
    {
      "pointId": "other-life-common-sense",
      "id": "spinach-mineral-absorption",
      "title": "菠菜焯水与矿物质吸收的普遍推断",
      "reason": "烹调和营养吸收受多种因素影响，不能由单一反应直接推出所有人的饮食效果，现有正文解释不足以支撑临床或饮食建议。",
      "requiredEvidence": "限定为明确的食品化学学习目标并取得可靠来源后，再考虑建立基础解释卡。",
      "sourceUnitIds": [
        "cs-16-22-p27-life-spinach-list"
      ]
    },
    {
      "pointId": "other-life-common-sense",
      "id": "tree-whitewash-warmth",
      "title": "刷白石灰一概保温灭菌",
      "reason": "树干涂白作用与配方、反射和害虫防治等条件有关，仅用保温灭菌不足以解释具体机制，易形成含混印象。",
      "requiredEvidence": "核验林业主管部门的涂白机理和适用条件后再建立独立知识点。",
      "sourceUnitIds": [
        "cs-16-22-p27-life-tree-whitewash-list"
      ]
    },
    {
      "pointId": "cell-engineering",
      "id": "genetic-change-only-definition",
      "title": "细胞工程等同改变遗传物质",
      "reason": "细胞操作与培养不都以创造或改变遗传物质为目的，原定义容易把细胞工程与基因工程混为一谈。",
      "requiredEvidence": "以权威课程资料界定细胞层面操作，修复定义后再考虑建立总定义卡。",
      "sourceUnitIds": [
        "cs-16-22-p28-cell-engineering-definition-list"
      ]
    },
    {
      "pointId": "fermentation-engineering",
      "id": "antibiotic-count",
      "title": "近二百种抗生素的时点数量",
      "reason": "正文未给出统计时间和品种范围，数字可能随研发和分类变化，对发酵基础理解价值有限。",
      "requiredEvidence": "如确需数量题，必须补齐正式统计来源、截止日期和品种口径。",
      "sourceUnitIds": [
        "cs-16-22-p28-fermentation-engineering-application-list"
      ]
    },
    {
      "pointId": "fermentation-engineering",
      "id": "glutamate-bacterium-name",
      "title": "谷氨酸盐杆菌名称",
      "reason": "正文菌名缺少可靠分类来源，不能把疑似误写的名称直接转为需要用户记忆的知识点。",
      "requiredEvidence": "核对味精生产菌的准确分类名称和工艺范围后修复原文，再评估卡片。",
      "sourceUnitIds": [
        "cs-16-22-p28-fermentation-engineering-supplement-list"
      ]
    },
    {
      "pointId": "enzyme-engineering",
      "id": "immobilized-enzyme-treatment",
      "title": "固定化酶治疗缺酶病的泛化",
      "reason": "具体疾病的酶替代和固定化酶用途不能笼统混用，原文未给出药物、适应证或研究阶段，不适合普通导读直接背记。",
      "requiredEvidence": "取得权威医学和药品资料并限定技术与适应证后，作为专门医学内容重新评估。",
      "sourceUnitIds": [
        "cs-16-22-p29-enzyme-engineering-application-list"
      ]
    }
  ]
};
