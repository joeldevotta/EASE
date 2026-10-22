import React, { useEffect, useState } from 'react';

interface AuthenticatedImageProps {
  url: string;
  authorization?: string;
  alt: string;
  className?: string;
}

/**
 * Loads a protected image with an Authorization header and renders it from a
 * short-lived object URL. The object URL is revoked on unmount and is never
 * persisted as the report's image location.
 */
export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  url,
  authorization,
  alt,
  className,
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    setSrc(null);
    setFailed(false);

    fetch(url, {
      headers: {
        Accept: 'image/*',
        ...(authorization ? { Authorization: authorization } : {}),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Image unavailable');
        }
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setSrc(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, authorization]);

  if (failed) {
    return (
      <p className="text-[11px] text-outline italic">Photo could not be loaded.</p>
    );
  }

  if (!src) {
    return (
      <div className="h-24 rounded bg-surface-container-low animate-pulse" aria-hidden="true" />
    );
  }

  return <img src={src} alt={alt} className={className} />;
};
