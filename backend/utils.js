const _ = require('lodash');
function getWinner(boxes) {
    const winningRows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
  
    let winner = null;
    _.find(winningRows, row => {
        const [i, ii, iii] = row;
        if (boxes[i] && boxes[ii] && boxes[i] === boxes[ii] && boxes[ii]=== boxes[iii]) {
            winner = boxes[i];
            return true;
        }
        return false;
    });
  
    return winner;
}
module.exports = {
    getWinner,
}