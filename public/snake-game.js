// Mostly used vanilla JS. Used jQuery when I wanted to add styleChange with kentuckyStyle

const rows = 13; // Sets how many rows in snake-grid
const columns = 21; // Sets how many columns in snake-grid
// Made gridContainer the variable for the snake-grid-container element.
const gridContainer = document.getElementById("snake-grid-container");

let halfRow = Math.floor(rows / 3);
// Setting variables that will be changed throughout the game (initial state)
let up = document.getElementById("up-button");
let left = document.getElementById("left-button");
let down = document.getElementById("down-button");
let right = document.getElementById("right-button");
let gridArray = [];
let currentSnake = [
  // Put the first original currentSnake a third of the way down the rows. (rounded with Math.floor in halfRow)
  halfRow * columns + 1,
  halfRow * columns + 2,
  halfRow * columns + 3,
  halfRow * columns + 4,
  halfRow * columns + 5,
];
let direction = 1;
let interval = 0;
let intervalTime = 80;
let randomAppleSpot = 0;
let score = 0;
let highScore = 176;
let isRunning = false;
let keyPressed = []; // Array to store all keys pressed within interval time. Thus snake won't turn on itself if you press buttons too fast.
let kentuckyStyle = false;
let mediumSpeed = false;
let gridWidth = columns * 20 + 40; // width of grid is the amount of columns * their width which is 20px in CSS and add 40 so the border width is included.

$("#buttons-container").css("width", gridWidth); // Makes button-container same width as grid. Thus if columns change the buttons-container will change with it

document.addEventListener("DOMContentLoaded", function () {
  // this addEventListener pushes all the buttons that are pressed into keyPressed array
  document.addEventListener("keydown", function (e) {
    let event = e.key.replace("Arrow", "");
    keyPressed.push(event);
    console.log(keyPressed);

    // Logic that starts the game on keydown
    if (event === "Up" || event === "Down" || event === "Right") {
      if (!isRunning) {
        startGame();
        // Runs every intervalTime (ex: .1 seconds). If keyPressed > 1 means if two buttons were pushed simultaneously during the same interval
        interval2 = setInterval(keyPressedArray, intervalTime); // Put this here so interval that helps queue keyPress array will start the same time startGame() does.
        isRunning = true;
      }
    }
  });

  document.addEventListener("keydown", controls);
  document.getElementById("replay").addEventListener("click", replay);
});

// function that makes a grid for the snake game.
function makeGrid(rows, columns) {
  // These two setProperties set the values for css variables (in root) for --grid-rows and --grid-columns.
  // This way the grid column and rows in CSS will always have the same amount of rows and columns as this function.
  gridContainer.style.setProperty("--grid-rows", rows);
  gridContainer.style.setProperty("--grid-columns", columns);
  // Will loop to fill in table of rows and columns.
  for (let i = 0; i < rows * columns; i++) {
    // Cell is the new element being created each time loop runs. Be sure to use document.createElement().
    let cell = document.createElement("div");
    // Gives cell an id of the number cell it is and sets it to a string to easily identify for later.
    cell.setAttribute("id", i + 1);
    // If even cell
    if (i % 2 === 0) {
      // Append the element as a child to the container. Also add a class name for all of the cells so they all can be adjusted together in CSS
      if (kentuckyStyle) {
        // If snake game style is in ken tucky the game will restart with kentucky style grid. else it will be default green grid.
        gridContainer.appendChild(cell).className = "grid-item1-kentucky";
      } else {
        // If snake game style is in kentucky the game will restart with kentucky style grid. else it will be default green grid.
        gridContainer.appendChild(cell).className = "grid-item1";
      }
    } else {
      // Append the element as a child to the container. Also add a class name for all of the cells so they all can be adjusted together in CSS
      if (kentuckyStyle) {
        gridContainer.appendChild(cell).className = "grid-item2-kentucky";
      } else {
        gridContainer.appendChild(cell).className = "grid-item2";
      }
    }

    gridArray.push(i + 1);
  }
}
// Call the makeGrid function.
makeGrid(rows, columns);

// Make original snake to start game as well
// This loop sets up the original snake at start of game
for (let i = 0; i < currentSnake.length; i++) {
  if (kentuckyStyle) {
    document
      .getElementById(currentSnake[i])
      .classList.add("add-snake-kentucky");
  } else {
    document.getElementById(currentSnake[i]).classList.add("add-snake");
  }
}

