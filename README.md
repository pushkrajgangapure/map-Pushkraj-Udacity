## Neighbourhood Map project
=========================
Author: Pushkraj Gangapure
Created on: 26-Jun-16
Description: This map project loads top 15 hotels in Kolhapur on google map.

#Features:
- List View of Hotels
- Identifies and Creates markers for each hotel on google map with Animation
- Filter by inputting few letters of hotel name in the search box and filter markers on map based on input

#Installing & local setup:
- Download the zip file
- please install node module dependencies defined in project.json
	Steps:
	- Open command prompt and browse to the folder where package.json is available
	- run npm install
	- Once npm completes, run grunt command to compile and create dist folder
	- Browse inside the dist folder and start web server.
	- open google chrome incognito window and type http://localhost:8080 in the address bar
	- Application should run index.html by default


References:
https://developer.foursquare.com
https://developer.foursquare.com/docs/venues/venues
https://developers.google.com/maps/documentation/javascript/