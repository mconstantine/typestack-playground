import { Service } from "typedi";
import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source";

interface InitialState {
  type: "initial";
}

interface InitializedState {
  type: "initialized";
  dataSource: DataSource;
}

type State = InitialState | InitializedState;

@Service()
export class Database {
  private state: State = Database.getInitialState();

  async use<T>(callback: (ds: DataSource) => Promise<T>) {
    switch (this.state.type) {
      case "initialized":
        return callback(this.state.dataSource);
      case "initial":
        return AppDataSource.initialize().then((dataSource) => {
          this.state = Database.getInitializedState(dataSource);
          return callback(dataSource);
        });
    }
  }

  async destroy(): Promise<void> {
    switch (this.state.type) {
      case "initial":
        return Promise.resolve();
      case "initialized":
        return this.state.dataSource.destroy().then(() => {
          this.state = Database.getInitialState();
        });
    }
  }

  async useOnce<T>(callback: (ds: DataSource) => Promise<T>): Promise<T> {
    const result = await this.use(callback);
    await this.destroy();
    return result;
  }

  private static getInitialState(): State {
    return { type: "initial" };
  }

  private static getInitializedState(dataSource: DataSource): State {
    return { type: "initialized", dataSource };
  }
}
