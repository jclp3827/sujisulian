const Q={
  "light-primary-colors-core": {
    "explanation": "色光加色模型的三原色是红、绿、蓝。传统绘画的红黄蓝与现代印刷的青品红黄属于不同模型。"
  },
  "pigment-primary-colors-core": {
    "prompt": "传统绘画入门课采用红黄蓝教学原色模型，准备三种基础颜料调配颜色。该模型的原色是哪组？",
    "explanation": "本题明确限定传统绘画红黄蓝模型，不将其当作现代印刷青品红黄减色模型的通用替代。"
  },
  "light-color-mixing-core": {
    "explanation": "在色光加色模型中，适当比例的红绿光叠加可呈黄，红绿蓝可呈白。颜料混合属于不同模型，不可照搬。"
  },
  "pigment-color-mixing-core": {
    "prompt": "在传统红黄蓝颜料模型的基础近似中，下列对混合结果的描述哪项较合理？",
    "options": [
      "红绿颜料混合为黄，三色混合为白",
      "红黄可调橙，三色混合趋向深暗色",
      "红蓝颜料混合为品红，三色混合为白"
    ],
    "explanation": "传统红黄蓝模型中红黄可调橙，多种颜料混合通常趋向深暗色；实际结果受颜料种类和比例影响，不能断言严格为黑。"
  },
  "primary-colors-full": {
    "prompt": "技术人员对比色光加色模型与现代印刷减色模型，哪项说明正确？",
    "options": [
      "二者都以红黄蓝为原色，三色混合都得到白色",
      "色光原色是青品红黄，印刷原色是红绿蓝",
      "色光加色原色为红绿蓝；现代印刷减色原色为青品红黄"
    ],
    "explanation": "色光加色与印刷减色的机制和原色不同，传统绘画的红黄蓝教学模型也不能不加条件地取代现代印刷模型。"
  },
  "white-black-opaque-core": {
    "options": [
      "白色主要吸收各类可见色光，黑色主要反射",
      "白色对多种可见色光反射较强，黑色吸收较强",
      "白色和黑色都只反射红色单色光"
    ],
    "explanation": "这是反射和吸收强弱的基础比较，不表示现实白色物体反射率严格为全部、黑色物体吸收率严格为全部。"
  },
  "red-clothes-core": {
    "options": [
      "衣服主要反射入射光中的红光",
      "衣服主要吸收红光并反射其他色光",
      "衣服使全部红光透过到背面"
    ],
    "explanation": "白光含红光，衣服主要将红光反射到人眼。若照明中缺少红光，红衣可能显得暗，不能忽略入射光条件。"
  },
  "object-colors-full": {
    "options": [
      "透明和不透明物体都只看透过光，白色主要吸收各色光",
      "透明和不透明物体都只看反射光，黑色主要反射各色光",
      "透明物体关注透过光，不透明物体关注反射光，外观还受入射光影响"
    ],
    "explanation": "外观取决于照明与材料对各色光的透过、反射和吸收。白色反射较强、黑色吸收较强，不宜压缩为现实中全反全吸。"
  }
};
const T={
  "cs-target-pigment-primary-colors": {
    "conclusion": "传统绘画入门常用红黄蓝原色模型，现代印刷减色模型常用青品红黄，两者须说明语境。"
  },
  "cs-target-pigment-color-mixing": {
    "conclusion": "传统红黄蓝模型中红黄可调橙，红蓝可调紫，黄蓝可调绿；多色颜料混合趋向深暗色，实际结果受种类和比例影响。"
  },
  "cs-target-white-black-opaque": {
    "conclusion": "白色物体对多种可见色光反射较强，黑色物体吸收较强，不表示现实反射或吸收严格为全部。"
  },
  "cs-target-red-clothes": {
    "conclusion": "白光下红衣主要反射入射光中的红光，缺少红光的照明下可能显暗，颜色还依赖照明。"
  }
};
const M={
  "mirage-memory": {
    "text": "蜃景由不均匀空气使光连续折射，影像位置与实物不同；海面沙漠等可见，不把所有蜃景都归于全反射。",
    "phrasePatches": {
      "cs-target-mirage-cause-memory": {
        "meaning": "蜃景主要由温度、密度不同的空气层使光连续折射形成，不应无条件归为全反射。"
      }
    }
  },
  "primary-colors-memory": {
    "text": "色光加色原色红绿蓝；传统绘画教学原色红黄蓝；现代印刷减色原色青品红黄。颜料混合结果受种类与比例影响。",
    "coverage": "色光、传统绘画与现代印刷是不同模型，混合结果不得跨模型套用。",
    "phrasePatches": {
      "cs-target-pigment-primary-colors-memory": {
        "phrase": "传统绘画教学：红黄蓝",
        "meaning": "传统绘画入门常用红黄蓝原色模型，现代印刷减色模型常用青品红黄，两者须说明语境。"
      },
      "cs-target-pigment-color-mixing-memory": {
        "phrase": "传统颜料混合趋向深暗色",
        "meaning": "传统红黄蓝模型中红黄可调橙，红蓝可调紫，黄蓝可调绿；多色颜料混合趋向深暗色，实际结果受种类和比例影响。"
      }
    }
  },
  "object-colors-memory": {
    "text": "透明看透过，不透明看反射；白反射较强，黑吸收较强；红衣在白光下主要反红，缺红光时可显暗。",
    "coverage": "物体外观与材料和入射光共同有关，现实白黑物体不严格全反全吸。",
    "phrasePatches": {
      "cs-target-white-black-opaque-memory": {
        "phrase": "白反射较强，黑吸收较强",
        "meaning": "白色物体对多种可见色光反射较强，黑色物体吸收较强，不表示现实反射或吸收严格为全部。"
      },
      "cs-target-red-clothes-memory": {
        "phrase": "白光下红衣主要反红",
        "meaning": "白光下红衣主要反射入射光中的红光，缺少红光的照明下可能显暗，颜色还依赖照明。"
      }
    }
  }
};
const S={
  "primary-colors-full": {
    "0": "色光加色原色不是红黄蓝，两种模型的原色和混合机制不同。",
    "1": "该项将色光与现代印刷的原色颠倒。"
  }
};
const AFFECTED={"questions":["sound-pitch","sound-loudness","sound-timbre","light-shadow","light-reflection","light-refraction","heat-conduction","heat-convection","heat-radiation","sound-pitch-timbre-scenario","sound-loudness-condition","si-base-count","si-length-mass-time","si-current-temperature","si-amount-luminous","si-base-full-contrast","si-derived-frequency-force","si-derived-pressure-energy","si-derived-power-charge","si-derived-voltage-resistance","si-derived-full-contrast","light-electromagnetic-core","light-year-core","visible-light-core","visible-order-core","light-basics-full","infrared-wavelength-core","infrared-applications-core","ultraviolet-wavelength-core","ultraviolet-applications-core","infrared-ultraviolet-full","light-straight-condition-core","light-straight-examples-core","light-reflection-definition-core","specular-diffuse-core","propagation-reflection-full","light-refraction-definition-core","lens-mirror-functions-core","total-reflection-core","light-scattering-core","refraction-scattering-full","mirage-alias-core","mirage-cause-core","mirage-image-core","mirage-locations-core","mirage-full","rainbow-cause-core","rainbow-order-core","secondary-rainbow-core","rainbow-sun-position-core","rainbow-secondary-full","light-primary-colors-core","pigment-primary-colors-core","light-color-mixing-core","pigment-color-mixing-core","primary-colors-full","transparent-color-core","opaque-color-core","white-black-opaque-core","red-clothes-core","object-colors-full"],"mnemonics":["sound-memory","light-phenomena-memory","heat-mechanisms-memory","si-base-units-memory","si-named-derived-memory","light-basics-memory","infrared-ultraviolet-memory","propagation-reflection-memory","refraction-scattering-memory","mirage-memory","rainbow-secondary-memory","primary-colors-memory","object-colors-memory"]};
module.exports=function(pack){const prior=pack.version,migrations=pack.sessionMigrations.filter(m=>!m.toPackVersion||m.toPackVersion===prior);for(const [kind,patches]of [["questions",Q],["targets",T],["mnemonics",M]])for(const [id,delta]of Object.entries(patches)){const x=pack[kind].find(x=>x.id===id);if(!x)throw Error("Missing physical-concepts-conditions item "+id);const {phrasePatches,...fields}=delta;Object.assign(x,fields,{revision:x.revision+1});if(phrasePatches)x.phrases=x.phrases.map(p=>({...p,...phrasePatches[p.id]}));}for(const s of pack.questionSpecifications)if(S[s.questionId])s.distractorReasons=S[s.questionId];for(const s of pack.mnemonicSpecifications)if(M[s.mnemonicId]){const m=pack.mnemonics.find(m=>m.id===s.mnemonicId);s.revision=m.revision;s.purpose=m.purpose;s.method=m.method;s.conditionCount=m.conditions.length;}pack.version="2026-10-25.2";pack.sessionMigrations=pack.sessionMigrations.concat(migrations.map(m=>({...m,toPackVersion:pack.version,changedQuestionIds:[...new Set([...(m.changedQuestionIds||[]),...AFFECTED.questions])],changedMnemonicIds:[...new Set([...(m.changedMnemonicIds||[]),...AFFECTED.mnemonics])]})),[{"fromVersion":"d27b468d","toPackVersion":"2026-10-25.2","changedQuestionIds":["sound-pitch","sound-loudness","sound-timbre","light-shadow","light-reflection","light-refraction","heat-conduction","heat-convection","heat-radiation","sound-pitch-timbre-scenario","sound-loudness-condition","si-base-count","si-length-mass-time","si-current-temperature","si-amount-luminous","si-base-full-contrast","si-derived-frequency-force","si-derived-pressure-energy","si-derived-power-charge","si-derived-voltage-resistance","si-derived-full-contrast","light-electromagnetic-core","light-year-core","visible-light-core","visible-order-core","light-basics-full","infrared-wavelength-core","infrared-applications-core","ultraviolet-wavelength-core","ultraviolet-applications-core","infrared-ultraviolet-full","light-straight-condition-core","light-straight-examples-core","light-reflection-definition-core","specular-diffuse-core","propagation-reflection-full","light-refraction-definition-core","lens-mirror-functions-core","total-reflection-core","light-scattering-core","refraction-scattering-full","mirage-alias-core","mirage-cause-core","mirage-image-core","mirage-locations-core","mirage-full","rainbow-cause-core","rainbow-order-core","secondary-rainbow-core","rainbow-sun-position-core","rainbow-secondary-full","light-primary-colors-core","pigment-primary-colors-core","light-color-mixing-core","pigment-color-mixing-core","primary-colors-full","transparent-color-core","opaque-color-core","white-black-opaque-core","red-clothes-core","object-colors-full"],"changedMnemonicIds":["sound-memory","light-phenomena-memory","heat-mechanisms-memory","si-base-units-memory","si-named-derived-memory","light-basics-memory","infrared-ultraviolet-memory","propagation-reflection-memory","refraction-scattering-memory","mirage-memory","rainbow-secondary-memory","primary-colors-memory","object-colors-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"},{"fromVersion":"a57b9ee8","toPackVersion":"2026-10-25.2","changedQuestionIds":["sound-pitch","sound-loudness","sound-timbre","light-shadow","light-reflection","light-refraction","heat-conduction","heat-convection","heat-radiation","sound-pitch-timbre-scenario","sound-loudness-condition","si-base-count","si-length-mass-time","si-current-temperature","si-amount-luminous","si-base-full-contrast","si-derived-frequency-force","si-derived-pressure-energy","si-derived-power-charge","si-derived-voltage-resistance","si-derived-full-contrast","light-electromagnetic-core","light-year-core","visible-light-core","visible-order-core","light-basics-full","infrared-wavelength-core","infrared-applications-core","ultraviolet-wavelength-core","ultraviolet-applications-core","infrared-ultraviolet-full","light-straight-condition-core","light-straight-examples-core","light-reflection-definition-core","specular-diffuse-core","propagation-reflection-full","light-refraction-definition-core","lens-mirror-functions-core","total-reflection-core","light-scattering-core","refraction-scattering-full","mirage-alias-core","mirage-cause-core","mirage-image-core","mirage-locations-core","mirage-full","rainbow-cause-core","rainbow-order-core","secondary-rainbow-core","rainbow-sun-position-core","rainbow-secondary-full","light-primary-colors-core","pigment-primary-colors-core","light-color-mixing-core","pigment-color-mixing-core","primary-colors-full","transparent-color-core","opaque-color-core","white-black-opaque-core","red-clothes-core","object-colors-full"],"changedMnemonicIds":["sound-memory","light-phenomena-memory","heat-mechanisms-memory","si-base-units-memory","si-named-derived-memory","light-basics-memory","infrared-ultraviolet-memory","propagation-reflection-memory","refraction-scattering-memory","mirage-memory","rainbow-secondary-memory","primary-colors-memory","object-colors-memory"],"reason":"来源及关联内容复核；按现有身份与签名协议失效受影响进度，保留无关记录和会话。"}]);return pack;};
module.exports.reviewedIds={"questions":["sound-pitch","sound-loudness","sound-timbre","light-shadow","light-reflection","light-refraction","heat-conduction","heat-convection","heat-radiation","sound-pitch-timbre-scenario","sound-loudness-condition","si-base-count","si-length-mass-time","si-current-temperature","si-amount-luminous","si-base-full-contrast","si-derived-frequency-force","si-derived-pressure-energy","si-derived-power-charge","si-derived-voltage-resistance","si-derived-full-contrast","light-electromagnetic-core","light-year-core","visible-light-core","visible-order-core","light-basics-full","infrared-wavelength-core","infrared-applications-core","ultraviolet-wavelength-core","ultraviolet-applications-core","infrared-ultraviolet-full","light-straight-condition-core","light-straight-examples-core","light-reflection-definition-core","specular-diffuse-core","propagation-reflection-full","light-refraction-definition-core","lens-mirror-functions-core","total-reflection-core","light-scattering-core","refraction-scattering-full","mirage-alias-core","mirage-cause-core","mirage-image-core","mirage-locations-core","mirage-full","rainbow-cause-core","rainbow-order-core","secondary-rainbow-core","rainbow-sun-position-core","rainbow-secondary-full","light-primary-colors-core","pigment-primary-colors-core","light-color-mixing-core","pigment-color-mixing-core","primary-colors-full","transparent-color-core","opaque-color-core","white-black-opaque-core","red-clothes-core","object-colors-full"],"targets":["cs-target-sound-pitch-frequency","cs-target-sound-loudness-amplitude","cs-target-sound-timbre-identification","cs-target-si-base-set","cs-target-si-length-mass-time","cs-target-si-current-temperature","cs-target-si-amount-luminous","cs-target-si-derived-frequency-force","cs-target-si-derived-pressure-energy","cs-target-si-derived-power-charge","cs-target-si-derived-voltage-resistance","cs-target-light-electromagnetic","cs-target-light-year","cs-target-visible-light","cs-target-visible-order","cs-target-infrared-wavelength","cs-target-infrared-applications","cs-target-ultraviolet-wavelength","cs-target-ultraviolet-applications","cs-target-light-straight-condition","cs-target-light-straight-examples","cs-target-light-reflection-definition","cs-target-specular-diffuse","cs-target-light-refraction-definition","cs-target-lens-mirror-functions","cs-target-total-reflection","cs-target-light-scattering","cs-target-mirage-alias","cs-target-mirage-cause","cs-target-mirage-image","cs-target-mirage-locations","cs-target-rainbow-cause","cs-target-rainbow-order","cs-target-secondary-rainbow","cs-target-rainbow-sun-position","cs-target-light-primary-colors","cs-target-pigment-primary-colors","cs-target-light-color-mixing","cs-target-pigment-color-mixing","cs-target-transparent-color","cs-target-opaque-color","cs-target-white-black-opaque","cs-target-red-clothes","q0b-target-light-shadow","q0b-target-light-reflection","q0b-target-light-refraction","q0b-target-heat-conduction","q0b-target-heat-convection","q0b-target-heat-radiation"],"mnemonics":["sound-memory","light-phenomena-memory","heat-mechanisms-memory","si-base-units-memory","si-named-derived-memory","light-basics-memory","infrared-ultraviolet-memory","propagation-reflection-memory","refraction-scattering-memory","mirage-memory","rainbow-secondary-memory","primary-colors-memory","object-colors-memory"]};
module.exports.directIds={"questions":["sound-pitch","sound-loudness","sound-timbre","light-shadow","light-reflection","light-refraction","heat-conduction","heat-convection","heat-radiation","sound-pitch-timbre-scenario","sound-loudness-condition","si-base-count","si-length-mass-time","si-current-temperature","si-amount-luminous","si-base-full-contrast","si-derived-frequency-force","si-derived-pressure-energy","si-derived-power-charge","si-derived-voltage-resistance","si-derived-full-contrast","light-electromagnetic-core","light-year-core","visible-light-core","visible-order-core","light-basics-full","infrared-wavelength-core","infrared-applications-core","ultraviolet-wavelength-core","ultraviolet-applications-core","infrared-ultraviolet-full","light-straight-condition-core","light-straight-examples-core","light-reflection-definition-core","specular-diffuse-core","propagation-reflection-full","light-refraction-definition-core","lens-mirror-functions-core","total-reflection-core","light-scattering-core","refraction-scattering-full","mirage-alias-core","mirage-cause-core","mirage-image-core","mirage-locations-core","mirage-full","rainbow-cause-core","rainbow-order-core","secondary-rainbow-core","rainbow-sun-position-core","rainbow-secondary-full","light-primary-colors-core","pigment-primary-colors-core","light-color-mixing-core","pigment-color-mixing-core","primary-colors-full","transparent-color-core","opaque-color-core","white-black-opaque-core","red-clothes-core","object-colors-full"],"targets":["cs-target-sound-pitch-frequency","cs-target-sound-loudness-amplitude","cs-target-sound-timbre-identification","cs-target-si-base-set","cs-target-si-length-mass-time","cs-target-si-current-temperature","cs-target-si-amount-luminous","cs-target-si-derived-frequency-force","cs-target-si-derived-pressure-energy","cs-target-si-derived-power-charge","cs-target-si-derived-voltage-resistance","cs-target-light-electromagnetic","cs-target-light-year","cs-target-visible-light","cs-target-visible-order","cs-target-infrared-wavelength","cs-target-infrared-applications","cs-target-ultraviolet-wavelength","cs-target-ultraviolet-applications","cs-target-light-straight-condition","cs-target-light-straight-examples","cs-target-light-reflection-definition","cs-target-specular-diffuse","cs-target-light-refraction-definition","cs-target-lens-mirror-functions","cs-target-total-reflection","cs-target-light-scattering","cs-target-mirage-alias","cs-target-mirage-cause","cs-target-mirage-image","cs-target-mirage-locations","cs-target-rainbow-cause","cs-target-rainbow-order","cs-target-secondary-rainbow","cs-target-rainbow-sun-position","cs-target-light-primary-colors","cs-target-pigment-primary-colors","cs-target-light-color-mixing","cs-target-pigment-color-mixing","cs-target-transparent-color","cs-target-opaque-color","cs-target-white-black-opaque","cs-target-red-clothes","q0b-target-light-shadow","q0b-target-light-reflection","q0b-target-light-refraction","q0b-target-heat-conduction","q0b-target-heat-convection","q0b-target-heat-radiation"],"mnemonics":["sound-memory","light-phenomena-memory","heat-mechanisms-memory","si-base-units-memory","si-named-derived-memory","light-basics-memory","infrared-ultraviolet-memory","propagation-reflection-memory","refraction-scattering-memory","mirage-memory","rainbow-secondary-memory","primary-colors-memory","object-colors-memory"]};
module.exports.semanticChanges={"questions":["light-primary-colors-core","pigment-primary-colors-core","light-color-mixing-core","pigment-color-mixing-core","primary-colors-full","white-black-opaque-core","red-clothes-core","object-colors-full"],"targets":["cs-target-pigment-primary-colors","cs-target-pigment-color-mixing","cs-target-white-black-opaque","cs-target-red-clothes"],"mnemonics":["mirage-memory","primary-colors-memory","object-colors-memory"]};
