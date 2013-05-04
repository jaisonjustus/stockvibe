define(
  ['backbone', 'stock', 'tpl!../templates/snapshot-tpl.html'],
  function(Backbone, Stock, SnapshotTpl)  {
    
    return Backbone.View.extend({

      tagName : 'section',

      className : 'snapshot',

      model : new Stock,

      template : SnapshotTpl,

      selectors : {},

      initialize : function(options) {
        this.model.set({ id : options.id });
        this.model.on('yqlFetchSuccess', this._updateView, this);
      },

      render : function() {
        this.$el.html(this.template({data : this.model.toJSON()}));
        this._attachSelectors();
        return this;
      },

      _attachSelectors : function() {
        this.selectors.current = this.$el.find('.current h1');
        this.selectors.low = this.$el.find('.low h1');
        this.selectors.high = this.$el.find('.high h1');
        this.selectors.open = this.$el.find('.open h1');
        this.selectors.changeText = this.$el.find('.change h1');
        this.selectors.changeStatus = this.$el.find('.change .status');
      },

      _updateView : function()  {
        this.selectors.current.html(this.model.get('last'));
        this.selectors.low.html(this.model.get('low'));
        this.selectors.high.html(this.model.get('high'));
        this.selectors.open.html(this.model.get('y_close'));
        this.selectors.changeText.html(this.model.get('change'));
        
        if(this.model.get('change').match(/\+/g)) {
          this.selectors.changeText.removeClass('decrease');
          this.selectors.changeText.addClass('increase');

          this.selectors.changeStatus.removeClass('down');
          this.selectors.changeStatus.addClass('up');
        }else {
          this.selectors.changeText.removeClass('increase');
          this.selectors.changeText.addClass('decrease');

          this.selectors.changeStatus.removeClass('up');
          this.selectors.changeStatus.addClass('down');
        }
      }


    });

  }
)