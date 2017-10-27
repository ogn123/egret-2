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
/*开始界面*/
var SceneBegin = (function (_super) {
    __extends(SceneBegin, _super);
    function SceneBegin() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/SceneBeginSkin.exml';
        return _this;
    }
    SceneBegin.Shared = function () {
        if (SceneBegin.shared == null) {
            SceneBegin.shared = new SceneBegin();
        }
        return SceneBegin.shared;
    };
    SceneBegin.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    SceneBegin.prototype.onComplete = function () {
        // 开启播放背景音乐
        SoundMenager.Shared().PlayBGM();
        this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBegin, this);
        // 设置
        this.btn_set.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSet, this);
    };
    SceneBegin.prototype.onBegin = function () {
        SoundMenager.Shared().PlayClick();
        // 进入关卡界面
        this.parent.addChild(SceneLevels.Shared());
        this.parent.removeChild(this);
    };
    // 设置
    SceneBegin.prototype.onBtnSet = function () {
        this.parent.addChild(GameSetting.Shared());
    };
    return SceneBegin;
}(eui.Component));
__reflect(SceneBegin.prototype, "SceneBegin");
//# sourceMappingURL=SceneBegin.js.map