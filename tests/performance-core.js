var chars = "☠☃⚙☻♞☭✈✟✂✯";
var term, eng; // Can't be initialized yet because DOM is not ready
var interval1, interval2;
var start_time;
var iterations = 0;

// Returns a random tile
randomTile = function(x, y) {
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	var c = Math.floor(Math.random() * chars.length);
	return new ut.Tile(chars[c], r, g, b);
};

// One iteration
tick = function() {
	eng.update();
	term.render();
	++iterations;
};

// Display results
function result() {
	var diff = (new Date()).getTime() - start_time;
	clearInterval(interval1);
	clearInterval(interval2);
	var elem = document.getElementById("result");
	elem.innerHTML =
		"Iterations: " + iterations + " (in " + diff + " ms)<br/>" +
		"Average time: " + diff/iterations + " ms";
}

// Restarts the test (and switches renderer) by reloading the page
function again() {
	window.location = window.location.pathname + document.getElementById("switch-renderer").getAttribute("href");
	window.location.reload(true);
}

// Called after HTML is loaded, initializes UnicodeTiles etc.
function init() {
	var renderer = "auto";
	if (location.hash.indexOf("#dom") != -1) renderer = "dom";

	term = new ut.Viewport(document.getElementById("game"), 51, 25, renderer);
	eng = new ut.Engine(term, randomTile);

	document.getElementById("renderer").innerHTML = term.getRendererString();
	var a = document.getElementById("switch-renderer");
	a.onclick = again;
	if (term.getRendererString() === "dom") {
		a.innerHTML = "Switch to &lt;canvas&gt; renderer";
		a.href = "#canvas";
	} else {
		a.innerHTML = "Switch to DOM renderer";
		a.href = "#dom";
	}
}

// Starts the test
function start() {
	interval1 = window.setInterval(result, 5000);
	start_time = (new Date()).getTime();
	interval2 = window.setInterval(tick, 0);
}
