const fixture = 'ingredients.json';

beforeEach(() => {
  cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
    fixture
  });
});

describe('Добавление ингредиентов', () => {
  it('добавляет ингредиенты в заказ', () => {
    cy.visit('/');

    cy.get('*[data-cy="ingredients-category-title"]')
      .contains('Булки')
      .next()
      .contains('Добавить')
      .click();

    cy.get('*[data-cy="ingredients-category-title"]')
      .contains('Начинки')
      .next()
      .contains('Добавить')
      .click();

    // cy.
  });
});
