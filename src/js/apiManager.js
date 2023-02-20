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

const fetchLeagues = async (leagueCodes) => {
  const result = await Promise.all(
    leagueCodes.map(async (code) => {
      const url = `https://v3.football.api-sports.io/leagues?id=${code}`;
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.response[0];
    }),
  );
  return result;
};

export { fetchLeagues, fetchTable, fetchScorers };
