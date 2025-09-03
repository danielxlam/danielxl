import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ImageDisplay } from './components/ImageDisplay.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { ImageGallery } from './components/ImageGallery.tsx';
import { ImageModal } from './components/ImageModal.tsx';
import { GenerationUI } from './components/WelcomeScreen.tsx';
import { MaskingCanvas } from './components/MaskingCanvas.tsx';
import { editImageWithGemini, generateImageWithGemini } from './services/geminiService.ts';
import { createThumbnail } from './utils/imageUtils.ts';
import type { UploadedImage, HistoryEntry } from './types.ts';

// --- History Management Logic ---
const HISTORY_KEY = 'monkey-banana-edit-history';
const MAX_HISTORY_PER_IMAGE = 10;

// Stored history entry will not have fullImage
type StoredHistoryEntry = Omit<HistoryEntry, 'fullImage'>;

function getFullHistory(): Record<string, StoredHistoryEntry[]> {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Failed to parse history from localStorage", e);
    return {};
  }
}

function getHistoryForImage(imageId: string): HistoryEntry[] {
  const allHistory = getFullHistory();
  return allHistory[imageId] || [];
}

function addHistoryEntry(imageId: string, entry: HistoryEntry): void {
  const allHistory = getFullHistory();
  const imageHistory = allHistory[imageId] || [];
  
  const { fullImage, ...storableEntry } = entry; // Omit fullImage for storage

  const updatedHistory = [storableEntry, ...imageHistory].slice(0, MAX_HISTORY_PER_IMAGE);
  allHistory[imageId] = updatedHistory;

  try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
  } catch(e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.warn("Local storage quota exceeded. Could not save full history.");
          // Attempt to save a smaller history as a fallback
          allHistory[imageId] = updatedHistory.slice(0, 5);
          try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
          } catch (e2) {
            console.error("Failed to save even a smaller history.", e2);
          }
      } else {
          console.error("Failed to save history to localStorage", e);
      }
  }
}

function removeHistoryEntry(imageId: string, timestamp: number): void {
  const allHistory = getFullHistory();
  if (!allHistory[imageId]) return;

  allHistory[imageId] = allHistory[imageId].filter(entry => entry.timestamp !== timestamp);

  if (allHistory[imageId].length === 0) {
    delete allHistory[imageId];
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
}


function removeHistoryForImage(imageId: string): void {
  const allHistory = getFullHistory();
  delete allHistory[imageId];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
}

function clearAllHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
// --- End History Management ---

// Helper function to convert data URL to File
function dataURLtoFile(dataurl: string, filename: string): File | null {
    const arr = dataurl.split(',');
    if (arr.length < 2) { return null; }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) { return null; }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}


