# Prism 2.0

> **See the whole picture.**

Prism is an AI-powered news analysis tool designed to break echo chambers. It analyzes any topic from three distinct political perspectives—**Left (Progressive)**, **Center (Neutral)**, and **Right (Conservative)**—and includes an impartial **Fact Checker** to verify claims.

![Prism Screenshot](https://placeholder-for-screenshot)

## features

- **Multi-Perspective Analysis**: Instantly generates three distinct viewpoints on any topic using parallel AI agents.
- **Fact Checker**: An impartial auditor that verifies controversial claims and provides a verdict (True/False/Nuanced).
- **Source Transparency**: Identifies likely sources for each perspective with credibility scores.
- **Privacy First**: Your API keys are stored locally. No data is sent to our servers.
- **Open Source Soul**: Built with the philosophy of transparency and education.

## tech stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: OpenAI API (GPT-4o-mini) or Anthropic Claude
- **Deployment**: Vercel / Netlify / GitHub Pages

## getting started

### prerequisites

- [Node.js](https://nodejs.org/) 18+ installed.
- An [OpenAI API Key](https://platform.openai.com/api-keys).

### installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/prism.git
    cd prism
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` file in the root directory and add your API Key:
    ```bash
    OPENAI_API_KEY=sk-your-key-here
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## license

**Prism v2.0** is created by **Ron Higgins & Antigravity**.

Based on original concepts (v1.0) developed by Ron Higgins & Claude 4.5 Sonnet.

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License** (CC BY-NC-SA 4.0).
See the [LICENSE](LICENSE) file for details.

---

*" The truth is usually distributed."*
