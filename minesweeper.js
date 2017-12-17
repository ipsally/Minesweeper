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
var playerMap = [];
var skipQueue = [];

for (var i = 0; i < mapSize; i++) {
    solutionMap.push(spamArray(mapSize, 0));
    bombMap.push(spamArray(mapSize, 0));    // add an array of n length, n times
    playerMap.push(spamArray(mapSize, " "));
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
        }
    }
    for (var i = 0; i < bombCount; i++) {
        bombMap[rand()][rand()] = 9;
    }
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
function click(y, x) {
    if (bombMap[y][x] === 9) {
        for (var y = 1; y <= gameSize; y++) {
            for (var x = 1; x <= gameSize; x++) {
                playerMap[y][x] = "X";
            }
        }
    }
    else {
        playerMap[y][x] = solutionMap[y][x]
    };
    display();
}


// 3. create the concealed mapping

function display() {
    var str = "";
    for (var y = 1; y <= gameSize; y++) {
        for (var x = 1; x <= gameSize; x++) {
            if (playerMap[y][x]===" "){
                str += "<button onclick='window.click(" + y + "," + x + ")'>  </button>";                
            }
            else {
                str += "<button>" + playerMap[y][x] + "</button>";                
            }
        }
        str += "\n"
    }
    $show.innerHTML = str;
}
// 4. create UI commands