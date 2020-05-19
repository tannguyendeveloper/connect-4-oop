export default class UiElements {
    static createButton(id, text, fn) {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.addEventListener('click', function() {
          if(fn && typeof fn === "function") { 
            fn();
          };
        })
        return button;
    }

    static gameBoard(width, height) {
        const gameBoardContainer = document.createElement('div');
        gameBoardContainer.id = 'game-board-container'
        gameBoardContainer.classList.add('board-container');
        
        const boardTable = document.createElement('table');
        boardTable.id = 'game-board';
        boardTable.classList.add('game-board');
      
        const boardTableHead = UiElements.boardTableHead(width);    
        const boardTableBody = UiElements.boardTableBody(width,height); 
    
        // add the table head and table body tot he table
        boardTable.append(boardTableHead, boardTableBody);
        
        // add the table to the container
        gameBoardContainer.append(boardTable);
        return gameBoardContainer;
    }

    static boardTableHead(width) {
        const boardTableHead = document.createElement('thead')
      
        const boardTableHeadRow = document.createElement('tr');
        boardTableHeadRow.id = 'top-row';
        boardTableHeadRow.classList.add('top-row');
    
        // Populate the thead row with cells
        for(let i = 0; i < width; i++) {
          const td = document.createElement('td');
          td.classList.add(`col-${i}`);
          td.dataset.col = i;
          boardTableHeadRow.append(td);
        }
        boardTableHead.append(boardTableHeadRow);
        return boardTableHead;
    }

    static boardTableBody(width, height) {
        const boardTableBody = document.createElement('tbody');
        // Generate table rows and cells 
        for (var y = 0; y < height; y++) {
          const row = document.createElement("tr");
          for (var x = 0; x < width; x++) {
            const cell = document.createElement("td");
            cell.dataset.row = y;
            cell.dataset.col = x;
            row.append(cell);
          }
          boardTableBody.append(row);
        }

        return boardTableBody;
    }

    static startGameBtn(fn) {
        const id = 'start-game-btn';
        const text = 'Start a New Game!';
        return UiElements.createButton(id, text, fn);
    }

    static gamePiece(player, label) {
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

    static turnIndicator(player) {
    
        const turnIndicator = document.createElement('div');
        turnIndicator.id = `turn-indicator-player-${player}`
        turnIndicator.classList.add('turn-indicator', `player${player}`);
        
        const playerTitle = document.createElement('h2');
        playerTitle.classList.add('player-title');
        playerTitle.innerText = 'Player';
        
        const gamePieceLabel = `<h2>${player}</h2>`;
        const gamePiece = UiElements.gamePiece(player, gamePieceLabel);
    
        turnIndicator.append(playerTitle, gamePiece);
        return turnIndicator;
    
    }

    static endGameScreen(message, btn) {
      const endGameScreen = document.createElement('div');
      endGameScreen.classList.add('message-container');
  
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message');
      messageContainer.innerHTML = `<h2>${message}</h2>`;

      endGameScreen.append(messageContainer, btn);
      return endGameScreen
    }

}