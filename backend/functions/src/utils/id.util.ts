import { nanoseconds } from ".";

export const generateId = (salt: number) => {
  const currentNano = nanoseconds();
  const last2digits = currentNano.substring(
      currentNano.length - 3,
      currentNano.length - 1
  );
  return salt + +last2digits;
};
