/// File: input.js
/// This file contains some input helpers, such as key code constants.
/// It also exposes a <pressedKeys> variable.

/// Constants: Keycodes
/// KEY_ENTER - 13
/// KEY_SHIFT - 16
/// KEY_CTRL - 17
/// KEY_ALT - 18
/// KEY_SPACE - 32
/// KEY_LEFT - 37
/// KEY_UP - 38
/// KEY_RIGHT - 39
/// KEY_DOWN - 40
/// KEY_A - 65
/// KEY_B - 66
/// KEY_C - 67
/// KEY_D - 68
/// KEY_E - 69
/// KEY_F - 70
/// KEY_G - 71
/// KEY_H - 72
/// KEY_I - 73
/// KEY_J - 74
/// KEY_K - 75
/// KEY_L - 76
/// KEY_M - 77
/// KEY_N - 78
/// KEY_O - 79
/// KEY_P - 80
/// KEY_Q - 81
/// KEY_R - 82
/// KEY_S - 83
/// KEY_T - 84
/// KEY_U - 85
/// KEY_V - 86
/// KEY_W - 87
/// KEY_X - 88
/// KEY_Y - 89
/// KEY_Z - 90

var KEY_ENTER = 13;
var KEY_SHIFT = 16;
var KEY_CTRL = 17;
var KEY_ALT = 18;
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var KEY_A = 65;
var KEY_B = 66;
var KEY_C = 67;
var KEY_D = 68;
var KEY_E = 69;
var KEY_F = 70;
var KEY_G = 71;
var KEY_H = 72;
var KEY_I = 73;
var KEY_J = 74;
var KEY_K = 75;
var KEY_L = 76;
var KEY_M = 77;
var KEY_N = 78;
var KEY_O = 79;
var KEY_P = 80;
var KEY_Q = 81;
var KEY_R = 82;
var KEY_S = 83;
var KEY_T = 84;
var KEY_U = 85;
var KEY_V = 86;
var KEY_W = 87;
var KEY_X = 88;
var KEY_Y = 89;
var KEY_Z = 90;

/// Variable: pressedKeys
/// A dictionary of key codes that are currently being pressed down.
var pressedKeys = {};

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

/// Function: handleKeyDown
/// A key handler that updates <pressedKeys>.
/// *Bound automatically to document.onkeydown event.*
function handleKeyDown(event) {
	"use strict";
	var k = event.keyCode;
	pressedKeys[k] = true;

	if (pressedKeys[KEY_CTRL]) return true;
	else return false;
}

/// Function: handleKeyUp
/// A key handler that updates <pressedKeys>.
/// *Bound automatically to document.onkeyup event.*
function handleKeyUp(event) {
	"use strict";
	pressedKeys[event.keyCode] = false;
	return false;
}
