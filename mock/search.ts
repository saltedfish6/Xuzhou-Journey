// 搜索相关的 mock 数据

// 预定义的城市、景点、美食、酒店等数据
const predefinedData = [
  // 热门城市
  { id: 1, name: '北京', type: 'city', description: '中国首都，历史文化名城' },
  { id: 2, name: '上海', type: 'city', description: '国际化大都市，经济中心' },
  { id: 3, name: '广州', type: 'city', description: '南方门户城市，美食之都' },
  {
    id: 4,
    name: '深圳',
    type: 'city',
    description: '改革开放前沿城市，科技创新中心'
  },
  { id: 5, name: '杭州', type: 'city', description: '人间天堂，西湖美景' },
  { id: 6, name: '成都', type: 'city', description: '天府之国，休闲之都' },
  { id: 7, name: '西安', type: 'city', description: '千年古都，丝路起点' },
  { id: 8, name: '南京', type: 'city', description: '六朝古都，文化名城' },
  { id: 9, name: '武汉', type: 'city', description: '九省通衢，江城风光' },
  { id: 10, name: '重庆', type: 'city', description: '山城火锅，立体交通' },
  { id: 11, name: '苏州', type: 'city', description: '园林之城，江南水乡' },
  { id: 12, name: '天津', type: 'city', description: '海河之滨，近代建筑' },
  { id: 13, name: '青岛', type: 'city', description: '海滨城市，啤酒之都' },
  { id: 14, name: '大连', type: 'city', description: '浪漫之都，海滨风光' },
  { id: 15, name: '厦门', type: 'city', description: '鹭岛风光，海上花园' },
  { id: 16, name: '三亚', type: 'city', description: '热带天堂，度假胜地' },
  { id: 17, name: '丽江', type: 'city', description: '古城风韵，纳西文化' },
  { id: 18, name: '桂林', type: 'city', description: '山水甲天下，漓江风光' },
  { id: 19, name: '张家界', type: 'city', description: '奇峰异石，自然奇观' },
  { id: 20, name: '九寨沟', type: 'city', description: '童话世界，彩池瀑布' },

  // 更多城市
  { id: 51, name: '昆明', type: 'city', description: '春城花都，四季如春' },
  { id: 52, name: '哈尔滨', type: 'city', description: '冰雪之城，东方莫斯科' },
  { id: 53, name: '长沙', type: 'city', description: '星城湘韵，娱乐之都' },
  { id: 54, name: '济南', type: 'city', description: '泉城风光，千佛山下' },
  { id: 55, name: '福州', type: 'city', description: '榕城古韵，闽江之滨' },
  { id: 56, name: '合肥', type: 'city', description: '科教名城，创新高地' },
  { id: 57, name: '郑州', type: 'city', description: '中原腹地，交通枢纽' },
  { id: 58, name: '太原', type: 'city', description: '龙城古韵，煤海明珠' },
  { id: 59, name: '石家庄', type: 'city', description: '燕赵大地，现代都市' },
  { id: 60, name: '南昌', type: 'city', description: '英雄城市，滕王阁下' },
  { id: 61, name: '贵阳', type: 'city', description: '爽爽贵阳，避暑胜地' },
  { id: 62, name: '兰州', type: 'city', description: '金城兰州，黄河之都' },
  { id: 63, name: '银川', type: 'city', description: '塞上江南，西夏古都' },
  { id: 64, name: '西宁', type: 'city', description: '高原明珠，夏都风光' },
  { id: 65, name: '乌鲁木齐', type: 'city', description: '丝路明珠，新疆门户' },
  { id: 66, name: '拉萨', type: 'city', description: '日光城市，雪域圣地' },
  { id: 67, name: '呼和浩特', type: 'city', description: '青城草原，蒙古风情' },
  { id: 68, name: '南宁', type: 'city', description: '绿城花都，东盟门户' },
  { id: 69, name: '海口', type: 'city', description: '椰城海韵，热带风情' },
  { id: 70, name: '香港', type: 'city', description: '东方之珠，购物天堂' },
  { id: 71, name: '澳门', type: 'city', description: '赌城风云，中西合璧' },
  { id: 72, name: '台北', type: 'city', description: '宝岛明珠，文化之都' },

  {
    id: 21,
    name: '故宫',
    type: 'attraction',
    description: '明清皇宫，世界文化遗产'
  },
  {
    id: 22,
    name: '长城',
    type: 'attraction',
    description: '万里长城，中华象征'
  },
  {
    id: 23,
    name: '天安门',
    type: 'attraction',
    description: '国家象征，历史见证'
  },
  {
    id: 24,
    name: '颐和园',
    type: 'attraction',
    description: '皇家园林，山水画卷'
  },
  { id: 25, name: '天坛', type: 'attraction', description: '明清祭天建筑群' },
  {
    id: 26,
    name: '外滩',
    type: 'attraction',
    description: '上海地标，万国建筑博览群'
  },
  {
    id: 27,
    name: '东方明珠',
    type: 'attraction',
    description: '上海标志性电视塔'
  },
  { id: 28, name: '豫园', type: 'attraction', description: '江南古典园林' },
  {
    id: 29,
    name: '西湖',
    type: 'attraction',
    description: '杭州名胜，诗画江南'
  },
  {
    id: 30,
    name: '灵隐寺',
    type: 'attraction',
    description: '千年古刹，佛教圣地'
  },
  { id: 31, name: '兵马俑', type: 'attraction', description: '世界第八大奇迹' },
  { id: 32, name: '华清池', type: 'attraction', description: '唐代皇家温泉' },
  {
    id: 33,
    name: '大雁塔',
    type: 'attraction',
    description: '唐代佛塔，文化地标'
  },
  {
    id: 34,
    name: '宽窄巷子',
    type: 'attraction',
    description: '成都历史文化街区'
  },
  { id: 35, name: '锦里', type: 'attraction', description: '成都民俗文化街' },
  {
    id: 36,
    name: '都江堰',
    type: 'attraction',
    description: '古代水利工程奇迹'
  },
  {
    id: 37,
    name: '洪崖洞',
    type: 'attraction',
    description: '重庆特色吊脚楼建筑群'
  },
  {
    id: 38,
    name: '解放碑',
    type: 'attraction',
    description: '重庆地标，商业中心'
  },
  {
    id: 39,
    name: '磁器口',
    type: 'attraction',
    description: '重庆古镇，民俗文化'
  },
  {
    id: 40,
    name: '黄鹤楼',
    type: 'attraction',
    description: '武汉名楼，诗词胜地'
  },
  { id: 41, name: '拙政园', type: 'attraction', description: '苏州园林代表作' },
  { id: 42, name: '周庄', type: 'attraction', description: '江南水乡古镇' },
  { id: 43, name: '鼓浪屿', type: 'attraction', description: '厦门音乐之岛' },
  { id: 44, name: '天涯海角', type: 'attraction', description: '三亚浪漫地标' },
  { id: 45, name: '玉龙雪山', type: 'attraction', description: '丽江神山圣地' },
  { id: 46, name: '漓江', type: 'attraction', description: '桂林山水精华' },
  { id: 47, name: '天门山', type: 'attraction', description: '张家界玻璃栈道' },
  { id: 48, name: '五花海', type: 'attraction', description: '九寨沟彩色湖泊' },
  {
    id: 49,
    name: '泰山',
    type: 'attraction',
    description: '五岳之首，日出胜地'
  },
  {
    id: 50,
    name: '黄山',
    type: 'attraction',
    description: '奇松怪石，云海日出'
  },

  // 更多景点
  {
    id: 73,
    name: '峨眉山',
    type: 'attraction',
    description: '佛教名山，金顶日出'
  },
  { id: 74, name: '华山', type: 'attraction', description: '奇险天下第一山' },
  {
    id: 75,
    name: '衡山',
    type: 'attraction',
    description: '南岳衡山，寿岳名山'
  },
  {
    id: 76,
    name: '恒山',
    type: 'attraction',
    description: '北岳恒山，悬空寺奇观'
  },
  {
    id: 77,
    name: '嵩山',
    type: 'attraction',
    description: '中岳嵩山，少林武功'
  },
  {
    id: 78,
    name: '武当山',
    type: 'attraction',
    description: '道教圣地，太极发源'
  },
  {
    id: 79,
    name: '庐山',
    type: 'attraction',
    description: '匡庐奇秀，云雾缭绕'
  },
  {
    id: 80,
    name: '普陀山',
    type: 'attraction',
    description: '观音道场，海天佛国'
  },
  { id: 81, name: '九华山', type: 'attraction', description: '地藏菩萨道场' },
  {
    id: 82,
    name: '天山天池',
    type: 'attraction',
    description: '新疆明珠，雪山圣湖'
  },
  {
    id: 83,
    name: '喀纳斯',
    type: 'attraction',
    description: '神的后花园，湖怪传说'
  },
  {
    id: 84,
    name: '稻城亚丁',
    type: 'attraction',
    description: '最后的香格里拉'
  },
  {
    id: 85,
    name: '布达拉宫',
    type: 'attraction',
    description: '雪域圣殿，藏传佛教'
  },
  {
    id: 86,
    name: '大昭寺',
    type: 'attraction',
    description: '拉萨心脏，朝圣圣地'
  },
  {
    id: 87,
    name: '纳木错',
    type: 'attraction',
    description: '天湖圣境，藏北明珠'
  },
  {
    id: 88,
    name: '珠穆朗玛峰',
    type: 'attraction',
    description: '世界屋脊，登山圣地'
  },
  {
    id: 89,
    name: '呼伦贝尔草原',
    type: 'attraction',
    description: '天苍苍野茫茫，风吹草低见牛羊'
  },
  {
    id: 90,
    name: '额济纳胡杨林',
    type: 'attraction',
    description: '金秋胡杨，大漠奇观'
  },
  {
    id: 91,
    name: '莫高窟',
    type: 'attraction',
    description: '敦煌石窟，丝路明珠'
  },
  {
    id: 92,
    name: '鸣沙山月牙泉',
    type: 'attraction',
    description: '大漠奇观，沙泉共存'
  },
  {
    id: 93,
    name: '雅鲁藏布大峡谷',
    type: 'attraction',
    description: '世界第一大峡谷'
  },
  {
    id: 94,
    name: '林芝桃花',
    type: 'attraction',
    description: '雪域江南，桃花盛开'
  },
  {
    id: 95,
    name: '茶卡盐湖',
    type: 'attraction',
    description: '天空之镜，盐湖奇观'
  },
  { id: 96, name: '青海湖', type: 'attraction', description: '中国最大内陆湖' },
  {
    id: 97,
    name: '可可西里',
    type: 'attraction',
    description: '无人区，野生动物天堂'
  },
  {
    id: 98,
    name: '塔克拉玛干沙漠',
    type: 'attraction',
    description: '死亡之海，大漠风光'
  },
  {
    id: 99,
    name: '巴丹吉林沙漠',
    type: 'attraction',
    description: '沙漠珠峰，奇峰异景'
  },
  {
    id: 100,
    name: '腾格里沙漠',
    type: 'attraction',
    description: '沙海绿洲，驼铃声声'
  },

  // 美食类
  {
    id: 101,
    name: '北京烤鸭',
    type: 'food',
    description: '京城名菜，皮酥肉嫩'
  },
  {
    id: 102,
    name: '兰州拉面',
    type: 'food',
    description: '西北面食，清汤牛肉'
  },
  {
    id: 103,
    name: '重庆火锅',
    type: 'food',
    description: '麻辣鲜香，山城特色'
  },
  {
    id: 104,
    name: '四川麻婆豆腐',
    type: 'food',
    description: '川菜经典，麻辣鲜嫩'
  },
  {
    id: 105,
    name: '广东早茶',
    type: 'food',
    description: '粤式茶点，精致美味'
  },
  {
    id: 106,
    name: '上海小笼包',
    type: 'food',
    description: '江南名点，汁多味美'
  },
  {
    id: 107,
    name: '西安肉夹馍',
    type: 'food',
    description: '陕西名食，肉香饼酥'
  },
  {
    id: 108,
    name: '天津狗不理包子',
    type: 'food',
    description: '津门名点，皮薄馅大'
  },
  {
    id: 109,
    name: '杭州西湖醋鱼',
    type: 'food',
    description: '浙菜名品，酸甜可口'
  },
  {
    id: 110,
    name: '苏州松鼠桂鱼',
    type: 'food',
    description: '苏帮菜，造型美观'
  },
  {
    id: 111,
    name: '东北锅包肉',
    type: 'food',
    description: '东北名菜，酸甜酥脆'
  },
  {
    id: 112,
    name: '湖南臭豆腐',
    type: 'food',
    description: '湘菜小食，外臭内香'
  },
  {
    id: 113,
    name: '云南过桥米线',
    type: 'food',
    description: '滇味名食，汤鲜料丰'
  },
  {
    id: 114,
    name: '新疆大盘鸡',
    type: 'food',
    description: '西域美食，香辣下饭'
  },
  {
    id: 115,
    name: '内蒙古烤全羊',
    type: 'food',
    description: '草原美食，豪放大气'
  },
  {
    id: 116,
    name: '海南椰子鸡',
    type: 'food',
    description: '热带风味，清香甘甜'
  },
  {
    id: 117,
    name: '福建佛跳墙',
    type: 'food',
    description: '闽菜之王，营养丰富'
  },
  {
    id: 118,
    name: '山西刀削面',
    type: 'food',
    description: '晋菜面食，刀工精湛'
  },
  {
    id: 119,
    name: '河南胡辣汤',
    type: 'food',
    description: '中原名汤，香辣开胃'
  },
  {
    id: 120,
    name: '安徽臭鳜鱼',
    type: 'food',
    description: '徽菜名品，臭中带香'
  },

  // 酒店类
  {
    id: 121,
    name: '北京饭店',
    type: 'hotel',
    description: '百年老店，国宾级服务'
  },
  {
    id: 122,
    name: '上海和平饭店',
    type: 'hotel',
    description: '外滩地标，历史悠久'
  },
  {
    id: 123,
    name: '广州白天鹅宾馆',
    type: 'hotel',
    description: '珠江畔，五星级享受'
  },
  {
    id: 124,
    name: '深圳香格里拉',
    type: 'hotel',
    description: '商务首选，豪华舒适'
  },
  {
    id: 125,
    name: '杭州西湖国宾馆',
    type: 'hotel',
    description: '西湖美景，园林式酒店'
  },
  {
    id: 126,
    name: '成都锦江宾馆',
    type: 'hotel',
    description: '川西风格，熊猫主题'
  },
  {
    id: 127,
    name: '西安唐华宾馆',
    type: 'hotel',
    description: '古都风韵，唐风建筑'
  },
  {
    id: 128,
    name: '南京金陵饭店',
    type: 'hotel',
    description: '六朝古都，现代奢华'
  },
  {
    id: 129,
    name: '武汉晴川假日酒店',
    type: 'hotel',
    description: '江城风光，商务便利'
  },
  {
    id: 130,
    name: '重庆解放碑威斯汀',
    type: 'hotel',
    description: '山城夜景，国际品牌'
  },
  {
    id: 131,
    name: '苏州园林酒店',
    type: 'hotel',
    description: '江南园林，诗意栖居'
  },
  {
    id: 132,
    name: '天津利顺德大饭店',
    type: 'hotel',
    description: '百年传承，欧式风情'
  },
  {
    id: 133,
    name: '青岛香格里拉',
    type: 'hotel',
    description: '海滨度假，啤酒文化'
  },
  {
    id: 134,
    name: '大连香格里拉',
    type: 'hotel',
    description: '浪漫之都，海景房间'
  },
  {
    id: 135,
    name: '厦门悦华酒店',
    type: 'hotel',
    description: '鹭岛风情，海景无敌'
  },
  {
    id: 136,
    name: '三亚亚龙湾丽思卡尔顿',
    type: 'hotel',
    description: '热带天堂，奢华度假'
  },
  {
    id: 137,
    name: '丽江古城客栈',
    type: 'hotel',
    description: '纳西风情，古城韵味'
  },
  {
    id: 138,
    name: '桂林漓江大瀑布饭店',
    type: 'hotel',
    description: '山水画卷，瀑布奇观'
  },
  {
    id: 139,
    name: '张家界天门山酒店',
    type: 'hotel',
    description: '奇峰异石，云雾缭绕'
  },
  {
    id: 140,
    name: '九寨沟喜来登',
    type: 'hotel',
    description: '童话世界，彩林环绕'
  }
]

