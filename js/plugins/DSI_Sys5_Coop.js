//=======================================================================
// * Plugin Name  : DSI_Sys5_Coop.js
// * Last Updated : 8/18/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Coop
 * @help 
 * Empty Help
 */
class Coop extends Building {
    /**
     * @inheritdoc
     */
    init() {

    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return { x: 5, y: 2 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 160,
            height: 192
        }
    }
    /**
     * @inheritdoc
     */
    displayAnchor() {
        return {x: 0.0, y: 0.65};
    }
    /**
     * @inheritdoc
     */
    collisionCondition(x, y) {
        return !(x == 1 && y == 1);
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        return { x: 1, y: 0, width: 1, height: 1 };
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "Coop";
    }
}