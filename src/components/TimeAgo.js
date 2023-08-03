import { useState, useEffect } from "react";
import getTimeAgo from "../helpers/getTimeAgo";
import { useTranslation } from "react-i18next";

// const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

export default function TimeAgo({ isoDate }) {
  const date = new Date(Date.parse(isoDate));
  const [time, unit, interval] = getTimeAgo(date);
  const [, setUpdate] = useState(0);
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage);

  const rtf = new Intl.RelativeTimeFormat(language, { numeric: "auto" });

  useEffect(() => {
    const timerId = setInterval(() => setUpdate((update) => update + 1), interval * 1000);
    return () => clearInterval(timerId);
  }, [interval]); /* Depends on interval for re-render */

  useEffect(() => {
    setLanguage(i18n.resolvedLanguage);
  });

  return <span title={date.toString()}>{rtf.format(time, unit)}</span>;
}
