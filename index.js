const { GameStep } = require('tic-tac-toe-minimax').default;

// Returns true if the request body is valid, false otherwise
const validEvent = event => {
  if (!event || !event.board || !event.player || !event.difficulty) return false;
  
  // Validate board
  if (!Array.isArray(event.board) || event.board.length !== 9 || 
    event.board.some(p => !String(p).match(/^[0-8XO]$/))
  ) return false;

  // Validate player
  if (event.player !== 'X' && event.player !== 'O') return false;

  // Validate difficulty
  switch (event.difficulty) {
    case 'Easy': case 'Normal': case 'Hard':
      break;
    default:
      return false;
  }

  return true;
}

exports.handler = function (event, context, callback) {
  if (!validEvent(event)) {
    callback(Error("Invalid body"), 400);
    return;
  }

  const { board, player, difficulty } = event;

  const symbols = {
    huPlayer: player,
    aiPlayer: player === 'X' ? 'O' : 'X'
  }  

  const nextBoard = GameStep(board, symbols, difficulty);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ nextBoard })
  });
};
