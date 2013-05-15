define(
	['underscore', 'd3_helper'],
	function(_, D3Helper)	{

		return {

			lineFn : null,

			initStackChart : function()	{
				_.extend(this, D3Helper);
			},

			_line : function()	{
				var that = this;

				this.lineFn = 
					d3.svg.line()
						.x(function(data) { return that.scale.x(data.time); })
						.y(function(data) { return that.scale.y(data.value); });
			},

			drawStackChart : function()	{
				this._line();

				for(var company in this.D3DCs)	{
					var that = this;

					this.data = this.D3DCs[company];

					this.chart
					.append("path")
						.attr("d", that.lineFn(that.data))
						.attr("class", "test");
				}
			}

		}
	}
);