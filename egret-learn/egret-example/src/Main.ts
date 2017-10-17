//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
	/**
	 * 加载进度界面
	 * Process interface loading
	 */
	private loadingView: LoadingUI;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event: egret.Event) {

		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin

			context.onUpdate = () => {
				// console.log('hello,world')
			}
		})

		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
		}

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
		}


		//设置加载进度界面
		//Config to load process interface
		this.loadingView = new LoadingUI();
		this.stage.addChild(this.loadingView);

		//初始化Resource资源加载库
		//initiate Resource loading library
		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.loadConfig("resource/default.res.json", "resource/");
	}

	/**
	 * 配置文件加载完成,开始预加载preload资源组。
	 * configuration file loading is completed, start to pre-load the preload resource group
	 */
	private onConfigComplete(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		RES.loadGroup("preload");
	}

	/**
	 * preload资源组加载完成
	 * Preload resource group is loaded
	 */
	private onResourceLoadComplete(event: RES.ResourceEvent) {
		if (event.groupName == "preload") {
			this.stage.removeChild(this.loadingView);
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
			this.createGameScene();
		}
	}

	/**
	 * 资源组加载出错
	 *  The resource group loading failed
	 */
	private onItemLoadError(event: RES.ResourceEvent) {
		console.warn("Url:" + event.resItem.url + " has failed to load");
	}

	/**
	 * 资源组加载出错
	 *  The resource group loading failed
	 */
	private onResourceLoadError(event: RES.ResourceEvent) {
		//TODO
		console.warn("Group:" + event.groupName + " has failed to load");
		//忽略加载失败的项目
		//Ignore the loading failed projects
		this.onResourceLoadComplete(event);
	}

	/**
	 * preload资源组加载进度
	 * Loading process of preload resource group
	 */
	private onResourceProgress(event: RES.ResourceEvent) {
		if (event.groupName == "preload") {
			this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
		}
	}

	/**
	 * 创建游戏场景
	 * Create a game scene
	 */
	private createGameScene() {
		// 添加白色背景
		var bg: egret.Shape = new egret.Shape();
		bg.graphics.beginFill(0xffffff);
		bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		bg.graphics.endFill();
		this.addChild(bg);

		var _TextureSet: TextureSet = new TextureSet();
		this.addChild(_TextureSet);
	}
}

// 简单帧动画
class startTickerTest extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onLoad, this);
	}

	private star: egret.Bitmap;
	// 设置动画的移动速度
	private speed: number = 0.05;
	private timeOnEnterFrame: number = 0;

	private onLoad(e: egret.Event) {
		var star: egret.Bitmap = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
		this.addChild(star);
		this.star = star;
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		this.timeOnEnterFrame = egret.getTimer();
	}

	private onEnterFrame(e: egret.Event) {
		var now = egret.getTimer();
		var time = this.timeOnEnterFrame;
		var pass = now - time;
		this.star.x += this.speed * pass;
		console.log(now + ' ', time + ' ', pass + ' ');
		this.timeOnEnterFrame = egret.getTimer();
		if (this.star.x > 300) {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		}
	}
}

// 1、显示对象基本
// 锚点及旋转缩放
class AnchorAndRotZoom extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStart, this);
	}

	// 旋转步长
	private STEP_ROT: number = 3;
	// 缩放步长
	private STEP_SCALE: number = .03;

	private _brid: egret.Bitmap;
	private _tx: egret.TextField;

	private onAddToStart(e: egret.Event) {
		// 显示图片
		this._brid = new egret.Bitmap();
		this._brid.texture = RES.getRes('cartoon-egret_00_png');
		this.addChild(this._brid);
		this._brid.anchorOffsetX = this._brid.width / 2;
		this._brid.anchorOffsetY = this._brid.height / 2;
		this._brid.x = this.stage.stageWidth / 2;
		this._brid.y = this.stage.stageHeight / 2;

		// 显示提示文字
		this._tx = new egret.TextField();
		this.addChild(this._tx);
		this._tx.x = 50;
		this._tx.y = 50;
		this._tx.textColor = 0x000000;

		// 动画
		this.launchAnimations();
	}

	// 用于记录当前的模式
	private _iAnimMode: number;
	private _nScaleBase: number;
	// 所有模式
	private models: Array<string>;

	private launchAnimations(): void {
		this._iAnimMode = AnimModes.ANIM_ROT;
		this.models = ['缩放', '静止', '旋转'];
		this._nScaleBase = 0;

		// 轻触屏幕改变模式
		// this.stage.touchEnabled = true;
		this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this._iAnimMode = (this._iAnimMode + 1) % 3;
		}, this);

		// 帧动画
		this.addEventListener(egret.Event.ENTER_FRAME, () => {
			if (this._iAnimMode === AnimModes.ANIM_ROT) {
				this._brid.rotation += this.STEP_ROT;
			} else if (this._iAnimMode === AnimModes.ANIM_SCALE) {
				this._brid.scaleX = this._brid.scaleY = 0.5 + 0.5 * Math.abs(Math.sin(this._nScaleBase += this.STEP_SCALE));
			}
			this._tx.text = '旋转角度' + this._brid.rotation + '\n缩放比例' + this._brid.scaleX.toFixed(2) + '\n\n轻触进入' + this.models[this._iAnimMode] + '模式';
			// 表示执行结束是否立即重绘
			return true;
		}, this);
	}
}
// 每个动画状态对应的索引
class AnimModes {
	public static ANIM_ROT: number = 0;
	public static ANIM_SCALE: number = 1;
}

