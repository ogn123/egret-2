// 每个问题（关卡）的数据结构
class LevelDataItem {
	public answer: string;
	public img: string;
	public word: string;
	public tip: string;
	public content: string;
}

// 关卡数据管理器
class LevelDataManager {
	// 单例
	private static shared: LevelDataManager;
	public static Shared() {
		if (LevelDataManager.shared == null) {
			LevelDataManager.shared = new LevelDataManager();
		}
		return LevelDataManager.shared;
	}

	// 所有关卡的数据
	private items: LevelDataItem[] = [];

	public constructor() {
		// 读取 json 数据
		this.items = RES.getRes('questions_json');
	}

	// 通过关卡号获得一个关的数据
	public GetLevel(level: number) {
		if (level < 0) {
			level = 0;
		}
		if (level >= this.items.length) {
			level = this.items.length - 1;
		}
		return this.items[level];
	}

	// 获得当前游戏的最远进度
	public get Milestone(): number {
		var milestone  = egret.localStorage.getItem('CYDTZ_Milestone');
		// 没有数据，默认第一关
		if (milestone == '' || milestone == null) {
			milestone = '1';
		}
		return parseInt(milestone);
	}

	// 设置当前游戏的最远进度
	public set Milestone(value: number) {
		egret.localStorage.setItem('CYDTZ_Milestone', value.toString());
	}
}
