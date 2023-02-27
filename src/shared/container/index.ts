import createConnection from '@shared/infra/typeorm';
import { UsersRepository } from "@modules/users/infra/typeorm/repositories/UsersRepository";
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

class Container {
  private dependencies: Map<any, any> = new Map();

  register<T>(token: any, dependency: T) {
    this.dependencies.set(token, dependency);
  }

  resolve<T>(token: any): T {
    if (!this.dependencies.has(token)) {
      throw new Error(`Dependency '${token.name}' not found in container.`);
    }

    return this.dependencies.get(token);
  }
}

const container = new Container();

createConnection().then(async () => {
  container.register<IUsersRepository>("UsersRepository", new UsersRepository());
});

export default container;