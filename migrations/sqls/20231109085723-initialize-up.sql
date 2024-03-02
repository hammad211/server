


-- Table: public.users

-- DROP TABLE IF EXISTS public.users

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 32 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    roles text COLLATE pg_catalog."default",
    value text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;


-- Table: public.tutor_time

-- DROP TABLE IF EXISTS public.tutor_time;

CREATE TABLE IF NOT EXISTS public.tutor_time
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    t_reg_id integer NOT NULL,
    value text COLLATE pg_catalog."default",
    course text COLLATE pg_catalog."default",
    price integer,
    CONSTRAINT tutor_time_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tutor_time
    OWNER to postgres;


-- Table: public.tutor_info

-- DROP TABLE IF EXISTS public.tutor_info;

CREATE TABLE IF NOT EXISTS public.tutor_info
(
    t_address text COLLATE pg_catalog."default",
    t_city text COLLATE pg_catalog."default",
    t_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    t_name text COLLATE pg_catalog."default",
    t_lname text COLLATE pg_catalog."default",
    t_gender text COLLATE pg_catalog."default",
    t_reg_id integer NOT NULL,
    CONSTRAINT tutor_info_pkey PRIMARY KEY (t_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tutor_info
    OWNER to postgres;

    -- Table: public.student_info

-- DROP TABLE IF EXISTS public.student_info;

CREATE TABLE IF NOT EXISTS public.student_info
(
    s_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    s_address text COLLATE pg_catalog."default",
    s_number numeric,
    s_reg_id integer,
    s_lname text COLLATE pg_catalog."default",
    s_fname text COLLATE pg_catalog."default",
    s_city text COLLATE pg_catalog."default",
    s_gender text COLLATE pg_catalog."default",
    CONSTRAINT student_info_pkey PRIMARY KEY (s_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student_info
    OWNER to postgres;



    -- Table: public.req_table

-- DROP TABLE IF EXISTS public.req_table;

CREATE TABLE IF NOT EXISTS public.req_table
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    status text COLLATE pg_catalog."default",
    t_reg_id integer,
    s_reg_id integer,
    c_id integer NOT NULL,
    CONSTRAINT req_table_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.req_table
    OWNER to postgres;

    -- Table: public.qualify_info

-- DROP TABLE IF EXISTS public.qualify_info;

CREATE TABLE IF NOT EXISTS public.qualify_info
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    t_degree text COLLATE pg_catalog."default",
    t_degreetype text COLLATE pg_catalog."default",
    t_degreeyear text COLLATE pg_catalog."default",
    t_institute text COLLATE pg_catalog."default",
    t_reg_id integer NOT NULL,
    CONSTRAINT qualify_info_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.qualify_info
    OWNER to postgres;


    -- Table: public.messages

-- DROP TABLE IF EXISTS public.messages;

CREATE TABLE IF NOT EXISTS public.messages
(
    conversation_id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    messages text COLLATE pg_catalog."default",
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    CONSTRAINT messages_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.messages
    OWNER to postgres;


    -- Table: public.chat

-- DROP TABLE IF EXISTS public.chat;

CREATE TABLE IF NOT EXISTS public.chat
(
    id integer NOT NULL,
    s_reg_id integer NOT NULL,
    t_reg_id integer NOT NULL,
    message text COLLATE pg_catalog."default",
    CONSTRAINT chat_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat
    OWNER to postgres;

    -- Table: public.conversations

-- DROP TABLE IF EXISTS public.conversations;

CREATE TABLE IF NOT EXISTS public.conversations
(
    id integer NOT NULL ,
    members integer[] NOT NULL,
    CONSTRAINT conversations_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.conversations
    OWNER to postgres;        