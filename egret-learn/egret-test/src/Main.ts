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
		console.warn("Url:" + event.resItem.url + "has failed to load");
	}

	/**
	 * 资源组加载出错
	 *  The resource group loading failed
	 */
	private onResourceLoadError(event: RES.ResourceEvent) {
		//TODO
		console.warn("Group:" + event.groupName + "has failed to load");
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

	private textfield: egret.TextField;

	/**
	 * 创建游戏场景
	 * Create a game scene
	 */
	private createGameScene() {
		var imgLoader: egret.ImageLoader = new egret.ImageLoader;
		imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
		imgLoader.load("resource/assets/bg.jpg");

		var renderTexture: egret.RenderTexture = new egret.RenderTexture();
		// renderTexture.drawToTexture(displayObject);
	}

	imgLoadHandler(evt: egret.Event): void {
		var loader: egret.ImageLoader = evt.currentTarget;
		var bmd: egret.BitmapData = loader.data;
		var bmp: egret.Bitmap = new egret.Bitmap(bmd);
		this.addChild(bmp);
	}
}

class BitmapTest extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(event: egret.Event) {
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
		RES.loadConfig("resource/default.res.json", "resource/");
		RES.loadGroup("preload");
	}
	private onGroupComplete() {
		var img: egret.Bitmap = new egret.Bitmap();
		img.texture = RES.getRes("bgImage");
		this.addChild(img);
	}
}

class TouchEventTest extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(event: egret.Event) {
		//添加显示文本
		this.drawText();
		//绘制一个透明度为1的绿色矩形，宽高为100*80
		var spr1: egret.Sprite = new egret.Sprite();
		spr1.graphics.beginFill(0x00ff00, 1);
		spr1.graphics.drawRect(0, 0, 100, 80);
		spr1.graphics.endFill();
		spr1.width = 100;
		spr1.height = 80;
		this.addChild(spr1);
		//设置显示对象可以相应触摸事件
		spr1.touchEnabled = true;
		//注册事件
		spr1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaps, this, true);
	}
	private onTouch(evt: egret.TouchEvent) {
		this.txt.text += "\n点击了spr1";
	}
	private onTouchTap(evt: egret.TouchEvent) {
		this.txt.text += "\n容器冒泡侦听\n---------";
	}
	private onTouchTaps(evt: egret.TouchEvent) {
		this.txt.text += "\n容器捕获侦听";
	}
	//绘制文本
	private txt: egret.TextField;
	private drawText(): void {
		this.txt = new egret.TextField();
		this.txt.size = 12;
		this.txt.x = 250;
		this.txt.width = 200;
		this.txt.height = 200;
		this.txt.text = "事件文字";
		this.addChild(this.txt);
	}
}

// 创建一个文档类
class sampleData extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		// 创建一个男朋友
		var boy: Boy = new Boy();
		boy.name = '男朋友';
		// 创建一个女朋友
		var girl: Girl = new Girl();
		girl.name = '女朋友';
		// 监听约会事件
		boy.addEventListener(DataEvent.DATA, girl.getData, girl);
		// 男朋友发出邀请
		boy.order();
	}
}

// 定义男朋友类
class Boy extends egret.Sprite {
	public constructor() {
		super();
	}

	public order() {
		// 生成约会事件对象
		var daterEvent: DataEvent = new DataEvent(DataEvent.DATA);
		//添加对应的约会信息
		daterEvent._year = 2014;
		daterEvent._month = 8;
		daterEvent._date = 2;
		daterEvent._where = "肯德基";
		daterEvent._todo = "共进晚餐";
		// 发送要求事件
		this.dispatchEvent(daterEvent);
	}
}

// 定义女朋友
class Girl extends egret.Sprite {
	public constructor() {
		super();
	}

	public getData(e: DataEvent) {
		console.log("得到了" + e.target.name + "的邀请！");
		console.log("会在" + e._year + "年" + e._month + "月" + e._date + "日，在" + e._where + e._todo);
	}
}

// 自定义一个约会事件类
class DataEvent extends egret.Event {
	public static DATA: string = '约会';
	public _year: number = 0;
	public _month: number = 0;
	public _date: number = 0;
	public _where: string = "";
	public _todo: string = "";
	public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
		super(type, bubbles, cancelable);
	}
}