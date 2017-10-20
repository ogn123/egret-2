module fighter {
	/*
	 * 创建子弹
	*/
	export class Bullet extends egret.Bitmap {
		private static cacheDict: Object = {};

		// 当前子弹的攻击力
		private aggressivity: number;

		/*生产*/
		public static produce(textureName: string, aggressivity: number): fighter.Bullet {
			if (fighter.Bullet.cacheDict[textureName] == null)
				fighter.Bullet.cacheDict[textureName] = [];
			var dict: fighter.Bullet[] = fighter.Bullet.cacheDict[textureName];
			var bullet: fighter.Bullet;
			if (dict.length > 0) {
				bullet = dict.pop();
			} else {
				bullet = new fighter.Bullet(RES.getRes(textureName), aggressivity);
			}
			bullet.textureName = textureName;
			bullet.pixelHitTest = true;
			bullet.aggressivity = aggressivity;
			return bullet;
		}
		/*回收*/
		public static reclaim(bullet: fighter.Bullet, textureName: string): void {
			if (fighter.Bullet.cacheDict[textureName] == null)
				fighter.Bullet.cacheDict[textureName] = [];
			var dict: fighter.Bullet[] = fighter.Bullet.cacheDict[textureName];
			if (dict.indexOf(bullet) == -1)
				dict.push(bullet);
		}

		public textureName: string;

		public constructor(texture: egret.Texture, aggressivity: number) {
			super(texture);
		}
	}
}