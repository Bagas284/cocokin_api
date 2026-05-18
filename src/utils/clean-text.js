const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .trim();
};

export default cleanText;