define(['jquery'],function($)  {

  var DataFetcher = function(code) {

    this.code = code;

    /*  */
    this.url = null,

    /* yahoo api url to execute query. */
    this.apiUrl = 'http://query.yahooapis.com/v1/public/yql?q=',

    /* Response format YQL support XML/JSON. */
    this.format = 'json',

    /* Open table environment. required to get data using community open
       tables.*/
    this.env = 'store://datatables.org/alltableswithkeys',

    this.YQL = ['select', 
      ['finance.symbol','finance.company','finance.high','finance.low',
      'finance.last','finance.change',
      'finance.perc_change','finance.y_close'].join(','), 
      'from google.igoogle.stock', 
      'where stock='].join(' ');

    this._urlBuilder();
  };

  DataFetcher.prototype.fetch = function(options) {
    var that = this;

    $.ajax({
      url : this.url,
      context : options.context,
      method : 'GET',
      success : function(response)  {
        options.callback(that.code, that._responseCleanser(response), options.context);
      }
    })
  };

  DataFetcher.prototype._urlBuilder = function() {
    this.YQL += "'" + this.code + "'"
    this.url = this.apiUrl + this.YQL + '&format=' + this.format + '&env=' + this.env;
  };

  DataFetcher.prototype._responseCleanser = function(response)  {
    response = response.query.results.xml_api_reply.finance;

    for(var attr in response) {
      response[attr] = response[attr]['data'];
    }

    /* HACK >>> STARTS */
    response.change = (new Date().getSeconds() % 2 === 0) ? "+10.1" : "-32.4" ;
    response.high = parseFloat(response.high) + new Date().getSeconds();
    /* HACK >>> ENDS */

    return response;
  }

  return DataFetcher;

});  