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

const NON_WATER_DAY_THRESHOLD = 3;
class FarmTile extends FarmObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        super(position, mapId);
        this.type = 'FarmTile';
        this.reset();
    }
    /**
     * @inheritdoc
     */
    onHitByTool(toolType, extraData) {
        let result = false;
        switch (toolType) {
            case ToolType.seedPack:
                if (this.hasSeed()) {
                    return false;
                }
                this.applySeed(extraData);
                result = true;
                break;
            case ToolType.wateringCan:
                this.applyWater();
                result = true;
                break;
            case ToolType.hoe:
                if (this.isTree()) return false;
                this.reset();
                this.refreshSprite();

                result = true;
                break;
            case ToolType.sickle:
                if (this.isTree()) return false;
                if (!this.isFullyGrownUp()) return false;
                const {sickleRequired} = this.seedData();
                if (!sickleRequired) return false;
                return this.harvest(ToolType.sickle);
                break;
            case ToolType.hammer:
                if (this.hasSeed()) return false;
                FarmManager.inst.getFarmlandById(this.mapId).removeObject(this);
                break;
            case ToolType.axe:
                if (!this.isTree()) return false;
                this.reset();
                this.refreshSprite();
                result = true;
                break;
        }
        return result;
    }
    /**
     * Get current seed data
     * @returns {StrFarmCrop}
     */
    seedData() {
        return FarmManager.getSeedData(this.seedId);
    }
    /**
     * Apply water on tile
     */
    applyWater() {
        this.isWatered = true;
        this.nonWaterDays = 0;
        this.refreshSprite();
    }
    /**
     * Apply Seed
     * @param {number} seedId 
     */
    applySeed(seedId) {
        this.seedId = seedId;
        const config = this.seedData();
        this.currentDays = 0;
        this.currentStage = 0;
        this.resetTimes = config.resetable ? config.resetTimes : 0;
        this.refreshSprite();
    }
    /**
     * Check if has plan seed or not
     * @returns {boolean}
     */
    hasSeed() {
        return this.seedId != null;
    }
    /**
     * Check if this is a tree
     */
    isTree() {
        if (!this.hasSeed()) return false;
        const { isTree } = this.seedData();
        return !!isTree;
    }
    /**
     * Reset Crop
     */
    reset() {
        this.seedId = null;
        this.isWatered = false;
        this.isDead = false;
        this.currentDays = -1;
        this.currentStage = -1;
        this.resetTimes = -1;
        this.nonWaterDays = -1;
    }
    /**
     * On Dead
     */
    onDead() {
        this.isDead = true;
    }
    /**
     * @inheritdoc
     */
    onNewDay() {
        if (!this.hasSeed()) return;
        if (this.isDead) return;
        const {nonWaterFlag, isTree} = this.seedData();
        const isGrownable = this.isWatered || nonWaterFlag || isTree;
        if (isGrownable) {
            this.growUp();
        } else {
            this.nonWaterDays += 1;
            if (this.nonWaterDays >= NON_WATER_DAY_THRESHOLD) {
                this.onDead();
            }
        }
        this.refreshSprite();
    }
    /**
     * Check if this crop is fully grown up.
     */
    isFullyGrownUp() {
        if (!this.hasSeed()) return false;
        const { stages } = this.seedData();
        return this.currentStage == stages.length;
    }
    /**
     * Grow Up
     */
    growUp(times = 1) {
        if (times == 0) return;
        if (!this.hasSeed()) return;
        const { stages, seasons } = this.seedData();
        if (seasons.includes(GameTime.season()) == false) {
            // If not the correct season for this crop then dead.
            if (this.isTree()) {
                this.resetToTargetedStage();
            } else {
                this.onDead();
            }
            return;
        }
        if (this.isFullyGrownUp()) return;
        const maxDays = stages[this.currentStage];
        this.currentDays += 1;
        if (this.currentDays >= maxDays) {
            this.currentStage += 1;
            this.currentDays = 0;
        }
        this.growUp(times - 1);
    }
    /**
     * Harvest crop / fruit from this object
     * @param {ToolType} toolType
     * @returns {boolean} true if can harvest
     */
    harvest(toolType = null) {
        console.log("Harvest ", toolType, this.seedId);
        if (this.isTree()) {
            this.resetToTargetedStage();
        } else {
            if (this.resetTimes > 0) {
                this.resetTimes -= 1;
                this.resetToTargetedStage();
            } else {
                this.reset();
            }
        }
        this.refreshSprite();
        return true;
    }
    /**
     * Reset tile to targeted stage
     */
    resetToTargetedStage() {
        this.currentStage = this.seedData().resetStageIndex;
        this.currentDays = 0;
    }
    /**
     * @inheritdoc
     */
    interactable() {
        if (!this.isFullyGrownUp()) return false;
        const { sickleRequired } = this.seedData();
        return !sickleRequired;
    }
    /**
     * @inheritdoc
     */
    onInteract() {
        this.harvest();
    }
    /**
     * @inheritdoc
     */
    isCollidable() {
        if (!this.hasSeed()) return false;
        return this.seedData().isCollidable;
    }
    /**
     * @inheritdoc
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
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmTile;
    }

}