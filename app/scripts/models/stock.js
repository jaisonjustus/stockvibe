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
        'Symbol' : 'sym',
        'Change': '+0.0',
        'Name': 'no company',
        'DaysHigh': '0',
        'DaysLow': '0',
        'Open': '0',
        'LastTradePriceOnly': '0'
      },

      /* Specifying open data table. */
      openTable : 'yahoo.finance.quote',

      /* Enabling Long Polling. */
      longPolling : true,

      initialize : function(options) {

        /* Calling parent initialization method. */
        YQLFinanceModel.prototype.initialize.call(this, options);

        /* YQL query for the model to get the financial data. */
        this.YQL = ['select', 
        ['Symbol','Change','DaysHigh','Dayslow', 'Name',
        'Open','LastTradePriceOnly'].join(','), 
        'from yahoo.finance.quote', 
        'where symbol in '].join(' ');
      }
    });

  }
);