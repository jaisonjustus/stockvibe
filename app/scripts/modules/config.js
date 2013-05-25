/**
 * Module to keep track of application configurations.
 * @module Config
 */
define([], function()	{
	
	return {

		/* Basic app configurations. */
		App : {
			url : 'http://jaisonjustus.github.io/stockvibe'
			// url : 'http://localhost:3000'
		},

		/* Mongolab configurations. */
		MongoLab : {
			url : 'https://api.mongolab.com/api/1/',
			database : 'stockvibe',
			collection : 'user',
			apiKey : '4f6acab2e4b019347c6711c7'
		},

		/* YQL service configuration. */
		YQL : {
			url : 'http://query.yahooapis.com/v1/public/yql?q=',
			env : 'store://datatables.org/alltableswithkeys'
		}
		
	};

});