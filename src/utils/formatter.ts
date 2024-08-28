import dayjs from 'dayjs';
import validate from './validate';

const formatter = {
  formatTime: (time: number, format: string): string => {
    if (time.toString().length < 13) {
      time = time * 1000;
    }
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    function formatNumber(n: number) {
      return n < 10 ? `0${n}` : n;
    }

    format = format.replace('yyyy', `${year}`);
    format = format.replace('MM', `${formatNumber(month)}`);
    format = format.replace('dd', `${formatNumber(day)}`);
    format = format.replace('hh', `${formatNumber(hour)}`);
    format = format.replace('mm', `${formatNumber(minute)}`);
    format = format.replace('ss', `${formatNumber(second)}`);
    return format;
  },
  toActivityDate: (time: number): string => {
    return formatter.dateFormat('MM-DD 周W hh:mm', time);
  },
  dateFormat: (fmt = 'YYYY-MM-DD', date: any = new Date()): string => {
    const time = new Date(date);
    const weekArr = ['日', '一', '二', '三', '四', '五', '六'];
    const o = {
      'M+': time.getMonth() + 1, // 月份
      'D+': time.getDate(), // 日
      'h+': time.getHours(), // 小时
      'm+': time.getMinutes(), // 分
      's+': time.getSeconds(), // 秒
      'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
      'S': time.getMilliseconds(), // 毫秒
      'W': time.getDay(), // 星期
    };
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1 == 'W' ? weekArr[o[k]] : RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  },
  // 格式化时间戳，使用方式参考https://baike.baidu.com/item/PHP%20Date/196299?fr=ge_ala
  date: (date: string | number, format: string): string => {
    // 如果是字符串，转换为number
    if (typeof date === 'string') date = new Date(date).getTime();
    // 判断时间戳是否是13位，如果不是则转换为13位
    if (date.toString().length < 13) date = date * 1000;
    const timeIns = new Date(date);
    // 替换Y为年
    format = format.replace(/Y+/, timeIns.getFullYear().toString());
    // 替换m为月，有前导0
    format = format.replace(/m+/, (timeIns.getMonth() + 1).toString().padStart(2, '0'));
    // 替换d为日，有前导0
    format = format.replace(/d+/, timeIns.getDate().toString().padStart(2, '0'));
    // 替换H为小时，有前导0
    format = format.replace(/H+/, timeIns.getHours().toString().padStart(2, '0'));
    // 替换i为分钟，有前导0
    format = format.replace(/i+/, timeIns.getMinutes().toString().padStart(2, '0'));
    // 替换s为秒，有前导0
    format = format.replace(/s+/, timeIns.getSeconds().toString().padStart(2, '0'));
    return format;
  },
  // 隐藏手机号码，保留手机号码前三位，后四位，其余使用*
  formatPhone: (phone: string): string => {
    return phone.toString().slice(0, 3).padEnd(7, '*') + phone.toString().slice(-4);
  },
  // 转换为可读数字
  parseNumber: (num: number) => {
    if (num < 10000) {
      return {
        num: num,
        unit: '',
      };
    } else if (num > 9999 && num < 100000000) {
      const count = (Math.floor(num / 1000) / 10).toFixed(1);
      if (count.charAt(count.length - 1) == '0') {
        return {
          num: count.substring(0, count.length - 2),
          unit: '万',
        };
      } else {
        return {
          num: count,
          unit: '万',
        };
      }
    } else if (num > 99999999) {
      return {
        num: '9999',
        unit: '万+',
      };
    } else {
      return {
        num: 0,
        unit: '',
      };
    }
  },
  // 手机号脱敏
  phoneHide: (phone: string): string => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  },
  // JSON toJsonParse
  jsonParse: (str: string): any => {
    try {
      return JSON.parse(str);
    } catch (error) {
      return str;
    }
  },
  // JSONToObject
  JSONToObject: (str: string): any => {
    if (!str || !validate.isJson(str)) {
      return str;
    }
    return JSON.parse(str);
  },
  // 切割选择地址选择出来的字符串
  splitAddress: (address: string) => {
    let province: string = '';
    let city: string = '';
    let area: string = '';
    // 切割出省市
    // 判断是否含有省
    if (address.indexOf('省') !== -1) {
      province = address.split('省')[0] + '省';
      address = address.substring(address.indexOf('省') + 1);
    }
    // 判断是否含有市
    if (address.indexOf('市') !== -1) {
      city = address.split('市')[0] + '市';
      address = address.substring(address.indexOf('市') + 1);
    }
    // 判断是否含有区
    if (address.indexOf('区') !== -1) {
      area = address.split('区')[0] + '区';
      address = address.substring(address.indexOf('区') + 1);
    }
    // 判断是否含有县
    if (address.indexOf('县') !== -1) {
      area = address.split('县')[0] + '县';
      address = address.substring(address.indexOf('县') + 1);
    }
    return {
      province,
      city,
      area,
      address,
    };
  },
  // qiniuUrlScale
  qiniuUrlScale: (uri: string, size: number): string => {
    const domainList = ['https://static.oss.chinnshi.com', 'https://dev.qiniu.imshini.com', 'https://test.oss.chinnshi.com', 'https://stage.oss.chinnshi.com', 'https://rod.oss.chinnshi.com'];
    // 如果 uri 中不含 domainList 中的域名, 则不处理
    if (!domainList.some((item) => uri.indexOf(item) !== -1)) return uri;
    // 如果 uri 不含 http 则不处理
    if (uri.indexOf('http') == -1) return uri;
    // 如果 uri 是以 blob: 开头的, 则不处理
    if (uri.indexOf('blob:') == 0) return uri;

    try {
      if (!uri) return '';
      let url = '';
      if (uri.indexOf('?') == -1) {
        url = uri;
      } else {
        url = uri.split('?')[0];
      }
      // 对视频首帧图的处理
      if (validate.isVideo(url)) {
        // 判断视频是不是有首帧参数 如果有则返回 没有则拼接参数
        return uri.includes('vframe') ? uri : url + '?vframe/jpg/offset/0';
      }
      return url + `?imageMogr2/auto-orient/interlace/1/thumbnail/${size}x`;
    } catch (error) {
      return '';
    }
  },
  qiniuUrlCustom: (uri: string | undefined | null, rule: string) => {
    try {
      if (!uri) return '';
      let url = '';
      if (uri.indexOf('?') == -1) {
        url = uri;
      } else {
        url = uri.split('?')[0];
      }
      return url + rule;
    } catch (error) {
      return uri || '';
    }
  },
  /**
   * 得到指定decimalPlaces位的数据
   * @param num
   * @param decimalPlaces
   * @returns
   */
  formatNumber: (num: number, decimalPlaces: number = 0) => {
    num = Number(num);
    const roundedNum = Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    const isInteger = roundedNum % 1 === 0;
    return isInteger ? roundedNum.toFixed(0) : roundedNum.toFixed(decimalPlaces);
  },
  /**
   * 时间差
   * @param timestamp1
   * @param timestamp2
   * @returns
   */
  getHourAndMinuteDifference: (timestamp1: any, timestamp2 = dayjs()) => {
    const date1 = dayjs(timestamp1);
    const date2 = dayjs(timestamp2);

    const diff = date1.diff(date2, 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return { hours, minutes };
  },
  // kb转换为M
  kbToM: (kb: number) => {
    return (kb / 1024 / 1024).toFixed(2);
  },
};

export default formatter;
