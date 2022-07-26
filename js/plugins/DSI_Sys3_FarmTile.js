//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmTile.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Farm Tile
 * @help 
 * Empty Help
 */
class FarmTile extends FarmObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
     constructor(position, mapId) {
        super(position, mapId);
        this.type = 'FarmTile';
    }
    /**
     * Set Seed
     * @param {number} seedId 
     */
    setSeed(seedId) {
        this.seedId = seedId;
        this.currentDays = 0;
        this.currentStage = 0;
    }
    /**
     * Check if has plan seed or not
     * @returns {boolean}
     */
    hasSeed() {
        return !!this.seedId;
    }
    /**
     * Reset Crop
     */
    reset() {
        this.seedId = null;
        this.isWatered = false;
        this.isDead = false;
        this.currentDays = 0;
        this.currentStage = 0;
        this.resetTimes = 0;
        this.nonWaterDays = 0;
    }
    /**
     * On New Day
     */
    onNewDay() {
        const isWatered = this.isWatered;
        if (isWatered) {
            this.growUp();
        }
    }
    /**
     * Check if this crop is fully grown up.
     */
    isFullyGrownUp() {
        if (!this.hasSeed()) return;
        const {stages} = FarmManager.getSeedData(this.seedId);
        return this.currentStage == stages.length;
    }
    /**
     * Grow Up
     */
    growUp(times = 1) {
        if (times == 0) return;
        if (this.isFullyGrownUp()) return;
        const {stages} = FarmManager.getSeedData(this.seedId);
        const maxDays = stages[this.currentStage];
        this.currentDays += 1;
        if (this.currentDays >= maxDays) {
            this.currentStage += 1;
            this.currentDays = 0;
        }
        this.growUp(times - 1);
    }
    /**
     * On Interact with crop
     */
    onInteract() {
        if (!this.isFullyGrownUp()) return;
        console.log("Harvest ", this.seedId);
    }
    /**
     * Overwrite: saveProperties
     */
    saveProperties() {
        const props = super.saveProperties();
        const newProps = [
            ['seedId', null],
            ['isWatered', null],
            ['nonWaterDays', 0],
            ['isDead', null],
            ['currentDays', 0],
            ['currentStage', 0],
            ['resetTimes', 0]
        ];
        return props.concat(newProps);
    }

}