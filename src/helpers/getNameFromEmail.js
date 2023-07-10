export default function getNameFromEmail(email) {
  const namePart = email.split("@")[0];
  const firstName = namePart.split(".")[0];
  const name = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  console.log(name);
  return name;
}
