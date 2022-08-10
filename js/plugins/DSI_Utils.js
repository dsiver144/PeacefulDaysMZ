//=======================================================================
// * Plugin Name  : DSI_Utils.js
// * Last Updated : 8/3/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) An Utils plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * 
 */

/**
 * Load Menu Image
 * @param {string} filename filename of the image
 * @param {string} dir sub-directory of the image
 * @returns {Bitmap}
 */
ImageManager.loadMenu = function(filename, dir = "") {
    let path = "img/menus/" + dir;
    if (dir.length > 0) path += "/";
    return ImageManager.loadBitmap(path, filename);
}
class Vector2 extends SaveableObject {
    /**
     * Object position
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super();
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
    }
    /**
     * Save Properties
     */
    saveProperties() {
        return [
            ['x', 0],
            ['y', 0],
        ];
    }
    /**
     * Overwrite toString
     * @returns {string}
     */
    toString() {
        return `${this.x}-${this.y}`;
    }
}

// Shortcut for Vector2
/**
 * Create a vector2
 * @param {number} x 
 * @param {number} y 
 * @returns {Vector2}
 */
const v2 = function(x, y) {
    return new Vector2(x, y);
}

class MyUtils {
    constructor() {
        return new Error("This is a static class");
    }
}
/**
 * Parse CSV
 * @param {string} filename 
 * @param {(data: any) => void} callback 
 */
MyUtils.parseCSV = function (filename, callback) {
    MyUtils.loadCSV(filename, (data) => {
        if (!data) {
            throw new Error("Can't load " + filename);
        }
        const lines = data.split("\r\n");
        const keys = lines[0].split(",").map(s => s.trim());
        const allObjects = [];
        for (let i = 1; i < lines.length; i++) {
            const object = {}
            const values = lines[i].split(",").map(s => s.trim());
            keys.forEach((key, index) => {
                object[key] = values[index];
            })
            allObjects.push(object);
        }
        callback(allObjects);
    })
}
/**
 * Load CSV
 * @param {string} src 
 * @param {(data: string) => void} callback 
 */
MyUtils.loadCSV = function(src, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/" + src, false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                callback(null);
            }
        }
    };
    xhr.onerror = function (e) {
        callback(null);
    };
    xhr.send(null);
};
/**
 * Load Custom File
 * @param {string} src 
 * @param {(data: string) => void} callback 
 */
MyUtils.loadFile = function(src, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/" + src, false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                callback(null);
            }
        }
    };
    xhr.onerror = function (e) {
        callback(null);
    };
    xhr.send(null);
};
/** @type {Spriteset_Map} */
MyUtils.spriteset = null;
MyUtils.DEBUG = false;
var DSI_Utils_Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function() {
    MyUtils.spriteset = this;
	DSI_Utils_Spriteset_Map_initialize.call(this);
};

Spriteset_Map.prototype.addCustomSpriteToTilemap = function(key, sprite) {
    this._customSprites = this._customSprites || {};
    if (this._customSprites[key]) {
        return;
    }
    this._customSprites[key] = sprite;
    this._tilemap.addChild(sprite);
}

Spriteset_Map.prototype.removeCustomSpriteFromTilemap = function(key) {
    this._customSprites = this._customSprites || {};
    const sprite = this._customSprites[key];
    if (!sprite) {
        return;
    }
    this._tilemap.removeChild(sprite);
    delete this._customSprites[key];
}

Spriteset_Map.prototype.getCustomSpriteFromTilemap = function(key) {
    this._customSprites = this._customSprites || {};
    return this._customSprites[key];
}
/**
 * Add custom sprite to tilemap
 * @param {string} key 
 * @param {Sprite} sprite 
 */
MyUtils.addMapSprite = function(key, sprite) {
    const spriteset = this.spriteset;
    if (!spriteset) return;
    spriteset.addCustomSpriteToTilemap(key, sprite);
}
/**
 * Remove custom sprite to tilemap
 * @param {string} key 
 */
MyUtils.removeMapSprite = function(key) {
    const spriteset = this.spriteset;
    if (!spriteset) return;
    spriteset.removeCustomSpriteFromTilemap(key);
}
/**
 * Get Custom Sprite From Tilemap
 * @param {string} key 
 * @returns {Sprite}
 */
MyUtils.getMapSprite = function(key) {
    const spriteset = this.spriteset;
    if (!spriteset) return null;
    return spriteset.getCustomSpriteFromTilemap(key);
}
/**
 * Random Array Item
 * @param {any[]} array 
 * @returns {any}
 */
MyUtils.randomArrayItem = function(array) {
    return array[Math.floor(Math.random() * array.length)];
}

class Sprite_Shakeable extends Sprite {
    /**
     * Shake
     * @param {number} power
     */
    shake(power = 0.1) {
        if (this.angleCounter != null) return;
        this.angleCounter = 0;
        this.angleCounterMax = Math.PI * 2;
        this.angleCounterStep = Math.PI * 2 / 30;
        this.angleRadius = power;
    }
    /**
     * Update shake 
     */
    updateShake() {
        if (this.angleCounter != null) {
            this.rotation = 0 + Math.sin(this.angleCounter) * this.angleRadius;
            this.angleCounter += this.angleCounterStep;
            if (this.angleCounterMax - this.angleCounter <= 0.01) {
                this.angleCounter = null;
            }
        }
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateShake();
    }
}

class Sprite_Wind extends Sprite {

    constructor() {
        super();
        this.bitmap = new Bitmap(32, 32);
        this.bitmap.fillRect(0, 0, 32, 32, '#ffffff');
        this.velocity = new Vector2(-5, 2);
        this.x = Graphics.width;
        this.y = 0;
        this.loopCount = 30;
        this.sinCount = 0;
    }

    update() {
        super.update();
        if (this.loopCount > 0) {
            this.loopCount -= 1;
        } else {
            if (this.loopCount2 == undefined) {
                this.curveVel.y = -30;
                this.curveVel.x = 30;
                this.loopCount2 = 5;
            }
            if (this.loopCount2 > 0) {
                this.loopCount2 -= 1;
            } else {
                if (this.loopCount3 == undefined) {
                    this.curveVel.x = 0;
                    this.curveVel.y = 0;
                    this.loopCount3 = 5;
                }
                // if (this.loopCount3 > 0) {
                //     this.loopCount3 -= 1;
                // } else {
                //     this.curveVel.x = 0;
                //     this.curveVel.y = 0;
                // }
            }
        }
        this.x += this.velocity.x + this.curveVel.x;
        this.y += this.velocity.y + this.curveVel.y;
    }
}

function addWind() {
    MyUtils.spriteset.addChild(new Sprite_Wind());
}

//========================================================================
// END OF PLUGIN
//========================================================================