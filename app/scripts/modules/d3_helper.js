define(['utility','d3'], function(Utility)  {

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

    tooltip : null,

    chart : null,

    extentCalculated : false,

    setup : function(width, height, margin, dom, id)  {
      this.viewport.width = width - margin;
      this.viewport.height = height - margin;
      this.viewport.margin = margin;
      this.dom = dom;

      this.initVisualizationCanvas();

      this.tooltip = d3.select("body")
        .append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);

      console.log("d3 setup", this.tooltip);

      // this.initVisualizationCanvas();
      // this.setData(dataSet);
      // this.calculateExtentAndScale('*');
      // this.renderChart();
    },

    initVisualizationCanvas : function()  {
      var that = this;

      this.chart = d3.select(that.dom)
        .append('svg')
          .attr("width", that.viewport.width + that.viewport.margin)
          .attr("height", that.viewport.height + that.viewport.margin)
        .append('g')
          .attr("class", "chart");

      console.log(this.chart);
    },

    setData : function(dataSet)  {
      this.data = dataSet;
      //this.calculateExtentAndScale('*');
    },

    updateChart : function(dataSet)  {
      //this.setData(dataSet);
      this.calculateExtentAndScale('y');
      this.drawChart();
    },

    calculateExtentAndScale : function(cordinate)  {
      if(cordinate === 'x' || cordinate === '*') {
        console.log("calc : x");

        var date1 = new Date(),
            date2 = new Date();

        /* Setting date range. the time NYSE will be active from 9 AM to 2 PM
           at us timing. */
        date1.setHours(19); date1.setMinutes(0); date1.setSeconds(0);
        date1.setHours(26); date1.setMinutes(0); date1.setSeconds(0);

        console.log(Utility);

        date1 = Utility.calculateTimeAtNYSE('-4', date1);
        date2 = Utility.calculateTimeAtNYSE('-4', date2);

        console.log("Dates >>>>> ", date2, date1);

        this.extent.x = [date2.getTime(), date1.getTime()];

        console.log(this.extent.x);

        this.scale.x = d3.time.scale()
                      .domain(this.extent.x)
                      .range([this.viewport.margin, this.viewport.width]);

      }

      if(cordinate === 'y' || cordinate === '*')  {
        console.log("calc : y");
        this.extent.y = d3.extent(this.data, function(datum) { return datum.value; });
        console.log("extent y: ",this.extent.y);
        //this.extent.y[0] -= 3;
        //this.extent.y[1] += 3;

        this.scale.y = d3.scale.linear()
                      .domain(this.extent.y)
                      .range([this.viewport.height, this.viewport.margin]);
      }
    },

    drawChart : function()  {
      var that = this;

      console.log(that.scale.y);

      this.chart.selectAll("rect")
        .data(this.data)
        .enter().append("rect")
          .attr("x", function(d) { that.trigger('shiftx', that.scale.x(d.time)); return that.scale.x(d.time); })
          .attr("y", function(d) { return that.scale.y(d.value); })
          .attr("width", 1)
          .attr("height", function(d) {return that.viewport.height - that.scale.y(d.value); })
        .on("mouseover", function(d) {
          that.tooltip.transition()        
            .duration(500)      
            .style("opacity", .9);      
          that.tooltip.html(d.value)  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");   
        })
        .on("mouseout", function() {       
          that.tooltip.transition()        
            .duration(500)      
            .style("opacity", 0);   
        });
    }
  };

});