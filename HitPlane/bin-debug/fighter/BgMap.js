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
     * 可滚动的视图
    */
    var BgMap = (function (_super) {
        __extends(BgMap, _super);
        function BgMap() {
            var _this = _super.call(this) || this;
            /*滚动速度*/
            _this.speed = 2;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        BgMap.prototype.onAddToStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            // 舞台的宽高
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            // 纹理高度
            var texture = new egret.Bitmap(RES.getRes('bg_jpg'));
            this.textureHeight = texture.height;
            // 计算当前页面需要的图片数量
            this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1;
            this.bmArr = [];
            // 显示这些背景图片，设置 y 坐标，将他们连接起来
            for (var i = 0, l = this.rowCount; i < l; i++) {
                var bgBmp = new egret.Bitmap(RES.getRes('bg_jpg'));
                bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
                // bgBmp.width = this.stageW;
                this.bmArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        };
        /*开始滚动*/
        BgMap.prototype.start = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        // 逐帧运动
        BgMap.prototype.enterFrameHandler = function (e) {
            for (var i = 0, l = this.bmArr.length; i < l; i++) {
                var bgBmp = this.bmArr[i];
                bgBmp.y += this.speed;
                // 判断超出屏幕后，回到队首
                if (bgBmp.y >= this.stageH) {
                    bgBmp.y = -(this.textureHeight * this.rowCount - this.stageH);
                    this.bmArr.pop();
                    this.bmArr.unshift(bgBmp);
                }
            }
        };
        /*暂停滚动*/
        BgMap.prototype.pause = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        return BgMap;
    }(egret.DisplayObjectContainer));
    fighter.BgMap = BgMap;
    __reflect(BgMap.prototype, "fighter.BgMap");
})(fighter || (fighter = {}));
//# sourceMappingURL=BgMap.js.map