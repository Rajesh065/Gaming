
import React, { useState } from 'react';

export interface CyberWidgetProps_4 {
  title: string;
  subtitle?: string;
  themeColor?: string;
  initialValue?: number;
  onValueChanged?: (val: number) => void;
}

export const CyberWidgetModule_4: React.FC<CyberWidgetProps_4> = ({
  title,
  subtitle,
  themeColor = '#00ffcc',
  initialValue = 100,
  onValueChanged
}) => {
  const [value, setValue] = useState(initialValue);

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
    <div className="bg-[#121624] border border-slate-800 p-5 rounded-2xl shadow-xl">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="my-3 bg-[#0B0E14] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">INDEX</span>
        <span className="text-lg font-black font-mono text-cyan-400">{value}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg"
        >
          - Adjust
        </button>
        <button
          onClick={increment}
          className="flex-1 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-xs font-bold text-indigo-300 hover:text-white rounded-lg"
        >
          + Boost
        </button>
      </div>
    </div>
  );
};
