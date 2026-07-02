import re

# 1. Add Retry Logic to scores.ts
with open('src/api/scores.ts', 'r') as f:
    scores_content = f.read()

retry_logic = """
async function fetchWithRetry(id, range, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchTopicScore(id, range);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, 1000 * (i + 1))); // Exponential backoff
    }
  }
}
"""

scores_content = scores_content.replace(
    "export async function fetchScoreBatch(",
    retry_logic + "\nexport async function fetchScoreBatch("
)

scores_content = scores_content.replace(
    "return await fetchTopicScore(id, range);",
    "return await fetchWithRetry(id, range);"
)

with open('src/api/scores.ts', 'w') as f:
    f.write(scores_content)


# 2. Lower Concurrency in App.tsx
with open('src/App.tsx', 'r') as f:
    app_content = f.read()

app_content = app_content.replace(
    "concurrency: 8,",
    "concurrency: 3,"
)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)

print("Applied resilience patch.")
