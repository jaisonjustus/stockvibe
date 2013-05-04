define(
  ['backbone'],
  function(Backbone)  {

    return Backbone.Model.extend( {

      defaults : {
        'value' : 0,
        'time' : 0,
        'polarity' : true
      }

    });

  }
);