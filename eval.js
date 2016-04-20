$( document ).ready(function() {
    console.log( "ready!" );
});

prompt = ""
prompted = false;
$( "body" ).keypress(function(event ) {
  if(event.charCode == 70 || event.charCode ==102){
    if(!prompted)
      givePrompt();
  }
  
});

function givePrompt(){
  console.log("new prompt");
  $("#prompt").text("df");
}