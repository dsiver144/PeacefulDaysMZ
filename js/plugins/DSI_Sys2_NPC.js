//=======================================================================
// * Plugin Name  : DSI_Sys2_NPC.js
// * Last Updated : 11/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) NPC Core
 * @help 
 * Empty Help
 * 
 * 
 */

ImageManager.loadNPC = function(npcKey, filename) {
    return ImageManager.loadBitmap("img/npcs/" + npcKey + "/", filename);
}