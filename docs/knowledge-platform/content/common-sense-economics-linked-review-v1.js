const QUESTION_PATCHES={
  "market-allocation-meaning": {
    "objective": "由价格、供求和竞争等分散决策识别市场配置",
    "explanation": "依靠价格、供求、竞争等市场机制，由分散主体作决策来配置资源，属于市场配置；生产调整可能存在时间差，但不是所有市场决策都只能事后进行。",
    "boundary": "区分市场配置方式与调节可能滞后的局限，不考比喻的著作出处。"
  },
  "market-defects": {
    "objective": "区分逐利不当行为、信息不足与生产调整时间差",
    "options": [
      "自发性，过度逐利可能诱发不正当行为",
      "盲目性，信息不足导致决策一哄而上",
      "滞后性，信号传递与生产调整存在时间差"
    ],
    "boundary": "逐利动机、信息不足与调整时间差是不同判断线索；三者可能同时出现，盲目性不直接等于滞后性的原因。"
  },
  "resource-allocation-market-full": {
    "options": [
      "市场依靠价格供求竞争风险等机制；过度逐利可能引发不当行为，信息不足可导致盲目跟风，生产调整可能存在时间差",
      "市场只靠统一计划指标配置资源；自发性源于信息充分，盲目性源于事前统一安排和集中决策",
      "市场不包含风险和竞争机制；滞后性表示生产者能够在供求与价格变化发生前准确调整供给"
    ],
    "explanation": "市场机制通过分散决策配置资源；三类局限分别涉及逐利动机、信息不足及信号传递与生产调整之间的时间差。"
  },
  "market-order-rules": {
    "objective": "识别市场准入、竞争和交易规则",
    "options": [
      "市场准入规则、市场竞争规则、市场交易规则",
      "价格机制、供求机制、风险机制",
      "消费品市场、资本市场、劳动力市场"
    ],
    "explanation": "主体进入市场的条件对应准入规则，竞争方式对应竞争规则，具体交易过程对应交易规则。法律可以规范这些规则，不宜把法律规范与三类规则简单并列替代准入。"
  },
  "market-definition-elements-full": {
    "options": [
      "市场是交换关系总和；主体参与、客体被交换、行为完成交易，正常秩序由准入、竞争和交易规则等维护",
      "市场必须有固定场所；主体指被交换商品，客体指交易者，行为等同法律规范，秩序只看价格变化",
      "市场只由买卖行为组成而没有主体客体；秩序无需竞争与交易规则，线上商品服务交换不属于市场"
    ],
    "explanation": "市场不以固定场所为必要条件。主体、客体、行为和秩序分别说明参与者、交换对象、活动及规范，市场规则主要包括准入、竞争和交易规则。"
  },
  "demand-price-elasticity": {
    "objective": "以需求量与价格的百分比变化识别需求价格弹性",
    "prompt": "在其他条件不变时，甲商品降价5%后需求量增加20%，乙商品同幅降价后需求量增加2%。比较需求对价格变化的敏感程度，主要使用什么概念？",
    "explanation": "需求价格弹性是需求量变动百分比与价格变动百分比的比值，通常比较其绝对值。在相同价格降幅下，需求量增加百分比越大，价格反应越敏感。",
    "boundary": "比较百分比而非绝对销量；保持其他相关条件不变，不把本题推广为所有商品的固定弹性。"
  },
  "demand-supply-basic-full": {
    "options": [
      "需求看消费者愿买且能买，供给看生产者愿卖且能供；需求价格弹性比较量变与价变的百分比，成本也会影响供给",
      "需求由生产者出售意愿决定，供给由消费者购买愿望决定；价格弹性只比较企业成本，成本上升推动供给增加",
      "需求有购买愿望即可，供给有生产意愿即可；需求量不受价格变化影响，生产成本也不进入供给判断"
    ],
    "explanation": "需求和供给均要求意愿与能力同时具备；需求价格弹性比较需求量与价格的百分比变化。在其他条件不变时，成本上升通常抑制供给。"
  },
  "market-failure-factor-externality": {
    "prompt": "某项经济活动让未直接参与交易的居民承担未获补偿的污染成本，且没有计入交易价格。这首先对应哪类市场失灵因素？",
    "explanation": "未直接参与交易的第三方承担未计入价格、未获补偿的外部成本，属于外部性；本例是负外部性。",
    "boundary": "第三方是未直接参与该交易，不是与经济活动毫无联系；仅有一般影响或正常价格变化不足以认定外部性。"
  },
  "market-failure-monopoly-chain": {
    "options": [
      "增加企业数量→充分竞争→信息更完整→机制失灵",
      "限制供给并提高价格→产量可能偏离有效竞争水平→资源配置效率受损",
      "提高劳动效率→降低单位成本→消费者选择增加→机制失灵"
    ],
    "explanation": "市场势力可能使企业限制产量、提高价格，使产量偏离有效竞争水平并造成效率损失。单纯价格上涨或企业规模较大不能直接证明该机制。"
  },
  "market-failure-monopoly-remedy": {
    "prompt": "依法治理排除、限制竞争的垄断行为，合理的方向是哪项？",
    "options": [
      "扩大货币发行并统一行业工资",
      "取消市场交易并禁止企业经营",
      "依法制止垄断协议、滥用市场支配地位等行为，维护公平竞争"
    ],
    "explanation": "反垄断法依法预防和制止垄断协议、滥用市场支配地位等行为。特定自然垄断环节可依法监管，不能简单把所有大企业都限价。",
    "boundary": "区分市场结构分析与违法行为认定，本题不裁定具体案件。"
  },
  "market-failure-monopoly-full": {
    "options": [
      "企业规模较大可替代生产销售控制条件，并据此推断市场失灵",
      "市场势力可能通过限产提价损害配置效率；应依法维护公平竞争，不把市场地位直接等同违法行为",
      "价格上涨发生在作用链起点，随后才出现供给控制和产量调节"
    ],
    "explanation": "市场势力可能影响产量和价格并造成效率损失，依法治理应针对排除、限制竞争的行为及相应规则，规模或市场地位本身不等于违法。"
  },
  "market-failure-externality-definition": {
    "options": [
      "经济活动对未直接参与交易的第三方造成未充分计入价格或补偿的成本收益",
      "交易双方已把相关成本和收益写入合同并充分承担",
      "市场价格随供求关系正常变化并影响交易双方"
    ],
    "explanation": "外部性要求交易之外的第三方成本或收益未被充分计入相关价格或补偿安排。“未直接参与交易”不能误解为与活动完全没有关联。",
    "boundary": "不把充分内部化的成本收益或正常价格变化直接判作外部性。"
  },
  "market-failure-externality-types": {
    "prompt": "甲活动使未参与交易的第三方获得未付费的收益，乙活动使第三方承担未补偿的成本。甲、乙依次属于？",
    "explanation": "第三方获得未充分付费的外部收益对应正外部性，承担未补偿外部成本对应负外部性；正负不由行为者主观动机决定。"
  },
  "market-failure-negative-externality": {
    "prompt": "某生产活动使周边居民承担未补偿且未计入产品价格的污染成本。若选择纠正性征税工具，其作用方向是什么？",
    "explanation": "纠正性征税可使行为者在决策中考虑外部成本，从而约束相关活动。征税只是治理工具之一，不能推出税额必然等于全部损害或所有情形只能征税。"
  },
  "market-failure-positive-externality": {
    "prompt": "某活动使周边居民获得未向行为者付费的外部收益。若选择补贴工具，其作用方向是什么？",
    "explanation": "补贴可提高行为者开展有外部收益活动的激励。存在正外部性不自动决定必须补贴，是否采用及补贴标准还需结合具体条件。"
  },
  "market-failure-externality-full": {
    "prompt": "在外部影响未被价格充分反映、并选择征税或补贴工具时，下列治理方向对应正确的是？",
    "explanation": "正外部性可考虑补贴以增强供给激励；负外部性可考虑征税使行为者考虑外部成本。具体工具及标准依条件而定，不由正负名称直接决定。",
    "boundary": "先核对未直接参与交易的第三方及未内部化的成本收益；征税和补贴不是各类情形的强制固定答案。"
  },
  "pure-quasi-public-goods": {
    "options": [
      "纯公共物品兼具非竞争性与非排他性；准公共物品至少一项特征表现不充分，需结合拥挤和排他条件判断",
      "纯公共物品只具有非排他性、不具非竞争性；准公共物品同时具有竞争性和排他性",
      "纯公共物品与准公共物品都完整具有竞争性和排他性"
    ],
    "explanation": "本节按公共性特征是否充分区分纯与准公共物品。准公共物品可能受拥挤或排他条件影响，不能仅凭名称判断。"
  },
  "public-goods-free-rider-remedy": {
    "prompt": "某公共服务难以排除未付费者，私人筹资因此可能不足。下列哪种安排有助于提供该服务？",
    "options": [
      "政府依法筹资或购买服务，并可由企业、社会组织等具体生产提供",
      "只允许已经付费者享受，却不改变难以排除未付费者的条件",
      "减少信息披露并保证市场一定自动补足"
    ],
    "explanation": "非排他性可能引发搭便车并削弱筹资激励。政府筹资或购买服务可以支持供给，筹资、供给责任与具体生产主体可以分离。",
    "boundary": "不能把供给不足说成绝无供给，也不能把政府承担责任说成必须亲自完成全部生产。"
  },
  "public-goods-full": {
    "options": [
      "严格公共物品兼具非竞争性与非排他性；搭便车可能造成供给不足，政府可筹资或购买服务支持供给",
      "公共物品具有竞争性和排他性，购买者越多越容易形成充分市场供给和有效配置",
      "准公共物品与纯公共物品的两项特征强度相同，因此不需要区分"
    ],
    "explanation": "非竞争性说明消费不挤占他人，非排他性使排除未付费者困难并可能引发搭便车。政府可支持筹资和供给，但不是说市场绝无供给方式。"
  },
  "information-asymmetry-definition": {
    "explanation": "信息不对称是交易一方掌握的相关信息多于另一方。信息不完全则是缺少必要信息；双方都信息不足，不一定说明双方信息不对称。"
  },
  "adverse-selection-before": {
    "explanation": "交易前质量信息存在差异，买方的统一低报价可能使优质商品退出，体现逆向选择的一种机制。并非逆向选择只能表现为差商品挤出好商品。",
    "boundary": "结合交易前隐藏质量或类型的条件判断，不仅凭发生时间判断，也不认为所有市场都会出现优质商品退出。"
  },
  "information-asymmetry-remedy": {
    "prompt": "交易一方更了解商品质量，另一方难以识别。下列哪种安排有助于缓解信息差异？",
    "options": [
      "依法披露重要信息，并结合第三方认证、信誉和合同约束",
      "限制交易者接触商品质量、合同条件和风险变化等相关信息",
      "通过扩大货币发行直接消除交易信息差异"
    ],
    "explanation": "信息披露、认证、信誉和合同等机制可缓解信息不对称，依法监管也可发挥作用；这些措施不能保证消除所有信息不足或风险。"
  },
  "information-asymmetry-full": {
    "options": [
      "逆向选择—交易后隐藏行为利己损他；道德风险—交易前差品挤出好品并退出市场",
      "逆向选择—通常涉及交易前隐藏质量或类型；道德风险—通常涉及交易后难以观察或约束的行为",
      "逆向选择与道德风险都只由商品价格正常波动造成"
    ],
    "explanation": "逆向选择关注事前难以识别的质量或类型，道德风险关注事后隐蔽行为。差品挤出好品是逆向选择的一种可能表现，不是所有情形的必要结果。"
  }
};
const TARGET_PATCHES={
  "cs-target-market-allocation-meaning": {
    "statement": "说明市场配置依靠分散主体对市场信号作决策。",
    "conclusion": "市场配置依靠价格、供求、竞争等机制；调整可能存在时间差，但不代表所有决策只能事后进行。",
    "conditions": [
      "区分配置方式与滞后性的局限。"
    ]
  },
  "cs-target-market-defects": {
    "statement": "区分市场逐利动机、信息不足和调整时间差。",
    "conclusion": "自发性涉及逐利可能带来的不当行为，盲目性涉及信息不足，滞后性涉及信号传递和生产调整时间差。",
    "conditions": [
      "按题干首要机制判断，三者可能并存。"
    ]
  },
  "cs-target-market-order-rules": {
    "statement": "识别准入、竞争和交易三类市场规则。",
    "conclusion": "市场准入规则、竞争规则和交易规则分别规范进入条件、竞争方式及交易行为。",
    "conditions": [
      "法律可规范各类规则，不能简单用法律规范替代准入分类。"
    ]
  },
  "cs-target-demand-price-elasticity": {
    "statement": "以需求量与价格百分比变化说明需求价格弹性。",
    "conclusion": "需求价格弹性比较需求量变动百分比与价格变动百分比，通常用绝对值比较反应程度。",
    "conditions": [
      "保持其他条件不变，不比较绝对销量和绝对价格变化。"
    ]
  },
  "cs-target-market-failure-externality-factor": {
    "statement": "识别交易外部的未内部化成本收益。",
    "conclusion": "未直接参与交易的第三方承担未补偿成本或获得未付费收益，体现外部性。",
    "conditions": [
      "不能仅凭存在任何影响认定外部性。"
    ]
  },
  "cs-target-market-failure-monopoly-chain": {
    "statement": "说明市场势力如何可能损害配置效率。",
    "conclusion": "市场势力可能通过限产提价，使产量偏离有效竞争水平。",
    "conditions": [
      "企业规模、市场地位或价格高均不足以单独证明违法或效率损失。"
    ]
  },
  "cs-target-market-failure-monopoly-remedy": {
    "statement": "识别依法维护公平竞争的治理方向。",
    "conclusion": "依法预防和制止垄断协议、滥用市场支配地位等排除限制竞争的行为，特定环节可依法监管。",
    "conditions": [
      "不等于对所有大企业统一限价。"
    ]
  },
  "cs-target-market-failure-externality-definition": {
    "statement": "说明外部性的第三方与未内部化条件。",
    "conclusion": "经济活动对未直接参与交易的第三方造成未充分计入价格或补偿安排的成本收益，形成外部性。",
    "conditions": [
      "第三方并非与活动毫无联系。"
    ]
  },
  "cs-target-market-failure-externality-types": {
    "statement": "区分外部收益与外部成本。",
    "conclusion": "未被充分付费的外部收益对应正外部性，未获充分补偿的外部成本对应负外部性。",
    "conditions": [
      "正负依据第三方影响，不按行为动机判断。"
    ]
  },
  "cs-target-market-failure-negative-externality": {
    "statement": "识别负外部性及纠正性征税的方向。",
    "conclusion": "征税可促使行为者考虑外部成本，具体是否征税及税额须结合条件。",
    "conditions": [
      "负外部性并不只能通过税收解决。"
    ]
  },
  "cs-target-market-failure-positive-externality": {
    "statement": "识别正外部性及补贴激励方向。",
    "conclusion": "补贴可增强开展有外部收益活动的激励，但不自动由正外部性推出必须补贴。",
    "conditions": [
      "结合外部收益、成本与实施条件判断。"
    ]
  },
  "cs-target-pure-quasi-public-goods": {
    "statement": "结合具体使用条件区分纯与准公共物品。",
    "conclusion": "纯公共物品兼具非竞争性与非排他性，准公共物品至少一项特征不充分。",
    "conditions": [
      "说明拥挤或排他条件，不凭名称分类。"
    ]
  },
  "cs-target-public-goods-failure-remedy": {
    "statement": "说明搭便车对筹资的影响及政府支持供给的方式。",
    "conclusion": "非排他性可能引发搭便车、削弱筹资激励；政府可筹资或购买服务，生产提供可由不同主体承担。",
    "conditions": [
      "不将供给不足绝对化为没有供给，不混同筹资与生产。"
    ]
  },
  "cs-target-information-asymmetry-definition": {
    "statement": "区分信息不对称与信息不完全。",
    "conclusion": "交易双方信息存在差异是信息不对称，缺少必要信息是信息不完全，两者不是同义词。",
    "conditions": [
      "比较双方掌握的相关信息，而非只看是否信息不足。"
    ]
  },
  "cs-target-adverse-selection-before": {
    "statement": "依据事前隐藏质量或类型识别逆向选择。",
    "conclusion": "交易前质量或类型的信息差可能影响参与对象构成，高风险或低质量对象更易进入或优质对象退出。",
    "conditions": [
      "差品挤出好品只是可能表现，不是普遍必然结果。"
    ]
  },
  "cs-target-information-asymmetry-remedy": {
    "statement": "识别缓解交易信息差的制度安排。",
    "conclusion": "披露、认证、信誉、合同及依法监管可缓解信息不对称。",
    "conditions": [
      "不保证消除全部信息不足或交易风险。"
    ]
  }
};
const LEGACY_MEMORY_PATCHES={
  "resource-allocation-market-memory": {
    "text": "市场依靠价格、供求、竞争、风险等机制；逐利不当偏自发，信息不足偏盲目，生产调整时间差偏滞后。",
    "conditions": [
      "市场机制可以用于事前决策，不能把市场配置概括为所有决策都只能事后进行。"
    ],
    "phrasePatches": {
      "allocation-memory-market": {
        "phrase": "市场信号，分散决策",
        "meaning": "市场配置依靠分散主体对价格、供求和竞争等信号作决策。"
      },
      "allocation-memory-defects": {
        "phrase": "逐利自发，信息盲目，时差滞后",
        "meaning": "分别核对逐利动机、信息不足和信号传递生产调整的时间差。"
      }
    }
  },
  "market-definition-elements-memory": {
    "text": "市场是交换关系，不拘固定场所；主体、客体、行为、秩序；秩序依靠准入、竞争和交易规则。",
    "phrasePatches": {
      "market-elements-memory-rules": {
        "phrase": "准入、竞争、交易规则",
        "meaning": "三类规则分别规范市场进入、竞争方式和交易行为。"
      }
    }
  },
  "demand-supply-basic-memory": {
    "text": "需求与供给都需要意愿和能力；需求价格弹性比较需求量与价格的百分比变化；供给还受成本等因素影响。",
    "coverage": "需求、供给的双重条件；需求价格弹性的百分比口径；成本等供给因素。",
    "phrasePatches": {
      "cs-target-demand-price-elasticity-memory": {
        "phrase": "弹性比较量价百分比",
        "meaning": "需求价格弹性比较需求量与价格的百分比变化，通常用绝对值比较。"
      }
    }
  },
  "market-failure-monopoly-memory": {
    "text": "市场势力可能限产提价、影响配置效率；依法维护竞争，不把市场地位直接认作违法行为。",
    "coverage": "市场势力的效率影响及依法维护公平竞争。",
    "conditions": [
      "不从规模大或价格高直接推断违法垄断；具体监管须依法判断。"
    ],
    "phrasePatches": {
      "market-failure-monopoly-memory-chain": {
        "phrase": "限产提价可能损效率",
        "meaning": "市场势力可能使产量偏离有效竞争水平，不是所有价格变化都证明失灵。"
      },
      "market-failure-monopoly-memory-remedy": {
        "phrase": "依法维护公平竞争",
        "meaning": "依法制止排除限制竞争的行为，特定自然垄断环节可依法监管。"
      }
    }
  },
  "market-failure-externality-memory": {
    "text": "交易之外的未内部化成本收益，分别构成负与正外部性；征税、补贴等工具须结合条件选择。",
    "conditions": [
      "第三方未直接参与交易；成本收益未被价格或补偿充分内部化。",
      "负外部性不只靠征税，正外部性不自动要求补贴。"
    ],
    "phrasePatches": {
      "market-failure-externality-memory-types": {
        "phrase": "交易外部的成本与收益",
        "meaning": "未获补偿外部成本为负，未充分付费外部收益为正。"
      },
      "market-failure-externality-memory-remedies": {
        "phrase": "税补方向依条件",
        "meaning": "税收可使行为者考虑外部成本，补贴可增强外部收益活动激励，具体工具须按条件选择。"
      }
    }
  },
  "public-goods-mechanism-memory": {
    "text": "非竞争说明不挤占，非排他说明难排除；纯与准看具体条件；搭便车可能削弱筹资，筹资与生产可分离。",
    "conditions": [
      "不能将供给不足写成没有任何供给、价格或筹资方式。"
    ],
    "phrasePatches": {
      "public-goods-memory-features": {
        "phrase": "不挤占，难排除",
        "meaning": "非竞争性与非排他性分别描述消费数量关系和排除未付费者的难易。"
      },
      "public-goods-memory-types": {
        "phrase": "纯与准，按条件区分",
        "meaning": "纯公共物品兼具两项特征，准公共物品至少一项表现不充分，需明确使用条件。"
      },
      "public-goods-memory-remedy": {
        "phrase": "搭便车影响筹资，筹资生产可分",
        "meaning": "非排他性可能削弱筹资激励；政府筹资或购买服务时，可以由其他主体具体生产提供。"
      }
    }
  },
  "information-asymmetry-memory": {
    "text": "信息缺少不等于双方信息差；事前隐藏质量类型可致逆向选择，事后隐藏行为可致道德风险；披露认证信誉合同有助缓解。",
    "conditions": [
      "不能只按时间判断，也不把优质商品退出或全部风险消失当作必然结果。"
    ],
    "phrasePatches": {
      "information-memory-definition": {
        "phrase": "信息缺少与信息差分开",
        "meaning": "不完全是缺必要信息，不对称是交易双方相关信息有差异。"
      },
      "information-memory-risks": {
        "phrase": "事前隐藏类型，事后隐藏行为",
        "meaning": "逆向选择通常涉及事前难辨质量类型，道德风险通常涉及事后难观察行为。"
      },
      "information-memory-remedy": {
        "phrase": "披露认证信誉合同",
        "meaning": "这些安排及依法监管可缓解信息差，但不保证消除全部风险。"
      }
    }
  }
};
const SPEC_PATCHES={
  "market-defects": {
    "2": "滞后性强调信号传递与生产调整的时间差，本题首先强调信息不足导致跟风。"
  },
  "resource-allocation-market-full": {
    "2": "竞争和风险属于市场机制；滞后性强调时间差，不是提前准确调整。"
  }
};
const REVIEWED={
  "questions": [
    "market-failure-factor-monopoly",
    "market-failure-factor-externality",
    "market-failure-factor-public-goods",
    "market-failure-factor-information",
    "market-failure-monopoly-definition",
    "market-failure-monopoly-chain",
    "market-failure-monopoly-remedy",
    "market-failure-monopoly-full",
    "market-failure-externality-definition",
    "market-failure-externality-types",
    "market-failure-negative-externality",
    "market-failure-positive-externality",
    "market-failure-externality-full",
    "public-goods-features",
    "public-private-goods-contrast",
    "pure-quasi-public-goods",
    "public-goods-free-rider-remedy",
    "public-goods-full",
    "information-asymmetry-definition",
    "adverse-selection-before",
    "moral-hazard-after",
    "information-asymmetry-remedy",
    "information-asymmetry-full",
    "market-allocation-meaning",
    "market-mechanisms",
    "market-defects",
    "resource-allocation-market-full",
    "market-four-elements",
    "market-element-roles",
    "market-order-rules",
    "market-definition-elements-full",
    "enterprise-three-forms",
    "enterprise-legal-status",
    "company-two-forms",
    "enterprise-organization-full",
    "socialist-market-meaning",
    "socialist-market-framework-full",
    "demand-price-elasticity",
    "demand-supply-basic-full",
    "equilibrium-price-limits",
    "supply-demand-equilibrium-full",
    "q1-market-boundary",
    "q1-market-application"
  ],
  "targets": [
    "cs-target-market-failure-monopoly-factor",
    "cs-target-market-failure-externality-factor",
    "cs-target-market-failure-public-goods-factor",
    "cs-target-market-failure-information-factor",
    "cs-target-market-failure-monopoly-definition",
    "cs-target-market-failure-monopoly-chain",
    "cs-target-market-failure-monopoly-remedy",
    "cs-target-market-failure-externality-definition",
    "cs-target-market-failure-externality-types",
    "cs-target-market-failure-negative-externality",
    "cs-target-market-failure-positive-externality",
    "cs-target-public-goods-features",
    "cs-target-public-private-goods-contrast",
    "cs-target-pure-quasi-public-goods",
    "cs-target-public-goods-failure-remedy",
    "cs-target-information-asymmetry-definition",
    "cs-target-adverse-selection-before",
    "cs-target-moral-hazard-after",
    "cs-target-information-asymmetry-remedy",
    "cs-target-market-allocation-meaning",
    "cs-target-market-mechanisms",
    "cs-target-market-defects",
    "cs-target-market-four-elements",
    "cs-target-market-element-roles",
    "cs-target-market-order-rules",
    "cs-target-enterprise-three-forms",
    "cs-target-enterprise-legal-status",
    "cs-target-company-two-forms",
    "cs-target-socialist-market-meaning",
    "cs-target-demand-price-elasticity",
    "cs-target-equilibrium-price-limits",
    "q1-target-market-failure-external-cost",
    "q1-target-market-failure-adverse-selection"
  ],
  "mnemonics": [
    "market-failure-monopoly-memory",
    "market-failure-externality-memory",
    "public-goods-mechanism-memory",
    "information-asymmetry-memory",
    "resource-allocation-market-memory",
    "market-definition-elements-memory",
    "enterprise-organization-memory",
    "socialist-market-framework-memory",
    "demand-supply-basic-memory",
    "supply-demand-equilibrium-memory"
  ]
};
module.exports=function(pack){
 for(const [kind,patches] of [["questions",QUESTION_PATCHES],["targets",TARGET_PATCHES],["mnemonics",LEGACY_MEMORY_PATCHES]]){for(const [id,delta] of Object.entries(patches)){const item=pack[kind].find(x=>x.id===id);if(!item)throw Error("Missing reviewed item "+id);const {phrasePatches,...fields}=delta;Object.assign(item,fields,{revision:item.revision+1});if(phrasePatches)item.phrases=item.phrases.map(p=>({...p,...phrasePatches[p.id]}));}}
 for(const s of pack.questionSpecifications){if(SPEC_PATCHES[s.questionId])s.distractorReasons={...s.distractorReasons,...SPEC_PATCHES[s.questionId]};}
 for(const s of pack.mnemonicSpecifications){const item=pack.mnemonics.find(x=>x.id===s.mnemonicId);if(LEGACY_MEMORY_PATCHES[s.mnemonicId]){s.revision=item.revision;s.conditionCount=item.conditions.length;}}
 pack.version="2026-10-24.1";
 pack.sessionMigrations=pack.sessionMigrations.concat([
  {
    "fromVersion": "6dc5309b",
    "toPackVersion": "2026-10-24.1",
    "changedQuestionIds": [
      "market-failure-factor-monopoly",
      "market-failure-factor-externality",
      "market-failure-factor-public-goods",
      "market-failure-factor-information",
      "market-failure-monopoly-definition",
      "market-failure-monopoly-chain",
      "market-failure-monopoly-remedy",
      "market-failure-monopoly-full",
      "market-failure-externality-definition",
      "market-failure-externality-types",
      "market-failure-negative-externality",
      "market-failure-positive-externality",
      "market-failure-externality-full",
      "public-goods-features",
      "public-private-goods-contrast",
      "pure-quasi-public-goods",
      "public-goods-free-rider-remedy",
      "public-goods-full",
      "information-asymmetry-definition",
      "adverse-selection-before",
      "moral-hazard-after",
      "information-asymmetry-remedy",
      "information-asymmetry-full",
      "market-allocation-meaning",
      "market-mechanisms",
      "market-defects",
      "resource-allocation-market-full",
      "market-four-elements",
      "market-element-roles",
      "market-order-rules",
      "market-definition-elements-full",
      "enterprise-three-forms",
      "enterprise-legal-status",
      "company-two-forms",
      "enterprise-organization-full",
      "socialist-market-meaning",
      "socialist-market-framework-full",
      "demand-price-elasticity",
      "demand-supply-basic-full",
      "equilibrium-price-limits",
      "supply-demand-equilibrium-full",
      "q1-market-boundary",
      "q1-market-application"
    ],
    "changedMnemonicIds": [
      "market-failure-monopoly-memory",
      "market-failure-externality-memory",
      "public-goods-mechanism-memory",
      "information-asymmetry-memory",
      "resource-allocation-market-memory",
      "market-definition-elements-memory",
      "enterprise-organization-memory",
      "socialist-market-framework-memory",
      "demand-supply-basic-memory",
      "supply-demand-equilibrium-memory"
    ],
    "reason": "经济正文来源修复后逐项复核；受影响会话失效，不相关会话按既有机制延续。"
  },
  {
    "fromVersion": "b34fca4c",
    "toPackVersion": "2026-10-24.1",
    "changedQuestionIds": [
      "market-failure-factor-monopoly",
      "market-failure-factor-externality",
      "market-failure-factor-public-goods",
      "market-failure-factor-information",
      "market-failure-monopoly-definition",
      "market-failure-monopoly-chain",
      "market-failure-monopoly-remedy",
      "market-failure-monopoly-full",
      "market-failure-externality-definition",
      "market-failure-externality-types",
      "market-failure-negative-externality",
      "market-failure-positive-externality",
      "market-failure-externality-full",
      "public-goods-features",
      "public-private-goods-contrast",
      "pure-quasi-public-goods",
      "public-goods-free-rider-remedy",
      "public-goods-full",
      "information-asymmetry-definition",
      "adverse-selection-before",
      "moral-hazard-after",
      "information-asymmetry-remedy",
      "information-asymmetry-full",
      "market-allocation-meaning",
      "market-mechanisms",
      "market-defects",
      "resource-allocation-market-full",
      "market-four-elements",
      "market-element-roles",
      "market-order-rules",
      "market-definition-elements-full",
      "enterprise-three-forms",
      "enterprise-legal-status",
      "company-two-forms",
      "enterprise-organization-full",
      "socialist-market-meaning",
      "socialist-market-framework-full",
      "demand-price-elasticity",
      "demand-supply-basic-full",
      "equilibrium-price-limits",
      "supply-demand-equilibrium-full",
      "q1-market-boundary",
      "q1-market-application"
    ],
    "changedMnemonicIds": [
      "market-failure-monopoly-memory",
      "market-failure-externality-memory",
      "public-goods-mechanism-memory",
      "information-asymmetry-memory",
      "resource-allocation-market-memory",
      "market-definition-elements-memory",
      "enterprise-organization-memory",
      "socialist-market-framework-memory",
      "demand-supply-basic-memory",
      "supply-demand-equilibrium-memory"
    ],
    "reason": "经济正文来源修复后逐项复核；受影响会话失效，不相关会话按既有机制延续。"
  },
  {
    "fromVersion": "ba81f963",
    "toPackVersion": "2026-10-24.1",
    "changedQuestionIds": [
      "market-failure-factor-monopoly",
      "market-failure-factor-externality",
      "market-failure-factor-public-goods",
      "market-failure-factor-information",
      "market-failure-monopoly-definition",
      "market-failure-monopoly-chain",
      "market-failure-monopoly-remedy",
      "market-failure-monopoly-full",
      "market-failure-externality-definition",
      "market-failure-externality-types",
      "market-failure-negative-externality",
      "market-failure-positive-externality",
      "market-failure-externality-full",
      "public-goods-features",
      "public-private-goods-contrast",
      "pure-quasi-public-goods",
      "public-goods-free-rider-remedy",
      "public-goods-full",
      "information-asymmetry-definition",
      "adverse-selection-before",
      "moral-hazard-after",
      "information-asymmetry-remedy",
      "information-asymmetry-full",
      "market-allocation-meaning",
      "market-mechanisms",
      "market-defects",
      "resource-allocation-market-full",
      "market-four-elements",
      "market-element-roles",
      "market-order-rules",
      "market-definition-elements-full",
      "enterprise-three-forms",
      "enterprise-legal-status",
      "company-two-forms",
      "enterprise-organization-full",
      "socialist-market-meaning",
      "socialist-market-framework-full",
      "demand-price-elasticity",
      "demand-supply-basic-full",
      "equilibrium-price-limits",
      "supply-demand-equilibrium-full",
      "q1-market-boundary",
      "q1-market-application"
    ],
    "changedMnemonicIds": [
      "market-failure-monopoly-memory",
      "market-failure-externality-memory",
      "public-goods-mechanism-memory",
      "information-asymmetry-memory",
      "resource-allocation-market-memory",
      "market-definition-elements-memory",
      "enterprise-organization-memory",
      "socialist-market-framework-memory",
      "demand-supply-basic-memory",
      "supply-demand-equilibrium-memory"
    ],
    "reason": "经济正文来源修复后逐项复核；受影响会话失效，不相关会话按既有机制延续。"
  }
]);
 return pack;
};
module.exports.reviewedIds=REVIEWED;
module.exports.semanticChanges={questions:Object.keys(QUESTION_PATCHES),targets:Object.keys(TARGET_PATCHES),mnemonics:Object.keys(LEGACY_MEMORY_PATCHES)};
