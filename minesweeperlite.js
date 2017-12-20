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

// TEST ARRAY var test = [Array(3),Array(3),Array(3)]; for (var i = 0; i < 3; i++) {for (var j = 0; j < 3; j++){ test[i][j] = 1}} 


var $show = document.getElementById("show");

//     1.1 Create "map" based on set size

var gameSize = 10;
var mapSize = 12;           // 2 for refund space
var bombMap = [];
var solutionMap = [];           // declare solution as an array
var playerMap = [];         //  what is triggered 
var checkStatusMap = [];    //  0 = unexplored, 1 = needs to check, 2 = skip
var checkList = [];

for (var i = 0; i < mapSize; i++) {
    solutionMap.push(spamArray(mapSize, 0));
    bombMap.push(spamArray(mapSize, 0));    // add an array of n length, n times
    playerMap.push(spamArray(mapSize, " "));
    checkStatusMap.push(spamArray(mapSize, 0));
}
newGame(10);
display();

function spamArray(length, value) {        // Takes a number called "length", and outputs an array of that length with only zeroes
    var temp = Array(length);
    for (var i = 0; i < length; i++) {
        temp[i] = value;
    }
    return temp;
}

//     1.3 Assign random bombs to map based on set bomb count
function rand() {
    return Math.ceil(Math.random() * (gameSize));
}

function newGame(bombCount) {
    for (var y = 0; y <= gameSize; y++) {
        for (var x = 0; x <= gameSize; x++) {
            bombMap[y][x] = 0;
            solutionMap[y][x] = 0;
            playerMap[y][x] = " ";
            checkStatusMap[y][x] = 0;
        }
    }
    for (var i = 0; i < bombCount; i++) {
        bombMap[rand()][rand()] = 9;
    }
    checkList = [];
    updateSolution();
    display();
}


// 2. Assign neighboring clues 1 - 8 on solutinoMap
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
                solutionMap[y][x] = "x";
            }
        }
    }
}

window.click = click;
window.contextmenu = flag;

function flag(y, x) {
    if (playerMap[y][x] === "$") {
        playerMap[y][x] = " ";
    }
    else {
        playerMap[y][x] = "$";
    }
    display();
}

function click(y, x) {
    if (bombMap[y][x] === 9) {                  // if it's a bomb, reveal all
        for (var i = 1; i <= gameSize; i++) {
            for (var j = 1; j <= gameSize; j++) {
                if (bombMap[i][j] === 9) {
                    playerMap[i][j] = "x";
                }
            }
        }
    }
    else if (solutionMap[y][x] === 0) {             // if it's zero, run this function on surrounding coordinates
        checkList.push([y, x]);
        expand(y, x);
    }
    else {                                      // if it's 1 - 8, update playerMap
        playerMap[y][x] = solutionMap[y][x];
    };
    display();
    checkStatus();

}

function checkStatus() {
    while (checkList.length > 0) {
        var y = checkList[0][0];
        var x = checkList[0][1];
        checkList.shift();
        expand(y, x);
    }
}

function isIn(searchArray, searchItem) {
    for (i = 0; i < searchArray.length; i++) {
        if (String(searchArray[i]) == String(searchItem)) {
            return true;
        }
    }
    return false;
}


function expand(y, x) {
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var yi = y + i;
            var xj = x + j;
            if (playerMap[yi][xj] === " ") {         // if playerMap is unrevealed, reveal now
                playerMap[yi][xj] = solutionMap[yi][xj];
                if (playerMap[yi][xj] === 0) {         // if playerMap is unrevealed, reveal now
                    if (isIn(checkList, [yi, xj]) === false) {
                        checkList.push([(yi), (xj)]);
                    }
                    else {
                    }
                }
            }
            else if (playerMap[yi][xj] === 0) {         // if playerMap is unrevealed, reveal now
                if (i !== 0 && j !== 0) {
                    checkList.push([(yi), (xj)]);
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
                str += "<button onclick='window.click(" + y + "," + x + ")' oncontextmenu='window.contextmenu(" + y + "," + x + ")'>  </button>";
            }
            else if (playerMap[y][x] === "$") {
                str += "<button onclick='window.click(" + y + "," + x + ")' oncontextmenu='window.contextmenu(" + y + "," + x + ")'>$</button>";
            }
            else {
                str += "<button>" + playerMap[y][x] + "</button>";
            }
        }
        str += "\n"
    }
    for (var y = 1; y < gameSize; y++) {
        for (var x = 1; x < gameSize; x++) {
            if (playerMap[y][x] == "$") {
                flagCount++;
            }
        }
    }
    $show.innerHTML = str + "Flags used: " + flagCount;
}
// 4. create UI commands