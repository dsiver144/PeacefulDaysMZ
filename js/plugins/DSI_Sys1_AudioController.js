//=======================================================================
// * Plugin Name  : DSI_Sys1_AudioController.js
// * Last Updated : 8/20/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param switchPageSE:struct
 * @text Switch Page SE
 * @desc SFX when switch page
 * @type struct<SoundEffect>
 * @default {"name:str":"PD_ChangePage0","volume:num":"70","pitch:num":"100","pan:num":"0"}
 * 
 */
/*~struct~SoundEffect:
 * @param name:str
 * @text name
 * @type file
 * @dir audio/se/
 * @desc Choose the name of SE you want to use.
 *
 * @param volume:num
 * @text volume
 * @default 70
 * @desc Choose the volume value of the se
 * 
 * @param pitch:num
 * @text pitch
 * @default 100
 * @desc Choose the pitch value of the se
 * 
 * @param pan:num
 * @text pan
 * @default 0
 * @desc Choose the pan value of the se
 * 
 */
const AudioParams = PluginManager.processParameters(PluginManager.parameters('DSI_Sys1_AudioController'));

class AudioController {
    /** Init */
    static init() {
        this.fadeAudioOnHide();
    }
    /**
     * Fade Audio On Hide
     */
    static fadeAudioOnHide() {
        if (Utils.isNwjs()) {
            WebAudio._shouldMuteOnHide = function () { return false };
            const win = nw.Window.get();
            win.on('focus', function () { WebAudio._fadeIn(0.3) });
            win.on('blur', function () { WebAudio._fadeOut(0.3) });
        } else {
            WebAudio._shouldMuteOnHide = function () { return true };
            WebAudio._onHide = function () { this._fadeOut(0.3) };
            WebAudio._onShow = function () { this._fadeIn(0.3) };
        }
    }
    /**
     * Play cursor
     */
    static playCursor() {
        SoundManager.playCursor();
    }
    /**
     * Play command select
     */
    static playSelect() {
        SoundManager.playCursor();
    }
    /**
     * Play command OK
     */
    static playOk() {
        SoundManager.playOk();
    }
    /**
     * Play page
     */
     static playPage() {
        AudioManager.playSe(AudioParams.switchPageSE);
    }
    /**
     * Play command Cancel
     */
    static playCancel() {
        SoundManager.playCancel();
    }
    /**
     * Play buzzer
     */
    static playBuzzer() {
        SoundManager.playBuzzer();
    }
}

AudioController.init();

