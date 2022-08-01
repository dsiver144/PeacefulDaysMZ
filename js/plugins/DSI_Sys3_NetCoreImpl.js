//=======================================================================
// * Plugin Name  : DSI_Sys3_NetCoreImpl.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Farm Tile
 * @help 
 * Empty Help
 */
class Game_RemotePlayer extends Game_Character {

    initMembers() {
        super.initMembers();
    }

}

class NetCoreImpl {
    /**
     * Register Net Core Listeners.
     * @returns {void}
     */
    registerNetCoreListeners() {
        if (!NetCore.isReady()) return;
        this._remoteCharacters = {};
        NetCore.listen('remoteUseTool', (data) => {
            const { peerId, content } = data;
            const { action, params } = content;
            console.log('Got remote use tool data', data, content);
            const { toolType, x, y, toolEx } = params;
            this.currentFarmland().useTool(toolType, x, y, toolEx);
            NetCore.inst.sendDataToRemotes({ action: 'hostUseTool', params: { toolType, x, y, toolEx } });
        });
        NetCore.listen('characterMove', (data) => {
            if (SceneManager._scene.constructor !== Scene_Map) {
                return;
            }
            const { peerId, content } = data;
            const { action, params } = content;
            console.log('characterMove', content);
            if (!this._remoteCharacters[peerId]) {
                /** @type {Game_RemotePlayer} */
                const remotePlayer = new Game_RemotePlayer();
                remotePlayer.setImage($gamePlayer.characterName(), $gamePlayer.characterIndex());
                this._remoteCharacters[peerId] = remotePlayer;
                MyUtils.addMapSprite('remotePlayer' + peerId, new Sprite_Character(remotePlayer));
            }
            /** @type {Game_RemotePlayer} */
            let remotePlayer = this._remoteCharacters[peerId];
            remotePlayer.setPosition(params._realX, params._realY);
            remotePlayer._direction = params._direction;
            MyUtils.getMapSprite('remotePlayer' + peerId).update();
        });
        NetCore.listen('hostUseTool', (data) => {
            const { peerId, content } = data;
            const { action, params } = content;
            console.log('Got host use tool data', data, content);
            const { toolType, x, y, toolEx } = params;
            this.currentFarmland().useTool(toolType, x, y, toolEx);
        });
    }
}