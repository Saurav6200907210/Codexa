// Beginner-friendly knowledge base used by the analyzer.
// Explanations are written in simple Hinglish so new coders can follow along.

export function langFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    js: "JavaScript",
    mjs: "JavaScript",
    cjs: "JavaScript",
    jsx: "JavaScript (React)",
    ts: "TypeScript",
    tsx: "TypeScript (React)",
    py: "Python",
    rb: "Ruby",
    go: "Go",
    rs: "Rust",
    java: "Java",
    kt: "Kotlin",
    php: "PHP",
    c: "C",
    cpp: "C++",
    cc: "C++",
    h: "C/C++ Header",
    cs: "C#",
    swift: "Swift",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    sass: "Sass",
    less: "Less",
    json: "JSON",
    md: "Markdown",
    mdx: "MDX",
    yml: "YAML",
    yaml: "YAML",
    toml: "TOML",
    sh: "Shell",
    bash: "Shell",
    sql: "SQL",
    vue: "Vue",
    svelte: "Svelte",
    dart: "Dart",
    xml: "XML",
    env: "Env config",
    prisma: "Prisma Schema",
    dockerfile: "Dockerfile",
  };
  if (path.toLowerCase().endsWith("dockerfile")) return "Dockerfile";
  return map[ext] ?? "Text";
}

// Maps a folder name to a plain-language purpose. Checked by exact base name.
export const FOLDER_PURPOSES: Record<string, { purpose: string; emoji: string }> = {
  src: { emoji: "📦", purpose: "Yeh main source code ka ghar hai. Project ka asli logic yahin likha hota hai." },
  app: { emoji: "🗂️", purpose: "App Router / application ka core. Yahan pages aur routes rehte hain — har folder ek URL banata hai." },
  pages: { emoji: "📄", purpose: "Har file ek page (URL) banati hai. Router in files ko dekh kar navigation set karta hai." },
  components: { emoji: "🧩", purpose: "Reusable UI tukde (buttons, cards, navbar). Inhe baar-baar alag jagah use kiya jaata hai." },
  api: { emoji: "🔌", purpose: "Backend endpoints. Frontend yahan request bhejta hai data laane ya save karne ke liye." },
  routes: { emoji: "🛣️", purpose: "Server ke routes/endpoints define karta hai — kaunsa URL kaunsa kaam karega." },
  controllers: { emoji: "🎮", purpose: "Request aane par kya karna hai uski logic. Route ko model se jodta hai." },
  models: { emoji: "🗃️", purpose: "Data ka structure / database tables. Yeh batata hai data kaisa dikhega." },
  services: { emoji: "⚙️", purpose: "Business logic aur external API calls. Bada kaam yahan hota hai." },
  middleware: { emoji: "🚧", purpose: "Request beech mein rok kar check karta hai (auth, logging) phir aage bhejta hai." },
  middlewares: { emoji: "🚧", purpose: "Request beech mein rok kar check karta hai (auth, logging) phir aage bhejta hai." },
  utils: { emoji: "🛠️", purpose: "Chhoti helper functions jo har jagah kaam aati hain." },
  helpers: { emoji: "🛠️", purpose: "Chhoti madadgaar functions jo code ko saaf rakhti hain." },
  lib: { emoji: "📚", purpose: "Reusable library code aur third-party setup (jaise DB client)." },
  hooks: { emoji: "🪝", purpose: "React custom hooks — logic ko reuse karne ka tarika (use... naam se)." },
  context: { emoji: "🌐", purpose: "React Context — poore app mein shared data (jaise logged-in user)." },
  store: { emoji: "🏪", purpose: "Global state management (Redux/Zustand). App ka data ek jagah." },
  redux: { emoji: "🏪", purpose: "Redux state — app ka global data aur uske updates." },
  config: { emoji: "🔧", purpose: "Settings aur configuration files." },
  db: { emoji: "🗄️", purpose: "Database se judi files — connection, schema, queries." },
  database: { emoji: "🗄️", purpose: "Database setup aur schema ki files." },
  migrations: { emoji: "🧬", purpose: "Database ke changes step-by-step. Table banane/badalne ka history." },
  public: { emoji: "🖼️", purpose: "Static files (images, favicon) jo seedha browser ko serve hote hain." },
  static: { emoji: "🖼️", purpose: "Static assets jaise images aur fonts." },
  assets: { emoji: "🎨", purpose: "Images, icons, fonts jaisi design files." },
  styles: { emoji: "💅", purpose: "CSS/styling files jo app ko sundar banati hain." },
  css: { emoji: "💅", purpose: "Styling files." },
  tests: { emoji: "🧪", purpose: "Test files jo check karte hain code sahi chal raha hai ya nahi." },
  test: { emoji: "🧪", purpose: "Test files — code ka quality check." },
  __tests__: { emoji: "🧪", purpose: "Automated tests jo bug pakadti hain." },
  docs: { emoji: "📖", purpose: "Documentation — project kaise use karein iska guide." },
  scripts: { emoji: "📜", purpose: "Chhoti automation scripts (setup, build, seed data)." },
  types: { emoji: "🏷️", purpose: "TypeScript type definitions — data ka shape describe karti hain." },
  interfaces: { emoji: "🏷️", purpose: "Type/interface definitions data structure ke liye." },
  constants: { emoji: "📌", purpose: "Fixed values jo change nahi hote (colors, keys, options)." },
  layouts: { emoji: "📐", purpose: "Page ka common structure (header/footer) jo sab pages share karte hain." },
  views: { emoji: "👁️", purpose: "UI screens/templates jo user ko dikhte hain." },
  templates: { emoji: "👁️", purpose: "HTML/UI templates jo render hote hain." },
  controllers_dir: { emoji: "🎮", purpose: "Request handling logic." },
  actions: { emoji: "⚡", purpose: "Server actions / dispatched actions jo kaam trigger karti hain." },
  features: { emoji: "🧱", purpose: "Feature-wise organized code — har folder ek feature." },
  modules: { emoji: "🧱", purpose: "Alag-alag modules mein bata hua code." },
  providers: { emoji: "🔗", purpose: "Context/data providers jo child components ko data dete hain." },
  server: { emoji: "🖥️", purpose: "Server-side code — backend ka dil." },
  client: { emoji: "💻", purpose: "Client-side (browser) code." },
  images: { emoji: "🖼️", purpose: "Image files." },
  fonts: { emoji: "🔤", purpose: "Font files." },
  node_modules: { emoji: "📦", purpose: "Installed packages (auto-generated). Ise chhedne ki zaroorat nahi." },
  dist: { emoji: "🏗️", purpose: "Build output (auto-generated). Yeh deploy hone wala final code hota hai." },
  build: { emoji: "🏗️", purpose: "Compiled/built output (auto-generated)." },
};

