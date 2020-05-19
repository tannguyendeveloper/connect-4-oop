import UiElements from './UiElements.js';

export default function GameBoard(gameBoard) {
    function setActive(bool) {
        if (bool) gameBoard.classList.add('active')
        else gameBoard.classList.remove('active')
    }

    function setMatrix(state, width, height) {
        let matrix = [];
        // iterate to get the number of rows
        for (let i = 0; i < height; i++) {
            const row = [];
            // iterate the width to get the number of columns
            for (let col = 0; col < width; col++) {
                let col = 0;
                row.push(col);
            }
            matrix.push(row);
        }

        return {...state, matrix};
    }

    function addPiece(row, col, gamePiece) {
        const placement = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
        placement.append(gamePiece);
    }

    function clearGamePieces() {
        const gamePieces = document.querySelectorAll(`td .piece`)
        for(let gamePiece of gamePieces) gamePiece.remove();
    }

    function rowToAddPiece(col, matrix) {
        const piecesInColumn = matrix.reduce((acc, nextRow) => {
            // count the rows with a piece at column x
            return nextRow[col] ? ++acc : acc;
        }, 0);

        // If the number of pieces in the column is less than the height  
        if (piecesInColumn < matrix.length) {
            // row to add piece = height - 1 to account for 0 index;
            let rowToAddPiece = matrix.length - piecesInColumn - 1;
            return rowToAddPiece;
        } else {
            return false;
        }
    }

    function getHorizontalCells(row, col) {
        return [
            [row, col],
            [row, col + 1],
            [row, col + 2],
            [row, col + 3]
        ]
    }

    function getVerticalCells(row, col) {
        return [
            [row, col],
            [row - 1, col],
            [row - 2, col],
            [row - 3, col]
        ]
    }

    function getDiagonalUpdwardCells(row, col) {
        return [
            [row, col],
            [row - 1, col + 1],
            [row - 2, col + 2],
            [row - 3, col + 3]
        ]
    }

    function getDiagonalDownwardCells(row, col) {
        return [
            [row, col],
            [row + 1, col + 1],
            [row + 2, col + 2],
            [row + 3, col + 3]
        ];
    }

    function checkForWinner(matrix, player) {
        function isConnectFour(cells) {
            return cells.every((cell) => {
                let row = cell[0];
                let col = cell[1];
                return Boolean(matrix[row] && matrix[row][col] === player);
            })
        }
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === player) {
                    const horizontalCells = getHorizontalCells(row, col);
                    const verticalCells = getVerticalCells(row, col);
                    const diagonalUpCells = getDiagonalUpdwardCells(row, col);
                    const diagonalDownCells = getDiagonalDownwardCells(row, col);
                    if (isConnectFour(horizontalCells) || isConnectFour(verticalCells) || isConnectFour(diagonalUpCells) || isConnectFour(diagonalDownCells)) {
                        return true;
                    }
                }
            }
        }
    }

    function checkForTie(matrix) {
        return matrix.every(row => {
            return Boolean(matrix[row])
        })
    }
    return {
        setActive,
        setMatrix,
        addPiece,
        rowToAddPiece,
        clearGamePieces,
        checkForTie,
        checkForWinner,
    }
}