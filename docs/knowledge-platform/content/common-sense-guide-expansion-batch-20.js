module.exports = {
  "schemaVersion": 1,
  "id": "common-sense-guide-expansion-batch-20",
  "title": "知识导读扩库第20批：通信与信息技术基础",
  "status": "candidate",
  "purpose": "按明确概念、功能与实现条件建设独立知识卡，限定单位约定及能力边界。",
  "groups": [
    {
      "pointId": "communication-technology",
      "overview": "5G描述蜂窝移动通信的代际与代表能力，光纤通信描述光信号沿光导纤维传输的方式。通信能力需要结合速率、时延、连接规模和传输条件理解，历史商用节点不等于长期技术排名。",
      "relation": "classification",
      "cards": [
        {
          "id": "five-g-generation",
          "title": "5G：第五代蜂窝移动通信",
          "explanation": "5G是第五代蜂窝移动通信技术。我国于2019年6月6日发放5G商用牌照，因此2019年被称为我国5G商用元年；这里说明的是我国商用进程的历史节点。",
          "productionMode": "light-edit",
          "learningGoal": "识别5G的代际及我国商用元年的含义。",
          "sourceUnitIds": [
            "cs-23-30-p1-5g-list"
          ],
          "sourceEvidence": [
            "5G是第五代蜂窝移动通信技术。2019年6月6日，我国发放5G商用牌照，标志我国进入5G商用元年；不以“最新一代”作为长期定义。。优点：。高速率。。低时延。。大连接。"
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
          "id": "five-g-capabilities",
          "title": "5G的三类代表能力",
          "explanation": "高速率、低时延和大连接是5G的代表能力，分别对应数据传输速度、响应等待时间和连接设备规模。实际体验还受网络部署、信号、负载及终端等条件影响。",
          "productionMode": "light-edit",
          "learningGoal": "区分速率、时延和连接规模三个维度。",
          "sourceUnitIds": [
            "cs-23-30-p1-5g-list"
          ],
          "sourceEvidence": [
            "5G是第五代蜂窝移动通信技术。2019年6月6日，我国发放5G商用牌照，标志我国进入5G商用元年；不以“最新一代”作为长期定义。。优点：。高速率。。低时延。。大连接。"
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
          "id": "fiber-principle",
          "title": "光纤通信的传输原理",
          "explanation": "光纤通信利用光波（主要是激光）在光导纤维中传递信息，利用了光的全反射现象。",
          "productionMode": "reuse",
          "learningGoal": "说明光纤传递信息的信号与物理原理。",
          "sourceUnitIds": [
            "cs-23-30-p1-fiber-communication-list"
          ],
          "sourceEvidence": [
            "光纤通信：利用光波（主要是激光）在光导纤维中传递各种信息，利用了光的全反射现象。。优点：。通信容量大。。传输损耗低。。经济。。轻便。。抗干扰能力强。"
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
          "id": "fiber-advantages",
          "title": "光纤通信的代表优势",
          "explanation": "光纤通信具有容量大、传输损耗低、抗电磁干扰能力强等优势，适合较大信息量的传输。实际建设成本和传输表现仍与设备、距离、铺设方式等条件有关。",
          "productionMode": "light-edit",
          "learningGoal": "说明光纤容量、损耗和抗干扰的优势及条件。",
          "sourceUnitIds": [
            "cs-23-30-p1-fiber-communication-list"
          ],
          "sourceEvidence": [
            "光纤通信：利用光波（主要是激光）在光导纤维中传递各种信息，利用了光的全反射现象。。优点：。通信容量大。。传输损耗低。。经济。。轻便。。抗干扰能力强。"
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
      "pointId": "information-tech",
      "overview": "计算机通过硬件与软件协同完成信息处理。运算、控制、存储及输入输出各有分工；理解数据量时，还要区分位与字节、十进制与二进制容量单位，避免混用约定。",
      "relation": "classification",
      "cards": [
        {
          "id": "hardware-software",
          "title": "计算机系统：硬件与软件",
          "explanation": "计算机系统由硬件和软件协同工作。硬件提供运算、控制、存储及输入输出等物理基础，软件则通过程序组织这些资源完成任务；只有设备或只有程序都不足以构成完整工作系统。",
          "productionMode": "synthesized",
          "learningGoal": "区分计算机硬件和软件的作用。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ],
          "sourceEvidence": [
            "硬件系统：。运算器：进行运算的部件，计算机中的数值运算采用二进制。。控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。。存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。。输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。。输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。。软件系统：。系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。。应用软件：为解决各类实际问题而设计的程序软件。"
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
          "id": "cpu-components",
          "title": "CPU中的运算与控制",
          "explanation": "运算器执行算术、逻辑等运算，控制器协调指令执行并发出控制信号。二者是中央处理器CPU的核心组成；运算功能和控制功能相互配合，不能只把CPU理解为保存文件的地方。",
          "productionMode": "light-edit",
          "learningGoal": "区分运算器和控制器在CPU中的作用。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ],
          "sourceEvidence": [
            "硬件系统：。运算器：进行运算的部件，计算机中的数值运算采用二进制。。控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。。存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。。输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。。输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。。软件系统：。系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。。应用软件：为解决各类实际问题而设计的程序软件。"
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
          "id": "memory-storage",
          "title": "内存与外存的层次比较",
          "explanation": "在传统存储层次中，内存通常比外存存取速度快、单位容量成本高，配置容量也往往较小。比较针对的是一般层次特点，具体设备的容量、价格和速度仍要看型号与使用条件。",
          "productionMode": "light-edit",
          "learningGoal": "说明传统内外存层次的典型差别及比较条件。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ],
          "sourceEvidence": [
            "硬件系统：。运算器：进行运算的部件，计算机中的数值运算采用二进制。。控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。。存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。。输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。。输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。。软件系统：。系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。。应用软件：为解决各类实际问题而设计的程序软件。"
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
          "id": "input-direction",
          "title": "输入设备：把信息送入系统",
          "explanation": "键盘、鼠标、摄像头和扫描仪是输入设备的代表，用于把文字、操作、图像等信息送入计算机。输入的判断依据是信息进入系统的方向，而不是设备是否需要人一直操作。",
          "productionMode": "light-edit",
          "learningGoal": "识别典型输入设备并说明其信息流向。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ],
          "sourceEvidence": [
            "硬件系统：。运算器：进行运算的部件，计算机中的数值运算采用二进制。。控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。。存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。。输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。。输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。。软件系统：。系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。。应用软件：为解决各类实际问题而设计的程序软件。"
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
          "id": "output-direction",
          "title": "输出设备：呈现处理结果",
          "explanation": "显示器、打印机、绘图仪等是输出设备的代表，用于把计算机处理结果呈现给使用者。判断依据是结果由系统向外传递；同一产品也可能同时组合输入和输出功能。",
          "productionMode": "light-edit",
          "learningGoal": "识别典型输出设备并说明其信息流向。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ],
          "sourceEvidence": [
            "硬件系统：。运算器：进行运算的部件，计算机中的数值运算采用二进制。。控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。。存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。。输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。。输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。。软件系统：。系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。。应用软件：为解决各类实际问题而设计的程序软件。"
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
          "id": "software-categories",
          "title": "系统软件与应用软件",
          "explanation": "系统软件控制、协调计算机资源，为其他程序的运行提供支持；应用软件用于解决具体的实际任务。二者按主要用途区分，应用程序通常需要系统软件提供运行环境。",
          "productionMode": "light-edit",
          "learningGoal": "区分系统软件与应用软件的主要用途。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-system-list"
          ],
          "sourceEvidence": [
            "硬件系统：。运算器：进行运算的部件，计算机中的数值运算采用二进制。。控制器：靠发出一系列控制信号实施指挥，与运算器合称中央处理器（CPU）。。存储器：内存储器比外存储器容量小，价格昂贵，但存取速度快。。输入设备：把人的意图传达给机器的设备。键盘、鼠标、摄像头、扫描仪、光笔、手写输入板、游戏杆、语音输入装置等都属于输入设备。。输出设备：把机器的结果传达给人的设备。显示器、打印机、绘图仪、影像输出系统、语音输出系统、磁记录设备等都属于输出设备。。软件系统：。系统软件：控制、协调计算机及外部设备，支持应用软件开发和运行的软件。。应用软件：为解决各类实际问题而设计的程序软件。"
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
          "id": "bit-byte",
          "title": "bit与Byte：位和字节",
          "explanation": "bit表示二进制位，Byte表示字节，现代计量中1B等于8bit。位与字节不是同一个单位，比较存储容量或传输数据量时，需要先确认符号代表的是位还是字节。",
          "productionMode": "light-edit",
          "learningGoal": "区分bit与Byte并运用一字节八位的关系。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-concepts-list"
          ],
          "sourceEvidence": [
            "字节（Byte）是计算机用于计量存储容量的基本单位。。二进制位（bit）是计算机用于计量存储容量的最小单位。。现代计量中1B=8bit。十进制前缀：1kB=1000B，1MB=1000kB，1GB=1000MB；二进制前缀：1KiB=1024B，1MiB=1024KiB，1GiB=1024MiB。传统教材和部分系统可能用KB、MB、GB指二进制倍数，题目明确采用此约定时按给定口径计算，不能把未注明的GB一概换成1024MB。。计算机病毒是一段计算机程序，这种程序能依附在其他程序上自我繁殖，并能修改正常运行的程序，破坏其功能，或复制和侵入到别的程序中，令其遭到破坏。"
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
          "id": "decimal-binary-prefixes",
          "title": "容量换算：先确认单位约定",
          "explanation": "标准十进制单位中1GB=1000MB；二进制单位中1GiB=1024MiB。传统教材或系统有时用GB指二进制倍数，题目明确这种约定时按给定口径计算，未注明时不能把两套前缀混用。",
          "productionMode": "synthesized",
          "learningGoal": "区分十进制和二进制容量单位并确认题目口径。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-concepts-list"
          ],
          "sourceEvidence": [
            "字节（Byte）是计算机用于计量存储容量的基本单位。。二进制位（bit）是计算机用于计量存储容量的最小单位。。现代计量中1B=8bit。十进制前缀：1kB=1000B，1MB=1000kB，1GB=1000MB；二进制前缀：1KiB=1024B，1MiB=1024KiB，1GiB=1024MiB。传统教材和部分系统可能用KB、MB、GB指二进制倍数，题目明确采用此约定时按给定口径计算，不能把未注明的GB一概换成1024MB。。计算机病毒是一段计算机程序，这种程序能依附在其他程序上自我繁殖，并能修改正常运行的程序，破坏其功能，或复制和侵入到别的程序中，令其遭到破坏。"
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
          "id": "computer-virus",
          "title": "计算机病毒的基本特征",
          "explanation": "计算机病毒是一类能依附其他程序等载体并自我复制的恶意程序，可能修改程序或干扰系统运行。自我复制和传播方式属于识别特征，单纯运行缓慢并不足以证明计算机感染病毒。",
          "productionMode": "light-edit",
          "learningGoal": "说明病毒的依附、自我复制特征与判断边界。",
          "sourceUnitIds": [
            "cs-23-30-p1-computer-concepts-list"
          ],
          "sourceEvidence": [
            "字节（Byte）是计算机用于计量存储容量的基本单位。。二进制位（bit）是计算机用于计量存储容量的最小单位。。现代计量中1B=8bit。十进制前缀：1kB=1000B，1MB=1000kB，1GB=1000MB；二进制前缀：1KiB=1024B，1MiB=1024KiB，1GiB=1024MiB。传统教材和部分系统可能用KB、MB、GB指二进制倍数，题目明确采用此约定时按给定口径计算，不能把未注明的GB一概换成1024MB。。计算机病毒是一段计算机程序，这种程序能依附在其他程序上自我繁殖，并能修改正常运行的程序，破坏其功能，或复制和侵入到别的程序中，令其遭到破坏。"
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
      "pointId": "information-technology-applications",
      "overview": "大数据关注数据集合及处理挑战，云计算提供可按需调度的资源，物联网连接设备与物理世界，人工智能研究机器执行智能任务。数据质量、服务条件和任务边界分别影响这些技术的实际效果。",
      "relation": "classification",
      "cards": [
        {
          "id": "big-data-challenge",
          "title": "大数据：规模与处理挑战",
          "explanation": "数据的规模、类型、流入速度或变化，可能使传统处理方式难以满足要求，这类数据需要可扩展的存储、处理与分析架构。大数据强调数据特征带来的处理挑战，不只是某个固定容量门槛。",
          "productionMode": "light-edit",
          "learningGoal": "说明大数据与传统处理能力之间的关系。",
          "sourceUnitIds": [
            "cs-23-30-p1-p2-big-data-list"
          ],
          "sourceEvidence": [
            "大数据是规模、类型、流入速度或变化等特征使传统处理方式面临挑战，需要可扩展架构进行存储、处理与分析的数据集合。容量大、类型多、速度快是代表特征；数据质量、准确性和分析价值仍需验证，不由数据量直接保证。"
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
          "id": "data-quality-value",
          "title": "数据量、准确性与价值",
          "explanation": "数据量、准确性和分析价值是不同维度。海量数据仍可能存在缺失、偏差或不适合当前问题的内容，只有检查数据质量并选择恰当的分析方法，才能形成可信、可用的结论。",
          "productionMode": "synthesized",
          "learningGoal": "区分数据规模与数据质量、分析价值。",
          "sourceUnitIds": [
            "cs-23-30-p1-p2-big-data-list"
          ],
          "sourceEvidence": [
            "大数据是规模、类型、流入速度或变化等特征使传统处理方式面临挑战，需要可扩展架构进行存储、处理与分析的数据集合。容量大、类型多、速度快是代表特征；数据质量、准确性和分析价值仍需验证，不由数据量直接保证。"
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
          "id": "cloud-resource-pool",
          "title": "云计算：按需使用资源池",
          "explanation": "云计算通过网络按需提供共享的计算资源池，可快速分配和释放资源。资源池、按需服务与弹性是关键特征，成本、可靠性和访问权限仍取决于具体条件。",
          "productionMode": "reuse",
          "learningGoal": "说明云计算资源池与按需服务的关系。",
          "sourceUnitIds": [
            "cs-23-30-p2-cloud-computing-list"
          ],
          "sourceEvidence": [
            "云计算通过网络按需提供共享的可配置计算资源池，包括计算、存储、网络等资源或服务，可按需求快速分配和释放。资源池化、按需服务和快速弹性是重要特征；虚拟化是常见实现技术。接入受网络与权限等条件约束，成本和可靠性取决于具体方案，不能视为无条件保证。"
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
          "id": "cloud-elasticity",
          "title": "云计算的弹性与使用条件",
          "explanation": "云计算的弹性是根据需求调整所使用的计算、存储等资源，需求降低时也可释放资源。它不表示物理资源没有上限，访问和服务表现还受网络、权限及具体方案约束。",
          "productionMode": "light-edit",
          "learningGoal": "说明云资源伸缩的含义和条件。",
          "sourceUnitIds": [
            "cs-23-30-p2-cloud-computing-list"
          ],
          "sourceEvidence": [
            "云计算通过网络按需提供共享的可配置计算资源池，包括计算、存储、网络等资源或服务，可按需求快速分配和释放。资源池化、按需服务和快速弹性是重要特征；虚拟化是常见实现技术。接入受网络与权限等条件约束，成本和可靠性取决于具体方案，不能视为无条件保证。"
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
          "id": "iot-devices",
          "title": "物联网：设备感知与数据交换",
          "explanation": "物联网使设备通过传感、计算与网络连接同物理世界交互并交换数据。传感器、控制器、家用设备等可以成为连接对象，但需要相应设备、接口、协议与网络条件。",
          "productionMode": "light-edit",
          "learningGoal": "说明物联网连接对象与基本实现条件。",
          "sourceUnitIds": [
            "cs-23-30-p2-iot-list"
          ],
          "sourceEvidence": [
            "物联网通过传感、计算、网络连接等能力，使设备与物理世界交互并交换数据。传感器、控制器和家用设备是代表对象；连接需要相应设备、协议和网络条件，不表示所有物品已自动联网。"
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
          "id": "ai-definition",
          "title": "人工智能的研究目标",
          "explanation": "人工智能是研究如何应用计算机软硬件模拟人类某些智能行为的理论、方法和技术，其目标是让机器完成一些通常需要人类智能才能完成的复杂工作。",
          "productionMode": "reuse",
          "learningGoal": "说明人工智能的研究对象和任务目标。",
          "sourceUnitIds": [
            "cs-23-30-p2-ai-list"
          ],
          "sourceEvidence": [
            "人工智能：是研究如何应用计算机的软硬件来模拟人类某些智能行为的基本理论、方法和技术。其目标是让机器能够胜任一些通常需要人类智能才能完成的复杂工作。"
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
          "id": "ai-capability-boundary",
          "title": "人工智能能力有任务边界",
          "explanation": "人工智能可以在特定任务中表现出识别、预测或决策等能力，具体表现取决于所用方法、数据和应用条件。某一任务完成得好，并不能直接推出机器具备人类在各方面的智能。",
          "productionMode": "light-edit",
          "learningGoal": "区分特定智能任务能力与全面人类智能。",
          "sourceUnitIds": [
            "cs-23-30-p2-ai-list"
          ],
          "sourceEvidence": [
            "人工智能：是研究如何应用计算机的软硬件来模拟人类某些智能行为的基本理论、方法和技术。其目标是让机器能够胜任一些通常需要人类智能才能完成的复杂工作。"
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
      "pointId": "communication-technology",
      "id": "latest-generation",
      "title": "永久最新一代标签",
      "reason": "最新一代依赖技术发展与具体标准口径，长期卡片应使用明确代际定义，而不是把当前排序当成稳定事实。",
      "requiredEvidence": "如讨论最新代际，需给出截止日期、标准阶段和商用状态；基础卡保留第五代定义。",
      "sourceUnitIds": [
        "cs-23-30-p1-5g-list"
      ]
    },
    {
      "pointId": "communication-technology",
      "id": "fiber-always-cheapest",
      "title": "光纤无条件经济",
      "reason": "经济性受建设距离、布线条件、设备与维护等因素影响，缺少比较对象时不能把更经济当成普遍结论。",
      "requiredEvidence": "取得具体比较场景和成本口径后再评价经济性，本批只讲稳定传输特征。",
      "sourceUnitIds": [
        "cs-23-30-p1-fiber-communication-list"
      ]
    },
    {
      "pointId": "information-tech",
      "id": "unqualified-1024",
      "title": "未注明单位口径的一概换算",
      "reason": "原句把GB、MB无条件写成1024倍，混淆标准十进制前缀与传统教材约定；正文已纠正，不保留原断言卡。",
      "requiredEvidence": "必须区分GB与GiB等单位，并在采用传统教材约定时明确条件后才可计算。",
      "sourceUnitIds": [
        "cs-23-30-p1-computer-concepts-list"
      ]
    },
    {
      "pointId": "information-tech",
      "id": "fixed-memory-ranking",
      "title": "任意内外存固定性能排名",
      "reason": "内外存比较只能作为传统层次的典型特征，实际设备的容量、价格和速度随型号与条件变化，不能固定全序。",
      "requiredEvidence": "需要具体设备、性能指标和测试条件，才可给出针对型号的大小或速度排名。",
      "sourceUnitIds": [
        "cs-23-30-p1-computer-system-list"
      ]
    },
    {
      "pointId": "information-technology-applications",
      "id": "automatic-data-value",
      "title": "大数据天然准确且价值高",
      "reason": "数据量大不自动保证准确性和价值，缺失、偏差与方法错误仍会影响结论；原表述已在正文与回顾中限定。",
      "requiredEvidence": "对准确性和应用价值提出可检验目标，核验数据质量及分析方法，而非仅用数据规模证明。",
      "sourceUnitIds": [
        "cs-23-30-p1-p2-big-data-list"
      ]
    },
    {
      "pointId": "information-technology-applications",
      "id": "unconditional-cloud-guarantees",
      "title": "云计算无条件可靠低成本",
      "reason": "成本、可靠性及任意位置接入都需要具体服务、网络和权限条件，不能从云计算定义直接推出全部保障。",
      "requiredEvidence": "提供服务范围、网络条件和具体方案的证据后才能比较成本与可靠性，不作为基础定义承诺。",
      "sourceUnitIds": [
        "cs-23-30-p2-cloud-computing-list"
      ]
    },
    {
      "pointId": "information-technology-applications",
      "id": "everything-already-connected",
      "title": "任何物品自动联网",
      "reason": "物联网描述设备连接及数据交互能力，不能把连接对象可扩展误解为所有现实物品已经自动联网。",
      "requiredEvidence": "说明设备的感知、计算、接口、协议和网络条件后，才能判断具体物品能否接入。",
      "sourceUnitIds": [
        "cs-23-30-p2-iot-list"
      ]
    }
  ]
};
