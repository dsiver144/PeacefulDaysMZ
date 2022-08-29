//=======================================================================
// * Plugin Name  : DSI_Sys5_DecoratingObjects.js
// * Last Updated : 8/20/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 */
class DecoratingObject extends Building {
    /**
     * @inheritdoc
     */
    imageFile() {
        return "decorators/" + this.displayFilename();   
    }
    /**
     * Get display filename
     * @returns {string}
     */
    displayFilename() {
        return ""
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmDecor;
    }
}

// ===============================================================================
// Peaceful Days Decors
// ===============================================================================
class WoodenFence extends DecoratingObject {
    /**
     * @inheritdoc
     */
    autotileType() {
        return 'WoodenFence';
    }
    /**
     * @inheritdoc
     */
    displayFilename() {
        return "WoodFenceb";
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmDecor;
    }
}

class GardenLamp extends DecoratingObject {
    /**
     * @inheritdoc
     */
     displayFilename() {
        return "GardenLamp";
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return {x: 1, y: 1};
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 32, 
            height: 96
        }
    }
    /**
     * @inheritdoc
     */
    onObjectSpriteCreated() {
        const {x, y} = this.position;
        LightSystem.inst.addLight(new Sprite_PointLight(x, y, "yellow", 0, -64));
    }
}

class FarmGate extends DecoratingObject {
    /**
     * @inheritdoc
     */
    displayFilename() {
        return "FarmGate";
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return {x: 5, y: 1}
    }
    /**
     * @inheritdoc
     */
    collisionCondition(x, y) {
        const size = this.bottomSize();
        return x == 0 || x == size.x - 1;
    } 
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 160,
            height: 128
        }
    }
}

class ToriiGate extends FarmGate {
    /**
     * @inheritdoc
     */
    displayFilename() {
        return "ToriiGate";
    }
}