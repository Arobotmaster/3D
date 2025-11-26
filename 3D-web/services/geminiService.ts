const API_KEY = process.env.API_KEY || '';
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const IMAGE_API_URL = "https://api.siliconflow.cn/v1/images/generations";

export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) return "https://picsum.photos/seed/3dprint/600/400";

  try {
    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "Kwai-Kolors/Kolors",
        prompt: prompt,
        size: "1024x1024",
        n: 1,
        step: 20 // Based on user's extra_body
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Image API Error:", response.status, errorData);
      throw new Error(`Image API failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0]?.url || "https://picsum.photos/seed/error/600/400";
  } catch (error) {
    console.error("Image Generation Error:", error);
    return "https://picsum.photos/seed/error/600/400";
  }
};

export const generateAIResponse = async (
  prompt: string,
  onStreamUpdate?: ((text: string) => void) | null,
  systemInstruction?: string,
  model?: string
): Promise<string> => {
  if (!API_KEY) {
    // Fallback for demo purposes if no API key is present
    const demoText = "这是一个演示回复。请配置您的 process.env.API_KEY 以使用真实的 AI 服务。我可以帮您诊断3D打印机故障，进行模型切片建议，或生成G代码优化方案。";
    if (onStreamUpdate) {
      let currentText = "";
      const chars = demoText.split("");
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (chars.length === 0) {
            clearInterval(interval);
            resolve(currentText);
            return;
          }
          currentText += chars.shift();
          onStreamUpdate(currentText);
        }, 50);
      });
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(demoText);
      }, 1000);
    });
  }

  const defaultSystemInstruction = "你是一个Neurafab平台的3D打印专家助手。你可以帮助用户诊断打印机问题（如喷头堵塞、层纹位移），建议材料设置（PLA, ABS, TPU），并优化分布式制造流程。请始终用中文回答，专业且友善。";
  const finalSystemInstruction = systemInstruction || defaultSystemInstruction;

  const messages = [
    {
      role: "system",
      content: finalSystemInstruction
    },
    {
      role: "user",
      content: prompt
    }
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || "deepseek-ai/DeepSeek-V3.2-Exp",
        messages: messages,
        stream: !!onStreamUpdate,
        max_tokens: 4096,
        enable_thinking: false,
        thinking_budget: 4096,
        min_p: 0.05,
        stop: null,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        response_format: {
          type: "text"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("AI API Error:", response.status, errorData);
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    if (onStreamUpdate && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last line in buffer if it's incomplete
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const content = data.choices?.[0]?.delta?.content || "";
              if (content) {
                fullText += content;
                onStreamUpdate(fullText);
              }
            } catch (e) {
              console.warn("Failed to parse SSE message", e);
            }
          }
        }
      }
      return fullText;
    } else {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "无法生成回复。";
    }

  } catch (error: any) {
    console.error("AI Service Error:", error);
    return `抱歉，连接AI大脑时出现错误: ${error.message || "未知错误"}`;
  }
};