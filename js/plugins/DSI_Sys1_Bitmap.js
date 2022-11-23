
//================================================================
// * Plugin Name    : DSI_Sys1_Bitmap
// - Last updated   : 28/10/2021
//================================================================
/*:
 * @plugindesc v1.0 Bitmap System for Peaceful Days.
 * @author dsiver144
 * @target MZ
 * 
*/
var DSI = DSI || {};

(function ($) {

    var params = PluginManager.parameters('DSI_Sys1_Bitmap');
    params = PluginManager.processParameters(params);

    if (Utils.isNwjs()) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerText = "#gameCanvas, #GameCanvas { image-rendering: pixelated; }";
        document.head.appendChild(style);
    }

    Bitmap = class Bitmap_Pixelated extends Bitmap {
        initialize(width, height) {
            super.initialize(width, height);
            this.smooth = false; //Utils.isNwjs();
            this.fontFace = 'Verdana';
        }
    }

})(DSI);