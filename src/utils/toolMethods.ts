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
};

export default toolMethods;
