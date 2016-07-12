@echo off

if not exist node_modules (
	rem first run
	npm update
)

node server.js

pause