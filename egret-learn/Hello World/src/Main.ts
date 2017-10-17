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
		// 这行代码保证了onAddToStage方法执行时，文档类实例已经被添加到舞台中。
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
	 * 配置文件加载完成,开始预加载heroes资源组。
	 * configuration file loading is completed, start to pre-load the heroes resource group
	 */
	private onConfigComplete(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		RES.loadGroup("heroes");
	}

	/**
	 * heroes 资源组加载完成
	 * heroes resource group is loaded
	 */
	private onResourceLoadComplete(event: RES.ResourceEvent) {
		if (event.groupName == "heroes") {
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
	 * heroes 资源组加载进度
	 * Loading process of heroes resource group
	 */
	private onResourceProgress(event: RES.ResourceEvent) {
		if (event.groupName == "heroes") {
			this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
		}
	}

	private textfield: egret.TextField;

	// 记录显示动画的次数
	private times: number;

	// 触摸文本改变颜色
	private touchHandler(evt: egret.TouchEvent):void {
		var tx:egret.TextField = evt.currentTarget;
		tx.textColor = 0x00ff00;
	}

	/**
	 * 创建游戏场景
	 * Create a game scene
	 */
	private createGameScene() {
		// 绘制一个矩形
		var bg: egret.Shape = new egret.Shape();
		bg.graphics.beginFill(0x336699);
		bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		bg.graphics.endFill();
		this.addChild(bg);

		// 显示图片
		var batman1: egret.Bitmap = new egret.Bitmap();
		batman1.texture = RES.getRes('hero-01');
		batman1.width = 200;
		batman1.height = 300;
		batman1.x = 20;
		batman1.y = 120;
		this.addChild(batman1);

		var batman2: egret.Bitmap = new egret.Bitmap();
		batman2.texture = RES.getRes('hero-01');
		batman2.width = 200;
		batman2.height = 300;
		batman2.x = 150;
		batman2.y = 120;
		this.addChild(batman2);

		var batman3: egret.Bitmap = new egret.Bitmap();
		batman3.texture = RES.getRes('hero-01');
		batman3.width = 200;
		batman3.height = 300;
		batman3.x = 280;
		batman3.y = 120;
		this.addChild(batman3);

		var batman4: egret.Bitmap = new egret.Bitmap();
		batman4.texture = RES.getRes('hero-01');
		batman4.width = 200;
		batman4.height = 300;
		batman4.x = 410;
		batman4.y = 120;
		this.addChild(batman4);

		// 显示文本
		var tx: egret.TextField = new egret.TextField();
		tx.text = "偶的会发生地方你手机地方你手机地方时间打发时间的风睡觉的房间放飞机的时间发生看得见";
		tx.x = 20;
		tx.y = 20;
		tx.width = 600;
		tx.textColor = 0x000000;
		this.addChild(tx);

		// 为文本添加触摸事件
		tx.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);

		// 获取显示对象的深度
		console.log("display indexes:", this.getChildIndex(bg), this.getChildIndex(batman1), this.getChildIndex(batman2), this.getChildIndex(batman3), this.getChildIndex(batman4), this.getChildIndex(tx));

		// 修改显示对象的深度
		this.setChildIndex(batman1, this.getChildIndex(batman2));
		// 交换两个显示对象的深度
		this.swapChildren(batman3, batman4);
		console.log("display indexes:", this.getChildIndex(bg), this.getChildIndex(batman1), this.getChildIndex(batman2), this.getChildIndex(batman3), this.getChildIndex(batman4), this.getChildIndex(tx));

		// 绘制一个圆
		var circle: egret.Shape = new egret.Shape();
		circle.graphics.beginFill(0xff0000);
		circle.graphics.drawCircle(20, 20, 20);
		circle.graphics.endFill();
		this.addChild(circle);

		// 锚点
		batman4.anchorOffsetX = 30;
		batman4.anchorOffsetY = 40;
		batman4.x += 30;
		batman4.y += 40;

		// Tween 动画 times
		// 1、交换两张图片的位置
		// 2、让一张图片慢慢变透明在回复
		// 0、让一张图片缩小在变大
		this.times = 0;
		var that = this;
		// 控制 times 的值
		this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
			that.times++;
			switch (that.times%3) {
				case 1 :
					egret.Tween.get(batman1).to({x: batman2.x}, 300, egret.Ease.circIn);
					egret.Tween.get(batman2).to({x: batman1.x}, 300, egret.Ease.circIn);
					break;
				case 2 :
					egret.Tween.get(batman3).to({alpha: .3}, 300, egret.Ease.circIn).to({alpha: 1}, 300, egret.Ease.circIn);
					// 播放声音
					var sound: egret.Sound = RES.getRes("song_mp3");
					var channel:egret. SoundChannel = sound.play(0, 1);
					// console.log(channel);
					break;
				case 0 :
					egret.Tween.get(batman4).to({scaleX: 4, scaleY: 4}, 300, egret.Ease.circIn).to({scaleX: 1, scaleY: 1}, 300, egret.Ease.circIn);
					break;
			}
		}, this)

		// 请求数据 URLRequest
		var urlReq: egret.URLRequest = new egret.URLRequest("http://httpbin.org/user-agent");
		var urlLoader: egret.URLLoader = new egret.URLLoader();
		urlLoader.addEventListener(egret.Event.COMPLETE, function(evt: egret.Event):void {
			console.log(evt.target.data);
		}, this)
		urlLoader.load(urlReq);
	}

	// webSocket 通讯
	// private webSocket: egret.WebSocket;
	// private createGameScene():void {
	// 	this.webSocket = new egret.WebSocket();
	// 	this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
	// 	this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
	// 	this.webSocket.connect("echo.websocket.org", 80);
	// }

	// // 连接成功后发送消息
	// private onSocketOpen():void {
	// 	var cmd = "Hello Egret WebSocket";
	// 	console.log("The connection is successful, send data: " + cmd); 
	// 	this.webSocket.writeUTF(cmd);
	// }

	// // 服务器向客户端发送消息，触发 SOCKET_DATA 事件
	// private onReceiveMessage(e: egret.Event):void {
	// 	var msg = this.webSocket.readUTF();
	// 	console.log("Receive data:" + msg);
	// }
}
