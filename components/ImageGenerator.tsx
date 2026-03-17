'use client';

import React, { useState } from 'react';
import { Loader2, Send, Download, Sparkles } from 'lucide-react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{url: string, prompt: string}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // The fetch call that 'never fails' to return a valid JSON object
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt, 
            modelId: "stable-diffusion-xl-base-1.0" 
        }),
      });

      const data = await response.json();

      if (data.url) {
        setImages(prev => [{ url: data.url, prompt: prompt }, ...prev]);
        setPrompt('');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={generateImage} className="relative group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cinematic shot of a neon cyberpunk city in the rain..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-4 px-6 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-neutral-600"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden aspect-square">
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <p className="text-sm text-neutral-200 line-clamp-2 italic mb-4">"{img.prompt}"</p>
              <div className="flex gap-2">
                <a 
                  href={img.url} 
                  download 
                  target="_blank"
                  className="flex-1 bg-white text-black py-2 rounded-lg font-bold text-center text-sm flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-800 rounded-2xl text-neutral-600">
          Enter a prompt to see the power of SDXL
        </div>
      )}
    </div>
  );
}