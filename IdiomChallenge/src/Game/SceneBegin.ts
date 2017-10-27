/*开始界面*/
class SceneBegin extends eui.Component {
	// 单例
	public static shared: SceneBegin;
	public static Shared() {
		if (SceneBegin.shared == null) {
			SceneBegin.shared = new SceneBegin();
		}
		return SceneBegin.shared;
	}

	private btn_begin: eui.Button;
	// 设置
	private btn_set: eui.Button;

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/SceneBeginSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	private onComplete(): void {
		// 开启播放背景音乐
		SoundMenager.Shared().PlayBGM();
		this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBegin, this);
		// 设置
		this.btn_set.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSet, this);
	}

	private onBegin() {
		SoundMenager.Shared().PlayClick();
		// 进入关卡界面
		this.parent.addChild(SceneLevels.Shared());
		this.parent.removeChild(this);
	}

	// 设置
	private onBtnSet(): void {
		this.parent.addChild(GameSetting.Shared());
	}
}