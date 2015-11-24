# Multiple Modules #

This basic example demonstrates two important concepts you might use for your project:
- Modules, whereby different visualization types can be created from the same data but separated for clarity;
- Having different modules interact with each other, using `d3.dispatch` as an event 'traffic control' between modules.

## Problem Set-up ##
Here we have a dataset of state-by-state unemployment from Jan 2006 to Nov 2015. We would like to create a map module, showing a choropleth of unemployment rate, and a graph module, showing how this rate changes over time for each state.

We would like it so that when a state is selected/deselected from the map module, the corresponding line graph appears/disappears from the graph module.

## Creating different modules ##
In index.html, we create two `<div class="canvas">` elements with unique id's. Then in lines 7-18 of script.js, we set up two `<svg>` canvases, one under each element.

Later, in lines *37* and *38*, we invoke a separate drawing function for each canvas using the `selection.call()` method. As a reminder, `selection.call(someFunction)` runs `someFunction`, passing in the selection as the parameter. To elaborate:
```
var plot1 = d3.select('#plot-1')... //line 7: "plot1" is a d3 selection
...
plot1.call(drawMap); //line 37: call "drawMap" function
...
function drawMap(plot){
  plot.append(...)
} //when "drawMap" is called, the parameter is the d3 selection that called it. So in this case, "plot" the parameter is the same as "plot1", the d3 selection
```

There are many benefits to doing this. For one, the code is much better structured and easier to read. In addition, each function, "drawMap" and "drawGraph", creates a local scope where local variables can't accidentally contaminate each other.
