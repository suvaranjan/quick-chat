export function formatDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Helper function to format time as "h:mm am/pm"
  function formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Helper function to format date as "dd/mm/yy"
  function formatDateAsDDMMYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  // Check if the date is today
  if (inputDate.toDateString() === today.toDateString()) {
    return formatTime(inputDate);
  }
  // Check if the date is yesterday
  else if (inputDate.toDateString() === yesterday.toDateString()) {
    return "yesterday";
  }
  // Otherwise, return formatted as "dd/mm/yy"
  else {
    return formatDateAsDDMMYY(inputDate);
  }
}
