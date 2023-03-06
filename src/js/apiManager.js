const myHeaders = new Headers();
myHeaders.append('x-rapidapi-key', '11588e4db2b259eb583e66f97d257ac6');
myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

const fetchTable = async (code) => {
  const url = `https://v3.football.api-sports.io/standings?league=${code}&season=2022`;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data.response[0].league;
};

const fetchScorers = async (code) => {
  const url = `https://v3.football.api-sports.io/players/topscorers?league=${code}&season=2022`;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data.response;
};

const fetchLeagues = async () => {
  const url = 'https://v3.football.api-sports.io/leagues?type=league&season=2022&current=true';
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  const result = data.response.filter((league) => {
    const { coverage } = league.seasons[0];
    return (
      coverage.standings
      && coverage.players
      && coverage.top_scorers
      && coverage.top_assists
      && coverage.top_cards
      && coverage.injuries
      && coverage.predictions
      && coverage.odds
      && coverage.fixtures.events
      && coverage.fixtures.lineups
      && coverage.fixtures.statistics_fixtures
      && coverage.fixtures.statistics_players
    );
  });
  return result.splice(0, 10);
};

export { fetchLeagues, fetchTable, fetchScorers };
