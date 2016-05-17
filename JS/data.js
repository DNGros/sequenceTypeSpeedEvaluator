// Create a client instance
var client = new Keen({
  projectId: myProjectId,
  readKey: myReadKey
});
var timeFrame = "this_10_years";
var myFilter = [
  {
    property_name: "userID",
    operator: "eq",
    property_value: getUserID()
  }
];

Keen.ready(function(){
  var tAnalyses = {
    "total_count": {
      analysis_type: "count"
    },
    "avg_time": {
      analysis_type: "average",
      target_property: "time"
    }
  }

  // Queries
  var getMyCorrect = new Keen.Query("multi_analysis", {
    event_collection: "type",
    analyses: tAnalyses,
    filters: myFilter,
    timeframe: timeFrame
  });
  var getAllCorrect = new Keen.Query("multi_analysis", {
    event_collection: "type",
    analyses: tAnalyses,
    timeframe: timeFrame
  });
  var getMyWrong = new Keen.Query("multi_analysis", {
    event_collection: "missType",
    filters: myFilter,
    analyses: tAnalyses,
    timeframe: timeFrame
  });
  var getAllWrong = new Keen.Query("multi_analysis", {
    event_collection: "missType",
    analyses: tAnalyses,
    timeframe: timeFrame
  });
  var getAllCorrectGrouped = new Keen.Query("average", {
    event_collection: "type",
    target_property: "time",
    group_by: "promt",
    filters: [{
      property_name: "promptLength",
      operator: "eq",
      property_value: 1
    }],
    timeframe: timeFrame
  });
  var getAllCorrectGrouped = new Keen.Query("average", {
    event_collection: "type",
    target_property: "time",
    group_by: "promt",
    filters: [{
      property_name: "promptLength",
      operator: "eq",
      property_value: 1
    }],
    timeframe: timeFrame
  });

  //Charts
  var chart = new Keen.Dataviz()
      .el(document.getElementById("single-letter-chart"))
      .colors(["#6ab975"])
      .chartType("columnchart")
      .height(300)
      .sortGroups("asc")
      .title("Single Character Times")
      .chartOptions({
          isStacked: true,
        })
      .prepare(); // start spinner


  // Send query
  client.run([getMyCorrect,getAllCorrect,getMyWrong,getAllWrong,getAllCorrectGrouped], function(err, res){
    if (err) {
      // there was an error!
      console.log(err);
      $("#loading").text("ERROR: " + err);
    }
    else {
      // do something with res.result
      $("#loading").hide();
      console.log(this.data);
      $("#myCorrect").text(this.data[0].result.total_count);
      $("#allCorrect").text(this.data[1].result.total_count);
      $("#myWrong").text(this.data[2].result.total_count);
      $("#allWrong").text(this.data[3].result.total_count);
      $("#myTime").text(Math.round(this.data[0].result.avg_time) + "ms");
      $("#allTime").text(Math.round(this.data[1].result.avg_time) + "ms");

      //graph
      chart
          .parseRawData({result: this.data[4].result})//this.data[4].result.map(e => e.result))
          .render();
      console.log(chart.sortGroups())
    }
  });
  /*client.draw(getAllCorrectGrouped, document.getElementById("single-letter-chart"),{
    chartType: "barchart"

  });*/
  /*client.run(getAllCorrectGrouped, function(err, res){
    if (err) {
      // there was an error!
      chart.error(err.message);
    }
    else {
      //graph
      chart
       .parseRequest(this)
       .render();
    }
  });*/

});