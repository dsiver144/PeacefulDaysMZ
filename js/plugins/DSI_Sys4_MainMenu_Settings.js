class Window_Settings extends Window_Command {
    /**
     * This class handle bag menu display for Peaceful Days
     * @param {ItemContainer} container
     */
     constructor(rect = new Rectangle(0, 0, 538, 360)) {
        super(rect);
    }
    /**
     * Make Command List
     */
    makeCommandList() {
        for (var i = 0; i < 10; i++) {
            this.addCommand('Command #' + i, 'item', true);
        }
    }
}