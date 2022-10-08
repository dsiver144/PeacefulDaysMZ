

//=======================================================================
// * Plugin Name  : DSI_Sys1_NewGame.js
// * Last Updated : 10/8/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param testParam:number
 * @text Test Param
 * @type number
 * @default 144
 * @desc A Test Param
 * 
 */

var DSI_Sys1_NewGame_DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
    DSI_Sys1_NewGame_DataManager_setupNewGame.call(this);
    FarmManager.inst.addPlayerHouse();
}