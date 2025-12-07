import React, { useState } from 'react';
import { PetType } from '../types';
import { ChevronDown, ChevronUp, Book, Info, PawPrint } from 'lucide-react';

interface BreedData {
    name: string;
    desc: string;
    tips: string[];
}

interface PetGuideData {
    overview: string;
    tips: string[];
    taboos: string[];
    breeds: BreedData[];
}

const STATIC_GUIDES: Record<PetType, PetGuideData> = {
  [PetType.CAT]: {
    overview: "猫咪是独立而爱干净的动物，需要高质量的动物蛋白。",
    tips: ["定期梳毛减少毛球症", "保持猫砂盆清洁", "一定要封窗防止坠楼", "多喝水预防肾病"],
    taboos: ["百合花(剧毒)", "精油/蚊香(除菊酯类)", "牛奶(乳糖不耐)", "生骨头(易划伤肠胃)"],
    breeds: [
        {
            name: "布偶猫",
            desc: "性格温顺，被称为'小狗猫'，体型较大，毛发长。",
            tips: ["毛发容易打结，需要每天梳理", "肠胃较脆弱，饮食需固定", "粘人，需要主人陪伴"]
        },
        {
            name: "英国短毛猫",
            desc: "圆脸圆身，性格稳定，适应力强，是理想的家庭宠物。",
            tips: ["容易发腮，但也容易肥胖，需控制食量", "毛发浓密，换毛季掉毛量大", "注意心肌肥大症遗传病"]
        },
        {
            name: "美短/狸花",
            desc: "活泼好动，身体强壮，狩猎本能强。",
            tips: ["精力旺盛，需要大量玩具和互动", "不易生病，适合新手", "注意防止逃跑丢失"]
        },
        {
            name: "无毛猫",
            desc: "皮肤无毛，性格极其粘人，像小暖炉。",
            tips: ["皮肤会出油，需要定期洗澡或擦拭", "怕冷，冬天必须穿衣保暖", "新陈代谢快，食量较大"]
        }
    ]
  },
  [PetType.DOG]: {
    overview: "狗狗需要大量的陪伴和运动，是人类忠实的朋友。",
    tips: ["每天定时遛狗", "定期进行社会化训练", "按时接种核心疫苗", "注意防范寄生虫"],
    taboos: ["巧克力/木糖醇", "葡萄/葡萄干", "洋葱/大蒜", "煮熟的骨头(易刺穿肠胃)"],
    breeds: [
        {
            name: "金毛寻回犬",
            desc: "暖男，性格温和，智商高，对人友善。",
            tips: ["掉毛严重，人称'金毛'狮王", "需要较大运动量", "贪吃，容易发胖，需控制饮食", "髋关节易发育不良"]
        },
        {
            name: "泰迪/贵宾",
            desc: "聪明活泼，不掉毛，造型多变。",
            tips: ["需要定期美容修剪毛发", "容易有泪痕，饮食需清淡", "髌骨易脱位，避免直立行走"]
        },
        {
            name: "哈士奇",
            desc: "精力旺盛，性格独立，表情丰富，'拆迁办主任'。",
            tips: ["运动量极大，不仅要遛还要跑", "肠胃被称为'玻璃胃'，饮食需小心", "撒手没，遛狗必须牵绳"]
        },
        {
            name: "边境牧羊犬",
            desc: "智商排名第一，理解能力极强，需要脑力游戏。",
            tips: ["需要大量运动和飞盘等脑力活动", "如果你不陪它玩，它会自己找乐子(拆家)", "掉毛也比较厉害"]
        }
    ]
  },
  [PetType.RABBIT]: {
    overview: "兔子肠胃脆弱，需要无限量的牧草作为主食。",
    tips: ["提摩西草无限量供应", "兔粮适量，蔬菜少量", "一定要喝凉白开", "不可以提耳朵"],
    taboos: ["淀粉类食物(面包/饼干)", "生水(容易拉肚子)", "过度惊吓", "球虫感染(需定期预防)"],
    breeds: [
        {
            name: "垂耳兔",
            desc: "耳朵下垂，外形可爱呆萌。",
            tips: ["耳朵容易闷热滋生细菌，需定期检查清洁", "体型相对较圆润", "性格比较文静"]
        },
        {
            name: "侏儒兔",
            desc: "体型极小，耳朵短小，非常活泼。",
            tips: ["非常胆小，环境需要安静", "骨骼脆弱，抱的时候要小心", "因为体型小，容易低血糖"]
        },
        {
            name: "道奇兔",
            desc: "脸上花色像熊猫，性格温和。",
            tips: ["常见的宠物兔品种，身体素质相对较好", "换毛期需要勤梳毛预防毛球症"]
        }
    ]
  },
  [PetType.HAMSTER]: {
    overview: "仓鼠是独居动物，严禁合笼饲养。",
    tips: ["一鼠一笼，严禁合笼", "使用无尘垫料", "跑轮直径要够大", "避免阳光直射"],
    taboos: ["水洗澡(会失温致死)", "合笼(会打架致死)", "人类零食(高油盐)", "阳光直射"],
    breeds: [
        {
            name: "金丝熊(叙利亚仓鼠)",
            desc: "体型较大，性格相对温顺，容易上手。",
            tips: ["需要21cm以上的大跑轮", "笼子底盘要大，可以不用太高", "尿量大，需要定期清理尿沙"]
        },
        {
            name: "三线/银狐",
            desc: "体型小，性格多变，上手需要耐心。",
            tips: ["容易得糖尿病，水果干要少喂", "跑轮17cm左右即可", "特别喜欢钻洞"]
        },
        {
            name: "公婆鼠",
            desc: "体型最小，速度极快，被誉为'掌上飞车'。",
            tips: ["几乎无法上手盘玩，适合观赏", "容易出油，浴沙必不可少", "群居性相对好一点，但新手仍建议分笼"]
        }
    ]
  },
  [PetType.SQUIRREL]: {
    overview: "松鼠活泼好动，需要较大的垂直活动空间。",
    tips: ["提供足够高的笼子供其攀爬", "主食以专用鼠粮为主，坚果为零食", "需要磨牙物品", "每天放风时间要充足"],
    taboos: ["过量喂食瓜子(易上火/脂肪肝)", "杏仁(生苦杏仁有毒)", "巧克力", "含盐人类食物"],
    breeds: [
        {
            name: "魔王松鼠",
            desc: "毛色多变，耳毛长，性格相对亲人。",
            tips: ["换毛期耳毛会变长，非常漂亮", "指甲尖锐，互动建议剪指甲", "秋季会有藏食行为"]
        },
        {
            name: "雪地松鼠",
            desc: "体型较大，毛色鲜艳，价格相对较高。",
            tips: ["需要更大的活动空间", "性格比较独立", "耐寒能力较强，但怕热"]
        }
    ]
  },
  [PetType.GOLDFISH]: {
    overview: "金鱼对水质要求较高，'养鱼先养水'。",
    tips: ["定期换水，每次换1/3", "配备过滤系统", "喂食要少量多餐，防止撑死", "新鱼入缸要过水"],
    taboos: ["直接使用自来水(需困水除氯)", "过度喂食", "密度过大(缺氧)", "温差过大"],
    breeds: [
        {
            name: "兰寿",
            desc: "金鱼之王，无背鳍，头瘤发达。",
            tips: ["水流不能太急，游姿笨拙", "水位不宜过深", "需要高蛋白饲料发头"]
        },
        {
            name: "泰狮",
            desc: "尾巴大而飘逸，观赏性极强。",
            tips: ["需要较高的水位利于尾巴生长", "注意防止尾巴充血", "适合侧视观赏"]
        }
    ]
  },
  [PetType.TURTLE]: {
    overview: "乌龟需要晒背来补充钙质和杀菌。",
    tips: ["配备晒背灯或定期晒太阳", "水龟需要浅水过背", "定期刷背防止腐甲", "冬眠需要注意温度"],
    taboos: ["温差过大(易感冒/肺炎)", "生肉喂食后不清理(坏水)", "长期无光照(软甲)", "盐分(无法代谢)"],
    breeds: [
        {
            name: "巴西龟",
            desc: "生命力极其顽强，互动性好。",
            tips: ["外来物种严禁放生", "食量大，生长速度快", "性格比较凶猛，不要混养太小的鱼"]
        },
        {
            name: "草龟/中华田园龟",
            desc: "温顺，公龟成熟后可能'墨化'变黑。",
            tips: ["容易腐皮，注意水质", "相比巴西龟更温和", "墨龟非常具有观赏价值"]
        }
    ]
  },
  [PetType.PARROT]: {
    overview: "鹦鹉智商高，需要大量的互动和玩具。",
    tips: ["提供丰富的啃咬玩具", "饮食要多样化(滋养丸+果蔬)", "每天至少陪伴1小时", "注意保暖"],
    taboos: ["鳄梨/牛油果(剧毒)", "特氟龙涂层锅具加热产生的气体(致死)", "巧克力/咖啡", "长期关笼"],
    breeds: [
        {
            name: "虎皮鹦鹉",
            desc: "体型小，羽色丰富，适合新手。",
            tips: ["虽然小但很吵", "可以学会简单的话", "容易患一种叫'疥癣'的皮肤病"]
        },
        {
            name: "玄凤鹦鹉",
            desc: "脸上有腮红，头上有羽冠，性格温顺。",
            tips: ["羽粉较多，呼吸道敏感者慎养", "吹口哨高手", "胆子比较小，容易夜惊"]
        }
    ]
  },
  [PetType.OTHER]: {
    overview: "其他异宠需要极强的专业知识。",
    tips: ["先查资料，再养宠物", "温度湿度控制是关键", "寻找专业的异宠医生"],
    taboos: ["盲目跟风", "随意放生", "乱喂食物"],
    breeds: []
  }
};

