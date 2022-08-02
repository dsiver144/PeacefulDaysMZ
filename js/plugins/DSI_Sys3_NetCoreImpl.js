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
        if (NetCore.isHost()) {
            NetCore.listen('remoteUseTool', (data) => {
                const { peerId, content } = data;
                const { action, params } = content;
                console.log('Got remote use tool data', data, content);
                const { toolType, x, y, toolEx } = params;
                this.currentFarmland().useTool(toolType, x, y, toolEx);
                const object = this.currentFarmland().getObject(x, y).getSaveData();
                NetCore.inst.sendDataToRemotes({ action: 'updateObject', params: { objects: [object] } });
            });
        } else {
            NetCore.listen('updateObject', (data) => {
                const { peerId, content } = data;
                const { action, params } = content;
                console.log('Got updateObject message', data, content);
                const { objects } = params;
                objects.forEach(object => {
                    const newObject = eval(`new ${object.type}()`);
                    newObject.loadSaveData(object);
                    this.currentFarmland().replaceObject(newObject);
                })
            });
            NetCore.listen('hostUseTool', (data) => {
                const { peerId, content } = data;
                const { action, params } = content;
                console.log('Got host use tool data', data, content);
                const { object } = params;
                const newObject = eval(`new ${object.type}()`);
                newObject.loadSaveData(object);
                this.currentFarmland().replaceObject(newObject);
            });
        }
        // Handle for both host & remote
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
            remotePlayer._pattern = params._pattern;
            MyUtils.getMapSprite('remotePlayer' + peerId).update();
        });
    }
}