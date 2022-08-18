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
class Coop extends FarmConstruction {
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
            height: 128
        }
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        return { x: 1, y: 1, width: 1, height: 1 };
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "Coop";
    }
}