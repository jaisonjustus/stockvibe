define(
	['backbone', 'stack_chart',
	 'tpl!../templates/stack-tpl.html'], 
	function(Backbone, StackChart, StackTpl)	{

		return Backbone.View.extend({

			name : 'StackView',

			tagName : 'section',

			className : 'snapshot note',

			template : StackTpl,

			D3DCs : {},

			data : [],

			extentCalculated : false,

			initialize : function()	{
				this.selectors = {};
				_.extend(this, StackChart);
				this.initStackChart();
			},

			render : function()	{
				this.$el.html(this.template());
				this._attachSelectors();

				return this;
			},

			_attachSelectors : function()	{
				this.selectors.chart = this.$el.find('#stack-chart');
			},

			setD3DCs : function(id, D3DC)	{
				this.D3DCs[id] = D3DC.toJSON();

				console.log("id, D3DC, D3DC[id]", id, D3DC, this.D3DCs[id]);
			},

			_mergeData : function()	{
				this.data = [];

				for(var attr in this.D3DCs)	{
					this.data = this.data.concat(this.D3DCs[attr]);
				}

				console.log("merged data : ", this.data);
			},

			prepareStack : function()	{
				if(!this.chart)	{
					/* Setting up D3 charting. */
        	this.setup(5040, 330, 20, '#stack-chart','');
      	}

				this._mergeData();
        if(!this.extentCalculated) {
          this.calculateExtentScaleAndAxis('*');
          this.extentCalculated = true;
        }else	{
        	this.calculateExtentScaleAndAxis('y');
        }
        this.drawStackChart();
			}

		});

	}
)