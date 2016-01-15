(function(routes){
    var jsonfileservice = require('./jsonfileservice.js');
    var datapath = '/data/';

    routes.init = configureRoutes;

    function configureRoutes(app){
        app.get('/data/maa', getMaa);
    }

    function getMaa (req, res, next){
        var json = jsonfileservice.getJsonFromFile(datapath + 'maa.json');
        json[0].data.results.forEach(function(character){
            var pos = character.name.indexOf("(MAA)");
            //  console.log(character.name.substr(0, pos-1));
            character.name = character.name.substr(0, pos-1);
        })
        res.send(json);
    }

    //app.get('/marvelavengersalliance', routes.marvelavengersalliance);
    //app.get('/thor', routes.thor);


    //exports.thor = function(req, res){
    //    var json = jsonfileservice.getJsonFromFile(datapath + 'thor.json');
    //    res.send(json);
    //}
    //
    //exports.marvelAvengersAlliance = function(req, res){
    //    var json = jsonfileservice.getJsonFromFile(datapath + 'marvelavengersalliance.json');
    //    res.send(json);
    //}

})(module.exports);

	angular.module('app.routes').config(function($stateProvider, $urlRouterProvider){

		var getView = function(viewName){
			return './views/app/' + viewName + '/' + viewName + '.html';
		};

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('app', {
				abstract: true,
				views: {
					header: {
						templateUrl: getView('header')
					},
					footer: {
						templateUrl: getView('footer')
					},
					main: {}
				}
			})
			.state('app.landing', {
				url: '/',
				data: {},
				views: {
					'main@': {
						templateUrl: getView('landing')
					}
				}
			});

	});
})();
