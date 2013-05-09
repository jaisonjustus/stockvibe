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
        'click .close-snapshot' : '_onRemove',
        'click .alert-control' : '_onSetAlert',
        'mouseover .scroll i' : '_onScrollMouseOver',
        'mouseout .scroll i' : '_onScrollMouseOut',
        'click .scroll-left i' : '_onScrollLeft',
        'click .scroll-right i' : '_onScrollRight'
      },

      initialize : function(options) {
        _.extend(this, D3Helper);

        this.alert = { value : 0, cutoff : true };
        this.selectors = {};
        this.D3DC = new D3DC;

        this.model = new Stock({ id : options.id });
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
        this.setup(5040, 330, 20, '#' + this.model.get('id') + '-stock-chart', this.model.get('id'));
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
        this.selectors.alertTxt = this.$el.find('.alert');
        this.selectors.alertUp = this.$el.find('.alert-up');
        this.selectors.alertDown = this.$el.find('.alert-down');
        this.selectors.chartSlider = this.$el.find('.stock-chart-container');
      },

      /**
       * Method to update snapshot view when there is a change in the stock
       * data.
       * @method _updateView
       * @access private
       */
      _updateView : function()  {

        if(this.alert.value > 0) {
          var data = { 
            code : this.model.get('id'),
            change : this.model.get('Change'),
            current : this.model.get('LastTradePriceOnly')
          };

          if(this.alert.cutoff) {
            if(parseFloat(this.model.get('LastTradePriceOnly')) > this.alert.value) {
              this.trigger('stockAlertUp', 'stockUp', data);
            }
          }else {
            if(parseFloat(this.model.get('LastTradePriceOnly')) < this.alert.value) {
              this.trigger('stockAlertDown', 'stockDown', data);
            }
          }
        }

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
      },

      _onSetAlert : function(event)  {
        var cutoff = $(event.target).attr('data-cutoff'),
            value = parseFloat(this.selectors.alertTxt.val());

        if(value > 0 && cutoff !== 'clear') {
          this.alert.value = value;
          if(cutoff === 'up')  { 
            this.selectors.alertUp.addClass('increase');
            this.selectors.alertDown.removeClass('decrease');
            this.alert.cutoff = true; 
          }
          else if(cutoff === 'down')  { 
            this.selectors.alertDown.addClass('decrease');
            this.selectors.alertUp.removeClass('increase');
            this.alert.cutoff = false; 
          }
        }else if(cutoff === 'clear')  {
          this.alert.value = 0;
          this.alert.cutoff = true;
          this.selectors.alertTxt.val('');
          this.selectors.alertUp.removeClass('increase');
          this.selectors.alertDown.removeClass('decrease'); 
        }
      },

      _onScrollMouseOver : function(event) {
        $(event.target).parent().stop().animate({'opacity' : 1}, "fast");
      },

      _onScrollMouseOut : function(event) {
        $(event.target).parent().stop().animate({'opacity' : .2}, "fast");
      },

      _onScrollLeft : function()  {
        var velocity = 0,
            left = this.selectors.chartSlider.position().left;

        if((left - 50) > -60)  { 
          velocity = 0;
        }else  { 
          velocity = (left + 50); 
        }

        this.selectors.chartSlider.stop().animate({'left' : velocity}, "fast");
      },

      _onScrollRight : function() {
        var velocity = 0,
            left = this.selectors.chartSlider.position().left;

        if((left + 50) < -4640)  { 
          velocity = -4640;
        }else  { 
          velocity = (left - 50); 
        }

        this.selectors.chartSlider.stop().animate({'left' : velocity}, "fast");
      }

    });

  }
)