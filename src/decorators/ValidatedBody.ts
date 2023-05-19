import { ValidatorOptions } from "class-validator";
import { Body } from "routing-controllers";

export function ValidatedBody(options?: ValidatorOptions) {
  return Body({
    validate: {
      whitelist: true,
      forbidNonWhitelisted: true,
    },
    ...options,
  });
}
