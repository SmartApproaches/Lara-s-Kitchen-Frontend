const currentDate = new Date();

export const formattedTime = currentDate.toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});
