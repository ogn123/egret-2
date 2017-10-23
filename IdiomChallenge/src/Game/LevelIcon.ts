/*绘制图标*/
class LevelIcon extends eui.Component {
  private lb_level: eui.Label;

	public constructor() {
		super();
		this.skinName = 'resource/eui_skins/LevelIconSkin.exml';
	}

	protected createChildren() {
		super.createChildren();
	}

	public get Level(): number {
		return parseInt(this.lb_level.text);
	}

	public set Level(value: number) {
		this.lb_level.text = value.toString();
	}
}