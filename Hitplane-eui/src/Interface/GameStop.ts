/*
 * 游戏结束界面
*/
class GameStop extends eui.Component {
	// 单例
	private static shared: GameStop;
	public static Shared() {
		if (GameStop.shared == null) {
			GameStop.shared = new GameStop();
		}
		return GameStop.shared;
	}

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/GameStopSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	// 杀敌数
	private lb_enemy: eui.Label;
	// 分数
	private lb_score: eui.Label;
	// 再来一次
	private btn_again: eui.Button;

	private onComplete(): void {
		// 监听再来一次按钮
		this.btn_again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAgain, this);
	}

	// 再来一次
	private onBtnAgain(): void {
		this.parent.removeChild(this);
		// 初始化游戏界面
		SceneGame.Shared().initGame();
	}
}