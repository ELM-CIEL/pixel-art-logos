import PixelLogo from "./components/PixelLogo";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <PixelLogo logo="react" size={150} pixelSize={8} />
        <PixelLogo logo="javascript" size={150} pixelSize={8} />
        <PixelLogo logo="nextjs" size={150} pixelSize={8} />
        <PixelLogo logo="nodejs" size={150} pixelSize={8} />
        <PixelLogo logo="tailwind" size={150} pixelSize={8} />
        <PixelLogo logo="python" size={150} pixelSize={8} />
        <PixelLogo logo="mysql" size={150} pixelSize={8} />
        <PixelLogo logo="mongodb" size={150} pixelSize={8} />
      </div>
    </div>
  );
}

export default App;
