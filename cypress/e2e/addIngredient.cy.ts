const fixture = 'ingredients.json';

beforeEach(() => {
  cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
    fixture
  });
});

describe('Добавление ингредиентов', () => {
  it('добавляет ингредиенты в заказ', () => {
    cy.visit('/');

    cy.fixture('ingredients').then(({ data }) => {
      const buns = data.filter(({ type }) => type === 'bun');
      const mains = data.filter(({ type }) => type === 'main');

      const ingredientsCategoryCy = cy.get(
        '*[data-cy="ingredients-category-title"]'
      );

      ingredientsCategoryCy
        .get('*[data-cy="burger-ingredient"]')
        .filter(`:contains("${buns[0].name}")`)
        .contains('Добавить')
        .click();

      ingredientsCategoryCy
        .get('*[data-cy="burger-ingredient"]')
        .filter(`:contains("${mains[0].name}")`)
        .contains('Добавить')
        .click();

      cy.get('*[data-cy="constructor-element"]')
        .filter(`:contains("${buns[0].name}")`)
        .should('have.length', 2);

      cy.get('*[data-cy="burger-constructor-element"]')
        .filter(`:contains("${mains[0].name}")`)
        .should('have.length', 1);
    });
  });
});
