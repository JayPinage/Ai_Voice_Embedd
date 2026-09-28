const GROQ_URL =
    "https://api.groq.com/openai/v1/chat/completions";

export const generateGroqResponse = async ({
    prompt,
    apiKey,
    model = "openai/gpt-oss-20b",
    user = null
}) => {

    try {

        // Check API key
        if (!apiKey) {
            throw new Error("Groq API key is missing");
        }

        // Check prompt
        if (!prompt) {
            throw new Error("Prompt is missing");
        }

        const response = await fetch(GROQ_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },

            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                ...(user && { user: String(user._id || user) })
            })
        });

        // Read response FIRST
        const data = await response.json();

        console.log("Groq status:", response.status);
        console.log("Groq response:", data);

        // Handle API errors
        if (!response.ok) {

            if (user) {

                if (response.status === 400 || response.status === 401) {
                    user.geminiStatus = "invalid";
                }

                if (response.status === 429) {
                    user.geminiStatus = "quota_exceeded";
                }

                await user.save();
            }

            throw new Error(
                data?.error?.message ||
                `Groq API error: ${response.status}`
            );
        }

        // API succeeded
        if (user) {
            user.geminiStatus = "active";
            await user.save();
        }

        const text =
            data?.choices?.[0]?.message?.content;

        console.log("Groq generated text:", text);

        if (!text) {
            throw new Error(
                "Groq returned no message content"
            );
        }

        return text.trim();

    } catch (error) {

        console.error("Groq Error:", error);

        throw error;
    }
};