// 碰撞检测
class colliDetect extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private _brid: egret.Bitmap;
	private _tx: egret.TextField;
	private _dot: egret.Shape;
	// 控制检测模式的显示
	private _bShapeText: boolean;

	private onAddToStage() {
		// 显示图片
		this._brid = new egret.Bitmap();
		this._brid.texture = RES.getRes('cartoon-egret_00_png');
		this.addChild(this._brid);
		this._brid.anchorOffsetX = this._brid.width / 2;
		this._brid.anchorOffsetY = this._brid.height / 2;
		this._brid.x = this.stage.stageWidth / 2;
		this._brid.y = this.stage.stageHeight / 2;

		// 小圆点，用以提示用户按下位置
		this._dot = new egret.Shape;
		this._dot.graphics.beginFill(0x00ff00);
		this._dot.graphics.drawCircle(0, 0, 5);
		this._dot.graphics.endFill();
		this.addChild(this._dot);
		this._dot.anchorOffsetX = this._dot.width / 2;
		this._dot.anchorOffsetY = this._dot.height / 2;

		// 显示提示文字
		this._tx = new egret.TextField();
		this.addChild(this._tx);
		this._tx.x = 50;
		this._tx.y = 50;
		this._tx.textColor = 0x000000;

		// 触摸文本区域切换碰撞模式
		this._tx.touchEnabled = true;
		this._tx.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
			evt.stopImmediatePropagation();
			this._bShapeText = !this._bShapeText;
			this.updateInfo(TouchCollideStatus.NO_TOUCHED);
		}, this);

		this.launchCollisionTest();
	}

	private launchCollisionTest() {
		this._bShapeText = true;
		this.updateInfo(TouchCollideStatus.NO_TOUCHED);

		// 手指触摸屏幕
		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
	}

	private touchHandler(evt: egret.TouchEvent) {
		console.log(evt.type);
		switch (evt.type) {
			case 'touchBegin':
				if (!this._tx.hitTestPoint(evt.stageX, evt.stageY, false)) {
					this.addChild(this._dot);
					this.checkCollision(evt.stageX, evt.stageY);
					this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
					this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
				}
				break;
			case 'touchEnd':
				if (this._dot.parent) {
					this._dot.parent.removeChild(this._dot);
				}
				this.updateInfo(TouchCollideStatus.NO_TOUCHED);
				this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
				break;
			case 'touchMove':
				this.addChild(this._dot);
				this.checkCollision(evt.stageX, evt.stageY);
				// this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
				break;
		}
	}

	// 碰撞检测
	private checkCollision(stageX: number, stageY: number): void {
		var bResult: boolean = this._brid.hitTestPoint(stageX, stageY, this._bShapeText);
		/// 小圆点同步手指位置
		this._dot.x = stageX;
		this._dot.y = stageY;

		/// 文字信息更新
		this.updateInfo(bResult ? TouchCollideStatus.COLLIDED : TouchCollideStatus.TOUCHED_NO_COLLIDED);
	}

	// 更新提示文字的内容
	private updateInfo(iStatus: number): void {
		this._tx.text = '碰撞检测结果: ' + ['放上手指!', '想摸我?', '别摸我!!!'][iStatus] + '\n\n碰撞检测模式: ' + (this._bShapeText ? '精确碰撞检测' : '非精确碰撞检测') + '\n(轻触文字区切换)';
	}
}
// 碰撞结果
class TouchCollideStatus {
	public static NO_TOUCHED: number = 0;
	public static TOUCHED_NO_COLLIDED: number = 1;
	public static COLLIDED: number = 2;
}

