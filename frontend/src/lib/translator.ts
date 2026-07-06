import type { AnalysisResult } from "../types";

const TECH_TRANSLATIONS: Record<string, string> = {
  "React ka full-stack framework — pages, routing aur backend ek saath deta hai.": "React full-stack framework — provides pages, routing, and backend together.",
  "Full-stack React framework.": "Full-stack React framework.",
  "React based static site generator.": "React-based static site generator.",
  "Vue ka full-stack framework.": "Vue full-stack framework.",
  "Google ka bada framework enterprise apps ke liye.": "Google's framework for enterprise applications.",
  "Compile-time UI framework, bahut fast.": "Compile-time UI framework, extremely fast.",
  "Component-based UI library — screen ko chhote tukdon mein todti hai.": "Component-based UI library — splits screens into smaller reusable pieces.",
  "Node.js ka minimal web server framework — API banane ke liye.": "Minimal web server framework for Node.js — used to build APIs.",
  "Structured Node.js backend framework.": "Structured Node.js backend framework.",
  "Tez Node.js web framework.": "Fast Node.js web framework.",
  "Python ka batteries-included web framework.": "Batteries-included web framework for Python.",
  "Simple aur powerful programming language.": "Simple and powerful programming language.",
  "Google ki fast, compiled language.": "Google's fast, compiled programming language.",
  "Safe aur fast systems language.": "Safe and fast systems programming language.",
  "JavaScript + types = kam bugs, better autocomplete.": "JavaScript + types = fewer bugs, better autocomplete.",
  "Utility classes se fatafat styling.": "Utility-first CSS framework for fast styling.",
  "TypeScript-first database toolkit.": "TypeScript-first database toolkit.",
  "Modern database ORM, type-safe queries.": "Modern database ORM, providing type-safe queries.",
  "MongoDB (Mongoose)": "MongoDB (Mongoose)",
  "NoSQL database ke liye ODM.": "ODM for MongoDB (NoSQL database).",
  "Powerful relational database.": "Powerful relational database.",
  "Global state management.": "Global state management library.",
  "Halka state management library.": "Lightweight state management library.",
  "Super-fast build tool aur dev server.": "Super-fast build tool and development server.",
  "Automated tests se code reliable banta hai.": "Automated tests to make the codebase reliable.",
  "App ko container mein pack kar ke kahin bhi chalao.": "Pack the app in a container and run it anywhere."
};

const WORKFLOW_TITLES: Record<string, string> = {
  "Project start hota hai": "Project Starts",
  "Routing decide hoti hai": "Routing Configuration",
  "UI render hota hai": "UI Rendering",
  "App mount hoti hai": "App Mounting",
  "Server socket bind karta hai": "Server Starts",
  "Response wapas jaata hai": "Response Returned"
};

const WORKFLOW_DESCS: Record<string, string> = {
  "`npm install` se dependencies aati hain, aur npm scripts load hoti hain.": "`npm install` installs dependencies and loads npm scripts.",
  "Project entry chalu hota hai.": "Project execution entry point starts.",
  "Next.js routing logic URL routes render karti hai.": "Next.js routing logic renders matching URL routes.",
  "UI templates browser page par render hotey hain.": "UI templates are rendered on the browser page.",
  "React DOM hook client component attach karta hai.": "React DOM attaches the client component.",
  "Express web ports sunna shuru karta hai.": "Express web server starts listening on ports.",
  "Data request final client endpoint return output wapas bhejti hai.": "The final client endpoint processes the request and returns the output."
};

