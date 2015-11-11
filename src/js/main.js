const ts = new Tileset("tiles.png");
const FLOOR = 1;
const WALL = 2;
const GRASS = 3;
const DOOR = 4;
const MOUSE = 5;
const CHEESE = 6;
const TILES_SIZE = 30;


window.onload = function() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        }
        function draw() {
            var ctx = canvas.getContext('2d');
            ts.drawTile(FLOOR, ctx, 10, 40);
            ts.drawTile(WALL, ctx, 10, 10);
            ts.drawTile(GRASS, ctx, 40, 10);
            ts.drawTile(DOOR, ctx, 130, 10);
            ts.drawTile(MOUSE, ctx, 170, 10);
            ts.drawTile(CHEESE, ctx, 210, 10);
        }
        resizeCanvas();
};

document.getElementById('file').onchange = function() {
    $.get('maps/'+$('#file').val().replace("C:\\fakepath\\", ""), function(data) {
        console.log(data);

        for(i; i<data.length; i++) {
            switch(data.charAt(i)) {
                case '*' :
                    break;

                case 'G' :
                    break;

                case ' ' :
                    break;

                case 'D' :
                    break;

                case 'A' :
                    break;
            }
        }

    })
};