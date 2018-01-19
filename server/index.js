const cors = require('koa-cors');
const bodyparser = require('koa-bodyparser');
const router = require('./router.js');

const Koa = require('koa');
const app = new Koa();

app.use(cors())
  .use(bodyparser())
  .use(async (ctx, next) => {
    let authorization = ctx.headers.authorization;
    if (!authorization || authorization.split(' ')[0] != 'Bearer') return await next();
    ctx.token = authorization.split(' ')[1];
    ctx.user = await User.findOne({accessToken: ctx.token});
    return await next();
  })
  .use(router.routes())
  .listen(3000);