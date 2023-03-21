export const asyncForEach = async (array: any[], callback: (item:any, index?: number, array?: any[]) => void) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
