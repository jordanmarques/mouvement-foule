const ts = new Tileset("tiles-22.png");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var textMap;
var graphInBuild = [];
var mousesOnMap = [];
var cheeseOnMap = [];
var graph;
var immutableGraph;
var door1 = new Door();
var door2 = new Door();
const FLOOR = 1;
const WALL = 2;
const GRASS = 3;
const DOOR = 4;
const MOUSE = 5;
const CHEESE = 6;
const TILES_SIZE = 21;

var canvasRef = document.getElementById('canvas');

window.onload = function() {
        var context = canvas.getContext('2d');
        window.addEventListener('resize', resizeCanvas, false);

       function resizeCanvas() {
            canvas.width = 1200;
            canvas.height = 500;
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
    immutableGraph = new Graph(graphInBuild);
}

function launch() {
    if($("#door1").val() > 0) var mouseAtDoor1 = $("#door1").val();
    if($("#door2").val() > 0) var mouseAtDoor2 = $("#door2").val();
    if($("#speed").val() > 0) var speed = $("#speed").val();

    var tour = 1;
    var mouves = 0;
    var mousesDone = 0;

    door1.initMouseStock(mouseAtDoor1);
    door2.initMouseStock(mouseAtDoor2);


        var id = window.setInterval(function(){
            tour++;
            for(var i = 0; i < mousesOnMap.length; i++){
                var nextPosX = mousesOnMap[i].path[0].x;
                var nextPosY = mousesOnMap[i].path[0].y;
                if( mousesOnMap[i].waiting){
                    mousesOnMap[i].waiting = false;
                }else{

                    if(graph.grid[nextPosX][nextPosY].weight == 2){
                        mouves ++;
                        mousesOnMap[i].waiting = true;
                        ts.drawTile(MOUSE, ctx, nextPosY * TILES_SIZE, nextPosX * TILES_SIZE);
                        if(mousesOnMap[i].previousTiles == null){
                            ts.drawTile(FLOOR, ctx, mousesOnMap[i].x * TILES_SIZE, mousesOnMap[i].y * TILES_SIZE);
                        }else{
                            ts.drawTile(mousesOnMap[i].previousTiles, ctx, mousesOnMap[i].x * TILES_SIZE, mousesOnMap[i].y * TILES_SIZE);
                        }
                        mousesOnMap[i].grass = true;
                        graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 1;
                        mousesOnMap[i].x = nextPosY;
                        mousesOnMap[i].y = nextPosX;
                        graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 0;
                        mousesOnMap[i].path.splice(0,1);
                        mousesOnMap[i].previousTiles = GRASS;
                        if(mousesOnMap[i].path.length == 0){
                            graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 1;
                            mousesOnMap.splice(i,1);
                            i--;
                            mousesDone ++;
                        }
                    } else if(graph.grid[nextPosX][nextPosY].weight != 0){
                        mouves ++;
                        ts.drawTile(MOUSE, ctx, nextPosY * TILES_SIZE, nextPosX * TILES_SIZE);
                        if(mousesOnMap[i].previousTiles == null){
                            ts.drawTile(FLOOR, ctx, mousesOnMap[i].x * TILES_SIZE, mousesOnMap[i].y * TILES_SIZE);
                        }else{
                            ts.drawTile(mousesOnMap[i].previousTiles, ctx, mousesOnMap[i].x * TILES_SIZE, mousesOnMap[i].y * TILES_SIZE);
                        }
                        ts.drawTile(mousesOnMap[i].previousTiles, ctx, mousesOnMap[i].x * TILES_SIZE, mousesOnMap[i].y * TILES_SIZE);
                        if(mousesOnMap[i].grass){
                            graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 2;
                        }else{
                            graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 1;
                        }
                        mousesOnMap[i].grass = false;
                        mousesOnMap[i].x = nextPosY;
                        mousesOnMap[i].y = nextPosX;
                        graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 0;
                        mousesOnMap[i].path.splice(0,1);
                        mousesOnMap[i].previousTiles = FLOOR;
                        if(mousesOnMap[i].path.length == 0){
                            graph.grid[mousesOnMap[i].y][mousesOnMap[i].x].weight = 1;
                            mousesOnMap.splice(i,1);
                            i--;
                            mousesDone ++;
                        }
                    }
                }
                if(mousesOnMap.length >= 0){
                    $("#tour").text(tour);
                    $("#deplacements").text(mouves);
                    $("#sourisTerrain").text(mousesOnMap.length);
                    $("#sourisArrivee").text(mousesDone);

                }
            }
            if(mousesOnMap.length >= 0){
                $("#deplacements").text(mouves);
                $("#sourisTerrain").text(mousesOnMap.length);
                $("#sourisArrivee").text(mousesDone);

            }
            doorManagement(door1);
            doorManagement(door2);
        },speed);

    function doorManagement(door){
        var mouseStockSize = door.mouseStock.length;
        for (var i = 0; i < mouseStockSize; i++) {
            door.freePositions = graph.grid.getFreePositionsArroundDoor(door);
            if (!door.freePositions.length > 0) {
                break;
            } else {
                var newMouse = door.mouseStock.pop();
                var freePos = door.freePositions.pop();
                newMouse.x = freePos.x;
                newMouse.y = freePos.y;
                newMouse.path = newMouse.ComputeShortestPath(cheeseOnMap, immutableGraph);
                graph.grid[newMouse.y][newMouse.x].weight = 0;
                ts.drawTile(MOUSE, ctx, newMouse.x * TILES_SIZE, newMouse.y * TILES_SIZE);
                mousesOnMap.push(newMouse);

            }
        }
    }

}