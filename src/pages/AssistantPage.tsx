import { useState } from 'react'
import './DemoPages.css'

const suggestions = ['Can I run outside after work?', 'Is Saturday good for a picnic?', 'What should I wear this morning?']

function answerQuestion(question: string) {
  const q = question.toLowerCase()
  if (q.includes('run') || q.includes('outside')) return { verdict: 'Good window: 5–7 PM', answer: 'Yes. Temperatures ease into the upper 70s after 5 PM, wind stays below 10 mph, and the rain chance remains under 20%.', tips: ['Bring water—the humidity will still feel noticeable.', 'Finish before sunset at 5:29 PM.', 'Lightning risk increases later tonight.'] }
  if (q.includes('picnic') || q.includes('saturday')) return { verdict: 'Mostly favorable', answer: 'Saturday morning is the best option. Expect mild temperatures and lower rain risk before clouds build in the afternoon.', tips: ['Aim for 9 AM–1 PM.', 'Choose a shaded location; UV peaks near 6.', 'Keep a backup indoor plan after 3 PM.'] }
  return { verdict: 'Light layers recommended', answer: 'Start with a light jacket, then switch to short sleeves by midday as temperatures climb into the low 80s.', tips: ['UV protection is useful after 10 AM.', 'A compact umbrella is optional.', 'Check alerts before a long outdoor activity.'] }
}

export default function AssistantPage() {
  const [question, setQuestion] = useState('Can I run outside after work?')
  const [result, setResult] = useState(() => answerQuestion(question))
  return <div className="demo-page assistant-page">
    <div className="page-header"><span className="eyebrow">Natural-language guidance</span><h2>Ask Weather</h2><p>Turn forecast data into a practical plan for your day.</p></div>
    <div className="assistant-shell">
      <div className="assistant-prompt"><label htmlFor="weather-question">What are you planning?</label><div className="prompt-row"><input id="weather-question" value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && setResult(answerQuestion(question))} /><button className="btn btn-primary" onClick={() => setResult(answerQuestion(question))}>Get advice</button></div><div className="suggestion-list">{suggestions.map(item => <button key={item} onClick={() => { setQuestion(item); setResult(answerQuestion(item)) }}>{item}</button>)}</div></div>
      <div className="answer-card"><span className="answer-badge">✓ {result.verdict}</span><h3>Weather-aware recommendation</h3><p>{result.answer}</p><div className="advice-grid">{result.tips.map((tip, i) => <div key={tip}><span>{i + 1}</span>{tip}</div>)}</div><small>Based on Houston’s hourly forecast, precipitation, wind, UV, and active hazards.</small></div>
    </div>
  </div>
}
