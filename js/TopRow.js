import UiElements from './UiElements.js';

export default function TopRow(el) {
    function init(currentPlayer) {
        setPlaceholderGamePieces(currentPlayer);
        enable();
    }
    function enable() {
        const tds = getTds();
        for(let td of tds) {
            td.classList.remove('disabled');
        }
        setActive(true);
    }
    function disable() {
        clearPlaceHolders();
        setActive(false);
    }
    function disableColumn(col) {
        const td = document.querySelector(`thead tr td[data-col="${col}"]`);
        td.classList.add('disabled');
    }
    function bindClick(fn) {
        const tds = getTds();
        for(let td of tds) {
            td.addEventListener('click', fn);
        }
    }
    function unbindClick(fn) {
        const tds = getTds();
        for(let td of tds) {
            td.removeEventListener('click', fn);
        }
    }
    function unbindColumnClick(col, fn) {
        const td = document.querySelector(`thead tr td[data-col="${col}"]`);
        td.removeEventListener('click', fn);
    }
    function getTds() {
        return document.querySelectorAll(`#${el.id} td`);
    }
    function getPlaceholders() {
        return document.querySelectorAll(`#${el.id} td .piece`);
    }
    function clearPlaceHolders() {
        const pieces = getPlaceholders();
        const gamePieces = getPlaceholders();
        for(let gamePiece of gamePieces) {
            gamePiece.remove();
        }
    }
    function setPlayer(player) {
        const addClass = player === 1 ? 'player-1' : 'player-2';
        const removeClass = player === 1 ? 'player-2' : 'player-1'; 
        const gamePieces = getPlaceholders();
        for(let gamePiece of gamePieces) {
            gamePiece.classList.add(addClass);
            gamePiece.classList.remove(removeClass);
        }
    }
    function unsetPlayer() {
        for(let gamePiece of gamePieces) {
            gamePiece.classList.add(addClass);
            gamePiece.classList.remove(removeClass);
        }
    }
    function setPlaceholderGamePieces(player) {
        const tds = getTds();
        for(let td of tds) {
            const gamePiece = UiElements.gamePiece(player);
            td.append(gamePiece);
        }
    }
    function setActive(bool) {
        if(Boolean(bool)) {
            el.classList.add('active');
        }
        else el.classList.remove('active')
    }

    return {
        init,
        getTds,
        disable,
        disableColumn,
        unbindColumnClick,
        bindClick,
        unbindClick,
        setPlayer,
        unsetPlayer,
    }

}