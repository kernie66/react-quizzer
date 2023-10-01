import { Link } from "react-router-dom";
import { Avatar } from "@mantine/core";

export default function QuizzerAvatar({ user, size = 48 }) {
  const remSize = size / 16;

  return (
    <Avatar
      src={user.avatarUrl + `&s=${size}`}
      size={remSize + "rem"}
      component={Link}
      to={"/user/" + user.id}
      maw="100%"
      mah="auto"
      m={8}
    />
  );
}
