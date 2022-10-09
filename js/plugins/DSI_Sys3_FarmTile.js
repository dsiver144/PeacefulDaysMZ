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
                if (!this.isFullyGrownUp() && !this.isSeedStage()) {
                    this.reset();
                    this.refreshSprite();
                    return true;
                }
                const { sickleRequired } = this.seedData();
                if (!sickleRequired) return false;
                return this.harvest(ToolType.sickle);
                break;
            case ToolType.hammer:
                if (this.hasSeed()) return false;
                this.removeSelf();
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
            this.removeSelf();
        } else {
            this.shakeSprite(0.05);
        }
        Input.rumble();
    }
    /**
     * Get current seed data
     * @returns {SeedConfig}
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
        this.refreshSprite('soil');
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
        const { treeFlag } = this.seedData();
        return !!treeFlag;
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
        const { waterfieldFlag, treeFlag } = this.seedData();
        const isGrownable = isWatered || waterfieldFlag || treeFlag;
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
        if (this.isDead()) return false;
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
        if (MyUtils.DEBUG.seasonHack) return;
        const { seasons } = this.seedData();
        if (!seasons) return;
        if (seasons.includes(GameTime.season())) return;
        if (this.isTree()) {
            this.resetToTargetedStage();
        } else {
            this.onDead();
        }
    }
    /**
     * Check if this can be harvested
     * @returns {boolean}
     */
    harvestable(toolType) {
        if (!this.hasSeed()) return false;
        const { productID, sickleRequired } = this.seedData();
        if (this.isDead()) {
            return false;
        }
        if (sickleRequired && toolType != ToolType.sickle) {
            return false;
        }
        if (!productID) {
            return false;
        }
        return this.isFullyGrownUp();
    }
    /**
     * Harvest crop / fruit from this object
     * @param {ToolType} toolType
     * @returns {boolean} true if can harvest
     */
    harvest(toolType = null) {
        if (!this.harvestable(toolType)) {
            return false;
        }
        const { productID } = this.seedData();
        console.log("Harvest ", productID, toolType, this.seedId);
        const number = 1;
        const leftover = MyBag.inst.addItem(productID, number, false);
        if (leftover) {
            return false;
        }
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
        this._interactionType = null;
        if (this.harvestable(ToolManager.inst.equippedTool()?.getType())) {
            this._interactionType = 'Harvest';
            return true;
        }
        if (this.hasSeed()) {
            if (this.isTree()) {
                if (ToolManager.inst.isEquipped(ToolType.axe)) {
                    this._interactionType = 'ChopTree';
                    return true;
                }
            } else {
                const isSeedStage = this.isSeedStage();
                if (isSeedStage) {
                    if (ToolManager.inst.isEquipped(ToolType.hoe)) {
                        this._interactionType = 'ClearSeed';
                        return true;
                    }
                } else {
                    if (ToolManager.inst.isEquipped(ToolType.sickle)) {
                        this._interactionType = 'ClearCrop';
                        return true;
                    }
                }
            }
        } else {
            if (ToolManager.inst.isEquipped(ToolType.seedPack)) {
                this._interactionType = 'Seed';
                return true;
            }
            if (ToolManager.inst.isEquipped(ToolType.sapling)) {
                this._interactionType = 'Sapling';
                return true;
            }
            if (ToolManager.inst.isEquipped(ToolType.hammer)) {
                this._interactionType = 'Hammer';
                return true;
            }
        }
        if (!this.isTree() && !this.isWatered && ToolManager.inst.isEquipped(ToolType.wateringCan)) {
            this._interactionType = 'Watering';
            return true;
        }
        // if (this.isDead() && ToolManager.inst.isEquipped(ToolType.sickle)) return true;
        // if (!this.isFullyGrownUp()) return false;
        // const { sickleRequired } = this.seedData();
        // if (sickleRequired) {
        //     return ToolManager.inst.isEquipped(ToolType.sickle)
        // }
        return false;
    }
    /**
     * @inheritdoc
     */
    onEnterInteractRange() {
        switch (this._interactionType) {
            case 'Watering':
                Sprite_InteractionHint.inst.setTarget("Lb_WateringPlant", FieldKeyAction.UseTool);
                break;
            case 'Hammer':
                Sprite_InteractionHint.inst.setTarget("Lb_RemoveDirt", FieldKeyAction.UseTool);
                break;
            case 'Seed':
                Sprite_InteractionHint.inst.setTarget("Lb_SowSeed", FieldKeyAction.UseTool);
                break;
            case 'Sapling':
                Sprite_InteractionHint.inst.setTarget("Lb_PlantSapling", FieldKeyAction.UseTool);
                break;
            case 'ChopTree':
                Sprite_InteractionHint.inst.setTarget("Lb_ChopTree", FieldKeyAction.UseTool);
                break;
            case 'ClearSeed':
                Sprite_InteractionHint.inst.setTarget("Lb_ClearSeed", FieldKeyAction.UseTool);
                break;
            case 'ClearCrop':
                Sprite_InteractionHint.inst.setTarget("Lb_ClearCrop", FieldKeyAction.UseTool);
                break;
            case 'Harvest':
                const { sickleRequired } = this.seedData();
                const keyAction = sickleRequired ? FieldKeyAction.UseTool : FieldKeyAction.Check;
                Sprite_InteractionHint.inst.setTarget("Lb_Harvest", keyAction);
                break;
        }
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