import { useState, useEffect } from 'react';
import getTimeAgo from '../helpers/getTimeAgo';

const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

export default function TimeAgo({ isoDate }) {
  const date = new Date(Date.parse(isoDate));
  const [time, unit, interval] = getTimeAgo(date);
  const [, setUpdate] = useState(0);

  useEffect(() => {
    const timerId = setInterval(
      () => setUpdate(update => update + 1),
      interval * 1000
    );
    return () => clearInterval(timerId);
  }, [interval]); /* Depends on interval for re-render */

  return (
    <span title={date.toString()}>{rtf.format(time, unit)}</span>
  );
}