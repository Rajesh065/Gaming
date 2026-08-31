
import React, { useState } from 'react';

export interface CyberWidgetProps_96 {
  title: string;
  subtitle?: string;
  themeColor?: string;
  initialValue?: number;
  onValueChanged?: (val: number) => void;
}

export const CyberWidgetModule_96: React.FC<CyberWidgetProps_96> = ({
  title,
  subtitle,
  themeColor = '#00ffcc',
  initialValue = 100,
  onValueChanged
}) => {
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(true);

  const increment = () => {
    const next = value + 10;
    setValue(next);
    onValueChanged?.(next);
  };

  const decrement = () => {
    const next = Math.max(0, value - 10);
    setValue(next);
    onValueChanged?.(next);
  };

  return (
    <div className="bg-[#0f1422] border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl shadow-xl transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: isActive ? themeColor : '#64748b' }}
        />
      </div>

      <div className="my-4 bg-[#080b12] p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">CALIBRATION INDEX</span>
        <span className="text-lg font-black font-mono" style={{ color: themeColor }}>
          {value}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg transition-all"
        >
          - Adjust
        </button>
        <button
          onClick={increment}
          className="flex-1 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-bold text-cyan-300 border border-cyan-500/40 rounded-lg transition-all"
        >
          + Boost
        </button>
      </div>
    </div>
  );
};
