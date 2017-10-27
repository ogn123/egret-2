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
 * 开始游戏界面
*/
var StartGame = (function (_super) {
    __extends(StartGame, _super);
    function StartGame() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/StartGameSkin.exml';
        return _this;
    }
    StartGame.Shared = function () {
        if (StartGame.shared == null) {
            StartGame.shared = new StartGame();
        }
        return StartGame.shared;
    };
    StartGame.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    StartGame.prototype.onComplete = function () {
        // 监听开始游戏按钮
        this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnStart, this);
    };
    // 开始游戏
    StartGame.prototype.onBtnStart = function () {
        this.parent.addChild(SceneGame.Shared());
        this.parent.removeChild(this);
    };
    return StartGame;
}(eui.Component));
__reflect(StartGame.prototype, "StartGame");
//# sourceMappingURL=StartGame.js.map