// This function puts an apple in a random grid cell
function randomApple() {
  // do/while - loops through a block of code once, and then repeats the loop while a specified condition is true
  // If the currentSnake includes randomAppleSpot (if spot is on the snake) Then the randomAppleSpot will run again until it picks a spot where the snake is not at.
  do {
    // Math.random() * x  with Math.floor() will give a randge from 0 - x. To make it 1-x simply add one.
    randomAppleSpot = Math.floor(Math.random() * (rows * columns)) + 1;
  } while (currentSnake.includes(randomAppleSpot));

  // Call the random grid by id.
  let spot = document.getElementById(randomAppleSpot);
  let apple = document.createElement("i"); // Create i element to put apple in via font awesome icon with a class
  apple.setAttribute("id", "apple"); // Give the apple element an id. This way we can call on it later to remove apple once the snake eats it.

  // append the i element inside the random cell named spot and add the font awesome icon class for apple.
  if (kentuckyStyle) {
    spot.appendChild(apple).className = "fas fa-football-ball";
  } else {
    spot.appendChild(apple).className = "fas fa-apple-alt";
  }
}

function startGame() {
  randomApple();
  interval = setInterval(moveOutcome, intervalTime); // for setInterval we can not use a function call. Thus no () can be used.
}

/* Put this here and not DOMloaded or the snake will eat itself when you hit arrows simultaneously within same interval. If put after controls and interval 
below the same problem will occur. So,  putting it here makes it snake not eat itself after simultaneous arrows form the very start of the game. */

function moveOutcome() {
  if (checkHit()) {
    clearInterval(interval); // Clears interval for startGame() (Stops game)
    clearInterval(interval2); // Clears array handling keyPressed queue
    $("#snake-grid-container").addClass("animate__animated animate__tada"); // Shakes the snake-grid-container when snake hits border or eats itself

    // Use setTimeout to wait to change to game-over-container.
    setTimeout(function () {
      document.querySelectorAll(".grid-item1").forEach((e) => e.remove()); // Grabs all divs with class grid-item1. Then loops through each one and removes them.
      document.querySelectorAll(".grid-item2").forEach((e) => e.remove()); // Grabs all divs with class grid-item2. Then loops through each one and removes them.
      document
        .querySelectorAll(".grid-item1-kentucky")
        .forEach((e) => e.remove()); // Grabs all divs with class grid-item1. Then loops through each one and removes them.
      document
        .querySelectorAll(".grid-item2-kentucky")
        .forEach((e) => e.remove()); // Grabs all divs with class grid-item2. Then loops through each one and removes them.

      $("#game-over-container").css({ display: "block" });
      $("#current-game-over-score").text(score);

      $("#apple").removeClass();
      /* stops the snake from moving (NEEDS TO BE IN FRONT OF REPLAY()). This way clearInterval is called before the new game starts. 
       Otherwise the new game will start in old interval which is why the pause button only worked the first time. */
    }, 1000);
  }
  // If snakeHead does not hit anything then move snake
  else {
    moveSnake(currentSnake);
  }
}

function moveSnake(array) {
  // removes the tail (first element) in snake's array.
  let tailNum = array.shift();
  let tail = document.getElementById(tailNum);

  if (kentuckyStyle) {
    tail.classList.remove("add-snake-kentucky");
  } else {
    tail.classList.remove("add-snake");
  }

  // Adds the newHead to the currentSnake array but pushing last element + direction
  currentSnake.push(currentSnake[currentSnake.length - 1] + direction); // Add the next direction to end of currentSnake array
  let newHeadDiv = document.getElementById(
    currentSnake[currentSnake.length - 1]
  ); // New head is the new value we just pushed into the currentSnake array

  if (kentuckyStyle) {
    newHeadDiv.classList.add("add-snake-kentucky"); // Simply adding the add-snake class to the element with the id of last elemnt of the currentSnake array
  } else {
    newHeadDiv.classList.add("add-snake"); // Simply adding the add-snake class to the element with the id of last elemnt of the currentSnake array
  }

  // Movement is over. Now we handle if newHead is on apple
  let newHeadGridNum = currentSnake[currentSnake.length - 1];
  // Passes newHeadGridNum to check if newHead is on same grid as apple. Pass tailNum as parameter to add to currentSnake to make it grow if apple is eaten.
  eatApple(newHeadGridNum, tailNum);
}

