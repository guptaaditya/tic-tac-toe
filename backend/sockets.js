const _ = require('lodash');
const socket = require('socket.io');

class SocketConnections {
    constructor(httpServer) {
        this.socketIo = socket(httpServer);
        this.subscribeSocketEvents();
        this.gameRooms = {};
        this.gameRoomPlayers = {};
    }

    subscribeSocketEvents() {
        
        this.socketIo.on('connection', (socket) => {

            socket.on('join_game', (data) => {
                //Find an existing room with only one player, 
                //if There is no room or no vacant room, create one
                const roomName = this.joinRoomWithSpace(socket);
                const playerIndex = _.findIndex(_.keys(this.gameRooms[roomName].sockets), (id) => {
                    return socket.id === id;
                });
                let playerEventName; 
                if (playerIndex === 0) {
                    playerEventName = `player1`;
                } else if (playerIndex === 1) {
                    playerEventName = `player2`;
                }
                if (playerEventName) {
                    const joinDetails = {
                        ...data, 
                        joined: playerEventName ,
                        roomName, 
                    };
                    if (playerEventName === 'player2') {
                        this.gameRoomPlayers[roomName].player2Details = data;
                    } else {
                        this.gameRoomPlayers[roomName] = {
                            player1Details: data,
                        };
                    }
                    const roomDetails = _.assign(joinDetails, { 
                        ...this.gameRoomPlayers[roomName] 
                    });
                    socket.to(roomName).emit('other_player_joined', roomDetails);
                    socket.emit('you_joined', roomDetails);
                }
            });

            socket.on('createGroup', (data) => {
                socket.join(`group_${++this.gameGroups}`);
                socket.emit('start_new_game', {
                    name: data.name, 
                    group: `group_${this.gameGroups}`
                });
            });

            socket.on('joinGroup', (data) => {
                const group = this.socketIo.nsps['/'].adapter.groups[data.group];
                if( group && group.length == 1){
                  socket.join(data.group);
                  socket.broadcast.to(data.group).emit('player1', {});
                  socket.emit('player2', {name: data.name, group: data.group })
                }
                else {
                  socket.emit('err', {message: 'Sorry, The group is full!'});
                }
            });

            socket.on('playTurn', function(data){
                socket.broadcast.to(data.group).emit('turnPlayed', {
                  tile: data.tile,
                  group: data.group
                });
            });
            socket.on('gameEnded', function(data){
                socket.broadcast.to(data.group).emit('gameEnd', data);
            });
        });
    }

    joinRoomWithSpace(socket) {
        const roomNameWithOnePlayer = this.getAnExistingRoomWithOnePlayer();
        if (!roomNameWithOnePlayer) {
            const room = this.createAndJoinNewRoom(socket);
            return room;
        }
        socket.join(roomNameWithOnePlayer);
        return roomNameWithOnePlayer;
    }

    getAnExistingRoomWithOnePlayer() {
        const roomWithOnePlayer = _.findKey(this.gameRooms, (room) => room.length === 1);
        return roomWithOnePlayer;
    }

    createAndJoinNewRoom(socket) {
        var rooms = Object.keys(this.gameRooms);
        const newGameRoomName = `game_room_${rooms.length+1}`;
        socket.join(newGameRoomName);
        this.gameRooms[newGameRoomName] = this.socketIo.nsps['/'].adapter.rooms[newGameRoomName];
        return newGameRoomName;
    }
    
}

module.exports = {
    socketConnections: SocketConnections
}