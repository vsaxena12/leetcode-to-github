console.log("🛠 background.js loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type !== "leetcodeSubmission") return;

      console.log("📬 Message received from content.js:", msg);

      const { folderName, fileName, code } = msg.payload;
      const contentBase64 = btoa(unescape(encodeURIComponent(code)));

      const repo = "vsaxena12/LeetCode-Prep"; // Replace with your GitHub repo
      const token = ""; 
      const path = `${folderName}/${fileName}`;

      fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            method: "GET",
            headers: {
                  Authorization: `token ${token}`,
                  Accept: "application/vnd.github.v3+json"
            }
      })
            .then(res => res.status === 404 ? null : res.json())
            .then(fileInfo => {
                  const body = {
                        message: `Update ${fileName}`,
                        content: contentBase64
                  };
                  if (fileInfo && fileInfo.sha) {
                        console.log("📝 File exists — updating with SHA:", fileInfo.sha);
                        body.sha = fileInfo.sha;
                  } else {
                        console.log("📄 File does not exist — creating.");
                  }

                  return fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                        method: "PUT",
                        headers: {
                              Authorization: `token ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                  });
            })
            .then(res => res.json())
            .then(data => {
                  console.log("✅ Upload successful:", data);
                  sendResponse({ status: "success", url: data.content?.html_url });
            })
            .catch(err => {
                  console.error("❌ Upload failed:", err);
                  sendResponse({ status: "error", message: err.message });
            });

      return true; // Required for async sendResponse
});