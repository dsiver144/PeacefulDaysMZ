class MyFurniture extends Building {
    /**
     * Image File
     * @returns {string}
     */
     imageFile() {
        return "furnitures/"
    }
    /**
     * @inheritdoc
     */
    interactable() {
        return false;
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
}