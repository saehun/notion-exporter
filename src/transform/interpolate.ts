export function interpolate(uploadedImages: any[], text: string): string {
  for (const image of uploadedImages) {
    const original = encodeURI(image.path);
    const updated = image.url;
    text = text.replace(`[${original}]`, '[attachment]');
    text = text.replace(`(${original})`, `(${updated})`);
  }
  return text;
}
