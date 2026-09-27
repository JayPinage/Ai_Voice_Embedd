(function () {
    // =========================
    // USER DATA
    // =========================

    const script = document.currentScript;
    const userId = script?.dataset?.userId;

    const theme = "neon";
    let assistantConfig = null;




    // =========================
    // LOAD CSS
    // =========================

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "http://localhost:5173/assistant.css";

    document.head.appendChild(link);


    // =========================
    // CREATE FLOATING BUTTON
    // =========================

    const launcher = document.createElement("button");

    launcher.className = `jack-launcher theme-${theme}`;
    launcher.type = "button";
    launcher.innerHTML = "🎙";


    // =========================
    // CREATE ASSISTANT CARD
    // =========================

    const popup = document.createElement("div");

    popup.className = `jack-popup theme-${theme}`;

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
                Your smart Voice Assistant.<br/>
                Ask Anything about your website.
            </p>

            <div class="jack-status">
                Tap Button to speak
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
                <button class="jack-mic" type="button"></button>
            </div>

        </div>
    `;


    // =========================
    // ADD TO WEBPAGE
    // =========================

    document.body.appendChild(launcher);
    document.body.appendChild(popup);


    // =========================
    // OPEN / CLOSE
    // =========================

    let isOpen = false;

    launcher.addEventListener("click", function () {

        isOpen = !isOpen;

        if (isOpen) {

            popup.style.display = "block";

            // change launcher icon
            launcher.innerHTML = "✕";

            launcher.classList.add("active");

        } else {

            popup.style.display = "none";

            // change launcher icon
            launcher.innerHTML = "🎙";

            launcher.classList.remove("active");
        }

    });

    //load assistant

    const loadAssistant = async()=>{
        try{

            const res  = await fetch(`http://localhost:8000/api/assistant/config/${userId}`)
            const data =  await res.json()
            console.log(data)

            if(data){
                assistantConfig = data.user
                applyConfig()

            }

        }catch(error){

            console.log(error)

        }
    }

    const applyConfig=()=>{

        if(!assistantConfig) return ;

        popup.className = `jack-popup theme-${assistantConfig.theme}`

        const title = popup.querySelector(".jack-title")

        title.innerHTML=`Hello I'M ${assistantConfig.assistantName}`;

                const subTitle = popup.querySelector(".jack-sub")
        subTitle.innerHTML=`Welcome to  ${assistantConfig.businessName}</br> Ask Anything about your website.`;
    }

    loadAssistant()

})();