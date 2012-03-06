var term, eng; // Can't be initialized yet because DOM is not ready
var pl = { x: 3, y: 2 }; // Player position
var updateFOV; // For some of the examples
var map = [
	" #####             #####      ",
	" #...########      #...####   ",
	" #..........#      #......#   ",
	" #...######.#      #..###.#   ",
	" #####    #.#      ######.####",
	"          #.#          #.....#",
	"          #.#          #.....#",
	"          #.############.....#",
	"          #..................#",
	"          ####.###############",
	"##########   #.#     #....#   ",
	"#........##  #.#     #.#..#   ",
	"#..####...#  #.#     #.#..#   ",
	"#.........#  #.#     #.###### ",
	"#.........#  #.#     #......# ",
	"##.########  #.#     #......# ",
	" #.#         #.#     #####.## ",
	" #.#         #.#         #.#  ",
	" #.#   #######.#         #.#  ",
	" #.#   #.......#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #.....#.#         #.#  ",
	" #.#   #######.#         #.#  ",
	" #.#         #.###########.#  ",
	" #.#         #.............#  ",
	" #.#############.###########  ",
	" #...............#            ",
	" #################            "
];

// The tile palette is precomputed in order to not have to create
// thousands of Tiles on the fly.
var AT = new ut.Tile("@", 255, 255, 255);
var WALL = new ut.Tile('▒', 100, 100, 100);
var FLOOR = new ut.Tile('.', 50, 50, 50);

// Returns a Tile based on the char array map
function getDungeonTile(x, y) {
	var t = "";
	try { t = map[y][x]; }
	catch(err) { return ut.NULLTILE; }
	if (t === '#') return WALL;
	if (t === '.') return FLOOR;
	return ut.NULLTILE;
}

// "Main loop"
function tick() {
	if (updateFOV) updateFOV(pl.x, pl.y); // Update field of view (used in some examples)
	eng.update(pl.x, pl.y); // Update tiles
	term.put(AT, term.cx, term.cy); // Player character
	term.render(); // Render
}

// Key press handler - movement & collision handling
function onKeyDown(k) {
	var movedir = { x: 0, y: 0 }; // Movement vector
	if (k === ut.KEY_LEFT || k === ut.KEY_H) movedir.x = -1;
	else if (k === ut.KEY_RIGHT || k === ut.KEY_L) movedir.x = 1;
	else if (k === ut.KEY_UP || k === ut.KEY_K) movedir.y = -1;
	else if (k === ut.KEY_DOWN || k === ut.KEY_J) movedir.y = 1;
	if (movedir.x === 0 && movedir.y === 0) return;
	var oldx = pl.x, oldy = pl.y;
	pl.x += movedir.x;
	pl.y += movedir.y;
	if (eng.tileFunc(pl.x, pl.y).getChar() !== '.') { pl.x = oldx; pl.y = oldy; }
	tick();
}

// Initialize stuff
function initSimpleDungeon() {
	window.setInterval(tick, 100); // Animation
	// Initialize Viewport, i.e. the place where the characters are displayed
	term = new ut.Viewport(document.getElementById("game"), 41, 25);
	// Initialize Engine, i.e. the Tile manager
	eng = new ut.Engine(term, getDungeonTile, map[0].length, map.length);
	// Display renderer
	document.getElementById("renderer").innerHTML = term.getRendererString();
	// Initialize input
	ut.initInput(onKeyDown);
}


