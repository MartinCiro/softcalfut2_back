--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

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

DROP DATABASE softcalfut_psql;
--
-- Name: softcalfut_psql; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE softcalfut_psql WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE softcalfut_psql OWNER TO postgres;

\connect softcalfut_psql

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Fecha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Fecha" (
    id integer NOT NULL,
    fecha timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Fecha" OWNER TO postgres;

--
-- Name: Fecha_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Fecha_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Fecha_id_seq" OWNER TO postgres;

--
-- Name: Fecha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Fecha_id_seq" OWNED BY public."Fecha".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: anuncio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anuncio (
    id integer NOT NULL,
    titulo text NOT NULL,
    contenido text NOT NULL,
    "imagenUrl" text NOT NULL,
    id_fecha_creacion integer NOT NULL,
    id_estado integer NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.anuncio OWNER TO postgres;

--
-- Name: anuncio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.anuncio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.anuncio_id_seq OWNER TO postgres;

--
-- Name: anuncio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anuncio_id_seq OWNED BY public.anuncio.id;


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    nombre_categoria text
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_seq OWNER TO postgres;

--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: cedula_deportiva; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cedula_deportiva (
    id integer NOT NULL,
    id_fecha_creacion_deportiva integer NOT NULL,
    estado_cedula integer NOT NULL,
    id_torneo integer NOT NULL,
    id_fecha_actualizacion integer NOT NULL,
    id_equipo integer NOT NULL,
    foto_base text
);


ALTER TABLE public.cedula_deportiva OWNER TO postgres;

--
-- Name: cedula_deportiva_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cedula_deportiva_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cedula_deportiva_id_seq OWNER TO postgres;

--
-- Name: cedula_deportiva_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cedula_deportiva_id_seq OWNED BY public.cedula_deportiva.id;


--
-- Name: equipo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipo (
    id integer NOT NULL,
    nom_equipo text NOT NULL,
    documento text NOT NULL,
    categoria integer
);


ALTER TABLE public.equipo OWNER TO postgres;

--
-- Name: equipo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipo_id_seq OWNER TO postgres;

--
-- Name: equipo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipo_id_seq OWNED BY public.equipo.id;


--
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    nombre_estado text NOT NULL,
    descripcion text
);


ALTER TABLE public.estado OWNER TO postgres;

--
-- Name: estado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_id_seq OWNER TO postgres;

--
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- Name: lugar_encuentro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar_encuentro (
    id integer NOT NULL,
    nombre text,
    direccion text
);


ALTER TABLE public.lugar_encuentro OWNER TO postgres;

--
-- Name: lugar_encuentro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_encuentro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_encuentro_id_seq OWNER TO postgres;

--
-- Name: lugar_encuentro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_encuentro_id_seq OWNED BY public.lugar_encuentro.id;


--
-- Name: notas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notas (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text
);


ALTER TABLE public.notas OWNER TO postgres;

--
-- Name: notas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notas_id_seq OWNER TO postgres;

--
-- Name: notas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notas_id_seq OWNED BY public.notas.id;


--
-- Name: permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permiso (
    id integer NOT NULL,
    nombre_permiso text NOT NULL,
    descripcion text
);


ALTER TABLE public.permiso OWNER TO postgres;

--
-- Name: permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permiso_id_seq OWNER TO postgres;

--
-- Name: permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permiso_id_seq OWNED BY public.permiso.id;


--
-- Name: programacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programacion (
    id integer NOT NULL,
    rama text NOT NULL,
    fecha_encuentro integer NOT NULL,
    id_equipo_local integer NOT NULL,
    id_equipo_visitante integer NOT NULL,
    lugar_encuentro integer NOT NULL,
    cronograma_juego text NOT NULL,
    id_torneo integer NOT NULL
);


ALTER TABLE public.programacion OWNER TO postgres;

--
-- Name: programacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.programacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programacion_id_seq OWNER TO postgres;

--
-- Name: programacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programacion_id_seq OWNED BY public.programacion.id;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id integer NOT NULL,
    nombre_rol text NOT NULL,
    descripcion text
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_seq OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_seq OWNED BY public.rol.id;