// 遮罩的用法
class MaskUsage extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private _bird: egret.Bitmap;
	private _shp: egret.Shape;

	private onAddToStage() {
		// 显示文字
		var tx: egret.TextField = new egret.TextField();
		tx.text = '接触屏幕后白鹭小鸟将变为椭圆形状的遮罩区域，可以移动手指（白鹭小鸟）并观察椭圆在遮罩下的显示变化';
		tx.x = 50;
		tx.y = 50;
		tx.width = this.stage.stageWidth - 100;
		tx.lineSpacing = 6;
		tx.textColor = 0x000000;
		this.addChild(tx);
		// 遮罩的图形
		this._shp = new egret.Shape();
		this._shp.graphics.beginFill(this.getRdmClr());
		this._shp.graphics.drawEllipse(0, 0, 200, 300);
		this._shp.graphics.endFill();
		this._shp.x = (this.stage.stageWidth - 200) / 2;
		this._shp.y = (this.stage.stageHeight - 300) / 2;
		this.addChild(this._shp);
		// 显示图片
		this._bird = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
		this._bird.anchorOffsetX = this._bird.width / 2;
		this._bird.anchorOffsetY = this._bird.height / 2;
		this._bird.x = this.stage.stageWidth / 2;
		this._bird.y = this.stage.stageHeight / 2;
		this.addChild(this._bird);

		this.lanuchMask();
	}

	private lanuchMask() {
		// 监听手指触摸事件
		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandle, this);
	}

	private touchHandle(e: egret.TouchEvent) {
		switch (e.type) {
			case 'touchBegin':
				this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandle, this);
				this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandle, this);
				// 遮罩
				this._shp.mask = this._bird;
				this.updateBird(e.stageX, e.stageY);
				break;
			case 'touchEnd':
				this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandle, this);
				this._shp.mask = null;
				// this._bird.$maskedObject = null;
				break;
			case 'touchMove':
				this.updateBird(e.stageX, e.stageY);
				break;
		}
	}

	// 更新 _bird 的位置
	private updateBird(stageX: number, stageY: number) {
		this._bird.x = stageX;
		this._bird.y = stageY;
	}

	// 随机16进制颜色
	private getRdmClr(): number {
		return (Math.floor(Math.random() * 0xff) << 16)
			+ (Math.floor(Math.random() * 0xff) << 8)
			+ Math.floor(Math.random() * 0xff);
	}
}

// 2、显示对象与容器
// 添加与删除显示对象
class DeleteOrShowObject extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		// 显示色块
		var upLeft: egret.Shape = new egret.Shape();
		upLeft.graphics.beginFill(0xf7acbc);
		upLeft.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
		upLeft.graphics.endFill();
		upLeft.touchEnabled = true;
		this.addChild(upLeft);

		var upRight: egret.Shape = new egret.Shape();
		upRight.touchEnabled = true;
		upRight.graphics.beginFill(0xdeab8a);
		upRight.graphics.drawRect(this.stage.stageWidth / 2, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
		upRight.graphics.endFill();
		this.addChild(upRight);

		var downLeft: egret.Shape = new egret.Shape();
		downLeft.touchEnabled = true;
		downLeft.graphics.beginFill(0xef5b9c);
		downLeft.graphics.drawRect(0, this.stage.stageHeight / 2, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
		downLeft.graphics.endFill();
		this.addChild(downLeft);

		var downRight: egret.Shape = new egret.Shape();
		downRight.touchEnabled = true;
		downRight.graphics.beginFill(0xfedcbd);
		downRight.graphics.drawRect(this.stage.stageWidth / 2, this.stage.stageHeight / 2, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
		downRight.graphics.endFill();
		this.addChild(downRight);

		// 显示文字
		var tx: egret.TextField = new egret.TextField();
		tx.text = '点击不同色块';
		tx.width = this.stage.stageWidth;
		tx.textAlign = egret.HorizontalAlign.CENTER;
		tx.textColor = 0x843900;
		this.addChild(tx);

		// 初始化四个白鹭小鸟
		var upLeftBird: egret.Bitmap = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
		upLeftBird.anchorOffsetX = upLeftBird.width / 2;
		upLeftBird.anchorOffsetY = upLeftBird.height / 2;
		upLeftBird.x = this.stage.stageWidth / 4;
		upLeftBird.y = this.stage.stageHeight / 4;

		var upRightBird: egret.Bitmap = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
		upRightBird.anchorOffsetX = upLeftBird.width / 2;
		upRightBird.anchorOffsetY = upLeftBird.height / 2;
		upRightBird.x = this.stage.stageWidth / 4 * 3;
		upRightBird.y = this.stage.stageHeight / 4;

		var downLeftBird: egret.Bitmap = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
		downLeftBird.anchorOffsetX = upLeftBird.width / 2;
		downLeftBird.anchorOffsetY = upLeftBird.height / 2;
		downLeftBird.x = this.stage.stageWidth / 4;
		downLeftBird.y = this.stage.stageHeight / 4 * 3;

		var downRightBird: egret.Bitmap = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
		downRightBird.anchorOffsetX = upLeftBird.width / 2;
		downRightBird.anchorOffsetY = upLeftBird.height / 2;
		downRightBird.x = this.stage.stageWidth / 4 * 3;
		downRightBird.y = this.stage.stageHeight / 4 * 3;

		// 触摸色块显示和隐藏小鸟
		upLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
			if (upLeftBird.parent) {
				this.removeChild(upLeftBird);
			} else {
				this.addChild(upLeftBird);
			}
		}, this);

		upRight.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
			if (upRightBird.parent) {
				this.removeChild(upRightBird);
			} else {
				this.addChild(upRightBird);
			}
		}, this);

		downLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
			if (downLeftBird.parent) {
				this.removeChild(downLeftBird);
			} else {
				this.addChild(downLeftBird);
			}
		}, this);

		downRight.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
			if (downRightBird.parent) {
				this.removeChild(downRightBird);
			} else {
				this.addChild(downRightBird);
			}
		}, this);
	}
}

