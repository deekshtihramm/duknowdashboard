import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"; // helper function (we'll create this)

const ImageCropper = ({ imageUrl, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
    onCropComplete(croppedImage);
  }, [imageUrl, onCropComplete]);

  return (
    <div className="crop-container" style={{ position: "relative", width: "300px", height: "200px" }}>
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        aspect={1} // 1:1 ratio, change if needed
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default ImageCropper;
