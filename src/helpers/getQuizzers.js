import { alphabetical, fork } from "radash";

export default async function getQuizzers(api, excludeId) {
  let quizzers = [];
  console.log("Excluding ID:", excludeId);
  const response = await api.get("/users");
  if (response.ok) {
    quizzers = alphabetical(response.data, (item) => item.name);
    if (excludeId) {
      const [, otherQuizzers] = fork(quizzers, (q) => q.id === excludeId);
      quizzers = otherQuizzers;
    }
    return quizzers;
  } else {
    throw new Error("No quizzers found");
  }
}
