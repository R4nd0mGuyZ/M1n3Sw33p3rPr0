(function () {

    var Board = function (game) {
        this.game = game;
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");

        this.fieldSize = 50;

        var size = this.fieldSize * this.game.size;
        this.canvas.setAttribute("width", size);
        this.canvas.setAttribute("height", size);

        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, size, size);

        this.renderField = function (field) {
            if (field.status === 1) {
                this.context.fillStyle = "lightgrey";
            } else if (field.status === 2) {
                this.context.fillStyle = "orange";
            } else if (field.status === 3) {
                if (field.isMine) {
                    this.context.fillStyle = "red";
                } else {
                    this.context.fillStyle = "white";
                }
            }
            this.context.fillRect(field.x * this.fieldSize + 1, field.y * this.fieldSize + 1, this.fieldSize - 2, this.fieldSize - 2);

            if (field.status === 3 && !field.isMine && field.neighbours) {
                this.context.fillStyle = "black";
                this.context.font = "30px Arial";
                this.context.fillText(field.neighbours, field.x * this.fieldSize + 16.5, field.y * this.fieldSize + 35);
            }
        };

        for (var x = 0; x < this.game.size; x++) {
            for (var y = 0; y < this.game.size; y++) {
                this.renderField(this.game.fields[x][y]);
            }
        }
    };

    var Controller = function (board, socket) {
        this.board = board;
        this.socket = socket;

        this.board.canvas.addEventListener("click", function (event) {
            var x = Math.floor(event.offsetX / this.board.fieldSize);
            var y = Math.floor(event.offsetY / this.board.fieldSize);
            var field = this.board.game.fields[x] && this.board.game.fields[x][y];
            if (field) {
                this.clickField(field, false);
            }
        }.bind(this));

        this.board.canvas.addEventListener("contextmenu", function (event) {
            var x = Math.floor(event.offsetX / this.board.fieldSize);
            var y = Math.floor(event.offsetY / this.board.fieldSize);
            var field = this.board.game.fields[x] && this.board.game.fields[x][y];
            if (field) {
                this.clickField(field, true);
            }
            event.preventDefault();
            return false;
        }.bind(this));

        this.clickField = function (field, rightClick) {
            console.log("clickField");
            socket.emit("clickField", {field: field, rightClick: rightClick});
        };

    };

    var board = null;
    var controller = null;

    var socket = io('http://localhost:8080');

    socket.emit("join");

    socket.on("game", function (data) {
        console.log("game");

        board = new Board(data.game);
        controller = new Controller(board, socket);
    });

    socket.on("field", function (data) {
        console.log("field");

        board.game.fields[data.field.x][data.field.y] = data.field;
        board.renderField(data.field);
    });

}());