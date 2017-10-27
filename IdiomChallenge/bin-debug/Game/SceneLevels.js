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
        // 每张地图上的关卡数量
        _this.MapCheckpointCount = 20;
        // y间隔
        _this.spany = 1136 / _this.MapCheckpointCount;
        // 最大尺寸
        _this.maxH = _this.spany * _this.CheckpointCount;
        _this.sel_level = 0;
        // 所有的关卡图标
        _this.LevelIcons = [];
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/SceneLevelsSkin.exml';
        return _this;
    }
    SceneLevels.Shared = function () {
        if (SceneLevels.shared == null) {
            SceneLevels.shared = new SceneLevels();
        }
        return SceneLevels.shared;
    };
    SceneLevels.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    SceneLevels.prototype.onComplete = function () {
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBack, this);
        // 设置
        this.btn_set.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSet, this);
        // 背景地图需要的图片数量
        var mapCount = Math.ceil(this.maxH / this.height);
        // 背景地图
        for (var i = 0; i < mapCount; i++) {
            var image = new eui.Image;
            image.source = RES.getRes('GameBG2_jpg');
            image.y = i * this.height;
            image.cacheAsBitmap = true;
            this.group_levels.addChild(image);
        }
        // 获取到最远进度
        var milestone = LevelDataManager.Shared().Milestone;
        // 绘制关卡图标路径
        for (var i = 0; i < this.CheckpointCount; i++) {
            // 关卡图标
            var icon = new LevelIcon();
            icon.Level = i + 1;
            // 判断当前关卡是否是最远进度
            if (i < milestone) {
                icon.enabled = true;
            }
            else {
                icon.enabled = false;
            }
            icon.y = this.spany * i / 2;
            icon.x = Math.sin(icon.y / 180 * Math.PI) * 200 + this.width / 2;
            icon.y += this.spany * i / 2;
            icon.y = this.maxH - icon.y - this.spany;
            icon.cacheAsBitmap = true;
            this.group_levels.addChild(icon);
            this.LevelIcons.push(icon);
            // 点击按钮进入关卡
            icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIconTap, this);
        }
        // 初始化箭头的位置
        this.img_arrow = new eui.Image();
        this.img_arrow.source = RES.getRes("PageDownBtn_png");
        this.img_arrow.anchorOffsetX = 124 / 2 - this.group_levels.getChildAt(0).width / 2;
        this.img_arrow.anchorOffsetY = 76;
        this.img_arrow.touchEnabled = false;
        // 默认指向最远进度的关卡图标
        this.img_arrow.x = this.LevelIcons[milestone - 1].x + this.LevelIcons[milestone - 1].width / 2;
        this.img_arrow.y = this.LevelIcons[milestone - 1].y;
        this.group_levels.addChild(this.img_arrow);
        // 界面卷动到最远进度
        this.group_levels.scrollV = this.img_arrow.y - 800;
    };
    // 点击关卡
    SceneLevels.prototype.onIconTap = function (e) {
        var icon = e.currentTarget;
        if (this.sel_level != icon.Level) {
            this.img_arrow.x = icon.x + icon.width / 2;
            this.img_arrow.y = icon.y;
            this.sel_level = icon.Level;
        }
        else {
            // 进入并开始游戏
            this.parent.addChild(SceneGame.Shared());
            // 初始化游戏数据
            SceneGame.Shared().InitLevel(icon.Level);
            this.parent.removeChild(this);
        }
    };
    // 返回开始界面
    SceneLevels.prototype.onBtnBack = function () {
        this.parent.addChild(SceneBegin.Shared());
        this.parent.removeChild(this);
    };
    // 打开指定的关卡，如果大于最远关卡，则保存数据也跟着调整
    SceneLevels.prototype.OpenLevel = function (level) {
        var icon = this.LevelIcons[level - 1];
        icon.enabled = true;
        if (level > LevelDataManager.Shared().Milestone) {
            LevelDataManager.Shared().Milestone = level;
            // 同时将选定标记置于其上
            this.img_arrow.x = icon.x + icon.width / 2;
            this.img_arrow.y = icon.y;
            this.sel_level = icon.Level;
        }
    };
    // 设置
    SceneLevels.prototype.onBtnSet = function () {
        this.parent.addChild(GameSetting.Shared());
    };
    return SceneLevels;
}(eui.Component));
__reflect(SceneLevels.prototype, "SceneLevels");
//# sourceMappingURL=SceneLevels.js.map