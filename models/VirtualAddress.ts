import mongoose from "mongoose";

const VirtualAddressSchema = new mongoose.Schema({
  // 누가 만들었는지 주인을 기록 (User 모델의 _id를 참조)
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 가상 주소 앞부분 (예: shopping_king)
  localPart: { type: String, required: true, unique: true },
  
  // 전체 주소 (예: shopping_king@manito.kr)
  fullAddress: { type: String, required: true },
  
  // 사용자가 적어둔 메모 (예: "무신사 가입용")
  memo: { type: String },
  
  // 활성화 여부 (꺼두면 메일 수신 거부)
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
});

// 모델이 이미 있으면 그거 쓰고, 없으면 새로 만듦 (서버 재시작 시 에러 방지)
const VirtualAddress = mongoose.models.VirtualAddress || mongoose.model("VirtualAddress", VirtualAddressSchema);

export default VirtualAddress;