export function folderPurpose(name: string): { purpose: string; emoji: string } {
  const key = name.toLowerCase();
  if (FOLDER_PURPOSES[key]) return FOLDER_PURPOSES[key];
  if (key.includes("test") || key.includes("spec"))
    return { emoji: "🧪", purpose: "Test files — code sahi chal raha hai ya nahi verify karti hain." };
  if (key.includes("component"))
    return { emoji: "🧩", purpose: "Reusable UI components rehte hain yahan." };
  if (key.includes("util") || key.includes("helper"))
    return { emoji: "🛠️", purpose: "Helper functions jo poore code mein kaam aati hain." };
  return { emoji: "📁", purpose: "Project ka ek hissa. Andar related files ek saath rakhi gayi hain." };
}

// Explains a well-known top-level config file.
export const KNOWN_FILES: Record<string, string> = {
  "package.json": "Node project ka pehchan-patra: naam, dependencies (kaunse packages chahiye) aur scripts (npm run ...) yahan hote hain.",
  "package-lock.json": "Exact package versions lock karta hai taaki har machine par same install ho.",
  "yarn.lock": "Yarn ka lock file — exact package versions fix karta hai.",
  "pnpm-lock.yaml": "pnpm ka lock file — exact versions fix karta hai.",
  "tsconfig.json": "TypeScript ke rules aur compiler settings.",
  "next.config.js": "Next.js framework ki settings.",
  "next.config.ts": "Next.js framework ki settings (TypeScript mein).",
  "next.config.mjs": "Next.js framework ki settings.",
  "vite.config.ts": "Vite build tool ki settings.",
  "vite.config.js": "Vite build tool ki settings.",
  "tailwind.config.js": "Tailwind CSS ki design settings (colors, spacing).",
  "tailwind.config.ts": "Tailwind CSS ki design settings.",
  "webpack.config.js": "Webpack bundler ki settings.",
  ".env": "Secret values aur environment settings (API keys, DB URL). Ise kabhi public nahi karte.",
  ".env.example": "Sample env file — batati hai kaunse secrets chahiye (bina asli values ke).",
  ".gitignore": "Git ko batata hai kaunsi files track nahi karni (jaise node_modules).",
  dockerfile: "Docker image banane ka recipe — app ko container mein pack karta hai.",
  "docker-compose.yml": "Ek saath multiple services (app + DB) chalane ka setup.",
  "readme.md": "Project ka intro aur instructions — sabse pehle yahi padho.",
  "requirements.txt": "Python project ke dependencies ki list.",
  "go.mod": "Go project ke module aur dependencies.",
  "cargo.toml": "Rust project ke config aur dependencies.",
  "pom.xml": "Java (Maven) project ki dependencies aur build config.",
  "composer.json": "PHP project ke dependencies.",
  gemfile: "Ruby project ke dependencies.",
  "drizzle.config.ts": "Drizzle ORM ke database config.",
  "prisma/schema.prisma": "Prisma ORM ka database schema.",
  "eslint.config.mjs": "ESLint code-quality rules.",
  ".eslintrc.json": "ESLint code-quality rules.",
  "postcss.config.mjs": "PostCSS/Tailwind processing config.",
};
