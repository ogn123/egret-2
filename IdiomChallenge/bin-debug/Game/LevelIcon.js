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
/*绘制图标*/
var LevelIcon = (function (_super) {
    __extends(LevelIcon, _super);
    function LevelIcon() {
        var _this = _super.call(this) || this;
        _this.skinName = 'resource/eui_skins/LevelIconSkin.exml';
        return _this;
    }
    LevelIcon.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    Object.defineProperty(LevelIcon.prototype, "Level", {
        get: function () {
            return parseInt(this.lb_level.text);
        },
        set: function (value) {
            this.lb_level.text = value.toString();
        },
        enumerable: true,
        configurable: true
    });
    return LevelIcon;
}(eui.Button));
__reflect(LevelIcon.prototype, "LevelIcon");
//# sourceMappingURL=LevelIcon.js.map