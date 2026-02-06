--
-- PostgreSQL database dump
--

\restrict gHOuohOuUHuK51gZSts2WsxeilSJKHhceeo4HFSudrgkygXo9ON40EuFDhXhFRC

-- Dumped from database version 17.7 (Postgres.app)
-- Dumped by pg_dump version 17.7 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ArticleStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ArticleStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'SCHEDULED'
);


ALTER TYPE public."ArticleStatus" OWNER TO postgres;

--
-- Name: ImportStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ImportStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'IMPORTED',
    'SKIPPED',
    'FAILED'
);


ALTER TYPE public."ImportStatus" OWNER TO postgres;

--
-- Name: ImportType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ImportType" AS ENUM (
    'RSS',
    'API',
    'SCRAPER'
);


ALTER TYPE public."ImportType" OWNER TO postgres;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobStatus" AS ENUM (
    'PENDING',
    'RUNNING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."JobStatus" OWNER TO postgres;

--
-- Name: MatchStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MatchStatus" AS ENUM (
    'SCHEDULED',
    'LIVE',
    'FINISHED',
    'POSTPONED',
    'CANCELLED'
);


ALTER TYPE public."MatchStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'EDITOR'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AdZone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdZone" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    code text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    "endDate" timestamp(3) without time zone,
    "imageUrl" text,
    impressions integer DEFAULT 0 NOT NULL,
    "linkUrl" text,
    "order" integer DEFAULT 0 NOT NULL,
    placement text DEFAULT 'sidebar-top'::text NOT NULL,
    size text DEFAULT 'medium-rectangle'::text NOT NULL,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public."AdZone" OWNER TO postgres;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    "featuredImage" text,
    gallery text[],
    "videoUrl" text,
    status public."ArticleStatus" DEFAULT 'DRAFT'::public."ArticleStatus" NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "metaTitle" text,
    "metaDescription" text,
    "canonicalUrl" text,
    "authorId" text,
    "categoryId" text NOT NULL,
    "leagueId" text,
    "matchId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Article" OWNER TO postgres;

--
-- Name: Bookmaker; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bookmaker" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    bonus text,
    "bonusLabel" text,
    "reviewsCount" integer DEFAULT 0 NOT NULL,
    "playersCount" integer DEFAULT 0 NOT NULL,
    rating double precision DEFAULT 0 NOT NULL,
    link text NOT NULL,
    website text,
    "hasLicense" boolean DEFAULT true NOT NULL,
    "licenseNumber" text,
    "minDeposit" text,
    "hasIosApp" boolean DEFAULT true NOT NULL,
    "hasAndroidApp" boolean DEFAULT true NOT NULL,
    "iosAppLink" text,
    "androidAppLink" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "ratingOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Bookmaker" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: ImportJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ImportJob" (
    id text NOT NULL,
    "sourceId" text,
    status public."JobStatus" DEFAULT 'PENDING'::public."JobStatus" NOT NULL,
    "itemsFound" integer DEFAULT 0 NOT NULL,
    "itemsNew" integer DEFAULT 0 NOT NULL,
    error text,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ImportJob" OWNER TO postgres;

--
-- Name: ImportNotification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ImportNotification" (
    id text NOT NULL,
    message text NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ImportNotification" OWNER TO postgres;

--
-- Name: ImportSource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ImportSource" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    type public."ImportType" DEFAULT 'RSS'::public."ImportType" NOT NULL,
    url text NOT NULL,
    "feedUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "defaultCategory" text,
    "checkInterval" integer DEFAULT 30 NOT NULL,
    "lastCheckedAt" timestamp(3) without time zone,
    config jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ImportSource" OWNER TO postgres;

--
-- Name: ImportedItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ImportedItem" (
    id text NOT NULL,
    "sourceId" text NOT NULL,
    "externalId" text NOT NULL,
    "externalUrl" text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text,
    "imageUrl" text,
    "publishedAt" timestamp(3) without time zone,
    "rawData" jsonb,
    status public."ImportStatus" DEFAULT 'PENDING'::public."ImportStatus" NOT NULL,
    "articleId" text,
    "importedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ImportedItem" OWNER TO postgres;

--
-- Name: League; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."League" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    country text,
    logo text,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."League" OWNER TO postgres;

--
-- Name: Match; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Match" (
    id text NOT NULL,
    "homeTeamId" text NOT NULL,
    "awayTeamId" text NOT NULL,
    "homeScore" integer,
    "awayScore" integer,
    "leagueId" text NOT NULL,
    "matchDate" timestamp(3) without time zone NOT NULL,
    status public."MatchStatus" DEFAULT 'SCHEDULED'::public."MatchStatus" NOT NULL,
    venue text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Match" OWNER TO postgres;

--
-- Name: Page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Page" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Page" OWNER TO postgres;

--
-- Name: Selection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Selection" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    icon text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Selection" OWNER TO postgres;

--
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSettings" (
    id text NOT NULL,
    "siteName" text DEFAULT 'Sports News'::text NOT NULL,
    "siteDescription" text,
    logo text,
    favicon text,
    "socialFacebook" text,
    "socialTwitter" text,
    "socialInstagram" text,
    "socialYoutube" text,
    "analyticsCode" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteSettings" OWNER TO postgres;

--
-- Name: Standing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Standing" (
    id text NOT NULL,
    "teamId" text NOT NULL,
    "leagueId" text NOT NULL,
    "position" integer NOT NULL,
    played integer DEFAULT 0 NOT NULL,
    won integer DEFAULT 0 NOT NULL,
    drawn integer DEFAULT 0 NOT NULL,
    lost integer DEFAULT 0 NOT NULL,
    "goalsFor" integer DEFAULT 0 NOT NULL,
    "goalsAgainst" integer DEFAULT 0 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    season text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Standing" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: Team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Team" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "shortName" text,
    logo text,
    country text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Team" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."Role" DEFAULT 'EDITOR'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _ArticleToTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ArticleToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ArticleToTag" OWNER TO postgres;

--
-- Data for Name: AdZone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AdZone" (id, name, slug, code, "isActive", "createdAt", "updatedAt", clicks, "endDate", "imageUrl", impressions, "linkUrl", "order", placement, size, "startDate") FROM stdin;
cmkzls3dx003iahfibm7h6z73	Header Banner	header-banner	\N	t	2026-01-29 15:22:35.685	2026-01-29 15:22:35.685	0	\N	\N	0	\N	0	sidebar-top	medium-rectangle	\N
cmkzls3dy003jahfi5i9sczxm	Sidebar Top	sidebar-top	\N	t	2026-01-29 15:22:35.686	2026-01-29 15:22:35.686	0	\N	\N	0	\N	0	sidebar-top	medium-rectangle	\N
cmkzls3dy003kahfiihb7uqvs	Sidebar Bottom	sidebar-bottom	\N	t	2026-01-29 15:22:35.687	2026-01-29 15:22:35.687	0	\N	\N	0	\N	0	sidebar-top	medium-rectangle	\N
cmkzls3dz003lahfigqbloyap	Article Top	article-top	\N	t	2026-01-29 15:22:35.687	2026-01-29 15:22:35.687	0	\N	\N	0	\N	0	sidebar-top	medium-rectangle	\N
cmkzls3dz003mahfi3cs1nuwf	Article Bottom	article-bottom	\N	t	2026-01-29 15:22:35.688	2026-01-29 15:22:35.688	0	\N	\N	0	\N	0	sidebar-top	medium-rectangle	\N
cmkzls3e0003nahfi4pwase9o	In-Article	in-article	\N	t	2026-01-29 15:22:35.688	2026-01-29 15:22:35.688	0	\N	\N	0	\N	0	sidebar-top	medium-rectangle	\N
\.


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" (id, title, slug, excerpt, content, "featuredImage", gallery, "videoUrl", status, views, "publishedAt", "metaTitle", "metaDescription", "canonicalUrl", "authorId", "categoryId", "leagueId", "matchId", "createdAt", "updatedAt") FROM stdin;
cmkzls3eg0049ahfi2mejkv1l	Семин о Станковиче: «Не готов к давлению в „Спартаке". И без тренера клуб может быть шестым»	semin-o-stankoviche-ne-gotov-k-davleniyu	Юрий Семин, бывший тренер московского «Локомотива», дал критическую оценку работе Деяна Станковича в «Спартаке» и объяснил причины его отставки.	<p>Юрий Семин, бывший тренер московского «Локомотива», дал критическую оценку работе Деяна Станковича в «Спартаке» и объяснил причины его отставки с должности.</p>\n<p>По мнению Семина, сербский специалист недооценил сложность работы в московском клубе. «В этой команде ты должен справляться с огромным давлением. Ведь болельщики красно-белых не только любят футбол, но и разбираются в нём. Станкович до конца не представлял, с каким прессингом он тут столкнется. Он же раньше не работал в таких командах», — сказал Семин.</p>\n<p>Семин подчеркнул, что расставание со Станковичем произошло не из-за четырёх побед подряд, которые он добился перед отставкой, а из-за отсутствия перспектив. «Все закономерно. Четыре победы роли не играют. Со Станковичем расстались, так как не было перспектив. Нельзя бесконечно тасовать состав», — отметил он.</p>\n<h3>Предложение для «Спартака»</h3>\n<p>Семин высказал рекомендацию московскому клубу: приглашать либо серьёзного иностранного специалиста с победным опытом в топ-лигах, либо российского тренера, адаптированного к реалиям и имеющего спартаковские корни. «Либо нужен серьезный иностранный специалист, либо российский, который уже адаптирован к нашим реалиям, со спартаковскими корнями», — уточнил он.</p>\n<p>В заключение легенда «Локомотива» довольно критично оценил состав: «Сейчас „Спартак" только шестой. Да с таким составом он и без тренера будет занимать пятые-шестые места!»</p>	\N	\N	\N	PUBLISHED	0	2025-12-19 07:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.705	2026-02-04 14:15:57.152
cmkzls3ei004bahfihl0zqork	Александр Головин о жизни в «Монако», амбициях и инвестициях в компьютерные игры	aleksandr-golovin-o-zhizni-v-monako	Звезда «Монако» и сборной России Александр Головин дал развёрнутое интервью о жизни во французском княжестве, карьерных решениях и личных пристрастиях.	<p>Звезда «Монако» и сборной России Александр Головин дал развёрнутое интервью в рамках проекта FONBET FONtour Европа, где подробно рассказал о жизни во французском княжестве, карьерных решениях и личных пристрастиях.</p>\n<h3>На вершине европейского футбола</h3>\n<p>Полузащитник вспомнил недавнюю победу «Монако» над парижским ПСЖ и подчеркнул уровень развития французского чемпионата. Он также поделился гордостью за то, что вошёл в топ-15 игроков по количеству матчей в истории клуба и был внесён в «книгу легенд». Головин отметил, что играет в высоком темпе рядом с такими звёздами, как Фалькао и Поль Погба, что постоянно требует максимальной отдачи.</p>\n<h3>Разница между РПЛ и Лигой 1</h3>\n<p>Основываясь на своём опыте, Головин объяснил главные различия между российской Премьер-лигой и чемпионатом Франции. По его мнению, ключевые факторы успеха в Европе — это интенсивность, взрывная скорость и физическая подготовка. Он считает, что многие российские игроки имеют потенциал для Лиги 1, но сталкиваются с проблемами адаптации именно в этих аспектах.</p>\n<h3>Жизнь вдали от дома</h3>\n<p>Головин признался в ностальгии по России. Несмотря на комфортную жизнь в Монако, он живёт один, практически без близкого круга друзей. Даже в отпуск предпочитает ездить домой, а не путешествовать по другим странам.</p>\n<h3>Неожиданное хобби: инвестиции в киберспорт</h3>\n<p>Пожалуй, самой неожиданной темой стали компьютерные игры. Головин рассказал, что серьёзно инвестировал во внутриигровые предметы, стоимость которых на игровом рынке выросла с 4 млн до 8-11 млн рублей. Это хобби помогает ему справляться со стрессом и отвлекаться от футбольной суеты.</p>	\N	\N	\N	PUBLISHED	0	2025-12-15 12:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.706	2026-02-04 14:15:57.153
cmkzls3en004jahfivzi59wpx	Наумов: Карпин не раскрылся в «Динамо», но мог бы привести «Спартак» к чемпионству	naumov-karpin-ne-raskrylsya-v-dinamo	Бывший президент «Локомотива» Николай Наумов заявил, что неудача Валерия Карпина в «Динамо» связана не с уровнем тренера.	<p>Бывший президент «Локомотива» Николай Наумов заявил, что неудача Валерия Карпина в московском «Динамо» связана не с уровнем тренера, а с тем, что это «не его команда». По его словам, иногда тренер попадает «не в ту команду или не в ту систему», и тогда у него не складывается, хотя в других условиях он способен добиваться больших успехов.</p>\n<p>Наумов напомнил пример Унаи Эмери, у которого «ничего не получилось в „Спартаке"», но затем он ушёл и «выиграл почти всё» в других клубах. Аналогичную ситуацию он видит и в случае с Карпиным, у которого «не сложилось» в «Динамо», ушедшем на зимний перерыв на 10-м месте с 21 очком после 18 туров.</p>\n<p>При этом Наумов подчеркнул, что продолжает верить в талант Карпина и считает, что в другом клубе он мог бы добиться гораздо большего. «Возьми его в „Спартак" — и он, возможно, приведёт команду к медалям или чемпионству», — заявил функционер.</p>	\N	\N	\N	PUBLISHED	0	2025-12-15 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.712	2026-02-04 14:15:57.159
cmkzls3eq004nahfi1pjqnhlh	Наумов: главное событие года в российском футболе — появление молодого поколения игроков	naumov-glavnoe-sobytie-goda-molodoe-pokolenie	Бывший президент «Локомотива» выделил появление молодых талантов как главное достижение года.	<p>Бывший президент «Локомотива» Николай Наумов выделил главное событие года в российском футболе. Он отметил, что несмотря на санкции и внешние трудности, «наш футбол неубиваемый» и главное достижение — это появление молодого поколения игроков высокого уровня.</p>\n<p>По словам Наумова, особое внимание заслуживают молодые таланты, которые уже проявляют себя на высоком уровне. Полузащитник «Локомотива» Алексей Батраков показал впечатляющие результаты в первой части сезона с двузначным количеством забитых мячей. Аналогичные успехи демонстрируют игроки ЦСКА — Матвей Кисляк и Кирилл Глебов, которых Наумов назвал примерами успешного развития молодежи в отечественном футболе.</p>\n<p>Текущая турнирная ситуация в РПЛ также остается напряженной, с тремя грандами — «Краснодаром» (40 очков), «Зенитом» (39 очков) и «Локомотивом» (37 очков) — разделенными всего несколькими очками на вершине таблицы.</p>	\N	\N	\N	PUBLISHED	0	2025-12-15 08:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.714	2026-02-04 14:15:57.16
cmkzls3em004hahfiyzkp9kka	«Мини-футбол — русский вид спорта». Россия сохранила место в топ-10 футзального рейтинга	mini-futbol-russkij-vid-sporta	Автор телеграмканала «Едим спорт» Дмитрий Егоров объяснил, почему Россия традиционно сильна в минифутболе.	<p>Автор телеграмканала «Едим спорт» Дмитрий Егоров объяснил, почему, по его мнению, Россия традиционно сильна в минифутболе и до сих пор входит в топ-10 мирового рейтинга даже в статусе отстранённой сборной.</p>\n<p>Егоров утверждает, что Россия «не предназначена для игры в большой футбол — ни климатически, ни географически», так как большинству людей элементарно негде и не с кем играть на открытых полях. При этом он напоминает, что даже в таких условиях национальная команда по футболу доходила до полуфинала чемпионата Европы и четвертьфинала чемпионата мира, но это скорее исключение, чем правило.</p>\n<p>Мини-футбол он называет «русским видом спорта», отмечая, что около 70 процентов школьных занятий физкультурой в стране проходят именно в зале. Егоров уверен, что без международных отстранений Россия продолжала бы бороться за первую строчку рейтинга.</p>	\N	\N	\N	PUBLISHED	0	2025-12-15 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.711	2026-02-04 14:15:57.158
cmkzls3ep004lahfix4yr9jib	Слуцкий — о назначении Березуцкого в «Урал»: «Он приходит не тушить пожар, а заходить на волну роста»	sluckij-o-naznachenii-berezuckogo-v-ural	Леонид Слуцкий подробно высказался о назначении Василия Березуцкого главным тренером «Урала».	<p>Леонид Слуцкий подробно высказался о назначении Василия Березуцкого главным тренером «Урала», назвав этот шаг «максимально логичным и правильным для всех участников». По его словам, Василий давно был готов к самостоятельной работе, а ситуация в екатеринбургском клубе «создаёт идеальные стартовые условия для первого по-настоящему серьёзного тренерского проекта в России».</p>\n<p>Слуцкий отметил, что «Урал» идёт с большим отрывом в ФНЛ и практически гарантировал себе выход в РПЛ, поэтому, как выразился специалист, «Бережок приходит не тушить пожар, а заходить на волну роста». Он подчеркнул, что у клуба «прекрасная инфраструктура, нормальная база, достойный стадион и смесь опытных и молодых игроков, с которой можно работать не в режиме выживания, а в режиме развития».</p>\n<p>Отдельно Слуцкий остановился на сложном характере владельца «Урала» Григория Иванова, назвав работу с ним «специфической, требующей крепких нервов и очень жёсткого внутреннего стержня». При этом он добавил, что «у Григория Викторовича ещё не было тренера с таким характером, как у Васи».</p>	\N	\N	\N	PUBLISHED	0	2025-12-15 14:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.713	2026-02-04 14:15:57.16
cmkzls3et004tahfit7jmr9jf	Чемпион PFL Мовлид Хайбулаев дисквалифицирован за допинг	chempion-pfl-hajbulaev-diskvalificirovan-za-doping	Российский боец лишен титула и запрещен в спорте на год после положительного допинг-теста.	<p>35-летний чемпион Professional Fighting League в полулегком весе Мовлид Хайбулаев получил годовую дисквалификацию после положительного допинг-теста. Согласно информации от Антидопингового агентства США (USADA), в его пробе обнаружен рекомбинантный эритропоэтин (rEPO) — запрещенное вещество, повышающее спортивные результаты.</p>\n<p>Проба была сдана во время финала Гран-при PFL 1 августа текущего года. На основании этого результата организация лишила Хайбулаева титула чемпиона. Дисквалификация началась с даты взятия пробы и продлится до 1 августа 2026 года.</p>\n<p>PFL издала официальное заявление, подтверждающее приверженность «нулевой терпимости» к допингу и приоритет честной конкуренции и безопасности спортсменов. Это решение поставило точку в карьере Хайбулаева, который незадолго до этого заявил о своем доминировании после победы над тремя чемпионами в финале Гран-при.</p>	\N	\N	\N	PUBLISHED	0	2025-12-18 12:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d80010ahfi4mcxqrql	\N	\N	2026-01-29 15:22:35.718	2026-02-04 14:15:57.163
cmkzls3ev004vahfizliip4gs	Орловский получил боевой контракт BKFC	orlovskij-poluchil-boevoj-kontrakt-bkfc	Андрей Орловский, 46-летний российский экс-боец UFC, получил контракт на бой в Bare Knuckle FC за титул чемпиона в тяжелом весе.	<p>Андрей Орловский, 46-летний российский экс-боец UFC, получил контракт на бой в Bare Knuckle FC за титул чемпиона в тяжелом весе. Его соперником на турнире Knucklemania выступит американец Бен Ротвелл, также известный по своему периоду в UFC. Турнир запланирован на 8 февраля.</p>\n<p>Это событие становится еще одной вехой в боевой карьере Орловского. Напомним, что в ноябре текущего года российский боец дебютировал в боксе, выступив в промоушене Misfits Boxing в Нэшвилле.</p>	\N	\N	\N	PUBLISHED	0	2025-12-17 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d80010ahfi4mcxqrql	\N	\N	2026-01-29 15:22:35.719	2026-02-04 14:15:57.164
cmkzls3ez0053ahfie4ywfest	Русский вратарь Сафонов написал историю: как провинциальный голкипер покорил мир пенальти	safonov-napisal-istoriyu-4-penalti	Матвей Сафонов пережил ночь, которую будет помнить всю жизнь. В финале Межконтинентального кубка ФИФА русский голкипер отразил четыре пенальти подряд.	<p>Матвей Сафонов пережил ночь, которую будет помнить всю жизнь. В финале Межконтинентального кубка ФИФА русский голкипер «ПСЖ» совершил невероятное — отразил четыре пенальти подряд, став первым вратарём в истории турнира, кому это удалось.</p>\n<p>Серия пенальти началась, когда казалось, что «Фламенго» утащит трофей. Бразильцы верили в свою звёзду, в силу момента, в удачу. Но вот на линию выходит Сафонов — молодой парень из провинции, который всего за пару матчей преодолел путь от просто талантливого юноши до звёзды европейского футбола.</p>\n<p>Луис Энрике, великий тренер, который видел множество чудес футбола, после матча признался: «Впервые вижу вратаря, который отбивает четыре пенальти подряд». Слова легендарного испанца звучали как приговор — в лучшем смысле этого слова. Это было признание.</p>\n<p>Сафонов получил награду лучшего игрока финала. «ПСЖ» завоевал шестой трофей в году, но главная награда досталась русскому парню, который своей решимостью и профессионализмом напомнил миру, что в футболе чудеса случаются.</p>	/uploads/image1-2.jpeg	\N	\N	PUBLISHED	2	2025-12-18 20:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.724	2026-02-04 14:15:57.168
cmkzls3f6005fahfi56nnnv3k	Глушаков подвёл итоги 2025 года в российском футболе	glushakov-podvel-itogi-2025-goda	Экс-полузащитник сборной России Денис Глушаков подвёл итоги 2025 года в футболе в формате блиц-интервью.	<p>Экс-полузащитник сборной России Денис Глушаков подвёл итоги 2025 года в футболе в формате блиц-интервью, отвечая на вопросы супруги.</p>\n<h3>Главные ассоциации года</h3>\n<p>По словам Глушакова, главной личной вехой 2025 года стало завершение его профессиональной карьеры, решение о котором он принял заранее и описал как момент, когда «ёкнуло». Среди событий в российском футболе он выделил первое чемпионство «Краснодара» в РПЛ.</p>\n<h3>Лидеры и недооценённые игроки</h3>\n<p>Отвечая на вопрос о лучшем игроке РПЛ на своей позиции, Глушаков выделил Батракова, отметив его универсальность в центре поля и вклад в результаты команды. В числе самых недооценённых футболистов 2025 года он назвал Пруцева и Руденко.</p>\n<h3>Разочарование года</h3>\n<p>В качестве главного разочарования сезона Глушаков назвал «Спартак», пояснив, что клуб с таким составом и амбициями обязан бороться за чемпионство, но по-прежнему не показывает должного результата. Он признался, что к «Спартаку» у него по-прежнему «лежит душа», поэтому отсутствие борьбы за вершину турнирной таблицы воспринимает особенно болезненно.</p>	\N	\N	\N	PUBLISHED	0	2025-12-21 15:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.731	2026-02-04 14:15:57.173
cmkzls3fk005xahfif6ua5zb3	«Ростов» может не доиграть сезон: долги до ₽5 млрд и неоплаченные сборы	rostov-mozhet-ne-doigrat-sezon-dolgi-5-mlrd	Финансовое положение «Ростова» стремительно ухудшилось: по разным оценкам, совокупный долг клуба достиг уже от 4 до 5 млрд рублей.	<p>Финансовое положение «Ростова» стремительно ухудшилось: по разным оценкам, совокупный долг клуба достиг уже от 4 до 5 млрд рублей, при этом зимние сборы на данный момент не оплачены, а задержки по зарплате тянутся с сентября–октября и различаются по срокам у разных игроков. Государственное финансирование в объёме 700 млн рублей в год пока не подтверждено, что делает перспективы окончания текущего чемпионата туманными.</p>\n<p>Проблемы выходят за рамки одного клуба: в проекте областного бюджета на 2026 год расходы на спорт фактически отсутствуют, из-за чего под угрозой участие в турнирах баскетбольных «Платова» и «Ростов-ЮФУ», которым, по оценкам, хватило бы порядка 60 млн рублей на сезон.</p>\n<p>Даже если «Ростов» чудом доиграет чемпионат и сохранит прописку в РПЛ, клуб почти наверняка столкнётся с проблемами при лицензировании на следующий сезон: при заявленном бюджете порядка 2,7 млрд рублей даже потенциальные 0,7 млрд из областного бюджета не перекроют дыру, а оставшиеся 2 млрд взять банально неоткуда.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.745	2026-02-04 14:15:57.182
cmkzls3fu006fahfiyqqcl28u	Степашин: «Гусеву будет помогать Газзаев. Кубок — одна из главных задач „Динамо"»	stepashin-gusevu-budet-pomogat-gazzaev	Сергей Степашин подтвердил, что Ролан Гусев утверждён главным тренером «Динамо», а помогать ему будет Валерий Газзаев.	<p>Сергей Степашин подтвердил, что Ролан Гусев утверждён главным тренером «Динамо» до конца сезона, а ключевая цель — завоевание Кубка России и подъём в таблице РПЛ.</p>\n<p>По словам Степашина, есть договорённость, что Валерий Газзаев, при котором Гусев «играл очень здорово», будет помогать новому наставнику: «Он воспитал и сделал Ролана как футболиста».</p>\n<h3>Усиление состава</h3>\n<p>Совет директоров уже обсуждал трансферы: «Нужно укреплять и защиту, и нападение, и опорную зону, совершенно очевидно», — отметил Степашин, добавив, что есть ряд предложений, но говорить о них пока рано.</p>\n<h3>Почему выбрали именно Гусева</h3>\n<p>«Карпин ушёл. Все остальные заняты. Это свой человек, проверенный», — объяснил Степашин выбор в пользу Гусева, напомнив, что тот был старшим помощником при Карпине и хорошо знает команду.</p>\n<h3>Планы на весну и пример Сёмина</h3>\n<p>«Динамо» проведёт зимние сборы в ОАЭ. Степашин сравнил ситуацию с возвращением Юрия Сёмина в «Локомотив», когда тот сначала взял Кубок при седьмом месте в лиге, а на следующий год стал чемпионом России.</p>\n<p>«У нас осталось три-четыре матча, и мы можем взять Кубок. Я рассчитываю, что Кубок — это одна из главных задач, которая сегодня стоит перед „Динамо"», — подытожил он.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 12:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.754	2026-02-04 14:15:57.191
cmkzls3fj005vahfibmyndxy8	«Осталась одна запятая». Деян Станкович официально вернулся в «Црвену Звезду»	stankovich-vernulsya-v-crvenu-zvezdu	Деян Станкович во второй раз назначен главным тренером «Црвены Звезды», вновь сменив на этом посту Владана Милоевича.	<p>Деян Станкович во второй раз назначен главным тренером «Црвены Звезды», вновь сменив на этом посту Владана Милоевича, как и шесть лет назад.</p>\n<p>На презентации он сразу обозначил личную мотивацию: «У меня осталась всего одна запятая… Рад, что у меня будет возможность стереть эту запятую, это, пожалуй, моя главная цель» — речь об автоголе Павкова и незавершённости первого цикла работы.</p>\n<h3>Стиль игры и усиление состава</h3>\n<p>Станкович подтвердил, что команда будет играть с четырьмя защитниками: «Эта команда создана для игры вчетвером… Четыре защитника — вот как мы будем играть».</p>\n<p>Он высоко оценил текущий подбор исполнителей: «Отличный состав игроков… Одной-двух удачных попыток для этой команды к лету будет достаточно», при этом слухи о переходе Угалде и Барко из «Спартака» назвал «нереалистичными».</p>\n<h3>Лидеры и результаты</h3>\n<p>Новый тренер выделил дуэт Иванич — Катай: «28 голов на двоих — вау. Это серьёзные цифры, надеюсь, они и дальше будут солдатами „Црвены Звезды"».</p>\n<h3>Давление, «Спартак» и опыт в России</h3>\n<p>Сравнивая «Звезду» и московский «Спартак», Станкович подчеркнул, что уровень эмоций в Белграде особенный: «„Спартак" — огромный клуб… но дома всё по-другому, я не могу сравнивать эти эмоции и любовь».</p>\n<p>О российском этапе он сказал: «Со мной многое произошло. Я становлюсь опытнее, лучше подготовленнее и спокойнее… Иногда нужно что-то менять», признав, что раньше слишком остро реагировал на судейство и несправедливость.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.744	2026-02-04 14:15:57.181
cmkzls3g3006vahfi13mvwdzb	Сулейманов: выиграть РПЛ с 11 воспитанниками «Краснодара» очень сложно, но Галицкий мечту не оставит	suleymanov-vyigrat-rpl-s-11-vospitannikami-krasnodara	Нападающий «Спортинг Канзас-Сити» Магомед-Шапи Сулейманов считает, что «Краснодару» будет крайне сложно стать чемпионом с составом из воспитанников.	<p>Нападающий «Спортинг Канзас-Сити» Магомед-Шапи Сулейманов считает, что «Краснодару» будет крайне сложно стать чемпионом России, если в стартовом составе одновременно будут выходить 11 воспитанников клуба. По его словам, на дистанции сезона команде необходимы опытные лидеры, вокруг которых строится игра, и сейчас таковой фигурой у «быков» является нападающий Джон Кордоба.</p>\n<p>При этом Сулейманов уверен, что владелец клуба Сергей Галицкий не откажется от давней идеи построить команду мечты исключительно из выпускников академии «Краснодара». Форвард напомнил, что его поколение стало первым, кто забивал за «быков» в еврокубках, но тогда конкурировать за место в основе приходилось с такими игроками, как Вандерсон, Классон, Павел Мамаев и Лаборде, тогда как нынешние воспитанники получили больше шансов и уже выросли в лидеров.</p>\n<p>Оценивая расстановку сил в чемпионате, Сулейманов подчеркнул, что сегодня в России есть лишь две по-настоящему топ-команды — «Краснодар» и «Зенит», которые реально борются за золото, тогда как остальные клубы он назвал просто хорошими.</p>	\N	\N	\N	PUBLISHED	0	2025-12-25 07:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.763	2026-02-04 14:15:57.199
cmkzls3g80073ahfiuvztwpci	«Реал» готовит перестройку центра обороны: уйдут Алаба и, возможно, Рюдигер	real-gotovit-perestrojku-centra-oborony	«Реал» уже активно просматривает рынок центральных защитников и нацелился на серьёзное усиление линии обороны следующим летом.	<p>«Реал» уже активно просматривает рынок центральных защитников и, по данным ESPN, нацелился на серьёзное усиление линии обороны следующим летом на фоне травм Эдера Милитао и неопределённости с контрактами Давида Алабы и Антонио Рюдигера. В планах мадридцев — не продлевать соглашение с 33-летним Алабой, которому прочат уход в ближайшее трансферное окно, а по Рюдигеру в клубе колеблются: немцу готовы предложить новый контракт, но его привлекает вариант доиграть карьеру в Саудовской Аравии.</p>\n<p>При этом привычная для «Реала» ставка на свободных агентов в случае с Ибраимой Конате, Дайо Упамекано и Марком Гэи, чьи контракты истекают летом, пока не выглядит приоритетной: их переходы источник в клубе называет маловероятными. Скаутский отдел во главе с Джуни Калафатом высоко оценивает Жереми Жаке из «Ренна» и Ника Шлоттербека из «Боруссии» Д.</p>\n<p>Параллельно в клубе внимательно следят за прогрессом своих центральных защитников Якобо Рамона (аренда в «Комо» с опцией выкупа) и Жоана Мартинеса, считающихся главными кандидатами из кантеры на усиление первой команды.</p>	\N	\N	\N	PUBLISHED	4	2025-12-26 12:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.768	2026-02-04 14:15:57.202
cmkzls3fn0063ahfihrm95upb	Официально: Ролан Гусев назначен главным тренером «Динамо» до конца сезона	gusev-naznachen-glavnym-trenerom-dinamo	Московское «Динамо» утвердило Ролана Гусева главным тренером команды с контрактом до окончания текущего сезона.	<p>Московское «Динамо» утвердило Ролана Гусева главным тренером команды с контрактом до окончания текущего сезона. До этого он несколько раз исполнял обязанности наставника бело-голубых, включая концовку прошлого чемпионата и период с ноября нынешнего года.</p>\n<p>Гусев является воспитанником «Динамо», заслуженным мастером спорта России и обладателем Кубка УЕФА, а первые шаги в тренерской карьере делал в системе ЦСКА — с молодёжной командой, академией и юношескими сборными России, где выиграл Молодёжную футбольную лигу. В штаб «Динамо» он вошёл летом 2023 года и с тех пор последовательно поднимался в структуре клуба, что логично завершилось назначением на пост главного тренера.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.748	2026-02-04 14:15:57.185
cmkzls3ed0045ahfiekscb7oa	Черевченко: «VAR раздражает больше всего. В России просмотр может растянуться на десять минут»	cherevchenko-var-razdrazhaet-bolshe-vsego	Тренер таджикского «Истиклола» Игорь Черевченко дал критическую оценку работе видеоассистента в современном футболе.	<p>Тренер таджикского «Истиклола» Игорь Черевченко дал критическую оценку работе видеоассистента в современном футболе, назвав VAR главным раздражающим его фактором в игре.</p>\n<p>«Больше всего меня раздражает VAR, без него было лучше. Если в Европе еще более-менее терпимо, судьи смотрят секунды, то в России совсем тяжело — просмотр может растянуться надолго», — заявил Черевченко в интервью LiveSport.Ru. В качестве примера он привёл матч «Ростов» — «Акрон», где арбитры изучали один эпизод целых десять минут.</p>\n<p>По мнению экс-тренера «Химок» и «Балтики», полная отмена VAR не нанесёт вред футболу, а может даже его улучшить. «Ничего футбол не потеряет, а может даже и приобретет. Потому что VAR, по сути, дает неравномерное распределение — одни команды от него регулярно страдают, а другие, благодаря ему, регулярно выигрывают», — объяснил Черевченко.</p>\n<p>На втором месте в списке его претензий к современному футболу стоят судейские трактовки: «Почему никак не могут договориться ни у нас, ни в Европе, например, по правилам игры рукой — не понимаю». При этом Черевченко отметил, что сам никогда не конфликтовал с судьями, проповедуя спокойствие: «Не стоит ругаться с судьями, хотя бы потому, что это все равно ничего не изменит, раз арбитр уже принял решение».</p>	\N	\N	\N	PUBLISHED	0	2025-12-19 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.701	2026-02-04 14:15:57.148
cmkzls3ef0047ahfida2ke4g9	Луис Энрике — лучший тренер года по версии ФИФА	luis-enrike-luchshij-trener-goda-fifa	«ПСЖ» поздравил главного тренера команды Луиса Энрике с присуждением ему награды «Лучший тренер года» на церемонии The Best FIFA Football Awards.	<p>«ПСЖ» поздравил главного тренера команды Луиса Энрике с присуждением ему награды «Лучший тренер года» на церемонии The Best FIFA Football Awards.</p>\n<p>«Наш тренер Луис Энрике завоевал трофей FIFA #TheBest, признав лучшим тренером года!», — написал официальный аккаунт парижского клуба на X.</p>\n<p>Это признание стало заслуженным подтверждением успешной работы испанского специалиста, который привёл «ПСЖ» к результатам на клубном уровне. Энрике продолжает укреплять свой статус одного из ведущих тренеров мировой футбольной элиты, работая с одной из сильнейших команд Европы.</p>	\N	\N	\N	PUBLISHED	0	2025-12-16 15:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.703	2026-02-04 14:15:57.151
cmkzls3es004rahfimfn92d3e	Геннадий Орлов: Аленичеву надо дать второй шанс в «Спартаке»	orlov-alenichev-vtoroj-shans-v-spartake	Известный спортивный комментатор Геннадий Орлов поделился мнением о том, как поступить «Спартаку» с выбором нового главного тренера.	<p>Известный спортивный комментатор Геннадий Орлов в разговоре с «РБ Спорт» поделился мнением о том, как поступить «Спартаку» с выбором нового главного тренера.</p>\n<h3>Критика Станковича и Романова</h3>\n<p>Орлов высказал критику в адрес текущей ситуации с руководством команды. По его словам, Романов «просто исполнил обязанности» и является неопытным тренером. Что касается Станковича, комментатор полагает, что тот «не очень хотел» работать в клубе. «Но так нельзя было делать, как он себя повел. И он сам это почувствовал, что ему надо уходить», — отметил Орлов.</p>\n<h3>Предложение вернуть Аленичева</h3>\n<p>В качестве решения Орлов предложил вспомнить о Сергее Аленичеве, несмотря на его неудачный опыт в клубе. По мнению комментатора, Аленичев был несправедливо уволен, хотя именно он собрал команду, которая позже под руководством Каррера выиграла чемпионат.</p>\n<p>Геннадий Орлов указал на серьёзные достижения Аленичева: выигрыш Лиги чемпионов и Кубка УЕФА под руководством Жозе Моуриньо, высокий авторитет в международном футболе, статус легенды для болельщиков «Спартака».</p>\n<p>По итогам 18 туров чемпионата «Спартак» занимает шестое место с 29 очками.</p>	\N	\N	\N	PUBLISHED	0	2025-12-18 07:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.717	2026-02-04 14:15:57.162
cmkzls3ew004xahfirrr5kkcs	Мэнни «Пакман» Пакьяо отметил 47-летие	menni-pakman-pakyao-otmetil-47-letie	Легендарный филиппинский боксёр по-прежнему остаётся одной из ключевых фигур мирового бокса и рекордсменом по числу завоёванных титулов в разных весах.	<p>Мэнни «Пакман» Пакьяо 17 декабря отметил 47-летие, по-прежнему оставаясь одной из ключевых фигур мирового бокса и рекордсменом по числу завоёванных титулов в разных весах. Его день рождения в Генерал-Сантос прошёл в семейной обстановке: близкие, друзья и коллеги по цеху адресовали ему поздравления и публиковали архивные кадры из самых ярких боёв.</p>\n<h3>Кратко о пути</h3>\n<p>Пакьяо родился 17 декабря 1978 года и прошёл путь от юниора в малых залах до статуса одного из самых результативных профессионалов в истории. На его счету 62 победы при 8 поражениях и 2 ничьих, а главное — уникальное достижение: 12 крупных поясов в восьми весовых категориях от наилегчайшего до первого среднего.</p>\n<h3>Роль в боксе сейчас</h3>\n<p>Даже после пиковой части карьеры Пакьяо остаётся активным участником боксерской сцены. В 2025 году он принял должность вице-президента Международной боксерской ассоциации (IBA), где занимается развитием любительского и профессионального бокса.</p>\n<h3>Почему о нём вспоминают</h3>\n<p>Сегодня Пакьяо — живой ориентир для боксёров из Азии и всего мира: пример того, как дисциплина и готовность рисковать категориями и соперниками могут переписать историю спорта. Его рекорды восьми дивизионов и миллиарды, собранные в PPV-продажах, сделали его одним из самых узнаваемых бойцов XXI века.</p>	\N	\N	\N	PUBLISHED	0	2025-12-17 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d80011ahfi3hfews0n	\N	\N	2026-01-29 15:22:35.72	2026-02-04 14:15:57.165
cmkzls3ex004zahfie5tvfv5f	Финал ЧМ-2030, скорее всего, пройдёт на «Сантьяго Бернабеу»	final-chm-2030-na-santyago-bernabeu	Финал чемпионата мира по футболу 2030 года с высокой вероятностью примет стадион «Сантьяго Бернабеу» в Мадриде.	<p>Финал чемпионата мира по футболу 2030 года с высокой вероятностью примет стадион «Сантьяго Бернабеу» в Мадриде. Об этом сообщает издание AS, ссылаясь на собственные источники. Главная арена мадридского «Реала» рассматривается как приоритетный вариант для проведения решающего матча турнира, который состоится 21 июля 2030 года.</p>\n<p>Ключевым фактором в пользу мадридского стадиона стали не только его статус и масштабная реконструкция, превратившая арену в мультифункциональный комплекс, но и тесные рабочие отношения между президентом ФИФА Джанни Инфантино и президентом «Реала» Флорентино Пересом. Испания в целом позиционируется как «опорная» страна совместной заявки (включающей также Португалию и Марокко), а Мадрид — как естественный центр для кульминации турнира.</p>\n<p>Конкуренцию Мадриду всё ещё составляют другие площадки. Марокко активно лоббирует проведение финала в Касабланке, где строится новый гигантский стадион. Португалия предлагает арену «Эштадиу да Луш» («Бенфики»), но эксперты полагают, что она вряд ли получит именно финал.</p>\n<p>Официальное решение и окончательный список городов-организаторов ФИФА планирует утвердить не ранее конца 2026 года.</p>	\N	\N	\N	PUBLISHED	0	2025-12-17 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.721	2026-02-04 14:15:57.166
cmkzls3ey0051ahfimpjfryav	Кирьяков о «Динамо» и «Спартаке»: «Другие клубы соблюдают традиции, а они всё время смотрят на Запад»	kiryakov-o-dinamo-i-spartake-smotryat-na-zapad	Бывший нападающий «Динамо» и сборной России Сергей Кирьяков резко высказался о кадровой политике бело-голубых.	<p>Бывший нападающий «Динамо» и сборной России Сергей Кирьяков резко высказался о кадровой политике бело-голубых на фоне возможного продления контракта со спортивным директором Желько Бувачем. По его словам, за пять лет работы боснийца действительно удачным для клуба можно назвать лишь один сезон, когда «всё было в руках „Динамо", чтобы стать чемпионом».</p>\n<p>Кирьяков отметил, что клуб уже много лет принимает «неоднозначные решения», а сама фигура Бувача остаётся в тени. «Что происходит в клубе — это никто не понимает. Выносят те или иные решения, но они не объясняются. На определённые посты приглашаются люди, которые не имеют никакого отношения к „Динамо"», — заявил он.</p>\n<p>В качестве противопоставления он привёл примеры «Зенита» и ЦСКА, где, по его словам, стараются соблюдать традиции и не допускают случайных людей в структуру. «„Спартак" — такой же, как и „Динамо". Смотрят на Запад, кого-то оттуда всё время приглашают. Таков наш футбол», — добавил Кирьяков.</p>\n<p>Бувач работает в московском клубе с 2020 года, ранее входил в тренерский штаб Юргена Клоппа в «Майнце» и дортмундской «Боруссии». После 18 туров РПЛ «Динамо» идёт на десятом месте с 21 очком.</p>	\N	\N	\N	PUBLISHED	2	2025-12-22 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.722	2026-02-04 14:15:57.167
cmkzls3f10055ahfiivt9tbyl	Аршавин — Сафонову: покоряй Европу и учи их русскому	arshavin-safonovu-pokoryaj-evropu	Андрей Аршавин эмоционально поздравил Матвея Сафонова с его историческим матчем и пожелал ему продолжать покорять Европу.	<p>Андрей Аршавин эмоционально поздравил Матвея Сафонова с его историческим матчем и пожелал ему продолжать покорять Европу, не забывая при этом «учить их русскому». Такое обращение появилось после того, как российский голкипер «ПСЖ» стал главным героем финала Межконтинентального кубка ФИФА против «Фламенго».</p>\n<p>Поводом для обращения стал исторический перформанс Сафонова в серии пенальти, где он парировал четыре удара подряд и принёс «ПСЖ» трофей в матче, завершившемся 1:1 в основное время и 2:1 по пенальти. Россиянин стал первым вратарём на турнирах под эгидой ФИФА, кому удалось отразить четыре одиннадцатиметровых подряд, за что был признан лучшим игроком финала.</p>\n<p>Напомним, что ещё недавно Сафонов играл за «Краснодар», а летом 2024 года совершил рекордный для российского голкипера переход в «ПСЖ» за 20 млн евро. В Париже он постепенно завоёвывал доверие тренерского штаба и к моменту финала уже успел провести несколько сухих матчей, подведя черту впечатляющим международным выступлением.</p>	/uploads/image1-3.jpeg	\N	\N	PUBLISHED	0	2025-12-18 17:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.725	2026-02-04 14:15:57.169
cmkzls3g1006rahfiuckw1nnh	Кафанов — главный кандидат на пост главного тренера «Рубина»	kafanov-glavnyj-kandidat-na-post-trenera-rubina	По информации телеграм-канала «Инсайды от Карпа», 65-летний тренер Виталий Кафанов стал основным претендентом на замену Рашида Рахимова в «Рубине».	<p>По информации телеграм-канала «Инсайды от Карпа», 65-летний тренер Виталий Кафанов стал основным претендентом на замену Рашида Рахимова в «Рубине». Помощник Валерия Карпина в сборной России на днях прилетал в Казань на собеседование и сейчас считается фаворитом в борьбе за пост главного тренера.</p>\n<p>До этого казанцы вели переговоры с испанцем Артигой, который уже прилетал в столицу Татарстана, однако переход сорвался из-за его действующих обязательств перед клубом в Анголе до лета. Параллельно «Рубин» изучал несколько балканских вариантов, но именно Кафанов оказался ближе всех к назначению.</p>\n<p>Источник отмечает, что окончательное решение ещё не принято, однако в текущей конфигурации именно опытный российский специалист рассматривается как приоритетный вариант для смены Рахимова на тренерском мостике.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 14:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.761	2026-02-04 14:15:57.197
cmkzls3f4005bahfixcjyclae	Ташуев о Дзюбе: «В сборную вызывают не для рекордов, а для конкурентоспособности»	tashuev-o-dzyube-v-sbornuyu-ne-dlya-rekordov	Бывший главный тренер «Краснодара» Сергей Ташуев заявил, что возможный вызов Артёма Дзюбы в сборную не должен рассматриваться ради рекордов.	<p>Бывший главный тренер «Краснодара» Сергей Ташуев заявил, что возможный вызов Артёма Дзюбы в сборную России не должен рассматриваться ради рекордов и красивых историй. По его словам, национальная команда должна формироваться из сильнейших футболистов текущего момента.</p>\n<p>«Я считаю, что в сборную страны нужно вызывать самых сильных футболистов на данный момент. Не для рекордов и не для красивых историй, а для того, чтобы команда была максимально конкурентоспособной», — подчеркнул специалист. При этом он отказался напрямую сравнивать Дзюбу и Александра Кержакова, отметив, что «каждый играл в своё время» и оба являются хорошими нападающими.</p>\n<p>Поводом для дискуссии стало решение ФИФА засчитать гол в матче Германии и России 2005 года на счёт Кержакова, а не Аршавина, из-за чего Дзюба может лишиться статуса единоличного рекордсмена сборной. В случае подтверждения этого РФС у Дзюбы и Кержакова будет по 31 мячу за национальную команду.</p>	\N	\N	\N	PUBLISHED	0	2025-12-21 12:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.728	2026-02-04 14:15:57.171
cmkzls3fc005jahfi298bvefq	Батраков: мурашки по коже от гимна Лиги чемпионов и откровения о переводе в Европу	batrakov-murashki-ot-gimna-ligi-chempionov	Лучший футболист России 2025 года откровенно рассказал о мечтах, давлении СМИ и готовности покинуть Локомотив.	<p>Алексей Батраков, признанный лучшим футболистом России в 2025 году по опросу Sport-Express, дал развёрнутое интервью о своих амбициях, жизненной философии и возможном переводе в европейские клубы.</p>\n<h3>Награда как подтверждение, а не цель</h3>\n<p>Батраков относится к личным наградам философски. «Приятно! Это показатель того, что я делаю что-то правильно. Нужно двигаться только вперед, чтобы выиграть что-то еще», — сказал полузащитник. При этом 23-летний игрок сознательно старается не зацикливаться на индивидуальных достижениях.</p>\n<h3>Мечта о Лиге чемпионов: мурашки и реальность</h3>\n<p>Для Батракова Лига чемпионов остаётся главной мечтой. «Когда слышу гимн Лиги чемпионов, идут мурашки по коже. А если еще стоять на поле в этот момент... Совершенно другая история», — признался полузащитник.</p>\n<h3>Европа: не спешу, но готов</h3>\n<p>Вопрос о возможном переводе в европейские клубы остаётся самым острым в карьере Батракова. Его имя уже связывают с «Барселоной», «Реалом», ПСЖ, «Интером». Батраков явно устал от постоянных спекуляций: «Я просто стараюсь не забивать этим голову. Говорят о „ПСЖ", „Монако", „Интере" или „Барселоне", а на самом деле до этого еще далеко».</p>\n<h3>Главное событие 2025: хет-трик против «Спартака»</h3>\n<p>Самым ярким моментом года для Батракова стала победа над «Спартаком» 4:2, в которой он забил хет-трик. «О хет-трике в ворота красно-белых я мог только мечтать. Это произошло и вспоминать приятно», — заявил полузащитник.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 07:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.737	2026-02-04 14:15:57.175
cmkzls3ff005nahfimrd4ufnl	Гвардиола будет взвешивать игроков «Сити» после Рождества и грозит оставить «лишний вес» в Манчестере	gvardiola-budet-vzveshivat-igrokov-siti	Главный тренер «Манчестер Сити» Пеп Гвардиола предупредил игроков, что переедание на рождественских выходных может стоить им места в заявке.	<p>Главный тренер «Манчестер Сити» Пеп Гвардиола предупредил игроков, что переедание на рождественских выходных может стоить им места в заявке на матч с «Ноттингем Форест» 27 декабря. Испанец рассказал, что футболистов взвесили в пятницу, а повторное взвешивание ждёт их в день возвращения на базу — 25 декабря.</p>\n<p>«Каждый игрок взвешен. Они вернутся 25-го, и я буду контролировать, сколько килограммов прибавили. Представьте, игрок идеален сейчас, но вернётся с плюс тремя килограммами — он останется в Манчестере и не поедет в Ноттингем», — заявил Гвардиола, добавив, что подопечным можно есть, но он намерен их «контролировать».</p>\n<p>После уверенной победы над «Вест Хэмом» со счётом 3:0 и выхода на второе место в АПЛ, где «Сити» отстаёт от «Арсенала» на два очка, тренер остался недоволен отдельными элементами игры команды. В результате он отменил запланированный выходной в воскресенье: «Игроки попросили выходной, я сказал: нет, вы сыграли недостаточно хорошо».</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.739	2026-02-04 14:15:57.177
cmkzls3fh005rahfiupcnoqog	71-летний Валерий Газзаев может вернуться в «Динамо» в статусе топ-менеджера	gazzaev-mozhet-vernutsya-v-dinamo-topmenedzherom	Легендарный форвард и экс-тренер «Динамо» Валерий Газзаев рассматривается кандидатом на одну из ключевых руководящих должностей в московском клубе.	<p>Легендарный форвард и экс-тренер «Динамо» Валерий Газзаев рассматривается кандидатом на одну из ключевых руководящих должностей в московском клубе — генерального директора или председателя совета директоров. Об этом сообщает телеграм-канал «Инсайды от Карпа», отмечая, что инициативу выдвигает консультативный совет «Динамо».</p>\n<p>Газзаев, которому 71 год, считается одной из главных фигур в истории бело-голубых: как игрок он выигрывал Кубок СССР и становился лучшим бомбардиром Кубка обладателей кубков 1984/85 с пятью голами, а в роли тренера привёл клуб к бронзе чемпионата России 1992. При этом возвращение, по данным инсайда, не предполагает работу главным тренером, а связано именно с управленческим блоком.</p>\n<p>Источник уточняет, что в окружении Сергея Степашина информацию пока не подтвердили, сославшись на то, что в клубной структуре уже работают генеральный директор Пивоваров и председатель совета директоров Ивлев.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 07:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.742	2026-02-04 14:15:57.179
cmkzls3gd007bahfi9cd6eva7	Лебёф: «Надеюсь, ЧМ-2026 будет посвящён Роналду»	lebef-nadeyus-chm-2026-budet-posvyashhen-ronaldu	Чемпион мира-1998 Франк Лебёф заявил, что хотел бы увидеть, как ЧМ-2026 станет для Криштиану Роналду тем же, чем мундиаль-2022 был для Месси.	<p>Чемпион мира-1998 Франк Лебёф заявил, что хотел бы увидеть, как ЧМ-2026 станет для Криштиану Роналду тем же, чем мундиаль-2022 был для Лионеля Месси, и португалец наконец поднимет над головой трофей, которого ему не хватает для полного комплекта. По его словам, несмотря на выигранные Евро и Лигу наций, отсутствие золота чемпионата мира остаётся единственным крупным трофеем, который отделяет Роналду от идеальной коллекции, и победа в Северной Америке стала бы «фантастическим достижением».</p>\n<p>Лебёф подчеркнул, что соперничество Роналду и Месси уже два десятилетия определяет разговоры о величайшем футболисте, и триумф Португалии на ЧМ-2026 позволил бы CR7 зеркально повторить путь аргентинца.</p>\n<p>При этом он предупредил Роберто Мартинеса: ключевой вопрос для тренера — как управлять ролью 41-летнего форварда в условиях матчей «через три дня на четвёртый», грамотно дозируя время на поле, чтобы сохранить его эффективность и шансы команды на трофей.</p>	\N	\N	\N	PUBLISHED	0	2025-12-25 17:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.773	2026-02-04 14:15:57.206
cmkzls3fo0065ahfiw0ekco3v	Баранник о возможном обмене Дивеева на Гонду: «Не могу представить такой неравноценный обмен»	barannik-o-obmene-diveeva-na-gondu	Бывший полузащитник «Зенита» Дмитрий Баранник раскритиковал возможный обмен нападающего Лусиано Гонды в ЦСКА на защитника Игоря Дивеева.	<p>Бывший полузащитник «Зенита» Дмитрий Баранник раскритиковал возможный обмен нападающего Лусиано Гонды в ЦСКА на защитника Игоря Дивеева, о котором сообщают источники. По его словам, подобная сделка изначально выглядит неравнозначной для петербургского клуба.</p>\n<p>«Я вообще не могу представить себе такой обмен — он для меня явно неравноценный», — заявил Баранник. Он напомнил, что в период, когда Гонда был в форме и регулярно играл, «по его взгляду, был одним из лучших нападающих „Зенита"», и признался, что не понимает, почему аргентинец перестал попадать в состав.</p>\n<p>По мнению экс-игрока, менять нападающего на центрального защитника в текущих условиях для «Зенита» в принципе неверно: «Дивеев не из тех футболистов, кто выручит „Зенит"», — подчеркнул он. Ранее сообщалось, что потенциальная сделка оценена сторонами примерно на 90% готовности: петербуржцы, помимо Гонды, готовы заплатить за Дивеева от трёх до пяти миллионов евро.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.749	2026-02-04 14:15:57.186
cmkzls3er004pahfi1h292p1c	Суарес остаётся в «Интер Майами»: клуб закрепляет легенду на 2026 год	suares-ostaetsya-v-inter-majami-2026	«Интер Майами» обезопасил своё спортивное будущее, закрепив за собой Луиса Суареса контрактом на сезон MLS 2026.	<p>Майами — «Интер Майами» обезопасил своё спортивное будущее, закрепив за собой Луиса Суареса контрактом на сезон MLS 2026. Решение клуба продлить соглашение с уругвайским нападающим выглядит логичным завершением исторического 2025 года, когда флоридский коллектив завоевал три трофея и потряс американский футбол своими результатами.</p>\n<p>За два года, проведённых на берегах Майами, Суарес трансформировал «Интер» из середняка в серьёзного конкурента мировой лиги. Его прибытие в 2024 году совпало с взлётом команды — в первый же сезон нападающий забил 25 голов, помогая клубу установить рекорд MLS по количеству очков и завоевать первый в истории «Supporters' Shield».</p>\n<p>Нынешний сезон показал, что 38-летний форвард остаётся грозной силой. Суарес сыграл во всех 50 матчах клуба, забив 17 голов и отдав столько же передач. Статистика подтверждает его ценность: 42 гола и 30 передач в 87 матчах — это второй результат в истории франшизы.</p>\n<p>Новый сезон будет особенным — «Интер Майами» переедет на новый стадион Miami Freedom Park, где Суарес получит шанс оставить свой след в новой главе истории клуба.</p>	\N	\N	\N	PUBLISHED	0	2025-12-18 10:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.715	2026-02-04 14:15:57.161
cmkzls3fm0061ahfiq537y14g	Роднина о водке на стадионах: «Значит, футбол уже не умеет сам привлекать людей»	rodnina-o-vodke-na-stadionah	Трёхкратная олимпийская чемпионка Ирина Роднина раскритиковала обсуждение идеи продаж водки на футбольных аренах.	<p>Трёхкратная олимпийская чемпионка Ирина Роднина раскритиковала обсуждение идеи продаж водки на футбольных аренах, связав это с кризисом интереса к игре как к зрелищному продукту. По её словам, переход дискуссии от пива к крепкому алкоголю показывает тревожную тенденцию в российском футболе.</p>\n<p>Роднина считает, что появление водки в буфетах стадионов стало бы символом деградации отрасли: это означало бы, что матч сам по себе уже не способен привлечь болельщика на трибуны без дополнительного «алкогольного» фактора. Она напомнила, что продажа пива на спортивных и концертных площадках в России запрещена с 2005 года, после ужесточения ограничений на рекламу напитка.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 16:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.747	2026-02-04 14:15:57.184
cmkzls3ek004fahfiybxzo9rh	Алаев о судействе РПЛ: ошибок столько же, но РФС проделала большую работу	alaev-o-sudejstve-rpl-oshibok-stolko-zhe	Президент РПЛ Александр Алаев дал взвешенную оценку качеству судейства в российском футболе.	<p>Президент РПЛ Александр Алаев дал взвешенную оценку качеству судейства в российском футболе, подчеркнув баланс между признанием усилий РФС и критикой отдельных аспектов системы.</p>\n<p>«Я не вижу грязи, просто ошибки — столько же, что и в прошлом году», — сказал Алаев, уточняя, что судейские ошибки — это естественная часть футбола, а не результат целенаправленного влияния на результаты матчей. Он позитивно оценил работу федерации: «У нас нет отношений с Мажичем, но РФС проделала большую работу».</p>\n<p>Однако Алаев не оставил без критики ряд проблемных зон в судейской системе. Он заявил, что главный судейский арбитр Мажич «слишком закрыт», а решения Этической комиссии РФС (ЭСК) «слишком однобокие». Кроме того, глава лиги раскритиковал инновационное решение с офсайдными линиями: «Офсайдные линии не убеждают и меня».</p>	\N	\N	\N	PUBLISHED	0	2025-12-16 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.709	2026-02-04 14:15:57.157
cmkzls3f20057ahfi1e5xr5rn	Лукас Вера усилит «Локомотив» до 2028 года	lukas-vera-usilit-lokomotiv-do-2028	Московский «Локомотив» объявил о переходе 28-летнего аргентинского полузащитника Лукаса Веры.	<p>Московский «Локомотив» объявил о переходе 28-летнего аргентинского полузащитника Лукаса Веры, который присоединился к клубу в статусе свободного агента. Контракт с футболистом рассчитан до конца сезона 2027/28, ранее он уже выступал в России за «Оренбург» и «Химки».</p>\n<p>В «Локомотиве» рассчитывают, что аргентинец усилит конкуренцию в средней линии и привнесёт в игру команды агрессию и интеллект на мяче, а болельщики уже поприветствовали новичка тёплыми откликами в клубных медиа-ресурсах.</p>	/uploads/image1-4.jpeg	\N	\N	PUBLISHED	0	2025-12-20 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.726	2026-02-04 14:15:57.17
cmkzls3ft006dahfinkzd3gch	Радимов: «Станкович так и не смог организовать „Спартак" — от хорошего стали искать лучшего»	radimov-stankovich-ne-smog-organizovat-spartak	Владислав Радимов раскритиковал работу Деяна Станковича в «Спартаке» по итогам первой части сезона.	<p>Владислав Радимов раскритиковал работу Деяна Станковича в «Спартаке» по итогам первой части сезона, отметив, что сербский специалист не сумел разобраться с составом и превратить дорогие трансферы в цельную игру. По его словам, команда показала отличную осень в прошлом сезоне, но затем тренер «начал шарахаться», а клуб от «хорошего начал искать лучшего».</p>\n<p>Радимов заявил, что при таких исполнителях, как Барко и Жедсон, красно-белые обязаны демонстрировать более яркий футбол: «Такой связки нет ни у одной другой команды, с такими футболистами ты должен легко вскрывать обороны соперников ниже классом, а они еле-еле забивали по одному мячу». Он назвал происходящее «катастрофой», учитывая суммы, потраченные на новичков.</p>\n<p>Отдельно Радимов раскритиковал управленческие решения «Спартака»: продление контракта со Станковичем после четвёртого места и вылета из Кубка, а также предыдущий эксперимент с Гильермо Абаскалем. Он считает, что подобными решениями руководство «четыре года из истории „Спартака" выкинуло просто своим управлением».</p>\n<p>После первой части сезона у «Спартака» 29 очков и шестое место в таблице РПЛ.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 17:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.753	2026-02-04 14:15:57.19
cmkzls3f30059ahfifd5ctkci	Астон Вилла разгромила Манчестер Юнайтед и остаётся скромной в амбициях	aston-villa-razgromila-manchester-yunajted	Астон Вилла одержала важную победу над Манчестер Юнайтед со счётом 2:1, однако тренер Унай Эмери остался верен своей философии умеренности.	<p>Астон Вилла одержала важную победу над Манчестер Юнайтед со счётом 2:1, однако тренер Унай Эмери остался верен своей философии умеренности, отказавшись называть команду претендентом на титул.</p>\n<h3>Матч и результат</h3>\n<p>Встреча, прошедшая в эмоциональной атмосфере, принесла Виллам ценные три очка. Команда продемонстрировала улучшение игры во втором тайме, изменив свой подход и отказавшись от оборонительной тактики с передачами назад.</p>\n<h3>Позиция Эмери: реализм вместо эйфории</h3>\n<p>Испанский наставник в интервью Sky Sports чётко обозначил реальные амбиции своей команды: «Мы не претенденты на титул. Мы здесь, потому что конкурируем на фантастическом уровне. Игроки действительно сосредоточены на каждом матче, следуя нашему плану и сохраняя консистентность. Но быть претендентом — это не наша реальность».</p>\n<p>Эмери подчеркнул, что, несмотря на периодические победы над лидерами вроде Арсенала и Манчестер Сити, эти команды обладают массивным тактическим преимуществом и имеют игроков, находящихся на другом уровне.</p>\n<h3>Ключевые цифры</h3>\n<p>Счёт: Астон Вилла 2:1 Манчестер Юнайтед</p>	\N	\N	\N	PUBLISHED	0	2025-12-21 19:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.727	2026-02-04 14:15:57.171
cmkzls3fp0067ahfiykqg6n40	Источник из «Ростова» смягчил картину: «Не 5, а до 2 млрд долга»	istochnik-iz-rostova-smyagchil-kartinu	После сообщений о долге «Ростова» до ₽5 млрд один из представителей клуба озвучил другую версию происходящего.	<p>После сообщений о долге «Ростова» до ₽5 млрд и риске не доиграть сезон в РПЛ один из представителей клуба связался с автором инсайда и озвучил «ростовскую» версию происходящего. По его словам, обязательства клуба не превышают 2 млрд рублей, из которых около 600–700 млн составляют кассовый разрыв, а остальная часть может обслуживаться «долго».</p>\n<p>Собеседник также заявил, что зимние сборы команды уже оплачены примерно на 50%, а контракт с техническим спонсором «Альбой» подписан, несмотря на ранее звучавшие сомнения. Отдельно подчёркнуто, что зарплата футболистам основной обоймы закрыта по октябрь, что, по версии клуба, не позволяет говорить о критической просрочке по всем ведомостям.</p>\n<p>Автор канала отмечает, что считает важным представить и такой взгляд на состояние дел в главном клубе Юга России, на фоне более жёстких оценок о долговой нагрузке и неясных перспективах финансирования спорта в регионе в проекте бюджета 2026.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.75	2026-02-04 14:15:57.187
cmkzls3fv006hahfin5fudhsc	РФС выпустил детскую книгу «Как устроен футбол» о истории игры и пути в профессию	rfs-vypustil-detskuyu-knigu-kak-ustroen-futbol	Российский футбольный союз представил иллюстрированную книгу «Как устроен футбол» для детей 5–12 лет.	<p>Российский футбольный союз представил иллюстрированную книгу «Как устроен футбол» для детей 5–12 лет, в которой простым языком рассказывается, как возник и развивался футбол: от игр в Древнем Китае, Греции и Риме до современности. Юные читатели узнают, как устроены команды, из чего состоит экипировка, что происходит на стадионе в день матча и какие шаги нужно пройти, чтобы стать профессиональным футболистом.</p>\n<p>Издание сопровождается множеством рисунков художника Екатерины Минеевой, которые помогают детям лучше ориентироваться в материале и визуально представить устройство футбольного мира. Книга адресована не только детям, уже увлечённым футболом, но и тем, кто только начинает интересоваться игрой, а также родителям, тренерам и педагогам.</p>\n<p>Главный тренер сборной России Валерий Карпин назвал книгу «настоящим подарком для юных болельщиков и спортсменов», отметив, что в ней «просто и понятно рассказано, с чего начался футбол, как он развивался и почему миллионы людей во всем мире так сильно его любят».</p>	\N	\N	\N	PUBLISHED	0	2025-12-24 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.755	2026-02-04 14:15:57.192
cmkzls3fe005lahfi6asskx7v	Комбаров: «Когда нет еврокубков — время воспитывать русскую молодежь и давать шанс российским тренерам»	kombarov-vremya-vospityvat-russkuyu-molodezh	Бывший защитник «Спартака» и сборной России Дмитрий Комбаров считает, что московскому клубу пора доверить команду российскому специалисту.	<p>Бывший защитник «Спартака» и сборной России Дмитрий Комбаров считает, что московскому клубу пора доверить команду российскому специалисту. По его мнению, текущая ситуация без участия в еврокубках идеальна для курса на развитие своих тренеров и молодых игроков.</p>\n<p>Комбаров отметил, что исполняющий обязанности главного тренера Вадим Романов начал работу удачно — с побед в двух дерби, но затем последовало поражение от «Балтики», которая заканчивала матч в меньшинстве, и этот результат он назвал «спорным».</p>\n<p>«Конечно. В сегодняшнее время, когда нет еврокубков — время воспитывать русскую молодежь и давать шанс русским тренерам», — заявил Комбаров, отвечая на вопрос, нужно ли дать шанс специалистам из России.</p>\n<p>После 18 туров «Спартак» набрал 29 очков и занимает шестое место в таблице чемпионата России.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.738	2026-02-04 14:15:57.176
cmkzls3fg005pahfiwo3famrn	«Король Кадзу» продолжит карьеру в 58 лет: Миура близок к переходу в клуб третьего дивизиона Японии	korol-kadzu-prodolzhit-kareru-v-58-let	Легендарный японский нападающий Кадзуёси Миура, известный как «King Kazu», в 58 лет готовится к 41-му сезону на профессиональном уровне.	<p>Легендарный японский нападающий Кадзуёси Миура, известный как «King Kazu», в 58 лет готовится к 41-му сезону на профессиональном уровне и, по данным японских СМИ, перейдёт в клуб третьего дивизиона Fukushima United на годичную аренду. В прошлом сезоне форвард выступал за команду четвёртого уровня Atletico Suzuka, за которую провёл семь матчей.</p>\n<p>Сделка пока не объявлена официально, однако последние клубы Миуры традиционно раскрывали его переходы 11 января в 11:11 — в отсылке к любимому игровому номеру ветерана. В феврале он отметит 59-летие, оставаясь одним из старейших действующих профессиональных футболистов в мире.</p>\n<p>Миура начал карьеру ещё в 1986 году в бразильском «Сантосе» и за почти четыре десятилетия успел поиграть в Италии, Хорватии, Австралии и Португалии, став одной из ключевых фигур в расцвете J-League в 1990-х. За сборную Японии нападающий забил 55 голов в 89 матчах, хотя и не попал в заявку на первый для страны чемпионат мира 1998 года.</p>	\N	\N	\N	PUBLISHED	0	2025-12-22 15:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.74	2026-02-04 14:15:57.178
cmkzls3fi005tahfi7oxedl4l	Каряка может сменить Биджиева в махачкалинском «Динамо»	karyaka-mozhet-smenit-bidzhieva-v-dinamo-mahachkala	Главный тренер медиаклуба «СКА-Ростов» Андрей Каряка попал в шорт-лист претендентов на пост наставника «Динамо» Махачкала.	<p>Главный тренер медиаклуба «СКА-Ростов» Андрей Каряка попал в шорт-лист претендентов на пост наставника «Динамо» Махачкала. О интересе к 47-летнему специалисту сообщил журналист Legalbet Анар Ибрагимов.</p>\n<p>По его информации, Каряка рассматривается на равных с нынешним тренером «Черноморца» Вадимом Евсеевым. При этом у Каряки уже есть опыт работы в структуре дагестанского футбола: в 2015–2018 годах он был помощником Гаджи Гаджиева в «Амкаре», а сейчас Гаджиев возглавляет «Махачкалу» в статусе президента.</p>\n<p>Тренерский вопрос в «Динамо» обострился после недавней отставки Хасанби Биджиева, одобренной попечительским советом клуба. Команда идёт лишь на 13-м месте в таблице чемпионата России с 15 очками, поэтому выбор нового главного тренера рассматривают как ключевой шаг в попытке выправить ситуацию во второй части сезона.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 06:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.743	2026-02-04 14:15:57.18
cmkzls3f8005hahfin6y4v2xd	Точилин назвал тройку лучших тренеров РПЛ-2025: Мусаев, Талалаев и Семак	tochilin-trojka-luchshih-trenerov-rpl-2025	Бывший главный тренер «Сочи» Александр Точилин выделил тройку лучших тренеров сезона-2025 в РПЛ.	<p>Бывший главный тренер «Сочи» Александр Точилин выделил тройку лучших тренеров сезона-2025 в Российской Премьер-лиге, поставив на первое место наставника «Краснодара» Мурада Мусаева, а также включив в список Андрея Талалаева («Балтика») и Сергея Семака («Зенит»).</p>\n<p>Отвечая на вопрос о прогрессе тренеров, Точилин особо отметил Талалаева: по его словам, именно он прибавил больше остальных, поскольку «для Андрея Викторовича „Балтика" — это такой большой шаг вперед», тогда как Мусаев и Семак уже давно заявили о себе на этом уровне.</p>\n<p>При этом Фабио Челестини в тройку не попал: Точилин считает, что по первому сезону рано судить о влиянии швейцарца на ЦСКА. Говоря о тех, у кого сезон складывается неудачно, специалист назвал Валерия Карпина, Игоря Осинькина и Вадима Шпилевского.</p>\n<p>После 18 туров РПЛ лидирует «Краснодар» Мусаева (40 очков), далее идут «Зенит» (39) и «Локомотив» (37).</p>	\N	\N	\N	PUBLISHED	0	2025-12-21 08:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.732	2026-02-04 14:15:57.174
cmkzls3fr0069ahfitypjzosc	Тебас: «Напряжение в Ла Лиге исходит не от „Барсы", а от „Реала"»	tebas-napryazhenie-v-la-lige-ot-reala	Президент Ла Лиги Хавьер Тебас заявил, что нынешнюю «напряжённость» в испанском футболе формирует не «Барселона», а «Реал Мадрид».	<p>Президент Ла Лиги Хавьер Тебас в интервью изданию Sport заявил, что нынешнюю «напряжённость» в испанском футболе, по его мнению, формирует не «Барселона», а «Реал Мадрид» и медиа-ресурсы клуба. «„Барса" не создаёт напряжение, это „Мадрид" со своими заявлениями и своим президентом против всех», — сказал функционер, комментируя информационную повестку вокруг судейства и скандалов последних лет.</p>\n<p>Тебас вновь раскритиковал позицию Флорентино Переса, отметив, что мадридский клуб, по его мнению, строит «нарратив всемирной конспирации против „Реала"». Глава Ла Лиги подчёркнул, что регулярно слышит из Мадрида обвинения в адрес арбитров и организаций, тогда как сам считает ситуацию следствием обычных ошибок и недочётов системы, а не целенаправленного заговора.</p>\n<p>Высказывания Тебаса вызвали очередной виток полемики между сторонниками двух грандов испанского футбола, для которых медиа-война стала неотъемлемой частью противостояния на фоне судейских споров, дела Негрейры и обсуждения реформ европейских турниров.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 15:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.751	2026-02-04 14:15:57.188
cmkzls3fw006jahfiep6zbfid	Смородская раскритиковала систему лицензирования тренеров в России	smorodskaya-raskritikovala-licenzirovanie-trenerov	Бывший президент «Локомотива» Ольга Смородская заявила, что профессия футбольного тренера является «очень редкой».	<p>Бывший президент «Локомотива» Ольга Смородская заявила, что профессия футбольного тренера является «очень редкой», а в России к подготовке специалистов относятся слишком формально. По её словам, в стране допущено много ошибок: «надавали бумажек людям» после короткого курса, сразу делая их «профессионалами», либо наоборот не допускали достойных кандидатов до учёбы, что подрывает качество тренерской школы.</p>\n<p>Смородская подчеркнула, что к лицензированию тренеров необходимо подходить гораздо более предметно и ответственно, особенно с учётом того, что Россия позиционирует себя как футбольная страна, но при этом тренерам «очень сложно расти», когда клубы почти не представлены на международной арене.</p>\n<p>На этом фоне она отдельно отметила, что назначение Ролана Гусева главным тренером «Динамо» до конца сезона выглядит логичным шагом: времени на поиск другого кандидата мало, и российским специалистам нужно давать шанс проявить свой потенциал.</p>	\N	\N	\N	PUBLISHED	0	2025-12-24 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.757	2026-02-04 14:15:57.193
cmkzls3fz006nahfi0397tuqx	Рэшфорд: «Тренируюсь изо всех сил, чтобы остаться в „Барсе"»	reshford-treniruus-chtoby-ostatsya-v-barse	Нападающий «Барселоны» Маркус Рэшфорд заявил, что его главная цель — продолжить карьеру в каталонском клубе после завершения аренды.	<p>Нападающий «Барселоны» Маркус Рэшфорд в эксклюзивном интервью Sport заявил, что его главная цель — продолжить карьеру в каталонском клубе после завершения аренды из «Манчестер Юнайтед». Англичанин отметил, что чувствует себя в команде комфортно и рассматривает «Барсу» как идеальное место для дальнейшего развития.</p>\n<p>«Конечно, я хочу остаться в „Барсе". Это конечная цель, но не поэтому я так усердно тренируюсь и выкладываюсь по максимуму. Цель — победы. „Барса" — огромный, фантастический клуб, созданный для того, чтобы выигрывать трофеи», — сказал Рэшфорд, у которого в этом сезоне 7 голов и 11 результативных передач во всех турнирах.</p>\n<p>Форвард подчеркнул, что давление на «Камп Ноу» его не пугает, а наоборот мотивирует: «Здесь есть давление, но не негативное — это именно тот уровень требований, который я хотел всегда. Мне трудно было бы выкладываться на максимум в клубе без больших задач».</p>\n<p>Контракт аренды Рэшфорда рассчитан до июня 2026 года и включает опцию выкупа, которую «Барселона» может активировать в любой момент сезона.</p>	\N	\N	\N	PUBLISHED	2	2025-12-24 15:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.759	2026-02-04 14:15:57.195
cmkzls3g2006tahfishx39frx	Ротенберг поздравил Гусева с назначением и назвал его выбором «в долгую»	rotenberg-pozdravil-guseva-s-naznacheniem	Владелец «Динамо» Борис Ротенберг поздравил Ролана Гусева с утверждением на пост главного тренера и подчеркнул ставку на долгосрочное развитие.	<p>Владелец «Динамо» Борис Ротенберг поздравил Ролана Гусева с утверждением на пост главного тренера московского клуба и подчеркнул, что видит в этом ставку на долгосрочное развитие, а не временное решение. По его словам, Гусев — «человек динамовской системы», воспитанник клуба, заслуженный мастер спорта и обладатель Кубка УЕФА, который давно работает внутри структуры и хорошо знает команду и клубную философию.</p>\n<p>Ротенберг отдельно отметил важность того, что «клуб доверяет людям, которые по-настоящему переживают за эмблему и понимают, что такое преемственность». Он пожелал Гусеву удачи и уверенности на новом этапе и напомнил, что у «Динамо» есть все условия для поступательного развития: «сильный состав, отличные условия и преданные болельщики», что позволяет спокойно и последовательно строить команду.</p>\n<p>Владелец клуба выразил надежду, что доверие руководства будет оправдано результатами, а проделанная работа принесёт плоды не только в ближайшей перспективе, но и в будущем.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 16:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.762	2026-02-04 14:15:57.198
cmkzls3gb0079ahfikv13fpcx	Масалитин: в России тренеров продвигают по связям, а не по доверию и системе	masalitin-v-rossii-trenerov-prodvigayut-po-svyazyam	Бывший форвард ЦСКА Валерий Масалитин заявил, что ключевая проблема российской тренерской школы в том, что карьера тренеров зависит от знакомств.	<p>Бывший форвард ЦСКА и эксперт Валерий Масалитин заявил, что ключевая проблема российской тренерской школы в том, что карьера тренеров всё чаще зависит от знакомств, а не от системной подготовки и доверия клубов. Он напомнил, что раньше на тренерские курсы попадали по направлению от клубов, специалисты возвращались на конкретные места работы, а теперь «плати и учись», и многие остаются без команды, если нет нужных контактов.</p>\n<p>По мнению Масалитина, единицы в России идут вверх за счёт реального таланта и знаний, а большинство назначений делается «по указке», что отражает общую модель отношений в стране. Он считает, что топ-клубы почти не воспитывают собственных тренеров, хотя могли бы последовательно поднимать специалистов из академий и нижних лиг, как это когда-то проходили Сёмин, Романцев и Газзаев.</p>\n<p>Эксперт отмечает, что в итоге в РПЛ мало готовых к работе в топ-клубах наставников, а клубы предпочитают «низкосортных иностранцев». На примере Ролана Гусева в «Динамо» он говорит, что успех возможен только при реальном доверии и готовности клубов отвечать за свои кадровые решения.</p>	\N	\N	\N	PUBLISHED	0	2025-12-25 15:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.771	2026-02-04 14:15:57.205
cmkzls3fs006bahfiac1hq5kp	Аршавин: от обмена Дивеева на Лусиано выиграют и ЦСКА, и «Зенит»	arshavin-obmen-diveeva-na-lusiano-vyigrayut-obe-komandy	Зампред правления «Зенита» Андрей Аршавин считает, что потенциальный обмен может пойти на пользу обеим командам.	<p>Зампред правления «Зенита» по спортивному развитию Андрей Аршавин считает, что потенциальный обмен защитника ЦСКА Игоря Дивеева на нападающего петербуржцев Лусиано Гонду может пойти на пользу обеим командам. По его словам, армейцы в таком сценарии получают нужного форварда, а «Зенит» усиливает центр обороны игроком с большим опытом в РПЛ.</p>\n<p>Аршавин назвал Лусиано «сильным и очень мастеровитым футболистом», отметив, что ему «немного не хватает скорости», но в остальном он способен укрепить атаку ЦСКА. 24-летний аргентинец забил 13 мячей в 51 матче за «Зенит», тогда как 26-летний Дивеев провёл за ЦСКА более 200 игр и отличился 20 голами, что делает возможный обмен одним из самых обсуждаемых трансферных ходов зимы в РПЛ.</p>	\N	\N	\N	PUBLISHED	2	2025-12-24 07:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.752	2026-02-04 14:15:57.189
cmkzls3g4006xahfij0yczpw4	Белоголовцев: «Будь моя воля, „Спартак" тренировал бы Титов»	belogolovcev-bud-moya-volya-spartak-treniroval-by-titov	Актёр и давний фанат красно-белых Сергей Белоголовцев признался, что в идеале хотел бы видеть у руля «Спартака» Егора Титова.	<p>Актёр и давний фанат красно-белых Сергей Белоголовцев признался, что в идеале хотел бы видеть у руля «Спартака» Егора Титова. Он подчеркнул, что относится к нему с огромным уважением и считает, что для клуба было бы «круто», если бы команду возглавил человек, который долгие годы был её лицом на поле.</p>\n<p>По словам Белоголовцева, Титов был не только топ-футболистом с выдающимся пониманием игры, но и настоящим «мужиком» и бойцом — тем типом лидера, который умеет терпеть, держать удар и требовать от других того же. Актёр отметил, что часто именно таким людям верят в раздевалке, и это качество он считает не менее важным, чем тренерские дипломы и модные тактические схемы.</p>\n<p>Отсутствие у Титова серьёзного опыта работы главным тренером Белоголовцев не видит критическим фактором, напомнив, что «никто не начинает сразу с багажом десяти лет на скамейке». Он уверен, что при должной поддержке клуба и правильном штабе бывший капитан «Спартака» мог бы вырасти в сильного наставника и стать для команды символом преемственности.</p>	\N	\N	\N	PUBLISHED	2	2025-12-26 08:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.765	2026-02-04 14:15:57.199
cmkzls3g0006pahfid82d7jvn	СМИ: Евсеев возглавит махачкалинское «Динамо», стороны согласовывают детали контракта	evseev-vozglavit-dinamo-mahachkala	По информации «Чемпионата», 49-летний Вадим Евсеев в ближайшее время станет новым главным тренером махачкалинского «Динамо».	<p>По информации «Чемпионата», 49-летний Вадим Евсеев в ближайшее время станет новым главным тренером махачкалинского «Динамо». Источник, знакомый с ситуацией, сообщает, что сейчас клуб и специалист согласовывают последние детали трудового соглашения.</p>\n<p>В данный момент Евсеев руководит новороссийским «Черноморцем», с которым работает с сентября этого года, его контракт рассчитан до конца сезона. Ранее сообщалось, что «Динамо» готово выплатить компенсацию за тренера клубу из Первой лиги.</p>\n<p>Пост наставника махачкалинцев освободился после отставки Хасанби Биджиева, подавшего заявление после поражения от «Пари НН» (0:1) в 18-м туре Мир РПЛ. Сейчас «Динамо» занимает 13-е место в таблице чемпионата России и ведёт борьбу за сохранение прописки в лиге, а выбор нового главного тренера рассматривается как ключевой шаг в подготовке ко второй части сезона.</p>	\N	\N	\N	PUBLISHED	0	2025-12-24 08:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.76	2026-02-04 14:15:57.196
cmkzls3g5006zahfi3cqc946d	Гришин: «Секрет „Балтики" — в лучшей обороне лиги, но из-за фолов игра рвётся на части»	grishin-sekret-baltiki-v-luchshej-oborone-ligi	Бывший полузащитник ЦСКА Александр Гришин назвал крепкую оборону главным козырем «Балтики», которая после 18 туров идёт пятой в РПЛ.	<p>Бывший полузащитник ЦСКА Александр Гришин назвал крепкую оборону главным козырем «Балтики», которая после 18 туров идёт пятой в Мир РПЛ с 35 очками и имеет наименьшее число пропущенных мячей в лиге. По его словам, команда Андрея Талалаева «строится от печки», надёжно защищается и за счёт реализации моментов Хиля (10 голов), Петрова и Титкова удерживается так высоко в таблице.</p>\n<p>При этом Гришин отметил, что использование тактики мелкого фола негативно влияет на зрелищность: игра «рвётся на части», за тайм может набираться около 20 нарушений, а чистое игровое время, по его оценке, иногда составляет всего «условные семь минут» из 45. Эксперт считает, что футбол у калининградцев «неплохой, но не очень зрелищный», так как постоянные ауты и штрафные сбивают темп, хотя с точки зрения результата команда продолжает набирать очки.</p>	\N	\N	\N	PUBLISHED	0	2025-12-25 11:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.766	2026-02-04 14:15:57.2
cmkzls3g60071ahfip3fpesb7	«Бернабеу» превращается в золотую жилу: тур, рестораны и VR-проект с Apple ведут «Реал» к рекордным 400 млн евро	bernabeu-prevrashhaetsya-v-zolotuyu-zhilu	Обновлённый «Сантьяго Бернабеу» становится главным финансовым драйвером «Реала»: клуб заложил рекордные 1,248 млрд евро доходов на сезон 2025/26.	<p>Обновлённый «Сантьяго Бернабеу» становится главным финансовым драйвером «Реала»: клуб заложил рекордные 1,248 млрд евро доходов на сезон 2025/26, из которых около 402,5 млн даст именно эксплуатация стадиона. Маркетинг (примерно 540 млн) и коммерческое использование арены вместе обеспечат более 75% всех поступлений, а сам «Бернабеу» уже позиционируется не как футбольное поле, а как многофункциональная площадка развлечений и туризма.</p>\n<p>Отдельный блок — «новые» стадионные доходы, не связанные с матчами: тур по стадиону, мероприятия, концерты и рестораны уже принесли клубу 79,1 млн евро за прошлый сезон, причём только тур дал 52,6 млн и по выручке уверенно обошёл Музей Прадо (27 млн в 2023-м). Сети общественного питания, VIP-зоны, Bernabéu Market и гастрономические проекты вроде KŌ by 99 Sushi Bar ещё не вышли на полный режим, но уже стали важной частью «рецепта».</p>\n<p>Следующий шаг — технологический проект Bernabéu Infinito в партнёрстве с Apple, который должен позволить болельщикам по всему миру «посещать» стадион в формате VR с помощью гарнитур Apple Vision Pro. Президент «Реала» Флорентино Перес описывает это как «открытие дверей стадиона для всей планеты».</p>	\N	\N	\N	PUBLISHED	2	2025-12-26 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.767	2026-02-04 14:15:57.201
cmkzls3ej004dahfijw1vg8fa	Овсянников о португальском опыте: «У нас более развитая страна, чем Португалия»	ovsyannikov-o-portugalskom-opyte	Вратарь «Оренбурга» Богдан Овсянников подробно рассказал о своём времени в Португалии и сравнил условия жизни в двух странах.	<p>Вратарь «Оренбурга» Богдан Овсянников подробно рассказал о своём времени в Португалии, где он прошёл стажировку в академиях ведущих клубов, и сравнил условия жизни в двух странах.</p>\n<p>Овсянников приехал в Португалию совсем юным — ему было всего 17–18 лет, когда он оказался в стране для развития в академиях португальских гигантов. «Получил опыт, поиграл с хорошими академиями: «Бенфика», «Спортинг», «Порту». Адаптация была непростая, но, думаю, в будущем это помогло», — вспоминал он.</p>\n<p>Говоря о стиле португальского футбола, Овсянников отметил его атакующий характер: «Они больше играют в атаку, не закрываются, обороны намного меньше, например, чем в России». Тренеры учили его быстро доставлять мяч в атакующую зону.</p>\n<p>На вопрос о затратах Овсянников подчеркнул, что жить в Португалии дороже: «Цены на ЖКХ — у них намного выше. И электроэнергия, и отопление — это всё больше, чем в России».</p>\n<p>В итоговой оценке стран вратарь отдал предпочтение России: «Скорее всего, в России. У нас более развитая страна, чем Португалия. Не стоим на месте, развиваемся. Вся Россия и города развиваются, инфраструктура становится лучше».</p>	\N	\N	\N	PUBLISHED	0	2025-12-16 08:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.708	2026-02-04 14:15:57.155
cmkzls3f5005dahfi95hdgmey	Аморим: «Манчестер Юнайтед» не станет паниковать на зимнем трансферном рынке	amorim-manchester-yunajted-ne-stanet-panikovat	Главный тренер «Манчестер Юнайтед» Рубен Аморим заявил, что клуб не собирается хаотично усиливаться в январское трансферное окно.	<p>Главный тренер «Манчестер Юнайтед» Рубен Аморим заявил, что клуб не собирается хаотично усиливаться в январское трансферное окно, несмотря на растущие кадровые проблемы. Его слова прозвучали после поражения от «Астон Виллы» (1:2), в ходе которого травму мягких тканей получил капитан команды Бруну Фернандеш и был заменён в перерыве.</p>\n<p>Аморим подтвердил, что Фернандеш пропустит «какое-то количество матчей», а полузащитник Кобби Мэйну также выбыл из строя из-за повреждения и не сыграет в Boxing Day против «Ньюкасла». «Что мы точно не можем сделать — дойти до января и в спешке пытаться сделать всё сразу и наделать ошибок. Тогда снова начнётся: „мы опять всё сделали неправильно"», — подчеркнул тренер.</p>\n<p>Португальский специалист добавил, что в нынешней ситуации команда, возможно, вынуждена будет «пострадать», но интересы клуба должны стоять выше сиюминутных решений. «Конечно, нам нужны очки. Сейчас чувствуется, что нам предстоит страдать, но клуб — на первом месте», — резюмировал Аморим.</p>	\N	\N	\N	PUBLISHED	0	2025-12-21 20:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.73	2026-02-04 14:15:57.173
cmkzls3fl005zahfivar7nybg	Гендиректор «Ростова»: счета клуба разблокируют до конца года	gendirektor-rostova-scheta-razblokiruyut-do-konca-goda	Генеральный директор «Ростова» Игорь Гончаров заявил, что в ближайшие дни ограничения на операции по банковским счетам клуба будут сняты.	<p>Генеральный директор «Ростова» Игорь Гончаров заявил, что в ближайшие дни ограничения на операции по банковским счетам клуба будут сняты. По его словам, с налоговой инспекцией удалось выйти на общий знаменатель, и задолженность будет погашена до конца года.</p>\n<p>22 декабря ФНС приостановила операции по 11 счетам «Ростова» из-за долгов по налогам, сборам, пеням и штрафам; в августовских данных службы фигурировала просрочка по пеням около 2,8 млн рублей. «Есть задолженность по налогам и сборам… В ближайшее время долг погасим», — подчеркнул Гончаров, комментируя ситуацию.</p>\n<p>Несмотря на финансовые трудности, команда Джонатана Альбы завершила первую часть сезона на 11-м месте в чемпионате России, набрав 21 очко после 18 туров. В прошлом сезоне «Ростов» стал серебряным призёром Кубка России, и руководство надеется стабилизировать финансовый блок, не допустив влияния проблем со счетами на спортивные результаты.</p>	\N	\N	\N	PUBLISHED	0	2025-12-23 08:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.746	2026-02-04 14:15:57.183
cmkzls3fx006lahfi0bw5qwc4	«Переход в „Барсу" показался шуткой». Тринкану признался, что не был готов к такому прыжку	trinkanu-perehod-v-barsu-pokazalsya-shutkoj	Полузащитник «Спортинга» Франсишку Тринкану рассказал, как узнал об интересе «Барселоны» и признался, что поначалу не воспринял новость всерьёз.	<p>Полузащитник «Спортинга» Франсишку Тринкану рассказал, как узнал об интересе «Барселоны» и признался, что поначалу не воспринял новость всерьёз. По словам игрока, отец позвонил ему во время сбора и сообщил о предложении каталонцев, но футболист решил, что это одна из привычных семейных шуток и лишь после матча понял, что речь идёт о реальном переходе.</p>\n<p>Тринкану отметил, что резкий шаг из «Браги» в «Барселону» оказался для него слишком большим вызовом, к которому он не чувствовал себя до конца подготовленным. В Португалии он оставался «домашним парнем», окружённым заботой и более мягкими ожиданиями, тогда как в Испании сразу столкнулся с колоссальным уровнем давления и интереса к каждой своей игре.</p>\n<p>Футболист добавил, что период адаптации в Испании был особенно тяжёлым для его семьи. Сам Тринкану старается воспринимать этот опыт как важный этап карьеры, подчёркивая, что выступления рядом с Лионелем Месси и работа в одной сборной с Криштиану Роналду дали ему огромный профессиональный рост.</p>	\N	\N	\N	PUBLISHED	0	2025-12-24 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.758	2026-02-04 14:15:57.194
cmkzls3g90075ahfih8zhqwpk	«Уходил из „Челси" чемпионом и понял, что мне нужен „МЮ" в резюме» — Матич о переходе к сопернику	matich-o-perehode-iz-chelsi-v-myu	Неманья Матич объяснил, что переход из «Челси» в «Манчестер Юнайтед» в 2017-м был для него осознанным карьерным шагом.	<p>Неманья Матич объяснил, что переход из «Челси» в «Манчестер Юнайтед» в 2017-м был для него осознанным карьерным шагом: он уходил с «Стэмфорд Бридж» в статусе чемпиона и чувствовал, что «нужно иметь „Юнайтед" в своём резюме». По словам серба, решающим фактором стало приглашение Жозе Моуринью и ощущение, что в Лондоне клуб ищет нового игрока на его позицию, тогда как «Юнайтед» оставался для него наряду с «Реалом» одним из двух исторически самых больших клубов мира.</p>\n<p>Матич отметил, что до сих пор считает переход правильным решением, несмотря на непростую пост-фергюсоновскую эпоху: за пять сезонов на «Олд Траффорд» он закрепил репутацию надёжного полузащитника, выиграл трофеи и забил несколько эффектных голов, прежде чем продолжить карьеру в «Роме», «Ренне», «Лионе» и затем «Сассуоло».</p>\n<p>Сам факт выступления за «Челси», «Манчестер Юнайтед» и «Бенфику» он называет частью пути игрока, который сознательно выбирал челленджи на высочайшем уровне, а не только комфорт.</p>	\N	\N	\N	PUBLISHED	0	2025-12-25 13:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	\N	\N	2026-01-29 15:22:35.769	2026-02-04 14:15:57.203
cmkzls3ga0077ahfil7dm9tkc	В РФС подсветили риски установления лимитов на легионеров	rfs-podsvetili-riski-limita-na-legionerov	В Российском футбольном союзе считают, что переход к обновлённой системе лимита на легионеров несёт серьёзные риски для развития клубов.	<p>В Российском футбольном союзе считают, что переход к обновлённой системе лимита на легионеров несёт серьёзные риски для развития клубов и всего чемпионата. Отмечается, что жёсткие ограничения по иностранцам могут снизить зрелищность и общий уровень РПЛ, а также осложнить конкурентоспособность российских команд на международной арене.</p>\n<p>Кроме того, в РФС предупреждают о возможных финансовых последствиях: падение качества футбола и интереса болельщиков может ударить по доходам от трансляций, спонсорских контрактов и маркетинга. При этом вопрос баланса между поддержкой российских игроков и сохраняющейся привлекательностью лиги для сильных легионеров назван одним из ключевых в текущей дискуссии о лимите.</p>	\N	\N	\N	PUBLISHED	0	2025-12-25 09:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.77	2026-02-04 14:15:57.204
cmkzls3ge007dahfiajptm1qn	Зобнин близок к новому контракту со «Спартаком»: стороны улаживают последние детали	zobnin-blizok-k-novomu-kontraktu-so-spartakom	Полузащитник и капитан «Спартака» Роман Зобнин ведёт финальные переговоры о новом контракте с московским клубом.	<p>Полузащитник и капитан «Спартака» Роман Зобнин ведёт финальные переговоры о новом контракте с московским клубом, при этом обе стороны настроены сохранить сотрудничество. По данным Metaratings.ru, действующее соглашение 31-летнего игрока рассчитано до конца сезона 2025/26, а сейчас клуб и футболист согласовывают оставшиеся детали сделки в позитивном ключе.</p>\n<p>Зобнин выступает за «Спартак» с 2016 года, успев провести за красно-белых 291 матч, забить 21 гол и стать чемпионом России, обладателем Кубка и Суперкубка страны. Отмечается, что хавбек не раз публично декларировал желание остаться в клубе, а новый контракт должен закрепить его статус одного из ключевых и самых стабильных игроков нынешнего состава.</p>	\N	\N	\N	PUBLISHED	464	2025-12-25 12:00:00	\N	\N	\N	cmkzls3ct0000ahfinu5wsos3	cmkzls3d7000wahfifigixlfo	cmkzls3db001bahfikcktfktk	\N	2026-01-29 15:22:35.774	2026-02-04 14:15:57.207
\.


--
-- Data for Name: Bookmaker; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bookmaker" (id, name, slug, logo, bonus, "bonusLabel", "reviewsCount", "playersCount", rating, link, website, "hasLicense", "licenseNumber", "minDeposit", "hasIosApp", "hasAndroidApp", "iosAppLink", "androidAppLink", "isActive", "order", "ratingOrder", "createdAt", "updatedAt") FROM stdin;
cmkzls3e7003wahficd4tzx24	Марафон	marathon	/bookmakers/marathon.png	10000 ₽	Новым игрокам	890	4500	4.2	https://marathonbet.ru	marathonbet.ru	t	ФНС №18	100 ₽	t	t	https://apps.apple.com/ru/app/марафон-ставки-на-спорт/id1481907997	https://marathonbet.ru/android/	t	7	7	2026-01-29 15:22:35.695	2026-02-04 14:15:57.143
cmkzls3e7003xahfit3axvpch	Melbet	melbet	/bookmakers/melbet.png	7000 ₽	Новым игрокам	456	2800	4	https://melbet.ru	melbet.ru	t	ФНС №28	100 ₽	t	t	https://apps.apple.com/ru/app/мелбет/id1534498498	https://melbet.ru/android/	t	9	9	2026-01-29 15:22:35.696	2026-02-04 14:15:57.143
cmkzls3e7003yahfic8wxpjry	Балтбет	balbet	/bookmakers/balbet.png	5000 ₽	Новым игрокам	456	2100	3.9	https://baltbet.ru	baltbet.ru	t	ФНС №5	50 ₽	t	t	https://apps.apple.com/ru/app/балтбет/id1479661538	https://baltbet.ru/android/	t	10	10	2026-01-29 15:22:35.696	2026-02-04 14:15:57.143
cmkzls3e8003zahfi43j74kl3	Лига Ставок	liga-stavok	/bookmakers/liga-stavok.png	7777 ₽	Новым игрокам	1850	7195	4.5	https://ligastavok.ru	ligastavok.ru	t	ФНС №6	100 ₽	t	t	https://apps.apple.com/ru/app/лига-ставок-ставки-на-спорт/id1060498493	https://ligastavok.ru/android/	t	11	11	2026-01-29 15:22:35.696	2026-02-04 14:15:57.144
cmkzls3e4003qahfiryx5wgny	Winline	winline	/bookmakers/winline.png	3000 ₽	Новым игрокам	1439	10589	4.8	https://winline.ru	winline.ru	t	ФНС №27	100 ₽	t	t	https://apps.apple.com/ru/app/winline/id1087498010	https://winline.ru/android/	t	1	1	2026-01-29 15:22:35.692	2026-02-04 14:15:57.14
cmkzls3e4003rahfi6f3mug4a	Leon	leon	/bookmakers/leon.png	25000 ₽	Новым игрокам	1188	6321	4.7	https://leon.ru	leon.ru	t	ФНС №22	100 ₽	t	t	https://apps.apple.com/ru/app/leon-ставки-на-спорт/id1450043999	https://leon.ru/app/	t	3	3	2026-01-29 15:22:35.693	2026-02-04 14:15:57.14
cmkzls3e5003sahfiw6ujrhby	Fonbet	fonbet	/bookmakers/fonbet.png	15000 ₽	Новым игрокам	2404	11248	4.6	https://fonbet.ru	fonbet.ru	t	ФНС №1	100 ₽	t	t	https://apps.apple.com/ru/app/фонбет-ставки-на-спорт/id1059498038	https://fonbet.ru/android/	t	2	2	2026-01-29 15:22:35.693	2026-02-04 14:15:57.141
cmkzls3e5003tahfi8f47cgx0	BetBoom	betboom	/bookmakers/betboom.png	10000 ₽	Эксклюзив	681	5303	4.5	https://betboom.ru	betboom.ru	t	ФНС №14	100 ₽	t	t	https://apps.apple.com/ru/app/betboom-ставки-на-спорт/id1588562887	https://betboom.ru/android/	t	4	4	2026-01-29 15:22:35.694	2026-02-04 14:15:57.141
cmkzls3e80040ahfi314td73w	Olimpbet	olimpbet	/bookmakers/olimpbet.png	15000 ₽	Новым игрокам	1103	5468	4.3	https://olimpbet.ru	olimpbet.ru	t	ФНС №26	100 ₽	t	t	https://apps.apple.com/ru/app/олимпбет-ставки-на-спорт/id1508949485	https://olimpbet.ru/android/	t	12	12	2026-01-29 15:22:35.697	2026-02-04 14:15:57.144
cmkzls3e6003uahfiak1cjajl	Bettery	bettery	/bookmakers/bettery.png	10000 ₽	Новым игрокам	520	3200	4.4	https://bettery.ru	bettery.ru	t	ФНС №30	100 ₽	t	t	https://apps.apple.com/ru/app/bettery/id1547618584	https://bettery.ru/android/	t	5	5	2026-01-29 15:22:35.694	2026-02-04 14:15:57.142
cmkzls3e6003vahfi4bezci5f	Betcity	betcity	/bookmakers/betcity.png	10000 ₽	Новым игрокам	567	1800	4.3	https://betcity.ru	betcity.ru	t	ФНС №16	100 ₽	t	t	https://apps.apple.com/ru/app/бетсити-ставки-на-спорт/id1450821458	https://betcity.ru/ru/app	t	6	6	2026-01-29 15:22:35.695	2026-02-04 14:15:57.142
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, slug, description, icon, "order", "createdAt", "updatedAt") FROM stdin;
cmkzls3d2000cahfit38hrpur	Промокоды Fonbet	promokodyi-fonbet	\N	\N	23	2026-01-29 15:22:35.654	2026-02-04 14:15:57.092
cmkzls3d2000dahficwulbpnh	Лига чемпионов	liga-chempionov	\N	\N	30	2026-01-29 15:22:35.654	2026-02-04 14:15:57.092
cmkzls3d2000eahfi0pxom8a8	Лига Европы	liga-evropyi	\N	\N	31	2026-01-29 15:22:35.655	2026-02-04 14:15:57.093
cmkzls3d3000fahfi5isc556u	РПЛ	rpl	\N	\N	32	2026-01-29 15:22:35.655	2026-02-04 14:15:57.093
cmkzls3d3000gahfiwn9esheq	Кубок России	kubok-rossii	\N	\N	33	2026-01-29 15:22:35.655	2026-02-04 14:15:57.093
cmkzls3d3000hahfi0wqvvyd3	ЧМ-2026 Европа	chm-2026-evropa	\N	\N	34	2026-01-29 15:22:35.656	2026-02-04 14:15:57.093
cmkzls3d3000iahfi5e5q9nq9	ЧМ-2026 CONMEBOL	chm-2026-conmebol	\N	\N	35	2026-01-29 15:22:35.656	2026-02-04 14:15:57.093
cmkzls3d4000jahfi6v5m72oa	АПЛ	apl	\N	\N	36	2026-01-29 15:22:35.656	2026-02-04 14:15:57.094
cmkzls3d4000kahfiozbjtcae	Ла Лига	la-liga	\N	\N	37	2026-01-29 15:22:35.656	2026-02-04 14:15:57.094
cmkzls3d4000lahfioxt5lw1g	Серия А	seriya-a	\N	\N	38	2026-01-29 15:22:35.657	2026-02-04 14:15:57.094
cmkzls3d5000mahfi0d8z19xw	Бундеслига	bundesliga	\N	\N	39	2026-01-29 15:22:35.657	2026-02-04 14:15:57.094
cmkzls3d5000nahfiuijogv4m	Лига 1	liga-1	\N	\N	40	2026-01-29 15:22:35.657	2026-02-04 14:15:57.095
cmkzls3d5000oahfimcuq5ryz	КХЛ	khl	\N	\N	50	2026-01-29 15:22:35.657	2026-02-04 14:15:57.095
cmkzls3d5000pahfidufcgu3b	МЧМ-2026	mchm-2026	\N	\N	51	2026-01-29 15:22:35.658	2026-02-04 14:15:57.096
cmkzls3d6000qahfi5yiu8qyb	Australian Open	australian-open	\N	\N	60	2026-01-29 15:22:35.658	2026-02-04 14:15:57.096
cmkzls3d6000rahfi2udbl2nj	Roland Garros	roland-garros	\N	\N	61	2026-01-29 15:22:35.658	2026-02-04 14:15:57.096
cmkzls3d6000sahfiaxp0e01f	Уимблдон	uimbldon	\N	\N	62	2026-01-29 15:22:35.659	2026-02-04 14:15:57.096
cmkzls3d6000tahfiezmkr6fm	US Open	us-open	\N	\N	63	2026-01-29 15:22:35.659	2026-02-04 14:15:57.096
cmkzls3d7000uahfib7qad6b9	ATP Tour	atp-tour	\N	\N	64	2026-01-29 15:22:35.659	2026-02-04 14:15:57.097
cmkzls3d7000vahfifgk08bvl	WTA Tour	wta-tour	\N	\N	65	2026-01-29 15:22:35.659	2026-02-04 14:15:57.097
cmkzls3d7000wahfifigixlfo	Футбол	futbol	\N	\N	70	2026-01-29 15:22:35.66	2026-02-04 14:15:57.097
cmkzls3d7000xahfim9z8l7qo	Хоккей	hokkey	\N	\N	71	2026-01-29 15:22:35.66	2026-02-04 14:15:57.097
cmkzls3d8000yahfia705a8b5	Теннис	tennis	\N	\N	72	2026-01-29 15:22:35.66	2026-02-04 14:15:57.097
cmkzls3d8000zahfiw2b874ew	Баскетбол	basketbol	\N	\N	73	2026-01-29 15:22:35.66	2026-02-04 14:15:57.098
cmkzls3cx0001ahfi9l7nnmr6	Букмекеры	bukmekeryi	\N	\N	1	2026-01-29 15:22:35.649	2026-02-04 14:15:57.081
cmkzls3cy0002ahfi5il9ln65	Бонусы	bonusyi	\N	\N	2	2026-01-29 15:22:35.65	2026-02-04 14:15:57.087
cmkzls3cy0003ahfipc936rbi	Центр ставок	tsentr-stavok	\N	\N	3	2026-01-29 15:22:35.651	2026-02-04 14:15:57.088
cmkzls3cz0004ahfisa0xw108	Новости	novosti	\N	\N	4	2026-01-29 15:22:35.651	2026-02-04 14:15:57.088
cmkzls3cz0005ahfij8yrmg8e	Букмекеры с бонусами	bukmekeryi-s-bonusami	\N	\N	10	2026-01-29 15:22:35.651	2026-02-04 14:15:57.089
cmkzls3cz0006ahfiy890phva	Приложения букмекеров	prilozheniya-bukmekerov	\N	\N	11	2026-01-29 15:22:35.652	2026-02-04 14:15:57.09
cmkzls3d00007ahfii0tn6pqv	Все легальные букмекеры	vse-legalnyie-bukmekeryi	\N	\N	12	2026-01-29 15:22:35.652	2026-02-04 14:15:57.09
cmkzls3d00008ahfiy2lx0fu5	Честный рейтинг	chestnyiy-reyting	\N	\N	13	2026-01-29 15:22:35.653	2026-02-04 14:15:57.091
cmkzls3d10009ahfihwjjlfs0	Без депозита	bez-depozita	\N	\N	20	2026-01-29 15:22:35.653	2026-02-04 14:15:57.091
cmkzls3d1000aahfiuljsx6gw	Фрибет	fribet	\N	\N	21	2026-01-29 15:22:35.653	2026-02-04 14:15:57.091
cmkzls3d80010ahfi4mcxqrql	ММА	mma	\N	\N	74	2026-01-29 15:22:35.661	2026-02-04 14:15:57.098
cmkzls3d80011ahfi3hfews0n	Бокс	boks	\N	\N	75	2026-01-29 15:22:35.661	2026-02-04 14:15:57.098
cmkzls3d1000bahfi3gp5a3li	Промокод Winline	promokod-winline	\N	\N	22	2026-01-29 15:22:35.654	2026-02-04 14:15:57.092
\.


--
-- Data for Name: ImportJob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ImportJob" (id, "sourceId", status, "itemsFound", "itemsNew", error, "startedAt", "completedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: ImportNotification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ImportNotification" (id, message, count, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: ImportSource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ImportSource" (id, name, slug, type, url, "feedUrl", "isActive", "defaultCategory", "checkInterval", "lastCheckedAt", config, "createdAt", "updatedAt") FROM stdin;
cmkzls3e2003oahfioojhhr25	BBC Sport	bbc-sport	RSS	https://www.bbc.com/sport	https://feeds.bbci.co.uk/sport/rss.xml	t	futbol	30	\N	\N	2026-01-29 15:22:35.69	2026-01-29 15:22:35.69
cmkzls3e3003pahfiso1zvgix	ESPN	espn	RSS	https://www.espn.com	https://www.espn.com/espn/rss/news	t	futbol	30	\N	\N	2026-01-29 15:22:35.691	2026-01-29 15:22:35.691
\.


--
-- Data for Name: ImportedItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ImportedItem" (id, "sourceId", "externalId", "externalUrl", title, excerpt, content, "imageUrl", "publishedAt", "rawData", status, "articleId", "importedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: League; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."League" (id, name, slug, country, logo, "categoryId", "createdAt", "updatedAt") FROM stdin;
cmkzls3d90013ahfiml40logc	Премьер-лига	premier-league	Англия	\N	cmkzls3d7000wahfifigixlfo	2026-01-29 15:22:35.662	2026-01-29 15:56:53.832
cmkzls3da0015ahfiowy0nl1n	Ла Лига	la-liga-league	Испания	\N	cmkzls3d7000wahfifigixlfo	2026-01-29 15:22:35.663	2026-01-29 15:56:53.833
cmkzls3db0017ahfivqxo6co3	Лига чемпионов	champions-league	Европа	\N	cmkzls3d7000wahfifigixlfo	2026-01-29 15:22:35.663	2026-01-29 15:56:53.833
cmkzls3db001bahfikcktfktk	РПЛ	rpl-league	Россия	\N	cmkzls3d7000wahfifigixlfo	2026-01-29 15:22:35.664	2026-01-29 15:56:53.834
cml27qnzg0013jutz4ucxmq3y	АПЛ	apl	Англия	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.972	2026-02-04 14:15:57.099
cml27qnzh0015jutzquk9mzd9	Ла Лига	la-liga	Испания	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.973	2026-02-04 14:15:57.1
cml27qnzh0017jutz8az9jl31	Бундеслига	bundesliga	Германия	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.974	2026-02-04 14:15:57.101
cml27qnzi0019jutzk4j70ctp	Серия А	seriya-a	Италия	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.974	2026-02-04 14:15:57.101
cml27qnzi001bjutz6cxw8lpb	Лига 1	liga-1	Франция	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.974	2026-02-04 14:15:57.101
cml27qnzi001djutzaerrkags	РПЛ	rpl	Россия	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.975	2026-02-04 14:15:57.101
cml27qnzi001fjutz7xlytmnv	Кубок России	kubok-rossii	Россия	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.975	2026-02-04 14:15:57.102
cml27qnzj001hjutz3rv35nqi	Лига чемпионов	liga-chempionov	Европа	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.975	2026-02-04 14:15:57.102
cml27qnzj001jjutzcib47vfb	Лига Европы	liga-evropyi	Европа	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.976	2026-02-04 14:15:57.102
cml27qnzj001ljutzjmbhcd76	Лига конференций	liga-konferenciy	Европа	\N	cmkzls3d7000wahfifigixlfo	2026-01-31 11:12:52.976	2026-02-04 14:15:57.103
cmkzls3db0019ahfihe9dspry	Чемпионат мира	world-cup	Международный	\N	cmkzls3d7000wahfifigixlfo	2026-01-29 15:22:35.663	2026-02-04 14:15:57.103
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Match" (id, "homeTeamId", "awayTeamId", "homeScore", "awayScore", "leagueId", "matchDate", status, venue, "createdAt", "updatedAt") FROM stdin;
cmkzls3dn002dahfi9urjo5pf	cmkzls3dd001eahfictql1xwk	cmkzls3dc001cahfiw7bp74no	2	0	cmkzls3d90013ahfiml40logc	2026-01-27 17:00:00	FINISHED	\N	2026-01-29 15:22:35.675	2026-01-29 15:22:35.675
cmkzls3dn002fahfilhzc4jhf	cmkzls3dc001dahfit1gifb95	cmkzls3df001kahfipkuqd4k0	1	1	cmkzls3d90013ahfiml40logc	2026-01-26 17:00:00	FINISHED	\N	2026-01-29 15:22:35.676	2026-01-29 15:22:35.676
cmkzls3do002hahfidoiqi2sp	cmkzls3de001iahfix43hx7lu	cmkzls3dd001gahfi64glto0s	2	3	cmkzls3d90013ahfiml40logc	2026-01-25 17:00:00	FINISHED	\N	2026-01-29 15:22:35.676	2026-01-29 15:22:35.676
cmkzls3do002jahfi4r17d2b5	cmkzls3dd001fahfih1zdhp38	cmkzls3df001lahfiri2p3kme	1	0	cmkzls3d90013ahfiml40logc	2026-01-24 17:00:00	FINISHED	\N	2026-01-29 15:22:35.677	2026-01-29 15:22:35.677
cmkzls3do002lahfif3h8lgm6	cmkzls3de001hahfio06aynzj	cmkzls3de001jahfin127ldl4	3	1	cmkzls3d90013ahfiml40logc	2026-01-23 17:00:00	FINISHED	\N	2026-01-29 15:22:35.677	2026-01-29 15:22:35.677
cmkzls3dp002nahfi3rbpvouf	cmkzls3df001kahfipkuqd4k0	cmkzls3dd001eahfictql1xwk	0	2	cmkzls3d90013ahfiml40logc	2026-01-22 17:00:00	FINISHED	\N	2026-01-29 15:22:35.677	2026-01-29 15:22:35.677
cmkzls3dp002pahfiexxpa2mg	cmkzls3dc001cahfiw7bp74no	cmkzls3dc001dahfit1gifb95	\N	\N	cmkzls3d90013ahfiml40logc	2026-01-31 17:00:00	SCHEDULED	\N	2026-01-29 15:22:35.677	2026-01-29 15:22:35.677
cmkzls3dp002rahfil1jl017e	cmkzls3dd001gahfi64glto0s	cmkzls3dd001eahfictql1xwk	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-01 17:00:00	SCHEDULED	\N	2026-01-29 15:22:35.678	2026-01-29 15:22:35.678
cmkzls3dq002tahfigzov2dmn	cmkzls3df001kahfipkuqd4k0	cmkzls3de001iahfix43hx7lu	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-03 17:00:00	SCHEDULED	\N	2026-01-29 15:22:35.678	2026-01-29 15:22:35.678
cmkzls3dq002vahfi0sskqjhq	cmkzls3df001lahfiri2p3kme	cmkzls3de001hahfio06aynzj	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-04 17:00:00	SCHEDULED	\N	2026-01-29 15:22:35.678	2026-01-29 15:22:35.678
cmkzls3dq002xahfinua2fwse	cmkzls3de001jahfin127ldl4	cmkzls3dd001fahfih1zdhp38	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-05 17:00:00	SCHEDULED	\N	2026-01-29 15:22:35.679	2026-01-29 15:22:35.679
cmkzn07gz002dqdp6g1q0o0a0	cmkzls3dd001eahfictql1xwk	cmkzls3dc001cahfiw7bp74no	2	0	cmkzls3d90013ahfiml40logc	2026-01-27 17:00:00	FINISHED	\N	2026-01-29 15:56:53.843	2026-01-29 15:56:53.843
cmkzn07h0002fqdp6vf9xy80z	cmkzls3dc001dahfit1gifb95	cmkzls3df001kahfipkuqd4k0	1	1	cmkzls3d90013ahfiml40logc	2026-01-26 17:00:00	FINISHED	\N	2026-01-29 15:56:53.845	2026-01-29 15:56:53.845
cmkzn07h1002hqdp6r5d3x7yx	cmkzls3de001iahfix43hx7lu	cmkzls3dd001gahfi64glto0s	2	3	cmkzls3d90013ahfiml40logc	2026-01-25 17:00:00	FINISHED	\N	2026-01-29 15:56:53.845	2026-01-29 15:56:53.845
cmkzn07h1002jqdp688wpoo5n	cmkzls3dd001fahfih1zdhp38	cmkzls3df001lahfiri2p3kme	1	0	cmkzls3d90013ahfiml40logc	2026-01-24 17:00:00	FINISHED	\N	2026-01-29 15:56:53.846	2026-01-29 15:56:53.846
cmkzn07h1002lqdp68yl9qehy	cmkzls3de001hahfio06aynzj	cmkzls3de001jahfin127ldl4	3	1	cmkzls3d90013ahfiml40logc	2026-01-23 17:00:00	FINISHED	\N	2026-01-29 15:56:53.846	2026-01-29 15:56:53.846
cmkzn07h2002nqdp60yttvog4	cmkzls3df001kahfipkuqd4k0	cmkzls3dd001eahfictql1xwk	0	2	cmkzls3d90013ahfiml40logc	2026-01-22 17:00:00	FINISHED	\N	2026-01-29 15:56:53.846	2026-01-29 15:56:53.846
cmkzn07h2002pqdp6fs6szd47	cmkzls3dc001cahfiw7bp74no	cmkzls3dc001dahfit1gifb95	\N	\N	cmkzls3d90013ahfiml40logc	2026-01-31 17:00:00	SCHEDULED	\N	2026-01-29 15:56:53.846	2026-01-29 15:56:53.846
cmkzn07h2002rqdp6shrib1j0	cmkzls3dd001gahfi64glto0s	cmkzls3dd001eahfictql1xwk	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-01 17:00:00	SCHEDULED	\N	2026-01-29 15:56:53.847	2026-01-29 15:56:53.847
cmkzn07h3002tqdp6n2s8kdta	cmkzls3df001kahfipkuqd4k0	cmkzls3de001iahfix43hx7lu	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-03 17:00:00	SCHEDULED	\N	2026-01-29 15:56:53.847	2026-01-29 15:56:53.847
cmkzn07h3002vqdp6go2osz95	cmkzls3df001lahfiri2p3kme	cmkzls3de001hahfio06aynzj	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-04 17:00:00	SCHEDULED	\N	2026-01-29 15:56:53.847	2026-01-29 15:56:53.847
cmkzn07h3002xqdp6xraz1ufu	cmkzls3de001jahfin127ldl4	cmkzls3dd001fahfih1zdhp38	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-05 17:00:00	SCHEDULED	\N	2026-01-29 15:56:53.848	2026-01-29 15:56:53.848
cml27qnzt002pjutzfa7rrgtb	cmkzls3dd001eahfictql1xwk	cmkzls3dc001cahfiw7bp74no	2	0	cmkzls3d90013ahfiml40logc	2026-01-29 17:00:00	FINISHED	\N	2026-01-31 11:12:52.986	2026-01-31 11:12:52.986
cml27qnzu002rjutzyd5n91uy	cmkzls3dc001dahfit1gifb95	cmkzls3df001kahfipkuqd4k0	1	1	cmkzls3d90013ahfiml40logc	2026-01-28 17:00:00	FINISHED	\N	2026-01-31 11:12:52.987	2026-01-31 11:12:52.987
cml27qnzv002tjutzf88qwaxv	cmkzls3de001iahfix43hx7lu	cmkzls3dd001gahfi64glto0s	2	3	cmkzls3d90013ahfiml40logc	2026-01-27 17:00:00	FINISHED	\N	2026-01-31 11:12:52.987	2026-01-31 11:12:52.987
cml27qnzv002vjutzxhjpjpck	cmkzls3dd001fahfih1zdhp38	cmkzls3df001lahfiri2p3kme	1	0	cmkzls3d90013ahfiml40logc	2026-01-26 17:00:00	FINISHED	\N	2026-01-31 11:12:52.987	2026-01-31 11:12:52.987
cml27qnzv002xjutzz12cygmo	cmkzls3de001hahfio06aynzj	cmkzls3de001jahfin127ldl4	3	1	cmkzls3d90013ahfiml40logc	2026-01-25 17:00:00	FINISHED	\N	2026-01-31 11:12:52.988	2026-01-31 11:12:52.988
cml27qnzw002zjutzcwvwgxrj	cmkzls3df001kahfipkuqd4k0	cmkzls3dd001eahfictql1xwk	0	2	cmkzls3d90013ahfiml40logc	2026-01-24 17:00:00	FINISHED	\N	2026-01-31 11:12:52.988	2026-01-31 11:12:52.988
cml27qnzw0031jutzed3xgka6	cmkzls3dc001cahfiw7bp74no	cmkzls3dc001dahfit1gifb95	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-02 17:00:00	SCHEDULED	\N	2026-01-31 11:12:52.988	2026-01-31 11:12:52.988
cml27qnzw0033jutzb0zkuk6j	cmkzls3dd001gahfi64glto0s	cmkzls3dd001eahfictql1xwk	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-03 17:00:00	SCHEDULED	\N	2026-01-31 11:12:52.989	2026-01-31 11:12:52.989
cml27qnzw0035jutz1n3dju5t	cmkzls3df001kahfipkuqd4k0	cmkzls3de001iahfix43hx7lu	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-05 17:00:00	SCHEDULED	\N	2026-01-31 11:12:52.989	2026-01-31 11:12:52.989
cml27qnzx0037jutzi3bg4gjt	cmkzls3df001lahfiri2p3kme	cmkzls3de001hahfio06aynzj	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-06 17:00:00	SCHEDULED	\N	2026-01-31 11:12:52.989	2026-01-31 11:12:52.989
cml27qnzx0039jutzbbwc2771	cmkzls3de001jahfin127ldl4	cmkzls3dd001fahfih1zdhp38	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-07 17:00:00	SCHEDULED	\N	2026-01-31 11:12:52.989	2026-01-31 11:12:52.989
cml28kc9c00038o0uzm2s2qrg	cml28kc9600008o0uyfudq48v	cml28kc9900018o0u6pgykhgr	1	0	cml27qnzi001fjutz7xlytmnv	2024-07-13 13:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.456	2026-01-31 11:35:57.456
cml28kc9e00078o0upv6tyjqh	cml28kc9d00048o0ujtjz89go	cml28kc9d00058o0u625c1fu5	2	1	cml27qnzi001fjutz7xlytmnv	2024-07-14 10:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.458	2026-01-31 11:35:57.458
cml28kc9f000b8o0uznn5v1ln	cml28kc9e00088o0uw1g06dvm	cml28kc9f00098o0u4mo2okiw	2	0	cml27qnzi001fjutz7xlytmnv	2024-07-14 13:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.46	2026-01-31 11:35:57.46
cml28kc9g000f8o0u36lugsph	cml28kc9f000c8o0u39q2fsk8	cml28kc9g000d8o0u9np07t6b	0	1	cml27qnzi001fjutz7xlytmnv	2024-07-14 13:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.461	2026-01-31 11:35:57.461
cml28kc9i000j8o0u7uj0qsty	cml28kc9h000g8o0up1atkack	cml28kc9h000h8o0ur5avpwfx	3	0	cml27qnzi001fjutz7xlytmnv	2024-07-14 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.462	2026-01-31 11:35:57.462
cml28kc9j000n8o0unvb1ihdj	cml28kc9i000k8o0ux2depc2f	cml28kc9i000l8o0uowglr6fz	4	0	cml27qnzi001fjutz7xlytmnv	2024-07-14 15:30:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.463	2026-01-31 11:35:57.463
cml28kc9k000r8o0u4d8jjzb1	cml28kc9j000o8o0ud1i5bl7h	cml28kc9j000p8o0uez7uocj7	0	0	cml27qnzi001fjutz7xlytmnv	2024-07-14 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.464	2026-01-31 11:35:57.464
cml28kc9l000v8o0u3ipna3g7	cml28kc9k000s8o0uuxgdxwle	cml28kc9k000t8o0ujvrw5jua	1	1	cml27qnzi001fjutz7xlytmnv	2024-07-14 17:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.465	2026-01-31 11:35:57.465
cml28kc9m000z8o0uaf7gxquw	cml28kc9l000w8o0uk08352oy	cml28kc9l000x8o0u12p1mj55	0	0	cml27qnzi001fjutz7xlytmnv	2024-07-15 16:30:00	FINISHED	Akhmat Arena	2026-01-31 11:35:57.466	2026-01-31 11:35:57.466
cml28kc9n00138o0uvkojg8yh	cml28kc9e00088o0uw1g06dvm	cml28kc9f000c8o0u39q2fsk8	2	1	cml27qnzi001fjutz7xlytmnv	2024-07-20 09:30:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.467	2026-01-31 11:35:57.467
cml28kc9o00178o0uxzt4jzdn	cml28kc9k000t8o0ujvrw5jua	cml28kc9d00048o0ujtjz89go	1	0	cml27qnzi001fjutz7xlytmnv	2024-07-20 15:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.468	2026-01-31 11:35:57.468
cml28kc9p001b8o0u14v9x38c	cml28kc9600008o0uyfudq48v	cml28kc9d00058o0u625c1fu5	1	0	cml27qnzi001fjutz7xlytmnv	2024-07-20 16:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.469	2026-01-31 11:35:57.469
cml28kc9q001f8o0ux1e7rkig	cml28kc9j000o8o0ud1i5bl7h	cml28kc9i000l8o0uowglr6fz	1	0	cml27qnzi001fjutz7xlytmnv	2024-07-20 17:00:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.471	2026-01-31 11:35:57.471
cml28kc9r001j8o0u2l4agg0q	cml28kc9h000h8o0ur5avpwfx	cml28kc9l000w8o0uk08352oy	0	1	cml27qnzi001fjutz7xlytmnv	2024-07-21 09:30:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.472	2026-01-31 11:35:57.472
cml28kc9s001n8o0ukk9u87p5	cml28kc9h000g8o0up1atkack	cml28kc9l000x8o0u12p1mj55	2	1	cml27qnzi001fjutz7xlytmnv	2024-07-21 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.473	2026-01-31 11:35:57.473
cml28kc9t001r8o0ulyjhdk8o	cml28kc9f00098o0u4mo2okiw	cml28kc9j000p8o0uez7uocj7	1	1	cml27qnzi001fjutz7xlytmnv	2024-07-21 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.474	2026-01-31 11:35:57.474
cml28kc9u001v8o0u7z7iynda	cml28kc9900018o0u6pgykhgr	cml28kc9k000s8o0uuxgdxwle	1	2	cml27qnzi001fjutz7xlytmnv	2024-07-21 16:30:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.475	2026-01-31 11:35:57.475
cml28kc9w001z8o0u7oiekr26	cml28kc9g000d8o0u9np07t6b	cml28kc9i000k8o0ux2depc2f	1	1	cml27qnzi001fjutz7xlytmnv	2024-07-22 15:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.476	2026-01-31 11:35:57.476
cml28kc9x00238o0ud6nbpjj7	cml28kc9j000p8o0uez7uocj7	cml28kc9l000x8o0u12p1mj55	1	1	cml27qnzi001fjutz7xlytmnv	2024-07-26 17:15:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.477	2026-01-31 11:35:57.477
cml28kc9y00278o0u06c0vjyy	cml28kc9d00048o0ujtjz89go	cml28kc9i000k8o0ux2depc2f	0	1	cml27qnzi001fjutz7xlytmnv	2024-07-27 11:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.478	2026-01-31 11:35:57.478
cml28kc9z002b8o0us1ihfh9s	cml28kc9k000t8o0ujvrw5jua	cml28kc9d00058o0u625c1fu5	1	0	cml27qnzi001fjutz7xlytmnv	2024-07-27 15:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.479	2026-01-31 11:35:57.479
cml28kca0002f8o0uatdzkc6z	cml28kc9900018o0u6pgykhgr	cml28kc9e00088o0uw1g06dvm	3	2	cml27qnzi001fjutz7xlytmnv	2024-07-27 16:30:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.48	2026-01-31 11:35:57.48
cml28kca1002j8o0usqpgufrq	cml28kc9f000c8o0u39q2fsk8	cml28kc9h000h8o0ur5avpwfx	0	2	cml27qnzi001fjutz7xlytmnv	2024-07-28 15:30:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.481	2026-01-31 11:35:57.481
cml28kca1002n8o0u972uw5d8	cml28kc9f00098o0u4mo2okiw	cml28kc9i000l8o0uowglr6fz	1	2	cml27qnzi001fjutz7xlytmnv	2024-07-28 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.482	2026-01-31 11:35:57.482
cml28kca3002r8o0uailnzrja	cml28kc9l000w8o0uk08352oy	cml28kc9j000o8o0ud1i5bl7h	0	1	cml27qnzi001fjutz7xlytmnv	2024-07-28 16:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.483	2026-01-31 11:35:57.483
cml28kca4002v8o0uejy6gau5	cml28kc9k000s8o0uuxgdxwle	cml28kc9h000g8o0up1atkack	4	0	cml27qnzi001fjutz7xlytmnv	2024-07-28 16:30:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.484	2026-01-31 11:35:57.484
cml28kca4002z8o0uzu1r750x	cml28kc9g000d8o0u9np07t6b	cml28kc9600008o0uyfudq48v	0	1	cml27qnzi001fjutz7xlytmnv	2024-07-29 17:30:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.485	2026-01-31 11:35:57.485
cml28kca500338o0usx41p1kb	cml28kc9l000x8o0u12p1mj55	cml28kc9h000h8o0ur5avpwfx	2	2	cml27qnzi001fjutz7xlytmnv	2024-08-02 14:30:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.486	2026-01-31 11:35:57.486
cml28kca600378o0u4oi1v292	cml28kc9j000p8o0uez7uocj7	cml28kc9900018o0u6pgykhgr	2	0	cml27qnzi001fjutz7xlytmnv	2024-08-02 17:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.487	2026-01-31 11:35:57.487
cml28kca7003b8o0us89gf1l0	cml28kc9i000k8o0ux2depc2f	cml28kc9k000s8o0uuxgdxwle	1	1	cml27qnzi001fjutz7xlytmnv	2024-08-03 12:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.488	2026-01-31 11:35:57.488
cml28kca8003f8o0ukpiw2vvi	cml28kc9e00088o0uw1g06dvm	cml28kc9k000t8o0ujvrw5jua	0	0	cml27qnzi001fjutz7xlytmnv	2024-08-03 13:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.489	2026-01-31 11:35:57.489
cml28kca9003j8o0ungvukrfa	cml28kc9i000l8o0uowglr6fz	cml28kc9l000w8o0uk08352oy	0	3	cml27qnzi001fjutz7xlytmnv	2024-08-03 13:00:00	FINISHED	Leon Arena	2026-01-31 11:35:57.489	2026-01-31 11:35:57.489
cml28kcaa003n8o0uz31tv25d	cml28kc9f000c8o0u39q2fsk8	cml28kc9f00098o0u4mo2okiw	0	2	cml27qnzi001fjutz7xlytmnv	2024-08-04 14:30:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.49	2026-01-31 11:35:57.49
cml28kcab003r8o0upnqf48mx	cml28kc9h000g8o0up1atkack	cml28kc9g000d8o0u9np07t6b	1	0	cml27qnzi001fjutz7xlytmnv	2024-08-04 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.491	2026-01-31 11:35:57.491
cml28kcac003v8o0udzx4naje	cml28kc9j000o8o0ud1i5bl7h	cml28kc9d00058o0u625c1fu5	0	1	cml27qnzi001fjutz7xlytmnv	2024-08-04 17:00:00	FINISHED	Futbol'noe pole 4 Akademiya Spartak im. F. Cherenkova	2026-01-31 11:35:57.492	2026-01-31 11:35:57.492
cml28kcac003z8o0uaz3jsmb7	cml28kc9600008o0uyfudq48v	cml28kc9d00048o0ujtjz89go	2	1	cml27qnzi001fjutz7xlytmnv	2024-08-05 16:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.493	2026-01-31 11:35:57.493
cml28kcad00438o0u4k6rvcsz	cml28kc9i000l8o0uowglr6fz	cml28kc9f000c8o0u39q2fsk8	0	0	cml27qnzi001fjutz7xlytmnv	2024-08-10 13:00:00	FINISHED	Leon Arena	2026-01-31 11:35:57.494	2026-01-31 11:35:57.494
cml28kcae00478o0u7kj5qfnj	cml28kc9k000t8o0ujvrw5jua	cml28kc9j000p8o0uez7uocj7	1	1	cml27qnzi001fjutz7xlytmnv	2024-08-10 15:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.495	2026-01-31 11:35:57.495
cml28kcaf004b8o0u1nhb302a	cml28kc9f00098o0u4mo2okiw	cml28kc9900018o0u6pgykhgr	2	1	cml27qnzi001fjutz7xlytmnv	2024-08-10 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.496	2026-01-31 11:35:57.496
cml28kcag004f8o0u8qdehw99	cml28kc9l000w8o0uk08352oy	cml28kc9d00048o0ujtjz89go	0	1	cml27qnzi001fjutz7xlytmnv	2024-08-10 16:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.497	2026-01-31 11:35:57.497
cml28kcah004j8o0u58d3n6um	cml28kc9h000h8o0ur5avpwfx	cml28kc9g000d8o0u9np07t6b	0	1	cml27qnzi001fjutz7xlytmnv	2024-08-11 12:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.498	2026-01-31 11:35:57.498
cml28kcai004n8o0u91ocjb9b	cml28kc9600008o0uyfudq48v	cml28kc9h000g8o0up1atkack	1	1	cml27qnzi001fjutz7xlytmnv	2024-08-11 16:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.499	2026-01-31 11:35:57.499
cml28kcaj004r8o0uny9sjl4a	cml28kc9k000s8o0uuxgdxwle	cml28kc9j000o8o0ud1i5bl7h	2	2	cml27qnzi001fjutz7xlytmnv	2024-08-11 16:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.499	2026-01-31 11:35:57.499
cml28kcak004v8o0uvou5n2ya	cml28kc9l000x8o0u12p1mj55	cml28kc9e00088o0uw1g06dvm	0	2	cml27qnzi001fjutz7xlytmnv	2024-08-12 14:30:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.5	2026-01-31 11:35:57.5
cml28kcal004z8o0u6v7hrmsl	cml28kc9d00058o0u625c1fu5	cml28kc9i000k8o0ux2depc2f	1	1	cml27qnzi001fjutz7xlytmnv	2024-08-12 17:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.501	2026-01-31 11:35:57.501
cml28kcal00538o0ujhbh3zk8	cml28kc9g000d8o0u9np07t6b	cml28kc9j000p8o0uez7uocj7	2	0	cml27qnzi001fjutz7xlytmnv	2024-08-16 16:30:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.502	2026-01-31 11:35:57.502
cml28kcam00578o0ub6y2jkut	cml28kc9f000c8o0u39q2fsk8	cml28kc9j000o8o0ud1i5bl7h	0	0	cml27qnzi001fjutz7xlytmnv	2024-08-17 14:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.503	2026-01-31 11:35:57.503
cml28kcan005b8o0uvd5ayqxz	cml28kc9d00058o0u625c1fu5	cml28kc9i000l8o0uowglr6fz	3	0	cml27qnzi001fjutz7xlytmnv	2024-08-17 14:30:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.503	2026-01-31 11:35:57.503
cml28kcao005f8o0u7efqcabx	cml28kc9600008o0uyfudq48v	cml28kc9l000w8o0uk08352oy	0	0	cml27qnzi001fjutz7xlytmnv	2024-08-17 16:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.504	2026-01-31 11:35:57.504
cml28kcao005j8o0uz1npm2en	cml28kc9i000k8o0ux2depc2f	cml28kc9h000g8o0up1atkack	2	1	cml27qnzi001fjutz7xlytmnv	2024-08-17 16:24:00	FINISHED	Stadion Luzhniki	2026-01-31 11:35:57.505	2026-01-31 11:35:57.505
cml28kcap005n8o0uqumz38q7	cml28kc9d00048o0ujtjz89go	cml28kc9f00098o0u4mo2okiw	1	0	cml27qnzi001fjutz7xlytmnv	2024-08-18 07:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.506	2026-01-31 11:35:57.506
cml28kcaq005r8o0ucwnc3i4d	cml28kc9e00088o0uw1g06dvm	cml28kc9k000s8o0uuxgdxwle	2	0	cml27qnzi001fjutz7xlytmnv	2024-08-18 09:30:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.506	2026-01-31 11:35:57.506
cml28kcar005v8o0ulcknekbu	cml28kc9k000t8o0ujvrw5jua	cml28kc9l000x8o0u12p1mj55	0	1	cml27qnzi001fjutz7xlytmnv	2024-08-18 15:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.507	2026-01-31 11:35:57.507
cml28kcas005z8o0u3oa9i0xt	cml28kc9900018o0u6pgykhgr	cml28kc9h000h8o0ur5avpwfx	2	1	cml27qnzi001fjutz7xlytmnv	2024-08-18 16:30:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.508	2026-01-31 11:35:57.508
cml28kcas00638o0ucv4m67b8	cml28kc9i000l8o0uowglr6fz	cml28kc9k000t8o0ujvrw5jua	2	2	cml27qnzi001fjutz7xlytmnv	2024-08-23 12:00:00	FINISHED	Leon Arena	2026-01-31 11:35:57.509	2026-01-31 11:35:57.509
cml28kcat00678o0ueru4kgxz	cml28kc9h000h8o0ur5avpwfx	cml28kc9600008o0uyfudq48v	0	0	cml27qnzi001fjutz7xlytmnv	2024-08-23 14:30:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.51	2026-01-31 11:35:57.51
cml28kcau006b8o0uvd9e7ajw	cml28kc9f000c8o0u39q2fsk8	cml28kc9l000w8o0uk08352oy	1	0	cml27qnzi001fjutz7xlytmnv	2024-08-24 13:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.511	2026-01-31 11:35:57.511
cml28kcav006f8o0ui9bmz7v1	cml28kc9h000g8o0up1atkack	cml28kc9e00088o0uw1g06dvm	1	1	cml27qnzi001fjutz7xlytmnv	2024-08-24 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.511	2026-01-31 11:35:57.511
cml28kcaw006j8o0us00qh70l	cml28kc9l000x8o0u12p1mj55	cml28kc9f00098o0u4mo2okiw	3	4	cml27qnzi001fjutz7xlytmnv	2024-08-25 09:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.512	2026-01-31 11:35:57.512
cml28kcax006n8o0u2qzjqjxy	cml28kc9i000k8o0ux2depc2f	cml28kc9900018o0u6pgykhgr	1	1	cml27qnzi001fjutz7xlytmnv	2024-08-25 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.513	2026-01-31 11:35:57.513
cml28kcay006r8o0ucr6hmpx8	cml28kc9j000p8o0uez7uocj7	cml28kc9d00058o0u625c1fu5	1	0	cml27qnzi001fjutz7xlytmnv	2024-08-25 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.514	2026-01-31 11:35:57.514
cml28kcay006v8o0uojpf4eih	cml28kc9k000s8o0uuxgdxwle	cml28kc9d00048o0ujtjz89go	2	0	cml27qnzi001fjutz7xlytmnv	2024-08-25 16:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.515	2026-01-31 11:35:57.515
cml28kcaz006z8o0uwz4et65g	cml28kc9j000o8o0ud1i5bl7h	cml28kc9g000d8o0u9np07t6b	2	2	cml27qnzi001fjutz7xlytmnv	2024-08-26 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.516	2026-01-31 11:35:57.516
cml28kcb000738o0uarnvig8k	cml28kc9d00048o0ujtjz89go	cml28kc9j000p8o0uez7uocj7	1	2	cml27qnzi001fjutz7xlytmnv	2024-08-31 07:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.516	2026-01-31 11:35:57.516
cml28kcb100778o0usupm41xz	cml28kc9l000x8o0u12p1mj55	cml28kc9i000k8o0ux2depc2f	0	1	cml27qnzi001fjutz7xlytmnv	2024-08-31 09:30:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.517	2026-01-31 11:35:57.517
cml28kcb2007b8o0uow09d5ek	cml28kc9e00088o0uw1g06dvm	cml28kc9l000w8o0uk08352oy	3	1	cml27qnzi001fjutz7xlytmnv	2024-08-31 13:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.518	2026-01-31 11:35:57.518
cml28kcb2007f8o0u1ip2cka6	cml28kc9600008o0uyfudq48v	cml28kc9i000l8o0uowglr6fz	1	0	cml27qnzi001fjutz7xlytmnv	2024-08-31 15:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.519	2026-01-31 11:35:57.519
cml28kcb3007j8o0usa92mx23	cml28kc9k000t8o0ujvrw5jua	cml28kc9f000c8o0u39q2fsk8	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-01 13:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.52	2026-01-31 11:35:57.52
cml28kcb4007n8o0uppyletd0	cml28kc9d00058o0u625c1fu5	cml28kc9h000g8o0up1atkack	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-01 14:30:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.521	2026-01-31 11:35:57.521
cml28kcb5007r8o0u5q30bbuz	cml28kc9900018o0u6pgykhgr	cml28kc9j000o8o0ud1i5bl7h	2	2	cml27qnzi001fjutz7xlytmnv	2024-09-01 15:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.521	2026-01-31 11:35:57.521
cml28kcb6007v8o0u8o9okofa	cml28kc9f00098o0u4mo2okiw	cml28kc9h000h8o0ur5avpwfx	3	0	cml27qnzi001fjutz7xlytmnv	2024-09-01 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.522	2026-01-31 11:35:57.522
cml28kcb7007z8o0uvlw0mnwu	cml28kc9g000d8o0u9np07t6b	cml28kc9k000s8o0uuxgdxwle	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-02 16:30:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.523	2026-01-31 11:35:57.523
cml28kcb800838o0ue8bm0ftq	cml28kc9e00088o0uw1g06dvm	cml28kc9g000d8o0u9np07t6b	1	1	cml27qnzi001fjutz7xlytmnv	2024-09-07 08:30:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.524	2026-01-31 11:35:57.524
cml28kcb800878o0unrjaniwq	cml28kc9f000c8o0u39q2fsk8	cml28kc9l000x8o0u12p1mj55	2	0	cml27qnzi001fjutz7xlytmnv	2024-09-07 12:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.525	2026-01-31 11:35:57.525
cml28kcb9008b8o0uq64i9kn0	cml28kc9l000w8o0uk08352oy	cml28kc9f00098o0u4mo2okiw	1	1	cml27qnzi001fjutz7xlytmnv	2024-09-07 14:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.526	2026-01-31 11:35:57.526
cml28kcba008f8o0ux0ycb6el	cml28kc9d00058o0u625c1fu5	cml28kc9900018o0u6pgykhgr	0	1	cml27qnzi001fjutz7xlytmnv	2024-09-07 14:30:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.526	2026-01-31 11:35:57.526
cml28kcbb008j8o0u7q02ptjv	cml28kc9h000g8o0up1atkack	cml28kc9d00048o0ujtjz89go	0	1	cml27qnzi001fjutz7xlytmnv	2024-09-08 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.527	2026-01-31 11:35:57.527
cml28kcbb008n8o0ufqj6yry8	cml28kc9i000k8o0ux2depc2f	cml28kc9600008o0uyfudq48v	2	2	cml27qnzi001fjutz7xlytmnv	2024-09-09 16:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.528	2026-01-31 11:35:57.528
cml28kcbc008r8o0ua83muzwr	cml28kc9j000o8o0ud1i5bl7h	cml28kc9k000t8o0ujvrw5jua	2	0	cml27qnzi001fjutz7xlytmnv	2024-09-09 17:00:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.529	2026-01-31 11:35:57.529
cml28kcbd008v8o0uxb01qwen	cml28kc9j000p8o0uez7uocj7	cml28kc9h000h8o0ur5avpwfx	2	1	cml27qnzi001fjutz7xlytmnv	2024-09-09 18:15:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.53	2026-01-31 11:35:57.53
cml28kcbe008z8o0udqs81i7b	cml28kc9i000l8o0uowglr6fz	cml28kc9k000s8o0uuxgdxwle	1	0	cml27qnzi001fjutz7xlytmnv	2024-09-10 13:00:00	FINISHED	Leon Arena	2026-01-31 11:35:57.531	2026-01-31 11:35:57.531
cml28kcbf00938o0utmwxln4a	cml28kc9l000w8o0uk08352oy	cml28kc9d00058o0u625c1fu5	0	2	cml27qnzi001fjutz7xlytmnv	2024-09-14 14:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.531	2026-01-31 11:35:57.531
cml28kcbg00978o0ugd96zqup	cml28kc9900018o0u6pgykhgr	cml28kc9d00048o0ujtjz89go	2	1	cml27qnzi001fjutz7xlytmnv	2024-09-14 15:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.532	2026-01-31 11:35:57.532
cml28kcbg009b8o0upu9eyvm5	cml28kc9f00098o0u4mo2okiw	cml28kc9g000d8o0u9np07t6b	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-14 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.533	2026-01-31 11:35:57.533
cml28kcbh009f8o0uhpr84rnv	cml28kc9l000x8o0u12p1mj55	cml28kc9j000o8o0ud1i5bl7h	2	0	cml27qnzi001fjutz7xlytmnv	2024-09-15 09:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.534	2026-01-31 11:35:57.534
cml28kcbi009j8o0uxpmtwpm6	cml28kc9i000l8o0uowglr6fz	cml28kc9h000g8o0up1atkack	2	0	cml27qnzi001fjutz7xlytmnv	2024-09-15 12:00:00	FINISHED	Leon Arena	2026-01-31 11:35:57.535	2026-01-31 11:35:57.535
cml28kcbj009n8o0u2m5laz6a	cml28kc9h000h8o0ur5avpwfx	cml28kc9k000t8o0ujvrw5jua	0	1	cml27qnzi001fjutz7xlytmnv	2024-09-15 12:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.535	2026-01-31 11:35:57.535
cml28kcbk009r8o0u11vs3zxw	cml28kc9k000s8o0uuxgdxwle	cml28kc9f000c8o0u39q2fsk8	2	2	cml27qnzi001fjutz7xlytmnv	2024-09-15 15:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.536	2026-01-31 11:35:57.536
cml28kcbk009v8o0uctidjy4w	cml28kc9600008o0uyfudq48v	cml28kc9e00088o0uw1g06dvm	1	0	cml27qnzi001fjutz7xlytmnv	2024-09-16 14:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.537	2026-01-31 11:35:57.537
cml28kcbl009z8o0unr656sf6	cml28kc9i000k8o0ux2depc2f	cml28kc9j000p8o0uez7uocj7	2	1	cml27qnzi001fjutz7xlytmnv	2024-09-16 16:30:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.538	2026-01-31 11:35:57.538
cml28kcbm00a38o0uqsxhu3ep	cml28kc9l000x8o0u12p1mj55	cml28kc9k000s8o0uuxgdxwle	0	1	cml27qnzi001fjutz7xlytmnv	2024-09-20 13:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.539	2026-01-31 11:35:57.539
cml28kcbn00a78o0uncbmjx2i	cml28kc9g000d8o0u9np07t6b	cml28kc9900018o0u6pgykhgr	1	2	cml27qnzi001fjutz7xlytmnv	2024-09-20 16:30:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.539	2026-01-31 11:35:57.539
cml28kcbo00ab8o0u2wzxq3l5	cml28kc9d00048o0ujtjz89go	cml28kc9i000l8o0uowglr6fz	2	2	cml27qnzi001fjutz7xlytmnv	2024-09-21 07:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.54	2026-01-31 11:35:57.54
cml28kcbo00af8o0udpucua60	cml28kc9h000h8o0ur5avpwfx	cml28kc9j000o8o0ud1i5bl7h	1	2	cml27qnzi001fjutz7xlytmnv	2024-09-21 08:30:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.541	2026-01-31 11:35:57.541
cml28kcbp00aj8o0uy9oham18	cml28kc9k000t8o0ujvrw5jua	cml28kc9f00098o0u4mo2okiw	1	1	cml27qnzi001fjutz7xlytmnv	2024-09-21 12:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.542	2026-01-31 11:35:57.542
cml28kcbq00an8o0ub1wqnd5v	cml28kc9f000c8o0u39q2fsk8	cml28kc9i000k8o0ux2depc2f	1	1	cml27qnzi001fjutz7xlytmnv	2024-09-21 12:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.543	2026-01-31 11:35:57.543
cml28kcbr00ar8o0ue9tpt48u	cml28kc9d00058o0u625c1fu5	cml28kc9e00088o0uw1g06dvm	0	2	cml27qnzi001fjutz7xlytmnv	2024-09-21 14:30:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.543	2026-01-31 11:35:57.543
cml28kcbs00av8o0uk0vi2fd1	cml28kc9h000g8o0up1atkack	cml28kc9l000w8o0uk08352oy	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-21 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.544	2026-01-31 11:35:57.544
cml28kcbt00az8o0uemgqmjkg	cml28kc9j000p8o0uez7uocj7	cml28kc9600008o0uyfudq48v	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-21 18:15:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.545	2026-01-31 11:35:57.545
cml28kcbt00b38o0uzgndv3wv	cml28kc9d00048o0ujtjz89go	cml28kc9e00088o0uw1g06dvm	3	0	cml27qnzi001fjutz7xlytmnv	2024-09-29 07:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.546	2026-01-31 11:35:57.546
cml28kcbu00b78o0uxc2uytmr	cml28kc9i000l8o0uowglr6fz	cml28kc9h000h8o0ur5avpwfx	2	1	cml27qnzi001fjutz7xlytmnv	2024-09-29 12:00:00	FINISHED	Leon Arena	2026-01-31 11:35:57.547	2026-01-31 11:35:57.547
cml28kcbv00bb8o0usc9c43k8	cml28kc9600008o0uyfudq48v	cml28kc9l000x8o0u12p1mj55	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-29 14:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.547	2026-01-31 11:35:57.547
cml28kcbw00bf8o0u2tcjel5y	cml28kc9i000k8o0ux2depc2f	cml28kc9f00098o0u4mo2okiw	2	2	cml27qnzi001fjutz7xlytmnv	2024-09-29 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.548	2026-01-31 11:35:57.548
cml28kcbx00bj8o0unzf1xsqr	cml28kc9d00058o0u625c1fu5	cml28kc9f000c8o0u39q2fsk8	3	0	cml27qnzi001fjutz7xlytmnv	2024-09-29 14:30:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.549	2026-01-31 11:35:57.549
cml28kcbx00bn8o0u76fhfs3n	cml28kc9h000g8o0up1atkack	cml28kc9j000o8o0ud1i5bl7h	2	1	cml27qnzi001fjutz7xlytmnv	2024-09-29 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.55	2026-01-31 11:35:57.55
cml28kcby00br8o0uu5zj0p5h	cml28kc9k000s8o0uuxgdxwle	cml28kc9j000p8o0uez7uocj7	0	1	cml27qnzi001fjutz7xlytmnv	2024-09-29 15:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.551	2026-01-31 11:35:57.551
cml28kcbz00bv8o0unve44ztm	cml28kc9900018o0u6pgykhgr	cml28kc9k000t8o0ujvrw5jua	3	0	cml27qnzi001fjutz7xlytmnv	2024-09-29 15:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.551	2026-01-31 11:35:57.551
cml28kcc000bz8o0u6odkzker	cml28kc9g000d8o0u9np07t6b	cml28kc9l000w8o0uk08352oy	0	0	cml27qnzi001fjutz7xlytmnv	2024-09-30 16:30:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.552	2026-01-31 11:35:57.552
cml28kcc100c38o0us9q5i7aq	cml28kc9l000x8o0u12p1mj55	cml28kc9i000l8o0uowglr6fz	3	3	cml27qnzi001fjutz7xlytmnv	2024-10-05 09:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.553	2026-01-31 11:35:57.553
cml28kcc100c78o0uec5kz555	cml28kc9e00088o0uw1g06dvm	cml28kc9i000k8o0ux2depc2f	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-05 13:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.554	2026-01-31 11:35:57.554
cml28kcc200cb8o0upsf9xgdn	cml28kc9h000h8o0ur5avpwfx	cml28kc9d00058o0u625c1fu5	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-05 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.555	2026-01-31 11:35:57.555
cml28kcc300cf8o0u3zvu7vq0	cml28kc9j000o8o0ud1i5bl7h	cml28kc9600008o0uyfudq48v	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-05 17:00:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.556	2026-01-31 11:35:57.556
cml28kcc400cj8o0uk77bm0gf	cml28kc9f000c8o0u39q2fsk8	cml28kc9d00048o0ujtjz89go	2	0	cml27qnzi001fjutz7xlytmnv	2024-10-06 12:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.557	2026-01-31 11:35:57.557
cml28kcc500cn8o0uogygfqw8	cml28kc9l000w8o0uk08352oy	cml28kc9900018o0u6pgykhgr	2	0	cml27qnzi001fjutz7xlytmnv	2024-10-06 14:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.557	2026-01-31 11:35:57.557
cml28kcc600cr8o0ulo15z3x6	cml28kc9j000p8o0uez7uocj7	cml28kc9h000g8o0up1atkack	0	0	cml27qnzi001fjutz7xlytmnv	2024-10-06 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.558	2026-01-31 11:35:57.558
cml28kcc600cv8o0u3j1f1x0h	cml28kc9f00098o0u4mo2okiw	cml28kc9k000s8o0uuxgdxwle	5	0	cml27qnzi001fjutz7xlytmnv	2024-10-06 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.559	2026-01-31 11:35:57.559
cml28kcc700cz8o0usu81l011	cml28kc9k000t8o0ujvrw5jua	cml28kc9g000d8o0u9np07t6b	0	1	cml27qnzi001fjutz7xlytmnv	2024-10-07 16:45:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.56	2026-01-31 11:35:57.56
cml28kcc800d38o0uleande6z	cml28kc9l000x8o0u12p1mj55	cml28kc9900018o0u6pgykhgr	0	3	cml27qnzi001fjutz7xlytmnv	2024-10-12 09:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.561	2026-01-31 11:35:57.561
cml28kcc900d78o0u80564sw2	cml28kc9e00088o0uw1g06dvm	cml28kc9h000h8o0ur5avpwfx	1	0	cml27qnzi001fjutz7xlytmnv	2024-10-12 13:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.561	2026-01-31 11:35:57.561
cml28kcca00db8o0ucf6m8awj	cml28kc9i000k8o0ux2depc2f	cml28kc9k000t8o0ujvrw5jua	5	0	cml27qnzi001fjutz7xlytmnv	2024-10-12 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.562	2026-01-31 11:35:57.562
cml28kcca00df8o0uo1d70f2o	cml28kc9h000g8o0up1atkack	cml28kc9f000c8o0u39q2fsk8	1	0	cml27qnzi001fjutz7xlytmnv	2024-10-12 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.563	2026-01-31 11:35:57.563
cml28kccb00dj8o0u3zfuf73c	cml28kc9j000o8o0ud1i5bl7h	cml28kc9d00048o0ujtjz89go	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-12 17:00:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.564	2026-01-31 11:35:57.564
cml28kccc00dn8o0un36kyacm	cml28kc9600008o0uyfudq48v	cml28kc9f00098o0u4mo2okiw	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-13 11:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.565	2026-01-31 11:35:57.565
cml28kccd00dr8o0uwkdh1g99	cml28kc9g000d8o0u9np07t6b	cml28kc9i000l8o0uowglr6fz	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-13 14:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.565	2026-01-31 11:35:57.565
cml28kcce00dv8o0utiolbrxp	cml28kc9k000s8o0uuxgdxwle	cml28kc9d00058o0u625c1fu5	0	0	cml27qnzi001fjutz7xlytmnv	2024-10-13 14:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.566	2026-01-31 11:35:57.566
cml28kcce00dz8o0uvsdkw835	cml28kc9l000w8o0uk08352oy	cml28kc9j000p8o0uez7uocj7	0	2	cml27qnzi001fjutz7xlytmnv	2024-10-13 14:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.567	2026-01-31 11:35:57.567
cml28kccf00e38o0uwof5rve6	cml28kc9g000d8o0u9np07t6b	cml28kc9d00058o0u625c1fu5	1	0	cml27qnzi001fjutz7xlytmnv	2024-10-19 14:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.568	2026-01-31 11:35:57.568
cml28kccg00e78o0uwya5wyiz	cml28kc9f00098o0u4mo2okiw	cml28kc9j000o8o0ud1i5bl7h	1	0	cml27qnzi001fjutz7xlytmnv	2024-10-19 14:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.569	2026-01-31 11:35:57.569
cml28kcch00eb8o0uqrfal99m	cml28kc9900018o0u6pgykhgr	cml28kc9h000g8o0up1atkack	0	0	cml27qnzi001fjutz7xlytmnv	2024-10-19 14:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.569	2026-01-31 11:35:57.569
cml28kcci00ef8o0u2i8g1iq8	cml28kc9i000l8o0uowglr6fz	cml28kc9e00088o0uw1g06dvm	3	3	cml27qnzi001fjutz7xlytmnv	2024-10-20 06:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.57	2026-01-31 11:35:57.57
cml28kcci00ej8o0uvpadu4vy	cml28kc9d00048o0ujtjz89go	cml28kc9l000x8o0u12p1mj55	1	0	cml27qnzi001fjutz7xlytmnv	2024-10-20 07:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.571	2026-01-31 11:35:57.571
cml28kccj00en8o0ua71x6lyh	cml28kc9k000t8o0ujvrw5jua	cml28kc9l000w8o0uk08352oy	0	1	cml27qnzi001fjutz7xlytmnv	2024-10-20 09:30:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.572	2026-01-31 11:35:57.572
cml28kcck00er8o0uzj6mjyye	cml28kc9f000c8o0u39q2fsk8	cml28kc9j000p8o0uez7uocj7	1	3	cml27qnzi001fjutz7xlytmnv	2024-10-20 12:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.572	2026-01-31 11:35:57.572
cml28kccl00ev8o0ujkdcxbtp	cml28kc9h000h8o0ur5avpwfx	cml28kc9i000k8o0ux2depc2f	0	3	cml27qnzi001fjutz7xlytmnv	2024-10-21 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.573	2026-01-31 11:35:57.573
cml28kccl00ez8o0ueywz4ub6	cml28kc9k000s8o0uuxgdxwle	cml28kc9600008o0uyfudq48v	2	2	cml27qnzi001fjutz7xlytmnv	2024-10-21 16:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.574	2026-01-31 11:35:57.574
cml28kccm00f38o0u67l82tp6	cml28kc9i000l8o0uowglr6fz	cml28kc9900018o0u6pgykhgr	6	1	cml27qnzi001fjutz7xlytmnv	2024-10-26 06:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.575	2026-01-31 11:35:57.575
cml28kccn00f78o0u9ipubcrv	cml28kc9600008o0uyfudq48v	cml28kc9f000c8o0u39q2fsk8	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-26 14:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.576	2026-01-31 11:35:57.576
cml28kcco00fb8o0upfsl14wo	cml28kc9h000h8o0ur5avpwfx	cml28kc9d00048o0ujtjz89go	4	1	cml27qnzi001fjutz7xlytmnv	2024-10-26 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.576	2026-01-31 11:35:57.576
cml28kccp00ff8o0ubcmilw28	cml28kc9j000p8o0uez7uocj7	cml28kc9e00088o0uw1g06dvm	2	1	cml27qnzi001fjutz7xlytmnv	2024-10-26 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.577	2026-01-31 11:35:57.577
cml28kccp00fj8o0uymcd89ig	cml28kc9l000x8o0u12p1mj55	cml28kc9g000d8o0u9np07t6b	2	0	cml27qnzi001fjutz7xlytmnv	2024-10-27 10:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.578	2026-01-31 11:35:57.578
cml28kccq00fn8o0uus716qjp	cml28kc9l000w8o0uk08352oy	cml28kc9k000s8o0uuxgdxwle	2	3	cml27qnzi001fjutz7xlytmnv	2024-10-27 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.579	2026-01-31 11:35:57.579
cml28kccr00fr8o0uwio657hz	cml28kc9d00058o0u625c1fu5	cml28kc9f00098o0u4mo2okiw	1	0	cml27qnzi001fjutz7xlytmnv	2024-10-27 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.579	2026-01-31 11:35:57.579
cml28kccs00fv8o0uwimyfghf	cml28kc9h000g8o0up1atkack	cml28kc9k000t8o0ujvrw5jua	0	0	cml27qnzi001fjutz7xlytmnv	2024-10-27 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.58	2026-01-31 11:35:57.58
cml28kcct00fz8o0u30846o01	cml28kc9j000o8o0ud1i5bl7h	cml28kc9i000k8o0ux2depc2f	1	1	cml27qnzi001fjutz7xlytmnv	2024-10-27 16:00:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.581	2026-01-31 11:35:57.581
cml28kcct00g38o0uoj6liiqc	cml28kc9d00048o0ujtjz89go	cml28kc9g000d8o0u9np07t6b	2	0	cml27qnzi001fjutz7xlytmnv	2024-11-02 11:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.582	2026-01-31 11:35:57.582
cml28kccu00g78o0uils5ni71	cml28kc9k000t8o0ujvrw5jua	cml28kc9600008o0uyfudq48v	1	0	cml27qnzi001fjutz7xlytmnv	2024-11-02 11:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.583	2026-01-31 11:35:57.583
cml28kccv00gb8o0ucqqmn8zr	cml28kc9l000x8o0u12p1mj55	cml28kc9d00058o0u625c1fu5	2	1	cml27qnzi001fjutz7xlytmnv	2024-11-02 13:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.583	2026-01-31 11:35:57.583
cml28kccw00gf8o0u0jqso4ki	cml28kc9i000k8o0ux2depc2f	cml28kc9l000w8o0uk08352oy	3	0	cml27qnzi001fjutz7xlytmnv	2024-11-02 16:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.584	2026-01-31 11:35:57.584
cml28kccw00gj8o0ucfse60i7	cml28kc9900018o0u6pgykhgr	cml28kc9f000c8o0u39q2fsk8	0	1	cml27qnzi001fjutz7xlytmnv	2024-11-03 11:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.585	2026-01-31 11:35:57.585
cml28kccx00gn8o0u1tjb2fom	cml28kc9f00098o0u4mo2okiw	cml28kc9h000g8o0up1atkack	3	2	cml27qnzi001fjutz7xlytmnv	2024-11-03 14:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.586	2026-01-31 11:35:57.586
cml28kccy00gr8o0uy519qatf	cml28kc9k000s8o0uuxgdxwle	cml28kc9h000h8o0ur5avpwfx	3	0	cml27qnzi001fjutz7xlytmnv	2024-11-03 14:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.586	2026-01-31 11:35:57.586
cml28kccz00gv8o0uvu7arep0	cml28kc9j000p8o0uez7uocj7	cml28kc9i000l8o0uowglr6fz	2	0	cml27qnzi001fjutz7xlytmnv	2024-11-03 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.587	2026-01-31 11:35:57.587
cml28kcd000gz8o0uc3gqv9tb	cml28kc9e00088o0uw1g06dvm	cml28kc9j000o8o0ud1i5bl7h	0	0	cml27qnzi001fjutz7xlytmnv	2024-11-04 11:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.588	2026-01-31 11:35:57.588
cml28kcd100h38o0utmph917a	cml28kc9g000d8o0u9np07t6b	cml28kc9f00098o0u4mo2okiw	1	1	cml27qnzi001fjutz7xlytmnv	2024-11-08 16:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.589	2026-01-31 11:35:57.589
cml28kcd200h78o0upypnmdxh	cml28kc9l000w8o0uk08352oy	cml28kc9600008o0uyfudq48v	0	0	cml27qnzi001fjutz7xlytmnv	2024-11-09 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.59	2026-01-31 11:35:57.59
cml28kcd300hb8o0uemi0z56f	cml28kc9i000k8o0ux2depc2f	cml28kc9d00048o0ujtjz89go	2	0	cml27qnzi001fjutz7xlytmnv	2024-11-09 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.591	2026-01-31 11:35:57.591
cml28kcd300hf8o0ufmwoik1q	cml28kc9d00058o0u625c1fu5	cml28kc9k000t8o0ujvrw5jua	3	1	cml27qnzi001fjutz7xlytmnv	2024-11-09 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.592	2026-01-31 11:35:57.592
cml28kcd400hj8o0u35zuwsh7	cml28kc9h000g8o0up1atkack	cml28kc9j000p8o0uez7uocj7	1	2	cml27qnzi001fjutz7xlytmnv	2024-11-09 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.593	2026-01-31 11:35:57.593
cml28kcd500hn8o0uik4xdh1o	cml28kc9i000l8o0uowglr6fz	cml28kc9l000x8o0u12p1mj55	1	0	cml27qnzi001fjutz7xlytmnv	2024-11-10 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.594	2026-01-31 11:35:57.594
cml28kcd600hr8o0ubkkuo17d	cml28kc9f000c8o0u39q2fsk8	cml28kc9e00088o0uw1g06dvm	0	2	cml27qnzi001fjutz7xlytmnv	2024-11-10 12:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.594	2026-01-31 11:35:57.594
cml28kcd700hv8o0uy3rjy5df	cml28kc9h000h8o0ur5avpwfx	cml28kc9900018o0u6pgykhgr	1	4	cml27qnzi001fjutz7xlytmnv	2024-11-10 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.595	2026-01-31 11:35:57.595
cml28kcd800hz8o0u6oya2ak1	cml28kc9j000o8o0ud1i5bl7h	cml28kc9k000s8o0uuxgdxwle	2	0	cml27qnzi001fjutz7xlytmnv	2024-11-10 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.596	2026-01-31 11:35:57.596
cml28kcd800i38o0uzgf8c3ha	cml28kc9l000x8o0u12p1mj55	cml28kc9k000t8o0ujvrw5jua	2	0	cml27qnzi001fjutz7xlytmnv	2024-11-16 10:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.597	2026-01-31 11:35:57.597
cml28kcd900i78o0umf13d70u	cml28kc9l000w8o0uk08352oy	cml28kc9g000d8o0u9np07t6b	1	3	cml27qnzi001fjutz7xlytmnv	2024-11-16 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.598	2026-01-31 11:35:57.598
cml28kcda00ib8o0uf00gqj2x	cml28kc9e00088o0uw1g06dvm	cml28kc9d00048o0ujtjz89go	4	3	cml27qnzi001fjutz7xlytmnv	2024-11-16 13:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.598	2026-01-31 11:35:57.598
cml28kcdb00if8o0u6nimog0u	cml28kc9d00058o0u625c1fu5	cml28kc9j000p8o0uez7uocj7	0	1	cml27qnzi001fjutz7xlytmnv	2024-11-16 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.599	2026-01-31 11:35:57.599
cml28kcdb00ij8o0uykdqa4mq	cml28kc9h000g8o0up1atkack	cml28kc9600008o0uyfudq48v	2	2	cml27qnzi001fjutz7xlytmnv	2024-11-16 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.6	2026-01-31 11:35:57.6
cml28kcdc00in8o0un4gcljqd	cml28kc9i000l8o0uowglr6fz	cml28kc9i000k8o0ux2depc2f	2	2	cml27qnzi001fjutz7xlytmnv	2024-11-17 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.601	2026-01-31 11:35:57.601
cml28kcdd00ir8o0uiw1npees	cml28kc9f000c8o0u39q2fsk8	cml28kc9k000s8o0uuxgdxwle	0	0	cml27qnzi001fjutz7xlytmnv	2024-11-17 12:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.601	2026-01-31 11:35:57.601
cml28kcde00iv8o0unbdkckd2	cml28kc9h000h8o0ur5avpwfx	cml28kc9f00098o0u4mo2okiw	0	1	cml27qnzi001fjutz7xlytmnv	2024-11-17 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.602	2026-01-31 11:35:57.602
cml28kcde00iz8o0u65xs7n35	cml28kc9j000o8o0ud1i5bl7h	cml28kc9900018o0u6pgykhgr	0	1	cml27qnzi001fjutz7xlytmnv	2024-11-17 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.603	2026-01-31 11:35:57.603
cml28kcdf00j38o0urwu0k8tp	cml28kc9f00098o0u4mo2okiw	cml28kc9l000x8o0u12p1mj55	5	2	cml27qnzi001fjutz7xlytmnv	2024-11-22 14:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.604	2026-01-31 11:35:57.604
cml28kcdg00j78o0u8ksc99j7	cml28kc9d00048o0ujtjz89go	cml28kc9f000c8o0u39q2fsk8	0	0	cml27qnzi001fjutz7xlytmnv	2024-11-23 07:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.604	2026-01-31 11:35:57.604
cml28kcdh00jb8o0ubdwpqqq8	cml28kc9l000w8o0uk08352oy	cml28kc9e00088o0uw1g06dvm	0	1	cml27qnzi001fjutz7xlytmnv	2024-11-23 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.605	2026-01-31 11:35:57.605
cml28kcdi00jf8o0uc6nw2lme	cml28kc9600008o0uyfudq48v	cml28kc9h000h8o0ur5avpwfx	1	2	cml27qnzi001fjutz7xlytmnv	2024-11-23 13:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.606	2026-01-31 11:35:57.606
cml28kcdi00jj8o0u4991zyk2	cml28kc9j000p8o0uez7uocj7	cml28kc9j000o8o0ud1i5bl7h	2	1	cml27qnzi001fjutz7xlytmnv	2024-11-23 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.607	2026-01-31 11:35:57.607
cml28kcdj00jn8o0u4xtzb2p8	cml28kc9k000t8o0ujvrw5jua	cml28kc9i000k8o0ux2depc2f	1	2	cml27qnzi001fjutz7xlytmnv	2024-11-24 10:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.608	2026-01-31 11:35:57.608
cml28kcdk00jr8o0u0l02kmnw	cml28kc9900018o0u6pgykhgr	cml28kc9d00058o0u625c1fu5	2	1	cml27qnzi001fjutz7xlytmnv	2024-11-24 11:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.608	2026-01-31 11:35:57.608
cml28kcdl00jv8o0u4n93qwu3	cml28kc9g000d8o0u9np07t6b	cml28kc9h000g8o0up1atkack	1	0	cml27qnzi001fjutz7xlytmnv	2024-11-24 12:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.609	2026-01-31 11:35:57.609
cml28kcdl00jz8o0uazrdcxku	cml28kc9k000s8o0uuxgdxwle	cml28kc9i000l8o0uowglr6fz	0	0	cml27qnzi001fjutz7xlytmnv	2024-11-24 12:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.61	2026-01-31 11:35:57.61
cml28kcdm00k38o0u4t5tfg5f	cml28kc9j000p8o0uez7uocj7	cml28kc9l000w8o0uk08352oy	3	0	cml27qnzi001fjutz7xlytmnv	2024-11-29 17:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.611	2026-01-31 11:35:57.611
cml28kcdn00k78o0u8vk70txf	cml28kc9d00048o0ujtjz89go	cml28kc9600008o0uyfudq48v	2	0	cml27qnzi001fjutz7xlytmnv	2024-11-30 07:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.611	2026-01-31 11:35:57.611
cml28kcdo00kb8o0umh7in831	cml28kc9k000t8o0ujvrw5jua	cml28kc9i000l8o0uowglr6fz	0	1	cml27qnzi001fjutz7xlytmnv	2024-11-30 10:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.612	2026-01-31 11:35:57.612
cml28kcdo00kf8o0u82g3v9nq	cml28kc9900018o0u6pgykhgr	cml28kc9l000x8o0u12p1mj55	2	1	cml27qnzi001fjutz7xlytmnv	2024-11-30 11:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.613	2026-01-31 11:35:57.613
cml28kcdp00kj8o0u3ti0ix4w	cml28kc9k000s8o0uuxgdxwle	cml28kc9e00088o0uw1g06dvm	1	1	cml27qnzi001fjutz7xlytmnv	2024-12-01 11:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.614	2026-01-31 11:35:57.614
cml28kcdq00kn8o0uvov7xj6y	cml28kc9g000d8o0u9np07t6b	cml28kc9f000c8o0u39q2fsk8	1	1	cml27qnzi001fjutz7xlytmnv	2024-12-01 12:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.614	2026-01-31 11:35:57.614
cml28kcdr00kr8o0u2kmlt271	cml28kc9f00098o0u4mo2okiw	cml28kc9d00058o0u625c1fu5	2	0	cml27qnzi001fjutz7xlytmnv	2024-12-01 12:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.615	2026-01-31 11:35:57.615
cml28kcdr00kv8o0uyl15fdx1	cml28kc9i000k8o0ux2depc2f	cml28kc9h000h8o0ur5avpwfx	1	0	cml27qnzi001fjutz7xlytmnv	2024-12-01 13:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.616	2026-01-31 11:35:57.616
cml28kcds00kz8o0u2dwd0560	cml28kc9j000o8o0ud1i5bl7h	cml28kc9h000g8o0up1atkack	0	3	cml27qnzi001fjutz7xlytmnv	2024-12-01 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.617	2026-01-31 11:35:57.617
cml28kcdt00l38o0ug61o2bcm	cml28kc9d00048o0ujtjz89go	cml28kc9l000w8o0uk08352oy	1	0	cml27qnzi001fjutz7xlytmnv	2025-03-01 07:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.618	2026-01-31 11:35:57.618
cml28kcdu00l78o0u521t1hw6	cml28kc9900018o0u6pgykhgr	cml28kc9i000k8o0ux2depc2f	2	0	cml27qnzi001fjutz7xlytmnv	2025-03-01 11:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.618	2026-01-31 11:35:57.618
cml28kcdv00lb8o0ui8wiav9f	cml28kc9d00058o0u625c1fu5	cml28kc9600008o0uyfudq48v	2	1	cml27qnzi001fjutz7xlytmnv	2025-03-01 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.619	2026-01-31 11:35:57.619
cml28kcdv00lf8o0uibwjagfn	cml28kc9k000s8o0uuxgdxwle	cml28kc9l000x8o0u12p1mj55	1	1	cml27qnzi001fjutz7xlytmnv	2025-03-02 11:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.62	2026-01-31 11:35:57.62
cml28kcdw00lj8o0ujnppgzsc	cml28kc9h000g8o0up1atkack	cml28kc9i000l8o0uowglr6fz	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-02 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.621	2026-01-31 11:35:57.621
cml28kcdx00ln8o0u1v4yr1lg	cml28kc9j000p8o0uez7uocj7	cml28kc9f000c8o0u39q2fsk8	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-02 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.621	2026-01-31 11:35:57.621
cml28kcdy00lr8o0uerrq6x78	cml28kc9j000o8o0ud1i5bl7h	cml28kc9h000h8o0ur5avpwfx	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-02 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.622	2026-01-31 11:35:57.622
cml28kcdz00lv8o0usniqah45	cml28kc9f00098o0u4mo2okiw	cml28kc9k000t8o0ujvrw5jua	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-03 15:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.623	2026-01-31 11:35:57.623
cml28kcdz00lz8o0ugdap0u70	cml28kc9g000d8o0u9np07t6b	cml28kc9e00088o0uw1g06dvm	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-03 16:30:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.624	2026-01-31 11:35:57.624
cml28kce000m38o0uelk04ysc	cml28kc9900018o0u6pgykhgr	cml28kc9600008o0uyfudq48v	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-07 12:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.625	2026-01-31 11:35:57.625
cml28kce100m78o0uihiav19f	cml28kc9d00048o0ujtjz89go	cml28kc9j000o8o0ud1i5bl7h	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-08 05:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.626	2026-01-31 11:35:57.626
cml28kce200mb8o0ujv7wyjga	cml28kc9l000w8o0uk08352oy	cml28kc9h000h8o0ur5avpwfx	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-08 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.626	2026-01-31 11:35:57.626
cml28kce300mf8o0ul8q65wkd	cml28kc9d00058o0u625c1fu5	cml28kc9k000s8o0uuxgdxwle	3	1	cml27qnzi001fjutz7xlytmnv	2025-03-08 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.627	2026-01-31 11:35:57.627
cml28kce300mj8o0ubfvcud84	cml28kc9k000t8o0ujvrw5jua	cml28kc9h000g8o0up1atkack	1	3	cml27qnzi001fjutz7xlytmnv	2025-03-09 10:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.628	2026-01-31 11:35:57.628
cml28kce400mn8o0u7jsbft9s	cml28kc9f000c8o0u39q2fsk8	cml28kc9i000l8o0uowglr6fz	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-09 13:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.629	2026-01-31 11:35:57.629
cml28kce500mr8o0uwk00cjfr	cml28kc9f00098o0u4mo2okiw	cml28kc9e00088o0uw1g06dvm	1	0	cml27qnzi001fjutz7xlytmnv	2025-03-09 13:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.63	2026-01-31 11:35:57.63
cml28kce600mv8o0uzzzxi2w4	cml28kc9i000k8o0ux2depc2f	cml28kc9l000x8o0u12p1mj55	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-09 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.63	2026-01-31 11:35:57.63
cml28kce700mz8o0ufy2bbmeo	cml28kc9j000p8o0uez7uocj7	cml28kc9g000d8o0u9np07t6b	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-10 17:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.631	2026-01-31 11:35:57.631
cml28kce800n38o0umoc6g3ao	cml28kc9l000x8o0u12p1mj55	cml28kc9d00048o0ujtjz89go	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-15 09:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.632	2026-01-31 11:35:57.632
cml28kce800n78o0ue2gm5zve	cml28kc9f000c8o0u39q2fsk8	cml28kc9d00058o0u625c1fu5	1	0	cml27qnzi001fjutz7xlytmnv	2025-03-15 13:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.633	2026-01-31 11:35:57.633
cml28kce900nb8o0ug571w9hj	cml28kc9h000g8o0up1atkack	cml28kc9i000k8o0ux2depc2f	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-15 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.634	2026-01-31 11:35:57.634
cml28kcea00nf8o0utellzrp8	cml28kc9i000l8o0uowglr6fz	cml28kc9f00098o0u4mo2okiw	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-16 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.634	2026-01-31 11:35:57.634
cml28kceb00nj8o0u6x6998yk	cml28kc9e00088o0uw1g06dvm	cml28kc9900018o0u6pgykhgr	2	1	cml27qnzi001fjutz7xlytmnv	2025-03-16 11:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.635	2026-01-31 11:35:57.635
cml28kceb00nn8o0uur4drfmx	cml28kc9h000h8o0ur5avpwfx	cml28kc9j000p8o0uez7uocj7	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-16 12:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.636	2026-01-31 11:35:57.636
cml28kcec00nr8o0uwnh3f1j4	cml28kc9g000d8o0u9np07t6b	cml28kc9k000t8o0ujvrw5jua	2	2	cml27qnzi001fjutz7xlytmnv	2025-03-16 12:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.637	2026-01-31 11:35:57.637
cml28kced00nv8o0upmiptnes	cml28kc9j000o8o0ud1i5bl7h	cml28kc9l000w8o0uk08352oy	4	0	cml27qnzi001fjutz7xlytmnv	2025-03-16 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.637	2026-01-31 11:35:57.637
cml28kcee00nz8o0u7c4054vh	cml28kc9600008o0uyfudq48v	cml28kc9k000s8o0uuxgdxwle	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-17 17:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.638	2026-01-31 11:35:57.638
cml28kcee00o38o0ufjwofyk8	cml28kc9d00048o0ujtjz89go	cml28kc9h000g8o0up1atkack	2	0	cml27qnzi001fjutz7xlytmnv	2025-03-22 07:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.639	2026-01-31 11:35:57.639
cml28kcef00o78o0u20fnwa3c	cml28kc9l000w8o0uk08352oy	cml28kc9k000t8o0ujvrw5jua	2	1	cml27qnzi001fjutz7xlytmnv	2025-03-22 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.64	2026-01-31 11:35:57.64
cml28kceg00ob8o0uythg4qig	cml28kc9i000k8o0ux2depc2f	cml28kc9j000o8o0ud1i5bl7h	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-22 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.64	2026-01-31 11:35:57.64
cml28kceh00of8o0uhp26p2r6	cml28kc9d00058o0u625c1fu5	cml28kc9h000h8o0ur5avpwfx	2	3	cml27qnzi001fjutz7xlytmnv	2025-03-22 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.641	2026-01-31 11:35:57.641
cml28kceh00oj8o0uff1k0eaa	cml28kc9i000l8o0uowglr6fz	cml28kc9g000d8o0u9np07t6b	1	0	cml27qnzi001fjutz7xlytmnv	2025-03-23 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.642	2026-01-31 11:35:57.642
cml28kcei00on8o0u9kqir7pm	cml28kc9l000x8o0u12p1mj55	cml28kc9j000p8o0uez7uocj7	0	6	cml27qnzi001fjutz7xlytmnv	2025-03-23 09:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.643	2026-01-31 11:35:57.643
cml28kcej00or8o0uwosp9hwx	cml28kc9f00098o0u4mo2okiw	cml28kc9f000c8o0u39q2fsk8	1	2	cml27qnzi001fjutz7xlytmnv	2025-03-23 11:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.644	2026-01-31 11:35:57.644
cml28kcek00ov8o0u0i5w5h19	cml28kc9k000s8o0uuxgdxwle	cml28kc9900018o0u6pgykhgr	0	2	cml27qnzi001fjutz7xlytmnv	2025-03-23 14:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.644	2026-01-31 11:35:57.644
cml28kcel00oz8o0u2a12u2id	cml28kc9e00088o0uw1g06dvm	cml28kc9600008o0uyfudq48v	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-24 14:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.645	2026-01-31 11:35:57.645
cml28kcel00p38o0udx6370oq	cml28kc9900018o0u6pgykhgr	cml28kc9l000w8o0uk08352oy	1	1	cml27qnzi001fjutz7xlytmnv	2025-03-29 12:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.646	2026-01-31 11:35:57.646
cml28kcem00p78o0uwi8oyspk	cml28kc9f000c8o0u39q2fsk8	cml28kc9h000g8o0up1atkack	1	1	cml27qnzi001fjutz7xlytmnv	2025-03-29 14:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.647	2026-01-31 11:35:57.647
cml28kcen00pb8o0u7ffuq7rr	cml28kc9h000h8o0ur5avpwfx	cml28kc9i000l8o0uowglr6fz	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-29 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.647	2026-01-31 11:35:57.647
cml28kceo00pf8o0u3sdn7vzt	cml28kc9d00058o0u625c1fu5	cml28kc9l000x8o0u12p1mj55	1	0	cml27qnzi001fjutz7xlytmnv	2025-03-29 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.648	2026-01-31 11:35:57.648
cml28kceo00pj8o0umzipnejd	cml28kc9k000t8o0ujvrw5jua	cml28kc9e00088o0uw1g06dvm	0	0	cml27qnzi001fjutz7xlytmnv	2025-03-30 10:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.649	2026-01-31 11:35:57.649
cml28kcep00pn8o0umo4vt7w4	cml28kc9600008o0uyfudq48v	cml28kc9i000k8o0ux2depc2f	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-30 12:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.65	2026-01-31 11:35:57.65
cml28kceq00pr8o0unqxwv3ui	cml28kc9g000d8o0u9np07t6b	cml28kc9j000o8o0ud1i5bl7h	0	1	cml27qnzi001fjutz7xlytmnv	2025-03-30 12:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.65	2026-01-31 11:35:57.65
cml28kcer00pv8o0ulpbbt2pq	cml28kc9j000p8o0uez7uocj7	cml28kc9k000s8o0uuxgdxwle	4	0	cml27qnzi001fjutz7xlytmnv	2025-03-30 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.651	2026-01-31 11:35:57.651
cml28kcer00pz8o0ue40epk9f	cml28kc9f00098o0u4mo2okiw	cml28kc9d00048o0ujtjz89go	2	1	cml27qnzi001fjutz7xlytmnv	2025-03-31 16:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.652	2026-01-31 11:35:57.652
cml28kces00q38o0u7efv338j	cml28kc9e00088o0uw1g06dvm	cml28kc9d00058o0u625c1fu5	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-05 11:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.653	2026-01-31 11:35:57.653
cml28kcet00q78o0udx6icxml	cml28kc9l000w8o0uk08352oy	cml28kc9f000c8o0u39q2fsk8	1	2	cml27qnzi001fjutz7xlytmnv	2025-04-05 12:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.653	2026-01-31 11:35:57.653
cml28kceu00qb8o0u473tmkqn	cml28kc9h000h8o0ur5avpwfx	cml28kc9l000x8o0u12p1mj55	1	1	cml27qnzi001fjutz7xlytmnv	2025-04-05 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.654	2026-01-31 11:35:57.654
cml28kcev00qf8o0ufc2xow6f	cml28kc9h000g8o0up1atkack	cml28kc9k000s8o0uuxgdxwle	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-05 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.655	2026-01-31 11:35:57.655
cml28kcev00qj8o0uqqnrr9kx	cml28kc9i000l8o0uowglr6fz	cml28kc9j000p8o0uez7uocj7	1	2	cml27qnzi001fjutz7xlytmnv	2025-04-06 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.656	2026-01-31 11:35:57.656
cml28kcew00qn8o0un9za3nbh	cml28kc9d00048o0ujtjz89go	cml28kc9900018o0u6pgykhgr	0	3	cml27qnzi001fjutz7xlytmnv	2025-04-06 07:00:00	FINISHED	Futbol-arena Enisey	2026-01-31 11:35:57.657	2026-01-31 11:35:57.657
cml28kcex00qr8o0uwrwlts5r	cml28kc9600008o0uyfudq48v	cml28kc9k000t8o0ujvrw5jua	1	0	cml27qnzi001fjutz7xlytmnv	2025-04-06 12:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.657	2026-01-31 11:35:57.657
cml28kcey00qv8o0uzhtoxmb5	cml28kc9i000k8o0ux2depc2f	cml28kc9g000d8o0u9np07t6b	0	1	cml27qnzi001fjutz7xlytmnv	2025-04-06 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.658	2026-01-31 11:35:57.658
cml28kcez00qz8o0u2ydjf21i	cml28kc9j000o8o0ud1i5bl7h	cml28kc9f00098o0u4mo2okiw	3	1	cml27qnzi001fjutz7xlytmnv	2025-04-06 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.659	2026-01-31 11:35:57.659
cml28kcez00r38o0u8txk95it	cml28kc9e00088o0uw1g06dvm	cml28kc9h000g8o0up1atkack	3	2	cml27qnzi001fjutz7xlytmnv	2025-04-11 14:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.66	2026-01-31 11:35:57.66
cml28kcf000r78o0u25a2agki	cml28kc9l000x8o0u12p1mj55	cml28kc9l000w8o0uk08352oy	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-12 11:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.661	2026-01-31 11:35:57.661
cml28kcf100rb8o0u0vf8jl87	cml28kc9h000h8o0ur5avpwfx	cml28kc9f000c8o0u39q2fsk8	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-12 14:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.661	2026-01-31 11:35:57.661
cml28kcf200rf8o0uuk99j1d1	cml28kc9k000s8o0uuxgdxwle	cml28kc9i000k8o0ux2depc2f	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-12 15:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.662	2026-01-31 11:35:57.662
cml28kcf300rj8o0ufnb2obgt	cml28kc9i000l8o0uowglr6fz	cml28kc9600008o0uyfudq48v	1	0	cml27qnzi001fjutz7xlytmnv	2025-04-13 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.663	2026-01-31 11:35:57.663
cml28kcf400rn8o0ucy3mziqe	cml28kc9k000t8o0ujvrw5jua	cml28kc9j000o8o0ud1i5bl7h	1	2	cml27qnzi001fjutz7xlytmnv	2025-04-13 10:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.664	2026-01-31 11:35:57.664
cml28kcf400rr8o0u03ae7y0l	cml28kc9900018o0u6pgykhgr	cml28kc9g000d8o0u9np07t6b	1	1	cml27qnzi001fjutz7xlytmnv	2025-04-13 12:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.665	2026-01-31 11:35:57.665
cml28kcf500rv8o0utpjakdkt	cml28kc9d00058o0u625c1fu5	cml28kc9d00048o0ujtjz89go	0	0	cml27qnzi001fjutz7xlytmnv	2025-04-13 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.666	2026-01-31 11:35:57.666
cml28kcf600rz8o0ui6idx4at	cml28kc9j000p8o0uez7uocj7	cml28kc9f00098o0u4mo2okiw	2	0	cml27qnzi001fjutz7xlytmnv	2025-04-13 15:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.666	2026-01-31 11:35:57.666
cml28kcf700s38o0uont3gqba	cml28kc9d00048o0ujtjz89go	cml28kc9k000s8o0uuxgdxwle	0	0	cml27qnzi001fjutz7xlytmnv	2025-04-19 07:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.667	2026-01-31 11:35:57.667
cml28kcf800s78o0um8ud7daw	cml28kc9900018o0u6pgykhgr	cml28kc9i000l8o0uowglr6fz	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-19 12:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.668	2026-01-31 11:35:57.668
cml28kcf900sb8o0uisxwo069	cml28kc9h000g8o0up1atkack	cml28kc9d00058o0u625c1fu5	0	0	cml27qnzi001fjutz7xlytmnv	2025-04-19 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.669	2026-01-31 11:35:57.669
cml28kcf900sf8o0ugulsyaw0	cml28kc9f000c8o0u39q2fsk8	cml28kc9600008o0uyfudq48v	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-20 14:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.67	2026-01-31 11:35:57.67
cml28kcfa00sj8o0uzupvdorg	cml28kc9g000d8o0u9np07t6b	cml28kc9h000h8o0ur5avpwfx	2	1	cml27qnzi001fjutz7xlytmnv	2025-04-20 14:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.671	2026-01-31 11:35:57.671
cml28kcfb00sn8o0ufexf95e8	cml28kc9f00098o0u4mo2okiw	cml28kc9l000w8o0uk08352oy	4	0	cml27qnzi001fjutz7xlytmnv	2025-04-20 14:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.671	2026-01-31 11:35:57.671
cml28kcfc00sr8o0ul6s53lak	cml28kc9j000p8o0uez7uocj7	cml28kc9k000t8o0ujvrw5jua	1	1	cml27qnzi001fjutz7xlytmnv	2025-04-20 15:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.672	2026-01-31 11:35:57.672
cml28kcfd00sv8o0unxkwz7vm	cml28kc9j000o8o0ud1i5bl7h	cml28kc9l000x8o0u12p1mj55	2	0	cml27qnzi001fjutz7xlytmnv	2025-04-20 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.673	2026-01-31 11:35:57.673
cml28kcfd00sz8o0ujiub36x7	cml28kc9i000k8o0ux2depc2f	cml28kc9e00088o0uw1g06dvm	1	1	cml27qnzi001fjutz7xlytmnv	2025-04-21 16:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.674	2026-01-31 11:35:57.674
cml28kcfe00t38o0uf00ifyf0	cml28kc9i000l8o0uowglr6fz	cml28kc9d00048o0ujtjz89go	1	2	cml27qnzi001fjutz7xlytmnv	2025-04-26 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.675	2026-01-31 11:35:57.675
cml28kcff00t78o0uyzvtjzoj	cml28kc9e00088o0uw1g06dvm	cml28kc9j000p8o0uez7uocj7	2	5	cml27qnzi001fjutz7xlytmnv	2025-04-26 11:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.675	2026-01-31 11:35:57.675
cml28kcfg00tb8o0uyf40npqo	cml28kc9d00058o0u625c1fu5	cml28kc9j000o8o0ud1i5bl7h	1	0	cml27qnzi001fjutz7xlytmnv	2025-04-26 14:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.676	2026-01-31 11:35:57.676
cml28kcfg00tf8o0uihymdokt	cml28kc9k000s8o0uuxgdxwle	cml28kc9f00098o0u4mo2okiw	0	2	cml27qnzi001fjutz7xlytmnv	2025-04-26 15:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.677	2026-01-31 11:35:57.677
cml28kcfh00tj8o0upbym7tlw	cml28kc9l000w8o0uk08352oy	cml28kc9i000k8o0ux2depc2f	2	4	cml27qnzi001fjutz7xlytmnv	2025-04-27 09:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.678	2026-01-31 11:35:57.678
cml28kcfi00tn8o0uooi1alsh	cml28kc9l000x8o0u12p1mj55	cml28kc9f000c8o0u39q2fsk8	1	0	cml27qnzi001fjutz7xlytmnv	2025-04-27 11:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.679	2026-01-31 11:35:57.679
cml28kcfj00tr8o0ujoh2rkh8	cml28kc9k000t8o0ujvrw5jua	cml28kc9900018o0u6pgykhgr	1	2	cml27qnzi001fjutz7xlytmnv	2025-04-27 12:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.679	2026-01-31 11:35:57.679
cml28kcfk00tv8o0uyow7cblq	cml28kc9h000h8o0ur5avpwfx	cml28kc9h000g8o0up1atkack	1	0	cml27qnzi001fjutz7xlytmnv	2025-04-27 12:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.68	2026-01-31 11:35:57.68
cml28kcfl00tz8o0upetil0ab	cml28kc9600008o0uyfudq48v	cml28kc9g000d8o0u9np07t6b	1	1	cml27qnzi001fjutz7xlytmnv	2025-04-27 14:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.681	2026-01-31 11:35:57.681
cml28kcfl00u38o0u8xp8f4ke	cml28kc9i000l8o0uowglr6fz	cml28kc9d00058o0u625c1fu5	2	1	cml27qnzi001fjutz7xlytmnv	2025-05-03 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.682	2026-01-31 11:35:57.682
cml28kcfm00u78o0upz6velvm	cml28kc9f000c8o0u39q2fsk8	cml28kc9900018o0u6pgykhgr	0	2	cml27qnzi001fjutz7xlytmnv	2025-05-03 14:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.683	2026-01-31 11:35:57.683
cml28kcfn00ub8o0u1esl6x2k	cml28kc9f00098o0u4mo2okiw	cml28kc9600008o0uyfudq48v	5	1	cml27qnzi001fjutz7xlytmnv	2025-05-03 14:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.683	2026-01-31 11:35:57.683
cml28kcfo00uf8o0u26dpowrd	cml28kc9k000s8o0uuxgdxwle	cml28kc9l000w8o0uk08352oy	0	3	cml27qnzi001fjutz7xlytmnv	2025-05-03 14:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.684	2026-01-31 11:35:57.684
cml28kcfo00uj8o0u57ai18r5	cml28kc9j000p8o0uez7uocj7	cml28kc9i000k8o0ux2depc2f	0	1	cml27qnzi001fjutz7xlytmnv	2025-05-03 16:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.685	2026-01-31 11:35:57.685
cml28kcfp00un8o0u0q3reuwq	cml28kc9l000x8o0u12p1mj55	cml28kc9h000g8o0up1atkack	1	0	cml27qnzi001fjutz7xlytmnv	2025-05-04 12:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.686	2026-01-31 11:35:57.686
cml28kcfq00ur8o0uj2axcfqn	cml28kc9k000t8o0ujvrw5jua	cml28kc9h000h8o0ur5avpwfx	1	0	cml27qnzi001fjutz7xlytmnv	2025-05-04 12:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.687	2026-01-31 11:35:57.687
cml28kcfr00uv8o0usq0c69d9	cml28kc9g000d8o0u9np07t6b	cml28kc9d00048o0ujtjz89go	3	0	cml27qnzi001fjutz7xlytmnv	2025-05-04 14:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.687	2026-01-31 11:35:57.687
cml28kcfs00uz8o0uhpospakj	cml28kc9j000o8o0ud1i5bl7h	cml28kc9e00088o0uw1g06dvm	3	2	cml27qnzi001fjutz7xlytmnv	2025-05-04 16:30:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.688	2026-01-31 11:35:57.688
cml28kcfs00v38o0upvgq9qqm	cml28kc9d00048o0ujtjz89go	cml28kc9k000t8o0ujvrw5jua	2	1	cml27qnzi001fjutz7xlytmnv	2025-05-10 07:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.689	2026-01-31 11:35:57.689
cml28kcft00v78o0uyi00umkg	cml28kc9900018o0u6pgykhgr	cml28kc9j000p8o0uez7uocj7	0	0	cml27qnzi001fjutz7xlytmnv	2025-05-10 13:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.69	2026-01-31 11:35:57.69
cml28kcfu00vb8o0u6ibpnqpe	cml28kc9600008o0uyfudq48v	cml28kc9j000o8o0ud1i5bl7h	0	1	cml27qnzi001fjutz7xlytmnv	2025-05-10 15:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.69	2026-01-31 11:35:57.69
cml28kcfv00vf8o0utedmxnpa	cml28kc9h000g8o0up1atkack	cml28kc9f00098o0u4mo2okiw	1	1	cml27qnzi001fjutz7xlytmnv	2025-05-10 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.691	2026-01-31 11:35:57.691
cml28kcfv00vj8o0ufkbeceyc	cml28kc9e00088o0uw1g06dvm	cml28kc9l000x8o0u12p1mj55	2	1	cml27qnzi001fjutz7xlytmnv	2025-05-11 11:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.692	2026-01-31 11:35:57.692
cml28kcfw00vn8o0uoipttvi7	cml28kc9h000h8o0ur5avpwfx	cml28kc9k000s8o0uuxgdxwle	1	1	cml27qnzi001fjutz7xlytmnv	2025-05-11 12:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.693	2026-01-31 11:35:57.693
cml28kcfx00vr8o0uc2ue2vs5	cml28kc9i000k8o0ux2depc2f	cml28kc9f000c8o0u39q2fsk8	1	0	cml27qnzi001fjutz7xlytmnv	2025-05-11 14:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.693	2026-01-31 11:35:57.693
cml28kcfy00vv8o0ulnixeyb5	cml28kc9l000w8o0uk08352oy	cml28kc9i000l8o0uowglr6fz	0	4	cml27qnzi001fjutz7xlytmnv	2025-05-11 14:00:00	FINISHED	Akhmat Arena	2026-01-31 11:35:57.694	2026-01-31 11:35:57.694
cml28kcfz00vz8o0uss697foz	cml28kc9d00058o0u625c1fu5	cml28kc9g000d8o0u9np07t6b	0	4	cml27qnzi001fjutz7xlytmnv	2025-05-11 15:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.695	2026-01-31 11:35:57.695
cml28kcfz00w38o0uojok939d	cml28kc9i000l8o0uowglr6fz	cml28kc9j000o8o0ud1i5bl7h	1	0	cml27qnzi001fjutz7xlytmnv	2025-05-17 05:00:00	FINISHED	Stadion imeni V.I. Lenina	2026-01-31 11:35:57.696	2026-01-31 11:35:57.696
cml28kcg000w78o0u6necwasp	cml28kc9j000p8o0uez7uocj7	cml28kc9d00048o0ujtjz89go	0	0	cml27qnzi001fjutz7xlytmnv	2025-05-17 14:00:00	FINISHED	Rostec Arena	2026-01-31 11:35:57.697	2026-01-31 11:35:57.697
cml28kcg100wb8o0uuu360z8g	cml28kc9f00098o0u4mo2okiw	cml28kc9i000k8o0ux2depc2f	0	1	cml27qnzi001fjutz7xlytmnv	2025-05-17 14:00:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:35:57.697	2026-01-31 11:35:57.697
cml28kcg200wf8o0ukm6eomoe	cml28kc9k000s8o0uuxgdxwle	cml28kc9g000d8o0u9np07t6b	1	0	cml27qnzi001fjutz7xlytmnv	2025-05-17 16:00:00	FINISHED	Stadion Central’nyj im. I.P. Chayka	2026-01-31 11:35:57.698	2026-01-31 11:35:57.698
cml28kcg300wj8o0u37ktar1c	cml28kc9l000x8o0u12p1mj55	cml28kc9600008o0uyfudq48v	1	2	cml27qnzi001fjutz7xlytmnv	2025-05-18 12:00:00	FINISHED	BetBoom Аrena	2026-01-31 11:35:57.699	2026-01-31 11:35:57.699
cml28kcg300wn8o0uc9id3sik	cml28kc9h000h8o0ur5avpwfx	cml28kc9e00088o0uw1g06dvm	1	2	cml27qnzi001fjutz7xlytmnv	2025-05-18 13:00:00	FINISHED	Stadion Geolog	2026-01-31 11:35:57.7	2026-01-31 11:35:57.7
cml28kcg400wr8o0u8jawxehg	cml28kc9f000c8o0u39q2fsk8	cml28kc9k000t8o0ujvrw5jua	0	4	cml27qnzi001fjutz7xlytmnv	2025-05-18 14:00:00	FINISHED	Stadion Shinnik	2026-01-31 11:35:57.701	2026-01-31 11:35:57.701
cml28kcg500wv8o0uvlb8jd38	cml28kc9h000g8o0up1atkack	cml28kc9900018o0u6pgykhgr	0	2	cml27qnzi001fjutz7xlytmnv	2025-05-19 15:00:00	FINISHED	Stadion Neftekhimik	2026-01-31 11:35:57.701	2026-01-31 11:35:57.701
cml28kcg600wz8o0uhunr59rn	cml28kc9d00058o0u625c1fu5	cml28kc9l000w8o0uk08352oy	1	1	cml27qnzi001fjutz7xlytmnv	2025-05-19 15:00:00	FINISHED	Stadion KAMAZ	2026-01-31 11:35:57.702	2026-01-31 11:35:57.702
cml28kcg600x38o0u5m5pd76h	cml28kc9600008o0uyfudq48v	cml28kc9j000p8o0uez7uocj7	0	0	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Stadion Arsenal	2026-01-31 11:35:57.703	2026-01-31 11:35:57.703
cml28kcg700x78o0uny9sb185	cml28kc9e00088o0uw1g06dvm	cml28kc9i000l8o0uowglr6fz	3	1	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:35:57.704	2026-01-31 11:35:57.704
cml28kcg800xb8o0u8jxkcvwf	cml28kc9d00048o0ujtjz89go	cml28kc9h000h8o0ur5avpwfx	4	3	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Central'nyj Stadion	2026-01-31 11:35:57.705	2026-01-31 11:35:57.705
cml28kcg900xf8o0ui0tnnmhf	cml28kc9k000t8o0ujvrw5jua	cml28kc9k000s8o0uuxgdxwle	1	0	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Stadion Lokomotiv	2026-01-31 11:35:57.706	2026-01-31 11:35:57.706
cml28kcga00xj8o0ulsb4co7j	cml28kc9g000d8o0u9np07t6b	cml28kc9l000x8o0u12p1mj55	0	2	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Volgograd Arena	2026-01-31 11:35:57.707	2026-01-31 11:35:57.707
cml28kcgb00xn8o0u9i1xpr4g	cml28kc9i000k8o0ux2depc2f	cml28kc9d00058o0u625c1fu5	1	1	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Arena Khimki	2026-01-31 11:35:57.707	2026-01-31 11:35:57.707
cml28kcgc00xr8o0u5omtbt35	cml28kc9l000w8o0uk08352oy	cml28kc9h000g8o0up1atkack	1	2	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Stadion im. Sultana Bilimkhanova	2026-01-31 11:35:57.708	2026-01-31 11:35:57.708
cml28kcgd00xv8o0udq6pjjv5	cml28kc9900018o0u6pgykhgr	cml28kc9f00098o0u4mo2okiw	2	1	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Stadion Central'nyj	2026-01-31 11:35:57.709	2026-01-31 11:35:57.709
cml28kcgd00xz8o0ufczbc8s6	cml28kc9j000o8o0ud1i5bl7h	cml28kc9f000c8o0u39q2fsk8	6	2	cml27qnzi001fjutz7xlytmnv	2025-05-24 10:00:00	FINISHED	Sapsan Arena	2026-01-31 11:35:57.71	2026-01-31 11:35:57.71
cml28kupl00034sq4vx9ub1jm	cml28kupd00004sq43ox6f90y	cml28kuph00014sq44rnnx4ex	3	2	cml27qnzi001djutzaerrkags	2024-07-20 12:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.37	2026-01-31 11:36:21.37
cml28kupq00074sq4ykmwkplk	cml28kupo00044sq42b51grvb	cml28kupp00054sq4jg1hhxmh	0	4	cml27qnzi001djutzaerrkags	2024-07-20 14:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.375	2026-01-31 11:36:21.375
cml28kupu000b4sq4gg2vulss	cml28kups00084sq4jo3thxdt	cml28kups00094sq4m4dvklum	0	0	cml27qnzi001djutzaerrkags	2024-07-20 17:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.378	2026-01-31 11:36:21.378
cml28kupx000f4sq4yfgehkhe	cml28kupv000c4sq4ie08laju	cml28kupw000d4sq41fvfy0sf	3	1	cml27qnzi001djutzaerrkags	2024-07-20 17:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.381	2026-01-31 11:36:21.381
cml28kupz000j4sq45z0kyoms	cml28kupy000g4sq49ipxycuy	cml28kupy000h4sq4s4frt8xj	2	0	cml27qnzi001djutzaerrkags	2024-07-21 14:30:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.384	2026-01-31 11:36:21.384
cml28kuq2000n4sq4vwi20hno	cml28kuq0000k4sq42641xa14	cml28kuq0000l4sq447ihy0qy	1	1	cml27qnzi001djutzaerrkags	2024-07-21 17:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.386	2026-01-31 11:36:21.386
cml28kuq5000r4sq4octsq1y8	cml28kuq2000o4sq4bu9tjjpu	cml28kuq3000p4sq4lyailgfi	1	1	cml27qnzi001djutzaerrkags	2024-07-21 17:00:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.389	2026-01-31 11:36:21.389
cml28kuq7000v4sq4hlpkg73a	cml28kuq6000s4sq435go25ax	cml28kuq6000t4sq4sdr8nlgd	2	4	cml27qnzi001djutzaerrkags	2024-07-22 17:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.392	2026-01-31 11:36:21.392
cml28kuqa000z4sq4ksgdm6na	cml28kupo00044sq42b51grvb	cml28kups00084sq4jo3thxdt	1	3	cml27qnzi001djutzaerrkags	2024-07-26 15:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.394	2026-01-31 11:36:21.394
cml28kuqc00134sq4kyl4mbv3	cml28kuq6000s4sq435go25ax	cml28kups00094sq4m4dvklum	0	3	cml27qnzi001djutzaerrkags	2024-07-27 12:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.397	2026-01-31 11:36:21.397
cml28kuqf00174sq4k966ua0t	cml28kuq6000t4sq4sdr8nlgd	cml28kupp00054sq4jg1hhxmh	0	4	cml27qnzi001djutzaerrkags	2024-07-27 14:30:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.399	2026-01-31 11:36:21.399
cml28kuqh001b4sq4iwbgd3x3	cml28kupv000c4sq4ie08laju	cml28kupd00004sq43ox6f90y	3	1	cml27qnzi001djutzaerrkags	2024-07-27 14:30:00	FINISHED	VTB Arena	2026-01-31 11:36:21.401	2026-01-31 11:36:21.401
cml28kuqj001f4sq4nj8vdgg9	cml28kupw000d4sq41fvfy0sf	cml28kuph00014sq44rnnx4ex	0	2	cml27qnzi001djutzaerrkags	2024-07-27 17:00:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.404	2026-01-31 11:36:21.404
cml28kuqm001j4sq4vdo8k23x	cml28kuq2000o4sq4bu9tjjpu	cml28kupy000h4sq4s4frt8xj	1	3	cml27qnzi001djutzaerrkags	2024-07-28 12:00:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.406	2026-01-31 11:36:21.406
cml28kuqo001n4sq4h9tbrcje	cml28kupy000g4sq49ipxycuy	cml28kuq0000k4sq42641xa14	0	0	cml27qnzi001djutzaerrkags	2024-07-28 14:30:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.409	2026-01-31 11:36:21.409
cml28kuqq001r4sq451z8ejx1	cml28kuq0000l4sq447ihy0qy	cml28kuq3000p4sq4lyailgfi	0	0	cml27qnzi001djutzaerrkags	2024-07-28 17:00:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.411	2026-01-31 11:36:21.411
cml28kuqs001v4sq48ic0hgt0	cml28kuph00014sq44rnnx4ex	cml28kupv000c4sq4ie08laju	0	2	cml27qnzi001djutzaerrkags	2024-08-03 12:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.413	2026-01-31 11:36:21.413
cml28kuqu001z4sq441ktqxvx	cml28kupp00054sq4jg1hhxmh	cml28kups00084sq4jo3thxdt	5	0	cml27qnzi001djutzaerrkags	2024-08-03 14:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.415	2026-01-31 11:36:21.415
cml28kuqw00234sq4hq3lf816	cml28kuq6000t4sq4sdr8nlgd	cml28kuq2000o4sq4bu9tjjpu	2	3	cml27qnzi001djutzaerrkags	2024-08-03 17:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.417	2026-01-31 11:36:21.417
cml28kuqy00274sq4jcov1gmo	cml28kups00094sq4m4dvklum	cml28kupy000g4sq49ipxycuy	5	1	cml27qnzi001djutzaerrkags	2024-08-04 12:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.419	2026-01-31 11:36:21.419
cml28kur0002b4sq4y57ivb5a	cml28kupw000d4sq41fvfy0sf	cml28kuq0000l4sq447ihy0qy	0	0	cml27qnzi001djutzaerrkags	2024-08-04 14:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.421	2026-01-31 11:36:21.421
cml28kur2002f4sq43qwv4nz9	cml28kuq0000k4sq42641xa14	cml28kupd00004sq43ox6f90y	0	5	cml27qnzi001djutzaerrkags	2024-08-04 17:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.423	2026-01-31 11:36:21.423
cml28kur5002j4sq4dxx372me	cml28kuq3000p4sq4lyailgfi	cml28kuq6000s4sq435go25ax	0	1	cml27qnzi001djutzaerrkags	2024-08-04 17:30:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.425	2026-01-31 11:36:21.425
cml28kur6002n4sq4tiyf0u37	cml28kupy000h4sq4s4frt8xj	cml28kupo00044sq42b51grvb	3	0	cml27qnzi001djutzaerrkags	2024-08-05 17:00:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.427	2026-01-31 11:36:21.427
cml28kur8002r4sq47i2l091q	cml28kuq6000s4sq435go25ax	cml28kuq2000o4sq4bu9tjjpu	1	0	cml27qnzi001djutzaerrkags	2024-08-09 15:30:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.429	2026-01-31 11:36:21.429
cml28kura002v4sq4oiauag7a	cml28kups00084sq4jo3thxdt	cml28kuq6000t4sq4sdr8nlgd	1	1	cml27qnzi001djutzaerrkags	2024-08-09 17:45:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.431	2026-01-31 11:36:21.431
cml28kurc002z4sq4e8ez42gm	cml28kupd00004sq43ox6f90y	cml28kuq3000p4sq4lyailgfi	2	0	cml27qnzi001djutzaerrkags	2024-08-10 12:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.432	2026-01-31 11:36:21.432
cml28kure00334sq4peuuomwy	cml28kupp00054sq4jg1hhxmh	cml28kupv000c4sq4ie08laju	1	0	cml27qnzi001djutzaerrkags	2024-08-10 14:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.435	2026-01-31 11:36:21.435
cml28kurg00374sq43gni9duy	cml28kupy000g4sq49ipxycuy	cml28kuph00014sq44rnnx4ex	2	2	cml27qnzi001djutzaerrkags	2024-08-10 14:30:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.436	2026-01-31 11:36:21.436
cml28kuri003b4sq40mbbcq2z	cml28kuq0000l4sq447ihy0qy	cml28kups00094sq4m4dvklum	2	1	cml27qnzi001djutzaerrkags	2024-08-10 17:00:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.438	2026-01-31 11:36:21.438
cml28kurk003f4sq4dsnqw2ur	cml28kupo00044sq42b51grvb	cml28kupw000d4sq41fvfy0sf	2	0	cml27qnzi001djutzaerrkags	2024-08-11 14:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.44	2026-01-31 11:36:21.44
cml28kurm003j4sq4evsxx1n3	cml28kupy000h4sq4s4frt8xj	cml28kuq0000k4sq42641xa14	0	0	cml27qnzi001djutzaerrkags	2024-08-11 17:00:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.442	2026-01-31 11:36:21.442
cml28kurn003n4sq4zxotxbkd	cml28kupv000c4sq4ie08laju	cml28kupo00044sq42b51grvb	1	0	cml27qnzi001djutzaerrkags	2024-08-17 14:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.444	2026-01-31 11:36:21.444
cml28kurp003r4sq4xxak1n7w	cml28kups00084sq4jo3thxdt	cml28kupy000g4sq49ipxycuy	3	2	cml27qnzi001djutzaerrkags	2024-08-17 16:30:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.445	2026-01-31 11:36:21.445
cml28kurr003v4sq42htgop9j	cml28kuq2000o4sq4bu9tjjpu	cml28kupp00054sq4jg1hhxmh	1	1	cml27qnzi001djutzaerrkags	2024-08-18 12:00:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.447	2026-01-31 11:36:21.447
cml28kurs003z4sq459n3bqqn	cml28kups00094sq4m4dvklum	cml28kupd00004sq43ox6f90y	0	1	cml27qnzi001djutzaerrkags	2024-08-18 14:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.449	2026-01-31 11:36:21.449
cml28kuru00434sq4otngs6rf	cml28kupy000h4sq4s4frt8xj	cml28kupw000d4sq41fvfy0sf	3	0	cml27qnzi001djutzaerrkags	2024-08-18 14:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.45	2026-01-31 11:36:21.45
cml28kurv00474sq4jwn3b3aw	cml28kuq0000l4sq447ihy0qy	cml28kuq6000s4sq435go25ax	2	1	cml27qnzi001djutzaerrkags	2024-08-18 17:00:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.451	2026-01-31 11:36:21.451
cml28kurw004b4sq4ur9lmb0c	cml28kuph00014sq44rnnx4ex	cml28kuq6000t4sq4sdr8nlgd	1	2	cml27qnzi001djutzaerrkags	2024-08-19 14:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.453	2026-01-31 11:36:21.453
cml28kury004f4sq4lqonujk0	cml28kuq3000p4sq4lyailgfi	cml28kuq0000k4sq42641xa14	1	0	cml27qnzi001djutzaerrkags	2024-08-19 17:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.454	2026-01-31 11:36:21.454
cml28kurz004j4sq40odpvsnw	cml28kuq6000t4sq4sdr8nlgd	cml28kuq3000p4sq4lyailgfi	2	0	cml27qnzi001djutzaerrkags	2024-08-23 17:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.455	2026-01-31 11:36:21.455
cml28kus0004n4sq4ipyx99f5	cml28kups00094sq4m4dvklum	cml28kuph00014sq44rnnx4ex	4	0	cml27qnzi001djutzaerrkags	2024-08-24 12:00:00	FINISHED	VEB Arena	2026-01-31 11:36:21.457	2026-01-31 11:36:21.457
cml28kus1004r4sq4ws2rn13q	cml28kupp00054sq4jg1hhxmh	cml28kupy000h4sq4s4frt8xj	0	0	cml27qnzi001djutzaerrkags	2024-08-24 14:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.458	2026-01-31 11:36:21.458
cml28kus3004v4sq4o50kvhvw	cml28kupw000d4sq41fvfy0sf	cml28kupy000g4sq49ipxycuy	1	0	cml27qnzi001djutzaerrkags	2024-08-24 14:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.459	2026-01-31 11:36:21.459
cml28kus4004z4sq4a57ke0u3	cml28kuq0000k4sq42641xa14	cml28kuq2000o4sq4bu9tjjpu	3	3	cml27qnzi001djutzaerrkags	2024-08-24 17:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.46	2026-01-31 11:36:21.46
cml28kus500534sq4c8noa83y	cml28kupo00044sq42b51grvb	cml28kuq6000s4sq435go25ax	3	1	cml27qnzi001djutzaerrkags	2024-08-25 12:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.461	2026-01-31 11:36:21.461
cml28kus600574sq4z8jkgocm	cml28kupv000c4sq4ie08laju	cml28kuq0000l4sq447ihy0qy	0	1	cml27qnzi001djutzaerrkags	2024-08-25 14:30:00	FINISHED	VTB Arena	2026-01-31 11:36:21.463	2026-01-31 11:36:21.463
cml28kus7005b4sq4l5qbxxzf	cml28kupd00004sq43ox6f90y	cml28kups00084sq4jo3thxdt	3	2	cml27qnzi001djutzaerrkags	2024-08-25 17:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.464	2026-01-31 11:36:21.464
cml28kus9005f4sq4w0mw5pzz	cml28kuq2000o4sq4bu9tjjpu	cml28kups00094sq4m4dvklum	0	2	cml27qnzi001djutzaerrkags	2024-08-31 12:00:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.465	2026-01-31 11:36:21.465
cml28kusa005j4sq45s0b2n80	cml28kuq6000s4sq435go25ax	cml28kupp00054sq4jg1hhxmh	0	3	cml27qnzi001djutzaerrkags	2024-08-31 14:30:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.466	2026-01-31 11:36:21.466
cml28kusb005n4sq4uvhhusse	cml28kupy000h4sq4s4frt8xj	cml28kuq6000t4sq4sdr8nlgd	1	0	cml27qnzi001djutzaerrkags	2024-08-31 16:45:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.468	2026-01-31 11:36:21.468
cml28kusc005r4sq4yjud1e0f	cml28kuq0000k4sq42641xa14	cml28kuph00014sq44rnnx4ex	0	0	cml27qnzi001djutzaerrkags	2024-08-31 17:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.469	2026-01-31 11:36:21.469
cml28kuse005v4sq4tq3pjojq	cml28kupy000g4sq49ipxycuy	cml28kupv000c4sq4ie08laju	2	2	cml27qnzi001djutzaerrkags	2024-09-01 12:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.47	2026-01-31 11:36:21.47
cml28kusf005z4sq4i57fjbdf	cml28kupo00044sq42b51grvb	cml28kuq3000p4sq4lyailgfi	0	1	cml27qnzi001djutzaerrkags	2024-09-01 14:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.471	2026-01-31 11:36:21.471
cml28kusg00634sq4m8ojclak	cml28kupd00004sq43ox6f90y	cml28kuq0000l4sq447ihy0qy	0	3	cml27qnzi001djutzaerrkags	2024-09-01 16:45:00	FINISHED	RZD Arena	2026-01-31 11:36:21.472	2026-01-31 11:36:21.472
cml28kush00674sq4mxbyp81l	cml28kups00084sq4jo3thxdt	cml28kupw000d4sq41fvfy0sf	4	1	cml27qnzi001djutzaerrkags	2024-09-01 17:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.474	2026-01-31 11:36:21.474
cml28kusi006b4sq4dnsgum3j	cml28kuq6000t4sq4sdr8nlgd	cml28kupo00044sq42b51grvb	0	2	cml27qnzi001djutzaerrkags	2024-09-13 17:15:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.475	2026-01-31 11:36:21.475
cml28kusj006f4sq4e6li1pci	cml28kupy000g4sq49ipxycuy	cml28kupd00004sq43ox6f90y	2	4	cml27qnzi001djutzaerrkags	2024-09-14 09:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.476	2026-01-31 11:36:21.476
cml28kusl006j4sq46iibitke	cml28kupw000d4sq41fvfy0sf	cml28kuq6000s4sq435go25ax	0	0	cml27qnzi001djutzaerrkags	2024-09-14 11:15:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.477	2026-01-31 11:36:21.477
cml28kusm006n4sq4g8t4q88i	cml28kups00094sq4m4dvklum	cml28kupp00054sq4jg1hhxmh	0	1	cml27qnzi001djutzaerrkags	2024-09-14 13:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.478	2026-01-31 11:36:21.478
cml28kusn006r4sq4yf5vzkcb	cml28kuq0000l4sq447ihy0qy	cml28kups00084sq4jo3thxdt	2	0	cml27qnzi001djutzaerrkags	2024-09-14 16:00:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.479	2026-01-31 11:36:21.479
cml28kuso006v4sq40mctkpjp	cml28kupv000c4sq4ie08laju	cml28kuq0000k4sq42641xa14	4	2	cml27qnzi001djutzaerrkags	2024-09-15 11:15:00	FINISHED	VTB Arena	2026-01-31 11:36:21.481	2026-01-31 11:36:21.481
cml28kusp006z4sq4pbev9z1z	cml28kuph00014sq44rnnx4ex	cml28kuq2000o4sq4bu9tjjpu	3	0	cml27qnzi001djutzaerrkags	2024-09-15 13:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.482	2026-01-31 11:36:21.482
cml28kusq00734sq440jdoppf	cml28kuq3000p4sq4lyailgfi	cml28kupy000h4sq4s4frt8xj	1	1	cml27qnzi001djutzaerrkags	2024-09-15 16:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.483	2026-01-31 11:36:21.483
cml28kusr00774sq4398hu4s0	cml28kuph00014sq44rnnx4ex	cml28kuq0000l4sq447ihy0qy	2	5	cml27qnzi001djutzaerrkags	2024-09-21 11:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.484	2026-01-31 11:36:21.484
cml28kust007b4sq428th51bg	cml28kupp00054sq4jg1hhxmh	cml28kupw000d4sq41fvfy0sf	3	1	cml27qnzi001djutzaerrkags	2024-09-21 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.485	2026-01-31 11:36:21.485
cml28kusu007f4sq45vkluj7r	cml28kuq6000t4sq4sdr8nlgd	cml28kups00094sq4m4dvklum	1	1	cml27qnzi001djutzaerrkags	2024-09-21 16:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.486	2026-01-31 11:36:21.486
cml28kusv007j4sq4lysdz2ux	cml28kuq2000o4sq4bu9tjjpu	cml28kupy000g4sq49ipxycuy	0	0	cml27qnzi001djutzaerrkags	2024-09-22 11:15:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.487	2026-01-31 11:36:21.487
cml28kusw007n4sq4ay3iwq2j	cml28kupy000h4sq4s4frt8xj	cml28kupv000c4sq4ie08laju	2	2	cml27qnzi001djutzaerrkags	2024-09-22 13:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.488	2026-01-31 11:36:21.488
cml28kusx007r4sq4g0f4phje	cml28kups00084sq4jo3thxdt	cml28kuq3000p4sq4lyailgfi	0	0	cml27qnzi001djutzaerrkags	2024-09-22 13:30:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.489	2026-01-31 11:36:21.489
cml28kusy007v4sq42297pvvp	cml28kuq6000s4sq435go25ax	cml28kupd00004sq43ox6f90y	1	3	cml27qnzi001djutzaerrkags	2024-09-22 16:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.491	2026-01-31 11:36:21.491
cml28kusz007z4sq4ai5inmsv	cml28kuq0000k4sq42641xa14	cml28kupo00044sq42b51grvb	1	1	cml27qnzi001djutzaerrkags	2024-09-23 15:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.492	2026-01-31 11:36:21.492
cml28kut000834sq46yg1685d	cml28kupy000g4sq49ipxycuy	cml28kuq6000s4sq435go25ax	1	2	cml27qnzi001djutzaerrkags	2024-09-27 13:30:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.493	2026-01-31 11:36:21.493
cml28kut100874sq4d1004vvt	cml28kupw000d4sq41fvfy0sf	cml28kuq6000t4sq4sdr8nlgd	0	0	cml27qnzi001djutzaerrkags	2024-09-27 16:00:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.494	2026-01-31 11:36:21.494
cml28kut2008b4sq42p30b7of	cml28kups00094sq4m4dvklum	cml28kuq0000k4sq42641xa14	3	0	cml27qnzi001djutzaerrkags	2024-09-28 11:00:00	FINISHED	VEB Arena	2026-01-31 11:36:21.495	2026-01-31 11:36:21.495
cml28kut3008f4sq4awvxh87q	cml28kupd00004sq43ox6f90y	cml28kupy000h4sq4s4frt8xj	3	1	cml27qnzi001djutzaerrkags	2024-09-28 13:30:00	FINISHED	RZD Arena	2026-01-31 11:36:21.496	2026-01-31 11:36:21.496
cml28kut4008j4sq45wdb3ve7	cml28kuq0000l4sq447ihy0qy	cml28kupp00054sq4jg1hhxmh	2	0	cml27qnzi001djutzaerrkags	2024-09-28 16:30:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.497	2026-01-31 11:36:21.497
cml28kut6008n4sq4t51jlkro	cml28kups00084sq4jo3thxdt	cml28kuph00014sq44rnnx4ex	0	2	cml27qnzi001djutzaerrkags	2024-09-28 17:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.498	2026-01-31 11:36:21.498
cml28kut7008r4sq4268sz4rq	cml28kupo00044sq42b51grvb	cml28kuq2000o4sq4bu9tjjpu	0	0	cml27qnzi001djutzaerrkags	2024-09-29 13:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.499	2026-01-31 11:36:21.499
cml28kut8008v4sq48xjx29u1	cml28kuq3000p4sq4lyailgfi	cml28kupv000c4sq4ie08laju	0	1	cml27qnzi001djutzaerrkags	2024-09-29 16:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.5	2026-01-31 11:36:21.5
cml28kut9008z4sq4yvxn1tge	cml28kuph00014sq44rnnx4ex	cml28kuq6000s4sq435go25ax	2	2	cml27qnzi001djutzaerrkags	2024-10-05 11:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.501	2026-01-31 11:36:21.501
cml28kuta00934sq4ie5qj613	cml28kupp00054sq4jg1hhxmh	cml28kupy000g4sq49ipxycuy	1	0	cml27qnzi001djutzaerrkags	2024-10-05 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.502	2026-01-31 11:36:21.502
cml28kutb00974sq4lbi9fdtf	cml28kupy000h4sq4s4frt8xj	cml28kups00084sq4jo3thxdt	3	0	cml27qnzi001djutzaerrkags	2024-10-05 16:00:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.503	2026-01-31 11:36:21.503
cml28kutc009b4sq4lorekwle	cml28kuq6000t4sq4sdr8nlgd	cml28kuq0000k4sq42641xa14	2	0	cml27qnzi001djutzaerrkags	2024-10-05 16:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.504	2026-01-31 11:36:21.504
cml28kutd009f4sq4uh55egui	cml28kupw000d4sq41fvfy0sf	cml28kuq3000p4sq4lyailgfi	1	1	cml27qnzi001djutzaerrkags	2024-10-06 11:00:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.505	2026-01-31 11:36:21.505
cml28kute009j4sq4bp3x0ofa	cml28kupd00004sq43ox6f90y	cml28kupo00044sq42b51grvb	1	0	cml27qnzi001djutzaerrkags	2024-10-06 13:30:00	FINISHED	RZD Arena	2026-01-31 11:36:21.506	2026-01-31 11:36:21.506
cml28kutf009n4sq47dyzspcc	cml28kuq0000l4sq447ihy0qy	cml28kuq2000o4sq4bu9tjjpu	4	0	cml27qnzi001djutzaerrkags	2024-10-06 16:00:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.507	2026-01-31 11:36:21.507
cml28kutg009r4sq4gqy3nxp7	cml28kupv000c4sq4ie08laju	cml28kups00094sq4m4dvklum	1	2	cml27qnzi001djutzaerrkags	2024-10-06 16:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.508	2026-01-31 11:36:21.508
cml28kuth009v4sq4y8xxxlz9	cml28kuph00014sq44rnnx4ex	cml28kupp00054sq4jg1hhxmh	0	5	cml27qnzi001djutzaerrkags	2024-10-18 15:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.509	2026-01-31 11:36:21.509
cml28kuti009z4sq4psrlbec1	cml28kuq0000k4sq42641xa14	cml28kupw000d4sq41fvfy0sf	2	3	cml27qnzi001djutzaerrkags	2024-10-18 17:15:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.51	2026-01-31 11:36:21.51
cml28kutj00a34sq40mnlh3l1	cml28kuq6000s4sq435go25ax	cml28kups00084sq4jo3thxdt	1	1	cml27qnzi001djutzaerrkags	2024-10-19 11:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.511	2026-01-31 11:36:21.511
cml28kutk00a74sq4hhgcvftc	cml28kupy000h4sq4s4frt8xj	cml28kuq0000l4sq447ihy0qy	0	3	cml27qnzi001djutzaerrkags	2024-10-19 13:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.513	2026-01-31 11:36:21.513
cml28kutl00ab4sq4pplcbash	cml28kuq2000o4sq4bu9tjjpu	cml28kupd00004sq43ox6f90y	2	0	cml27qnzi001djutzaerrkags	2024-10-19 13:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.514	2026-01-31 11:36:21.514
cml28kutm00af4sq4dsj2k4ty	cml28kuq3000p4sq4lyailgfi	cml28kups00094sq4m4dvklum	0	1	cml27qnzi001djutzaerrkags	2024-10-19 16:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.515	2026-01-31 11:36:21.515
cml28kutn00aj4sq41t9d1ssu	cml28kupy000g4sq49ipxycuy	cml28kupo00044sq42b51grvb	2	2	cml27qnzi001djutzaerrkags	2024-10-20 13:30:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.516	2026-01-31 11:36:21.516
cml28kuto00an4sq4khy0pqlx	cml28kuq6000t4sq4sdr8nlgd	cml28kupv000c4sq4ie08laju	0	4	cml27qnzi001djutzaerrkags	2024-10-20 16:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.517	2026-01-31 11:36:21.517
cml28kutp00ar4sq4v62tw97k	cml28kuq3000p4sq4lyailgfi	cml28kuph00014sq44rnnx4ex	1	1	cml27qnzi001djutzaerrkags	2024-10-26 11:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.518	2026-01-31 11:36:21.518
cml28kutq00av4sq4srxvrwyv	cml28kups00094sq4m4dvklum	cml28kupw000d4sq41fvfy0sf	0	0	cml27qnzi001djutzaerrkags	2024-10-26 13:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.519	2026-01-31 11:36:21.519
cml28kutr00az4sq42g4gyfl7	cml28kups00084sq4jo3thxdt	cml28kuq0000k4sq42641xa14	2	3	cml27qnzi001djutzaerrkags	2024-10-26 16:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.52	2026-01-31 11:36:21.52
cml28kuts00b34sq4w3kb3j82	cml28kupy000g4sq49ipxycuy	cml28kuq6000t4sq4sdr8nlgd	1	2	cml27qnzi001djutzaerrkags	2024-10-27 08:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.521	2026-01-31 11:36:21.521
cml28kutt00b74sq42m6pbo3f	cml28kuq6000s4sq435go25ax	cml28kupy000h4sq4s4frt8xj	0	2	cml27qnzi001djutzaerrkags	2024-10-27 10:15:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.522	2026-01-31 11:36:21.522
cml28kutu00bb4sq4x9wqloc0	cml28kuq2000o4sq4bu9tjjpu	cml28kupv000c4sq4ie08laju	3	4	cml27qnzi001djutzaerrkags	2024-10-27 12:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.523	2026-01-31 11:36:21.523
cml28kutv00bf4sq4hfuntmnh	cml28kupp00054sq4jg1hhxmh	cml28kupd00004sq43ox6f90y	1	1	cml27qnzi001djutzaerrkags	2024-10-27 15:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.524	2026-01-31 11:36:21.524
cml28kutw00bj4sq4a1wyzh5h	cml28kupo00044sq42b51grvb	cml28kuq0000l4sq447ihy0qy	1	2	cml27qnzi001djutzaerrkags	2024-10-28 15:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.524	2026-01-31 11:36:21.524
cml28kutx00bn4sq448fqbva5	cml28kupv000c4sq4ie08laju	cml28kups00084sq4jo3thxdt	1	1	cml27qnzi001djutzaerrkags	2024-11-01 16:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.525	2026-01-31 11:36:21.525
cml28kuty00br4sq4zdw892tc	cml28kupp00054sq4jg1hhxmh	cml28kuq3000p4sq4lyailgfi	2	1	cml27qnzi001djutzaerrkags	2024-11-02 15:00:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.526	2026-01-31 11:36:21.526
cml28kutz00bv4sq4pbiojr0i	cml28kupd00004sq43ox6f90y	cml28kuq6000t4sq4sdr8nlgd	1	0	cml27qnzi001djutzaerrkags	2024-11-02 15:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.527	2026-01-31 11:36:21.527
cml28kuu000bz4sq4532ummqm	cml28kups00094sq4m4dvklum	cml28kupy000h4sq4s4frt8xj	0	2	cml27qnzi001djutzaerrkags	2024-11-02 17:45:00	FINISHED	VEB Arena	2026-01-31 11:36:21.528	2026-01-31 11:36:21.528
cml28kuu100c34sq4nk6are54	cml28kuph00014sq44rnnx4ex	cml28kupo00044sq42b51grvb	2	0	cml27qnzi001djutzaerrkags	2024-11-03 10:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.529	2026-01-31 11:36:21.529
cml28kuu200c74sq4kv0rbyxa	cml28kuq0000k4sq42641xa14	cml28kuq6000s4sq435go25ax	0	2	cml27qnzi001djutzaerrkags	2024-11-03 12:15:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.53	2026-01-31 11:36:21.53
cml28kuu200cb4sq4rmre62nq	cml28kupw000d4sq41fvfy0sf	cml28kuq2000o4sq4bu9tjjpu	1	1	cml27qnzi001djutzaerrkags	2024-11-03 14:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.531	2026-01-31 11:36:21.531
cml28kuu300cf4sq4hjuqy42j	cml28kuq0000l4sq447ihy0qy	cml28kupy000g4sq49ipxycuy	4	0	cml27qnzi001djutzaerrkags	2024-11-03 16:45:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.532	2026-01-31 11:36:21.532
cml28kuu400cj4sq4bui1k4w0	cml28kupd00004sq43ox6f90y	cml28kupw000d4sq41fvfy0sf	2	1	cml27qnzi001djutzaerrkags	2024-11-09 11:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.533	2026-01-31 11:36:21.533
cml28kuu500cn4sq41rl8kgnl	cml28kuq3000p4sq4lyailgfi	cml28kupy000g4sq49ipxycuy	2	1	cml27qnzi001djutzaerrkags	2024-11-09 13:30:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.533	2026-01-31 11:36:21.533
cml28kuu600cr4sq40llsad56	cml28kups00084sq4jo3thxdt	cml28kuq2000o4sq4bu9tjjpu	3	1	cml27qnzi001djutzaerrkags	2024-11-09 16:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.534	2026-01-31 11:36:21.534
cml28kuu700cv4sq4nto4bw2x	cml28kupv000c4sq4ie08laju	cml28kuq6000s4sq435go25ax	3	1	cml27qnzi001djutzaerrkags	2024-11-09 16:30:00	FINISHED	VTB Arena	2026-01-31 11:36:21.535	2026-01-31 11:36:21.535
cml28kuu800cz4sq4h668xtk5	cml28kupo00044sq42b51grvb	cml28kups00094sq4m4dvklum	1	2	cml27qnzi001djutzaerrkags	2024-11-10 10:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.536	2026-01-31 11:36:21.536
cml28kuu900d34sq4xzzlhlrq	cml28kupy000h4sq4s4frt8xj	cml28kuph00014sq44rnnx4ex	4	0	cml27qnzi001djutzaerrkags	2024-11-10 12:15:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.537	2026-01-31 11:36:21.537
cml28kuu900d74sq4cgglxqzz	cml28kuq0000k4sq42641xa14	cml28kupp00054sq4jg1hhxmh	1	2	cml27qnzi001djutzaerrkags	2024-11-10 14:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.538	2026-01-31 11:36:21.538
cml28kuua00db4sq46biw84kd	cml28kuq6000t4sq4sdr8nlgd	cml28kuq0000l4sq447ihy0qy	1	1	cml27qnzi001djutzaerrkags	2024-11-10 16:45:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.539	2026-01-31 11:36:21.539
cml28kuub00df4sq456gt90tq	cml28kuq6000t4sq4sdr8nlgd	cml28kuph00014sq44rnnx4ex	3	0	cml27qnzi001djutzaerrkags	2024-11-22 16:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.54	2026-01-31 11:36:21.54
cml28kuuc00dj4sq4og4lundy	cml28kupy000g4sq49ipxycuy	cml28kupp00054sq4jg1hhxmh	0	1	cml27qnzi001djutzaerrkags	2024-11-23 09:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.541	2026-01-31 11:36:21.541
cml28kuud00dn4sq4us79kzmk	cml28kups00094sq4m4dvklum	cml28kups00084sq4jo3thxdt	1	2	cml27qnzi001djutzaerrkags	2024-11-23 11:15:00	FINISHED	VEB Arena	2026-01-31 11:36:21.542	2026-01-31 11:36:21.542
cml28kuue00dr4sq49uxmj7a9	cml28kuq2000o4sq4bu9tjjpu	cml28kuq0000l4sq447ihy0qy	2	2	cml27qnzi001djutzaerrkags	2024-11-23 13:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.543	2026-01-31 11:36:21.543
cml28kuuf00dv4sq4i5z4rn8g	cml28kupy000h4sq4s4frt8xj	cml28kupd00004sq43ox6f90y	5	2	cml27qnzi001djutzaerrkags	2024-11-23 15:00:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.544	2026-01-31 11:36:21.544
cml28kuug00dz4sq4lapxxl1i	cml28kupo00044sq42b51grvb	cml28kuq0000k4sq42641xa14	2	1	cml27qnzi001djutzaerrkags	2024-11-24 11:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.544	2026-01-31 11:36:21.544
cml28kuuh00e34sq4ukvxhgf5	cml28kupw000d4sq41fvfy0sf	cml28kupv000c4sq4ie08laju	1	1	cml27qnzi001djutzaerrkags	2024-11-24 13:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.545	2026-01-31 11:36:21.545
cml28kuui00e74sq4ecle5ptg	cml28kuq6000s4sq435go25ax	cml28kuq3000p4sq4lyailgfi	0	0	cml27qnzi001djutzaerrkags	2024-11-24 16:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.546	2026-01-31 11:36:21.546
cml28kuuj00eb4sq4jvekyo0s	cml28kuph00014sq44rnnx4ex	cml28kupy000g4sq49ipxycuy	1	0	cml27qnzi001djutzaerrkags	2024-11-30 11:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.547	2026-01-31 11:36:21.547
cml28kuuk00ef4sq4um0dhq45	cml28kups00094sq4m4dvklum	cml28kuq6000t4sq4sdr8nlgd	2	2	cml27qnzi001djutzaerrkags	2024-11-30 13:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.548	2026-01-31 11:36:21.548
cml28kuuk00ej4sq46fgl0njz	cml28kups00084sq4jo3thxdt	cml28kuq6000s4sq435go25ax	4	0	cml27qnzi001djutzaerrkags	2024-11-30 16:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.549	2026-01-31 11:36:21.549
cml28kuul00en4sq4srjsgysr	cml28kupd00004sq43ox6f90y	cml28kuq2000o4sq4bu9tjjpu	1	3	cml27qnzi001djutzaerrkags	2024-12-01 11:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.55	2026-01-31 11:36:21.55
cml28kuum00er4sq4cfst5aza	cml28kupp00054sq4jg1hhxmh	cml28kupo00044sq42b51grvb	2	3	cml27qnzi001djutzaerrkags	2024-12-01 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.551	2026-01-31 11:36:21.551
cml28kuun00ev4sq4mwn7i57t	cml28kuq3000p4sq4lyailgfi	cml28kupw000d4sq41fvfy0sf	0	0	cml27qnzi001djutzaerrkags	2024-12-01 16:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.552	2026-01-31 11:36:21.552
cml28kuuo00ez4sq415gcg9o2	cml28kuq0000l4sq447ihy0qy	cml28kupy000h4sq4s4frt8xj	0	3	cml27qnzi001djutzaerrkags	2024-12-01 16:30:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.553	2026-01-31 11:36:21.553
cml28kuup00f34sq4levgxyk4	cml28kuq0000k4sq42641xa14	cml28kupv000c4sq4ie08laju	1	1	cml27qnzi001djutzaerrkags	2024-12-02 16:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.554	2026-01-31 11:36:21.554
cml28kuuq00f74sq44jm8mzx1	cml28kupy000h4sq4s4frt8xj	cml28kuq6000s4sq435go25ax	3	0	cml27qnzi001djutzaerrkags	2024-12-07 11:00:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.554	2026-01-31 11:36:21.554
cml28kuur00fb4sq4u8pvp9so	cml28kupp00054sq4jg1hhxmh	cml28kuph00014sq44rnnx4ex	1	2	cml27qnzi001djutzaerrkags	2024-12-07 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.555	2026-01-31 11:36:21.555
cml28kuus00ff4sq42gqdk3qh	cml28kups00084sq4jo3thxdt	cml28kupo00044sq42b51grvb	3	1	cml27qnzi001djutzaerrkags	2024-12-07 13:30:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.556	2026-01-31 11:36:21.556
cml28kuut00fj4sq4fr9sc6gg	cml28kuq3000p4sq4lyailgfi	cml28kuq6000t4sq4sdr8nlgd	2	3	cml27qnzi001djutzaerrkags	2024-12-07 16:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.557	2026-01-31 11:36:21.557
cml28kuuu00fn4sq4dmm9nsc5	cml28kupv000c4sq4ie08laju	cml28kuq2000o4sq4bu9tjjpu	4	1	cml27qnzi001djutzaerrkags	2024-12-08 11:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.558	2026-01-31 11:36:21.558
cml28kuuu00fr4sq4276swe1x	cml28kupw000d4sq41fvfy0sf	cml28kups00094sq4m4dvklum	0	1	cml27qnzi001djutzaerrkags	2024-12-08 13:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.559	2026-01-31 11:36:21.559
cml28kuuv00fv4sq47o4qlzyn	cml28kuq0000k4sq42641xa14	cml28kupy000g4sq49ipxycuy	1	0	cml27qnzi001djutzaerrkags	2024-12-08 16:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.56	2026-01-31 11:36:21.56
cml28kuuw00fz4sq4gdo9ryja	cml28kuq0000l4sq447ihy0qy	cml28kupd00004sq43ox6f90y	0	0	cml27qnzi001djutzaerrkags	2024-12-08 16:30:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.561	2026-01-31 11:36:21.561
cml28kuux00g34sq4yarfmpfk	cml28kuq3000p4sq4lyailgfi	cml28kupd00004sq43ox6f90y	1	1	cml27qnzi001djutzaerrkags	2025-02-28 16:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.562	2026-01-31 11:36:21.562
cml28kuuz00g74sq4qivanfpt	cml28kuq6000s4sq435go25ax	cml28kuph00014sq44rnnx4ex	2	1	cml27qnzi001djutzaerrkags	2025-03-01 11:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.563	2026-01-31 11:36:21.563
cml28kuuz00gb4sq4e1d8bjn6	cml28kupp00054sq4jg1hhxmh	cml28kups00094sq4m4dvklum	0	0	cml27qnzi001djutzaerrkags	2025-03-01 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.564	2026-01-31 11:36:21.564
cml28kuv000gf4sq4ulod6jgw	cml28kuq0000k4sq42641xa14	cml28kuq6000t4sq4sdr8nlgd	2	1	cml27qnzi001djutzaerrkags	2025-03-01 16:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.565	2026-01-31 11:36:21.565
cml28kuv100gj4sq48zbq32bl	cml28kuq0000l4sq447ihy0qy	cml28kupo00044sq42b51grvb	1	1	cml27qnzi001djutzaerrkags	2025-03-01 16:30:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.566	2026-01-31 11:36:21.566
cml28kuv200gn4sq40bgxqxmp	cml28kuq2000o4sq4bu9tjjpu	cml28kupw000d4sq41fvfy0sf	1	0	cml27qnzi001djutzaerrkags	2025-03-02 11:00:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.567	2026-01-31 11:36:21.567
cml28kuv300gr4sq4yv2fhfpv	cml28kupy000h4sq4s4frt8xj	cml28kupy000g4sq49ipxycuy	2	0	cml27qnzi001djutzaerrkags	2025-03-02 13:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.567	2026-01-31 11:36:21.567
cml28kuv400gv4sq43t0r0uon	cml28kups00084sq4jo3thxdt	cml28kupv000c4sq4ie08laju	1	1	cml27qnzi001djutzaerrkags	2025-03-02 16:30:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.568	2026-01-31 11:36:21.568
cml28kuv500gz4sq4h7ihkrf2	cml28kuq6000s4sq435go25ax	cml28kuq0000l4sq447ihy0qy	0	3	cml27qnzi001djutzaerrkags	2025-03-07 15:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.569	2026-01-31 11:36:21.569
cml28kuv600h34sq4jk3t6w4a	cml28kupd00004sq43ox6f90y	cml28kuq0000k4sq42641xa14	1	1	cml27qnzi001djutzaerrkags	2025-03-07 17:15:00	FINISHED	RZD Arena	2026-01-31 11:36:21.57	2026-01-31 11:36:21.57
cml28kuv600h74sq4yhhp5uuu	cml28kupy000g4sq49ipxycuy	cml28kups00084sq4jo3thxdt	1	2	cml27qnzi001djutzaerrkags	2025-03-08 09:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.571	2026-01-31 11:36:21.571
cml28kuv700hb4sq401lwm791	cml28kupw000d4sq41fvfy0sf	cml28kupp00054sq4jg1hhxmh	0	2	cml27qnzi001djutzaerrkags	2025-03-08 11:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.572	2026-01-31 11:36:21.572
cml28kuv800hf4sq4qyhkjouy	cml28kups00094sq4m4dvklum	cml28kuq2000o4sq4bu9tjjpu	1	0	cml27qnzi001djutzaerrkags	2025-03-08 14:00:00	FINISHED	VEB Arena	2026-01-31 11:36:21.573	2026-01-31 11:36:21.573
cml28kuv900hj4sq42igo588h	cml28kupv000c4sq4ie08laju	cml28kuq3000p4sq4lyailgfi	4	0	cml27qnzi001djutzaerrkags	2025-03-08 16:30:00	FINISHED	VTB Arena	2026-01-31 11:36:21.574	2026-01-31 11:36:21.574
cml28kuva00hn4sq4qojfltoj	cml28kupo00044sq42b51grvb	cml28kuph00014sq44rnnx4ex	0	2	cml27qnzi001djutzaerrkags	2025-03-09 13:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.574	2026-01-31 11:36:21.574
cml28kuvb00hr4sq44ld81wzx	cml28kuq6000t4sq4sdr8nlgd	cml28kupy000h4sq4s4frt8xj	2	1	cml27qnzi001djutzaerrkags	2025-03-09 16:30:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.575	2026-01-31 11:36:21.575
cml28kuvc00hv4sq4q2p9nv05	cml28kupy000g4sq49ipxycuy	cml28kupw000d4sq41fvfy0sf	1	0	cml27qnzi001djutzaerrkags	2025-03-15 09:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.576	2026-01-31 11:36:21.576
cml28kuvd00hz4sq483upvyl4	cml28kuq2000o4sq4bu9tjjpu	cml28kuq0000k4sq42641xa14	1	1	cml27qnzi001djutzaerrkags	2025-03-15 11:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.577	2026-01-31 11:36:21.577
cml28kuve00i34sq4x8wjvg3m	cml28kuq3000p4sq4lyailgfi	cml28kupo00044sq42b51grvb	4	0	cml27qnzi001djutzaerrkags	2025-03-15 14:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.578	2026-01-31 11:36:21.578
cml28kuve00i74sq4gllc70g6	cml28kupd00004sq43ox6f90y	cml28kupv000c4sq4ie08laju	2	1	cml27qnzi001djutzaerrkags	2025-03-15 16:30:00	FINISHED	RZD Arena	2026-01-31 11:36:21.579	2026-01-31 11:36:21.579
cml28kuvf00ib4sq40lupuaq5	cml28kuph00014sq44rnnx4ex	cml28kups00094sq4m4dvklum	1	2	cml27qnzi001djutzaerrkags	2025-03-16 10:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.58	2026-01-31 11:36:21.58
cml28kuvg00if4sq4g7rp6gkq	cml28kuq6000t4sq4sdr8nlgd	cml28kuq6000s4sq435go25ax	1	0	cml27qnzi001djutzaerrkags	2025-03-16 12:15:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.581	2026-01-31 11:36:21.581
cml28kuvh00ij4sq47m6um0jj	cml28kups00084sq4jo3thxdt	cml28kuq0000l4sq447ihy0qy	0	1	cml27qnzi001djutzaerrkags	2025-03-16 14:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.582	2026-01-31 11:36:21.582
cml28kuvi00in4sq4dcxuuyvj	cml28kupy000h4sq4s4frt8xj	cml28kupp00054sq4jg1hhxmh	2	1	cml27qnzi001djutzaerrkags	2025-03-16 16:45:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.582	2026-01-31 11:36:21.582
cml28kuvj00ir4sq4biku0wkj	cml28kupo00044sq42b51grvb	cml28kupd00004sq43ox6f90y	5	1	cml27qnzi001djutzaerrkags	2025-03-28 15:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.583	2026-01-31 11:36:21.583
cml28kuvk00iv4sq4kl7cdgb9	cml28kupv000c4sq4ie08laju	cml28kupy000g4sq49ipxycuy	5	1	cml27qnzi001djutzaerrkags	2025-03-29 11:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.584	2026-01-31 11:36:21.584
cml28kuvl00iz4sq4tfjmm4ro	cml28kuq2000o4sq4bu9tjjpu	cml28kuq6000s4sq435go25ax	2	0	cml27qnzi001djutzaerrkags	2025-03-29 13:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.585	2026-01-31 11:36:21.585
cml28kuvl00j34sq4ud5ixf1y	cml28kups00094sq4m4dvklum	cml28kuq3000p4sq4lyailgfi	2	0	cml27qnzi001djutzaerrkags	2025-03-29 16:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.586	2026-01-31 11:36:21.586
cml28kuvm00j74sq4hncwpxvz	cml28kuq0000l4sq447ihy0qy	cml28kupw000d4sq41fvfy0sf	5	0	cml27qnzi001djutzaerrkags	2025-03-30 11:00:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.587	2026-01-31 11:36:21.587
cml28kuvn00jb4sq488qb7sc9	cml28kuq0000k4sq42641xa14	cml28kupy000h4sq4s4frt8xj	0	0	cml27qnzi001djutzaerrkags	2025-03-30 13:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.588	2026-01-31 11:36:21.588
cml28kuvo00jf4sq4shj1c0vl	cml28kupp00054sq4jg1hhxmh	cml28kuq6000t4sq4sdr8nlgd	4	0	cml27qnzi001djutzaerrkags	2025-03-30 16:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.589	2026-01-31 11:36:21.589
cml28kuvp00jj4sq4qtx6kjha	cml28kuph00014sq44rnnx4ex	cml28kups00084sq4jo3thxdt	2	3	cml27qnzi001djutzaerrkags	2025-03-31 15:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.589	2026-01-31 11:36:21.589
cml28kuvq00jn4sq4diw83hqp	cml28kuq6000s4sq435go25ax	cml28kupy000g4sq49ipxycuy	1	2	cml27qnzi001djutzaerrkags	2025-04-04 16:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.59	2026-01-31 11:36:21.59
cml28kuvr00jr4sq4yqroaucr	cml28kupo00044sq42b51grvb	cml28kuq6000t4sq4sdr8nlgd	1	1	cml27qnzi001djutzaerrkags	2025-04-05 10:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.591	2026-01-31 11:36:21.591
cml28kuvs00jv4sq4edyvcf80	cml28kupw000d4sq41fvfy0sf	cml28kuq0000k4sq42641xa14	0	0	cml27qnzi001djutzaerrkags	2025-04-05 12:15:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.592	2026-01-31 11:36:21.592
cml28kuvt00jz4sq4omjdbbrd	cml28kupd00004sq43ox6f90y	cml28kupp00054sq4jg1hhxmh	1	1	cml27qnzi001djutzaerrkags	2025-04-05 14:30:00	FINISHED	RZD Arena	2026-01-31 11:36:21.593	2026-01-31 11:36:21.593
cml28kuvt00k34sq447c3o8mz	cml28kuq0000l4sq447ihy0qy	cml28kuph00014sq44rnnx4ex	1	0	cml27qnzi001djutzaerrkags	2025-04-05 16:45:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.594	2026-01-31 11:36:21.594
cml28kuvu00k74sq4dpba4zuq	cml28kuq3000p4sq4lyailgfi	cml28kuq2000o4sq4bu9tjjpu	4	1	cml27qnzi001djutzaerrkags	2025-04-06 11:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.595	2026-01-31 11:36:21.595
cml28kuvv00kb4sq4nym08obs	cml28kups00084sq4jo3thxdt	cml28kupy000h4sq4s4frt8xj	0	3	cml27qnzi001djutzaerrkags	2025-04-06 13:30:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.596	2026-01-31 11:36:21.596
cml28kuvw00kf4sq4epxj27g8	cml28kups00094sq4m4dvklum	cml28kupv000c4sq4ie08laju	3	1	cml27qnzi001djutzaerrkags	2025-04-06 16:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.597	2026-01-31 11:36:21.597
cml28kuvx00kj4sq4zbic1l9r	cml28kupy000h4sq4s4frt8xj	cml28kuq3000p4sq4lyailgfi	1	2	cml27qnzi001djutzaerrkags	2025-04-11 16:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.598	2026-01-31 11:36:21.598
cml28kuvy00kn4sq4pbw624p4	cml28kupy000g4sq49ipxycuy	cml28kups00094sq4m4dvklum	0	2	cml27qnzi001djutzaerrkags	2025-04-12 09:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.599	2026-01-31 11:36:21.599
cml28kuvz00kr4sq4jwbd3439	cml28kuq6000s4sq435go25ax	cml28kupv000c4sq4ie08laju	1	1	cml27qnzi001djutzaerrkags	2025-04-12 11:30:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.599	2026-01-31 11:36:21.599
cml28kuw000kv4sq4tvkr95j2	cml28kuq6000t4sq4sdr8nlgd	cml28kupd00004sq43ox6f90y	1	0	cml27qnzi001djutzaerrkags	2025-04-12 14:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.601	2026-01-31 11:36:21.601
cml28kuw100kz4sq4r3r0jt6f	cml28kuq0000k4sq42641xa14	cml28kups00084sq4jo3thxdt	2	1	cml27qnzi001djutzaerrkags	2025-04-12 16:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.602	2026-01-31 11:36:21.602
cml28kuw200l34sq4spbaybe3	cml28kuph00014sq44rnnx4ex	cml28kupw000d4sq41fvfy0sf	1	0	cml27qnzi001djutzaerrkags	2025-04-13 11:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.602	2026-01-31 11:36:21.602
cml28kuw300l74sq4c53byy2k	cml28kupp00054sq4jg1hhxmh	cml28kuq0000l4sq447ihy0qy	4	1	cml27qnzi001djutzaerrkags	2025-04-13 14:00:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.603	2026-01-31 11:36:21.603
cml28kuw400lb4sq4ofza3csf	cml28kuq2000o4sq4bu9tjjpu	cml28kupo00044sq42b51grvb	1	3	cml27qnzi001djutzaerrkags	2025-04-13 16:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.604	2026-01-31 11:36:21.604
cml28kuw500lf4sq4viigbcrc	cml28kupy000g4sq49ipxycuy	cml28kuq3000p4sq4lyailgfi	2	1	cml27qnzi001djutzaerrkags	2025-04-19 09:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.605	2026-01-31 11:36:21.605
cml28kuw500lj4sq4ej85dlu7	cml28kuph00014sq44rnnx4ex	cml28kupy000h4sq4s4frt8xj	2	3	cml27qnzi001djutzaerrkags	2025-04-19 11:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.606	2026-01-31 11:36:21.606
cml28kuw600ln4sq4lg9pm0sy	cml28kupd00004sq43ox6f90y	cml28kuq6000s4sq435go25ax	3	0	cml27qnzi001djutzaerrkags	2025-04-19 14:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.607	2026-01-31 11:36:21.607
cml28kuw700lr4sq4me3jjs5u	cml28kuq0000l4sq447ihy0qy	cml28kuq0000k4sq42641xa14	3	1	cml27qnzi001djutzaerrkags	2025-04-19 16:30:00	FINISHED	Stadion FK Krasnodar	2026-01-31 11:36:21.608	2026-01-31 11:36:21.608
cml28kuw800lv4sq4p3aebbnz	cml28kupv000c4sq4ie08laju	cml28kuq6000t4sq4sdr8nlgd	3	1	cml27qnzi001djutzaerrkags	2025-04-20 11:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.609	2026-01-31 11:36:21.609
cml28kuw900lz4sq4jva5vpqq	cml28kupw000d4sq41fvfy0sf	cml28kups00084sq4jo3thxdt	0	2	cml27qnzi001djutzaerrkags	2025-04-20 11:00:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.61	2026-01-31 11:36:21.61
cml28kuwa00m34sq4yx0wy56c	cml28kupp00054sq4jg1hhxmh	cml28kuq2000o4sq4bu9tjjpu	1	0	cml27qnzi001djutzaerrkags	2025-04-20 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.61	2026-01-31 11:36:21.61
cml28kuwb00m74sq4rnjmm4qa	cml28kups00094sq4m4dvklum	cml28kupo00044sq42b51grvb	1	1	cml27qnzi001djutzaerrkags	2025-04-20 16:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.611	2026-01-31 11:36:21.611
cml28kuwc00mb4sq4y9h4zamr	cml28kuq3000p4sq4lyailgfi	cml28kuq0000l4sq447ihy0qy	2	3	cml27qnzi001djutzaerrkags	2025-04-25 16:30:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.612	2026-01-31 11:36:21.612
cml28kuwd00mf4sq4w97spgmo	cml28kupv000c4sq4ie08laju	cml28kupp00054sq4jg1hhxmh	1	1	cml27qnzi001djutzaerrkags	2025-04-26 11:00:00	FINISHED	VTB Arena	2026-01-31 11:36:21.613	2026-01-31 11:36:21.613
cml28kuwe00mj4sq4kjb3y5d8	cml28kuq6000s4sq435go25ax	cml28kuq0000k4sq42641xa14	1	0	cml27qnzi001djutzaerrkags	2025-04-26 11:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.614	2026-01-31 11:36:21.614
cml28kuwf00mn4sq4w7fpefiz	cml28kups00084sq4jo3thxdt	cml28kupd00004sq43ox6f90y	1	1	cml27qnzi001djutzaerrkags	2025-04-26 13:30:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.615	2026-01-31 11:36:21.615
cml28kuwf00mr4sq48wkrpegz	cml28kupy000h4sq4s4frt8xj	cml28kups00094sq4m4dvklum	1	2	cml27qnzi001djutzaerrkags	2025-04-26 16:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.616	2026-01-31 11:36:21.616
cml28kuwg00mv4sq42omssl6u	cml28kupo00044sq42b51grvb	cml28kupy000g4sq49ipxycuy	2	0	cml27qnzi001djutzaerrkags	2025-04-27 11:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.617	2026-01-31 11:36:21.617
cml28kuwh00mz4sq4kjhad6bj	cml28kuq2000o4sq4bu9tjjpu	cml28kuph00014sq44rnnx4ex	2	2	cml27qnzi001djutzaerrkags	2025-04-27 13:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.618	2026-01-31 11:36:21.618
cml28kuwi00n34sq46vcki8l0	cml28kuq6000t4sq4sdr8nlgd	cml28kupw000d4sq41fvfy0sf	2	1	cml27qnzi001djutzaerrkags	2025-04-27 16:00:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.619	2026-01-31 11:36:21.619
cml28kuwj00n74sq4534k8cth	cml28kuph00014sq44rnnx4ex	cml28kuq3000p4sq4lyailgfi	1	0	cml27qnzi001djutzaerrkags	2025-05-02 15:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.62	2026-01-31 11:36:21.62
cml28kuwk00nb4sq4j0zr7cxf	cml28kupd00004sq43ox6f90y	cml28kupy000g4sq49ipxycuy	1	1	cml27qnzi001djutzaerrkags	2025-05-03 14:00:00	FINISHED	RZD Arena	2026-01-31 11:36:21.62	2026-01-31 11:36:21.62
cml28kuwl00nf4sq47orrrrn2	cml28kuq0000l4sq447ihy0qy	cml28kuq6000t4sq4sdr8nlgd	2	1	cml27qnzi001djutzaerrkags	2025-05-03 16:30:00	FINISHED	Ozon Arena	2026-01-31 11:36:21.621	2026-01-31 11:36:21.621
cml28kuwm00nj4sq4yx9h0hlo	cml28kupw000d4sq41fvfy0sf	cml28kupy000h4sq4s4frt8xj	0	0	cml27qnzi001djutzaerrkags	2025-05-04 11:00:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.622	2026-01-31 11:36:21.622
cml28kuwn00nn4sq4000iug49	cml28kuq0000k4sq42641xa14	cml28kups00094sq4m4dvklum	1	1	cml27qnzi001djutzaerrkags	2025-05-04 13:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.623	2026-01-31 11:36:21.623
cml28kuwn00nr4sq4ed14zkgy	cml28kupp00054sq4jg1hhxmh	cml28kuq6000s4sq435go25ax	2	1	cml27qnzi001djutzaerrkags	2025-05-04 16:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.624	2026-01-31 11:36:21.624
cml28kuwo00nv4sq451zdwgmz	cml28kuq2000o4sq4bu9tjjpu	cml28kups00084sq4jo3thxdt	1	1	cml27qnzi001djutzaerrkags	2025-05-04 16:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.625	2026-01-31 11:36:21.625
cml28kuwp00nz4sq4s7fp3i4i	cml28kupo00044sq42b51grvb	cml28kupv000c4sq4ie08laju	1	3	cml27qnzi001djutzaerrkags	2025-05-05 15:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.626	2026-01-31 11:36:21.626
cml28kuwq00o34sq436m7rjbx	cml28kupy000g4sq49ipxycuy	cml28kuq2000o4sq4bu9tjjpu	1	1	cml27qnzi001djutzaerrkags	2025-05-10 11:30:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.627	2026-01-31 11:36:21.627
cml28kuwr00o74sq4fkjr1cl1	cml28kuq3000p4sq4lyailgfi	cml28kupp00054sq4jg1hhxmh	0	1	cml27qnzi001djutzaerrkags	2025-05-10 14:00:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.628	2026-01-31 11:36:21.628
cml28kuws00ob4sq4us2asxa5	cml28kups00094sq4m4dvklum	cml28kuq0000l4sq447ihy0qy	1	0	cml27qnzi001djutzaerrkags	2025-05-10 16:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.628	2026-01-31 11:36:21.628
cml28kuwt00of4sq4zplfsi0g	cml28kuph00014sq44rnnx4ex	cml28kuq0000k4sq42641xa14	3	2	cml27qnzi001djutzaerrkags	2025-05-11 11:00:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.629	2026-01-31 11:36:21.629
cml28kuwu00oj4sq4kjro0yox	cml28kupw000d4sq41fvfy0sf	cml28kupd00004sq43ox6f90y	0	1	cml27qnzi001djutzaerrkags	2025-05-11 13:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.63	2026-01-31 11:36:21.63
cml28kuwv00on4sq40qqsfmvf	cml28kuq6000t4sq4sdr8nlgd	cml28kups00084sq4jo3thxdt	1	0	cml27qnzi001djutzaerrkags	2025-05-11 16:30:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.631	2026-01-31 11:36:21.631
cml28kuww00or4sq475eum6ye	cml28kupv000c4sq4ie08laju	cml28kupy000h4sq4s4frt8xj	2	0	cml27qnzi001djutzaerrkags	2025-05-11 16:30:00	FINISHED	VTB Arena	2026-01-31 11:36:21.632	2026-01-31 11:36:21.632
cml28kuww00ov4sq43jet6q2c	cml28kuq6000s4sq435go25ax	cml28kupo00044sq42b51grvb	5	2	cml27qnzi001djutzaerrkags	2025-05-12 16:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.633	2026-01-31 11:36:21.633
cml28kuwx00oz4sq4an1ijggh	cml28kupy000g4sq49ipxycuy	cml28kuq0000l4sq447ihy0qy	1	2	cml27qnzi001djutzaerrkags	2025-05-17 11:00:00	FINISHED	Stadion Gazovik	2026-01-31 11:36:21.634	2026-01-31 11:36:21.634
cml28kuwy00p34sq4527mfcz5	cml28kuq2000o4sq4bu9tjjpu	cml28kuq6000t4sq4sdr8nlgd	3	2	cml27qnzi001djutzaerrkags	2025-05-17 13:30:00	FINISHED	Arena Khimki	2026-01-31 11:36:21.635	2026-01-31 11:36:21.635
cml28kuwz00p74sq434vm5sd7	cml28kuq6000s4sq435go25ax	cml28kupw000d4sq41fvfy0sf	1	1	cml27qnzi001djutzaerrkags	2025-05-17 16:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.636	2026-01-31 11:36:21.636
cml28kux000pb4sq4di8zjjxb	cml28kupo00044sq42b51grvb	cml28kupy000h4sq4s4frt8xj	0	2	cml27qnzi001djutzaerrkags	2025-05-18 10:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.637	2026-01-31 11:36:21.637
cml28kux100pf4sq4mt6j8aqs	cml28kuq0000k4sq42641xa14	cml28kuq3000p4sq4lyailgfi	1	1	cml27qnzi001djutzaerrkags	2025-05-18 11:00:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.637	2026-01-31 11:36:21.637
cml28kux200pj4sq4saaash78	cml28kupv000c4sq4ie08laju	cml28kuph00014sq44rnnx4ex	2	1	cml27qnzi001djutzaerrkags	2025-05-18 13:30:00	FINISHED	VTB Arena	2026-01-31 11:36:21.638	2026-01-31 11:36:21.638
cml28kux300pn4sq432qck3ts	cml28kups00084sq4jo3thxdt	cml28kupp00054sq4jg1hhxmh	0	1	cml27qnzi001djutzaerrkags	2025-05-18 16:00:00	FINISHED	Rostov Arena	2026-01-31 11:36:21.639	2026-01-31 11:36:21.639
cml28kux400pr4sq4miajnt2a	cml28kupd00004sq43ox6f90y	cml28kups00094sq4m4dvklum	2	2	cml27qnzi001djutzaerrkags	2025-05-19 17:30:00	FINISHED	RZD Arena	2026-01-31 11:36:21.64	2026-01-31 11:36:21.64
cml28kux500pv4sq4fzofbpc1	cml28kups00094sq4m4dvklum	cml28kuq6000s4sq435go25ax	2	0	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	VEB Arena	2026-01-31 11:36:21.641	2026-01-31 11:36:21.641
cml28kux500pz4sq4marr9jg5	cml28kupy000h4sq4s4frt8xj	cml28kuq2000o4sq4bu9tjjpu	5	0	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Lukoil Arena	2026-01-31 11:36:21.642	2026-01-31 11:36:21.642
cml28kux600q34sq4izz7m7c4	cml28kupp00054sq4jg1hhxmh	cml28kuq0000k4sq42641xa14	3	0	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Gazprom Arena	2026-01-31 11:36:21.643	2026-01-31 11:36:21.643
cml28kux700q74sq4hhweugti	cml28kuq0000l4sq447ihy0qy	cml28kupv000c4sq4ie08laju	3	0	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Ozon Arena	2026-01-31 11:36:21.644	2026-01-31 11:36:21.644
cml28kux800qb4sq4qk0e8pys	cml28kuq6000t4sq4sdr8nlgd	cml28kupy000g4sq49ipxycuy	4	2	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Ak Bars Arena	2026-01-31 11:36:21.644	2026-01-31 11:36:21.644
cml28kux900qf4sq4nr9tywyr	cml28kupw000d4sq41fvfy0sf	cml28kupo00044sq42b51grvb	1	1	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Stadion Fakel	2026-01-31 11:36:21.645	2026-01-31 11:36:21.645
cml28kuxa00qj4sq4j7w3w12r	cml28kuph00014sq44rnnx4ex	cml28kupd00004sq43ox6f90y	1	4	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Solidarnost Samara Arena	2026-01-31 11:36:21.646	2026-01-31 11:36:21.646
cml28kuxb00qn4sq4idb233yr	cml28kuq3000p4sq4lyailgfi	cml28kups00084sq4jo3thxdt	1	1	cml27qnzi001djutzaerrkags	2025-05-24 13:30:00	FINISHED	Anzhi Arena	2026-01-31 11:36:21.647	2026-01-31 11:36:21.647
cml28kuxc00qr4sq485f4o65m	cml28kc9e00088o0uw1g06dvm	cml28kuq0000k4sq42641xa14	2	1	cml27qnzi001djutzaerrkags	2025-05-28 14:00:00	FINISHED	Ekaterinburg Arena	2026-01-31 11:36:21.648	2026-01-31 11:36:21.648
cml28kuxc00qv4sq40bj2ixuv	cml28kc9f00098o0u4mo2okiw	cml28kuq6000s4sq435go25ax	1	2	cml27qnzi001djutzaerrkags	2025-05-28 16:30:00	FINISHED	Olimpiyskiy Stadion Fisht	2026-01-31 11:36:21.649	2026-01-31 11:36:21.649
cml28kuxd00qz4sq41f6d7ze6	cml28kuq6000s4sq435go25ax	cml28kc9f00098o0u4mo2okiw	1	3	cml27qnzi001djutzaerrkags	2025-05-31 14:00:00	FINISHED	Stadion Nizhny Novgorod	2026-01-31 11:36:21.65	2026-01-31 11:36:21.65
cml28kuxe00r34sq4p0q74vmk	cml28kuq0000k4sq42641xa14	cml28kc9e00088o0uw1g06dvm	2	0	cml27qnzi001djutzaerrkags	2025-05-31 16:30:00	FINISHED	Akhmat Arena	2026-01-31 11:36:21.651	2026-01-31 11:36:21.651
cml28kvjk00sj4sq4kzpne2bm	cml28kvjg00sg4sq4mdkvtsn5	cml28kvji00sh4sq4z84xat7b	3	0	cml27qnzj001jjutzcib47vfb	2024-07-11 17:00:00	FINISHED	Borås Arena	2026-01-31 11:36:22.448	2026-01-31 11:36:22.448
cml28kvjm00sn4sq4gojmfin0	cml28kvjk00sk4sq40hdi3ism	cml28kvjl00sl4sq472mij1iu	0	1	cml27qnzj001jjutzcib47vfb	2024-07-11 17:00:00	FINISHED	Bolshaya Sportivnaya Arena	2026-01-31 11:36:22.451	2026-01-31 11:36:22.451
cml28kvjr00sr4sq4utcfzbzt	cml28kvjn00so4sq4v1yhiwx2	cml28kvjp00sp4sq43isapz76	0	4	cml27qnzj001jjutzcib47vfb	2024-07-11 17:00:00	FINISHED	Paksi FC Stadion	2026-01-31 11:36:22.455	2026-01-31 11:36:22.455
cml28kvju00sv4sq4lp5t19kx	cml28kvjs00ss4sq46iya95yy	cml28kvjt00st4sq482qzc0i7	5	2	cml27qnzj001jjutzcib47vfb	2024-07-11 17:00:00	FINISHED	Futbalový štadión MFK Ružomberok	2026-01-31 11:36:22.458	2026-01-31 11:36:22.458
cml28kvjw00sz4sq4zg2yjgmk	cml28kvju00sw4sq4salzrdkz	cml28kvjv00sx4sq4ijjqh8p1	2	1	cml27qnzj001jjutzcib47vfb	2024-07-11 18:00:00	FINISHED	Stadion Hristo Botev	2026-01-31 11:36:22.46	2026-01-31 11:36:22.46
cml28kvjy00t34sq41bld5ajk	cml28kvjx00t04sq4w3i6sn7n	cml28kvjx00t14sq4hzbsv8mb	2	0	cml27qnzj001jjutzcib47vfb	2024-07-11 18:30:00	FINISHED	Stadion Miejski im. Henryka Reymana	2026-01-31 11:36:22.463	2026-01-31 11:36:22.463
cml28kvk000t74sq495rydyqm	cml28kvjx00t14sq4hzbsv8mb	cml28kvjx00t04sq4w3i6sn7n	1	2	cml27qnzj001jjutzcib47vfb	2024-07-18 14:30:00	FINISHED	Stadiumi Zahir Pajaziti	2026-01-31 11:36:22.465	2026-01-31 11:36:22.465
cml28kvk200tb4sq4din6tniq	cml28kvjt00st4sq482qzc0i7	cml28kvjs00ss4sq46iya95yy	1	0	cml27qnzj001jjutzcib47vfb	2024-07-18 15:00:00	FINISHED	Ortalyq stadıon	2026-01-31 11:36:22.467	2026-01-31 11:36:22.467
cml28kvk500tf4sq4kcjzu1c0	cml28kvjl00sl4sq472mij1iu	cml28kvjk00sk4sq40hdi3ism	1	2	cml27qnzj001jjutzcib47vfb	2024-07-18 16:00:00	SCHEDULED	Liv Bona Dea Arena	2026-01-31 11:36:22.469	2026-01-31 11:36:22.469
cml28kvk700tj4sq4q20oqhvt	cml28kvji00sh4sq4z84xat7b	cml28kvjg00sg4sq4mdkvtsn5	2	5	cml27qnzj001jjutzcib47vfb	2024-07-18 16:00:00	FINISHED	Alphamega Stadium	2026-01-31 11:36:22.471	2026-01-31 11:36:22.471
cml28kvk900tn4sq4uqv1ibsh	cml28kvjp00sp4sq43isapz76	cml28kvjn00so4sq4v1yhiwx2	0	2	cml27qnzj001jjutzcib47vfb	2024-07-18 18:00:00	FINISHED	Stadionul Municipal	2026-01-31 11:36:22.474	2026-01-31 11:36:22.474
cml28kvkb00tr4sq4uhdifoe0	cml28kvjv00sx4sq4ijjqh8p1	cml28kvju00sw4sq4salzrdkz	2	2	cml27qnzj001jjutzcib47vfb	2024-07-18 18:15:00	FINISHED	Ljudski vrt	2026-01-31 11:36:22.476	2026-01-31 11:36:22.476
cml28kvkd00tv4sq4myc43j34	cml28kvjx00t04sq4w3i6sn7n	cml28kvkc00tt4sq47ekpothm	1	2	cml27qnzj001jjutzcib47vfb	2024-07-25 16:00:00	FINISHED	Stadion Miejski im. Henryka Reymana	2026-01-31 11:36:22.478	2026-01-31 11:36:22.478
cml28kvkf00tz4sq4pmu4p6h0	cml28kvjs00ss4sq46iya95yy	cml28kvke00tx4sq4xipc8ijk	0	2	cml27qnzj001jjutzcib47vfb	2024-07-25 16:30:00	FINISHED	Futbalový štadión MFK Ružomberok	2026-01-31 11:36:22.48	2026-01-31 11:36:22.48
cml28kvkh00u34sq4hju85fur	cml28kvkg00u04sq4bknkqwnt	cml28kvkg00u14sq45u2nf6qg	3	1	cml27qnzj001jjutzcib47vfb	2024-07-25 17:00:00	FINISHED	Aker Stadion	2026-01-31 11:36:22.482	2026-01-31 11:36:22.482
cml28kvkj00u74sq4skr52yk5	cml28kvjk00sk4sq40hdi3ism	cml28kvjg00sg4sq4mdkvtsn5	0	1	cml27qnzj001jjutzcib47vfb	2024-07-25 17:00:00	FINISHED	Bolshaya Sportivnaya Arena	2026-01-31 11:36:22.484	2026-01-31 11:36:22.484
cml28kvkl00ub4sq4qlhqxkrw	cml28kvjp00sp4sq43isapz76	cml28kvkk00u94sq4x39metzf	0	0	cml27qnzj001jjutzcib47vfb	2024-07-25 17:00:00	FINISHED	Stadionul Municipal	2026-01-31 11:36:22.485	2026-01-31 11:36:22.485
cml28kvkn00uf4sq48f9tdzwc	cml28kvkl00uc4sq4oclaows8	cml28kvju00sw4sq4salzrdkz	2	1	cml27qnzj001jjutzcib47vfb	2024-07-25 18:00:00	FINISHED	Olympiako Stadio Spyros Louis	2026-01-31 11:36:22.487	2026-01-31 11:36:22.487
cml28kvkp00uj4sq41mxn3pkc	cml28kvkn00ug4sq476ilcapv	cml28kvko00uh4sq4adas7gxs	1	0	cml27qnzj001jjutzcib47vfb	2024-07-25 18:30:00	FINISHED	Johan Cruijff Arena	2026-01-31 11:36:22.489	2026-01-31 11:36:22.489
cml28kvkr00un4sq4zb5j5imy	cml28kvkp00uk4sq4q7iym9k9	cml28kvkq00ul4sq48mqqxtn4	1	1	cml27qnzj001jjutzcib47vfb	2024-07-25 18:30:00	FINISHED	The BBSP Stadium Rugby Park	2026-01-31 11:36:22.491	2026-01-31 11:36:22.491
cml28kvks00ur4sq4fdf1l1xj	cml28kvkr00uo4sq45xh8ygko	cml28kvkr00up4sq4gwsstqjk	2	0	cml27qnzj001jjutzcib47vfb	2024-07-25 19:30:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.493	2026-01-31 11:36:22.493
cml28kvku00uv4sq49z2kmxc5	cml28kvjg00sg4sq4mdkvtsn5	cml28kvjk00sk4sq40hdi3ism	2	0	cml27qnzj001jjutzcib47vfb	2024-08-01 17:00:00	FINISHED	Borås Arena	2026-01-31 11:36:22.494	2026-01-31 11:36:22.494
cml28kvkv00uz4sq43vws9o02	cml28kvkg00u14sq45u2nf6qg	cml28kvkg00u04sq4bknkqwnt	3	2	cml27qnzj001jjutzcib47vfb	2024-08-01 17:15:00	FINISHED	JYSK park	2026-01-31 11:36:22.496	2026-01-31 11:36:22.496
cml28kvkx00v34sq4rlr58qdg	cml28kvke00tx4sq4xipc8ijk	cml28kvjs00ss4sq46iya95yy	1	0	cml27qnzj001jjutzcib47vfb	2024-08-01 17:30:00	FINISHED	Papara Park	2026-01-31 11:36:22.497	2026-01-31 11:36:22.497
cml28kvky00v74sq4t25c7j33	cml28kvkr00up4sq4gwsstqjk	cml28kvkr00uo4sq45xh8ygko	0	5	cml27qnzj001jjutzcib47vfb	2024-08-01 17:30:00	FINISHED	Vivacom Arena - Georgi Asparuhov	2026-01-31 11:36:22.499	2026-01-31 11:36:22.499
cml28kvl000vb4sq4tzyr1qt3	cml28kvkk00u94sq4x39metzf	cml28kvjp00sp4sq43isapz76	1	0	cml27qnzj001jjutzcib47vfb	2024-08-01 18:00:00	FINISHED	Stadion HNK Rijeka	2026-01-31 11:36:22.5	2026-01-31 11:36:22.5
cml28kvl100vf4sq4b4dqvmqv	cml28kvju00sw4sq4salzrdkz	cml28kvkl00uc4sq4oclaows8	0	4	cml27qnzj001jjutzcib47vfb	2024-08-01 18:00:00	FINISHED	Stadion Hristo Botev	2026-01-31 11:36:22.502	2026-01-31 11:36:22.502
cml28kvl200vj4sq4aq0kvgb7	cml28kvko00uh4sq4adas7gxs	cml28kvkn00ug4sq476ilcapv	1	3	cml27qnzj001jjutzcib47vfb	2024-08-01 18:00:00	FINISHED	TSC Arena	2026-01-31 11:36:22.503	2026-01-31 11:36:22.503
cml28kvl400vn4sq40rbvi4yc	cml28kvkq00ul4sq48mqqxtn4	cml28kvkp00uk4sq4q7iym9k9	1	0	cml27qnzj001jjutzcib47vfb	2024-08-01 18:00:00	FINISHED	Jan Breydelstadion	2026-01-31 11:36:22.504	2026-01-31 11:36:22.504
cml28kvl500vr4sq4r9kquq0t	cml28kvkc00tt4sq47ekpothm	cml28kvjx00t04sq4w3i6sn7n	6	1	cml27qnzj001jjutzcib47vfb	2024-08-01 18:30:00	FINISHED	Allianz Stadion	2026-01-31 11:36:22.506	2026-01-31 11:36:22.506
cml28kvl700vv4sq4psp9c5tw	cml28kvl600vs4sq4etq5pesl	cml28kvl600vt4sq4szxbdlhn	1	2	cml27qnzj001jjutzcib47vfb	2024-08-06 16:30:00	FINISHED	Vilniaus LFF stadionas	2026-01-31 11:36:22.507	2026-01-31 11:36:22.507
cml28kvl800vz4sq4biz0d157	cml28kvl700vw4sq4ednt5wo7	cml28kvl700vx4sq4vm5zfcx8	1	0	cml27qnzj001jjutzcib47vfb	2024-08-06 17:00:00	FINISHED	Stadionul Zimbru	2026-01-31 11:36:22.508	2026-01-31 11:36:22.508
cml28kvl900w34sq4wnpxx0dz	cml28kvkg00u04sq4bknkqwnt	cml28kvkq00ul4sq48mqqxtn4	3	0	cml27qnzj001jjutzcib47vfb	2024-08-08 17:00:00	FINISHED	Aker Stadion	2026-01-31 11:36:22.51	2026-01-31 11:36:22.51
cml28kvla00w74sq4gai4c4uc	cml28kvl900w44sq4rigc4bqo	cml28kvla00w54sq49e8jrie2	2	1	cml27qnzj001jjutzcib47vfb	2024-08-08 17:00:00	FINISHED	Tórsvøllur	2026-01-31 11:36:22.511	2026-01-31 11:36:22.511
cml28kvlb00wb4sq4ezxp6r10	cml28kvke00tx4sq4xipc8ijk	cml28kvkc00tt4sq47ekpothm	0	1	cml27qnzj001jjutzcib47vfb	2024-08-08 17:00:00	FINISHED	Papara Park	2026-01-31 11:36:22.512	2026-01-31 11:36:22.512
cml28kvlc00wf4sq4b9utl7gg	cml28kvkk00u94sq4x39metzf	cml28kvjg00sg4sq4mdkvtsn5	1	1	cml27qnzj001jjutzcib47vfb	2024-08-08 18:00:00	FINISHED	Stadion HNK Rijeka	2026-01-31 11:36:22.513	2026-01-31 11:36:22.513
cml28kvle00wj4sq436ja0opj	cml28kvld00wg4sq4uu8muzdj	cml28kvld00wh4sq4dk18gj9z	0	1	cml27qnzj001jjutzcib47vfb	2024-08-08 18:00:00	FINISHED	Stadion Partizana	2026-01-31 11:36:22.514	2026-01-31 11:36:22.514
cml28kvlf00wn4sq42b5m4rp7	cml28kvkl00uc4sq4oclaows8	cml28kvkn00ug4sq476ilcapv	0	1	cml27qnzj001jjutzcib47vfb	2024-08-08 18:00:00	FINISHED	Olympiako Stadio Spyros Louis	2026-01-31 11:36:22.516	2026-01-31 11:36:22.516
cml28kvlg00wr4sq4jb1yk179	cml28kvlf00wo4sq4rtnu0n2t	cml28kvlg00wp4sq4y298i35a	0	2	cml27qnzj001jjutzcib47vfb	2024-08-08 18:00:00	FINISHED	Estadi Nacional	2026-01-31 11:36:22.517	2026-01-31 11:36:22.517
cml28kvli00wv4sq44pg6s5sc	cml28kvlh00ws4sq4vtwj1qd4	cml28kvlh00wt4sq4ifjo8zbe	1	2	cml27qnzj001jjutzcib47vfb	2024-08-08 18:00:00	FINISHED	Košická futbalová aréna	2026-01-31 11:36:22.518	2026-01-31 11:36:22.518
cml28kvlj00wz4sq40v2isyjl	cml28kvli00ww4sq4qfoq57vv	cml28kvli00wx4sq4kzxjxlro	1	0	cml27qnzj001jjutzcib47vfb	2024-08-08 18:15:00	FINISHED	Stadion Z'dežele	2026-01-31 11:36:22.519	2026-01-31 11:36:22.519
cml28kvlk00x34sq4xa50dchu	cml28kvlj00x04sq471xgdc79	cml28kvlk00x14sq4mnlq65uo	2	0	cml27qnzj001jjutzcib47vfb	2024-08-08 18:45:00	FINISHED	Városi Stadion	2026-01-31 11:36:22.521	2026-01-31 11:36:22.521
cml28kvll00x74sq4zsgk5v01	cml28kvkr00uo4sq45xh8ygko	cml28kvll00x54sq4is0a439l	0	0	cml27qnzj001jjutzcib47vfb	2024-08-08 19:30:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.522	2026-01-31 11:36:22.522
cml28kvln00xb4sq4zjgdbi0b	cml28kvl700vx4sq4vm5zfcx8	cml28kvl700vw4sq4ednt5wo7	0	0	cml27qnzj001jjutzcib47vfb	2024-08-13 17:30:00	FINISHED	Park Hall Stadium	2026-01-31 11:36:22.523	2026-01-31 11:36:22.523
cml28kvlo00xf4sq4d8abquxz	cml28kvlg00wp4sq4y298i35a	cml28kvlf00wo4sq4rtnu0n2t	7	0	cml27qnzj001jjutzcib47vfb	2024-08-14 16:00:00	FINISHED	LNK Sporta Parks	2026-01-31 11:36:22.524	2026-01-31 11:36:22.524
cml28kvlp00xj4sq4xy80f216	cml28kvlk00x14sq4mnlq65uo	cml28kvlj00x04sq471xgdc79	2	1	cml27qnzj001jjutzcib47vfb	2024-08-15 16:00:00	FINISHED	Europa Point Stadium	2026-01-31 11:36:22.525	2026-01-31 11:36:22.525
cml28kvlq00xn4sq4kz6rlc3m	cml28kvkc00tt4sq47ekpothm	cml28kvke00tx4sq4xipc8ijk	2	0	cml27qnzj001jjutzcib47vfb	2024-08-15 16:00:00	FINISHED	Allianz Stadion	2026-01-31 11:36:22.526	2026-01-31 11:36:22.526
cml28kvlr00xr4sq4o3up2b0u	cml28kvjg00sg4sq4mdkvtsn5	cml28kvkk00u94sq4x39metzf	2	0	cml27qnzj001jjutzcib47vfb	2024-08-15 17:00:00	FINISHED	Borås Arena	2026-01-31 11:36:22.528	2026-01-31 11:36:22.528
cml28kvls00xv4sq4saktoxjt	cml28kvlh00wt4sq4ifjo8zbe	cml28kvlh00ws4sq4vtwj1qd4	1	0	cml27qnzj001jjutzcib47vfb	2024-08-15 17:00:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.529	2026-01-31 11:36:22.529
cml28kvlt00xz4sq44rhgcu94	cml28kvkq00ul4sq48mqqxtn4	cml28kvkg00u04sq4bknkqwnt	1	0	cml27qnzj001jjutzcib47vfb	2024-08-15 18:00:00	FINISHED	Jan Breydelstadion	2026-01-31 11:36:22.53	2026-01-31 11:36:22.53
cml28kvlu00y34sq4rx0clpj3	cml28kvkn00ug4sq476ilcapv	cml28kvkl00uc4sq4oclaows8	0	1	cml27qnzj001jjutzcib47vfb	2024-08-15 18:15:00	SCHEDULED	Johan Cruijff Arena	2026-01-31 11:36:22.531	2026-01-31 11:36:22.531
cml28kvlv00y74sq4d7gh4bzx	cml28kvl600vt4sq4szxbdlhn	cml28kvl600vs4sq4etq5pesl	3	0	cml27qnzj001jjutzcib47vfb	2024-08-15 18:30:00	FINISHED	Haladás Stadion	2026-01-31 11:36:22.532	2026-01-31 11:36:22.532
cml28kvlw00yb4sq44ovn17ak	cml28kvld00wh4sq4dk18gj9z	cml28kvld00wg4sq4uu8muzdj	2	2	cml27qnzj001jjutzcib47vfb	2024-08-15 18:30:00	SCHEDULED	Stockhorn Arena	2026-01-31 11:36:22.533	2026-01-31 11:36:22.533
cml28kvlx00yf4sq4x4nkf72o	cml28kvll00x54sq4is0a439l	cml28kvkr00uo4sq45xh8ygko	1	2	cml27qnzj001jjutzcib47vfb	2024-08-15 18:30:00	FINISHED	Stade de Genève	2026-01-31 11:36:22.534	2026-01-31 11:36:22.534
cml28kvly00yj4sq4ihmuw91r	cml28kvli00wx4sq4kzxjxlro	cml28kvli00ww4sq4qfoq57vv	3	1	cml27qnzj001jjutzcib47vfb	2024-08-15 19:00:00	SCHEDULED	Tallaght Stadium	2026-01-31 11:36:22.535	2026-01-31 11:36:22.535
cml28kvlz00yn4sq44v857t73	cml28kvla00w54sq49e8jrie2	cml28kvl900w44sq4rigc4bqo	3	1	cml27qnzj001jjutzcib47vfb	2024-08-15 19:00:00	SCHEDULED	Gradski Stadion	2026-01-31 11:36:22.536	2026-01-31 11:36:22.536
cml28kvm000yr4sq4ulvt6f3m	cml28kvkg00u04sq4bknkqwnt	cml28kvjg00sg4sq4mdkvtsn5	0	1	cml27qnzj001jjutzcib47vfb	2024-08-22 17:00:00	FINISHED	Aker Stadion	2026-01-31 11:36:22.537	2026-01-31 11:36:22.537
cml28kvm100yv4sq4vu1dqnjv	cml28kvlh00wt4sq4ifjo8zbe	cml28kvm100yt4sq41wos1zm1	1	0	cml27qnzj001jjutzcib47vfb	2024-08-22 17:00:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.538	2026-01-31 11:36:22.538
cml28kvm200yz4sq4jgdzdlek	cml28kvm200yw4sq4scc5frz7	cml28kvm200yx4sq4xlz11znp	1	1	cml27qnzj001jjutzcib47vfb	2024-08-22 17:00:00	FINISHED	Raiffeisen Arena	2026-01-31 11:36:22.539	2026-01-31 11:36:22.539
cml28kvm300z34sq4emba5i1z	cml28kvlg00wp4sq4y298i35a	cml28kvm300z14sq47k8y18eq	2	1	cml27qnzj001jjutzcib47vfb	2024-08-22 17:00:00	FINISHED	LNK Sporta Parks	2026-01-31 11:36:22.54	2026-01-31 11:36:22.54
cml28kvm400z74sq4p8v52nyy	cml28kvm400z44sq47q6fox0u	cml28kvli00wx4sq4kzxjxlro	4	0	cml27qnzj001jjutzcib47vfb	2024-08-22 17:30:00	FINISHED	Stadio Toumbas	2026-01-31 11:36:22.541	2026-01-31 11:36:22.541
cml28kvm500zb4sq4jlaslugf	cml28kvm400z84sq4f8mb692y	cml28kvl700vw4sq4ednt5wo7	4	0	cml27qnzj001jjutzcib47vfb	2024-08-22 18:00:00	FINISHED	Huvepharma Arena	2026-01-31 11:36:22.542	2026-01-31 11:36:22.542
cml28kvm600zf4sq4xaregkdc	cml28kvl600vt4sq4szxbdlhn	cml28kvm600zd4sq49zmy77u6	3	0	cml27qnzj001jjutzcib47vfb	2024-08-22 18:00:00	FINISHED	Haladás Stadion	2026-01-31 11:36:22.543	2026-01-31 11:36:22.543
cml28kvm700zj4sq4hx9fp2wi	cml28kvld00wh4sq4dk18gj9z	cml28kvm700zh4sq4b2f4ifoz	3	3	cml27qnzj001jjutzcib47vfb	2024-08-22 18:30:00	FINISHED	Stockhorn Arena	2026-01-31 11:36:22.543	2026-01-31 11:36:22.543
cml28kvm800zn4sq484wgjs97	cml28kvm700zk4sq42hh5o1ep	cml28kvkn00ug4sq476ilcapv	1	4	cml27qnzj001jjutzcib47vfb	2024-08-22 18:45:00	FINISHED	Stadion Miejski	2026-01-31 11:36:22.544	2026-01-31 11:36:22.544
cml28kvm900zr4sq4z672iik0	cml28kvlj00x04sq471xgdc79	cml28kvm800zp4sq4ht8588a1	0	1	cml27qnzj001jjutzcib47vfb	2024-08-22 18:45:00	FINISHED	Városi Stadion	2026-01-31 11:36:22.545	2026-01-31 11:36:22.545
cml28kvma00zv4sq4q8tjzalt	cml28kvm900zs4sq4q36rqvpf	cml28kvla00w54sq49e8jrie2	0	0	cml27qnzj001jjutzcib47vfb	2024-08-22 19:00:00	FINISHED	Groupama Aréna	2026-01-31 11:36:22.546	2026-01-31 11:36:22.546
cml28kvmb00zz4sq4njeimnjn	cml28kvkr00uo4sq45xh8ygko	cml28kvkc00tt4sq47ekpothm	2	1	cml27qnzj001jjutzcib47vfb	2024-08-22 19:30:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.547	2026-01-31 11:36:22.547
cml28kvmc01034sq4uia7wtww	cml28kvjg00sg4sq4mdkvtsn5	cml28kvkg00u04sq4bknkqwnt	0	1	cml27qnzj001jjutzcib47vfb	2024-08-29 17:00:00	SCHEDULED	Borås Arena	2026-01-31 11:36:22.548	2026-01-31 11:36:22.548
cml28kvmd01074sq43bexdkb4	cml28kvm300z14sq47k8y18eq	cml28kvlg00wp4sq4y298i35a	2	1	cml27qnzj001jjutzcib47vfb	2024-08-29 17:00:00	SCHEDULED	Neo GSP	2026-01-31 11:36:22.549	2026-01-31 11:36:22.549
cml28kvme010b4sq4gc1twqye	cml28kvl700vw4sq4ednt5wo7	cml28kvm400z84sq4f8mb692y	1	2	cml27qnzj001jjutzcib47vfb	2024-08-29 17:00:00	FINISHED	Stadionul Zimbru	2026-01-31 11:36:22.55	2026-01-31 11:36:22.55
cml28kvme010f4sq4pq4wrjgv	cml28kvkn00ug4sq476ilcapv	cml28kvm700zk4sq42hh5o1ep	3	0	cml27qnzj001jjutzcib47vfb	2024-08-29 18:00:00	FINISHED	Johan Cruijff ArenA	2026-01-31 11:36:22.551	2026-01-31 11:36:22.551
cml28kvmf010j4sq4tbta3wws	cml28kvm700zh4sq4b2f4ifoz	cml28kvld00wh4sq4dk18gj9z	5	1	cml27qnzj001jjutzcib47vfb	2024-08-29 18:00:00	FINISHED	Tüpraş Stadyumu	2026-01-31 11:36:22.552	2026-01-31 11:36:22.552
cml28kvmg010n4sq4051j4w3f	cml28kvm800zp4sq4ht8588a1	cml28kvlj00x04sq471xgdc79	1	0	cml27qnzj001jjutzcib47vfb	2024-08-29 18:00:00	FINISHED	Lotto Park	2026-01-31 11:36:22.553	2026-01-31 11:36:22.553
cml28kvmh010r4sq4yarxasdv	cml28kvm200yx4sq4xlz11znp	cml28kvm200yw4sq4scc5frz7	1	0	cml27qnzj001jjutzcib47vfb	2024-08-29 18:30:00	FINISHED	Stadionul Steaua	2026-01-31 11:36:22.554	2026-01-31 11:36:22.554
cml28kvmi010v4sq48z6h1x23	cml28kvm100yt4sq41wos1zm1	cml28kvlh00wt4sq4ifjo8zbe	0	1	cml27qnzj001jjutzcib47vfb	2024-08-29 18:45:00	FINISHED	Tynecastle Park	2026-01-31 11:36:22.555	2026-01-31 11:36:22.555
cml28kvmj010z4sq43rboe2vg	cml28kvli00wx4sq4kzxjxlro	cml28kvm400z44sq47q6fox0u	0	2	cml27qnzj001jjutzcib47vfb	2024-08-29 19:00:00	FINISHED	Tallaght Stadium	2026-01-31 11:36:22.556	2026-01-31 11:36:22.556
cml28kvmk01134sq46di7ld9v	cml28kvkc00tt4sq47ekpothm	cml28kvkr00uo4sq45xh8ygko	2	2	cml27qnzj001jjutzcib47vfb	2024-08-29 19:00:00	FINISHED	Allianz Stadion	2026-01-31 11:36:22.557	2026-01-31 11:36:22.557
cml28kvml01174sq44gngrzrn	cml28kvm600zd4sq49zmy77u6	cml28kvl600vt4sq4szxbdlhn	1	5	cml27qnzj001jjutzcib47vfb	2024-08-29 19:00:00	FINISHED	TSC Arena	2026-01-31 11:36:22.558	2026-01-31 11:36:22.558
cml28kvmm011b4sq4mu1lo6ae	cml28kvla00w54sq49e8jrie2	cml28kvm900zs4sq4q36rqvpf	1	1	cml27qnzj001jjutzcib47vfb	2024-08-29 19:00:00	SCHEDULED	Gradski Stadion	2026-01-31 11:36:22.559	2026-01-31 11:36:22.559
cml28kvmn011f4sq4sgu96fb0	cml28kvmn011c4sq44k3vsvfb	cml28kvjg00sg4sq4mdkvtsn5	3	2	cml27qnzj001jjutzcib47vfb	2024-09-25 16:45:00	FINISHED	AFAS Stadion	2026-01-31 11:36:22.56	2026-01-31 11:36:22.56
cml28kvmo011j4sq4xa0gbuvr	cml28kvmo011g4sq44d5wu2qx	cml28kvmo011h4sq4q2f970fb	3	2	cml27qnzj001jjutzcib47vfb	2024-09-25 16:45:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.561	2026-01-31 11:36:22.561
cml28kvmp011n4sq4uaqxby16	cmkzls3de001iahfix43hx7lu	cml28kvmp011l4sq4ihv1xt4e	1	1	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	Old Trafford	2026-01-31 11:36:22.562	2026-01-31 11:36:22.562
cml28kvmq011r4sq4iz80bnwj	cml28kvmq011o4sq4b4vf6zn7	cml28kvmq011p4sq4x8279bzl	1	1	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	Allianz Riviera	2026-01-31 11:36:22.563	2026-01-31 11:36:22.563
cml28kvmr011v4sq4e0hau7f1	cml28kvmr011s4sq4t4galrbm	cml28kvmr011t4sq4np5h7zd7	1	1	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	MCH Arena	2026-01-31 11:36:22.564	2026-01-31 11:36:22.564
cml28kvms011z4sq4f4ym56kk	cml28kvm800zp4sq4ht8588a1	cml28kvm900zs4sq4q36rqvpf	2	1	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	Lotto Park	2026-01-31 11:36:22.565	2026-01-31 11:36:22.565
cml28kvmt01234sq4qlqe5t3g	cml28kvm400z84sq4f8mb692y	cml28kvmt01214sq4tt8sqkut	0	2	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	Huvepharma Arena	2026-01-31 11:36:22.566	2026-01-31 11:36:22.566
cml28kvmu01274sq4agn9d9vu	cml28kvmt01244sq4qxn1tvue	cml28kvmu01254sq44brwnoen	0	3	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	Volksparkstadion	2026-01-31 11:36:22.567	2026-01-31 11:36:22.567
cml28kvmv012b4sq40wtr2sdm	cml28kvmu01284sq4y31bogl4	cml28kvm400z44sq47q6fox0u	3	1	cml27qnzj001jjutzcib47vfb	2024-09-25 19:00:00	FINISHED	RAMS Park	2026-01-31 11:36:22.568	2026-01-31 11:36:22.568
cml28kvmw012f4sq4uzbk74c4	cml28kvmv012c4sq4mzdwqpqq	cml28kvmw012d4sq4p6eob1g9	0	2	cml27qnzj001jjutzcib47vfb	2024-09-26 16:45:00	FINISHED	Eleda Stadion	2026-01-31 11:36:22.569	2026-01-31 11:36:22.569
cml28kvmx012j4sq4tenhfnsn	cml28kvmw012g4sq42geb6kgi	cml28kvmx012h4sq4rdoch336	2	1	cml27qnzj001jjutzcib47vfb	2024-09-26 16:45:00	FINISHED	Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi	2026-01-31 11:36:22.57	2026-01-31 11:36:22.57
cml28kvmy012n4sq4l7yibpuj	cmkzls3dd001gahfi64glto0s	cml28kvmy012l4sq4zlig6gs2	3	0	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.571	2026-01-31 11:36:22.571
cml28kvmz012r4sq4i8dnz7fr	cml28kvmz012o4sq4tleu6659	cml28kvmz012p4sq4y75u87nu	2	0	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Groupama Stadium	2026-01-31 11:36:22.572	2026-01-31 11:36:22.572
cml28kvn1012v4sq4snvfk3qr	cml28kvn0012s4sq4jeca9p5a	cml28kvlh00wt4sq4ifjo8zbe	3	3	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Deutsche Bank Park	2026-01-31 11:36:22.573	2026-01-31 11:36:22.573
cml28kvn2012z4sq4pvhw9h3s	cml28kvkn00ug4sq476ilcapv	cml28kvm700zh4sq4b2f4ifoz	4	0	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Johan Cruijff ArenA	2026-01-31 11:36:22.574	2026-01-31 11:36:22.574
cml28kvn301334sq4fycq1vbx	cml28kvkr00uo4sq45xh8ygko	cml28kvl600vt4sq4szxbdlhn	2	1	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.575	2026-01-31 11:36:22.575
cml28kvn401374sq47dcr744b	cml28kvn301344sq4p4w76fpc	cml28kvn301354sq4k9iltpoi	1	1	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.576	2026-01-31 11:36:22.576
cml28kvn5013b4sq4ddeypoov	cml28kvm200yx4sq4xlz11znp	cml28kvlg00wp4sq4y298i35a	4	1	cml27qnzj001jjutzcib47vfb	2024-09-26 19:00:00	FINISHED	Arena Naţională	2026-01-31 11:36:22.577	2026-01-31 11:36:22.577
cml28kvn6013f4sq4w17l9zrk	cml28kvmr011t4sq4np5h7zd7	cml28kvmt01244sq4qxn1tvue	2	0	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	PreZero Arena	2026-01-31 11:36:22.578	2026-01-31 11:36:22.578
cml28kvn6013j4sq4p9lvzni9	cml28kvmu01254sq44brwnoen	cml28kvmq011o4sq4b4vf6zn7	4	1	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.579	2026-01-31 11:36:22.579
cml28kvn7013n4sq4ji23l5y9	cml28kvmq011p4sq4x8279bzl	cml28kvm800zp4sq4ht8588a1	1	2	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Reale Arena	2026-01-31 11:36:22.58	2026-01-31 11:36:22.58
cml28kvn8013r4sq4kbvq4wjq	cml28kvmz012p4sq4y75u87nu	cml28kvkr00uo4sq45xh8ygko	3	0	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Stadio Georgios Karaiskáki	2026-01-31 11:36:22.581	2026-01-31 11:36:22.581
cml28kvn9013v4sq49uf36sse	cml28kvmy012l4sq4zlig6gs2	cml28kvmv012c4sq4mzdwqpqq	1	2	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Tofiq Bəhramov adına Respublika stadionu	2026-01-31 11:36:22.582	2026-01-31 11:36:22.582
cml28kvna013z4sq4lo80bdym	cml28kvmt01214sq4tt8sqkut	cml28kvkn00ug4sq476ilcapv	1	1	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Fortuna Arena	2026-01-31 11:36:22.582	2026-01-31 11:36:22.582
cml28kvnb01434sq4ity2wj8y	cml28kvl600vt4sq4szxbdlhn	cml28kvmr011s4sq4t4galrbm	0	2	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Stadion Partizana	2026-01-31 11:36:22.583	2026-01-31 11:36:22.583
cml28kvnc01474sq4i8x89xtq	cml28kvm900zs4sq4q36rqvpf	cmkzls3dd001gahfi64glto0s	1	2	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Groupama Aréna	2026-01-31 11:36:22.584	2026-01-31 11:36:22.584
cml28kvnd014b4sq47v0ekoe6	cml28kvlg00wp4sq4y298i35a	cml28kvmu01284sq4y31bogl4	2	2	cml27qnzj001jjutzcib47vfb	2024-10-03 16:45:00	FINISHED	Daugavas Stadionā	2026-01-31 11:36:22.585	2026-01-31 11:36:22.585
cml28kvnd014f4sq4ygub0m58	cml28kvmo011h4sq4q2f970fb	cmkzls3de001iahfix43hx7lu	3	3	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Estádio Do Dragão	2026-01-31 11:36:22.586	2026-01-31 11:36:22.586
cml28kvne014j4sq4z8q0md5d	cml28kvmw012d4sq4p6eob1g9	cml28kvmz012o4sq4tleu6659	1	4	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Ibrox Stadium	2026-01-31 11:36:22.587	2026-01-31 11:36:22.587
cml28kvnf014n4sq4k8rtcotu	cml28kvjg00sg4sq4mdkvtsn5	cml28kvn301344sq4p4w76fpc	1	0	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Borås Arena	2026-01-31 11:36:22.588	2026-01-31 11:36:22.588
cml28kvng014r4sq4ouahtfjq	cml28kvmp011l4sq4ihv1xt4e	cml28kvmw012g4sq42geb6kgi	1	1	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	De Grolsch Veste	2026-01-31 11:36:22.589	2026-01-31 11:36:22.589
cml28kvnh014v4sq4cez2885a	cml28kvn301354sq4k9iltpoi	cml28kvmn011c4sq44k3vsvfb	2	0	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.59	2026-01-31 11:36:22.59
cml28kvni014z4sq4m6gixbdu	cml28kvm700zh4sq4b2f4ifoz	cml28kvn0012s4sq4jeca9p5a	1	3	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Tüpraş Stadyumu	2026-01-31 11:36:22.59	2026-01-31 11:36:22.59
cml28kvnj01534sq4k0p7r61v	cml28kvlh00wt4sq4ifjo8zbe	cml28kvm400z84sq4f8mb692y	0	0	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.591	2026-01-31 11:36:22.591
cml28kvnk01574sq4lv15fdej	cml28kvm400z44sq47q6fox0u	cml28kvm200yx4sq4xlz11znp	0	1	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Stadio Toumbas	2026-01-31 11:36:22.592	2026-01-31 11:36:22.592
cml28kvnk015b4sq4mnq07v7e	cml28kvmx012h4sq4rdoch336	cml28kvmo011g4sq44d5wu2qx	0	0	cml27qnzj001jjutzcib47vfb	2024-10-03 19:00:00	FINISHED	Stade Roi Baudouin	2026-01-31 11:36:22.593	2026-01-31 11:36:22.593
cml28kvnl015f4sq4486mcbyf	cml28kvkr00uo4sq45xh8ygko	cml28kvmo011g4sq44d5wu2qx	1	2	cml27qnzj001jjutzcib47vfb	2024-10-23 14:30:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.594	2026-01-31 11:36:22.594
cml28kvnm015j4sq43gb2o2c0	cml28kvmu01284sq4y31bogl4	cml28kvjg00sg4sq4mdkvtsn5	4	3	cml27qnzj001jjutzcib47vfb	2024-10-23 14:30:00	FINISHED	RAMS Park	2026-01-31 11:36:22.595	2026-01-31 11:36:22.595
cml28kvnn015n4sq4elfk1x03	cml28kvn0012s4sq4jeca9p5a	cml28kvlg00wp4sq4y298i35a	1	0	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	Deutsche Bank Park	2026-01-31 11:36:22.596	2026-01-31 11:36:22.596
cml28kvno015r4sq4gnc49e82	cml28kvmr011s4sq4t4galrbm	cml28kvmx012h4sq4rdoch336	1	0	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	MCH Arena	2026-01-31 11:36:22.596	2026-01-31 11:36:22.596
cml28kvnp015v4sq40w57px1d	cml28kvn301344sq4p4w76fpc	cml28kvmt01244sq4qxn1tvue	1	0	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.597	2026-01-31 11:36:22.597
cml28kvnq015z4sq4m5b33uns	cml28kvmy012l4sq4zlig6gs2	cml28kvkn00ug4sq476ilcapv	0	3	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	Tofiq Bəhramov adına Respublika stadionu	2026-01-31 11:36:22.598	2026-01-31 11:36:22.598
cml28kvnr01634sq4c8d18d0n	cml28kvl600vt4sq4szxbdlhn	cml28kvmq011p4sq4x8279bzl	1	2	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	Stadion Partizana	2026-01-31 11:36:22.599	2026-01-31 11:36:22.599
cml28kvns01674sq4evic4gld	cml28kvm400z44sq47q6fox0u	cml28kvlh00wt4sq4ifjo8zbe	2	2	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	Stadio Toumbas	2026-01-31 11:36:22.6	2026-01-31 11:36:22.6
cml28kvnt016b4sq4f5kh623m	cml28kvm900zs4sq4q36rqvpf	cml28kvmq011o4sq4b4vf6zn7	1	0	cml27qnzj001jjutzcib47vfb	2024-10-24 16:45:00	FINISHED	Groupama Aréna	2026-01-31 11:36:22.601	2026-01-31 11:36:22.601
cml28kvnu016f4sq4d6e4993a	cmkzls3dd001gahfi64glto0s	cml28kvmn011c4sq44k3vsvfb	1	0	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.602	2026-01-31 11:36:22.602
cml28kvnu016j4sq4i8ic51co	cml28kvmz012o4sq4tleu6659	cml28kvm700zh4sq4b2f4ifoz	0	1	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Groupama Stadium	2026-01-31 11:36:22.603	2026-01-31 11:36:22.603
cml28kvnv016n4sq48gt8jpfp	cml28kvmo011h4sq4q2f970fb	cml28kvmr011t4sq4np5h7zd7	2	0	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Estádio Do Dragão	2026-01-31 11:36:22.604	2026-01-31 11:36:22.604
cml28kvnw016r4sq4u4iq70e6	cml28kvmw012d4sq4p6eob1g9	cml28kvm200yx4sq4xlz11znp	4	0	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Ibrox Stadium	2026-01-31 11:36:22.605	2026-01-31 11:36:22.605
cml28kvnx016v4sq4gh5hut3f	cml28kvmv012c4sq4mzdwqpqq	cml28kvmz012p4sq4y75u87nu	0	1	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Eleda Stadion	2026-01-31 11:36:22.605	2026-01-31 11:36:22.605
cml28kvny016z4sq4iwxuzehz	cml28kvmp011l4sq4ihv1xt4e	cml28kvmu01254sq44brwnoen	0	2	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	De Grolsch Veste	2026-01-31 11:36:22.606	2026-01-31 11:36:22.606
cml28kvnz01734sq4i7dcbvcj	cml28kvn301354sq4k9iltpoi	cml28kvmt01214sq4tt8sqkut	1	0	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.607	2026-01-31 11:36:22.607
cml28kvo001774sq4bsfs93qd	cml28kvm800zp4sq4ht8588a1	cml28kvm400z84sq4f8mb692y	2	0	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Lotto Park	2026-01-31 11:36:22.608	2026-01-31 11:36:22.608
cml28kvo0017b4sq4xi1g9kwj	cml28kvmw012g4sq42geb6kgi	cmkzls3de001iahfix43hx7lu	1	1	cml27qnzj001jjutzcib47vfb	2024-10-24 19:00:00	FINISHED	Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi	2026-01-31 11:36:22.609	2026-01-31 11:36:22.609
cml28kvo1017f4sq4el1rque0	cml28kvm700zh4sq4b2f4ifoz	cml28kvmv012c4sq4mzdwqpqq	2	1	cml27qnzj001jjutzcib47vfb	2024-11-06 15:30:00	FINISHED	Tüpraş Stadyumu	2026-01-31 11:36:22.61	2026-01-31 11:36:22.61
cml28kvo2017j4sq4cpeutk78	cml28kvmq011o4sq4b4vf6zn7	cml28kvmp011l4sq4ihv1xt4e	2	2	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Allianz Riviera	2026-01-31 11:36:22.611	2026-01-31 11:36:22.611
cml28kvo3017n4sq4zlr4ud4j	cml28kvn0012s4sq4jeca9p5a	cml28kvmt01214sq4tt8sqkut	1	0	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Deutsche Bank Park	2026-01-31 11:36:22.611	2026-01-31 11:36:22.611
cml28kvo4017r4sq4kb2wdp32	cml28kvmo011g4sq44d5wu2qx	cml28kvmy012l4sq4zlig6gs2	1	2	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.612	2026-01-31 11:36:22.612
cml28kvo5017v4sq4t5kofvls	cml28kvjg00sg4sq4mdkvtsn5	cml28kvkr00uo4sq45xh8ygko	1	1	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Borås Arena	2026-01-31 11:36:22.613	2026-01-31 11:36:22.613
cml28kvo6017z4sq4vj03b4ks	cml28kvmz012p4sq4y75u87nu	cml28kvmw012d4sq4p6eob1g9	1	1	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Stadio Georgios Karaiskáki	2026-01-31 11:36:22.614	2026-01-31 11:36:22.614
cml28kvo601834sq42zs3ilvr	cml28kvm200yx4sq4xlz11znp	cml28kvmr011s4sq4t4galrbm	2	0	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Arena Naţională	2026-01-31 11:36:22.615	2026-01-31 11:36:22.615
cml28kvo701874sq4glw09f95	cml28kvm400z84sq4f8mb692y	cml28kvn301354sq4k9iltpoi	1	2	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Huvepharma Arena	2026-01-31 11:36:22.616	2026-01-31 11:36:22.616
cml28kvo8018b4sq4w0dv6vle	cml28kvmu01284sq4y31bogl4	cmkzls3dd001gahfi64glto0s	3	2	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	RAMS Park	2026-01-31 11:36:22.617	2026-01-31 11:36:22.617
cml28kvo9018f4sq4epf4v29x	cml28kvmx012h4sq4rdoch336	cml28kvn301344sq4p4w76fpc	1	1	cml27qnzj001jjutzcib47vfb	2024-11-07 17:45:00	FINISHED	Stade Roi Baudouin	2026-01-31 11:36:22.617	2026-01-31 11:36:22.617
cml28kvoa018j4sq4f47m1wc1	cmkzls3de001iahfix43hx7lu	cml28kvm400z44sq47q6fox0u	2	0	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	Old Trafford	2026-01-31 11:36:22.618	2026-01-31 11:36:22.618
cml28kvob018n4sq40ittm5zj	cml28kvmr011t4sq4np5h7zd7	cml28kvmz012o4sq4tleu6659	2	2	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	PreZero Arena	2026-01-31 11:36:22.619	2026-01-31 11:36:22.619
cml28kvob018r4sq4f1cn70tt	cml28kvkn00ug4sq476ilcapv	cml28kvl600vt4sq4szxbdlhn	5	0	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	Johan Cruijff ArenA	2026-01-31 11:36:22.62	2026-01-31 11:36:22.62
cml28kvoc018v4sq44nsmfh6w	cml28kvmn011c4sq44k3vsvfb	cml28kvmw012g4sq42geb6kgi	3	1	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	AFAS Stadion	2026-01-31 11:36:22.621	2026-01-31 11:36:22.621
cml28kvod018z4sq4bnmhq8db	cml28kvmu01254sq44brwnoen	cml28kvmo011h4sq4q2f970fb	2	1	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.622	2026-01-31 11:36:22.622
cml28kvoe01934sq4pq9ifguq	cml28kvlh00wt4sq4ifjo8zbe	cml28kvmq011p4sq4x8279bzl	2	1	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.622	2026-01-31 11:36:22.622
cml28kvof01974sq4oaljtn3e	cml28kvmt01244sq4qxn1tvue	cml28kvm900zs4sq4q36rqvpf	0	4	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	Volksparkstadion	2026-01-31 11:36:22.623	2026-01-31 11:36:22.623
cml28kvog019b4sq4icjug5u0	cml28kvlg00wp4sq4y298i35a	cml28kvm800zp4sq4ht8588a1	1	1	cml27qnzj001jjutzcib47vfb	2024-11-07 20:00:00	FINISHED	Daugavas Stadionā	2026-01-31 11:36:22.624	2026-01-31 11:36:22.624
cml28kvog019f4sq4rcimy71k	cml28kvmn011c4sq44k3vsvfb	cml28kvmu01284sq4y31bogl4	1	1	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	AFAS Stadion	2026-01-31 11:36:22.625	2026-01-31 11:36:22.625
cml28kvoh019j4sq4ay5inn3w	cml28kvmu01254sq44brwnoen	cml28kvm400z84sq4f8mb692y	0	0	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.626	2026-01-31 11:36:22.626
cml28kvoi019n4sq4syvj4o3l	cml28kvn301354sq4k9iltpoi	cml28kvjg00sg4sq4mdkvtsn5	3	0	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.627	2026-01-31 11:36:22.627
cml28kvoj019r4sq4ok36qsb9	cml28kvm700zh4sq4b2f4ifoz	cml28kvl600vt4sq4szxbdlhn	1	3	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	Nagyerdei Stadion	2026-01-31 11:36:22.627	2026-01-31 11:36:22.627
cml28kvok019v4sq4bfcouhim	cml28kvm800zp4sq4ht8588a1	cml28kvmo011h4sq4q2f970fb	2	2	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	Lotto Park	2026-01-31 11:36:22.628	2026-01-31 11:36:22.628
cml28kvol019z4sq4mqtrriqt	cml28kvmy012l4sq4zlig6gs2	cml28kvmz012o4sq4tleu6659	1	4	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	Tofiq Bəhramov adına Respublika stadionu	2026-01-31 11:36:22.629	2026-01-31 11:36:22.629
cml28kvom01a34sq4eicwk87k	cml28kvmt01244sq4qxn1tvue	cml28kvlh00wt4sq4ifjo8zbe	1	2	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	Volksparkstadion	2026-01-31 11:36:22.63	2026-01-31 11:36:22.63
cml28kvon01a74sq4no4o721r	cml28kvlg00wp4sq4y298i35a	cml28kvm400z44sq47q6fox0u	0	2	cml27qnzj001jjutzcib47vfb	2024-11-28 17:45:00	FINISHED	Daugavas Stadionā	2026-01-31 11:36:22.631	2026-01-31 11:36:22.631
cml28kvon01ab4sq45tqcr3zs	cmkzls3de001iahfix43hx7lu	cml28kvmo011g4sq44d5wu2qx	3	2	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Old Trafford	2026-01-31 11:36:22.632	2026-01-31 11:36:22.632
cml28kvoo01af4sq4tzvkr9f0	cmkzls3dd001gahfi64glto0s	cml28kvn301344sq4p4w76fpc	2	2	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.633	2026-01-31 11:36:22.633
cml28kvop01aj4sq4ad9td5le	cml28kvmq011o4sq4b4vf6zn7	cml28kvmw012d4sq4p6eob1g9	1	4	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Allianz Riviera	2026-01-31 11:36:22.634	2026-01-31 11:36:22.634
cml28kvoq01an4sq4tgn13b8e	cml28kvkr00uo4sq45xh8ygko	cml28kvmr011t4sq4np5h7zd7	3	0	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.634	2026-01-31 11:36:22.634
cml28kvor01ar4sq4fw40f3zr	cml28kvmr011s4sq4t4galrbm	cml28kvn0012s4sq4jeca9p5a	1	2	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	MCH Arena	2026-01-31 11:36:22.635	2026-01-31 11:36:22.635
cml28kvos01av4sq4tvftqjxd	cml28kvmp011l4sq4ihv1xt4e	cml28kvmx012h4sq4rdoch336	0	1	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	De Grolsch Veste	2026-01-31 11:36:22.636	2026-01-31 11:36:22.636
cml28kvot01az4sq4mv61nife	cml28kvmq011p4sq4x8279bzl	cml28kvkn00ug4sq476ilcapv	2	0	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Reale Arena	2026-01-31 11:36:22.637	2026-01-31 11:36:22.637
cml28kvou01b34sq4jiv5wvaw	cml28kvm200yx4sq4xlz11znp	cml28kvmz012p4sq4y75u87nu	0	0	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Arena Naţională	2026-01-31 11:36:22.638	2026-01-31 11:36:22.638
cml28kvov01b74sq41rjd1qbz	cml28kvmt01214sq4tt8sqkut	cml28kvmw012g4sq42geb6kgi	1	2	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Fortuna Arena	2026-01-31 11:36:22.639	2026-01-31 11:36:22.639
cml28kvow01bb4sq41muyn99h	cml28kvm900zs4sq4q36rqvpf	cml28kvmv012c4sq4mzdwqpqq	4	1	cml27qnzj001jjutzcib47vfb	2024-11-28 20:00:00	FINISHED	Groupama Aréna	2026-01-31 11:36:22.64	2026-01-31 11:36:22.64
cml28kvox01bf4sq4uz2tfvth	cml28kvmw012g4sq42geb6kgi	cml28kvn301354sq4k9iltpoi	0	2	cml27qnzj001jjutzcib47vfb	2024-12-11 15:30:00	FINISHED	Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi	2026-01-31 11:36:22.641	2026-01-31 11:36:22.641
cml28kvox01bj4sq4mvp02zya	cml28kvmr011t4sq4np5h7zd7	cml28kvm200yx4sq4xlz11znp	0	0	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	PreZero Arena	2026-01-31 11:36:22.642	2026-01-31 11:36:22.642
cml28kvoy01bn4sq4ua9l47uh	cml28kvmv012c4sq4mzdwqpqq	cml28kvmu01284sq4y31bogl4	2	2	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Eleda Stadion	2026-01-31 11:36:22.643	2026-01-31 11:36:22.643
cml28kvoz01br4sq4qng64ih2	cml28kvn301344sq4p4w76fpc	cml28kvkr00uo4sq45xh8ygko	3	0	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.644	2026-01-31 11:36:22.644
cml28kvp001bv4sq40hgungtl	cml28kvmz012p4sq4y75u87nu	cml28kvmp011l4sq4ihv1xt4e	0	0	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Stadio Georgios Karaiskáki	2026-01-31 11:36:22.645	2026-01-31 11:36:22.645
cml28kvp101bz4sq4h4dau7qj	cml28kvm400z84sq4f8mb692y	cml28kvmn011c4sq44k3vsvfb	2	2	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Huvepharma Arena	2026-01-31 11:36:22.645	2026-01-31 11:36:22.645
cml28kvp201c34sq49o9wroou	cml28kvlh00wt4sq4ifjo8zbe	cmkzls3de001iahfix43hx7lu	1	2	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.646	2026-01-31 11:36:22.646
cml28kvp301c74sq431eadsrg	cml28kvm400z44sq47q6fox0u	cml28kvm900zs4sq4q36rqvpf	5	0	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Stadio Toumbas	2026-01-31 11:36:22.647	2026-01-31 11:36:22.647
cml28kvp401cb4sq4ttcxjdhn	cml28kvmx012h4sq4rdoch336	cml28kvmq011o4sq4b4vf6zn7	2	1	cml27qnzj001jjutzcib47vfb	2024-12-12 17:45:00	FINISHED	Stade Roi Baudouin	2026-01-31 11:36:22.648	2026-01-31 11:36:22.648
cml28kvp401cf4sq4b0e8uepk	cml28kvmz012o4sq4tleu6659	cml28kvn0012s4sq4jeca9p5a	3	2	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Groupama Stadium	2026-01-31 11:36:22.649	2026-01-31 11:36:22.649
cml28kvp501cj4sq4mnxemvqd	cml28kvkn00ug4sq476ilcapv	cml28kvmu01254sq44brwnoen	1	3	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Johan Cruijff ArenA	2026-01-31 11:36:22.65	2026-01-31 11:36:22.65
cml28kvp601cn4sq43wvayqan	cml28kvmo011h4sq4q2f970fb	cml28kvmr011s4sq4t4galrbm	2	0	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Estádio Do Dragão	2026-01-31 11:36:22.651	2026-01-31 11:36:22.651
cml28kvp701cr4sq4coi6vh2a	cml28kvmw012d4sq4p6eob1g9	cmkzls3dd001gahfi64glto0s	1	1	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Ibrox Stadium	2026-01-31 11:36:22.652	2026-01-31 11:36:22.652
cml28kvp801cv4sq4vqh0yms0	cml28kvmo011g4sq44d5wu2qx	cml28kvm700zh4sq4b2f4ifoz	2	1	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.653	2026-01-31 11:36:22.653
cml28kvp901cz4sq48qqqfp7m	cml28kvjg00sg4sq4mdkvtsn5	cml28kvmy012l4sq4zlig6gs2	1	0	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Borås Arena	2026-01-31 11:36:22.653	2026-01-31 11:36:22.653
cml28kvpa01d34sq4jkflp760	cml28kvmq011p4sq4x8279bzl	cml28kvmt01244sq4qxn1tvue	3	0	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Reale Arena	2026-01-31 11:36:22.654	2026-01-31 11:36:22.654
cml28kvpb01d74sq4ectkdjie	cml28kvmt01214sq4tt8sqkut	cml28kvm800zp4sq4ht8588a1	1	2	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Fortuna Arena	2026-01-31 11:36:22.655	2026-01-31 11:36:22.655
cml28kvpb01db4sq435twtvxz	cml28kvl600vt4sq4szxbdlhn	cml28kvlg00wp4sq4y298i35a	2	1	cml27qnzj001jjutzcib47vfb	2024-12-12 20:00:00	FINISHED	Stadion Partizana	2026-01-31 11:36:22.656	2026-01-31 11:36:22.656
cml28kvpc01df4sq4lqtpo17x	cml28kvmu01284sq4y31bogl4	cml28kvmt01244sq4qxn1tvue	3	3	cml27qnzj001jjutzcib47vfb	2025-01-21 15:30:00	FINISHED	RAMS Park	2026-01-31 11:36:22.657	2026-01-31 11:36:22.657
cml28kvpd01dj4sq4us98syfn	cml28kvm700zh4sq4b2f4ifoz	cml28kvn301354sq4k9iltpoi	4	1	cml27qnzj001jjutzcib47vfb	2025-01-22 15:30:00	FINISHED	Tüpraş Stadyumu	2026-01-31 11:36:22.658	2026-01-31 11:36:22.658
cml28kvpe01dn4sq4pl868awd	cml28kvmr011t4sq4np5h7zd7	cmkzls3dd001gahfi64glto0s	2	3	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	PreZero Arena	2026-01-31 11:36:22.658	2026-01-31 11:36:22.658
cml28kvpf01dr4sq4v9v3ey8w	cml28kvmn011c4sq44k3vsvfb	cml28kvn301344sq4p4w76fpc	1	0	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	AFAS Stadion	2026-01-31 11:36:22.659	2026-01-31 11:36:22.659
cml28kvpg01dv4sq4692qaga9	cml28kvmo011h4sq4q2f970fb	cml28kvmz012p4sq4y75u87nu	0	1	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	Estádio Do Dragão	2026-01-31 11:36:22.66	2026-01-31 11:36:22.66
cml28kvph01dz4sq4ajik03zf	cml28kvmo011g4sq44d5wu2qx	cml28kvl600vt4sq4szxbdlhn	3	1	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.661	2026-01-31 11:36:22.661
cml28kvpi01e34sq4989002j0	cml28kvmv012c4sq4mzdwqpqq	cml28kvmp011l4sq4ihv1xt4e	2	3	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	Eleda Stadion	2026-01-31 11:36:22.662	2026-01-31 11:36:22.662
cml28kvpj01e74sq4ovc7d7qo	cml28kvmy012l4sq4zlig6gs2	cml28kvm200yx4sq4xlz11znp	2	3	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	Tofiq Bəhramov adına Respublika stadionu	2026-01-31 11:36:22.663	2026-01-31 11:36:22.663
cml28kvpj01eb4sq4wo0t80ca	cml28kvlh00wt4sq4ifjo8zbe	cml28kvm800zp4sq4ht8588a1	2	0	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.664	2026-01-31 11:36:22.664
cml28kvpk01ef4sq4hvag1848	cml28kvmw012g4sq42geb6kgi	cml28kvmz012o4sq4tleu6659	0	0	cml27qnzj001jjutzcib47vfb	2025-01-23 17:45:00	FINISHED	Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi	2026-01-31 11:36:22.665	2026-01-31 11:36:22.665
cml28kvpl01ej4sq42b03miu3	cmkzls3de001iahfix43hx7lu	cml28kvmw012d4sq4p6eob1g9	2	1	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Old Trafford	2026-01-31 11:36:22.666	2026-01-31 11:36:22.666
cml28kvpm01en4sq44xwlf5mv	cml28kvn0012s4sq4jeca9p5a	cml28kvm900zs4sq4q36rqvpf	2	0	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Deutsche Bank Park	2026-01-31 11:36:22.667	2026-01-31 11:36:22.667
cml28kvpn01er4sq4ugpz8yze	cml28kvjg00sg4sq4mdkvtsn5	cml28kvmq011o4sq4b4vf6zn7	1	0	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Borås Arena	2026-01-31 11:36:22.668	2026-01-31 11:36:22.668
cml28kvpo01ev4sq4fxsg9e5y	cml28kvmu01254sq44brwnoen	cml28kvmq011p4sq4x8279bzl	3	1	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.669	2026-01-31 11:36:22.669
cml28kvpp01ez4sq4bley156e	cml28kvm400z84sq4f8mb692y	cml28kvmr011s4sq4t4galrbm	0	2	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Huvepharma Arena	2026-01-31 11:36:22.669	2026-01-31 11:36:22.669
cml28kvpq01f34sq4kx38jmjb	cml28kvm400z44sq47q6fox0u	cml28kvmt01214sq4tt8sqkut	2	0	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Stadio Toumbas	2026-01-31 11:36:22.67	2026-01-31 11:36:22.67
cml28kvpr01f74sq4qe801jy4	cml28kvmx012h4sq4rdoch336	cml28kvkr00uo4sq45xh8ygko	2	1	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Stade Roi Baudouin	2026-01-31 11:36:22.671	2026-01-31 11:36:22.671
cml28kvps01fb4sq4jmami2ud	cml28kvlg00wp4sq4y298i35a	cml28kvkn00ug4sq476ilcapv	1	0	cml27qnzj001jjutzcib47vfb	2025-01-23 20:00:00	FINISHED	Daugavas Stadionā	2026-01-31 11:36:22.672	2026-01-31 11:36:22.672
cml28kvps01ff4sq4h3wu7jp4	cmkzls3dd001gahfi64glto0s	cml28kvjg00sg4sq4mdkvtsn5	3	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.673	2026-01-31 11:36:22.673
cml28kvpt01fj4sq4cy6ut2ya	cml28kvmz012o4sq4tleu6659	cml28kvm400z84sq4f8mb692y	1	1	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Groupama Stadium	2026-01-31 11:36:22.674	2026-01-31 11:36:22.674
cml28kvpu01fn4sq4xgup2ox1	cml28kvmq011o4sq4b4vf6zn7	cml28kvmo011g4sq44d5wu2qx	1	1	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Allianz Riviera	2026-01-31 11:36:22.675	2026-01-31 11:36:22.675
cml28kvpv01fr4sq4c84xcv0c	cml28kvkn00ug4sq476ilcapv	cml28kvmu01284sq4y31bogl4	2	1	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Johan Cruijff ArenA	2026-01-31 11:36:22.676	2026-01-31 11:36:22.676
cml28kvpw01fv4sq4j0r5rbn9	cml28kvkr00uo4sq45xh8ygko	cml28kvmu01254sq44brwnoen	1	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Estádio Municipal de Braga	2026-01-31 11:36:22.677	2026-01-31 11:36:22.677
cml28kvpx01fz4sq431hp7z7m	cml28kvmw012d4sq4p6eob1g9	cml28kvmx012h4sq4rdoch336	2	1	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Ibrox Stadium	2026-01-31 11:36:22.678	2026-01-31 11:36:22.678
cml28kvpy01g34sq4mc26w0nc	cml28kvmr011s4sq4t4galrbm	cml28kvmw012g4sq42geb6kgi	2	2	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	MCH Arena	2026-01-31 11:36:22.678	2026-01-31 11:36:22.678
cml28kvpz01g74sq4yexaizuj	cml28kvmp011l4sq4ihv1xt4e	cml28kvm700zh4sq4b2f4ifoz	1	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	De Grolsch Veste	2026-01-31 11:36:22.68	2026-01-31 11:36:22.68
cml28kvq001gb4sq4c1gxcqtl	cml28kvn301344sq4p4w76fpc	cml28kvn0012s4sq4jeca9p5a	2	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.68	2026-01-31 11:36:22.68
cml28kvq101gf4sq4jdryx4bm	cml28kvn301354sq4k9iltpoi	cml28kvlh00wt4sq4ifjo8zbe	3	1	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.681	2026-01-31 11:36:22.681
cml28kvq201gj4sq4zeo6h64t	cml28kvmq011p4sq4x8279bzl	cml28kvm400z44sq47q6fox0u	2	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Reale Arena	2026-01-31 11:36:22.682	2026-01-31 11:36:22.682
cml28kvq301gn4sq4jm4g5pwe	cml28kvmz012p4sq4y75u87nu	cml28kvmy012l4sq4zlig6gs2	3	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Stadio Georgios Karaiskáki	2026-01-31 11:36:22.683	2026-01-31 11:36:22.683
cml28kvq401gr4sq4vdpzlcu9	cml28kvm800zp4sq4ht8588a1	cml28kvmr011t4sq4np5h7zd7	3	4	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Lotto Park	2026-01-31 11:36:22.684	2026-01-31 11:36:22.684
cml28kvq401gv4sq4rxsy0zct	cml28kvm200yx4sq4xlz11znp	cmkzls3de001iahfix43hx7lu	0	2	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Arena Naţională	2026-01-31 11:36:22.685	2026-01-31 11:36:22.685
cml28kvq501gz4sq4zrkxstx1	cml28kvmt01214sq4tt8sqkut	cml28kvmv012c4sq4mzdwqpqq	2	2	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Fortuna Arena	2026-01-31 11:36:22.686	2026-01-31 11:36:22.686
cml28kvq601h34sq44ch7r27h	cml28kvmt01244sq4qxn1tvue	cml28kvlg00wp4sq4y298i35a	1	0	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Volksparkstadion	2026-01-31 11:36:22.687	2026-01-31 11:36:22.687
cml28kvq701h74sq4ab17ypwr	cml28kvl600vt4sq4szxbdlhn	cml28kvmo011h4sq4q2f970fb	0	1	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Stadion Partizana	2026-01-31 11:36:22.688	2026-01-31 11:36:22.688
cml28kvq801hb4sq4g6bqbytm	cml28kvm900zs4sq4q36rqvpf	cml28kvmn011c4sq44k3vsvfb	4	3	cml27qnzj001jjutzcib47vfb	2025-01-30 20:00:00	FINISHED	Groupama Aréna	2026-01-31 11:36:22.688	2026-01-31 11:36:22.688
cml28kvq901hf4sq4ep6awhnb	cml28kvmr011s4sq4t4galrbm	cml28kvmq011p4sq4x8279bzl	1	2	cml27qnzj001jjutzcib47vfb	2025-02-13 17:45:00	FINISHED	MCH Arena	2026-01-31 11:36:22.689	2026-01-31 11:36:22.689
cml28kvqa01hj4sq4gqjjs7ak	cml28kvmw012g4sq42geb6kgi	cml28kvm800zp4sq4ht8588a1	3	0	cml27qnzj001jjutzcib47vfb	2025-02-13 17:45:00	FINISHED	Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi	2026-01-31 11:36:22.69	2026-01-31 11:36:22.69
cml28kvqb01hn4sq4345almsg	cml28kvm900zs4sq4q36rqvpf	cml28kvlh00wt4sq4ifjo8zbe	1	0	cml27qnzj001jjutzcib47vfb	2025-02-13 17:45:00	FINISHED	Groupama Aréna	2026-01-31 11:36:22.691	2026-01-31 11:36:22.691
cml28kvqb01hr4sq4rgs1wkop	cml28kvmx012h4sq4rdoch336	cml28kvkn00ug4sq476ilcapv	0	2	cml27qnzj001jjutzcib47vfb	2025-02-13 17:45:00	FINISHED	Stade Roi Baudouin	2026-01-31 11:36:22.692	2026-01-31 11:36:22.692
cml28kvqc01hv4sq4bz6q2pyb	cml28kvmn011c4sq44k3vsvfb	cml28kvmu01284sq4y31bogl4	4	1	cml27qnzj001jjutzcib47vfb	2025-02-13 20:00:00	FINISHED	AFAS Stadion	2026-01-31 11:36:22.693	2026-01-31 11:36:22.693
cml28kvqd01hz4sq4lk4eyiw9	cml28kvmo011h4sq4q2f970fb	cml28kvn301344sq4p4w76fpc	1	1	cml27qnzj001jjutzcib47vfb	2025-02-13 20:00:00	FINISHED	Estádio Do Dragão	2026-01-31 11:36:22.694	2026-01-31 11:36:22.694
cml28kvqe01i34sq4125x9qxl	cml28kvmp011l4sq4ihv1xt4e	cml28kvmo011g4sq44d5wu2qx	2	1	cml27qnzj001jjutzcib47vfb	2025-02-13 20:00:00	FINISHED	De Grolsch Veste	2026-01-31 11:36:22.695	2026-01-31 11:36:22.695
cml28kvqf01i74sq4ayhoksho	cml28kvm400z44sq47q6fox0u	cml28kvm200yx4sq4xlz11znp	1	2	cml27qnzj001jjutzcib47vfb	2025-02-13 20:00:00	FINISHED	Stadio Toumbas	2026-01-31 11:36:22.696	2026-01-31 11:36:22.696
cml28kvqg01ib4sq4qydbsiub	cml28kvmo011g4sq44d5wu2qx	cml28kvmp011l4sq4ihv1xt4e	5	2	cml27qnzj001jjutzcib47vfb	2025-02-20 17:45:00	SCHEDULED	Aspmyra Stadion	2026-01-31 11:36:22.696	2026-01-31 11:36:22.696
cml28kvqh01if4sq4gtvrgmev	cml28kvn301344sq4p4w76fpc	cml28kvmo011h4sq4q2f970fb	3	2	cml27qnzj001jjutzcib47vfb	2025-02-20 17:45:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.697	2026-01-31 11:36:22.697
cml28kvqi01ij4sq4u7xz1chy	cml28kvm200yx4sq4xlz11znp	cml28kvm400z44sq47q6fox0u	2	0	cml27qnzj001jjutzcib47vfb	2025-02-20 17:45:00	FINISHED	Arena Naţională	2026-01-31 11:36:22.698	2026-01-31 11:36:22.698
cml28kvqj01in4sq4kxrgo9jq	cml28kvmu01284sq4y31bogl4	cml28kvmn011c4sq44k3vsvfb	2	2	cml27qnzj001jjutzcib47vfb	2025-02-20 17:45:00	FINISHED	RAMS Park	2026-01-31 11:36:22.699	2026-01-31 11:36:22.699
cml28kvqj01ir4sq4coxto12q	cml28kvkn00ug4sq476ilcapv	cml28kvmx012h4sq4rdoch336	1	2	cml27qnzj001jjutzcib47vfb	2025-02-20 20:00:00	SCHEDULED	Johan Cruijff ArenA	2026-01-31 11:36:22.7	2026-01-31 11:36:22.7
cml28kvqk01iv4sq4iy7nlu1i	cml28kvmq011p4sq4x8279bzl	cml28kvmr011s4sq4t4galrbm	5	2	cml27qnzj001jjutzcib47vfb	2025-02-20 20:00:00	FINISHED	Reale Arena	2026-01-31 11:36:22.701	2026-01-31 11:36:22.701
cml28kvql01iz4sq453shc7px	cml28kvm800zp4sq4ht8588a1	cml28kvmw012g4sq42geb6kgi	2	2	cml27qnzj001jjutzcib47vfb	2025-02-20 20:00:00	FINISHED	Lotto Park	2026-01-31 11:36:22.702	2026-01-31 11:36:22.702
cml28kvqm01j34sq41y54o1na	cml28kvlh00wt4sq4ifjo8zbe	cml28kvm900zs4sq4q36rqvpf	3	0	cml27qnzj001jjutzcib47vfb	2025-02-20 20:00:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.703	2026-01-31 11:36:22.703
cml28kvqn01j74sq41p4mjn8s	cml28kvmn011c4sq44k3vsvfb	cmkzls3dd001gahfi64glto0s	1	0	cml27qnzj001jjutzcib47vfb	2025-03-06 17:45:00	FINISHED	AFAS Stadion	2026-01-31 11:36:22.703	2026-01-31 11:36:22.703
cml28kvqo01jb4sq4vq797fer	cml28kvmq011p4sq4x8279bzl	cmkzls3de001iahfix43hx7lu	1	1	cml27qnzj001jjutzcib47vfb	2025-03-06 17:45:00	FINISHED	Reale Arena	2026-01-31 11:36:22.704	2026-01-31 11:36:22.704
cml28kvqp01jf4sq462j3ygkv	cml28kvm200yx4sq4xlz11znp	cml28kvmz012o4sq4tleu6659	1	3	cml27qnzj001jjutzcib47vfb	2025-03-06 17:45:00	FINISHED	Arena Naţională	2026-01-31 11:36:22.705	2026-01-31 11:36:22.705
cml28kvqq01jj4sq4q7uzlpfb	cml28kvmw012g4sq42geb6kgi	cml28kvmw012d4sq4p6eob1g9	1	3	cml27qnzj001jjutzcib47vfb	2025-03-06 17:45:00	FINISHED	Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi	2026-01-31 11:36:22.706	2026-01-31 11:36:22.706
cml28kvqr01jn4sq415oxf3p0	cml28kvkn00ug4sq476ilcapv	cml28kvn0012s4sq4jeca9p5a	1	2	cml27qnzj001jjutzcib47vfb	2025-03-06 20:00:00	FINISHED	Johan Cruijff ArenA	2026-01-31 11:36:22.707	2026-01-31 11:36:22.707
cml28kvqs01jr4sq4bse3kgy4	cml28kvmo011g4sq44d5wu2qx	cml28kvmz012p4sq4y75u87nu	3	0	cml27qnzj001jjutzcib47vfb	2025-03-06 20:00:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.708	2026-01-31 11:36:22.708
cml28kvqt01jv4sq4jw8i6e8k	cml28kvn301344sq4p4w76fpc	cml28kvn301354sq4k9iltpoi	2	1	cml27qnzj001jjutzcib47vfb	2025-03-06 20:00:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.709	2026-01-31 11:36:22.709
cml28kvqu01jz4sq4ie4noee5	cml28kvlh00wt4sq4ifjo8zbe	cml28kvmu01254sq44brwnoen	1	2	cml27qnzj001jjutzcib47vfb	2025-03-06 20:00:00	FINISHED	Doosan Aréna	2026-01-31 11:36:22.71	2026-01-31 11:36:22.71
cml28kvqv01k34sq4khenq4ux	cml28kvn0012s4sq4jeca9p5a	cml28kvkn00ug4sq476ilcapv	4	1	cml27qnzj001jjutzcib47vfb	2025-03-13 17:45:00	FINISHED	Deutsche Bank Park	2026-01-31 11:36:22.711	2026-01-31 11:36:22.711
cml28kvqw01k74sq4m2h7jfuf	cml28kvmu01254sq44brwnoen	cml28kvlh00wt4sq4ifjo8zbe	1	1	cml27qnzj001jjutzcib47vfb	2025-03-13 17:45:00	FINISHED	Stadio Olimpico	2026-01-31 11:36:22.712	2026-01-31 11:36:22.712
cml28kvqw01kb4sq4vz31nuk4	cml28kvn301354sq4k9iltpoi	cml28kvn301344sq4p4w76fpc	3	1	cml27qnzj001jjutzcib47vfb	2025-03-13 17:45:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.713	2026-01-31 11:36:22.713
cml28kvqx01kf4sq43i3clltm	cml28kvmz012p4sq4y75u87nu	cml28kvmo011g4sq44d5wu2qx	2	1	cml27qnzj001jjutzcib47vfb	2025-03-13 17:45:00	FINISHED	Stadio Georgios Karaiskáki	2026-01-31 11:36:22.714	2026-01-31 11:36:22.714
cml28kvqy01kj4sq46mm4g601	cmkzls3de001iahfix43hx7lu	cml28kvmq011p4sq4x8279bzl	4	1	cml27qnzj001jjutzcib47vfb	2025-03-13 20:00:00	FINISHED	Old Trafford	2026-01-31 11:36:22.715	2026-01-31 11:36:22.715
cml28kvqz01kn4sq4r81hyx4l	cmkzls3dd001gahfi64glto0s	cml28kvmn011c4sq44k3vsvfb	3	1	cml27qnzj001jjutzcib47vfb	2025-03-13 20:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.716	2026-01-31 11:36:22.716
cml28kvr001kr4sq413wesy44	cml28kvmz012o4sq4tleu6659	cml28kvm200yx4sq4xlz11znp	4	0	cml27qnzj001jjutzcib47vfb	2025-03-13 20:00:00	FINISHED	Groupama Stadium	2026-01-31 11:36:22.717	2026-01-31 11:36:22.717
cml28kvr101kv4sq4t2valhbw	cml28kvmw012d4sq4p6eob1g9	cml28kvmw012g4sq42geb6kgi	0	2	cml27qnzj001jjutzcib47vfb	2025-03-13 20:00:00	SCHEDULED	Ibrox Stadium	2026-01-31 11:36:22.717	2026-01-31 11:36:22.717
cml28kvr201kz4sq42jtc6gy7	cml28kvmo011g4sq44d5wu2qx	cml28kvmu01254sq44brwnoen	2	0	cml27qnzj001jjutzcib47vfb	2025-04-10 16:45:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.718	2026-01-31 11:36:22.718
cml28kvr301l34sq4ug6lp2re	cmkzls3dd001gahfi64glto0s	cml28kvn0012s4sq4jeca9p5a	1	1	cml27qnzj001jjutzcib47vfb	2025-04-10 19:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.719	2026-01-31 11:36:22.719
cml28kvr401l74sq4pteq2zpj	cml28kvmz012o4sq4tleu6659	cmkzls3de001iahfix43hx7lu	2	2	cml27qnzj001jjutzcib47vfb	2025-04-10 19:00:00	FINISHED	Groupama Stadium	2026-01-31 11:36:22.72	2026-01-31 11:36:22.72
cml28kvr501lb4sq4rq9q4nsf	cml28kvmw012d4sq4p6eob1g9	cml28kvn301354sq4k9iltpoi	0	0	cml27qnzj001jjutzcib47vfb	2025-04-10 19:00:00	FINISHED	Ibrox Stadium	2026-01-31 11:36:22.721	2026-01-31 11:36:22.721
cml28kvr601lf4sq446zfq2u1	cmkzls3de001iahfix43hx7lu	cml28kvmz012o4sq4tleu6659	5	4	cml27qnzj001jjutzcib47vfb	2025-04-17 19:00:00	SCHEDULED	Old Trafford	2026-01-31 11:36:22.722	2026-01-31 11:36:22.722
cml28kvr601lj4sq4ior3og9c	cml28kvn0012s4sq4jeca9p5a	cmkzls3dd001gahfi64glto0s	0	1	cml27qnzj001jjutzcib47vfb	2025-04-17 19:00:00	FINISHED	Deutsche Bank Park	2026-01-31 11:36:22.723	2026-01-31 11:36:22.723
cml28kvr701ln4sq4v0shobaq	cml28kvmu01254sq44brwnoen	cml28kvmo011g4sq44d5wu2qx	3	1	cml27qnzj001jjutzcib47vfb	2025-04-17 19:00:00	SCHEDULED	Stadio Olimpico	2026-01-31 11:36:22.724	2026-01-31 11:36:22.724
cml28kvr801lr4sq4ode2qy9z	cml28kvn301354sq4k9iltpoi	cml28kvmw012d4sq4p6eob1g9	2	0	cml27qnzj001jjutzcib47vfb	2025-04-17 19:00:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.725	2026-01-31 11:36:22.725
cml28kvr901lv4sq4b1rsh7zd	cmkzls3dd001gahfi64glto0s	cml28kvmo011g4sq44d5wu2qx	3	1	cml27qnzj001jjutzcib47vfb	2025-05-01 19:00:00	FINISHED	Tottenham Hotspur Stadium	2026-01-31 11:36:22.726	2026-01-31 11:36:22.726
cml28kvra01lz4sq4lthbw3tc	cml28kvn301354sq4k9iltpoi	cmkzls3de001iahfix43hx7lu	0	3	cml27qnzj001jjutzcib47vfb	2025-05-01 19:00:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.726	2026-01-31 11:36:22.726
cml28kvrb01m34sq4kwktb0bv	cmkzls3de001iahfix43hx7lu	cml28kvn301354sq4k9iltpoi	4	1	cml27qnzj001jjutzcib47vfb	2025-05-08 19:00:00	FINISHED	Old Trafford	2026-01-31 11:36:22.727	2026-01-31 11:36:22.727
cml28kvrc01m74sq419vcfcok	cml28kvmo011g4sq44d5wu2qx	cmkzls3dd001gahfi64glto0s	0	2	cml27qnzj001jjutzcib47vfb	2025-05-08 19:00:00	FINISHED	Aspmyra Stadion	2026-01-31 11:36:22.728	2026-01-31 11:36:22.728
cml28kvrd01mb4sq4knnidapg	cmkzls3dd001gahfi64glto0s	cmkzls3de001iahfix43hx7lu	1	0	cml27qnzj001jjutzcib47vfb	2025-05-21 19:00:00	FINISHED	San Mamés Barria	2026-01-31 11:36:22.729	2026-01-31 11:36:22.729
cml2athnh002pq3lvxvo2m93x	cmkzls3dd001eahfictql1xwk	cmkzls3dc001cahfiw7bp74no	2	0	cmkzls3d90013ahfiml40logc	2026-01-29 17:00:00	FINISHED	\N	2026-01-31 12:39:03.582	2026-01-31 12:39:03.582
cml2athnk002rq3lvt6kr1d9w	cmkzls3dc001dahfit1gifb95	cmkzls3df001kahfipkuqd4k0	1	1	cmkzls3d90013ahfiml40logc	2026-01-28 17:00:00	FINISHED	\N	2026-01-31 12:39:03.585	2026-01-31 12:39:03.585
cml2athnl002tq3lvlcsfa91f	cmkzls3de001iahfix43hx7lu	cmkzls3dd001gahfi64glto0s	2	3	cmkzls3d90013ahfiml40logc	2026-01-27 17:00:00	FINISHED	\N	2026-01-31 12:39:03.585	2026-01-31 12:39:03.585
cml2athnl002vq3lvbmfjblw1	cmkzls3dd001fahfih1zdhp38	cmkzls3df001lahfiri2p3kme	1	0	cmkzls3d90013ahfiml40logc	2026-01-26 17:00:00	FINISHED	\N	2026-01-31 12:39:03.585	2026-01-31 12:39:03.585
cml2athnl002xq3lvb2i3imbh	cmkzls3de001hahfio06aynzj	cmkzls3de001jahfin127ldl4	3	1	cmkzls3d90013ahfiml40logc	2026-01-25 17:00:00	FINISHED	\N	2026-01-31 12:39:03.586	2026-01-31 12:39:03.586
cml2athnm002zq3lv18d7l0vi	cmkzls3df001kahfipkuqd4k0	cmkzls3dd001eahfictql1xwk	0	2	cmkzls3d90013ahfiml40logc	2026-01-24 17:00:00	FINISHED	\N	2026-01-31 12:39:03.586	2026-01-31 12:39:03.586
cml2athnm0031q3lvzh1qhx22	cmkzls3dc001cahfiw7bp74no	cmkzls3dc001dahfit1gifb95	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-02 17:00:00	SCHEDULED	\N	2026-01-31 12:39:03.586	2026-01-31 12:39:03.586
cml2athnm0033q3lvojiyxtaw	cmkzls3dd001gahfi64glto0s	cmkzls3dd001eahfictql1xwk	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-03 17:00:00	SCHEDULED	\N	2026-01-31 12:39:03.587	2026-01-31 12:39:03.587
cml2athnm0035q3lveb9p40u5	cmkzls3df001kahfipkuqd4k0	cmkzls3de001iahfix43hx7lu	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-05 17:00:00	SCHEDULED	\N	2026-01-31 12:39:03.587	2026-01-31 12:39:03.587
cml2athnn0037q3lvjbq4uxm6	cmkzls3df001lahfiri2p3kme	cmkzls3de001hahfio06aynzj	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-06 17:00:00	SCHEDULED	\N	2026-01-31 12:39:03.587	2026-01-31 12:39:03.587
cml2athnn0039q3lv957kufde	cmkzls3de001jahfin127ldl4	cmkzls3dd001fahfih1zdhp38	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-07 17:00:00	SCHEDULED	\N	2026-01-31 12:39:03.587	2026-01-31 12:39:03.587
cml841i2g002pznof3xt219ls	cmkzls3dd001eahfictql1xwk	cmkzls3dc001cahfiw7bp74no	2	0	cmkzls3d90013ahfiml40logc	2026-02-02 17:00:00	FINISHED	\N	2026-02-04 14:15:57.113	2026-02-04 14:15:57.113
cml841i2l002rznofxg4wfict	cmkzls3dc001dahfit1gifb95	cmkzls3df001kahfipkuqd4k0	1	1	cmkzls3d90013ahfiml40logc	2026-02-01 17:00:00	FINISHED	\N	2026-02-04 14:15:57.118	2026-02-04 14:15:57.118
cml841i2l002tznof2b1e6e9k	cmkzls3de001iahfix43hx7lu	cmkzls3dd001gahfi64glto0s	2	3	cmkzls3d90013ahfiml40logc	2026-01-31 17:00:00	FINISHED	\N	2026-02-04 14:15:57.118	2026-02-04 14:15:57.118
cml841i2m002vznofqdwij32u	cmkzls3dd001fahfih1zdhp38	cmkzls3df001lahfiri2p3kme	1	0	cmkzls3d90013ahfiml40logc	2026-01-30 17:00:00	FINISHED	\N	2026-02-04 14:15:57.118	2026-02-04 14:15:57.118
cml841i2m002xznofi9iphxdq	cmkzls3de001hahfio06aynzj	cmkzls3de001jahfin127ldl4	3	1	cmkzls3d90013ahfiml40logc	2026-01-29 17:00:00	FINISHED	\N	2026-02-04 14:15:57.118	2026-02-04 14:15:57.118
cml841i2m002zznof1ll75lj4	cmkzls3df001kahfipkuqd4k0	cmkzls3dd001eahfictql1xwk	0	2	cmkzls3d90013ahfiml40logc	2026-01-28 17:00:00	FINISHED	\N	2026-02-04 14:15:57.119	2026-02-04 14:15:57.119
cml841i2m0031znofqbq76qhs	cmkzls3dc001cahfiw7bp74no	cmkzls3dc001dahfit1gifb95	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-06 17:00:00	SCHEDULED	\N	2026-02-04 14:15:57.119	2026-02-04 14:15:57.119
cml841i2n0033znoft5a93t4r	cmkzls3dd001gahfi64glto0s	cmkzls3dd001eahfictql1xwk	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-07 17:00:00	SCHEDULED	\N	2026-02-04 14:15:57.119	2026-02-04 14:15:57.119
cml841i2n0035znofg08ypnx3	cmkzls3df001kahfipkuqd4k0	cmkzls3de001iahfix43hx7lu	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-09 17:00:00	SCHEDULED	\N	2026-02-04 14:15:57.119	2026-02-04 14:15:57.119
cml841i2n0037znofla187k4l	cmkzls3df001lahfiri2p3kme	cmkzls3de001hahfio06aynzj	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-10 17:00:00	SCHEDULED	\N	2026-02-04 14:15:57.12	2026-02-04 14:15:57.12
cml841i2n0039znofzwnjc1g2	cmkzls3de001jahfin127ldl4	cmkzls3dd001fahfih1zdhp38	\N	\N	cmkzls3d90013ahfiml40logc	2026-02-11 17:00:00	SCHEDULED	\N	2026-02-04 14:15:57.12	2026-02-04 14:15:57.12
\.


--
-- Data for Name: Page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Page" (id, title, slug, content, "metaTitle", "metaDescription", "isPublished", "createdAt", "updatedAt") FROM stdin;
cmkzls3dw003gahfi0h7m5l9q	Ответственная игра	responsible-gaming	<h2>Ответственная игра</h2><p>Мы заботимся о наших пользователях и поддерживаем принципы ответственной игры.</p><h3>Признаки проблемной игры</h3><ul><li>Вы тратите больше денег, чем можете себе позволить</li><li>Вы играете, чтобы отвлечься от проблем</li><li>Вы пытаетесь отыграть проигрыши</li><li>Вы занимаете деньги для игры</li></ul><h3>Что делать?</h3><p>Если вы или ваши близкие столкнулись с проблемой игровой зависимости, обратитесь за помощью к специалистам.</p><h3>Полезные ресурсы</h3><p>Горячая линия психологической помощи: 8-800-2000-122 (бесплатно по России)</p><h3>Помните</h3><p>Азартные игры предназначены для развлечения. Играйте ответственно!</p>	\N	\N	t	2026-01-29 15:22:35.684	2026-02-04 14:15:57.128
cmkzls3dv003eahfiaptn2nun	Политика конфиденциальности	privacy-policy	<h2>Политика конфиденциальности</h2><p>Последнее обновление: Декабрь 2024</p><p>Настоящая Политика конфиденциальности описывает, как Тренды Спорта собирает, использует и передаёт информацию о вас при использовании нашего веб-сайта.</p><h3>Какую информацию мы собираем</h3><p>Мы собираем информацию, которую вы предоставляете нам напрямую, например, при создании учётной записи, подписке на рассылку или обращении к нам.</p><h3>Как мы используем информацию</h3><p>Мы используем собранную информацию для предоставления, поддержки и улучшения наших услуг, а также для связи с вами.</p>	\N	\N	t	2026-01-29 15:22:35.684	2026-02-04 14:15:57.127
cmkzls3dw003fahfiqw5d1e4v	Политика Cookie	cookie-policy	<h2>Политика использования Cookie</h2><p>Последнее обновление: Декабрь 2024</p><p>Настоящая Политика Cookie объясняет, как Тренды Спорта использует файлы cookie и аналогичные технологии.</p><h3>Что такое Cookie?</h3><p>Cookie — это небольшие текстовые файлы, которые размещаются на вашем устройстве при посещении веб-сайта.</p><h3>Как мы используем Cookie</h3><p>Мы используем cookie для анализа трафика сайта, персонализации контента и показа целевой рекламы.</p><h3>Ваш выбор</h3><p>Вы можете управлять cookie через настройки браузера. Однако отключение cookie может повлиять на функциональность нашего веб-сайта.</p>	\N	\N	t	2026-01-29 15:22:35.684	2026-02-04 14:15:57.128
cmkzls3dw003hahfi4nhvnkp7	Реклама	advertising	<h2>Размещение рекламы</h2><p>Охватите миллионы увлечённых спортивных болельщиков через нашу рекламную платформу.</p><p>Мы предлагаем различные варианты рекламы, включая баннерную рекламу, спонсорский контент и спонсорство рассылки.</p><h3>Контакты</h3><p>Свяжитесь с нами по адресу reklama@trendysporta.ru для получения информации о тарифах и наличии мест.</p><h3>Преимущества</h3><ul><li>Целевая аудитория спортивных болельщиков</li><li>Высокая вовлечённость пользователей</li><li>Гибкие форматы размещения</li></ul>	\N	\N	t	2026-01-29 15:22:35.685	2026-02-04 14:15:57.128
cmkzls3dv003cahfisbowfqu1	Контакты	contacts	<h2>Контакты</h2><p>Свяжитесь с нами по любым вопросам:</p><h3>Редакция</h3><p>Email: info@trendysporta.ru</p><h3>Реклама</h3><p>Email: reklama@trendysporta.ru</p><h3>Техническая поддержка</h3><p>Email: support@trendysporta.ru</p><h3>Адрес</h3><p>г. Москва, ул. Спортивная, д. 1</p>	\N	\N	t	2026-01-29 15:22:35.683	2026-02-04 14:15:57.124
cmkzls3dv003dahfi9m59eki2	Пользовательское соглашение	user-agreement	<div class="user-agreement-content">\n  <p class="document-info">Сайт: Тренды спорта<br>Дата вступления в силу: 30.12.2025<br>Версия: 1.1</p>\n  <h2>ПРЕАМБУЛА</h2>\n  <p>Настоящее Пользовательское соглашение (далее – «Соглашение») регулирует отношения между Обществом с ограниченной ответственностью «МГ Маркетинг» (ИНН 9729386454, ОГРН 1247700667136) (далее – «Оператор», «Администрация») и любым физическим лицом, использующим Сайт (далее – «Пользователь»), в том числе без регистрации.</p>\n  <div class="warning-box"><strong>ВАЖНО:</strong> Данный Сайт является зарегистрированным СМИ распространяет информацию спортивного характера, а также информацию о букмекерских конторах, имеющих лицензию в Российской Федерации, рейтинги букмекеров, новости спорта и аналитические материалы. Сайт НЕ ЯВЛЯЕТСЯ букмекерской конторой. Сайт не принимает ставки, не организует азартные игры и не осуществляет игровую деятельность. Контент Сайта предназначен исключительно для лиц старше 18 лет.</div>\n  <h2>ОБЩИЕ ПОЛОЖЕНИЯ</h2>\n  <h3>Определение и статус Сайта</h3>\n  <p>Сайт является зарегистрированным спортивным сетевым средством массовой информации (Свидетельство о регистрации средств массовой информации: ЭЛ № ФС 77 – 90561, выдано Федеральной службой по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзором) 23.12.2025 г.)</p>\n  <h3>Определение Пользователя</h3>\n  <p>Пользователем признается любое дееспособное физическое лицо старше 18 лет, которое использует Сайт в режиме реального времени, без регистрации.</p>\n  <h3>Сфера действия Соглашения</h3>\n  <p>Настоящее Соглашение распространяется на все отношения, связанные с использованием Пользователем функциональности Сайта;</p>\n  <p>Оператор не контролирует и не несет ответственности за сайты третьих лиц, на которые Пользователь может перейти по ссылкам со Сайта. Использование таких сайтов осуществляется на риск Пользователя в соответствии с их условиями использования.</p>\n  <h3>Обязательность соглашения</h3>\n  <p>Использование Сайта любым способом означает полное принятие Пользователем всех условий настоящего Соглашения в том виде, в котором они опубликованы.</p>\n  <p>В случае несогласия с условиями Соглашения Пользователь обязан незамедлительно прекратить использование Сайта.</p>\n  <h3>Изменение Соглашения</h3>\n  <p>Оператор вправе вносить изменения в Соглашение в одностороннем порядке без какого-либо специального уведомления Пользователя. Новая редакция Соглашения вступает в силу с момента её опубликования на Сайте. Продолжение использования Сайта после опубликования новой редакции означает согласие Пользователя с произведенными изменениями.</p>\n  <h2>ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ ОПЕРАТОРА</h2>\n  <div class="info-box info-box-red"><h4>Что Сайт НЕ делает</h4><p>Сайт явно НЕ:</p><ul><li>не принимает ставки и не организует азартные игры;</li><li>не является букмекерской конторой;</li><li>не гарантирует результаты прогнозов и аналитических материалов;</li><li>не предоставляет финансовые консультации и рекомендации по ставкам;</li><li>не имеет лицензии на ведение игорного бизнеса;</li><li>не осуществляет торговлю финансовыми инструментами.</li></ul></div>\n  <h3>Сайт не несёт ответственности за</h3>\n  <p>Финансовые потери, убытки или иные материальные убытки Пользователя, понесенные в результате:</p>\n  <ul><li>использования информации, размещенной на Сайте;</li><li>участия в азартных играх, ставках или пари;</li><li>нарушения букмекерами своих обязательств перед Пользователями;</li><li>неточности, неполноту или устаревание информации о букмекерских конторах;</li><li>действий третьих лиц, включая капперов, аналитиков.</li></ul>\n  <p>Персональные финансовые решения Пользователя, принятые на основе информации со Сайта.</p>\n  <p>Действия или бездействие букмекерских контор, представленных на Сайте.</p>\n  <h3>Отказ от гарантий</h3>\n  <p>Сайт предоставляется на условиях «как есть» и «как доступно» без каких-либо гарантий, включая гарантии:</p>\n  <ul><li>беспрерывного функционирования;</li><li>отсутствия ошибок;</li><li>точности и надежности информации;</li><li>соответствия информации действительности;</li><li>защиты от вредоносных программ.</li></ul>\n  <h2>ВОЗРАСТНОЕ ОГРАНИЧЕНИЕ И ПРОВЕРКА ВОЗРАСТА</h2>\n  <div class="warning-box warning-box-fraud"><h4>Возрастное требование</h4><p>Контент Сайта предназначен исключительно для лиц старше 18 лет. Лица, не достигшие 18 лет, категорически запрещается использовать Сайт.</p></div>\n  <h3>Проверка возраста</h3>\n  <p>Пользователь гарантирует Оператору, что ему исполнилось 18 лет и что он обладает полной дееспособностью для заключения Соглашения.</p>\n  <p>Оператор вправе использовать доступные технические и организационные меры для проверки соответствия возрастным требованиям.</p>\n  <h2>АВТОРСКИЕ ПРАВА И ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ</h2>\n  <h3>Собственность Оператора</h3>\n  <p>Все материалы, размещенные на Сайте, включая, но не ограничиваясь:</p>\n  <ul><li>тексты, статьи и аналитические материалы;</li><li>фотографии, графику и видеоконтент;</li><li>рейтинги, данные и статистику;</li><li>исходный код и базы данных;</li><li>логотип и фирменный стиль;</li><li>прочие объекты интеллектуальной собственности;</li></ul>\n  <p>являются объектами авторского права, принадлежащими Оператору или используемыми им на законных основаниях.</p>\n  <p>Весь контент Сайта охраняется авторским правом в соответствии с законодательством Российской Федерации и международными соглашениями.</p>\n  <h3>Права Пользователя на использование контента</h3>\n  <p>Пользователю предоставляется простое (неисключительное) право на просмотр контента Сайта исключительно для личного, некоммерческого использования.</p>\n  <p>Пользователь может загружать («скачивать») материалы только для личного использования, при условии сохранения всех знаков авторского права и авторства.</p>\n  <h3>Запрещенные действия</h3>\n  <p>Пользователю запрещается:</p>\n  <ul><li>копировать, распространять, передавать третьим лицам материалы со Сайта без письменного разрешения Оператора;</li><li>использовать материалы в коммерческих целях;</li><li>модифицировать, адаптировать, переводить контент;</li><li>удалять или изменять указания на авторские права;</li><li>создавать производные работы на основе контента Сайта;</li><li>использовать контент в целях конкуренции с Оператором;</li><li>применять боты, скреперы и автоматизированные средства для сбора данных со Сайта, за исключением случаев, когда это явно разрешено Оператором;</li></ul>\n  <h3>Уведомление о нарушении авторских прав</h3>\n  <p>При обнаружении нарушения авторских прав правообладатель может направить Оператору заявление на адрес электронной почты.</p>\n  <p>Заявление должно содержать:</p>\n  <ul><li>информацию о правообладателе;</li><li>описание произведения, нарушающего авторское право;</li><li>ссылку на материал на Сайте;</li><li>обоснование нарушения;</li><li>подпись и контактную информацию.</li></ul>\n  <p>Оператор обязуется рассмотреть заявление в течение 24 часов и, при подтверждении нарушения, удалить материал.</p>\n  <h2>ПРАВИЛА ПОВЕДЕНИЯ НА САЙТЕ</h2>\n  <h3>Общие требования</h3>\n  <p>При использовании Сайта Пользователь обязан:</p>\n  <ul><li>соблюдать действующее законодательство Российской Федерации;</li><li>соблюдать положения настоящего Соглашения;</li><li>уважать права и достоинство других Пользователей и третьих лиц;</li><li>воздерживаться от действий, которые могут повредить репутации Сайта.</li></ul>\n  <p>Пользователь гарантирует, что не включен в реестр физических лиц, отказавшихся от участия в азартных играх, и берет на себя обязательство немедленно прервать использование Сайта, если его статус изменится на указанный.</p>\n  <h3>Запрещенные действия</h3>\n  <p>Пользователям запрещается:</p>\n  <p><strong>Использование запрещенных технологий:</strong></p>\n  <ul><li>использовать боты, парсеры, скреперы для автоматического сбора данных;</li><li>осуществлять несанкционированный доступ к системам Сайта;</li><li>атаковать Сайт (DDoS-атаки, SQL-инъекции и т.д.).</li></ul>\n  <p><strong>Нарушение функционирования:</strong></p>\n  <ul><li>загружать и распространять вредоносное программное обеспечение;</li><li>перегружать серверы Сайта;</li><li>использовать Сайт для фишинга и кража личных данных.</li></ul>\n  <h2>ОБРАБОТКА ПЕРСОНАЛЬНЫХ ДАННЫХ</h2>\n  <h3>Применимые политики</h3>\n  <p>Обработка персональных данных Пользователя осуществляется в соответствии с:</p>\n  <ul><li>Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»;</li><li><a href="/page/privacy-policy">Политикой конфиденциальности</a>;</li><li><a href="/page/cookie-policy">Политикой в отношении файлов cookie</a>.</li></ul>\n  <p>Указанные документы являются неотъемлемой частью настоящего Соглашения.</p>\n  <h3>Категории собираемых данных</h3>\n  <p>Оператор собирает следующие категории персональных данных:</p>\n  <p><strong>Добровольно предоставляемые данные:</strong></p>\n  <ul><li>Адрес электронной почты в случае направления обращения в адрес Сайта.</li><li>Фамилия, имя, отчество в случае направления обращения в адрес Сайта.</li><li>Файлы cookie Пользователя, разрешенные к обработке путём проставления согласия в чек-боксе всплывающего баннера согласия, согласно <a href="/page/cookie-policy">Политике в отношении файлов cookie</a>.</li></ul>\n  <p><strong>Автоматически собираемые данные:</strong></p>\n  <ul><li>IP-адрес;</li><li>информация о браузере и операционной системе;</li><li>данные о поведении на Сайте;</li><li>файлы cookie.</li></ul>\n  <h3>Безопасность данных</h3>\n  <p>Оператор примет все необходимые меры для защиты персональных данных от несанкционированного доступа, нарушения конфиденциальности и целостности.</p>\n  <h2>ФАЙЛЫ COOKIE И ОТСЛЕЖИВАНИЕ</h2>\n  <h3>Использование файлов cookie</h3>\n  <p>Сайт использует файлы cookie для:</p>\n  <ul><li>функционирования Сайта;</li><li>сохранения пользовательских настроек;</li><li>аналитики и улучшения Сайта;</li><li>персонализации контента и рекламы.</li></ul>\n  <h3>Типы cookie</h3>\n  <p>Обязательные cookie активированы по умолчанию без согласия.</p>\n  <p>Функциональные, аналитические и рекламные cookie требуют согласия Пользователя, которое может быть предоставлено через баннер при первом посещении.</p>\n  <h3>Управление cookie</h3>\n  <p>Пользователь может управлять файлами cookie через настройки браузера или отказаться от них, однако это может влиять на функциональность Сайта.</p>\n  <h2>КОНТАКТЫ И ПОДДЕРЖКА</h2>\n  <h3>Контактная информация Оператора</h3>\n  <ul><li><strong>Оператор:</strong> ООО «МГ Маркетинг»</li><li><strong>ИНН:</strong> 9729386454</li><li><strong>ОГРН:</strong> 1247700667136</li><li><strong>Адрес для корреспонденции:</strong> 119607, г. Москва, вн.тер.г. Муниципальный округ Раменки, Пр-кт Мичуринский, д. 27 к. 3, помещ. 12Н.</li></ul>\n  <h3>Обращения Пользователей</h3>\n  <p>Пользователи могут обращаться к Оператору с вопросами, предложениями и жалобами через форму обратной связи на Сайте или по электронной почте.</p>\n  <h2>РАЗРЕШЕНИЕ СПОРОВ</h2>\n  <p>Все споры между Оператором и Пользователем разрешаются в соответствии с законодательством Российской Федерации.</p>\n  <p>При возникновении споров Стороны обязуются приложить все усилия для их разрешения путем переговоров.</p>\n  <p>В случае невозможности разрешить спор путем переговоров, он подлежит рассмотрению в суде Российской Федерации по месту нахождения Оператора.</p>\n  <p>Все претензии должны подаваться в письменной форме или на адрес электронной почты Оператора с обязательным направлением физической копии на юридический адрес Оператора.</p>\n  <h2>ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ И ОТКАЗ</h2>\n  <h3>Полная ответственность Пользователя</h3>\n  <p>Пользователь несет полную и единоличную ответственность за все свои действия на Сайте и информацию, которую он размещает.</p>\n  <p>Пользователь возмещает все убытки и вред, понесенные Оператором в результате:</p>\n  <ul><li>нарушения Пользователем законодательства;</li><li>нарушения Пользователем условий Соглашения;</li></ul>\n  <h3>Отказ от ответственности Оператора</h3>\n  <p>Сайт предоставляется на условиях «как есть» без каких-либо гарантий.</p>\n  <p>Оператор не несет ответственности за:</p>\n  <ul><li>убытки, понесенные Пользователем при использовании Сайта;</li><li>точность, полноту и своевременность информации;</li><li>непрерывность функционирования Сайта;</li><li>технические ошибки и сбои;</li><li>действия третьих лиц;</li><li>утрату данных или работоспособности устройств Пользователя;</li><li>последствия использования информации со Сайта.</li></ul>\n  <h2>ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>\n  <p>В случае, если одно или более положений настоящего Соглашения являются недействительными, такая недействительность не должна оказывать влияния на действительность других положений Соглашения. При этом Соглашение должно толковаться таким образом, как если бы оно не содержал такого недействительного положения.</p>\n  <p>Соглашение вступает в силу с момента начала использования Сайта и действует бессрочно до тех пор, пока Пользователь использует Сайт.</p>\n  <p>Оператор вправе в любое время в одностороннем порядке расторгнуть Соглашение и запретить доступ к Сайту без указания причины.</p>\n  <div class="highlight"><p>© 2026 ООО «МГ Маркетинг». Все права защищены.<br>Последнее обновление: 15.01.2026</p></div>\n</div>	Пользовательское соглашение | Тренды спорта	Пользовательское соглашение сайта Тренды спорта. Условия использования сайта.	t	2026-01-29 15:22:35.683	2026-02-04 14:15:57.125
cmkzls3du003bahfil2cy4jid	О нас	about	<h2>О портале Тренды Спорта</h2><p> Мы – спортивное СМИ, всем сердцем любящее спорт. Честно пишем о спорте для тех, кто разделяет нашу страсть!</p><p>Наша команда опытных спортивных журналистов работает круглосуточно, чтобы предоставить вам свежие новости, эксклюзивные интервью и экспертные комментарии по футболу, баскетболу, хоккею, теннису, киберспорту и другим видам спорта.</p><h3>Наша миссия</h3><p>Мы стремимся быть лучшим источником спортивных новостей для русскоязычной аудитории, предоставляя актуальную и достоверную информацию.</p>	\N	\N	t	2026-01-29 15:22:35.683	2026-02-04 14:15:57.123
\.


--
-- Data for Name: Selection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Selection" (id, name, slug, icon, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmkzls3e90041ahfi71ym6rir	Букмекеры с бонусами	bukmekeryi-s-bonusami	gift	1	t	2026-01-29 15:22:35.697	2026-02-04 14:15:57.144
cmkzls3e90042ahfiq2ram9u5	Букмекеры на мобильных	prilozheniya-bukmekerov	smartphone	2	t	2026-01-29 15:22:35.698	2026-02-04 14:15:57.145
cmkzls3ea0043ahfibdelx4x6	Легальные букмекеры	vse-legalnyie-bukmekeryi	diamond	3	t	2026-01-29 15:22:35.698	2026-02-04 14:15:57.145
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSettings" (id, "siteName", "siteDescription", logo, favicon, "socialFacebook", "socialTwitter", "socialInstagram", "socialYoutube", "analyticsCode", "updatedAt") FROM stdin;
default	Тренды спорта	Мы – спортивное СМИ, всем сердцем любящее спорт. Честно пишем о спорте для тех, кто разделяет нашу страсть!	\N	\N	\N	\N	\N	\N	\N	2026-01-29 15:22:35.689
\.


--
-- Data for Name: Standing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Standing" (id, "teamId", "leagueId", "position", played, won, drawn, lost, "goalsFor", "goalsAgainst", points, season, "updatedAt") FROM stdin;
cmkzls3dl0025ahfimpspuigv	cmkzls3df001lahfiri2p3kme	cmkzls3d90013ahfiml40logc	7	15	6	6	3	25	21	24	2026-2027	2026-02-04 14:15:57.111
cmkzls3dl0027ahfivukzp0yw	cmkzls3de001hahfio06aynzj	cmkzls3d90013ahfiml40logc	8	15	6	5	4	20	16	23	2026-2027	2026-02-04 14:15:57.112
cmkzls3dm0029ahfidn7i8uj2	cmkzls3de001iahfix43hx7lu	cmkzls3d90013ahfiml40logc	9	15	5	4	6	18	18	19	2026-2027	2026-02-04 14:15:57.112
cmkzls3dm002bahfiwcd2zivj	cmkzls3de001jahfin127ldl4	cmkzls3d90013ahfiml40logc	10	15	5	3	7	20	27	18	2026-2027	2026-02-04 14:15:57.112
cml28kv8100r64sq4gt27i7od	cml28kuq0000l4sq447ihy0qy	cml27qnzi001djutzaerrkags	1	30	20	7	3	59	23	67	2024	2026-01-31 11:36:22.033
cml28kv8400r94sq4v2pwm5j1	cml28kupp00054sq4jg1hhxmh	cml27qnzi001djutzaerrkags	2	30	20	6	4	58	18	66	2024	2026-01-31 11:36:22.036
cml28kv8600rc4sq4rrglav22	cml28kups00094sq4m4dvklum	cml27qnzi001djutzaerrkags	3	30	17	8	5	47	21	59	2024	2026-01-31 11:36:22.039
cml28kv8900rf4sq4d74279p9	cml28kupy000h4sq4s4frt8xj	cml27qnzi001djutzaerrkags	4	30	17	6	7	56	25	57	2024	2026-01-31 11:36:22.042
cml28kv8e00ri4sq4812v9jxm	cml28kupv000c4sq4ie08laju	cml27qnzi001djutzaerrkags	5	30	16	8	6	61	35	56	2024	2026-01-31 11:36:22.046
cml28kv8g00rl4sq49ei2w9ee	cml28kupd00004sq43ox6f90y	cml27qnzi001djutzaerrkags	6	30	15	8	7	51	41	53	2024	2026-01-31 11:36:22.048
cml28kv8i00ro4sq455m8c1ad	cml28kuq6000t4sq4sdr8nlgd	cml27qnzi001djutzaerrkags	7	30	13	6	11	42	45	45	2024	2026-01-31 11:36:22.05
cml28kv8k00rr4sq440togsqr	cml28kups00084sq4jo3thxdt	cml27qnzi001djutzaerrkags	8	30	10	9	11	41	43	39	2024	2026-01-31 11:36:22.052
cml28kv8l00ru4sq4svsz7sgf	cml28kuph00014sq44rnnx4ex	cml27qnzi001djutzaerrkags	9	30	10	5	15	39	55	35	2024	2026-01-31 11:36:22.054
cml28kv8n00rx4sq45d3c8r30	cml28kupo00044sq42b51grvb	cml27qnzi001djutzaerrkags	10	30	8	7	15	36	51	31	2024	2026-01-31 11:36:22.055
cml28kv8p00s04sq439hd0555	cml28kv8o00ry4sq406dwadzy	cml27qnzi001djutzaerrkags	11	30	6	11	13	27	35	29	2024	2026-01-31 11:36:22.057
cml28kv8r00s34sq4qkya63hy	cml28kuq2000o4sq4bu9tjjpu	cml27qnzi001djutzaerrkags	12	30	6	11	13	35	56	29	2024	2026-01-31 11:36:22.059
cml28kv8s00s64sq44m2pwo3g	cml28kuq6000s4sq435go25ax	cml27qnzi001djutzaerrkags	13	30	7	6	17	27	54	27	2024	2026-01-31 11:36:22.06
cml28kv8t00s94sq4y2jjeshe	cml28kuq0000k4sq42641xa14	cml27qnzi001djutzaerrkags	14	30	4	13	13	27	48	25	2024	2026-01-31 11:36:22.062
cml28kv8v00sc4sq4y54cxky1	cml28kupy000g4sq49ipxycuy	cml27qnzi001djutzaerrkags	15	30	4	7	19	28	56	19	2024	2026-01-31 11:36:22.063
cml28kv8w00sf4sq45n5klhfi	cml28kupw000d4sq41fvfy0sf	cml27qnzi001djutzaerrkags	16	30	2	12	16	14	42	18	2024	2026-01-31 11:36:22.065
cml28kw2a01me4sq4z8mdvbnl	cml28kvmu01254sq44brwnoen	cml27qnzj001jjutzcib47vfb	1	8	6	1	1	17	5	19	2024	2026-01-31 11:36:23.122
cml28kw2b01mh4sq4utey2j1t	cml28kvn301354sq4k9iltpoi	cml27qnzj001jjutzcib47vfb	2	8	6	1	1	15	7	19	2024	2026-01-31 11:36:23.124
cml28kw2c01mk4sq4m0v878oe	cmkzls3de001iahfix43hx7lu	cml27qnzj001jjutzcib47vfb	3	8	5	3	0	16	9	18	2024	2026-01-31 11:36:23.125
cml28kw2d01mn4sq40yuprad6	cmkzls3dd001gahfi64glto0s	cml27qnzj001jjutzcib47vfb	4	8	5	2	1	17	9	17	2024	2026-01-31 11:36:23.126
cmkzls3di001tahfirui4h3t0	cmkzls3dd001eahfictql1xwk	cmkzls3d90013ahfiml40logc	1	15	11	4	0	33	12	37	2026-2027	2026-02-04 14:15:57.109
cmkzls3di001vahfippoqm0q1	cmkzls3df001kahfipkuqd4k0	cmkzls3d90013ahfiml40logc	2	15	9	4	2	32	17	31	2026-2027	2026-02-04 14:15:57.11
cmkzls3dj001xahfiveksa79t	cmkzls3dc001dahfit1gifb95	cmkzls3d90013ahfiml40logc	3	15	8	5	2	30	15	29	2026-2027	2026-02-04 14:15:57.11
cmkzls3dk001zahfig5h1481w	cmkzls3dc001cahfiw7bp74no	cmkzls3d90013ahfiml40logc	4	15	8	4	3	28	20	28	2026-2027	2026-02-04 14:15:57.11
cmkzls3dk0021ahfifaun7gx7	cmkzls3dd001gahfi64glto0s	cmkzls3d90013ahfiml40logc	5	15	8	3	4	35	20	27	2026-2027	2026-02-04 14:15:57.111
cmkzls3dl0023ahfixycaie47	cmkzls3dd001fahfih1zdhp38	cmkzls3d90013ahfiml40logc	6	15	7	4	4	24	22	25	2026-2027	2026-02-04 14:15:57.111
cml28kw2e01mq4sq4n5o0hjqn	cml28kvn0012s4sq4jeca9p5a	cml27qnzj001jjutzcib47vfb	5	8	5	1	2	14	10	16	2024	2026-01-31 11:36:23.127
cml28kw2g01mt4sq4j7no9uld	cml28kvmz012o4sq4tleu6659	cml27qnzj001jjutzcib47vfb	6	8	4	3	1	16	8	15	2024	2026-01-31 11:36:23.129
cml28kw2h01mw4sq46e54v5hn	cml28kvmz012p4sq4y75u87nu	cml27qnzj001jjutzcib47vfb	7	8	4	3	1	9	3	15	2024	2026-01-31 11:36:23.13
cml28kw2i01mz4sq4gc3096o3	cml28kvmw012d4sq4p6eob1g9	cml27qnzj001jjutzcib47vfb	8	8	4	2	2	16	10	14	2024	2026-01-31 11:36:23.131
cml28kw2j01n24sq4f6b96qxe	cml28kvmo011g4sq44d5wu2qx	cml27qnzj001jjutzcib47vfb	9	8	4	2	2	14	11	14	2024	2026-01-31 11:36:23.132
cml28kw2l01n54sq4hoilq6de	cml28kvm800zp4sq4ht8588a1	cml27qnzj001jjutzcib47vfb	10	8	4	2	2	14	12	14	2024	2026-01-31 11:36:23.133
cml28kw2l01n84sq4qciqquex	cml28kvm200yx4sq4xlz11znp	cml27qnzj001jjutzcib47vfb	11	8	4	2	2	10	9	14	2024	2026-01-31 11:36:23.134
cml28kw2m01nb4sq4cri2lflj	cml28kvkn00ug4sq476ilcapv	cml27qnzj001jjutzcib47vfb	12	8	4	1	3	16	8	13	2024	2026-01-31 11:36:23.135
cml28kw2o01ne4sq47pukhfoo	cml28kvmq011p4sq4x8279bzl	cml27qnzj001jjutzcib47vfb	13	8	4	1	3	13	9	13	2024	2026-01-31 11:36:23.136
cml28kw2p01nh4sq4vbwjo7pw	cml28kvmu01284sq4y31bogl4	cml27qnzj001jjutzcib47vfb	14	8	3	4	1	19	16	13	2024	2026-01-31 11:36:23.137
cml28kw2q01nk4sq4fnro0os0	cml28kvn301344sq4p4w76fpc	cml27qnzj001jjutzcib47vfb	15	8	3	3	2	10	6	12	2024	2026-01-31 11:36:23.138
cml28kw2r01nn4sq44h4igdqc	cml28kvlh00wt4sq4ifjo8zbe	cml27qnzj001jjutzcib47vfb	16	8	3	3	2	13	12	12	2024	2026-01-31 11:36:23.14
cml28kw2s01nq4sq481ab3v6x	cml28kvm900zs4sq4q36rqvpf	cml27qnzj001jjutzcib47vfb	17	8	4	0	4	15	15	12	2024	2026-01-31 11:36:23.141
cml28kw2t01nt4sq4mjaz1lgh	cml28kvmo011h4sq4q2f970fb	cml27qnzj001jjutzcib47vfb	18	8	3	2	3	13	11	11	2024	2026-01-31 11:36:23.141
cml28kw2u01nw4sq4l8pozze6	cml28kvmn011c4sq44k3vsvfb	cml27qnzj001jjutzcib47vfb	19	8	3	2	3	13	13	11	2024	2026-01-31 11:36:23.142
cml28kw2v01nz4sq42eezqwti	cml28kvmr011s4sq4t4galrbm	cml27qnzj001jjutzcib47vfb	20	8	3	2	3	9	9	11	2024	2026-01-31 11:36:23.143
cml28kw2w01o24sq439kl54sp	cml28kvmx012h4sq4rdoch336	cml27qnzj001jjutzcib47vfb	21	8	3	2	3	8	8	11	2024	2026-01-31 11:36:23.144
cml28kw2x01o54sq4ekz69j5n	cml28kvm400z44sq47q6fox0u	cml27qnzj001jjutzcib47vfb	22	8	3	1	4	12	10	10	2024	2026-01-31 11:36:23.145
cml28kw2x01o84sq4aqtw5fw9	cml28kvmp011l4sq4ihv1xt4e	cml27qnzj001jjutzcib47vfb	23	8	2	4	2	8	9	10	2024	2026-01-31 11:36:23.146
cml28kw2y01ob4sq4w1oyopde	cml28kw2y01o94sq4dmsyhfjm	cml27qnzj001jjutzcib47vfb	24	8	2	4	2	9	11	10	2024	2026-01-31 11:36:23.147
cml28kw2z01oe4sq43uhtovkj	cml28kvkr00uo4sq45xh8ygko	cml27qnzj001jjutzcib47vfb	25	8	3	1	4	9	12	10	2024	2026-01-31 11:36:23.148
cml28kw3001oh4sq4yrgem55s	cml28kvjg00sg4sq4mdkvtsn5	cml27qnzj001jjutzcib47vfb	26	8	3	1	4	9	14	10	2024	2026-01-31 11:36:23.148
cml28kw3101ok4sq47lm9du1a	cml28kvmr011t4sq4np5h7zd7	cml27qnzj001jjutzcib47vfb	27	8	2	3	3	11	14	9	2024	2026-01-31 11:36:23.149
cml28kw3201on4sq4qqpkovkx	cml28kw3101ol4sq4zx3c3197	cml27qnzj001jjutzcib47vfb	28	8	3	0	5	10	15	9	2024	2026-01-31 11:36:23.15
cml28kw3301oq4sq4banztbx4	cml28kvl600vt4sq4szxbdlhn	cml27qnzj001jjutzcib47vfb	29	8	2	0	6	8	17	6	2024	2026-01-31 11:36:23.151
cml28kw3301ot4sq46c3bmts5	cml28kvmt01214sq4tt8sqkut	cml27qnzj001jjutzcib47vfb	30	8	1	2	5	7	11	5	2024	2026-01-31 11:36:23.152
cml28kw3401ow4sq4knk8lym3	cml28kvmv012c4sq4mzdwqpqq	cml27qnzj001jjutzcib47vfb	31	8	1	2	5	10	17	5	2024	2026-01-31 11:36:23.152
cml28kw3501oz4sq45u1272kg	cml28kvlg00wp4sq4y298i35a	cml27qnzj001jjutzcib47vfb	32	8	1	2	5	6	13	5	2024	2026-01-31 11:36:23.153
cml28kw3601p24sq4r3fj71lx	cml28kvm400z84sq4f8mb692y	cml27qnzj001jjutzcib47vfb	33	8	0	4	4	4	11	4	2024	2026-01-31 11:36:23.154
cml28kw3601p54sq4u5yrozw6	cml28kvmt01244sq4qxn1tvue	cml27qnzj001jjutzcib47vfb	34	8	1	1	6	5	18	4	2024	2026-01-31 11:36:23.155
cml28kw3701p84sq4sl4xx7a6	cml28kvmq011o4sq4b4vf6zn7	cml27qnzj001jjutzcib47vfb	35	8	0	3	5	7	16	3	2024	2026-01-31 11:36:23.156
cml28kw3801pb4sq4y19lja6m	cml28kvmy012l4sq4zlig6gs2	cml27qnzj001jjutzcib47vfb	36	8	1	0	7	6	20	3	2024	2026-01-31 11:36:23.156
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name, slug, "createdAt") FROM stdin;
cmkzls3dq002yahfioc0jac3k	Трансфер	transfer	2026-01-29 15:22:35.679
cmkzls3dr002zahfi2nhnq8ja	Превью матча	match-preview	2026-01-29 15:22:35.679
cmkzls3dr0030ahfiwpuuuhei	Обзор матча	match-report	2026-01-29 15:22:35.68
cmkzls3dr0031ahfilofwv3u6	Травма	injury	2026-01-29 15:22:35.68
cmkzls3ds0032ahfin7556xua	Срочные новости	breaking-news	2026-01-29 15:22:35.68
cmkzls3ds0033ahfiko0mjvzj	Лига чемпионов	ucl	2026-01-29 15:22:35.68
cmkzls3ds0034ahfix0737bn1	Месси	messi	2026-01-29 15:22:35.681
cmkzls3ds0035ahfibsoify7w	Роналду	ronaldo	2026-01-29 15:22:35.681
cmkzls3dt0036ahfiq5tnsm52	Премьер-лига	premier-league-tag	2026-01-29 15:22:35.681
cmkzls3dt0037ahfifpdiaybo	Ла Лига	la-liga-tag	2026-01-29 15:22:35.681
cmkzls3dt0038ahfi86rwuqyh	Ставки	stavki	2026-01-29 15:22:35.682
cmkzls3dt0039ahfiqd6h7ww5	Прогнозы	prognozy	2026-01-29 15:22:35.682
cmkzls3du003aahfi2y892cfs	Букмекеры	bukmekeryi-tag	2026-01-29 15:22:35.682
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Team" (id, name, slug, "shortName", logo, country, "createdAt", "updatedAt") FROM stdin;
cml28kc9j000p8o0uez7uocj7	Baltika	baltika	\N	https://media.api-sports.io/football/teams/2006.png	\N	2026-01-31 11:35:57.464	2026-01-31 11:35:57.702
cmkzls3dd001eahfictql1xwk	Ливерпуль	liverpool	Ливерпуль	\N	Англия	2026-01-29 15:22:35.665	2026-02-04 14:15:57.105
cmkzls3dd001fahfih1zdhp38	Астон Вилла	aston-villa	Астон Вилла	\N	Англия	2026-01-29 15:22:35.666	2026-02-04 14:15:57.105
cmkzls3de001hahfio06aynzj	Ньюкасл	newcastle	Ньюкасл	\N	Англия	2026-01-29 15:22:35.666	2026-02-04 14:15:57.106
cmkzls3de001iahfix43hx7lu	Манчестер Юнайтед	manchester-united	Ман Юнайтед	https://media.api-sports.io/football/teams/33.png	Англия	2026-01-29 15:22:35.666	2026-02-04 14:15:57.106
cmkzls3dc001dahfit1gifb95	Арсенал	arsenal	Арсенал	\N	Англия	2026-01-29 15:22:35.665	2026-02-04 14:15:57.105
cmkzls3de001jahfin127ldl4	Вест Хэм	west-ham	Вест Хэм	\N	Англия	2026-01-29 15:22:35.667	2026-02-04 14:15:57.106
cml28kvjg00sg4sq4mdkvtsn5	IF Elfsborg	if-elfsborg	\N	https://media.api-sports.io/football/teams/372.png	\N	2026-01-31 11:36:22.444	2026-01-31 11:36:23.148
cmkzls3df001lahfiri2p3kme	Брайтон	brighton	Брайтон	\N	Англия	2026-01-29 15:22:35.667	2026-02-04 14:15:57.107
cmkzls3df001mahfip6n6y8qg	Реал Мадрид	real-madrid	Реал	\N	Испания	2026-01-29 15:22:35.668	2026-02-04 14:15:57.107
cmkzls3df001nahfir8jg7roo	Барселона	barcelona	Барса	\N	Испания	2026-01-29 15:22:35.668	2026-02-04 14:15:57.107
cmkzls3dg001oahfio9eph4yz	Атлетико Мадрид	atletico-madrid	Атлетико	\N	Испания	2026-01-29 15:22:35.668	2026-02-04 14:15:57.107
cmkzls3dg001pahfiy9bjumco	Жирона	girona	Жирона	\N	Испания	2026-01-29 15:22:35.668	2026-02-04 14:15:57.108
cmkzls3dg001qahfiuvyxb5iy	Бавария	bayern-munich	Бавария	\N	Германия	2026-01-29 15:22:35.669	2026-02-04 14:15:57.108
cmkzls3dg001rahfi0ypaokb3	ПСЖ	psg	ПСЖ	\N	Франция	2026-01-29 15:22:35.669	2026-02-04 14:15:57.108
cmkzls3dc001cahfiw7bp74no	Манчестер Сити	manchester-city	Ман Сити	\N	Англия	2026-01-29 15:22:35.664	2026-02-04 14:15:57.103
cml28kc9e00088o0uw1g06dvm	Ural	ural	\N	https://media.api-sports.io/football/teams/1084.png	\N	2026-01-31 11:35:57.459	2026-01-31 11:36:21.65
cml28kc9i000l8o0uowglr6fz	Ska-khabarovsk	ska-khabarovsk	\N	https://media.api-sports.io/football/teams/1087.png	\N	2026-01-31 11:35:57.463	2026-01-31 11:35:57.703
cml28kc9d00048o0ujtjz89go	Enisey	enisey	\N	https://media.api-sports.io/football/teams/1089.png	\N	2026-01-31 11:35:57.457	2026-01-31 11:35:57.704
cml28kc9h000h8o0ur5avpwfx	Tyumen	tyumen	\N	https://media.api-sports.io/football/teams/2000.png	\N	2026-01-31 11:35:57.461	2026-01-31 11:35:57.704
cml28kc9k000t8o0ujvrw5jua	FK Sokol Saratov	fk-sokol-saratov	\N	https://media.api-sports.io/football/teams/1995.png	\N	2026-01-31 11:35:57.465	2026-01-31 11:35:57.705
cml28kc9k000s8o0uuxgdxwle	Chayka	chayka	\N	https://media.api-sports.io/football/teams/3983.png	\N	2026-01-31 11:35:57.464	2026-01-31 11:35:57.705
cml28kc9g000d8o0u9np07t6b	Rotor Volgograd	rotor-volgograd	\N	https://media.api-sports.io/football/teams/2010.png	\N	2026-01-31 11:35:57.46	2026-01-31 11:35:57.706
cml28kc9l000x8o0u12p1mj55	FC UFA	fc-ufa	\N	https://media.api-sports.io/football/teams/1078.png	\N	2026-01-31 11:35:57.466	2026-01-31 11:35:57.706
cml28kc9i000k8o0ux2depc2f	Torpedo Moskva	torpedo-moskva	\N	https://media.api-sports.io/football/teams/3985.png	\N	2026-01-31 11:35:57.462	2026-01-31 11:35:57.707
cml28kc9d00058o0u625c1fu5	KAMAZ	kamaz	\N	https://media.api-sports.io/football/teams/6801.png	\N	2026-01-31 11:35:57.457	2026-01-31 11:35:57.707
cml28kc9l000w8o0uk08352oy	Alaniya Vladikavkaz	alaniya-vladikavkaz	\N	https://media.api-sports.io/football/teams/6787.png	\N	2026-01-31 11:35:57.465	2026-01-31 11:35:57.708
cml28kc9h000g8o0up1atkack	FK Neftekhimik	fk-neftekhimik	\N	https://media.api-sports.io/football/teams/2001.png	\N	2026-01-31 11:35:57.461	2026-01-31 11:35:57.708
cml28kc9900018o0u6pgykhgr	Chernomorets	chernomorets	\N	https://media.api-sports.io/football/teams/6791.png	\N	2026-01-31 11:35:57.453	2026-01-31 11:35:57.708
cml28kc9f00098o0u4mo2okiw	FC Sochi	fc-sochi	\N	https://media.api-sports.io/football/teams/2012.png	\N	2026-01-31 11:35:57.459	2026-01-31 11:36:21.649
cml28kc9600008o0uyfudq48v	Arsenal Tula	arsenal-tula	\N	https://media.api-sports.io/football/teams/1077.png	\N	2026-01-31 11:35:57.451	2026-01-31 11:35:57.702
cml28kc9j000o8o0ud1i5bl7h	Rodina Moskva	rodina-moskva	\N	https://media.api-sports.io/football/teams/6822.png	\N	2026-01-31 11:35:57.463	2026-01-31 11:35:57.709
cml28kc9f000c8o0u39q2fsk8	Shinnik Yaroslavl	shinnik-yaroslavl	\N	https://media.api-sports.io/football/teams/1998.png	\N	2026-01-31 11:35:57.46	2026-01-31 11:35:57.709
cml28kuph00014sq44rnnx4ex	Akron	akron	\N	https://media.api-sports.io/football/teams/6786.png	\N	2026-01-31 11:36:21.366	2026-01-31 11:36:22.053
cml28kupp00054sq4jg1hhxmh	Zenit	zenit	\N	https://media.api-sports.io/football/teams/596.png	\N	2026-01-31 11:36:21.373	2026-01-31 11:36:22.036
cml28kupy000g4sq49ipxycuy	FC Orenburg	fc-orenburg	\N	https://media.api-sports.io/football/teams/1080.png	\N	2026-01-31 11:36:21.382	2026-01-31 11:36:22.063
cml28kuq3000p4sq4lyailgfi	Dinamo Makhachkala	dinamo-makhachkala	\N	https://media.api-sports.io/football/teams/6813.png	\N	2026-01-31 11:36:21.387	2026-01-31 11:36:21.647
cml28kuq6000t4sq4sdr8nlgd	Rubin	rubin	\N	https://media.api-sports.io/football/teams/1083.png	\N	2026-01-31 11:36:21.391	2026-01-31 11:36:22.05
cml28kupd00004sq43ox6f90y	Lokomotiv	lokomotiv	\N	https://media.api-sports.io/football/teams/597.png	\N	2026-01-31 11:36:21.361	2026-01-31 11:36:22.048
cml28kupw000d4sq41fvfy0sf	Fakel	fakel	\N	https://media.api-sports.io/football/teams/1993.png	\N	2026-01-31 11:36:21.38	2026-01-31 11:36:22.064
cml28kuq0000k4sq42641xa14	Akhmat	akhmat	\N	https://media.api-sports.io/football/teams/1085.png	\N	2026-01-31 11:36:21.384	2026-01-31 11:36:22.061
cml28kuq0000l4sq447ihy0qy	FC Krasnodar	fc-krasnodar	\N	https://media.api-sports.io/football/teams/621.png	\N	2026-01-31 11:36:21.385	2026-01-31 11:36:22.03
cml28kupo00044sq42b51grvb	Krylia Sovetov	krylia-sovetov	\N	https://media.api-sports.io/football/teams/1079.png	\N	2026-01-31 11:36:21.372	2026-01-31 11:36:22.055
cml28kupy000h4sq4s4frt8xj	Spartak Moscow	spartak-moscow	\N	https://media.api-sports.io/football/teams/558.png	\N	2026-01-31 11:36:21.383	2026-01-31 11:36:22.04
cml28kups00084sq4jo3thxdt	FC Rostov	fc-rostov	\N	https://media.api-sports.io/football/teams/779.png	\N	2026-01-31 11:36:21.376	2026-01-31 11:36:22.051
cml28kupv000c4sq4ie08laju	Dynamo	dynamo	\N	https://media.api-sports.io/football/teams/1088.png	\N	2026-01-31 11:36:21.379	2026-01-31 11:36:22.045
cml28kups00094sq4m4dvklum	CSKA Moscow	cska-moscow	\N	https://media.api-sports.io/football/teams/555.png	\N	2026-01-31 11:36:21.377	2026-01-31 11:36:22.038
cml28kuq6000s4sq435go25ax	Nizhny Novgorod	nizhny-novgorod	\N	https://media.api-sports.io/football/teams/2011.png	\N	2026-01-31 11:36:21.39	2026-01-31 11:36:22.06
cml28kv8o00ry4sq406dwadzy	Makhachkala	makhachkala	\N	https://media.api-sports.io/football/teams/6813.png	\N	2026-01-31 11:36:22.056	2026-01-31 11:36:22.056
cml28kuq2000o4sq4bu9tjjpu	Khimki	khimki	\N	https://media.api-sports.io/football/teams/1994.png	\N	2026-01-31 11:36:21.387	2026-01-31 11:36:22.058
cml28kvjk00sk4sq40hdi3ism	Sheriff Tiraspol	sheriff-tiraspol	\N	https://media.api-sports.io/football/teams/568.png	\N	2026-01-31 11:36:22.449	2026-01-31 11:36:22.494
cml28kvji00sh4sq4z84xat7b	Pafos	pafos	\N	https://media.api-sports.io/football/teams/3403.png	\N	2026-01-31 11:36:22.446	2026-01-31 11:36:22.47
cmkzls3df001kahfipkuqd4k0	Челси	chelsea	Челси	\N	Англия	2026-01-29 15:22:35.667	2026-02-04 14:15:57.106
cml28kvjx00t14sq4hzbsv8mb	Llapi	llapi	\N	https://media.api-sports.io/football/teams/14395.png	\N	2026-01-31 11:36:22.462	2026-01-31 11:36:22.463
cml28kvjt00st4sq482qzc0i7	FK Tobol Kostanay	fk-tobol-kostanay	\N	https://media.api-sports.io/football/teams/2259.png	\N	2026-01-31 11:36:22.457	2026-01-31 11:36:22.465
cml28kvjl00sl4sq472mij1iu	Zira	zira	\N	https://media.api-sports.io/football/teams/648.png	\N	2026-01-31 11:36:22.449	2026-01-31 11:36:22.467
cml28kvmn011c4sq44k3vsvfb	AZ Alkmaar	az-alkmaar	\N	https://media.api-sports.io/football/teams/201.png	\N	2026-01-31 11:36:22.559	2026-01-31 11:36:23.142
cml28kvjn00so4sq4v1yhiwx2	Paks	paks	\N	https://media.api-sports.io/football/teams/2390.png	\N	2026-01-31 11:36:22.451	2026-01-31 11:36:22.473
cml28kvjv00sx4sq4ijjqh8p1	Maribor	maribor	\N	https://media.api-sports.io/football/teams/552.png	\N	2026-01-31 11:36:22.459	2026-01-31 11:36:22.474
cml28kvl600vs4sq4etq5pesl	Panevėžys	panev-ys	\N	https://media.api-sports.io/football/teams/3874.png	\N	2026-01-31 11:36:22.506	2026-01-31 11:36:22.531
cml28kvm700zh4sq4b2f4ifoz	Beşiktaş	be-ikta-	\N	https://media.api-sports.io/football/teams/549.png	\N	2026-01-31 11:36:22.543	2026-01-31 11:36:22.679
cml28kvld00wg4sq4uu8muzdj	FK Partizan	fk-partizan	\N	https://media.api-sports.io/football/teams/573.png	\N	2026-01-31 11:36:22.513	2026-01-31 11:36:22.532
cml28kvkg00u14sq45u2nf6qg	Silkeborg	silkeborg	\N	https://media.api-sports.io/football/teams/2073.png	\N	2026-01-31 11:36:22.481	2026-01-31 11:36:22.495
cml28kvlk00x14sq4mnlq65uo	Lincoln Red Imps FC	lincoln-red-imps-fc	\N	https://media.api-sports.io/football/teams/667.png	\N	2026-01-31 11:36:22.52	2026-01-31 11:36:22.524
cml28kvjs00ss4sq46iya95yy	Ružomberok	ru-omberok	\N	https://media.api-sports.io/football/teams/3549.png	\N	2026-01-31 11:36:22.456	2026-01-31 11:36:22.497
cml28kvkr00up4sq4gwsstqjk	Maccabi Petah Tikva	maccabi-petah-tikva	\N	https://media.api-sports.io/football/teams/4495.png	\N	2026-01-31 11:36:22.492	2026-01-31 11:36:22.498
cml28kvkg00u04sq4bknkqwnt	Molde	molde	\N	https://media.api-sports.io/football/teams/329.png	\N	2026-01-31 11:36:22.48	2026-01-31 11:36:22.548
cml28kvke00tx4sq4xipc8ijk	Trabzonspor	trabzonspor	\N	https://media.api-sports.io/football/teams/998.png	\N	2026-01-31 11:36:22.479	2026-01-31 11:36:22.526
cml28kvjp00sp4sq43isapz76	Corvinul Hunedoara	corvinul-hunedoara	\N	https://media.api-sports.io/football/teams/20034.png	\N	2026-01-31 11:36:22.454	2026-01-31 11:36:22.5
cml28kvju00sw4sq4salzrdkz	Botev Plovdiv	botev-plovdiv	\N	https://media.api-sports.io/football/teams/634.png	\N	2026-01-31 11:36:22.459	2026-01-31 11:36:22.501
cml28kvkk00u94sq4x39metzf	HNK Rijeka	hnk-rijeka	\N	https://media.api-sports.io/football/teams/561.png	\N	2026-01-31 11:36:22.485	2026-01-31 11:36:22.527
cml28kvko00uh4sq4adas7gxs	Vojvodina	vojvodina	\N	https://media.api-sports.io/football/teams/702.png	\N	2026-01-31 11:36:22.488	2026-01-31 11:36:22.502
cml28kvlh00ws4sq4vtwj1qd4	Kryvbas KR	kryvbas-kr	\N	https://media.api-sports.io/football/teams/6489.png	\N	2026-01-31 11:36:22.517	2026-01-31 11:36:22.528
cml28kvkp00uk4sq4q7iym9k9	Kilmarnock	kilmarnock	\N	https://media.api-sports.io/football/teams/250.png	\N	2026-01-31 11:36:22.49	2026-01-31 11:36:22.504
cml28kvkq00ul4sq48mqqxtn4	Cercle Brugge	cercle-brugge	\N	https://media.api-sports.io/football/teams/741.png	\N	2026-01-31 11:36:22.49	2026-01-31 11:36:22.529
cml28kvjx00t04sq4w3i6sn7n	Wisla Krakow	wisla-krakow	\N	https://media.api-sports.io/football/teams/338.png	\N	2026-01-31 11:36:22.461	2026-01-31 11:36:22.505
cml28kvll00x54sq4is0a439l	Servette FC	servette-fc	\N	https://media.api-sports.io/football/teams/2184.png	\N	2026-01-31 11:36:22.521	2026-01-31 11:36:22.533
cml28kvkr00uo4sq45xh8ygko	SC Braga	sc-braga	\N	https://media.api-sports.io/football/teams/217.png	\N	2026-01-31 11:36:22.492	2026-01-31 11:36:23.147
cml28kvli00wx4sq4kzxjxlro	Shamrock Rovers	shamrock-rovers	\N	https://media.api-sports.io/football/teams/652.png	\N	2026-01-31 11:36:22.519	2026-01-31 11:36:22.555
cml28kvl700vx4sq4vm5zfcx8	The New Saints	the-new-saints	\N	https://media.api-sports.io/football/teams/354.png	\N	2026-01-31 11:36:22.508	2026-01-31 11:36:22.522
cml28kvm700zk4sq42hh5o1ep	Jagiellonia	jagiellonia	\N	https://media.api-sports.io/football/teams/336.png	\N	2026-01-31 11:36:22.544	2026-01-31 11:36:22.55
cml28kvlf00wo4sq4rtnu0n2t	UE Santa Coloma	ue-santa-coloma	\N	https://media.api-sports.io/football/teams/703.png	\N	2026-01-31 11:36:22.516	2026-01-31 11:36:22.524
cml28kvmp011l4sq4ihv1xt4e	Twente	twente	\N	https://media.api-sports.io/football/teams/415.png	\N	2026-01-31 11:36:22.561	2026-01-31 11:36:23.146
cml28kvkl00uc4sq4oclaows8	Panathinaikos	panathinaikos	\N	https://media.api-sports.io/football/teams/617.png	\N	2026-01-31 11:36:22.486	2026-01-31 11:36:22.53
cml28kvli00ww4sq4qfoq57vv	Celje	celje	\N	https://media.api-sports.io/football/teams/4360.png	\N	2026-01-31 11:36:22.518	2026-01-31 11:36:22.534
cml28kvm600zd4sq49zmy77u6	TSC Backa Topola	tsc-backa-topola	\N	https://media.api-sports.io/football/teams/2646.png	\N	2026-01-31 11:36:22.542	2026-01-31 11:36:22.557
cml28kvl900w44sq4rigc4bqo	KI Klaksvik	ki-klaksvik	\N	https://media.api-sports.io/football/teams/701.png	\N	2026-01-31 11:36:22.51	2026-01-31 11:36:22.535
cml28kvm300z14sq47k8y18eq	Apoel Nicosia	apoel-nicosia	\N	https://media.api-sports.io/football/teams/2247.png	\N	2026-01-31 11:36:22.539	2026-01-31 11:36:22.548
cml28kvl700vw4sq4ednt5wo7	Petrocub	petrocub	\N	https://media.api-sports.io/football/teams/2271.png	\N	2026-01-31 11:36:22.507	2026-01-31 11:36:22.549
cml28kvl600vt4sq4szxbdlhn	Maccabi Tel Aviv	maccabi-tel-aviv	\N	https://media.api-sports.io/football/teams/604.png	\N	2026-01-31 11:36:22.506	2026-01-31 11:36:23.151
cml28kvm400z84sq4f8mb692y	Ludogorets	ludogorets	\N	https://media.api-sports.io/football/teams/566.png	\N	2026-01-31 11:36:22.541	2026-01-31 11:36:23.154
cml28kvla00w54sq49e8jrie2	Borac Banja Luka	borac-banja-luka	\N	https://media.api-sports.io/football/teams/3364.png	\N	2026-01-31 11:36:22.51	2026-01-31 11:36:22.558
cml28kvm200yx4sq4xlz11znp	FCSB	fcsb	\N	https://media.api-sports.io/football/teams/559.png	\N	2026-01-31 11:36:22.538	2026-01-31 11:36:23.133
cml28kvmo011g4sq44d5wu2qx	Bodo/Glimt	bodo-glimt	\N	https://media.api-sports.io/football/teams/327.png	\N	2026-01-31 11:36:22.56	2026-01-31 11:36:23.131
cml28kvmo011h4sq4q2f970fb	FC Porto	fc-porto	\N	https://media.api-sports.io/football/teams/212.png	\N	2026-01-31 11:36:22.56	2026-01-31 11:36:23.141
cml28kvld00wh4sq4dk18gj9z	FC Lugano	fc-lugano	\N	https://media.api-sports.io/football/teams/606.png	\N	2026-01-31 11:36:22.514	2026-01-31 11:36:22.551
cml28kvlj00x04sq471xgdc79	Dinamo Minsk	dinamo-minsk	\N	https://media.api-sports.io/football/teams/394.png	\N	2026-01-31 11:36:22.52	2026-01-31 11:36:22.552
cml28kvm200yw4sq4scc5frz7	Lask Linz	lask-linz	\N	https://media.api-sports.io/football/teams/1026.png	\N	2026-01-31 11:36:22.538	2026-01-31 11:36:22.553
cml28kvm100yt4sq41wos1zm1	Heart Of Midlothian	heart-of-midlothian	\N	https://media.api-sports.io/football/teams/254.png	\N	2026-01-31 11:36:22.537	2026-01-31 11:36:22.554
cml28kvlg00wp4sq4y298i35a	Rīgas FS	r-gas-fs	\N	https://media.api-sports.io/football/teams/4160.png	\N	2026-01-31 11:36:22.516	2026-01-31 11:36:23.153
cml28kvkc00tt4sq47ekpothm	Rapid Vienna	rapid-vienna	\N	https://media.api-sports.io/football/teams/781.png	\N	2026-01-31 11:36:22.477	2026-01-31 11:36:22.556
cml28kvm900zs4sq4q36rqvpf	Ferencvarosi TC	ferencvarosi-tc	\N	https://media.api-sports.io/football/teams/651.png	\N	2026-01-31 11:36:22.546	2026-01-31 11:36:23.14
cml28kvkn00ug4sq476ilcapv	Ajax	ajax	\N	https://media.api-sports.io/football/teams/194.png	\N	2026-01-31 11:36:22.488	2026-01-31 11:36:23.134
cml28kvm400z44sq47q6fox0u	PAOK	paok	\N	https://media.api-sports.io/football/teams/619.png	\N	2026-01-31 11:36:22.54	2026-01-31 11:36:23.145
cml28kvlh00wt4sq4ifjo8zbe	Plzen	plzen	\N	https://media.api-sports.io/football/teams/567.png	\N	2026-01-31 11:36:22.517	2026-01-31 11:36:23.139
cml28kvn301344sq4p4w76fpc	AS Roma	as-roma	\N	https://media.api-sports.io/football/teams/497.png	\N	2026-01-31 11:36:22.575	2026-01-31 11:36:23.138
cml28kvmr011s4sq4t4galrbm	FC Midtjylland	fc-midtjylland	\N	https://media.api-sports.io/football/teams/397.png	\N	2026-01-31 11:36:22.563	2026-01-31 11:36:23.143
cml28kvmx012h4sq4rdoch336	Union St. Gilloise	union-st-gilloise	\N	https://media.api-sports.io/football/teams/1393.png	\N	2026-01-31 11:36:22.569	2026-01-31 11:36:23.144
cml28kw2y01o94sq4dmsyhfjm	Fenerbahce	fenerbahce	\N	https://media.api-sports.io/football/teams/611.png	\N	2026-01-31 11:36:23.146	2026-01-31 11:36:23.146
cml28kvmr011t4sq4np5h7zd7	1899 Hoffenheim	1899-hoffenheim	\N	https://media.api-sports.io/football/teams/167.png	\N	2026-01-31 11:36:22.563	2026-01-31 11:36:23.149
cml28kw3101ol4sq4zx3c3197	Besiktas	besiktas	\N	https://media.api-sports.io/football/teams/549.png	\N	2026-01-31 11:36:23.15	2026-01-31 11:36:23.15
cml28kvmt01214sq4tt8sqkut	Slavia Praha	slavia-praha	\N	https://media.api-sports.io/football/teams/560.png	\N	2026-01-31 11:36:22.565	2026-01-31 11:36:23.151
cml28kvmv012c4sq4mzdwqpqq	Malmo FF	malmo-ff	\N	https://media.api-sports.io/football/teams/375.png	\N	2026-01-31 11:36:22.568	2026-01-31 11:36:23.152
cml28kvmt01244sq4qxn1tvue	Dynamo Kyiv	dynamo-kyiv	\N	https://media.api-sports.io/football/teams/572.png	\N	2026-01-31 11:36:22.566	2026-01-31 11:36:23.155
cml28kvmq011o4sq4b4vf6zn7	Nice	nice	\N	https://media.api-sports.io/football/teams/84.png	\N	2026-01-31 11:36:22.562	2026-01-31 11:36:23.155
cml28kvmy012l4sq4zlig6gs2	Qarabag	qarabag	\N	https://media.api-sports.io/football/teams/556.png	\N	2026-01-31 11:36:22.57	2026-01-31 11:36:23.156
cmkzls3dd001gahfi64glto0s	Тоттенхэм	tottenham	Тоттенхэм	https://media.api-sports.io/football/teams/47.png	Англия	2026-01-29 15:22:35.666	2026-02-04 14:15:57.105
cml28kvmu01254sq44brwnoen	Lazio	lazio	\N	https://media.api-sports.io/football/teams/487.png	\N	2026-01-31 11:36:22.566	2026-01-31 11:36:23.121
cml28kvn301354sq4k9iltpoi	Athletic Club	athletic-club	\N	https://media.api-sports.io/football/teams/531.png	\N	2026-01-31 11:36:22.576	2026-01-31 11:36:23.123
cml28kvn0012s4sq4jeca9p5a	Eintracht Frankfurt	eintracht-frankfurt	\N	https://media.api-sports.io/football/teams/169.png	\N	2026-01-31 11:36:22.572	2026-01-31 11:36:23.126
cml28kvmz012o4sq4tleu6659	Lyon	lyon	\N	https://media.api-sports.io/football/teams/80.png	\N	2026-01-31 11:36:22.571	2026-01-31 11:36:23.128
cml28kvmz012p4sq4y75u87nu	Olympiakos Piraeus	olympiakos-piraeus	\N	https://media.api-sports.io/football/teams/553.png	\N	2026-01-31 11:36:22.571	2026-01-31 11:36:23.129
cml28kvmw012d4sq4p6eob1g9	Rangers	rangers	\N	https://media.api-sports.io/football/teams/257.png	\N	2026-01-31 11:36:22.568	2026-01-31 11:36:23.13
cml28kvm800zp4sq4ht8588a1	Anderlecht	anderlecht	\N	https://media.api-sports.io/football/teams/554.png	\N	2026-01-31 11:36:22.545	2026-01-31 11:36:23.133
cml28kvmq011p4sq4x8279bzl	Real Sociedad	real-sociedad	\N	https://media.api-sports.io/football/teams/548.png	\N	2026-01-31 11:36:22.562	2026-01-31 11:36:23.135
cml28kvmu01284sq4y31bogl4	Galatasaray	galatasaray	\N	https://media.api-sports.io/football/teams/645.png	\N	2026-01-31 11:36:22.567	2026-01-31 11:36:23.137
cml28kvmw012g4sq42geb6kgi	Fenerbahçe	fenerbah-e	\N	https://media.api-sports.io/football/teams/611.png	\N	2026-01-31 11:36:22.569	2026-01-31 11:36:22.717
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, role, "createdAt", "updatedAt") FROM stdin;
cmkzls3ct0000ahfinu5wsos3	admin@sportsnews.com	$2b$12$PH3ynqBO5qkN54HZy/U8Lu5dE6rVMHspq/txLhICtyi8wt5qnHMKq	Администратор	ADMIN	2026-01-29 15:22:35.645	2026-01-29 15:22:35.645
\.


--
-- Data for Name: _ArticleToTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ArticleToTag" ("A", "B") FROM stdin;
cmkzls3ed0045ahfiekscb7oa	cmkzls3ds0032ahfin7556xua
cmkzls3ef0047ahfida2ke4g9	cmkzls3ds0032ahfin7556xua
cmkzls3eg0049ahfi2mejkv1l	cmkzls3ds0032ahfin7556xua
cmkzls3ei004bahfihl0zqork	cmkzls3ds0032ahfin7556xua
cmkzls3ej004dahfijw1vg8fa	cmkzls3ds0032ahfin7556xua
cmkzls3ek004fahfiybxzo9rh	cmkzls3ds0032ahfin7556xua
cmkzls3em004hahfiyzkp9kka	cmkzls3ds0032ahfin7556xua
cmkzls3en004jahfivzi59wpx	cmkzls3ds0032ahfin7556xua
cmkzls3ep004lahfix4yr9jib	cmkzls3ds0032ahfin7556xua
cmkzls3eq004nahfi1pjqnhlh	cmkzls3ds0032ahfin7556xua
cmkzls3er004pahfi1h292p1c	cmkzls3dq002yahfioc0jac3k
cmkzls3es004rahfimfn92d3e	cmkzls3ds0032ahfin7556xua
cmkzls3et004tahfit7jmr9jf	cmkzls3ds0032ahfin7556xua
cmkzls3ev004vahfizliip4gs	cmkzls3ds0032ahfin7556xua
cmkzls3ew004xahfirrr5kkcs	cmkzls3ds0032ahfin7556xua
cmkzls3ex004zahfie5tvfv5f	cmkzls3ds0032ahfin7556xua
cmkzls3ey0051ahfimpjfryav	cmkzls3ds0032ahfin7556xua
cmkzls3ez0053ahfie4ywfest	cmkzls3ds0032ahfin7556xua
cmkzls3f10055ahfiivt9tbyl	cmkzls3ds0032ahfin7556xua
cmkzls3f20057ahfi1e5xr5rn	cmkzls3dq002yahfioc0jac3k
cmkzls3f30059ahfifd5ctkci	cmkzls3dr0030ahfiwpuuuhei
cmkzls3f4005bahfixcjyclae	cmkzls3ds0032ahfin7556xua
cmkzls3f5005dahfi95hdgmey	cmkzls3dq002yahfioc0jac3k
cmkzls3f6005fahfi56nnnv3k	cmkzls3ds0032ahfin7556xua
cmkzls3f8005hahfin6y4v2xd	cmkzls3ds0032ahfin7556xua
cmkzls3fc005jahfi298bvefq	cmkzls3ds0032ahfin7556xua
cmkzls3fe005lahfi6asskx7v	cmkzls3ds0032ahfin7556xua
cmkzls3ff005nahfimrd4ufnl	cmkzls3ds0032ahfin7556xua
cmkzls3fg005pahfiwo3famrn	cmkzls3dq002yahfioc0jac3k
cmkzls3fh005rahfiupcnoqog	cmkzls3ds0032ahfin7556xua
cmkzls3fi005tahfi7oxedl4l	cmkzls3ds0032ahfin7556xua
cmkzls3fj005vahfibmyndxy8	cmkzls3ds0032ahfin7556xua
cmkzls3fk005xahfif6ua5zb3	cmkzls3ds0032ahfin7556xua
cmkzls3fl005zahfivar7nybg	cmkzls3ds0032ahfin7556xua
cmkzls3fm0061ahfiq537y14g	cmkzls3ds0032ahfin7556xua
cmkzls3fn0063ahfihrm95upb	cmkzls3ds0032ahfin7556xua
cmkzls3fo0065ahfiw0ekco3v	cmkzls3dq002yahfioc0jac3k
cmkzls3fp0067ahfiykqg6n40	cmkzls3ds0032ahfin7556xua
cmkzls3fr0069ahfitypjzosc	cmkzls3ds0032ahfin7556xua
cmkzls3fs006bahfiac1hq5kp	cmkzls3dq002yahfioc0jac3k
cmkzls3ft006dahfinkzd3gch	cmkzls3ds0032ahfin7556xua
cmkzls3fu006fahfiyqqcl28u	cmkzls3ds0032ahfin7556xua
cmkzls3fv006hahfin5fudhsc	cmkzls3ds0032ahfin7556xua
cmkzls3fw006jahfiep6zbfid	cmkzls3ds0032ahfin7556xua
cmkzls3fx006lahfi0bw5qwc4	cmkzls3ds0032ahfin7556xua
cmkzls3fz006nahfi0397tuqx	cmkzls3ds0032ahfin7556xua
cmkzls3g0006pahfid82d7jvn	cmkzls3ds0032ahfin7556xua
cmkzls3g1006rahfiuckw1nnh	cmkzls3ds0032ahfin7556xua
cmkzls3g2006tahfishx39frx	cmkzls3ds0032ahfin7556xua
cmkzls3g3006vahfi13mvwdzb	cmkzls3ds0032ahfin7556xua
cmkzls3g4006xahfij0yczpw4	cmkzls3ds0032ahfin7556xua
cmkzls3g5006zahfi3cqc946d	cmkzls3ds0032ahfin7556xua
cmkzls3g60071ahfip3fpesb7	cmkzls3ds0032ahfin7556xua
cmkzls3g80073ahfiuvztwpci	cmkzls3dq002yahfioc0jac3k
cmkzls3g90075ahfih8zhqwpk	cmkzls3ds0032ahfin7556xua
cmkzls3ga0077ahfil7dm9tkc	cmkzls3ds0032ahfin7556xua
cmkzls3gb0079ahfikv13fpcx	cmkzls3ds0032ahfin7556xua
cmkzls3gd007bahfi9cd6eva7	cmkzls3ds0032ahfin7556xua
cmkzls3ge007dahfiajptm1qn	cmkzls3dq002yahfioc0jac3k
\.


--
-- Name: AdZone AdZone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdZone"
    ADD CONSTRAINT "AdZone_pkey" PRIMARY KEY (id);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Bookmaker Bookmaker_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmaker"
    ADD CONSTRAINT "Bookmaker_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ImportJob ImportJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImportJob"
    ADD CONSTRAINT "ImportJob_pkey" PRIMARY KEY (id);


--
-- Name: ImportNotification ImportNotification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImportNotification"
    ADD CONSTRAINT "ImportNotification_pkey" PRIMARY KEY (id);


--
-- Name: ImportSource ImportSource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImportSource"
    ADD CONSTRAINT "ImportSource_pkey" PRIMARY KEY (id);


--
-- Name: ImportedItem ImportedItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImportedItem"
    ADD CONSTRAINT "ImportedItem_pkey" PRIMARY KEY (id);


--
-- Name: League League_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT "League_pkey" PRIMARY KEY (id);


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: Page Page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY (id);


--
-- Name: Selection Selection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Selection"
    ADD CONSTRAINT "Selection_pkey" PRIMARY KEY (id);


--
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- Name: Standing Standing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Standing"
    ADD CONSTRAINT "Standing_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: AdZone_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AdZone_name_key" ON public."AdZone" USING btree (name);


--
-- Name: AdZone_placement_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AdZone_placement_isActive_idx" ON public."AdZone" USING btree (placement, "isActive");


--
-- Name: AdZone_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AdZone_slug_key" ON public."AdZone" USING btree (slug);


--
-- Name: Article_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_categoryId_idx" ON public."Article" USING btree ("categoryId");


--
-- Name: Article_leagueId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_leagueId_idx" ON public."Article" USING btree ("leagueId");


--
-- Name: Article_matchId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Article_matchId_key" ON public."Article" USING btree ("matchId");


--
-- Name: Article_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Article_slug_key" ON public."Article" USING btree (slug);


--
-- Name: Article_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_status_publishedAt_idx" ON public."Article" USING btree (status, "publishedAt");


--
-- Name: Bookmaker_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Bookmaker_name_key" ON public."Bookmaker" USING btree (name);


--
-- Name: Bookmaker_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Bookmaker_slug_key" ON public."Bookmaker" USING btree (slug);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: ImportJob_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ImportJob_createdAt_idx" ON public."ImportJob" USING btree ("createdAt");


--
-- Name: ImportJob_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ImportJob_status_idx" ON public."ImportJob" USING btree (status);


--
-- Name: ImportSource_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ImportSource_name_key" ON public."ImportSource" USING btree (name);


--
-- Name: ImportSource_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ImportSource_slug_key" ON public."ImportSource" USING btree (slug);


--
-- Name: ImportedItem_sourceId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ImportedItem_sourceId_createdAt_idx" ON public."ImportedItem" USING btree ("sourceId", "createdAt");


--
-- Name: ImportedItem_sourceId_externalId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ImportedItem_sourceId_externalId_key" ON public."ImportedItem" USING btree ("sourceId", "externalId");


--
-- Name: ImportedItem_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ImportedItem_status_idx" ON public."ImportedItem" USING btree (status);


--
-- Name: League_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "League_slug_key" ON public."League" USING btree (slug);


--
-- Name: Match_leagueId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Match_leagueId_idx" ON public."Match" USING btree ("leagueId");


--
-- Name: Match_matchDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Match_matchDate_idx" ON public."Match" USING btree ("matchDate");


--
-- Name: Page_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Page_slug_key" ON public."Page" USING btree (slug);


--
-- Name: Selection_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Selection_name_key" ON public."Selection" USING btree (name);


--
-- Name: Selection_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Selection_slug_key" ON public."Selection" USING btree (slug);


--
-- Name: Standing_leagueId_season_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Standing_leagueId_season_idx" ON public."Standing" USING btree ("leagueId", season);


--
-- Name: Standing_teamId_leagueId_season_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Standing_teamId_leagueId_season_key" ON public."Standing" USING btree ("teamId", "leagueId", season);


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: Team_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Team_slug_key" ON public."Team" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _ArticleToTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON public."_ArticleToTag" USING btree ("A", "B");


--
-- Name: _ArticleToTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ArticleToTag_B_index" ON public."_ArticleToTag" USING btree ("B");


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Article Article_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_leagueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES public."League"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Article Article_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ImportJob ImportJob_sourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImportJob"
    ADD CONSTRAINT "ImportJob_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES public."ImportSource"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ImportedItem ImportedItem_sourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImportedItem"
    ADD CONSTRAINT "ImportedItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES public."ImportSource"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: League League_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT "League_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_awayTeamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_homeTeamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_leagueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES public."League"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Standing Standing_leagueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Standing"
    ADD CONSTRAINT "Standing_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES public."League"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Standing Standing_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Standing"
    ADD CONSTRAINT "Standing_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ArticleToTag _ArticleToTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ArticleToTag"
    ADD CONSTRAINT "_ArticleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ArticleToTag _ArticleToTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ArticleToTag"
    ADD CONSTRAINT "_ArticleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict gHOuohOuUHuK51gZSts2WsxeilSJKHhceeo4HFSudrgkygXo9ON40EuFDhXhFRC

