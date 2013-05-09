/**
 * Tailor made module to fetch financial data from google.igoogle.stock
 * open table use yahoo query language(YQL).
 * Note: like to add support yahoo.finance.stocks.
 * @module YQLFinanceModel.
 */
define(
  ['backbone'],
  function(Backbone)  {

    /* Extending Backbone Model with more method to support YQL. */
    return Backbone.Model.extend({

      /* Option to toggle between long polling with yahoo server. if its false
         you need to manually call fetch() to get the details otherwise model
         poll continuously on default rate of 10sec or what you suggest. */
      longPolling : false,

      /* Polling rate. */
      deafultPollingRate : 10000,

      /* Request Url */
      url : null,

      /* yahoo api url to execute query. */
      apiUrl : 'http://query.yahooapis.com/v1/public/yql?q=',

      /* Response format YQL support XML/JSON. */
      format : 'json',

      /* Open table environment. required to get data using community open
         tables.*/
      env : 'store://datatables.org/alltableswithkeys',

      /* var to maintain opentable contibutor for data cleansing. each contributes
         have there own response structures. */
      openTable : 'yahoo',

      initialize : function(options) {

        /* var to keep yahoo query. */
        this.YQL = null;

        this.set({ id : options.id });

        /* Long polling open data tables. Adding timer to global to enforce
           control from other views.*/
        window[options.id] = window.setInterval(function()  {
          if(this.longPolling && this.get('id') !== 'sym')  {
            this.fetch({ context : this });
          }
        }.bind(this), this.deafultPollingRate)
      },

      /**
       * Method to build url to access opentables. 
       * @method _urlBuilder
       * @access private
       */
      _urlBuilder : function() {
        if(this.openTable.toLowerCase() === 'yahoo.finance.quotes') {
          this.YQL += "('" + this.get('id') + "')";
        }else {
          this.YQL += "'" + this.get('id') + "'";
        }
        this.url = this.apiUrl + this.YQL + '&format=' + this.format + '&env=' + this.env;
      },

      /**
       * Method to fetch the data and store the response in the model. this is
       * overriding the primitive Backbone.Model.fetch() method because before
       * persisting data to model intial data cleansing required for response 
       * because each open table contributor maintain different response 
       * structure. this method also trigger 'reset' event after persisting
       * data to the model. When ever the network fails (ajax onError) this will
       * trigger network failure and with effect it will call the data recovery
       * polling.
       * @override
       * @method fetch
       * @access public
       * @param object oprions
       */
      fetch : function(options)  {
        options = options ? options : {};
        
        var success = options.success,
            model = (options.hasOwnProperty('context')) ? options.context : this;
        
        if(!model.url && model.get('id') !== 'sym')  {
          model._urlBuilder();
        }
        
        options.success = function(response)  {
          response = model._responseCleanser(response.query.results);
          model.set(response);
          model.trigger('reset');
          model.trigger('yqlFetchSuccess');
          if(success) { success(model, response, options) }
        };

        options.error = function()  {
          console.log('netwrok failure');
          this.trigger('netwrok failure');
        };
        
        this.sync('read', this, options);
      },

      /**
       * Method to cleanse the response.
       * @method _responseCleanser
       * @access private
       * @param object response
       * @return object
       */
      _responseCleanser : function(response)  {
        if(this.openTable.toLowerCase() === 'google')  {
          response = response.xml_api_reply.finance;

          for(var attr in response) {
            response[attr] = response[attr]['data'];
          }

          return response;

        }else if(this.openTable.toLowerCase() === 'yahoo.finance.oquote')  {
          if(response && response.hasOwnProperty('option')) {
            var temp = response['option'];
            temp['id'] = temp['sym'];
            return temp;  
          }else {
            return {};
          }
        }else if(this.openTable.toLowerCase() === 'yahoo.finance.quotes')  {
          if(response && response.hasOwnProperty('quote'))  {
            return response.quote;
          }
        }
      }
    });

  }
);