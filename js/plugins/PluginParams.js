
class PluginParams {
   constructor() {
		/** @type {StrFarmCrop[]} */
		this.seedConfig = null;
		/** @type {number[]} */
		this.farmRegionIds = null;
		/** @type {number[]} */
		this.farmMaps = null;
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
class SoundEffect {
   constructor() {
		/** @type {string} */
		this.name = null;
		/** @type {number} */
		this.volume = null;
		/** @type {number} */
		this.pitch = null;
		/** @type {number} */
		this.pan = null;
	}
}
class StrFarmCrop {
   constructor() {
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
		/** @type {number[]} */
		this.seasons = null;
		/** @type {string} */
		this.imageFile = null;
	}
}