//=======================================================================
// * Plugin Name  : DSI_Sys2_SceneMap.js
// * Last Updated : 10/2/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Handle scene map for Peaceful Days.
 * @help 
 * Empty Help
 * 
 */

var DSI_Sys2_SceneMap_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function () {
    DSI_Sys2_SceneMap_Scene_Map_createDisplayObjects.call(this);
    this.displayMapHints();
}

Scene_Map.prototype.displayMapHints = function () {
    const keys = [
        [FieldKeyAction.Menu, "field_menu"],
    ]
    ScreenOverlay.showButtonHints(...keys);
}

Scene_Map.prototype.createButtons = function() {
    
}

var DSI_Sys2_SceneMap_Scene_Map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function () {
    DSI_Sys2_SceneMap_Scene_Map_stop.call(this);
    ScreenOverlay.clearAllHints();
}