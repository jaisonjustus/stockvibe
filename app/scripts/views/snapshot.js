/**
 * Module to manage activties in stock snapshot view and data model. 
 * This module also extends properties from D3Helper Module for 
 * visualization.
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

      slide : {
        width : 350,
        maxWidth : 5040,
        currentPosition : 0
      },

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

        this.on('chartPlotOverflow', this._chartPlotOverflow);
      },

      render : function() {
        this.$el.html(this.template({data : this.model.toJSON()}));
        this.renderChart();
        return this;
      },

      /**
       * Method to trigger chart rendering.
       * @method renderChart
       * @access public
       */
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

      /**
       * Method to update the D3 Data collection.
       * @method _updateD3DC
       * @access private
       */
      _updateD3DC : function()  {
        this.D3DC.add(Utility.YQLtoD3DCMapper(this.model));

        this.trigger('updateD3DC', this.model.get('id'), this.D3DC);

        this.setData(this.D3DC.toJSON());
        if(!this.extentCalculated) {
          this.calculateExtentScaleAndAxis('*');
          this.extentCalculated = true;
        }
        this.updateChart(this.D3DC.toJSON());
      },

      /**
       * Event handler for snapshot remove. 
       * @method _onRemove
       * @access private
       */
      _onRemove : function()  {
        this.trigger('removeSnapshot', this.model.get('id'));
      },

      /**
       * Handler for data alert.
       * @method _onSetAlert
       * @access private
       * @param object event
       */
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

      /**
       * Handler when mouse over the scroll tab.
       * @method _onScrollMouseOver
       * @access private
       * @param object event
       */
      _onScrollMouseOver : function(event) {
        $(event.target).parent().stop().animate({'opacity' : 1}, "fast");
      },

      /**
       * Handler when mouse out the scroll tab.
       * @method _onScrollMouseOut
       * @access private
       * @param object event
       */
      _onScrollMouseOut : function(event) {
        $(event.target).parent().stop().animate({'opacity' : .2}, "fast");
      },

      /**
       * Handler when left scroll tab is clicked. also move the chart slider
       * @method _onScrollLeft
       * @access private
       */
      _onScrollLeft : function()  {
        this._scroll(false, false);
      },

      /**
       * Handler when right scroll tab is clicked. also move the chart slider
       * @method _onScrollRight
       * @access private
       * @param int position
       */
      _onScrollRight : function() {
        this._scroll(false, true);
      },

      /**
       * Helper Method for chart container scrolling. scrolling is enabled only 
       * in two direction left(direction representation : false) and 
       * right(direction representation : true).
       * @method _scroll
       * @access private
       * @param int position 
       * @param boolean direction.
       */
      _scroll : function(position, direction)  {
        if(!position)  {
          var left = this.selectors.chartSlider.position().left;
          if(direction) { this._scrollRight(left); }else { this._scrollLeft(left); }
        }else {
          this.slide.currentPosition = position;
        }

        this.selectors.chartSlider.stop().animate({ 'left' : this.slide.currentPosition }, "fast");
      },

      /**
       * Method to calculate the velocity to scroll chart conatiner to right.
       * @method  _scrollRight
       * @access private
       * @param int left
       */
      _scrollRight : function(left)  {
        this.slide.currentPosition = left - this.slide.width;
        if(this.slide.currentPosition <= (-1 * this.slide.maxWidth))  {
          this.slide.currentPosition = (-1 * this.slide.maxWidth) + this.slide.width;
        }
      },

      /**
       * Method to calculate the velocity to scroll chart conatiner to left.
       * @method  _scrollLeft
       * @access private
       * @param int left
       */
      _scrollLeft : function(left)  {
        this.slide.currentPosition = left + this.slide.width;
        if(this.slide.currentPosition >= 0)  {
          this.slide.currentPosition = 0;
        }
      },

      /**
       * Method to initialize chart scrolling when the chart values get overflowed
       * with respect to the maximum extent.
       * @method _chartPlotOverflow
       * @access private
       * @param int overflowPoint
       */
      _chartPlotOverflow : function(overflowPoint) {
        if(this.slide.currentPosition === 0)  {
          if(overflowPoint >= 0) {
            var position = this.slide.width * Math.floor(overflowPoint/this.slide.width);

            position *= -1;
            this._scroll(position, true);
          }
        }else {
          if(overflowPoint > ((this.slide.currentPosition * -1) + this.slide.width) &&
              overflowPoint <= this.slide.maxWidth)  {
            this._scrollRight();
          }else if(overflowPoint < (this.slide.currentPosition * -1) &&
              overflowPoint >= 0) {
            this._onScrollLeft();
          }
        } 
      }

    });

  }
)