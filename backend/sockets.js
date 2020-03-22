const _ = require('lodash');
const socket = require('socket.io');
const utils = require('./utils');

class SocketConnections {
    constructor(httpServer) {
        this.socketIo = socket(httpServer);
        this.subscribeSocketEvents();
        this.gameRooms = {};
        this.gameRoomPlayers = {};
        this.gameRoomDetails = {};
    }

    isPlayer1(roomName, socket) {
        if(!this.gameRooms[roomName]) {
            throw Error('Room doesn\'t exist');
        }
        const playerIndex = _.findIndex(
            _.keys(this.gameRooms[roomName].sockets), 
            (id) => {
                return socket.id === id;
            }
        );
        if (playerIndex === 0) return true;
        if (playerIndex === 1) return false;
        throw Error('Player doesn\'t exist in the room');
    }

    getMyRoomName(socket) {
        const roomName = _.find(
            _.keys(this.gameRooms),
            roomName => Boolean(socket.rooms[roomName])
        );
        return roomName;
    }

    initializeGame(roomName) {
        const boxes = Array(9).fill(null);
        this.gameRoomDetails[roomName] = {
            boxes,
            turnPlayer1: true,
        };
        this.socketIo.in(roomName).emit('updated_box', {
            status: 'started',
            winner: '',
            boxes,
            turnPlayer1: true,
        });
    }

    subscribeSocketEvents() {
        
        this.socketIo.on('connection', (socket) => {

            socket.on('join_game', (data) => {
                //Find an existing room with only one player, 
                //if There is no room or no vacant room, create one
                const roomName = this.joinRoomWithSpace(socket);
                debugger;
                const isPlayer1 = this.isPlayer1(roomName, socket);
                let playerEventName; 
                if (isPlayer1) {
                    playerEventName = `player1`;
                } else {
                    playerEventName = `player2`;
                }
                if (playerEventName) {
                    const joinDetails = {
                        ...data, 
                        joined: playerEventName ,
                        roomName, 
                    };
                    let broadcast = false;
                    if (playerEventName === 'player2') {
                        this.gameRoomPlayers[roomName].player2Details = data;
                        broadcast = true;
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

                    if(broadcast) {
                        this.initializeGame(roomName);
                    }
                    
                }
            });

            socket.on('clicked_box', ({ position }) => {
                const roomName = this.getMyRoomName(socket);
                
                const isPlayer1 = this.isPlayer1(roomName, socket);
                const game = this.gameRoomDetails[roomName];

                if (game.turnPlayer1) {
                    if(!isPlayer1) return;
                } else if (isPlayer1) {
                    return;
                }

                const fill = isPlayer1 ? 'X': 'O';
                game.boxes[position] = fill;
                game.turnPlayer1 = !game.turnPlayer1;
                const winner = utils.getWinner(game.boxes);
                let miscellaneousDetails = {};
                if (winner) {
                    miscellaneousDetails = {
                        status: 'completed',
                        winner: winner === 'X' ? 'player1': 'player2',
                    };
                } else {
                    const emptyPosition = _.findIndex(game.boxes, fill => fill === null);
                    if(emptyPosition === -1) {
                        miscellaneousDetails.status = 'completed';
                    }
                }

                this.socketIo.in(roomName).emit(
                    'updated_box', {
                        boxes: game.boxes,
                        turnPlayer1: game.turnPlayer1,
                        ...miscellaneousDetails
                    }
                );
            });

            socket.on('restart_game', () => {
                const roomName = this.getMyRoomName(socket);
                this.initializeGame(roomName);
            })

            socket.on('gameEnded', (data) => {
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