/*globals $:false */
var apis = {};

apis.foursquare = {

    clientId: '11CGZYZA1ZSJZDWR4CEYQBYBAHAZK234UYREYFMCNMWB4VKH',
    clientSecret: 'QHPX1UFEG5CXKYWYETS1RYKCFRZEPQVY40V045U5RVR0XVMQ',

    getHotelLoc: function(loc, success, error) {
        'use strict';
        var endpoint = 'https://api.foursquare.com/v2/venues/search?client_id=' +
            this.clientId + '&client_secret=' + this.clientSecret + '&ll=' + loc.latitude + ',' + loc.longitude +
            '&v=20140806&m=foursquare&limit=15&categoryId=4bf58dd8d48988d1fa931735';
        this.get('venues', endpoint, success, error);
    },

    getPhotos: function(loc, success, error) {
        'use strict';
        var endpoint = 'https://api.foursquare.com/v2/venues/' + loc.id + '/photos?client_id=' + this.clientId + '&client_secret=' + this.clientSecret +
            '&v=20140806&m=foursquare';
        this.get('photos', endpoint, success, error);
    },

    get: function(resource, endpoint, success, error) {
        'use strict';
        $.get(endpoint)
            .done(function(data) {
                var information = data.meta;
                if (information.code === 200) {
                    if (success) {
                        success(data.response[resource]);
                    }
                }
            }).fail(function(errors) {
                error('Error getting Data from FourSquare API. Please try again later');
            });
    }
};