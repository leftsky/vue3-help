import dayjs from 'dayjs';

const useOnlineTime = (time: any) => {
  time = parseInt(time);
  const nowTime = Math.floor(new Date().getTime() / 1000);

  const oldTime = new Date(Number(time)).getTime();
  const timeDifference = nowTime - oldTime;
  const mouth = Math.floor(timeDifference / (30 * 24 * 3600));
  const day = Math.floor(timeDifference / (24 * 3600));
  const leave1 = timeDifference % (24 * 3600);
  const hours = Math.floor(leave1 / 3600);
  const leave2 = leave1 % 3600;
  const minutes = Math.floor(leave2 / 60);
  const leave3 = leave2 % 60;
  const seconds = Math.round(leave3);

  // 访客时间
  const visitorOnlineTime = () => {
    if (mouth > 12) {
      return '一年前';
    }
    if (mouth > 0) {
      return `${mouth}月前`;
    }
    if (day > 0) {
      return `${day}天前`;
    }
    if (hours > 0) {
      return `${hours}小时前`;
    }
    if (minutes > 0) {
      return `${minutes}分钟前`;
    }
    if (seconds > 0) {
      return `${seconds}秒前`;
    }
    return '刚刚';
  };

  // 发布识书时间
  const trendOnlineTime = (defaultDay = 0) => {
    if (day > defaultDay) {
      return `${dayjs(time * 1000).format("YYYY-MM-DD")}`;
      // return `${dayjs(time * 1000).format('YYYY/MM/DD HH:mm')}`
    }
    if (day > 0 && day <= defaultDay) {
      return `${day}天前`;  
    }
    if (hours > 0) {
      return `${hours}小时前`;
    }
    if (minutes > 0) {
      return `${minutes}分钟前`;
    }
    if (seconds > 0) {
      return `${seconds}秒前`;
    }
    return "刚刚";
  };
  // 互动识书时间
  const notifyTrendOnlineTime = () => {
    const nowYear = dayjs().format('YYYY');
    const oldYear = dayjs(time * 1000).format('YYYY');
    if (day > 3) {
      if (nowYear === oldYear) {
        return dayjs(time * 1000).format('MM月DD日 HH:mm');
      } else {
        return dayjs(time * 1000).format('YYYY年MM月DD日');
      }
    }
    if (day > 0 && day <= 3) {
      return `${day}天前`;
    }
    if (hours > 0) {
      return `${hours}小时前`;
    }
    if (minutes > 0) {
      return `${minutes}分钟前`;
    }
    if (seconds > 0) {
      return `${seconds}秒前`;
    }
    return '刚刚';
  };

  // 识书时间线格式
  const trendOnlineTimeStr = () => {
    const nowDay = dayjs().format('YYYY年MM月DD日');
    const oldDay = dayjs(time * 1000).format('YYYY年MM月DD日');
    if (day > 0 || nowDay !== oldDay) {
      return dayjs(time * 1000).format('YYYY年MM月DD日');
    }
    return '今天';
  };

  // 发布识书时间格式
  const trendPublishTime = () => {
    return `${dayjs(time * 1000).format('YYYY/MM/DD HH:mm')}`;
  };

  // 通知时间
  const noticeOnlineTime = () => {
    const nowYear = dayjs().format('YYYY');
    const oldYear = dayjs(time * 1000).format('YYYY');
    if (nowYear === oldYear) {
      return dayjs(time * 1000).format('MM月DD日 HH:mm');
    } else {
      return dayjs(time * 1000).format('YYYY年MM月DD日 HH:mm');
    }
  };
  // 用户距离时间
  const userCardOnlineTime = () => {
    let diffText = '刚刚来过这里';
    if (day > 0) {
      diffText = `${day}天内来过`;
    } else if (hours > 0) {
      diffText = `${hours}小时内来过`;
    } else if (minutes > 30) {
      diffText = '1小时内来过';
    } else if (minutes > 5) {
      diffText = '半小时内来过';
    }
    return diffText;
  };

  return {
    visitorOnlineTime,
    notifyTrendOnlineTime,
    trendOnlineTime,
    trendOnlineTimeStr,
    noticeOnlineTime,
    trendPublishTime,
    userCardOnlineTime,
  };
};

export default useOnlineTime;
