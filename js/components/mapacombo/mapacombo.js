angular.module('mapexamples').controller('MapaComboController', ['$scope', '$rootScope', '$state', '$http', '$filter', '$modal',
    function ($scope, $rootScope, $state, $http, $filter, $modal) {
        $scope.mapaComboInit = function () {
            waitingDialog.show();

            drawMap();
            $scope.markersPositions = [];
            $scope.markers = [];
            $scope.sites = [];
            $scope.results = [];
            $http.get("js/components/mapacombo/CLARO_SITES_LAT_LOG.csv")
                .then(successSites, errorSites);

            verificarAlarmes();
            setInterval(function () {
                verificarAlarmes()
            }, 15000);

            waitingDialog.hide();
        };

        function drawMap() {
            var mapDiv = document.getElementById("map_canvas");

            var noPoi = [
                {
                    featureType: "poi",
                    stylers: [
                        {visibility: "off"}
                    ]
                }
            ];

            var location = new google.maps.LatLng(-22.818943, -43.045118);
            $scope.map = new google.maps.Map(mapDiv, {
                center: location,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                disableDefaultUI: true,
                styles: noPoi
            });

            $scope.infowindow = new google.maps.InfoWindow();
        }

        function successSites(response) {
            $scope.sites = Papa.parse(response.data, {delimiter: ";"}).data;
        }

        function errorSites(response) {
        }

        function verificarAlarmes() {
            $http.get("js/components/mapacombo/AlarmesHistoricos_2016.csv")
                .then(successAlarmes, errorAlarmes);
        }

        function successAlarmes(response) {
            var dados = Papa.parse(response.data, {delimiter: ";"}).data;

            for (var i in $scope.sites) {
                var site = $scope.sites[i];
                var codSite = site[3];
                var resultado = dados.filter(function (data) {
                    var x = data[3];
                    return x === codSite;
                });

                if (resultado.length > 0) {
                    $scope.results.push(resultado[resultado.length - 1]);
                }
            }
            drawMarkers();
        }

        function errorAlarmes(response) {
        }

        function drawMarkers() {
            setAllMap(null);
            clearMarkersPositions();
            for(var z in $scope.results) {
                var result = $scope.results[z];
                var latLng = new google.maps.LatLng(result[1], result[2]);
                addMarker(latLng, result);
            }
        }

        function addMarker(latLng, result){
            var marker = new google.maps.Marker({
                position: latLng,
                map: $scope.map,
                title:  " (" + result[3] + ")"
            });
            $scope.markers.push(marker);
        }

        function setAllMap(map) {
            for (var i = 0; i < $scope.markers.length; i++)
                $scope.markers[i].setMap(map);
        }

        function clearMarkers() {
            setAllMap(null);
        }

        function clearMarkersPositions() {
            $scope.markersPositions = [];
        }

    }]);