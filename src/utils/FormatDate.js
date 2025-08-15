export function DateFormat({ dateStr }) {
  const date = new Date(dateStr);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate;
}