--
-- Name: rol_x_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_x_permiso (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);


ALTER TABLE public.rol_x_permiso OWNER TO postgres;

--
-- Name: torneos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.torneos (
    id integer NOT NULL,
    nombre_torneo text
);


ALTER TABLE public.torneos OWNER TO postgres;

--
-- Name: torneos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.torneos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.torneos_id_seq OWNER TO postgres;

--
-- Name: torneos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.torneos_id_seq OWNED BY public.torneos.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    documento text NOT NULL,
    nombres text NOT NULL,
    apellido text NOT NULL,
    email text NOT NULL,
    info_perfil text,
    num_contacto text,
    nom_user text NOT NULL,
    pass text NOT NULL,
    id_rol integer NOT NULL,
    estado_id integer NOT NULL,
    id_fecha_nacimiento integer,
    id_fecha_registro integer
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_x_equipo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_x_equipo (
    id_equipo integer NOT NULL,
    documento_user text NOT NULL,
    id_nota integer,
    id_estado integer
);


ALTER TABLE public.usuario_x_equipo OWNER TO postgres;

--
-- Name: Fecha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fecha" ALTER COLUMN id SET DEFAULT nextval('public."Fecha_id_seq"'::regclass);


--
-- Name: anuncio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio ALTER COLUMN id SET DEFAULT nextval('public.anuncio_id_seq'::regclass);


--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: cedula_deportiva id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva ALTER COLUMN id SET DEFAULT nextval('public.cedula_deportiva_id_seq'::regclass);


--
-- Name: equipo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo ALTER COLUMN id SET DEFAULT nextval('public.equipo_id_seq'::regclass);


--
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- Name: lugar_encuentro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_encuentro ALTER COLUMN id SET DEFAULT nextval('public.lugar_encuentro_id_seq'::regclass);


--
-- Name: notas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas ALTER COLUMN id SET DEFAULT nextval('public.notas_id_seq'::regclass);


--
-- Name: permiso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id SET DEFAULT nextval('public.permiso_id_seq'::regclass);


--
-- Name: programacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion ALTER COLUMN id SET DEFAULT nextval('public.programacion_id_seq'::regclass);


--
-- Name: rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id SET DEFAULT nextval('public.rol_id_seq'::regclass);


--
-- Name: torneos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.torneos ALTER COLUMN id SET DEFAULT nextval('public.torneos_id_seq'::regclass);


--
-- Data for Name: Fecha; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Fecha" (id, fecha) FROM stdin;
1	2021-09-30 00:00:00
2	2025-05-08 22:22:33.445
3	2025-05-08 22:24:38.874
4	2025-05-09 19:38:09.11
5	2025-05-09 19:38:17.64
6	2025-05-09 19:38:19.652
7	2025-05-09 19:38:22.133
8	2025-05-09 19:38:23.811
9	2025-05-09 19:38:26.447
10	2025-05-09 19:38:29.454
11	2025-05-09 19:38:31.576
12	2025-05-09 20:27:57.275
13	2025-05-09 21:18:47.029
14	2025-05-15 00:24:41.619
15	2025-05-15 13:42:27.994
16	2001-12-02 00:00:00
17	2025-05-22 19:52:34.612
18	2025-05-22 19:52:45.978
19	2025-05-22 19:53:15.749
20	2025-05-22 19:53:18.364
21	2025-05-22 19:53:21.343
22	2025-05-22 19:53:23.712
23	2025-05-22 19:53:26.409
24	2025-05-22 19:54:02.614
25	2023-12-31 14:30:00
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
401f829c-4c29-4293-84ca-b4832655cb04	03df4237208032a34bcc738318520b27a2be3350b99d0960df6d2979ebfb27f8	2025-05-08 22:22:02.336548+00	20250506171527_init	\N	\N	2025-05-08 22:22:02.315602+00	1
21538486-6ef3-4315-82e8-ff9d522ddf6d	7adc281c81174e857c0c57fda8bcbab574f7172b0dc0c68c627190a5096f33b9	2025-05-08 22:22:02.342124+00	20250508213638_init	\N	\N	2025-05-08 22:22:02.337332+00	1
95004e36-126b-460d-aea5-64412a03dbf9	263c425ef5a8dc412e88686db98ecb4f1c1dfa22e8a5612494cdee120fcd41fa	2025-05-30 18:27:06.332642+00	20250530182705_add_categoria_nullable	\N	\N	2025-05-30 18:27:06.204369+00	1
638829b4-3926-48e5-b566-81f7053e65a8	56fbf2b53a7f0b58a2dbe0661df3c0fccf881a75a176cd27c38f852f0d388950	2025-05-30 18:44:00.871057+00	20250530184400_add_table_lugar_programacion	\N	\N	2025-05-30 18:44:00.787153+00	1
8e0a464f-0a48-4f8e-a501-1d10653d3510	5ad93c049154a6b77dc136dbb076f85a664b68fad18dd50c3fbd7e7afbcafa1a	2025-05-30 18:48:16.053445+00	20250530184815_add_table_notas	\N	\N	2025-05-30 18:48:16.014454+00	1
a0796ff8-59ff-44f5-9b93-dc3fd6fe1ff9	333c4ad98160b654b083086bfcd659077cc3edea81c7e04237acd404afb54e0c	2025-05-30 18:55:43.947848+00	20250530185543_add_relation_notas_usuarioxequpo	\N	\N	2025-05-30 18:55:43.915299+00	1
9f6e097e-264b-47ad-8bac-0005d6165980	081e2d6803871d57ea25f3ef9da7fb60560a2a57495b0b3ba87dc82b788b6bc8	2025-05-30 19:06:58.170986+00	20250530190657_add_relation_usuario_xequipo_estado	\N	\N	2025-05-30 19:06:58.136997+00	1
\.


