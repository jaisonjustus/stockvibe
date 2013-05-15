/**
 * D3 Helper module for stock visualization.
 * @module D3Helper
 */
define(['utility','d3'], function(Utility)  {

  return {

    /* Canvas viewport properties. */
    viewport : {
      width : 0,
      height : 0,
      margin : 0
    },

    /* Canvas dom holder. */
    dom : null,

    /* Dataset for visualization. */
    data : [],

    /* Object to keep track of chart region extends. */
    extent : {
      x : null,
      y : null
    },

    /* Object to keep track of chart scale factor. */
    scale : {
      x : null,
      y : null
    },

    /* Object to keep track of axis for charts. */
    axis : {
      x : null,
      y : null
    },

    /* Maintain the tooltip pointer. */
    tooltip : null,

    /* Maintain the chart object. */
    chart : null,

    /**
     * Method to setup the canvas region and other properties required for
     * charting. Also initialize the canvas(prepare chart object) and prepare
     * the tooltip.
     * @method setup
     * @acces public
     * @param int width
     * @param int height
     * @param int margin
     * @param string dom
     * @param string id
     */
    setup : function(width, height, margin, dom, id)  {
      this.viewport.width = width - margin - 60;
      this.viewport.height = height - margin;
      this.viewport.margin = margin;
      this.dom = dom;

      this._initVisualizationCanvas();

      this.tooltip = d3.select("body")
        .append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);
    },

    /**
     * Method to initialize the chart object.
     * @method _initVisualizationCanvas
     * @access private
     */
    _initVisualizationCanvas : function()  {
      var that = this;

      this.chart = d3.select(that.dom)
        .append('svg')
          .attr("width", that.viewport.width + that.viewport.margin + 60)
          .attr("height", that.viewport.height + that.viewport.margin)
        .append('g')
          .attr("class", "chart");

      console.log(this.dom);
    },

    /**
     * Method to set the dataSet.
     * @method setData
     * @access public
     * @param array dataSet.
     */
    setData : function(dataSet)  {
      this.data = dataSet;
    },

    /**
     * Method to update the chart render when a new data is pushed into
     * the dataset.
     * @method updateChart
     * @access public
     * @param array dataSet
     */
    updateChart : function(dataSet)  {
      this.calculateExtentScaleAndAxis('y');
      this.drawChart();
    },

    /**
     * Method to calculate the chart properties like chart region extent, scale factor
     * and axis.
     * @method calculateExtentScaleAndAxis
     * @access public
     * @param string cordinate
     */
    calculateExtentScaleAndAxis : function(cordinate)  {
      if(cordinate === 'x' || cordinate === '*') {
        var date1 = new Date(),
            date2 = new Date();

        date1 = Utility.calculateTimeAtNYSE('-4', date1);
        date2 = Utility.calculateTimeAtNYSE('-4', date2);

        /* Setting date range. the time NYSE will be active from 9 AM to 2 PM
           at us timing. */
        date1.setHours(9); date1.setMinutes(30); date1.setSeconds(0);
        date2.setHours(16); date1.setMinutes(0); date1.setSeconds(0);

        this.extent.x = [date1.getTime(), date2.getTime()];

        this.scale.x = 
          d3.time.scale()
            .domain(this.extent.x)
            .range([this.viewport.margin + 30, this.viewport.width]);

        this.axis.x = 
          d3.svg.axis()
            .scale(this.scale.x)
            .orient('bottom')
            .ticks(7);

        d3.select(this.dom)
          .select('svg')
          .append('g')
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (this.viewport.height) + ")")
          .call(this.axis.x);

      }

      if(cordinate === 'y' || cordinate === '*')  {
        this.extent.y = d3.extent(this.data, function(datum) { return datum.value; });

        /* Adjusting y extend. */
        this.extent.y[0] = parseInt(this.extent.y[0]) - 1;
        this.extent.y[1] = parseInt(this.extent.y[1]) + 1;

        this.scale.y = 
          d3.scale.linear()
            .domain(this.extent.y)
            .range([this.viewport.height, this.viewport.margin]);

        this.axis.y = 
          d3.svg.axis()
            .scale(this.scale.y)
            .orient('left')
            .ticks(4);
      }
    },

    /**
     * Method to draw the chart into the canvas
     * @method drawChart
     * @access public
     */
    drawChart : function()  {
      var that = this;

      this.chart.selectAll("rect")
        .data(this.data)
        .enter().append("rect")
          .attr("x", function(d) { that.trigger('chartPlotOverflow', that.scale.x(d.time)); return that.scale.x(d.time); })
          .attr("y", function(d) { return that.scale.y(d.value); })
          .attr("width", 2)
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

      d3.select(that.dom)
        .select('svg')
        .select('.y-axis')
        .remove();

      d3.select(that.dom)
        .select('svg')
        .append('g')
          .attr('class','y-axis')
          .attr("transform", "translate("+(this.viewport.margin + 30)+",0)")
        .call(this.axis.y);
    }
  };

});