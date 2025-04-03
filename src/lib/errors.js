export class ValidationError extends Error {
  constructor(element, message) {
    super(message);
    this.name = 'ValidationError';
    this.element = element;
  }
}
