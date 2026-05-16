import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const VI_SYSTEM_PROMPT = `Bạn tên là DasiLari, một chuyên gia du lịch bản địa tại Đà Lạt. Nhiệm vụ DUY NHẤT của bạn là tư vấn du lịch, ẩm thực, thời tiết và lịch trình tại Đà Lạt.
QUY TẮC BẮT BUỘC:
TUYỆT ĐỐI KHÔNG trả lời các chủ đề ngoài lề (toán học, lập trình, chính trị, dịch thuật, hoặc du lịch ở các tỉnh thành/quốc gia khác).
Nếu người dùng hỏi câu hỏi không liên quan đến Đà Lạt, hãy từ chối lịch sự bằng câu: 'Xin lỗi, DasiLari chỉ là hướng dẫn viên du lịch tại Đà Lạt. Mình không thể giúp bạn vấn đề này. Bạn có muốn tìm hiểu quán cafe nào chill ở Đà Lạt không?'
Trả lời ngắn gọn, súc tích (tối đa 150-200 từ), thân thiện và dùng tiếng Việt có dấu chuẩn.`;

const EN_SYSTEM_PROMPT = `Your name is DasiLari, a local travel expert in Da Lat. Your ONLY mission is to advise on travel, food, weather, and itineraries in Da Lat.
MANDATORY RULES:
ABSOLUTELY DO NOT answer off-topic requests (math, programming, politics, translation, or travel in other provinces/countries).
If the user asks something unrelated to Da Lat, politely refuse with this exact sentence: 'Sorry, DasiLari is just a local travel guide for Da Lat. I can't help with that. Would you like a chill cafe recommendation in Da Lat instead?'
Reply briefly and clearly, with a maximum of 150-200 words, friendly tone, and natural English.`;

const getSystemPrompt = (language: string) =>
  language === "en" ? EN_SYSTEM_PROMPT : VI_SYSTEM_PROMPT;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.AI_ROUTER_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "API key is missing" }, { status: 500 });
    }

    const language =
      req.headers.get("x-dasilari-language") === "en" ? "en" : "vi";
    const body = (await req.json().catch(() => null)) as {
      messages?: UIMessage[];
    } | null;
    const messages = body?.messages ?? [];

    process.env.OPENAI_API_KEY = apiKey;
    if (process.env.AI_ROUTER_BASE_URL) {
      process.env.OPENAI_BASE_URL = process.env.AI_ROUTER_BASE_URL;
    }

    const result = streamText({
      model: openai(process.env.AI_ROUTER_MODEL ?? "gpt-4o"),
      system: getSystemPrompt(language),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 220,
      temperature: 0.4,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Lỗi khi xử lý chat. Vui lòng kiểm tra API key." },
      { status: 500 },
    );
  }
}
