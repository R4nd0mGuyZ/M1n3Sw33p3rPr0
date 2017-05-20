'use strict';
module.exports = function Player (name, id, socket, game) {
  this.id = id;
  this.name = name;
  this.socket = socket;
  this.game = game;
  this.fame = 0;
  this.wackness = 0;

  this.socket.on('clickField', function (data) {
    console.log(this.name + ' clickedField');
    this.game.clickField(this, data.field, data.rightClick, data.doubleClick);
  }.bind(this));

  this.addFame = function () {
    this.fame++;
    return this;
  };

  this.addWackness = function () {
    this.wackness++;
    return this;
  };

  this.getValues = function () {
    return {
      id: this.id,
      name: this.name,
      fame: this.fame,
      wackness: this.wackness
    };
  };
};
