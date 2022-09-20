class Sprite_Furniture extends Sprite_FarmBuilding {
    /**
     * Get Furniture
     * @type {MyFurniture}
     */
    get furniture() {
        return this.building();
    }
    /**
     * @inheritdoc
     */
    updateCustomInput() {
        console.log("Update custom");
        if (Input.isTriggered(FieldKeyAction.SwitchItemLeft)) {
            this.furniture.rotate(1);
            this.refreshBitmap();
        }
        // if (Input.isTriggered(FieldKeyAction.SwitchItemLeft)) {
        //     this.furniture.rotate(-1);
        //     this.refreshBitmap();
        // }
    }
}