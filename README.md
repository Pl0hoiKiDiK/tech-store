# Tech Store SPA

Учебное SPA-приложение интернет-магазина электроники: React, React Router, Redux Toolkit, RTK Query, Webpack (без Create React App).

**Live demo:** https://tech-store-mu-jet.vercel.app/

## Дизайн-макеты (Figma)

- [E-store — mobile & web](https://www.figma.com/community/file/1362344995738653261/e-store-mobile-web)
- [Login page](https://www.figma.com/community/file/1249321675959577741/login-page)

## Функциональность

- **Авторизация** — вход через [DummyJSON Auth API](https://dummyjson.com/docs/auth), защищённые маршруты, восстановление сессии
- **Каталог** — список товаров, поиск (`?q=`), фильтры по категории и цене, сортировка, пагинация
- **Карточка товара** — галерея, описание, характеристики из API, отзывы, похожие товары
- **Wishlist** — добавление/удаление, сохранение в `localStorage`
- **Корзина** — добавление товаров (состояние в Redux + `localStorage`)
- **Адаптивная вёрстка** — макет свёрстан под mobile (Figma: 375px и 390px); на tablet/desktop layout перестраивается через CSS media queries

### Страницы

| Маршрут | Описание |
|---------|----------|
| `/login` | Страница входа |
| `/catalog` | Каталог товаров (защищённый маршрут) |
| `/product/:id` | Детальная страница товара |

## Стек

React 18 · React Router 6 · Redux Toolkit · RTK Query · Webpack 5 · нативный CSS

## Зависимости

### Production

| Пакет | Назначение |
|-------|------------|
| `react`, `react-dom` | UI |
| `react-router-dom` | Маршрутизация |
| `@reduxjs/toolkit` | Store, slices, RTK Query |
| `react-redux` | Связка React ↔ Redux |

### Development

| Пакет | Назначение |
|-------|------------|
| `webpack`, `webpack-cli`, `webpack-dev-server`, `webpack-merge` | Сборка и dev-сервер |
| `babel-loader`, `@babel/core`, `@babel/preset-*` | Транспиляция JSX |
| `css-loader`, `style-loader`, `mini-css-extract-plugin` | CSS |
| `html-webpack-plugin` | HTML из шаблона |

## Запуск

```bash
git clone https://github.com/Pl0hoiKiDiK/tech-store.git
cd tech-store
npm install
npm start       # dev → http://localhost:3000
npm run build   # production → dist/
```

### Тестовые данные для входа

| Username | Password |
|----------|----------|
| `emilys` | `emilyspass` |
| `atuny0` | `9uQFF1Lh` |

## Структура проекта

```
src/
├── app/              # store, базовый RTK Query api
├── assets/           # иконки, изображения
├── components/       # переиспользуемые UI-компоненты
├── features/
│   ├── auth/         # логин, authSlice, authApi
│   ├── cart/         # корзина
│   ├── products/     # каталог, фильтры, карточка товара
│   ├── ui/           # toast-уведомления
│   └── wishlist/     # избранное
├── layouts/          # Header, Footer, MainLayout
├── routes/           # AppRoutes, PrivateRoute
└── styles/           # глобальные стили, CSS-переменные
```

## Деплой

Production-сборка: `npm run build` → `dist/`.

Хостинг: [Vercel](https://tech-store-mu-jet.vercel.app/) — конфигурация в `vercel.json` (SPA rewrite для React Router).

## Отличия от макета и API

Некоторые элементы макета не имеют аналогов в [DummyJSON API](https://dummyjson.com/docs/products):

| Элемент | Решение |
|---------|---------|
| Иконки корзины / wishlist в header | UI-элементы без отдельных страниц — показывается toast |
| Quick specs (ядра CPU, камера, батарея) | Статические значения; API их не отдаёт |
| Выбор цвета и объёма памяти | UI из макета, не привязан к API |
| Доп. фильтры (Battery capacity, Screen type…) | Аккордеоны с текстом «Coming soon» |
| Категории в фильтрах | Фиксированный список из четырёх категорий по макету |
| Footer-ссылки | Декоративные заглушки (`href="#"`) |
| Tablet / desktop | Отдельного макета нет — layout адаптируется через media queries |
