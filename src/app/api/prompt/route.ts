import axios from "axios";
import { NextResponse } from "next/server";

const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "meta/llama-4-maverick-17b-128e-instruct";

type ChatPart = {
  text: string;
};

type ChatMessage = {
  role: "user" | "model";
  parts: ChatPart[];
};

// SYSTEM ROLE
const systemRole = `
Ikaw ay isang opisyal ng Department of Environment and Natural Resources (DENR)
sa Community Environment and Natural Resources Office (CENRO).

Ang trabaho mo ay:
- Sagutin ang tanong ng user tungkol sa pagproseso ng application
- Ibigay ang requirements
- I-explain ang step-by-step na proseso
- Gumamit ng malinaw, maayos, at government service tone
- Huwag lumihis sa trabaho ng CENRO

Narito ang OFFICIAL REQUIREMENTS:

1. Request Letter
2. Barangay Certificate
3. OR/CR
4. Driver's License
5. Other Supporting Documents (Optional)

Narito ang OFFICIAL PROCESS:

Step 1 - Submission
- Client: Submit request letter and supporting documents
- Agency: Check completeness, receive, forward to Officer
- Time: 30 min

Step 1.1
- Review application
- Forward to Chief RPS/Chief TSD
- Time: 30 min

Step 1.2
- Review/evaluate request
- Assign verification team
- Time: 1 hour

Step 1.3
- Prepare and approve Order of Payment
- Time: 1 hour

Step 2 - Payment
- Client: Pay fees
- Agency: Accept payment and issue OR
- Fees:
  - PHP 50.00 per truck load - Certificate of Verification Fee
  - PHP 36.00 Oath Fee / application
  - PHP 360.00 Inspection Fee
- Time: 30 min

Step 3 - Inspection
- Inspect forest products
- Prepare Inspection Report + COV
- Time: 5 days

Step 3.1
- Review inspection report
- Time: 1 hour

Step 3.2
- Review, sign, approve COV
- Time: 1 hour

Step 3.3
- Release approved COV
- Time: 15 mins
`;

// Convert internal chat structure to NVIDIA messages
function toNvidiaMessages(contents: ChatMessage[]) {
  return contents
    .map((message) => {
      const content = message.parts
        .map((part) => part.text.trim())
        .filter(Boolean)
        .join("\n");
      if (!content) return null;

      return {
        role: message.role === "model" ? "assistant" : "user",
        content,
      };
    })
    .filter((message): message is { role: "assistant" | "user"; content: string } => message !== null);
}

// API Handler
export async function POST(req: Request) {
  try {
    const { contents } = (await req.json()) as { contents?: ChatMessage[] };

    if (!Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json({ error: "Chat history is required." }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing NVIDIA_API_KEY on the server." }, { status: 500 });
    }

    const response = await axios.post(
      INVOKE_URL,
      {
        model: MODEL,
        messages: [{ role: "system", content: systemRole.trim() }, ...toNvidiaMessages(contents)],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    const answer = response.data?.choices?.[0]?.message?.content;

    if (!answer || typeof answer !== "string") {
      return NextResponse.json({ error: "AI response was empty." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("NVIDIA API Error:", error.response?.data || error.message);
    } else {
      console.error("Prompt Route Error:", error);
    }

    return NextResponse.json({ error: "Failed to fetch AI response." }, { status: 500 });
  }
}