// 深度管理
class DepthManagement extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		// 加载图片
		var imgLoader: egret.ImageLoader = new egret.ImageLoader;
		imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
		imgLoader.load('resource/assets/cartoon-egret_00.png');
	}

	private imgLoadHandler(e: egret.Event) {
		// 存储加载完毕的数据
		var data = e.currentTarget.data;
		// 显示文字
		var tx: egret.TextField = new egret.TextField();
		tx.text = '点击不同白鹭小鸟提升到最上层';
		tx.textColor = 0x843900;
		tx.width = this.stage.stageWidth;
		tx.textAlign = egret.HorizontalAlign.CENTER;
		tx.y = 50;
		this.addChild(tx);
		// 初始化三个白鹭小鸟
		var upBird: egret.Bitmap = new egret.Bitmap(data);
		upBird.x = this.stage.stageWidth / 2 - upBird.width / 2;
		upBird.y = this.stage.stageHeight / 2 - upBird.height / 2;
		upBird.touchEnabled = true;
		upBird.pixelHitTest = true;
		this.addChild(upBird);

		var leftBird: egret.Bitmap = new egret.Bitmap(data);
		leftBird.x = 50;
		leftBird.y = this.stage.stageHeight / 2 - leftBird.height / 2;
		leftBird.touchEnabled = true;
		leftBird.pixelHitTest = true;
		this.addChild(leftBird);

		var rightBird: egret.Bitmap = new egret.Bitmap(data);
		rightBird.x = this.stage.stageWidth - rightBird.width - 50;
		rightBird.y = this.stage.stageHeight / 2 - rightBird.height / 2;
		rightBird.touchEnabled = true;
		// 添加精确像素碰撞
		rightBird.pixelHitTest = true;
		this.addChild(rightBird);

		// 触摸事件
		upBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.setChildIndex(upBird, this.numChildren - 1);
		}, this);
		leftBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.setChildIndex(leftBird, this.numChildren - 1);
		}, this);
		rightBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.setChildIndex(rightBird, this.numChildren - 1);
		}, this);
	}
}

