-- seed.sql
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  image TEXT
);

-- Contoh insert dari recipeDatabase kamu
INSERT INTO recipes (name, ingredients, instructions, image) VALUES
(
  'Mie Dokdok Sosis Telur',
  ARRAY['mie instan','telur','sosis','bawang merah','bawang putih','kecap manis','saos sambal'],
  '1. Rebus mie instan hingga setengah matang, tiriskan. 2. Tumis bawang merah & putih. Masukkan telur, orak-arik. 3. Masukkan sosis, tumis sebentar. 4. Masukkan mie, bumbu instan, kecap, dan saos. Aduk rata. 5. Sajikan!',
  'assets/MieDokdokSosisTelur.png'
);
