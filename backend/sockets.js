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

    getMyOpponent(roomName, socket) {
        const socketIds = _.keys(this.gameRooms[roomName].sockets);
        const opponentPlayerSocketId = _.find(
            _.socketIds, 
            (id) => {
                return socket.id !== id;
            }
        );
        const playerIndex = _.indexOf(socketIds, opponentPlayerSocketId) + 1;
        if(opponentPlayerSocketId) {
            return {
                name: this.gameRoomPlayers[roomName][`player${playerIndex}Details`].name,
                socket: this.gameRooms[roomName].sockets[opponentPlayerSocketId],
            };
        };
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

    joinPlayerOne(roomName, socket, data) {
        const playerEventName = `player1`;
        const joinDetails = {
            ...data, 
            joined: playerEventName ,
            roomName, 
        };
        this.gameRoomPlayers[roomName] = {
            player1Details: data,
        };
        const roomDetails = _.assign(joinDetails, { 
            ...this.gameRoomPlayers[roomName] 
        });
        socket.emit('you_joined', roomDetails);
    }

    joinPlayerTwo(roomName, socket, data) {
        const playerEventName = `player2`;
        const joinDetails = {
            ...data, 
            joined: playerEventName ,
            roomName, 
        };
        this.gameRoomPlayers[roomName].player2Details = data;
        const roomDetails = _.assign(joinDetails, { 
            ...this.gameRoomPlayers[roomName] 
        });
        socket.to(roomName).emit('other_player_joined', roomDetails);
        socket.emit('you_joined', roomDetails);
        this.initializeGame(roomName);
    }

    joinNewPlayer(data, socket) {
        const roomName = this.joinRoomWithSpace(socket);
        const isPlayer1 = this.isPlayer1(roomName, socket);
        if (isPlayer1) {
            this.joinPlayerOne(roomName, socket, data);
        } else {
            this.joinPlayerOne(roomName, socket, data);
        }
    }

    subscribeSocketEvents() {
        
        this.socketIo.on('connection', (socket) => {

            socket.on('join_game', (data) => {
                //Find an existing room with only one player, 
                //if There is no room or no vacant room, create one
                this.joinNewPlayer(data, socket);
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

            socket.on('disconnecting', () => {
                const roomName = this.getMyRoomName(socket);
                debugger;
                //User will automatically be removed from rooms. Use this event
                //To clear any data that you may have prepared
                //and communicate other stakeholders, if any

                //Find the opponent before clearing the data
                const opponent = this.getMyOpponentSocket(roomName, socket);

                delete this.gameRooms[roomName];
                delete this.gameRoomPlayers[roomName];
                delete this.gameRoomDetails[roomName];
                
                //Get  the remaining player, inform the player, and join a new room.
                if(opponent) {
                    socket.to(roomName).emit('opponent_left', roomDetails);
                    this.joinNewPlayer({ name: opponent.name }, socket);
                }
            })
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