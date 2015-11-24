# Multiple Modules #

This basic example demonstrates two important concepts you might use for your project:
- Modules, whereby different visualization types can be created from the same data but separated for clarity;
- Having different modules interact with each other, using `d3.dispatch` as an event 'traffic control' between modules.

## Problem Set-up ##
Here we have a dataset of state-by-state unemployment from Jan 2006 to Nov 2015. We would like to create a map module, showing a choropleth of unemployment rate, and a graph module, showing how this rate changes over time for each state.

We would like it so that when a state is selected/deselected from the map module, the corresponding line graph appears/disappears from the graph module.
