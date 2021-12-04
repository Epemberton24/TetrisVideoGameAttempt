//https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 need to look at for reference to implement colision
// https://remysharp.com/2019/09/10/blocks-of-tetris-code also a good source for me to look at.

const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");


const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "BLACK"; // color of the empty squares.

// draws the squares in the board
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

//attempting to creating the board for Tetris

let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board that the player will play tetris on.
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// the tetrominoes and their colors.

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// creates a random piece.




function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();


// the piece object
function Piece(tetromino,color){
	this.tetromino = tetromino;
	this.color = color;
	
	this.tetrominoN = 0; //this will start at the first pattern
	this.activeTetromino = this.tetromino[this.tetrominoN];
	
	//this will be used to help control the pieces.
	this.x =3;
	this.y = -2;
	
}



// this is the fill function



Piece.prototype.fill = function(color){// implemented this function to make the 2 other functions easier to follow.
	for( r = 0; r <this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //this will help draw on a square that is being used.
			if(this.activeTetromino[r][c])
				drawSquare(this.x+ c,this.y + r,color); //the x and y will be used to help control the piece.
        }
    }
	// the above code is modified from the function draw board.
	
}






//drawing  PIECE into the board


Piece.prototype.draw = function(){
this.fill(this.color);
}

// from that point I tested to see if I could even see the shape by doing p.draw();


// undraw a piece so that it doesnt cause problems later on.

Piece.prototype.unDraw = function(){
	this.fill(VACANT);
}


//moves the pieces down
Piece.prototype.moveDown = function()
{
	if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}



//moves the piece to the right

Piece.prototype.moveRight = function()
{
	 if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
	
}


//moves the piece to the right

Piece.prototype.moveLeft = function()
{
	if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
	
}


//rotates the pieces
Piece.prototype.rotate = function()
{
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}


let score = 0;

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 100;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    scoreElement.innerHTML = score;
}

//collision function

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}







document.addEventListener("keydown",CONTROL);//this will be used to for the control function.


function CONTROL(event){
	if(event.keyCode== 37){
		p.moveLeft(); 
		dropStart = Date.now(); 
		}
	else if(event.keyCode==38){
		p.rotate(); 
		dropStart = Date.now();
		}
	else if(event.keyCode==39){
		p.moveRight(); 
		dropStart = Date.now();
		}
	else if(event.keyCode==40){
		p.moveDown(); 
		dropStart = Date.now();}
	
}




// drops the piece every sec


let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){//1000 ms = 1s, this will cause the piece to drop every one second 
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();