const FOLDER_PURPOSES: Record<string, string> = {
  "Yeh main source code ka ghar hai. Project ka asli logic yahin likha hota hai.": "This is the main source code directory. The core project logic is written here.",
  "App Router / application ka core. Yahan pages aur routes rehte hain — har folder ek URL banata hai.": "App Router / application core. Pages and routes reside here — each folder creates a URL.",
  "Har file ek page (URL) banati hai. Router in files ko dekh kar navigation set karta hai.": "Each file creates a page (URL). The router configures navigation based on these files.",
  "Reusable UI tukde (buttons, cards, navbar). Inhe baar-baar alag jagah use kiya jaata hai.": "Reusable UI components (buttons, cards, navbar). These are used repeatedly across the application.",
  "Backend endpoints. Frontend yahan request bhejta hai data laane ya save karne ke liye.": "Backend endpoints. The frontend sends requests here to fetch or save data.",
  "Server ke routes/endpoints define karta hai — kaunsa URL kaunsa kaam karega.": "Defines server routes/endpoints — specifies actions for each URL.",
  "Request aane par kya karna hai uski logic. Route ko model se jodta hai.": "Request handling logic. Connects routes with data models.",
  "Data ka structure / database tables. Yeh batata hai data kaisa dikhega.": "Data structures and database tables. Defines how data is shaped.",
  "Business logic aur external API calls. Bada kaam yahan hota hai.": "Business logic and external API calls. Major background operations happen here.",
  "Request beech mein rok kar check karta hai (auth, logging) phir aage bhejta hai.": "Interceptors to check requests (auth, logging) before forwarding.",
  "Chhoti helper functions jo har jagah kaam aati hain.": "Small utility helper functions that are useful everywhere.",
  "Chhoti madadgaar functions jo code ko saaf rakhti hain.": "Small helper functions to keep the code clean.",
  "Reusable library code aur third-party setup (jaise DB client).": "Reusable library setup and third-party configurations (e.g. database client).",
  "React custom hooks — logic ko reuse karne ka tarika (use... naam se).": "React custom hooks — a method to reuse component logic (prefixed with use...).",
  "React Context — poore app mein shared data (jaise logged-in user).": "React Context — shared global state across the app (e.g., authenticated user).",
  "Global state management (Redux/Zustand). App ka data ek jagah.": "Global state management (Redux/Zustand). Stores application data in a single place.",
  "Redux state — app ka global data aur uske updates.": "Redux state — global application state and its updates.",
  "Settings aur configuration files.": "Settings and configuration files.",
  "Database se judi files — connection, schema, queries.": "Database-related files — connection setup, schemas, and queries.",
  "Database setup aur schema ki files.": "Database setup and schema files.",
  "Database ke changes step-by-step. Table banane/badalne ka history.": "Database migrations step-by-step. Tracks history of database structure changes.",
  "Static files (images, favicon) jo seedha browser ko serve hote hain.": "Static files (images, favicon) served directly to the browser.",
  "Static assets jaise images aur fonts.": "Static assets like images and fonts.",
  "Images, icons, fonts jaisi design files.": "Design files like images, icons, and fonts.",
  "CSS/styling files jo app ko sundar banati hain.": "CSS/styling files that make the application beautiful.",
  "Styling files.": "Styling files.",
  "Test files jo check karte hain code sahi chal raha hai ya nahi.": "Test files that verify if the code runs as expected.",
  "Test files — code ka quality check.": "Test files for codebase quality checks.",
  "Automated tests jo bug pakadti hain.": "Automated tests to detect bugs.",
  "Documentation — project kaise use karein iska guide.": "Documentation — instructions on how to use the project.",
  "Chhoti automation scripts (setup, build, seed data).": "Small automation scripts (setup, build, seed data).",
  "TypeScript type definitions — data ka shape describe karti hain.": "TypeScript type definitions — describes the shape of the data.",
  "Type/interface definitions data structure ke liye.": "Type and interface definitions for data structures.",
  "Fixed values jo change nahi hote (colors, keys, options).": "Constant values that do not change (colors, keys, configuration options).",
  "Page ka common structure (header/footer) jo sab pages share karte hain.": "Common page structure (header/footer) shared across multiple pages.",
  "UI screens/templates jo user ko dikhte hain.": "UI screens and templates visible to the user.",
  "HTML/UI templates jo render hote hain.": "HTML/UI templates rendered on the page.",
  "Request handling logic.": "Request handling logic.",
  "Server actions / dispatched actions jo kaam trigger karti hain.": "Server actions / dispatched actions that trigger tasks.",
  "Feature-wise organized code — har folder ek feature.": "Feature-based organization — each folder represents a feature.",
  "Alag-alag modules mein bata hua code.": "Code partitioned into modular packages.",
  "Context/data providers jo child components ko data dete hain.": "Context/data providers that supply state to child components.",
  "Server-side code — backend ka dil.": "Server-side code — the heart of the backend.",
  "Client-side (browser) code.": "Client-side (browser) code.",
  "Image files.": "Image files.",
  "Font files.": "Font files.",
  "Installed packages (auto-generated). Ise chhedne ki zaroorat nahi.": "Installed node packages (auto-generated). No need to modify.",
  "Build output (auto-generated). Yeh deploy hone wala final code hota hai.": "Build output (auto-generated). The final compiled code for deployment.",
  "Compiled/built output (auto-generated).": "Compiled/built output (auto-generated).",
  "Test files — code sahi chal raha hai ya nahi verify karti hain.": "Test files to verify code execution correctness.",
  "Reusable UI components rehte hain yahan.": "Reusable UI components reside here.",
  "Helper functions jo poore code mein kaam aati hain.": "Helper functions used throughout the application.",
  "Project ka ek hissa. Andar related files ek saath rakhi gayi hain.": "Part of the project containing related files grouped together."
};

