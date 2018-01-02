// 1. create the solution mapping
//     1.1 Create "map" based on set size
//     1.2 Define naming convention
//         9 = bomb
//         1-8 = neighboring bombs
//         0 = no neighboring bombs
//     1.3 Assign random bombs to map based on set bomb count
//             Math.floor(Math.random()*(arr.length) + 0
//                 .random()takes random float value between 0 - 1
//                 multiply to increase range range 0 - 1 is now 0 - n
//                 .floor() rounds to the lower integer, removes decimals
//                 + 0 not needed unless zero is not the minimum value
// 2. Assign neighboring clues 1 - 8
// 3. create the concealed mapping
// 4. create UI commands

var $show = document.getElementById("show");


// TEST ARRAY var test = [Array(3),Array(3),Array(3)]; for (var i = 0; i < 3; i++) {for (var j = 0; j < 3; j++){ test[i][j] = 1}} 
//     1.1 Create "map" based on set size

var gameEnd = false;
var gameSize = 0;          // what player sees
var mapSize = 0;           // array index length, +2 for refund space
var bombMap = [];           // smaller array for where bombs are located
var solutionMap = [];           // array storing number hints
var playerMap = [];         //  what's player sees
var skipList = [];     // non zero's and checked zero's 
var checkList = [];    // new zero's not already on skipList[]



function spamArray(length, value) {        // Takes a number called "length", and outputs an array of that length with only zeroes
    var temp = Array(length);
    for (var i = 0; i < length; i++) {
        temp[i] = value;
    }
    return temp;
}

//     1.3 Assign random bombs to map based on set bomb count
function rand(range) {
    return Math.floor(Math.random() * (range));
}

function newGame(bombCount, width) {
    gameEnd = false;
    gameSize = width;
    mapSize = width + 2;
    solutionMap = [];
    bombMap = [];
    playerMap = [];
    for (var i = 0; i < mapSize; i++) {
        solutionMap.push(spamArray(mapSize, 0));
        bombMap.push(spamArray(mapSize, 0));    // add an array of n length, n times
        playerMap.push(spamArray(mapSize, " "));
    }


    for (var y = 0; y <= gameSize; y++) {
        for (var x = 0; x <= gameSize; x++) {
            bombMap[y][x] = 0;
            solutionMap[y][x] = 0;
            playerMap[y][x] = " ";
        }
    }

    var allCoord = [];
    for (var i = 0; i < mapSize; i++) {
        for (var j = 1; j < mapSize; j++) {
            if (i !== 0 && j !== 0 && i !== (gameSize + 1) && j !== gameSize + 1) {
                allCoord.push([i, j]);
            }
        }
    }

    for (var i = 0; i < bombCount; i++) {
        var setBombTo = [];             // array holds a coordinate to set a Bomb in
        
        setBombTo = allCoord.splice(rand(allCoord.length), 1);       // splice a random coordinate from map to setBomb
        bombMap[setBombTo[0][0]][setBombTo[0][1]] = 9;               // now that coordinate has a bomb and is removed from possible
    }

    checkList = [];
    skipList = [];
    for (var i = 0; i < mapSize; i++) {
        for (var j = 1; j < mapSize; j++) {
            if (i === 0 || j === 0 || i === mapSize - 1 || j === mapSize - 1) {
                skipList.push([i, j]);
            }
        }
    }
    updateSolution();
    display();
}

newGame(10, 10);
display();


// 2. Assign neighboring clues 1 - 8 on solutionMap
function updateSolution() {
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (bombMap[y][x] === 9) {

                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {             // addNeighbour()
                        solutionMap[y + i][x + j] += 1;
                    }
                }
            }
        }
    }
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (bombMap[y][x] === 9) {
                solutionMap[y][x] = "💥";
            }
        }
    }
}

window.click = click;
window.contextmenu = flag;

function flag(y, x) {
    if (playerMap[y][x] === "🚩") {
        playerMap[y][x] = " ";
    }
    else {
        playerMap[y][x] = "🚩";
    }
    display();
}

