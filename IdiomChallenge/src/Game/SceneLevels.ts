/*关卡界面*/
class SceneLevels extends eui.Component {
	// 单例
	public static shared: SceneLevels;
	public static Shared() {
		if (SceneLevels.shared == null) {
			SceneLevels.shared = new SceneLevels();
		}
		return SceneLevels.shared;
	}

	private btn_back: eui.Button;
	// 设置
	private btn_set: eui.Button;
	private group_levels: eui.Group;
	// 关卡数量
	private CheckpointCount: number = 400;
	// 每张地图上的关卡数量
	private MapCheckpointCount: number = 20;
	// y间隔
	private spany = 1136 / this.MapCheckpointCount;
	// 最大尺寸
	private maxH: number = this.spany * this.CheckpointCount;
	private img_arrow: eui.Image;
	private sel_level: number = 0
	// 所有的关卡图标
	private LevelIcons: LevelIcon[] = [];

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/SceneLevelsSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	private onComplete(): void {
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBack, this);
		// 设置
		this.btn_set.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSet, this);
		// 背景地图需要的图片数量
		var mapCount: number = Math.ceil(this.maxH / this.height);
		// 背景地图
		for (var i = 0; i < mapCount; i++) {
			var image: eui.Image = new eui.Image;
			image.source = RES.getRes('GameBG2_jpg');
			image.y = i * this.height;
			image.cacheAsBitmap = true;
			this.group_levels.addChild(image);
		}
		// 获取到最远进度
		var milestone: number = LevelDataManager.Shared().Milestone;
		// 绘制关卡图标路径
		for (var i = 0; i < this.CheckpointCount; i++) {
			// 关卡图标
			var icon = new LevelIcon();
			icon.Level = i + 1;
			// 判断当前关卡是否是最远进度
			if (i < milestone) {
				icon.enabled = true;
			} else {
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
	}

	// 点击关卡
	private onIconTap(e: egret.TouchEvent): void {
		var icon = <LevelIcon>e.currentTarget;
		if (this.sel_level != icon.Level) {
			this.img_arrow.x = icon.x + icon.width / 2;
			this.img_arrow.y = icon.y;
			this.sel_level = icon.Level;
		} else {
			// 进入并开始游戏
			this.parent.addChild(SceneGame.Shared());
			// 初始化游戏数据
			SceneGame.Shared().InitLevel(icon.Level);
			this.parent.removeChild(this);
		}
	}

	// 返回开始界面
	private onBtnBack(): void {
		this.parent.addChild(SceneBegin.Shared());
		this.parent.removeChild(this);
	}

	// 打开指定的关卡，如果大于最远关卡，则保存数据也跟着调整
	public OpenLevel(level: number) {
		var icon = this.LevelIcons[level - 1];
		icon.enabled = true;
		if (level > LevelDataManager.Shared().Milestone) {
			LevelDataManager.Shared().Milestone = level;
			// 同时将选定标记置于其上
			this.img_arrow.x = icon.x + icon.width / 2;
			this.img_arrow.y = icon.y;
			this.sel_level = icon.Level;
		}
	}

	// 设置
	private onBtnSet(): void {
		this.parent.addChild(GameSetting.Shared());
	}
}