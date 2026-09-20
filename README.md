# B&W Minimalist SaaS Dashboard

A premium, high-contrast B&W (Black & White) SaaS dashboard boilerplate built with **React**, **Vite**, and **Shadcn UI**. Designed for developers who value aesthetic minimalism, performance, and advanced data management.

## 🚀 Repository Description
A state-of-the-art SaaS dashboard template featuring a strict monochrome design system. Includes advanced data tables with drag-and-drop reordering, comprehensive UI kit, dark/light mode switching, and a feature-based architecture for enterprise-grade scalability.

## ✨ Key Features

- **🖤 Minimalist B&W Aesthetic**: Pure monochrome design system with high contrast. No blue or indigo defaults—just professional Black & White.
- **📊 Advanced DataTables**: Powered by TanStack Table v8.
  - **Drag & Drop**: Reorder rows visually using `@dnd-kit`.
  - **Sorting & Filtering**: Column-based sorting and global search filtering.
  - **Pagination**: Built-in responsive pagination.
- **🌓 Dynamic Dark Mode**: Seamlessly switch between Light (White bg/Black text) and Dark (Black bg/White text) modes.
- **🛠 Comprehensive Design Kit**: A live `/design-kit` page showcasing all customized Shadcn components (Buttons, Modals, Tabs, Tables, Alerts, Skeletons, etc.).
- **🏗 Feature-Based Architecture**: Modular folder structure (`src/features/`) to keep logic, components, and services isolated and maintainable.
- **⚡ Modern Tech Stack**:
  - **React 18** + **Vite**
  - **Tailwind CSS** (Configured for monochrome tokens)
  - **TanStack Query v5** (Server state management)
  - **Zustand** (Global client state)
  - **Lucide Icons**

## 📂 Project Structure

```text
src/
├── app/             # Global providers and routing
├── features/        # Feature-based modules (Analytics, Team, Auth, etc.)
│   ├── [feature]/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
├── shared/          # Reusable components, hooks, and libs
│   ├── components/  # UI Kit (Shadcn customized)
│   ├── hooks/
│   └── lib/         # Axios config, Utils
└── index.css        # Global design system & theme tokens
```

## 🛠 Getting Started

### 1. Clone & Install
```bash
pnpm install
```

### 2. Development
```bash
pnpm dev
```

### 3. Build for Production
```bash
pnpm build
```

## 🎨 Customizing the Theme
The design tokens are centralized in `src/index.css` using CSS variables. You can adjust the contrast and border-radius globally:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --primary: 0 0% 0%;
  /* ... */
}
```

## 📝 License
This project is open-source and free to use for personal or commercial projects.
