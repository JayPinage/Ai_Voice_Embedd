import User from "../Models/user.model.js";
import { generateGroqResponse } from "../Config/gemini.js";


// ============================================================
// GET ASSISTANT CONFIG
// ============================================================

export const getAssistantConfig = async (req, res) => {
    try {

        const { userId } = req.params;

        const user = await User
            .findById(userId)
            .select("-geminiApikey");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Assistant config data",
            user
        });

    } catch (error) {

        console.error(
            "Get assistant config error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Assistant config not found"
        });
    }
};


// ============================================================
// ASK ASSISTANT
// ============================================================

export const askAssistant = async (req, res) => {

    try {

        // ====================================================
        // GET REQUEST DATA
        // ====================================================

        const {
            message,
            userId,
            currentPath
        } = req.body;


        // ====================================================
        // VALIDATION
        // ====================================================

        if (!message || !userId) {

            return res.status(400).json({
                success: false,
                message:
                    "Message and user id are required"
            });
        }


        // ====================================================
        // FIND USER
        // ====================================================

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ====================================================
        // API KEY
        // ====================================================

        if (!user.geminiApikey) {

            return res.status(404).json({
                success: false,
                message: "Groq API key not found"
            });
        }


        // ====================================================
        // FREE PLAN LIMIT
        // ====================================================

        if (
            user.plan === "free" &&
            user.totalMessages >= user.requestLimit
        ) {

            return res.status(400).json({
                success: false,
                message: "Free request limit exceeded"
            });
        }


        // ====================================================
        // PRO PLAN EXPIRATION
        // ====================================================

        if (
            user.plan === "pro" &&
            user.proExpireAt &&
            new Date(user.proExpireAt) < new Date()
        ) {

            user.plan = "free";

            await user.save();

            return res.status(400).json({
                success: false,
                message: "Pro plan expired"
            });
        }


        // ====================================================
        // CLEAN MESSAGE
        // ====================================================

        const cleanMessage =
            String(message)
                .trim()
                .toLowerCase();


        // ====================================================
        // WEBSITE NAVIGATION
        // ====================================================

        if (user.enableNavigation) {

            const navigationWords = [
                "open",
                "go",
                "start",
                "show",
                "navigate",
                "take me",
                "visit",
                "view",
                "check"
            ];


            // ------------------------------------------------
            // Detect navigation request
            // ------------------------------------------------

            const wantNavigation =
                navigationWords.some((word) =>
                    cleanMessage.includes(word)
                );


            console.log(
                "Navigation enabled:",
                user.enableNavigation
            );

            console.log(
                "Message:",
                cleanMessage
            );

            console.log(
                "Want navigation:",
                wantNavigation
            );


            if (wantNavigation) {

                // --------------------------------------------
                // Find matching page
                // --------------------------------------------

                const pages = user.pages || [];

                const matchPage = pages.find((page) => {

                    const keywords =
                        page.keywords || [];


                    return keywords.some((keyword) => {

                        if (!keyword) {
                            return false;
                        }

                        return cleanMessage.includes(
                            String(keyword)
                                .trim()
                                .toLowerCase()
                        );
                    });
                });


                console.log(
                    "Matched page:",
                    matchPage
                );


                // --------------------------------------------
                // Page found
                // --------------------------------------------

                if (matchPage) {

                    const targetPath =
                        matchPage.path;


                    console.log(
                        "Current path:",
                        currentPath
                    );

                    console.log(
                        "Target path:",
                        targetPath
                    );


                    // ----------------------------------------
                    // Already on page
                    // ----------------------------------------

                    if (
                        currentPath &&
                        targetPath &&
                        currentPath === targetPath
                    ) {

                        return res.status(200).json({
                            success: true,
                            action: "speak",
                            response:
                                `${matchPage.name} is already open`
                        });
                    }


                    // ----------------------------------------
                    // Navigate
                    // ----------------------------------------

                    return res.status(200).json({

                        success: true,

                        action: "navigate",

                        path: targetPath,

                        response:
                            `Opening ${matchPage.name}`
                    });
                }


                console.log(
                    "No matching page found for:",
                    cleanMessage
                );
            }
        }


        // ====================================================
        // GROQ API KEY
        // ====================================================

        const apiKey =
            String(user.geminiApikey || "")
                .trim()
                .replace(/^["']|["']$/g, "");


        // ====================================================
        // DEBUG API KEY
        // ====================================================

        console.log(
            "========== GROQ KEY DEBUG =========="
        );

        console.log(
            "Key exists:",
            Boolean(apiKey)
        );

        console.log(
            "Key length:",
            apiKey.length
        );

        console.log(
            "Key prefix:",
            apiKey.substring(0, 8)
        );

        console.log(
            "Key suffix:",
            apiKey.slice(-4)
        );

        console.log(
            "===================================="
        );


        // ====================================================
        // PROMPT
        // ====================================================

        const prompt = `
You are ${user.assistantName || "Jack"}.

Business Name:
${user.businessName || ""}

Business Type:
${user.businessType || ""}

Business Description:
${user.businessDescription || ""}

Assistant Tone:
${user.tone || "friendly"}

Rules:
- Keep replies under 15 words
- Give fast direct responses
- Talk naturally
- Behave like a smart website voice assistant
- Avoid long explanations
- Keep responses short for voice playback

User Question:
${message}
`;


        // ====================================================
        // CALL GROQ
        // ====================================================

        const aiResponse =
            await generateGroqResponse({
                prompt,
                apiKey,
                model: "openai/gpt-oss-20b",
                user
            });


        // ====================================================
        // INCREMENT FREE PLAN USAGE
        // ====================================================

        if (user.plan === "free") {

            user.totalMessages =
                (user.totalMessages || 0) + 1;

            await user.save();
        }


        // ====================================================
        // NORMAL AI RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            action: "speak",

            response: aiResponse,

            // Keep this for compatibility
            aiResponse
        });


    } catch (error) {

        console.error(
            "Assistant error:",
            error
        );


        // ====================================================
        // INVALID GROQ KEY
        // ====================================================

        if (error.status === 401) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Groq API key. Please update your API key."
            });
        }


        // ====================================================
        // RATE LIMIT
        // ====================================================

        if (error.status === 429) {

            return res.status(429).json({

                success: false,

                message:
                    "Groq rate limit exceeded. Please try again later."
            });
        }


        // ====================================================
        // GENERAL ERROR
        // ====================================================

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Assistant AI error"
        });
    }
};