
function hasLOS(startx, starty, targetx, targety) {
	var distx = targetx - startx, disty = targety - starty;
	var maxdist = Math.max(Math.abs(distx), Math.abs(disty));
	var dx = distx / maxdist, dy = disty / maxdist;
	var xx = startx, yy = starty;
	for (var i = 0; i < maxdist; ++i) {
		if (eng.tileFunc(xx,yy).getChar() !== ".")
			return false;
		xx += dx; yy += dy;
	}
	return true;
}

function calculateFOV(x, y) {
	// Shoot a beam from the four corners of the player tile
	// to the corresponding corners of the target tile
	var d = 0.3;
	if (hasLOS(pl.x-d, pl.y-d, x-d, y-d)) return true;
	if (hasLOS(pl.x+d, pl.y-d, x+d, y-d)) return true;
	if (hasLOS(pl.x+d, pl.y+d, x+d, y+d)) return true;
	if (hasLOS(pl.x-d, pl.y+d, x-d, y+d)) return true;
	return false;
}

// Initializes the FOV
function initFOV() {
	eng.setMaskFunc(calculateFOV);
}
