import { Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../contexts/ApiProvider.js";
import GameTable from "../components/GameTable.js";

export default function GameListPage() {
  const api = useApi();

  // Get the games
  const getGames = async () => {
    console.log("Get games from server...");
    const response = await api.get("/games");
    console.log("Check games:", response);
    if (response.ok) {
      // response.userId = api.getUserId();
      return response.data;
    } else {
      throw new Error("No games found");
    }
  };

  const { data: games } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
  });

  return (
    <Stack pt={0}>
      <h3>Game list</h3>
      <Text>Number of games: {games.length}</Text>
      <GameTable />
    </Stack>
  );
}
