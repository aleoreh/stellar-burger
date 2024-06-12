const getIngredientsFixture = 'get_ingredients';
const postOrdersFixture = 'post_orders';
const getOrdersAllFixture = 'get_orders_all';

const url = (path: string) => `${Cypress.env('BURGER_API_URL')}/${path}`;

beforeEach(() => {
  cy.intercept('GET', url('ingredients'), {
    fixture: getIngredientsFixture
  });

  cy.intercept('POST', url('orders'), {
    fixture: postOrdersFixture
  });

  cy.intercept('GET', url('orders/all'), {
    fixture: getOrdersAllFixture
  });
});

describe('Добавление ингредиентов', () => {
  it('добавляет ингредиенты в конструктор', () => {
    cy.visit('/');

    cy.fixture(getIngredientsFixture).then(({ data }) => {
      const buns = data.filter(({ type }) => type === 'bun');
      const mains = data.filter(({ type }) => type === 'main');

      // получаем раздел ингредиентов
      const ingredientsCategoryCy = cy.get(
        '*[data-cy="ingredients-category-title"]'
      );

      // добавляем булочку
      ingredientsCategoryCy
        .get('*[data-cy="burger-ingredient"]')
        .filter(`:contains("${buns[0].name}")`)
        .contains('Добавить')
        .click();

      // добавляем ингредиент
      ingredientsCategoryCy
        .get('*[data-cy="burger-ingredient"]')
        .filter(`:contains("${mains[0].name}")`)
        .contains('Добавить')
        .click();

      // проверяем, что булочка присутствует в количестве двух штук
      cy.get('*[data-cy="constructor-element"]')
        .filter(`:contains("${buns[0].name}")`)
        .should('have.length', 2);

      // проверяем наличие ингредиента
      cy.get('*[data-cy="burger-constructor-element"]')
        .filter(`:contains("${mains[0].name}")`)
        .should('have.length', 1);
    });
  });
});

describe('Модальное окно ингредиента', () => {
  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.visit('/');

    cy.fixture(getIngredientsFixture).then(({ data }) => {
      const ingredientCy = cy
        .get('*[data-cy="ingredients-category-title"]')
        .next()
        .contains(data[0].name);

      // откроем карточку ингредиента

      ingredientCy.click();

      // проверим, что открылась нужная карточка ингредиента
      const modalCy1 = cy.get('*[data-cy="modal"]');

      modalCy1.should('exist');

      // модальное окно должно показывать правильный ингредиент
      modalCy1.contains(data[0].name).should('exist');

      // должно работать закрытие по щелчку на кнопку закрытия
      modalCy1.get('*[data-cy="modal-close-button"]').click();

      modalCy1.should('not.exist');

      // откроем карточку ингредиента заново

      ingredientCy.click();

      const modalCy2 = cy.get('*[data-cy="modal"]');

      // проверим возможность закрытия по щелчку вне карточки
      cy.get('*[data-cy="modal-overlay"]').click(0, 0, { force: true });

      modalCy2.should('not.exist');
    });
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
            email: 'test-user@example.com',
            name: 'test-user'
          })
        );
      }
    });

    cy.fixture(getIngredientsFixture).then(({ data }) => {
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
      const constructorCy = cy
        .get('*[data-cy="burger-constructor"]')
        .as('constructor');

      // щёлкаем на оформление заказа
      constructorCy.contains('Оформить заказ').click();

      // находим модальное окно с отправленным заказом
      const modalCy = cy.contains('идентификатор заказа').parent();

      cy.fixture(postOrdersFixture).then(({ order }) => {
        // проверяем, что оно содержит номер заказа
        modalCy.should('contain', `${order.number}`);

        // закрываем модальное окно и проверяем, что оно закрыто
        modalCy.get('*[data-cy="modal-close-button"]').click();
        modalCy.should('not.exist');
      });

      // убеждаемся, что конструктор очищен
      cy.get('@constructor').contains('Выберите булки').should('exist');
      cy.get('@constructor').contains('Выберите начинку').should('exist');
    });

    cy.clearLocalStorage();
  });
});
