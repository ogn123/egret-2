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
/*关卡界面*/
var SceneLevels = (function (_super) {
    __extends(SceneLevels, _super);
    function SceneLevels() {
        var _this = _super.call(this) || this;
        // 关卡数量
        _this.CheckpointCount = 400;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/SceneLevelsSkin.exml';
        return _this;
    }
    SceneLevels.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    SceneLevels.prototype.onComplete = function () {
        // 关卡图标
        var icon = new LevelIcon();
        this.group_levels.addChild(icon);
    };
    return SceneLevels;
}(eui.Component));
__reflect(SceneLevels.prototype, "SceneLevels");
//# sourceMappingURL=SceneLevels.js.map