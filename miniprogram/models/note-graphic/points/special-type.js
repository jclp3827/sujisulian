module.exports = [
  {
    "id": "bg-pattern",
    "categoryId": "special-type",
    "type": "method",
    "title": "背景图类",
    "summary": "以统一棋盘/网格背景为基础，优先考虑移动、叠加、部分数等规律。",
    "preview": "一叠布，连报对",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "有统一的棋盘、网格、宫格或固定背景",
              "黑白点、黑白块分布变化，背景本身基本不变",
              "元素数量、位置、聚集形态或黑白运算比外轮廓更明显"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "背景图类",
            "summary": "口诀：一叠布，连报对。先看三大哥，再看六小弟。",
            "nodes": [
              {
                "title": "三大哥",
                "summary": "背景图优先看基础三类：移动、叠加、部分数。",
                "children": [
                  {
                    "title": "一：移动",
                    "points": [
                      "元素数量不变",
                      "元素位置变化",
                      "内外圈移动常见",
                      "黑白点可分开移动"
                    ]
                  },
                  {
                    "title": "叠：叠加",
                    "points": [
                      "黑白运算",
                      "去同存异",
                      "去异存同",
                      "3x3 或 3+3 题型常见"
                    ]
                  },
                  {
                    "title": "布：部分数",
                    "points": [
                      "黑块部分数",
                      "白块部分数",
                      "黑白各自的连通块数量"
                    ]
                  }
                ]
              },
              {
                "title": "六小弟",
                "summary": "三大哥无规律时，再按细化特征排查。",
                "children": [
                  {
                    "title": "笔",
                    "points": [
                      "黑白块能否一笔画",
                      "黑白区域的笔画数"
                    ]
                  },
                  {
                    "title": "面",
                    "points": [
                      "面积",
                      "周长",
                      "黑块面积占比"
                    ]
                  },
                  {
                    "title": "连",
                    "points": [
                      "连接方式",
                      "点连接或边连接",
                      "连接处数量"
                    ]
                  },
                  {
                    "title": "报",
                    "points": [
                      "抱团",
                      "黑块/白块聚集",
                      "几个元素连在一起"
                    ]
                  },
                  {
                    "title": "对",
                    "points": [
                      "黑白部分是否对称",
                      "对称轴方向或数量"
                    ]
                  },
                  {
                    "title": "滴",
                    "points": [
                      "递推",
                      "相邻图形变化",
                      "行列递推关系"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：确认是否存在统一背景，避免误判为普通元素题",
              "第二步：先看元素数量是否不变，不变优先查移动",
              "第三步：行列关系明显时，检查黑白叠加和递推",
              "第四步：移动叠加无规律时，再查部分数、连接、抱团、对称等细节"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "背景图类要把黑、白元素分开看；不要只数总数，抱团和对称常藏在单一颜色里。"
          }
        ]
      }
    ]
  },
  {
    "id": "symmetry-pattern",
    "categoryId": "special-type",
    "type": "method",
    "title": "对称图类",
    "summary": "以对称图形为基础的特殊题型，优先考虑对称轴特征、对称性质等规律。",
    "preview": "三大哥，四小弟",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "图形整体或局部存在明显对称",
              "每个图形都能找到对称结构，但考点不是简单有无对称",
              "对称轴数量、方向、经过对象或轴间关系可能在变化"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "对称图类",
            "summary": "口诀：三大哥，四小弟。先抓大方向，再抠轴细节。",
            "nodes": [
              {
                "title": "三大哥",
                "summary": "先用对称基础三问确定主规律。",
                "children": [
                  {
                    "title": "性质",
                    "points": [
                      "轴对称",
                      "中心对称",
                      "既轴对称又中心对称"
                    ]
                  },
                  {
                    "title": "数量",
                    "points": [
                      "对称轴数量",
                      "递增/递减",
                      "恒定或分组"
                    ]
                  },
                  {
                    "title": "方向",
                    "points": [
                      "横竖方向",
                      "45度方向",
                      "顺时针/逆时针旋转"
                    ]
                  }
                ]
              },
              {
                "title": "四小弟",
                "summary": "基础规律不够时，看对称轴经过哪里、轴之间什么关系。",
                "children": [
                  {
                    "title": "过点",
                    "points": [
                      "对称轴是否经过交点",
                      "经过几个点"
                    ]
                  },
                  {
                    "title": "过线",
                    "points": [
                      "对称轴是否与线条重合",
                      "过直线或曲线特征"
                    ]
                  },
                  {
                    "title": "过面",
                    "points": [
                      "对称轴穿过几个封闭面",
                      "穿过最大面或最小面"
                    ]
                  },
                  {
                    "title": "位置关系",
                    "points": [
                      "多条对称轴平行",
                      "多条对称轴垂直",
                      "多轴成固定夹角"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先判断轴对称、中心对称或双重对称",
              "第二步：性质一致时，看对称轴数量和方向变化",
              "第三步：数量方向无规律时，看过点、过线、过面",
              "第四步：多条轴同时出现时，看平行、垂直或夹角关系"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "对称图类不是只判断有无对称；真正考点常在对称轴的数量、方向和经过对象。"
          }
        ]
      }
    ]
  },
  {
    "id": "split-pattern",
    "categoryId": "special-type",
    "type": "method",
    "title": "分割图类",
    "summary": "以外部轮廓规整、内部被线条分割为特征，优先考虑面、边、交点等规律。",
    "preview": "连打三遍对象",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "外部轮廓规整，内部被线条分割成多个区域",
              "子图形较多，最大面或最小面特征明显",
              "常规数面无规律时，对象特征比数量更关键"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "分割图类",
            "summary": "口诀：连打三遍对象。先看连接，再盯最大/最小对象。",
            "nodes": [
              {
                "title": "连",
                "summary": "先看内部图形怎样连接。",
                "points": [
                  "内部图形连接方式",
                  "点连接/线连接",
                  "连接处线段数"
                ]
              },
              {
                "title": "大",
                "summary": "观察最大或最小子图形的特征。",
                "points": [
                  "最大图形特征",
                  "最小图形特征",
                  "最大面/最小面的形状、位置、对称性"
                ]
              },
              {
                "title": "三",
                "summary": "三不沾：有子图形和外部轮廓完全不挨着。",
                "points": [
                  "子图形不接触外框",
                  "孤立面",
                  "与外轮廓完全不挨着"
                ]
              },
              {
                "title": "边",
                "summary": "数子图形或内外轮廓的边数。",
                "points": [
                  "子图形边数",
                  "内外边数和差",
                  "最大/最小面的边数"
                ]
              },
              {
                "title": "对",
                "summary": "看关键面的对称特征。",
                "points": [
                  "最大面对称",
                  "最小面对称",
                  "中心对称或轴对称"
                ]
              },
              {
                "title": "相",
                "summary": "看子图形与外部轮廓是否相似。",
                "points": [
                  "内部子图形与外框相似",
                  "最大/最小面与外框相似"
                ]
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先确认外框规整、内部被分割",
              "第二步：先看连接方式和连接处线段数",
              "第三步：再看最大面、最小面等对象特征",
              "第四步：最后补看三不沾、边数、对称和相似"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "分割图不要只数封闭面总数；总数无规律时，最大面、最小面和连接关系往往是突破口。"
          }
        ]
      }
    ]
  },
  {
    "id": "graphic-relation",
    "categoryId": "special-type",
    "type": "method",
    "title": "图形间关系",
    "summary": "多个图形同时出现时，先判断它们是相离、相交于点、相交于线，还是相交于面。",
    "preview": "相离、相交于点、相交于线、相交于面",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干中同时出现两个或多个图形",
              "图形之间是否接触比图形本身形状更醒目",
              "关系变化比数量变化更明显"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "图形间关系",
            "summary": "15 页核心是先判断多个图形之间是否相离、点接、线接或面重叠，再看连接位置和连接属性。",
            "nodes": [
              {
                "title": "相离",
                "summary": "多个图形彼此独立分开，没有任何接触。",
                "points": [
                  "多个图形独立分开",
                  "彼此没有接触关系",
                  "常作为基础关系识别"
                ],
                "image": {
                  "src": "graphic/relation-15-separate.png",
                  "title": "相离",
                  "description": "多个图形独立分开的示意图，用来识别图形间相离关系。"
                }
              },
              {
                "title": "相交于点",
                "summary": "多个图形连接处为交点或切点，只形成点接触。",
                "points": [
                  "多个图形连接处为交点",
                  "也可能是切点",
                  "连接处只形成点接触"
                ],
                "image": {
                  "src": "graphic/relation-15-point-touch.png",
                  "title": "相交于点",
                  "description": "多个图形连接处为交点或切点的示意图。"
                }
              },
              {
                "title": "相交于线",
                "summary": "多个图形连接处为线，要看连接线的长短、数量和曲直性。",
                "points": [
                  "多个图形连接处为线",
                  "连接线的长短",
                  "连接线的数量",
                  "连接线的曲直性"
                ],
                "image": {
                  "src": "graphic/relation-15-line-touch.png",
                  "title": "相交于线",
                  "description": "多个图形连接处为线的示意图，重点看连接线的长短、数量和曲直性。"
                }
              },
              {
                "title": "相交于面",
                "summary": "两个图形的面交叉重叠，重点看相交面的形状和属性。",
                "points": [
                  "两个图形的面交叉重叠",
                  "相交面的形状",
                  "相交面的属性"
                ],
                "image": {
                  "src": "graphic/relation-15-face-overlap.png",
                  "title": "相交于面",
                  "description": "两个图形的面交叉重叠的示意图，重点看相交面的形状和属性。"
                }
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先判断多个图形是否相离",
              "第二步：有接触时，先区分接触发生在点、线还是面",
              "第三步：点接触补看交点/切点，线接触补看长短/数量/曲直性",
              "第四步：面重叠再看相交面的形状和属性"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "不要把相切、点接触、线接触和面重叠混在一起；先判接触层级，再做细分。"
          }
        ]
      }
    ]
  },
  {
    "id": "functional-element",
    "categoryId": "special-type",
    "type": "method",
    "title": "功能元素",
    "summary": "图中若额外出现黑点、短线、阴影面、箭头或特殊标记，优先把它当成功能元素来观察相对位置和指向关系。",
    "preview": "相对位置、标记点、标记线、标记面、标记角、特殊",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干中出现额外黑点、短线、箭头、阴影面等标记",
              "图形主体相似，但多了一个被特别标出的元素",
              "规律更像在考标记元素和原图的关系，而不是主体数量本身"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "功能元素",
            "summary": "16 页核心是把额外标出的点、线、面、角当作功能元素，先看它和主体的相对位置，再看它具体标记了什么对象。",
            "nodes": [
              {
                "title": "相对位置",
                "summary": "先看功能元素相对主体位于上、下、左、右、内还是外。",
                "points": [
                  "上",
                  "下",
                  "左",
                  "右",
                  "内",
                  "外"
                ]
              },
              {
                "title": "标记点",
                "summary": "黑点或小点优先看交点、切点和关键连接点。",
                "points": [
                  "交点",
                  "切点",
                  "关键连接点"
                ],
                "image": {
                  "src": "graphic/functional-element-16-mark-point.png",
                  "title": "标记点",
                  "description": "标记点示意图，重点看黑点是否标在交点、切点或关键连接点上。"
                }
              },
              {
                "title": "标记线",
                "summary": "短线、粗线或高亮线段通常在提示哪条线最关键。",
                "points": [
                  "直线/曲线",
                  "最长线/最短线",
                  "关键连接线"
                ],
                "image": {
                  "src": "graphic/functional-element-16-mark-line.png",
                  "title": "标记线",
                  "description": "标记线示意图，重点看被特别标出的线段是直线、曲线，还是最长线/最短线。"
                }
              },
              {
                "title": "标记面",
                "summary": "面被特别标出时，重点看相交面、最大面/最小面以及直线面或曲线面。",
                "points": [
                  "相交面",
                  "最大面/最小面",
                  "直线面/曲线面多"
                ],
                "image": {
                  "src": "graphic/functional-element-16-mark-face.png",
                  "title": "标记面",
                  "description": "标记面示意图，重点看被标出的面是否是相交面、最大面/最小面，以及直线面或曲线面。"
                }
              },
              {
                "title": "标记角",
                "summary": "若额外标记的是角，优先看角大小和角类型。",
                "points": [
                  "最大角/最小角",
                  "直角/锐角/钝角"
                ],
                "image": {
                  "src": "graphic/functional-element-16-mark-angle.png",
                  "title": "标记角",
                  "description": "标记角示意图，重点看被标记的是最大角/最小角，还是直角、锐角、钝角。"
                }
              },
              {
                "title": "特殊",
                "summary": "某些题会直接用黑点连线或额外辅助线提示原图关系。",
                "points": [
                  "黑点连线与原图关系",
                  "辅助线方向",
                  "特殊定位关系"
                ],
                "image": {
                  "src": "graphic/functional-element-16-special.png",
                  "title": "特殊",
                  "description": "特殊功能元素示意图，重点看黑点连线、辅助线和原图主体之间的关系。"
                }
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先确认额外标记是否为功能元素，而不是普通构图的一部分",
              "第二步：先看相对位置，上下左右内外谁更稳定",
              "第三步：再判断标记的是点、线、面还是角",
              "第四步：最后补看黑点连线、辅助线和原图主体之间的特殊关系"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "功能元素是提示信息，不一定参与主体数量规律；先看它标记了什么，再看它在主体上的位置和作用。"
          }
        ]
      }
    ]
  },
  {
    "id": "black-white",
    "categoryId": "special-type",
    "type": "method",
    "title": "黑白块",
    "summary": "图形由黑白块、黑白点或黑白区域构成时，优先分开观察对称、面积、数量、连接和相邻比较。",
    "preview": "对称性、面、数量、连接、相邻比较",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干中黑白块、黑白点或黑白区域非常醒目",
              "外轮廓差异不大，但黑白分布在变化",
              "单看总数无规律时，黑白分开看更容易发现考点"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "黑白块",
            "summary": "17 页核心是把黑色部分和白色部分拆开观察：先看对称和面积，再看数量与连接，最后做相邻比较。",
            "nodes": [
              {
                "title": "对称性",
                "summary": "先判断整体是否对称，再分别看黑色部分和白色部分是否对称。",
                "points": [
                  "整体对称",
                  "黑色部分对称",
                  "白色部分对称"
                ],
                "image": {
                  "src": "graphic/black-white-17-symmetry.png",
                  "title": "对称性",
                  "description": "黑白块对称性示意图，重点区分整体对称和黑/白部分对称。"
                }
              },
              {
                "title": "面",
                "summary": "从面积角度观察黑白关系，常见黑色面积占比、黑白面积相等或相同形状黑块数量。",
                "points": [
                  "黑色面积占整体的比例关系",
                  "黑色面积 = 白色面积",
                  "相同形状黑块的数量"
                ],
                "image": {
                  "src": "graphic/black-white-17-area.png",
                  "title": "面",
                  "description": "黑白块面积示意图，重点看面积占比、黑白面积关系和相同形状黑块数量。"
                }
              },
              {
                "title": "数量",
                "summary": "黑白数量相同时优先看平移，数量不同时再直接数或看黑白运算。",
                "points": [
                  "数量相同看平移",
                  "数量不同可直接数",
                  "数量不同也可能考黑白运算"
                ],
                "image": {
                  "src": "graphic/black-white-17-count.png",
                  "title": "数量",
                  "description": "黑白块数量示意图，重点看黑白数量是否相同，以及是否存在平移或运算关系。"
                }
              },
              {
                "title": "连接",
                "summary": "数量和面积无规律时，把黑白连通情况拆成部分数、笔画数和连接方式。",
                "points": [
                  "黑色部分/白色部分",
                  "笔画数",
                  "点连接/线连接"
                ],
                "children": [
                  {
                    "title": "部分数",
                    "summary": "分别数黑色部分和白色部分的连通块数量。",
                    "points": [
                      "黑色部分数",
                      "白色部分数",
                      "黑白部分数比例"
                    ],
                    "image": {
                      "src": "graphic/black-white-17-part-count.png",
                      "title": "部分数",
                      "description": "黑白块部分数示意图，重点分别数黑色部分和白色部分的连通块数量。"
                    }
                  },
                  {
                    "title": "笔画数",
                    "summary": "把同色连通区域当作图形，判断一笔画或两笔画。",
                    "points": [
                      "一笔画",
                      "两笔画",
                      "黑白区域分别判断"
                    ],
                    "image": {
                      "src": "graphic/black-white-17-stroke-count.png",
                      "title": "笔画数",
                      "description": "黑白块笔画数示意图，重点判断同色连通区域是一笔画还是两笔画。"
                    }
                  },
                  {
                    "title": "连接方式",
                    "summary": "观察同色块之间是点连接还是线连接。",
                    "points": [
                      "点连接",
                      "线连接",
                      "连接处数量"
                    ],
                    "image": {
                      "src": "graphic/black-white-17-connect-method.png",
                      "title": "连接方式",
                      "description": "黑白块连接方式示意图，重点区分点连接和线连接。"
                    }
                  }
                ]
              },
              {
                "title": "相邻比较",
                "summary": "按行或按列比较相邻图形，找相同位置和不同位置，尤其留意黑白颜色互换。",
                "points": [
                  "按行按列对比",
                  "找出相同和不同",
                  "相邻两图黑白颜色互换",
                  "变化方向可能顺时针旋转"
                ],
                "image": {
                  "src": "graphic/black-white-17-adjacent-compare.png",
                  "title": "相邻比较",
                  "description": "黑白块相邻比较示意图，重点按行按列比较相邻图形的相同和不同。"
                }
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先判断整体对称、黑色部分对称和白色部分对称",
              "第二步：对称无规律时看黑白面积关系和相同形状黑块数量",
              "第三步：再看黑白数量，数量相同优先查平移，数量不同再数数或看黑白运算",
              "第四步：数量无规律时看部分数、笔画数和连接方式",
              "第五步：最后按行列做相邻比较，找相同、不同和黑白互换"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "黑白块题不要只看黑色，也不要只数总数；黑色和白色常要分开统计、分开判断。"
          }
        ]
      }
    ]
  },
  {
    "id": "character-reasoning",
    "categoryId": "special-type",
    "type": "method",
    "title": "汉字推理",
    "summary": "汉字题优先按结构、样式、属性、数量和特殊口径拆分，先看字形结构，再看笔画、封闭面、拼音或起笔等特殊信息。",
    "preview": "结构、样式、属性、数量、特殊",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干主体是汉字、偏旁或字形变体",
              "图中同时出现结构位置、笔画标记、封闭面或拼音注释",
              "普通图形规律不稳定，但汉字自身的字形属性很突出"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "汉字推理",
            "summary": "18 页核心是把汉字当作特殊图形来拆：先看结构和样式，再看属性与数量，最后补看拼音、起笔等特殊口径。",
            "nodes": [
              {
                "title": "结构",
                "summary": "先判断汉字内部的部件是按上下、左右还是包围关系组织。",
                "points": [
                  "上下",
                  "左右",
                  "全包围",
                  "半包围"
                ],
                "children": [
                  {
                    "title": "结构遍历",
                    "summary": "同一组汉字若分别覆盖上下、左右、全包围、半包围，常考结构位置的遍历。",
                    "points": [
                      "上下结构",
                      "左右结构",
                      "全包围结构",
                      "半包围结构"
                    ],
                    "image": {
                      "src": "graphic/character-18-structure-traverse.png",
                      "title": "结构遍历",
                      "description": "汉字结构遍历示意图，重点看上下、左右、全包围和半包围是否依次出现。"
                    }
                  }
                ]
              },
              {
                "title": "样式",
                "summary": "结构不够时，再看偏旁是否遍历，或部件之间是否满足加减同异关系。",
                "points": [
                  "遍历",
                  "加减同异"
                ],
                "children": [
                  {
                    "title": "偏旁遍历",
                    "summary": "偏旁部首在不同汉字中轮流出现时，优先考虑样式遍历。",
                    "points": [
                      "相同偏旁重复出现",
                      "偏旁位置变化",
                      "不同偏旁轮流遍历"
                    ],
                    "image": {
                      "src": "graphic/character-18-radical-traverse.png",
                      "title": "偏旁遍历",
                      "description": "偏旁遍历示意图，重点看相同偏旁是否在不同汉字中轮流出现。"
                    }
                  },
                  {
                    "title": "加减同异",
                    "summary": "把汉字部件拆开后，常见加一笔、减一笔或同部件替换的关系。",
                    "points": [
                      "加部件",
                      "减部件",
                      "相同部件保留",
                      "不同部件替换"
                    ],
                    "image": {
                      "src": "graphic/character-18-add-remove-same-diff.png",
                      "title": "加减同异",
                      "description": "汉字加减同异示意图，重点看部件增减和相同部件替换关系。"
                    }
                  }
                ]
              },
              {
                "title": "属性",
                "summary": "汉字也能按图形属性观察，优先看对称性、曲直性和开闭性。",
                "points": [
                  "对称性",
                  "曲直性",
                  "开闭性"
                ]
              },
              {
                "title": "数量",
                "summary": "数量口径最常见，优先拆点、线、面和部分数，不要把不同口径混着数。",
                "points": [
                  "点",
                  "线",
                  "面",
                  "部分数"
                ],
                "children": [
                  {
                    "title": "点",
                    "summary": "先区分交点和孤点，尤其留意单独落在字外或字旁的小点。",
                    "points": [
                      "交点",
                      "孤点"
                    ],
                    "children": [
                      {
                        "title": "孤点",
                        "summary": "孤立的小点常按数量递增、递减或遍历出现。",
                        "points": [
                          "单独小点",
                          "孤点数量",
                          "孤点位置"
                        ],
                        "image": {
                          "src": "graphic/character-18-isolated-point.png",
                          "title": "孤点",
                          "description": "汉字孤点示意图，重点看单独小点的数量和位置变化。"
                        }
                      }
                    ]
                  },
                  {
                    "title": "线",
                    "summary": "线条类先看横竖，再看撇捺，最后补看整体笔画数。",
                    "points": [
                      "横/竖",
                      "撇/捺",
                      "笔画数"
                    ],
                    "children": [
                      {
                        "title": "横/竖",
                        "summary": "规整汉字常优先比较横画和竖画的数量是否相等或递变。",
                        "points": [
                          "横画数量",
                          "竖画数量",
                          "横竖相等",
                          "横竖差值"
                        ],
                        "image": {
                          "src": "graphic/character-18-horizontal-vertical.png",
                          "title": "横/竖",
                          "description": "汉字横竖数量示意图，重点比较横画和竖画的数量关系。"
                        }
                      },
                      {
                        "title": "撇/捺",
                        "summary": "斜向笔画明显时，把撇和捺拆开数，必要时合并看曲直差异。",
                        "points": [
                          "撇画数量",
                          "捺画数量",
                          "斜向笔画方向",
                          "曲直辅助判断"
                        ],
                        "image": {
                          "src": "graphic/character-18-left-falling-right-falling.png",
                          "title": "撇/捺",
                          "description": "汉字撇捺示意图，重点看斜向笔画的数量和方向。"
                        }
                      },
                      {
                        "title": "笔画数",
                        "summary": "字典口径下的实际笔画数常直接构成等差、等值或递推关系。",
                        "points": [
                          "实际笔画数",
                          "相同笔画数",
                          "递增递减",
                          "不要按手写连笔误判"
                        ],
                        "image": {
                          "src": "graphic/character-18-stroke-count.png",
                          "title": "笔画数",
                          "description": "汉字笔画数示意图，重点按字典中的实际笔画数来判断规律。"
                        }
                      }
                    ]
                  },
                  {
                    "title": "面",
                    "summary": "汉字中的完整封闭区间可按面数统计，常见等差或叠加关系。",
                    "points": [
                      "封闭面数量",
                      "新增一个框多一个面",
                      "内部封闭区间"
                    ],
                    "image": {
                      "src": "graphic/character-18-area.png",
                      "title": "面",
                      "description": "汉字面数示意图，重点数完整封闭区间和新增围合后的面数变化。"
                    }
                  },
                  {
                    "title": "部分数",
                    "summary": "把字形按彼此分离的部分拆开，观察独立部分数量是否递变。",
                    "points": [
                      "独立部分数量",
                      "分离部分递增",
                      "部分位置变化"
                    ],
                    "image": {
                      "src": "graphic/character-18-part-count.png",
                      "title": "部分数",
                      "description": "汉字部分数示意图，重点看字形可拆成几个彼此分离的部分。"
                    }
                  }
                ]
              },
              {
                "title": "特殊",
                "summary": "少数题会跳出字形本身，转而考拼音音调、拼音字母数或起笔顺序。",
                "points": [
                  "拼音音调",
                  "拼音字母个数",
                  "笔画顺序：起笔"
                ],
                "children": [
                  {
                    "title": "拼音音调",
                    "summary": "若题干给出读音提示，常考同一声调的遍历或排序。",
                    "points": [
                      "第一声",
                      "第二声",
                      "第三声",
                      "第四声",
                      "同声调归类"
                    ],
                    "image": {
                      "src": "graphic/character-18-tone.png",
                      "title": "拼音音调",
                      "description": "拼音音调示意图，重点看汉字读音是否属于同一声调。"
                    }
                  },
                  {
                    "title": "拼音字母个数",
                    "summary": "拼音长度明显时，可直接数音节中的字母个数。",
                    "points": [
                      "拼音字母数量",
                      "音节长度递增",
                      "字母个数相等"
                    ],
                    "image": {
                      "src": "graphic/character-18-pinyin-letter-count.png",
                      "title": "拼音字母个数",
                      "description": "拼音字母个数示意图，重点比较各汉字拼音的字母数量。"
                    }
                  },
                  {
                    "title": "笔画顺序：起笔",
                    "summary": "个别题会考第一个落笔位置或起笔方向是否一致。",
                    "points": [
                      "起笔位置",
                      "起笔方向",
                      "同类起笔归类"
                    ],
                    "image": {
                      "src": "graphic/character-18-first-stroke.png",
                      "title": "笔画顺序：起笔",
                      "description": "汉字起笔示意图，重点看各字的第一笔从哪里开始。"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先看汉字结构，是上下、左右还是包围关系",
              "第二步：结构不明显时，看偏旁遍历或加减同异",
              "第三步：再回到属性和数量口径，优先数点、线、面、部分数",
              "第四步：普通字形无规律时，补看拼音音调、拼音字母个数和起笔顺序"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "汉字题不要一上来只数总笔画；结构、偏旁和封闭面常常比总数更稳定。"
          }
        ]
      }
    ]
  },
  {
    "id": "number-reasoning",
    "categoryId": "special-type",
    "type": "method",
    "title": "数字推理",
    "summary": "数字题把阿拉伯数字当作特殊图形来观察，优先看属性、封闭面、书写方式、遍历和数字运算。",
    "preview": "属性、封闭面的数量、特殊、遍历、数字运算",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干主体是阿拉伯数字或数字与字母混排",
              "图中强调数字的字形、封闭面或书写方向",
              "普通图形规律不稳定，但数字本身的写法和运算关系很突出"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "数字推理",
            "summary": "19 页核心是把数字当作特殊图形处理：先看对称和开闭，再看封闭面数量、数字本身写法与遍历，最后补看数字运算。",
            "nodes": [
              {
                "title": "属性",
                "summary": "数字也能先按属性口径观察，优先看对称性、曲直性和开闭性。",
                "points": [
                  "对称性",
                  "曲直性",
                  "开闭性"
                ],
                "children": [
                  {
                    "title": "对称性",
                    "summary": "先判断数字本身或数字组合是否具有轴对称、中心对称等性质。",
                    "points": [
                      "轴对称",
                      "中心对称",
                      "数字组合对称"
                    ],
                    "image": {
                      "src": "graphic/number-19-symmetry.png",
                      "title": "对称性",
                      "description": "数字对称性示意图，重点看数字本身或数字组合是否满足对称关系。"
                    }
                  },
                  {
                    "title": "开闭性",
                    "summary": "数字题常直接按开放、全封闭、半封闭来区分数字特征。",
                    "points": [
                      "开放图形",
                      "全封闭",
                      "半封闭"
                    ],
                    "image": {
                      "src": "graphic/number-19-closed-shape.png",
                      "title": "开闭性",
                      "description": "数字开闭性示意图，重点区分开放数字、全封闭数字和半封闭数字。"
                    }
                  }
                ]
              },
              {
                "title": "封闭面的数量",
                "summary": "当数字外形规整时，可直接统计每个数字包含几个完整封闭面。",
                "points": [
                  "0 个面",
                  "1 个面",
                  "2 个面"
                ],
                "image": {
                  "src": "graphic/number-19-area-count.png",
                  "title": "封闭面的数量",
                  "description": "数字封闭面数量示意图，重点看每个数字包含 0 个、1 个还是 2 个完整封闭面。"
                }
              },
              {
                "title": "特殊",
                "summary": "少数数字题不看一般图形规律，而是直接考数字的书写方式、大小比较或数字本身运算。",
                "points": [
                  "数字本身写法",
                  "数字本身大小比较",
                  "数字本身运算"
                ],
                "children": [
                  {
                    "title": "数字本身写法",
                    "summary": "当题干混入字母或不同书写方向时，优先看数字是否按顺时针或逆时针书写。",
                    "points": [
                      "顺时针写法",
                      "逆时针写法",
                      "字母数字混合比较"
                    ],
                    "image": {
                      "src": "graphic/number-19-writing-style.png",
                      "title": "数字本身写法",
                      "description": "数字本身写法示意图，重点比较数字或字母的书写方向是否一致。"
                    }
                  }
                ]
              },
              {
                "title": "遍历",
                "summary": "图中出现多个不同数字且彼此不重复时，优先考虑遍历规律。",
                "points": [
                  "已出现的数字不再出现",
                  "所有数字不重不漏",
                  "按组遍历"
                ],
                "image": {
                  "src": "graphic/number-19-traverse.png",
                  "title": "遍历",
                  "description": "数字遍历示意图，重点看已出现过的数字是否不再重复出现。"
                }
              },
              {
                "title": "解法",
                "summary": "数字题除图形口径外，常直接用数字运算关系求解。",
                "points": [
                  "遍历",
                  "数字运算"
                ],
                "children": [
                  {
                    "title": "数字运算",
                    "summary": "按线、组或相邻位置做加减乘除，常出现和差恒定或递推关系。",
                    "points": [
                      "和差恒定",
                      "分组运算",
                      "相邻递推",
                      "按线求和"
                    ],
                    "image": {
                      "src": "graphic/number-19-calc.png",
                      "title": "数字运算",
                      "description": "数字运算示意图，重点看各组数字之间的和差关系或按线求和规律。"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先看数字本身是否有明显的对称、曲直或开闭特征",
              "第二步：属性无规律时，直接数每个数字的封闭面数量",
              "第三步：再看数字本身写法、书写方向或大小比较",
              "第四步：多个数字同时出现且不重复时，优先考虑遍历",
              "第五步：最后补看数字之间的加减乘除和分组运算关系"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "数字题不要只把它当普通数量题；数字的写法、封闭面和是否重复出现，常常比直接运算更早给出突破口。"
          }
        ]
      }
    ]
  },
  {
    "id": "letter-reasoning",
    "categoryId": "special-type",
    "type": "method",
    "title": "字母推理",
    "summary": "字母题把英文字母当作特殊图形来观察，优先看属性、数量、元素位置以及字母本身顺序和写法。",
    "preview": "属性、数量、素、特殊",
    "tabs": [
      {
        "id": "knowledge",
        "title": "知识点",
        "blocks": [
          {
            "type": "signal",
            "title": "识别信号",
            "items": [
              "题干主体是大写或小写英文字母",
              "图中强调字母的对称、曲直、开闭、笔画或字母顺序",
              "普通图形规律不稳定，但字母本身形态和字母表顺序很突出"
            ]
          },
          {
            "type": "mind-map",
            "label": "结构导图",
            "title": "字母推理",
            "summary": "20 页核心是把字母当作特殊图形处理：先看属性，再看数量和元素位置，最后补看字母表顺序和字母本身写法。",
            "nodes": [
              {
                "title": "属性",
                "summary": "字母也能先按属性口径观察，优先看对称性、曲直性和开闭性。",
                "points": [
                  "对称性",
                  "曲直性",
                  "开闭性"
                ],
                "children": [
                  {
                    "title": "对称性",
                    "summary": "先判断字母是否具有轴对称或中心对称特征。",
                    "points": [
                      "轴对称",
                      "中心对称",
                      "对称字母分类"
                    ],
                    "image": {
                      "src": "graphic/letter-20-symmetry.png",
                      "title": "对称性",
                      "description": "字母对称性示意图，重点看哪些字母属于轴对称或中心对称。"
                    }
                  },
                  {
                    "title": "曲直性",
                    "summary": "把字母按全曲、全直或曲直混合分类，常用于分组或顺推。",
                    "points": [
                      "全曲",
                      "全直",
                      "曲直混合"
                    ],
                    "image": {
                      "src": "graphic/letter-20-curvature.png",
                      "title": "曲直性",
                      "description": "字母曲直性示意图，重点区分全曲字母、全直字母和曲直混合字母。"
                    }
                  },
                  {
                    "title": "开闭性",
                    "summary": "字母常直接按开放、全封闭、半封闭来区分。",
                    "points": [
                      "开放图形",
                      "全封闭",
                      "半封闭"
                    ],
                    "image": {
                      "src": "graphic/letter-20-closed.png",
                      "title": "开闭性",
                      "description": "字母开闭性示意图，重点区分开放字母、全封闭字母和半封闭字母。"
                    }
                  }
                ]
              },
              {
                "title": "数量",
                "summary": "数量口径下优先看面、点和线，必要时再回到元素种类和位置。",
                "points": [
                  "面",
                  "点",
                  "线",
                  "素"
                ],
                "children": [
                  {
                    "title": "面",
                    "summary": "规整字母可按完整封闭面数量分类。",
                    "points": [
                      "0 个面",
                      "1 个面",
                      "2 个面"
                    ],
                    "image": {
                      "src": "graphic/letter-20-area.png",
                      "title": "面",
                      "description": "字母面数示意图，重点看每个字母包含几个完整封闭面。"
                    }
                  },
                  {
                    "title": "点",
                    "summary": "带点字母时，优先看交点数和孤点数。",
                    "points": [
                      "交点数",
                      "孤点数"
                    ],
                    "image": {
                      "src": "graphic/letter-20-point.png",
                      "title": "点",
                      "description": "字母点数示意图，重点看字母中的交点和孤点数量。"
                    }
                  },
                  {
                    "title": "线",
                    "summary": "线条类字母优先比较笔画数，再补看曲直线数量。",
                    "points": [
                      "笔画数",
                      "曲直线数量"
                    ],
                    "children": [
                      {
                        "title": "笔画数",
                        "summary": "某些字母题可直接按一笔画或总笔画数判断递变关系。",
                        "points": [
                          "一笔画",
                          "总笔画数",
                          "笔画递变"
                        ],
                        "image": {
                          "src": "graphic/letter-20-stroke-count.png",
                          "title": "笔画数",
                          "description": "字母笔画数示意图，重点看字母是否一笔画以及总笔画数变化。"
                        }
                      }
                    ]
                  },
                  {
                    "title": "素",
                    "summary": "字母作为元素时，常考元素种类和特定元素在串中的位置。",
                    "points": [
                      "种类",
                      "位置"
                    ],
                    "children": [
                      {
                        "title": "位置",
                        "summary": "题干中若固定追踪某个元素，优先看它在不同字符串中的位置变化。",
                        "points": [
                          "元素位置",
                          "位置递移",
                          "固定元素追踪"
                        ],
                        "image": {
                          "src": "graphic/letter-20-position.png",
                          "title": "位置",
                          "description": "字母位置示意图，重点追踪指定元素在不同字符串中的位置变化。"
                        }
                      },
                      {
                        "title": "种类",
                        "summary": "若多个符号组合出现，先看是否共享同一种元素结构。",
                        "points": [
                          "相同元素种类",
                          "共同结构元素",
                          "符号分类"
                        ],
                        "image": {
                          "src": "graphic/letter-20-type.png",
                          "title": "种类",
                          "description": "字母元素种类示意图，重点看不同表达式中是否共享相同元素结构。"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "title": "特殊",
                "summary": "少数字母题会直接考字母表顺序，或考字母本身的书写方式。",
                "points": [
                  "字母本身顺序",
                  "字母本身写法"
                ],
                "children": [
                  {
                    "title": "字母本身顺序",
                    "summary": "直接利用 A-Z 的顺序做等差、跳格或前后位移。",
                    "points": [
                      "字母表顺序",
                      "前后位移",
                      "跳格变化"
                    ],
                    "image": {
                      "src": "graphic/letter-20-order.png",
                      "title": "字母本身顺序",
                      "description": "字母顺序示意图，重点看字母在 A-Z 中的先后位置与位移关系。"
                    }
                  },
                  {
                    "title": "字母本身写法",
                    "summary": "混入数字或变体时，可直接比较字母本身的书写方向和写法特征。",
                    "points": [
                      "书写方向",
                      "字母变体",
                      "字母数字混合比较"
                    ],
                    "image": {
                      "src": "graphic/letter-20-writing-style.png",
                      "title": "字母本身写法",
                      "description": "字母本身写法示意图，重点比较字母与数字混排时的书写方向和写法特征。"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "rule",
            "title": "判断顺序",
            "items": [
              "第一步：先看字母是否有明显的对称、曲直和开闭特征",
              "第二步：属性无规律时，转看面、点、笔画数和曲直线数量",
              "第三步：字符串或表达式题补看元素种类和指定元素位置",
              "第四步：若题干更像字母序列，则直接看字母表顺序和位移",
              "第五步：混入数字或变体时，再补看字母本身写法和书写方向"
            ]
          },
          {
            "type": "tip",
            "variant": "warning",
            "title": "易错提醒",
            "content": "字母题不要只按字母表顺序硬推；很多题先考的是字母外形属性、面数或写法，再轮到顺序。"
          }
        ]
      }
    ]
  }
]
