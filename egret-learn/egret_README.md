# egret 学习笔记

## API

* stage.addChild(obj): 将创建的显示对象添加到舞台

## 矢量绘图

### 创建绘制图形对象: egret.Shape

```
    var bg: egret.Shape = new egret.Shape();
		bg.graphics.beginFill(0x336699);
		bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		bg.graphics.endFill();
		this.addChild(bg);
```

* bg.graphics.drawRect(x, y, width, height): 绘制矩形

    * x: 横坐标
    * y: 纵坐标
    * width: 矩形长度
    * height: 矩形宽度

* circle.graphics.drawCircle(x, y, r): 绘制圆

```
    var circle: egret.Shape = new egret.Shape();
		circle.graphics.beginFill(0xff0000);
		circle.graphics.drawCircle(0, 0, 20);
		circle.graphics.endFill();
```

### 创建图片显示对象: egret.Bitmap

```
    var batman1: egret.Bitmap = new egret.Bitmap();
    // 显示图片
		batman1.texture = RES.getRes('hero-01');
		batman1.width = 200;
		batman1.height = 300;
		batman1.x = 20;
		batman1.y = 120;
		this.addChild(batman1);
```

### 创建文本显示对象: egret.TextField

```
    var tx: egret.TextField = new egret.TextField();
		tx.text = str;
		tx.x = 20;
		tx.y = 20;
		tx.width = 600;
		tx.textColor = 0x000000;
		this.addChild(tx);
```

## 显示容器

### 显示深度控制

同一显示容器的显示对象，是以列表的形式来管理的，每一个显示对象对应其索引，索引是从零开始的整数，显示列表索引即是显示深度。

* this.getChildIndex(obj): 获取某个显示对象的显示深度。

* this.setChildIndex(obj, num): 修改某个显示对象的显示深度。

* this.swapChildIndex(obj1, obj2): 交换两个显示对象的显示深度。

显示深度的规则：

* 一个显示深度对应一个显示对象，一个显示对象也只对应一个显示深度，即显示深度是不重复的。

* 显示深度是从零开始连续的整数，当某个显示对象的显示深度被修改为其它深度时，本身的深度会被相邻的深度大于一的显示对象占据，后续对象依次排列。

* 显示深度的最大值是显示列表的长度-1，如果我们给一个深度最大为5的显示对象甚至一个20的深度，该对象的深度也不会变成20，而是5.

## RES：加载资源的类

* RES.loadGroup("preload"): 加载资源组

* RES.getRes(str): 载入资源

## 事件

### TouchEvent

```
// 允许显示对象响应 touch 事件，egret 的显示对象默认是不响应 touch 的。
tx.touchEnabled = true; 
tx.addEventListener( egret.TouchEvent.TOUCH_TAP, this.touchHandler, this );
```

## 方法、类

### 随机16进制颜色

```
	private getRdmClr(): number {
		return ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff ) ;
	}
```