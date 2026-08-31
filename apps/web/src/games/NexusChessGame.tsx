import React, { useState } from 'react';
import { Trophy, RotateCcw, User, Cpu, Sparkles } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

type Piece = string | null;

export const NexusChessGame: React.FC = () => {
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

  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<{ r: number; c: number } | null>(null);
  const [turn, setTurn] = useState<'WHITE' | 'BLACK'>('WHITE');
  const [moveHistory, setMoveHistory] = useState<string[]>(['1. e4 e5', '2. Nf3 Nc6']);

  const handleSquareClick = (r: number, c: number) => {
    AudioSynthesizer.playClick();
    if (!selectedSquare) {
      if (board[r][c]) {
        setSelectedSquare({ r, c });
      }
    } else {
      // Execute Move
      const newBoard = board.map((row) => [...row]);
      const piece = newBoard[selectedSquare.r][selectedSquare.c];
      newBoard[selectedSquare.r][selectedSquare.c] = null;
      newBoard[r][c] = piece;

      setBoard(newBoard);
      setSelectedSquare(null);
      setTurn(turn === 'WHITE' ? 'BLACK' : 'WHITE');

      const colLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const notation = `${colLetters[c]}${8 - r}`;
      setMoveHistory((prev) => [...prev, `${turn === 'WHITE' ? 'White' : 'Black'}: ${notation}`]);

      AudioSynthesizer.playHover();
    }
  };

  const handleReset = () => {
    AudioSynthesizer.playSuccess();
    setBoard(initialBoard);
    setSelectedSquare(null);
    setTurn('WHITE');
    setMoveHistory([]);
  };

  return (
    <div className="relative w-full bg-[#0E121B] rounded-2xl overflow-hidden border border-slate-800/80 p-6 flex flex-col md:flex-row gap-6 shadow-2xl">
      {/* Chessboard Area */}
      <div className="flex-1 flex flex-col items-center">
        {/* Opponent Info */}
        <div className="flex items-center justify-between w-full max-w-[480px] mb-3 bg-[#141926] px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span>Nexus AI Bot (Level 5)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">10:00</span>
        </div>

        {/* 8x8 Board */}
        <div className="grid grid-cols-8 rounded-xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-[#141926]">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selectedSquare?.r === r && selectedSquare?.c === c;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`w-14 h-14 flex items-center justify-center text-3xl cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-indigo-600/80 ring-2 ring-cyan-400'
                      : isDark
                      ? 'bg-[#1E2638] hover:bg-[#252E44]'
                      : 'bg-[#2A344D] hover:bg-[#323D5A]'
                  }`}
                >
                  <span className={piece && piece.charCodeAt(0) > 9817 ? 'text-cyan-300' : 'text-slate-100'}>
                    {piece}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Player Info */}
        <div className="flex items-center justify-between w-full max-w-[480px] mt-3 bg-[#141926] px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <User className="w-4 h-4 text-cyan-400" />
            <span>You (White)</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">Turn: {turn}</span>
        </div>
      </div>

      {/* Move History & Actions */}
      <div className="w-full md:w-72 space-y-4">
        <div className="bg-[#141926] p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              MOVE NOTATION
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto font-mono text-xs text-slate-300">
            {moveHistory.map((m, idx) => (
              <div key={idx} className="bg-[#0B0E14] px-2.5 py-1 rounded border border-slate-800/80">
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
