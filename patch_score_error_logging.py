import re

with open('src/api/scores.ts', 'r') as f:
    content = f.read()

# Inject console.error to reveal why the fetches are failing
patched_content = content.replace(
    """      } catch (error) {
        options.onError?.(id, error);
        return null;
      }""",
    """      } catch (error) {
        console.error(`Fetch failed for ID ${id}:`, error);
        options.onError?.(id, error);
        return null;
      }"""
)

with open('src/api/scores.ts', 'w') as f:
    f.write(patched_content)

print("Injected error logging into fetchScoreBatch.")
