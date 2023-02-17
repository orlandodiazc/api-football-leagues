import 'bootstrap';
import '../scss/styles.scss';

const cardContainer = document.querySelector('.league-cards');
const cardTemplate = document.getElementById('card-template');
const modalTemplate = document.getElementById('modal-template');
const rowTemplate = document.getElementById('table-row-template');

const leagueCodes = ['39', '78'];
const leagueList = {};
const standingsList = {};

const myHeaders = new Headers();
myHeaders.append('x-rapidapi-key', '11588e4db2b259eb583e66f97d257ac6');
myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

const addCardToDOM = (currentCompetition) => {
  const cardClone = cardTemplate.content.cloneNode(true);
  cardClone.querySelector('.card-title').innerText = currentCompetition.name;
  cardClone.querySelector('img').src = currentCompetition.logo;
  cardClone.querySelector('[data-bs-target]').dataset.bsTarget = `#league${currentCompetition.id}`;
  cardContainer.appendChild(cardClone);
};

const addModalToDom = (code, name, table) => {
  const modal = document.querySelector(`#league${code}`);
  table.forEach((row) => {
    const rowClone = rowTemplate.content.cloneNode(true);
    rowClone.querySelector('.pos').innerText = row.rank;
    rowClone.querySelector('.team').innerText = row.team.name;
    rowClone.querySelector('.games').innerText = row.all.played;
    const form = rowClone.querySelector('.form');
    row.form.split('').forEach((tag) => {
      const span = document.createElement('span');
      span.classList.add('badge');
      span.classList.add('me-1');
      span.innerText = tag;
      if (tag === 'W') {
        span.classList.add('text-bg-success');
      } else if (tag === 'L') {
        span.classList.add('text-bg-danger');
      } else {
        span.classList.add('text-bg-warning');
      }
      form.appendChild(span);
    });
    rowClone.querySelector('.won').innerText = row.all.win;
    rowClone.querySelector('.draw').innerText = row.all.draw;
    rowClone.querySelector('.lost').innerText = row.all.lose;
    rowClone.querySelector('.pts').innerText = row.points;
    rowClone.querySelector('.goal-for').innerText = row.all.goals.for;
    rowClone.querySelector('.goal-against').innerText = row.all.goals.against;
    rowClone.querySelector('.goal-dif').innerText = row.goalsDiff;

    modal.querySelector('.table-body').appendChild(rowClone);
  });

  modal.querySelector('.modal-title').innerText = name;
};

const fetchTable = async (code) => {
  const url = `https://v3.football.api-sports.io/standings?league=${code}&season=2022`;
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  standingsList[code] = data.response[0].league;
  localStorage.setItem('standings', JSON.stringify(standingsList));
  addModalToDom(code, data.response[0].league.name, data.response[0].league.standings[0]);
};

const addBtnEventListeners = () => {
  const btns = document.querySelectorAll('.open-table');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const leagueCode = btn.dataset.bsTarget.match(/(\d+)/)[0];
      if (localStorage.getItem('standings')) {
        const localStanding = JSON.parse(localStorage.getItem('standings'));
        if (leagueCode in localStanding) {
          const currentStanding = localStanding[leagueCode];
          addModalToDom(leagueCode, currentStanding.name, currentStanding.standings[0]);
          console.log('local');
        } else {
          fetchTable(leagueCode);
          console.log('api');
        }
      } else {
        fetchTable(leagueCode);
        console.log('api');
      }
    });
  });
};

const loadLeagues = async () => {
  await Promise.all(
    leagueCodes.map(async (code) => {
      const url = `https://v3.football.api-sports.io/leagues?id=${code}`;
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      addCardToDOM(data.response[0].league);
      console.log(data.response[0]);
      leagueList[code] = data.response[0];
    }),
  );
  localStorage.setItem('leagues', JSON.stringify(leagueList));
  addBtnEventListeners();
};

const loadLocalLeagues = () => {
  const data = JSON.parse(localStorage.getItem('leagues'));
  Object.keys(data).forEach((code) => {
    addCardToDOM(data[code].league);
  });
  addBtnEventListeners();
};

const loadTableModalBase = () => {
  leagueCodes.forEach((code) => {
    const modalClone = modalTemplate.content.cloneNode(true);
    const main = document.querySelector('main');
    modalClone.querySelector('.modal').setAttribute('id', `league${code}`);
    main.appendChild(modalClone);
  });
};
loadTableModalBase();

if (!localStorage.getItem('leagues')) {
  console.log('api');
  loadLeagues();
} else {
  loadLocalLeagues();
  console.log('local');
}
