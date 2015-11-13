const ts = new Tileset("tiles.png");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var textMap;
var graphInBuild = [];
var mousesOnMap = [];
var cheeseOnMap = [];
var graph;
var door1 = new Door();
var door2 = new Door();
const FLOOR = 1;
const WALL = 2;
const GRASS = 3;
const DOOR = 4;
const MOUSE = 5;
const CHEESE = 6;
const TILES_SIZE = 30;


window.onload = function() {
        var context = canvas.getContext('2d');
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if(textMap){
                draw(textMap);
            }
        }
        resizeCanvas();
};

document.getElementById('file').onchange = function() {
    $.get('maps/'+$('#file').val().replace("C:\\fakepath\\", ""), function(data) {
         textMap = data;
        draw(textMap);
    });
};

function draw(data) {
    var x = 0;
    var y  = 0;
    var doorNumber = 0;
    var graphLine=[];
    for (var i = 0; i < data.length; i++) {
        switch (data.charAt(i)) {
            case '*' :
                ts.drawTile(WALL, ctx, x, y);
                x += TILES_SIZE;
                graphLine.push(0);
                break;

            case 'G' :
                ts.drawTile(GRASS, ctx, x, y);
                x += TILES_SIZE;
                graphLine.push(2);
                break;

            case ' ' :
                ts.drawTile(FLOOR, ctx, x, y);
                x += TILES_SIZE;
                graphLine.push(1);
                break;

            case 'D' :
                if(doorNumber <= 2) {
                    ts.drawTile(DOOR, ctx, x, y);
                    if(doorNumber == 0){
                        door1.x = x/30;
                        door1.y =  y/30;
                    } else if(doorNumber == 1){
                        door2.x = x/30;
                        door2.y = y/30;
                    }
                    x += TILES_SIZE;
                    doorNumber += 1;
                    graphLine.push(0);
                }else{
                    ts.drawTile(FLOOR, ctx, x, y);
                    x += TILES_SIZE;
                    graphLine.push(1);
                }
                break;

            case 'A' :
                ts.drawTile(CHEESE, ctx, x, y);
                cheeseOnMap.push(new Cheese(x/30, y/30));
                graphLine.push(1);
                x += TILES_SIZE;
                break;

            case '\n' :
                x = 0;
                y += TILES_SIZE;
                graphInBuild.push(graphLine);
                graphLine=[];

            case '\r' :
                break;

            default :
                ts.drawTile(FLOOR, ctx, x, y);
                x += TILES_SIZE;
                graphLine.push(1);
                break;

        }
    }
    if(graphLine.length != 0) {
        graphInBuild.push(graphLine);
    }
    graph = new Graph(graphInBuild);
}

function launch() {
    var mouseAtDoor1 = $("#door1").val();
    var mouseAtDoor2 = $("#door2").val();
    door1.initMouseStock(mouseAtDoor1);
    door2.initMouseStock(mouseAtDoor2);

    do {
        for(var i = 0; i < mousesOnMap.length; i++){
            //var copyOfMousesOnMap = mousesOnMap;
            var nextPosX = mousesOnMap[i].path[0].x;
            var nextPosY = mousesOnMap[i].path[0].y;

            //if(graph.grid[nextPosX][nextPosY].weight == 0){
                ts.drawTile(MOUSE, ctx, nextPosY * 30, nextPosX * 30);
                ts.drawTile(FLOOR, ctx, mousesOnMap[i].x * 30, mousesOnMap[i].y * 30);
                graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 0;
                graph.grid[nextPosX][nextPosY].weight = 1;
                mousesOnMap[i].x = nextPosY;
                mousesOnMap[i].y = nextPosX;

                mousesOnMap[i].path.splice(0,1);
                //if(mousesOnMap[i].path.length == 0){
                //    copyOfMousesOnMap.splice(i,1);
                //}
            //}

        }
        //mousesOnMap = copyOfMousesOnMap;

        var mouseStockD1Size = door1.mouseStock.length;
        for (var i = 0; i < mouseStockD1Size; i++) {

            door1.freePositions = graph.grid.getFreePositionsArroundDoor(door1);
            if (!door1.freePositions.length > 0) {
                break;
            } else {
                var newMouse = door1.mouseStock.pop();
                var freePos = door1.freePositions.pop();
                newMouse.x = freePos.x;
                newMouse.y = freePos.y;
                newMouse.path = newMouse.ComputeShortestPath(cheeseOnMap);
                graph.grid[newMouse.y][newMouse.x].weight = 0;
                ts.drawTile(MOUSE, ctx, newMouse.x * 30, newMouse.y * 30);
                mousesOnMap.push(newMouse);

            }

        }

        var mouseStockD2Size = door2.mouseStock.length;
        for (var i = 0; i < mouseStockD2Size; i++) {
            door2.freePositions = graph.grid.getFreePositionsArroundDoor(door2);
            if (!door2.freePositions.length > 0) {
                break;
            } else {
                var newMouse = door2.mouseStock.pop();
                var freePos = door2.freePositions.pop();
                newMouse.x = freePos.x;
                newMouse.y = freePos.y;
                newMouse.path = newMouse.ComputeShortestPath(cheeseOnMap);
                graph.grid[newMouse.y][newMouse.x].weight = 0;
                ts.drawTile(MOUSE, ctx, newMouse.x * 30, newMouse.y * 30);
                mousesOnMap.push(newMouse);

            }
        }
        //sleep(500);
    }while(mousesOnMap.length > 0)



}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}