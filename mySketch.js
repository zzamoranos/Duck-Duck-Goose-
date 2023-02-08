/*
Welcome to the game!

INSTRUCTIONS
The objective of the game is to 'bonk' (or hit) as many ducks as you can with a piece of bread (the cursour) without hitting 
any geese. The game continues as long as a duck is not bonked, and when a goose is hit, the game immediately ends.

1. Key presses
i. Initialize the game
In order to start a game, the player must hit the 'ENTER' key.

ii. Pause the game
In order to pause an ongoing game, the player must hit the 'SPACEBAR'. TO unpause the game, the player must hit ANY KEY on
their keyboard, not including the spacebar.

CREDITS
Credits to https://www.youtube.com/watch?v=Fw3RB7xnb80 for the 'QUACK' sound effect.
Credits to https://www.youtube.com/watch?v=W931nTCAP for the 'BONK' sound effect.

*/


//Global variables

//sound
let quack;
let bonk;

// set game status
let gameOver = false;
let gamePause = false;
let startScreen = true;

// variables and arrays for the animals
let numDucks;
let numGeese;
let duck = [];
let goose = [];
let duckOrGoose = [];
let lilypadX = [];
let lilypadY = [];

// arrays for the circle
let holesX = [];
let holesY = [];
let isDuck = []; // recognizes when there is a duck on the circle

// sets the score
let score = 0;
let highest = 0;

// fonts
let headingText;
let bodyText;
let codeText;

// images
let img;
let imgDuck;
let imgGoose;
let imgBread;

function preload() {
	imgDuck = loadImage("duck.png")
	imgGoose = loadImage("goose.png")
	imgBread = loadImage("bread.png")

	quack = loadSound("Quack.mp3");
	bonk = loadSound("Bonk1.mp3");

	// fonts
	headingText = loadFont('Chiki.otf');
	bodyText = loadFont('DMSans-Regular.ttf');
	codeText = loadFont('DMMono-Regular.ttf');
}

function setup() {
	createCanvas(600, 600);
	background(0, 100, 255);
	for (let i = 0; i < 10; i++) { //lilypad
		lilypadX[i] = random(0, width);
		lilypadY[i] = random(0, height);
	}
	// draws the holes
	holesDraw(180, 120, 180, 120, 60);

	initializeDucks();
	initializeGeese();
	for (let i = 0; i < 10; i++) { //lilypad
		lilypad();
	}
}

function draw() {
	if (startScreen === true) {
		start();
	} else if (gamePause === false && gameOver === true) {
		gameIsOver();

	} else if (gamePause === true && gameOver === false) {
		//stop everything, numbers stop updating
		text('Press any key (other than space) to resume the game.', width / 2, height / 2);

		// if game is on
	} else if (gamePause === false && gameOver === false) {
		// continue game
		background(0, 100, 255);
		lilypad();
		holesDraw(180, 120, 180, 120, 60);

		//text for high score
		highScore();

		// animals stay in one spot
		for (let i = 0; i < 5; i++) {
			if (numDucks === 0) {
				initializeDucks();
			}

			textSize(20);
			strokeWeight(2);
			noStroke();
			fill(255);
			text('Score = ' + score, 200, 30);
			textSize();

			// draw the animals in a for loop
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (duckOrGoose[i + j * 3] === 1) {
						duckDraw(i, j);
					} else if (duckOrGoose[i + j * 3] === 2) {
						gooseDraw(i, j);
					}
				}
			}
		}
		if (random(0, 100) < 2) { // if it is within this range, you spawn a new duck -- if not, it keeps the duck
			// animals respawn in a new random position
			for (let j = 0; j < 130000; j++) {
				emptyDucks();
			}
			for (let k = 0; k < 1; k++) {
				initializeDucks();
			}
		}
		if (random(0, 100) < 2) {
			for (let l = 0; l < 100000; l++) {
				emptyGeese();
			}
			for (let m = 0; m < 1; m++) {
				initializeGeese();
			}
		}

		// bread cursor
		image(imgBread, mouseX, mouseY, 150, 150);
	}
}

function start() {
	// draw the background
	fill("#00008B"); //dark blue
	rect(0, 0, width, height);
	image(imgDuck, width / 2, 460, 360, 360);
	
	// draw the title
	textAlign(CENTER);
	textFont(headingText);
	stroke(255);
	fill(255);
	textSize(60);
	text("Duck, Duck, Goose!", width / 2, 150);
	
	// write the instructions
	textSize(15);
	textFont(bodyText);
	fill("#CCE1FE");
	text("Hit as many ducks as you can", width / 2, 220);
	text("Do not hit a goose, or you will lose", width / 2, 240);
	textSize(20);
	text("press ENTER to start the game", width / 2, 300);
}

function gameIsOver() {
	//draw game over interface
	background(0, 100, 255);
	textSize(40);
	stroke(0);
	fill(0);
	textAlign(CENTER);
	text('Game Over!', width / 2, 120);

	// replay button
	rectMode(CENTER);
	fill(255);
	rect(width / 2, 180, 150, 50);
	image(imgGoose, width / 2, 450);
	fill(0)
	noStroke();
	textSize(28);
	text('Play Again', width / 2, 190);

	// hit test for replay button
	if (mouseIsPressed === true && mouseX > (width / 2 - 75) && mouseX < (width / 2 + 75) &&
		mouseY > 155 && mouseY < 205) {
		rectMode(CENTER);
		rect(width / 2, 180, 150, 50);
		image(imgGoose, width / 2, 450);
		fill(255);
		text('Play Again', 238, 408);
		if (mouseIsPressed) {
			restart();
		}
	}
}

