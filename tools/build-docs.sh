#!/bin/sh -e
# Builds documentation

ND="naturaldocs"
$ND -h >/dev/null 2>&1 || echo "Cannot find NaturalDocs!"

DIR=$(dirname $(readlink -f $0))
OUTDIR="$DIR/../docs/html"
NDDIR="$DIR/../docs/NaturalDocs"
mkdir -p "$OUTDIR" "$NDDIR"

echo "Building API documentation..."
$ND -i .. \
	-o HTML "$OUTDIR" \
	-p "$NDDIR" \
	|| echo "API documentation building failed."

echo "All done."

