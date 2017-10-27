// 普通的一个字，用来做问题的字块使用
class word extends eui.Component {
	protected lb_text: eui.Label;

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	protected createChildren() {
		super.createChildren();
	}

	private onComplete(): void {
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	protected onTouchTap() {
		SceneGame.Shared().onTouchTap(this);
	}

	public setWordText(value: string) {
		this.lb_text.text = value;
	}

	public getWordText(): string {
		return this.lb_text.text;
	}
}

// 继承自“问题字”，“答案字”是放在上面回答区域，
// 由于当答案字点击的时候，答案字会消失并将对应的问题字还原显示
class AnswerWord extends word {
	// 答案中存储的问题字
	public SelectWord: word = null;

	public constructor() {
		super();
	}

	protected onTouchTap() {
		if (this.SelectWord != null) {
			this.SelectWord.visible = true;
			this.SelectWord = null;
			this.setWordText("");
		}
		// console.log(this.SelectWord);
	}

	//当一个问题字被选择添加到回答的时，设置不可见，并保存到本对象中以后使用
	public SetSelectWord(word: word) {
		if (word != null) {
			word.visible = false;
			this.setWordText(word.getWordText());
		} else {
			this.setWordText('');
		}
		this.SelectWord = word;
	}
}