--
-- Data for Name: anuncio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.anuncio (id, titulo, contenido, "imagenUrl", id_fecha_creacion, id_estado, "actualizadoEn") FROM stdin;
10	Menudoaa	En el marco de la segunda fecha del Torneo Nacionaal Sub-17, la selección de Meta superó 1 - 0 a la blanca y verde con gol de pena máxima. Los encuentros se disputan en el complejo deportivo Coconí en La Virginia, Risaralda. El conjunto antioqueño se vio sorprendido por la selección llanera que aprovechó la ventaja conseguida desde el punto blanco en la etapa inicial. Nuestro representativo tuvo llegadas claras, explotando las bandas y con variantes que dieron mayor dinámica, lastimosamente hoy fue uno de esos días que el arco no se abrió, sumando también el orden defensivo rival. En el clásico cafetero Risaralda, próximo rival de Antioquia, venció a los caldenses sellando su eliminación. Habrá descanso general y el miércoles se definirán los semifinalistas.	https://imgs.search.brave.com/KdZLo2v4VxiMZAgxHGrmbyzAJJdOyVyIq-JudzPnDY8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxR0p2cDFsUnRM/LmpwZw	12	1	2025-05-12 22:09:54.635
5	Menoritario	este es un contenido de ejemplooo	https://laf.com.co/fotos/Image/IMG_4571.JPG	7	1	2025-05-15 21:46:39.068
9	prueba cache	este es un contenido de ejemplo, solo para probar que si funciona	https://laf.com.co/fotos/Image/IMG_4571.JPG	11	1	2025-05-12 20:20:24.688
6	ACtivo	este es un contenido de ejemplo	https://laf.com.co/fotos/Image/IMG_4571.JPG	8	1	2025-05-15 21:47:10.452
1	Menoritarios	este es un contenido de ejemploddd	https://laf.com.co/fotos/Image/IMG_4571.JPG	3	1	2025-05-16 02:32:39.581
4	Activado	este es un contenido de ejemploo	https://laf.com.co/fotos/Image/IMG_4571.JPG	6	1	2025-05-12 21:36:29.528
3	Menoritariod	este es un contenido de ejemplo	https://laf.com.co/fotos/Image/IMG_4571.JPG	5	1	2025-05-12 21:37:26.301
7	Menorit	este es un contenido de ejemplosd	https://laf.com.co/fotos/Image/IMG_4571.JPG	9	1	2025-05-12 21:45:59.805
11	piernuda	d	https://imgs.search.brave.com/Zs8dQId4lKI8Q9C8Z2KyoLW73jlJVr4rNeIi54O2mco/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vTEtqbFNs/Y3hJOFp6YzlWZG13/TkNzQVU3ZGpLOGlF/QzdkSUVkdERFLTRX/Zy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldjdS9abkpsWlhC/cGF5NWpiMjB2L1pt/OTBiM010Y0hKbGJX/bDEvYlM5aFptbGph/Vzl1WVdSdi9jeTFo/YkMxbWRYUmliMnd0/L1kyOXNiMjFpYVdG/dWJ5MW0vYjI1a2J5/MTBjbUZ1YzNCaC9j/bVZ1ZEdWZk5UTTRO/ell0L09UWTFPVEU1/TG1wd1p6OXovWlcx/MFBXRnBjMTlvZVdK/eS9hV1FtZHowM05E/QQ	13	1	2025-05-22 13:11:50.433
12	LCF	Uno de los objetivos fundamentales del organo de administracion de la liga caldense de futbol es crear espacios educativos con unas condiciones optimas que permitan alcanzar la excelencia academica entre sus clubes, jugadores, entrenadores, periodistas, directivos, arbitros, funcionarios y todas aquellas personas que tengan vinculo con el futbol, con el fin de responder a los nuevos retos que este nos brinda a nivel mundial. \nFortalecer los conocimientos mediante un enfoque multidisciplinario (entrenamiento, legislacion, arbitraje, psicologia, coaching, gerencia y gestion), serán el resultado en soluciones basadas en la investigación que se pueden adaptar a las necesidades y requeriemintos y asi contribuir al progreso continuo, el desarrollo sostenible de forma activa para toda la familia del futbol, a traves del conocimiento, experiencia, investigacion y educacion. 	https://www.lapatria.com/sites/default/files/styles/308x205_taxonomias/public/noticia/2025-03/F%C3%9ATBOL%20-%20CALDAS%20-%20COLOMBIA.jpg?itok=vMRr_0tC	14	1	2025-06-06 21:37:24.731
8	Menori	este es un contenido de ejemplo	https://laf.com.co/fotos/Image/IMG_4571.JPG	10	3	2025-06-06 21:39:19.547
\.


