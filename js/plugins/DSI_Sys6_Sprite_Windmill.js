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

class Sprite_Windmill extends Sprite_FarmConstruction {
    /**
     * @inheritdoc
     */
    createOptionalSprites() {
        super.createOptionalSprites();
        this._wingSprite = new Sprite(ImageManager.loadFarm('constructions/Wings'));
        this._wingSprite.anchor.x = 0.5;
        this._wingSprite.anchor.y = 0.5;
        this._wingSprite.y -= 190;
        this._wingSprite.x += 48;
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
        this._wingSprite.angle += 1;
    }
    /**
     * @inheritdoc
     */
    removeOptionalSprites() {
        super.removeOptionalSprites();
        this.removeChild(this._wingSprite);
    }
}

class Sprite_Fermenter extends Sprite_FarmConstruction {
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