#!/bin/sh -e
# Syncs the branches and pushes

git checkout master -q
git pull
git checkout gh-pages
git merge master
git checkout master
git push

