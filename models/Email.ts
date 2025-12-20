import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toAddress: { type: String, required: true },
  fromAddress: { type: String, required: true },
  fromName: { type: String },
  subject: { type: String, required: true },
  text: { type: String },
  html: { type: String },
  receivedAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },

  summary: { type: String }, // 3줄 요약
  isImportant: { type: Boolean, default: false }, // 중요 여부
  category: { type: String }, // 카테고리
  importanceReason: { type: String }, // 판단 이유
});

// 불필요한 메일 30일 후 삭제
EmailSchema.index(
  { receivedAt: 1 }, 
  { 
    expireAfterSeconds: 2592000, 
    partialFilterExpression: { isImportant: false } 
  }
);

// 모델이 이미 있으면 재사용, 없으면 생성
const Email = mongoose.models.Email || mongoose.model("Email", EmailSchema);

export default Email;