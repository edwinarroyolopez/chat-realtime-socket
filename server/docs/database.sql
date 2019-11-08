-- auto-generated definition
create table user_chat
(
    uuid_user  text not null
    constraint uuid_user_chat_pkey primary key,
    name            text,
    created_at      timestamp with time zone,
    updated_at      timestamp with time zone
);


-- auto-generated definition
create table conversation
(
    uuid_conversation  text not null
    constraint uuid_conversation_pkey primary key,
    uuid_user_one            text,
    uuid_user_two            text,
    created_at      timestamp with time zone,
    updated_at      timestamp with time zone
);



-- auto-generated definition
create table chat_messages
(
    uuid_message  text not null
    constraint uuid_message_pkey primary key,
    uuid_conversation  text not null,
    uuid_user            text not null,
    message            text,
    created_at      timestamp with time zone,
    updated_at      timestamp with time zone
);

