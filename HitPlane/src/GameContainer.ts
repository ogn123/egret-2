module fighter {
	/*
	 * 主游戏容器
	*/
	export class GameContainer extends egret.DisplayObjectContainer {
		public constructor() {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}

		// 初始化
		private onAddToStage() {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.createGameScene();
		}

		/*滚动背景*/
		private bg: fighter.BgMap;
		/*开始按钮*/
		private btnStart: egret.Bitmap;
		/*我的飞机*/
		private myFighter: fighter.Airplane;
		/*敌人的飞机*/
		private enemyFighters: fighter.Airplane[] = [];
		/*触发创建敌机的间隔*/
		private enemyFightersTimer: egret.Timer = new egret.Timer(1000);
		/*我的子弹*/
		private myBullets: fighter.Bullet[] = [];
		/*敌人的子弹*/
		private enemyBullets: fighter.Bullet[] = [];
		/**@private*/
		private _lastTime: number;

		// 创建游戏场景
		private createGameScene(): void {
			// 创建可滚动的背景
			this.bg = new fighter.BgMap();
			this.addChild(this.bg);
			// 创建开始按钮
			this.btnStart = new egret.Bitmap();
			this.btnStart.texture = RES.getRes('btn_start_png');
			this.addChild(this.btnStart);
			// 居中定位
			this.btnStart.x = this.stage.stageWidth / 2 - this.btnStart.width / 2;
			this.btnStart.y = this.stage.stageHeight / 2 - this.btnStart.height / 2;
			// 开启触摸
			this.btnStart.touchEnabled = true;
			// 创建我的飞机
			this.myFighter = new fighter.Airplane(RES.getRes('f1_png'), 100);
			this.addChild(this.myFighter);
			// console.log(this.myFighter);
			this.myFighter.x = (this.stage.stageWidth - this.myFighter.width) / 2;
			this.myFighter.y = this.stage.stageHeight - this.myFighter.height - 50;
			// 点击按钮开始游戏
			this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
		}

		// 开始游戏
		private gameStart(): void {
			// 滚动屏幕
			this.bg.start();
			// 移除按钮
			this.removeChild(this.btnStart);
			// 我的飞机开火
			this.myFighter.fire();
			// 创建敌机
			this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
			this.enemyFightersTimer.start();
			// 监听 createBullet 事件来创建子弹
			this.myFighter.addEventListener("createBullet", this.createBulletHandler, this);

			this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
		}

		// 敌机
		private createEnemyFighter(): void {
			var enemyFighter: fighter.Airplane = fighter.Airplane.produce("f2_png", 1000);
			enemyFighter.x = Math.random() * (this.stage.stageWidth - enemyFighter.width);
			enemyFighter.y = (enemyFighter.height + Math.random() * 300);
			enemyFighter.fire();
			this.addChildAt(enemyFighter, this.numChildren - 1);
			this.enemyFighters.push(enemyFighter);
			// 监听 createBullet 事件来创建子弹
			enemyFighter.addEventListener("createBullet", this.createBulletHandler, this);
		}

		/*创建子弹(包括我的子弹和敌机的子弹)*/
		private createBulletHandler(evt: egret.Event): void {
			var bullet: fighter.Bullet;
			if (evt.target == this.myFighter) {
				for (var i: number = 0; i < 2; i++) {
					bullet = fighter.Bullet.produce("b1_png");
					bullet.x = i == 0 ? (this.myFighter.x + 10) : (this.myFighter.x + this.myFighter.width - 22);
					bullet.y = this.myFighter.y + 30;
					this.addChildAt(bullet, this.numChildren - 1 - this.enemyFighters.length);
					this.myBullets.push(bullet);
				}
			} else {
				var theFighter: fighter.Airplane = evt.target;
				bullet = fighter.Bullet.produce("b2_png");
				bullet.x = theFighter.x + 28;
				bullet.y = theFighter.y + 10;
				this.addChildAt(bullet, this.numChildren - 1 - this.enemyFighters.length);
				this.enemyBullets.push(bullet);
			}
		}

		/**游戏画面更新*/
		private gameViewUpdate(evt: egret.Event): void {
			//为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
			var nowTime: number = egret.getTimer();
			var fps: number = 1000 / (nowTime - this._lastTime);
			this._lastTime = nowTime;
			var speedOffset: number = 60 / fps;
			// 我的飞机运动
			this.touchEnabled = true;
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
			//我的子弹运动
			var i: number = 0;
			var bullet: fighter.Bullet;
			var myBulletsCount: number = this.myBullets.length;
			var delArr: any[] = [];
			for (; i < myBulletsCount; i++) {
				bullet = this.myBullets[i];
				bullet.y -= 12 * speedOffset;
				if (bullet.y < -bullet.height)
					delArr.push(bullet);
			}
			for (i = 0; i < delArr.length; i++) {//回收不显示的子弹
				bullet = delArr[i];
				this.removeChild(bullet);
				fighter.Bullet.reclaim(bullet, "b1_png");
				this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
			}
			delArr = [];
			//敌人飞机运动
			var theFighter: fighter.Airplane;
			var enemyFighterCount: number = this.enemyFighters.length;
			for (i = 0; i < enemyFighterCount; i++) {
				theFighter = this.enemyFighters[i];
				theFighter.y += 4 * speedOffset;
				if (theFighter.y > this.stage.stageHeight)
					delArr.push(theFighter);
			}
			for (i = 0; i < delArr.length; i++) {//回收不显示的飞机
				theFighter = delArr[i];
				this.removeChild(theFighter);
				fighter.Airplane.reclaim(theFighter, "f2_png");
				theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
				theFighter.stopFire();
				this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter), 1);
			}
			delArr = [];
			//敌人子弹运动
			var enemyBulletsCount: number = this.enemyBullets.length;
			for (i = 0; i < enemyBulletsCount; i++) {
				bullet = this.enemyBullets[i];
				bullet.y += 8 * speedOffset;
				if (bullet.y > this.stage.stageHeight)
					delArr.push(bullet);
			}
			for (i = 0; i < delArr.length; i++) {//回收不显示的子弹
				bullet = delArr[i];
				this.removeChild(bullet);
				fighter.Bullet.reclaim(bullet, "b2_png");
				this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
			}
		}
		/**响应Touch*/
		private touchHandler(evt: egret.TouchEvent): void {
			if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
				var tx: number = evt.localX;
				tx = Math.max(0, tx);
				tx = Math.min(this.stage.stageWidth - this.myFighter.width, tx);
				this.myFighter.x = tx;
			}
		}
	}
}