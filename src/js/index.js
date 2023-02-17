import 'bootstrap';
import '../scss/styles.scss';

const cardContainer = document.querySelector('.league-cards');
const cardTemplate = document.getElementById('card-template');
const modalTemplate = document.getElementById('modal-template');
const rowTemplate = document.getElementById('table-row-template');

const myHeaders = new Headers();
myHeaders.append('X-Auth-Token', '7e1e415b0f674a85bcf4f6af1067aded');

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

const addCardToDOM = (currentCompetition) => {
  const cardClone = cardTemplate.content.cloneNode(true);
  cardClone.querySelector('.card-title').innerText = currentCompetition.name;
  cardClone.querySelector('img').src = currentCompetition.emblem;
  cardClone.querySelector('[data-bs-target]').dataset.bsTarget = `#${currentCompetition.code}`;
  cardContainer.appendChild(cardClone);
};

const leagueCodes = ['PL', 'BL1'];
// , 'SA', 'PD', 'FL1'

const leagueList = {};
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

const delay = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

const loadStandings = async () => {
  const standingsList = {};
  leagueCodes.forEach(async (code, i) => {
    const url = `${corsProxy}http://api.football-data.org/v4/competitions/${code}/standings`;
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    standingsList[code] = data;
    localStorage.setItem('leagueStandings', JSON.stringify(standingsList));
    await delay(10 * i);
  });
};

const loadLeagues = async () => {
  const url = `${corsProxy}http://api.football-data.org/v4/competitions`;
  const response = await fetch(url, requestOptions);
  console.log(...response.headers);
  const data = await response.json();
  leagueCodes.forEach((code) => {
    const currentComp = data.competitions.find((comp) => comp.code === code);
    leagueList[code] = currentComp;
    addCardToDOM(currentComp);
  });
  localStorage.setItem('leagues', JSON.stringify(leagueList));
  await delay(10);
};

const loadLocalLeagues = () => {
  const data = JSON.parse(localStorage.getItem('leagues'));
  Object.keys(data).forEach((code) => {
    addCardToDOM(data[code]);
  });
};

const addModalToDom = (code, name, table) => {
  const modalClone = modalTemplate.content.cloneNode(true);
  const main = document.querySelector('main');
  const colAttributes = [];

  table.forEach((el) => {
    const rowClone = rowTemplate.content.cloneNode(true);
    rowClone.querySelector('.pos').innerText = el.position;
    rowClone.querySelector('.team').innerText = el.team.shortName;
    rowClone.querySelector('.games').innerText = el.playedGames;
    rowClone.querySelector('.form').innerText = el.form;
    rowClone.querySelector('.won').innerText = el.won;
    rowClone.querySelector('.draw').innerText = el.draw;
    rowClone.querySelector('.lost').innerText = el.lost;
    rowClone.querySelector('.pts').innerText = el.points;
    rowClone.querySelector('.goal-for').innerText = el.goalsFor;
    rowClone.querySelector('.goal-against').innerText = el.goalsAgainst;
    rowClone.querySelector('.goal-dif').innerText = el.goalDifference;
    modalClone.querySelector('.table-body').appendChild(rowClone);
  });

  modalClone.querySelector('.modal-title').innerText = name;
  modalClone.querySelector('.modal').setAttribute('id', code);

  main.appendChild(modalClone);
};
const loadTableModal = () => {
  const data = JSON.parse(localStorage.getItem('leagueStandings'));
  Object.keys(data).forEach((code) => {
    const competitionName = data[code].competition.name;
    const standings = data[code].standings[0].table;
    addModalToDom(code, competitionName, standings);
  });
};

if (localStorage.getItem('leagueStandings')) {
  loadTableModal();
}

const loadScorers = async () => {
  const url = `${corsProxy}http://api.football-data.org/2006,2011/competitions`;
  const response = await fetch(url, requestOptions);
  console.log(...response.headers);
  const data = await response.json();
  console.log(data);
};

loadScorers();

if (!localStorage.getItem('leagues')) {
  loadLeagues();
} else {
  loadLocalLeagues();
}

// loadStandings();
