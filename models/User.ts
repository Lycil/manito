import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  // 누구의 메일인지 (User 모델 연결)
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 어떤 가상 주소로 받은 메일인지 (예: shopping@manito.kr)
  toAddress: { type: String, required: true },
  
  // 보낸 사람 (예: no-reply@musinsa.com)
  fromAddress: { type: String, required: true },
  fromName: { type: String },
  
  subject: { type: String, required: true },
  text: { type: String }, // 메일 본문 (텍스트)
  html: { type: String }, // 메일 본문 (HTML)
  
  // ✨ 핵심 기능: AI가 요약한 3줄 내용
  summary: { type: String }, 
  
  isRead: { type: Boolean, default: false }, // 읽음 여부
  receivedAt: { type: Date, default: Date.now }, // 받은 시간
});

// 모델이 이미 있으면 그거 쓰고, 없으면 새로 만듦
const Email = mongoose.models.Email || mongoose.model("Email", EmailSchema);

export default Email;