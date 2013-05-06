/**
 * YQLFinanceModel module to get and represent snapshot data of a company.
 * @module Stock
 */
define(
  ['yql_finance_model'],
  function(YQLFinanceModel)  {

    return YQLFinanceModel.extend({

      /* Default attributes. */
      defaults : {
        'id' : 'sym',
        'change': '+0.0',
        'company': 'no company',
        'high': '0',
        'last': '0',
        'low': '0',
        'perc_change': '0',
        'symbol': 'sym',
        'y_close': '0'
      },

      /* Specifying open data table. */
      openTable : 'google',

      /* Enabling Long Polling. */
      longPolling : true,

      initialize : function() {

        /* Calling parent initialization method. */
        YQLFinanceModel.prototype.initialize.call(this);

        /* YQL query for the model to get the financial data. */
        this.YQL = ['select', 
        ['finance.symbol','finance.company','finance.high','finance.low',
        'finance.last','finance.change',
        'finance.perc_change','finance.y_close'].join(','), 
        'from google.igoogle.stock', 
        'where stock='].join(' ');
      }
    });

  }
);