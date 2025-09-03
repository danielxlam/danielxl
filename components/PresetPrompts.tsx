import React from 'react';

interface PresetPromptsProps {
  onPresetSelect: (prompt: string) => void;
  disabled: boolean;
}

const prompts = [
    {
        name: '照片转手办',
        prompt: "Create an image of the main subject from the photo as a character figure. Behind it, place a box with the character's image printed on it, and a computer showing the blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. Set the scene indoors if possible."
    },
    {
        name: '证件照九宫格',
        prompt: "Create a single image that is a 3x3 grid. Each of the 9 cells should be a facial close-up of the character from the input picture, but with a distinct hairstyle (e.g., long, short, curly, straight, braided). Maintain a consistent angle, lighting, and background for all 9 images."
    },
    {
        name: '电商产品场景图',
        prompt: "Create an image of a model posing gracefully, leaning against a pink BMW, with a light grey background. Details of her outfit are as follows: a green alien-shaped keychain is attached to her pink handbag; a pink parrot is perched on her shoulder; a pug is sitting beside her, wearing a pink collar and gold headphones, making the whole picture harmonious and eye-catching."
    },
    {
        name: '手持产品',
        prompt: "A photorealistic image of a hand holding a product for demonstration. A 25-year-old female model smiling and holding up a white smart thermos cup with one hand, showcasing its smooth material and minimalist design. Clean light gray gradient background, soft diffused light."
    },
    {
        name: '家居',
        prompt: "Using the soft furnishings in the picture (including furniture, fabrics, decorative ornaments, etc.), generate a complete and unified indoor scene. It should reflect the color echo, material matching and overall atmosphere of each element, presenting a naturally integrated space with high reduction and clear details."
    },
    {
        name: '虚拟试衣',
        prompt: "Generate an image of the character from the picture wearing all the clothing and accessories also present in the image. The final outfit should look natural and coordinated, creating a complete and detailed style."
    },
    {
        name: 'UI设计',
        prompt: "Design a minimalist data dashboard interface for a health management mobile app. Main color light blue and white, include metric cards, trend charts, clean modern layout."
    },
    {
        name: '单张插画或IP生成多种姿势',
        prompt: "Create a single image that is a 3x3 grid. Each of the 9 cells in the grid should show the character from the input picture in a distinct pose. The poses should include standing, sitting, and dynamic actions (like jumping or waving). The character's design and personality must be consistent with the original input image."
    },
    {
        name: '老照片修复',
        prompt: 'Restore this old photo. Repair scratches, creases, fading, and mold spots on the image, restore clear facial features/object outlines, retain natural vintage film texture, soft and non-dazzling colors, overall tone close to the original photo\'s era (e.g., warm yellow tone of the 1980s-1990s), no over-sharpening, clean and natural image.'
    },
    {
        name: '黑白照片上色',
        prompt: 'Add professional coloring to this black and white photo. The colors should follow real-world logic (e.g., natural warm beige skin, dark brown hair, slight off-white tone for white clothing), with no over-saturation or color bleeding. Retain the delicate texture of the original black and white photo without damaging the light and shadow layers. The overall tone should be harmonious, presenting a "natural and unforced" coloring effect.'
    },
    {
        name: '人物+姿势',
        prompt: 'Have the protagonist from image one accurately mimic the full-body pose from image two, maintain facial features, hairstyle, body shape unchanged, only adjust posture.'
    },
    {
        name: '家装展示',
        prompt: 'Help me convert this residential floor plan into an isometric photorealistic 3D rendering of the house.'
    },
    {
        name: '食物信息图',
        prompt: 'Convert the ingredients in the image into a step-by-step recipe infographic with a top-down vertical perspective on a pure white background. First, display cutout images of ingredients with text labels. Then connect step icons with short text descriptions using gray dashed lines. Finally, place a photo of the final plated dish at the bottom. Ensure all elements are neatly aligned.'
    },
    {
        name: '图片转3D立体卡通',
        prompt: 'Transform the main subject of the image into a 3D-style cartoon with a matte, plush fabric texture, like a soft doll. Match the original colors perfectly and add thick, rounded, 3D cartoon stitching. Make the character\'s outline rounded and slightly inflated, with a few exaggerated wrinkles. Use soft, layered lighting to highlight the 3D texture and place the final character on a solid light gray background.'
    }
];

export const PresetPrompts: React.FC<PresetPromptsProps> = ({ onPresetSelect, disabled }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-text-secondary mb-2">或者试试预设...</h3>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onPresetSelect(p.prompt)}
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