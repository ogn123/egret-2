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
var fighter;
(function (fighter) {
    /*
     * 血条
    */
    var BloodStrip = (function (_super) {
        __extends(BloodStrip, _super);
        function BloodStrip(BWidth, BHeight, allBlood) {
            var _this = _super.call(this) || this;
            _this.bloodW = BWidth;
            _this.bloodH = BHeight;
            _this.rectW = BWidth;
            _this.allBlood = allBlood;
            // 创建下层血条
            var bottomBlood = new egret.Shape();
            bottomBlood.graphics.beginFill(0xCCCCCC);
            bottomBlood.graphics.drawRoundRect(0, 0, _this.bloodW, _this.bloodH, 20, _this.bloodH);
            bottomBlood.graphics.endFill();
            _this.addChild(bottomBlood);
            // 创建上层血条
            _this.topBlood = new egret.Shape();
            _this.topBlood.graphics.beginFill(0xFF0000);
            _this.topBlood.graphics.drawRoundRect(0, 0, _this.bloodW, _this.bloodH, 20, _this.bloodH);
            _this.topBlood.graphics.endFill();
            _this.addChild(_this.topBlood);
            // 创建矩形遮罩
            _this.maskObject = new egret.Rectangle(0, 0, _this.rectW, _this.bloodH);
            _this.topBlood.mask = _this.maskObject;
            return _this;
        }
        // 掉血
        BloodStrip.prototype.reduceBlood = function (restBlood) {
            this.rectW = restBlood / this.allBlood * this.bloodW;
            this.maskObject.width = this.rectW;
            this.topBlood.mask = this.maskObject;
        };
        return BloodStrip;
    }(egret.Sprite));
    fighter.BloodStrip = BloodStrip;
    __reflect(BloodStrip.prototype, "fighter.BloodStrip");
})(fighter || (fighter = {}));
//# sourceMappingURL=BloodStrip.js.map