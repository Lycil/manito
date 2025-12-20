// lib/gemini.ts
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// AI가 답할 형식을 미리 정의
const schema: Schema = {
  description: "이메일 분석 결과",
  type: SchemaType.OBJECT,
  properties: {
    summary: { 
      type: SchemaType.STRING, 
      description: "이메일 내용을 한국어로 3줄 이내로 핵심만 요약" 
    },
    isImportant: { 
      type: SchemaType.BOOLEAN, 
      description: "사용자가 반드시 확인해야 할 중요한 메일인지 여부(청구서, 보안알림, 개인메일 등은 true / 광고, 뉴스레터는 false)" 
    },
    category: { 
      type: SchemaType.STRING, 
      description: "메일의 카테고리(예: 광고, 청구서, 보안, 뉴스레터, 소셜, 기타)" 
    },
    reason: { 
      type: SchemaType.STRING, 
      description: "왜 중요하다고(혹은 안 중요하다고) 판단했는지에 대한 짧은 이유" 
    },
  },
  required: ["summary", "isImportant", "category", "reason"],
};

// 모델 설정
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json", // JSON 모드 강제
    responseSchema: schema,
  },
});

/**
 * 이메일을 분석하는 함수
 * @param sender 보낸 사람 (예: Google <no-reply@google.com>)
 * @param subject 이메일 제목
 * @param body 이메일 본문 (텍스트)
 */
export async function analyzeEmail(sender: string, subject: string, body: string) {
  if (!apiKey) {
    console.error("GEMINI_API_KEY 설정 필요");
    return null;
  }

  try {
    // 3. 프롬프트 작성
    const prompt = `
      너는 똑똑한 이메일 비서야. 아래 수신된 이메일을 분석해줘.
      
      [이메일 정보]
      - 보낸 사람: ${sender}
      - 제목: ${subject}
      - 본문 내용 (일부): 
      ${body.slice(0, 5000)} ... (생략)

      [분석 규칙]
      1. 내용은 한국어로 요약해줘.
      2. 'isImportant' 판단 기준:
         - True: 결제/청구서, 비밀번호 찾기/보안 인증, 택배 배송 알림, 사람이 직접 쓴 개인 메일
         - False: 단순 광고, 뉴스레터, 소셜 미디어 알림, 스팸
      3. 요약은 "3줄 요약" 형식으로 해줘.
    `;

    // AI에게 요청
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 결과 파싱해서 반환
    const data = JSON.parse(responseText);
    return data;

  } catch (error) {
    console.error("Gemini 이메일 분석 실패:", error);
    // 에러 나면 기본값 리턴
    return {
      summary: "AI 분석 실패",
      isImportant: false,
      category: "기타",
      reason: "AI 서비스 연결 오류",
    };
  }
}