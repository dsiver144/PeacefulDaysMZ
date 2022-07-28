
class PluginParams {
   constructor() {
		/** @type {StrFarmCrop[]} */
		this.seedConfig = null;
		/** @type {StrFarmCrop[]} */
		this.treeConfig = null;
		/** @type {number[]} */
		this.farmRegionIds = null;
		/** @type {number[]} */
		this.farmMaps = null;
	}
}
class StrFarmCrop {
   constructor() {
		/** @type {number} */
		this.itemPreview = null;
		/** @type {string} */
		this.seedItemID = null;
		/** @type {string} */
		this.productID = null;
		/** @type {number[]} */
		this.stages = null;
		/** @type {boolean} */
		this.resetable = null;
		/** @type {number} */
		this.resetStageIndex = null;
		/** @type {number} */
		this.resetTimes = null;
		/** @type {boolean} */
		this.sickleRequired = null;
		/** @type {boolean} */
		this.isTree = null;
		/** @type {boolean} */
		this.isCollidable = null;
		/** @type {boolean} */
		this.nonWaterFlag = null;
		/** @type {number[]} */
		this.seasons = null;
		/** @type {string} */
		this.imageFile = null;
	}
}
class PositionObject {
   constructor() {
		/** @type {number} */
		this.x = null;
		/** @type {number} */
		this.y = null;
	}
}