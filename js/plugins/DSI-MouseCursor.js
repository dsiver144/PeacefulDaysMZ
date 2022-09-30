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

const MouseParams = PluginManager.parameters('DSI-MouseCursor');
MouseParams.fadeDuration = Number(MouseParams.fadeDuration);
MouseParams.hoverTextOffset = [-32, -32];

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
        this.bitmap = ImageManager.loadSystem(MouseParams.cursorImage || "Cursor");
        this.fadeCount = 0;
        this.createHoverText();
    }
    /**
     * Create hover text
     */
    createHoverText() {
        const hoverStyle = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 12,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 510
        });
        const hover = new PIXI.Text("", hoverStyle);
        this.addChild(hover);
        this.hoverText = hover;
    }
    /**
     * Set Hover Text
     * @param {string} str 
     */
    setHoverText(str) {
        this.hoverText.text = str;
    }
    /**
     * Clear hover text
     */
    clearHoverText() {
        this.setHoverText("");
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updatePosition();
        this.updateHoverText();
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
            if (this.fadeCount >= 60 * MouseParams.fadeDuration) {
                this.opacity -= 5;
            }
        }
    }
    /**
     * Update hover text
     */
    updateHoverText() {
        this.hoverText.x = MouseParams.hoverTextOffset[0];
        this.hoverText.y = MouseParams.hoverTextOffset[1];
    }
}

var MouseCursor = new Sprite_Mouse();

var DSI_MouseCursor_Graphics__createPixiApp = Graphics._createPixiApp;
Graphics._createPixiApp = function (stage) {
    DSI_MouseCursor_Graphics__createPixiApp.call(this, stage);
    this._app.render = function () {
        this.stage.addChild(MouseCursor);
        this.renderer.render(this.stage);
        this.stage.removeChild(MouseCursor);
    }
    this._app.ticker.add(() => {
        MouseCursor.update();
    })
}

