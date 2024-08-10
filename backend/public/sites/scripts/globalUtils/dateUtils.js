export const formatDate = (dateStr) => {
    if (dateStr) {
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0]; // Nur das Datum im Format YYYY-MM-DD
    }
    return null;
  };
  
  export const getDateString = (date) => {
    return new Date(date).toISOString().split("T")[0]; // Nur das Datum im Format YYYY-MM-DD
  };
  