const currentDate = new Date();

export const formattedDate = currentDate.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