export const CareGuide: React.FC = () => {
  const [selectedType, setSelectedType] = useState<PetType>(PetType.CAT);
  const [expandGuide, setExpandGuide] = useState(true);
  const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

  const guide = STATIC_GUIDES[selectedType];
  
  const getPetTypeLabel = (t: PetType) => {
    switch (t) {
      case PetType.CAT: return '猫咪';
      case PetType.DOG: return '狗狗';
      case PetType.RABBIT: return '兔子';
      case PetType.HAMSTER: return '仓鼠';
      case PetType.SQUIRREL: return '松鼠';
      case PetType.GOLDFISH: return '金鱼';
      case PetType.TURTLE: return '乌龟';
      case PetType.PARROT: return '鹦鹉';
      default: return '其他';
    }
  };

  const getPetEmoji = (t: PetType) => {
    switch (t) {
      case PetType.CAT: return '🐱';
      case PetType.DOG: return '🐶';
      case PetType.RABBIT: return '🐰';
      case PetType.HAMSTER: return '🐹';
      case PetType.SQUIRREL: return '🐿️';
      case PetType.GOLDFISH: return '🐠';
      case PetType.TURTLE: return '🐢';
      case PetType.PARROT: return '🦜';
      default: return '🐾';
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">饲养手册</h1>

      {/* Pet Selector */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar mb-6 pb-2">
        {Object.values(PetType).filter(t => t !== PetType.OTHER).map(t => (
          <button
            key={t}
            onClick={() => {
                setSelectedType(t);
                setExpandedBreed(null);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-1 ${
              selectedType === t
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <span>{getPetEmoji(t)}</span>
            <span>{getPetTypeLabel(t)}</span>
          </button>
        ))}
      </div>

      {/* General Guide Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div 
            className="p-5 flex justify-between items-center cursor-pointer bg-indigo-50/50"
            onClick={() => setExpandGuide(!expandGuide)}
        >
            <div className="flex items-center space-x-2">
                <Book className="text-indigo-600 w-5 h-5" />
                <h2 className="font-bold text-gray-800">基础养护指南</h2>
            </div>
            {expandGuide ? <ChevronUp className="text-gray-400 w-4 h-4"/> : <ChevronDown className="text-gray-400 w-4 h-4"/>}
        </div>
        
        {expandGuide && (
            <div className="p-5 pt-2 space-y-5 animate-fade-in">
                <p className="text-gray-600 text-sm leading-relaxed border-l-4 border-indigo-200 pl-3">
                    {guide.overview}
                </p>

                <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-2">✅ 饲养要点</h3>
                    <ul className="grid grid-cols-1 gap-2">
                        {guide.tips.map((tip, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-2">🚫 绝对禁忌</h3>
                    <ul className="grid grid-cols-1 gap-2">
                        {guide.taboos.map((taboo, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600 bg-red-50 p-2 rounded-lg">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {taboo}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
      </div>

      {/* Breeds Section */}
      <div className="space-y-4">
        <h2 className="font-bold text-gray-800 text-lg flex items-center">
            <PawPrint className="w-5 h-5 mr-2 text-indigo-500" />
            品种百科
        </h2>
        
        {guide.breeds.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">暂无详细品种信息</div>
        ) : (
            guide.breeds.map((breed, index) => {
                const isExpanded = expandedBreed === breed.name;
                return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div 
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setExpandedBreed(isExpanded ? null : breed.name)}
                        >
                            <h3 className="font-semibold text-gray-800">{breed.name}</h3>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                        {isExpanded && (
                            <div className="px-4 pb-4 animate-fade-in border-t border-gray-50 pt-3">
                                <p className="text-sm text-gray-600 mb-3 italic">{breed.desc}</p>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center">
                                        <Info className="w-3 h-3 mr-1" />
                                        品种专有贴士
                                    </h4>
                                    <ul className="space-y-1">
                                        {breed.tips.map((tip, tIndex) => (
                                            <li key={tIndex} className="text-sm text-gray-600 pl-2 border-l-2 border-gray-200">
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })
        )}
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50 rounded-xl text-center text-xs text-indigo-400">
         Tip: 每只宠物都有独特的个性，以上指南仅供参考哦。
      </div>
    </div>
  );
};