var term, eng; // Can't be initialized yet because DOM is not ready
var pl = { x: 3, y: 2 }; // Player position
var updateFOV; // For some of the examples
var map = [
	"##############################",
	"##   ###############   #######",
	"##          ########      ####",
	"##   ###### ########  ### ####",
	"########### ############# ####",
	"########### ############     #",
	"########### ############     #",
	"########### ############     #",
	"###########                  #",
	"############## ###############",
	"############## #######    ####",
	"#        ##### ####### #  ####",
	"#  ####   #### ####### #######",
	"#         #### ####### #######",
	"#         #### #######      ##",
	"## ########### #######      ##",
	"## ########### ########### ###",
	"## ########### ########### ###",
	"## ########### ########### ###",
	"## #####       ########### ###",
	"## #####     # ########### ###",
	"## #####     # ########### ###",
	"## #####     # ########### ###",
	"## #####     # ########### ###",
	"## ########### ########### ###",
	"## ########### ########### ###",
	"## ###########             ###",
	"## ############# #############",
	"##               #############",
	"##############################"
];

// The tile palette is precomputed in order to not have to create
// thousands of Tiles on the fly.
var AT = new ut.Tile("@", 255, 255, 255);
var WALL = new ut.Tile('#', 100, 100, 100);
var FLOOR = new ut.Tile('.', 50, 50, 50);

// Returns a Tile based on the char array map
function getDungeonTile(x, y) {
	var t = "";
	try { t = map[y][x]; }
	catch(err) { return ut.NULLTILE; }
	if (t === '#') return WALL;
	if (t === ' ') return FLOOR;
	return ut.NULLTILE;
}

// Initialize stuff
function initSimpleDungeon() {
	window.setInterval("tick()", 150);
	// Initialize Viewport, i.e. the place where the characters are displayed
	term = new ut.Viewport(document.getElementById("game"), 41, 29);
	// Initialize Engine, i.e. the Tile manager
	eng = new ut.Engine(term, getDungeonTile, map[0].length, map.length);
	// Initialize input
	ut.initInput();
}

// Simple movement with arrows and collision detection
function handleKeys() {
	var oldx = pl.x, oldy = pl.y;
	if (ut.isKeyPressed(ut.KEY_LEFT)  || ut.isKeyPressed(ut.KEY_H)) pl.x--;
	if (ut.isKeyPressed(ut.KEY_RIGHT) || ut.isKeyPressed(ut.KEY_L)) pl.x++;
	if (ut.isKeyPressed(ut.KEY_UP)    || ut.isKeyPressed(ut.KEY_K)) pl.y--;
	if (ut.isKeyPressed(ut.KEY_DOWN)  || ut.isKeyPressed(ut.KEY_J)) pl.y++;
	if (eng.tileFunc(pl.x, pl.y).getChar() !== '.') { pl.x = oldx; pl.y = oldy; }
}

// "Main loop"
function tick() {
	handleKeys(); // Input
	if (updateFOV) updateFOV(pl.x, pl.y); // Update field of view (used in some examples)
	eng.update(pl.x, pl.y); // Update tiles
	term.put(AT, term.cx, term.cy); // Player character
	term.render(); // Render
}
