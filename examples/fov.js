// WARNING: The implementation of the FOV here is very poor.
// It produces barely passable FOV and is very CPU intensive.
// However it is simple and demonstrates how easy it is to use the
// Engine's mask function capability.


function hasLOS(startx, starty, targetx, targety) {
	// Calculate x and y components of the distance to target
	var distx = targetx - startx, disty = targety - starty;
	// Pick the greatest distance
	var maxdist = Math.max(Math.abs(distx), Math.abs(disty));
	// Create step amounts so that step along the longer axis is 1
	var dx = distx / maxdist, dy = disty / maxdist;
	var xx = startx, yy = starty;
	// Iterate through the longer distance in steps of 1
	for (var i = 0; i < maxdist; ++i) {
		// Check for walls at the current spot
		if (eng.tileFunc(Math.round(xx),Math.round(yy)).getChar() !== ".")
			return false;
		// Advance the beam according to the step variables
		xx += dx; yy += dy;
	}
	return true;
}

function calculateFOV(x, y) {
	// Shoot a beam from the four corners of the player tile
	// to the corresponding corners of the target tile
	// in order to produce more permissive FOV than just one beam
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
