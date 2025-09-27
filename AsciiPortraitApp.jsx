import React, { useState } from "react";

export default function AsciiPortraitApp() {
  const [image, setImage] = useState(null);
  const [ascii, setAscii] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      convertToAscii(file);
    }
  };

  // Convert image to ASCII using canvas
  const convertToAscii = (file) => {
    setLoading(true);
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Resize for ASCII (smaller = faster + cleaner)
      const width = 100;
      const scale = width / img.width;
      const height = Math.floor(img.height * scale * 0.55);
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;

      const chars = "@#8&Oo:. ";
      let asciiText = "";

      for (let y = 0; y < height; y++) {
        let row = "";
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const avg =
            (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
          const char = chars[Math.floor((avg / 255) * (chars.length - 1))];
          row += char;
        }
        asciiText += row + "\n";
      }

      setAscii(asciiText);
      setLoading(false);
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold mb-4">ASCII Portrait Studio</h1>
      <p className="text-gray-400 mb-6">
        Upload an image and turn it into ASCII art 🎨
      </p>

      <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
      </label>

      {loading && <p className="mt-4 text-blue-400">Converting...</p>}

      {image && (
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <img
            src={image}
            alt="Uploaded"
            className="w-64 h-auto rounded-2xl shadow-lg"
          />
          <pre className="bg-black text-green-400 p-4 rounded-2xl shadow-lg overflow-auto max-h-[500px] text-xs leading-[0.75rem]">
            {ascii}
          </pre>
        </div>
      )}

      <footer className="mt-10 text-gray-500 text-sm">
        Built with ❤️ Apple-style minimalism
      </footer>
    </div>
  );
}
