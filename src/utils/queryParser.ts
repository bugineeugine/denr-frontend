import { createParser } from 'nuqs';
import { z } from 'zod';
const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getSortingStateParser = () => {
  return createParser({
    parse: value => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        return result.data;
      } catch {
        return null;
      }
    },
    serialize: value => {
      return JSON.stringify(value);
    },
    eq: (a, b) => a.length === b.length && a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc),
  });
};
