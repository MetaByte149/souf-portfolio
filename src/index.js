import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  const className = props.isNewestMove ? "square bold" : "square";
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isNewestMove={this.props.lastMoveIndex === i}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      winner: null,
      stepNumber: 0,
      playedMoves: [],
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    let status;
    if (this.state.winner) {
      status = "Winner: " + this.state.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      if (move === history.length - 1) return;
      const desc = move !== 0 ? `Go to move #${move}` : "Go to game start.";
      const playedMoveIndex = this.state.playedMoves[move];
      const col = playedMoveIndex % 3;
      const row = Math.floor(playedMoveIndex / 3);
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {" "}
            {`${desc} \t played move: (${col}, ${row})`}{" "}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(index) => this.handleClick(index)}
            lastMoveIndex={
              this.state.playedMoves[this.state.playedMoves.length - 1]
            }
          />
        </div>
        <div className="game-info">
          <div>{this.state.stepNumber + 1}</div>

          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.winner || squares[i]) return;

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      winner: calculateWinner(squares),
      stepNumber: history.length,
      playedMoves: this.state.playedMoves.concat([i]),
    });
  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.slice(0, step + 1),
      stepNumber: step,
      xIsNext: step % 2 === 0,
      winner: null,
    });
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
