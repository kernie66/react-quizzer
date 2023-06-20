import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Button } from "reactstrap";

export default function More({ pagination, loadNextPage }) {
  let thereAreMore = false;
  if (pagination) {
    const { offset, count, total } = pagination;
    thereAreMore = offset + count < total;
  }

  return (
    <div className="More">
      {thereAreMore &&
        <Button color="primary" outline onClick={loadNextPage}>
          More <FontAwesomeIcon icon={solid('angles-right')} className="ps-1" />
        </Button>
      }
    </div>
  )
}