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
      prompted = false;
      ready.show();
      promptObj.text("Typed sequence in " + timeToType + " ms");
      ready.text("Type f when ready.");
      typedLetters = "";
    }
    else if(prompt.length == 1){
      var timeToType = (new Date().getTime()) - promptTime;
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