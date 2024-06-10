beforeEach(() => {
  cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
    fixture: 'ingredients.json'
  });
});

describe('template spec', () => {
  it('passes', () => {
    cy.visit('/');
  });
});
