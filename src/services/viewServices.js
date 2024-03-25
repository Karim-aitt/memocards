export function truncateText(text, length) {
    if (text.length > length) {
      return text.slice(0, length +1) + "...";
    } else {
      return text;
    }
  }