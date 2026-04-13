import mongoose, { Schema, models } from 'mongoose'

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: false },
    desc: { type: String, required: false }, // short description
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    badge: { type: String, required: false }, // e.g., '무료배송', '특가'
    rating: { type: String, default: '★★★★★' },
    reviews: { type: Number, default: 0 },
    imageUrl: { type: String, required: false },
    detailImages: { type: [String], default: [] }, // 상세 페이지 추가 이미지
    stock: { type: Number, default: 100 }, // inventory
    category: { type: String, required: false, default: '베스트' }, // classification
  },
  { timestamps: true }
)

const Product = models.Product || mongoose.model('Product', productSchema)
export default Product
