//=======================================================================
// * Plugin Name  : DSI_Sys5_Windmill.js
// * Last Updated : 8/18/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Windmill
 * @help 
 * Empty Help
 */
class Windmill extends Building {
    /**
     * @inheritdoc
     */
    init() {

    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return { x: 3, y: 2 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 96,
            height: 224
        }
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        const { x, y } = this.position;
        return { x: x + 1, y: y + 1, width: 1, height: 1 };
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
    imageFile() {
        return super.imageFile() + "Windmill";
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_Windmill;
    }
}