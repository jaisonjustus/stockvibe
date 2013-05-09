/**
 * Data model for a single entity in the D3 Data collection.
 * @module D3DM
 */
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