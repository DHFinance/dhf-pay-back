import { User } from "../user/entities/user.entity";
import { Stores } from "../stores/entities/stores.entity";
import e from "express";

/**
 * @description authorization occurs in this middleware. Some requests do not require a token. The token is obtained from Authorization. The token can belong to either the user or the store (apiKey)
 */
export const checkAuth = async (req, res, next) => {
  /**
   *  @description Authorization happens in the swagger interface, so authorization is not required for this request
   */
  if (req.originalUrl.includes('swagger')) {
    next();
  }
  /**
   *  @description The /api/auth endpoints are used without an account. Therefore, a token is not required for them.
   */
  else if (req.originalUrl.includes('auth')) {
    next();
  }
  /**
   * @description The bill page may contain unauthorized users who should have access to the store, transaction and payment associated with this receipt
   */
  else if (req.method === "GET" && (req.originalUrl.includes('store') || req.originalUrl.includes('payment') || req.originalUrl.includes('transaction'))) {
    next();
  }
  /**
   * @description Transactions are not created by unauthorized users on the bill page
   */
  else if (req.method === "POST" && req.originalUrl.includes('transaction')) {
    next();
  }
  /**
   * @description Only the admin has the authority to block and view users
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
   * @description For all other routes, the token is checked. The token can be owned by the user (token) or the store (apiKey). Depending on the token, the data selection changes. If an apiKey is entered in Authorization - for /payment and /transaction a selection is given for the store that owns this apiKey.
   */
  else if (req.headers.authorization) {
    /**
     * @description getting a token from the Bearer view s8sN4V475LqBdYYze3oZKVY4fyqozwKMBaN5 to the view s8sN4V475LqBdYYze3oZKVY4fyqozwKMBaN5
     */
    const token = req.headers.authorization.slice(7);
    /**
     * @description Search for users with this token
     */
    const existsUser = await User.findOne({
      where: {
        token: token,
        blocked: false,
      },
    });
    /**
     * @description Search for a store with this apiKey
     */
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
     * if token or apiKey found, skip request to controller
     * else return an error
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
