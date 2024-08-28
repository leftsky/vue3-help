import toolMethods from './toolMethods';
import validate from './validate';
import formatter from './formatter';

const utils = {
  formatter,
  validate,
  ...toolMethods,
};

export default utils;
