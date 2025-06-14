
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compress, Upload, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ImageCompressionSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState<number>(100);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setOriginalSize(Math.round(file.size / 1024));
        setCompressedImage(null);
        setCompressedSize(0);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setCompressing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx?.drawImage(img, 0, 0);

        // Start with high quality and reduce until target size is reached
        let quality = 0.9;
        let compressedDataUrl = '';
        
        const tryCompress = () => {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const compressedSizeKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
          
          if (compressedSizeKB > targetSize && quality > 0.1) {
            quality -= 0.1;
            setTimeout(tryCompress, 10);
          } else {
            setCompressedImage(compressedDataUrl);
            setCompressedSize(compressedSizeKB);
            setCompressing(false);
            toast({
              title: "Image compressed successfully!",
              description: `Reduced from ${originalSize}KB to ${compressedSizeKB}KB`,
            });
          }
        };

        tryCompress();
      };

      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      setCompressing(false);
      toast({
        title: "Compression failed",
        description: "An error occurred while compressing the image.",
        variant: "destructive",
      });
    }
  };

  const downloadCompressedImage = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.download = `compressed_${selectedFile?.name || 'image'}.jpg`;
    link.href = compressedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your compressed image is being downloaded.",
    });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setTargetSize(100);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Compress className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Image Compression Tool</h2>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-400" />
            Compress Image for Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Select an image to compress</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">Original size: {originalSize} KB</p>
                </div>
                <Button variant="outline" onClick={resetTool} size="sm">
                  Change Image
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  Target Size (KB)
                </label>
                <Input
                  type="number"
                  value={targetSize}
                  onChange={(e) => setTargetSize(Number(e.target.value))}
                  min="10"
                  max="1000"
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter target size in KB"
                />
                <p className="text-gray-400 text-xs">
                  Common exam requirements: 50KB, 100KB, 200KB
                </p>
              </div>

              <Button
                onClick={compressImage}
                disabled={compressing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {compressing ? 'Compressing...' : 'Compress Image'}
              </Button>

              {compressedImage && (
                <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-medium">Compression Complete!</p>
                      <p className="text-gray-400 text-sm">
                        Compressed to: {compressedSize} KB 
                        ({Math.round(((originalSize - compressedSize) / originalSize) * 100)}% reduction)
                      </p>
                    </div>
                    <Button
                      onClick={downloadCompressedImage}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white text-sm mb-2">Original ({originalSize} KB)</p>
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Original"
                        className="w-full h-40 object-cover rounded border border-gray-600"
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm mb-2">Compressed ({compressedSize} KB)</p>
                      <img
                        src={compressedImage}
                        alt="Compressed"
                        className="w-full h-40 object-cover rounded border border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-300 text-sm">
          <p>• Use JPEG format for photos with many colors</p>
          <p>• Higher target sizes preserve better image quality</p>
          <p>• Very small target sizes may result in pixelated images</p>
          <p>• Check your exam requirements for specific size limits</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCompressionSection;
