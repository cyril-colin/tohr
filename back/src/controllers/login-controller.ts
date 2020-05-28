import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Environment } from '../environment.js';
import { HttpUnauthorizedError } from '../core/errors';
import { Token } from '../core/public-models/token.js';

export class LoginController {
  constructor(
    private env: Environment,
  ) {}

  async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

    const user = this.env.users.find(u => req.body.login === u.login && req.body.password === u.password);
    if (!user) {
      return next(new HttpUnauthorizedError('invalid-credentials'));
    }
    const accessToken: Token = {accessToken: jwt.sign({ username: req.body.login }, this.env.jwtSecret)};
    return res.json(accessToken);
  }
}
