//=======================================================================
// * Plugin Name  : DSI-MouseCursor.js
// * Last Updated : 4/8/2022
//========================================================================
/*:
* @author dsiver144
* @plugindesc (v1.1) A custom menu cursor by dsiver144.
* @help 
* Replace default cursor image with a custom one.
* 
* @param cursorImage
* @type file
* @dir img/system/
* @default Cursor
* @desc Select cursor image file. (48x48)
* 
* @param fadeDuration
* @type number
* @desc Mouse will fade out in x seconds
* @default 4
* 
*/
(function () {

    const params = PluginManager.parameters('DSI-MouseCursor');
    params.fadeDuration = Number(params.fadeDuration);

    const styleParent = document.getElementsByTagName('head')[0];
    const emptyStyle = document.createElement('style');
    emptyStyle.type = 'text/css';
    emptyStyle.innerHTML = 'body { cursor: none; }';
    // Hide default cursor.
    styleParent.appendChild(emptyStyle);
    class Sprite_Mouse extends Sprite {
        /**
         * Sprite Mouse
         */
        constructor() {
            super();
            this.bitmap = ImageManager.loadSystem(params.cursorImage || "Cursor");
            this.fadeCount = 0;
        }
        /**
         * @inheritdoc
         */
        update() {
            super.update();
            this.updatePosition();
        }
        /**
         * Update position
         */
        updatePosition() {
            this.x = TouchInput.x || 0;
            this.y = TouchInput.y || 0;
            if (this.x != this.lastX || this.y != this.lastY) {
                this.lastX = this.x;
                this.lastY = this.y;
                this.fadeCount = 0;
                this.opacity = 255;
            } else {
                this.fadeCount += 1;
                if (this.fadeCount >= 60 * params.fadeDuration) {
                    this.opacity -= 5;
                }
            }
        }

    }

    const customMouseSprite = new Sprite_Mouse();

    var DSI_MouseCursor_Graphics__createPixiApp = Graphics._createPixiApp;
    Graphics._createPixiApp = function (stage) {
        DSI_MouseCursor_Graphics__createPixiApp.call(this, stage);
        this._app.render = function () {
            this.stage.addChild(customMouseSprite);
            this.renderer.render(this.stage);
            this.stage.removeChild(customMouseSprite);
        }
        this._app.ticker.add(() => {
            customMouseSprite.update();
        })
    }

})();
