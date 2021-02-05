export function interpolate(uploadedImages: any[], text: string): string {
  for (const image of uploadedImages) {
    const original = encodeURI(image.path);
    const updated = image.url;
    text = interpolateCaption(text, original, updated);
  }
  return text;
}

function interpolateCaption(text: string, original: string, updated: string): string {
  const lines = text.split('\n');
  const imageLine = findImageLine();
  const caption = findCpation();

  lines.splice(imageLine, 3, `![${caption}](${updated})`);

  return lines.join('\n');

  function findImageLine() {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`[${original}]`)) {
        return i;
      }
    }
    throw new Error(`Can not interpolate image:
 ${original}`);
  }

  function findCpation() {
    const caption = lines[imageLine + 2].trim();
    if (caption.length === 0 || caption.length > 80) {
      throw new Error(`Caption is missing:
 ${lines.slice(imageLine, imageLine + 2).join('\n')}`);
    }
    return caption;
  }
}