function checkHit() {
  /* First set of conditions. If the head of the snake plus columns is bigger than the area of the grid and the direction is columns (down) then the snake has hit the bottom border. 
    Second set of conditions. If the head of the snake -columns is <= columns then snake is on top row. If direction is - columns (up) then the snake has hit the top border.
    Third set of conditions. If the remainder of the snake head divided by columns (mod) === 0 Then snake is on the far right column. If direction is 1 then snake has hit the right border.
    Fourth set of conditions. If the remainder of the snake head divided by columns (mod) === 1 then the snake head is on the far left columns. If direction is -1 then snake has hit left border.
    Fifth set of conditions. If the filtered array is not the same length as the currentSnake array that means it had a duplicate value (snakeHead hit the body).
    */

  // We filter the currentSnake array to make sure it has no duplicate values (snakeHead doesn't hit the body)
  let filteredSnake = currentSnake.filter(
    (val, i) => currentSnake.indexOf(val) === i
  );

  if (
    (currentSnake[currentSnake.length - 1] + columns > rows * columns && // This part handles snake hitting bottom border
      direction == columns) ||
    (currentSnake[currentSnake.length - 1] <= columns && // This part handles snake hitting top border
      direction == -columns) ||
    (currentSnake[currentSnake.length - 1] % columns === 0 && // This part handles snake hitting the right border
      direction == 1) ||
    (currentSnake[currentSnake.length - 1] % columns === 1 && // This part handles snake hitting the left border
      direction == -1) ||
    filteredSnake.length !== currentSnake.length // This part handles snake hitting itself
  ) {
    return true;
  } else {
    return false;
  }
}

// Function that controls when the eats an apple is eaten
function eatApple(newHeadGridNum, tailNum) {
  // If number of grid for newHead is same as randomAppleSpot grid number (snake has landed on apple to eat.)
  if (newHeadGridNum === randomAppleSpot) {
    // Add the number of grid for the tail back onto the currentSnake array.
    currentSnake.unshift(tailNum);
    // Give the new tail the add-snake class.
    if (kentuckyStyle) {
      document
        .getElementById(currentSnake[0])
        .classList.add("add-snake-kentucky");
    } else {
      document.getElementById(currentSnake[0]).classList.add("add-snake");
    }

    // Remove apple as it has now been eaten
    let appleGridSpot = document.getElementById("apple");
    appleGridSpot.remove();

    randomApple(); // Place another random apple

    // Iterate score and change score-number text to new score
    score++;
    document.getElementById("score-number").innerText = score; // Use jQuery as I am adding game over display to original gam

    // Iterates highScore if score is new highScore number
    if (score > highScore) {
      highScore = score;
      $(".high-score-number").text(highScore); // Displays new reset score to both high score classes. (includes extra game over display which is why I am using jQuery)
    }
  }
}

// Function controls changes directoin of snake depending on what arrow is pressed. Also calls on pausePlay() if space bar is pressed.
function controls() {
  // set event to the first button that was pushed during the current interval or the next button in queue in keyPressed array
  let event = keyPressed[0];
  if (event === "Up" && direction !== columns) {
    // Add second condition so snake can't turn back on itself
    direction = -columns;
  }
  // Add second condition so snake can't turn back on itself
  else if (event == "Left" && direction !== 1) {
    direction = -1;
  }
  // Add second condition so snake can't turn back on itself
  else if (event == "Down" && direction !== -columns) {
    direction = columns;
  }
  // Add second condition so snake can't turn back on itself
  else if (event == "Right" && direction !== -1) {
    direction = 1;
  }
}

/* We are only queueing two arrows as it is extremely rare more than two buttons get pushed with our given intervalTime. Just wanted to handle the snake movement
    when you hit two buttons fast to have snake go on grid directly beside itself in opposite direction. */

