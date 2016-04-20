//jquery objects
var ready;
var promptObj;

$( document ).ready(function() {
  ready = $("#ready");
  promptObj = $("#prompt");
  console.log( "ready!" );
});

var prompt = "";
var promptTime; 
var prompted = false;
var typedLetters = "";


$( "body" ).keypress(function(event ) {
  if(!prompted){
    if(event.charCode == 70 || event.charCode ==102){
      givePrompt();
    }
  }
  else{
    //is prompted
    typedLetters += String.fromCharCode(event.which);
    if(typedLetters.toUpperCase() == prompt.toUpperCase()){
      var timeToType = (new Date().getTime()) - promptTime;
      var success = false;
      if(timeToType < 1000*5) //if took longer than 5 seconds probabily error
        success = logData(prompt, timeToType);
      if(success){
        prompted = false;
        ready.show();
        promptObj.text("Typed sequence in " + timeToType + " ms");
        ready.text("Type f when ready.");
        typedLetters = "";
      }
      else{
        prompted = false;
        ready.show();
        promptObj.text("Data could not be recorded :( \n Maybe ad block blocked it? Try turning it off for this page.");
        ready.text("Type f when ready.");
        typedLetters = "";
      }
    }
    else if(prompt.length == 1){
      var timeToType = (new Date().getTime()) - promptTime;
      if(timeToType < 1000*7) //if took longer than 7 seconds probabily error
        success = logFail(prompt, typedLetters, timeToType);
      prompted = false;
      ready.show();
      promptObj.text("WRONG: in " + timeToType + " ms you typed " + typedLetters.toUpperCase() +
                     " when expected " + prompt);
      ready.text("Type f when ready.");
      typedLetters = "";
    }
    else if(prompt.length == 2 && typedLetters.length == 2 || 
            typedLetters.charAt(0).toUpperCase() != prompt.charAt(0)){
      var timeToType = (new Date().getTime()) - promptTime;
      if(timeToType < 1000*7) //if took longer than 7 seconds probabily error
        success = logFail(prompt, typedLetters, timeToType);
      prompted = false;
      ready.show();
      promptObj.text("WRONG: in " + timeToType + " ms you typed " + typedLetters.toUpperCase() +
                     " when expected " + prompt);
      ready.text("Type f when ready.");
      typedLetters = "";
    }
    console.log("tpyed " + typedLetters.toUpperCase() + " promt " + prompt);
  }
});

function givePrompt(){
  console.log("new prompt");
  prompt = ""
  
  prompt = String.fromCharCode(65 + Math.floor(Math.random()*26));
  if(Math.random() < .7){
    //70% chance of being two character 
    prompt += String.fromCharCode(65 + Math.floor(Math.random()*26));
  }
  $("#prompt").text(prompt);
  promptTime = new Date().getTime();
  prompted = true;
  $("#ready").hide();
  
}



//DATA TRACKING STUFF
var client = new Keen({
    projectId: "57172cdb672e6c5c4fa4f63f", // String (required always)
    writeKey: "3a292db375230386e3ac6f4b2f43e45bb0e254fde0a1ce27575227e529a17771cfc72dc4c86243eff923373bc8bebec956b73538033017c30fd86c977f78a4bc88944ce868ee0d0738002014fbaed7aab10735d25094a5c7ac975b509c914969",   // String (required for sending data)
    readKey: "9f26162068f5a5863e077a4d3f19639cbbe10f3de6bf9ba5129ca2c8c10c5a1368be8ac8c6f56d4e5bd822689c53a59eeefd326be1d1dc5117e0be52d743345ce7d2b0be811c94405c83d8adef68be11a643245dc50ae72b23d8b1f7449f1e88"      // String (required for querying data)

    // protocol: "https",         // String (optional: https | http | auto)
    // host: "api.keen.io/3.0",   // String (optional)
    // requestType: "jsonp"       // String (optional: jsonp, xhr, beacon)
  });


function logData(promptData, timeData){
  var userLang = navigator.language || navigator.userLanguage;
  var sampleEvent = {
    promt: promptData,
    time: timeData,
    promptLength: promptData.length,
    language: userLang,
    keen: {
      timestamp: new Date().toISOString()
    }
  }
  // Send it to the "type" collection
  client.addEvent("type", sampleEvent, function(err, res){
    if (err) {
      // there was an error!
      console.log("fail" + err);
      return false;
    }
    else {
      // see sample response below
      console.log("yay!");
    }
  });
  return true;
}

function logFail(promptData, typedData, timeData){
  var userLang = navigator.language || navigator.userLanguage;
  var failEvent = {
    promt: promptData,
    theyTyped: typedData,
    time: timeData,
    promptLength: promptData.length,
    language: userLang,
    keen: {
      timestamp: new Date().toISOString()
    }
  }
  // Send it to the "type" collection
  client.addEvent("missType", failEvent, function(err, res){
    if (err) {
      // there was an error!
      console.log("fail" + err);
      return false;
    }
    else {
      // see sample response below
      console.log("yay!");
    }
  });
  return true;
}

