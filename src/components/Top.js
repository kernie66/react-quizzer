import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Button } from "reactstrap";

export default function Top() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="Top">
      <Button color="primary" outline onClick={scrollToTop}>
        Top <FontAwesomeIcon icon={solid("angles-up")} className="ps-1" />
      </Button>
    </div>
  );
}
