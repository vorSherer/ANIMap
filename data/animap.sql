DROP TABLE IF EXISTS myANIMap;

CREATE TABLE myANIMap (
  id SERIAL PRIMARY KEY,
  mal_id VARCHAR(250),
  image_url TEXT,
  title TEXT,
  animeType VARCHAR(250),
  synopsis TEXT,
  rated VARCHAR(250),
  episodes VARCHAR(250),
  myRanking SMALLINT,
  comments TEXT,
  category VARCHAR(250)
);

INSERT INTO myANIMap (mal_id,image_url, title, animeType, synopsis, rated, episodes,myRanking ,comments,category) 
VALUES (20, 
'https://myanimelist.net/anime/20/Naruto'
'Naruto',
'TV',
'Moments prior to Naruto Uzumakis birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi',
'PG-13',
'220',
4,
'I like naruto',
'Favotites'
);

INSERT INTO myANIMap (mal_id,image_url, title, animeType, synopsis, rated, episodes,myRanking ,comments,category) 
VALUES (20, 
'4134'
'https://myanimelist.net/anime/4134/Naruto__Shippuuden_-_Shippuu_Konoha_Gakuen_Den',
'Naruto: Shippuuden - Shippuu!',
'Special',
'Naruto school special. Naruto is a new cool student and when he meets Sasuke they start fighting.',
'PG-13',
'100',
3,
'This is a cool movie.',
'Favorites'
);

INSERT INTO myANIMap (mal_id,image_url, title, animeType, synopsis, rated, episodes,myRanking ,comments,category) 
VALUES (20, 
'1527'
'https://cdn.myanimelist.net/images/anime/7/21319.jpg?s=8f46bd430f4df48caee33c2aee630d84',
'Pokemon: Senritsu no Mirage Pokemon',
'ONA',
'Dr. Yung, an enigmatic Pokémon scientist, has developed a new Mirage system that uses computer data to resurrect extinct Pokémon, like Kabutops and Armaldo. Professor Oak, Ash and his companions show',
'PG',
'100',
5,
'Pokemon is a must in this collection',
'To watch again'
);

SELECT * FROM myANIMap;