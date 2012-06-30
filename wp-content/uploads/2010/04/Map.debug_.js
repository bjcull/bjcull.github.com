function Map() {
    var geocoder = new google.maps.Geocoder();
    var resultChangeAddress;
    var prevMarker;

    function Location() {
        this.city = "";
        this.country = "";
        this.countrycode = "";
        this.latlng;
        this.address = "";
        this.streetnum = "";
        this.postcode = "";
        this.formatted_address = "";
    }

    this.CreateMarker = function (MapLat, MapLng, map, title) {
        var GoogleLatLng = new google.maps.LatLng(MapLat, MapLng);
        var marker = new google.maps.Marker({
            position: GoogleLatLng,
            map: map,
            title: title
        });

        if (prevMarker) {
            prevMarker.set_map(null);
        };
        prevMarker = marker;

        google.maps.event.addListener(marker, "click", function () {
            map.set_center(GoogleLatLng);
        });
    }

    this.CreateMap = function (MapControl, MapLat, MapLng) {
        var latlng = new google.maps.LatLng(MapLat, MapLng);
        var options = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        }
        var map = new google.maps.Map($(MapControl).get(0), options);

        return map;
    }

    this.CreateStaticMap = function (target, latitude, longitude) {
        target = $(target);
        var maplink = "http://maps.google.com/maps/api/staticmap?";
        maplink += "sensor=false"
        maplink += "&center=" + latitude + "," + longitude;
        maplink += "&zoom=14";
        maplink += "&size=" + target.height() + "x" + target.width();
        maplink += "&maptype=roadmap";
        maplink += "&markers=" + latitude + "," + longitude;
        var output = "<img src='" + maplink + "' alt='Google Map' />";

        target.html(output);
        return target;
    }
    

    this.GeocodeAddress = function (address, callback) {

        if (geocoder) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK || status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {

                        var LocationList = new Array();

                        for (p = 0; p < results.length; p++) {

                            var tempLocation = new Location();

                            tempLocation.formatted_address = results[p].formatted_address;
                            tempLocation.latlng = results[p].geometry.location;

                            for (i = 0; i < results[p].address_components.length; i++) {
                                if (results[p].address_components[i].types[0] == "subpremise")
                                    tempLocation.streetnum += results[p].address_components[i].long_name + "/";
                                if (results[p].address_components[i].types[0] == "street_number")
                                    tempLocation.streetnum += results[p].address_components[i].long_name;
                                if (results[p].address_components[i].types[0] == "street_address")
                                    tempLocation.address = results[p].address_components[i].long_name;
                                if (results[p].address_components[i].types[0] == "route")
                                    tempLocation.address = results[p].address_components[i].long_name;
                                if (results[p].address_components[i].types[0] == "neighborhood")
                                    tempLocation.city = results[p].address_components[i].long_name;
                                if (results[p].address_components[i].types[0] == "locality")
                                    tempLocation.city = results[p].address_components[i].long_name;
                                if (results[p].address_components[i].types[0] == "postal_code")
                                    tempLocation.postcode = results[p].address_components[i].long_name;
                                if (results[p].address_components[i].types[0] == "country") {
                                    tempLocation.countrycode = results[p].address_components[i].short_name;
                                    tempLocation.country = results[p].address_components[i].long_name;
                                }
                            }
                            LocationList[LocationList.length] = tempLocation;
                        }

                        callback(LocationList);
                    }
                    else {
                        alert("no results");
                        callback(null);
                    }
                }
                else {
                    alert("Google Error: " + status);
                    callback(null);
                }
            });
        }
    }

}