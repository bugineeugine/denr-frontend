import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const dateFormatter = (date: string | Dayjs | null | Date, format: string = 'YYYY-MM-DD h:mm') => {
  return dayjs(date).format(format);
};

export const dateFromNow = (date: string) => {
  return dayjs(date).fromNow();
};

export const isValidDate = (date: string): boolean => {
  return dayjs(date).isValid();
};

export const calculateAge = (birthdate: string | Dayjs | null | Date): number => {
  const birthDate = dayjs(birthdate);
  const today = dayjs();

  return today.diff(birthDate, 'year');
};
export const isValidFormat = (format: string): boolean => {
  try {
    // Subukan mag format ng sample date
    const sample = dayjs().format(format);
    return typeof sample === 'string' && sample.length > 0;
  } catch (e) {
    return false;
  }
};
