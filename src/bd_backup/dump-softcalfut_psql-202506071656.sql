--
-- PostgreSQL database cluster dump
--

-- Started on 2025-06-07 16:56:43

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:b5Z9CQd/bT49bNkIZ4mD9g==$uHKzSzfht5QRTiMIJPAKuXEksrAs1KcVswEVQ1AuwJs=:be9mccj0y535NDt3U1vA+yoabnLZ/V/xFD+ONw/32dc=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-07 16:56:43

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

-- Completed on 2025-06-07 16:56:44

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-07 16:56:44

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

-- Completed on 2025-06-07 16:56:44

--
-- PostgreSQL database dump complete
--

--
-- Database "rutas_envio" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-07 16:56:44

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
-- TOC entry 3410 (class 1262 OID 24722)
-- Name: rutas_envio; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE rutas_envio WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE rutas_envio OWNER TO postgres;

\connect rutas_envio

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 24724)
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    estado boolean NOT NULL,
    descripcion character varying(300)
);


ALTER TABLE public.estado OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24723)
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
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 217
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- TOC entry 220 (class 1259 OID 24733)
-- Name: permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permiso (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(300),
    estado integer NOT NULL
);


ALTER TABLE public.permiso OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24732)
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
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 219
-- Name: permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permiso_id_seq OWNED BY public.permiso.id;


--
-- TOC entry 222 (class 1259 OID 24747)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(300),
    estado integer NOT NULL
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24746)
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
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 221
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_seq OWNED BY public.rol.id;


--
-- TOC entry 224 (class 1259 OID 24778)
-- Name: rolxpermiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rolxpermiso (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);


ALTER TABLE public.rolxpermiso OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24760)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    documento character varying,
    nombres character varying,
    apellido character varying,
    email character varying,
    info_perfil text,
    fecha_usuario_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    num_contacto character varying,
    nom_user character varying,
    pass character varying,
    estado smallint,
    id_rol integer,
    fecha_nacimiento date
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 3228 (class 2604 OID 24727)
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 24736)
-- Name: permiso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id SET DEFAULT nextval('public.permiso_id_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 24750)
-- Name: rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id SET DEFAULT nextval('public.rol_id_seq'::regclass);


--
-- TOC entry 3398 (class 0 OID 24724)
-- Dependencies: 218
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado (id, estado, descripcion) FROM stdin;
\.


--
-- TOC entry 3400 (class 0 OID 24733)
-- Dependencies: 220
-- Data for Name: permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permiso (id, nombre, descripcion, estado) FROM stdin;
\.


--
-- TOC entry 3402 (class 0 OID 24747)
-- Dependencies: 222
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id, nombre, descripcion, estado) FROM stdin;
\.


--
-- TOC entry 3404 (class 0 OID 24778)
-- Dependencies: 224
-- Data for Name: rolxpermiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rolxpermiso (id_rol, id_permiso) FROM stdin;
\.


--
-- TOC entry 3403 (class 0 OID 24760)
-- Dependencies: 223
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (documento, nombres, apellido, email, info_perfil, fecha_usuario_registro, num_contacto, nom_user, pass, estado, id_rol, fecha_nacimiento) FROM stdin;
\.


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 217
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_seq', 1, false);


--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 219
-- Name: permiso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permiso_id_seq', 1, false);


--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 221
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_seq', 1, false);


--
-- TOC entry 3233 (class 2606 OID 24731)
-- Name: estado estado_estado_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_estado_key UNIQUE (estado);


--
-- TOC entry 3235 (class 2606 OID 24729)
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 24740)
-- Name: permiso permiso_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_nombre_key UNIQUE (nombre);


--
-- TOC entry 3239 (class 2606 OID 24738)
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 24754)
-- Name: rol rol_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_nombre_key UNIQUE (nombre);


--
-- TOC entry 3243 (class 2606 OID 24752)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 24767)
-- Name: usuario usuario_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_documento_key UNIQUE (documento);


