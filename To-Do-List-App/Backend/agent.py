# Backend/agent.py
import os
import json
from urllib.parse import quote_plus
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY", "dummy_key_to_prevent_crash")
client = Groq(api_key=api_key)

def build_shopping_links(item: str) -> dict:
    """Generate free shopping search links from an item name — no API needed."""
    q = quote_plus(item)
    return {
        "item": item,
        "google": f"https://www.google.com/search?q=buy+{q}&tbm=shop",
        "amazon": f"https://www.amazon.com/s?k={q}",
    }

def generate_subtasks(task_text: str) -> list[dict]:
    """
    Call Groq (free) to break a task into subtasks.
    For any subtask that requires buying things, attach shopping links.
    """
    prompt = f"""You are a productivity assistant. Break this task into 3-5 clear, actionable subtasks.
For any subtask that involves purchasing or getting ingredients/materials, set "needs_purchase": true and list the specific items to buy.
For everything else, set "needs_purchase": false and "items": [].

Task: "{task_text}"

Respond with ONLY valid JSON, no extra text:
{{
  "subtasks": [
    {{"text": "subtask description", "needs_purchase": false, "items": []}},
    {{"text": "Buy ingredients", "needs_purchase": true, "items": ["item1", "item2"]}}
  ]
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # free model on Groq
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=500,
        )
        raw = response.choices[0].message.content.strip()
        data = json.loads(raw)
        subtasks = data.get("subtasks", [])
    except Exception:
        return []  # silently fail — don't break task creation if AI is down

    result = []
    for s in subtasks:
        entry = {"text": s["text"], "links": []}
        if s.get("needs_purchase") and s.get("items"):
            entry["links"] = [build_shopping_links(item) for item in s["items"]]
        result.append(entry)

    return result