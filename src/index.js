import 'bootstrap';
import { fetchLeagues, fetchTable } from './js/apiManager.js';
import { addCardToDOM, addModalToDom, loadTableModalBase } from './js/domManager.js';
import './scss/styles.scss';

const leagueCodes = ['39', '78'];
const standingsList = {};

const handleTableResponse = (standingsData, code) => {
  standingsList[code] = standingsData;
  localStorage.setItem('standings', JSON.stringify(standingsList));
  addModalToDom(code, standingsData.name, standingsData.standings[0]);
};

const addBtnEventListeners = () => {
  const btns = document.querySelectorAll('.open-table');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const leagueCode = btn.dataset.bsTarget.match(/(\d+)/)[0];
      const localStanding = JSON.parse(localStorage.getItem('standings'));
      if (localStorage.getItem('standings') && leagueCode in localStanding) {
        const currentStanding = localStanding[leagueCode];
        addModalToDom(leagueCode, currentStanding.name, currentStanding.standings[0]);
      } else {
        fetchTable(leagueCode).then((standingsData) => {
          handleTableResponse(standingsData, leagueCode);
        });
      }
    });
  });
};

const loadLocalLeagues = () => {
  const leagues = JSON.parse(localStorage.getItem('leagues'));
  leagues.forEach((data) => {
    addCardToDOM(data.league);
  });
  const spinner = document.querySelector('.spinner-border');
  spinner.classList.add('d-none');
  addBtnEventListeners();
};

loadTableModalBase(leagueCodes);

if (!localStorage.getItem('leagues')) {
  fetchLeagues(leagueCodes).then((leaguesData) => {
    leaguesData.forEach((data) => {
      addCardToDOM(data.league);
    });
    const spinner = document.querySelector('.spinner-border');
    spinner.classList.add('d-none');
    addBtnEventListeners();
    localStorage.setItem('leagues', JSON.stringify(leaguesData));
  });
} else {
  loadLocalLeagues();
}
