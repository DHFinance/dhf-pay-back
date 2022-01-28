import { User } from "../user/entities/user.entity";
import { Stores } from "../stores/entities/stores.entity";
import e from "express";

/**
 * @description в этом middleware происходит авторизация. На некоторые запросы токен не нужен. Токен получается из Authorisation. Токен может пренадлежать либо пользователю, либо магазину (apiKey)
 */
export const checkAuth = async (req, res, next) => {
  /**
   *  @description Авторизация происходит в интерфейсе swagger, поэтому авторизация для этого запроса не требуется
   */
  if (req.originalUrl.includes('swagger')) {
    next();
  }
  /**
   *  @description Эндпоинты /api/auth используются без аккаунта. Поэтому токен для них не требуется
   */
  else if (req.originalUrl.includes('auth')) {
    next();
  }
  /**
   * @description На странице bill могут находиться неавторизованные пользователи, которые должны иметь доступ к store, transaction и payment, связанных с этим чеком
   */
  else if (req.method === "GET" && (req.originalUrl.includes('store') || req.originalUrl.includes('payment') || req.originalUrl.includes('transaction'))) {
    next();
  }
  /**
   * @description Транзакции на создаются неавторизованными пользователями на странице bill
   */
  else if (req.method === "POST" && req.originalUrl.includes('transaction')) {
    next();
  }
  /**
   * @description Полномочия на блокировку и просмотр пользователей есть только у админа
   */
  else if (req.originalUrl.includes('block') || req.originalUrl.includes('user')) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.slice(7);
      const admin = await User.findOne({
        where: {
          token: token,
          role: 'admin',
        },
      });
      if (admin) {
        next();
      } else {
        res.status(401).send({
          statusCode: 401,
          error: 'There is no admin with this token',
        });
      }
      } else {
      res.status(401).send({
        statusCode: 401,
        error: 'Token not found',
      });
    }
  }
  /**
   * @description Для всех остальных роутов проверяется токен. Токен может принадлежать пользователю (token) или магазину (apiKey). В зависимости от токена изменяется выборка данных. Если в Authorisation введен apiKey - для /payment и /transaction дается выборка по магазину, которому принадлежит этот apiKey.
   */
  else if (req.headers.authorization) {
    /**
     * @description получение токена из вида Bearer s8sN4V475LqBdYYze3oZKVY4fyqozwKMBaN5 к виду s8sN4V475LqBdYYze3oZKVY4fyqozwKMBaN5
     */
    const token = req.headers.authorization.slice(7);
    /**
     * @description Поиск пользователей с таким токеном
     */
    const existsUser = await User.findOne({
      where: {
        token: token,
        blocked: false,
      },
    });
    /**
     * @description Поиск магазина с таким apiKey
     */
    const existsShop = await Stores.findOne({
      where: {
        apiKey: token,
        blocked: false,
      },
    });
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
