
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import Loader from './components/Loader';
import { fileToBase64, generateHeadshot } from './services/geminiService';
import { HEADSHOT_STYLES } from './constants';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
    setError(null);
    setSelectedStyleId(HEADSHOT_STYLES[0]?.id || null); // Default to first style
  }, []);
  
  const handleGenerate = async () => {
    if (!originalImageFile || !selectedStyleId) {
      setError("Please upload an image and select a style first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const base64Image = await fileToBase64(originalImageFile);
      const selectedStyle = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
      if (!selectedStyle) {
          throw new Error("Invalid style selected");
      }
      
      const fullPrompt = `${selectedStyle.prompt} ${customPrompt}`.trim();

      const generatedData = await generateHeadshot(base64Image, originalImageFile.type, fullPrompt);
      setGeneratedImageUrl(`data:image/jpeg;base64,${generatedData}`);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
      setOriginalImageFile(null);
      setOriginalImageUrl(null);
      setGeneratedImageUrl(null);
      setSelectedStyleId(null);
      setCustomPrompt('');
      setError(null);
      setIsLoading(false);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = 'ai-headshot.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            AI Headshot Photographer
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a selfie, pick a style, and generate a professional headshot in seconds.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Controls Column */}
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col gap-6">
            {!originalImageFile ? (
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-4">Step 1: Upload Your Photo</h2>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold text-slate-100">Step 2: Customize</h2>
                     <button onClick={handleReset} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Start Over</button>
                  </div>
                 
                  <label className="block text-md font-semibold text-slate-300 mb-2">Choose a Style</label>
                  <StyleSelector selectedStyleId={selectedStyleId} onStyleSelect={setSelectedStyleId} />
                </div>

                <div>
                  <label htmlFor="customPrompt" className="block text-md font-semibold text-slate-300 mb-2">
                    (Optional) Add Custom Edits
                  </label>
                  <textarea
                    id="customPrompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder='e.g., "Add a retro filter", "Remove the glasses"'
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  />
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                >
                  {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                  ) : "Generate Headshot"}
                </button>
              </>
            )}
          </div>

          {/* Image Display Column */}
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-center min-h-[400px] lg:min-h-0">
            {isLoading && <Loader />}
            
            {!isLoading && error && (
              <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                <p className="font-bold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {!isLoading && !error && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {originalImageUrl && (
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-300">Original</h3>
                            <img src={originalImageUrl} alt="Original selfie" className="w-full h-auto object-contain rounded-lg shadow-md max-h-96" />
                        </div>
                    )}
                    {generatedImageUrl && (
                        <div className="flex flex-col items-center gap-2">
                             <h3 className="text-lg font-semibold text-cyan-400">Generated Headshot</h3>
                            <img src={generatedImageUrl} alt="Generated headshot" className="w-full h-auto object-contain rounded-lg shadow-md max-h-96" />
                            <button
                                onClick={handleDownload}
                                className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </button>
                        </div>
                    )}
                     {!originalImageUrl && !generatedImageUrl && (
                        <div className="col-span-1 md:col-span-2 text-center text-slate-500">
                            <p>Your generated headshot will appear here.</p>
                        </div>
                    )}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
