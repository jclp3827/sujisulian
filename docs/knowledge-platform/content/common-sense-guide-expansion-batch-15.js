module.exports = {
  "schemaVersion": 1,
  "id": "common-sense-guide-expansion-batch-15",
  "title": "知识导读扩库第 15 批：生物",
  "status": "candidate",
  "purpose": "按植物器官、动物分类、遗传物质和代谢建立独立可理解的基础知识卡，排除传粉混写、线性演化与绝对化特征。",
  "groups": [
    {
      "pointId": "biology-health",
      "overview": "生物基础包括植物的器官和种子结构、动物的主要类群、遗传物质及代谢活动。知识卡分别说明结构、分类依据和过程，并保留典型实例及必要例外。",
      "relation": "classification",
      "cards": [
        {
          "id": "vegetative-organs",
          "title": "植物的营养器官",
          "explanation": "根、茎、叶是植物常见的营养器官，参与吸收、运输和制造有机物等活动。它们与承担繁殖功能的花、果实和种子属于不同的器官类别。",
          "productionMode": "light-edit",
          "learningGoal": "区分植物的营养器官和生殖器官。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "植物的器官可分为营养器官及生殖器官。营养器官通常指植物的根、茎、叶等，而生殖器官则为花、果实、种子等。"
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
          "id": "reproductive-organs",
          "title": "被子植物的生殖器官",
          "explanation": "花、果实和种子属于被子植物的生殖器官，与根、茎、叶这类营养器官不同。这里的分类针对被子植物，不能推断所有植物都有花和果实。",
          "productionMode": "light-edit",
          "learningGoal": "说明被子植物生殖器官的范围和适用对象。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "植物的器官可分为营养器官及生殖器官。营养器官通常指植物的根、茎、叶等，而生殖器官则为花、果实、种子等。"
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
          "id": "gymnosperm-seeds",
          "title": "裸子植物的种子",
          "explanation": "裸子植物的种子没有果皮包被，因此不形成被子植物意义上的果实。区分裸子植物和被子植物时，应观察种子外是否有果皮，不能把种子本身当成果实。",
          "productionMode": "light-edit",
          "learningGoal": "说明裸子植物种子与果实的关系。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "裸子植物种子裸露，没有果皮包被，种子的胚具有2至多个子，不形成果实。"
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
          "id": "angiosperm-seeds",
          "title": "被子植物的种子与果实",
          "explanation": "被子植物的种子被包在果皮之内，能够形成果实。种子与果实不是同一结构，果皮是否包被种子是区分被子植物和裸子植物的重要依据。",
          "productionMode": "light-edit",
          "learningGoal": "区分被子植物与裸子植物的种子包被方式。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "被子植物种子不裸露，包被在果皮之内，种子的胚具有1或2个子叶，形成果实。"
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
          "id": "cotyledon-classification",
          "title": "单子叶与双子叶植物",
          "explanation": "种子胚具有1片子叶的称为单子叶植物，具有2片子叶的称为双子叶植物。这一分类依据是胚中的子叶数，不是植株长成后普通叶片的数量。",
          "productionMode": "reuse",
          "learningGoal": "识别单子叶与双子叶植物的分类依据。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "在种子的胚中发育1片子叶的称为单子叶植物，2片的称为双子叶植物。"
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
          "id": "edible-roots",
          "title": "红薯与胡萝卜是根",
          "explanation": "红薯、胡萝卜和甜菜的食用部分主要属于根。植物可把营养物质储存在不同器官中，长在地下的食用部分并不都属于根。",
          "productionMode": "light-edit",
          "learningGoal": "识别常见食用根并避免按生长位置判断器官。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "根：生活中的红薯、胡萝卜、甜菜等属于根。"
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
          "id": "underground-stems",
          "title": "藕、土豆和姜是茎",
          "explanation": "藕、土豆和姜的食用部分属于茎，虽然都生长在地下，也不能据此判为根。判断植物器官要看结构类型，不能只看地上或地下的位置。",
          "productionMode": "light-edit",
          "learningGoal": "区分地下茎与食用根的典型实例。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "茎：生活中的藕、土豆、蒜、姜属于茎。"
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
          "id": "leaf-water-saving",
          "title": "小叶片怎样减少水分散失",
          "explanation": "植物主要通过叶片气孔进行蒸腾。部分沙漠植物的叶片较小或特化为针状，可减少蒸腾导致的水分散失，有助于适应干旱环境。",
          "productionMode": "synthesized",
          "learningGoal": "说明叶片形态与减少水分散失的关系。",
          "sourceUnitIds": [
            "cs-16-22-p20-p21-plant-list"
          ],
          "sourceEvidence": [
            "叶：植物的蒸腾作用是通过叶的气孔实现的。沙漠植物通常叶片较小或特化为针状。（补充：减少蒸腾作用，减少水分散失。）"
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
          "id": "vertebrate-classification",
          "title": "有无脊柱怎样区分动物",
          "explanation": "按有无脊柱，可把动物分为脊椎动物和无脊椎动物。鱼类、两栖类、爬行类、鸟类和哺乳类属于脊椎动物，分类依据不在于生活在水中还是陆地。",
          "productionMode": "synthesized",
          "learningGoal": "说明脊椎动物的分类依据与主要类别。",
          "sourceUnitIds": [
            "cs-16-22-p21-animal-list"
          ],
          "sourceEvidence": [
            "无脊椎动物：指背侧没有脊柱的动物，是动物的原始形式。"
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
          "id": "amphibian-breathing",
          "title": "以青蛙为例理解两栖动物呼吸",
          "explanation": "青蛙幼体蝌蚪生活在水中，主要用鳃呼吸；成体主要用肺呼吸，皮肤也能辅助气体交换。这里描述典型生活史，不能推为所有两栖动物都完全相同。",
          "productionMode": "light-edit",
          "learningGoal": "说明典型两栖动物不同发育阶段的呼吸方式。",
          "sourceUnitIds": [
            "cs-16-22-p21-animal-list"
          ],
          "sourceEvidence": [
            "两栖动物：幼体生活在水中，用鳃呼吸；成体用肺呼吸，皮肤辅助呼吸，两栖生活。"
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
          "id": "amphibian-examples",
          "title": "两栖动物的代表",
          "explanation": "青蛙、蟾蜍、大鲵和蝾螈属于两栖动物。大鲵俗称娃娃鱼，但名称中带有鱼字不代表它属于鱼类。",
          "productionMode": "reuse",
          "learningGoal": "识别两栖动物并区分俗名和分类。",
          "sourceUnitIds": [
            "cs-16-22-p21-animal-list"
          ],
          "sourceEvidence": [
            "两栖动物——青蛙、蟾蜍、大鲵（娃娃鱼）、蝾螈等。"
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
          "id": "reptile-features",
          "title": "爬行动物的呼吸与体温",
          "explanation": "爬行动物用肺呼吸，通常属于变温动物，体温随环境条件变化。鳄鱼、蛇、蜥蜴和龟都属于爬行动物，不能因龟可入水就将它归为两栖动物。",
          "productionMode": "light-edit",
          "learningGoal": "说明爬行动物的基本特征并识别代表。",
          "sourceUnitIds": [
            "cs-16-22-p21-animal-list"
          ],
          "sourceEvidence": [
            "爬行动物：用肺呼吸，体温不恒定，会进行冬眠和夏眠。代表动物有鳄鱼、蛇等。"
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
          "id": "mammal-recognition",
          "title": "哺乳动物不能只按生活环境判断",
          "explanation": "猫、狗、蝙蝠、海豚和鲸都属于哺乳动物。哺乳是这类动物的重要特征，能飞或生活在水中都不能作为排除哺乳动物的依据。",
          "productionMode": "synthesized",
          "learningGoal": "识别蝙蝠、海豚和鲸的哺乳动物归属。",
          "sourceUnitIds": [
            "cs-16-22-p21-animal-list"
          ],
          "sourceEvidence": [
            "哺乳动物——猫、狗、牛、羊、马、猪、兔、鼠、猴、猿、大象、蝙蝠、海豚、鲸鱼、袋鼠、鸭嘴兽等。"
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
          "id": "platypus-exception",
          "title": "鸭嘴兽是卵生哺乳动物",
          "explanation": "鸭嘴兽通过产卵繁殖，幼体仍由母体哺乳，因此属于哺乳动物。多数哺乳动物胎生，但胎生不能被当作没有例外的判定条件。",
          "productionMode": "light-edit",
          "learningGoal": "说明鸭嘴兽的繁殖方式及其哺乳动物归属。",
          "sourceUnitIds": [
            "cs-16-22-p21-animal-list"
          ],
          "sourceEvidence": [
            "还有鸭嘴兽，虽然是卵生，但是需要母体哺乳，它也是哺乳动物！"
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
          "id": "nucleic-acid-types",
          "title": "DNA和RNA统称核酸",
          "explanation": "DNA是脱氧核糖核酸，RNA是核糖核酸，二者统称核酸。区分名称有助于理解不同生物的遗传物质以及后续基因、染色体等概念。",
          "productionMode": "reuse",
          "learningGoal": "说出DNA、RNA的中文名称及共同类别。",
          "sourceUnitIds": [
            "cs-16-22-p21-genetics-list"
          ],
          "sourceEvidence": [
            "除一部分病毒的遗传物质是核糖核酸（RNA）外，其余生物的遗传物质都是脱氧核糖核酸（DNA）。DNA和RNA统称为核酸。"
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
          "id": "hereditary-material-types",
          "title": "细胞生物与病毒的遗传物质",
          "explanation": "细胞生物以DNA作为遗传物质；病毒的遗传物质可以是DNA，也可以是RNA。判断时应先确定研究对象，不能把所有生物的遗传物质都说成DNA。",
          "productionMode": "light-edit",
          "learningGoal": "区分细胞生物与病毒遗传物质的范围。",
          "sourceUnitIds": [
            "cs-16-22-p21-genetics-list"
          ],
          "sourceEvidence": [
            "除一部分病毒的遗传物质是核糖核酸（RNA）外，其余生物的遗传物质都是脱氧核糖核酸（DNA）。DNA和RNA统称为核酸。"
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
          "id": "dna-and-genes",
          "title": "DNA与基因的关系",
          "explanation": "在以DNA为遗传物质的生物中，基因是具有遗传信息的DNA片段，一个DNA分子可以含有多个基因。基因与DNA是部分和整体的关系，不能直接等同。",
          "productionMode": "light-edit",
          "learningGoal": "说明DNA与基因的部分和整体关系。",
          "sourceUnitIds": [
            "cs-16-22-p21-genetics-list"
          ],
          "sourceEvidence": [
            "基因是带有遗传信息的DNA片段，一个DNA分子上有很多个基因。"
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
          "id": "human-chromosome-number",
          "title": "人体细胞的典型染色体数",
          "explanation": "人的典型有核体细胞具有46条染色体，组成23对。该数量用于描述通常情况，不能扩大为人体每一种细胞或所有个体都没有例外。",
          "productionMode": "light-edit",
          "learningGoal": "说明人类典型体细胞染色体数及其适用范围。",
          "sourceUnitIds": [
            "cs-16-22-p21-genetics-list"
          ],
          "sourceEvidence": [
            "人类体细胞具有46条（23对）染色体，其中44条（22对）为常染色体，另外2条（1对）为性染色体。"
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
          "id": "autosome-sex-chromosome",
          "title": "常染色体与性染色体",
          "explanation": "人类典型有核体细胞的23对染色体中，22对为常染色体，另1对为性染色体，即44条常染色体加2条性染色体。条数与对数应分清。",
          "productionMode": "reuse",
          "learningGoal": "区分常染色体与性染色体的条数和对数。",
          "sourceUnitIds": [
            "cs-16-22-p21-genetics-list"
          ],
          "sourceEvidence": [
            "人类体细胞具有46条（23对）染色体，其中44条（22对）为常染色体，另外2条（1对）为性染色体。"
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
          "id": "photosynthesis-input-output",
          "title": "植物光合作用的物质变化",
          "explanation": "植物和藻类的典型光合作用利用光能，把二氧化碳和水转化为有机物，并释放氧气。它既涉及物质转化，也把光能转变为有机物中的化学能。",
          "productionMode": "light-edit",
          "learningGoal": "说明典型光合作用的原料、产物和能量来源。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "光合作用：植物、藻类等在可见光照射下，经光反应和暗反应，利用光合色素，将二氧化碳和水转化为有机物，释放出氧气的过程。"
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
          "id": "photosynthesis-factors",
          "title": "光合作用受到哪些条件影响",
          "explanation": "光照和二氧化碳浓度都会影响植物光合作用。判断环境改变的作用时，需要结合其他条件和限制因素，不能推断光照越强或二氧化碳越多就始终越有利。",
          "productionMode": "light-edit",
          "learningGoal": "识别光合作用的影响因素并避免无条件递增判断。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "光合作用：植物、藻类等在可见光照射下，经光反应和暗反应，利用光合色素，将二氧化碳和水转化为有机物，释放出氧气的过程。影响因素有光照和二氧化碳浓度等。"
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
          "id": "aerobic-respiration",
          "title": "有氧呼吸与能量释放",
          "explanation": "典型有氧呼吸利用氧，把有机物分解为二氧化碳和水，并释放能量供生命活动使用。它与制造有机物的光合作用功能不同，植物也会进行呼吸。",
          "productionMode": "synthesized",
          "learningGoal": "区分有氧呼吸与光合作用的物质变化和功能。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "呼吸作用：有氧呼吸产物为水和二氧化碳。乳酸菌、动物、部分植物（马铃薯块茎、玉米胚、甜菜块根）无氧呼吸产物为乳酸。"
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
          "id": "lactic-acid-fermentation",
          "title": "产生乳酸的代谢过程",
          "explanation": "乳酸菌可通过乳酸发酵分解糖并获得能量，动物细胞在缺氧条件下也可通过乳酸发酵补充能量。这类过程的典型产物是乳酸，不是酒精。",
          "productionMode": "light-edit",
          "learningGoal": "区分乳酸型代谢与酒精发酵的典型产物。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "呼吸作用：有氧呼吸产物为水和二氧化碳。乳酸菌、动物、部分植物（马铃薯块茎、玉米胚、甜菜块根）无氧呼吸产物为乳酸。"
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
          "id": "yeast-alcohol-fermentation",
          "title": "酵母菌的酒精发酵",
          "explanation": "酵母菌在适宜的缺氧条件下可进行酒精发酵，典型产物是酒精和二氧化碳。它与乳酸菌的乳酸发酵在产物上不同。",
          "productionMode": "reuse",
          "learningGoal": "识别酵母菌酒精发酵的典型产物。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "酵母菌和绝大多数植物无氧呼吸产物为酒精和二氧化碳。"
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
          "id": "transpiration-process",
          "title": "蒸腾作用是水分散失过程",
          "explanation": "蒸腾作用是水分从活的植物体表面以水蒸气形式散失到大气中的过程，主要通过叶片进行。它属于水分运输与散失过程，不能与光合作用制造有机物混淆。",
          "productionMode": "light-edit",
          "learningGoal": "区分蒸腾作用与光合作用的主要过程。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "蒸腾作用：水分从活的植物体表面（主要是叶子）以水蒸气状态散失到大气中的过程。"
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
          "id": "transpiration-functions",
          "title": "蒸腾作用的运输与降温作用",
          "explanation": "蒸腾使植物表面的水分不断散失，可形成促进根部吸水和向上运输的拉力。水分蒸发还带走热量，因此蒸腾也能帮助降低叶片温度。",
          "productionMode": "light-edit",
          "learningGoal": "说明蒸腾作用对水分运输和叶片温度的影响。",
          "sourceUnitIds": [
            "cs-16-22-p21-metabolism-list"
          ],
          "sourceEvidence": [
            "蒸腾作用：水分从活的植物体表面（主要是叶子）以水蒸气状态散失到大气中的过程。能够降低叶片的温度，是植物对水分的吸收和运输的主要动力。"
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
      "id": "linear-evolution-ladder",
      "pointId": "biology-health",
      "title": "演化过程的单线阶梯",
      "reason": "动物各类群具有共同祖先并发生分支，不能把现生类群串成依次变成下一类的线性顺序；植物排序也只适合作为有限的教学概括。",
      "requiredEvidence": "若建立演化主题，应采用权威谱系资料描述共同祖先和分支，而不是将现生类群直接串联。",
      "sourceUnitIds": [
        "cs-16-22-p21-animal-list"
      ]
    },
    {
      "id": "seed-pollination-confusion",
      "pointId": "biology-health",
      "title": "把虫媒花风媒花当作种子传播方式",
      "reason": "虫媒与风媒描述花粉的传粉方式，正文将其用于种子传播，混淆两个不同的生殖阶段，原句不能进入知识卡。",
      "requiredEvidence": "应先将正文的传粉与种子传播分别校正，再按两个独立学习目标重新评估。",
      "sourceUnitIds": [
        "cs-16-22-p20-p21-plant-list"
      ]
    },
    {
      "id": "all-mammals-viviparous",
      "pointId": "biology-health",
      "title": "哺乳动物一概胎生或全身被毛",
      "reason": "鸭嘴兽是卵生哺乳动物，鲸类体毛也明显退化，不能把胎生和外观被毛作为没有例外的分类条件。",
      "requiredEvidence": "保留哺乳分类和明确例外，永久排除对胎生及被毛的绝对化描述。",
      "sourceUnitIds": [
        "cs-16-22-p21-animal-list"
      ]
    },
    {
      "id": "flower-color-main-pigment",
      "pointId": "biology-health",
      "title": "花朵主要色素一概为花青素",
      "reason": "花色涉及花青素、类胡萝卜素等多类色素与其他因素，缺少具体花种和颜色条件时不能固定一个最主要色素。",
      "requiredEvidence": "如建立花色主题，应先限定植物、色素与细胞结构的对应范围后重新评估。",
      "sourceUnitIds": [
        "cs-16-22-p20-p21-plant-list"
      ]
    },
    {
      "id": "all-reptiles-dormancy",
      "pointId": "biology-health",
      "title": "所有爬行动物都会冬眠夏眠",
      "reason": "休眠取决于物种和环境，不是全部爬行动物都会发生的行为，不能将其用于普遍分类定义。",
      "requiredEvidence": "保留肺呼吸和变温的一般特征，休眠需限定具体物种及环境后再评估。",
      "sourceUnitIds": [
        "cs-16-22-p21-animal-list"
      ]
    },
    {
      "id": "percentage-without-boundary",
      "pointId": "biology-health",
      "title": "被子植物85%与有颌类99.8%",
      "reason": "百分比缺少统计对象、分类系统和时间边界，对基础分类理解价值有限，不适合作为长期稳定记忆卡。",
      "requiredEvidence": "如有明确学习用途，先补齐权威统计来源、分母定义和发布日期后重新评估。",
      "sourceUnitIds": [
        "cs-16-22-p21-animal-list"
      ]
    },
    {
      "id": "whole-pistil-becomes-fruit",
      "pointId": "biology-health",
      "title": "把整个雌蕊笼统写成果实来源",
      "reason": "通常由子房发育为果实，胚珠发育为种子，正文直接说雌蕊发育而来过于宽泛，不能用于精确结构对应。",
      "requiredEvidence": "正文明确子房与胚珠等结构及假果例外后，再建立果实发育卡。",
      "sourceUnitIds": [
        "cs-16-22-p20-p21-plant-list"
      ]
    },
    {
      "id": "garlic-organ-single-label",
      "pointId": "biology-health",
      "title": "将整个蒜一概视为茎",
      "reason": "蒜的鳞茎包含短缩茎和肉质鳞叶等结构，食用部分不能用一个未经限定的茎标签覆盖。",
      "requiredEvidence": "明确考察对象是鳞茎整体还是食用鳞叶后，依据结构重新评估。",
      "sourceUnitIds": [
        "cs-16-22-p20-p21-plant-list"
      ]
    }
  ]
};
