// data link
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


function init()/*populate initial data */{

  // selDataset uses a drop down menu
  let dropdownMenu = d3.select("#selDataset");

  // load data using JSON
  d3.json(url).then((data) => {

    // change potentially confusing fieldname "names" to descriptive "test_subject"
    let test_subject = data.names;

    // load test subject id into the drop down menu
    test_subject.forEach((id) => {
      dropdownMenu.append("option")
      .text(id)
      .property("value",id);
    });

    // load the structure
    myMetadata(test_subject[0]);

    // load the bar chart
    myBarChart(test_subject[0]);

    // load the bubble chart
    myBubbleChart(test_subject[0]);

    // log selected information to the console
    console.log("Initial Test Subject: " + test_subject[0])
  });
};


function myMetadata(sample)/*establish structure*/{

  // load data using JSON
  d3.json(url).then((data) => {

    // load filtered metadata
    let value = data.metadata.filter(result => result.id == sample);

    // pull selected information
    Object.entries(value[0]).forEach(([key,value]) => {

      // display selected information in the Demographic Info box
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

      // log selected information to the console
      console.log(key+": ",value);
    });
  });
};


function optionChanged(test_subject)/*requery samples*/{

  // Clear out the old metadata
  d3.select("#sample-metadata").html("");

  // load the new metadata
  myMetadata(test_subject);

  // load the bar chart
  myBarChart(test_subject);

  // load the bubble chart
  myBubbleChart(test_subject);

  // log selected information to the console
  console.log("New Test Subject: "+test_subject);
};


function myBarChart(sample)/*the bar chart lists top ten bacteria present in the selected sample*/{

  // load data using JSON
  d3.json(url).then((data) => {

    // load filtered sample
    let sampleData = (data.samples.filter(result => result.id == sample))[0];

    // list the top ten operational taxonomic units (OTU) by their count in descending order
    let x_value = sampleData.sample_values.slice(0,10).reverse();

    // list the top ten operational taxonomic units (OTU) by their id in descending order
    let y_value = sampleData.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // name each OTU by their proper name and provide the actual count in descending order
    let text_value = sampleData.otu_labels.slice(0,10).reverse()

    // set the bar chart structure
    let bar_trace = {
      x: x_value,
      y: y_value,
      text: text_value,
      type: "bar",
      orientation: "h"
    };    

    // title the bar chart
    let layout = {
      title: "Top 10 OTUs Present"
    };

    // load the bar chart
    Plotly.newPlot("bar", [bar_trace], layout)

    // log selected information to the console
    console.log("**Bar Chart Data** \nOTU ID:\n" + y_value, "\nOTU proper name: " + text_value, "\nCount of OTU:\n" + x_value);
  });
};


function myBubbleChart(sample)/*the bubble chart displays all the bacteria present in the selected sample*/{

  // load data using JSON
  d3.json(url).then((data) => {

    // load filtered sample
    let sampleData = (data.samples.filter(result => result.id == sample))[0];

    // OTU present in the sample
    let x_value = sampleData.otu_ids;

    // count of OTU present in selected sample
    let y_value = sampleData.sample_values;

    // name each OTU by their proper name and provide the actual count in descending order
    let text_value = sampleData.otu_labels;

    // set the bubble chart structure
    let bubble_trace = {
      x: x_value,
      y: y_value,
      text: text_value,
      mode: "markers",
      marker: {
          size: y_value,
          color: x_value,
          colorscale: "Jet"
      }
  };

  // title the bar chart
  let layout = {
    title: "Bacteria Per Sample",
    xaxis: {title: "OTU ID"},
  };

  // load the bar chart
  Plotly.newPlot("bubble", [bubble_trace], layout)

  // log selected information to the console
  console.log("**Bubble Chart Data** \nOTU ID:\n" + x_value, "\nOTU proper name: " + text_value, "\nCount of OTU:\n" + y_value);
    });
};

init();