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
                        door1.x = x/TILES_SIZE;
                        door1.y =  y/TILES_SIZE;
                    } else if(doorNumber == 1){
                        door2.x = x/TILES_SIZE;
                        door2.y = y/TILES_SIZE;
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
                cheeseOnMap.push(new Cheese(x/TILES_SIZE, y/TILES_SIZE));
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
    var speed = $("#speed").val();
    const immutableGraph = graph;
    door1.initMouseStock(mouseAtDoor1);
    door2.initMouseStock(mouseAtDoor2);

    do {

        window.setInterval(function(){
            for(var i = 0; i < mousesOnMap.length; i++){
                var nextPosX = mousesOnMap[i].path[0].x;
                var nextPosY = mousesOnMap[i].path[0].y;

                if(graph.grid[nextPosX][nextPosY].weight != 0){
                    ts.drawTile(MOUSE, ctx, nextPosY * TILES_SIZE, nextPosX * TILES_SIZE);
                    ts.drawTile(FLOOR, ctx, mousesOnMap[i].x * TILES_SIZE, mousesOnMap[i].y * TILES_SIZE);
                    graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 1;
                    mousesOnMap[i].x = nextPosY;
                    mousesOnMap[i].y = nextPosX;
                    graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 0;
                    mousesOnMap[i].path.splice(0,1);
                    if(mousesOnMap[i].path.length == 0){
                        graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 1;
                        mousesOnMap.splice(i,1);
                        i--;
                    }
                }
            }

            var mouseStockD1Size = door1.mouseStock.length;
            for (var i = 0; i < mouseStockD1Size; i++) {

                door1.freePositions = graph.grid.getFreePositionsArroundDoor(door1);
                if (!door1.freePositions.length > 0) {
                    break;
                } else {
                    var newMouse1 = door1.mouseStock.pop();
                    var freePos = door1.freePositions.pop();
                    newMouse1.x = freePos.x;
                    newMouse1.y = freePos.y;
                    newMouse1.path = newMouse1.ComputeShortestPath(cheeseOnMap, immutableGraph);
                    graph.grid[newMouse1.y][newMouse1.x].weight = 0;
                    ts.drawTile(MOUSE, ctx, newMouse1.x * TILES_SIZE, newMouse1.y * TILES_SIZE);
                    mousesOnMap.push(newMouse1);

                }

            }

            var mouseStockD2Size = door2.mouseStock.length;
            for (var i = 0; i < mouseStockD2Size; i++) {
                door2.freePositions = graph.grid.getFreePositionsArroundDoor(door2);
                if (!door2.freePositions.length > 0) {
                    break;
                } else {
                    var newMouse2 = door2.mouseStock.pop();
                    var freePos = door2.freePositions.pop();
                    newMouse2.x = freePos.x;
                    newMouse2.y = freePos.y;
                    newMouse2.path = newMouse2.ComputeShortestPath(cheeseOnMap, immutableGraph);
                    graph.grid[newMouse2.y][newMouse2.x].weight = 0;
                    ts.drawTile(MOUSE, ctx, newMouse2.x * TILES_SIZE, newMouse2.y * TILES_SIZE);
                    mousesOnMap.push(newMouse2);

                }
            }
        },speed);


    }while(mousesOnMap.length > 0)

}