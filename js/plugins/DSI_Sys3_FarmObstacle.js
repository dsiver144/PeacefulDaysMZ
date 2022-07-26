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
        this.hp = this.totalHp();
    }
    /**
     * Image File
     * @returns {string}
     */
    imageFile() {
        return "objects/"
    }
    /**
     * Save properties
     */
    saveProperties() {
        return [
            ['hp', 0]
        ]
    }
    /**
     * Init object
     */
    init() {
        this.type = 'FarmObstacle';
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
     */
    onInteract() {
        // Player pick up the obstacle
        console.log('You picked up', this.type);
    }
}

class OSmallStone extends FarmObstacle {

    init() {
        this.type = 'OSmallStone';
    }

    hittingTools() {
        return [TOOL_TYPE.hammer];
    }

    onHitByTool(toolType) {
        this.onDamage();
    }

    totalHp() {
        return 1;
    }

    imageFile() {
        return super.imageFile() + "FarmObstacles0";
    }

}