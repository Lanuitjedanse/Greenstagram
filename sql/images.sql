DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=675&q=80',
    'Tropic',
    'Tropical plants',
    'Are so cute.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1090&q=80',
    'Desert',
    'Cactuses',
    'Are so cool.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1875&q=80',
    'Plant',
    'Cool plant',
    'pink plant do not care.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1525498128493-380d1990a112?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1875&q=80',
    'Plant',
    'Tropical vibes',
    'So so gorgeous.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1480072723304-5021e468de85?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
    'GreenLover',
    'How we like us what makes us real',
    '<3'
);
INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1505066211281-ed125c006f4c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    'YolandaHadid',
    'Greenhouse',
    'Foggy day'
);
INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1510265119258-db115b0e8172?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Bruno',
    'Sunny day in London',
    'Kynance Mews'
);
INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1529303906282-705ca092db6f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    'HungN',
    'Da Nang',
    'Vietnam'
);
INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1586375063704-5ee4fb8b6edd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80',
    'Shoeslover',
    'Need money for shoes',
    'LOL'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1602164945488-322a0e0a09e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=676&q=80',
    'Suburbian',
    'Buttes Chaumont',
    'Sunny day in Paris'
);