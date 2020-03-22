const socket = require('socket.io');

class SocketConnections {
    constructor(httpServer) {
        this.socket = socket(httpServer);
        this.manageConnections();
    }

    manageConnections() {
        this.socket.on('connection', function(socket){
            console.log('A user connected!'); // We'll replace this with our own events
        });
    }
}

module.exports = {
    socketConnections: SocketConnections
}