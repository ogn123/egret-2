var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 游戏界面
var SceneGame = (function (_super) {
    __extends(SceneGame, _super);
    function SceneGame() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/SceneGameSkin.exml';
        return _this;
    }
    SceneGame.Shared = function () {
        if (SceneGame.shared == null) {
            SceneGame.shared = new SceneGame();
        }
        return SceneGame.shared;
    };
    // 初始化关卡
    SceneGame.prototype.InitLevel = function (level) {
        // 胜利界面不可见
        this.group_win.visible = false;
        this.levelIndex = level;
        // 当前关卡的数据
        var leveldata = LevelDataManager.Shared().GetLevel(level);
        console.log(leveldata);
        // 将字段拼起来
        var words = leveldata.answer + leveldata.word;
        // 随机一个其他题目的字段混合进本题目
        while (words.length == 10) {
            // 获取 0-399 之间的整数
            var i = Math.floor(Math.random() * 400);
            if (i != level) {
                var temp = LevelDataManager.Shared().GetLevel(i);
                words += temp.answer + temp.word;
            }
        }
        // words 字段重排
        var wordList = [];
        for (var i = 0; i < words.length; i++) {
            wordList.push(words.charAt(i));
        }
        wordList = this.randomlist(wordList);
        // 问题区赋值
        for (var i_1 = 0; i_1 < this.group_words.numChildren; i_1++) {
            var wordRect = this.group_words.getChildAt(i_1);
            wordRect.setWordText(wordList[i_1]);
            wordRect.visible = true;
        }
        // 初始化答案区域的状态
        for (var i_2 = 0; i_2 < this.group_answer.numChildren; i_2++) {
            var answerRect = this.group_answer.getChildAt(i_2);
            answerRect.SetSelectWord(null);
            answerRect.visible = true;
            answerRect.SelectWord = null;
        }
        // 显示图片
        this.img_question.source = 'resource/assets/' + leveldata.img;
        // console.log(wordList);
    };
    SceneGame.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    SceneGame.prototype.onComplete = function () {
        // 返回选择关卡页面
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBack, this);
        // 监听下一题
        this.btn_next.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnNext, this);
        // 监听设置按钮
        this.btn_set.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSet, this);
    };
    // 点击问题字, 将问题字添加到答案中
    SceneGame.prototype.onTouchTap = function (word) {
        // 第一个没有文本的答案块
        var sel = null;
        for (var i = 0; i < this.group_answer.numChildren; i++) {
            var answer = this.group_answer.getChildAt(i);
            if (answer.SelectWord == null) {
                sel = answer;
                break;
            }
        }
        // 当有一个合适的位置的时候就会将字填充，并判断是否胜利
        if (sel != null) {
            sel.SetSelectWord(word);
            // 判断是否胜利
            var checkStr = '';
            for (var i = 0; i < this.group_answer.numChildren; i++) {
                var answer = this.group_answer.getChildAt(i);
                checkStr += answer.getWordText();
            }
            // 胜利
            if (checkStr == LevelDataManager.Shared().GetLevel(this.levelIndex).answer) {
                // 显示胜利界面
                this.showWin();
            }
        }
    };
    // 返回选关界面
    SceneGame.prototype.onBtnBack = function () {
        this.parent.addChild(SceneLevels.Shared());
        this.parent.removeChild(this);
    };
    // 设置
    SceneGame.prototype.onBtnSet = function () {
        this.parent.addChild(GameSetting.Shared());
    };
    // 下一题
    SceneGame.prototype.onBtnNext = function () {
        this.group_win.visible = false;
        SceneLevels.Shared().OpenLevel(this.levelIndex + 1);
        this.InitLevel(this.levelIndex + 1);
    };
    // 显示胜利界面
    SceneGame.prototype.showWin = function () {
        this.group_win.visible = true;
        var leveldata = LevelDataManager.Shared().GetLevel(this.levelIndex);
        this.explain_text.text = leveldata.tip;
        this.source_text.text = leveldata.content;
    };
    // 数组内容随机排序
    SceneGame.prototype.randomlist = function (arr) {
        var array = [];
        while (arr.length > 0) {
            var i = Math.floor(Math.random() * arr.length);
            array.push(arr[i]);
            arr.splice(i, 1);
        }
        return array;
    };
    return SceneGame;
}(eui.Component));
__reflect(SceneGame.prototype, "SceneGame");
//# sourceMappingURL=SceneGame.js.map