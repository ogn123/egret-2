/*
 * 开始游戏界面
*/
class StartGame extends eui.Component {
	// 单例
	private static shared: StartGame;
	public static Shared() {
		if (StartGame.shared == null) {
			StartGame.shared = new StartGame();
		}
		return StartGame.shared;
	}

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/StartGameSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	// 开始游戏按钮
	private btn_start: eui.Button;
	// 设置按钮
	private btn_set: eui.Button;

	private onComplete(): void {
		// 监听开始游戏按钮
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnStart, this);
	}

	// 开始游戏
	private onBtnStart(): void {
		this.parent.addChild(SceneGame.Shared());
		this.parent.removeChild(this);
	}
}