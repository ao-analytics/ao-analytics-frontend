import { locale } from "$lib/utils";

export const standard_number_formatter = new Intl.NumberFormat(locale, {
  notation: "standard",
});

export const compact_number_formatter = new Intl.NumberFormat(locale, {
  notation: "compact",
});

export const narrow_relative_time_formatter = new Intl.RelativeTimeFormat(
  locale,
  {
    style: "narrow",
  },
);
