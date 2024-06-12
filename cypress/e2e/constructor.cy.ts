const getIngredientsFixture = 'get_ingredients';
const postOrdersFixture = 'post_orders';
const getOrdersAllFixture = 'get_orders_all';

const url = (path: string) => `${Cypress.env('BURGER_API_URL')}/${path}`;

const ingredientsCategoryTitleCySelector =
  '*[data-cy="ingredients-category-title"]';
const burgerIngredientCySelector = '*[data-cy="burger-ingredient"]';
const constructorElementCySelector = '*[data-cy="constructor-element"]';
const burgerConstructorElementCySelector =
  '*[data-cy="burger-constructor-element"]';
const modalCySelector = '*[data-cy="modal"]';
const modalCloseButtonCySelector = '*[data-cy="modal-close-button"]';
const modalOverlayCySelector = '*[data-cy="modal-overlay"]';
const burgerConstructorCySelector = '*[data-cy="burger-constructor"]';

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
      cy.get(ingredientsCategoryTitleCySelector)
        .get(burgerIngredientCySelector)
        .as('ingredientsCategory');

      // добавляем булочку
      cy.get('@ingredientsCategory')
        .filter(`:contains("${buns[0].name}")`)
        .contains('Добавить')
        .click();

      // добавляем ингредиент
      cy.get('@ingredientsCategory')
        .filter(`:contains("${mains[0].name}")`)
        .contains('Добавить')
        .click();

      // проверяем, что булочка присутствует в количестве двух штук
      cy.get(constructorElementCySelector)
        .filter(`:contains("${buns[0].name}")`)
        .should('have.length', 2);

      // проверяем наличие ингредиента
      cy.get(burgerConstructorElementCySelector)
        .filter(`:contains("${mains[0].name}")`)
        .should('have.length', 1);
    });
  });
});

describe('Модальное окно ингредиента', () => {
  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.visit('/');

    cy.fixture(getIngredientsFixture).then(({ data }) => {
      cy.get(ingredientsCategoryTitleCySelector)
        .next()
        .contains(data[0].name)
        .as('ingredientCard');

      // откроем карточку ингредиента

      cy.get('@ingredientCard').click();

      // проверим, что открылась нужная карточка ингредиента
      cy.get(modalCySelector).as('modal');

      cy.get('@modal').should('exist');

      // модальное окно должно показывать правильный ингредиент
      cy.get('@modal').contains(data[0].name).should('exist');

      // должно работать закрытие по щелчку на кнопку закрытия
      cy.get('@modal').get(modalCloseButtonCySelector).click();

      cy.get('@modal').should('not.exist');

      // откроем карточку ингредиента заново

      cy.get('@ingredientCard').click();

      // проверим возможность закрытия по щелчку вне карточки
      cy.get(modalOverlayCySelector).click(0, 0, { force: true });

      cy.get('@modal').should('not.exist');
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
      cy.get(ingredientsCategoryTitleCySelector)
        .get(burgerIngredientCySelector)
        .as('ingredientsCategory');

      // щёлкаем по булке и одной начинке
      cy.get('@ingredientsCategory')
        .filter(`:contains("${buns[0].name}")`)
        .contains('Добавить')
        .click();

      cy.get('@ingredientsCategory')
        .filter(`:contains("${mains[0].name}")`)
        .contains('Добавить')
        .click();

      // находим раздел с составом заказа
      cy.get(burgerConstructorCySelector).as('constructor');

      // щёлкаем на оформление заказа
      cy.get('@constructor').contains('Оформить заказ').click();

      // находим модальное окно с отправленным заказом
      cy.get(modalCySelector).as('modal');

      cy.fixture(postOrdersFixture).then(({ order }) => {
        // проверяем, что оно содержит номер заказа
        cy.get('@modal').should('contain', `${order.number}`);

        // закрываем модальное окно и проверяем, что оно закрыто
        cy.get('@modal').get(modalCloseButtonCySelector).click();
        cy.get('@modal').should('not.exist');
      });

      // убеждаемся, что конструктор очищен
      cy.get('@constructor').contains('Выберите булки').should('exist');
      cy.get('@constructor').contains('Выберите начинку').should('exist');
    });

    cy.clearLocalStorage();
  });
});