// 容器的使用
class ContainerUse extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		/// 提示信息
		var _txInfo: egret.TextField = new egret.TextField;
		_txInfo.size = 28;
		_txInfo.width = 550;
		_txInfo.textAlign = egret.HorizontalAlign.CENTER;
		_txInfo.textColor = 0x000000;
		_txInfo.lineSpacing = 6;
		_txInfo.text = "点击不同颜色按钮，将白鹭小鸟放到不同的容器中，拖动容器小鸟随着容器移动";
		_txInfo.x = this.stage.stageWidth / 2 - _txInfo.width / 2;
		_txInfo.y = 10;
		this.addChild(_txInfo);

		// 生成按钮
		var leftTF: egret.TextField = new egret.TextField();
		leftTF.text = '红色按钮';
		leftTF.textColor = 0xffffff;
		leftTF.background = true;
		leftTF.backgroundColor = 0xd71345;
		leftTF.x = this.stage.stageWidth / 4 - leftTF.width / 2;
		leftTF.y = 120;
		leftTF.touchEnabled = true;
		this.addChild(leftTF);

		var rightTF: egret.TextField = new egret.TextField();
		rightTF.text = '蓝色按钮';
		rightTF.textColor = 0xffffff;
		rightTF.background = true;
		rightTF.backgroundColor = 0x102b6a;
		rightTF.x = this.stage.stageWidth / 4 * 3 - rightTF.width / 2;
		rightTF.y = 120;
		rightTF.touchEnabled = true;
		this.addChild(rightTF);

		// 显示两个容器
		var leftCon: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
		this.addChild(leftCon);
		var rightCon: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
		this.addChild(rightCon);

		var leftCage: egret.Shape = new egret.Shape();
		leftCage.graphics.lineStyle(10, 0xd71345, 1, true);
		leftCage.graphics.lineTo(0, 0);
		leftCage.graphics.lineTo(250, 0);
		leftCage.graphics.lineTo(250, 250);
		leftCage.graphics.lineTo(0, 250);
		leftCage.graphics.lineTo(0, 0);
		leftCage.graphics.endFill();
		leftCon.addChild(leftCage);
		leftCon.x = this.stage.stageWidth / 4 - leftCon.width / 2;
		leftCon.y = 200;

		var rightCage: egret.Shape = new egret.Shape();
		rightCage.graphics.lineStyle(10, 0x102b6a, 1, true);
		rightCage.graphics.lineTo(0, 0);
		rightCage.graphics.lineTo(250, 0);
		rightCage.graphics.lineTo(250, 250);
		rightCage.graphics.lineTo(0, 250);
		rightCage.graphics.lineTo(0, 0);
		rightCage.graphics.endFill();
		rightCon.addChild(rightCage);
		rightCon.x = this.stage.stageWidth / 4 * 3 - rightCon.width / 2;
		rightCon.y = 200;

		// 显示小鸟
		var bird: egret.Bitmap = new egret.Bitmap();
		bird.texture = RES.getRes('cartoon-egret_00_png');
		bird.x = this.stage.stageWidth / 2 - bird.width / 2;
		bird.y = 600;
		bird.width = 200;
		bird.height = 228;
		this.addChild(bird);

		// 触摸按钮移动小鸟到对应的容器
		leftTF.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			if (this.getChildIndex(bird) != -1) {
				this.removeChild(bird);
				leftCon.addChild(bird);
				bird.x = leftCage.width / 2 - bird.width / 2;
				bird.y = leftCage.height / 2 - bird.height / 2;
			} else if (rightCon.getChildIndex(bird) != -1) {
				rightCon.removeChild(bird);
				leftCon.addChild(bird);
				bird.x = leftCage.width / 2 - bird.width / 2;
				bird.y = leftCage.height / 2 - bird.height / 2;
			}
			leftCon.touchEnabled = true;
			rightCon.touchEnabled = false;
		}, this);

		rightTF.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			if (this.getChildIndex(bird) != -1) {
				this.removeChild(bird);
				rightCon.addChild(bird);
				bird.x = rightCage.width / 2 - bird.width / 2;
				bird.y = rightCage.height / 2 - bird.height / 2;
			} else if (leftCon.getChildIndex(bird) != -1) {
				leftCon.removeChild(bird);
				rightCon.addChild(bird);
				bird.x = rightCage.width / 2 - bird.width / 2;
				bird.y = rightCage.height / 2 - bird.height / 2;
			}
			leftCon.touchEnabled = false;
			rightCon.touchEnabled = true;
		}, this);

		// 拖动容器
		leftCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
			leftCon.x = e.stageX - leftCage.width / 2;
			leftCon.y = e.stageY - leftCage.height / 2;
			this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, leftMove, this);
		}, this);

		function leftMove(e: egret.TouchEvent) {
			leftCon.x = e.stageX - leftCage.width / 2;
			leftCon.y = e.stageY - leftCage.height / 2;
		}

		leftCon.addEventListener(egret.TouchEvent.TOUCH_END, () => {
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, leftMove, this);
		}, this);

		rightCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
			rightCon.x = e.stageX - rightCage.width / 2;
			rightCon.y = e.stageY - rightCage.height / 2;
			this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, rightMove, this);
		}, this);

		rightCon.addEventListener(egret.TouchEvent.TOUCH_END, () => {
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, rightMove, this);
		}, this);

		function rightMove(e: egret.TouchEvent) {
			rightCon.x = e.stageX - rightCage.width / 2;
			rightCon.y = e.stageY - rightCage.height / 2;
		}
	}
}

// 3、图形绘制
// 贝塞尔曲线
class Bezier extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	// 贝塞尔曲线
	private bezier: egret.Shape;

	private onAddToStage() {
		// 绘制贝塞尔曲线
		this.bezier = new egret.Shape();
		this.bezier.graphics.lineStyle(3, 0xff0ff0);
		this.bezier.graphics.curveTo(340, 200, 480, 500);
		// this.bezier.graphics.endFill();
		this.addChild(this.bezier);

		// 绘制小球
		// 添加行为
	}
}

