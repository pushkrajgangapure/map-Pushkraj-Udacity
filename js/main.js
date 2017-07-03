/*
Developed by: Pushkraj Gangapure and Completed on 20th June
*/
function init() {
    model.loadMap();
    model.searchhotelLocation();
    model.finishedLoading(true);
}
var OPEN_CONSTANT = 'panel-collapse pre-scrollable collapse';
var CLOSE_CONSTANT = 'panel-collapse pre-scrollable collapse in';

var viewModel = function() {
    'use strict';
    var mapObject = this;
    mapObject.hotelLocation = ko.observableArray([]);

    mapObject.finishedLoading = ko.observable(false);
    mapObject.error = ko.observable(false);
    mapObject.errorText = ko.observable('');
    mapObject.location = {
        latitude: 16.714994,
        longitude: 74.460267
    };
    this.search = ko.observable('');


    mapObject.loadMap = function() {
        /*Set the Lat Lang co-ordinates to Kolhapur, Maharashtra state*/
        var coordinates = new google.maps.LatLng(mapObject.location.latitude, mapObject.location.longitude);
        var mapOptions = {
            disableDefaultUI: true,
            zoom: 14,
            center: coordinates,
        };
        mapObject.map = new google.maps.Map(document.querySelector('#hotelmap'), mapOptions);
        mapObject.mapCard = new google.maps.InfoWindow({
            maxWidth: 200
        });
    };

    mapObject.setPlaceMarker = function(selectedPlace) {
        var position = mapObject.filterHotelList().indexOf(selectedPlace);
        mapObject.onSelectClick(mapObject.mapMarkers[position], selectedPlace);
        mapObject.colPnlOpen(true);

    };

    mapObject.searchhotelLocation = function() {
        apis.foursquare.getHotelLoc(mapObject.location, function(hotelLocation) {
            if (hotelLocation === null) {
                mapObject.error(true);
                mapObject.errorText("API did not return results in proper formats");
                return;
            }
            hotelLocation.forEach(function(loc) {
                loc.imagePath = ko.observable();
                loc.photoVisible = ko.observable(true);
                apis.foursquare.getPhotos(loc, function(photos) {
                    loc.photos = photos.items;
                    var photo = loc.photos[0];
                    if (photo != undefined)
                        loc.imagePath(photo.prefix + '100x100' + photo.suffix);
                    else
                        loc.imagePath("http://placehold.jp/100x100.png");
                });
            });
            mapObject.hotelLocation(hotelLocation);
        });
    };

    mapObject.createMarkers = function(data) {
        mapObject.clearMarkers();
        var placesArray = data;
        var boundaries;
        if (typeof(google) == 'object') {
            boundaries = new google.maps.LatLngBounds();
            for (var i = 0, len = placesArray.length; i < len; i++) {
                var location = {
                    lat: placesArray[i].location.lat,
                    lng: placesArray[i].location.lng
                };
                var marker = new google.maps.Marker({
                    position: location,
                    map: this.map,
                    icon: 'images/locicon.png',
                    animation: google.maps.Animation.DROP
                });
                mapObject.mapMarkers.push(marker);
                mapObject.mapMarkers[i].setMap(this.map);
                boundaries.extend(new google.maps.LatLng(location.lat, location.lng));
                placesArray[i].boundaries = boundaries;
                marker.addListener('click', mapObject.onMapMarkerClick(marker, placesArray[i]));
            }
            this.map.setCenter(boundaries.getCenter());
            this.map.fitBounds(boundaries);
        }
    };

    mapObject.clearMarkers = function() {
        for (var i = 0, length = mapObject.mapMarkers.length; i < length; i++) {
            mapObject.mapMarkers[i].setMap(null);
        }
        mapObject.mapMarkers = [];
    };

    mapObject.mapMarkers = ko.observableArray([]);
    mapObject.createMarkers(mapObject.hotelLocation());
    mapObject.colPnlOpen = ko.observable(true);

    mapObject.colPnlCls = ko.computed(function() {
        if (mapObject.colPnlOpen())
            return OPEN_CONSTANT
        else
            return CLOSE_CONSTANT;

    });

    mapObject.onHotelsListClick = function() {
        if (mapObject.colPnlCls() === OPEN_CONSTANT)
            mapObject.colPnlOpen(false);
        else
            mapObject.colPnlOpen(true);
    };

    mapObject.filterHotelList = ko.computed(function() {
        var userSearchString = mapObject.search().toUpperCase();
        if (!userSearchString) {
            return mapObject.hotelLocation();
        } else {
            return ko.utils.arrayFilter(mapObject.hotelLocation(), function(item) {
                return item.name.toUpperCase().indexOf(userSearchString) !== -1;
            });
        }
    });

    mapObject.filterHotelList.subscribe(function() {
        mapObject.createMarkers(mapObject.filterHotelList());
    });

    mapObject.resetAllMarkers = function() {
        mapObject.mapMarkers.forEach(function(marker) {
            marker.setIcon('images/locicon.png');
        });
    };

    mapObject.createMapMarkerCard = function(mapMarker, loc) {
        mapObject.mapCard.close();
        mapObject.resetAllMarkers();
        mapObject.mapCard.setContent(mapObject.cardTemplate(loc));
        mapObject.mapCard.open(mapObject.map, mapMarker);
        mapObject.map.panTo(new google.maps.LatLng(loc.location.lat, loc.location.lng));

    };

    mapObject.onMapMarkerClick = function(mapMarker, loc) {
        return function() {
            mapMarker.setAnimation(google.maps.Animation.DROP);
            window.setTimeout(function() {
                mapMarker.setAnimation("");
            }, 5000);
            mapObject.createMapMarkerCard(mapMarker, loc);

        };
    };

    mapObject.onSelectClick = function(mapMarker, loc) {
        mapObject.createMapMarkerCard(mapMarker, loc);
    };

    mapObject.cardTemplate = function(loc) {
        if (loc.location.city === null)
            loc.location.city = "Kolhapur";
        var html = "<div class='card'><div class='card-block'><h4 class='card-title'>" +
            loc.name + "</h4><h6 class='card-subtitle'>" +
            loc.categories[0].name + "</h6></div><img src='" + loc.imagePath() + "' class='img-thumbnail'>";
        html = html + "<div class='card-block'><p class='card-text'><em>Hotel Address:</em><span>" + loc.location.formattedAddress[0] + "</span></p><p class='card-text'>";
        html = html + "<h4><span class='label'>" + loc.location.city + "</span></h4></p></div></div>";
        return html;
    };

};

function mapOnLoadError() {
    model.finishedLoading(true);
    model.errorText("Can not load google maps, please try reloading the page");
}



var model = new viewModel();



$(document).ready(function() {
    ko.applyBindings(model);
});