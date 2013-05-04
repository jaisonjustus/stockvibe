define(
  ['backbone', 'd3dm'],
  function(Backbone, D3DM)  {

    return Backbone.Collection.extend({

      model : D3DM,

      initialize : function() {},

      fetch : function()  {
        this.trigger('restricted');
      },

      save : function() {
        this.trigger('restricted');
      }

    });

  }
);