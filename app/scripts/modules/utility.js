/**
 * Utility tool belt for Stockvibe.
 * @module Utility
 */
define(
  [],
  function()  {

    return {

      /**
       * Method to map data from YQL model to D3 Data Model. This method is
       * implement with some private method to bind the scope of method to one.
       * @method YQLtoD3DCMapper
       * @access public
       * @param object YQLModel
       * @return object
       */
      YQLtoD3DCMapper : function(YQLModel)  {
        var change = YQLModel.get('Change'),
            last = parseFloat(YQLModel.get('Open')),
            changeObject = {},
            priv = {},
            that = this;

        /**
         * Method to parse the change value.
         * @method _parseChange
         * @access private
         * @param string change
         * @return string
         */
        priv._parseChange = function(change) {
          var _change = {
            polarity : false,
            value : 0
          };

          if(change.match(/\+/g)) {
            _change.polarity = true;
            _change.value = change.replace('+', '');
          }else {
            _change.value = change.replace('-', '');
          }

          return _change;
        };

        /**
         * Method to prepare the YQL to D3DM mapped object.
         * @method @_getMappedObject
         * @access private
         * @param string last
         * @param object changeObject
         * @return object
         */
        priv._getMappedObject = function(last, chageObject) {
          var date = that.calculateTimeAtNYSE('-4', new Date());
          
          return {
            value : YQLModel.get('LastTradePriceOnly'),
            time : date.getTime(),
            polarity : changeObject.polarity
          }
        };

        return priv._getMappedObject(last, changeObject);
      },

      /**
       * Method to calcuate the time at New York. cahnging Indian Standard
       * Time zone to Eastern Time (GMT -4hrs).
       * @method calculateTimeAtNYSE
       * @access private
       * @param string offset
       * @param object date
       * return object
       */
      calculateTimeAtNYSE : function(offset, date) {
        var dateObj = null,
            newDate = null;
        
        dateObj = (date) ? date : new Date();

        utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000*offset));
      } 
    }

  }
)