//=======================================================================
// * Plugin Name  : DSI_Sys5_FarmHouse.js
// * Last Updated : 10/8/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param testParam:number
 * @text Test Param
 * @type number
 * @default 144
 * @desc A Test Param
 * 
 */
/*~struct~PositionObject:
 * @param x:num
 * @text x
 * @desc X position
 * 
 * @param y:num
 * @text y
 * @desc Y Position
 *
 */
/*~struct~SoundEffect:
 * @param name:str
 * @text name
 * @type file
 * @dir audio/se/
 * @desc Choose the name of SE you want to use.
 *
 * @param volume:num
 * @text volume
 * @default 70
 * @desc Choose the volume value of the se
 * 
 * @param pitch:num
 * @text pitch
 * @default 100
 * @desc Choose the pitch value of the se
 * 
 * @param pan:num
 * @text pan
 * @default 0
 * @desc Choose the pan value of the se
 * 
 */

class FarmHouse extends Building {
    /**
     * @inheritdoc
     */
    init() {

    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return { x: 9, y: 5 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 288,
            height: 288
        }
    }
    /**
     * @inheritdoc
     */
    interactTextKey() {
        return 'Lb_Open';
    }
    /**
     * @inheritdoc
     */
    displayAnchor() {
        return {x: 0.0, y: 0.65};
    }
    /**
     * Get interaction range
     * @returns {Rectangle}
     */
    interactionRange() {
        const {x, y} = this.position;
        return { x: x + 2, y: y + 4, width: 1, height: 1 };
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "FarmHouse";
    }
}