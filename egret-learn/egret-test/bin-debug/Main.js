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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
                // console.log('hello,world')
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + "has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + "has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
        imgLoader.load("resource/assets/bg.jpg");
        var renderTexture = new egret.RenderTexture();
        // renderTexture.drawToTexture(displayObject);
    };
    Main.prototype.imgLoadHandler = function (evt) {
        var loader = evt.currentTarget;
        var bmd = loader.data;
        var bmp = new egret.Bitmap(bmd);
        this.addChild(bmp);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var BitmapTest = (function (_super) {
    __extends(BitmapTest, _super);
    function BitmapTest() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    BitmapTest.prototype.onAddToStage = function (event) {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        RES.loadGroup("preload");
    };
    BitmapTest.prototype.onGroupComplete = function () {
        var img = new egret.Bitmap();
        img.texture = RES.getRes("bgImage");
        this.addChild(img);
    };
    return BitmapTest;
}(egret.DisplayObjectContainer));
__reflect(BitmapTest.prototype, "BitmapTest");
var TouchEventTest = (function (_super) {
    __extends(TouchEventTest, _super);
    function TouchEventTest() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    TouchEventTest.prototype.onAddToStage = function (event) {
        //添加显示文本
        this.drawText();
        //绘制一个透明度为1的绿色矩形，宽高为100*80
        var spr1 = new egret.Sprite();
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
    };
    TouchEventTest.prototype.onTouch = function (evt) {
        this.txt.text += "\n点击了spr1";
    };
    TouchEventTest.prototype.onTouchTap = function (evt) {
        this.txt.text += "\n容器冒泡侦听\n---------";
    };
    TouchEventTest.prototype.onTouchTaps = function (evt) {
        this.txt.text += "\n容器捕获侦听";
    };
    TouchEventTest.prototype.drawText = function () {
        this.txt = new egret.TextField();
        this.txt.size = 12;
        this.txt.x = 250;
        this.txt.width = 200;
        this.txt.height = 200;
        this.txt.text = "事件文字";
        this.addChild(this.txt);
    };
    return TouchEventTest;
}(egret.DisplayObjectContainer));
__reflect(TouchEventTest.prototype, "TouchEventTest");
// 创建一个文档类
var sampleData = (function (_super) {
    __extends(sampleData, _super);
    function sampleData() {
        var _this = _super.call(this) || this;
        // 创建一个男朋友
        var boy = new Boy();
        boy.name = '男朋友';
        // 创建一个女朋友
        var girl = new Girl();
        girl.name = '女朋友';
        // 监听约会事件
        boy.addEventListener(DataEvent.DATA, girl.getData, girl);
        // 男朋友发出邀请
        boy.order();
        return _this;
    }
    return sampleData;
}(egret.DisplayObjectContainer));
__reflect(sampleData.prototype, "sampleData");
// 定义男朋友类
var Boy = (function (_super) {
    __extends(Boy, _super);
    function Boy() {
        return _super.call(this) || this;
    }
    Boy.prototype.order = function () {
        // 生成约会事件对象
        var daterEvent = new DataEvent(DataEvent.DATA);
        //添加对应的约会信息
        daterEvent._year = 2014;
        daterEvent._month = 8;
        daterEvent._date = 2;
        daterEvent._where = "肯德基";
        daterEvent._todo = "共进晚餐";
        // 发送要求事件
        this.dispatchEvent(daterEvent);
    };
    return Boy;
}(egret.Sprite));
__reflect(Boy.prototype, "Boy");
// 定义女朋友
var Girl = (function (_super) {
    __extends(Girl, _super);
    function Girl() {
        return _super.call(this) || this;
    }
    Girl.prototype.getData = function (e) {
        console.log("得到了" + e.target.name + "的邀请！");
        console.log("会在" + e._year + "年" + e._month + "月" + e._date + "日，在" + e._where + e._todo);
    };
    return Girl;
}(egret.Sprite));
__reflect(Girl.prototype, "Girl");
// 自定义一个约会事件类
var DataEvent = (function (_super) {
    __extends(DataEvent, _super);
    function DataEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this._year = 0;
        _this._month = 0;
        _this._date = 0;
        _this._where = "";
        _this._todo = "";
        return _this;
    }
    DataEvent.DATA = '约会';
    return DataEvent;
}(egret.Event));
__reflect(DataEvent.prototype, "DataEvent");
//# sourceMappingURL=Main.js.map