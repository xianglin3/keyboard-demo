let event = {};

/**
 * 自定义事件监听 抛出到业务层使用
 * @param {string} type 事件类型
 * @param {function} callBack 事件回调
 */
const addEventListener = (type, callBack) => {
  if (!event.handlers) {
    Object.defineProperty(event, "handlers", {
      value: {},
      enumerable: false,
      configurable: true,
      writable: true
    })
  }
  if (!event.handlers[type]) {
    event.handlers[type] = [];
  }
  event.handlers[type].push(callBack);
};

//移除监听
function removeEventListener(type) {
  if (event.handlers) {
    if (event.handlers.hasOwnProperty(type)) {
      event.handlers[type] = [];
    }
  }
};

/**
 * 触发事件监听
 * @param {string} type 事件类型
 * @param {object} param 触发事件附带参数
 */
const dispatchEvent = (type, param) => {
  if (event.handlers) {
    if (event.handlers.hasOwnProperty(type)) {
      for (var i = 0; i < event.handlers[type].length; i++) {
        if (param) {
          event.handlers[type][i](param);
        } else {
          event.handlers[type][i]();
        }
      }
    }
  }
}

// 测试触发方法
const runTime = (val) => {
  console.warn(event)
  setTimeout(() => {
    dispatchEvent('TEST', val)
  }, 5000);
}

export default {
  addEventListener,
  removeEventListener,
  runTime,
}