// 4、高级图像
// 脏矩形
/*
 * 1、初始化界面，即显示确定数量的小鸟和提示信息
 * 2、两个动画，初始化界面后随机播放一个动画
 * 3、轻触屏幕切换动画类型
*/
class DirtyRectangle extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	// 缩放步长
	private static SCALE_BASE: number = .5;
	// 旋转步长
	private static SCALE_RANGE: number = .5;
	// 小鸟的数量
	private static NUM: number = 30;
	// 动画模式
	private AnimaModels: number = 0;
	// 存储所有的小鸟
	private vcBirds: Array<egret.Bitmap> = [];
	// 当前活动的小鸟的索引
	private activeBirds: Array<number> = [];
	private _nScaleBase: number = 0;

	// 初始化界面
	private onAddToStage() {
		// 显示小鸟
		for (var i = 0, l = DirtyRectangle.NUM; i < l; i++) {
			this.createBird();
		}

		// 显示提示信息
		var tx: egret.TextField = new egret.TextField();
		tx.text = '轻触以改变运动的小鸟及运动模式，观察不同的小鸟变化对应的脏矩形变化';
		this.addChild(tx);
		tx.width = this.stage.stageWidth - 100;
		tx.x = 50;
		tx.y = 50;
		tx.textColor = 0x000000;
		tx.background = true;
		tx.backgroundColor = 0xffffff;
		tx.alpha = .5;

		// 自动播放动画
		this.stage.addEventListener(egret.Event.ENTER_FRAME, this.frameHandle, this);

		this.getBirdIndex();

		// 轻触屏幕切换动画
		this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.AnimaModels = this.AnimaModels ? 0 : 1;
			if (this.AnimaModels) {
				// 小鸟还原为默认比例
				this.vcBirds[this.activeBirds[0]].scaleX = this.vcBirds[this.activeBirds[0]].scaleY = DirtyRectangle.SCALE_BASE;
				this.vcBirds[this.activeBirds[1]].scaleX = this.vcBirds[this.activeBirds[1]].scaleY = DirtyRectangle.SCALE_BASE;
				this.vcBirds[this.activeBirds[2]].scaleX = this.vcBirds[this.activeBirds[2]].scaleY = DirtyRectangle.SCALE_BASE;
			}
			this.getBirdIndex();
		}, this);
	}

	private getBirdIndex(): void {
		// 获取到三个随机的小鸟的索引
		this.activeBirds = [this.randomNUM(), this.randomNUM(), this.randomNUM()];
		// 活动的小鸟的深度最高
		this.setChildIndex(this.vcBirds[this.activeBirds[0]], this.numChildren - 2);
		this.setChildIndex(this.vcBirds[this.activeBirds[1]], this.numChildren - 3);
		this.setChildIndex(this.vcBirds[this.activeBirds[2]], this.numChildren - 4);
	}

	private frameHandle(e: egret.Event): void {
		if (this.AnimaModels === 0) {
			// 旋转
			this.vcBirds[this.activeBirds[0]].rotation += 3;
			this.vcBirds[this.activeBirds[1]].rotation += 3;
			this.vcBirds[this.activeBirds[2]].rotation += 3;
			// 缩放
			var scale: number = DirtyRectangle.SCALE_BASE + Math.abs(Math.sin(this._nScaleBase += 0.03)) * DirtyRectangle.SCALE_RANGE;
			this.vcBirds[this.activeBirds[0]].scaleX = this.vcBirds[this.activeBirds[0]].scaleY = scale;
			this.vcBirds[this.activeBirds[1]].scaleX = this.vcBirds[this.activeBirds[1]].scaleY = scale;
			this.vcBirds[this.activeBirds[2]].scaleX = this.vcBirds[this.activeBirds[2]].scaleY = scale;
		} else if (this.AnimaModels === 1) {
			// 平移
			this.vcBirds[this.activeBirds[0]].x = this.vcBirds[this.activeBirds[0]].x >= (this.stage.stageWidth - this.vcBirds[this.activeBirds[0]].height * DirtyRectangle.SCALE_BASE / 2) ? 0 : this.vcBirds[this.activeBirds[0]].x + 3;
			this.vcBirds[this.activeBirds[1]].x = this.vcBirds[this.activeBirds[1]].x >= (this.stage.stageWidth - this.vcBirds[this.activeBirds[1]].height * DirtyRectangle.SCALE_BASE / 2) ? 0 : this.vcBirds[this.activeBirds[1]].x + 3;
			this.vcBirds[this.activeBirds[2]].x = this.vcBirds[this.activeBirds[2]].x >= (this.stage.stageWidth - this.vcBirds[this.activeBirds[2]].height * DirtyRectangle.SCALE_BASE / 2) ? 0 : this.vcBirds[this.activeBirds[2]].x + 3;
		}
	}

	// 创建小鸟
	private createBird(): egret.Bitmap {
		var bird: egret.Bitmap = new egret.Bitmap(RES.getRes('cartoon-egret_01_small_png'));
		bird.scaleX = bird.scaleY = DirtyRectangle.SCALE_BASE;
		this.addChild(bird);
		// 随机x、y位置
		var x: number = Math.random() * (this.stage.stageWidth - bird.height * DirtyRectangle.SCALE_BASE * 2) + bird.height * DirtyRectangle.SCALE_BASE / 2;
		var y: number = Math.random() * (this.stage.stageHeight - bird.height * DirtyRectangle.SCALE_BASE * 2) + bird.height * DirtyRectangle.SCALE_BASE / 2;
		bird.x = x;
		bird.y = y;
		// 随即旋转角度
		var range = Math.floor(Math.random() * 360);
		bird.rotation = range;
		bird.anchorOffsetX = bird.width / 2;
		bird.anchorOffsetY = bird.height / 2;
		this.vcBirds.push(bird);

		return bird;
	}

	// 0-(NUM-1) 的随机整数
	private randomNUM(): number {
		return Math.floor(Math.random() * (DirtyRectangle.NUM - 1));
	}
}

