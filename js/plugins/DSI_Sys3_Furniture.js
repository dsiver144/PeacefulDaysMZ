//=======================================================================
// * Plugin Name  : DSI_Sys3_Furniture.js
// * Last Updated : 9/21/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Furniture 
 * @help 
 * Empty Help
 */
class MyFurniture extends Building {
    /**
     * Image File
     * @returns {string}
     */
    imageFile() {
        return this.folder() + this.filename();
    }
    /**
     * Image folder
     * @returns {string}
     */
    folder() {
        return "furnitures/";
    }
    /**
     * Set furniture ID
     * @param {string} itemID 
     */
    setFurnitureID(itemID) {
        this._furnitureID = itemID;
        this._variantIndex = 0;
        this._maxVariantIndex = this.furnitureData().variants.length - 1;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        const data = super.saveProperties();
        data.push(['_furnitureID', null]);
        data.push(['_variantIndex', null]);
        data.push(['_maxVariantIndex', null]);
        return data;
    }
    /**
     * Get furniture data
     * @returns {Game_Furniture}
     */
    furnitureData() {
        return FurnitureDB.inst.getFurnitureByID(this._furnitureID);
    }
    /**
     * Get furniture variant
     * @returns {Game_Furniture_Variant}
     */
    furnitureVariant() {
        return this.furnitureData().variants[this._variantIndex];
    }
    /**
     * Filename
     * @returns {string}
     */
    filename() {
        return this.furnitureVariant().imageFile;
    }
    /**
     * @inheritdoc
     */
    validRegionIDs() {
        return this.furnitureData().regionIds;
    }
    /**
     * @inheritdoc
     */
    interactable() {
        return this.furnitureData().interactable;
    }
    /**
     * Preview Sprite Key
     * @returns {string}
     */
    previewSpriteKey() {
        return 'furniturePreview';
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_Furniture;
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return this.furnitureVariant().bottomSize;
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return this.furnitureVariant().imageRect;
    }
    /**
     * @inheritdoc
     */
    interactionRange() {
        const {x, y} = this.position;
        const rect = this.furnitureVariant().interactionRange;
        rect.x += x;
        rect.y += y;
        return rect;
    }
    /**
     * Check if this furniture can be rotate.
     * @returns {boolean}
     */
    isRotatable() {
        return this._maxVariantIndex > 0 && this.isBeingMove();
    }
    /**
     * Rotate furniture
     */
    rotate(value) {
        if (!this.isRotatable()) return;
        this._variantIndex += value;
        if (this._variantIndex > this._maxVariantIndex) this._variantIndex = 0;
        if (this._variantIndex < 0) this._variantIndex = this._maxVariantIndex;
    }
}

MyFurniture.place = function(itemID, startX = 10, startY = 10) {
    const gameFurniture = FurnitureDB.inst.getFurnitureByID(itemID);
    /** @type {MyFurniture} */
    const construction = eval(`new ${gameFurniture.className}(new Vector2(startX, startY), $gameMap.mapId())`); //new constClass(new Vector2(startX, startY), $gameMap.mapId());
    construction.setFurnitureID(itemID);
    construction.startMove();
    return construction;
}

