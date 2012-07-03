QtWebkit Wrapper
================

This is a tiny wrapper app that allows you to distribute your game without
requiring a decent web browser on the user's end.

I can think of two cases where this could be useful:

1. Your users have crappy Internet Explorer or some very old browser.
2. You feel your users will take your game more seriously if it needs to be downloaded and doesn't play inside a browser.


How to compile
--------------

	# Tested with Qt 4.8
	qmake
	make


How to test
-----------

	cd ../examples
	../qtwebkit/app
	# Will launch the examples for you to test with


How to deploy
-------------

1. Drop the compiled binary next to your sources, renamed as you see fit
2. When launching the app, it will render _index.html_ in the same directory
3. (If you don't want to use _index.html_ in the same directory, change it by editing the app's source)

