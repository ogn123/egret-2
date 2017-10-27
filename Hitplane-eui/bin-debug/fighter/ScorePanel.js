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
     * 分数
    */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            var _this = _super.call(this) || this;
            var scoreBg = new egret.Bitmap(RES.getRes('show_score_box_png'));
            _this.addChild(scoreBg);
            // gameover
            var gameover = new egret.Bitmap(RES.getRes('gameover_png'));
            _this.addChild(gameover);
            gameover.scaleX = .5;
            gameover.scaleY = .4;
            gameover.x = (scoreBg.width - gameover.width * gameover.scaleX) / 2;
            gameover.y = 30;
            _this.tx = new egret.TextField();
            _this.tx.width = scoreBg.width;
            _this.tx.height = scoreBg.height;
            _this.tx.size = 24;
            _this.tx.textAlign = 'center';
            _this.tx.y = 80;
            _this.tx.lineSpacing = 6;
            _this.addChild(_this.tx);
            return _this;
        }
        // 显示分数
        ScorePanel.prototype.showType = function (value) {
            this.tx.text = '您当前的分数是\n' + value + '\n重来一局？';
        };
        return ScorePanel;
    }(egret.DisplayObjectContainer));
    fighter.ScorePanel = ScorePanel;
    __reflect(ScorePanel.prototype, "fighter.ScorePanel");
})(fighter || (fighter = {}));
//# sourceMappingURL=ScorePanel.js.map