// 位图缓存
class BitmapCaching extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private static NUM: number = 2;
	public static UNITS_PER_CONT: number = 16;
	private static SCALE_BASE: number = .7;
	private static SCALE_RANGE: number = .6;

	private _rectScope: egret.Rectangle;
	private _vcCont: Array<MotionSprite>;
	private _txInfo: egret.TextField;           // 文本提示信息
	private _bgInfo: egret.Shape;               // 文本提示信息
	private _nScaleBase: number;                 // 缩放比例基数
	private _bCache: boolean;         // 是否启用位图缓存
	private _iMotionMode: number;            /// 运动模式

	private onAddToStage() {
		this._rectScope = new egret.Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight);

		// 产生确定数量的容器并归档
		this._vcCont = new Array<MotionSprite>();

		for (var i = 0; i < BitmapCaching.NUM; i++) {
			var cont: MotionSprite = new MotionSprite();

			// 给一个随机的初始位置
			cont.anchorOffsetX = L.W_SHAPE / 2;
			cont.anchorOffsetY = L.H_SHAPE / 2;
			cont.x = this._rectScope.x + this._rectScope.width * Math.random();
			cont.y = this._rectScope.y + this._rectScope.height * Math.random();
			cont.factor = .8 + Math.random() * .4;

			this._vcCont.push(cont);
			this.addChild(cont);
			// console.log(this._vcCont);
		}

		// 随机填充
		BatchContentFiller.reset(this._vcCont);
		BatchContentFiller.fill(this._vcCont);
		BatchContentFiller.autoAncher(this._vcCont);

		/// 提示信息
		this._txInfo = new egret.TextField;
		this.addChild(this._txInfo);

		this._txInfo.size = 28;
		this._txInfo.x = 250;
		this._txInfo.y = 10;
		this._txInfo.width = this.stage.stageWidth - 260;
		this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
		this._txInfo.textColor = 0x000000;
		this._txInfo.touchEnabled = true;
		this._txInfo.cacheAsBitmap = true;

		this._bgInfo = new egret.Shape;
		this.addChildAt(this._bgInfo, this.numChildren - 1);

		this._bgInfo.x = this._txInfo.x;
		this._bgInfo.y = this._txInfo.y;
		this._bgInfo.cacheAsBitmap = true;

		// 控制变量
		this._nScaleBase = 0;
		this._bCache = false;

		// 用户控制
		this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
			this.planRdmMotion();
		}, this);
		this._txInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
			evt.stopImmediatePropagation();
			this._bCache = !this._bCache;
			for (var i: number = this._vcCont.length - 1; i >= 0; i--) {
				this._vcCont[i].cacheAsBitmap = this._bCache;
			}
			this.updateInfo();
		}, this);

		this.planRdmMotion();

		// 产生动画
		this.stage.addEventListener(egret.Event.ENTER_FRAME, (evt: egret.Event) => {
			switch (this._iMotionMode) {
				case MotionMode.ROT:        // 旋转并伴随缩放
					var scale: number = BitmapCaching.SCALE_BASE + Math.abs(Math.sin(this._nScaleBase += 0.05)) * BitmapCaching.SCALE_RANGE;
					for (var i: number = this._vcCont.length - 1; i >= 0; i--) {
						this._vcCont[i].rotation += 3 * (i % 2 ? 1 : -1) * this._vcCont[i].factor;
						this._vcCont[i].scaleX = this._vcCont[i].scaleY = scale;
					}
					break;
				case MotionMode.MOV:   // 移动模式控制
					var xTo: number;
					for (var i: number = this._vcCont.length - 1; i >= 0; i--) {
						xTo = this._vcCont[i].x + 3 * (i % 2 ? 1 : -1) * this._vcCont[i].factor;
						if (xTo < this._rectScope.left) {
							xTo = this._rectScope.right;
						} else if (xTo > this._rectScope.right) {
							xTo = this._rectScope.left;
						}
						this._vcCont[i].x = xTo;
					}
					break;
			}
		}, this);
	}

	// 随机设置运动内容
	private planRdmMotion(): void {

		if (arguments.callee['runyet'] == undefined) { // 第一次随机一个运动模式
			arguments.callee['runyet'] = 1;
			this._iMotionMode = Math.random() > .5 ? MotionMode.ROT : MotionMode.MOV;
		} else {
			this._iMotionMode = (this._iMotionMode + 1) % MotionMode.TOTAL;
		}
		this.updateInfo();

		// 还原比例
		switch (this._iMotionMode) {
			case MotionMode.ROT:
				for (var i: number = this._vcCont.length - 1; i >= 0; i--) {
					this._vcCont[i].scaleX = this._vcCont[i].scaleY = BitmapCaching.SCALE_BASE;
				}
				break;
			case MotionMode.MOV:
				for (var i: number = this._vcCont.length - 1; i >= 0; i--) {
					this._vcCont[i].scaleX = this._vcCont[i].scaleY = BitmapCaching.SCALE_BASE + Math.random() * BitmapCaching.SCALE_RANGE;
				}
				break;
		}
	}

	private updateInfo(): void {
		this._txInfo.text =
			"轻触文字切换是否用位图缓存" +
			"\n当前位图缓存：" + (this._bCache ? "启用\n还卡？换手机吧！" : "关闭\n不卡只能说明机器太牛！") +
			"\n轻触舞台切换旋转缩放/平移" +
			"\n当前运动：" + (["旋转缩放", "平移"][this._iMotionMode]);

		this._bgInfo.graphics.clear();
		this._bgInfo.graphics.beginFill(0xffffff, .5);
		this._bgInfo.graphics.drawRect(0, 0, this._txInfo.width, this._txInfo.height);
		this._bgInfo.graphics.endFill();
	}
}
class MotionSprite extends egret.Sprite {
	// 每一个运动容器具有独特的因数，用以在运动过程与其他容器区分
	public factor: number;
}
class L {
	public static W_SHAPE: number = 160;
	public static H_SHAPE: number = 210;
}
class MotionMode {        // 运动模式，旋转或平移
	public static ROT: number = 0;
	public static MOV: number = 1;

