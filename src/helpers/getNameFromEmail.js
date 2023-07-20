import { title } from "radash";

export default function getNameFromEmail(email) {
  const namePart = email.split("@")[0];
  const name = title(namePart);
  console.log(name);
  return name;
}
