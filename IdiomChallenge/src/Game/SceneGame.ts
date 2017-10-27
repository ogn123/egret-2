// 游戏界面
class SceneGame extends eui.Component {
	// 单例
	private static shared: SceneGame;
	public static Shared() {
		if (SceneGame.shared == null) {
			SceneGame.shared = new SceneGame();
		}
		return SceneGame.shared;
	}

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'resource/eui_skins/SceneGameSkin.exml';
	}

	// 答案
	private group_answer: eui.Group;
	// 问题
	private group_words: eui.Group;
	private img_question: eui.Image;
	// 返回按钮
	private btn_back: eui.Button;
	// 设置按钮
	private btn_set: eui.Button;
	// 当前关卡
	private levelIndex: number;
	// 胜利界面
	private group_win: eui.Group;
	// 成语解释
	private explain_text: eui.Label;
	// 成语出处
	private source_text: eui.Label;
	// 下一题
	private btn_next: eui.Button;

	// 初始化关卡
	public InitLevel(level: number) {
		// 胜利界面不可见
		this.group_win.visible = false;
		this.levelIndex = level;
		// 当前关卡的数据
		var leveldata = LevelDataManager.Shared().GetLevel(level);
		console.log(leveldata);
		// 将字段拼起来
		var words: string = leveldata.answer + leveldata.word;
		// 随机一个其他题目的字段混合进本题目
		while (words.length == 10) {
			// 获取 0-399 之间的整数
			var i: number = Math.floor(Math.random() * 400);
			if (i != level) {
				var temp = LevelDataManager.Shared().GetLevel(i);
				words += temp.answer + temp.word;
			}
		}
		// words 字段重排
		var wordList: string[] = [];
		for (var i = 0; i < words.length; i++) {
			wordList.push(words.charAt(i));
		}
		wordList = this.randomlist(wordList);
		// 问题区赋值
		for (let i = 0; i < this.group_words.numChildren; i++) {
			let wordRect = <word>this.group_words.getChildAt(i);
			wordRect.setWordText(wordList[i]);
			wordRect.visible = true;
		}
		// 初始化答案区域的状态
		for (let i = 0; i < this.group_answer.numChildren; i++) {
			let answerRect = <AnswerWord>this.group_answer.getChildAt(i);
			answerRect.SetSelectWord(null);
			answerRect.visible = true;
			answerRect.SelectWord = null;
		}
		// 显示图片
		this.img_question.source = 'resource/assets/' + leveldata.img;
		// console.log(wordList);
	}

	protected createChildren() {
		super.createChildren();
	}

	private onComplete(): void {
		// 返回选择关卡页面
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBack, this);
		// 监听下一题
		this.btn_next.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnNext, this);
		// 监听设置按钮
		this.btn_set.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSet, this);
	}

	// 点击问题字, 将问题字添加到答案中
	public onTouchTap(word: word): void {
		// 第一个没有文本的答案块
		var sel: AnswerWord = null;
		for (let i = 0; i < this.group_answer.numChildren; i++) {
			let answer = <AnswerWord>this.group_answer.getChildAt(i);
			if (answer.SelectWord == null) {
				sel = answer;
				break;
			}
		}
		// 当有一个合适的位置的时候就会将字填充，并判断是否胜利
		if (sel != null) {
			sel.SetSelectWord(word);
			// 判断是否胜利
			var checkStr: string = '';
			for (let i = 0; i < this.group_answer.numChildren; i++) {
				let answer = <AnswerWord>this.group_answer.getChildAt(i);
				checkStr += answer.getWordText();
			}
			// 胜利
			if (checkStr == LevelDataManager.Shared().GetLevel(this.levelIndex).answer) {
				// 显示胜利界面
				this.showWin();
			}
		}
	}

	// 返回选关界面
	private onBtnBack(): void {
		this.parent.addChild(SceneLevels.Shared());
		this.parent.removeChild(this);
	}

	// 设置
	private onBtnSet(): void {
		this.parent.addChild(GameSetting.Shared());
	}

	// 下一题
	private onBtnNext(): void {
		this.group_win.visible = false;
		SceneLevels.Shared().OpenLevel(this.levelIndex + 1);
		this.InitLevel(this.levelIndex + 1);
	}

	// 显示胜利界面
	private showWin() {
		this.group_win.visible = true;
		var leveldata = LevelDataManager.Shared().GetLevel(this.levelIndex);
		this.explain_text.text = leveldata.tip;
		this.source_text.text = leveldata.content;
	}

	// 数组内容随机排序
	private randomlist(arr: any[]): any[] {
		var array: any[] = [];
		while (arr.length > 0) {
			var i = Math.floor(Math.random() * arr.length);
			array.push(arr[i]);
			arr.splice(i, 1);
		}
		return array;
	}
}