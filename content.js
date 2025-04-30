function extractSubmission() {
      console.log("🔍 extractSubmission running");

      const codeBlock = document.querySelector("pre code");
      if (!codeBlock) {
            console.warn("⚠️ No <pre><code> block found yet. Retrying...");
            setTimeout(extractSubmission, 2000);
            return;
      }

      const match = window.location.pathname.match(/^\/problems\/([^/]+)\/submissions\//);
      if (!match || !match[1]) {
            console.warn("⚠️ Problem slug not found in URL.");
            return;
      }

      const slug = match[1];
      const folderName = slug;
      const fileName = `${slug}.java`;
      const code = codeBlock.innerText;

      if (!code || code.length < 10) {
            console.warn("⚠️ Code content seems too short.");
            return;
      }

      console.log("🚀 Sending upload message...");
      chrome.runtime.sendMessage(
            {
                  type: "leetcodeSubmission",
                  payload: { folderName, fileName, code }
            },
            (response) => {
                  console.log("📬 Response from background.js:", response);
            }
      );
}

function clickViewDetailsIfNeeded() {
      const btn = document.querySelector('[data-cy="view-submission-code-btn"]');
      if (btn) {
            console.log("🟢 Clicking View Details...");
            btn.click();
      }
}

window.addEventListener("load", () => {
      if (location.href.includes("/submissions/")) {
            console.log("🚀 LeetCode uploader activated.");
            clickViewDetailsIfNeeded();
            setTimeout(extractSubmission, 3000);
      }
});