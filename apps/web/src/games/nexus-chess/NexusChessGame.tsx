import React, { useState } from 'react';
import { soundFx } from '../../components/AudioSynthesizer';
import { Award, RotateCcw, Swords, Trophy } from 'lucide-react';

type Piece = string | null;

const initialBoard: Piece[][] = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

export const NexusChessGame: React.FC<{ onGameOver?: (score: number) => void }> = ({ onGameOver }) => {
  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selectedPos, setSelectedPos] = useState<{ r: number; c: number } | null>(null);
  const [turn, setTurn] = useState<'WHITE' | 'BLACK'>('WHITE');
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const isWhitePiece = (p: string) => ['♙', '♖', '♘', '♗', '♕', '♔'].includes(p);
  const isBlackPiece = (p: string) => ['♟', '♜', '♞', '♝', '♛', '♚'].includes(p);

  const handleSquareClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selectedPos) {
      if (selectedPos.r === r && selectedPos.c === c) {
        setSelectedPos(null);
        return;
      }

      const sourcePiece = board[selectedPos.r][selectedPos.c];
      if (!sourcePiece) return;

      // Make Move
      const newBoard = board.map((row) => [...row]);
      const targetPiece = newBoard[r][c];

      if (targetPiece) {
        soundFx.playExplosion();
        if (isWhitePiece(targetPiece)) {
          setCapturedWhite((prev) => [...prev, targetPiece]);
        } else {
          setCapturedBlack((prev) => [...prev, targetPiece]);
        }
      } else {
        soundFx.playClick();
      }

      newBoard[r][c] = sourcePiece;
      newBoard[selectedPos.r][selectedPos.c] = null;

      setBoard(newBoard);
      setSelectedPos(null);
      setTurn((t) => (t === 'WHITE' ? 'BLACK' : 'WHITE'));
      setMoveCount((m) => m + 1);

      // Trigger bot response if Black's turn
      setTimeout(() => {
        makeBotMove(newBoard);
      }, 500);
      return;
    }

    if (piece) {
      const isPlayerTurn = (turn === 'WHITE' && isWhitePiece(piece)) || (turn === 'BLACK' && isBlackPiece(piece));
      if (isPlayerTurn) {
        soundFx.playClick();
        setSelectedPos({ r, c });
      }
    }
  };

  const makeBotMove = (currentBoard: Piece[][]) => {
    // Find all valid black pieces
    const blackPieces: Array<{ r: number; c: number; piece: string }> = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && isBlackPiece(p)) {
          blackPieces.push({ r, c, piece: p });
        }
      }
    }

    if (blackPieces.length === 0) return;

    // Pick random piece & move one step forward if possible
    const rand = blackPieces[Math.floor(Math.random() * blackPieces.length)];
    const targetRow = Math.min(7, rand.r + 1);
    const targetCol = rand.c;

    const newBoard = currentBoard.map((row) => [...row]);
    const targetPiece = newBoard[targetRow][targetCol];

    if (targetPiece && isWhitePiece(targetPiece)) {
      setCapturedWhite((prev) => [...prev, targetPiece]);
      soundFx.playExplosion();
    } else {
      soundFx.playClick();
    }

    newBoard[targetRow][targetCol] = rand.piece;
    newBoard[rand.r][rand.c] = null;

    setBoard(newBoard);
    setTurn('WHITE');
    setMoveCount((m) => m + 1);
  };

  const restartBoard = () => {
    setBoard(initialBoard);
    setSelectedPos(null);
    setTurn('WHITE');
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveCount(0);
  };

  return (
    <div className="w-full bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row gap-8 items-center justify-center">
      {/* 8x8 Chessboard */}
      <div className="bg-cyber-darker p-4 rounded-2xl border border-cyber-neon/40 shadow-2xl glow-cyan">
        <div className="grid grid-cols-8 gap-1.5 w-[360px] h-[360px] sm:w-[420px] sm:h-[420px]">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selectedPos?.r === r && selectedPos?.c === c;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`flex items-center justify-center text-3xl sm:text-4xl rounded-lg transition-all select-none ${
                    isSelected
                      ? 'bg-cyber-neon text-black font-bold scale-105 shadow-lg'
                      : isDark
                      ? 'bg-[#151c2c] hover:bg-[#1f2a42]'
                      : 'bg-[#222d45] hover:bg-[#2d3a59]'
                  }`}
                >
                  <span className={piece && isWhitePiece(piece) ? 'text-cyber-neon drop-shadow-md' : 'text-slate-300 drop-shadow-md'}>
                    {piece}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chess Match Info */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-cyber-dark/80 p-4 rounded-xl border border-cyber-border">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Turn</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                turn === 'WHITE' ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/50' : 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50'
              }`}
            >
              {turn === 'WHITE' ? 'CYBER WHITE (Player)' : 'DARK VOID (AI Bot)'}
            </span>
          </div>

          <div className="text-xs text-slate-400">Total Moves: <strong className="text-white font-mono">{moveCount}</strong></div>
        </div>

        {/* Captured Graveyard */}
        <div className="bg-cyber-dark/80 p-4 rounded-xl border border-cyber-border">
          <div className="text-xs text-slate-400 uppercase font-semibold mb-2">Captured Units</div>
          <div className="space-y-2 text-xl min-h-[60px]">
            <div className="bg-black/30 p-2 rounded-lg text-cyber-pink">
              {capturedBlack.length > 0 ? capturedBlack.join(' ') : <span className="text-xs text-slate-500">None</span>}
            </div>
            <div className="bg-black/30 p-2 rounded-lg text-cyber-neon">
              {capturedWhite.length > 0 ? capturedWhite.join(' ') : <span className="text-xs text-slate-500">None</span>}
            </div>
          </div>
        </div>

        <button
          onClick={restartBoard}
          className="w-full py-2.5 bg-cyber-dark hover:bg-cyber-border border border-cyber-border text-white text-xs uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset Board Match
        </button>
      </div>
    </div>
  );
};
