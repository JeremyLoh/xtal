# xtal backend documentation

## Summary

- [Introduction](#introduction)
- [Database Type](#database-type)
- [Table Structure](#table-structure)
  - [podcast_images](#podcast_images)
  - [users](#users)
  - [podcast_episodes](#podcast_episodes)
  - [podcast_episode_play_history](#podcast_episode_play_history)
  - [podcasts](#podcasts)
  - [podcast_categories](#podcast_categories)
  - [podcast_followers](#podcast_followers)
  - [categories](#categories)
- [Relationships](#relationships)
- [Database Diagram](#database-diagram)

## Introduction

## Database type

- **Database system:** PostgreSQL

## Table structure

### podcast_images

| Name                             | Type        | Settings                 | References | Note |
| -------------------------------- | ----------- | ------------------------ | ---------- | ---- |
| **image_width_image_height_url** | TEXT        | 🔑 PK, not null, unique  |            |      |
| **created_at**                   | TIMESTAMPTZ | not null, default: now() |            |      |
| **storage_file_path**            | TEXT        | not null, unique         |            |      |

### users

| Name           | Type         | Settings                 | References                         | Note |
| -------------- | ------------ | ------------------------ | ---------------------------------- | ---- |
| **user_id**    | VARCHAR(255) | 🔑 PK, not null, unique  | fk_users_user_id_podcast_followers |      |
| **email**      | TEXT         | null                     |                                    |      |
| **created_at** | TIMESTAMPTZ  | not null, default: now() |                                    |      |
| **username**   | TEXT         | not null, unique         |                                    |      |

### podcast_episodes

primary key "id" is autoincremented (do not rely on PodcastIndex episode ID, that is external and may change)
description is not stored, could be changed by API as well
| Name | Type | Settings | References | Note |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | INTEGER | 🔑 PK, not null, unique, autoincrement | | |
| **episode_id** | SERIAL | not null | | |
| **podcast_id** | SERIAL | not null | | |
| **episode_title** | TEXT | not null | | |
| **podcast_title** | TEXT | not null | | |
| **content_url** | TEXT | not null | | |
| **duration_in_seconds** | INTEGER | not null | | |
| **publish_date_unix_timestamp** | TIMESTAMP | not null | | |
| **is_explicit** | BOOLEAN | not null | | |
| **episode_number** | INTEGER | null | | |
| **season_number** | INTEGER | null | | |
| **image** | TEXT | null | | |
| **language** | TEXT | null | | |
| **external_website_url** | TEXT | null | | |

### podcast_episode_play_history

| Name                            | Type         | Settings                 | References                                                          | Note |
| ------------------------------- | ------------ | ------------------------ | ------------------------------------------------------------------- | ---- |
| **user_id**                     | VARCHAR(255) | 🔑 PK, not null, unique  | fk_podcast_episode_play_history_user_id_users                       |      |
| **podcast_episode_id**          | INTEGER      | 🔑 PK, not null          | fk_podcast_episode_play_history_podcast_episode_id_podcast_episodes |      |
| **last_played_timestamp**       | TIMESTAMPTZ  | not null, default: now() |                                                                     |      |
| **resume_play_time_in_seconds** | INTEGER      | null                     |                                                                     |      |

### podcasts

Tracks podcast information
| Name | Type | Settings | References | Note |
|-------------|---------------|-------------------------------|-------------------------------|--------------------------------|
| **id** | SERIAL | 🔑 PK, not null, unique | | |
| **podcast_id** | SERIAL | not null, unique | | |
| **external_website_url** | TEXT | null | | |
| **title** | TEXT | not null | | |
| **author** | TEXT | null | | |
| **image** | TEXT | null | | |
| **language** | TEXT | null | | |
| **publish_date_unix_timestamp** | TIMESTAMP | null | | |
| **episode_count** | INTEGER | null | | |
| **created_at** | TIMESTAMPTZ | not null, default: now() | | |

### podcast_categories

| Name            | Type        | Settings                | References                                   | Note |
| --------------- | ----------- | ----------------------- | -------------------------------------------- | ---- |
| **podcast_id**  | SERIAL      | 🔑 PK, not null, unique | fk_podcast_categories_podcast_id_podcasts    |      |
| **category_id** | SERIAL      | 🔑 PK, not null, unique | fk_podcast_categories_category_id_categories |      |
| **created_at**  | TIMESTAMPTZ | not null                |                                              |      |

### podcast_followers

| Name           | Type         | Settings        | References                               | Note |
| -------------- | ------------ | --------------- | ---------------------------------------- | ---- |
| **user_id**    | VARCHAR(255) | 🔑 PK, not null |                                          |      |
| **podcast_id** | SERIAL       | 🔑 PK, not null | fk_podcast_followers_podcast_id_podcasts |      |
| **created_at** | TIMESTAMPTZ  | not null        |                                          |      |

### categories

| Name           | Type        | Settings                | References | Note |
| -------------- | ----------- | ----------------------- | ---------- | ---- |
| **id**         | SERIAL      | 🔑 PK, not null, unique |            |      |
| **category**   | TEXT        | not null                |            |      |
| **created_at** | TIMESTAMPTZ | not null                |            |      |

## Relationships

- **podcast_episode_play_history to users**: many_to_one
- **podcast_episode_play_history to podcast_episodes**: many_to_one
- **users to podcast_followers**: many_to_one
- **podcast_categories to categories**: many_to_one
- **podcast_followers to podcasts**: many_to_one
- **podcast_categories to podcasts**: many_to_one

## Database Diagram

```mermaid
erDiagram
	podcast_episode_play_history }o--|| users : references
	podcast_episode_play_history }o--|| podcast_episodes : references
	users }o--|| podcast_followers : references
	podcast_categories }o--|| categories : references
	podcast_followers }o--|| podcasts : references
	podcast_categories }o--|| podcasts : references

	podcast_images {
		TEXT image_width_image_height_url
		TIMESTAMPTZ created_at
		TEXT storage_file_path
	}

	users {
		VARCHAR(255) user_id
		TEXT email
		TIMESTAMPTZ created_at
		TEXT username
	}

	podcast_episodes {
		INTEGER id
		SERIAL episode_id
		SERIAL podcast_id
		TEXT episode_title
		TEXT podcast_title
		TEXT content_url
		INTEGER duration_in_seconds
		TIMESTAMP publish_date_unix_timestamp
		BOOLEAN is_explicit
		INTEGER episode_number
		INTEGER season_number
		TEXT image
		TEXT language
		TEXT external_website_url
	}

	podcast_episode_play_history {
		VARCHAR(255) user_id
		INTEGER podcast_episode_id
		TIMESTAMPTZ last_played_timestamp
		INTEGER resume_play_time_in_seconds
	}

	podcasts {
		SERIAL id
		SERIAL podcast_id
		TEXT external_website_url
		TEXT title
		TEXT author
		TEXT image
		TEXT language
		TIMESTAMP publish_date_unix_timestamp
		INTEGER episode_count
		TIMESTAMPTZ created_at
	}

	podcast_categories {
		SERIAL podcast_id
		SERIAL category_id
		TIMESTAMPTZ created_at
	}

	podcast_followers {
		VARCHAR(255) user_id
		SERIAL podcast_id
		TIMESTAMPTZ created_at
	}

	categories {
		SERIAL id
		TEXT category
		TIMESTAMPTZ created_at
	}
```
