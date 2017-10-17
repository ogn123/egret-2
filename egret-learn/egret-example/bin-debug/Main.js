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
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
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
        // 添加白色背景
        var bg = new egret.Shape();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);
        var _TextureSet = new TextureSet();
        this.addChild(_TextureSet);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
// 简单帧动画
var startTickerTest = (function (_super) {
    __extends(startTickerTest, _super);
    function startTickerTest() {
        var _this = _super.call(this) || this;
        // 设置动画的移动速度
        _this.speed = 0.05;
        _this.timeOnEnterFrame = 0;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onLoad, _this);
        return _this;
    }
    startTickerTest.prototype.onLoad = function (e) {
        var star = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
        this.addChild(star);
        this.star = star;
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.timeOnEnterFrame = egret.getTimer();
    };
    startTickerTest.prototype.onEnterFrame = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;
        this.star.x += this.speed * pass;
        console.log(now + ' ', time + ' ', pass + ' ');
        this.timeOnEnterFrame = egret.getTimer();
        if (this.star.x > 300) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
    };
    return startTickerTest;
}(egret.DisplayObjectContainer));
__reflect(startTickerTest.prototype, "startTickerTest");
// 1、显示对象基本
// 锚点及旋转缩放
var AnchorAndRotZoom = (function (_super) {
    __extends(AnchorAndRotZoom, _super);
    function AnchorAndRotZoom() {
        var _this = _super.call(this) || this;
        // 旋转步长
        _this.STEP_ROT = 3;
        // 缩放步长
        _this.STEP_SCALE = .03;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStart, _this);
        return _this;
    }
    AnchorAndRotZoom.prototype.onAddToStart = function (e) {
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
    };
    AnchorAndRotZoom.prototype.launchAnimations = function () {
        var _this = this;
        this._iAnimMode = AnimModes.ANIM_ROT;
        this.models = ['缩放', '静止', '旋转'];
        this._nScaleBase = 0;
        // 轻触屏幕改变模式
        // this.stage.touchEnabled = true;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this._iAnimMode = (_this._iAnimMode + 1) % 3;
        }, this);
        // 帧动画
        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            if (_this._iAnimMode === AnimModes.ANIM_ROT) {
                _this._brid.rotation += _this.STEP_ROT;
            }
            else if (_this._iAnimMode === AnimModes.ANIM_SCALE) {
                _this._brid.scaleX = _this._brid.scaleY = 0.5 + 0.5 * Math.abs(Math.sin(_this._nScaleBase += _this.STEP_SCALE));
            }
            _this._tx.text = '旋转角度' + _this._brid.rotation + '\n缩放比例' + _this._brid.scaleX.toFixed(2) + '\n\n轻触进入' + _this.models[_this._iAnimMode] + '模式';
            // 表示执行结束是否立即重绘
            return true;
        }, this);
    };
    return AnchorAndRotZoom;
}(egret.DisplayObjectContainer));
__reflect(AnchorAndRotZoom.prototype, "AnchorAndRotZoom");
// 每个动画状态对应的索引
var AnimModes = (function () {
    function AnimModes() {
    }
    AnimModes.ANIM_ROT = 0;
    AnimModes.ANIM_SCALE = 1;
    return AnimModes;
}());
__reflect(AnimModes.prototype, "AnimModes");
// 碰撞检测
var colliDetect = (function (_super) {
    __extends(colliDetect, _super);
    function colliDetect() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    colliDetect.prototype.onAddToStage = function () {
        var _this = this;
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
        this._tx.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            evt.stopImmediatePropagation();
            _this._bShapeText = !_this._bShapeText;
            _this.updateInfo(TouchCollideStatus.NO_TOUCHED);
        }, this);
        this.launchCollisionTest();
    };
    colliDetect.prototype.launchCollisionTest = function () {
        this._bShapeText = true;
        this.updateInfo(TouchCollideStatus.NO_TOUCHED);
        // 手指触摸屏幕
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
    };
    colliDetect.prototype.touchHandler = function (evt) {
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
    };
    // 碰撞检测
    colliDetect.prototype.checkCollision = function (stageX, stageY) {
        var bResult = this._brid.hitTestPoint(stageX, stageY, this._bShapeText);
        /// 小圆点同步手指位置
        this._dot.x = stageX;
        this._dot.y = stageY;
        /// 文字信息更新
        this.updateInfo(bResult ? TouchCollideStatus.COLLIDED : TouchCollideStatus.TOUCHED_NO_COLLIDED);
    };
    // 更新提示文字的内容
    colliDetect.prototype.updateInfo = function (iStatus) {
        this._tx.text = '碰撞检测结果: ' + ['放上手指!', '想摸我?', '别摸我!!!'][iStatus] + '\n\n碰撞检测模式: ' + (this._bShapeText ? '精确碰撞检测' : '非精确碰撞检测') + '\n(轻触文字区切换)';
    };
    return colliDetect;
}(egret.DisplayObjectContainer));
__reflect(colliDetect.prototype, "colliDetect");
// 碰撞结果
var TouchCollideStatus = (function () {
    function TouchCollideStatus() {
    }
    TouchCollideStatus.NO_TOUCHED = 0;
    TouchCollideStatus.TOUCHED_NO_COLLIDED = 1;
    TouchCollideStatus.COLLIDED = 2;
    return TouchCollideStatus;
}());
__reflect(TouchCollideStatus.prototype, "TouchCollideStatus");
// 遮罩的用法
var MaskUsage = (function (_super) {
    __extends(MaskUsage, _super);
    function MaskUsage() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    MaskUsage.prototype.onAddToStage = function () {
        // 显示文字
        var tx = new egret.TextField();
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
    };
    MaskUsage.prototype.lanuchMask = function () {
        // 监听手指触摸事件
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandle, this);
    };
    MaskUsage.prototype.touchHandle = function (e) {
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
    };
    // 更新 _bird 的位置
    MaskUsage.prototype.updateBird = function (stageX, stageY) {
        this._bird.x = stageX;
        this._bird.y = stageY;
    };
    // 随机16进制颜色
    MaskUsage.prototype.getRdmClr = function () {
        return (Math.floor(Math.random() * 0xff) << 16)
            + (Math.floor(Math.random() * 0xff) << 8)
            + Math.floor(Math.random() * 0xff);
    };
    return MaskUsage;
}(egret.DisplayObjectContainer));
__reflect(MaskUsage.prototype, "MaskUsage");
// 2、显示对象与容器
// 添加与删除显示对象
var DeleteOrShowObject = (function (_super) {
    __extends(DeleteOrShowObject, _super);
    function DeleteOrShowObject() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    DeleteOrShowObject.prototype.onAddToStage = function () {
        var _this = this;
        // 显示色块
        var upLeft = new egret.Shape();
        upLeft.graphics.beginFill(0xf7acbc);
        upLeft.graphics.drawRect(0, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        upLeft.graphics.endFill();
        upLeft.touchEnabled = true;
        this.addChild(upLeft);
        var upRight = new egret.Shape();
        upRight.touchEnabled = true;
        upRight.graphics.beginFill(0xdeab8a);
        upRight.graphics.drawRect(this.stage.stageWidth / 2, 0, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        upRight.graphics.endFill();
        this.addChild(upRight);
        var downLeft = new egret.Shape();
        downLeft.touchEnabled = true;
        downLeft.graphics.beginFill(0xef5b9c);
        downLeft.graphics.drawRect(0, this.stage.stageHeight / 2, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        downLeft.graphics.endFill();
        this.addChild(downLeft);
        var downRight = new egret.Shape();
        downRight.touchEnabled = true;
        downRight.graphics.beginFill(0xfedcbd);
        downRight.graphics.drawRect(this.stage.stageWidth / 2, this.stage.stageHeight / 2, this.stage.stageWidth / 2, this.stage.stageHeight / 2);
        downRight.graphics.endFill();
        this.addChild(downRight);
        // 显示文字
        var tx = new egret.TextField();
        tx.text = '点击不同色块';
        tx.width = this.stage.stageWidth;
        tx.textAlign = egret.HorizontalAlign.CENTER;
        tx.textColor = 0x843900;
        this.addChild(tx);
        // 初始化四个白鹭小鸟
        var upLeftBird = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
        upLeftBird.anchorOffsetX = upLeftBird.width / 2;
        upLeftBird.anchorOffsetY = upLeftBird.height / 2;
        upLeftBird.x = this.stage.stageWidth / 4;
        upLeftBird.y = this.stage.stageHeight / 4;
        var upRightBird = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
        upRightBird.anchorOffsetX = upLeftBird.width / 2;
        upRightBird.anchorOffsetY = upLeftBird.height / 2;
        upRightBird.x = this.stage.stageWidth / 4 * 3;
        upRightBird.y = this.stage.stageHeight / 4;
        var downLeftBird = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
        downLeftBird.anchorOffsetX = upLeftBird.width / 2;
        downLeftBird.anchorOffsetY = upLeftBird.height / 2;
        downLeftBird.x = this.stage.stageWidth / 4;
        downLeftBird.y = this.stage.stageHeight / 4 * 3;
        var downRightBird = new egret.Bitmap(RES.getRes('cartoon-egret_00_png'));
        downRightBird.anchorOffsetX = upLeftBird.width / 2;
        downRightBird.anchorOffsetY = upLeftBird.height / 2;
        downRightBird.x = this.stage.stageWidth / 4 * 3;
        downRightBird.y = this.stage.stageHeight / 4 * 3;
        // 触摸色块显示和隐藏小鸟
        upLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (upLeftBird.parent) {
                _this.removeChild(upLeftBird);
            }
            else {
                _this.addChild(upLeftBird);
            }
        }, this);
        upRight.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (upRightBird.parent) {
                _this.removeChild(upRightBird);
            }
            else {
                _this.addChild(upRightBird);
            }
        }, this);
        downLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (downLeftBird.parent) {
                _this.removeChild(downLeftBird);
            }
            else {
                _this.addChild(downLeftBird);
            }
        }, this);
        downRight.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (downRightBird.parent) {
                _this.removeChild(downRightBird);
            }
            else {
                _this.addChild(downRightBird);
            }
        }, this);
    };
    return DeleteOrShowObject;
}(egret.DisplayObjectContainer));
__reflect(DeleteOrShowObject.prototype, "DeleteOrShowObject");
// 深度管理
var DepthManagement = (function (_super) {
    __extends(DepthManagement, _super);
    function DepthManagement() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    DepthManagement.prototype.onAddToStage = function () {
        // 加载图片
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
        imgLoader.load('resource/assets/cartoon-egret_00.png');
    };
    DepthManagement.prototype.imgLoadHandler = function (e) {
        var _this = this;
        // 存储加载完毕的数据
        var data = e.currentTarget.data;
        // 显示文字
        var tx = new egret.TextField();
        tx.text = '点击不同白鹭小鸟提升到最上层';
        tx.textColor = 0x843900;
        tx.width = this.stage.stageWidth;
        tx.textAlign = egret.HorizontalAlign.CENTER;
        tx.y = 50;
        this.addChild(tx);
        // 初始化三个白鹭小鸟
        var upBird = new egret.Bitmap(data);
        upBird.x = this.stage.stageWidth / 2 - upBird.width / 2;
        upBird.y = this.stage.stageHeight / 2 - upBird.height / 2;
        upBird.touchEnabled = true;
        upBird.pixelHitTest = true;
        this.addChild(upBird);
        var leftBird = new egret.Bitmap(data);
        leftBird.x = 50;
        leftBird.y = this.stage.stageHeight / 2 - leftBird.height / 2;
        leftBird.touchEnabled = true;
        leftBird.pixelHitTest = true;
        this.addChild(leftBird);
        var rightBird = new egret.Bitmap(data);
        rightBird.x = this.stage.stageWidth - rightBird.width - 50;
        rightBird.y = this.stage.stageHeight / 2 - rightBird.height / 2;
        rightBird.touchEnabled = true;
        // 添加精确像素碰撞
        rightBird.pixelHitTest = true;
        this.addChild(rightBird);
        // 触摸事件
        upBird.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.setChildIndex(upBird, _this.numChildren - 1);
        }, this);
        leftBird.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.setChildIndex(leftBird, _this.numChildren - 1);
        }, this);
        rightBird.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.setChildIndex(rightBird, _this.numChildren - 1);
        }, this);
    };
    return DepthManagement;
}(egret.DisplayObjectContainer));
__reflect(DepthManagement.prototype, "DepthManagement");
// 容器的使用
var ContainerUse = (function (_super) {
    __extends(ContainerUse, _super);
    function ContainerUse() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    ContainerUse.prototype.onAddToStage = function () {
        var _this = this;
        /// 提示信息
        var _txInfo = new egret.TextField;
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
        var leftTF = new egret.TextField();
        leftTF.text = '红色按钮';
        leftTF.textColor = 0xffffff;
        leftTF.background = true;
        leftTF.backgroundColor = 0xd71345;
        leftTF.x = this.stage.stageWidth / 4 - leftTF.width / 2;
        leftTF.y = 120;
        leftTF.touchEnabled = true;
        this.addChild(leftTF);
        var rightTF = new egret.TextField();
        rightTF.text = '蓝色按钮';
        rightTF.textColor = 0xffffff;
        rightTF.background = true;
        rightTF.backgroundColor = 0x102b6a;
        rightTF.x = this.stage.stageWidth / 4 * 3 - rightTF.width / 2;
        rightTF.y = 120;
        rightTF.touchEnabled = true;
        this.addChild(rightTF);
        // 显示两个容器
        var leftCon = new egret.DisplayObjectContainer();
        this.addChild(leftCon);
        var rightCon = new egret.DisplayObjectContainer();
        this.addChild(rightCon);
        var leftCage = new egret.Shape();
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
        var rightCage = new egret.Shape();
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
        var bird = new egret.Bitmap();
        bird.texture = RES.getRes('cartoon-egret_00_png');
        bird.x = this.stage.stageWidth / 2 - bird.width / 2;
        bird.y = 600;
        bird.width = 200;
        bird.height = 228;
        this.addChild(bird);
        // 触摸按钮移动小鸟到对应的容器
        leftTF.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.getChildIndex(bird) != -1) {
                _this.removeChild(bird);
                leftCon.addChild(bird);
                bird.x = leftCage.width / 2 - bird.width / 2;
                bird.y = leftCage.height / 2 - bird.height / 2;
            }
            else if (rightCon.getChildIndex(bird) != -1) {
                rightCon.removeChild(bird);
                leftCon.addChild(bird);
                bird.x = leftCage.width / 2 - bird.width / 2;
                bird.y = leftCage.height / 2 - bird.height / 2;
            }
            leftCon.touchEnabled = true;
            rightCon.touchEnabled = false;
        }, this);
        rightTF.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.getChildIndex(bird) != -1) {
                _this.removeChild(bird);
                rightCon.addChild(bird);
                bird.x = rightCage.width / 2 - bird.width / 2;
                bird.y = rightCage.height / 2 - bird.height / 2;
            }
            else if (leftCon.getChildIndex(bird) != -1) {
                leftCon.removeChild(bird);
                rightCon.addChild(bird);
                bird.x = rightCage.width / 2 - bird.width / 2;
                bird.y = rightCage.height / 2 - bird.height / 2;
            }
            leftCon.touchEnabled = false;
            rightCon.touchEnabled = true;
        }, this);
        // 拖动容器
        leftCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            leftCon.x = e.stageX - leftCage.width / 2;
            leftCon.y = e.stageY - leftCage.height / 2;
            _this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, leftMove, _this);
        }, this);
        function leftMove(e) {
            leftCon.x = e.stageX - leftCage.width / 2;
            leftCon.y = e.stageY - leftCage.height / 2;
        }
        leftCon.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            _this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, leftMove, _this);
        }, this);
        rightCon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            rightCon.x = e.stageX - rightCage.width / 2;
            rightCon.y = e.stageY - rightCage.height / 2;
            _this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, rightMove, _this);
        }, this);
        rightCon.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            _this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, rightMove, _this);
        }, this);
        function rightMove(e) {
            rightCon.x = e.stageX - rightCage.width / 2;
            rightCon.y = e.stageY - rightCage.height / 2;
        }
    };
    return ContainerUse;
}(egret.DisplayObjectContainer));
__reflect(ContainerUse.prototype, "ContainerUse");
// 3、图形绘制
// 贝塞尔曲线
var Bezier = (function (_super) {
    __extends(Bezier, _super);
    function Bezier() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Bezier.prototype.onAddToStage = function () {
        // 绘制贝塞尔曲线
        this.bezier = new egret.Shape();
        this.bezier.graphics.lineStyle(3, 0xff0ff0);
        this.bezier.graphics.curveTo(340, 200, 480, 500);
        // this.bezier.graphics.endFill();
        this.addChild(this.bezier);
        // 绘制小球
        // 添加行为
    };
    return Bezier;
}(egret.DisplayObjectContainer));
__reflect(Bezier.prototype, "Bezier");
// 4、高级图像
// 脏矩形
/*
 * 1、初始化界面，即显示确定数量的小鸟和提示信息
 * 2、两个动画，初始化界面后随机播放一个动画
 * 3、轻触屏幕切换动画类型
*/
var DirtyRectangle = (function (_super) {
    __extends(DirtyRectangle, _super);
    function DirtyRectangle() {
        var _this = _super.call(this) || this;
        // 动画模式
        _this.AnimaModels = 0;
        // 存储所有的小鸟
        _this.vcBirds = [];
        // 当前活动的小鸟的索引
        _this.activeBirds = [];
        _this._nScaleBase = 0;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    // 初始化界面
    DirtyRectangle.prototype.onAddToStage = function () {
        var _this = this;
        // 显示小鸟
        for (var i = 0, l = DirtyRectangle.NUM; i < l; i++) {
            this.createBird();
        }
        // 显示提示信息
        var tx = new egret.TextField();
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
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.AnimaModels = _this.AnimaModels ? 0 : 1;
            if (_this.AnimaModels) {
                // 小鸟还原为默认比例
                _this.vcBirds[_this.activeBirds[0]].scaleX = _this.vcBirds[_this.activeBirds[0]].scaleY = DirtyRectangle.SCALE_BASE;
                _this.vcBirds[_this.activeBirds[1]].scaleX = _this.vcBirds[_this.activeBirds[1]].scaleY = DirtyRectangle.SCALE_BASE;
                _this.vcBirds[_this.activeBirds[2]].scaleX = _this.vcBirds[_this.activeBirds[2]].scaleY = DirtyRectangle.SCALE_BASE;
            }
            _this.getBirdIndex();
        }, this);
    };
    DirtyRectangle.prototype.getBirdIndex = function () {
        // 获取到三个随机的小鸟的索引
        this.activeBirds = [this.randomNUM(), this.randomNUM(), this.randomNUM()];
        // 活动的小鸟的深度最高
        this.setChildIndex(this.vcBirds[this.activeBirds[0]], this.numChildren - 2);
        this.setChildIndex(this.vcBirds[this.activeBirds[1]], this.numChildren - 3);
        this.setChildIndex(this.vcBirds[this.activeBirds[2]], this.numChildren - 4);
    };
    DirtyRectangle.prototype.frameHandle = function (e) {
        if (this.AnimaModels === 0) {
            // 旋转
            this.vcBirds[this.activeBirds[0]].rotation += 3;
            this.vcBirds[this.activeBirds[1]].rotation += 3;
            this.vcBirds[this.activeBirds[2]].rotation += 3;
            // 缩放
            var scale = DirtyRectangle.SCALE_BASE + Math.abs(Math.sin(this._nScaleBase += 0.03)) * DirtyRectangle.SCALE_RANGE;
            this.vcBirds[this.activeBirds[0]].scaleX = this.vcBirds[this.activeBirds[0]].scaleY = scale;
            this.vcBirds[this.activeBirds[1]].scaleX = this.vcBirds[this.activeBirds[1]].scaleY = scale;
            this.vcBirds[this.activeBirds[2]].scaleX = this.vcBirds[this.activeBirds[2]].scaleY = scale;
        }
        else if (this.AnimaModels === 1) {
            // 平移
            this.vcBirds[this.activeBirds[0]].x = this.vcBirds[this.activeBirds[0]].x >= (this.stage.stageWidth - this.vcBirds[this.activeBirds[0]].height * DirtyRectangle.SCALE_BASE / 2) ? 0 : this.vcBirds[this.activeBirds[0]].x + 3;
            this.vcBirds[this.activeBirds[1]].x = this.vcBirds[this.activeBirds[1]].x >= (this.stage.stageWidth - this.vcBirds[this.activeBirds[1]].height * DirtyRectangle.SCALE_BASE / 2) ? 0 : this.vcBirds[this.activeBirds[1]].x + 3;
            this.vcBirds[this.activeBirds[2]].x = this.vcBirds[this.activeBirds[2]].x >= (this.stage.stageWidth - this.vcBirds[this.activeBirds[2]].height * DirtyRectangle.SCALE_BASE / 2) ? 0 : this.vcBirds[this.activeBirds[2]].x + 3;
        }
    };
    // 创建小鸟
    DirtyRectangle.prototype.createBird = function () {
        var bird = new egret.Bitmap(RES.getRes('cartoon-egret_01_small_png'));
        bird.scaleX = bird.scaleY = DirtyRectangle.SCALE_BASE;
        this.addChild(bird);
        // 随机x、y位置
        var x = Math.random() * (this.stage.stageWidth - bird.height * DirtyRectangle.SCALE_BASE * 2) + bird.height * DirtyRectangle.SCALE_BASE / 2;
        var y = Math.random() * (this.stage.stageHeight - bird.height * DirtyRectangle.SCALE_BASE * 2) + bird.height * DirtyRectangle.SCALE_BASE / 2;
        bird.x = x;
        bird.y = y;
        // 随即旋转角度
        var range = Math.floor(Math.random() * 360);
        bird.rotation = range;
        bird.anchorOffsetX = bird.width / 2;
        bird.anchorOffsetY = bird.height / 2;
        this.vcBirds.push(bird);
        return bird;
    };
    // 0-(NUM-1) 的随机整数
    DirtyRectangle.prototype.randomNUM = function () {
        return Math.floor(Math.random() * (DirtyRectangle.NUM - 1));
    };
    // 缩放步长
    DirtyRectangle.SCALE_BASE = .5;
    // 旋转步长
    DirtyRectangle.SCALE_RANGE = .5;
    // 小鸟的数量
    DirtyRectangle.NUM = 30;
    return DirtyRectangle;
}(egret.DisplayObjectContainer));
__reflect(DirtyRectangle.prototype, "DirtyRectangle");
// 位图缓存
var BitmapCaching = (function (_super) {
    __extends(BitmapCaching, _super);
    function BitmapCaching() {
        var _this = _super.call(this) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    BitmapCaching.prototype.onAddToStage = function () {
        var _this = this;
        this._rectScope = new egret.Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        // 产生确定数量的容器并归档
        this._vcCont = new Array();
        for (var i = 0; i < BitmapCaching.NUM; i++) {
            var cont = new MotionSprite();
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
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.planRdmMotion();
        }, this);
        this._txInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            evt.stopImmediatePropagation();
            _this._bCache = !_this._bCache;
            for (var i = _this._vcCont.length - 1; i >= 0; i--) {
                _this._vcCont[i].cacheAsBitmap = _this._bCache;
            }
            _this.updateInfo();
        }, this);
        this.planRdmMotion();
        // 产生动画
        this.stage.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            switch (_this._iMotionMode) {
                case MotionMode.ROT:// 旋转并伴随缩放
                    var scale = BitmapCaching.SCALE_BASE + Math.abs(Math.sin(_this._nScaleBase += 0.05)) * BitmapCaching.SCALE_RANGE;
                    for (var i = _this._vcCont.length - 1; i >= 0; i--) {
                        _this._vcCont[i].rotation += 3 * (i % 2 ? 1 : -1) * _this._vcCont[i].factor;
                        _this._vcCont[i].scaleX = _this._vcCont[i].scaleY = scale;
                    }
                    break;
                case MotionMode.MOV:// 移动模式控制
                    var xTo;
                    for (var i = _this._vcCont.length - 1; i >= 0; i--) {
                        xTo = _this._vcCont[i].x + 3 * (i % 2 ? 1 : -1) * _this._vcCont[i].factor;
                        if (xTo < _this._rectScope.left) {
                            xTo = _this._rectScope.right;
                        }
                        else if (xTo > _this._rectScope.right) {
                            xTo = _this._rectScope.left;
                        }
                        _this._vcCont[i].x = xTo;
                    }
                    break;
            }
        }, this);
    };
    // 随机设置运动内容
    BitmapCaching.prototype.planRdmMotion = function () {
        if (arguments.callee['runyet'] == undefined) {
            arguments.callee['runyet'] = 1;
            this._iMotionMode = Math.random() > .5 ? MotionMode.ROT : MotionMode.MOV;
        }
        else {
            this._iMotionMode = (this._iMotionMode + 1) % MotionMode.TOTAL;
        }
        this.updateInfo();
        // 还原比例
        switch (this._iMotionMode) {
            case MotionMode.ROT:
                for (var i = this._vcCont.length - 1; i >= 0; i--) {
                    this._vcCont[i].scaleX = this._vcCont[i].scaleY = BitmapCaching.SCALE_BASE;
                }
                break;
            case MotionMode.MOV:
                for (var i = this._vcCont.length - 1; i >= 0; i--) {
                    this._vcCont[i].scaleX = this._vcCont[i].scaleY = BitmapCaching.SCALE_BASE + Math.random() * BitmapCaching.SCALE_RANGE;
                }
                break;
        }
    };
    BitmapCaching.prototype.updateInfo = function () {
        this._txInfo.text =
            "轻触文字切换是否用位图缓存" +
                "\n当前位图缓存：" + (this._bCache ? "启用\n还卡？换手机吧！" : "关闭\n不卡只能说明机器太牛！") +
                "\n轻触舞台切换旋转缩放/平移" +
                "\n当前运动：" + (["旋转缩放", "平移"][this._iMotionMode]);
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill(0xffffff, .5);
        this._bgInfo.graphics.drawRect(0, 0, this._txInfo.width, this._txInfo.height);
        this._bgInfo.graphics.endFill();
    };
    BitmapCaching.NUM = 2;
    BitmapCaching.UNITS_PER_CONT = 16;
    BitmapCaching.SCALE_BASE = .7;
    BitmapCaching.SCALE_RANGE = .6;
    return BitmapCaching;
}(egret.DisplayObjectContainer));
__reflect(BitmapCaching.prototype, "BitmapCaching");
var MotionSprite = (function (_super) {
    __extends(MotionSprite, _super);
    function MotionSprite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MotionSprite;
}(egret.Sprite));
__reflect(MotionSprite.prototype, "MotionSprite");
var L = (function () {
    function L() {
    }
    L.W_SHAPE = 160;
    L.H_SHAPE = 210;
    return L;
}());
__reflect(L.prototype, "L");
var MotionMode = (function () {
    function MotionMode() {
    }
    MotionMode.ROT = 0;
    MotionMode.MOV = 1;
    MotionMode.TOTAL = 2;
    return MotionMode;
}());
__reflect(MotionMode.prototype, "MotionMode");
// 为所有容器统一填充内容
var BatchContentFiller = (function () {
    function BatchContentFiller() {
    }
    // 填充内容，为简单矢量图形
    BatchContentFiller.fill = function (vcCont) {
        for (var i = 0; i < BitmapCaching.UNITS_PER_CONT; i++) {
            this.prodRdmGraph(vcCont, L.W_SHAPE, L.H_SHAPE);
        }
    };
    BatchContentFiller.prodRdmGraph = function (vcCont, w, h) {
        var iTypeShape = Math.floor(Math.random() * 2);
        var iFillColor = (Math.floor(Math.random() * 0xff) << 16) + (Math.floor(Math.random() * 0xff) << 8) + Math.floor(Math.random() * 0xff);
        var iLineColor = (Math.floor(Math.random() * 0xff) << 16) + (Math.floor(Math.random() * 0xff) << 8) + Math.floor(Math.random() * 0xff);
        var radius = 20 + Math.random() * 10;
        var wRect = 30 + Math.random() * 20;
        var hRect = 20 + Math.random() * 10;
        var xRdm = L.W_SHAPE * Math.random();
        var yRdm = L.H_SHAPE * Math.random();
        console.log("prodRdmGraph:", radius, wRect, hRect, xRdm, yRdm, iFillColor, iLineColor, iTypeShape);
        for (var i = vcCont.length - 1; i >= 0; i--) {
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
    };
    // 自动居中所有容器的锚点
    BatchContentFiller.autoAncher = function (vcCont) {
        for (var i = vcCont.length - 1; i >= 0; i--) {
            vcCont[i].anchorOffsetX = vcCont[i].width / 2;
            vcCont[i].anchorOffsetY = vcCont[i].height / 2;
            // console.log("vcCont[i] 新锚点：", vcCont[i].anchorOffsetX, vcCont[i].anchorOffsetY);
        }
    };
    BatchContentFiller.reset = function (vcCont) {
        for (var i = vcCont.length - 1; i >= 0; i--) {
            vcCont[i].graphics.clear();
            vcCont[i].removeChildren();
        }
    };
    return BatchContentFiller;
}());
__reflect(BatchContentFiller.prototype, "BatchContentFiller");
// 5、纹理集
var TextureSet = (function (_super) {
    __extends(TextureSet, _super);
    function TextureSet() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    TextureSet.prototype.onAddToStage = function () {
        // 显示图片
        var image1 = new egret.Bitmap();
        image1.texture = RES.getRes('caption_json.cartoon-egret_00_png');
        this.addChild(image1);
    };
    return TextureSet;
}(egret.DisplayObjectContainer));
__reflect(TextureSet.prototype, "TextureSet");
//# sourceMappingURL=Main.js.map