function translateFileSummary(s: string): string {
  if (s.endsWith("ek custom React hook hai — reusable logic.")) {
    const base = s.split(" ek ")[0];
    return `${base} is a custom React hook containing reusable logic.`;
  }
  if (s.endsWith("ek backend endpoint hai.")) {
    const base = s.split(" ek ")[0];
    return `${base} is a backend endpoint handler.`;
  }
  if (s.endsWith("ek UI component hai.")) {
    const base = s.split(" ek ")[0];
    return `${base} is a user interface component.`;
  }
  if (s.endsWith("data ka structure define karta hai.")) {
    const base = s.split(" data ")[0];
    return `${base} defines the database data structure/schema.`;
  }
  if (s.endsWith("request handle karta hai.")) {
    const base = s.split(" request ")[0];
    return `${base} handles incoming requests.`;
  }
  if (s.endsWith("mein business logic hai.")) {
    const base = s.split(" mein ")[0];
    return `${base} contains the application business logic.`;
  }
  if (s.endsWith("helper functions rakhta hai.")) {
    const base = s.split(" helper ")[0];
    return `${base} contains helper utility functions.`;
  }
  if (s.endsWith("library setup/config code rakhta hai.")) {
    const base = s.split(" library ")[0];
    return `${base} configures third-party libraries.`;
  }
  if (s.endsWith("common page layout wrapper hai.")) {
    const base = s.split(" common ")[0];
    return `${base} is a common layout wrapper for pages.`;
  }
  if (s.endsWith("page component hai.")) {
    const base = s.split(" page ")[0];
    return `${base} is a page view component.`;
  }
  if (s.endsWith("application entry point hai.")) {
    const base = s.split(" application ")[0];
    return `${base} is the application's entry point.`;
  }
  if (s.endsWith("source file.")) {
    const base = s.split(" source ")[0];
    return `${base} source file.`;
  }
  return s;
}

export function translateToEnglish(data: AnalysisResult): AnalysisResult {
  // Translate main summary
  let englishSummary = data.summary;
  // Match structure: **fullName** ek projectType hai jiska maksad hai: "desc". Is repo ko stars logon ne star kiya hai aur iski main language lang hai.
  // We can rebuild it to be super clean and native English!
  const isHinglishSummary = data.summary.includes("ek ") || data.summary.includes("maksad hai");
  if (isHinglishSummary) {
    const descPart = data.repo.description ? ` designed for: "${data.repo.description}".` : ".";
    const langPart = data.repo.language ? ` and its primary language is ${data.repo.language}` : "";
    englishSummary = `**${data.repo.fullName}** is a ${data.projectType}${descPart} This repository has been starred by ${data.repo.stars.toLocaleString()} users${langPart}. Below we will understand step-by-step how this project works from the inside — which folder does what and how code flows.`;
  }

  return {
    ...data,
    summary: englishSummary,
    techStack: data.techStack.map(t => {
      let r = TECH_TRANSLATIONS[t.reason] || t.reason;
      if (t.reason.startsWith("Is project ki main language")) {
        r = `The primary language of this project is ${t.name}.`;
      }
      return { ...t, reason: r };
    }),
    workflow: data.workflow.map(w => ({
      ...w,
      title: WORKFLOW_TITLES[w.title] || w.title,
      description: WORKFLOW_DESCS[w.description] || w.description
    })),
    folders: data.folders.map(f => ({
      ...f,
      purpose: FOLDER_PURPOSES[f.purpose] || f.purpose
    })),
    files: data.files.map(file => {
      // Translate file summary
      const sum = translateFileSummary(file.summary);
      // Translate points list (replace standard items)
      const pts = file.points.map(pt => {
        if (pt.startsWith("Imports:")) {
          return pt.replace("Imports:", "Imports:");
        }
        if (pt.startsWith("Functions:")) {
          return pt.replace("Functions:", "Functions:");
        }
        if (pt.startsWith("Lines of code:")) {
          return pt.replace("Lines of code:", "Lines of code:");
        }
        return pt;
      });
      return { ...file, summary: sum, points: pts };
    })
  };
}
