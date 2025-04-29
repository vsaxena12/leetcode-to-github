console.log("🛠 background.js loaded perfectly");
chrome.runtime.onMessage.addListener((msg) => {
      console.log("📬 Message received in background.js:", msg);
      if (msg.type !== "leetcodeSubmission") return;

      const { folderName, fileName, code } = msg.payload;
      const contentBase64 = btoa(unescape(encodeURIComponent(code)));

      const repo = "vsaxena12/LeetCode-Prep"; // Change to your repo
      const token = process.env.GITHUB_TOKEN || 'REPLACE_WITH_YOUR_TOKEN'; // Replace with your real token
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
                        message: `Upload ${fileName}`,
                        content: contentBase64
                  };
                  if (fileInfo && fileInfo.sha) body.sha = fileInfo.sha;

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
            .then(data => console.log("✅ Uploaded:", data))
            .catch(err => console.error("❌ Upload failed:", err));
});