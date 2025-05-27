const useOutfitCard = () => {
  // formats date string into format of "May 25, 2025 at 7:30 am"
  const formatDateTime = (date: string | Date) =>
    new Date(date)
      .toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .replace('AM', 'am')
      .replace('PM', 'pm');

  return { formatDateTime };
};

export default useOutfitCard;