--
-- TOC entry 3246 (class 2606 OID 24741)
-- Name: permiso permiso_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_estado_fkey FOREIGN KEY (estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3247 (class 2606 OID 24755)
-- Name: rol rol_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_estado_fkey FOREIGN KEY (estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3250 (class 2606 OID 24786)
-- Name: rolxpermiso rolxpermiso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolxpermiso
    ADD CONSTRAINT rolxpermiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permiso(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3251 (class 2606 OID 24781)
-- Name: rolxpermiso rolxpermiso_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolxpermiso
    ADD CONSTRAINT rolxpermiso_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id) ON DELETE CASCADE;


--
-- TOC entry 3248 (class 2606 OID 24768)
-- Name: usuario usuario_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_estado_fkey FOREIGN KEY (estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3249 (class 2606 OID 24773)
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id);


-- Completed on 2025-06-07 16:56:44

--
-- PostgreSQL database dump complete
--

--
-- Database "softcalfut_psql" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-07 16:56:44

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
-- TOC entry 3538 (class 1262 OID 83282)
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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 83283)
-- Name: Fecha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Fecha" (
    id integer NOT NULL,
    fecha timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Fecha" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 83286)
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
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 218
-- Name: Fecha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Fecha_id_seq" OWNED BY public."Fecha".id;


--
-- TOC entry 219 (class 1259 OID 83287)
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
-- TOC entry 220 (class 1259 OID 83294)
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
-- TOC entry 221 (class 1259 OID 83299)
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
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 221
-- Name: anuncio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anuncio_id_seq OWNED BY public.anuncio.id;


--
-- TOC entry 222 (class 1259 OID 83300)
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    nombre_categoria text
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 83305)
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
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 223
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- TOC entry 224 (class 1259 OID 83306)
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
-- TOC entry 225 (class 1259 OID 83311)
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
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 225
-- Name: cedula_deportiva_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cedula_deportiva_id_seq OWNED BY public.cedula_deportiva.id;


--
-- TOC entry 226 (class 1259 OID 83312)
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
-- TOC entry 227 (class 1259 OID 83317)
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
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 227
-- Name: equipo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipo_id_seq OWNED BY public.equipo.id;


--
-- TOC entry 228 (class 1259 OID 83318)
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    nombre_estado text NOT NULL,
    descripcion text
);


ALTER TABLE public.estado OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 83323)
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
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 229
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- TOC entry 230 (class 1259 OID 83324)
-- Name: lugar_encuentro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar_encuentro (
    id integer NOT NULL,
    nombre text,
    direccion text
);


ALTER TABLE public.lugar_encuentro OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 83329)
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
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 231
-- Name: lugar_encuentro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_encuentro_id_seq OWNED BY public.lugar_encuentro.id;


--
-- TOC entry 232 (class 1259 OID 83330)
-- Name: notas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notas (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text
);


ALTER TABLE public.notas OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 83335)
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
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 233
-- Name: notas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notas_id_seq OWNED BY public.notas.id;


--
-- TOC entry 234 (class 1259 OID 83336)
-- Name: permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permiso (
    id integer NOT NULL,
    nombre_permiso text NOT NULL,
    descripcion text
);


ALTER TABLE public.permiso OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 83341)
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
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 235
-- Name: permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permiso_id_seq OWNED BY public.permiso.id;


--
-- TOC entry 236 (class 1259 OID 83342)
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
-- TOC entry 237 (class 1259 OID 83347)
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
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 237
-- Name: programacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programacion_id_seq OWNED BY public.programacion.id;


--
-- TOC entry 238 (class 1259 OID 83348)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id integer NOT NULL,
    nombre_rol text NOT NULL,
    descripcion text
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 83353)
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
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 239
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_seq OWNED BY public.rol.id;


--
-- TOC entry 240 (class 1259 OID 83354)
-- Name: rol_x_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_x_permiso (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);


ALTER TABLE public.rol_x_permiso OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 83357)
-- Name: torneos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.torneos (
    id integer NOT NULL,
    nombre_torneo text
);


ALTER TABLE public.torneos OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 83362)
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
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 242
-- Name: torneos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.torneos_id_seq OWNED BY public.torneos.id;


--
-- TOC entry 243 (class 1259 OID 83363)
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
-- TOC entry 244 (class 1259 OID 83368)
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
-- TOC entry 3281 (class 2604 OID 83373)
-- Name: Fecha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fecha" ALTER COLUMN id SET DEFAULT nextval('public."Fecha_id_seq"'::regclass);


--
-- TOC entry 3284 (class 2604 OID 83374)
-- Name: anuncio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio ALTER COLUMN id SET DEFAULT nextval('public.anuncio_id_seq'::regclass);


--
-- TOC entry 3285 (class 2604 OID 83375)
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- TOC entry 3286 (class 2604 OID 83376)
-- Name: cedula_deportiva id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva ALTER COLUMN id SET DEFAULT nextval('public.cedula_deportiva_id_seq'::regclass);


