import GameBoard from './GameBoard.js';
import UiElements from './UiElements.js';
import TopRow from './TopRow.js';
import TurnIndicator from './TurnIndicator.js';

class ConnectFourGame {
    constructor(id) {
        this.element = document.getElementById(id);
        this.width = 7;
        this.height = 6;
        this.init();
    }
    
    init() {
        this.renderUiElements();
        this.setUiElements();

        this.gameBoard = GameBoard(this.UiElements.gameBoard);
        this.topRow = TopRow(this.UiElements.topRow);
        this.turnIndicator = TurnIndicator(this.UiElements.turnIndicators[1], this.UiElements.turnIndicators[2]);

        this.renderStartButton();
        this.initFunctions();
    }
    
    initFunctions() {
        const {startGameBtn} = this.UiElements;
        startGameBtn.addEventListener('click', this.handleStartNewGame.bind(this));
    }
    
    handleStartNewGame() {
        const {startGameBtn} = this.UiElements;
        startGameBtn.disabled = true;
        startGameBtn.style.display = 'none';
        this.startNewGame();
    }

    handleRestartGame() {
        const {resetGameBtn} = this.UiElements;
        this.UiElements.endGameScreen.remove();
        this.startNewGame();
    }

    startNewGame() {
        const startingPlayer = Math.round(Math.random(1, 2) + 1);
        this.gameBoard.clearGamePieces();
        this.gameBoard.setActive(true);
        this.gameBoard = this.gameBoard.setMatrix(this.gameBoard, this.width, this.height);
        this.topRow.init(startingPlayer);

        this.setCurrentPlayer(startingPlayer);
        this.handleClickOnTopRowTd = this.handleClickOnTopRowTd.bind(this);
        this.topRow.bindClick(this.handleClickOnTopRowTd);

    }
    
    handleClickOnTopRowTd(e) {
        const col = e.currentTarget.dataset.col;
        const row = this.gameBoard.rowToAddPiece(col, this.gameBoard.matrix);
        if(!row && row != 0 ) return false;
        else if(row === 0) { 
            this.topRow.disableColumn(col);
            this.topRow.unbindColumnClick(col, this.handleClickOnTopRowTd);
        }
        this.gameBoard.matrix[row][col] = this.currentPlayer;
        this.gameBoard.addPiece(row,col, UiElements.gamePiece(this.currentPlayer));
        if(this.gameBoard.checkForWinner(this.gameBoard.matrix, this.currentPlayer)) this.handleIsWinner(this.currentPlayer);
        else if(this.gameBoard.checkForTie(this.gameBoard.matrix)) this.handleIsTie() ;  
        else this.changePlayerTurn();
    }

    setCurrentPlayer(player) {
        this.currentPlayer = player;
        this.turnIndicator.setActive(player);
        this.topRow.setPlayer(player);
    }

    changePlayerTurn() {
        if(this.currentPlayer === 1) this.setCurrentPlayer(2)
        else this.setCurrentPlayer(1);
    }


    handleIsWinner(winningPlayer) {
        const endGameMessage = `Player #${winningPlayer} Wins!`;
        this.renderEndGameScreen(endGameMessage);
        this.disableGame();
    }

    handleIsTie() {
        const endGameMessage = "It's a Tie";
        this.renderEndGameScreen(appendGameScreen);
        this.disableGame();
    }

    disableGame() {
        this.gameBoard.setActive(false);
        this.topRow.disable();
        this.topRow.unbindClick(this.handleClickOnTopRowTd);
    }

    renderEndGameScreen(message) {
        const resetGameBtn = UiElements.createButton('reset-game-btn', 'Play Again!', this.handleRestartGame.bind(this))
        console.log(resetGameBtn)
        const endGameScreen = UiElements.endGameScreen(message, resetGameBtn);
        this.UiElements.boardContainer.append(endGameScreen);
        this.UiElements.endGameScreen = endGameScreen;
    }

    renderStartButton() {
        const startGameBtn = UiElements.startGameBtn()
        this.UiElements.boardContainer.append(startGameBtn);
        this.UiElements.startGameBtn = startGameBtn;
    }
    
    renderGameBoard() {
        this.element.append(UiElements.gameBoard(this.width, this.height));
    }
        
    renderTurnIndicators() {
        const turnIndicatorPlayer1 = UiElements.turnIndicator(1);
        const turnIndicatorPlayer2 = UiElements.turnIndicator(2);
        this.element.prepend(turnIndicatorPlayer1);
        this.element.append(turnIndicatorPlayer2);
    }

    renderUiElements() {
        this.renderGameBoard();
        this.renderTurnIndicators();
    }
    
    setUiElements() {
        this.UiElements = {
            boardContainer: document.getElementById('game-board-container'),
            gameBoard: document.getElementById('game-board'),
            topRow: document.getElementById('top-row'),
            turnIndicators: {
                1: document.getElementById('turn-indicator-player-1'),
                2: document.getElementById('turn-indicator-player-2')
            }
        }
    }
}

new ConnectFourGame('game');