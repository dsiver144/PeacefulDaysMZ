//=======================================================================
// * Plugin Name  : DSI_Sys1_SceneMap.js
// * Last Updated : 10/2/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Handle scene map for Peaceful Days.
 * @help 
 * Empty Help
 * 
 */

var DSI_Sys1_SceneMap_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function () {
    DSI_Sys1_SceneMap_Scene_Map_createDisplayObjects.call(this);

}

Scene_Map.prototype.displayMapHints = function() {
    const keys = [
        [FieldKeyAction.Check, "L"],
        [MenuKeyAction.Cancel, "Lb_Exit"]
    ]
    ScreenOverlay.showButtonHints(...keys);
}