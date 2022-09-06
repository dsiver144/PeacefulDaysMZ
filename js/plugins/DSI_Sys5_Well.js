//=======================================================================
// * Plugin Name  : DSI_Sys5_Coop.js
// * Last Updated : 8/18/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) The Well
 * @help 
 * Empty Help
 */
class TheWell extends Building {
    /**
     * @inheritdoc
     */
    init() {

    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return { x: 2, y: 1 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 64,
            height: 96
        }
    }
    /**
     * @inheritdoc
     */
    animationFrames() {
        return 2;
    }
    /**
     * @inheritdoc
     */
    onHitByTool(toolType, extraData) {
        let result = false;
        switch (toolType) {
            case 'wateringCan':
                console.log("Refill ", toolType);
                result = true;
                break;
        }
        return result;
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        return { x: 0, y: 0, width: 2, height: 1 };
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "TheWell";
    }
}