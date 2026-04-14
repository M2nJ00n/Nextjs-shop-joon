import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    address: { type: String, default: '' },
    payMethod: { type: String, default: 'card' },
    status: { type: String, default: '결제완료' },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
)

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

export default Order
