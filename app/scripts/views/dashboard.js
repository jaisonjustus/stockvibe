define(
  ['jquery', 'backbone', 'stock'],
  function($, _, Stock)  {

    return Backbone.View.extend({

      model : new Stock,

      initialize : function() {
        this.model.set({ id : 'GOOG' })
        this.model.on('reset', function() { console.log( this.model.toJSON() )}, this);
      }

    });

  }
);