/// File: input.js
/// This file contains some input helpers, such as key code constants.
/// It also exposes a <pressedKeys> variable.

var ut = ut || {};

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

ut.KEY_ENTER = 13;
ut.KEY_SHIFT = 16;
ut.KEY_CTRL = 17;
ut.KEY_ALT = 18;
ut.KEY_SPACE = 32;
ut.KEY_LEFT = 37;
ut.KEY_UP = 38;
ut.KEY_RIGHT = 39;
ut.KEY_DOWN = 40;

ut.KEY_A = 65;
ut.KEY_B = 66;
ut.KEY_C = 67;
ut.KEY_D = 68;
ut.KEY_E = 69;
ut.KEY_F = 70;
ut.KEY_G = 71;
ut.KEY_H = 72;
ut.KEY_I = 73;
ut.KEY_J = 74;
ut.KEY_K = 75;
ut.KEY_L = 76;
ut.KEY_M = 77;
ut.KEY_N = 78;
ut.KEY_O = 79;
ut.KEY_P = 80;
ut.KEY_Q = 81;
ut.KEY_R = 82;
ut.KEY_S = 83;
ut.KEY_T = 84;
ut.KEY_U = 85;
ut.KEY_V = 86;
ut.KEY_W = 87;
ut.KEY_X = 88;
ut.KEY_Y = 89;
ut.KEY_Z = 90;

/// Variable: pressedKeys
/// A dictionary of key codes that are currently being pressed down.
ut.pressedKeys = {};

/// Function: handleKeyDown
/// A key handler that updates <pressedKeys>.
/// *Bound automatically to document.onkeydown event.*
ut.handleKeyDown = function(event) {
	"use strict";
	var k = event.keyCode;
	ut.pressedKeys[k] = true;

	if (ut.pressedKeys[ut.KEY_CTRL]) return true;
	else return false;
};

/// Function: handleKeyUp
/// A key handler that updates <pressedKeys>.
/// *Bound automatically to document.onkeyup event.*
ut.handleKeyUp = function(event) {
	"use strict";
	ut.pressedKeys[event.keyCode] = false;
	return false;
};


document.onkeydown = ut.handleKeyDown;
document.onkeyup = ut.handleKeyUp;
