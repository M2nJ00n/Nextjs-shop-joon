require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: false },
  desc: { type: String, required: false },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: false },
  badge: { type: String, required: false },
  rating: { type: String, default: '★★★★★' },
  reviews: { type: Number, default: 0 },
  imageUrl: { type: String, required: false },
  stock: { type: Number, default: 100 },
  category: { type: String, required: false, default: '베스트' },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const discoveryData = [
  { brand: 'PHILIPS', desc: '손목부담없는 다림질', category: '발견' },
  { brand: '파워에이드', desc: '월드컵 패키지 경품', category: '발견' },
  { brand: "Kellogg's", desc: '더 커진 레드베리바', category: '발견' },
  { brand: '하림 펫푸드', desc: '신선한 강아지 간식', category: '발견' },
  { brand: "AGE 20's", desc: '촉촉한 에센스 팩트', category: '발견' },
  { brand: '건강백서', desc: '건강백서 브랜드위크', category: '발견' },
  { brand: '비트', desc: '캡슐세제 특가', category: '발견' },
  { brand: '힐스사이언스', desc: '다이어트 사료', category: '발견' },
];

const specialDealsData = [
  {
    badge: '무료배송',
    title: '유기농 국내산 달콤한 햇 밤고구마 3kg, 1박스',
    price: 11500,
    discountPrice: 15000,
    rating: '★★★★★',
    reviews: 1204,
    category: '특가',
  },
  {
    badge: '특가',
    title: '충남 아산 신선한 국내산 양배추 1통, 당일수확',
    price: 8900,
    discountPrice: 11000,
    rating: '★★★★☆',
    reviews: 85,
    category: '특가',
  },
  {
    badge: '로켓직구',
    title: '프리미엄 무선 진동 마사지건 6단계 조절',
    price: 32000,
    discountPrice: 45000,
    rating: '★★★★★',
    reviews: 3412,
    category: '특가',
  },
  {
    badge: '무료배송',
    title: '캠핑용 초강력 LED 후레쉬 랜턴 충전식',
    price: 18700,
    discountPrice: 25000,
    rating: '★★★★☆',
    reviews: 512,
    category: '특가',
  },
  {
    badge: '무료배송',
    title: '여성용 가을 겨울 루즈핏 브이넥 니트 가디건',
    price: 27500,
    rating: '★★★★★',
    reviews: 104,
    category: '특가',
  },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('No URI');
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    
    const dProducts = discoveryData.map(i => ({ title: `${i.brand} - ${i.desc}`, brand: i.brand, desc: i.desc, price: 10000, category: i.category }));
    const sProducts = specialDealsData.map(i => ({ title: i.title, price: i.price, discountPrice: i.discountPrice, rating: i.rating, reviews: i.reviews, badge: i.badge, category: i.category }));
    
    await Product.insertMany([...dProducts, ...sProducts]);
    console.log('Seeding Success');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
}
seed();
