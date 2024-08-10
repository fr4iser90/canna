const formatDate = (dateStr) => {
  if (dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]; // Only the date in YYYY-MM-DD format
    }
  }
  return dateStr; // Return the original string if it's not a valid date
};

const getDateString = (date) => {
  if (date && !isNaN(new Date(date).getTime())) {
    return new Date(date).toISOString().split("T")[0]; // Only the date in YYYY-MM-DD format
  }
  return date; // Return the original value if it's not a valid date
};

export { formatDate, getDateString };
