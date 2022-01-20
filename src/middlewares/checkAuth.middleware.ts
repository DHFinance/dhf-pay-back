import { User } from "../user/entities/user.entity";
import { Stores } from "../stores/entities/stores.entity";

/**
 * авторизация пользователя
 */
export const checkAuth = async (req, res, next) => {
  console.log(req.originalUrl, req.originalUrl === '/api/swagger/')
  if (req.originalUrl.includes('/api/swagger/') || req.originalUrl === '/favicon.ico') {
    next();
  }
  /**
   * Эндпоинты /api/auth используются без аккаунта. Поэтому токен для них не требуется
   */
  else if (req.originalUrl.includes('/api/auth')) {
    next();
  }
  /**
   * На странице bill могут находиться неавторизованные пользователи, которые должны иметь доступ к store, transaction и payment, связанных с этим чеком
   */
  else if (req.method === "GET" && (req.originalUrl.includes('/api/store') || req.originalUrl.includes('/api/payment') || req.originalUrl.includes('/api/transaction'))) {
    next();
  }
  else if (req.method === "POST" && req.originalUrl.includes('/api/transaction')) {
    next();
  }
  else if (req.headers.authorization) {
    const token = req.headers.authorization.slice(7);
    const existsUser = await User.findOne({
      where: {
        token: token,
        blocked: false,
      },
    });
    const existsShop = await Stores.findOne({
      where: {
        apiKey: token,
        blocked: false,
      },
    });
    if (req.originalUrl.includes('block')) {
      const isAdmin = existsUser.role === "admin"
      if (isAdmin) {
        next();
      } else {
        res.status(403).send({
          statusCode: 403,
          error: 'only admin can block',
        });
      }
    }
    /**
     * если токен или apiKey найден, пропустить запрос в контроллер
     * иначе вернуть ошибку
     */
    if (existsUser || existsShop) {
      next();
    } else {
      res.status(401).send({
        statusCode: 401,
        error: 'token or apiKey not exist or blocked',
      });
    }
  }
  else {
    res.status(401).send({
      statusCode: 401,
      error: 'bearer token not found',
    });
  }
};
