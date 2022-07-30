var peer = new Peer();
peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
});
peer.on('connection', function (conn) {
    console.log('New connection:', conn);
    conn.on('open', function () {
        // Receive messages
        conn.on('data', function (data) {
            console.log('Received', data);
        });
    });
    peer.currentConnect = conn;
});

function connectPeer(peerId) {
    var conn = peer.connect(peerId);
    conn.on('open', function () {
        console.log('Connection openned:', conn);
        // Receive messages
        conn.on('data', function (data) {
            console.log('Received', data);
        });
    });
    return conn;
}