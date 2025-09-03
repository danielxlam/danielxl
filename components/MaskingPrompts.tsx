import React from 'react';

interface MaskingPromptsProps {
  onPresetSelect: (prompt: string) => void;
  disabled: boolean;
}

const prompts = [
    {
        name: '移除对象',
        prompt: "Remove the masked object and fill in the background realistically."
    },
    {
        name: '替换材质为木纹',
        prompt: "Change the texture of the masked area to wood."
    },
    {
        name: '添加火焰特效',
        prompt: "Add realistic fire and smoke effects to the masked area."
    },
    {
        name: '使其发光',
        prompt: "Make the masked area glow with a bright, ethereal blue light."
    },
    {
        name: '变成水面',
        prompt: "Transform the masked area into clear, flowing water."
    },
    {
        name: '长出花朵',
        prompt: "Cover the masked area with blooming red roses."
    }
];

export const MaskingPrompts: React.FC<MaskingPromptsProps> = ({ onPresetSelect, disabled }) => {
  return (
    <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg animate-fade-in">
      <h3 className="text-sm font-medium text-yellow-200 mb-2">局部编辑预设指令</h3>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onPresetSelect(p.prompt)}
            disabled={disabled || !p.prompt.trim()}
            className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-400/20 text-yellow-100 hover:bg-brand-secondary hover:text-white transition-colors disabled:bg-base-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};
