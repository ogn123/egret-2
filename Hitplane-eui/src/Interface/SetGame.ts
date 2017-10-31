// 设置界面
class SetGame extends eui.Component {
    // 单例
    private static shared: SetGame;
    public static Shared() {
        if (SetGame.shared == null) {
            SetGame.shared = new SetGame();
        }
        return SetGame.shared;
    }

    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = 'resource/eui_skins/SetGameSkin.exml';
    }

    protected createChildren() {
        super.createChildren();
    }

    private onComplete(): void {
        egret.log('SetGame');
    }
}