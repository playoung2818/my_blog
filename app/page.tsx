// pages/index.js

import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Zheyuan (James) Chen | Personal Website</title>
        <meta
          name="description"
          content="Data-driven thinker, problem solver, fintech & blockchain enthusiast."
        />
      </Head>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <h1>👋 Hey, I&apos;m Zheyuan (James) Chen!</h1>
        <p>
          Welcome to my corner of the internet! I&apos;m a <strong>data-driven thinker, problem solver, and all-around fintech & blockchain enthusiast.</strong>
        </p>

        <h2>🚀 About Me</h2>
        <ul>
          <li>
            <strong>Background:</strong> With a Economics and Business Analytics background, I thrive at the intersection of <strong>data, markets, and technology</strong>.
          </li>
          <li>
            <strong>What I Do:</strong> By day, I optimize inventory operations at <strong>Neousys Technology</strong>, making supply chain processes smarter and smoother. By night, I&apos;m diving into <strong>crypto, Web3, and fintech projects</strong>—whether it&apos;s building dashboards, exploring smart contracts, or analyzing market trends.
          </li>
          <li>
            <strong>Tech Stack:</strong> Fluent in <strong>Python, SQL, R, Solidity, and Tableau</strong>—basically, I make numbers talk.
          </li>
          <li>
            <strong>Interests:</strong> I geek out over <strong>financial markets, blockchain applications, machine learning, and data visualization</strong>.
          </li>
        </ul>

        <h2>🔨 Projects & Work</h2>
        <ul>
          <li>
            <strong>Automating Inventory Workflows:</strong> Built a Flask-based app that slashes <strong>inventory lookup time from 30 minutes to 5 seconds</strong>.
          </li>
          <li>
            <strong>Crypto Market Research:</strong> Explored liquidity pool risks and the correlation between US Treasuries and Ethereum prices.
          </li>
          <li>
            <strong>Fintech & Web3 Exploration:</strong> Constantly tinkering with <strong>blockchain analytics, DeFi dashboards, and smart contracts</strong>.
          </li>
        </ul>

        <h2>🎯 What&apos;s Next?</h2>
        <p>
          I&apos;m currently building out my <strong>personal projects</strong>, experimenting with <strong>Web3, prescriptive analytics for scheduling, and data visualization</strong>. If you&apos;re into <strong>crypto, fintech, or AI-driven insights</strong>, let&apos;s connect!
        </p>
        <p>
          <a href="https://www.linkedin.com/in/chen0227">LinkedIn</a> |{' '}
          <a href="https://github.com/playoung2818">GitHub</a> |{' '}
          <a href="https://dune.com/james0227">Dune Dashboards</a>
        </p>

        <hr />
        <p>
          <em>Zheyuan (James) Chen</em><br />
          Exploring the world of data, one insight at a time.
        </p>
      </main>
    </div>
  )
}

