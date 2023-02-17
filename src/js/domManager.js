const cardContainer = document.querySelector('.league-cards');
const cardTemplate = document.getElementById('card-template');
const modalTemplate = document.getElementById('modal-template');
const rowTemplate = document.getElementById('table-row-template');

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

const loadTableModalBase = (leagueCodes) => {
  leagueCodes.forEach((code) => {
    const modalClone = modalTemplate.content.cloneNode(true);
    const main = document.querySelector('main');
    modalClone.querySelector('.modal').setAttribute('id', `league${code}`);
    main.appendChild(modalClone);
  });
};

export { addCardToDOM, loadTableModalBase, addModalToDom };
