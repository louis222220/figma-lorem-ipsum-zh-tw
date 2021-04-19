// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  // get current nodes, return the first TextNode
  const textNode = (figma?.currentPage?.selection ?? []).find(
    node => node.type === 'TEXT'
  ) as TextNode;

  if (msg.type === 'generateText') {
    const loremText = generateRandomText(msg.count);
    await appendText(textNode, loremText);
  }

  else if (msg.type === 'generateTextWithPunctuation') {
    const loremText = generateRandomTextWithPunctuation(msg.count);
    await appendText(textNode, loremText);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

async function appendText(textNode: TextNode, text: string): Promise<void> {
  if (textNode == null || textNode.type !== 'TEXT' || typeof text !== 'string') {
    return;
  }

  const textLength = textNode.characters.length;
  // loadFontAsync must be called before using insertCharacters. This prerequisite is defined in Figma API 1
  if (textLength < 1) await figma.loadFontAsync(textNode.fontName as FontName); 
  for (let i = 0; i < textLength; i++) {
    // load each font name of all characters 
    await figma.loadFontAsync(textNode.getRangeFontName(i, i + 1) as FontName);
  }
  textNode.insertCharacters(textLength, text);
}

function generateRandomTextWithPunctuation(length: number): string {
  if (length < 1) return '';
  let text = '';
  for (let i = 0; i < length; i++) {
    if (Math.random() < 0.1) {
      const puntuation = "，，，，，，、、；。。。。！！……？？";
      text += puntuation[Math.floor(Math.random() * puntuation.length)];
    }
    else {
      text += generateRandomCharacter();
    }
  }
  return text;
}

function generateRandomText(length: number): string {
  if (length < 1) return '';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += generateRandomCharacter();
  }
  return text;
}

function generateRandomCharacter(): string {
  const chanceGroups = getCharactersChanceGroup();
  const roll = Math.floor(Math.random() * 100);
  let groupIndex = -1;
  let count = roll;
  while (count >= 0) {
    groupIndex++;
    count -= chanceGroups[groupIndex]?.chance;
  }
  const characterIndex = Math.floor(Math.random() * chanceGroups[groupIndex].characters.length);
  return chanceGroups[groupIndex].characters[characterIndex];
}


type Chance = {
  chance: number,
  characters: string,
};

