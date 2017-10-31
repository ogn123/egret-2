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
/*
 * 游戏结束界面
*/
var GameStop = (function (_super) {
    __extends(GameStop, _super);
    function GameStop() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/GameStopSkin.exml';
        return _this;
    }
    GameStop.Shared = function () {
        if (GameStop.shared == null) {
            GameStop.shared = new GameStop();
        }
        return GameStop.shared;
    };
    GameStop.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    GameStop.prototype.onComplete = function (e) {
        // 监听再来一次按钮
        this.btn_again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAgain, this);
        // 监听返回主页按钮
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBack, this);
    };
    // 显示分数和杀敌数
    GameStop.prototype.showScore = function (score, kills) {
        this.lb_score.text = score.toString();
        this.lb_enemy.text = kills.toString();
    };
    // 再来一次
    GameStop.prototype.onBtnAgain = function () {
        this.parent.removeChild(this);
        // 初始化游戏界面
        SceneGame.Shared().initGame();
    };
    // 返回主页
    GameStop.prototype.onBtnBack = function () {
        this.parent.addChild(StartGame.Shared());
        this.parent.removeChild(SceneGame.Shared());
        this.parent.removeChild(this);
    };
    return GameStop;
}(eui.Component));
__reflect(GameStop.prototype, "GameStop");
//# sourceMappingURL=GameStop.js.map