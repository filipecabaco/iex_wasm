-- Something to query from the first prompt: the planets, with their mass relative to Earth's and
-- their number of confirmed moons (IAU/NASA figures)
CREATE TABLE planets (
  name        text PRIMARY KEY,
  mass_earths numeric NOT NULL,
  moons       integer NOT NULL,
  kind        text NOT NULL
);
INSERT INTO planets VALUES
  ('Mercury', 0.055, 0, 'rocky'),
  ('Venus', 0.815, 0, 'rocky'),
  ('Earth', 1, 1, 'rocky'),
  ('Mars', 0.107, 2, 'rocky'),
  ('Jupiter', 317.8, 95, 'gas giant'),
  ('Saturn', 95.2, 146, 'gas giant'),
  ('Uranus', 14.5, 28, 'ice giant'),
  ('Neptune', 17.1, 16, 'ice giant');
