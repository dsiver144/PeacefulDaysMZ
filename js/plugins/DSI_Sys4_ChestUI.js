class Scene_Chest extends Scene_MenuBase {
    /**
     * Prepare Chest
     * @param {ItemContainer} topContainer 
     */
    prepare(topContainer, bottomContainer) {
        /** @type {ItemContainer} */
        this.topContainer = topContainer;
        /** @type {ItemContainer} */
        this.bottomContainer = bottomContainer;

        this.topContainer.select(0);
        this.bottomContainer.select(null);
    }
    /**
     * Create
     */
    create() {
        super.create();
        this.createChestWindow();
    }
    /**
     * Create Chest Window
     */
    createChestWindow() {
        this._topWindow = new Window_ChestContainer(this.topContainer);
        this._topWindow.x = (Graphics.width - this._topWindow.width) / 2;
        this._topWindow.y = 100;

        this.addChild(this._topWindow);
        this._bottomWindow = new Window_ChestContainer(this.bottomContainer);
        this._bottomWindow.x = (Graphics.width - this._bottomWindow.width) / 2;
        this._bottomWindow.y = Graphics.height - this._bottomWindow.height - 30;
        this.addChild(this._bottomWindow);
        
        this._topWindow.onSlotClickSuccess = (lastSlotIndex, slotIndex) => {
            this.bottomContainer.select(null);
            if (lastSlotIndex == slotIndex) {
                const item = this.topContainer.selectingItem();
                if (item) {
                    const number = 1;
                    if (this.bottomContainer.addItem(item.id, number)) {
                        this.topContainer.updateItemWithSlotID(slotIndex, -number);
                    }
                }
            }
        }
        this._bottomWindow.onSlotClickSuccess = (lastSlotIndex, slotIndex) => {
            this.topContainer.select(null);
            if (lastSlotIndex == slotIndex) {
                const item = this.bottomContainer.selectingItem();
                if (item) {
                    const number = 1;
                    if (this.topContainer.addItem(item.id, number)) {
                        this.bottomContainer.updateItemWithSlotID(slotIndex, -number);
                    }
                }
            }
        }
    }

    start() {
        super.start();
    }

    update() {
        super.update();
        this.updateHoverText();
    }
    /**
     * Update hover text
     */
    updateHoverText() {
        const {x, y} = TouchInput;
        let failCount = 0;
        if (x <= this._topWindow.x || x >= this._topWindow.x + this._topWindow.width - this._topWindow.padding * 2 ||
            y <= this._topWindow.y || y >= this._topWindow.y + this._topWindow.height) {
            failCount += 1;
        }
        if (x <= this._bottomWindow.x || x >= this._bottomWindow.x + this._bottomWindow.width - this._bottomWindow.padding * 2 ||
            y <= this._bottomWindow.y || y >= this._bottomWindow.y + this._bottomWindow.height) {
            failCount += 1;
        }
        failCount >= 2 && MouseCursor.clearHoverText();
    }
}


class Window_ChestContainer extends Window_ItemContainer {
    /**
     * Window Chest Container
     * @param {ItemContainer} itemContainer 
     */
    constructor(itemContainer, rect = new Rectangle(0, 0, 560, 210)) {
        super(itemContainer, rect);
        this.opacity = 0;
        this.backOpacity = 0;
        const menuBGPlane = new PIXI.NineSlicePlane(PIXI.Texture.from("img/menus/MenuBG.png"), 8, 8, 8, 8);
        menuBGPlane.width = this.innerWidth;
        menuBGPlane.height = this.innerHeight;
        this.addChildToBack(menuBGPlane);
    }
    /**
     * Create core elements
     */
    create() {
        this.createAllSlots();
    }
    /**
     * @inheritdoc
     */
    onItemSlotHover(slotId) {
        // if (this.itemContainer._selectedSlotId == null) return;
        super.onItemSlotHover(slotId);
    }
    /**
     * @inheritdoc
     */
    updateHoverText() {
        // if (this.itemContainer._selectedSlotId == null) return;
        // super.updateHoverText();
    }
}