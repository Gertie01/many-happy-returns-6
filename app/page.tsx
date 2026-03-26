import ImageGenerator from '../components/ImageGenerator';

/**
 * Licensed under the Apache License 2.0
 * Fully dynamic SDXL generation interface.
 */
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-24">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SDXL Unlimited
          </h1>
          <p className="text-neutral-400 text-lg">
            Generate professional-grade images instantly using stable-diffusion-xl-base-1.0
          </p>
        </div>
        
        <ImageGenerator />

        <footer className="text-center text-xs text-neutral-600 pt-12">
          Licensed under Apache License 2.0 | No Usage Limits | Model ID: stable-diffusion-xl-base-1.0
        </footer>
      </div>
    </main>
  );
}
