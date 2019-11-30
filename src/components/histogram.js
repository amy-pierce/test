// Code goes here

var margin = { top: 20, right: 20, bottom: 70, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.timeParse("%Y-%m");

var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickFormat(d3.timeFormat("%Y-%m"));

var yAxis = d3.axisLeft(y)
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("bar-data.csv", function (error, data) {

    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    x.domain(data.map(function (d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value ($)");

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function (d) { return x(d.date); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.value); })
        .attr("height", function (d) { return height - y(d.value); });


    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (function (d) { return x(d.date); }))
        .attr("y", function (d) { return y(d.value) - 20; })
        .attr("dy", ".75em")
        .text(function (d) { return d.value; });


    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.value;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("x", function (d, i) {
            return i * (width / data.length);
        })
        .attr("y", function (d) {
            return height - (d * 4);
        });

});
