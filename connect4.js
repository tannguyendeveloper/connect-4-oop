/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
var count = 0;
class ConnectFourGame {

  constructor(id) {

    if (document.querySelector(`#${id}`)) {
      this.id = id;
      this.gameContainer = document.querySelector(`#${id}`);

    } else {
      throw new Error('Id does not exist');
    }

    this.width = 7;
    this.height = 6;
    this.board = [];
    this.gamePiecesPlaced = 0;
    this.totalGamePieces = this.width * this.height;

    this.init();
  }


  /**
   * Initializes the game;
   */
  init() {
    this.initGameBoard();
    this.initGameUI();
    this.renderStartBtn();
  }

  /**
   * Set up the ui components of the game
   */
  initGameUI() {
    // Player 1 Turn Indicator
    const player1TurnIndicator = this.turnIndicator(1);
    // Player 2 Turn Indicator
    const player2TurnIndicator = this.turnIndicator(2);

    const gameBoard = this.gameBoard();
    this.gameBoardContainer = gameBoard;

    this.gameContainer.append(player1TurnIndicator, gameBoard, player2TurnIndicator);
  }

  /**
   * Sets up the game board as a matrix of arrays by the width and height
   */
  initGameBoard() {
    this.board = [];
    // iterate to get the number of rows
    for (let i = 0; i < this.height; i++) {
      const row = [];
      // iterate the width to get the number of columns
      for (let col = 0; col < this.width; col++) {
        let col = 0;
        row.push(col);
      }
      this.board.push(row);
    }
  }

    /**
   * Generates the HTML for the game board
   */
  gameBoard() {

    
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    
    const boardTable = document.createElement('table');
    boardTable.classList.add('game-board');
  
    const boardTableHead = document.createElement('thead')
  
    const boardTableHeadRow = document.createElement('tr');
    boardTableHeadRow.classList.add('top-row');

    // Populate the thead row with cells
    for(let i = 0; i < this.width; i++) {
      const td = document.createElement('td');
      td.classList.add(`col-${i}`);
      td.dataset.col = i;
      boardTableHeadRow.append(td);
    }

    // add the row to teh table head
    boardTableHead.append(boardTableHeadRow);

    const boardTableBody = document.createElement('tbody');
    // Generate table rows and cells 
    for (var y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (var x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.dataset.row = y;
        cell.dataset.col = x;
        row.append(cell);
      }
      boardTableBody.append(row);
    }

    // add the table head and table body tot he table
    boardTable.append(boardTableHead, boardTableBody);
    
    // add the table to the container
    boardContainer.append(boardTable);
    return boardContainer;

  }

  /**
   * Clears the game board of pieces and sets the board matrix  to an empty array
   */
  clearGameBoard() {
    // remove the game pieces
    const gameBoardTds = document.querySelectorAll(`#${this.id} table.game-board tr td`);
    for(let td of gameBoardTds) {
      td.innerHTML = '';
    }

    // clear the disabled class of the top row
    const topRowTds = document.querySelectorAll(`#${this.id} table.game-board tr td`);
    for(let td of topRowTds) {
      td.classList.remove('disabled');
    }

    this.gamePiecesPlaced = 0;
    this.board = [];
  }

  turnIndicator(player) {
    
    const turnIndicator = document.createElement('div');
    turnIndicator.classList.add('turn-indicator', `player${player}`);
    
    const playerTitle = document.createElement('h2');
    playerTitle.classList.add('player-title');
    playerTitle.innerText = 'Player';
    
    const gamePieceLabel = `<h2>${player}</h2>`;
    const gamePiece = this.gamePiece(player, gamePieceLabel);

    turnIndicator.append(playerTitle, gamePiece);
    return turnIndicator;

  }

  /**
   * returns the styled game pice
   * 
   */
  gamePiece(player, label) {
    const gamePiece = document.createElement('div');
    gamePiece.classList.add('piece', `player-${player}`);

    // div that creates the styling for the beveled look on the game piece
    const bevel = document.createElement('div');
    bevel.classList.add('bevel');

    // Add the label if its provided
    if(!!label) {
      bevel.innerHTML = label;
    }

    gamePiece.append(bevel);
    return gamePiece;
  }


  /**
   * Renders the start game button to the game board container.
   */
  renderStartBtn() {
    const _this = this;
    const startGameBtn = document.createElement('button');
    startGameBtn.id = 'start-game-btn';
    startGameBtn.innerText = 'Start a New Game';
    startGameBtn.addEventListener('click', function() {
      _this.startGame();
    })
    this.startBtn = startGameBtn;
    this.gameBoardContainer.append(startGameBtn);
  }