// 热门城市列表
export const hotCities = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '西安',
  '南京',
  '武汉',
  '重庆',
  '苏州',
  '天津',
  '青岛',
  '大连',
  '厦门',
  '三亚',
  '丽江',
  '桂林',
  '张家界',
  '九寨沟',
  '昆明',
  '哈尔滨',
  '长沙',
  '济南',
  '福州',
  '合肥',
  '郑州',
  '太原',
  '石家庄',
  '南昌',
  '贵阳',
  '兰州',
  '银川',
  '西宁',
  '乌鲁木齐',
  '拉萨',
  '呼和浩特',
  '南宁',
  '海口',
  '香港'
]

// 搜索接口 mock
export const searchMock = {
  '/api/search': (page: any, pageSize: any, tab: any, query: any) => {
    const keyword = query.keyword || ''
    if (!keyword || keyword.trim() === '') {
      return {
        keyword: '',
        list: []
      }
    }

    // 优化搜索算法：优先匹配开头，然后匹配包含
    const exactMatches = predefinedData
      .filter((item) =>
        item.name.toLowerCase().startsWith(keyword.toLowerCase())
      )
      .map((item) => item.name)

    const containsMatches = predefinedData
      .filter(
        (item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) &&
          !item.name.toLowerCase().startsWith(keyword.toLowerCase())
      )
      .map((item) => item.name)

    // 合并结果，优先显示精确匹配，最多返回15条建议
    const suggestions = [...exactMatches, ...containsMatches].slice(0, 15)

    return {
      keyword: keyword,
      list: suggestions
    }
  },

  '/api/hotlist': () => {
    return hotCities.slice(0, 15).map((city, index) => ({
      id: (index + 1).toString(),
      city: city
    }))
  }
}

export default searchMock