--
-- TOC entry 3287 (class 2604 OID 83377)
-- Name: equipo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo ALTER COLUMN id SET DEFAULT nextval('public.equipo_id_seq'::regclass);


--
-- TOC entry 3288 (class 2604 OID 83378)
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- TOC entry 3289 (class 2604 OID 83379)
-- Name: lugar_encuentro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_encuentro ALTER COLUMN id SET DEFAULT nextval('public.lugar_encuentro_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 83380)
-- Name: notas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas ALTER COLUMN id SET DEFAULT nextval('public.notas_id_seq'::regclass);


--
-- TOC entry 3291 (class 2604 OID 83381)
-- Name: permiso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id SET DEFAULT nextval('public.permiso_id_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 83382)
-- Name: programacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion ALTER COLUMN id SET DEFAULT nextval('public.programacion_id_seq'::regclass);


--
-- TOC entry 3293 (class 2604 OID 83383)
-- Name: rol id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id SET DEFAULT nextval('public.rol_id_seq'::regclass);


--
-- TOC entry 3294 (class 2604 OID 83384)
-- Name: torneos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.torneos ALTER COLUMN id SET DEFAULT nextval('public.torneos_id_seq'::regclass);


--
-- TOC entry 3505 (class 0 OID 83283)
-- Dependencies: 217
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
-- TOC entry 3507 (class 0 OID 83287)
-- Dependencies: 219
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
-- TOC entry 3508 (class 0 OID 83294)
-- Dependencies: 220
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
-- TOC entry 3510 (class 0 OID 83300)
-- Dependencies: 222
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id, nombre_categoria) FROM stdin;
2	2011 M
1	2010 M
\.


--
-- TOC entry 3512 (class 0 OID 83306)
-- Dependencies: 224
-- Data for Name: cedula_deportiva; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cedula_deportiva (id, id_fecha_creacion_deportiva, estado_cedula, id_torneo, id_fecha_actualizacion, id_equipo, foto_base) FROM stdin;
\.


--
-- TOC entry 3514 (class 0 OID 83312)
-- Dependencies: 226
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
-- TOC entry 3516 (class 0 OID 83318)
-- Dependencies: 228
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado (id, nombre_estado, descripcion) FROM stdin;
1	Activo	Usuario o elemento activo en el sistema
3	Inactivo	Usuario o elemento inactivo en el sistema
4	Eliminarlo	solo porque si
5	Penalizado	Usuario jugador penalizado
\.


--
-- TOC entry 3518 (class 0 OID 83324)
-- Dependencies: 230
-- Data for Name: lugar_encuentro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lugar_encuentro (id, nombre, direccion) FROM stdin;
1	CANCHA AUXILIAR	carrera 6d #52-10
\.


--
-- TOC entry 3520 (class 0 OID 83330)
-- Dependencies: 232
-- Data for Name: notas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notas (id, nombre, descripcion) FROM stdin;
1	Expulsado por conducta	se expulsa por conducta inapropiada durante el juego
\.


--
-- TOC entry 3522 (class 0 OID 83336)
-- Dependencies: 234
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
-- TOC entry 3524 (class 0 OID 83342)
-- Dependencies: 236
-- Data for Name: programacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.programacion (id, rama, fecha_encuentro, id_equipo_local, id_equipo_visitante, lugar_encuentro, cronograma_juego, id_torneo) FROM stdin;
4	M	19	7	14	1	fecha 1	1
5	M	3	10	19	1	fecha 2	1
6	M	25	20	11	1	fecha 3	1
\.


--
-- TOC entry 3526 (class 0 OID 83348)
-- Dependencies: 238
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id, nombre_rol, descripcion) FROM stdin;
1	Invitado	Solo lectura para invitado
2	Admin	Solo full permisos 
7	AdminJugador	Gestiona todos los permisos y puede ser jugador
\.


--
-- TOC entry 3528 (class 0 OID 83354)
-- Dependencies: 240
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
-- TOC entry 3529 (class 0 OID 83357)
-- Dependencies: 241
-- Data for Name: torneos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.torneos (id, nombre_torneo) FROM stdin;
1	prueba torneo
2	facil de crear
\.


