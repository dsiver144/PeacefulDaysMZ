const GaugeConfig = {
    path: "img/menus/"
}

/** @interface */
class GagueTrackOptions {
    constructor() {
        /** @type {any} */
        this.object = null;
        /** @type {string} */
        this.currentProperty = null;
        /** @type {string} */
        this.maxProperty = null;
        /** @type {string} */
        this.gaugeBG = null;
        /** @type {string} */
        this.gaugeFill = null;
        /** @type {number[]} */
        this.gaugeFillOffsets = null;
    }
}

class Sprite_MyGauge extends Sprite {
    /** 
     * Handle Gauge 
     * @param {GagueTrackOptions} trackOptions
     */
    constructor(trackOptions) {
        super();
        this._trackOption = trackOptions;
        /** @type {number} */
        this._currentValue = -1;
        /** @type {number} */
        this._maxValue = -1;
        /** @type {number} */
        this._ratio = 0.0;
        /** @type {Sprite} */
        this._gaugeBG = new Sprite(ImageManager.loadBitmap(GaugeConfig.path, this._trackOption.gaugeBG));
        /** @type {Sprite} */
        this._gaugeFill = new Sprite(ImageManager.loadBitmap(GaugeConfig.path, this._trackOption.gaugeFill));
        this.addChild(this._gaugeBG);
        this._gaugeBG.addChild(this._gaugeFill);
        this._gaugeBG.visible = false;
        this.refreshProperties();
    }
    /**
     * Refresh maxProperty
     */
    refreshProperties() {
        const {object, currentProperty, maxProperty} = this._trackOption;
        let sameCounter = 0;
        if (object[currentProperty] == this._currentValue) sameCounter += 1;
        if (typeof maxProperty === 'string' && object[maxProperty] == this._maxValue) sameCounter += 1;
        if (sameCounter >= 2) return;
        this._currentValue = object[currentProperty];
        this._maxValue = typeof maxProperty === 'string' ? object[maxProperty] : maxProperty; 
        this._ratio = this._currentValue / this._maxValue;
        this.refreshDisplay();
    }
    /**
     * Refresh display
     */
    refreshDisplay() {
        const gaugeFillOffsets = this._trackOption.gaugeFillOffsets || [3, 3];
        this._gaugeFill.bitmap.addLoadListener((bitmap) => {
            this._gaugeFill.setFrame(0, 0, bitmap.width * this._ratio, bitmap.height);
            this._gaugeBG.visible = true;
            this.width = this._gaugeBG.width;
            this.height = this._gaugeBG.height;
        });
        this._gaugeFill.x = gaugeFillOffsets[0];
        this._gaugeFill.y = gaugeFillOffsets[1];
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.refreshProperties();
    }
}

