define(
  [],
  function()  {

    return {
      YQLtoD3DCMapper : function(YQLModel)  {
        var change = YQLModel.get('Change'),
            last = parseFloat(YQLModel.get('Open')),
            changeObject = {},
            priv = {},
            that = this;

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

        priv._getMappedObject = function(last, chageObject) {
          return {
            //value : (changeObject.polarity) ? (last + parseFloat(changeObject.value)) : (last - parseFloat(changeObject.value)),
            value : YQLModel.get('LastTradePriceOnly'),
            time : that.calculateTimeAtNYSE('-4').getTime(),
            polarity : changeObject.polarity
          }
        };

        //changeObject = priv._parseChange(change);
        return priv._getMappedObject(last, changeObject);
      },

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