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

  // Create a query instance
  var getMyCorrect = new Keen.Query("count", {
    event_collection: "type",
    filters: myFilter,
    //group_by: "property",
    timeframe: timeFrame
  });
  var getAllCorrect = new Keen.Query("count", {
    event_collection: "type",
    timeframe: timeFrame
  });
  var getMyWrong = new Keen.Query("count", {
    event_collection: "missType",
    filters: myFilter,
    //group_by: "property",
    timeframe: timeFrame
  });
  var getAllWrong = new Keen.Query("count", {
    event_collection: "missType",
    timeframe: timeFrame
  });
  // Send query
  client.run([getMyCorrect,getAllCorrect,getMyWrong,getAllWrong], function(err, res){
    if (err) {
      // there was an error!
      console.log(err)
    }
    else {
      // do something with res.result
      console.log(this.data);
      $("#myCorrect").text(this.data[0].result);
      $("#allCorrect").text(this.data[1].result);
      $("#myWrong").text(this.data[2].result);
      $("#allWrong").text(this.data[3].result);
    }
  });

});