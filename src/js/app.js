const ts = new Tileset("tiles.png");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var textMap;
var graphInBuild = [];
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
    var x = 10;
    var y  = 10;
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
                        door1.x = (x-10)/30;
                        door1.y =  (y-10)/30;
                    } else if(doorNumber == 1){
                        door2.x = (x-10)/30;
                        door2.y =  (y-10)/30;
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
                x += TILES_SIZE;
                graphLine.push(0);
                break;

            case '\n' :
                x = 10;
                y += TILES_SIZE;
                graphInBuild.push(graphLine);
                graphLine=[];

            case '\r' :
                break;

            default :
                ts.drawTile(FLOOR, ctx, x, y);
                x += TILES_SIZE;
                break;

        }
    }
    graph = new Graph(graphInBuild);
}

function launch() {
    var mouseAtDoor1 = $("#door1").val();
    var mouseAtDoor2 = $("#door2").val();
    door1.initMouseStock(mouseAtDoor1);
    door2.initMouseStock(mouseAtDoor2);
    console.log(graph.grid.getFreePositionsArroundDoor(door2));
}