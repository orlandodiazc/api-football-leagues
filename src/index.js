import { fetchLeagues, fetchScorers, fetchTable } from './js/apiManager.js';
import {
  addCardToDOM,
  addScorersModalToDom,
  addTableModalToDom,
  loadTableModalBase,
} from './js/domManager.js';
import './scss/styles.scss';

const leagueCodes = ['39', '78'];
const standingsList = {};
const scorersList = {};

const handleTableResponse = (standingsData, code) => {
  standingsList[code] = standingsData;
  localStorage.setItem('standings', JSON.stringify(standingsList));
  addTableModalToDom(code, standingsData.name, standingsData.standings[0]);
};

const handleScorersResponse = (scorersData, code) => {
  scorersList[code] = scorersData;
  localStorage.setItem('scorers', JSON.stringify(scorersList));
  addScorersModalToDom(code, scorersData[0].statistics[0].league.name, scorersData);
};

const addBtnEventListeners = () => {
  const btns = document.querySelectorAll('.open-table');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const leagueCode = btn.dataset.bsTarget.match(/(\d+)/)[0];
      const localStanding = JSON.parse(localStorage.getItem('standings'));
      if (localStorage.getItem('standings') && leagueCode in localStanding) {
        const currentStanding = localStanding[leagueCode];
        addTableModalToDom(leagueCode, currentStanding.name, currentStanding.standings[0]);
      } else {
        fetchTable(leagueCode).then((standingsData) => {
          handleTableResponse(standingsData, leagueCode);
        });
      }
    });
  });
};

const addBtnEventListenersScorers = () => {
  const btns = document.querySelectorAll('.open-scorers');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const leagueCode = btn.dataset.bsTarget.match(/(\d+)/)[0];
      const localScorers = JSON.parse(localStorage.getItem('scorers'));
      if (localStorage.getItem('scorers') && leagueCode in localScorers) {
        const currentScorers = localScorers[leagueCode];
        addScorersModalToDom(
          leagueCode,
          currentScorers[0].statistics[0].league.name,
          currentScorers,
        );
      } else {
        fetchScorers(leagueCode).then((scorersData) => {
          handleScorersResponse(scorersData, leagueCode);
        });
      }
    });
  });
};

const loadLocalLeagues = () => {
  const leagues = JSON.parse(localStorage.getItem('leagues'));
  leagues.forEach((data) => {
    addCardToDOM(data);
  });
  const spinner = document.querySelector('.spinner-border');
  spinner.classList.add('d-none');
  addBtnEventListeners();
  addBtnEventListenersScorers();
};

loadTableModalBase(leagueCodes);

if (!localStorage.getItem('leagues')) {
  fetchLeagues(leagueCodes).then((leaguesData) => {
    leaguesData.forEach((data) => {
      addCardToDOM(data);
    });
    const spinner = document.querySelector('.spinner-border');
    spinner.classList.add('d-none');
    addBtnEventListeners();
    addBtnEventListenersScorers();
    localStorage.setItem('leagues', JSON.stringify(leaguesData));
  });
} else {
  loadLocalLeagues();
}
