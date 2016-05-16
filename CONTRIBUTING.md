Contributing or use of this code is welcome under the MIT license. 

===Keen.IO setup===
In order to order to prevent excessive use / contamination of the data for this project, I ask that you create a seperate keen.io account during use or development. After making an account at keen.io, you should make have two collections named "type" and "misType". Then you then will need to create file in the project root directory called keenKeys.js which should have variables defined for your keys as such:

var myProjectId = "YOUR_PROJECT_ID";
var myWriteKey = "YOUR_WRITE_KEY";
var myReadKey = "YOUR_READ_KEY";