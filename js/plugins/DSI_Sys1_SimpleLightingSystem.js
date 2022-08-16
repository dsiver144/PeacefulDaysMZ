//=======================================================================
// * Plugin Name  : DSI_Sys1_SimpleLightingSystem.js
// * Last Updated : 8/15/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Lighting System for MZ inspired by Khas
 * @help 
 * Empty Help
 */
const fragmentSrc = `

    varying vec2 vTextureCoord;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform sampler2D uSampler;
    uniform vec4 ambientLight;

    void main(void) {
        vec4 light = texture2D(uSampler, vTextureCoord);
        gl_FragColor = light + ambientLight;
    }
`;

var DSI_SimpleLight_Graphics__createPixiApp = Graphics._createPixiApp;
// Credit to Khas
Graphics._createPixiApp = function () {
    DSI_SimpleLight_Graphics__createPixiApp.call(this);
    if (typeof PIXI.BLEND_MODES != 'undefined') {
        const renderer = this.app.renderer;
        var gl = renderer.gl;
        PIXI.BLEND_MODES.KHAS_LIGHT = 90;
        PIXI.BLEND_MODES.KHAS_LIGHTING = 91;
        renderer.state.blendModes[PIXI.BLEND_MODES.KHAS_LIGHT] = [gl.SRC_ALPHA, gl.ONE];
        renderer.state.blendModes[PIXI.BLEND_MODES.KHAS_LIGHTING] = [gl.ZERO, gl.SRC_COLOR];
    } else {
        throw new PixiOutOfDateError();
    };
};

class LightingFilter extends PIXI.Filter {
    /**
     * This class handle lighting filter
     */
    constructor() {
        super(ShaderUtils.defaultVertexShaderSrc(), fragmentSrc);
        this.uniforms.u_time = 0;
        this.setResolution();
    }
    /**
     * Set resolution
     */
    setResolution() {
        this.uniforms.u_resolution = {};
        this.uniforms.u_resolution.x = Graphics.width;
        this.uniforms.u_resolution.y = Graphics.height;
    }
    /**
     * Set ambient color for light to show up
     */
    setAmbientLightColor(r, g, b, a) {
        this.uniforms.ambientLight = this.uniforms.ambientLight || [];
        a = a / 255.0;
        this.uniforms.ambientLight[3] = a;
        this.uniforms.ambientLight[0] = r  / 255.0 * a;
        this.uniforms.ambientLight[1] = g  / 255.0 * a;
        this.uniforms.ambientLight[2] = b  / 255.0 * a;
    }
    /**
     * Update filter per frame
     */
    update() {
        this.updateTime();
    }
    /**
     * Update time
     */
    updateTime() {
        this.uniforms.u_time += 0.1;
    }
}
/**
 * Get the light bitmap
 * @param {string} filename 
 * @returns {Bitmap}
 */
ImageManager.loadLight = function (filename) {
    return ImageManager.loadBitmap("img/lights/", filename);
}

class LightSystem {
    /**
     * This class handle all lighting related in this engine.
     */
    constructor() {
        LightSystem.inst = this;
        this._layer = new PIXI.Container();
        this._lightMapTexture = new PIXI.RenderTexture.create(Graphics.width, Graphics.height);
        /** @type {LightingFilter} */
        this._filter = $gameTemp._lightFilter || new LightingFilter();
        this._filter.blendMode = PIXI.BLEND_MODES.KHAS_LIGHTING;
        this._layerSprite = new PIXI.Sprite(this._lightMapTexture);
        this._layerSprite.filters = [this._filter];
        /** @type {Sprite_Light[]} */
        this._allLightSprites = [];
    }
    /**
     * Add Light
     * @param {Sprite_Light} sprite 
     */
    addLight(sprite) {
        this._allLightSprites.push(sprite);
        this._layerSprite.addChild(sprite);
    }
    /**
     * Remove Light
     * @param {Sprite_Light} sprite 
     */
    removeLight(sprite) {
        this._allLightSprites.remove(sprite);
        this._layerSprite.removeChild(sprite);
    }
    /**
     * Update Light System
     */
    update() {
        const {r, g, b, a} = AmbientController.inst.color;
        this._filter.setAmbientLightColor(r, g, b, a);
        this._filter.update();
        for (var i = 0; i < this._allLightSprites.length; i++) {
            this._allLightSprites[i].update();
        }
        Graphics.app.renderer.render(this._layer, this._lightMapTexture);
        // Debug
        if (Input.isTriggered(FieldKeyAction.Map)) {
            this.addLight(new Sprite_PointLight($gamePlayer.x, $gamePlayer.y, ['white', 'yellow', 'green', 'fluorescent', 'fluorescent'].randomizeItem()));
        }
    }
}
/** @type {LightSystem} */
LightSystem.inst = null;

