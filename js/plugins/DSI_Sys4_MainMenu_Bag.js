class Window_Bag extends Window_ItemContainer {
    /**
     * This class handle bag menu display for Peaceful Days
     */
    constructor() {
        super(MyBag.inst);
    }
    /**
     * Show hints
     */
    showHints() {
        const keys = [
            [MenuKeyAction.Cancel, "Lb_Exit"],
        ]
        ScreenOverlay.showButtonHints(...keys);
    }
    /**
     * @inheritdoc
     */
    activate() {
        super.activate();
        this.showHints();
    }
    /**
     * @inheritdoc
     */
    deactivate() {
        super.deactivate();
        ScreenOverlay.clearAllHints();
    }
}