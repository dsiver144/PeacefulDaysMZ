/** @interface */
class GagueTrackOptions {
    constructor() {
        /** @type {any} */
        this.object = null;
        /** @type {string} */
        this.currentProperty = null;
        /** @type {string} */
        this.maxProperty = null;
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
        this.refreshProperties();
        this.refresh();
    }
    /**
     * Refresh maxProperty
     */
    refreshProperties() {
        const {object, currentProperty, maxProperty} = this._trackOption;
        if (object[currentProperty] == this._currentValue && object[maxProperty] == this._maxValue) return;
        this._currentValue = object[currentProperty];
        this._maxValue = object[maxProperty];
        this._ratio = this._currentValue / this._maxValue;
        this.refresh();
    }
    /**
     * Refresh display
     */
    refreshDisplay() {
        
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.refreshProperties();
    }
}

