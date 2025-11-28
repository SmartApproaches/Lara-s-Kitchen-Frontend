import React, { useEffect, useState } from "react";

const MenuImage = React.memo(({ src, alt, className, imageCache }) => {
  const placeholder = "https://via.placeholder.com/400x300/1F5226/FFFFFF?text=No+Image";

  const [displaySrc, setDisplaySrc] = useState(imageCache?.get(src) || placeholder);

  useEffect(() => {
    if (!src) {
      setDisplaySrc(placeholder);
      return;
    }

    // If we already cached this image, use it instantly
    if (imageCache?.has(src)) {
      setDisplaySrc(src);
      return;
    }

    // Load image once ONLY
    const img = new Image();
    img.src = src;

    img.onload = () => {
      imageCache?.set(src, true); // cache loaded
      setDisplaySrc(src);
    };

    img.onerror = () => {
      setDisplaySrc(placeholder);
    };
  }, [src]);
  return (
    <img src={displaySrc} alt={alt} className={className} loading="lazy" style={{ opacity: 1 }} />
  );
});

export default MenuImage;
