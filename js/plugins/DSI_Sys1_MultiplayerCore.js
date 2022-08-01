class NetCore {
    /**
     * This class handle network interaction between client and host.
     * @param {boolean} isHost 
     */
    constructor(isHost, initPeer = true) {
        NetCore.inst = this;
        this._isHost = isHost;
        this._isRemote = !isHost;
        this._peer = null;
        /** @type {string} */
        this._peerId = null;
        this._remoteConnections = [];
        this._hostConnection = null;
        /** @type {Map<string, (data: any) => void>} */
        this._actions = new Map();
        initPeer && this.initPeer();
    }
    /**
     * Init Peer
     */
    initPeer() {
        this._peer = new Peer();
        this._peer.on('connection', (conn) => {
            console.log('New remote connection openned:', conn);
            this._remoteConnections.push(conn);
            conn.on('data', this.onDataRecieve.bind(this));
        });
        return new Promise((resolve, reject) => {
            this._peer.on('open', (id) => {
                console.log('> PEER ID:', id);
                this._peerId = id;
                resolve();
            });
        })
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
        return this._peerId != null;
    }
    /**
     * Connect to host
     * @param {string} peerId 
     */
    connectToHost(peerId) {
        const connection = this._peer.connect(peerId);
        connection.on('open', () => {
            console.log('Connection to host openned:', connection);
            connection.on('data', this.onDataRecieve.bind(this));
        });
        this._hostConnection = connection;
    }
    /**
     * Send Data To Host
     * @param {any} data 
     * @returns {void}
     */
    sendDataToHost(data) {
        if (!this._hostConnection) return;
        this._hostConnection.send(this.formatData(data));
    }
    /**
     * Send Data To Remotes
     * @param {any} data 
     */
    sendDataToRemotes(data) {
        for (var i = 0; i < this._remoteConnections.length; i++) {
            this._remoteConnections[i].send(this.formatData(data));
        }
    }
    /**
     * Format Data
     * @param {any} data 
     * @returns {any}
     */
    formatData(data) {
        return {peerId: this._peerId, content: data};
    }
    /**
     * On Data Receive
     * @param {any} data 
     */
    onDataRecieve(data) {
        const callback = this._actions.get(data.content.action);
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
        this._actions.set(action, callback);
    }
}
/** @type {NetCore} */
NetCore.inst = null;
/**
 * Init NetCore
 * @param {boolean} isHost 
 */
NetCore.init = function(isHost = true) {
    new NetCore(isHost);
}
/**
 * Check if NetCore is ready
 * @returns {boolean}
 */
NetCore.isReady = function() {
    return NetCore.inst && NetCore.inst.isReady();
}
/**
 * Check if this is host
 * @returns {boolean}
 */
NetCore.isHost = function() {
    return NetCore.inst.isHost();
}
/**
 * Send Data
 * @param {any} data 
 * @returns {void}
 */
NetCore.send = function(data) {
    return NetCore.inst.isHost() ? NetCore.inst.sendDataToRemotes(data) : NetCore.inst.sendDataToHost(data);
}
/**
 * Listen to action
 * @param {string} action 
 * @param {(data: any) => void} callback 
 */
NetCore.listen = function(action, callback) {
    NetCore.inst.listen(action, callback);
}
