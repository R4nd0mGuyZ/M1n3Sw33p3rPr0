'use strict';
var Player = require('./Player.js');

module.exports = function PlayerList (game) {
  this.game = game;

  this.idCount = -1;
  this.players = [];

  this.getValues = function () {
    return {
      players: this.players.map(function (player) {
        return player.getValues();
      })
    };
  };

  this.addPlayer = function (name, socket) {
    this.idCount ++;
    var id = this.idCount;
    if (name === '') {
      name = 'Player#' + id;
    }

    socket.emit('game', {game: this.game.getValues(), playerList: this.getValues()});

    socket.on('disconnect', function () {
      this.tellAllPlayerList('PlayerLeft', {id: id});
      this.removePlayer(id);
    }.bind(this));
    var player = new Player(name, id, socket, this.game);
    this.players.push(player);
    this.tellAllPlayerList('PlayerJoined', {player: player.getValues()});
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

  this.tellAllPlayerList = function (eventName, data) {
    for (var i = 0; i < this.players.length; i++) {
      this.players[i].socket.emit(eventName, data);
    }
  };
};
