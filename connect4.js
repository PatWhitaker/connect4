/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let board = makeBoard();
makeHtmlBoard();
makeRestartButton();
let currPlayer = 1; // active player: 1 or 2 // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    const arr = [];
    let row = 0;
    while (row < HEIGHT) {
        let currRow = [];
        let column = 0;
        while (column < WIDTH) {
            currRow.push(null);
            column++;
        }
        arr.push(currRow);
        row++;
    }
    return arr;
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");

    // Make top table row where player places pieces
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    // Make each cell within the top table row
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    // Make the actual board where the pieces will be stored
    for (let y = 0; y < HEIGHT; y++) {
        // Create empty rows equal to the height
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            // Add a cell to each row equal to the width
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        // Add each row to the board
        htmlBoard.append(row);
    }
}

function restartGame() {
    document.getElementById("board").innerHTML = "";
    board = makeBoard();
    makeHtmlBoard();
}

function makeRestartButton() {
    const game = document.getElementById("game");

    const button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("id", "btn");
    button.setAttribute("value", "Restart Game");
    button.addEventListener("click", restartGame);

    game.append(button);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    let y = HEIGHT - 1;
    while (y >= 0) {
        if (!board[y][x]) {
            return y;
        }
        y--;
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    const cell = document.getElementById(`${y}-${x}`);
    const piece = document.createElement("div");
    piece.setAttribute("class", `piece p${currPlayer}`);
    cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
    setTimeout(function () {
        window.alert(msg);
    }, 100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    if (board.every((row) => row.every((cell) => cell))) {
        return endGame("All cells are filled. Game is a tie.");
    }

    // switch players
    currPlayer = currPlayer == 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < HEIGHT &&
                x >= 0 &&
                x < WIDTH &&
                board[y][x] === currPlayer
        );
    }

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const horiz = [
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3],
            ];
            const vert = [
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x],
            ];
            const diagDR = [
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3],
            ];
            const diagDL = [
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3],
            ];

            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}