  /**
   * Remove the start button from the dom & unset it from the game instance
   */
  removeStartBtn() {
    this.startBtn.remove();
    delete this.startGameBtn;
  }

  /**
   * Starts a new game
   */
  startGame() {
    // Remove the start game button
    this.removeStartBtn();

    // Select between player 1 and player 2 randomly
    const startingPlayer = Math.round(Math.random(1, 2) + 1);
    this.setCurrentPlayer(startingPlayer);

    this.initGame();
  }

  /**
   * Initialize the game
   * 
   */
  initGame() {
    const _this = this;

    // add the active class to the gameboard
    const gameBoard = document.querySelector(`#${this.id} .board-container .game-board`);
    gameBoard.classList.add('active');

    // Add event listener to the top row to handle clicks
    const topRow = document.querySelector(`#${this.id} .board-container .game-board thead tr.top-row`);
    
    _this.handleClickEvent = this.handleClick.bind(this);
    topRow.addEventListener('click', _this.handleClickEvent);

    // populate the top row of the game board cells with the current player's game pieces
    const topRowCells = document.querySelectorAll(`#${this.id} .board-container .game-board thead tr td`);
    for(let td of topRowCells) {
      const gamePiece = this.gamePiece(this.currentPlayer);
      td.append(gamePiece);
    }
  }

  /**
   * Disable the game after a win or tie
   */
  disableGame() {
    const _this = this;

    // remove teh active class of the game board
    const gameBoard = document.querySelector(`#${this.id} .board-container .game-board`);
    gameBoard.classList.remove('active');

    // remove the event listener from the top row to prevent the game from continuing
    const topRow = document.querySelector(`#${this.id} .board-container .game-board thead tr.top-row`);
    topRow.removeEventListener('click', _this.handleClickEvent);

    // empty the top row cells of the game pieces
    const topRowCells = document.querySelectorAll(`#${this.id} .board-container .game-board thead tr td`);
    for(let td of topRowCells) {
      td.innerHTML = '';
    }

    // remove the active turn indicator
    const aciveTurnIndicator = document.querySelector(`#${this.id} .turn-indicator.active`);
    aciveTurnIndicator.classList.remove('active');
    
  }

  /**
   * 
   */
  resetGame() {
    this.clearGameBoard();
    this.initGameBoard();
    this.removeMessages();
    this.startGame();
  }

  /**
   * Click handler for when the top row of the game board is clicked
   * @param {*} e 
   */
  handleClick(e) {
    // get the col
    // the target could be either the bevel, the or the game piece
    // which is why we have to traversee the target to find the element with the data-col
    const col = e.target.dataset && e.target.dataset.col ? e.target.dataset.col :
              e.target.parentElement && e.target.parentElement.dataset.col ? e.target.parentElement.dataset.col :
              e.target.parentElement.parentElement && e.target.parentElement.parentElement.dataset.col;

    const row = this.returnRowToPlacePiece(col);

    // if the row returned is false, we prevent the execution of the rest of the function
    if (row === false) {
      return;
    } // if row = 0, that means that the column is full
    else if (row === 0) {
      this.disableColumn(col);
    }
    // Set the game board matrix to the current player
    this.board[row][col] = this.currentPlayer;
    this.board[row][col];
    this.placeGamePieceOnBoard(row, col);
    this.gamePiecesPlaced++;
    if(this.checkForWinner()) {
      this.disableGame();
      this.renderWinnerMessage();
      return
    } else if (Boolean(this.checkForTie())) {
      this.disableGame();
      this.renderTieMessage();
      return
    }

    if(this.currentPlayer === 1) {
      this.setCurrentPlayer(2);
    } else {
      this.setCurrentPlayer(1);
    }

  }

  /**
   * Place the game piece on the game board
   * @param {*} row 
   * @param {*} col 
   */
  placeGamePieceOnBoard(row, col) {
    if (col !== false) {
      const gamePiece = this.gamePiece(this.currentPlayer);
      const placement = document.querySelector(`#${this.id} .board-container td[data-row="${row}"][data-col="${col}"]`);
      gamePiece.classList.add('translate');
      placement.append(gamePiece);
      let animate = setTimeout(() => {
        gamePiece.classList.add('origin');
        clearTimeout(animate);
      }, 1)
    }
  }

