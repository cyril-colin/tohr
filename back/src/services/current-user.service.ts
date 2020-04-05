export interface CurrentUser {
  username: string;
}

export class CurrentUserService {
  constructor() { }

  getCurrentUser(req: any): CurrentUser {
    const auth = req.headers.authorization;
    if (!auth) {
      return null;
    }
    const jwt = auth.replace('Bearer ', '');
    if (!jwt || jwt === 'null') {
      return null
    }

    const b64 = Buffer.from(jwt.split('.')[1], 'base64').toString();
    const user =  JSON.parse(b64) as CurrentUser;

    return user;
  }

  getUsername(req: any): string {
    const currentUser = this.getCurrentUser(req);
    if (!currentUser) {
      return 'anonymous';
    } else {
      return currentUser.username;
    }
  }
}
