
const validator = {
  // 判断是否是合法的URL
  isUrl: (path: string): boolean => {
    const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    return reg.test(path);
  },
  // 是否是手机号
  isPhone: (phone: string): boolean => {
    const reg = /^1\d{10}$/;
    return reg.test(phone);
  },
  // 是否是固定电话
  verifyLocalPhone: (localPhone: string): boolean => {
    const reg = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/;
    return reg.test(localPhone);
  },
  // 是否是邮箱
  verifyEmail: (email: string): boolean => {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
  },
  // 是否是可跳转URL
  isExternal: (path: string): boolean => {
    return /^(https?:|mailto:|tel:)/.test(path);
  },
  // 是否含有emoji
  hasEmoji(value: string): boolean {
    const reg =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return reg.test(value);
  },
  // 是否是图片
  isImage: (src: string): boolean => {
    return /\.(jpg|gif|png|jpeg|webp|svg|psd|bmp|tif)$/.test(src);
  },
  // 是否是视频
  isVideo: (src: string): boolean => {
    return /\.(mp4|ogg|mpeg|webm|wmv|rmvb|avi|flv|3gp)$/.test(src);
  },
  // 校验链接地址
  validateRegexUrl: (url: string): boolean => {
    const regex = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    );
    return regex.test(url);
  },
  isJson(str: any): boolean {
    if (typeof str === "string") {
      try {
        const obj = JSON.parse(str);
        return !!(typeof obj === "object" && obj);
      } catch (e) {
        return false;
      }
    }
    return false;
  },
  isValidPassword: (str) => {
    const regex = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    return regex.test(str);
  },
  defaultVfField(filed: any): boolean {
    if (filed === null || filed === undefined || filed === "") return false;
    // 如果是字符串
    if (typeof filed === "string") return filed.trim() !== "";
    return !!filed;
  },
  vfFiled(value: string, name: string, rule: Function = this.defaultVfField, showToast: boolean = true) {
    if (!rule(value)) {
      return `${name}不能为空`;
    }
    return true;
  },
};

export default validator;
