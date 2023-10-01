import { Link } from "react-router-dom";
import { Avatar } from "@mantine/core";

const imgStyle = {
  maxWidth: "100%",
  maxHeight: "auto",
};

export default function QuizzerAvatar({ user, size = 48 }) {
  const remSize = size / 16;

  return (
    <Avatar
      src={user.avatarUrl + `&s=${size}`}
      size={remSize + "rem"}
      component={Link}
      to={"/user/" + user.id}
      style={imgStyle}
    />
  );
}