--
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id, nombre_categoria) FROM stdin;
2	2011 M
1	2010 M
\.


--
-- Data for Name: cedula_deportiva; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cedula_deportiva (id, id_fecha_creacion_deportiva, estado_cedula, id_torneo, id_fecha_actualizacion, id_equipo, foto_base) FROM stdin;
\.


--
-- Data for Name: equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipo (id, nom_equipo, documento, categoria) FROM stdin;
14	ASOFÚTBOL	1	1
19	FORMADORES	10	2
7	ONCE DEPORTIVO	4123	1
8	CAFETEROS	1025	2
20	COLSEÑORA	10256	1
11	TALENTOS	102	1
10	LA CANTERA	21	1
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado (id, nombre_estado, descripcion) FROM stdin;
1	Activo	Usuario o elemento activo en el sistema
3	Inactivo	Usuario o elemento inactivo en el sistema
4	Eliminarlo	solo porque si
5	Penalizado	Usuario jugador penalizado
\.


--
-- Data for Name: lugar_encuentro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lugar_encuentro (id, nombre, direccion) FROM stdin;
1	CANCHA AUXILIAR	carrera 6d #52-10
\.


--
-- Data for Name: notas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notas (id, nombre, descripcion) FROM stdin;
1	Expulsado por conducta	se expulsa por conducta inapropiada durante el juego
\.


