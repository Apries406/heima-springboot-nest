# token
- token 在 login-guard 中拦截验证
- token 可以尝试 thread-local 中共享嘛？类似java springboot
- 在修改密码后，由于我们的`token`是 `id` + `username` 生成的，所以修改密码后不会影响到旧的`token`
 - 解决方案：
  - 登录成功后，给浏览器响应令牌到同时，存储到 redis 中
  - login-guard 验证时，从 redis 中获取令牌，并与浏览器中的令牌进行比对
  - 用户修改密码成功后，删除 redis 中的令牌，前端提示重新登录