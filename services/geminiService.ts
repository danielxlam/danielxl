import { GoogleGenAI, Modality, GenerateContentResponse, Part } from "@google/genai";
import type { GeminiEditResponse } from '../types.ts';

const EDIT_MODEL_NAME = 'gemini-2.5-flash-image-preview';
const TEXT_TO_IMAGE_MODEL = 'imagen-4.0-generate-001';


if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateImageWithGemini(prompt: string): Promise<string> {
  try {
      const response = await ai.models.generateImages({
          model: TEXT_TO_IMAGE_MODEL,
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
          },
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
          throw new Error("AI未能生成图片，可能由于安全设置或其它原因。");
      }

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;

  } catch (error) {
      console.error("Error calling Gemini for text-to-image:", error);
      if (error instanceof Error) {
          if (error.message.includes('API key not valid')) {
              throw new Error('API密钥无效，请检查配置。');
          }
          if (error.message.includes('429')) {
              throw new Error('超出API速率限制，请稍后再试。');
          }
          throw error;
      }
      throw new Error("AI生成图片失败，发生未知错误。");
  }
}

export async function editImageWithGemini(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  maskBase64?: string | null
): Promise<GeminiEditResponse> {
  try {
    const parts: Part[] = [
      {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      },
    ];

    if (maskBase64) {
      parts.push({
        inlineData: {
          data: maskBase64.split(',')[1], // remove data URL prefix
          mimeType: 'image/png',
        },
      });
    }

    parts.push({
      text: prompt,
    });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: EDIT_MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        let reasonText = '';
        switch(blockReason) {
            case 'SAFETY': reasonText = '安全设置'; break;
            case 'OTHER': reasonText = '其他原因'; break;
            default: reasonText = blockReason;
        }
        throw new Error(`请求因“${reasonText}”被拒绝。请尝试修改提示词或更换图片。`);
      }
      throw new Error("AI未能生成响应。这可能是临时问题，请稍后再试。");
    }

    const result: GeminiEditResponse = { image: null, text: null };

    if (response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          result.image = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
          result.text = part.text;
        }
      }
    }
    
    // The API call was successful, return whatever content was generated.
    // The calling function will handle cases where an image is missing.
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('API密钥无效，请检查配置。');
        }
        if (error.message.includes('429')) {
            throw new Error('超出API速率限制，请稍后再试。');
        }
        // Rethrow specific errors from the try block or other API errors
        throw error;
    }
    // Fallback for non-Error objects
    throw new Error("AI编辑图片失败，发生未知错误。");
  }
}