--
-- Data for Name: permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permiso (id, nombre_permiso, descripcion) FROM stdin;
28	programaciones:Actualiza	Hacer modificaciones en programacion
22	estados:Elimina	Modificar estados
25	estados:Crea	Modificar estados
24	estados:Actualiza	Modificar estados
34	torneos:Actualiza	para actualizar torneos
35	torneos:Crea	para crear torneos
36	torneos:Lee	para leer torneos
37	torneos:Elimina	para eliminar torneos
38	usuarios:Elimina	para eliminar usuarios
39	usuarios:LeeProfile	para Leer el perfil del usuario
40	usuarios:Actualiza	para actualizar informacion del usuario
41	usuarios:Lee	para leer informacion del usuario
42	usuarios:Crea	para crear usuarios
23	estados:Lee	Modificar estados
3	permisos:Crea	Permite gestionar permisos
2	permisos:Actualiza	Permite gestionar permisos
1	permisos:Lee	Permite gestionar permisos
4	permisos:Elimina	Permite gestionar permisos
9	categorias:Elimina	Nos permite cambiar propiedades de  categorias
10	categorias:Actualiza	Nos permite cambiar propiedades de  categorias
11	categorias:Lee	Nos permite cambiar propiedades de  categorias
12	categorias:Crea	Nos permite cambiar propiedades de  categorias
13	cedula:Crea	Gestion en cedula deportiva
16	cedula:Lee	Gestion en cedula deportiva
15	cedula:Actualiza	Gestion en cedula deportiva
17	equipos:Lee	Gestion de equipos
21	equipos:Elimina	Gestion de equipos
18	equipos:Asigna	Gestion de equipos
19	equipos:Crea	Gestion de equipos
20	equipos:Actualiza	Gestion de equipos
26	programaciones:Crea	Hacer modificaciones en programacion
29	programaciones:Elimina	Hacer modificaciones en programacion
27	programaciones:Lee	Hacer modificaciones en programacion
55	d:Lee	Solo una prueba local
5	anuncios:Crea	Aplica operaciones de anuncios
6	anuncios:Lee	Aplica operaciones de anuncios
8	anuncios:Elimina	Aplica operaciones de anuncios
7	anuncios:Actualiza	Aplica operaciones de anuncios
30	roles:Elimina	Ajuste en operaciones de roles
31	roles:Crea	Ajuste en operaciones de roles
32	roles:Lee	Ajuste en operaciones de roles
33	roles:Actualiza	Ajuste en operaciones de roles
62	cedula:Elimina	\N
63	notas:Lee	Gestion de notas
64	notas:Crea	Gestion de notas
65	notas:Actualiza	Gestion de notas
66	notas:Elimina	Gestion de notas
67	lugarEncuentro:Lee	Gestionar los lugares de encuentro
68	lugarEncuentro:Crea	Gestionar los lugares de encuentro
69	lugarEncuentro:Actualiza	Gestionar los lugares de encuentro
70	lugarEncuentro:Elimina	Gestionar los lugares de encuentro
\.


--
-- Data for Name: programacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.programacion (id, rama, fecha_encuentro, id_equipo_local, id_equipo_visitante, lugar_encuentro, cronograma_juego, id_torneo) FROM stdin;
4	M	19	7	14	1	fecha 1	1
5	M	3	10	19	1	fecha 2	1
6	M	25	20	11	1	fecha 3	1
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id, nombre_rol, descripcion) FROM stdin;
1	Invitado	Solo lectura para invitado
2	Admin	Solo full permisos 
7	AdminJugador	Gestiona todos los permisos y puede ser jugador
\.


--
-- Data for Name: rol_x_permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol_x_permiso (id_rol, id_permiso) FROM stdin;
1	11
1	16
1	17
1	18
1	27
1	41
2	28
2	22
2	25
2	24
2	34
2	35
2	36
2	37
2	38
2	40
2	41
2	42
2	23
2	3
2	2
2	1
2	4
2	9
2	10
2	11
2	12
2	13
2	16
2	15
2	17
2	21
2	18
2	19
2	20
2	26
2	29
2	27
2	55
2	5
2	6
2	8
2	7
2	30
2	31
2	32
2	33
2	62
7	28
7	22
7	25
7	24
7	34
7	35
7	36
7	37
7	38
7	40
7	41
7	42
7	23
7	3
7	2
7	1
7	4
7	9
7	10
7	11
7	12
7	13
7	16
7	15
7	17
7	21
7	18
7	19
7	20
7	26
7	29
7	27
7	55
7	5
7	6
7	8
7	7
7	30
7	31
7	32
7	33
7	62
7	63
7	64
7	65
7	66
7	67
7	68
7	69
7	70
\.


