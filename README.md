# SpaceProject

Backend для мониторинга территорий с использованием спутниковых данных.

SpaceProject позволяет создавать географические территории, получать спутниковые наблюдения Sentinel-2 для выбранной области и анализировать их качество и состояние растительности.

## Возможности

- создание и хранение географических территорий;
- валидация GeoJSON и геометрий с помощью PostGIS;
- пространственный поиск территорий;
- расчёт площади территории;
- поиск спутниковых наблюдений Sentinel-2;
- фильтрация наблюдений по дате и облачности;
- расчёт покрытия территории спутниковой сценой;
- оценка качества спутниковых наблюдений;
- сохранение наблюдений в PostgreSQL;
- получение истории и статистики наблюдений;
- расчёт NDVI по выбранной территории и периоду.

## Стек

- **Node.js**
- **TypeScript**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **PostGIS**
- **Docker**
- **Copernicus Data Space Ecosystem**
- **Sentinel Hub Statistical API**
- **Swagger**

## Архитектура

Проект состоит из двух основных модулей:

### Areas

Отвечает за работу с географическими территориями:

- создание и получение территорий;
- проверка геометрии;
- пространственные операции PostGIS;
- расчёт площади;
- получение bounding box.

### Earth Observation

Отвечает за спутниковые наблюдения:

- поиск Sentinel-2 сцен;
- расчёт покрытия территории;
- оценку качества наблюдений;
- сохранение истории;
- статистику;
- расчёт NDVI.

## API

### Areas

```text
POST /areas
GET  /areas
```

Также доступны пространственные операции с территориями.

### Earth Observation

```text
POST /earth-observation/areas/:areaId/search
POST /earth-observation/areas/:areaId/best

GET /earth-observation/areas/:areaId/observations
GET /earth-observation/areas/:areaId/observations/statistics

POST /earth-observation/areas/:areaId/ndvi
```

## NDVI

NDVI (Normalized Difference Vegetation Index) используется для оценки состояния растительности по спутниковым данным.

SpaceProject получает значения красного и ближнего инфракрасного диапазонов Sentinel-2 и рассчитывает NDVI для выбранной территории.

Пример запроса:

```http
POST /earth-observation/areas/:areaId/ndvi
```

```json
{
    "from": "2026-08-01T00:00:00Z",
    "to": "2026-09-01T23:59:59Z"
}
```

Пример ответа:

```json
{
    "from": "2026-08-01T00:00:00Z",
    "to": "2026-09-01T23:59:59Z",
    "statistics": [
        {
            "date": "2026-08-02",
            "mean": 0.371,
            "min": -0.577,
            "max": 0.922,
            "stdDev": 0.275
        }
    ]
}
```

## Запуск проекта

### 1. Установить зависимости

```bash
npm install
```

### 2. Настроить переменные окружения

Создайте файл `.env` на основе `.env.example`.

Не добавляйте `.env` в Git.

### 3. Запустить PostgreSQL и PostGIS

```bash
docker compose up -d
```

### 4. Выполнить миграции

```bash
npm run migration:run
```

### 5. Запустить приложение

Для разработки:

```bash
npm run start:dev
```

После запуска API будет доступно по адресу:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api
```

> Если Swagger у тебя настроен на другой путь, замените `/api` на свой фактический путь.

## Переменные окружения

Пример необходимых переменных находится в `.env.example`.

Для работы со спутниковыми данными требуются учётные данные Copernicus Data Space.

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

COPERNICUS_CLIENT_ID=
COPERNICUS_CLIENT_SECRET=
```

## Работа с геоданными

Геометрии территорий передаются в формате GeoJSON.

Для пространственных операций используется **PostGIS** и система координат **WGS 84 (EPSG:4326)**.

В проекте используются, в частности:

- `ST_IsValid`
- `ST_Contains`
- `ST_Intersects`
- `ST_DWithin`
- `ST_Area`
- `ST_Intersection`
- `ST_Envelope`
- `ST_AsGeoJSON`

## Цель проекта

Проект создан как практический backend для работы с геоданными и спутниковыми наблюдениями.

Основная задача — объединить классический backend на NestJS с пространственными возможностями PostGIS и реальными данными Sentinel-2.
