export const mergeWithParent = <T extends Record<string, any>>(
  data: T,
  parent?: T,
): T => {
  if (!parent) return data;

  return Object.keys(data).reduce(
    (acc, key) => {
      const k = key as keyof T;
      acc[k] = data[k] || parent[k];

      return acc;
    },
    { ...parent },
  );
};
