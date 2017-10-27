module fighter {
	/*
	 * 血条
	*/
	export class BloodStrip extends egret.Sprite {

		// 上层血条
		private topBlood: egret.Shape;
		// 血条的宽高
		private bloodW: number;
		private bloodH: number;
		// 血条的总血量
		private allBlood: number;
		// 矩形遮罩
		private maskObject: egret.Rectangle;
		// 矩形遮罩的宽，即飞机剩余的血量占总数量的比
		private rectW: number;

		public constructor(BWidth: number, BHeight: number, allBlood: number) {
			super();
			
			this.bloodW = BWidth;
			this.bloodH = BHeight;
			this.rectW = BWidth;
			this.allBlood = allBlood;
			// 创建下层血条
			var bottomBlood: egret.Shape = new egret.Shape();
			bottomBlood.graphics.beginFill(0xCCCCCC);
			bottomBlood.graphics.drawRoundRect(0, 0, this.bloodW, this.bloodH, 20, this.bloodH);
			bottomBlood.graphics.endFill();
			this.addChild(bottomBlood);
			// 创建上层血条
			this.topBlood = new egret.Shape();
			this.topBlood.graphics.beginFill(0xFF0000);
			this.topBlood.graphics.drawRoundRect(0, 0, this.bloodW, this.bloodH, 20, this.bloodH);
			this.topBlood.graphics.endFill();
			this.addChild(this.topBlood);
			// 创建矩形遮罩
			this.maskObject = new egret.Rectangle(0, 0, this.rectW, this.bloodH);
			this.topBlood.mask = this.maskObject;
		}

		// 掉血
		public reduceBlood(restBlood: number): void {
			this.rectW = restBlood / this.allBlood * this.bloodW;
			this.maskObject.width = this.rectW;
			this.topBlood.mask = this.maskObject;
		}
	}
}