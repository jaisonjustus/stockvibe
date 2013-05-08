/**
 * Module to manage activties in stock snapshot view and data model.
 * @module Snapshot
 */
define(
  ['backbone', 'stock', 'utility','d3_helper', 'd3dc', 'tpl!../templates/snapshot-tpl.html'],
  function(Backbone, Stock, Utility, D3Helper, D3DC, SnapshotTpl)  {
    
    return Backbone.View.extend({

      tagName : 'section',

      className : 'snapshot',

      model : null,

      template : SnapshotTpl,

      events : {
        'click .close-snapshot' : '_onRemove'
      },

      initialize : function(options) {
        _.extend(this, D3Helper);

        this.selectors = {};
        this.D3DC = new D3DC;

        this.model = new Stock({ id : options.id });
        // this.model.set({ id : options.id });
        this.model.on('yqlFetchSuccess', this._updateView, this);
      },

      render : function() {
        this.$el.html(this.template({data : this.model.toJSON()}));
        this.renderChart();
        return this;
      },

      renderChart : function()  {
        this._attachSelectors();

        /* Setting up D3 charting. */
        this.setup(380, 330, 20, '#' + this.model.get('id') + '-stock-chart', this.model.get('id'));
      },

      /**
       * Method to attachment commonly used DOM selector to selectors object
       * @method _attachSelectors
       * @access private
       */
      _attachSelectors : function() {
        this.selectors.current = this.$el.find('.current h1');
        this.selectors.low = this.$el.find('.low h1');
        this.selectors.high = this.$el.find('#'+this.model.get('id')+'-high h1');
        this.selectors.open = this.$el.find('.open h1');
        this.selectors.changeText = this.$el.find('.change h1');
        this.selectors.changeStatus = this.$el.find('.change .status');
        this.selectors.remove = this.$el.find('.close-snapshot');
      },

      /**
       * Method to update snapshot view when there is a change in the stock
       * data.
       * @method _updateView
       * @access private
       */
      _updateView : function()  {
        this.trigger('updateOverview', this.model.toJSON());
        this.selectors.current.html(this.model.get('LastTradePriceOnly'));
        this.selectors.low.html(this.model.get('DaysLow'));
        this.selectors.high.html(this.model.get('DaysHigh'));
        this.selectors.open.html(this.model.get('Open'));
        this.selectors.changeText.html(this.model.get('Change'));
        
        if(this.model.get('Change').match(/\+/g)) {
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

        this._updateD3DC();
      },

      _updateD3DC : function()  {
        this.D3DC.add(Utility.YQLtoD3DCMapper(this.model));
        this.setData(this.D3DC.toJSON());
        if(!this.extentCalculated) {
          this.calculateExtentAndScale('*');
          this.extentCalculated = true;
        }
        this.updateChart(this.D3DC.toJSON());
      },

      _onRemove : function()  {
        this.trigger('removeSnapshot', this.model.get('id'));
      }


    });

  }
)