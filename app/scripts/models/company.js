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
        'sym' : 'sym',
        'price': '0',
        'change': '0',
        'prevClose': '0',
        'open': '0',
        'bid': '0',
        'ask': null,
        'strike': '0',
        'expire': '0',
        'volume': '0',
        'openInterest': null
      },

      openTable : 'yahoo.finance.oquote',

      longPolling : false,

      YQL : ['select *',  
      'from yahoo.finance.oquote', 
      'where symbol='].join(' ')
    });

  }
);