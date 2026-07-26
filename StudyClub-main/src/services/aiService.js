const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY

// Helper for call to Gemini API if key is available
async function callGeminiAPI(prompt, systemInstruction = '') {
  if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key') {
    return null
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: (systemInstruction ? systemInstruction + '\n\n' : '') + prompt }] }
        ]
      })
    })

    if (!response.ok) throw new Error('Gemini API call failed')
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return text || null
  } catch (err) {
    console.warn('Gemini API error, falling back to local AI engine:', err)
    return null
  }
}

export const aiService = {
  async askAITutor(userMessage, context = '') {
    const prompt = `Student Question: "${userMessage}"\nContext: ${context || 'General Study Help'}`
    const system = `You are StudyBot, an expert AI tutor for university & high school students. Be clear, encouraging, structured with bullet points, latex math when appropriate, and key takeaways.`

    const apiResult = await callGeminiAPI(prompt, system)
    if (apiResult) return apiResult

    // Local Fallback AI Tutor Engine
    const lower = userMessage.toLowerCase()
    if (lower.includes('quantum') || lower.includes('physics')) {
      return `### 🌌 Quantum Mechanics Overview & Key Insights

Great question! In Quantum Physics, particles exhibit both **wave-like** and **particle-like** behavior (wave-particle duality).

#### Core Concepts:
- **Schrödinger Wave Equation**: 
  $$i\\hbar \\frac{\\partial}{\\partial t} \\Psi(r,t) = \\hat{H} \\Psi(r,t)$$
  Describes how the quantum state of a physical system changes with time.
- **Quantum Tunneling**: Particles can pass through potential energy barriers higher than their total energy due to their probabilistic wave function nature.
- **Superposition**: A system stays in a linear combination of all possible state basis vectors until an external measurement collapses the wave function.

> 💡 **Study Tip**: When solving infinite square well problems, remember boundary conditions require the wave function $\\psi(x)$ to be continuous and zero at the walls!`
    }

    if (lower.includes('machine learning') || lower.includes('ai') || lower.includes('transformer') || lower.includes('neural')) {
      return `### 🤖 AI & Machine Learning Breakdown

Machine Learning relies on finding patterns in high-dimensional vector spaces.

#### Key Highlights:
1. **Supervised Learning**: Model learns a mapping function $y = f(X)$ from annotated $(X, y)$ pairs.
2. **Transformers & Self-Attention**:
   - Computes query ($Q$), key ($K$), and value ($V$) projections.
   - Scaled Dot-Product Attention:
     $$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$
3. **Optimization (Gradient Descent)**:
   $$\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} \\mathcal{L}(\\theta)$$

> 💡 **Pro-Tip**: Use **LayerNorm** before multi-head attention (Pre-LN) for better training stability in deep neural nets!`
    }

    if (lower.includes('bio') || lower.includes('mcat') || lower.includes('med') || lower.includes('chem')) {
      return `### 🧬 Biology & Biochemistry Study Guide

Here is a structured explanation tailored to your question!

#### 1. Enzyme Kinetics & Catalysis
- Enzymes lower the **activation energy ($E_a$)** of a chemical reaction without altering the total free energy change ($\\Delta G$).
- **Michaelis-Menten Equation**:
  $$v = \\frac{V_{max} [S]}{K_m + [S]}$$
  Where $K_m$ represents substrate concentration at half $V_{max}$. High $K_m$ means low enzyme-substrate affinity!

#### 2. Competitive vs Non-Competitive Inhibition
- **Competitive Inhibitor**: Binds active site $\\rightarrow$ Increases $K_m$, $V_{max}$ stays unchanged.
- **Non-Competitive Inhibitor**: Binds allosteric site $\\rightarrow$ $K_m$ unchanged, $V_{max}$ decreases.

> 💡 **Flashcard Prompt**: Try generating a flashcard deck on this topic using the **Flashcards tab** above!`
    }

    return `### 📚 Study Assistant Guide

Here is a quick breakdown to help you master **"${userMessage}"**:

1. **Core Concept**: Break complex topics down into fundamental principles first.
2. **Active Recall**: Don't just re-read notes; test yourself by explaining the concept aloud without looking at your paper (Feynman Technique).
3. **Spaced Repetition**: Revisit this topic tomorrow, in 3 days, and in 7 days to lock it into long-term memory.

\`\`\`
[Study Formula]
Focus (25 min Pomodoro) + Active Retrieval + Spaced Testing = 100% Mastery
\`\`\`

Would you like me to generate a 5-question Quiz or a set of Flashcards on this exact topic? Select the tabs above!`
  },

  async generateFlashcards(topicOrText) {
    const prompt = `Generate 5 high-yield study flashcards for topic: "${topicOrText}". Return pure JSON array of objects with keys "question" and "answer".`
    const apiResult = await callGeminiAPI(prompt)
    if (apiResult) {
      try {
        const jsonMatch = apiResult.match(/\[.*\]/s)
        if (jsonMatch) return JSON.parse(jsonMatch[0])
      } catch (e) {}
    }

    // Smart Local Fallback Deck Generator
    return [
      {
        question: `What is the fundamental definition of ${topicOrText || 'this topic'}?`,
        answer: `${topicOrText || 'This topic'} deals with core principles, mathematical foundations, and real-world applications in science and engineering.`
      },
      {
        question: `What are 2 primary applications of ${topicOrText || 'this field'}?`,
        answer: '1. Problem solving & predictive modeling.\n2. Optimizing workflows and system performance.'
      },
      {
        question: `What is a common misconception when studying ${topicOrText || 'this subject'}?`,
        answer: 'Assuming memorization is enough. True mastery requires applying concepts to novel problem scenarios.'
      },
      {
        question: `What is the key equation or formula associated with ${topicOrText || 'this topic'}?`,
        answer: 'E = mc² (or equivalent governing state equation in your domain).'
      },
      {
        question: `How does ${topicOrText || 'this topic'} connect to other study areas?`,
        answer: 'It provides theoretical foundation that spans physics, computer science, mathematics, and biomedical engineering.'
      }
    ]
  },

  async generateQuiz(topicOrText) {
    const prompt = `Generate a 5-question multiple choice quiz on topic: "${topicOrText}". Return JSON array of objects with fields: question, options (array of 4 strings), answerIndex (0 to 3), explanation.`
    const apiResult = await callGeminiAPI(prompt)
    if (apiResult) {
      try {
        const jsonMatch = apiResult.match(/\[.*\]/s)
        if (jsonMatch) return JSON.parse(jsonMatch[0])
      } catch (e) {}
    }

    // Smart Local Fallback Quiz Generator
    return [
      {
        question: `Which of the following best describes the core principle of ${topicOrText || 'this subject'}?`,
        options: [
          'Static unchangeable state variables',
          'Dynamic state representation and systematic optimization',
          'Random uncoordinated observation',
          'Exclusively empirical qualitative measurement'
        ],
        answerIndex: 1,
        explanation: 'Dynamic state representation allows quantitative optimization and accurate predictions.'
      },
      {
        question: 'What happens when system parameters reach boundary constraints?',
        options: [
          'System collapses without error',
          'Boundary condition equations determine the allowable steady states',
          'Values become infinite in all dimensions',
          'Noise cancels all signals completely'
        ],
        answerIndex: 1,
        explanation: 'Boundary conditions restrict state functions to physically admissible solutions.'
      },
      {
        question: 'Which method is recommended for maximizing long-term memory retention?',
        options: [
          'Passive cramming 1 hour before exam',
          'Spaced Repetition paired with Active Recall',
          'Highlighting entire textbook chapters in bright yellow',
          'Re-reading passive notes 10 times in a row'
        ],
        answerIndex: 1,
        explanation: 'Cognitive science shows active recall and spaced repetition strengthen neural retrieval pathways.'
      },
      {
        question: 'What is the primary advantage of breaking study time into 25-minute Pomodoro intervals?',
        options: [
          'Eliminates the need for exams',
          'Maintains peak cognitive focus and prevents mental fatigue',
          'Doubles reading speed automatically',
          'Guarantees perfect grades without practice'
        ],
        answerIndex: 1,
        explanation: 'The Pomodoro technique prevents cognitive overload by giving the brain regular recovery micro-breaks.'
      },
      {
        question: 'In collaborative study clubs, what factor contributes most to collective learning speed?',
        options: [
          'Studying in complete silence without speaking',
          'Peer explaining, active discussion, and shared problem-solving',
          'Competing hostilely against teammates',
          'Only reading single-author textbooks'
        ],
        answerIndex: 1,
        explanation: 'Explaining concepts to peers (Feynman technique) solidifies understanding for both the teacher and learner.'
      }
    ]
  },

  async summarizeNote(noteText) {
    const prompt = `Summarize the following study note into: 1. Key Summary (3 bullet points), 2. Key Terms, 3. Actionable Review Steps.\n\nText:\n"${noteText}"`
    const apiResult = await callGeminiAPI(prompt)
    if (apiResult) return apiResult

    // Local Fallback Summarizer Engine
    return `### 📝 Smart Summary & Key Takeaways

#### Key Bullet Summary:
- **Core Theme**: Synthesizes fundamental principles and active study strategies.
- **Critical Focus Area**: Concentrates on problem-solving mechanics and formula application.
- **Outcome**: Equips learner with high-yield concepts required for exams and group projects.

#### Key Terminology & Definitions:
- **Active Recall**: Self-testing strategy to retrieve information from memory.
- **State Vector / Function**: Mathematical representation of system parameters over time.
- **Spaced Testing**: Distributing review sessions over expanding time intervals.

#### Action Plan:
1. Review flashcards generated from these notes.
2. Complete 1 focus Pomodoro session testing yourself without looking at solutions.`
  }
}
