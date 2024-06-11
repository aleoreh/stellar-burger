const ingredientsFixture = 'ingredients.json';
const orderAnswer = 'order_answer.json';

beforeEach(() => {
  cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
    fixture: ingredientsFixture
  });

  // /api/orders/all

  // post https://norma.nomoreparties.space/api/orders
  // {"ingredients":["643d69a5c3f7b9001cfa093c","643d69a5c3f7b9001cfa0941","643d69a5c3f7b9001cfa093c"]}
  // {"success":true,"name":"Краторный био-марсианский бургер","order":{"number":3845}}
  cy.intercept('POST', `${Cypress.env('BURGER_API_URL')}/orders`, {
    fixture: orderAnswer
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

describe('Модальное окно ингредиента', () => {
  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.visit('/');

    const ingredientCy = cy
      .get('*[data-cy="ingredients-category-title"]')
      .get('*[data-cy="burger-ingredient"]')
      .first();

    // Закрытие по нажатию на кнопку

    ingredientCy.click();

    const modalCy1 = cy.contains('Детали ингредиента');

    modalCy1.should('exist');

    modalCy1.get('*[data-cy="modal-close-button"]').click();

    modalCy1.should('not.exist');

    // Закрытие по клику на оверлей

    ingredientCy.click();

    const modalCy2 = cy.contains('Детали ингредиента');

    modalCy1.should('exist');

    cy.get('*[data-cy="modal-overlay"]').click(0, 0, { force: true });

    modalCy1.should('not.exist');
  });
});

describe('Создание заказа', () => {
  before(() => {
    cy.setCookie('accessToken', 'accessToken');
  });

  after(() => {
    cy.clearCookies();
  });

  it('правильно создаёт заказ', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'refreshToken');
        win.localStorage.setItem(
          'user',
          JSON.stringify({
            email: 'user@example.com',
            name: 'user'
          })
        );
      }
    });

    cy.fixture('ingredients').then(({ data }) => {
      const buns = data.filter(({ type }) => type === 'bun');
      const mains = data.filter(({ type }) => type === 'main');

      // находим раздел с ингредиентами
      const ingredientsCategoryCy = cy.get(
        '*[data-cy="ingredients-category-title"]'
      );

      // щёлкаем по булке и одной начинке
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

      // находим раздел с составом заказа
      const constructorCy = cy.get('*[data-cy="burger-constructor"]');

      // щёлкаем на оформление заказа
      constructorCy.contains('Оформить заказ').click();

      // находим модальное окно с отправленным заказом
      const modalCy = cy.contains('идентификатор заказа').parent();

      // проверяем, что оно содержит номер заказа
      cy.fixture('order_answer').then(({ order }) => {
        modalCy.should('contain', `${order.number}`);
      });
    });

    cy.clearLocalStorage();
  });
});
