const fragmentSrc = `

    varying vec2 vTextureCoord;
    uniform vec2 u_resolution;
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

// var DSI_SimpleLight_Graphics__setupPixi = Graphics._setupPixi;
// Graphics._setupPixi = function() {
// 	DSI_SimpleLight_Graphics__setupPixi.call(this);
//     PIXI.utils.skipHello();
//     PIXI.settings.GC_MAX_IDLE = 600;
// };

class LightingFilter extends PIXI.Filter {
    constructor() {
        super(ShaderUtils.defaultVertexShaderSrc(), fragmentSrc);
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
     * 
     * @param {rgb} ambientColor 
     */
    setAmbientLightColor(ambientColor) {
        this.uniforms.ambientLight = [];
        this.uniforms.ambientLight[0] = ambientColor.r;
        this.uniforms.ambientLight[1] = ambientColor.g;
        this.uniforms.ambientLight[2] = ambientColor.b;
        this.uniforms.ambientLight[3] = ambientColor.a;
    }
}

ImageManager.loadLight = function(filename) {
    return ImageManager.loadBitmap("img/lights/", filename);
}

class LightSystem {

    constructor() {
        this._lights = [];
        this._layer = new PIXI.Container();
        this._lightMapTexture = new PIXI.RenderTexture.create(Graphics.width, Graphics.height);
        /** @type {LightingFilter} */
        this._filter = $gameTemp._lightFilter || new LightingFilter();
        this._filter.blendMode = PIXI.BLEND_MODES.KHAS_LIGHTING;
        this._layerSprite = new PIXI.Sprite(this._lightMapTexture);
        this._layerSprite.filters = [this._filter];
        this.addLight(200, 100, 'white');
        this.addLight(300, 300, 'yellow');
        this.addLight(400, 150, 'green');
    
    }

    addLight(x, y, file) {
        const sprite = new Sprite(ImageManager.loadLight(file));
        sprite.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
        sprite.x = x;
        sprite.y = y;
        this._layerSprite.addChild(sprite);
    }
    
    update() {
        this._filter.setAmbientLightColor({r: 0.5, g: 0.5, b: 0.5, a: 0.25});
        Graphics.app.renderer.render(this._layer, this._lightMapTexture);
    }
}

var DSI_SimpleLight_Spriteset_Map_createBaseSprite = Spriteset_Map.prototype.createBaseSprite;
Spriteset_Map.prototype.createBaseSprite = function () {
    DSI_SimpleLight_Spriteset_Map_createBaseSprite.call(this);
    this._lightSystem = new LightSystem();
    this.addChild(this._lightSystem._layerSprite);
}

	var DSI_SimpleLight_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
		DSI_SimpleLight_Spriteset_Map_update.call(this);
    if (this._lightSystem) this._lightSystem.update();
}
