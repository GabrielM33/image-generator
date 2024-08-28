'use client'

import React, { useState } from 'react';
import Image from 'next/image';

const ImageGenerator = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedImages(files);
    }
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/flux', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImages([data.imageUrl]);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('An error occurred while generating the image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `generated-image-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('An error occurred while downloading the image.'));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Image Generator</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Upload 10 images of yourself:</label>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleImageUpload}
          className="border p-2"
        />
        <p className="mt-2">{uploadedImages.length} images uploaded</p>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Enter your prompt:</label>
        <input 
          type="text" 
          value={prompt} 
          onChange={handlePromptChange}
          className="border p-2 w-full text-black"
          placeholder="e.g., a colorful illustration of a boy in a distant galaxy"
        />
      </div>
      
      <button 
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Images'}
      </button>
      
      {generatedImages.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Generated Images:</h2>
          <div className="grid grid-cols-3 gap-4">
            {generatedImages.map((img, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image 
                  src={img} 
                  alt={`Generated image ${index + 1}`} 
                  width={600} 
                  height={600} 
                  className="w-full mb-2 object-contain" 
                />
                <button 
                  onClick={() => handleDownload(img, index)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;