// Create a client instance
var client = new Keen({
  projectId: "YOUR_PROJECT_ID",
  readKey: "YOUR_READ_KEY"
});

Keen.ready(function(){

  // Create a query instance
  var count = new Keen.Query("count", {
    event_collection: "pageviews",
    group_by: "property",
    timeframe: "this_7_days"
  });

  // Send query
  client.run(count, function(err, res){
    if (err) {
      // there was an error!
    }
    else {
      // do something with res.result
    }
  });

});