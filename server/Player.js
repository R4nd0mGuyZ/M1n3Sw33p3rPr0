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
    var fields = this.game.clickField(data.field, data.rightClick, data.doubleClick);
    if (!fields) {
      return;
    }
    fields.forEach(function (field) {
      if (field) {
        if (field.status === field.STATUS_OPEN) {
          if (field.isMine) {
            this.wackness ++;
          } else {
            this.fame ++;
          }
        }
      }
    }.bind(this));
    console.log(this.name + ' has now ' + this.fame + ' fame and ' + this.wackness + ' wackness.');
    this.game.playerList.tellAllPlayers('fields', {fields: fields, player: this.getValues()});
  }.bind(this));

  this.getValues = function () {
    return {
      id: this.id,
      name: this.name,
      fame: this.fame,
      wackness: this.wackness
    };
  };
};
