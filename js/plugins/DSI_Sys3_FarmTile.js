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
        this.reset();
    }
    /**
     * @inheritdoc
     */
    onHitByTool(toolType, extraData) {
        let result = false;
        switch (toolType) {
            case ToolType.seedPack: 
            case ToolType.sapling:
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
                if (!this.isSeedStage()) return false;
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
                this.onHitByAxe();
                result = true;
                break;
        }
        return result;
    }
    /**
     * Hit By Axe
     */
    onHitByAxe() {
        const power = 25;
        this.hp -= power;
        if (this.hp <= 0) {
            this.reset();
            this.refreshSprite();
        } else {
            this.shakeSprite(0.05);
        }
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
        if (this.isTree()) {
            this.hp = FarmConfig.treeHP;
        }
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
     * Check if the crop is still in seed / sapling stage.
     * @returns {boolean}
     */
    isSeedStage() {
        return this.currentStage == 0;
    }
    /**
     * Check if the crop is dead
     * @returns {boolean}
     */
    isDead() {
        return this.death;
    }
    /**
     * Reset tile
     */
    reset() {
        this.seedId = null;
        this.death = false;
        this.currentDays = -1;
        this.currentStage = -1;
        this.resetTimes = -1;
        this.nonWaterDays = -1;
        this.hp = 0;
    }
    /**
     * On Dead
     */
    onDead() {
        if (this.isSeedStage()) {
            this.reset();
            return;
        }
        this.death = true;
    }
    /**
     * @inheritdoc
     */
    onNewDay() {
        const isWatered = MyUtils.DEBUG.waterHack || this.isWatered;
        this.isWatered = false;
        if (!this.hasSeed()) return;
        if (this.isDead()) return;
        const {nonWaterFlag, isTree} = this.seedData();
        const isGrownable = isWatered || nonWaterFlag || isTree;
        if (isGrownable) {
            this.growUp();
        } else {
            this.nonWaterDays += 1;
            if (this.nonWaterDays >= FarmConfig.nonWaterDayThreshold) {
                this.onDead();
            }
        }
        this.seasonCheck();
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
        if (this.isFullyGrownUp()) return;
        const { stages } = this.seedData();
        const maxDays = stages[this.currentStage];
        this.currentDays += 1;
        if (this.currentDays >= maxDays) {
            this.currentStage += 1;
            this.currentDays = 0;
        }
        this.growUp(times - 1);
    }
    /**
     * Season Check
     */
    seasonCheck() {
        if (!this.hasSeed()) return;
        if (this.isDead()) return;
        const { seasons } = this.seedData();
        if (seasons.includes(GameTime.season())) return;
        if (this.isTree()) {
            this.resetToTargetedStage();
        } else {
            this.onDead();
        }
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
     * On Interact
     * @param {FarmObject} object
     */
    onInteract(object) {
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
            ['death', null],
            ['currentDays', 0],
            ['currentStage', 0],
            ['resetTimes', 0],
            ['hp', 100],
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