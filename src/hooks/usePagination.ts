// paginationOptions.ts

// 全量配置项
import { computed, ref } from 'vue';
import utils from '../utils';

interface paginationOptions {
  // 请求api【必须】
  api: (params?: any) => Promise<any>;
  // 初始化默认参数
  initParams: any;
  // 请求参数：每页数量参数名
  pageSizeParam: string;
  // 请求参数：每页数量
  pageSize: number;
  // 请求参数：页码参数名
  pageNumParam: string;
  // 数据列表字段名【用于从返回数据中获取数据列表】
  dataListName: string;
  // 处理数据项【支持对每一项数据进行预处理】
  dataItemDeal: Function;
  // 数据过滤【支持对每一项数据进行过滤，执行顺序在处理数据项后】
  dataFilter: Function;
  // 数据主键【用于更新时对比】
  primaryKey: string;
  // 是否自动缓存下一页数据，【请在initParams不变的情况下使用】
  autoCacheNextPage: boolean;
  // 是否在第一次请求时缓存下一页数据
  cacheNextPageAtFirst: boolean;
  // 是否自动将数据内部的图片送去缓存
  autoCacheImg: boolean;
}

// 传入配置项，修改为全部可选
export type partPaginationOptions = Partial<paginationOptions>;

// 默认配置项
const defaultOptions: paginationOptions = {
  api: () => {
    return new Promise((resolve) => {
      resolve(true);
    });
  },
  initParams: {},
  pageSizeParam: 'size',
  pageSize: 10,
  pageNumParam: 'page',
  dataListName: 'data',
  dataItemDeal: (item: any) => {
    return item;
  },
  dataFilter: (item: any) => {
    return item;
  },
  primaryKey: 'id',
  autoCacheNextPage: true,
  cacheNextPageAtFirst: true,
  autoCacheImg: true,
};

interface updateOptions {
  // 获取数据项的方法
  fetchFun: Function;
  // 更新数据项的方法
  updateFun: Function;
}

const usePagination = (inOptions: partPaginationOptions) => {
  const options = Object.assign({}, defaultOptions, inOptions);
  // 数据列表
  const fullList: any = ref([]);
  // 当前页码
  let curPage = 1;
  // 是否已经全部拉取完毕
  const isComplete = ref(false);
  // 是否正在请求
  const requesting = ref(false);
  // 加载状态
  const loadStatus = computed(() => {
    if (requesting.value) return 'loading';
    if (isComplete.value) return 'no-more';
    return 'more';
  });
  // 缓存下一页数据
  let cachePageData: any = null;
  let totalNum: string | number = 0;

  // 设置fullList
  const setFullList = (newList: any) => {
    // 如果有主键，则去重
    if (newList.length > 0 && newList[0][options.primaryKey]) {
      newList = newList.filter((item: any, index: number) => {
        return newList.findIndex((i: any) => i[options.primaryKey] === item[options.primaryKey]) === index;
      });
    }
    fullList.value = newList;
  };

  // 更新数据；isDelete为true时，删除数据
  const updateItem = (item: any, isDelete = false) => {
    if (!item) return false;
    const cbs: updateOptions = {
      fetchFun: item?.fetchFun
        ? item?.fetchFun
        : (each: any) => {
          return each[options.primaryKey] === item[options.primaryKey];
        },
      updateFun: item?.updateFun ? item?.updateFun : () => item,
    };

    const index = fullList.value.findIndex((i: any) => cbs.fetchFun(i));
    if (index !== -1) {
      const afterItem = isDelete ? null : cbs.updateFun(fullList.value[index]);
      if (afterItem) {
        fullList.value.splice(index, 1, afterItem);
      } else {
        fullList.value.splice(index, 1);
      }
    }
    return true;
  };

  const cacheNextPage = (inParams: any = {}) => {
    if (!options.autoCacheNextPage) return;
    cachePageData = null;
    totalNum = 0;
    const params = Object.assign({}, options.initParams, inParams);
    params[options.pageSizeParam] = options.pageSize;
    params[options.pageNumParam] = curPage;
    options.api(params).then((res: any) => {
      cachePageData = dealData(res);
      totalNum = res.total || res.count;
    });
  };

  options.cacheNextPageAtFirst && cacheNextPage();

  // 从缓存中或者直接请求下一页数据
  const getNextPageData = (params: any) => {
    return new Promise(async (resolve, reject) => {
      if (options.autoCacheNextPage) {
        if (await utils.waitAlive(() => cachePageData, 0.5)) {
          return resolve(cachePageData);
        }
      }
      // 这里不用else，因为当上面失败时，会继续执行下面的请求
      options
        .api(params)
        .then((res: any) => {
          resolve(dealData(res));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };

  const dealData = (res: any) => {
    // 拉取数据列表
    let dataList = options.dataListName === 'self' ? res : res[options.dataListName];
    // 如果数据列表字段名错误，则直接返回
    if (!dataList) {
      console.error('数据列表字段名错误', res, options);
      return false;
    }
    // 对每一项数据进行处理
    dataList = dataList.map((item: any) => {
      return options.dataItemDeal(item);
    });
    // 过滤数据列表
    dataList = dataList.filter((item: any) => {
      return options.dataFilter(item);
    });
    return dataList;
  };

  // 刷新加入头部最新信息
  const joinHead = (inParams: any = {}) => {
    const params = Object.assign({}, options.initParams, inParams);
    params[options.pageSizeParam] = options.pageSize;
    params[options.pageNumParam] = 1;
    options.api(params).then((res: any) => {
      const dataList = dealData(res);
      if (dataList === false) return;
      setFullList(dataList.concat(fullList.value));
    });
    return Object.assign({}, options.initParams, params);
  };

  const nextPage = (flush: boolean = false, inParams: any = null): Promise<boolean> => {
    if (flush) {
      // if (curPage !== 1) fullList.value = [];
      curPage = 1;
      cachePageData = null;
      isComplete.value = false;
      cacheNextPage(inParams);
    }
    return new Promise((resolve, reject) => {
      // 如果已经全部拉取完毕，则直接返回
      if (isComplete.value || requesting.value) {
        return resolve(false);
      }
      const params = Object.assign({}, options.initParams, inParams);
      params[options.pageSizeParam] = options.pageSize;
      params[options.pageNumParam] = curPage;
      getNextPageData(params)
        .then((res: any) => {
          // 拉取解析好的数据；如果解析失败，则直接返回
          if (res === false) return reject(false);
          // const totalPage = Math.ceil(~~totalNum / options.pageSize);
          // 如果拉取到的数据列表为空，则说明已经全部拉取完毕
          if (res.length < options.pageSize) {
            isComplete.value = true;
          } else {
            curPage++;
            cacheNextPage(inParams);
          }
          // 如果是刷新，则直接替换数据；否则追加数据
          setFullList(flush ? res : fullList.value.concat(res));
          resolve(true);
        })
        .finally(() => {
          requesting.value = false;
        });
    });
  };

  return {
    joinHead,
    nextPage,
    updateItem,
    fullList,
    isComplete,
    loadStatus,
  };
};

export default usePagination;
