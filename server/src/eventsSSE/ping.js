import { clients } from "../app.js";

let counter = 1;

export const ping = (res) => {
  const data = {
    message: "Connected",
    id: counter,
    clients: clients.length,
  };
  res.write("event: ping\n");
  res.write(`data: ${JSON.stringify(data)}\n`);
  res.write(`id: ${counter}\n`);
  res.write("test: just some data\n");
  res.write("\n\n");
  counter += 1;
};
