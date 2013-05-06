define(
  [],
  function()  {

    return {
      YQLtoD3DCMapper : function(YQLModel)  {
        var change = YQLModel.get('change'),
            last = parseFloat(YQLModel.get('y_close')),
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
            value : (changeObject.polarity) ? (last + parseFloat(changeObject.value)) : (last - parseFloat(changeObject.value)),
            time : that.calcuateTimeAtNYSE('-4'),
            polarity : changeObject.polarity
          }
        };

        changeObject = priv._parseChange(change);
        return priv._getMappedObject(last, changeObject);
      },

      calcuateTimeAtNYSE : function(offset, date) {
        var dateObj = null,
            newDate = null;
        
        dateObj = (date) ? date : new Date();

        utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000*offset));
      } 
    }

  }
)