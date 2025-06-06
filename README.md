"# WebProject25" 
https://flashcards.99-x.net/

Инструкция по сборке программы

 - Убедитесь, что у Вас установлены следующие программы : VsCode ; Node.js ;
 - После того, как Вы открыли программу у себя на компьютере, прежде чем её запустить,     введите следующие команды в терминале : npm install  затем  npm run dev ;
 - В случае, если терминал после команды  npm install выдает рекомендации по следующим командам - выполните его рекомендации ;
 - После установки npm появится папка node_modules - это каталог в проекте NodeJs. В нём хранятся библиотеки сторонних производителей и зависимости, без неё проект не запустить ;
 - Если Вы ввели команду  npm run dev  то Вы получите ссылку, по которой Вы можете перейти в приложение ;
 - Поздравляю ! Программа успешно запущена и готова к использованию !


Функциональность программы

В файле  src/components  представлены следующие программы : flashcards  , layout  , study , UI

FLASHCARDS
Общее предназначение
- Отображает форму для ввода данных карточки: вопрос (front), ответ (back), уровень сложности.
- Позволяет либо создать новую карточку, либо редактировать существующую.
- Внутри используют useState для управления значениями полей и ошибок.
- Взаимодействует с глобальным хранилищем через useFlashcardStore.
- При отправке валидирует данные и вызывает соответствующие функции для добавления или обновления карточки.
- Переворот карточки по клику с анимацией.
- Отображение вопроса и ответа.
- Визуальное разграничение сложности при помощи цветового ярлыка.
- Опциональные действия — редактировать и удалять карточку.
- Передача этих функций через пропсы (onEdit, onDelete).
- Получать и отображать список карточек, связанных с переданным groupId.
- Показывать счетчик карточек с правильным склонением (Card/Cards).
- Позволять пользователю добавить новую карточку.
- Предоставлять возможность редактировать и удалять существующие карточки.
- В случае отсутствия карточек выводить сообщение с подсказкой и кнопку для создания первой карточки.
- Возможность красиво оформить карточки. 

LAYOUT
- Автоматически меняет заголовок в зависимости от маршрута.
- Показывает кнопку "Назад" там, где это уместно.
- Обеспечивает быстрый доступ к основным разделам (домой, статистика, лидерборд, профиль) с интуитивной подсветкой активной иконки.

STUDY
- Показывает вопрос и ответ.
- Управляет состоянием переворота.
- Фиксирует результат пользователя (правильный или неправильный ответ), обеспечивая интерактивное обучение через флешкарты.

SRC/PAGES
AuthPage
Это страница авторизации с поддержкой входа и регистрации, включая валидацию данных, обработку ошибок и автоматическую навигацию после успешной авторизации. 

DashboardPage — это интерактивная панель управления со следующими функциями:
- Отображение текущего состояния изучения и мотивирующей статистики.
- Быстрый доступ к началу повторения флешкарт.
- Управление своими группами карточек — создание, редактирование, удаление.
- Гибкое отображение форм создания/редактирования.

GroupDetailsPage 
- показывает название и описание группы.
- управляет состояниями, связанными с созданием или редактированием карточек.
- отображает список карточек с возможностями их редактирования.
- включает функцию выбора цвета блока на основе свойства группы.

 LesderoardPage
- личное место текущего пользователя с подсказкой.
- список лучших пользователей с мемо-иконками для топ-3.
- выделение текущего пользователя в списке.
- сообщение о отсутствующих данных.

ProfilePage
- Идентификационные данные пользователя (иконка, имя, статус).
- Возможность выхода из аккаунта.
- Информационный блок о приложении, чтобы пользователи знали, чем занимается приложение и какие его преимущества.

StatisticsPage
- Представляет пользователю личную статистику по учебному прогрессу.
- количество карточек и групп.
- текущую последовательность дней обучения (streak).
- когда в последний раз он учился.
- и текущий уровень освоения карточек (mastery rate).

SRC/APP
В этом коде реализовано основное React-приложение с маршрутизацией, которое управляет навигацией между страницами с использованием react-router-dom.