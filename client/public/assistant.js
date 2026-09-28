(function () {
    "use strict";

    // =====================================================
    // PREVENT DUPLICATE ASSISTANT
    // =====================================================

    if (window.__JACK_AI_LOADED__) {
        console.warn("Jack AI is already loaded.");
        return;
    }

    window.__JACK_AI_LOADED__ = true;


    // =====================================================
    // CONFIGURATION
    // =====================================================

    const script = document.currentScript;

    const userId = script?.dataset?.userId;

    const API_BASE_URL = "https://ai-voice-embeddserver.onrender.com";

    const CSS_URL = "https://embeddai.onrender.com/assistant.css";

    const DEFAULT_THEME = "neon";


    // =====================================================
    // VALIDATE USER ID
    // =====================================================

    if (!userId) {
        console.error(
            "Jack AI: userId is missing. Add data-user-id to the script."
        );

        return;
    }


    // =====================================================
    // STATE
    // =====================================================

    let assistantConfig = null;

    let isOpen = false;

    let isListening = false;

    let isSpeaking = false;

    let isProcessing = false;


    // =====================================================
    // LOAD CSS
    // =====================================================

    if (!document.querySelector(
        `link[data-jack-ai-css="true"]`
    )) {

        const link = document.createElement("link");

        link.rel = "stylesheet";

        link.href = CSS_URL;

        link.dataset.jackAiCss = "true";

        document.head.appendChild(link);
    }


    // =====================================================
    // CREATE FLOATING LAUNCHER
    // =====================================================

    const launcher = document.createElement("button");

    launcher.className =
        `jack-launcher theme-${DEFAULT_THEME}`;

    launcher.type = "button";

    launcher.setAttribute(
        "aria-label",
        "Open Jack AI assistant"
    );

    launcher.innerHTML = "🎙";


    // =====================================================
    // CREATE ASSISTANT POPUP
    // =====================================================

    const popup = document.createElement("div");

    popup.className =
        `jack-popup theme-${DEFAULT_THEME}`;

    popup.style.display = "none";

    popup.innerHTML = `
        <div class="jack-overlay"></div>

        <div class="jack-content">

            <div class="jack-top">
                <div class="jack-orb-glow"></div>
                <div class="jack-orb"></div>
            </div>

            <h2 class="jack-title">
                Hello I'm Jack AI
            </h2>

            <p class="jack-sub">
                Your smart Voice Assistant.<br>
                Ask anything about this website.
            </p>

            <div class="jack-status">
                Tap button to speak
            </div>

            <div class="jack-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div class="jack-user-text"></div>

            <div class="jack-ai-text"></div>

            <div class="jack-bottom">

                <button
                    class="jack-mic"
                    type="button"
                    aria-label="Start voice recognition">
                </button>

            </div>

        </div>
    `;


    // =====================================================
    // ADD TO PAGE
    // =====================================================

    document.body.appendChild(launcher);

    document.body.appendChild(popup);


    // =====================================================
    // GET ELEMENTS
    // =====================================================

    const status =
        popup.querySelector(".jack-status");

    const wave =
        popup.querySelector(".jack-wave");

    const userText =
        popup.querySelector(".jack-user-text");

    const aiText =
        popup.querySelector(".jack-ai-text");

    const mic =
        popup.querySelector(".jack-mic");

    const title =
        popup.querySelector(".jack-title");

    const subTitle =
        popup.querySelector(".jack-sub");


    // =====================================================
    // SPEECH SYNTHESIS
    // =====================================================

    const speak = (text) => {

        if (!text) {
            return;
        }

        text = String(text).trim();

        if (!text) {
            return;
        }

        // Stop previous speech
        window.speechSynthesis.cancel();

        isSpeaking = true;

        wave.style.opacity = "1";

        status.innerText = "AI speaking...";

        aiText.innerText = text;

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 1.0;

        speech.pitch = 1.0;

        speech.volume = 1.0;


        // =================================================
        // SPEECH START
        // =================================================

        speech.onstart = () => {

            isSpeaking = true;

            status.innerText =
                "AI speaking...";

            wave.style.opacity = "1";
        };


        // =================================================
        // SPEECH END
        // =================================================

        speech.onend = () => {

            isSpeaking = false;

            wave.style.opacity = "0";

            status.innerText =
                "Tap button to speak";
        };


        // =================================================
        // SPEECH ERROR
        // =================================================

        speech.onerror = (error) => {

            console.error(
                "Speech synthesis error:",
                error
            );

            isSpeaking = false;

            wave.style.opacity = "0";

            status.innerText =
                "Tap button to speak";
        };


        window.speechSynthesis.speak(speech);
    };


    // =====================================================
    // SPEECH RECOGNITION
    // =====================================================

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    let recognition = null;


    if (SpeechRecognition) {

        recognition =
            new SpeechRecognition();


        // =================================================
        // RECOGNITION CONFIG
        // =================================================

        recognition.lang = "en-US";

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;


        // =================================================
        // RECOGNITION START
        // =================================================

        recognition.onstart = () => {

            isListening = true;

            isProcessing = false;

            status.innerText =
                "Listening...";

            wave.style.opacity = "1";

            mic.classList.add("listening");
        };


        // =================================================
        // RECOGNITION RESULT
        // =================================================

        recognition.onresult = async (event) => {

            if (!event.results ||
                !event.results[0]) {

                return;
            }


            const text =
                event.results[0][0]
                    .transcript
                    .trim();


            if (!text) {
                return;
            }


            console.log(
                "User said:",
                text
            );


            userText.innerText =
                "YOU: " + text;


            isProcessing = true;

            isListening = false;

            wave.style.opacity = "1";

            status.innerText =
                "Thinking...";


            await askAssistant(text);
        };


        // =================================================
        // RECOGNITION END
        // =================================================

        recognition.onend = () => {

            isListening = false;

            mic.classList.remove(
                "listening"
            );


            // Don't change status if AI
            // is currently processing/speaking

            if (!isProcessing &&
                !isSpeaking) {

                wave.style.opacity = "0";

                status.innerText =
                    "Tap button to speak";
            }
        };


        // =================================================
        // RECOGNITION ERROR
        // =================================================

        recognition.onerror = (event) => {

            console.error(
                "Speech recognition error:",
                event.error
            );


            isListening = false;

            isProcessing = false;

            mic.classList.remove(
                "listening"
            );

            wave.style.opacity = "0";


            if (event.error === "not-allowed" ||
                event.error === "service-not-allowed") {

                status.innerText =
                    "Microphone permission denied";

                return;
            }


            if (event.error === "no-speech") {

                status.innerText =
                    "No speech detected";

                setTimeout(() => {

                    if (!isSpeaking) {

                        status.innerText =
                            "Tap button to speak";
                    }

                }, 1500);

                return;
            }


            status.innerText =
                "Speech recognition error";
        };

    } else {

        status.innerText =
            "Speech recognition not supported";

        mic.disabled = true;

        console.warn(
            "Speech Recognition API is not supported."
        );
    }


    // =====================================================
    // ASK ASSISTANT
    // =====================================================

    const askAssistant = async (message) => {

        try {

            status.innerText =
                "Thinking...";


            const res = await fetch(
                `${API_BASE_URL}/api/assistant/ask`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message,

                        userId,

                        // Important for navigation
                        currentPath:
                            window.location.pathname
                    })
                }
            );


            // =================================================
            // READ RESPONSE
            // =================================================

            let data;

            try {

                data = await res.json();

            } catch (jsonError) {

                throw new Error(
                    "Invalid server response"
                );
            }


          


            // =================================================
            // HTTP ERROR
            // =================================================

            if (!res.ok) {

                if (res.status === 401) {

                    speak(
                        "Your Groq API key is invalid."
                    );

                    return;
                }


                if (res.status === 429) {

                    speak(
                        "The AI service limit has been reached."
                    );

                    return;
                }


                if (res.status === 404) {

                    speak(
                        data.message ||
                        "Assistant configuration was not found."
                    );

                    return;
                }


                speak(
                    data.message ||
                    "Something went wrong."
                );

                return;
            }


            // =================================================
            // SUCCESS CHECK
            // =================================================

            if (!data.success) {

                speak(
                    data.message ||
                    "I could not process your request."
                );

                return;
            }


            // =================================================
            // NAVIGATION ACTION
            // =================================================

            if (data.action === "navigate") {

                


                speak(data.response);


                setTimeout(() => {

                    window.location.href =
                        data.path;

                }, 1500);


                return;
            }


            // =================================================
            // NORMAL AI RESPONSE
            // =================================================

            const response =
                data.response ||
                data.aiResponse;


            if (response) {

                speak(response);

            } else {

                speak(
                    "I couldn't generate a response."
                );
            }

        } catch (error) {

            console.error(
                "Assistant request error:",
                error
            );


            speak(
                "Unable to connect to the assistant."
            );

        } finally {

            isProcessing = false;
        }
    };


    // =====================================================
    // MICROPHONE BUTTON
    // =====================================================

    mic.addEventListener(
        "click",
        () => {

            if (!recognition) {

                speak(
                    "Speech recognition is not supported."
                );

                return;
            }


            // Don't start while AI is speaking
            if (isSpeaking) {

                window.speechSynthesis.cancel();

                isSpeaking = false;
            }


            // Don't start while already listening
            if (isListening) {

                try {

                    recognition.stop();

                } catch (error) {

                    console.log(error);
                }

                return;
            }


            // Don't start while processing
            if (isProcessing) {

                return;
            }


            // Clear previous text
            userText.innerText = "";

            aiText.innerText = "";

            wave.style.opacity = "1";

            status.innerText =
                "Listening...";


            try {

                recognition.start();

            } catch (error) {

                console.error(
                    "Recognition start error:",
                    error
                );

                isListening = false;

                status.innerText =
                    "Tap button to speak";

                wave.style.opacity = "0";
            }
        }
    );


    // =====================================================
    // LOAD ASSISTANT CONFIG
    // =====================================================

    const loadAssistant = async () => {

        try {

            const res = await fetch(
                `${API_BASE_URL}/api/assistant/config/${userId}`
            );


            if (!res.ok) {

                throw new Error(
                    `Config request failed: ${res.status}`
                );
            }


            const data =
                await res.json();


            // console.log(
            //     "Assistant config:",
            //     data
            // );


            if (data?.user) {

                assistantConfig =
                    data.user;

                applyConfig();
            }

        } catch (error) {

            console.error(
                "Assistant config error:",
                error
            );

            // Keep default configuration
        }
    };


    // =====================================================
    // APPLY CONFIGURATION
    // =====================================================

    const applyConfig = () => {

        if (!assistantConfig) {
            return;
        }


        // =================================================
        // THEME
        // =================================================

        const selectedTheme =
            assistantConfig.theme ||
            DEFAULT_THEME;


        popup.className =
            `jack-popup theme-${selectedTheme}`;


        launcher.className =
            `jack-launcher theme-${selectedTheme}`;


        // =================================================
        // ASSISTANT NAME
        // =================================================

        const assistantName =
            assistantConfig.assistantName ||
            "Jack";


        title.innerText =
            `Hello I'm ${assistantName} AI`;


        // =================================================
        // BUSINESS NAME
        // =================================================

        const businessName =
            assistantConfig.businessName ||
            "this website";


        subTitle.innerHTML =
            `Welcome to ${escapeHTML(businessName)}<br>
             Ask anything about this website.`;
    };


    // =====================================================
    // HTML ESCAPE
    // =====================================================

    const escapeHTML = (value) => {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    };


    // =====================================================
    // OPEN / CLOSE ASSISTANT
    // =====================================================

    launcher.addEventListener(
        "click",
        () => {

            isOpen = !isOpen;


            if (isOpen) {

                popup.style.display =
                    "block";

                launcher.innerHTML =
                    "✕";

                launcher.classList.add(
                    "active"
                );

            } else {

                popup.style.display =
                    "none";

                launcher.innerHTML =
                    "🎙";

                launcher.classList.remove(
                    "active"
                );


                // Stop recognition
                if (recognition &&
                    isListening) {

                    try {

                        recognition.stop();

                    } catch (error) {

                        console.log(error);
                    }
                }


                // Stop speech
                if (window.speechSynthesis) {

                    window.speechSynthesis.cancel();

                    isSpeaking = false;
                }


                isListening = false;

                isProcessing = false;

                wave.style.opacity = "0";

                status.innerText =
                    "Tap button to speak";
            }
        }
    );


    // =====================================================
    // CLEANUP BEFORE PAGE UNLOAD
    // =====================================================

    window.addEventListener(
        "beforeunload",
        () => {

            if (recognition) {

                try {

                    recognition.stop();

                } catch (error) {
                    // Ignore
                }
            }


            if (window.speechSynthesis) {

                window.speechSynthesis.cancel();
            }
        }
    );


    // =====================================================
    // INITIALIZE
    // =====================================================

    loadAssistant();

})();
