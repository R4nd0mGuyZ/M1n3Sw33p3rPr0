var http = require("http"),
    fs = require("fs"),
    socket = require("socket.io"),
    game = require("./server/game.js");

var server = http.createServer(function (request, response) {
    if (request.url.indexOf("/client") === 0) {
        response.writeHead(200);
        fs.readFile(request.url.substring(1), function (error, html) {
            response.end(html);
        });
    }
    else {
        response.writeHead(400);
        response.end("dummy");
    }
});

var io = socket(server);

var currentGame = new game.Game();
currentGame.initialize();

console.log("hello world");

server.listen(8080);

io.on("connection", function (socket) {

    socket.on("join", function () {
        console.log("join");
        socket.emit("game", {game: currentGame.getValues()});
        currentGame.action.playerJoin("", socket);
    });
});