  /**
   * Check for the winner by going through the board matrix and checking for placed game pieces
   */
  checkForWinner() {
    const _this = this;
    function _win(cells) {
      return cells.every((cell) => {
        let row = cell[0];
        let col = cell[1];
        return Boolean(_this.board[row] && _this.board[row][col] === _this.currentPlayer);
      })
    }

    // iterate through the number of rows based on the width and height
    // subtracting 1 to take into account 0 index
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        // if there is a piece on the board
        if (this.board[row][col]) {
          // make an array of four horizontal coordinates
          let horiz = [
            [row, col],
            [row, col + 1],
            [row, col + 2],
            [row, col + 3]
          ];
          // make an array of four vertical coordinates
          let vert = [
            [row, col],
            [row - 1, col],
            [row - 2, col],
            [row - 3, col]
          ];
          // make an array of four diagonal coordinates with upward trajectory
          // the lower the row number, the higher we are vertically
          let diagDR = [
            [row, col],
            [row - 1, col + 1],
            [row - 2, col + 2],
            [row - 3, col + 3]
          ];
          // make an array of four diagonal coordinates with downward trajectory
          // the lower the row number, the higher we are vertically
          let diagDL = [
            [row, col],
            [row + 1, col + 1],
            [row + 2, col + 2],
            [row + 3, col + 3]
          ];
          // if any of the sets of cordinates are a winner
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
  }

  checkForTie() {
    return this.gamePiecesPlaced === this.totalGamePieces;
  }

  renderWinnerMessage() {
    const _this = this;
    const boardContainer = document.querySelector(`#${this.id} .board-container`);
    const winnerScreen = document.createElement('div');
    winnerScreen.classList.add('winner-message-container', 'message-container');

    const winnerMessage = document.createElement('div');
    winnerMessage.classList.add('winner-message', 'message');
    winnerMessage.innerHTML = `<h2>Winner Message #${this.currentPlayer}</h2>`;

    const playAgainBtn = document.createElement('button');
    playAgainBtn.classList.add('reset-game-btn');
    playAgainBtn.innerText = 'Play Again!';
    playAgainBtn.addEventListener('click', function() {
      _this.resetGame();
    });

    winnerScreen.append(winnerMessage, playAgainBtn);
    boardContainer.append(winnerScreen);
  }

  renderTieMessage() {
    const _this = this;
    const boardContainer = document.querySelector(`#${this.id} .board-container`);
    const tieScreen = document.createElement('div');
    tieScreen.classList.add('tie-message-container', 'message-container');

    const tieMessage = document.createElement('div');
    tieMessage.classList.add('tie-message', 'message');
    tieMessage.innerHTML = `<h2>It's a Tie!</h2>`;

    const playAgainBtn = document.createElement('button');
    playAgainBtn.classList.add('reset-game-btn');
    playAgainBtn.innerText = 'Play Again!';
    playAgainBtn.addEventListener('click', function() {
      _this.resetGame();
    });

    tieScreen.append(tieMessage, playAgainBtn);
    boardContainer.append(tieScreen);
  }

  removeMessages() {
    const winnerScreen = document.querySelector(`#${this.id} .message-container`);
    winnerScreen.remove();
  }


  /**
   * Disable the column
   * @param {*} col = column of the board to disable
   */
  disableColumn(col) {
    const columnToDisable = document.querySelector(`#${this.id} .game-board tr td[data-col="${col}"]`);
    columnToDisable.classList.add('disabled');
  }

  /**
   * Find row to place game piece into board
   * @param col = the column to count 
   */
  returnRowToPlacePiece(col) {
  // iterate through all of the rows
    const piecesInColumn = this.board.reduce((acc, nextRow) => {
      // count the rows with a piece at column x
      return nextRow[col] ? ++acc : acc;
    }, 0);

    // If the number of pieces in the column is less than the height  
    if (piecesInColumn < this.height) {
      // row to add piece = height - 1 to account for 0 index;
      let rowToAddPiece = this.height - piecesInColumn - 1;
      return rowToAddPiece;
    } else {
      return false;
    }
  }

  /**
   * Set the current player
   */
  setCurrentPlayer(player) {
    this.currentPlayer = player;
    const topRowGamePieces = document.querySelectorAll(`#${this.id } thead tr td .piece`);
    // Change the player indicator to reflect who's turn it is
    if (this.currentPlayer === 1) {
      document.querySelector(`#${this.id} .turn-indicator.player2`).classList.remove('active');
      document.querySelector(`#${this.id} .turn-indicator.player1`).classList.add('active');
      for(let gamePiece of topRowGamePieces) {
        gamePiece.classList.remove('player-2');
        gamePiece.classList.add('player-1');
      }
    } else {
      document.querySelector(`#${this.id} .turn-indicator.player1`).classList.remove('active');
      document.querySelector(`#${this.id} .turn-indicator.player2`).classList.add('active');
      for(let gamePiece of topRowGamePieces) {
        gamePiece.classList.remove('player-1');
        gamePiece.classList.add('player-2');
      }
    }
  }

}

new ConnectFourGame(id = 'game');