--
-- Data for Name: torneos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.torneos (id, nombre_torneo) FROM stdin;
1	prueba torneo
2	facil de crear
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (documento, nombres, apellido, email, info_perfil, num_contacto, nom_user, pass, id_rol, estado_id, id_fecha_nacimiento, id_fecha_registro) FROM stdin;
4123	martin	ciro	correo@gmail.com	\N	3212	ciro	$2a$08$J1yTRSqF/2N2gwurwt0TWeeyvMiJs7bg8HVc.IC15ArvzOl4s2gTm	7	1	1	2
1025645	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$qfe.E570SKVxDpKxRXTyG.z2.Xci2iO1fvr4n3VgqtawwGKdRjcsK	1	1	16	17
102564	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$Fw7VpCEtrTGPn4Y2.CZPVuqky57Iae3w963qBan2lhst20WMRdfPW	1	1	16	18
10256	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$0tUlh6sfq1wz8QnvJELsy.fR1lkT3gSUJvAbcpNEOSS/NIkgUfuoO	7	1	16	19
1025	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$wAGB4RulflGq3iADwm1UkeUgJ3z6NzQLlzpEVVMJez5CK9Hw2vm7i	7	1	16	20
102	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$9.4wlsVMZDobn1Mv5tZ2z.WtfArbtlV9F.O4EacsmV5erU8gjKXSW	7	1	16	21
10	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$n9jdZpQablMTkTmng30ZD.YyjIAonWUmT5xuugYWbGZOuepsAiDvq	7	1	16	22
1	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$qbAp2HQTzSjGOOCt6XQoheSD7eA7/1qH.l0QB02SfuGNJfbfq9spO	7	1	16	23
21	No sde	apellido	ciro@gmail.com	Esta es una prueba funcional de la teoria	354455212	usuario_prueba	$2a$08$Wbb4/XdhOgMkdNPUh/qSAecEPuEPloagPSexojFSOat2/mjTWgndG	7	1	16	24
\.


--
-- Data for Name: usuario_x_equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_x_equipo (id_equipo, documento_user, id_nota, id_estado) FROM stdin;
14	4123	\N	\N
14	10256	\N	\N
14	1025	\N	\N
19	1	\N	\N
7	4123	\N	\N
7	10256	\N	\N
7	1025	\N	\N
7	102	\N	\N
8	4123	\N	\N
20	21	\N	\N
11	4123	\N	\N
11	1025	\N	\N
10	1025	\N	\N
10	102	\N	\N
10	10	\N	\N
\.


--
-- Name: Fecha_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Fecha_id_seq"', 25, true);


--
-- Name: anuncio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.anuncio_id_seq', 13, true);


--
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_seq', 2, true);


--
-- Name: cedula_deportiva_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cedula_deportiva_id_seq', 1, false);


--
-- Name: equipo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipo_id_seq', 22, true);


--
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_seq', 5, true);


--
-- Name: lugar_encuentro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lugar_encuentro_id_seq', 1, true);


--
-- Name: notas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notas_id_seq', 13, true);


--
-- Name: permiso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permiso_id_seq', 70, true);


--
-- Name: programacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.programacion_id_seq', 6, true);


--
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_seq', 7, true);


--
-- Name: torneos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.torneos_id_seq', 2, true);


--
-- Name: Fecha Fecha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fecha"
    ADD CONSTRAINT "Fecha_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: anuncio anuncio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio
    ADD CONSTRAINT anuncio_pkey PRIMARY KEY (id);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: cedula_deportiva cedula_deportiva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_pkey PRIMARY KEY (id);


--
-- Name: equipo equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_pkey PRIMARY KEY (id);


--
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- Name: lugar_encuentro lugar_encuentro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_encuentro
    ADD CONSTRAINT lugar_encuentro_pkey PRIMARY KEY (id);


--
-- Name: notas notas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas
    ADD CONSTRAINT notas_pkey PRIMARY KEY (id);


--
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id);


--
-- Name: programacion programacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_pkey PRIMARY KEY (id);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- Name: rol_x_permiso rol_x_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_x_permiso
    ADD CONSTRAINT rol_x_permiso_pkey PRIMARY KEY (id_rol, id_permiso);


