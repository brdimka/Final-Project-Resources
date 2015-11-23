var m = {t:50,r:50,b:50,l:50},
	width = document.getElementById('plot-1').clientWidth - m.l - m.r,
	height = document.getElementById('plot-1').clientHeight - m.t - m.b;

//Two visualizations displaying the same data
//
var plot1 = d3.select('#plot-1')
	.append('svg')
	.attr('width',width+m.l+m.r)
	.attr('height',height+m.t+m.b)
	.append('g').attr('class','canvas')
	.attr('transform','translate('+m.l+','+m.t+')');
var plot2 = d3.select('#plot-2')
	.append('svg')
	.attr('width',width+m.l+m.r)
	.attr('height',height+m.t+m.b)
	.append('g').attr('class','canvas')
	.attr('transform','translate('+m.l+','+m.t+')');

//Global variables for storing data
var geo, //GeoJSON data of 50+ states
	unemployment; //d3.map() of unemployment rate over time, state by state

//Other global variables, such as global scales etc.
var scaleColor = d3.scale.linear().domain([0,0.15]).range(['white','red']);

queue()
	.defer(d3.json,'data/gz_2010_us_040_00_5m.json')
	.defer(d3.csv,'data/unemployment_by_state.csv',parse)
	.await(function(err,g,r){
		geo = g;
		unemployment = d3.nest().key(function(d){return d.state}).map(r, d3.map);
		
		plot1.call(drawMap);
		plot2.call(drawGraph);
	});

function drawMap(plot){
	//plot == plot1
	var projection = d3.geo.albersUsa()
		.translate([width/2,height/2]);

	var path = d3.geo.path().projection(projection);

	plot
		.selectAll('.state')
		.data(geo.features)
		.enter()
		.append('path').attr('class','state')
		.attr('d',path)
		.style('fill',function(d){
			var dataSeries = unemployment.get(d.properties.STATE);
			console.log(d.properties.STATE);
			if(dataSeries){
				return scaleColor(dataSeries[0].rate);
			}
		})

}

function drawGraph(plot){
	//plot == plot2
}

function parse(d){
	return {
		state:d.state,
		rate:+d.rate,
		time:new Date(+d.year,(+d.month - 1),1)
	}
}