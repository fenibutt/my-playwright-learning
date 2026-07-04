# Page Objects — разбор для понимания

Этот документ объясняет каждый Page Object в папке `pages/`: зачем он нужен,
какие у него локаторы (поля) и что делает каждый метод.

## Что такое Page Object (POM)?

**Page Object Model** — это паттерн, где каждая страница сайта описывается
отдельным классом. Внутри класса лежат:

- **локаторы** — «адреса» элементов на странице (кнопки, поля ввода);
- **методы** — действия (кликнуть, заполнить) и проверки (`expect...`).

Зачем: тесты становятся короткими и читаемыми (`loginPage.login(...)` вместо
десятка `page.locator(...).click()`), а если на сайте поменяется вёрстка —
правим локатор в одном месте, а не во всех тестах.

### Общая структура любого класса здесь

```ts
export class SomePage {
  readonly page: Page;          // ссылка на вкладку браузера
  readonly someButton: Locator; // ОБЪЯВЛЕНИЕ поля (тип Locator)

  constructor(page: Page) {
    this.page = page;                                   // сохраняем page
    this.someButton = page.locator('[data-test="..."]'); // СОЗДАЁМ локатор
  }

  async doSomething() { ... } // действие
  async expectSomething() { ... } // проверка
}
```

- `readonly` — поле нельзя переприсвоить после конструктора (защита от ошибок).
- `Locator` — это не сам элемент, а «рецепт», как его найти. Playwright
  выполняет поиск лениво, в момент клика/проверки, с автоожиданием — поэтому
  хардвейты (`waitForTimeout`) не нужны.
- `[data-test="..."]` — семантический локатор по атрибуту `data-test`, который
  разработчики SauceDemo добавили специально для тестов. Он стабильнее, чем
  поиск по тексту или CSS-классам.

---

## LoginPage — страница входа

Файл: [LoginPage.ts](LoginPage.ts). Отвечает за `https://www.saucedemo.com/`.

### Локаторы

| Поле | Что это |
|------|---------|
| `usernameInput` | поле «Username» |
| `passwordInput` | поле «Password» |
| `loginButton` | кнопка «Login» |
| `errorMessage` | красный блок с текстом ошибки (появляется при неверном входе) |

### Методы

- **`goto()`** — открывает страницу логина. Использует `baseURL` из
  `playwright.config.ts`, поэтому в коде просто `page.goto('/')`.
- **`login(username, password)`** — заполняет оба поля и жмёт «Login». Главное
  действие страницы, его переиспользуют почти все остальные тесты в `beforeEach`.
- **`expectLoggedIn()`** — проверка, что вход удался: URL содержит `inventory`
  (нас перекинуло на страницу товаров).
- **`expectError(message)`** — проверка, что показана ожидаемая ошибка (например
  «this user has been locked out»).

---

## InventoryPage — страница товаров

Файл: [InventoryPage.ts](InventoryPage.ts). Главный экран после входа со списком
продуктов, корзиной и сортировкой.

### Локаторы

| Поле | Что это |
|------|---------|
| `cartBadge` | красный счётчик на иконке корзины (число товаров) |
| `cartLink` | иконка корзины (переход на страницу корзины) |
| `sortDropdown` | выпадающий список сортировки товаров |
| `itemNames` | названия всех товаров (список из нескольких элементов) |
| `itemPrices` | цены всех товаров (список из нескольких элементов) |

> `itemNames` и `itemPrices` находят **несколько** элементов сразу. У такого
> локатора есть методы `.allTextContents()`, `.count()`, `.nth(i)`.

### Методы

- **`addToCart(productSlug)`** — добавляет товар в корзину по его «slug»
  (например `sauce-labs-backpack`). Кнопка на сайте имеет id
  `add-to-cart-<slug>`, поэтому локатор собирается из шаблонной строки.
- **`removeFromCart(productSlug)`** — убирает товар из корзины (кнопка
  `remove-<slug>`).
- **`sortBy(option)`** — выбирает вариант сортировки. Коды: `az` (А→Я),
  `za` (Я→А), `lohi` (цена ↑), `hilo` (цена ↓).
- **`getPrices()`** — собирает **все цены со страницы как числа**. Берёт текст
  каждой цены (`"$9.99"`), убирает `$` и превращает в число (`9.99`). Нужен для
  теста сортировки, чтобы проверить, что массив цен отсортирован.
- **`openCart()`** — переходит на страницу корзины (клик по иконке).
- **`expectCartCount(count)`** — проверяет, что на бейдже нужное число.
- **`expectCartEmpty()`** — проверяет, что бейджа нет (корзина пуста). SauceDemo
  прячет бейдж целиком, когда товаров ноль.

---

## CartPage — страница корзины

Файл: [CartPage.ts](CartPage.ts). Открывается по клику на иконку корзины.

### Локаторы

| Поле | Что это |
|------|---------|
| `cartItems` | строки-товары в корзине (список) |
| `checkoutButton` | кнопка «Checkout» (перейти к оформлению) |
| `continueShoppingButton` | кнопка «Continue Shopping» (вернуться к товарам) |

### Методы

- **`removeFromCart(productSlug)`** — удаляет товар прямо со страницы корзины.
- **`checkout()`** — жмёт «Checkout», начинает оформление заказа.
- **`expectItemCount(count)`** — проверяет, сколько товаров в корзине
  (по количеству строк, а не по бейджу).
- **`expectItemVisible(name)`** — проверяет, что товар с таким названием виден
  в корзине (например «Sauce Labs Backpack»).

---

## CheckoutPage — оформление заказа

Файл: [CheckoutPage.ts](CheckoutPage.ts). Покрывает все три шага оформления:
1. форма с данными покупателя (имя/фамилия/индекс),
2. overview — обзор заказа,
3. confirmation — подтверждение «Thank you for your order!».

### Локаторы

| Поле | Что это | На каком шаге |
|------|---------|---------------|
| `firstNameInput` | поле «First Name» | шаг 1 |
| `lastNameInput` | поле «Last Name» | шаг 1 |
| `postalCodeInput` | поле «Zip/Postal Code» | шаг 1 |
| `continueButton` | кнопка «Continue» | шаг 1 |
| `errorMessage` | ошибка валидации формы | шаг 1 |
| `overviewItemNames` | названия товаров в обзоре заказа | шаг 2 |
| `finishButton` | кнопка «Finish» | шаг 2 |
| `completeHeader` | заголовок-подтверждение заказа | шаг 3 |

### Методы

- **`fillInformation(firstName, lastName, postalCode)`** — заполняет форму
  покупателя и жмёт «Continue» (переход к обзору).
- **`expectOverviewItem(name)`** — проверяет, что нужный товар присутствует в
  обзоре заказа перед оплатой.
- **`finish()`** — жмёт «Finish», завершает заказ.
- **`expectOrderComplete()`** — проверяет текст «Thank you for your order!».
- **`expectError(message)`** — проверяет ошибку валидации (например «First Name
  is required», если не заполнить имя).

---

## Как это связано с тестами

Тесты в `tests/` не знают про локаторы — они работают только через методы
Page Object'ов. Типичный сценарий:

```ts
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(standardUser.username, standardUser.password);
await loginPage.expectLoggedIn();
```

Данные (юзеры, товары, тексты ошибок) лежат отдельно в
[../test-data/users.ts](../test-data/users.ts), чтобы не хардкодить их в тестах.
