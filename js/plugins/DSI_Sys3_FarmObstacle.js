//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmObstacle.js
// * Last Updated : 7/26/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Farm Obstacle
 * @help 
 * Empty Help
 * 
 */

const FarmObjectConfig = {
    defaultHP: 1,
}

class FarmObstacle extends FarmObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
     constructor(position, mapId) {
        super(position, mapId);
        this.init();
    }
    /**
     * Image File
     * @returns {string}
     */
    imageFile() {
        return "objects/"
    }
    /**
     * Get Image Rect 
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 32,
            height: 32
        }
    }
    /**
     * Display Offset
     * @returns {Vector2}
     */
    displayOffset() {
        return {
            x: 0,
            y: 0,
        }
    }
    /**
     * @inheritdoc
     */
    isCollidable() {
        return true;
    }
    /**
     * Save properties
     */
    saveProperties() {
        const props = super.saveProperties();
        return props.concat([
            ['hp', 0]
        ]);
    }
    /**
     * Init object
     */
    init() {
        this.type = this.constructor.name;
        this.hp = this.totalHp();
    }
    /**
     * Total Hp
     * @returns {number}
     */
    totalHp() {
        return FarmObjectConfig.defaultHP;
    }
    /**
     * On Damage
     */
    onDamage() {
        // PTD: Power affect by tool
        const power = 1;
        this.hp -= power;
        console.log(this.type, ' has been damage. HP: ' + this.hp);
        if (this.hp <= 0) {
            this.onBreak();
        }
    }
    /**
     * On Break
     */
    onBreak() {
        // Player gain resource when breaking object
        console.log(this.type, ' has been broken.');
    }
    /**
     * On Interact
     * @param {FarmObject} object
     */
    onInteract(object) {
        // Player pick up the obstacle
        console.log('You picked up', this.type);
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmObstacle;
    }
}

class OSmallStone extends FarmObstacle {
    /**
     * @inheritdoc
     */
    interactable() {
        return true;
    }
    /**
     * @inheritdoc
     */
    init() {
        super.init();
    }
    /**
     * @inheritdoc
     */
    hittingTools() {
        return [ToolType.hammer];
    }
    /**
     * @inheritdoc
     */
    onHitByTool(toolType) {
        this.onDamage();
    }
    /**
     * @inheritdoc
     */
    totalHp() {
        return 1;
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "FarmObstacles0";
    }

}

class OHugeStone extends FarmObstacle {
    /**
     * @inheritdoc
     */
    interactable() {
        return false;
    }
    /**
     * @inheritdoc
     */
    init() {
        super.init();
    }
    /**
     * @inheritdoc
     */
    hittingTools() {
        return [ToolType.hammer];
    }
    /**
     * @inheritdoc
     */
    onHitByTool(toolType) {
        this.onDamage();
    }
    /**
     * @inheritdoc
     */
    totalHp() {
        return 3;
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "$Stone_Lumber_BIG_1";
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 64,
            height: 64
        }
    }
    /**
     * @inheritdoc
     */
    displayOffset() {
        return {
            x: 0,
            y: -12
        }
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return {
            x: 2, 
            y: 2
        }
    }
}