function keyPressedArray() {
  // Using same logic as controls function that changes direction for snakeHead
  if (keyPressed.length > 1) {
    /* Set event to the second button that is clicked in array. Thus, after the first keyPress element is pressed the 
           next interval will have the second button that was pushed simultaneously next in line. */
    let event = keyPressed[1];
    if (event === "Up" && direction !== columns) {
      // Add second condition so snake can't turn back on itself
      direction = -columns;
    }
    // Add second condition so snake can't turn back on itself
    else if (event == "Left" && direction !== 1) {
      direction = -1;
    }
    // Add second condition so snake can't turn back on itself
    else if (event == "Down" && direction !== -columns) {
      direction = columns;
    }
    // Add second condition so snake can't turn back on itself
    else if (event == "Right" && direction !== -1) {
      direction = 1;
    }
  }
  keyPressed = [];
}

// Handles when game ends and want to restart the game
function replay() {
  makeGrid(rows, columns); // Resets new grid.
  currentSnake = [
    // Put the first original currentSnake a third of the way down the rows. (rounded with Math.floor in halfRow)
    halfRow * columns + 1,
    halfRow * columns + 2,
    halfRow * columns + 3,
    halfRow * columns + 4,
    halfRow * columns + 5,
  ];

  // Reset original snake
  for (let i = 0; i < currentSnake.length; i++) {
    if (kentuckyStyle) {
      document
        .getElementById(currentSnake[i])
        .classList.add("add-snake-kentucky");
    } else {
      document.getElementById(currentSnake[i]).classList.add("add-snake");
    }
  }
  direction = 1; // resets direction of the snake to make sure it starts off going to the right.
  score = 0; // Resets score
  document.getElementById("score-number").innerText = score; // Displays new reset score
  keyPressed = []; // Clear the arrows pressed queue
  isRunning = false; // Changes game running to false so startGame() won't be called until arrow is pushed after restart.

  // Remove animated class so it can be added again after game gets played for a second time. This way it doesn't just work after one game, but now it will work every game
  $("#snake-grid-container").removeClass("animate__animated animate__tada");
  $("#game-over-container").css("display", "none");
}

// These handle the buttons being pressed. Directional buttons follow same logic as controls functions.

/* ADD EVENT LISTENER TO REPLAY GAME AFTER IT ENDS */

document.getElementById("up-button").onclick = function () {
  if (isRunning === false) {
    startGame();
    // Runs every intervalTime (ex: .1 seconds). If keyPressed > 1 means if two buttons were pushed simultaneously during the same interval
    interval2 = setInterval(keyPressedArray, intervalTime); // Put this here so interval that helps queue keyPress array will start the same time startGame() does.
    isRunning = true;
  }
  if (direction !== columns) {
    direction = -columns;
  }
};
document.getElementById("left-button").onclick = function () {
  if (direction !== 1) {
    direction = -1;
  }
};
document.getElementById("down-button").onclick = function () {
  if (isRunning === false) {
    startGame();
    // Runs every intervalTime (ex: .1 seconds). If keyPressed > 1 means if two buttons were pushed simultaneously during the same interval
    interval2 = setInterval(keyPressedArray, intervalTime); // Put this here so interval that helps queue keyPress array will start the same time startGame() does.
    isRunning = true;
  }
  if (direction !== -columns) {
    direction = columns;
  }
};
document.getElementById("right-button").onclick = function () {
  if (isRunning === false) {
    startGame();
    // Runs every intervalTime (ex: .1 seconds). If keyPressed > 1 means if two buttons were pushed simultaneously during the same interval
    interval2 = setInterval(keyPressedArray, intervalTime); // Put this here so interval that helps queue keyPress array will start the same time startGame() does.
    isRunning = true;
  }
  if (direction !== -1) {
    direction = 1;
  }
};

// This function handles the style-change button when clicked
// Sadly I had to use jQuery to add a component to a class (add-snake).

