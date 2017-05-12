'use strict';
var Playa = require('./Player.js');

module.exports = function Players (game) {
  this.game = game;

  this.idCount = -1;
  this.playaz = [];

  this.addPlaya = function (name, socket) {
    this.idCount ++;
    var id = this.idCount;
    if (name === '') {
      name = 'Playa#' + id;
    }
    socket.on('disconnect', function () {
      this.tellAllPlayaz('playaLeft', {id: id});
      this.removePlaya(id);
    }.bind(this));
    this.playaz.push(new Playa(name, id, socket, this.game));
  };

  this.removePlaya = function (id) {
    var index = this.findPlayaIndex(id);
    if (index !== null) {
      this.playaz.splice(index, 1);
      return true;
    }
    return false;
  };

  this.findPlayaIndex = function (id) {
    for (var i = 0; i < this.playaz.length; i++) {
      if (this.playaz[i].id === id) {
        return i;
      }
    }
    return null;
  };

  this.tellAllPlayaz = function (eventName, data) {
    for (var i = 0; i < this.playaz.length; i++) {
      this.playaz[i].socket.emit(eventName, data);
    }
  };
};
