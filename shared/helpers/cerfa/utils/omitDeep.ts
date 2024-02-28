export const omitDeep = (obj: object, propertyToRemove: string): object => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => omitDeep(item, propertyToRemove));
  } else {
    const newObj = {};
    for (const key in obj) {
      if (key !== propertyToRemove) {
        // @ts-expect-error
        newObj[key] = omitDeep(obj[key], propertyToRemove);
      }
    }
    return newObj;
  }
};
