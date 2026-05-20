// --- ALLERGEN-DATENBANK ---
export const allergenInfo = {
  A: 'Glutenhaltiges Getreide', B: 'Krebstiere', C: 'Ei', D: 'Fisch',
  E: 'Erdnuss', F: 'Soja', G: 'Milch oder Laktose', H: 'Schalenfrüchte',
  L: 'Sellerie', M: 'Senf', N: 'Sesam', O: 'Sulfite', P: 'Lupinen', R: 'Weichtiere'
};

export const menuData = [
  { id: 'd101', category: 'Döner & Kebab', nr: '101', name: 'Punjab Classic Döner', price: 5.50, desc: 'Saftiges Kalbfleisch, frisches Gemüse, hausgemachte Joghurt-Sauce mit Garam Masala.', allergens: ['A', 'G', 'N'], popular: true, image: 'https://picsum.photos/id/292/600/400' },
  { id: 'd102', category: 'Döner & Kebab', nr: '102', name: 'Chicken Tikka Döner', price: 5.90, desc: 'Würzig marinierte Hähnchenbrust, rote Zwiebeln, Minz-Chutney & frischer Salat.', allergens: ['A', 'G'], popular: true, image: 'https://picsum.photos/id/1060/600/400' },
  { id: 'd103', category: 'Döner & Kebab', nr: '103', name: 'Punjab Mix Döner', price: 6.50, desc: 'Kalb + Huhn + extra Schafkäse. Mit hausgemachter Chili-Sauce.', allergens: ['A', 'C', 'G', 'N'], image: 'https://picsum.photos/id/1080/600/400' },
  { id: 'd104', category: 'Döner & Kebab', nr: '104', name: 'Falafel Punjab', price: 5.20, desc: 'Knusprige hausgemachte Falafel mit indischen Gewürzen, Tahini & Granatapfel.', allergens: ['A', 'G', 'N'], image: 'https://picsum.photos/id/431/600/400' },
  { id: 'w201', category: 'Wraps & Spezialitäten', nr: '201', name: 'Butter Chicken Wrap', price: 6.90, desc: 'Zartes Hähnchen in cremiger Tomaten-Butter-Sauce, gewickelt mit frischem Salat.', allergens: ['A', 'C', 'G'], popular: true, image: 'https://picsum.photos/id/1083/600/400' },
  { id: 'w202', category: 'Wraps & Spezialitäten', nr: '202', name: 'Spicy Lamb Wrap', price: 7.20, desc: 'Scharfes Lammfleisch, Pickles, Rucola & Punjabi Chili-Sauce.', allergens: ['A', 'G', 'N'], image: 'https://picsum.photos/id/292/600/400' },
  { id: 'b301', category: 'Burger & Fries', nr: '301', name: 'Kebab Burger', price: 7.50, desc: 'Dönerfleisch-Patty, Cheddar, Röstzwiebeln & hausgemachte Sauce im Brioche-Bun.', allergens: ['A', 'C', 'G', 'N'], image: 'https://picsum.photos/id/1080/600/400' },
  { id: 's401', category: 'Beilagen & Desserts', nr: '401', name: 'Samosa (3 Stk.)', price: 4.50, desc: 'Hausgemacht mit Kartoffeln, Erbsen & indischen Gewürzen. Mit Chutney.', allergens: ['A', 'G'], image: 'https://picsum.photos/id/292/600/400' },
  { id: 's402', category: 'Beilagen & Desserts', nr: '402', name: 'Gulab Jamun (2 Stk.)', price: 4.20, desc: 'Süße indische Milchbällchen in Rosenwasser-Sirup. Ein Traum!', allergens: ['G'], image: 'https://picsum.photos/id/1083/600/400' },
];

export const categories = ['Döner & Kebab', 'Wraps & Spezialitäten', 'Burger & Fries', 'Beilagen & Desserts', '🍖 Döner Builder', '🌶️ Spice Wheel'];
