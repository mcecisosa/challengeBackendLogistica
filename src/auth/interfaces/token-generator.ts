export abstract class TokenGenerator {
  abstract sign(payload: Record<string, any>): string;
}
