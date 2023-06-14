const { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, FORBIDDEN } =
  require("http-status-codes").StatusCodes;

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
    };
  }
}

class AccessError extends AppError {
  constructor(message) {
    super(message, FORBIDDEN);
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, UNAUTHORIZED);
  }
}

class DatabaseError extends AppError {
  constructor(message, error) {
    super(message, INTERNAL_SERVER_ERROR);
    this.error = error;
  }
}

class TokenError extends AppError {
  constructor(
    message,
    status,
    error = null,
    options = { clearCookie: true, isRefetchNeeded: false }
  ) {
    super(message, status);
    this.clearCookie = options.clearCookie;
    this.isRefetchNeeded = options.isRefetchNeeded;
    if (error) {
      this.error = error;
    }
  }

  toJSON() {
    const json = super.toJSON();
    json.isRefetchNeeded = this.isRefetchNeeded;
    return json;
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super("Validation failed", BAD_REQUEST);
    this.errors = errors;
  }

  toJSON() {
    const json = super.toJSON();
    json.errors = this.errors;
    return json;
  }
}

module.exports = {
  AppError,
  AccessError,
  AuthorizationError,
  DatabaseError,
  TokenError,
  ValidationError,
};
