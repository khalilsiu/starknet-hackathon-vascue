import BigInt from "big-integer";
const loadNs = process.hrtime();
const loadMs = new Date().getTime();

export const nanoseconds = () => {
  const diffNs = process.hrtime(loadNs);
  return BigInt(loadMs)
      .times(1e6)
      .add(BigInt(diffNs[0]).times(1e9).plus(diffNs[1]))
      .toString();
};
