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
/*
 * 游戏界面
*/
var SceneGame = (function (_super) {
    __extends(SceneGame, _super);
    function SceneGame() {
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
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = 'resource/eui_skins/SceneGameSkin.exml';
        return _this;
    }
    SceneGame.Shared = function () {
        if (SceneGame.shared == null) {
            SceneGame.shared = new SceneGame();
        }
        return SceneGame.shared;
    };
    SceneGame.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    SceneGame.prototype.onComplete = function () {
        this.initGame();
    };
    // 初始化游戏界面
    SceneGame.prototype.initGame = function () {
        // 移除我的飞机
        if (this.myFighter.parent) {
            this.removeChild(this.myFighter);
        }
        // 创建可滚动的背景
        this.bg = new fighter.BgMap();
        this.group_bg.addChild(this.bg);
        // 滚动屏幕
        this.bg.start();
        // 创建我的飞机
        this.myFighter = new fighter.Airplane(RES.getRes('f1_png'), 100, this.myBlood);
        this.addChild(this.myFighter);
        this.myFighter.x = (this.width - this.myFighter.width) / 2;
        this.myFighter.y = this.height - this.myFighter.height - 50;
        // 初始化我的飞机的血量
        if (this.myFighter.blood <= 0) {
            this.myFighter.blood = this.myBlood;
        }
        // 创建我的飞机的血条
        this.myFighterBlood = new fighter.BloodStrip(300, 20, 10);
        this.myFighterBlood.x = 20;
        this.myFighterBlood.y = this.height - this.myFighterBlood.height - 10;
        this.addChild(this.myFighterBlood);
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
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.myFighterMove, this);
    };
    // 敌机
    SceneGame.prototype.createEnemyFighter = function () {
        var enemyFighter = fighter.Airplane.produce("f2_png", this.enemyCreateBulletTime, this.enemyBlood);
        enemyFighter.x = Math.random() * (this.width - enemyFighter.width);
        enemyFighter.y = -enemyFighter.height;
        // 敌机开火
        enemyFighter.fire();
        this.addChildAt(enemyFighter, this.numChildren - 1);
        this.enemyFighters.push(enemyFighter);
        // 创建敌人的子弹
        enemyFighter.addEventListener('createBullet', this.createBulletHandle, this);
    };
    // 创建子弹
    SceneGame.prototype.createBulletHandle = function (e) {
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
    SceneGame.prototype.enterFrameHandle = function (e) {
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
            if (enemyFighte.y >= this.height) {
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
            if (enemyBullet.y >= this.height) {
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
    SceneGame.prototype.myFighterMove = function (e) {
        this.myFighter.x = e.stageX - this.myFighter.width / 2;
    };
    // 碰撞检测
    SceneGame.prototype.gameHitTest = function () {
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
            // 游戏结束
            this.parent.addChild(GameStop.Shared());
            this.gameStop();
            // this.parent.removeChild(this);
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
    // 游戏结束或暂停
    SceneGame.prototype.gameStop = function () {
        // 暂停滚动背景
        this.bg.pause();
        // 移除所有事件
        this.myFighter.removeEventListener("createBullet", this.createBulletHandle, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandle, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.myFighterMove, this);
        this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
        this.enemyFightersTimer.stop();
        // 我的飞机停火
        this.myFighter.stopFire();
        // 敌机停火
        for (var i_1 = 0; i_1 < this.enemyFighters.length; i_1++) {
            var theFighter_1 = this.enemyFighters[i_1];
            theFighter_1.stopFire();
            theFighter_1.removeEventListener("createBullet", this.createBulletHandle, this);
        }
        // 如果我的飞机的血量为0，则游戏结束
        if (this.myFighter.blood <= 0) {
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
                this.removeChild(theFighter);
                fighter.Airplane.reclaim(theFighter, "f2_png");
            }
        }
    };
    return SceneGame;
}(eui.Component));
__reflect(SceneGame.prototype, "SceneGame");
//# sourceMappingURL=SceneGame.js.map