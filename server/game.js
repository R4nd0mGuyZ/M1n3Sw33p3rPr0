var Field = function () {

    this.STATUS_CLOSED = 1;
    this.STATUS_FLAGGED = 2;
    this.STATUS_OPEN = 3;

    this.x = null;
    this.y = null;

    this.isMine = false;
    this.neighbours = null;

    this.status = null;

};

var Game = function () {
    this.size = 10;
    this.mines = 20;
    this.fields = [];

    this.generateFields = function () {
        this.fields = [];
        for (var x = 0; x < this.size; x++) {
            this.fields[x] = [];
            for (var y = 0; y < this.size; y++) {
                var field = new Field();
                field.x = x;
                field.y = y;
                field.status = field.STATUS_CLOSED;
                this.fields[x][y] = field;
            }
        }
    };

    this.generateMines = function () {
        for (var i = 0; i < this.mines; i++) {
            var x = Math.floor(Math.random() * this.size);
            var y = Math.floor(Math.random() * this.size);
            var field = this.fields[x][y];
            if (field.isMine) {
                i--;
                continue;
            }
            field.isMine = true;
        }
    };

    this.calculateNeighbours = function (field) {
        if (field.neighbours !== null) {
            return field.neighbours;
        }
        var neighbours = 0;
        for (var x = field.x - 1; x <= field.x + 1; x++) {
            for (var y = field.y - 1; y <= field.y + 1; y++) {
                if (x === field.x && y === field.y) {
                    continue;
                }
                if (!this.fields[x] || !this.fields[x][y]) {
                    continue;
                }
                if (this.fields[x][y].isMine) {
                    neighbours++;
                }
            }
        }
        field.neighbours = neighbours;
        return neighbours;
    };

    this.initialize = function () {
        this.generateFields();
        this.generateMines();
    };

};

var Action = function (game) {
    this.game = game;

    this.clickField = function (plainField, rightClick) {
        var field = this.game.fields[plainField.x] && this.game.fields[plainField.x][plainField.y];
        if (!field) {
            return false;
        }
        if (field.status === field.STATUS_CLOSED) {
            if (rightClick) {
                return this.flagField(field)
            } else {
                return this.openField(field)
            }
        } else if (field.status === field.STATUS_FLAGGED) {
            if (rightClick) {
                return this.flagField(field)
            }
        }
        return false;
    };

    this.openField = function (field) {
        if (field.isMine) {
            return false;
        }
        game.calculateNeighbours(field);
        field.status = field.STATUS_OPEN;
        return field;
    };

    this.flagField = function (field) {
        field.status = (field.status === field.STATUS_FLAGGED ? field.STATUS_CLOSED : field.STATUS_FLAGGED);
        return field;
    };

};

module.exports.Field = Field;
module.exports.Game = Game;
module.exports.Action = Action;
