//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_Windmill.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Windmill
 * @help 
 * Empty Help
 */

const WindmillConfig = {
    wingOffset: {x: 48, y: -190},
    wingSpeed: 1
}

class Sprite_Windmill extends Sprite_FarmBuilding {
    /**
     * @inheritdoc
     */
    createOptionalSprites() {
        super.createOptionalSprites();
        this._wingSprite = new Sprite(ImageManager.loadFarm('constructions/Wings'));
        this._wingSprite.anchor.x = 0.5;
        this._wingSprite.anchor.y = 0.5;
        this._wingSprite.x += WindmillConfig.wingOffset.x;
        this._wingSprite.y += WindmillConfig.wingOffset.y;
        this.addChild(this._wingSprite);
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updateWingAnimation();
    }
    /**
     * Update wing animation
     */
    updateWingAnimation() {
        this._wingSprite.angle += WindmillConfig.wingSpeed;
    }
    /**
     * @inheritdoc
     */
    removeOptionalSprites() {
        super.removeOptionalSprites();
        this.removeChild(this._wingSprite);
    }
}

class Sprite_Fermenter extends Sprite_FarmBuilding {
    /**
     * Get machine
     * @returns {FarmMachine}
     */
    get machine() {
        return this.farmObject;
    }
    update() {
        super.update();
        if (this.machine.activeTask) {
            console.log(this.machine.activeTask.progressRate());
        }
    }
}