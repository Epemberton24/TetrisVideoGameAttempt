// this is something I found on the internet that shows a rotating canvas, I will need to modify it to where it only changes when the scoreboard changes.
// what will need to happen is if the score is equal to a |a will equal the score plus 1000| rotate the board.
//https://www.html5canvastutorials.com/advanced/html5-canvas-transform-rotate-tutorial/
var context = canvas.getContext('2d');
      var rectWidth = 150;
      var rectHeight = 75;

      // translate context to center of canvas
      context.translate(canvas.width / 2, canvas.height / 2);

      // rotate 45 degrees clockwise
      context.rotate(Math.PI / 4);

   