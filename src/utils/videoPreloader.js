/**
 * Preloads an array of video URLs and reports progress.
 * Resolves when all videos have fired 'canplaythrough'.
 *
 * @param {string[]} urls - Array of video source URLs to preload
 * @param {function} onProgress - Callback with (loaded, total)
 * @returns {Promise<HTMLVideoElement[]>} - Resolved video elements
 */
export function preloadVideos(urls, onProgress) {
  let loaded = 0;
  const total = urls.length;

  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.muted = true;
          video.playsInline = true;
          video.src = url;

          const handleReady = () => {
            loaded += 1;
            onProgress?.(loaded, total);
            resolve(video);
          };

          video.addEventListener('canplaythrough', handleReady, { once: true });

          /* Fallback: if canplaythrough never fires, resolve after timeout */
          setTimeout(() => {
            video.removeEventListener('canplaythrough', handleReady);
            loaded += 1;
            onProgress?.(loaded, total);
            resolve(video);
          }, 8000);

          /* Kick off the load */
          video.load();
        }),
    ),
  );
}

/**
 * Extracts all unique video URLs from the sections config.
 *
 * @param {Array} sections - Sections config array
 * @returns {string[]} - Flat list of all video URLs
 */
export function getAllVideoUrls(sections) {
  return sections.flatMap((s) => [s.forwardVideo, s.reverseVideo]);
}
