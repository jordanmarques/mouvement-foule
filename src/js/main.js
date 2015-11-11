const ts = new Tileset("tiles.png");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var textMap;
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
    for (var i = 0; i < data.length; i++) {
        switch (data.charAt(i)) {
            case '*' :
                ts.drawTile(WALL, ctx, x, y);
                x += TILES_SIZE;
                break;

            case 'G' :
                ts.drawTile(GRASS, ctx, x, y);
                x += TILES_SIZE;
                break;

            case ' ' :
                ts.drawTile(FLOOR, ctx, x, y);
                x += TILES_SIZE;
                break;

            case 'D' :
                ts.drawTile(DOOR, ctx, x, y);
                x += TILES_SIZE;
                break;

            case 'A' :
                ts.drawTile(CHEESE, ctx, x, y);
                x += TILES_SIZE;
                break;

            case '\n' :
                x = 10;
                y += TILES_SIZE;

            case '\r' :
                break;
            default :

                ts.drawTile(FLOOR, ctx, x, y);
                x += TILES_SIZE;
                break;

        }
    }
}