class Sprite_Light extends Sprite {
    /**
     * This class is superclass of all light sprite.
     */
    constructor() {
        super();
        this.blendMode = PIXI.BLEND_MODES.SCREEN;
        this._offset = new Vector2(0, 0);
        this._imageFile = "white";
    }
    /**
     * Init light
     */
    init() {
        this.bitmap = ImageManager.loadLight(this.imageFile());
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.updatePosition();
    }
    /**
     * Light texture file
     * @returns {string}
     */
    imageFile() {
        return this._imageFile;
    }
    /**
     * Display X
     * @returns {number}
     */
    displayX() {
        return 0;
    }
    /**
     * Display Y
     * @returns {number}
     */
    displayY() {
        return 0;
    }
    /**
     * Scrolled X
     * @returns {number}
     */
    scrolledX() {
        return $gameMap.adjustX(this.displayX());
    }
    /**
     * Scrolled Y
     * @returns {number}
     */
    scrolledY() {
        return $gameMap.adjustY(this.displayY());
    }
    /**
     * Screen X
     * @returns {number}
     */
    screenX() {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw + tw / 2) + this._offset.x;
    }
    /**
     * Screen Y
     * @returns {number}
     */
    screenY() {
        const th = $gameMap.tileHeight();
        return Math.floor(
            this.scrolledY() * th + th / 2
        ) + this._offset.y;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updatePosition();
        this.updateEffects();
    }
    /**
     * Update Position
     */
    updatePosition() {
        this.x = this.screenX();
        this.y = this.screenY();
    }
    /**
     * Update custom effect
     */
    updateEffects() {
        
    }
    /**
     * Update opacity pulse
     */
    updatePulse() {
        this.opacity = 100 + Math.abs(Math.sin(Graphics.frameCount / 100) * (255 - 100));
    }
}


class AmbientController extends SaveableObject {
    /**
     * AmbientController
     */
    constructor() {
        super();
        AmbientController.inst = this;
        // Note: Nice night color tint: {r: 50, g: 30, b: 150, a: 255}
        this._color = {
            r: 255,
            g: 255,
            b: 255,
            a: 255
        }
        this._targetColor = {
            r: 255,
            g: 255,
            b: 255,
            a: 255,
        }
        this._colorTweenDuration = 0;
    }
    /**
     * Get color
     */
    get color() {
        return this._color;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['_color', null],
            ['_originalColor', null],
            ['_targetColor', null],
            ['_colorTweenDuration', null],
            ['_maxColorTweenDuration', null],
        ]
    }
    /**
     * Set ambient color
     * @param {number} r 0-255
     * @param {number} g 0-255
     * @param {number} b 0-255
     * @param {number} a 0-255
     * @param {number} duration frames
     */
    set(r, g, b, a, duration = 60) {
        this._targetColor = { r, g, b, a };
        this._originalColor = { ...this._color };
        this._colorTweenDuration = 0;
        this._maxColorTweenDuration = duration;
    }
    /**
     * Update color 
     * @returns {void}
     */
    updateColor() {
        if (this._maxColorTweenDuration == null) return;
        this._colorTweenDuration += 1;
        const t = this._colorTweenDuration / this._maxColorTweenDuration;
        this._color.r = this._originalColor.r + (this._targetColor.r - this._originalColor.r) * t;
        this._color.g = this._originalColor.g + (this._targetColor.g - this._originalColor.g) * t;
        this._color.b = this._originalColor.b + (this._targetColor.b - this._originalColor.b) * t;
        this._color.a = this._originalColor.a + (this._targetColor.a - this._originalColor.a) * t;
        if (this._colorTweenDuration == this._maxColorTweenDuration) {
            this._maxColorTweenDuration = null;
        }
    }
    /**
     * Update per frame
     */
    update() {
        this.updateColor();
    }
}
/** @type {AmbientController} */
AmbientController.inst = null;

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_SimpleLightingSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_SimpleLightingSystem_Game_System_createSaveableObjects.call(this);
    this._ambientController = new AmbientController();
}

var DSI_SimpleLight_Spriteset_Map_createBaseSprite = Spriteset_Map.prototype.createBaseSprite;
Spriteset_Map.prototype.createBaseSprite = function () {
    DSI_SimpleLight_Spriteset_Map_createBaseSprite.call(this);
    this._lightSystem = new LightSystem();
    this.addChild(this._lightSystem._layerSprite);
}

var DSI_SimpleLight_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
    DSI_SimpleLight_Spriteset_Map_update.call(this);
    if (this._lightSystem) this._lightSystem.update();
    AmbientController.inst?.update();
}

//==================================================================================
// DEFAULT LIGHT TYPES
//==================================================================================
class Sprite_PointLight extends Sprite_Light {
    /**
     * A static light on map.
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y, filename = 'white', offsetX = 0, offsetY = 0) {
        super();
        this._offset = new Vector2(offsetX, offsetY);
        this._imageFile = filename;
        this._lightPos = new Vector2(x, y);
        this.init();
    }
    /**
     * @inheritdoc
     */
    displayX() {
        return this._lightPos.x;
    }
    /**
     * @inheritdoc
     */
    displayY() {
        return this._lightPos.y;
    }
}