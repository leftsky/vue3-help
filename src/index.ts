import hooksIndex from './hooks';
import utils from './utils';
import toolMethodsObj from './utils/toolMethods';

export const validate = utils.validate;
export const formatter = utils.formatter;
export const toolMethods = toolMethodsObj;
export const hooks = hooksIndex;

export const useDictionary = hooks.useDictionary;
export const usePagination = hooks.usePagination;
export const useOnlineTime = hooks.useOnlineTime;
export const useTouch = hooks.useTouch;
export const useSkin = hooks.useSkin;

export default {
  hooks: hooksIndex,
  utils,
};
