import { User } from "../user/entities/user.entity";
import { Stores } from "../stores/entities/stores.entity";

/**
 * авторизация пользователя
 */
export const checkAuth = async (req, res, next) => {
  if (req.originalUrl.includes('swagger')) {
    next();
  }
  /**
   * Эндпоинты /api/auth используются без аккаунта. Поэтому токен для них не требуется
   */
  else if (req.originalUrl.includes('auth')) {
    next();
  }
  /**
   * На странице bill могут находиться неавторизованные пользователи, которые должны иметь доступ к store, transaction и payment, связанных с этим чеком
   */
  else if (req.method === "GET" && (req.originalUrl.includes('store') || req.originalUrl.includes('payment') || req.originalUrl.includes('transaction'))) {
    next();
  }
  else if (req.method === "POST" && req.originalUrl.includes('transaction')) {
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
    if (req.originalUrl.includes('block') || req.originalUrl.includes('user')) {
      try {
        console.log(req.originalUrl)
        const isAdmin = existsUser.role === "admin"
        console.log(isAdmin)
        if (isAdmin) {
          console.log('next')
          next();
        } else {
          console.log('err')
          res.status(403).send({
            statusCode: 403,
            error: 'only admin can block',
          });
        }
      } catch (e) {
        console.log('admin action error:', e)
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
