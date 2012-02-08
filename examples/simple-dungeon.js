var term, eng; // Can't be initialized yet because DOM is not ready
var pl = { x: 3, y: 2 };
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

// Returns a Tile from the char array map
function getDungeonTile(x, y) {
	x = Math.round(x), y = Math.round(y);
	var t = "";
	try { t = map[y][x]; }
	catch(err) { return ut.NULLTILE; }
	if (t === '#') return new ut.Tile('#', 100, 100, 100);
	return new ut.Tile(t);
}

// Initialize stuff
function initSimpleDungeon() {
	window.setInterval("tick()", 150);
	term = new ut.Viewport(document.getElementById("game"), 41, 25);
	eng = new ut.Engine(term, getDungeonTile);
}

// Simple movement with arrows and collision detection
function handleKeys() {
	var oldx = pl.x, oldy = pl.y;
	if (pressedKeys[KEY_LEFT])  pl.x--;
	if (pressedKeys[KEY_RIGHT]) pl.x++;
	if (pressedKeys[KEY_UP])    pl.y--;
	if (pressedKeys[KEY_DOWN])  pl.y++;
	if (getDungeonTile(pl.x, pl.y).getChar() === '#') { pl.x = oldx; pl.y = oldy; }
}

// "Main loop"
function tick() {
	handleKeys(); // Input
	eng.update(pl.x, pl.y); // Update tiles
	term.put(new ut.Tile("@", 255, 255, 255), term.cx, term.cy); // Player character
	term.render(); // Render
}
