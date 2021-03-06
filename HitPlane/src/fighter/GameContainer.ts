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
		/*再来一次*/
		private again: egret.Bitmap;
		/*我的飞机*/
		private myFighter: fighter.Airplane;
		/*我的子弹*/
		private myBullets: fighter.Bullet[] = [];
		/*我的子弹的攻击力*/
		private myBulletAgg: number = 2;
		/*我的血量*/
		private myBlood: number = 10;
		/*我的飞机的血条*/
		private myFighterBlood: fighter.BloodStrip;
		/*敌人的飞机*/
		private enemyFighters: fighter.Airplane[] = [];
		/*敌人的飞机的血量*/
		private enemyBlood: number = 10;
		/*敌人的子弹*/
		private enemyBullets: fighter.Bullet[] = [];
		/*敌人子弹的攻击力*/
		private enemyBulletAgg: number = 1;
		/*敌人发射子弹的速度*/
		private enemyCreateBulletTime: number = 2000;
		/*创建敌机的速度*/
		private enemyFightersTimer: egret.Timer = new egret.Timer(1500);
		// 控制子弹在我的飞机的左侧还是右侧
		private isLOrR: boolean = true;
		/*速度基数*/
		private speed: number = 1;
		/*last-time*/
		private lastTime: number = egret.getTimer();
		/*我的分数*/
		private myScore: number;
		/*显示分数*/
		private showScore: fighter.ScorePanel;

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
			this.myFighter = new fighter.Airplane(RES.getRes('f1_png'), 100, this.myBlood);
			this.addChild(this.myFighter);
			this.myFighter.x = (this.stage.stageWidth - this.myFighter.width) / 2;
			this.myFighter.y = this.stage.stageHeight - this.myFighter.height - 50;
			// 创建我的飞机的血条
			this.myFighterBlood = new fighter.BloodStrip(300, 20, 10);
			this.myFighterBlood.x = 20;
			this.myFighterBlood.y = this.stage.stageHeight - this.myFighterBlood.height - 10;
			this.addChild(this.myFighterBlood);
			// 点击按钮开始游戏
			this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
		}

		// 开始游戏
		private gameStart(): void {
			// 清除分数显示
			if (this.contains(this.showScore)) {
				this.removeChild(this.showScore);
			}
			// 初始化分数
			this.myScore = 0;
			// 移除再来一次按钮
			if (this.contains(this.again)) {
				this.removeChild(this.again);
				// 移除重新开始事件
				this.again.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
			}
			// 滚动屏幕
			this.bg.start();
			// 移除开始按钮
			if (this.contains(this.btnStart)) {
				this.removeChild(this.btnStart);
				this.btnStart.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
			}
			// 初始化我的飞机
			if (this.myFighter.blood <= 0) {
				this.myFighter.blood = this.myBlood;
			}
			this.myFighter.x = (this.stage.stageWidth - this.myFighter.width) / 2;
			this.myFighter.y = this.stage.stageHeight - this.myFighter.height - 50;
			// 初始化血条
			this.myFighterBlood.reduceBlood(this.myFighter.blood);
			// 我的飞机开火
			this.myFighter.fire();
			// 创建我的子弹
			this.myFighter.addEventListener('createBullet', this.createBulletHandle, this);
			// 创建敌机
			this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
			this.enemyFightersTimer.start();
			// 让飞机和子弹运动起来
			this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandle, this);
			// 我的飞机动
			this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.myFighterMove, this);
		}

		// 敌机
		private createEnemyFighter(): void {
			var enemyFighter: fighter.Airplane = fighter.Airplane.produce("f2_png", this.enemyCreateBulletTime, this.enemyBlood);
			enemyFighter.x = Math.random() * (this.stage.stageWidth - enemyFighter.width);
			enemyFighter.y = -enemyFighter.height;
			// 敌机开火
			enemyFighter.fire();
			this.addChildAt(enemyFighter, this.numChildren - 1);
			this.enemyFighters.push(enemyFighter);
			// 创建敌人的子弹
			enemyFighter.addEventListener('createBullet', this.createBulletHandle, this);
		}

		// 创建子弹
		private createBulletHandle(e: egret.Event): void {
			var target: fighter.Airplane = e.target;
			var bullet: fighter.Bullet;
			// 我的子弹
			if (target == this.myFighter) {
				bullet = fighter.Bullet.produce('b1_png', this.myBulletAgg);
				bullet.x = this.isLOrR ? this.myFighter.x + (this.myFighter.width / 2 - bullet.width) / 2 : this.myFighter.x + (this.myFighter.width / 2 - bullet.width) / 2 + this.myFighter.width / 2;
				bullet.y = this.myFighter.y + (this.myFighter.height - bullet.height) / 2;
				this.isLOrR = !this.isLOrR;
				this.myBullets.push(bullet);
				this.addChildAt(bullet, this.numChildren - 1 - this.enemyBullets.length - 1);
			} else {
				// 创建敌人的子弹
				bullet = fighter.Bullet.produce('b2_png', this.myBulletAgg);
				bullet.x = target.x + (target.width - bullet.width) / 2;
				bullet.y = target.y + (target.height - bullet.height) / 2;
				this.enemyBullets.push(bullet);
				this.addChildAt(bullet, this.numChildren - 1 - this.enemyBullets.length - 1);
			}
		}

		// 让飞机和子弹运动起来
		private enterFrameHandle(e: egret.Event): void {
			// 为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
			var nowTime: number = egret.getTimer();
			var fps: number = 1000 / (nowTime - this.lastTime);
			this.speed = 60 / fps;
			this.lastTime = nowTime;
			// 我的子弹动
			for (let i: number = 0; i < this.myBullets.length; i++) {
				let myBullet: fighter.Bullet = this.myBullets[i];
				myBullet.y -= 6 * this.speed;
				// 回收超出屏幕的子弹
				if (myBullet.y <= 0) {
					fighter.Bullet.reclaim(myBullet, 'b1_png');
					this.removeChild(myBullet);
					this.myBullets.splice(i, 1);
					i--;
				}
			}
			// 敌人的飞机动
			for (let i: number = 0; i < this.enemyFighters.length; i++) {
				let enemyFighte: fighter.Airplane = this.enemyFighters[i];
				enemyFighte.y += 2 * this.speed;
				if (enemyFighte.y >= this.stage.stageHeight) {
					fighter.Airplane.reclaim(enemyFighte, 'f2_png');
					this.removeChild(enemyFighte);
					this.enemyFighters.splice(i, 1);
					i--;
				}
			}
			// 敌人的子弹动
			for (let i: number = 0; i < this.enemyBullets.length; i++) {
				let enemyBullet: fighter.Bullet = this.enemyBullets[i];
				enemyBullet.y += 4 * this.speed;
				// 回收超出屏幕的子弹
				if (enemyBullet.y >= this.stage.stageHeight) {
					fighter.Bullet.reclaim(enemyBullet, 'b2_png');
					this.removeChild(enemyBullet);
					this.enemyBullets.splice(i, 1);
					i--;
				}
			}

			// 碰撞检测
			this.gameHitTest();
		}

		// 我的飞机动
		private myFighterMove(e: egret.TouchEvent): void {
			this.myFighter.x = e.stageX - this.myFighter.width / 2;
		}

		// 碰撞检测
		private gameHitTest(): void {
			// 需要消失的子弹
			var delButtles: fighter.Bullet[] = [];
			// 需要消失的飞机
			var delFighters: fighter.Airplane[] = [];
			// 我的子弹和敌机碰撞，子弹消失，敌机掉血
			for (let i = 0; i < this.myBullets.length; i++) {
				let myBullet: fighter.Bullet = this.myBullets[i];
				for (let j = 0; j < this.enemyFighters.length; j++) {
					let enemyFighte: fighter.Airplane = this.enemyFighters[j];
					// 判断子弹与敌机是否碰撞
					if (fighter.GameUtil.hitText(myBullet, enemyFighte)) {
						// 我的子弹每次碰到敌机，敌机掉血
						enemyFighte.blood -= this.myBulletAgg;
						if (delButtles.indexOf(myBullet) == -1) {
							delButtles.push(myBullet);
						}
						if (enemyFighte.blood <= 0 && delFighters.indexOf(enemyFighte) == -1) {
							delFighters.push(enemyFighte);
							// 分数加一
							this.myScore++;
						}
					}
				}
			}
			// 敌人的子弹和我的飞机碰撞，敌人的子弹消失，我的飞机掉血
			for (let i = 0; i < this.enemyBullets.length; i++) {
				let enemyBullet: fighter.Bullet = this.enemyBullets[i];
				let myFighter: fighter.Airplane = this.myFighter;
				if (fighter.GameUtil.hitText(enemyBullet, myFighter)) {
					myFighter.blood -= this.enemyBulletAgg;
					this.myFighterBlood.reduceBlood(myFighter.blood);
					if (delButtles.indexOf(enemyBullet) == -1) {
						delButtles.push(enemyBullet);
					}
				}
			}
			// 我的飞机和敌机碰撞，我的飞机血量清空
			for (let i = 0; i < this.enemyFighters.length; i++) {
				let enemyFighte: fighter.Airplane = this.enemyFighters[i];
				if (fighter.GameUtil.hitText(enemyFighte, this.myFighter)) {
					this.myFighter.blood = 0;
					this.myFighterBlood.reduceBlood(this.myFighter.blood);
				}
			}

			if (this.myFighter.blood <= 0) {
				this.gameStop();
			} else {
				// 将需要消失的子弹和飞机回收
				while (delButtles.length > 0) {
					let bullet: fighter.Bullet = delButtles.pop();
					this.removeChild(bullet);
					fighter.Bullet.reclaim(bullet, bullet.textureName);
					if (bullet.textureName == 'b1_png') {
						this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
					} else {
						this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
					}
				}
				while (delFighters.length > 0) {
					let fight: fighter.Airplane = delFighters.pop();
					this.removeChild(fight);
					fight.stopFire();
					fight.removeEventListener('createBullet', this.createBulletHandle, this);
					fighter.Airplane.reclaim(fight, 'f2_png');
					this.enemyFighters.splice(this.enemyFighters.indexOf(fight), 1);
				}
			}
		}

		// 游戏结束
		private gameStop(): void {
			// 暂停滚动背景
			this.bg.pause();
			// 移除所有事件
			this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandle, this);
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.myFighterMove, this);
			this.myFighter.removeEventListener("createBullet", this.createBulletHandle, this);
			this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
			this.enemyFightersTimer.stop();
			// 我的飞机停火
			this.myFighter.stopFire();
			// 清理子弹
			var i: number = 0;
			var bullet: fighter.Bullet;
			while (this.myBullets.length > 0) {
				bullet = this.myBullets.pop();
				this.removeChild(bullet);
				fighter.Bullet.reclaim(bullet, "b1_png");
			}
			while (this.enemyBullets.length > 0) {
				bullet = this.enemyBullets.pop();
				this.removeChild(bullet);
				fighter.Bullet.reclaim(bullet, "b2_png");
			}
			//清理飞机
			var theFighter: fighter.Airplane;
			while (this.enemyFighters.length > 0) {
				theFighter = this.enemyFighters.pop();
				theFighter.stopFire();
				theFighter.removeEventListener("createBullet", this.createBulletHandle, this);
				this.removeChild(theFighter);
				fighter.Airplane.reclaim(theFighter, "f2_png");
			}
			// 显示分数
			this.showScore = new fighter.ScorePanel();
			this.addChild(this.showScore);
			this.showScore.x = (this.stage.stageWidth - this.showScore.width) / 2;
			this.showScore.y = 150;
			this.showScore.showType(this.myScore);
			// 创建再来一次按钮
			this.again = new egret.Bitmap();
			this.again.texture = RES.getRes('again_png');
			this.addChild(this.again);
			// 居中定位
			this.again.x = this.stage.stageWidth / 2 - this.again.width / 2;
			this.again.y = this.stage.stageHeight / 2 - this.again.height / 2;
			// 开启触摸
			this.again.touchEnabled = true;
			// 点击再来一次重新开始游戏
			this.again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
		}
	}
}
