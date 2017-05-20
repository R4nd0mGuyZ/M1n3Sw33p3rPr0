'use strict';
module.exports = function Field () {
  this.STATUS_CLOSED = 1;
  this.STATUS_FLAGGED = 2;
  this.STATUS_OPEN = 3;

  this.x = null;
  this.y = null;

  this.isMine = false;
  this.neighbours = null;

  this.status = null;

  this.isClosed = function () {
    return this.status === this.STATUS_CLOSED;
  };

  this.isFlagged = function () {
    return this.status === this.STATUS_FLAGGED;
  };

  this.isOpen = function () {
    return this.status === this.STATUS_OPEN;
  };

  this.open = function () {
    if (this.isClosed()) {
      this.status = this.STATUS_OPEN;
      return this;
    }
    return false;
  };

  this.toggleFlag = function () {
    if (!this.isOpen()) {
      this.status = (this.isFlagged() ? this.STATUS_CLOSED : this.STATUS_FLAGGED);
      return this;
    }
    return false;
  };

  this.getValues = function () {
    var isMine = (this.status === this.STATUS_OPEN ? this.isMine : null);
    return {
      x: this.x,
      y: this.y,
      isMine: isMine,
      neighbours: this.neighbours,
      status: this.status
    };
  };
};
