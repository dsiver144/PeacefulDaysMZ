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
class AudioController {
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
