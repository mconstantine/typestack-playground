import { IsEmail, MinLength } from "class-validator";
import { JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { ValidatedBody } from "../decorators/ValidatedBody";
import { hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { env } from "../env";

class SignUpBody {
  @MinLength(1)
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

export enum AuthTokenType {
  ACCESS = "Access",
  REFRESH = "Refresh",
}

interface AccessToken {
  id: string;
  iat: number;
  exp: number;
  sub: AuthTokenType.ACCESS;
}

interface RefreshToken {
  id: string;
  iat: number;
  exp: number;
  sub: AuthTokenType.REFRESH;
}

export type AuthToken = AccessToken | RefreshToken;

@JsonController("/users")
@Service()
export class UserController {
  @Post("/")
  async register(@ValidatedBody() data: SignUpBody): Promise<AuthTokens> {
    const passwordHash = hashSync(data.password);

    const user = await User.create({
      ...data,
      password: passwordHash,
    }).save();

    return this.generateAuthTokens(user);
  }

  static verifyAuthToken(
    authToken: string,
    type: AuthTokenType.ACCESS
  ): AccessToken;
  static verifyAuthToken(
    authToken: string,
    type: AuthTokenType.REFRESH
  ): RefreshToken;
  static verifyAuthToken(authToken: string, type: AuthTokenType): AuthToken {
    return verify(authToken, env.SECRET_TOKEN, {
      subject: type,
    }) as AuthToken;
  }

  private generateAuthTokens(user: User): AuthTokens {
    const accessToken = sign({ id: user.id }, env.SECRET_TOKEN, {
      expiresIn: "14d",
      subject: AuthTokenType.ACCESS,
    });

    const refreshToken = sign({ id: user.id }, env.SECRET_TOKEN, {
      expiresIn: "1y",
      subject: AuthTokenType.REFRESH,
    });

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }
}