function styleChange() {
  if (kentuckyStyle) {
    kentuckyStyle = false;

    $("#style-change-button").text("Kentucky Style"); // Changes text in button to show what the other style will be if button is clicked

    $("button").css("color", "rgb(3, 82, 3)"); // Changes button's color to green

    $("#snake-grid-container").css({
      border: "20px solid rgb(3, 82, 3)", // Chagnes border back to default green color
      "box-shadow": "", // Gets rid of kentuckyStyle's border box-shadow.
      "background-image": "", // Gets rid of background-image
    });

    $("body").css("background-color", "rgb(60, 139, 60)"); // Changes background color back to default green

    $(".grid-item1").removeClass("grid-item1-kentucky"); // Removes the kentucky style class so default class is displayed
    $(".grid-item2").removeClass("grid-item2-kentucky"); // Removes the kentucky style class so default class is displayed

    // Add these two for when the grid remakes kentucky style to start game and not default.
    $(".grid-item1-kentucky")
      .removeClass("grid-item1-kentucky")
      .addClass("grid-item1"); // Changes grid-item1 to grid-item1-kentucky style class
    $(".grid-item2-kentucky")
      .removeClass("grid-item2-kentucky")
      .addClass("grid-item2"); // Changes grid-item1 to grid-item2-kentucky style class

    // Changes football back to apple
    $("#apple")
      .removeClass("fas fa-football-ball") // Removes the football icon so apple can be displayed
      .addClass("fas fa-apple-alt"); // Brings in apple again.

    // Next section changes game-over-container back to default
    $("#game-over-header").css({ color: "rgb(3, 82, 3" });
    $("#replay").css("border", "2.5px solid rgb(3, 82, 3)");
    $("#game-over-container").css({
      border: "1px solid rgb(3, 82, 3)",
      "background-image":
        "url('https://image.spreadshirtmedia.com/image-server/v1/compositions/T1040A70PA2252PT26X21Y4D1010306115FS4256/views/1,width=500,height=500,appearanceId=70,backgroundColor=fff/sad-snake-trucker-cap.jpg')",
    });
    $("#game-over-high-score").css("color", "rgb(3, 82, 3)");
    $("#game-over-score").css("color", "rgb(3, 82, 3)");

    // Reset the currentSnake array to default style with for loop
    for (let i = 0; i < currentSnake.length; i++) {
      document
        .getElementById(currentSnake[i])
        .classList.remove("add-snake-kentucky"); // Removes the kentucky style class for this specific element (div with currentSnake[i])
    }
    for (let i = 0; i < currentSnake.length; i++) {
      document.getElementById(currentSnake[i]).classList.add("add-snake");
      /* Adds the default snake class back on to currentSnake
       The adding of class list and removing of class list for current snake must be in different for loops in order for the snake to process both */
    }
  }

  // Else change to kentuckyStyle
  else {
    kentuckyStyle = true; // Change boolean value for kentucky style so next time button is clicked we call the if statement and set style back to default

    $("#style-change-button").text("Default Style"); // Changes text in button to show what the other style will be if button is clicked

    $("button").css("color", "blue"); // Changes button's text color to blue

    $("#snake-grid-container").css({
      border: "20px solid blue", // Changes grid border to blue
      "box-shadow": "0px 0px 10px 2px white", // Adds box-shadow to snake-grid-container
      "background-image":
        "url('https://pbs.twimg.com/media/DoTwo_ZVsAAS1lw.jpg')", // Adds kentucky football background image
    });

    $("body").css("background-color", "#4e4e4e"); // Adds the grey background color.

    $(".grid-item1").addClass("grid-item1-kentucky"); // Changes grid-item1 to grid-item1-kentucky style class
    $(".grid-item2").addClass("grid-item2-kentucky"); // Changes grid-item1 to grid-item2-kentucky style class

    $(".add-snake").removeClass("add-snake").addClass("add-snake-kentucky"); // Changes snake to kentucky style class
    $("#apple").addClass("fas fa-football-ball"); // Adds football class.

    // This section changes game-over-container to kentucky style
    $("#game-over-header").css({ color: "blue" });
    $("#replay").css("border", "2.5px solid blue");
    $("#game-over-container").css({
      border: "1px solid blue",
      "background-image":
        "url('https://www.orlandosentinel.com/resizer/Y5hi6YtD4sePom-pasGZ4fB-gw4=/1200x0/top/arc-anglerfish-arc2-prod-tronc.s3.amazonaws.com/public/32KMZNWB6JBQLE2RZZKOU7LN7Y.jpg')",
    });
    $("#game-over-high-score").css("color", "white");
    $("#game-over-score").css("color", "white");
  }
}

// This changes speed and text of level button (for mom and Laura lol)
function levelChange() {
  if (mediumSpeed) {
    $("#level-change-button").text("Medium Style");
    intervalTime = 80;
    mediumSpeed = false;
  } else {
    $("#level-change-button").text("Hard Style");
    intervalTime = 140;
    mediumSpeed = true;
  }
}
