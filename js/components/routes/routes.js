angular.module('mapexamples').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "views/home/home.html",
            controller: 'HomeController'
        })
        .state('mapacombo', {
            url: "/mapacombo",
            templateUrl: "views/mapacombo/mapacombo.html",
            controller: 'MapaComboController'
        });
});