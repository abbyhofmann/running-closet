import React from 'react';

/**
 * List of all the months of the year.
 */
const MONTHS: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Helper function to format the day of the month with leading zero if necessary.
 * It returns a string representing the day of the month with a leading zero if it's less than 10.
 *
 * @param date - The date object from which to extract the day.
 */
const getDateHelper = (date: Date): string => {
  const day = date.getDate();
  if (day < 10) {
    return `0${day}`;
  }
  return `${day}`;
};

/**
 * Helper function to get the day of the week from the given date.
 *
 * @param date - The date object from which to extract the day of the week.
 */
const getDayOfWeek = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Function to get a human-readable metadata string representing the time difference
 * between now and the given date.
 *
 * @param date - The date object to compare with the current date.
 */
const getMetaData = (date: Date): string => {
  const now = new Date();
  const diffs = Math.floor(Math.abs(now.getTime() - date.getTime()) / 1000);

  if (diffs < 60) {
    return `${diffs} seconds ago`;
  }
  if (diffs < 60 * 60) {
    return `${Math.floor(diffs / 60)} minutes ago`;
  }
  if (diffs < 60 * 60 * 24) {
    const h = Math.floor(diffs / 3600);
    return `${h} hours ago`;
  }
  if (diffs < 60 * 60 * 24 * 365) {
    return `${MONTHS[date.getMonth()]} ${getDateHelper(date)} at ${date
      .toTimeString()
      .slice(0, 8)}`;
  }
  return `${MONTHS[date.getMonth()]} ${getDateHelper(
    date,
  )}, ${date.getFullYear()} at ${date.toTimeString().slice(0, 8)}`;
};

/**
 * Function to format the date object into a human readable format where it says today if the message was sent today, the day of the week if the message
 * was sent in the last week or the full date if the message was sent more than a week ago. All of them include the time the message was sent at.
 * @param date the date object for the message sent
 * @returns the string for the date
 */
const getMessageDate = (date: Date): string => {
  const now = new Date();
  const diffs = Math.floor(Math.abs(now.getTime() - date.getTime()) / 1000);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  if (now.getDate() === date.getDate()) {
    return `Today at ${formattedTime}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${formattedTime}`;
  }

  if (diffs < 60 * 60 * 24 * 7) {
    return `${getDayOfWeek(date)} at ${formattedTime}`;
  }

  if (diffs < 60 * 60 * 24 * 365) {
    return `${MONTHS[date.getMonth()]} ${getDateHelper(date)} at ${formattedTime}`;
  }
  return `${MONTHS[date.getMonth()]} ${getDateHelper(
    date,
  )}, ${date.getFullYear()} at ${formattedTime}`;
};

/**
 * Validates the hyperlinks present in the given text. It checks that:
 * - Each hyperlink has non-empty text and URL components.
 * - The URL starts with "https://".
 * - The URL contains at least one character after the scheme.
 *
 * @param text - The input text containing potential hyperlinks.
 * @returns {boolean} - Returns `true` if all hyperlinks are valid,
 *                      otherwise returns `false`.
 */
const validateHyperlink = (text: string): boolean => {
  const hyperlinkPattern = /\[([^\]]*)\]\(([^)]*)\)/g;

  // Find all matches for hyperlinks in the text
  const matches = [...text.matchAll(hyperlinkPattern)];

  // If there are no matches, it's valid
  if (matches.length === 0) {
    return true;
  }

  // Check each match to see if the URL starts with https://
  for (const match of matches) {
    if (
      !match[1].length ||
      !match[2].length ||
      !match[2].startsWith('https://') ||
      !match[2].slice(8).length
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Function to validate hyperlinks within a given text.
 *
 * @param text - The text containing hyperlinks in the markdown format `[text](url)`.
 */
const handleHyperlink = (text: string) => {
  const pattern = /\[([^\]]*)\]\(([^)]*)\)/g;

  // Split the text into parts based on the pattern
  const parts = text.split(pattern);

  // Map through the parts to render the links and text
  const content = parts.map((part, index) => {
    // If the index is even, it's plain text
    if (index % 2 === 0) {
      return <span key={index}>{part}</span>;
    }
    // If the index is odd and it's the text for the link
    if (index % 2 === 1) {
      const href = parts[index + 1];
      return (
        <a key={index} href={href} target='_blank' rel='noopener noreferrer'>
          {part}
        </a>
      );
    }
    // If it's the href part, skip it (already handled)
    return null;
  });

  return <div>{content}</div>;
};

export { getMetaData, handleHyperlink, validateHyperlink, getMessageDate };
