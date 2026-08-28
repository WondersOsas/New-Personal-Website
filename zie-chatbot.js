/* ==========================================================================
   ZIE CHATBOT SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inject CSS dynamically if it isn't already included
  if (!document.querySelector('link[href*="zie-chatbot.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'zie-chatbot.css';
    document.head.appendChild(link);
  }

  // Create Chatbot Elements
  const botContainer = document.createElement('div');
  botContainer.className = 'zie-chatbot-container';
  botContainer.innerHTML = `
    <button class="zie-toggle-btn" id="zieToggle" aria-label="Open Chatbot">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
    <div class="zie-chat-window" id="zieWindow">
      <div class="zie-chat-header">
        <div class="zie-avatar">Z</div>
        <div class="zie-chat-header-info">
          <h4>Zie</h4>
          <span class="zie-status"><span class="zie-status-dot"></span>Online Assistant</span>
        </div>
      </div>
      <div class="zie-chat-body" id="zieChatBody"></div>
      <div class="zie-choices" id="zieChoices"></div>
      <div class="zie-chat-footer">
        Have complex questions? <a href="contact.html">Contact Us</a>
      </div>
    </div>
  `;

  document.body.appendChild(botContainer);

  const zieToggle = document.getElementById('zieToggle');
  const zieWindow = document.getElementById('zieWindow');
  const zieChatBody = document.getElementById('zieChatBody');
  const zieChoices = document.getElementById('zieChoices');

  // Toggle window visibility
  zieToggle.addEventListener('click', () => {
    const isOpen = zieWindow.classList.toggle('open');
    zieToggle.classList.toggle('active');
    
    if (isOpen && zieChatBody.children.length === 0) {
      startChat();
    }
  });

  // Bot Knowledge Base
  const knowledge = {
    welcome: {
      text: "Hello! I am Zie, your digital helper. How can I assist you with Tech-Tezo today?",
      options: [
        { text: "What services do you offer?", next: "services" },
        { text: "How can I make a payment?", next: "payment" },
        { text: "How do I leave a review?", next: "review" },
        { text: "How can I contact a manager?", next: "contact" }
      ]
    },
    services: {
      text: "We offer Premium Web Development, Desktop Apps, UI/UX Design, and Brand Strategy. Would you like to know about our project timelines?",
      options: [
        { text: "Yes, project timelines", next: "timelines" },
        { text: "How much does a site cost?", next: "pricing" },
        { text: "Go back", next: "welcome" }
      ]
    },
    timelines: {
      text: "Most custom landing pages and portfolios take 1-2 weeks. Complex platforms or design systems take 3-6 weeks. For exact timelines, please speak directly to our VA.",
      options: [
        { text: "Chat with a VA on WhatsApp", next: "whatsapp" },
        { text: "Main menu", next: "welcome" }
      ]
    },
    pricing: {
      text: "Pricing is highly customized based on your feature requirements. Small business landing pages start around $300, while complex apps are scoped separately. A VA can provide a custom quote.",
      options: [
        { text: "Request Quote via WhatsApp", next: "whatsapp" },
        { text: "Request Quote via Email", next: "email" },
        { text: "Main menu", next: "welcome" }
      ]
    },
    payment: {
      text: "We support direct bank transfers for local and business accounts. You can view all details on our payment methods page.",
      options: [
        { text: "Go to Payment Page", next: "goToPayment" },
        { text: "Main menu", next: "welcome" }
      ]
    },
    review: {
      text: "We would love to get your feedback! You can write a review on our reviews page. Submitting a review can automatically notify us.",
      options: [
        { text: "Go to Reviews Page", next: "goToReviews" },
        { text: "Main menu", next: "welcome" }
      ]
    },
    contact: {
      text: "For complex or custom queries, please reach out to our Virtual Assistant directly. They are available via WhatsApp or email.",
      options: [
        { text: "WhatsApp Handle", next: "whatsapp" },
        { text: "Email Address", next: "email" },
        { text: "Main menu", next: "welcome" }
      ]
    },
    whatsapp: {
      text: "Redirecting you to our WhatsApp support handle (+2348055235635)...",
      action: () => {
        window.open("https://wa.me/2348055235635?text=Hello%20Tech-Tezo,%20I%20have%20a%20question%20for%20the%20VA.", "_blank");
      },
      options: [{ text: "Main menu", next: "welcome" }]
    },
    email: {
      text: "Opening email client to contact wondersosas@gmail.com...",
      action: () => {
        window.location.href = "mailto:wondersosas@gmail.com?subject=Tech-Tezo Inquiry";
      },
      options: [{ text: "Main menu", next: "welcome" }]
    },
    goToPayment: {
      text: "Redirecting you to our secure payment transfer page...",
      action: () => {
        window.location.href = "payment.html";
      },
      options: [{ text: "Main menu", next: "welcome" }]
    },
    goToReviews: {
      text: "Redirecting you to our work review page...",
      action: () => {
        window.location.href = "reviews.html";
      },
      options: [{ text: "Main menu", next: "welcome" }]
    }
  };

  function startChat() {
    addMessage("welcome");
  }

  function addMessage(key) {
    const node = knowledge[key];
    if (!node) return;

    // Show bot message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'zie-msg bot';
    msgDiv.textContent = node.text;
    zieChatBody.appendChild(msgDiv);
    zieChatBody.scrollTop = zieChatBody.scrollHeight;

    // Execute actions
    if (node.action) {
      setTimeout(node.action, 1000);
    }

    // Load options
    zieChoices.innerHTML = '';
    node.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'zie-choice-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        // Show user message
        const userMsg = document.createElement('div');
        userMsg.className = 'zie-msg user';
        userMsg.textContent = opt.text;
        zieChatBody.appendChild(userMsg);
        zieChatBody.scrollTop = zieChatBody.scrollHeight;

        // Load next bot message
        setTimeout(() => {
          addMessage(opt.next);
        }, 600);
      });
      zieChoices.appendChild(btn);
    });
  }
});
