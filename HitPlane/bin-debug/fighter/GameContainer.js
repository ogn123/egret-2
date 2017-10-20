var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fighter;
(function (fighter) {
    /*
     * 主游戏容器
    */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this) || this;
            /*我的子弹*/
            _this.myBullets = [];
            /*我的子弹的攻击力*/
            _this.myBulletAgg = 2;
            /*我的血量*/
            _this.myBlood = 10;
            /*敌人的飞机*/
            _this.enemyFighters = [];
            /*敌人的飞机的血量*/
            _this.enemyBlood = 10;
            /*敌人的子弹*/
            _this.enemyBullets = [];
            /*敌人子弹的攻击力*/
            _this.enemyBulletAgg = 1;
            /*敌人发射子弹的速度*/
            _this.enemyCreateBulletTime = 2000;
            /*创建敌机的速度*/
            _this.enemyFightersTimer = new egret.Timer(1500);
            // 控制子弹在我的飞机的左侧还是右侧
            _this.isLOrR = true;
            /*速度基数*/
            _this.speed = 1;
            /*last-time*/
            _this.lastTime = egret.getTimer();
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        // 初始化
        GameContainer.prototype.onAddToStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        };
        // 创建游戏场景
        GameContainer.prototype.createGameScene = function () {
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
        };
        // 开始游戏
        GameContainer.prototype.gameStart = function () {
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
        };
        // 敌机
        GameContainer.prototype.createEnemyFighter = function () {
            var enemyFighter = fighter.Airplane.produce("f2_png", this.enemyCreateBulletTime, this.enemyBlood);
            enemyFighter.x = Math.random() * (this.stage.stageWidth - enemyFighter.width);
            enemyFighter.y = -enemyFighter.height;
            // 敌机开火
            enemyFighter.fire();
            this.addChildAt(enemyFighter, this.numChildren - 1);
            this.enemyFighters.push(enemyFighter);
            // 创建敌人的子弹
            enemyFighter.addEventListener('createBullet', this.createBulletHandle, this);
        };
        // 创建子弹
        GameContainer.prototype.createBulletHandle = function (e) {
            var target = e.target;
            var bullet;
            // 我的子弹
            if (target == this.myFighter) {
                bullet = fighter.Bullet.produce('b1_png', this.myBulletAgg);
                bullet.x = this.isLOrR ? this.myFighter.x + (this.myFighter.width / 2 - bullet.width) / 2 : this.myFighter.x + (this.myFighter.width / 2 - bullet.width) / 2 + this.myFighter.width / 2;
                bullet.y = this.myFighter.y + (this.myFighter.height - bullet.height) / 2;
                this.isLOrR = !this.isLOrR;
                this.myBullets.push(bullet);
                this.addChildAt(bullet, this.numChildren - 1 - this.enemyBullets.length - 1);
            }
            else {
                // 创建敌人的子弹
                bullet = fighter.Bullet.produce('b2_png', this.myBulletAgg);
                bullet.x = target.x + (target.width - bullet.width) / 2;
                bullet.y = target.y + (target.height - bullet.height) / 2;
                this.enemyBullets.push(bullet);
                this.addChildAt(bullet, this.numChildren - 1 - this.enemyBullets.length - 1);
            }
        };
        // 让飞机和子弹运动起来
        GameContainer.prototype.enterFrameHandle = function (e) {
            // 为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this.lastTime);
            this.speed = 60 / fps;
            this.lastTime = nowTime;
            // 我的子弹动
            for (var i = 0; i < this.myBullets.length; i++) {
                var myBullet = this.myBullets[i];
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
            for (var i = 0; i < this.enemyFighters.length; i++) {
                var enemyFighte = this.enemyFighters[i];
                enemyFighte.y += 2 * this.speed;
                if (enemyFighte.y >= this.stage.stageHeight) {
                    fighter.Airplane.reclaim(enemyFighte, 'f2_png');
                    this.removeChild(enemyFighte);
                    this.enemyFighters.splice(i, 1);
                    i--;
                }
            }
            // 敌人的子弹动
            for (var i = 0; i < this.enemyBullets.length; i++) {
                var enemyBullet = this.enemyBullets[i];
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
        };
        // 我的飞机动
        GameContainer.prototype.myFighterMove = function (e) {
            this.myFighter.x = e.stageX - this.myFighter.width / 2;
        };
        // 碰撞检测
        GameContainer.prototype.gameHitTest = function () {
            // 需要消失的子弹
            var delButtles = [];
            // 需要消失的飞机
            var delFighters = [];
            // 我的子弹和敌机碰撞，子弹消失，敌机掉血
            for (var i = 0; i < this.myBullets.length; i++) {
                var myBullet = this.myBullets[i];
                for (var j = 0; j < this.enemyFighters.length; j++) {
                    var enemyFighte = this.enemyFighters[j];
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
            for (var i = 0; i < this.enemyBullets.length; i++) {
                var enemyBullet = this.enemyBullets[i];
                var myFighter = this.myFighter;
                if (fighter.GameUtil.hitText(enemyBullet, myFighter)) {
                    myFighter.blood -= this.enemyBulletAgg;
                    this.myFighterBlood.reduceBlood(myFighter.blood);
                    if (delButtles.indexOf(enemyBullet) == -1) {
                        delButtles.push(enemyBullet);
                    }
                }
            }
            // 我的飞机和敌机碰撞，我的飞机血量清空
            for (var i = 0; i < this.enemyFighters.length; i++) {
                var enemyFighte = this.enemyFighters[i];
                if (fighter.GameUtil.hitText(enemyFighte, this.myFighter)) {
                    this.myFighter.blood = 0;
                    this.myFighterBlood.reduceBlood(this.myFighter.blood);
                }
            }
            if (this.myFighter.blood <= 0) {
                this.gameStop();
            }
            else {
                // 将需要消失的子弹和飞机回收
                while (delButtles.length > 0) {
                    var bullet = delButtles.pop();
                    this.removeChild(bullet);
                    fighter.Bullet.reclaim(bullet, bullet.textureName);
                    if (bullet.textureName == 'b1_png') {
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                    }
                    else {
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
                    }
                }
                while (delFighters.length > 0) {
                    var fight = delFighters.pop();
                    this.removeChild(fight);
                    fight.stopFire();
                    fight.removeEventListener('createBullet', this.createBulletHandle, this);
                    fighter.Airplane.reclaim(fight, 'f2_png');
                    this.enemyFighters.splice(this.enemyFighters.indexOf(fight), 1);
                }
            }
        };
        // 游戏结束
        GameContainer.prototype.gameStop = function () {
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
            var i = 0;
            var bullet;
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
            var theFighter;
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
        };
        return GameContainer;
    }(egret.DisplayObjectContainer));
    fighter.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "fighter.GameContainer");
})(fighter || (fighter = {}));
//# sourceMappingURL=GameContainer.js.map