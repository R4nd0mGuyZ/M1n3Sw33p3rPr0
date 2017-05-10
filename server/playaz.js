function Playa(name, id, socket, game){
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.game = game;
    this.fame = 0;
    this.wackness = 0;

    this.socket.on("clickField", function (data) {
        console.log(this.name + " clickedField");
        var field = game.action.clickField(data.field, data.rightClick);
        if (field) {
            if(field.status === field.STATUS_OPEN){
                if(field.isMine){
                    this.wackness ++;
                }else{
                    this.fame ++;
                }
            }
            console.log(this.name + " has now " + this.fame + " fame and " + this.wackness + " wackness.")
            this.game.playaz.tellAllPlayaz("field", {field: field});
        }
    }.bind(this));

    this.getValues = function(){
        return {
            id: this.id,
            name: this.name,
            fame: this.fame,
            wackness: this.wackness
        };
    }
}

function Playaz(game){
    this.game = game;

    this.idCount = -1;
    this.playaz = [];

    this.addPlaya = function(name, socket){
        this.idCount ++;
        var id = this.idCount;
        if(name === ""){
            name = "Playa#" + id;
        }
        socket.on("disconnect", function(){
            this.tellAllPlayaz("playaLeft", {id: id});
            this.removePlaya(id)
        }.bind(this));
        this.playaz.push(new Playa(name, id, socket, this.game));
    }

    this.removePlaya = function(id){
        var index = this.findPlayaIndex(id);
        if(index !== null){
            this.playaz.splice(index, 1);
            return true;
        }
        return false;
    }

    this.findPlayaIndex = function(id){
        for(var i = 0; i < this.playaz.length; i++){
            if(this.playaz[i].id === id){
                return i;
            }
        }
        return null;
    }

    this.tellAllPlayaz = function(eventName, data){
        for(var i = 0; i < this.playaz.length; i++){
            this.playaz[i].socket.emit(eventName, data);
        }
    }
}

module.exports = Playaz;
