const routeConfig = require('./project/public/route');

async function dispatch(event, context) {
  const route = event.router; 
  const handlerInfo = routeConfig[route];
  if (!handlerInfo) {
    return { code: 404, msg: '路由未定义' };
  }
  // handlerInfo: 'comment_controller@like'
  const [controllerName, method] = handlerInfo.split('@');
  // 加载 controller
  let controller;
  try {
    controller = require(`./project/controller/${controllerName}.js`);
  } catch (e) {
    return { code: 500, msg: '控制器未找到' };
  }
  // 调用方法
  if (typeof controller[method] !== 'function') {
    return { code: 500, msg: '方法未找到' };
  }
  return await controller[method](event, context);
}

exports.main = async (event, context) => {
  return await dispatch(event, context);
};