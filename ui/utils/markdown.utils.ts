interface Link {
  linkText: string;
  href: string;
}

export const replaceLinks = (str: string) => {
  const regex = /(\[(.*?)\])(\((.*?)\))/gim;
  let m = regex.exec(str);

  if (!m) {
    return [str];
  }
  try {
    const parseResults: Array<string | Link> = [];
    let currentPos = 0;
    while (m !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        // eslint-disable-next-line no-plusplus
        regex.lastIndex++;
      }

      parseResults.push(str.substring(currentPos, m.index));
      parseResults.push({
        linkText: m[2],
        href: m[4],
      });
      currentPos = m.index + m[0].length;

      m = regex.exec(str);
    }
    if (currentPos < str.length) {
      parseResults.push(str.substring(currentPos, str.length));
    }
    return parseResults;
  } catch (error) {
    return [str];
  }
};
