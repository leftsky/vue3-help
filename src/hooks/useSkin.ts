interface SkinItem {
  name: string;
  version: string;
  description: string;
  author: string;
  part: {
    cssVars: any;
    images: any;
  };
}

export interface SkinData {
  skins: SkinItem[];
}

let lastData: SkinData;

const useSkin = (data: SkinData = lastData) => {
  if (data) lastData = data;
  const { skins } = data;

  const fetchFromTheme = (theme: any, path: string[]): any => {
    if (path.length <= 0) return '';
    const fullPath = path.join('.');
    if (!theme) return '';
    if (theme[fullPath]) return theme[fullPath];
    if (!theme[path[0]]) return '';
    if (path.length > 1) {
      return fetchFromTheme(theme[path[0]], path.slice(1));
    } else {
      return theme[path[0]];
    }
  };

  const get = (name: string) => {
    const SkinName = 'default';
    const base = skins.filter((item: any) => item.name === SkinName);
    if (base.length === 0) {
      console.error('皮肤配置错误');
      return '';
    }
    if (!base[0]?.part?.images) return '';
    return fetchFromTheme(base[0].part.images, name.split('.'));
  };

  return {
    get,
  };
};

export default useSkin;