function highScore() {
	fill(255);
	text("High Score:  " + highest, 360, 30);
}

// make sure array is updated into duck or goose whenever changes are made
function initializeDucks() {
	emptyDucks(); // empty all of the ducks

	let numDucks = random(0, 2);
	for (let i = 0; i < numDucks; i++) {
		let randomX = int(random(0, 2));
		let randomY = int(random(0, 2));
		let index = randomX + 3 * randomY; // doesn't make a goose where there is a duck, and continues producing randomX and randomY

		// make sure that the holes are empty
		while (duckOrGoose[index] === 1 || duckOrGoose[index] === 2) {
			randomX = int(random(0, 3));
			randomY = int(random(0, 3));
			index = randomX + 3 * randomY;
		}
		duckDraw(randomX, randomY); // draws the duck at a random position
		duckOrGoose[index] = 1;
	}
}

function initializeGeese() {
	emptyGeese();
	let numGeese = random(0, 2);
	for (let i = 0; i < numGeese; i++) {
		let randomX = int(random(0, 3));
		let randomY = int(random(0, 3));
		let index = randomX + 3 * randomY; // doesn't make a goose where there is a duck, and continues producing randomX and randomY

		// make sure that the holes are empty
		while (duckOrGoose[index] === 1 || duckOrGoose[index] === 2) {
			randomX = int(random(0, 2));
			randomY = int(random(0, 2));
			index = randomX + 3 * randomY;
		}
		gooseDraw(randomX, randomY); // draws the goose at a random position
		duckOrGoose[index] = 2;
	}
}
// erase ducks
function emptyDucks() {
	for (let i = 0; i < duckOrGoose.length; i++) {
		if (duckOrGoose[i] === 1 && duckOrGoose[i] != 2) {
			duckOrGoose[i] = 0;
		}
	}
}

// erase geese
// do not empty if it's a duck
function emptyGeese() {
	for (let i = 0; i < duckOrGoose.length; i++) {
		if (duckOrGoose[i] === 2 && duckOrGoose[i] != 1) {
			duckOrGoose[i] = 0;
		}
	}
}

// draws the holes
function holes(x, y, radius) {
	noStroke();
	fill(0, 0, 255, 50);
	ellipse(x, y, radius);
}

// draws the holes in a for loop
function holesDraw(xSep, xInit, ySep, yInit, rad) {
	// within a 3x3 grid
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			holes(i * xSep + xInit, j * ySep + yInit, rad * 2);
			holesY[j] = j * ySep + yInit // holds the inner coordinates
		}
		holesX[i] = i * xSep + xInit // only updates when the outer loop runs
	}
}

// draws the ducks, where they show up randomly
function duckDraw(i, j) {
	imageMode(CENTER);
	image(imgDuck, holesX[i], holesY[j], 160, 160);
}

function lilypad() {
	fill("#5ED670"); // colour of the lilypads are green
	for (let i = 0; i < 10; i++) { // draws 10 lilypads in random positions on the canvas
		arc(lilypadX[i], lilypadY[i], 80, 80, 0, PI + HALF_PI + QUARTER_PI, PIE);
	}
}

function gooseDraw(i, j) { // draws the geese, where they show up randomly
	imageMode(CENTER);
	image(imgGoose, holesX[i] + 15, holesY[j], 190, 190);
}


function duckGooseHitTest() {
	// when mouse hits the duck/goose
	// return true if duck, return false if goose
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) { //value for row by row
			if (circleHitTest(mouseX, mouseY, holesX[i], holesY[j], 60) === true) { //double for loop //cX, cY input position for holes
				let index_circle = i + j * 3;
				let duckGoose = duckOrGoose[index_circle];
				if (duckGoose === 1) { // if you hit a duck
					score++;
					if (score > highest) { //high score system
						highest = score;
					}
					numDucks = numDucks - 1; // when duck is clicked, duck disappears
					duckOrGoose[index_circle] = 0;
					initializeGeese();
					quack.play();
					return true;
				} else if (duckGoose === 2) { //if you hit a goose
					duckOrGoose[index_circle] = 0;
					gameOver = true;
					bonk.play();
					initializeGeese();
					return false;
				}
			}
		}
	}
}

// 3 possibilities, 0 --> no duck or goose, 1 --> duck, 2 --> goose
function circleHitTest(pX, pY, cX, cY, radius) { //hit test for LEDs

	let d = dist(pX, pY, cX, cY);
	if (d <= radius) {

		return true;
	} else {
		return false;
	}
}

function mousePressed() { //put sound in here, update into 0, score + 1, thrid line play sound
	//when mouse is pressed on a duck, duck is patted and disappears
	//when mouse is pressed on a goose, game over
	duckGooseHitTest();
}

function keyPressed() {
	if (keyCode === 13 && startScreen === true) { //find what enter is 
		startScreen = !startScreen;
	} else if (key === ' ') { // when ‘spacebar’ (or ‘ ‘) key is pressed, game pauses
		gamePause = true;
	} else { //any key other than space will resume the game
		gamePause = false;
	}
}

function restart() {
	//reset everything to 0 or false
	gameOver = false;
	score = 0; // resets the score
}
