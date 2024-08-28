interface EnumItem {
  name: string;
  description?: string;
  values: { no: number; value: string }[];
}

export interface EnumData {
  enums: EnumItem[];
}

let lastData: EnumData;

const useDictionary = (data: EnumData = lastData) => {

  if (data) lastData = data;

  const enums = data.enums;

  const enumChange = (name: string, number: number) => {
    const enumObj = enums.find((item) => item.name === name);
    if (enumObj) {
      const enumItem = enumObj.values.find((item) => item.no === number);
      return enumItem ? enumItem.value : '';
    }
    return '未知';
  };
  const enumChangeReverse = (name: string, value: string) => {
    const enumObj = enums.find((item) => item.name === name);
    if (enumObj) {
      const enumItem = enumObj.values.find((item) => item.value === value);
      return enumItem ? enumItem.no : 0;
    }
    return 0;
  };

  return {
    enumChange,
    enumChangeReverse,
  };
};

export default useDictionary;
