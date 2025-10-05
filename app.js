// FINAL, CLEANED, AND COMPLETE app.js (All features restored)

(function () {
  "use strict";

  // --- 1. DOM Element References ---
  const elements = {
    chat: document.getElementById("chat"),
    sirenSound: document.getElementById("sirenSound"), // ADD THIS LINE

    composer: document.getElementById("composer"),
    input: document.getElementById("input"),
    langToggle: document.getElementById("langToggle"),
    micBtn: document.getElementById("micBtn"),
    voiceBtn: document.getElementById("voiceBtn"),
    voiceSelect: document.getElementById("voiceSelect"),
    botTyping: document.getElementById("bot-typing"),
    messageTemplate: document.getElementById("message-template"),
    mascot: document.getElementById("mascot"),
    bgMusic: document.getElementById("bgMusic"),
    clapSound: document.getElementById("clapSound"),
  };

  // --- 2. State Management & Data ---
  let state = {
    language: "en",
    voiceEnabled: true,
    selectedVoice: null,
    userName: null,
    awaitingName: false,
    awaitingRoleplay: false,
    awaitingQuiz: false,
    quizIndex: 0,
    quizScore: 0,
    awaitingPledge: false,
    awaitingBullyingCategory: false,
    awaitingBullyingType: false,
    bullyingPersona: null,
    awaitingBullyingDetect: false,
    awaitingCode: true,
    secretCode: null,
    codeAttempts: 0,
    maxCodeAttempts: 3,
  };

  const texts = {
    en: {
      intro:
        "👋 Let’s introduce each other! First tell me your name. I am your Brave Buddy to give awareness on bullying.",
      nice: "Nice to meet you,",
      bullying: "Bullying = repeated harm with imbalance of power.",
      advice:
        "If you are being bullied Stay calm, walk away, save evidence, tell an adult.If you want to give advice to a friend who is bullying someone is a sensitive situation and plan the conversation carefully by choosing the right time and place, set a positive tone, explain the consequences of bullying and be specific.",
      report:
        "Save proof, block/report, tell a teacher/parent.For any immediate threat or danger related to bullying always call your country's universal emergency number 112 (Emergency Response Support System-ERSS), Childline 1098 is a 24-hour, free, national emergency phone service. For women facing violence or harassment, including in workplace, The National Commission for Women has a helpline at 7827170170",
      role: "🎭 Let's practice! I'll give you different bullying situations.",
      quizIntro: "📝 Let’s start the quiz!",
      pledge: "I pledge to stand against bullying and spread kindness.",
      closing: "🌟 Thank you! You are a Brave Buddy!",
      back: "⬅ Back to Menu",
    },
    hi: {
      intro:
        "👋 चलो एक-दूसरे से परिचय करें! पहले अपना नाम बताइए। मैं आपका ब्रेव बडी हूँ जो बदमाशी के बारे में जागरूकता देता है।",
      nice: "आपसे मिलकर खुशी हुई,",
      bullying: "बदमाशी = बार-बार किया गया नुकसान जिसमें शक्ति का असंतुलन हो।",
      advice:
        "शांत रहें, दूर चले जाएँ, सबूत सुरक्षित रखें और किसी बड़े को बताएं।",
      report: "सबूत रखें, ब्लॉक/रिपोर्ट करें और शिक्षक या माता-पिता को बताएं।",
      role: "🎭 चलो अभ्यास करें! मैं आपको अलग-अलग बदमाशी की स्थितियाँ दूँगा।",
      quizIntro: "📝 चलो क्विज़ शुरू करें!",
      pledge: "मैं बदमाशी के खिलाफ खड़ा रहूँगा और दया फैलाऊँगा।",
      closing: "🌟 धन्यवाद! आप बदमाशी के खिलाफ एक ब्रेव बडी हैं!",
      back: "⬅ मेन्यू पर वापस जाएँ",
    },
  };
  const roleplayScenarios = {
    en: [
      "Someone says: 'You’re not good enough.' – What do you reply?",
      "Someone pushes you in the corridor. What do you say?",
      "A classmate posts a mean comment about you online. How will you respond?",
      "A friend keeps excluding you from group activities. What would you do?",
    ],
    hi: [
      "कोई कहता है: 'तुम अच्छे नहीं हो।' – आप क्या जवाब देंगे?",
      "कोई आपको गलियारे में धक्का देता है। आप क्या कहेंगे?",
      "एक सहपाठी आपके बारे में ऑनलाइन बुरा कमेंट करता है। आप कैसे जवाब देंगे?",
      "एक दोस्त बार-बार आपको समूह गतिविधियों से बाहर करता है। आप क्या करेंगे?",
    ],
  };
  const quizQuestions = {
    en: [
      {
        q: "Which of these is bullying?",
        options: [
          "Teasing once",
          "Helping a friend",
          "Repeatedly making fun of someone",
        ],
        answer: 2,
      },
      {
        q: "What should you do if you see bullying?",
        options: ["Ignore it", "Support the target and report it", "Join in"],
        answer: 1,
      },
      {
        q: "Online bullying is also called?",
        options: ["Cyberbullying", "Play fight", "Prank"],
        answer: 0,
      },
    ],
    hi: [
      {
        q: "इनमें से कौन बदमाशी है?",
        options: ["एक बार चिढ़ाना", "मित्र की मदद करना", "बार-बार मजाक उड़ाना"],
        answer: 2,
      },
      {
        q: "अगर आप बदमाशी देखें तो क्या करें?",
        options: [
          "अनदेखा करें",
          "पीड़ित का साथ दें और रिपोर्ट करें",
          "शामिल हो जाएँ",
        ],
        answer: 1,
      },
      {
        q: "ऑनलाइन बदमाशी को क्या कहते हैं?",
        options: ["साइबरबुलिंग", "खेल झगड़ा", "मजाक"],
        answer: 0,
      },
    ],
  };

  // --- Speech Recognition Setup ---
  // --- Speech Recognition Setup ---
  let recognition;
  try {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage("user", transcript);
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        handleUserInput(transcript);
      }, 500);
    };

    recognition.onerror = (event) => {
      let errorMessage = "⚠️ An error occurred with speech recognition.";
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        errorMessage =
          "⚠️ Microphone permission was denied. Please allow microphone access in your browser settings.";
      } else if (event.error === "no-speech") {
        errorMessage = "⚠️ No speech was detected. Please try again.";
      }
      addMessage("bot", errorMessage, true);
    };
  } catch (e) {
    console.error(
      "Speech Recognition API is not supported in this browser.",
      e
    );
    recognition = null;
  }

  // --- 3. Core UI & Helper Functions ---
  function addMessage(role, text, silent = false) {
    const messageClone = elements.messageTemplate.content.cloneNode(true);
    const msgDiv = messageClone.querySelector(".msg");
    const bubble = messageClone.querySelector(".bubble");
    msgDiv.classList.add(role);
    bubble.innerHTML = text;
    elements.chat.appendChild(msgDiv);
    autoScroll();
    if (role === "bot" && !silent && state.voiceEnabled) {
      speak(text);
    }
  }
  function addImage(src) {
    const img = document.createElement("img");
    img.src = "images/" + src;
    img.className = "answer-img";
    img.style.cssText =
      "width:250px; display:block; margin:10px auto; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.25);";
    elements.chat.appendChild(img);
    autoScroll();
  }
  function autoScroll() {
    elements.chat.scrollTo({
      top: elements.chat.scrollHeight,
      behavior: "smooth",
    });
  }
  function showTypingIndicator() {
    elements.botTyping.style.display = "flex";
    autoScroll();
  }
  function hideTypingIndicator() {
    elements.botTyping.style.display = "none";
  }
  function addChoiceButtons(labels, onChoose) {
    document.querySelectorAll(".temp-ui").forEach((el) => el.remove());
    const box = document.createElement("div");
    box.className = "quiz-options temp-ui";
    labels.forEach((l) => {
      const b = document.createElement("button");
      b.className = "control-btn";
      b.textContent = l;
      b.onclick = (e) => {
        e.preventDefault();
        onChoose(l);
        box.querySelectorAll("button").forEach((btn) => {
          btn.disabled = true;
          btn.style.opacity = "0.7";
        });
      };
      box.appendChild(b);
    });
    elements.chat.appendChild(box);
    autoScroll();
  }
  function addBack() {
    const b = document.createElement("button");
    b.className = "control-btn back-btn";
    b.textContent = texts[state.language].back;
    b.style.cssText = "margin-top: 15px; width: 100%;";
    b.onclick = (e) => {
      e.preventDefault();
      speechSynthesis.cancel();
      Object.keys(state).forEach((key) => {
        if (
          key.startsWith("awaiting") &&
          key !== "awaitingCode" &&
          key !== "awaitingName"
        ) {
          state[key] = false;
        }
      });
      document
        .querySelectorAll(".temp-ui, .back-btn")
        .forEach((el) => el.remove());
      showMenu();
    };
    elements.chat.appendChild(b);
  }
  function speak(text) {
    if (!state.voiceEnabled || !speechSynthesis) return;
    let cleaned = text
      .replace(/<[^>]*>/g, "")
      .replace(/[^\p{L}\p{N}\s.,!?'"-]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned) return;
    const utter = new SpeechSynthesisUtterance(cleaned);
    const voices = speechSynthesis.getVoices();
    if (state.selectedVoice)
      utter.voice = voices.find((v) => v.name === state.selectedVoice);
    if (!utter.voice) utter.lang = state.language === "en" ? "en-US" : "hi-IN";
    speechSynthesis.speak(utter);
  }
  function populateVoiceList() {
    if (!speechSynthesis) return;
    const voices = speechSynthesis.getVoices();
    elements.voiceSelect.innerHTML = "";
    voices.forEach((v) => {
      const option = document.createElement("option");
      option.value = v.name;
      option.textContent = `${v.name} (${v.lang})`;
      elements.voiceSelect.appendChild(option);
    });
    const defaultVoice =
      voices.find((v) => v.name.toLowerCase().includes("prabhat")) ||
      voices.find((v) => v.lang === "en-IN") ||
      voices.find((v) => v.lang.startsWith("en-"));
    if (defaultVoice) {
      elements.voiceSelect.value = defaultVoice.name;
      state.selectedVoice = defaultVoice.name;
    }
  }
  function playClap() {
    if (elements.clapSound) {
      elements.clapSound.currentTime = 0;
      elements.clapSound.play();
    }
  }
  // Add this new function to your app.js
  function playSiren() {
    if (elements.sirenSound) {
      elements.sirenSound.currentTime = 0; // Rewind to the start
      elements.sirenSound.play();

      // Stop the sound after 4 seconds
      setTimeout(() => {
        if (elements.sirenSound && !elements.sirenSound.paused) {
          elements.sirenSound.pause();
          elements.sirenSound.currentTime = 0;
        }
      }, 4000);
    }
  }
  function setMascotMood(mood) {
    if (elements.mascot) {
      elements.mascot.src = "images/" + mood + ".png";
    }
  }

  // --- 4. Feature Functions ---
  // REPLACE your old calmDown function with this corrected version

  async function calmDown() {
    setMascotMood("bulb_thinking");

    // Clear any existing UI and add the back button
    document.querySelectorAll(".temp-ui").forEach((el) => el.remove());
    addBack();

    const introText =
      state.language === "en"
        ? "🧘 It looks like you're feeling uneasy. Let's do a short breathing exercise. Follow my voice: Inhale… Hold… Exhale…"
        : "🧘 चलो एक छोटा श्वास अभ्यास करें। मेरी आवाज़ का अनुसरण करें: श्वास लो… रोको… छोड़ो…";

    addMessage("bot", introText, true); // Add message silently first
    speak(introText); // Then speak it

    const canvas = document.createElement("div");
    canvas.className = "temp-ui";
    canvas.style.width = "100%";
    canvas.style.height = "200px";
    canvas.style.display = "flex";
    canvas.style.alignItems = "center";
    canvas.style.justifyContent = "center";
    elements.chat.insertBefore(
      canvas,
      elements.chat.querySelector(".back-btn")
    );

    const heart = document.createElement("div");
    heart.style.position = "relative";
    heart.style.width = "100px";
    heart.style.height = "100px"; // FIX: Changed from 90px to 100px to make a perfect square
    heart.style.background = "red";
    heart.style.transform = "rotate(-45deg) scale(1)";
    heart.style.margin = "20px";
    heart.style.transition = "all 4s ease-in-out";
    heart.style.boxShadow =
      "0 0 25px rgba(255,0,0,0.6), 0 0 50px rgba(255,0,0,0.4)";
    canvas.appendChild(heart);

    const before = document.createElement("div");
    before.style.position = "absolute";
    before.style.width = "100px";
    before.style.height = "100px";
    before.style.borderRadius = "50%";
    before.style.background = "red";
    before.style.top = "-50px";
    before.style.left = "0";
    heart.appendChild(before);

    const after = document.createElement("div");
    after.style.position = "absolute";
    after.style.width = "100px";
    after.style.height = "100px";
    after.style.borderRadius = "50%";
    after.style.background = "red";
    after.style.left = "50px";
    after.style.top = "0";
    heart.appendChild(after);

    let step = 0;
    function breathe() {
      if (step % 2 === 0) {
        heart.style.transform = "rotate(-45deg) scale(1.4)";
        speak(state.language === "en" ? "Inhale" : "श्वास लो");
      } else {
        heart.style.transform = "rotate(-45deg) scale(0.9)";
        speak(state.language === "en" ? "Exhale" : "श्वास छोड़ो");
      }
      step++;
      if (step < 6) {
        setTimeout(breathe, 5000);
      } else {
        speak(state.language === "en" ? "Well done!" : "बहुत अच्छा!");
        setMascotMood("bulb_happy");
      }
    }

    // A small delay to let the intro text finish before starting
    setTimeout(() => {
      breathe();
      autoScroll();
    }, 4000);
  }
  function detectBullying() {
    state.awaitingBullyingDetect = true;
    addMessage("bot", "📝 Please describe the situation.");
    addBack();
  }
  function explainBullying() {
    setMascotMood("bulb_serious");
    addMessage("bot", texts[state.language].bullying);
    addImage("bullying.jpeg");
    state.awaitingBullyingCategory = true;
    state.awaitingBullyingType = false;
    state.bullyingPersona = null;
    const q =
      state.language === "en"
        ? "Are you a <b>child</b>, <b>adult</b>, or <b>old man</b>?"
        : "क्या आप <b>बच्चे</b>, <b>वयस्क</b> या <b>बुज़ुर्ग</b> हैं?";
    addMessage("bot", "👀 " + q);
    const options =
      state.language === "en"
        ? ["Child", "Adult", "Old man"]
        : ["बच्चा", "वयस्क", "बुज़ुर्ग"];
    addChoiceButtons(options, handleBullyingCategoryInput);
    addBack();
  }
  function handleBullyingCategoryInput(text) {
    const t = text.toLowerCase();
    if (/child|बच्चा|बच्चे/.test(t)) {
      state.bullyingPersona = "child";
    } else if (/adult|वयस्क/.test(t)) {
      state.bullyingPersona = "adult";
    } else if (/old|बुज़ुर्ग|बुजुर्ग/.test(t)) {
      state.bullyingPersona = "old";
    } else {
      addMessage(
        "bot",
        state.language === "en"
          ? "⚠️ Please choose one of the options."
          : "⚠️ कृपया विकल्पों में से एक चुनें।"
      );
      addChoiceButtons(
        state.language === "en"
          ? ["Child", "Adult", "Old man"]
          : ["बच्चा", "वयस्क", "बुज़ुर्ग"],
        handleBullyingCategoryInput
      );
      return;
    }
    state.awaitingBullyingCategory = false;
    state.awaitingBullyingType = true;
    let prompt = "",
      options = [];
    if (state.bullyingPersona === "child") {
      prompt =
        state.language === "en"
          ? "What kind of bullying?"
          : "किस प्रकार की बदमाशी?";
      options =
        state.language === "en"
          ? ["Physical", "Verbal", "Cyber"]
          : ["शारीरिक", "मौखिक", "ऑनलाइन"];
    }
    if (state.bullyingPersona === "adult") {
      prompt =
        state.language === "en"
          ? "What kind of bullying?"
          : "किस प्रकार की बदमाशी?";
      options =
        state.language === "en"
          ? ["Workplace", "Social", "Online"]
          : ["कार्यस्थल", "सामाजिक", "ऑनलाइन"];
    }
    if (state.bullyingPersona === "old") {
      prompt =
        state.language === "en"
          ? "What kind of bullying?"
          : "किस प्रकार का दुर्व्यवहार?";
      options =
        state.language === "en"
          ? ["Neglect", "Disrespect", "Financial"]
          : ["उपेक्षा", "असम्मान", "आर्थिक"];
    }
    setMascotMood("bulb_thinking");
    addMessage("bot", "💭 " + prompt);
    addChoiceButtons(options, handleBullyingTypeInput);
  }
  function handleBullyingTypeInput(text) {
    const t = text.toLowerCase();
    let reply = "";
    if (state.language === "en") {
      if (state.bullyingPersona === "child") {
        if (/physical/.test(t))
          reply =
            "🏃 Tell a teacher or parent immediately. Stay with friends for safety.";
        else if (/verbal/.test(t))
          reply =
            "🗣️ Stay calm, use a firm voice, and report to a trusted adult.";
        else if (/cyber/.test(t))
          reply =
            "💻 Block/report the bully online and show messages to a guardian.";
      } else if (state.bullyingPersona === "adult") {
        if (/workplace/.test(t))
          reply =
            "💼 Document incidents, talk to HR/management, and seek formal support.";
        else if (/social/.test(t))
          reply =
            "👥 Set boundaries, lean on supportive friends/family, consider mediation.";
        else if (/online/.test(t))
          reply =
            "🌐 Block/report abuse, secure accounts, consider legal/cybercrime help.";
      } else if (state.bullyingPersona === "old") {
        if (/neglect/.test(t))
          reply =
            "🤝 Contact social services/NGOs or a trusted neighbor for immediate support.";
        else if (/disrespect/.test(t))
          reply =
            "💬 Share concerns with family/community leaders; ask for respect and safety.";
        else if (/financial/.test(t))
          reply =
            "💰 Protect assets; consult a lawyer or helpline about financial exploitation.";
      }
    } else {
      if (/शारीरिक/.test(t))
        reply = "🏃 तुरंत शिक्षक/माता-पिता को बताएं। दोस्तों के साथ रहें।";
      else if (/मौखिक/.test(t))
        reply = "🗣️ शांत रहें, दृढ़ता से बोलें, और किसी बड़े को बताएं।";
      else if (/ऑनलाइन/.test(t))
        reply = "💻 ऑनलाइन ब्लॉक/रिपोर्ट करें और संदेश अभिभावक को दिखाएँ।";
    }
    if (reply) {
      setMascotMood("bulb_happy");
      addMessage("bot", reply);
      state.awaitingBullyingType = false;
      state.bullyingPersona = null;
    }
  }
  function giveAdvice() {
    addMessage("bot", texts[state.language].advice);
    addImage("advice.jpeg");
    addBack();
  }
  function reportBullying() {
    addMessage("bot", texts[state.language].report);
    addImage("report.jpeg");
    addBack();
  }
  function startRoleplay() {
    state.awaitingRoleplay = true;
    const scenario =
      roleplayScenarios[state.language][
        Math.floor(Math.random() * roleplayScenarios[state.language].length)
      ];
    addMessage("bot", "🎭 " + scenario);
    addImage("roleplay.jpeg");
    addBack();
  }
  function handleRoleplayResponse(text) {
    let safe = false;
    if (state.language === "en") {
      safe =
        /(stop|leave me|respect|not okay|teacher|report|block|this is wrong|don’t do that)/i.test(
          text
        );
    } else {
      safe =
        /(रुक|मत करो|सम्मान|ठीक नहीं|शिक्षक|रिपोर्ट|ब्लॉक|गलत है|नहीं करना)/i.test(
          text
        );
    }
    if (safe) {
      setMascotMood("bulb_happy");
      addMessage(
        "bot",
        state.language === "en" ? "⭐ Great response!" : "⭐ अच्छा जवाब!"
      );
    } else {
      setMascotMood("bulb_serious");
      addMessage(
        "bot",
        state.language === "en"
          ? "💡 Try: 'I want this to stop.'"
          : "💡 कोशिश करें: 'मैं चाहता हूँ यह रुके।'"
      );
    }
    state.awaitingRoleplay = false;
  }
  function startQuiz() {
    state.awaitingQuiz = true;
    state.quizIndex = 0;
    state.quizScore = 0;
    addMessage("bot", texts[state.language].quizIntro);
    addImage("quiz.jpeg");
    showQuizQuestion();
    addBack();
  }
  function showQuizQuestion() {
    const q = quizQuestions[state.language][state.quizIndex];
    addMessage("bot", `Q${state.quizIndex + 1}: ${q.q}`);
    addChoiceButtons(q.options, (choiceLabel) => {
      const choiceIndex = q.options.indexOf(choiceLabel);
      handleQuizAnswer(choiceIndex);
    });
  }
  function handleQuizAnswer(choice) {
    const q = quizQuestions[state.language][state.quizIndex];
    if (choice === q.answer) {
      addMessage(
        "bot",
        state.language === "en" ? "✅ Correct!" : "✅ सही जवाब!"
      );
      playClap();
      state.quizScore++;
    } else {
      addMessage(
        "bot",
        state.language === "en"
          ? `❌ Wrong. Correct: ${q.options[q.answer]}`
          : `❌ गलत। सही उत्तर: ${q.options[q.answer]}`
      );
    }
    state.quizIndex++;
    if (state.quizIndex < quizQuestions[state.language].length) {
      setTimeout(showQuizQuestion, 1200);
    } else {
      addMessage(
        "bot",
        state.language === "en"
          ? `🎉 Quiz finished! Score: ${state.quizScore} out of ${
              quizQuestions[state.language].length
            }`
          : `🎉 क्विज़ समाप्त! स्कोर: ${state.quizScore} / ${
              quizQuestions[state.language].length
            }`
      );
      state.awaitingQuiz = false;
    }
  }
  function reportForm() {
    setMascotMood("bulb_serious");
    addMessage(
      "bot",
      state.language === "en"
        ? "📝 Fill this quick form to create a report."
        : "📝 रिपोर्ट बनाने के लिए यह छोटा फॉर्म भरें।"
    );
    document.querySelectorAll(".temp-ui").forEach((el) => el.remove());
    addBack();
    const formDiv = document.createElement("div");
    formDiv.className = "temp-ui";
    formDiv.innerHTML = `<input type="text" id="who" class="report-input" placeholder="${
      state.language === "en" ? "Who bullied you?" : "किसने बदमाशी की?"
    }"><input type="text" id="where" class="report-input" placeholder="${
      state.language === "en" ? "Where did it happen?" : "यह कहाँ हुआ?"
    }"><textarea id="what" class="report-input" style="height:80px;" placeholder="${
      state.language === "en" ? "Describe what happened" : "क्या हुआ बताइए"
    }"></textarea><button class="control-btn" id="submitReport" style="width:100%;margin-top:5px;">${
      state.language === "en" ? "📤 Generate Report" : "📤 रिपोर्ट बनाएँ"
    }</button>`;
    elements.chat.insertBefore(
      formDiv,
      elements.chat.querySelector(".back-btn")
    );
    document.getElementById("submitReport").onclick = () => {
      const who = document.getElementById("who").value.trim();
      const where = document.getElementById("where").value.trim();
      const what = document.getElementById("what").value.trim();
      if (!who || !where || !what) {
        addMessage(
          "bot",
          state.language === "en"
            ? "⚠️ Please fill all fields."
            : "⚠️ कृपया सभी जानकारी भरें।"
        );
        return;
      }
      formDiv
        .querySelectorAll("input, textarea, button")
        .forEach((el) => (el.disabled = true));
      const reportText =
        state.language === "en"
          ? `📋 Bullying Report:\n- Who: ${who}\n- Where: ${where}\n- What: ${what}`
          : `📋 बदमाशी रिपोर्ट:\n- कौन: ${who}\n- कहाँ: ${where}\n- क्या हुआ: ${what}`;
      addMessage("bot", reportText.replace(/\n/g, "<br>"));
      let blob = new Blob([reportText], { type: "text/plain" });
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Bullying_Report.txt";
      link.textContent =
        state.language === "en"
          ? "⬇️ Download Report"
          : "⬇️ रिपोर्ट डाउनलोड करें";
      link.style.cssText = "display:block; margin-top:10px;";
      elements.chat.appendChild(link);
      const phoneDiv = document.createElement("div");
      phoneDiv.className = "temp-ui";
      phoneDiv.innerHTML = `<input id="waNumber" class="report-input" placeholder="${
        state.language === "en"
          ? "Enter WhatsApp number to share"
          : "साझा करने के लिए व्हाट्सएप नंबर डालें"
      }"><button class="control-btn" id="sendWAReport" style="width:100%;margin-top:5px;">${
        state.language === "en"
          ? "📲 Send via WhatsApp"
          : "📲 व्हाट्सएप से भेजें"
      }</button>`;
      elements.chat.appendChild(phoneDiv);
      document.getElementById("sendWAReport").onclick = () => {
        const num = document.getElementById("waNumber").value.trim();
        if (!/^\d{10,15}$/.test(num)) {
          addMessage(
            "bot",
            state.language === "en"
              ? "⚠️ Please enter a valid WhatsApp number."
              : "⚠️ सही व्हाट्सएप नंबर डालें।"
          );
          return;
        }
        window.open(
          `https://wa.me/${num}?text=${encodeURIComponent(reportText)}`,
          "_blank"
        );
      };
      autoScroll();
    };
    autoScroll();
  }
  function emergencyHelp() {
    setMascotMood("bulb_serious");
    addMessage(
      "bot",
      state.language === "en"
        ? "📞 If you are in danger, please use these buttons to call directly:"
        : "📞 यदि आप खतरे में हैं, तो सीधे कॉल करने के लिए इन बटनों का उपयोग करें:"
    );
    document.querySelectorAll(".temp-ui").forEach((el) => el.remove());
    addBack();
    const helpDiv = document.createElement("div");
    helpDiv.className = "temp-ui";
    helpDiv.style.marginTop = "10px";
    const contacts = [
      { text: "🚨 Call Police (Emergency)", tel: "112" },
      { text: "👶 Call Childline", tel: "1098" },
      { text: "👩 Call NCW (Women's Helpline)", tel: "7827170170" },
    ];
    contacts.forEach((contact) => {
      const btn = document.createElement("button");
      btn.className = "control-btn emergency-btn";
      btn.textContent = contact.text;
      btn.onclick = () => {
        window.location.href = "tel:" + contact.tel;
      };
      helpDiv.appendChild(btn);
    });
    elements.chat.insertBefore(
      helpDiv,
      elements.chat.querySelector(".back-btn")
    );
    autoScroll();
  }
  // --- MASCOT SPECIFIC FUNCTIONS ---

  // This variable controls the bounce direction

  /**
   * Changes the mascot's image file.
   * @param {string} mood - The name of the image file (e.g., "bulb_happy").
   */
  // function setMascotMood(mood) {
  //   if (elements.mascot) {
  //     elements.mascot.src = "images/" + mood + ".png";
  //   }
  // }

  /**
   * Animates the mascot bouncing up and down.
   */

  /**
   * Triggers the mascot's angry animation and sound when clicked.
   */
  // Replace your existing angryReaction function with this one

  function angryReaction() {
    if (!elements.mascot) return;

    elements.mascot.classList.add("angry"); // This triggers the CSS shake effect
    speak(state.language === "en" ? "Stay away!" : "दूर रहें!", 0.5);
    //   setMascotMood("bulb_angry");
    playSiren(); // This line plays the sound

    setTimeout(() => {
      elements.mascot.classList.remove("angry");
      setMascotMood("bulb_default");
    }, 4000);
  }
  function pledge() {
    setMascotMood("bulb_cheer");
    state.awaitingPledge = true;
    const pledgeText = texts[state.language].pledge;
    const pledgeDiv = document.createElement("div");
    pledgeDiv.className = "pledge-text temp-ui";
    const words = pledgeText.split(" ");
    pledgeDiv.innerHTML = words
      .map((word, index) => `<span id="pledgeWord${index}">${word}</span>`)
      .join(" ");
    elements.chat.appendChild(pledgeDiv);
    addImage("pledge.jpeg");
    addMessage(
      "bot",
      state.language === "en" ? "💖 Repeat after me:" : "💖 मेरे बाद बोलो:",
      true
    );
    const utter = new SpeechSynthesisUtterance(pledgeText);
    utter.lang = state.language === "en" ? "en-US" : "hi-IN";
    let wordIndex = 0;
    utter.onboundary = (event) => {
      if (event.name === "word") {
        document
          .querySelectorAll(".pledge-text span")
          .forEach((s) => s.classList.remove("active"));
        const currentWordSpan = document.getElementById(
          "pledgeWord" + wordIndex
        );
        if (currentWordSpan) {
          currentWordSpan.classList.add("active");
        }
        wordIndex++;
      }
    };
    utter.onend = () => {
      document
        .querySelectorAll(".pledge-text span")
        .forEach((s) => s.classList.remove("active"));
    };
    speechSynthesis.speak(utter);
    addBack();
  }
  function handlePledgeResponse(text) {
    if (state.language === "en") {
      if (
        text.toLowerCase().includes("i pledge") &&
        text.toLowerCase().includes("bullying")
      ) {
        setMascotMood("bulb_wave");
        addMessage("bot", "🌟 Wonderful! You spoke the pledge with courage.");
        playClap();
        state.awaitingPledge = false;
      } else {
        addMessage("bot", "⚠️ Please try again and say the pledge clearly.");
      }
    } else {
      if (text.includes("मैं") && text.includes("बदमाशी")) {
        setMascotMood("bulb_wave");
        addMessage("bot", "🌟 शानदार! आपने शपथ ली।");
        state.awaitingPledge = false;
      } else {
        addMessage(
          "bot",
          "⚠️ कृपया फिर से प्रयास करें और शपथ स्पष्ट रूप से बोलें।"
        );
      }
    }
  }
  async function searchAndAnswer(query) {
    try {
      addMessage("bot", "🔎 Let me check that for you...");
      const url =
        "https://api.duckduckgo.com/?q=" +
        encodeURIComponent(query) +
        "&format=json";
      const res = await fetch(url);
      const data = await res.json();
      let answer =
        data.AbstractText ||
        data.Heading ||
        "Sorry, I couldn't find anything clear.";
      addMessage("bot", answer);
    } catch (e) {
      addMessage("bot", "⚠️ Error fetching answer.");
    }
  }
  function analyzeBullyingSituation(text) {
    state.awaitingBullyingDetect = false;
    const lower = text.toLowerCase();
    let result = "";
    const physical = ["hit", "push", "kick", "slap", "beat"];
    const verbal = ["insult", "stupid", "ugly", "abuse", "curse", "mock"];
    const cyber = [
      "online",
      "post",
      "comment",
      "whatsapp",
      "facebook",
      "instagram",
      "troll",
    ];
    const power = ["teacher", "boss", "senior", "group", "gang", "older"];
    let detected = [];
    if (physical.some((w) => lower.includes(w))) detected.push("physical harm");
    if (verbal.some((w) => lower.includes(w))) detected.push("verbal abuse");
    if (cyber.some((w) => lower.includes(w))) detected.push("cyberbullying");
    if (power.some((w) => lower.includes(w))) detected.push("power imbalance");
    if (detected.length > 0) {
      result =
        state.language === "en"
          ? `⚠️ This situation shows signs of bullying: ${detected.join(", ")}.`
          : `⚠️ इस स्थिति में बदमाशी के संकेत हैं: ${detected.join(", ")}.`;
    } else {
      result =
        state.language === "en"
          ? "✅ It does not strongly look like bullying, but always trust your feelings and stay safe."
          : "✅ यह स्पष्ट रूप से बदमाशी नहीं लगती, लेकिन हमेशा अपनी भावना पर भरोसा करें और सुरक्षित रहें।";
    }
    addMessage("bot", result);
    addMessage(
      "bot",
      state.language === "en"
        ? "👉 You can use the Back button for more help."
        : "👉 अधिक मदद के लिए आप Back बटन का उपयोग कर सकते हैं।"
    );
  }

  // --- 5. The Menu Function ---
  function showMenu() {
    document
      .querySelectorAll(".menu,.temp-ui,.back-btn")
      .forEach((el) => el.remove());
    const menuContainer = document.createElement("div");
    menuContainer.className = "menu temp-ui";
    menuContainer.style.display = "grid";
    menuContainer.style.gridTemplateColumns = "1fr 1fr";
    menuContainer.style.gap = "12px";
    menuContainer.style.marginTop = "10px";
    const cards = [
      {
        t:
          state.language === "en"
            ? "🧘 Calm Down Mode"
            : "🧘 शांत रहने का तरीका",
        h: calmDown,
      },
      {
        t:
          state.language === "en"
            ? "🤔 Is it Bullying?"
            : "🤔 क्या यह बदमाशी है?",
        h: detectBullying,
      },
      {
        t:
          state.language === "en"
            ? "Tell me your situation"
            : "अपनी स्थिति बताइए",
        h: explainBullying,
      },
      { t: state.language === "en" ? "Advice" : "सलाह", h: giveAdvice },
      {
        t: state.language === "en" ? "Report bullying" : "बदमाशी की रिपोर्ट",
        h: reportBullying,
      },
      {
        t: state.language === "en" ? "Practice replies" : "जवाब अभ्यास",
        h: startRoleplay,
      },
      { t: state.language === "en" ? "Quick quiz" : "क्विज़", h: startQuiz },
      {
        t:
          state.language === "en"
            ? "📝 Report Bullying Form"
            : "📝 बदमाशी रिपोर्ट फॉर्म",
        h: reportForm,
      },
      {
        t: state.language === "en" ? "🚨 Emergency Help" : "🚨 आपातकालीन मदद",
        h: emergencyHelp,
      },
      {
        t: state.language === "en" ? "Closing / Pledge" : "समापन / शपथ",
        h: pledge,
      },
    ];
    cards.forEach(({ t, h }) => {
      const card = document.createElement("div");
      card.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
      card.style.borderRadius = "12px";
      card.style.padding = "10px";
      card.style.textAlign = "center";
      card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
      card.innerHTML = `<h4>${t}</h4>`;
      const btn = document.createElement("button");
      btn.className = "control-btn";
      btn.textContent = "Open ▶";
      btn.style.background = "#fff";
      btn.style.color = "#333";
      btn.onclick = (e) => {
        e.preventDefault();
        h();
      };
      card.appendChild(btn);
      menuContainer.appendChild(card);
    });
    elements.chat.appendChild(menuContainer);
    autoScroll();
  }

  // --- 6. Main Input Handler & Initialization ---
  function handleUserInput(text) {
    if (state.awaitingCode) {
      if (text.trim() === state.secretCode) {
        state.awaitingCode = false;
        state.awaitingName = true;
        addMessage(
          "bot",
          state.language === "en"
            ? "✅ Verified! Let's get started."
            : "✅ सत्यापित! चलो शुरू करें।"
        );
        addMessage("bot", texts[state.language].intro);
      } else {
        state.codeAttempts++;
        if (state.codeAttempts >= state.maxCodeAttempts) {
          addMessage(
            "bot",
            state.language === "en"
              ? "⚠️ Too many incorrect attempts."
              : "⚠️ बहुत गलत प्रयास।"
          );
          askHumanVerification(false);
        } else {
          addMessage(
            "bot",
            state.language === "en"
              ? "⚠️ Wrong code. Please try again."
              : "⚠️ गलत कोड। पुनः प्रयास करें।"
          );
        }
      }
      return;
    }
    if (state.awaitingName) {
      state.awaitingName = false;
      state.userName = text.trim();
      addMessage(
        "bot",
        `${texts[state.language].nice} <b>${state.userName}</b>!`
      );
      showMenu();
      return;
    }
    if (state.awaitingQuiz) return;
    if (state.awaitingBullyingDetect) {
      analyzeBullyingSituation(text);
      return;
    }
    if (state.awaitingBullyingCategory) {
      handleBullyingCategoryInput(text);
      return;
    }
    if (state.awaitingBullyingType) {
      handleBullyingTypeInput(text);
      return;
    }
    if (state.awaitingRoleplay) {
      handleRoleplayResponse(text);
      return;
    }
    if (state.awaitingPledge) {
      handlePledgeResponse(text);
      return;
    }
    searchAndAnswer(text);
  }
  function generateHumanCode() {
    const code = Math.floor(1000 + Math.random() * 9000);
    state.secretCode = String(code);
    state.codeAttempts = 0;
    state.awaitingCode = true;
    return state.secretCode;
  }
  function askHumanVerification(onlyRefresh = false) {
    document.querySelectorAll(".temp-ui").forEach((el) => el.remove());
    const code = state.secretCode || generateHumanCode();
    const msg =
      state.language === "en"
        ? `🤖 Before we start, please type this code: <b>${code}</b>`
        : `🤖 शुरू करने से पहले कृपया यह कोड टाइप करें: <b>${code}</b>`;
    if (!onlyRefresh) addMessage("bot", msg);
    addChoiceButtons(
      [state.language === "en" ? "Refresh code" : "कोड बदलें"],
      () => {
        const newCode = generateHumanCode();
        addMessage(
          "bot",
          state.language === "en"
            ? `🔁 New code: <b>${newCode}</b>`
            : `🔁 नया कोड: <b>${newCode}</b>`,
          true
        );
      }
    );
  }

  // Add this new function with your other helper functions

  function submitInput() {
    const userInput = elements.input.value.trim();
    if (!userInput) return; // Don't send empty messages

    addMessage("user", userInput);
    elements.input.value = ""; // Clear the input box

    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      handleUserInput(userInput);
    }, 600 + Math.random() * 400);
  }

  // Replace your old setupEventListeners function with this one

  function setupEventListeners() {
    // Modified to use the new submitInput function
    elements.composer.addEventListener("submit", (e) => {
      e.preventDefault();
      submitInput();
    });

    // NEW: Added event listener for the Enter key
    elements.input.addEventListener("keydown", (event) => {
      // Check if Enter is pressed WITHOUT the Shift key
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevents adding a new line
        submitInput();
      }
    });

    // --- All other event listeners remain the same ---
    elements.micBtn.addEventListener("click", () => {
      if (recognition) {
        try {
          recognition.lang = state.language === "en" ? "en-US" : "hi-IN";
          recognition.start();
          addMessage(
            "bot",
            state.language === "en" ? "🎤 Listening..." : "🎤 सुन रहा हूँ...",
            true
          );
        } catch (e) {
          console.error("Error starting speech recognition:", e);
          addMessage(
            "bot",
            "⚠️ Mic might be already active or there was an error.",
            true
          );
        }
      } else {
        addMessage(
          "bot",
          state.language === "en"
            ? "⚠️ Speech recognition is not supported in this browser."
            : "⚠️ यह ब्राउज़र वॉइस रिकग्निशन सपोर्ट नहीं करता।"
        );
      }
    });

    elements.voiceBtn.addEventListener("click", () => {
      state.voiceEnabled = !state.voiceEnabled;
      elements.voiceBtn.innerText = state.voiceEnabled
        ? "🔊 Voice ON"
        : "🔇 Voice OFF";
      if (!state.voiceEnabled) speechSynthesis.cancel();
    });

    elements.voiceSelect.addEventListener("change", (e) => {
      state.selectedVoice = e.target.value;
    });

    elements.langToggle.addEventListener("click", () => {
      state.language = state.language === "en" ? "hi" : "en";
      elements.langToggle.textContent =
        state.language === "en" ? "🌐 Language: English" : "🌐 भाषा: हिंदी";
      if (state.awaitingCode) {
        askHumanVerification(true);
      } else if (!state.awaitingName) {
        showMenu();
      }
    });

    if (elements.mascot) {
      elements.mascot.addEventListener("click", angryReaction);
    }

    if (elements.bgMusic) {
      document.body.addEventListener(
        "click",
        () => {
          if (elements.bgMusic.paused) {
            elements.bgMusic
              .play()
              .catch((e) => console.log("Music play blocked by browser."));
          }
        },
        { once: true }
      );
    }
  }
  // Find this function in your app.js file

  function init() {
    console.log("Brave Buddy Initializing...");
    setupEventListeners();

    // ADD THIS BLOCK to set the music volume
    if (elements.bgMusic) {
      elements.bgMusic.volume = 0.35; // Set volume to 5% (you can use 0.02 for even quieter)
    }

    if ("speechSynthesis" in window) {
      setTimeout(() => populateVoiceList(), 200);
      speechSynthesis.onvoiceschanged = populateVoiceList;
    } else {
      elements.voiceBtn.disabled = true;
      elements.voiceSelect.disabled = true;
    }
    askHumanVerification();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
