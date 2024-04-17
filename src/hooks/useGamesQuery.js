import { useQuery } from "@tanstack/react-query";
import { alphabetical } from "radash";
import { useApi } from "../contexts/ApiProvider";

export const useGamesQuery = (select, enabled) => {
  const api = useApi();

  let isEnabled = api.isAuthenticated();
  if (enabled !== undefined && isEnabled) {
    isEnabled = enabled;
  }

  // Get the list of games
  const getGames = async () => {
    console.log("Getting games from server...");
    const response = await api.get("/games");
    if (response.ok) {
      const games = alphabetical(response.data, (item) => item.id);
      return games;
    } else {
      Promise.reject("No games found");
    }
  };

  return useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
    select,
    enabled: isEnabled,
    staleTime: Infinity,
  });
};

// export const useGamesQuery = () => doGamesQuery();
