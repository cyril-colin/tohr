import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Environment } from '../environment.js';

export class LoginController {
  constructor(
    private env: Environment,
  ) {}

  login(req: express.Request, res: express.Response) {
    let response: any = 401;
    this.env.users.forEach((user: any) => {
      if (req.body.login === user.login && req.body.password === user.password) {
        response = { accessToken: jwt.sign({ username: req.body.login }, this.env.jwtSecret) };
      }
    });

    res.send(response);
  }
}