--
-- Name: torneos torneos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.torneos
    ADD CONSTRAINT torneos_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (documento);


--
-- Name: usuario_x_equipo usuario_x_equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_pkey PRIMARY KEY (id_equipo, documento_user);


--
-- Name: Fecha_fecha_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Fecha_fecha_key" ON public."Fecha" USING btree (fecha);


--
-- Name: anuncio_titulo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX anuncio_titulo_key ON public.anuncio USING btree (titulo);


--
-- Name: equipo_documento_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX equipo_documento_key ON public.equipo USING btree (documento);


--
-- Name: equipo_nom_equipo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX equipo_nom_equipo_key ON public.equipo USING btree (nom_equipo);


--
-- Name: estado_nombre_estado_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estado_nombre_estado_key ON public.estado USING btree (nombre_estado);


--
-- Name: notas_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX notas_nombre_key ON public.notas USING btree (nombre);


--
-- Name: permiso_nombre_permiso_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permiso_nombre_permiso_key ON public.permiso USING btree (nombre_permiso);


--
-- Name: rol_nombre_rol_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX rol_nombre_rol_key ON public.rol USING btree (nombre_rol);


--
-- Name: usuario_documento_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuario_documento_key ON public.usuario USING btree (documento);


--
-- Name: anuncio anuncio_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio
    ADD CONSTRAINT anuncio_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: anuncio anuncio_id_fecha_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio
    ADD CONSTRAINT anuncio_id_fecha_creacion_fkey FOREIGN KEY (id_fecha_creacion) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cedula_deportiva cedula_deportiva_estado_cedula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_estado_cedula_fkey FOREIGN KEY (estado_cedula) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cedula_deportiva cedula_deportiva_id_equipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cedula_deportiva cedula_deportiva_id_fecha_actualizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_fecha_actualizacion_fkey FOREIGN KEY (id_fecha_actualizacion) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cedula_deportiva cedula_deportiva_id_fecha_creacion_deportiva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_fecha_creacion_deportiva_fkey FOREIGN KEY (id_fecha_creacion_deportiva) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cedula_deportiva cedula_deportiva_id_torneo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_torneo_fkey FOREIGN KEY (id_torneo) REFERENCES public.torneos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: equipo equipo_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_categoria_fkey FOREIGN KEY (categoria) REFERENCES public.categoria(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: equipo equipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_documento_fkey FOREIGN KEY (documento) REFERENCES public.usuario(documento) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: programacion programacion_fecha_encuentro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_fecha_encuentro_fkey FOREIGN KEY (fecha_encuentro) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: programacion programacion_id_equipo_local_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_id_equipo_local_fkey FOREIGN KEY (id_equipo_local) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: programacion programacion_id_equipo_visitante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_id_equipo_visitante_fkey FOREIGN KEY (id_equipo_visitante) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: programacion programacion_id_torneo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_id_torneo_fkey FOREIGN KEY (id_torneo) REFERENCES public.torneos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: programacion programacion_lugar_encuentro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_lugar_encuentro_fkey FOREIGN KEY (lugar_encuentro) REFERENCES public.lugar_encuentro(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rol_x_permiso rol_x_permiso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_x_permiso
    ADD CONSTRAINT rol_x_permiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permiso(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rol_x_permiso rol_x_permiso_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_x_permiso
    ADD CONSTRAINT rol_x_permiso_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuario usuario_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: usuario usuario_id_fecha_nacimiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_fecha_nacimiento_fkey FOREIGN KEY (id_fecha_nacimiento) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuario usuario_id_fecha_registro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_fecha_registro_fkey FOREIGN KEY (id_fecha_registro) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id) ON DELETE CASCADE;


--
-- Name: usuario_x_equipo usuario_x_equipo_documento_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_documento_user_fkey FOREIGN KEY (documento_user) REFERENCES public.usuario(documento) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuario_x_equipo usuario_x_equipo_id_equipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuario_x_equipo usuario_x_equipo_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuario_x_equipo usuario_x_equipo_id_nota_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_id_nota_fkey FOREIGN KEY (id_nota) REFERENCES public.notas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

