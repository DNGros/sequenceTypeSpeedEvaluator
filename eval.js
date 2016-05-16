//jquery objects
var ready;
var promptObj;
var readyText;
var doLogs = true;
var mySamples = 0;
var myRights = 0;
var mySum = 0;

$(document).ready(function(){
  ready = $("#ready");
  promptObj = $("#prompt");
  console.log("ready!");
  readyText = ready.text;
  mySamples = localStorage.getItem("mySamples") || 0;
  mySum = parseInt(localStorage.getItem("mySum")) || 0;
  myRights = localStorage.getItem("myRights") || 0;
  updateCols();
});

var prompt = "";
var promptTime; 
var prompted = false;
var typedLetters = "";


$( "body" ).keypress(function(event ) {
  if(!prompted){
    if(event.charCode == 70 || event.charCode ==102) {
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
      if(success){
        promptObj.text(timeToType + " ms");
      }
      else{
        promptObj.text("Data could not be recorded :( \n Maybe ad block blocked it? Try turning it off for this page.");
      }
      prompted = false;
      ready.css('visibility','visible');
      ready.text("Press f when ready");
    }
    else if((prompt.length == 2 && typedLetters.length == 2) || 
            typedLetters.charAt(0).toUpperCase() != prompt.charAt(0)){
      var timeToType = (new Date().getTime()) - promptTime;
      if(timeToType < 1000*7){ //if took longer than 7 seconds probabily error
        success = logFail(prompt, typedLetters, timeToType);
      }
      prompted = false;
      ready.css('visibility','visible');
      promptObj.text("WRONG");
      ready.text("You typed " + typedLetters.toUpperCase() + " when expected " +
                    prompt + ". Press f when ready.");
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
  ready.css('visibility','hidden');
  
}



//DATA TRACKING STUFF
var client = new Keen({
    projectId: myProjectId, // defined in keenKeys.js . See CONTRIBUTING.md
    writeKey: myWriteKey,   // defined in keenKeys.js
    readKey: myReadKey      // defined in keenKeys.js

    // protocol: "https",         // String (optional: https | http | auto)
    // host: "api.keen.io/3.0",   // String (optional)
    // requestType: "jsonp"       // String (optional: jsonp, xhr, beacon)
  });


function logData(promptData, timeData){
  //Return early if disabled
  if(!doLogs)
    return true;
  
  //Store local data
  mySamples++;
  myRights++;
  console.log("timeData " + timeData);
  mySum += parseInt(timeData);
  localStorage.setItem("mySamples", mySamples);
  localStorage.setItem("myRights", myRights);
  localStorage.setItem("mySum",mySum);
  updateCols();
  
  //Construct event
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
  mySamples++;
  localStorage.setItem("mySamples", mySamples);
  updateCols();
  
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

function updateCols(){
  $("#samples-disp").text("Samples Contributed: " + mySamples);
  console.log("my sum " + mySum + " r " + myRights);
  if(myRights > 0)
    $("#avg-disp").text("Average Time: " + Math.round(mySum/myRights) + "ms");
  else
    $("#avg-disp").text("Average Time: --");
}
