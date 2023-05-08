export function TimestampAgo(day: number) {
   const today = new Date();
   // Get the current date of the month
   const currentDate = today.getDate();
   // Set the date of the month to the current date minus the number of days
   today.setDate(currentDate - day);
   // Return the timestamp in milliseconds of the modified date
   return today.getTime();
}