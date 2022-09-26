
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
            this.smooth = Utils.isNwjs();
        }
    }

    // Game_Map.prototype.screenTileX = function() {
    //     return Math.round((Graphics.width / this.tileWidth()) * 16) / 16 / (window.customScaleRatio || 1.0);
    // };
    
    // Game_Map.prototype.screenTileY = function() {
    //     return Math.round((Graphics.height / this.tileHeight()) * 16) / 16 / (window.customScaleRatio || 1.0);
    // };

	// var DSI_DSI_Sys1_Spriteset_Spriteset_Map_update = Spriteset_Map.prototype.update;
    // Spriteset_Map.prototype.update = function() {
	// 	DSI_DSI_Sys1_Spriteset_Spriteset_Map_update.call(this);
    //     this._baseSprite.scale.x = window.customScaleRatio || 1.0;   
    //     this._baseSprite.scale.y = window.customScaleRatio || 1.0;
    // }

})(DSI);