const inputText = document.getElementById("inputText");
const charCount = document.getElementById("charCount");
const checkBtn = document.getElementById("checkBtn");
const resultsDiv = document.getElementById("results");

inputText.addEventListener("input", () => {
  charCount.textContent = `${inputText.value.length} characters`;
});

async function checkText() {
  const text = inputText.value.trim();

  if (!text) {
    resultsDiv.innerHTML = `<div class="error-message">Please enter some text first.</div>`;
    return;
  }

  checkBtn.disabled = true;
  checkBtn.innerHTML = `<span class="btn-icon">⏳</span> Checking...`;
  resultsDiv.innerHTML = `<div class="loading-box">Analyzing your text, please wait...</div>`;

  try {
    const response = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<div class="error-message">Error: ${data.error}</div>`;
      return;
    }

    let html = `
      <div class="corrected-box">
        <span class="box-title">Corrected Text</span>
        ${data.corrected_text}
      </div>
    `;

    if (data.errors && data.errors.length > 0) {
      html += `<div class="errors-title">📝 Mistakes Found (${data.errors.length})</div>`;
      data.errors.forEach(err => {
        html += `
          <div class="error-item">
            <div class="error-words">
              <span class="original-word">${err.original}</span>
              <span class="arrow">→</span>
              <span class="corrected-word">${err.correction}</span>
            </div>
            <div class="error-explanation">${err.explanation}</div>
          </div>
        `;
      });
    } else {
      html += `<div class="no-errors">✅ Great job! No mistakes found.</div>`;
    }

    resultsDiv.innerHTML = html;

  } catch (err) {
    resultsDiv.innerHTML = `<div class="error-message">Something went wrong: ${err.message}</div>`;
  } finally {
    checkBtn.disabled = false;
    checkBtn.innerHTML = `<span class="btn-icon">✓</span> Check My Text`;
  }
}
