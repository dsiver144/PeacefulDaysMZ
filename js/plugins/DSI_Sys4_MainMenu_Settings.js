/** @enum */
const OptionControl = {
    "OK": 'ok',
    "Left": 'left',
    "Right": 'right',
}

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
        // for (var i = 0; i < 10; i++) {
        //     this.addCommand('Command #' + i, 'item', true);
        // }
        this.addOption('Lb_Option_BGMVolume', {type: "slider", min: 0, max: 100, step: 1, fastStep: 10}, this.onBGMVolumeControl.bind(this));
    }
    /**
     * 
     * @param {OptionControl} type 
     */
    onBGMVolumeControl(type) {
        console.log(type);
    }
    /**
     * 
     * @param {*} textKey 
     * @param {*} type 
     * @param {*} method 
     */
    addOption(textKey, data, method) {
        this.addCommand(textKey, textKey, true, data);
    }
    /**
     * @inheritdoc
     */
    drawItem(index) {

    }

    cursorLeft() {
        console.log("Left");
    }
}