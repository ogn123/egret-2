module fighter {
	/*
	 * 飞机，利用对象池
	*/
	export class Airplane extends egret.DisplayObjectContainer {

		private static cacheDict: Object = {};
		/*生产*/
		public static produce(textureName: string, fireDelay: number, blood: number): fighter.Airplane {
			if (fighter.Airplane.cacheDict[textureName] == null)
				fighter.Airplane.cacheDict[textureName] = [];
			var dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
			var theFighter: fighter.Airplane;
			if (dict.length > 0) {
				theFighter = dict.pop();
			} else {
				theFighter = new fighter.Airplane(RES.getRes(textureName), fireDelay, blood);
			}
			theFighter.blood = blood;
			return theFighter;
		}
		/*回收*/
		public static reclaim(theFighter: fighter.Airplane, textureName: string): void {
			if (fighter.Airplane.cacheDict[textureName] == null)
				fighter.Airplane.cacheDict[textureName] = [];
			var dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
			if (dict.indexOf(theFighter) == -1)
				dict.push(theFighter);
		}

		// 飞机位图
		private bmp: egret.Bitmap;
		// 创建子弹的时间间隔
		private fireDelay: number;
		// 定时发射子弹的定时器
		private fireTimer: egret.Timer;
		// 飞机血量
		public blood: number;

		public constructor(texture: egret.Texture, fireDelay: number, blood: number) {
			super();
			this.fireDelay = fireDelay;
			this.blood = blood;
			this.bmp = new egret.Bitmap(texture);
			this.addChild(this.bmp);
			this.bmp.pixelHitTest = true;
			this.fireTimer = new egret.Timer(this.fireDelay);
			this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
		}

		// 创建子弹
		private createBullet(): void {
			// 给外面的容器派发创建子弹的事件
			this.dispatchEventWith('createBullet');
		}

		/*开火*/
		public fire(): void {
			this.createBullet();
			this.fireTimer.start();
		}

		/*停火*/
		public stopFire(): void {
			this.fireTimer.stop();
		}
	}
}