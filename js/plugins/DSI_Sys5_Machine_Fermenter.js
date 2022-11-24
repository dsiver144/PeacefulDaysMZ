
class Fermenter extends FarmMachine {
    /**
     * @inheritdoc
     */
    machineFilename() {
        return "Fermenter";
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_Fermenter;
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return { x: 2, y: 2 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 68,
            height: 108
        }
    }
    /**
     * @inheritdoc
     */
    interactTextKey() {
        return 'Lb_Open';
    }
    /**
     * @inheritdoc
     */
    displayAnchor() {
        return { x: 0.0, y: 0.65 };
    }
    /**
     * Get interaction range
     * @returns {Rectangle}
     */
    interactionRange() {
        const { x, y } = this.position;
        return { x: x, y: y, width: 2, height: 2 };
    }
}