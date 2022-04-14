interface AsyncIteratorFunction<T, U> {
  (value: T, index: number, array: T[]): Promise<U>;
}

interface AsyncReducerFunction<T, U> {
  (prevValue: U, currentValue: T, index: number, array: T[]): Promise<U>;
}

export const asyncMap = <T, U>(array: T[], mapper: AsyncIteratorFunction<T, U>): Promise<U[]> =>
  Promise.all(array.map(mapper));

export const asyncReduce = <T, U = T>(
  array: T[],
  reducer: AsyncReducerFunction<T, U>,
  initialValue: U,
): Promise<U> =>
  array.reduce(
    async (prevValue, currentValue, index, arr) => reducer(await prevValue, currentValue, index, arr),
    Promise.resolve(initialValue),
  );

export const asyncFind = <T>(array: T[], finder: AsyncIteratorFunction<T, boolean>): Promise<T | undefined> =>
  asyncReduce<T, T | undefined>(
    array,
    async (foundValue, currentValue, index, arr) =>
      foundValue || ((await finder(currentValue, index, arr)) ? currentValue : undefined),
    undefined,
  );

export const asyncIndexOf = <T>(array: T[], finder: AsyncIteratorFunction<T, boolean>): Promise<number> =>
  asyncReduce(
    array,
    async (foundIndex, currentValue, index, arr) => {
      if (foundIndex > -1) return foundIndex;
      return (await finder(currentValue, index, arr)) ? index : -1;
    },
    -1,
  );

export const asyncSome = <T>(array: T[], finder: AsyncIteratorFunction<T, boolean>): Promise<boolean> =>
  asyncReduce<T, boolean>(
    array,
    async (isAnyTrue, currentValue, index, arr) => isAnyTrue || await finder(currentValue, index, arr),
    false,
  );

export const asyncAll = async <T>(array: T[], finder: AsyncIteratorFunction<T, boolean>): Promise<boolean> =>
  !(await asyncSome(array, async (...args) => !(await finder(...args))));

export const asyncForEach = <T>(array: T[], func: AsyncIteratorFunction<T, void>): Promise<void> =>
  asyncReduce<T, void>(
    array,
    async (_dontCare, currentValue, index, arr) => {
      await func(currentValue, index, arr);
    },
    undefined,
  );
