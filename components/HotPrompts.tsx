
import React from 'react';

interface HotPromptsProps {
  onHotPromptSelect: (prompt: string) => void;
  disabled: boolean;
}

const hotPrompts = [
    {
        name: '黏土滤镜',
        prompt: "Transform the image into a claymation style. The subjects should look like they are made of modeling clay, with visible fingerprints and a slightly uneven, handcrafted texture. Use soft, studio-style lighting to enhance the 3D effect and create a charming, stop-motion animation feel."
    },
    {
        name: '像素艺术',
        prompt: "Convert the main subject of the image into a detailed 16-bit pixel art character. Use a limited, vibrant color palette. The background should be a simple, repeating pixel pattern. Ensure the character's key features are recognizable despite the pixelation."
    },
    {
        name: '搞笑贴纸',
        prompt: "Create a die-cut sticker of the main subject. Give it a thick white border and a subtle drop shadow. Exaggerate the subject's facial expression to make it funny. The sticker should look glossy and be placed on a plain background."
    },
    {
        name: '电影海报',
        prompt: "Turn this image into a dramatic movie poster. Add a compelling title in a cinematic font. Include billing block text at the bottom. Adjust the lighting to be more high-contrast and atmospheric, and apply a color grade that matches a specific genre (e.g., cool blues for sci-fi, warm tones for a drama)."
    },
    {
        name: '美食海报',
        prompt: "Design a modern, minimalist food poster using the dish in the image. Place the dish on a clean, complementary colored background. Add bold, stylish typography for the dish's name. Use high-contrast lighting to make the food look fresh and appealing. The overall composition should be clean and suitable for a magazine or advertisement."
    }
];

export const HotPrompts: React.FC<HotPromptsProps> = ({ onHotPromptSelect, disabled }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-text-secondary mb-2">近日热门</h3>
      <div className="flex flex-wrap gap-2">
        {hotPrompts.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onHotPromptSelect(p.prompt)}
            disabled={disabled || !p.prompt.trim()}
            className="px-3 py-1 text-xs font-medium rounded-full bg-base-300 text-text-secondary hover:bg-brand-secondary hover:text-white transition-colors disabled:bg-base-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};
