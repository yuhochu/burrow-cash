import { useEffect, useRef } from "react";
// useEffect will fire on construct,
// this hook wont fire on construct

export const useDidUpdateEffect = (callback, inputs) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) callback();
    else didMountRef.current = true;
  }, inputs);
};