--
-- TOC entry 3531 (class 0 OID 83363)
-- Dependencies: 243
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
-- TOC entry 3532 (class 0 OID 83368)
-- Dependencies: 244
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
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 218
-- Name: Fecha_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Fecha_id_seq"', 25, true);


--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 221
-- Name: anuncio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.anuncio_id_seq', 13, true);


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 223
-- Name: categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_seq', 2, true);


--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 225
-- Name: cedula_deportiva_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cedula_deportiva_id_seq', 1, false);


--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 227
-- Name: equipo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipo_id_seq', 22, true);


--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 229
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_id_seq', 5, true);


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 231
-- Name: lugar_encuentro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lugar_encuentro_id_seq', 1, true);


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 233
-- Name: notas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notas_id_seq', 13, true);


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 235
-- Name: permiso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permiso_id_seq', 70, true);


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 237
-- Name: programacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.programacion_id_seq', 6, true);


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 239
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_seq', 7, true);


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 242
-- Name: torneos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.torneos_id_seq', 2, true);


--
-- TOC entry 3297 (class 2606 OID 83386)
-- Name: Fecha Fecha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fecha"
    ADD CONSTRAINT "Fecha_pkey" PRIMARY KEY (id);


--
-- TOC entry 3299 (class 2606 OID 83388)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 83390)
-- Name: anuncio anuncio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio
    ADD CONSTRAINT anuncio_pkey PRIMARY KEY (id);


--
-- TOC entry 3304 (class 2606 OID 83392)
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3306 (class 2606 OID 83394)
-- Name: cedula_deportiva cedula_deportiva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_pkey PRIMARY KEY (id);


--
-- TOC entry 3310 (class 2606 OID 83396)
-- Name: equipo equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 83398)
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 83400)
-- Name: lugar_encuentro lugar_encuentro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_encuentro
    ADD CONSTRAINT lugar_encuentro_pkey PRIMARY KEY (id);


--
-- TOC entry 3318 (class 2606 OID 83402)
-- Name: notas notas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas
    ADD CONSTRAINT notas_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 83404)
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 83406)
-- Name: programacion programacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_pkey PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 83408)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 83410)
-- Name: rol_x_permiso rol_x_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_x_permiso
    ADD CONSTRAINT rol_x_permiso_pkey PRIMARY KEY (id_rol, id_permiso);


--
-- TOC entry 3330 (class 2606 OID 83412)
-- Name: torneos torneos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.torneos
    ADD CONSTRAINT torneos_pkey PRIMARY KEY (id);


--
-- TOC entry 3333 (class 2606 OID 83414)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (documento);


--
-- TOC entry 3335 (class 2606 OID 83416)
-- Name: usuario_x_equipo usuario_x_equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_pkey PRIMARY KEY (id_equipo, documento_user);


--
-- TOC entry 3295 (class 1259 OID 83417)
-- Name: Fecha_fecha_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Fecha_fecha_key" ON public."Fecha" USING btree (fecha);


--
-- TOC entry 3302 (class 1259 OID 83418)
-- Name: anuncio_titulo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX anuncio_titulo_key ON public.anuncio USING btree (titulo);


--
-- TOC entry 3307 (class 1259 OID 83419)
-- Name: equipo_documento_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX equipo_documento_key ON public.equipo USING btree (documento);


--
-- TOC entry 3308 (class 1259 OID 83420)
-- Name: equipo_nom_equipo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX equipo_nom_equipo_key ON public.equipo USING btree (nom_equipo);


--
-- TOC entry 3311 (class 1259 OID 83421)
-- Name: estado_nombre_estado_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estado_nombre_estado_key ON public.estado USING btree (nombre_estado);


--
-- TOC entry 3316 (class 1259 OID 83422)
-- Name: notas_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX notas_nombre_key ON public.notas USING btree (nombre);


--
-- TOC entry 3319 (class 1259 OID 83423)
-- Name: permiso_nombre_permiso_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permiso_nombre_permiso_key ON public.permiso USING btree (nombre_permiso);


--
-- TOC entry 3324 (class 1259 OID 83424)
-- Name: rol_nombre_rol_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX rol_nombre_rol_key ON public.rol USING btree (nombre_rol);


--
-- TOC entry 3331 (class 1259 OID 83425)
-- Name: usuario_documento_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuario_documento_key ON public.usuario USING btree (documento);


--
-- TOC entry 3336 (class 2606 OID 83426)
-- Name: anuncio anuncio_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio
    ADD CONSTRAINT anuncio_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3337 (class 2606 OID 83431)
