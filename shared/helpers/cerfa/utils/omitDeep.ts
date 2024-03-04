export const omitDeep = (obj: Record<string, any>, propertyToRemove: string): object => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => omitDeep(item, propertyToRemove));
  } else {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      if (key !== propertyToRemove) {
        newObj[key] = omitDeep(obj[key], propertyToRemove);
      }
    }
    return newObj;
  }
};
