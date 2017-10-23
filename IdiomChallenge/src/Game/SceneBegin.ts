/*开始界面*/
class SceneBegin extends eui.Component {
	private btn_begin: eui.Button;

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/SceneBeginSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	private onComplete(): void {
		this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBegin, this);
	}

	private onBegin() {
		// 进入关卡界面
		this.addChild(new SceneLevels());
	}
}