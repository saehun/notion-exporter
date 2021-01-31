export type DirItem = {
  path: string;
  name: string;
  size: number;
  extension: string;
  type: 'file' | 'directory';
};
