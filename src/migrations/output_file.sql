--
-- postgresSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: approval; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval (
    id integer NOT NULL,
    t_reg_id integer,
    profile text,
    qualify text,
    profilevalue text,
    qualifyvalue text
);


ALTER TABLE public.approval OWNER TO postgres;

--
-- Name: approval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.approval ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.approval_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat (
    id integer NOT NULL,
    s_reg_id integer NOT NULL,
    t_reg_id integer NOT NULL,
    message text
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    members integer[] NOT NULL
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.conversations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    id integer NOT NULL,
    use_id integer,
    ima text
);


ALTER TABLE public.image OWNER TO postgres;

--
-- Name: image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.image ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    conversation_id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    messages text,
    id integer NOT NULL,
    date date,
    time_value time without time zone
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: qualify_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qualify_info (
    id integer NOT NULL,
    t_degree text,
    t_degreetype text,
    t_degreeyear text,
    t_institute text,
    t_reg_id integer NOT NULL,
    city text,
    year_end text,
    image text
);


ALTER TABLE public.qualify_info OWNER TO postgres;

--
-- Name: qualify_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.qualify_info ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.qualify_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reqs_handling; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reqs_handling (
    id integer NOT NULL,
    s_reg_id integer,
    t_reg_id integer,
    c_id integer,
    value text
);


ALTER TABLE public.reqs_handling OWNER TO postgres;

--
-- Name: reqs_handling_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reqs_handling ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reqs_handling_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reqslots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reqslots (
    id integer NOT NULL,
    day character varying(20),
    start_time time without time zone,
    end_time time without time zone,
    subject character varying(100),
    t_reg_id integer,
    s_reg_id integer,
    status text,
    c_id integer,
    time_date date
);


ALTER TABLE public.reqslots OWNER TO postgres;

--
-- Name: reqslots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reqslots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reqslots_id_seq OWNER TO postgres;

--
-- Name: reqslots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reqslots_id_seq OWNED BY public.reqslots.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    t_reg_id integer NOT NULL,
    s_reg_id integer NOT NULL,
    rating text NOT NULL,
    comment text NOT NULL,
    c_id integer
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_info (
    s_id integer NOT NULL,
    s_address text,
    s_number numeric,
    s_reg_id integer,
    s_lname text,
    s_fname text,
    s_city text,
    s_gender text,
    longitude text,
    latitude text
);


ALTER TABLE public.student_info OWNER TO postgres;

--
-- Name: student_info_s_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.student_info ALTER COLUMN s_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_info_s_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: time_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.time_slots (
    slot_id integer NOT NULL,
    user_id integer NOT NULL,
    day character varying(10) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone,
    value text,
    time_date date
);


ALTER TABLE public.time_slots OWNER TO postgres;

--
-- Name: time_slots_slot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.time_slots_slot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.time_slots_slot_id_seq OWNER TO postgres;

--
-- Name: time_slots_slot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.time_slots_slot_id_seq OWNED BY public.time_slots.slot_id;


--
-- Name: tutor_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutor_info (
    t_address text,
    t_city text,
    t_name text,
    t_lname text,
    t_gender text,
    t_reg_id integer NOT NULL,
    number text,
    subject text,
    price text,
    about text,
    longitude text,
    latitude text
);


ALTER TABLE public.tutor_info OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text,
    password text,
    roles text,
    persona text,
    qualify text,
    image text,
    "time" text,
    approve text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reqslots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reqslots ALTER COLUMN id SET DEFAULT nextval('public.reqslots_id_seq'::regclass);


--
-- Name: time_slots slot_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots ALTER COLUMN slot_id SET DEFAULT nextval('public.time_slots_slot_id_seq'::regclass);


--
-- Name: approval approval_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval
    ADD CONSTRAINT approval_pkey PRIMARY KEY (id);


--
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: qualify_info qualify_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qualify_info
    ADD CONSTRAINT qualify_info_pkey PRIMARY KEY (id);


--
-- Name: reqslots reqslots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reqslots
    ADD CONSTRAINT reqslots_pkey PRIMARY KEY (id);


--
-- Name: student_info student_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_info
    ADD CONSTRAINT student_info_pkey PRIMARY KEY (s_id);


--
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (slot_id);


--
-- postgresQL database dump complete
--

