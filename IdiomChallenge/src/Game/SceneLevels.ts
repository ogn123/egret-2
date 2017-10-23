/*关卡界面*/
class SceneLevels extends eui.Component {
	private btn_back: eui.Button;
	private group_levels: eui.Group;
	// 关卡数量
	private CheckpointCount: number = 400;

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/SceneLevelsSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	private onComplete(): void {
		// 关卡图标
		var icon = new LevelIcon();
		this.group_levels.addChild(icon);
	}
}