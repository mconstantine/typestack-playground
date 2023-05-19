import Container from "typedi";
import { AuthTokenType, UserController } from "./UserController";
import { User } from "../entity/User";
import { initTestDatabase } from "../testUtils/initTestDatabase";

describe("UserController", () => {
  beforeAll(initTestDatabase);
  afterAll(() => User.clear());

  it("should be able to register users", async () => {
    const result = await Container.get(UserController).register({
      fullName: "Some name",
      email: "some.name@example.com",
      password: "S0meP4ssw0rd!",
    });

    expect(() =>
      UserController.verifyAuthToken(result.access, AuthTokenType.ACCESS)
    ).not.toThrow();

    expect(() =>
      UserController.verifyAuthToken(result.refresh, AuthTokenType.REFRESH)
    ).not.toThrow();
  });
});
