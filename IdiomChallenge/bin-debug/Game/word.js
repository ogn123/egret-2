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
// 普通的一个字，用来做问题的字块使用
var word = (function (_super) {
    __extends(word, _super);
    function word() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTouchTap, _this);
        return _this;
    }
    word.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    word.prototype.onComplete = function () {
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    };
    word.prototype.onTouchTap = function () {
        SceneGame.Shared().onTouchTap(this);
    };
    word.prototype.setWordText = function (value) {
        this.lb_text.text = value;
    };
    word.prototype.getWordText = function () {
        return this.lb_text.text;
    };
    return word;
}(eui.Component));
__reflect(word.prototype, "word");
// 继承自“问题字”，“答案字”是放在上面回答区域，
// 由于当答案字点击的时候，答案字会消失并将对应的问题字还原显示
var AnswerWord = (function (_super) {
    __extends(AnswerWord, _super);
    function AnswerWord() {
        var _this = _super.call(this) || this;
        // 答案中存储的问题字
        _this.SelectWord = null;
        return _this;
    }
    AnswerWord.prototype.onTouchTap = function () {
        if (this.SelectWord != null) {
            this.SelectWord.visible = true;
            this.SelectWord = null;
            this.setWordText("");
        }
        // console.log(this.SelectWord);
    };
    //当一个问题字被选择添加到回答的时，设置不可见，并保存到本对象中以后使用
    AnswerWord.prototype.SetSelectWord = function (word) {
        if (word != null) {
            word.visible = false;
            this.setWordText(word.getWordText());
        }
        else {
            this.setWordText('');
        }
        this.SelectWord = word;
    };
    return AnswerWord;
}(word));
__reflect(AnswerWord.prototype, "AnswerWord");
//# sourceMappingURL=word.js.map