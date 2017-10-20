module fighter {
	/*
	 * 可滚动的视图
	*/
  export class BgMap extends egret.DisplayObjectContainer {
		public constructor () {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}

		/*图片引用*/
		private bmArr: Array<egret.Bitmap>;
		/*图片数量*/
		private rowCount: number;
		/*舞台的宽*/
		private stageW: number;
		/*舞台的高*/
		private stageH: number;
		/*滚动速度*/
		private speed: number = 2;
		/*纹理本身的高度*/
		private textureHeight: number;

		private onAddToStage() {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			// 舞台的宽高
			this.stageW = this.stage.stageWidth;
			this.stageH = this.stage.stageHeight;
			// 纹理高度
			var texture: egret.Bitmap = new egret.Bitmap(RES.getRes('bg_jpg'));
			this.textureHeight = texture.height;
			// 计算当前页面需要的图片数量
			this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1;
			this.bmArr = [];
			// 显示这些背景图片，设置 y 坐标，将他们连接起来
			for (var i = 0, l = this.rowCount; i < l; i++) {
				var bgBmp: egret.Bitmap = new egret.Bitmap(RES.getRes('bg_jpg'));
				bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
				// bgBmp.width = this.stageW;
				this.bmArr.push(bgBmp);
				this.addChild(bgBmp);
			}
		}

		/*开始滚动*/
		public start(): void {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
		}

		// 逐帧运动
		private enterFrameHandler(e: egret.Event): void {
			for (var i = 0, l = this.bmArr.length; i < l; i++) {
				var bgBmp:egret.Bitmap = this.bmArr[i];
				bgBmp.y += this.speed;
				// 判断超出屏幕后，回到队首
				if (bgBmp.y >= this.stageH) {
					bgBmp.y = - (this.textureHeight * this.rowCount - this.stageH);
					this.bmArr.pop();
					this.bmArr.unshift(bgBmp);
				}
			}
		}

		/*暂停滚动*/
		public pause(): void {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
		}
	}
}