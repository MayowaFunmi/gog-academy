
export const createUniqueCode = () => {
  const letters = 'ABCDEFGHJKLMNPQRTUVWXY';
  const numbers = '23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 2; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
}