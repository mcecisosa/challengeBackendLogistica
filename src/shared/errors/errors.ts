export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class EntityNotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class InvalidCredentialError extends Error {
  constructor() {
    super('Invalid Credentials');
    this.name = 'InvalidCredentialError';
  }
}

export class BadRequestError extends Error {
  constructor(field: string, message?: string) {
    super(`Invalid ${field}. ${message}`);
    this.name = 'BadRequestError';
  }
}