	public static TOTAL: number = 2;
}
// 为所有容器统一填充内容
class BatchContentFiller {
	constructor() { }

	// 填充内容，为简单矢量图形
	public static fill(vcCont: Array<egret.Sprite>) {
		for (var i: number = 0; i < BitmapCaching.UNITS_PER_CONT; i++) {
			this.prodRdmGraph(vcCont, L.W_SHAPE, L.H_SHAPE);
		}
	}

	public static prodRdmGraph(vcCont: Array<egret.Sprite>, w: number, h: number): void {
		var iTypeShape: number = Math.floor(Math.random() * 2);
		var iFillColor: number = (Math.floor(Math.random() * 0xff) << 16) + (Math.floor(Math.random() * 0xff) << 8) + Math.floor(Math.random() * 0xff);
		var iLineColor: number = (Math.floor(Math.random() * 0xff) << 16) + (Math.floor(Math.random() * 0xff) << 8) + Math.floor(Math.random() * 0xff);
		var radius: number = 20 + Math.random() * 10;
		var wRect: number = 30 + Math.random() * 20;
		var hRect: number = 20 + Math.random() * 10;
		var xRdm: number = L.W_SHAPE * Math.random();
		var yRdm: number = L.H_SHAPE * Math.random();
		console.log("prodRdmGraph:", radius, wRect, hRect, xRdm, yRdm, iFillColor, iLineColor, iTypeShape);

		for (var i: number = vcCont.length - 1; i >= 0; i--) {
			switch (iTypeShape) {
				// 矩形
				case 0:
					vcCont[i].graphics.beginFill(iFillColor);
					vcCont[i].graphics.drawRect(xRdm - wRect / 2, yRdm - hRect / 2, wRect, hRect);
					vcCont[i].graphics.endFill();
					// console.log("prodRdmGraph: 画矩形", i);
					break;
				// 圆形
				case 1:
					vcCont[i].graphics.beginFill(iFillColor);
					vcCont[i].graphics.drawCircle(xRdm, yRdm, radius);
					vcCont[i].graphics.endFill();
					break;
			}
		}
	}

	// 自动居中所有容器的锚点
	public static autoAncher(vcCont: Array<egret.Sprite>): void {
		for (var i: number = vcCont.length - 1; i >= 0; i--) {
			vcCont[i].anchorOffsetX = vcCont[i].width / 2;
			vcCont[i].anchorOffsetY = vcCont[i].height / 2;
			// console.log("vcCont[i] 新锚点：", vcCont[i].anchorOffsetX, vcCont[i].anchorOffsetY);
		}
	}

	public static reset(vcCont: Array<egret.Sprite>): void {
		for (var i: number = vcCont.length - 1; i >= 0; i--) {
			vcCont[i].graphics.clear();
			vcCont[i].removeChildren();
		}
	}
}

// 5、纹理集
class TextureSet extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		// 显示图片
		var image1: egret.Bitmap = new egret.Bitmap();
		image1.texture = RES.getRes('caption_json.cartoon-egret_00_png');
		this.addChild(image1);
	}
}
