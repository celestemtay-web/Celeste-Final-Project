/* DN1010 Experimental Interaction, Ashley Hi 2026
 * Week 5 - Computer Vision
 * Colour Tracking
 */


let symmetry = 6;
let angle = 360 / symmetry;
//calculate the angle at which each section is rotated.


var video; //creates webcam video
var target = []; //Stores selected colors to track: each clicked colour becomes a TargetColor object
var threshold = 25; //Controls how similar colours must be to count as "matching" larger number = greater tolerance

function setup() {
  createCanvas(640, 480);
  //angleMode(DEGREES);
  pixelDensity(1); //fixes pixel scaling issues
  video = createCapture(VIDEO, { flipped: true }); //turns on webcam, flips video like a mirror
  video.size(640, 480); // video resolution, same size as canvas
  video.hide();//hides raw html video
  noStroke();
}
function draw() {
  background(0); //clears screen to blank each frame
  image(video, 0, 0); //draw webcam video onto canvas

//  // ----- Mandala drawing -----
//  push();
//  translate(width / 2, height / 2);
//
//  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//
//    let lineStartX = mouseX - width / 2;
//    let lineStartY = mouseY - height / 2;
//    let lineEndX = pmouseX - width / 2;
//    let lineEndY = pmouseY - height / 2;
//
//    if (mouseIsPressed) {
//      for (let i = 0; i < symmetry; i++) {
//        rotate(angle);
//        stroke(255);
//        strokeWeight(3);
//        line(lineStartX, lineStartY, lineEndX, lineEndY);
//
//        push();
//        scale(1, -1);
//        line(lineStartX, lineStartY, lineEndX, lineEndY);
//        pop();
//      }
//    }
//  }
//
//  pop();
  // ----- End Mandala -----

// original code, colour tracking

  noStroke();
  fill(0);
  text("Threshold = ", 10, 20); //position of text
  text(threshold, 80, 20); //
  //writes the word "threshold" for colour tracking
  //shows threshold value on screen

  video.loadPixels();
  // loads pixel data to read colours

  for (var i = 0; i < target.length; i++) {  //runs once for each tracked colour
    text(
      "color " + i + ": " +
      target[i].red + ", " +
      target[i].green + ", " +
      target[i].blue,
      10,
      40 + i * 20
      //shows RGB values of each tracked colour
    );
    
    video.loadPixels();
    
    varclosestX = 0;
    var closestY = 0; 

    for (var x = 0; x < video.width; x += 3) {
      for (var y = 0; y < video.height; y += 3) {
        //loops through video pixels and skips every 3 pixels

        var index = (x + y * video.width) * 4; // finds pixel location inside pixel array
        var redSource = video.pixels[index + 0];
        var greenSource = video.pixels[index + 1];
        var blueSource = video.pixels[index + 2];
        // Extract RGB values from video pixel
        
// COMPARING COLOURS

        var d = dist(
          redSource,
          greenSource,
          blueSource,
          target[i].red,
          target[i].green,
          target[i].blue
        );
        //Calculate distance between colours 
        //Smaller distance = more similar 
        
// IF COLOUR MATCHES

        if (d < threshold) { //If colour is similar enough 
          target[i].avgX += x;
          target[i].avgY += y;
          target[i].count++;
          // Adds pixel position to average calculation
        }
      }
    }

    if (target[i].count > 0) {
    // if matching pixels were found

// DRAWING MANDALA USING TRACKED MOVEMENT
      push();

translate(width/2, height/2);

let x = target[i].avgX - width/2;
let y = target[i].avgY - height/2;

let px = target[i].prevX - width/2;
let py = target[i].prevY - height/2;

stroke(target[i].rgb);
strokeWeight(3);

for (let j = 0; j < symmetry; j++) {

rotate(angle);

line(px, py, x, y);

push();
scale(1,-1);
line(px, py, x, y);
pop();

}

pop();
// AFTER MANDALA DRAWING, SAVE PREVIOUS POSITION
      target[i].prevX = target[i].avgX;
      target[i].prevY = target[i].avgY;

      
// finds average X and Y position 
// gives centre of coloured object
      target[i].avgX /= target[i].count;
      target[i].avgY /= target[i].count;
    

// draws a dot at tracked position
      push();
      stroke(0);
      strokeWeight(4);
      fill(target[i].rgb);
      ellipse(target[i].avgX, target[i].avgY, 16, 16);
    
      pop();

      
// Writes text label
      text("ID :", target[i].avgX + 20, target[i].avgY + 7);
      text(i, target[i].avgX + 40, target[i].avgY + 7);
    }
  
    target[i].reset(); // clears tracking data for next frame
  }
}


 function mousePressed(){ //when user clicks: get colour from video + store it as new Targetcolour object
   target.push(new TargetColor(video.get(mouseX, mouseY)));
}

//4B
function keyTyped(){
  if (key === "i"){
    threshold += 2.5;
  } 
  // increase threshold
  
  else if (key === "d") {
    threshold -= 2.5;
  }
//decrease threshold
  
  if (key === "r") {
    target =[];
  
// reset all tracked colours
  }
} 

function TargetColor(_color) { //creates colour tracking object
  this.rgb = _color; //stores full colour
  this.red = red(_color);
  this.green = green(_color);
  this.blue = blue(_color);
// extract RGB components 
  
  this.prevX = 0;
  this.prevY = 0;
  // STORE PREVIOUS TRACKED POSITION (FOR MANDALA)
  
  
//1B- used to average position
  this.avgX = 0;
  this.avgY = 0;
  this.count = 0;

  
//3A clears values after each frame
  this.reset = function () {
    this.avgX = 0;
  this.avgY = 0;
  this.count = 0;
  
};
}





