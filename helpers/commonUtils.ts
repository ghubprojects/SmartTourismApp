const capitalize = (input: string): string =>
  input ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() : input;

const formatDate = (inputDate: Date) => {
  const date = new Date(inputDate);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const CommonUtils = { capitalize, formatDate };
