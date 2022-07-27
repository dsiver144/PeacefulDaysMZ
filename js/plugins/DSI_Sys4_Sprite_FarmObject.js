//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_FarmObject.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Farm Object
 * @help 
 * Empty Help
 */

class Sprite_FarmObject extends Sprite {
    /**
     * A class that handle farm object display.
     * @param {FarmObject} farmObject
     */
    constructor(farmObject) {
        super();
        this.farmObject = farmObject;
        this.bitmap = ImageManager.loadFarm("Soil");
        this.setFrame(0, 0, 32, 32);

        this._priorityType = 1;
        this.updatePosition();
    }

    update() {
        super.update();
        this.updatePosition();
    }

    updatePosition() {
        this.x = this.screenX();
        this.y = this.screenY();
        this.z = this.screenZ();
    }

    displayX() {
        return this.farmObject.position.x;
    }

    displayY() {
        return this.farmObject.position.y;
    }

    scrolledX() {
        return $gameMap.adjustX(this.displayX());
    }
    
    scrolledY() {
        return $gameMap.adjustY(this.displayY());
    }

    screenX() {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw);
    }
    
    screenY() {
        const th = $gameMap.tileHeight();
        return Math.floor(
            this.scrolledY() * th
        );
    }
    
    screenZ() {
        return this._priorityType * 2 + 1;
    }
}