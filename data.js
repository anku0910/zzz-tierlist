const AGENTS = [
  { id: "belle", name: "鈴", fullName: null, faction: "法厄同", role: null, attribute: null, rank: null, img: null, imgSquare: null, imgRound: null, height: 158, bust: 61.9, hip: 75.5, thigh: 44.3, cup: "21D", available: true },
  { id: "pyrois", name: "佩洛伊斯", fullName: null, faction: "法厄同", role: "強攻", attribute: "以太", rank: "∞", img: "assets/zzz/named-characters/pyrois.webp", imgSquare: "assets/zzz/agents-square/pyrois.webp", imgRound: "assets/zzz/agents-round/pyrois.webp", imgProfile: "assets/zzz/profiles/pyrois.webp", available: true },
  { id: "wise", name: "哲", fullName: null, faction: "法厄同", role: null, attribute: null, rank: null, img: null, imgSquare: null, imgRound: null, available: true },
  { id: "anby", name: "安比", fullName: "安比·德瑪拉", faction: "狡兔屋", role: "擊破", attribute: "電", rank: "A", img: "assets/zzz/named-characters/anby.webp", imgSquare: "assets/zzz/agents-square/anby.webp", imgRound: "assets/zzz/agents-round/anby.webp", imgProfile: "assets/zzz/profiles/anby.webp", height: 156, bust: 63.5, hip: 78.5, thigh: 45.4, cup: "21DD", available: true },
  { id: "billy", name: "比利", fullName: "比利·奇德", faction: "狡兔屋", role: "強攻", attribute: "物理", rank: "A", img: "assets/zzz/named-characters/billy.webp", imgSquare: "assets/zzz/agents-square/billy.webp", imgRound: "assets/zzz/agents-round/billy.webp", imgProfile: "assets/zzz/profiles/billy.webp", available: true },
  { id: "nekomata", name: "貓又", fullName: "貓宮又奈", faction: "狡兔屋", role: "強攻", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/nekomata.webp", imgSquare: "assets/zzz/agents-square/nekomata.webp", imgRound: "assets/zzz/agents-round/nekomata.webp", imgProfile: "assets/zzz/profiles/nekomata.webp", height: 148, bust: 51.9, hip: 67.4, thigh: 39.8, cup: "19C", available: true },
  { id: "nicole", name: "妮可", fullName: "妮可·德瑪拉", faction: "狡兔屋", role: "支援", attribute: "以太", rank: "A", img: "assets/zzz/named-characters/nicole.webp", imgSquare: "assets/zzz/agents-square/nicole.webp", imgRound: "assets/zzz/agents-round/nicole.webp", imgProfile: "assets/zzz/profiles/nicole.webp", height: 165, bust: 68.1, hip: 81.4, thigh: 46.2, cup: "20F", available: true },
  { id: "starlight-billy", name: "星徽·比利", fullName: null, faction: "狡兔屋", role: "命破", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/starlight-billy.webp", imgSquare: "assets/zzz/agents-square/starlight-billy.webp", imgRound: "assets/zzz/agents-round/starlight-billy.webp", imgProfile: "assets/zzz/profiles/starlight-billy.webp", available: true },
  { id: "anton", name: "安東", fullName: "安東·伊萬諾夫", faction: "白祇重工", role: "強攻", attribute: "電", rank: "A", img: "assets/zzz/named-characters/anton.webp", imgSquare: "assets/zzz/agents-square/anton.webp", imgRound: "assets/zzz/agents-round/anton.webp", imgProfile: "assets/zzz/profiles/anton.webp", available: true },
  { id: "grace", name: "格莉絲", fullName: "格莉絲·霍華德", faction: "白祇重工", role: "異常", attribute: "電", rank: "S", img: "assets/zzz/named-characters/grace.webp", imgSquare: "assets/zzz/agents-square/grace.webp", imgRound: "assets/zzz/agents-round/grace.webp", imgProfile: "assets/zzz/profiles/grace.webp", height: 170, bust: 76.4, hip: 91.4, thigh: 52.5, cup: "21GG", available: true },
  { id: "koleda", name: "珂蕾妲", fullName: "珂蕾妲·貝洛伯格", faction: "白祇重工", role: "擊破", attribute: "火", rank: "S", img: "assets/zzz/named-characters/koleda.webp", imgSquare: "assets/zzz/agents-square/koleda.webp", imgRound: "assets/zzz/agents-round/koleda.webp", imgProfile: "assets/zzz/profiles/koleda.webp", height: 150, bust: 50, hip: 66.1, cup: "19B", available: true },
  { id: "ben", name: "本", fullName: "本·比格", faction: "白祇重工", role: "防護", attribute: "火", rank: "A", img: "assets/zzz/named-characters/ben.webp", imgSquare: "assets/zzz/agents-square/ben.webp", imgRound: "assets/zzz/agents-round/ben.webp", imgProfile: "assets/zzz/profiles/ben.webp", available: true },
  { id: "rina", name: "麗娜", fullName: "亞歷山德麗娜·莎芭絲緹安", faction: "維多利亞家政", role: "支援", attribute: "電", rank: "S", img: "assets/zzz/named-characters/rina.webp", imgSquare: "assets/zzz/agents-square/rina.webp", imgRound: "assets/zzz/agents-round/rina.webp", imgProfile: "assets/zzz/profiles/rina.webp", height: 173, bust: 80.5, hip: 92.5, thigh: 54.3, cup: "23GG", available: true },
  { id: "corin", name: "可琳", fullName: "可琳·威克斯", faction: "維多利亞家政", role: "強攻", attribute: "物理", rank: "A", img: "assets/zzz/named-characters/corin.webp", imgSquare: "assets/zzz/agents-square/corin.webp", imgRound: "assets/zzz/agents-round/corin.webp", imgProfile: "assets/zzz/profiles/corin.webp", height: 141, bust: 52.6, hip: 69.4, thigh: 39.8, cup: "19C", available: true },
  { id: "ellen", name: "艾蓮", fullName: "艾蓮·喬", faction: "維多利亞家政", role: "強攻", attribute: "冰", rank: "S", img: "assets/zzz/named-characters/ellen.webp", imgSquare: "assets/zzz/agents-square/ellen.webp", imgRound: "assets/zzz/agents-round/ellen.webp", imgProfile: "assets/zzz/profiles/ellen.webp", height: 161, bust: 63.5, hip: 80.6, thigh: 46, cup: "19F", available: true },
  { id: "lycaon", name: "萊卡恩", fullName: "馮·萊卡恩", faction: "維多利亞家政", role: "擊破", attribute: "冰", rank: "S", img: "assets/zzz/named-characters/lycaon.webp", imgSquare: "assets/zzz/agents-square/lycaon.webp", imgRound: "assets/zzz/agents-round/lycaon.webp", imgProfile: "assets/zzz/profiles/lycaon.webp", available: true },
  { id: "trigger", name: "「扳機」", fullName: "扳機", faction: "奧波勒斯小隊", role: "擊破", attribute: "電", rank: "S", img: "assets/zzz/named-characters/trigger.webp", imgSquare: "assets/zzz/agents-square/trigger.webp", imgRound: "assets/zzz/agents-round/trigger.webp", imgProfile: "assets/zzz/profiles/trigger.webp", height: 173, bust: 69.6, hip: 89, thigh: 52.4, cup: "23E", available: true },
  { id: "soldier-11", name: "「11號」", fullName: "11號", faction: "奧波勒斯小隊", role: "強攻", attribute: "火", rank: "S", img: "assets/zzz/named-characters/soldier-11.webp", imgSquare: "assets/zzz/agents-square/soldier-11.webp", imgRound: "assets/zzz/agents-round/soldier-11.webp", imgProfile: "assets/zzz/profiles/soldier-11.webp", height: 160, bust: 62.9, hip: 81.5, thigh: 46.1, cup: "20E", available: true },
  { id: "orphie-magus", name: "奧菲絲&「鬼火」", fullName: null, faction: "奧波勒斯小隊", role: "強攻", attribute: "火", rank: "S", img: "assets/zzz/named-characters/orphie-and-magus.webp", imgSquare: "assets/zzz/agents-square/orphie-magus.webp", imgRound: "assets/zzz/agents-round/orphie-magus.webp", imgProfile: "assets/zzz/profiles/orphie-magus.webp", height: 158, bust: 66.9, hip: 77.6, thigh: 46.9, cup: "20F", available: true },
  { id: "seed", name: "「席德」", fullName: "席德", faction: "奧波勒斯小隊", role: "強攻", attribute: "電", rank: "S", img: "assets/zzz/named-characters/seed.webp", imgSquare: "assets/zzz/agents-square/seed.webp", imgRound: "assets/zzz/agents-round/seed.webp", imgProfile: "assets/zzz/profiles/seed.webp", height: 153, bust: 60.1, hip: 77, thigh: 45.1, cup: "20D", available: true },
  { id: "zhu-yuan", name: "朱鳶", fullName: null, faction: "刑偵特勤組", role: "強攻", attribute: "以太", rank: "S", img: "assets/zzz/named-characters/zhu-yuan.webp", imgSquare: "assets/zzz/agents-square/zhu-yuan.webp", imgRound: "assets/zzz/agents-round/zhu-yuan.webp", imgProfile: "assets/zzz/profiles/zhu-yuan.webp", height: 175, bust: 71.1, hip: 94.1, thigh: 55.3, cup: "23E", available: true },
  { id: "qingyi", name: "青衣", fullName: null, faction: "刑偵特勤組", role: "擊破", attribute: "電", rank: "S", img: "assets/zzz/named-characters/qingyi.webp", imgSquare: "assets/zzz/agents-square/qingyi.webp", imgRound: "assets/zzz/agents-round/qingyi.webp", imgProfile: "assets/zzz/profiles/qingyi.webp", height: 142, bust: 52.1, hip: 73, thigh: 42.8, cup: "19C", available: true },
  { id: "jane", name: "簡", fullName: "簡·杜", faction: "刑偵特勤組", role: "異常", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/jane.webp", imgSquare: "assets/zzz/agents-square/jane.webp", imgRound: "assets/zzz/agents-round/jane.webp", imgProfile: "assets/zzz/profiles/jane.webp", height: 170, bust: 67.2, hip: 91.4, thigh: 52.9, cup: "22DD", available: true },
  { id: "seth", name: "賽斯", fullName: "賽斯·洛威爾", faction: "刑偵特勤組", role: "防護", attribute: "電", rank: "A", img: "assets/zzz/named-characters/seth.webp", imgSquare: "assets/zzz/agents-square/seth.webp", imgRound: "assets/zzz/agents-round/seth.webp", imgProfile: "assets/zzz/profiles/seth.webp", available: true },
  { id: "lucy", name: "露西", fullName: null, faction: "卡呂冬之子", role: "支援", attribute: "火", rank: "A", img: "assets/zzz/named-characters/lucy.webp", imgSquare: "assets/zzz/agents-square/lucy.webp", imgRound: "assets/zzz/agents-round/lucy.webp", imgProfile: "assets/zzz/profiles/lucy.webp", height: 152, bust: 52.7, hip: 69, thigh: 41.2, cup: "19C", available: true },
  { id: "piper", name: "派派", fullName: "派派·韋爾", faction: "卡呂冬之子", role: "異常", attribute: "物理", rank: "A", img: "assets/zzz/named-characters/piper.webp", imgSquare: "assets/zzz/agents-square/piper.webp", imgRound: "assets/zzz/agents-round/piper.webp", imgProfile: "assets/zzz/profiles/piper.webp", height: 151, bust: 52.4, hip: 75.3, thigh: 44.7, cup: "19C", available: true },
  { id: "caesar", name: "凱撒", fullName: "凱撒·金", faction: "卡呂冬之子", role: "防護", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/caesar.webp", imgSquare: "assets/zzz/agents-square/caesar.webp", imgRound: "assets/zzz/agents-round/caesar.webp", imgProfile: "assets/zzz/profiles/caesar.webp", height: 176, bust: 78.3, hip: 91.7, thigh: 53.8, cup: "23G", available: true },
  { id: "burnice", name: "柏妮思", fullName: null, faction: "卡呂冬之子", role: "異常", attribute: "火", rank: "S", img: "assets/zzz/named-characters/burnice.webp", imgSquare: "assets/zzz/agents-square/burnice.webp", imgRound: "assets/zzz/agents-round/burnice.webp", imgProfile: "assets/zzz/profiles/burnice.webp", height: 160, bust: 67.4, hip: 79.6, thigh: 46.1, cup: "21F", available: true },
  { id: "lighter", name: "萊特", fullName: null, faction: "卡呂冬之子", role: "擊破", attribute: "火", rank: "S", img: "assets/zzz/named-characters/lighter.webp", imgSquare: "assets/zzz/agents-square/lighter.webp", imgRound: "assets/zzz/agents-round/lighter.webp", imgProfile: "assets/zzz/profiles/lighter.webp", available: true },
  { id: "pulchra", name: "波可娜", fullName: "波可娜·費雷尼", faction: "卡呂冬之子", role: "擊破", attribute: "物理", rank: "A", img: "assets/zzz/named-characters/pulchra.webp", imgSquare: "assets/zzz/agents-square/pulchra.webp", imgRound: "assets/zzz/agents-round/pulchra.webp", imgProfile: "assets/zzz/profiles/pulchra.webp", height: 173, bust: 73.8, hip: 93.8, thigh: 53.1, cup: "22FF", available: true },
  { id: "yanagi", name: "柳", fullName: "月城柳", faction: "對空六課", role: "異常", attribute: "電", rank: "S", img: "assets/zzz/named-characters/yanagi.webp", imgSquare: "assets/zzz/agents-square/yanagi.webp", imgRound: "assets/zzz/agents-round/yanagi.webp", imgProfile: "assets/zzz/profiles/yanagi.webp", height: 169, bust: 79, hip: 91.2, thigh: 51.2, cup: "23G", available: true },
  { id: "harumasa", name: "悠真", fullName: "淺羽悠真", faction: "對空六課", role: "強攻", attribute: "電", rank: "S", img: "assets/zzz/named-characters/harumasa.webp", imgSquare: "assets/zzz/agents-square/harumasa.webp", imgRound: "assets/zzz/agents-round/harumasa.webp", imgProfile: "assets/zzz/profiles/harumasa.webp", available: true },
  { id: "soukaku", name: "蒼角", fullName: null, faction: "對空六課", role: "支援", attribute: "冰", rank: "A", img: "assets/zzz/named-characters/soukaku.webp", imgSquare: "assets/zzz/agents-square/soukaku.webp", imgRound: "assets/zzz/agents-round/soukaku.webp", imgProfile: "assets/zzz/profiles/soukaku.webp", height: 145, bust: 47.3, hip: 68.5, thigh: 37.7, cup: "18B", available: true },
  { id: "miyabi", name: "雅", fullName: "星見雅", faction: "對空六課", role: "異常", attribute: "冰", specialAttribute: "烈霜", rank: "S", img: "assets/zzz/named-characters/miyabi.webp", imgSquare: "assets/zzz/agents-square/miyabi.webp", imgRound: "assets/zzz/agents-round/miyabi.webp", imgProfile: "assets/zzz/profiles/miyabi.webp", height: 170, bust: 60.8, hip: 66.3, thigh: 40.2, cup: "19E", available: true },
  { id: "evelyn", name: "伊芙琳", fullName: "伊芙琳·舒瓦利耶", faction: "天琴座", role: "強攻", attribute: "火", rank: "S", img: "assets/zzz/named-characters/evelyn.webp", imgSquare: "assets/zzz/agents-square/evelyn.webp", imgRound: "assets/zzz/agents-round/evelyn.webp", imgProfile: "assets/zzz/profiles/evelyn.webp", height: 173, bust: 74.6, hip: 86.3, thigh: 52.8, cup: "23F", available: true },
  { id: "astra-yao", name: "耀嘉音", fullName: null, faction: "天琴座", role: "支援", attribute: "以太", rank: "S", img: "assets/zzz/named-characters/astra-yao.webp", imgSquare: "assets/zzz/agents-square/astra-yao.webp", imgRound: "assets/zzz/agents-round/astra-yao.webp", imgProfile: "assets/zzz/profiles/astra-yao.webp", height: 176, bust: 71.4, hip: 87.9, thigh: 51.3, cup: "22F", available: true },
  { id: "soldier-0-anby", name: "零號·安比", fullName: null, faction: ["狡兔屋", "奧波勒斯小隊"], role: "強攻", attribute: "電", rank: "S", img: "assets/zzz/named-characters/soldier-0-anby.webp", imgSquare: "assets/zzz/agents-square/soldier-0-anby.webp", imgRound: "assets/zzz/agents-round/soldier-0-anby.webp", imgProfile: "assets/zzz/profiles/soldier-0-anby.webp", available: true },
  { id: "vivian", name: "薇薇安", fullName: null, faction: "反舌鳥", role: "異常", attribute: "以太", rank: "S", img: "assets/zzz/named-characters/vivian.webp", imgSquare: "assets/zzz/agents-square/vivian.webp", imgRound: "assets/zzz/agents-round/vivian.webp", imgProfile: "assets/zzz/profiles/vivian.webp", height: 162, bust: 58.2, hip: 77.7, thigh: 44.9, cup: "18E", available: true },
  { id: "hugo", name: "雨果", fullName: null, faction: "反舌鳥", role: "強攻", attribute: "冰", rank: "S", img: "assets/zzz/named-characters/hugo.webp", imgSquare: "assets/zzz/agents-square/hugo.webp", imgRound: "assets/zzz/agents-round/hugo.webp", imgProfile: "assets/zzz/profiles/hugo.webp", available: true },
  { id: "pan-yinhu", name: "潘引壺", fullName: null, faction: "雲巋山", role: "防護", attribute: "物理", rank: "A", img: "assets/zzz/named-characters/pan-yinhu.webp", imgSquare: "assets/zzz/agents-square/pan-yinhu.webp", imgRound: "assets/zzz/agents-round/pan-yinhu.webp", imgProfile: "assets/zzz/profiles/pan-yinhu.webp", available: true },
  { id: "yixuan", name: "儀玄", fullName: null, faction: "雲巋山", role: "命破", attribute: "以太", specialAttribute: "玄墨", rank: "S", img: "assets/zzz/named-characters/yixuan.webp", imgSquare: "assets/zzz/agents-square/yixuan.webp", imgRound: "assets/zzz/agents-round/yixuan.webp", imgProfile: "assets/zzz/profiles/yixuan.webp", height: 172, bust: 75.1, hip: 87.9, thigh: 52.9, cup: "22G", available: true },
  { id: "ju-fufu", name: "橘福福", fullName: null, faction: "雲巋山", role: "擊破", attribute: "火", rank: "S", img: "assets/zzz/named-characters/ju-fufu.webp", imgSquare: "assets/zzz/agents-square/ju-fufu.webp", imgRound: "assets/zzz/agents-round/ju-fufu.webp", imgProfile: "assets/zzz/profiles/ju-fufu.webp", height: 142, bust: 47.1, hip: 70.2, thigh: 42.4, cup: "17B", available: true },
  { id: "ye-shunguang", name: "葉瞬光", fullName: null, faction: "雲巋山", role: "強攻", attribute: "物理", specialAttribute: "凜刃", rank: "S", img: "assets/zzz/named-characters/ye-shunguang.webp", imgSquare: "assets/zzz/agents-square/ye-shunguang.webp", imgRound: "assets/zzz/agents-round/ye-shunguang.webp", imgProfile: "assets/zzz/profiles/ye-shunguang.webp", height: 162, bust: 65.5, hip: 76.9, thigh: 44.3, cup: "20F", available: true },
  { id: "manato", name: "真斗", fullName: "狛野真斗", faction: "怪啖屋", role: "命破", attribute: "火", rank: "A", img: "assets/zzz/named-characters/manato.webp", imgSquare: "assets/zzz/agents-square/manato.webp", imgRound: "assets/zzz/agents-round/manato.webp", imgProfile: "assets/zzz/profiles/manato.webp", available: true },
  { id: "yuzuha", name: "柚葉", fullName: "浮波柚葉", faction: "怪啖屋", role: "支援", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/yuzuha.webp", imgSquare: "assets/zzz/agents-square/yuzuha.webp", imgRound: "assets/zzz/agents-round/yuzuha.webp", imgProfile: "assets/zzz/profiles/yuzuha.webp", height: 162, bust: 60.8, hip: 79.9, thigh: 46.8, cup: "20D", available: true },
  { id: "alice", name: "愛麗絲", fullName: "愛麗絲·泰姆菲爾德", faction: "怪啖屋", role: "異常", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/alice.webp", imgSquare: "assets/zzz/agents-square/alice.webp", imgRound: "assets/zzz/agents-round/alice.webp", imgProfile: "assets/zzz/profiles/alice.webp", height: 163, bust: 65.2, hip: 78.1, thigh: 45.7, cup: "20F", available: true },
  { id: "lucia", name: "盧西婭", fullName: null, faction: "怪啖屋", role: "支援", attribute: "以太", rank: "S", img: "assets/zzz/named-characters/lucia.webp", imgSquare: "assets/zzz/agents-square/lucia.webp", imgRound: "assets/zzz/agents-round/lucia.webp", imgProfile: "assets/zzz/profiles/lucia.webp", height: 160, bust: 64.6, hip: 81.9, thigh: 49, cup: "21E", available: true },
  { id: "yidhari", name: "伊德海莉", fullName: null, faction: "怪啖屋", role: "命破", attribute: "冰", rank: "S", img: "assets/zzz/named-characters/yidhari.webp", imgSquare: "assets/zzz/agents-square/yidhari.webp", imgRound: "assets/zzz/agents-round/yidhari.webp", imgProfile: "assets/zzz/profiles/yidhari.webp", height: 171, bust: 79.3, hip: 87.3, thigh: 51.5, cup: "22H", available: true },
  { id: "dialyn", name: "琉音", fullName: "Dialyn", faction: "坎卜斯黑枝", role: "擊破", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/dialyn.webp", imgSquare: "assets/zzz/agents-square/dialyn.webp", imgRound: "assets/zzz/agents-round/dialyn.webp", imgProfile: "assets/zzz/profiles/dialyn.webp", height: 145, bust: 51.4, hip: 71.6, thigh: 43.4, cup: "18C", available: true },
  { id: "banyue", name: "般岳", fullName: null, faction: "坎卜斯黑枝", role: "命破", attribute: "火", rank: "S", img: "assets/zzz/named-characters/banyue.webp", imgSquare: "assets/zzz/agents-square/banyue.webp", imgRound: "assets/zzz/agents-round/banyue.webp", imgProfile: "assets/zzz/profiles/banyue.webp", available: true },
  { id: "promeia", name: "普羅米婭", fullName: null, faction: "坎卜斯黑枝", role: "異常", attribute: "冰", rank: "S", img: "assets/zzz/named-characters/promeia.webp", imgSquare: "assets/zzz/agents-square/promeia.webp", imgRound: "assets/zzz/agents-round/promeia.webp", imgProfile: "assets/zzz/profiles/promeia.webp", height: 174, bust: 66.8, hip: 89.3, thigh: 48.1, cup: "22E", available: true },
  { id: "zhao", name: "照", fullName: null, faction: "坎卜斯黑枝", role: "防護", attribute: "冰", rank: "S", img: "assets/zzz/named-characters/zhao.webp", imgSquare: "assets/zzz/agents-square/zhao.webp", imgRound: "assets/zzz/agents-round/zhao.webp", imgProfile: "assets/zzz/profiles/zhao.webp", height: 118, bust: 40.5, hip: 63.5, thigh: 42.5, cup: "15A", available: true },
  { id: "sunna", name: "千夏", fullName: null, faction: "妄想天使", role: "支援", attribute: "物理", rank: "S", img: "assets/zzz/named-characters/sunna.webp", imgSquare: "assets/zzz/agents-square/sunna.webp", imgRound: "assets/zzz/agents-round/sunna.webp", imgProfile: "assets/zzz/profiles/sunna.webp", height: 154, bust: 48.1, hip: 69.1, thigh: 41.6, cup: "18B", available: false },
  { id: "aria", name: "愛芮", fullName: null, faction: "妄想天使", role: "異常", attribute: "以太", rank: "S", img: "assets/zzz/named-characters/aria.webp", imgSquare: "assets/zzz/agents-square/aria.webp", imgRound: "assets/zzz/agents-round/aria.webp", imgProfile: "assets/zzz/profiles/aria.webp", height: 150, bust: 49.8, hip: 72.6, thigh: 41.4, cup: "18C", available: false },
  { id: "nangong-yu", name: "南宮羽", fullName: null, faction: "妄想天使", role: "擊破", attribute: "以太", rank: "S", img: "assets/zzz/named-characters/nangong-yu.webp", imgSquare: "assets/zzz/agents-square/nangong-yu.webp", imgRound: "assets/zzz/agents-round/nangong-yu.webp", imgProfile: "assets/zzz/profiles/nangong-yu.webp", height: 156, bust: 51.3, hip: 70.9, thigh: 42.4, cup: "19C", available: false },
  { id: "cissia", name: "希希芙", fullName: null, faction: "刑偵特勤組", role: "強攻", attribute: "電", rank: "S", img: "assets/zzz/named-characters/cissia.webp", imgSquare: "assets/zzz/agents-square/cissia.webp", imgRound: "assets/zzz/agents-round/cissia.webp", imgProfile: "assets/zzz/profiles/cissia.webp", height: 156, bust: 67.2, hip: 77.1, thigh: 44.9, cup: "21F", available: false },

  { id: "norma", name: "諾姆", fullName: "諾姆·霍洛維爾", faction: "羅斯凱利法", role: "擊破", attribute: "火", rank: "S", img: "assets/zzz/named-characters/norma.webp", imgSquare: "assets/zzz/agents-square/norma.webp", imgRound: "assets/zzz/agents-round/norma.webp", imgProfile: "assets/zzz/profiles/norma.webp", height: 150, bust: 50.3, hip: 69.3, thigh: 41.6, cup: "18C", available: false },
  { id: "remielle", name: "蕾米埃爾", fullName: "蕾米埃爾·丹", faction: "達雅特聖約", role: "異常", attribute: "流明", rank: "S", img: "assets/zzz/named-characters/remielle.webp", imgSquare: "assets/zzz/agents-square/remielle.webp", imgRound: "assets/zzz/agents-round/remielle.webp", imgProfile: "assets/zzz/profiles/remielle.webp", height: 167, bust: 72.1, hip: 83.8, thigh: 51.9, cup: "21G", available: false },
  { id: "claretta", name: "克拉蕾", fullName: null, faction: "羅斯凱利法", role: "鋒御", attribute: "電", rank: "S", img: "assets/zzz/agents-square/claretta.webp", imgSquare: "assets/zzz/agents-square/claretta.webp", imgRound: "assets/zzz/agents-round/claretta.webp", imgProfile: "assets/zzz/profiles/claretta.webp", height: 166, bust: 67.4, hip: 77.1, thigh: 45.8, cup: "21E", available: true },
  { id: "fionne", name: "菲歐妮", fullName: null, faction: "坎卜斯黑枝", role: "異常", attribute: "火", rank: "S", img: "assets/zzz/agents-square/fionne.webp", imgSquare: "assets/zzz/agents-square/fionne.webp", imgRound: "assets/zzz/agents-round/fionne.webp", imgProfile: "assets/zzz/profiles/fionne.webp", height: 156, bust: 59.4, hip: 78.8, thigh: 44.9, cup: "21C", available: true },
  { id: "roxy", name: "洛克茜", fullName: null, faction: "羅斯凱利法", role: "擊破", attribute: "風", rank: "S", img: "assets/zzz/agents-square/roxy.webp", imgSquare: "assets/zzz/agents-square/roxy.webp", imgRound: "assets/zzz/agents-round/roxy.webp", imgProfile: "assets/zzz/profiles/roxy.webp", height: 144, bust: 48.3, hip: 70.6, thigh: 42, cup: "17C", available: true },
  { id: "severian", name: "賽維裡安", fullName: null, faction: "刑偵特勤組", role: "強攻", attribute: "風", rank: "S", img: "assets/zzz/agents-square/severian.webp", imgSquare: "assets/zzz/agents-square/severian.webp", imgRound: "assets/zzz/agents-round/severian.webp", imgProfile: "assets/zzz/profiles/severian.webp", available: false },
  { id: "sigrid", name: "希格莉德", fullName: null, faction: "羅斯凱利法", role: "強攻", attribute: "冰", rank: "S", img: "assets/zzz/agents-square/sigrid.webp", imgSquare: "assets/zzz/agents-square/sigrid.webp", imgRound: "assets/zzz/agents-round/sigrid.webp", imgProfile: "assets/zzz/profiles/sigrid.webp", height: 175, bust: 72.3, hip: 89.6, thigh: 53.1, cup: "23E", available: true },
  { id: "verina", name: "維琳娜", fullName: null, faction: "羅斯凱利法", role: "異常", attribute: "風", rank: "S", img: "assets/zzz/named-characters/verina.webp", imgSquare: "assets/zzz/agents-square/verina.webp", imgRound: "assets/zzz/agents-round/verina.webp", imgProfile: "assets/zzz/profiles/verina.webp", height: 172, bust: 77.5, hip: 87.9, thigh: 52.1, cup: "21H", available: true },
  { id: "sunbringer", name: "挽晝", fullName: "Sunbringer", faction: "羅斯凱利法", role: "鋒御", attribute: "火", rank: "S", img: null, imgSquare: "assets/zzz/agents-square/sunbringer.webp", imgRound: null, imgProfile: "assets/zzz/profiles/sunbringer.webp", available: false },
];

// Localized display names (best-effort official/romanized). zh-TW uses AGENTS[].name directly.
const AGENT_NAMES = {
  en: {
    "pyrois": "Pyrois", "anby": "Anby", "billy": "Billy", "nekomata": "Nekomata", "nicole": "Nicole",
    "starlight-billy": "Starlight Billy", "anton": "Anton", "grace": "Grace", "koleda": "Koleda", "ben": "Ben",
    "rina": "Rina", "corin": "Corin", "ellen": "Ellen", "lycaon": "Lycaon", "trigger": "Trigger",
    "soldier-11": "Soldier 11", "orphie-magus": "Orphie & Magus", "seed": "Seed", "zhu-yuan": "Zhu Yuan", "qingyi": "Qingyi",
    "jane": "Jane", "seth": "Seth", "lucy": "Lucy", "piper": "Piper", "caesar": "Caesar",
    "burnice": "Burnice", "lighter": "Lighter", "pulchra": "Pulchra", "yanagi": "Yanagi", "harumasa": "Harumasa",
    "soukaku": "Soukaku", "miyabi": "Miyabi", "evelyn": "Evelyn", "astra-yao": "Astra Yao", "soldier-0-anby": "Soldier 0 Anby",
    "vivian": "Vivian", "hugo": "Hugo", "pan-yinhu": "Pan Yinhu", "yixuan": "Yixuan", "ju-fufu": "Ju Fufu",
    "ye-shunguang": "Ye Shunguang", "manato": "Manato", "yuzuha": "Yuzuha", "alice": "Alice", "lucia": "Lucia",
    "yidhari": "Yidhari", "dialyn": "Dialyn", "banyue": "Banyue", "promeia": "Promeia", "zhao": "Zhao",
    "sunna": "Sunna", "aria": "Aria", "nangong-yu": "Nangong Yu", "cissia": "Cissia", "norma": "Norma",
    "remielle": "Remielle", "claretta": "Claret", "fionne": "Fionne", "roxy": "Roxy", "severian": "Severian",
    "sigrid": "Sigrid", "verina": "Velina", "sunbringer": "Sunbringer"
  },
  ja: {
    "pyrois": "ペロイス", "anby": "アンビ", "billy": "ビリー", "nekomata": "ネコマタ", "nicole": "ニコ",
    "starlight-billy": "スターライト・ビリー", "anton": "アントン", "grace": "グレース", "koleda": "コレダ", "ben": "ベン",
    "rina": "リナ", "corin": "コリン", "ellen": "エレン", "lycaon": "リョカオン", "trigger": "トリガー",
    "soldier-11": "11号", "orphie-magus": "オーフィ＆マグス", "seed": "シード", "zhu-yuan": "チューユェン", "qingyi": "チンイー",
    "jane": "ジェーン", "seth": "セス", "lucy": "ルシー", "piper": "パイパー", "caesar": "カイザー",
    "burnice": "バーニス", "lighter": "ライター", "pulchra": "プルクラ", "yanagi": "ヤナギ", "harumasa": "ハルマサ",
    "soukaku": "ソウカク", "miyabi": "ミヤビ", "evelyn": "イヴリン", "astra-yao": "アストラ・ヤオ", "soldier-0-anby": "零号アンビ",
    "vivian": "ビビアン", "hugo": "ヒューゴ", "pan-yinhu": "パン・インフ", "yixuan": "イーシュエン", "ju-fufu": "ジュフフ",
    "ye-shunguang": "イエ・シュングアン", "manato": "マナト", "yuzuha": "ユズハ", "alice": "アリス", "lucia": "ルーシア",
    "yidhari": "イドハリ", "dialyn": "ダイアリン", "banyue": "バンユエ", "promeia": "プロメイア", "zhao": "チャオ",
    "sunna": "スンナ", "aria": "アリア", "nangong-yu": "ナンゴン・ユー", "cissia": "シシア", "norma": "ノーマ",
    "remielle": "レミエル", "claretta": "クラレット", "fionne": "フィオーネ", "roxy": "ロクシー", "severian": "セヴェリアン",
    "sigrid": "シグリッド", "verina": "ヴェリーナ", "sunbringer": "サンブリンガー"
  },
  ko: {
    "pyrois": "페로이스", "anby": "안비", "billy": "빌리", "nekomata": "네코마타", "nicole": "니콜",
    "starlight-billy": "스타라이트 빌리", "anton": "앤턴", "grace": "그레이스", "koleda": "콜레다", "ben": "벤",
    "rina": "리나", "corin": "코린", "ellen": "엘렌", "lycaon": "라이카온", "trigger": "트리거",
    "soldier-11": "11호", "orphie-magus": "오르피 & 마구스", "seed": "시드", "zhu-yuan": "주원", "qingyi": "칭이",
    "jane": "제인", "seth": "세스", "lucy": "루시", "piper": "파이퍼", "caesar": "카이저",
    "burnice": "버니스", "lighter": "라이터", "pulchra": "풀크라", "yanagi": "야나기", "harumasa": "하루마사",
    "soukaku": "소카쿠", "miyabi": "미야비", "evelyn": "이블린", "astra-yao": "아스트라 야오", "soldier-0-anby": "0호 안비",
    "vivian": "비비안", "hugo": "휴고", "pan-yinhu": "판인후", "yixuan": "이쉬엔", "ju-fufu": "쥐푸푸",
    "ye-shunguang": "예슌광", "manato": "마나토", "yuzuha": "유즈하", "alice": "앨리스", "lucia": "루시아",
    "yidhari": "이드하리", "dialyn": "디알린", "banyue": "반웨", "promeia": "프로메이아", "zhao": "자오",
    "sunna": "수나", "aria": "아리아", "nangong-yu": "남궁우", "cissia": "시시아", "norma": "노르마",
    "remielle": "레미엘", "claretta": "클라레트", "fionne": "피오네", "roxy": "록시", "severian": "세베리안",
    "sigrid": "시그리드", "verina": "벨리나", "sunbringer": "선브링어"
  }
};

// Derived from ZZZ Team Simulator_Chara.json + Fandom rarity data.

const ROLES = [
  "強攻",
  "擊破",
  "異常",
  "支援",
  "防護",
  "命破",
  "鋒御"
];

const ATTRIBUTES = [
  "特殊",
  "物理",
  "電",
  "火",
  "冰",
  "以太",
  "風"
];

const SPECIAL_ATTRIBUTES = ["流明", "凜刃", "烈霜", "玄墨"];

const ROLE_COLORS = {
  "強攻": "#9aa0a6",
  "擊破": "#ffb03a",
  "異常": "#b37be0",
  "支援": "#4ade80",
  "防護": "#f0c614",
  "命破": "#ffffff",
  "鋒御": "#ff3b3b"
};

const ATTRIBUTE_COLORS = {
  "物理": "#d8b26a",
  "電": "#4a7cff",
  "火": "#ff5a3c",
  "冰": "#5fd3f3",
  "以太": "#c05ce8",
  "風": "#4ad991",
  "流明": "#f8b5b9",
  "凜刃": "#f0d98c",
  "烈霜": "#a8dcf5",
  "玄墨": "#b8a9e0"
};

const RANK_META = {
  "S": {
    "color": "#ffb648",
    "label": "S"
  },
  "A": {
    "color": "#b06cf0",
    "label": "A"
  },
  "∞": {
    "color": "#ff5ab3",
    "label": "∞"
  }
};

const NON_PC_IDS = [
  "belle",
  "wise"
];

const FACTIONS = [
  "狡兔屋",
  "維多利亞家政",
  "白祇重工",
  "卡呂冬之子",
  "奧波勒斯小隊",
  "對空六課",
  "刑偵特勤組",
  "天琴座",
  "反舌鳥",
  "雲巋山",
  "怪啖屋",
  "坎卜斯黑枝",
  "妄想天使",
  "羅斯凱利法"
];

const FACTION_LOGOS = {
  "狡兔屋": "assets/zzz/named-faction-logos/cunning-hares.webp",
  "維多利亞家政": "assets/zzz/named-faction-logos/victoria-housekeeping-co.webp",
  "白祇重工": "assets/zzz/named-faction-logos/belobog-heavy-industries.webp",
  "卡呂冬之子": "assets/zzz/named-faction-logos/sons-of-calydon.webp",
  "奧波勒斯小隊": "assets/zzz/named-faction-logos/obol-squad.webp",
  "對空六課": "assets/zzz/named-faction-logos/hollow-special-operations-section-6.webp",
  "刑偵特勤組": "assets/zzz/named-faction-logos/criminal-investigation-special-response-team.webp",
  "天琴座": "assets/zzz/named-faction-logos/stars-of-lyra.webp",
  "反舌鳥": "assets/zzz/named-faction-logos/mockingbird.webp",
  "雲巋山": "assets/zzz/named-faction-logos/yunkui-summit.webp",
  "怪啖屋": "assets/zzz/named-faction-logos/spook-shack.webp",
  "坎卜斯黑枝": "assets/zzz/named-faction-logos/krampus-compliance-authority.webp",
  "妄想天使": "assets/zzz/named-faction-logos/angels-of-delusion.webp",
  "羅斯凱利法": "assets/zzz/named-faction-logos/roscalifa.webp",
};

const FACTION_COLORS = {
  "狡兔屋": "#ffbd62",
  "維多利亞家政": "#91d0a3",
  "白祇重工": "#f4dc68",
  "卡呂冬之子": "#ff9ec7",
  "奧波勒斯小隊": "#81b9d3",
  "對空六課": "#ffd166",
  "刑偵特勤組": "#c4a0e0",
  "天琴座": "#06d6a0",
  "反舌鳥": "#ef476f",
  "雲巋山": "#ffc857",
  "怪啖屋": "#8338ec",
  "坎卜斯黑枝": "#3a86ff",
  "妄想天使": "#06ffa5",
  "羅斯凱利法": "#f59e0b"
};

const TIER_DEFAULTS = [
  { label: "S", color: "#ff6b6b" },
  { label: "A", color: "#ffa94d" },
  { label: "B", color: "#f5dc4d" },
  { label: "C", color: "#74e39b" },
  { label: "D", color: "#64bff0" },
];

const TIER_COLORS = [
  "#ff6b6b", "#ffa94d", "#f5dc4d", "#74e39b", "#64bff0",
  "#b07bf0", "#ff8fc8", "#ffd166", "#3ddc97", "#4ea8de",
  "#ef476f", "#ffc857", "#9d6bfa", "#5b8cff", "#57e6c3"
];