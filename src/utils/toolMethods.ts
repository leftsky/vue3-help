const toolMethods = {
  waitAlive: async (fn: Function, timeout: number = 0.5) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (fn()) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > timeout * 1000) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    });
  },
  jsonDeepCopy: (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  },
  // 生成数字数组
  generateNumberArray: (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  },
  // 获取时间差
  getDiffByDate(date: number): string {
    if (date >= 60 * 60 * 24) {
      return `${parseInt(String(date / (60 * 60 * 24)))}天前`;
    }
    if (date >= 60 * 60) {
      return `${parseInt(String(date / (60 * 60)))}小时前`;
    }
    if (date >= 60) {
      return `${parseInt(String(date / 60))}分钟前`;
    }
    return '';
  },
  // 两组经纬度计算两地距离
  // 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  getDistances: (latlng1: Array<number>, latlng2: Array<number>) => {
    const distancesMap = new Map();
    const distancesJoin = [latlng1, latlng2].join(',');
    let result = distancesMap.get(distancesJoin);
    if (result) return result;
    const [lat1, lng1] = latlng1;
    const [lat2, lng2] = latlng2;
    const EARTH_RADIUS = 6378.137; // 地球半径
    const radLat1 = (lat1 * Math.PI) / 180.0; // lat1 * Math.PI / 180.0=>弧度计算
    const radLat2 = (lat2 * Math.PI) / 180.0;
    const a = radLat1 - radLat2;
    const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; // 输出为公里
    result = { m: s * 1000, km: Number(s.toFixed(2)) };
    distancesMap.set(distancesJoin, result);
    return result;
  },
  // 等待方法，将执行 sec 秒
  sleep: (sec: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, sec * 1000);
    });
  },
  // 平均分配
  chunkArray: (array: Array<any> = [], chunkSize: number = 1) => {
    const result = [];
    if (!array.length || !chunkSize) return [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  },
  // 取商
  quotientMoreThanAdd: (divisor: number = 1, dividend: number = 1) => {
    return divisor % dividend == 0 ? divisor / dividend : Math.floor(divisor / dividend) + 1;
  },
  /**
   * 获取随机数
   * @param min 最小值
   * @param max 最大值
   * @param decimalPlaces 小数点位
   * @returns 随机数
   */
  getRandomNumber: (min: number, max: number, decimalPlaces: number = 0) => {
    const factor = Math.pow(10, decimalPlaces);
    const randomNum = Math.random() * (max - min) + min;
    return Math.floor(randomNum * factor) / factor;
  },
  // 对象转化成 URL 查询字符串形式进行页面传参
  getQueryStringFromObj: (obj: any) => {
    let queryStr = '';
    for (const key in obj) {
      if (queryStr !== '') {
        queryStr += '&';
      }
      const encodedKey = key;
      const encodedValue = obj[key];
      queryStr += `${encodedKey}=${encodedValue}`;
    }
    return queryStr;
  },
  // 生成一个uuid
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  qsStringify(obj: any) {
    const parts = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((val) => {
              parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            });
          } else {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          }
        } else {
          parts.push(encodeURIComponent(key));
        }
      }
    }
    return parts.join('&');
  },
  // 去掉 对象的假值
  removeFalsyValues(obj: { [key: string]: any }) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {} as { [key: string]: any },
    );
  },
  flattenTree(tree: any, childrenKey = 'children', idKey = 'id', isHoldFather = true) {
    let flatArray: any = [];
    tree.forEach((node: any) => {
      if (Array.isArray(node[childrenKey]) && node[childrenKey].length) {
        if (isHoldFather) flatArray.push(node);
        flatArray = flatArray.concat(
          this.flattenTree(
            node[childrenKey].map((i) => ({ ...i, [`father${idKey}`]: node[idKey] })),
            childrenKey,
          ),
        ); // 递归展开子节点
      } else {
        flatArray.push(node);
      }
    });
    return flatArray;
  },
  /**
   * @param num 数量
   * @param threshold 超过位数
   * @param replacement
   * @returns num || replacementText
   */
  replaceTextIfExceed(num: number, threshold: number, replacement: Function | string) {
    num = Math.floor(num);
    if (num.toString().length > threshold) {
      return typeof replacement === 'function' ? replacement(num) : replacement;
    } else {
      return num;
    }
  },
};

export default toolMethods;
