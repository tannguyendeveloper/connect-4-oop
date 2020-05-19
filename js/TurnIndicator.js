export default function TurnIndicator(indicator1, indicator2) {
    function setActive(player) {
        if(player === 1) {
            indicator1.classList.add('active');
            indicator2.classList.remove('active');
        } else {
            indicator2.classList.add('active');
            indicator1.classList.remove('active');
        }
    }
    return {
        setActive
    }
}