const dict = {
    'zh-CN': { 
        appTitle: "数学大冒险", quiz: "综合测验", parentReport: "家长报告",
        counting: "数一数", addition: "加法", subtraction: "减法", 
        patterns: "找规律", compare: "比大小", missing: "找缺数", 
        shadow: "找影子", shapes: "认图形", sorting: "分类", measure: "比长短", colors: "认颜色",
        correct: "太棒了！", wrong: "哎呀，再试一次！", 
        howMany: "有几个", whichMore: "哪边多？", whatNext: "下一个是什么？", 
        missingNum: "缺了哪个数？", whoseShadow: "这是谁的影子？", whatShape: "这是什么形状？",
        sortByColor: "把它放进正确的篮子！", whichTaller: "哪个更高？", whichLonger: "哪个更长？",
        findColor: "找相同颜色！", listenShape: "听一听，点一点！",
        circle: "圆形", triangle: "三角形", square: "正方形", star: "星形",
        red: "红色", yellow: "黄色", green: "绿色", blue: "蓝色",
        plusEqualsWhat: "{a} 加 {b} 等于多少？", minusEqualsWhat: "{a} 减 {b} 等于多少？",
        newSticker: "获得新贴纸！", quizDone: "测验完成！",
        totalStars: "总星星", questions: "答题数", accuracy: "正确率",
        weaknesses: "薄弱环节", noMistakes: "没有记录到错误，太棒了！",
        correctAns: "正确答案", clearHistory: "清除记录",
        feed: "喂食", yum: "真好吃！", needStars: "星星不够哦！",
        coloring: "涂色书", dailyChallenge: "每日挑战", bedtimeStory: "睡前故事",
        dailyDone: "今天已完成！", comeBackTomorrow: "明天再来挑战吧！",
        perfectDaily: "完美！获得黄金奖杯！", goodJobDaily: "做得好！明天继续加油！",
        noStickersToday: "今天还没有贴纸哦", playToEarnStory: "快去玩游戏赚取贴纸，来生成专属故事吧！",
        readAloud: "朗读故事", stop: "停止",
        games: "数学游戏", activities: "趣味活动", challenges: "挑战与成就",
        memory: "记忆翻牌", tracing: "描数字", badges: "成就徽章"
    },
    'en-US': { 
        appTitle: "Math Adventure", quiz: "Quiz", parentReport: "Parent Report",
        counting: "Count", addition: "Add", subtraction: "Subtract", 
        patterns: "Patterns", compare: "Compare", missing: "Missing", 
        shadow: "Shadows", shapes: "Shapes", sorting: "Sorting", measure: "Measure", colors: "Colors",
        correct: "Awesome!", wrong: "Oops, try again!", 
        howMany: "How many", whichMore: "Which is more?", whatNext: "What comes next?", 
        missingNum: "What's missing?", whoseShadow: "Whose shadow?", whatShape: "What shape?",
        sortByColor: "Sort it into the right basket!", whichTaller: "Which is taller?", whichLonger: "Which is longer?",
        findColor: "Find the same color!", listenShape: "Listen and tap!",
        circle: "Circle", triangle: "Triangle", square: "Square", star: "Star",
        red: "Red", yellow: "Yellow", green: "Green", blue: "Blue",
        plusEqualsWhat: "{a} plus {b} equals what?", minusEqualsWhat: "{a} minus {b} equals what?",
        newSticker: "New Sticker!", quizDone: "Quiz Complete!",
        totalStars: "Total Stars", questions: "Questions", accuracy: "Accuracy",
        weaknesses: "Weaknesses", noMistakes: "No mistakes recorded! Great job!",
        correctAns: "Correct Answer", clearHistory: "Clear History",
        feed: "Feed", yum: "Yum yum!", needStars: "Need more stars!",
        coloring: "Coloring", dailyChallenge: "Daily", bedtimeStory: "Story",
        dailyDone: "Done for today!", comeBackTomorrow: "Come back tomorrow!",
        perfectDaily: "Perfect! You won the Golden Trophy!", goodJobDaily: "Good job! See you tomorrow!",
        noStickersToday: "No stickers today", playToEarnStory: "Play games to earn stickers for a story!",
        readAloud: "Read Aloud", stop: "Stop",
        games: "Math Games", activities: "Activities", challenges: "Challenges",
        memory: "Memory", tracing: "Tracing", badges: "Badges"
    }
};

export class I18n {
    constructor() { this.lang = localStorage.getItem('mathLang') || 'zh-CN'; }
    setLang(lang) { this.lang = lang; localStorage.setItem('mathLang', lang); document.documentElement.lang = lang; }
    t(key, params) {
        let str = dict[this.lang][key] || key;
        if (params) {
            for (const k in params) str = str.replace(`{${k}}`, params[k]);
        }
        return str;
    }
}
