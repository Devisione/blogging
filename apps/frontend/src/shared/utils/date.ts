import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

export function getHumanReadableDifference(dateA: Date, dateB: Date): string {
  const units = [
    { fn: differenceInYears, singular: "год", plural: ["года", "лет"] },
    {
      fn: differenceInMonths,
      singular: "месяц",
      plural: ["месяца", "месяцев"],
    },
    { fn: differenceInDays, singular: "день", plural: ["дня", "дней"] },
    { fn: differenceInHours, singular: "час", plural: ["часа", "часов"] },
    {
      fn: differenceInMinutes,
      singular: "минута",
      plural: ["минуты", "минут"],
    },
    {
      fn: differenceInSeconds,
      singular: "секунда",
      plural: ["секунды", "секунд"],
    },
  ];

  for (const unit of units) {
    const diff = Math.abs(unit.fn(dateA, dateB));
    if (diff > 0) {
      const word = getPlural(diff, unit.singular, [
        unit.plural[0],
        unit.plural[1],
      ]);
      return `${diff} ${word}`;
    }
  }

  return "только что";
}

function getPlural(
  n: number,
  singular: string,
  pluralForms: [string, string],
): string {
  // Простейшее склонение по русским правилам
  if (n % 10 === 1 && n % 100 !== 11) return singular;
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
    return pluralForms[0];
  return pluralForms[1];
}
