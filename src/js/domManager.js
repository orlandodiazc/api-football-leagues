const cardContainer = document.querySelector('.league-cards');
const cardTemplate = document.getElementById('card-template');
const modalTableTemplate = document.getElementById('modal-table-template');
const modalScorersTemplate = document.getElementById('modal-scorers-template');
const rowTableTemplate = document.getElementById('table-row-template');
const rowScorersTemplate = document.getElementById('table-scorers-row-template');

const loadBaseModals = (code) => {
  const modalTableClone = modalTableTemplate.content.cloneNode(true);
  const main = document.querySelector('main');
  modalTableClone.querySelector('.modal').setAttribute('id', `league${code}`);
  main.appendChild(modalTableClone);
  const modalScorersClone = modalScorersTemplate.content.cloneNode(true);
  modalScorersClone.querySelector('.modal').setAttribute('id', `scorers${code}`);
  main.appendChild(modalScorersClone);
};

const addCardToDOM = (currentCompetition) => {
  const cardClone = cardTemplate.content.cloneNode(true);
  cardClone.querySelector('.card-title').innerText = currentCompetition.league.name;
  cardClone.querySelector('.card-img-top').src = currentCompetition.league.logo;
  cardClone.querySelector('.country-name').innerText = currentCompetition.country.name;
  cardClone.querySelector('.country-flag').src = currentCompetition.country.flag;
  const code = currentCompetition.league.id;
  cardClone.querySelector('.open-table').dataset.bsTarget = `#league${code}`;
  cardClone.querySelector('.open-scorers').dataset.bsTarget = `#scorers${code}`;
  cardContainer.appendChild(cardClone);
  loadBaseModals(code);
};

const addTableModalToDom = (code, name, table) => {
  const modal = document.querySelector(`#league${code}`);
  table.forEach((row) => {
    const rowClone = rowTableTemplate.content.cloneNode(true);
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
    modal.querySelector('table').classList.remove('d-none');
    modal.querySelector('.spinner-border').classList.add('d-none');
  });

  modal.querySelector('.modal-title').innerText = name;
};

const addScorersModalToDom = (code, name, table) => {
  const modal = document.querySelector(`#scorers${code}`);
  table.forEach((row, i) => {
    const rowClone = rowScorersTemplate.content.cloneNode(true);
    rowClone.querySelector('.pos').innerText = i + 1;
    rowClone.querySelector('.player').innerText = row.player.name;
    rowClone.querySelector('.goals').innerText = row.statistics[0].goals.total;
    rowClone.querySelector('.assists').innerText = row.statistics[0].goals.assists;
    modal.querySelector('.table-body').appendChild(rowClone);
  });
  modal.querySelector('table').classList.remove('d-none');
  modal.querySelector('.spinner-border').classList.add('d-none');

  modal.querySelector('.modal-title').innerText = name;
};

export { addCardToDOM, addTableModalToDom, addScorersModalToDom };
