import { Link } from "react-router-dom";
import { Media } from "reactstrap";

const imgStyle = {
  maxWidth: "100%",
  maxHeight: "auto",
};

export default function Avatar({ user, size = 48 }) {
  return (
    <Media>
      <Link to={"/user/" + user.id}>
        <Media
          object
          src={user.avatarUrl + `&s=${size}`}
          alt={user.username}
          className="rounded-circle"
          style={imgStyle}
        />
      </Link>
    </Media>
  );
}
