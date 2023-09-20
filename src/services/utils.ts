import { join } from "path";

export const getRootPath = () => {
  return join(__dirname, "..", "..");
};