-- Name: anuncio anuncio_id_fecha_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anuncio
    ADD CONSTRAINT anuncio_id_fecha_creacion_fkey FOREIGN KEY (id_fecha_creacion) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3338 (class 2606 OID 83436)
-- Name: cedula_deportiva cedula_deportiva_estado_cedula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_estado_cedula_fkey FOREIGN KEY (estado_cedula) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3339 (class 2606 OID 83441)
-- Name: cedula_deportiva cedula_deportiva_id_equipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3340 (class 2606 OID 83446)
-- Name: cedula_deportiva cedula_deportiva_id_fecha_actualizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_fecha_actualizacion_fkey FOREIGN KEY (id_fecha_actualizacion) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3341 (class 2606 OID 83451)
-- Name: cedula_deportiva cedula_deportiva_id_fecha_creacion_deportiva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_fecha_creacion_deportiva_fkey FOREIGN KEY (id_fecha_creacion_deportiva) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 83456)
-- Name: cedula_deportiva cedula_deportiva_id_torneo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cedula_deportiva
    ADD CONSTRAINT cedula_deportiva_id_torneo_fkey FOREIGN KEY (id_torneo) REFERENCES public.torneos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3343 (class 2606 OID 83461)
-- Name: equipo equipo_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_categoria_fkey FOREIGN KEY (categoria) REFERENCES public.categoria(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3344 (class 2606 OID 83466)
-- Name: equipo equipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_documento_fkey FOREIGN KEY (documento) REFERENCES public.usuario(documento) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3345 (class 2606 OID 83471)
-- Name: programacion programacion_fecha_encuentro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_fecha_encuentro_fkey FOREIGN KEY (fecha_encuentro) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3346 (class 2606 OID 83476)
-- Name: programacion programacion_id_equipo_local_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_id_equipo_local_fkey FOREIGN KEY (id_equipo_local) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3347 (class 2606 OID 83481)
-- Name: programacion programacion_id_equipo_visitante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_id_equipo_visitante_fkey FOREIGN KEY (id_equipo_visitante) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3348 (class 2606 OID 90985)
-- Name: programacion programacion_id_torneo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_id_torneo_fkey FOREIGN KEY (id_torneo) REFERENCES public.torneos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3349 (class 2606 OID 83542)
-- Name: programacion programacion_lugar_encuentro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programacion
    ADD CONSTRAINT programacion_lugar_encuentro_fkey FOREIGN KEY (lugar_encuentro) REFERENCES public.lugar_encuentro(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3350 (class 2606 OID 83491)
-- Name: rol_x_permiso rol_x_permiso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_x_permiso
    ADD CONSTRAINT rol_x_permiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permiso(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3351 (class 2606 OID 83496)
-- Name: rol_x_permiso rol_x_permiso_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_x_permiso
    ADD CONSTRAINT rol_x_permiso_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3352 (class 2606 OID 83501)
-- Name: usuario usuario_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3353 (class 2606 OID 83506)
-- Name: usuario usuario_id_fecha_nacimiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_fecha_nacimiento_fkey FOREIGN KEY (id_fecha_nacimiento) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3354 (class 2606 OID 83511)
-- Name: usuario usuario_id_fecha_registro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_fecha_registro_fkey FOREIGN KEY (id_fecha_registro) REFERENCES public."Fecha"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3355 (class 2606 OID 83516)
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id) ON DELETE CASCADE;


--
-- TOC entry 3356 (class 2606 OID 83521)
-- Name: usuario_x_equipo usuario_x_equipo_documento_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_documento_user_fkey FOREIGN KEY (documento_user) REFERENCES public.usuario(documento) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3357 (class 2606 OID 83526)
-- Name: usuario_x_equipo usuario_x_equipo_id_equipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_id_equipo_fkey FOREIGN KEY (id_equipo) REFERENCES public.equipo(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 83531)
-- Name: usuario_x_equipo usuario_x_equipo_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3359 (class 2606 OID 83536)
-- Name: usuario_x_equipo usuario_x_equipo_id_nota_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_x_equipo
    ADD CONSTRAINT usuario_x_equipo_id_nota_fkey FOREIGN KEY (id_nota) REFERENCES public.notas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-06-07 16:56:45

--
-- PostgreSQL database dump complete
--

-- Completed on 2025-06-07 16:56:45

--
-- PostgreSQL database cluster dump complete
--

