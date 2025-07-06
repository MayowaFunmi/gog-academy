const env: string = process.env.NEXT_PUBLIC_ENV?.trim().toLowerCase() || "";


export const isLocalHost = () => env === "localhost";
export const isDev = () => env === "dev";
export const isProd = () => env === "prod";

export const getApiEndpoint = (): string => {
  if (isProd()) {
    return ""
  }
  return "http://localhost:3000"
}