function click(y, x) {
    if (bombMap[y][x] === 9) {                  // if it's a bomb, reveal all unrevealed bombs
        for (var i = 1; i <= gameSize; i++) {
            for (var j = 1; j <= gameSize; j++) {
                if (bombMap[i][j] === 9) {
                    if (playerMap[i][j] !== "🚩") {      // if bomb location isn't flagged, mark x
                        playerMap[i][j] = "💥";
                    }
                }
                else if (playerMap[i][j] === "🚩") {
                        playerMap[i][j] = "❌";
                    }
            }
        }
        display();
    }
    else if (solutionMap[y][x] === 0) {             // if it's zero, run this function on surrounding coordinates
        checkList.push([y, x]);
        expand(y, x);
    }
    else {                                      // if it's 1 - 8, update playerMap
        playerMap[y][x] = solutionMap[y][x];
        skipList.push([y, x]);
    };
    display();
    checkStatus();

}

function checkStatus() {
    while (checkList.length > 0) {
        var y = checkList[0][0];
        var x = checkList[0][1];
        skipList.push(checkList.shift());
        expand(y, x);
    }
}

function isNewTo(searchArray, searchItem) {     // checks whether array already exists within array
    for (i = 0; i < searchArray.length; i++) {
        if (String(searchArray[i]) == String(searchItem)) {
            return false;
        }
    }
    return true;
}


function expand(y, x) {
    for (var i = -1; i <= 1; i++) {         // check all 9 cells
        for (var j = -1; j <= 1; j++) {     //
            var yi = y + i;
            var xj = x + j;
            if (yi > 0 && yi < mapSize && xj > 0 && xj < mapSize) {         // check all 9 cells as long as it's within size
                if (playerMap[yi][xj] === " ") {         // if playerMap is unrevealed, reveal now
                    playerMap[yi][xj] = solutionMap[yi][xj];
                    if (playerMap[yi][xj] === 0) {         // if playerMap is unrevealed, reveal now
                        if (yi > 0 && yi < mapSize && xj > 0 && xj < mapSize && isNewTo(skipList, [yi, xj]) && isNewTo(checkList, [(yi), (xj)])) {
                            checkList.push([yi, xj]);
                        }
                    }
                }
            }
        }
    }
    display();
}

// 3. create the concealed mapping

function display() {
    var str = "";
    var flagCount = 0;
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (playerMap[y][x] === " ") {
                str += "<button class='field new' onclick='window.click(" + y + "," + x + ")' oncontextmenu='window.contextmenu(" + y + "," + x + ")'> </button>";
            }
            else if (playerMap[y][x] === "🚩") {
                str += "<button class='field emoji' oncontextmenu='window.contextmenu(" + y + "," + x + ")'>🚩</button>";
            }
            else if (playerMap[y][x] === 0) {
                str += "<button class='field' disabled=on> </button>";
            }
            else if (playerMap[y][x] === "💥") {
                str += "<button class='field emoji' disabled=on>💥</button>";
            }
            else if (playerMap[y][x] === "❌") {
                str += "<button class='field emoji' disabled=on>❌</button>";
            }
            else {
                str += "<button class='field' disabled=on>" + playerMap[y][x] + "</button>";
            }
        }
        str += "<br>"
    }
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (playerMap[y][x] == "🚩") {
                flagCount++;
            }
        }
    }
    $show.innerHTML = str + "Flags used: " + flagCount;
    if (gameEnd === false) {        // if last checkWin already determined game is over, skip this recursion
        checkWin();
    }
}
// 4. create UI commands

function checkWin() {
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (bombMap[y][x] === 9 && playerMap[y][x] != "🚩") {
                return false;
            }
        }
    }
    gameEnd = true;         // establishes game as finished, revents recursion    
    var wrongbomb = false;
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (bombMap[y][x] !== 9 && playerMap[y][x] === "🚩") {
                playerMap[y][x] = "❌";
                wrongbomb = true;
            }
        }
    }
    display();
    if (wrongbomb === true) {
        return false;
    }
    alert('You Win!');
}