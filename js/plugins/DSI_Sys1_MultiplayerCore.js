class NetCore {
    /**
     * This class handle network interaction between client and host.
     * @param {boolean} isHost 
     */
    constructor(isHost) {
        NetCore.inst = this;
        this._isHost = isHost;
        this._isRemote = !isHost;
        this.peer = new Peer();
        /** @type {string} */
        this.peerId = null;
        this.remoteConnections = [];
        this.connectionToHost = null;
        this.peer.on('open', (id) => {
            console.log('> PEER ID:', id);
            this.peerId = id;
        });
        this.peer.on('connection', (conn) => {
            console.log('New remote connection openned:', conn);
            this.remoteConnections.push(conn);
            conn.on('data', this.onDataRecieve.bind(this));
        });
        /** @type {Map<string, (data: any) => void>} */
        this.actions = new Map();
    }
    /**
     * Check if this is host.
     * @returns {boolean}
     */
    isHost() {
        return this._isHost;
    }
    /**
     * Is Ready
     * @returns {boolean}
     */
    isReady() {
        return this.peerId != null;
    }
    /**
     * Connect to host
     * @param {string} peerId 
     */
    connectToHost(peerId) {
        const connection = this.peer.connect(peerId);
        connection.on('open', () => {
            console.log('Connection to host openned:', connection);
            connection.on('data', this.onDataRecieve.bind(this));
        });
        this.connectionToHost = connection;
    }
    /**
     * Send Data To Host
     * @param {any} data 
     * @returns {void}
     */
    sendDataToHost(data) {
        if (!this.connectionToHost) return;
        this.connectionToHost.send(this.formatData(data));
    }
    /**
     * Send Data To Remotes
     * @param {any} data 
     */
    sendDataToRemotes(data) {
        for (var i = 0; i < this.remoteConnections.length; i++) {
            this.remoteConnections[i].send(this.formatData(data));
        }
    }
    /**
     * Format Data
     * @param {any} data 
     * @returns {any}
     */
    formatData(data) {
        return {peerId: this.peerId, content: data};
    }
    /**
     * On Data Receive
     * @param {any} data 
     */
    onDataRecieve(data) {
        const callback = this.actions.get(data.content.action);
        if (callback) {
            callback(data);
        }
        console.log(`${new Date(Date.now())} : `, data);
    }
    /**
     * Listen to action
     * @param {string} action 
     * @param {(data: any) => void} callback 
     */
    listen(action, callback) {
        this.actions.set(action, callback);
    }
}
/** @type {NetCore} */
NetCore.inst = null;

NetCore.init = function(isHost = true) {
    new NetCore(isHost);
}

NetCore.isReady = function() {
    return NetCore.inst && NetCore.inst.isReady();
}

NetCore.isHost = function() {
    return NetCore.inst.isHost();
}
/**
 * Listen to action
 * @param {string} action 
 * @param {(data: any) => void} callback 
 */
NetCore.listen = function(action, callback) {
    NetCore.inst.listen(action, callback);
}
// var peer = new Peer();
// peer.on('open', function (id) {
//     console.log('My peer ID is: ' + id);
// });
// peer.on('connection', function (conn) {
//     console.log('New connection:', conn);
//     conn.on('open', function () {
//         // Receive messages
//         conn.on('data', function (data) {
//             console.log('Received', data);
//         });
//     });
//     peer.currentConnect = conn;
// });

// function connectPeer(peerId) {
//     var conn = peer.connect(peerId);
//     conn.on('open', function () {
//         console.log('Connection openned:', conn);
//         // Receive messages
//         conn.on('data', function (data) {
//             console.log('Received', data);
//         });
//     });
//     return conn;
// }

class Game_RemotePlayer extends Game_Character {

    initMembers() {
        super.initMembers();
    }
    
}