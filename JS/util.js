//used to keep track of users so that data can be averaged on a per
//user basis
var id = "NOTSET";
function getUserID(){
    if(id == "NOTSET")
        id = localStorage.getItem("userID");
    if(id == null){
        //no id already so make one
        id = Math.floor((1 + Math.random()) * 0xFFFFFFFF)
            .toString(16)
            .substring(1);
        localStorage.setItem("userID",id);
    }
    console.log("user ID " + id);
    return id
}
