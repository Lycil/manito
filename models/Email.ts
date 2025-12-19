import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  // 1. 누구의 메일인가? (User 모델 연결)
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 2. 수신 정보
  toAddress: { type: String, required: true }, // 받은 가상 주소 (예: shop@manito.kr)
  
  // 3. 발신 정보
  fromAddress: { type: String, required: true }, // 보낸 사람 이메일
  fromName: { type: String }, // 보낸 사람 이름 (선택)
  
  // 4. 메일 내용
  subject: { type: String, required: true }, // 제목
  text: { type: String }, // 본문 (텍스트)
  html: { type: String }, // 본문 (HTML) - 나중에 이메일 폼 그대로 보여줄 때 필요
  
  // ✨ 5. 핵심 기능: AI 요약
  summary: { type: String }, // AI가 요약한 3줄 내용
  
  // 6. 상태 정보
  isRead: { type: Boolean, default: false }, // 읽음 여부
  receivedAt: { type: Date, default: Date.now }, // 받은 시간
});

// 모델이 이미 있으면 재사용, 없으면 생성
const Email = mongoose.models.Email || mongoose.model("Email", EmailSchema);

export default Email;