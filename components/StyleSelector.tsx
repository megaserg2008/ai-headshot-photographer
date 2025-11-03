
import React from 'react';
import { HEADSHOT_STYLES } from '../constants';
import { HeadshotStyle } from '../types';

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onStyleSelect: (id: string) => void;
}

const StyleCard: React.FC<{
    style: HeadshotStyle, 
    isSelected: boolean,
    onSelect: () => void
}> = ({ style, isSelected, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer rounded-lg border-2 bg-slate-800 p-3 transition-all duration-200 ease-in-out ${
                isSelected
                ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                : 'border-slate-700 hover:border-slate-500'
            }`}
        >
            <img 
                src={style.thumbnailUrl}
                alt={style.name}
                className="w-full h-32 object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm font-medium text-slate-200">{style.name}</p>
        </div>
    )
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onStyleSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {HEADSHOT_STYLES.map((style) => (
        <StyleCard 
            key={style.id}
            style={style}
            isSelected={selectedStyleId === style.id}
            onSelect={() => onStyleSelect(style.id)}
        />
      ))}
    </div>
  );
};

export default StyleSelector;
