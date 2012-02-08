#!/usr/bin/python

import httplib, urllib, sys

rawparams = []

for filename in sys.argv[1:]:
	f = open(filename, 'r')
	rawparams.append(('js_code', f.read()))
	f.close()

if len(rawparams) == 0:
	print "No code :("
	quit()

rawparams.append(('compilation_level', 'SIMPLE_OPTIMIZATIONS'))
rawparams.append(('output_format', 'text'))
rawparams.append(('output_info', 'compiled_code'))

params = urllib.urlencode(rawparams)

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
print data
conn.close

