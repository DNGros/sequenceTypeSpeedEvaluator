//jquery objects
var ready;
var promptObj;
var readyText;
var doLogs = true;
$( document ).ready(function() {
  ready = $("#ready");
  promptObj = $("#prompt");
  console.log( "ready!" );
  readyText = ready.text;
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
    console.log(prompt);
    //is prompted
    typedLetters += String.fromCharCode(event.which);
    if(typedLetters.toUpperCase() == prompt.toUpperCase()){
      var timeToType = (new Date().getTime()) - promptTime;
      var success = true;
      if(timeToType < 1000*5) //if took longer than 5 seconds probabily error
        success = logData(prompt, timeToType);
      if(success){;
        promptObj.text(timeToType + " ms");
      }
      else{
        promptObj.text("Data could not be recorded :( \n Maybe ad block blocked it? Try turning it off for this page.");
      }
      prompted = false;
      ready.show();
      ready.text("Press f when ready");
    }
    else if((prompt.length == 2 && typedLetters.length == 2) || 
            typedLetters.charAt(0).toUpperCase() != prompt.charAt(0)){
      var timeToType = (new Date().getTime()) - promptTime;
      if(timeToType < 1000*7){ //if took longer than 7 seconds probabily error
        success = logFail(prompt, typedLetters, timeToType);
      }
      prompted = false;
      ready.show();
      promptObj.text("WRONG");
      ready.text("You typed " + typedLetters.toUpperCase() + " when expected " +
                    prompt + ". Press f when ready for the next one.");
    }
  }
  
  
    
  console.log("tpyed " + typedLetters.toUpperCase() + " promt " + prompt);
  
});

function givePrompt(){
  console.log("new prompt");
  typedLetters = "";
  prompt = String.fromCharCode(65 + Math.floor(Math.random()*26));
  if(Math.random() < .7){
    //70% chance of being two character 
    prompt += String.fromCharCode(65 + Math.floor(Math.random()*26));
  }
  $("#prompt").text(prompt);
  promptTime = new Date().getTime();
  prompted = true;
  ready.hide();
  
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
  if(!doLogs)
    return true;
  var userLang = navigator.language || navigator.userLanguage;
  var sampleEvent = {
    promt: promptData,
    time: timeData,
    promptLength: promptData.length,
    language: userLang,
    userID: getUserID(),
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
  if(!doLogs)
    return true;
  var userLang = navigator.language || navigator.userLanguage;
  var failEvent = {
    promt: promptData,
    theyTyped: typedData,
    time: timeData,
    promptLength: promptData.length,
    language: userLang,
    userID: getUserID(),
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

//used to keep track of users so that data can be averaged on a per
//user basis
function getUserID(){
  var id = localStorage.getItem("userID");
  if(id == null){
    //no id already so make one
    id = Math.floor((1 + Math.random()) * 0xFFFFFFFF)
      .toString(16)
      .substring(1);
    var d = new Date();
    localStorage.setItem("userID",id);
  }
  console.log("user ID " + id);
  return id
}
