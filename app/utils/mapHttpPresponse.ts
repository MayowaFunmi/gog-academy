export function mapHttpStatus(status: string): number {
  switch (status) {
    case "success":
      return 201;
    case "notFound":
      return 404;
    case "unauthorized":
      return 401;
    case "bad_request":
      return 400;
    case "conflict":
      return 409;
    case "validation_error":
      return 422;
    case "error":
    default:
      return 500;
  }
}