'use strict';
var Player = require('./Player.js');

module.exports = function Players (game) {
  this.game = game;

  this.idCount = -1;
  this.players = [];

  this.addPlayer = function (name, socket) {
    this.idCount ++;
    var id = this.idCount;
    if (name === '') {
      name = 'Player#' + id;
    }
    socket.on('disconnect', function () {
      this.tellAllPlayers('playerLeft', {id: id});
      this.removePlayer(id);
    }.bind(this));
    this.players.push(new Player(name, id, socket, this.game));
    this.tellAllPlayers('PlayerJoined', {id: id});
  };

  this.removePlayer = function (id) {
    var index = this.findPlayerIndex(id);
    if (index !== null) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  };

  this.findPlayerIndex = function (id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        return i;
      }
    }
    return null;
  };

  this.tellAllPlayers = function (eventName, data) {
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].socket.emit(eventName, data);
    }
  };
};
