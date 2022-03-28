function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    // ['940', '941', ...Map.]
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

  // Use the first sample from the list to build the initial plots
  var firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);

});
}
// Initialize the dashboard
init();

// this function is called in the index.html
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(resultArray[0]);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Create the buildCharts function.
function buildCharts(sample) {
// Use d3.json to load and retrieve the samples.json file 
d3.json("samples.json").then((data) => {
  // Create a variable that holds the samples array. 
  var samples = data.samples;
  // Create a variable that filters the samples for the object with the desired sample number.
  var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
  console.log(resultSample);
  
  //  Create a variable that holds the first sample in the array.
  var resultForSample = resultSample[0];
  console.log(resultForSample);

  // Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otuIds = resultForSample.otu_ids
  var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
  console.log(otuIdsSliced)

  var otuLabels = resultForSample.otu_labels;
  var otuLabelsSliced = otuLabels.slice(0,10).reverse();
  console.log(otuLabelsSliced);

  var sampleValues = resultForSample.sample_values;
  var sampleValuesSliced = sampleValues.slice(0,10).reverse();
  console.log(sampleValuesSliced);

  // Create the trace for the bar chart. 
  var barData = [{
    x: sampleValuesSliced,
    y: otuIdsSliced,
    text: otuLabelsSliced,
    type: "bar",
    orientation: 'h',
    marker: {
      color: 'rgb(153,135,173)',
      opacity: 0.8,}
  }];
  
  // Create the layout for the bar chart. 
  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    titlefont: {"size": 25},
    xaxis: {title: "Sample Value"}
  };
  
  // Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);


  // Create the trace for the bubble chart.
  var bubbleData = [{
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: "markers",
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: 'rainbow',
    }
    
  }];

  // Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures per Sample",
    xaxis: {title: "OTU ID"},
    yaxis: {title: "Sample Value"},
    titlefont: {"size": 25},
    hovermode: "closest",
    height: 500
  };

  // Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);


  // Initialize variables that hold arrays for the sample 
  //that is selected from the dropdown menu on the webpage
  var metadata = data.metadata;
  // Filter the data for the object with the desired sample number
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  console.log(resultArray);

  var result = resultArray[0];
  console.log(result);

  // Initialize variables and convert to a float
  var wFreq = result.wfreq
  var wFreqFloat = parseFloat(wFreq).toFixed(2)
  console.log(wFreqFloat)

  // Gauge Chart Trace
  var gaugeData = [{
    title: {text: "Scrubs per Week", font: {size: 18}},
    type: "indicator",
    mode: "gauge+number",
    value: wFreq,
    tickmode: 'linear',
    gauge: {
      axis: { range: [null, 10], dtick: 2, tick0: 0 },
      bar: { color: "firebrick" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 2], color: "floralwhite"},
        { range: [2, 4], color: "lavender"},
        { range: [4, 6], color: "thistle"},
        { range: [6, 8], color: "mediumslateblue" },
        { range: [8, 10], color: "royalblue" },
      ]},
      
  }];
  // Gauge Chart Layout
  var gaugeLayout = { 
    title: "Belly Button Washing Frequency",
    titlefont: {"size": 25}
  };

  // Plot Gauge Data
  Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
  }