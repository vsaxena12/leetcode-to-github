function extractSubmission() {
      console.log("🔍 Running extractSubmission");

      const codeBlock = document.querySelector("pre code");
      if (!codeBlock) {
            console.warn("⚠️ Code block not found. Retrying...");
            setTimeout(extractSubmission, 2000);
            return;
      }

      // Extract slug from URL
      const match = window.location.pathname.match(/^\/problems\/([^/]+)\/submissions\//);
      if (!match || !match[1]) {
            console.warn("⚠️ Problem slug not found in URL. Retrying...");
            setTimeout(extractSubmission, 2000);
            return;
      }

      const slug = match[1]; // e.g. "majority-element"
      const folderName = slug;
      const fileName = `${slug}.java`;

      const code = codeBlock.innerText;
      if (!code || code.length < 10) {
            console.warn("⚠️ Code too short or empty.");
            return;
      }

      console.log(`📦 Preparing to upload: ${folderName}/${fileName}`);

      chrome.runtime.sendMessage({
            type: "leetcodeSubmission",
            payload: {
                  folderName,
                  fileName,
                  code
            }
      });
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
            console.log("🚀 LeetCode uploader running");
            clickViewDetailsIfNeeded();
            setTimeout(extractSubmission, 3000);
      }
});