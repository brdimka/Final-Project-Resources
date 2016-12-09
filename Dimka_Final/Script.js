console.log('olympicMedals');
var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

/*    var plot = d3.select('canvas')
      .append('div').attr('class','value')
      .append('svg')
      .attr('width', w + m.l + m.r)
      .attr('height', h + m.t + m.b)
      .append('g').attr('class','plot')
      .attr('transform','translate('+ m.l+','+ m.t+')');
*/

var plot = d3.select('.canvas')
  .append('div').attr('class','value')
  .append('svg')
  .attr('width', w + m.l + m.r)
  .attr('height', h + m.t + m.b)
  .append('g').attr('class','plot')
  .attr('transform','translate('+ m.l+','+ m.t+')');

var projection = d3.geoMercator(),
    path = d3.geoPath().projection(projection);
var pathGenerator = d3.geoPath()
      .projection(projection);

var rate = d3.map();

var scaleColor = d3.scaleLinear().domain([0,100]).range(['white','blue']);





d3.queue()
    .defer(d3.json, '../world.geo.json/countries.geo.json')
    .defer(d3.csv, '../Summer Olympic medallists 1896 to 2008 - UPDATE.csv',parseData)
    .await(function(err, geo, data){
      var countries = d3.nest()
          .key(function(d){return d.country})
          .rollup(function(leaves) { return leaves.length; })
          .entries(data);
          countries.forEach(function(d){
            rate.set(d.key,+d.value)
            console.table(data);
          });
//NEW STUFF START
          var medalsSort = d3.nest()
              .key(function(d){return d.country}).sortKeys(d3.ascending)
              .key(function(d){return d.edition}).sortKeys(d3.ascending)
              .rollup(function(leaves) { return leaves.length; });
              var medalsPerYear = medalsSort.entries(data);
    medalsPerYear.forEach(function(year){
    year.allMedals=d3.sum(year.values,function(d){return d.value})
    });
var country = plot.selectAll('.country')
  .data(geo.features)
  .enter()
  .append('path')
  .attr('d',path)
  .style('fill',function(d){
    var id = (+d.medal);
    var r = rate.get(id);
    return scaleColor(r);
  });
//NEW STUFF END

var medal = d3.nest()
  .key(function(d){return d.Total})
  .entries(data);
  drawMap(geo,countries);

  var medalsByTopic= d3.nest()
      .key(function(d){return d.medal})
      .entries(data);
      drawMap(geo,countries);
    });
    
function drawMap(geo, countries){
  var maps = plot.selectAll('.country')
    .data(geo.features)
    .enter()
    .append('path').attr('class','country')
    .attr('d',pathGenerator)
    .style('fill',function(d){
      var id=d.id;    //CHANED "MEDAL" to "id"
      if(isNaN(rate.get(id))==0){
        return scaleColor(rate.get(id));} else {  //CHANED "MEDAL" to "id"
          countries.push({key: id, value: 0});
    }

    })
    .style('opacity',1)
    .style('stroke-width','.25px')
    .style('stroke','red');

    countries.forEach(function(d){
      rate.set(d.key,+d.id)
    });
  projection.fitExtent([[0,0],[w,h]],countries);

        maps.on('mouseenter',mouseEnter)
            .on('mousemove',mouseMove)
            .on('mouseleave',mouseLeave);
}

function mouseEnter(d){
    var tooltip = d3.select('.custom-tooltip');

    tooltip.select('.title').html(d.properties.name);
    tooltip.select('.value').html("Total Medals: "+rate.get(d.id));

    tooltip
        .style('visibility','visible')
        .transition()
        .style('opacity',.9);

    d3.select(this).transition().style('opacity',.5);
}

function mouseMove(d){
var xy = d3.mouse(d3.select('.container').node());

var tooltip = d3.select('.custom-tooltip')
  .style('left',xy[0]+5+'px')
  .style('top',xy[1]+5+'px');
}

function mouseLeave(d){
var tooltip = d3.select('.custom-tooltip');

tooltip
  .style('visibility','hidden')
  .style('opacity',0);

d3.select(this).transition().style('opacity',.8);
}


function parseData(d){
  return {
      country: d.Country,
      medal: d.Total,
      golds: d.Golds,
      silvers: d['Silvers'],
      bronzes: d['Bronzes'],
  }
}
