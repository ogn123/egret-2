module fighter {
	/*
	 * 分数
	*/
	export class ScorePanel extends egret.DisplayObjectContainer {

		private tx: egret.TextField;

		public constructor() {
			super();
			var scoreBg: egret.Bitmap = new egret.Bitmap(RES.getRes('show_score_box_png'));
			this.addChild(scoreBg);

			// gameover
			var gameover: egret.Bitmap = new egret.Bitmap(RES.getRes('gameover_png'));
			this.addChild(gameover);
			gameover.scaleX = .5;
			gameover.scaleY = .4;
			gameover.x = (scoreBg.width - gameover.width * gameover.scaleX) / 2;
			gameover.y = 30;

			this.tx = new egret.TextField();
			this.tx.width = scoreBg.width;
			this.tx.height = scoreBg.height;
			this.tx.size = 24;
			this.tx.textAlign = 'center';
			this.tx.y = 80;
			this.tx.lineSpacing = 6;
			this.addChild(this.tx);
		}
		
		// 显示分数
		public showType(value: number) {
			this.tx.text = '您当前的分数是\n' + value + '\n重来一局？';
		}
	}
}