function getCharactersChanceGroup(): Chance[] {
  return [
    {
      chance: 4,
      characters: '的',
    },
    {
      chance: 14,
      characters: '是不我一有大在人了中到資要',
    },
    {
      chance: 55,
      characters: '以可這個你會好為上來學就交也用能如時文說沒他看那問生提下過請們天所多麼小之想得工出還電對都機自而子後訊家站心只去知國很台成信同何章道發地法無然但當於嗎本年現前最真新和因果意定點情其題事科方些清三樣此吧位作理行者經名什謝日正開話與實愛再華二城動比面高又或力應女種教車分像系長手次已明打太路起己相主關十間鳳外呢覺使該友才進凰她民著各全將少兩加回感式第球性老程把被公論及龍校別體重給聽水做常您見裡東風解灣月等啦部原美先音通管網區期錯否樂入找書讓四啊由選較數表內場它從快歡至立目社合望怎認告更幾考度難版頭喜許光今買算弟若統身記代號處完接計言字師並政玩張男誰山每結且星非建改連放哈活研直設陳報轉黨指五變氣西試希神取化物王任林單世受近義死便反士戰空隊跟卻北必業功寫影聲平臺員金討色則容檔片向妳市利興白強安央特議辦價總傳思花元叫',
    },
    {
      chance: 27,
      characters: '保份求究呵件未決組萬竹級持笑投哪室曾走喔標流支獨貓卡需兄門共語海口阿線馬黃參般命視觀聯腦朋格兒八修料錢失吃住即另錄專象換基板拿遠速形孩備歌幫確候除界裝類講器南案畫英訴帶差乎量久掉似整引班迷圖制費賽奇識型超邊耶品舍雖始運李務權驗故六讀怪飛滿服夢收眼造念留課軍破精半約願令底答演達雄深票早院夠曲假談術棒賣黑百勝推存火準示往碟易況晚離治導七段團調證列傷永剛排哥德九甚殺照軟包怕條夜商概根供絕千客切集稱據落越竟盡待聞園忘值產消雙紅座展育跑附嘛執唱技某硬斯雲遊息助須苦介效首質例唉職復輸節規注畢查熱油館態停福救倒親害亂古步寶擊舉終嗯印限依斷輕環簡趣志響隨練續魚篇司局送極角省源陽幹習羅武免疑拉克仍樓佛足低廣煩鳥顯碼土率聖壞初具預呀眾責爭兵智誤境青順野楚貴負壓史適係測懷迎配魔慢哇懂嗚亦味評舞細醫帝屬句戀敗宜楊甲追灌春左敢靈狂際群族木騎里項戲遇狗佳博右痛營妹康善徵歷官爾按編病護補擇抓石歲隻領尋溫養止守君血田雨居謂異優跳拜爛封惡良模狀浪聊增核激維陸吳牛忙詞劇宿急啥抱靜攻亞江致陣嚴宗警壘夫密睡午店勢悲蘭幕緣週廠簽坐香爽控微登翻普蠻冷威毒俊絡輯母創堂趙套舊雜周述恐幸亮麗巴禮酒仁餐牌突腳劍招吉父仔典搞房素防授充草暴慮紹背劉委府景憶尤諸缺援漫琴罵純尚藝惜置益姐誠繼湖欲麻靠肉松刻紀退既含判釋皮波承射堆莫製鍵趕旁筆扁註奏樹律鐵榮昨毛彩歸虎罪皆葉售彈衛施銘刀塊漢欣布賞載險播升鐘寄弄付構囉磁螢偉薦洋嘿啟梅策嘻燈鬼檢宣哦媽均派豬濟架享呆訓藍劃擔努郭歉紙貼暗呼罷巧慧穿詳雷協督顧臉逢島獎游批略短幻沙散敵鄉冊輪朝窗忍河藏衝混唯乾冠熟鷹蛋尊棄敬季婚縣緊伯申衣購僅帳層秋猜偏鏡食喝偷贊犯勇顆姓束淡詩嘉曉借徒洲擁序慶績祝獅圍餘私鬥柔漂富秀範避輝譯孤笨括吸端移廳蓋末察抗揮乖積插驚蔡忠愈雪巨碩瑞凡朱籃丟盤偶港宮帥宏雅貨醒虛遺掛透爆烈滅材拍休誌圓銀互飯掌豪替挑頂熊累址健俠雞困諾輔伴玉洗敏臨街降唸憐蘇米減操瘋辛宇聚兮彼採屆尼輩藥騙綠童縮符獲默郎碰禁婆咧股抽砍恨肯刊泡漸鋼廢淚樞贏歐財訂途觸賢傑脫箱佈仙冰析蒼厭籍堅哭夏懶橋穩露詢森絲塵慣濤誼佔茶賴階豐貝暑郵危寒械隱爸汽慘旅村予振亡瓶遭哲零納珍乃席哩鄭吹骨煙胡倫洪搖娘芳索峰織惠杯浮狼隔椰租尾忽複莊款菜副企折擾揚鼠冒癡鼓刺頻喵針霸暫伊沉嘴庫悔陰寂倚探祖摩距剩遍蟲燒頁隆弱豆延蕭握寧昭盟覆憲秘耐愁丁撥沈昇髮哀龜眉固卷顏閒稍殘搭京傻耳映託恩鴻妙辯媒吵擬違憂桌拼銷藉胖屋域船勞洞寢井徐川奈戶乘額倍農擺塞橫賀皇拖怨牙齊逃障賺滾干譜烏瞭戴搬鬆瓜迫嚇奶棋鬧盛摸尺伙染佩床酷孫牠屁醉震鎖凱損潮役泰伍冬桃聰乙迴競崇撞厲淨牽羊惑溪帽眠巷溝俗宋飄淺獻麵艦滑榜圈庭縱閃蓮麥邦耀旋閱諒紫攝儀妨審描洽毀逐陪填踏跌藤慕勒闆殊姊憑寞岸芬鎮池拒葛州鋒寬拳于函驅后裁蟹阻邪革頗臥昌孟航遙翔蠍恭奧齋睛槍塔閉頓糊仰旗勵厚魂准丸宙逸裕舒訪兼薩飲赤閣庸啪搶勿砂緒丌穹儘掃慈欄嘗勸鮮奮賜菩喊闡幽擴污彰毫祥盜証罰番尖灰狐衡擎汪監籌遲誇邱稅浩拆紛吾托姑咱漏誕淑鬱砲柏牆窩傾辭秒羽渡沖廖輛齡培邀甘袋杜酸胸邏豈涼肥谷獸娃孔陷估妻徑玫潛晶胞煞脆抹猶築呂碎噴截旦婦垃荒幣圾串壯伸傲弦泥繁魯忌億叭坦恥蜜欺捨怡玲臭唐湯窮悉勁拔甜蒙逛朵摘膽糟腿喇醜躍繳泉澤碧鞋韓彥晨莉駕猛緩坡炸怒召捕幼艾恆割扯盾么吐昏辨軒巫丹鑑彎賦坪侵胎悠薪刪彬悟珠勤瑰植痴礙敝盃盼亨逝剪磨逼濃洛乏擋姆症嫌躲壁釣暖憾遜愉曰采捷嘆玄滴扣抵奔翁蹟菲爬棚夕惱戒牲泳恰滄桑蔣潔焦勉奪萊咖貪踢抄跡鍾涯箭誓穌涉稿署療礎僑涵霧粉俱徹謀屠犧唷繞壽爺騷氏翼云肚吝梁咪繪廉飽鳴貌霹炮捐啡炎嗨貢曼壢鼻奉鈴耗恢融筋撿儒飾禍侯唬挖幅瞧廷咦撐柳薄黎捲嵐吊靂擠覽迪凌茫燃瑪弘矛敦瑜錦楓賓梯琪獄側咬墨悶晴怖喬齒嶺仲韻旭綜兔蹤姿邁傢譽褲孝促駛仇粗妮牧舟糕殼蝶兇鍋懼銳吟虧枝耍闊疼拾毅刷塗夾裂陀哉鄰悅契轟爵屏駐賭蜂扇羞瓦疏欽斗坤堪洩逆抬哎餅彌貫綱惹翹墮狠頑莎擦贈凝滋靖喂允彭挺拋愚征辱朗余慰禪蛙秦災偵讚椅夥碗丙卒荷披趨劫迅笛烤肩矣遷汝鹿缸慾爐魅丈巡措秤沿痕濫漲腰賤妥液鵝軌叔陵貞扭漠祕蝦捉謠氛膠遞霖雯髒倆旺杉燕寸茂循屍鑽晃悄翅芒斜廁呦溜鶴喪盒摔愧灑津盈脈苗堡刑叉撒虫纏遵臣櫻扮渾噁趁呈牢泊欠慎琳倦腐蛇搜患伏陶柯劣疲儲桿祂塑蓉繫疾泣粒渴璃茲鄧歪棟騰玻娟叡返併弊埋晉稀鴨汗牡暢添妖劑泛柴杰攜飆壇阮匆喚昆拷儂斥垂萍勾催糖澎踩櫃蟻販抑虹潘坑曹暮腹煮襲仿臂吻浴框敲佑体彷謹岳敘賊罐寡燦侶攤芭翠羨占綿謎掩喻秩煌賠籤珊馨札脅旨拘紐喲蠢詠匙羯攔膚驟嫁廟孕俄肝罩腸叛匪倉卸祭袍謊埔几貿魏禦踴蘋卜澄麟宵陌陋屈衷崗盪曆惟舌匯誘桂娜菁睹殿傅咒謙雀粽卓鑰斌袖鈕媚叮翰堯盧捧壹憤猴粹跨螞埃枉卿撕紋瑋划囂雕乳膀仗赫筒辜桶彿衰獵譬勳衫懇瓊凍戚穎軸殖撤吋寮潭姻躺樑昂潑腔龐澳瞬寺銅閩肢糾叢卑拓宰鍊湊梭董宅刮胃芝淋斃驕奸殷墓償冥炒潤蕩妄砸餓扎佇尿眷濕盲偽踐淫鼎貧謬矩蟑駁兆淵棍馳熙扶聘斬穴槽詭昧澡螂辣匹蚊僧柱挫袁籠抖訝勃顛淘撲丘吞亭瘟癢肆漆詗尹猩帖佐昱咳祈詹毋矮苑賄緻婉斤饒闖戈歧諷熬診霜諧掙鈞覓瀟屑痞鋪黏遣蹈懸詮岡蝴汁攏帆壺瑟雁辰婷穗慨哼淒佬膜肅濾涂范恕醬纖輻懿稚郁募豫艇枯掰寵遨并漁淹岩墊鞭縫駿歹斑甄竿駝昔崎冤棵僕疊箏剎墜遮螺煎薰癮蠟瞎禱皓坎蒂焉魁唇犬弓錶籲娛甩颱屎沾撫傘嬌錫唔郝禿淪剝揭溶肇匿趟盆湧坊碳赴絃磚栗狹廿菊嘎瘦奴氧頹璋驢畏珮債摧鹽噹噓挽墾霞伐畔韋姬逍瑩脾嘟帕噪穫縛暈裙頸竊濁峽倘蘊餵囊霉薇剃衍訣廂臟枕慌豔湘熄琦蓄削鵬券渺臘伺蕾矢挨漿娶廚睜虐薛蓬垮暨鑼遂喧釘堵醇嬰耕濱葬履艱緯姦摯鴉蒸葡嚐甫璿霍尉妓棉秉爹撈綁翩嘸呻拂貳燭懲宴撇爍汰歇癌咕崩膩撰樸棺頌魄舜蕃寇萄妝遼襄薯曝諮蘿頒菌嚮氓枚酬馮嘲橘侮灘屢歎巢髓碑梨礦疋脹賈譴悸煉胏豹擅迦蠶肌攀卵闢炳嘍盞鄙浦尬弗株爪抒侍阪祇逗喉栽疫黯飼鋁鉛劈艘仕嶼郊釵鵰裸嘯璞凶頃寓狸柄挪沛鰱咚芷彙豎僚姜窄杖倩兜廊燙惶吶祺耿鏘綽迄柵夷拙煥妒鷗溯蠅沌聆潰攪吼竭磊瞄唾棲倡掏俺浸酌繭芙楣押卦苛鴿凸匠悼蛛繩掠暱瞞芋蔥墳拯啤剋逕茵佮滔崔宛贖蟬蕉貶裹燄朦芽御狄顫倪燥啞頡樺惰荳糧貸祐炫旬噢齣鱉簿喘綸腥敷悍袂僵尷締檳紮斧襟轄肖鈍腫檬蹲嗜逾瀑罕癒碌迋稻譚撼禎裏凋哨掘澀釁汙庚慚隧膨詐釀脂圭凳鑫槓綺拭捏拐瑛醋蔚筠鶯闇伶曬鬍膝亟卅曠抉惘溢剖喃琉竅蝸呃匡逮榔奕傍檸鉤襪暇扳梵泓涅刁輾蔔斐捍聳疤蜘姚忿恍黛瀚諦堤窟篠仟繡暉嗶窺晦渝禧刃沫葵匣楠隸轎嘔蔽綻丞諜襯晰膏窈嚕蘆斂皺峻孰仄瀏涕鈔沮擲窕煽袱蝕絆茹瞪丐舅詰懺鹹錐丑淳焚溉毓蒐戳雛闕佰鈺哄菱肺軀芸姨壟盯奢巾槃紗菸凹腕翟怠蟾蔭庄寰囡瑄饋阱靶腎擱搏闌穆呱犀飢蹺疵瑤樵鴛輒閥琨憧勻搗隙悵虞跪乞逞孽瀰榕徽蜀螃俏淆丰萱俯敞渣緝詛紳屐眺咫溺疆饅瓏屯沸餃鴦夭憬駱芹葦徘竄謗啼囚絮鐸乍蕙杆冗簧脊眸愿趴滯貂嘶拱掀萃彗邵徨輿朮巍徊叩妞侏苟吠嘩憊茅矯邂檯鎚禽棠崖澆啄挂銜朽嫖汐揣寥徬畜瑕氾赦筱粥稜虔湛崙瞻懦滲儡祿簾擒萎澈蓓磋膳瀉蚤椒儕塌莽琮壤矽弧茍脖憫魎鏈蕊鍛奎嚼糗楷茁偎磅笙蔓恃隅餌裘俐拚廓鄒烘汀鑄崑鑒嚷莖噸煤勘殲樽扔杏瀾廈噎穢馴峙厄躬僻酥毆郤曖繽伽閔蔑茜躁誡繕咎鏽淌曜扛頰佫麒喀蒞芥逅雇斟菇誦瞳苔樁懋曳滷閏耽駭糞卯岔琵蹋禹汲倌嗡泌捌皂晝渦岱梳莓睿鋸瞌轅惕廬旻遁贓礁毯絨淇甦莒粵焊瀨隘嫩藐垢聶譏恤怯岫巖倖訶裔蟄吭跤嘰梓鎧鱗痘朔騁驀矇椎嚎釐橄亥龔濛俞殃幟啃欖搓瓣妃噱埠硫裊閻狡橙蹄薔豚炭琶冀祟喙鷺炊糙靡塘媳筷懈嫂廝橡瓢暸兌攸唆塚溼搪茄膛祉氫炬挾瓷攬苓霆贅桐鍍狷呸嫉踹咆砌愣蜢藻瘤鞠墅瑣呎牟睏郡鉅饗遐胺霄猿蝠沐摟曦錚傀煚燼韜璇艷侃疚颺蹦恬璧霈屜篤咽荊鵑昶諱屌憎裳陡楞洶耘嚨莘淼嗤酵銓煜鷥厝轍嗓偕揍摺簫戌烹鞏盔傭骯烙蚱慷嶸徜偈焰啾誅曙藹蚵憨峨悽磯涓蒲茉揉閑璟饑畸鯉鯽銬岐雋誨稽戊臻繃扒舵巳羔睬恁癸艙紡煒韌弔娑擷冕碘豁摳肘抨曇臆熔駒壩絞疇珈肛骷朧媛嫣榨纜褪昀趾酹柚搔羹舖眨堇靨蝙鞍鏟哺惆霓癱訕蛻沼聾憋韶枷懊惚篩巒凜丫硝忱玖嵩拌絢褚汎葭鸚嶽祁矜盎噫婊筑憩鵡羈娥鏢硨蒹袒塹悴瘡俾窘亢詬扼祠厥蜴蛤痊茱儼笈榴騏蒜奄髏鬚砰迢蜥縷鯨葔糢吱眩棧戮夸樟杭笠咸棘慵籬庶荼捶漣櫥吏荐芯禾巔肋侖跆恣鳩蔬徉跎揀艸嚀蜻嬉鱷沁嗽瑾藩匕鹼酋虜噩驛奠萌嗆墉兢躇泠梢翱儉甸薑詣翡僥竇瘖撓蟀蜓躊緬憔擻梟渲耙惋塾皈訐觴眶蛀愴殭噗灸竺幌痲稟傌欒',
    },
  ];
}
