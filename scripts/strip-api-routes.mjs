import fs from "fs";
import path from "path";

function strip(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) strip(full);
    else if (e.name === "route.ts" || e.name === "route.tsx") {
      let c = fs.readFileSync(full, "utf8");
      let n = c.replace(/export\s+const\s+dynamic\s*=\s*["']force-static["'];?\s*\n?/g, "")
               .replace(/export\s+const\s+revalidate\s*=\s*\d+;?\s*\n?/g, "");
      if (n !== c) {
        fs.writeFileSync(full, n);
        console.log(`✅ Cleaned: ${full}`);
      }
    }
  }
}

strip(path.join(process.cwd(), "app", "api"));
console.log("✅ API routes 清理完毕");