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
// 设置界面
var SetGame = (function (_super) {
    __extends(SetGame, _super);
    function SetGame() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/SetGameSkin.exml';
        return _this;
    }
    SetGame.Shared = function () {
        if (SetGame.shared == null) {
            SetGame.shared = new SetGame();
        }
        return SetGame.shared;
    };
    SetGame.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    SetGame.prototype.onComplete = function () {
        egret.log('SetGame');
    };
    return SetGame;
}(eui.Component));
__reflect(SetGame.prototype, "SetGame");
//# sourceMappingURL=SetGame.js.map