function App() {
  const [originalImages, setOriginalImages] = useState<UploadedImage[]>([]);
  const [editedImages, setEditedImages] = useState<{ [key: number]: string }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [isGeneratingFromText, setIsGeneratingFromText] = useState<boolean>(false);
  const [textGenerationError, setTextGenerationError] = useState<string | null>(null);
  const [isMasking, setIsMasking] = useState<boolean>(false);
  const [mask, setMask] = useState<string | null>(null);


  useEffect(() => {
    if (selectedImageIndex !== null && originalImages[selectedImageIndex]) {
      const imageId = originalImages[selectedImageIndex].id;
      setHistory(getHistoryForImage(imageId));
      setMask(null); // Clear mask when switching images
    } else {
      setHistory([]);
      setMask(null);
    }
  }, [selectedImageIndex, originalImages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setModalImageUrl(null);
            setIsMasking(false); // Also close masking UI on Escape
        }
    };

    if (modalImageUrl || isMasking) {
        window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalImageUrl, isMasking]);


  const handleImageUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setError(null);
    setAiFeedback(null);
    setTextGenerationError(null);
    setMask(null);

    try {
        const newImagesPromises = files.map(file => {
            return new Promise<Omit<UploadedImage, 'id'>>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    resolve({
                        file: file,
                        base64: base64String.split(',')[1],
                        name: file.name,
                        type: file.type,
                    });
                };
                reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
                reader.readAsDataURL(file);
            });
        });
        const newImages = await Promise.all(newImagesPromises);
        
        const imagesWithIds: UploadedImage[] = newImages.map(img => ({
          ...img,
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }));
        
        setOriginalImages(prevOriginals => {
            const updatedImages = [...prevOriginals, ...imagesWithIds];
            // Always select the first of the newly added images.
            setSelectedImageIndex(prevOriginals.length);
            return updatedImages;
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '读取图片文件时发生错误。';
        if (originalImages.length > 0) {
            setError(errorMessage);
        } else {
            setTextGenerationError(errorMessage);
        }
    }
  }, [originalImages.length]);

  const handleGenerateFromText = useCallback(async (prompt: string) => {
    setIsGeneratingFromText(true);
    setTextGenerationError(null);
    
    try {
        const generatedImageUrl = await generateImageWithGemini(prompt);
        
        const newFileName = `ai-generated-${Date.now()}.png`;
        const newFile = dataURLtoFile(generatedImageUrl, newFileName);
        
        if (!newFile) {
            throw new Error('无法将生成的图片转换为文件。');
        }

        const newImage: Omit<UploadedImage, 'id'> = {
            file: newFile,
            base64: generatedImageUrl.split(',')[1],
            name: newFile.name,
            type: newFile.type,
        };

        const newImageWithId: UploadedImage = {
            ...newImage,
            id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        };

        setOriginalImages(prevOriginals => {
            const updatedImages = [...prevOriginals, newImageWithId];
            setSelectedImageIndex(updatedImages.length - 1); // Select the newly added image
            return updatedImages;
        });

    } catch (err) {
        setTextGenerationError(err instanceof Error ? err.message : '图片生成过程中发生未知错误。');
    } finally {
        setIsGeneratingFromText(false);
    }
  }, []);

  const handleEditRequest = useCallback(async () => {
    if (selectedImageIndex === null || !originalImages[selectedImageIndex] || !prompt.trim() || isLoading) {
      return;
    }

    const imageToEdit = originalImages[selectedImageIndex];
    setIsLoading(true);
    setError(null);
    setAiFeedback(null);
    
    setEditedImages(prev => {
        const next = { ...prev };
        delete next[selectedImageIndex];
        return next;
    });

    try {
      const result = await editImageWithGemini(imageToEdit.base64, imageToEdit.type, prompt, mask);
      
      if (result.image) {
        setEditedImages(prev => ({
            ...prev,
            [selectedImageIndex]: result.image!,
        }));
        
        const thumbnail = await createThumbnail(result.image);
        const newHistoryEntry: HistoryEntry = {
            prompt,
            thumbnail,
            timestamp: Date.now(),
            fullImage: result.image,
        };

        addHistoryEntry(imageToEdit.id, newHistoryEntry);
        setHistory(prev => [newHistoryEntry, ...prev].slice(0, MAX_HISTORY_PER_IMAGE));

      } else if (result.text) {
        setAiFeedback(result.text);
      } else {
        setError('AI未能生成有效响应。请尝试调整提示词或稍后再试。');
      }

      if (result.text && result.image) {
        console.log("AI Text Response:", result.text);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '图片编辑过程中发生未知错误。');
      setAiFeedback(null);
    } finally {
      setIsLoading(false);
    }
  }, [originalImages, prompt, isLoading, selectedImageIndex, mask]);

  const handleReset = useCallback(() => {
    setOriginalImages([]);
    setEditedImages({});
    setSelectedImageIndex(null);
    setPrompt('');
    setError(null);
    setAiFeedback(null);
    setIsLoading(false);
    clearAllHistory();
    setHistory([]);
    setTextGenerationError(null);
    setIsGeneratingFromText(false);
    setMask(null);
    setIsMasking(false);
  }, []);

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
    setError(null);
    setAiFeedback(null);
    setMask(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (originalImages.length === 1) {
        handleReset();
        return;
    }
    
    const imageToRemoveId = originalImages[indexToRemove].id;

    const newOriginals = originalImages.filter((_, i) => i !== indexToRemove);
    
    const newEdited: { [key: number]: string } = {};
    Object.keys(editedImages).forEach(keyStr => {
        const key = parseInt(keyStr, 10);
        if (key < indexToRemove) {
            newEdited[key] = editedImages[key];
        } else if (key > indexToRemove) {
            newEdited[key - 1] = editedImages[key];
        }
    });

    let newSelectedIndex = selectedImageIndex;
    if (selectedImageIndex === indexToRemove) {
        newSelectedIndex = Math.max(0, indexToRemove - 1);
    } else if (selectedImageIndex !== null && selectedImageIndex > indexToRemove) {
        newSelectedIndex = selectedImageIndex - 1;
    }

    setOriginalImages(newOriginals);
    setEditedImages(newEdited);
    setSelectedImageIndex(newSelectedIndex);
    removeHistoryForImage(imageToRemoveId);
    setAiFeedback(null);
    if(selectedImageIndex === indexToRemove) setMask(null);
  };
  
  const handleHistorySelect = (entry: HistoryEntry) => {
      if (selectedImageIndex === null || isLoading) return;
      setPrompt(entry.prompt);
      setAiFeedback(null);
      setMask(null);
      const imageToDisplay = entry.fullImage || entry.thumbnail;
      setEditedImages(prev => ({
        ...prev,
        [selectedImageIndex]: imageToDisplay,
      }));
  };

  const handleDeleteHistoryEntry = (entryToDelete: HistoryEntry) => {
    if (selectedImageIndex === null) return;
    const imageId = originalImages[selectedImageIndex].id;
    
    removeHistoryEntry(imageId, entryToDelete.timestamp);
    setHistory(prev => prev.filter(entry => entry.timestamp !== entryToDelete.timestamp));
  };


  const handleShowModal = (url: string) => {
    setModalImageUrl(url);
  };

  const handleCloseModal = () => {
      setModalImageUrl(null);
  };

  const handleUseAsSource = () => {
    if (selectedImageIndex === null || !editedImages[selectedImageIndex] || isLoading) return;

    const editedImageUrl = editedImages[selectedImageIndex];
    const originalImage = originalImages[selectedImageIndex];

    const originalName = originalImage.name.substring(0, originalImage.name.lastIndexOf('.')) || originalImage.name;
    const newFileName = `${originalName}-edited-${Date.now()}.png`;

    const newFile = dataURLtoFile(editedImageUrl, newFileName);
    if (!newFile) {
        setError('无法将编辑后的图片转换为文件。');
        return;
    }

    const newImage: Omit<UploadedImage, 'id'> = {
        file: newFile,
        base64: editedImageUrl.split(',')[1],
        name: newFile.name,
        type: newFile.type,
    };

    const newImageWithId: UploadedImage = {
        ...newImage,
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };

    setOriginalImages(prevOriginals => {
        const updatedImages = [...prevOriginals, newImageWithId];
        // Set selection to the newly added image
        setSelectedImageIndex(updatedImages.length - 1);
        return updatedImages;
    });
    setAiFeedback(null);
    setMask(null);
  };

  const handleStartMasking = () => {
    if (selectedImageIndex !== null) {
      setIsMasking(true);
    }
  };
  
  const handleMaskComplete = (maskDataUrl: string) => {
    setMask(maskDataUrl);
    setIsMasking(false);
  };
  
  const handleCancelMasking = () => {
    setIsMasking(false);
  };

  const selectedImage = selectedImageIndex !== null ? originalImages[selectedImageIndex] : null;
  const editedForSelected = selectedImageIndex !== null ? (editedImages[selectedImageIndex] || null) : null;
  const selectedImageUrl = selectedImage ? `data:${selectedImage.type};base64,${selectedImage.base64}`: null;


  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans">
      <Header />
      <main className={`container mx-auto p-4 md:p-8 ${originalImages.length > 0 ? 'pb-48' : ''}`}>
        {originalImages.length === 0 ? (
          <GenerationUI 
            onGenerate={handleGenerateFromText}
            onImageUpload={handleImageUpload}
            isLoading={isGeneratingFromText}
            error={textGenerationError}
          />
        ) : (
          <div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageDisplay 
                  title="原图" 
                  imageUrl={selectedImageUrl}
                  imageIndex={selectedImageIndex}
                  maskUrl={mask}
                  onMaskButtonClick={handleStartMasking}
                />
                <div className="relative">
                  <ImageDisplay 
                    title="编辑后" 
                    imageUrl={editedForSelected}
                    feedbackMessage={aiFeedback}
                    onImageClick={editedForSelected ? () => handleShowModal(editedForSelected) : undefined}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-base-200 bg-opacity-70 flex flex-col items-center justify-center rounded-lg">
                      <LoadingSpinner />
                      <p className="mt-4 text-text-secondary">AI正在施展魔法...</p>
                    </div>
                  )}
                </div>
              </div>
              <Sidebar
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleEditRequest}
                onReset={handleReset}
                isLoading={isLoading}
                editedImageUrl={editedForSelected}
                originalImageName={selectedImage?.name || 'edited.png'}
                onUseAsSource={handleUseAsSource}
                history={history}
                onHistorySelect={handleHistorySelect}
                onHistoryDelete={handleDeleteHistoryEntry}
                error={error}
                hasMask={!!mask}
              />
            </div>
          </div>
        )}
      </main>
      {originalImages.length > 0 && (
        <ImageGallery 
            images={originalImages}
            selectedIndex={selectedImageIndex}
            onSelect={handleSelectImage}
            onImageUpload={handleImageUpload}
            onClearAll={handleReset}
            onRemove={handleRemoveImage}
        />
      )}
      {modalImageUrl && (
        <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />
      )}
      {isMasking && selectedImageUrl && (
        <MaskingCanvas
          imageUrl={selectedImageUrl}
          onComplete={handleMaskComplete}
          onCancel={handleCancelMasking}
        />
      )}
    </div>
  );
}

export default App;
