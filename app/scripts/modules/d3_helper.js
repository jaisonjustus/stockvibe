define(['d3', 'Utility'], function(Utility)  {

  return {

    viewport : {
      width : 0,
      height : 0,
      margin : 0
    },

    dom : null,

    data : [],

    extent : {
      x : null,
      y : null
    },

    scale : {
      x : null,
      y : null
    },

    chart : null,

    setup : function(width, height, margin, dom)  {
      this.viewport.width = width - margin;
      this.viewport.height = height - margin;
      this.viewport.margin = margin;
      this.dom = dom;

      this.initVisualizationCanvas();
    },

    initVisualizationCanvas : function()  {
      var that = this;

      this.chart = d3.select(that.dom)
        .append('svg')
          .attr("width", that.viewport.width + that.viewport.margin)
          .attr("height", that.viewport.height + that.viewport.margin)
        .append('g')
          .attr("class", "chart");
    },

    prepareData : function(dataSet)  {
      this.data = dataSet;
    },

    calculateExtentAndScale : function(cordinate)  {
      if(cordinate === 'x' || cordinate === '*') {
        this.extend.x = d3.extent(this.data, function(datum) { return datum.value; });

        this.scale.x = d3.scale.linear()
                      .domain(this.extent.x)
                      .range([this.viewport.height, this.viewport.margin]);

      }else if(cordinate === 'y' || cordinate === '*')  {
        var date1 = new Date(),
            date2 = new Date();

        /* Setting date range. the time NYSE will be active from 9 AM to 2 PM
           at us timing. */
        date1.setHours(19); date1.setMinutes(0); date1.setSeconds(0);
        date1.setHours(26); date1.setMinutes(0); date1.setSeconds(0);

        date1 = Utility.calcuateTimeAtNYSE('-4', date1);
        date2 = Utility.calcuateTimeAtNYSE('-4', date2);

        this.extent.y = [date1.getTime(), date2.getTime()];

        this.scale.y = d3.time.scale()
                      .domain(this.extent.y)
                      .range([this.viewport.margin, this.viewport.width]);
      }
    }
  };

});