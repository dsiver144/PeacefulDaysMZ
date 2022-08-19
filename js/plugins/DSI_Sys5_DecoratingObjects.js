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
        return "decorators/";   
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmDecor;
    }
}

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
    imageFile() {
        return super.imageFile() + "WoodFenceb";
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmDecor;
    }
}

class GardenLamp extends DecoratingObject {
    imageFile() {
        return super.imageFile() + "GardenLamp";
    }

    bottomSize() {
        return {x: 1, y: 1};
    }

    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 32, 
            height: 96
        }
    }

    onObjectSpriteCreated() {
        const {x, y} = this.position;
        LightSystem.inst.addLight(new Sprite_PointLight(x, y, "yellow", 0, -64));
    }
}