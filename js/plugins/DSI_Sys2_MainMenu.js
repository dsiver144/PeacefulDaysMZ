//=======================================================================
// * Plugin Name  : DSI_Sys2_MainMenu.js
// * Last Updated : 7/29/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Main Menu
 * @help 
 * Empty Help
 * 
 */
class Scene_MainMenu extends Scene_MenuBase {
    /**
     * Main Menu Container
     */
    create() {
        this._backgroundEnabled = this.backgroundEnabled();
        super.create();
        this.createAllObjects();
    }
    /**
     * Create all neccessary objects
     */
    createAllObjects() {
        const button1 = new Sprite_KeyHint(MenuKeyAction.Confirm);
        button1.setImage(null, 0);
        const button2 = new Sprite_KeyHint(MenuKeyAction.Cancel);
        button2.setImage(null, 0);

        this.addChild(button1);
        this.addChild(button2);
        button1.x = 100;
        button1.y = 100;
        button2.x = 400;
        button2.y = 100;
    }
    /**
     * Check if background scolling is enabled
     * @returns {boolean}
     */
    backgroundEnabled() {
        return true;
    }
    /**
     * Create background
     */
    createBackground() {
        if (!this._backgroundEnabled) {
            return super.createBackground();
        }
        this._backgroundSprite = new TilingSprite();
        this._backgroundSprite.bitmap = ImageManager.loadMenu('BGLoop');
        this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
        this.addChild(this._backgroundSprite);
    }
    /**
     * Update control
     */
    updateControl() {
        if (Input.isTriggered(FieldKeyAction.Menu) || Input.isTriggered(FieldKeyAction.Cancel)) {
            if (this.canReturnToMap()) {
                this.returnToMap();
            } else {
                SoundManager.playBuzzer();
            }
        }
    }
    /**
     * Check if player can return to map scene
     * @returns {boolean}
     */
    canReturnToMap() {
        return true;
    }
    /**
     * Return to map function
     */
    returnToMap() {
        SoundManager.playOk();
        this.popScene();
    }
    /**
     * Update all sprites
     */
    updateSprites() {
        this.updateBackground();
    }
    /**
     * Update background sprite
     */
    updateBackground() {
        if (!this._backgroundEnabled) {
            return;
        }
        this._backgroundSprite.origin.x += 0.5;
        this._backgroundSprite.origin.y += 0.5;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateControl();
        this.updateSprites();
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

Scene_Map.prototype.callMenu = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_MainMenu);
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};