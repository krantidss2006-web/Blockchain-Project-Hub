import React, { useState, useRef } from 'react';
import { 
  Menu, 
  UserCircle, 
  Home, 
  Film, 
  Wand2, 
  FolderOpen,
  ImagePlus,
  Upload,
  Loader2,
  RefreshCw,
  Download,
  X,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentTab, setCurrentTab] = useState<'home' | 'editor' | 'ai-tools' | 'projects'>('ai-tools');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      // The result includes the data URI prefix (data:image/jpeg;base64,...)
      // We'll strip it for the API call if needed, or send as is and handle on server.
      // Actually, the server expects base64 without the prefix, let's store base64 separately.
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
       setError("Please enter a prompt.");
       return;
    }
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    
    try {
      let base64Data = null;
      if (mode === 'edit' && selectedImage) {
         // Extract base64 part
         const base64Arr = selectedImage.split(',');
         if (base64Arr.length > 1) {
             base64Data = base64Arr[1];
         }
      }
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          imageBase64: base64Data,
          mimeType: mode === 'edit' && base64Data ? mimeType : undefined
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      setResultImage(data.imageUrl);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] text-white font-sans overflow-hidden">
      {/* Sidebar Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-64 bg-[#131623] h-full border-r border-[#2a2e3f] flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-[#2a2e3f] flex items-center justify-between">
              <span className="font-semibold text-lg text-gray-100">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 space-y-1">
              <button className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-[#1a1d2d] hover:text-white transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings</span>
              </button>
              <button className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-[#1a1d2d] hover:text-white transition-colors">
                <HelpCircle className="w-5 h-5 mr-3" />
                <span className="font-medium">Help & Support</span>
              </button>
            </div>
            <div className="p-4 border-t border-[#2a2e3f]">
              <button className="w-full flex items-center px-2 py-2 text-red-400 hover:text-red-300 transition-colors">
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#131623] border-b border-[#2a2e3f] relative z-10">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 -ml-2 text-gray-300 hover:text-white rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold tracking-wide text-gray-100">AI Video Editor</h1>
        <button 
          onClick={() => alert("User profile clicked")}
          className="p-2 -mr-2 text-gray-300 hover:text-white rounded-full transition-colors"
        >
          <UserCircle className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
        
        {currentTab === 'ai-tools' ? (
          <div className="max-w-xl mx-auto space-y-6">
          {/* Tool Title */}
          <div className="flex items-center space-x-3 mb-8">
             <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
               <ImagePlus className="w-6 h-6 text-purple-400" />
             </div>
             <div>
               <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                 Image Studio
               </h2>
               <p className="text-sm text-gray-400">Create or edit images with AI</p>
             </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-[#1a1d2d] rounded-xl">
            <button 
              onClick={() => setMode('generate')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'generate' ? 'bg-[#262a3d] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Generate New
            </button>
            <button 
              onClick={() => setMode('edit')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'edit' ? 'bg-[#262a3d] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Edit Image
            </button>
          </div>

          {/* Edit Mode: Image Upload */}
          {mode === 'edit' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-48 rounded-xl border-2 border-dashed border-[#2a2e3f] bg-[#131623] hover:border-purple-500/50 hover:bg-[#1a1d2d] transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
            >
              {selectedImage ? (
                <>
                   <img src={selectedImage} alt="Selected" className="w-full h-full object-cover opacity-60" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                     <span className="text-white font-medium flex items-center"><RefreshCw className="w-4 h-4 mr-2" /> Replace Image</span>
                   </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload className="w-8 h-8 mb-3" />
                  <span className="text-sm font-medium">Tap to upload reference image</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 ml-1">Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'generate' ? "Describe the image you want to create..." : "Describe how you want to edit the image..."}
              className="w-full h-32 p-4 rounded-xl bg-[#131623] border border-[#2a2e3f] text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button 
            onClick={handleGenerate}
            disabled={isLoading || (mode === 'edit' && !selectedImage)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                {mode === 'generate' ? 'Generate Image' : 'Apply Magic Edit'}
              </>
            )}
          </button>

          {/* Result Area */}
          {resultImage && (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between ml-1">
                 <h3 className="text-sm font-medium text-gray-300">Generated Result</h3>
                 <a href={resultImage} download="generated_image.jpg" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center">
                   <Download className="w-3 h-3 mr-1" /> Save
                 </a>
               </div>
               <div className="w-full aspect-square rounded-xl overflow-hidden border border-[#2a2e3f] bg-black shadow-lg">
                 <img src={resultImage} alt="Generated result" className="w-full h-full object-contain" />
               </div>
            </div>
          )}

        </div>
        ) : (
          <div className="max-w-xl mx-auto h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            {currentTab === 'home' && <Home className="w-16 h-16 text-gray-600" />}
            {currentTab === 'editor' && <Film className="w-16 h-16 text-gray-600" />}
            {currentTab === 'projects' && <FolderOpen className="w-16 h-16 text-gray-600" />}
            <h2 className="text-xl font-medium text-gray-300 capitalize">{currentTab}</h2>
            <p className="text-sm text-center max-w-xs">
              This section is currently under development. Switch back to AI Tools to use the Image Studio.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-[#131623] border-t border-[#2a2e3f] flex items-center justify-around px-2 pb-safe z-10">
        <button 
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${currentTab === 'home' ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setCurrentTab('editor')}
          className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${currentTab === 'editor' ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Film className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Editor</span>
        </button>
        <button 
          onClick={() => setCurrentTab('ai-tools')}
          className={`flex flex-col items-center justify-center w-20 h-16 rounded-2xl transition-all -translate-y-2 ${currentTab === 'ai-tools' ? 'text-[#0f111a] bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white bg-[#1a1d2d] shadow-lg border border-[#2a2e3f]'}`}
        >
          <Wand2 className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">AI Tools</span>
        </button>
        <button 
          onClick={() => setCurrentTab('projects')}
          className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${currentTab === 'projects' ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <FolderOpen className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Projects</span>
        </button>
      </nav>
    </div>
  );
}
