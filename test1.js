//# dc.js Getting Started and How-To Guide
'use strict';

var moveChart = dc.barChart("#monthly-move-chart");
var volumeChart = dc.barChart("#monthly-volume-chart");



d3.json("data3.json", function (data) {
        var dateFormat = d3.time.format("%d-%b-%y");
        var numberFormat = d3.format(".2f");
        var i=1;
         var senarios=[];
        data.forEach(function (d) {
            d.indx = i++;
            d.dd = dateFormat.parse(d.scenarioName);
            d.month = d3.time.month(d.dd); 
         senarios.push(d.scenarioName) ;
        });
         
         var ndx = crossfilter(data);
         var ndx2 = crossfilter(data);
         var all = ndx.groupAll();
         var dimOrder = ndx.dimension(function (d) {
            return d.rowNum;
        });
         var dimOrder2 = ndx2.dimension(function (d) {
            return d.rowNum;
        });

        var volumeByMonthGroup = dimOrder2.group().reduceSum(function (d) {
         
            return d.pnl;
        });

        var topN = dimOrder.filter([1,15]);
        var topT = topN.group().reduceSum(function (d) {
         
            return d.pnl;
        });

        moveChart
        .width(1050)
        .height(300)
        .margins({top: 20, right: 20, bottom: 100, left: 120})

        .renderlet(function(chart){
            chart.selectAll("g.x text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.6em")
            .attr("transform", function(d) {
                return "rotate(-90)" 
                });
        })
        .dimension(dimOrder)
        .group(topT)
        // .valueAccessor(function (d) {
        //     return d.pnl;
        // })
        .rangeChart(volumeChart)
        .transitionDuration(500)
        .elasticY(true)
        .centerBar(true)
        .brushOn(false)
        .gap(5)
        .x(d3.scale.linear().domain([1, all.reduceCount().value()]))
       //.x(d3.scale.ordinal())
        .xAxis().tickFormat(function(d,i){
            return senarios[d];
        });
        // moveChart.renderlet(function(chart){
        //     chart.selectAll("g.x text")
        //     .style("text-anchor", "end")
        //     .attr("dx", "-1em")
        //     .attr("dy", "-0.6em")
        //     .attr("transform", function(d) {
        //         return "rotate(-90)" 
        //         });
        // });
       //.x(d3.scale.ordinal(function(d, i) { return d["scenarioName"];}));

        volumeChart
        .width(1050)
        .height(50)
        .margins({top: 0, right: 20, bottom: 20, left: 120})
        .dimension(dimOrder2)
        .group(volumeByMonthGroup)
        // .valueAccessor(function (d) {
        //     return d.value.pnl;
        // })
        .centerBar(false)
        .gap(5)
        .x(d3.scale.linear().domain([1, all.reduceCount().value()]));
       
        console.debug("reduce all : "+all.reduceCount().value());
        dc.renderAll();
        $("#monthly-volume-chart g.y").css("display","none");
});


