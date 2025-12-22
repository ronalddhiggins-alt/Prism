"use client";

import {
  Shield,
  Eye,
  Scale,
  Compass,
  Brain,
  Heart,
  ArrowLeft,
} from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-['Instrument_Sans']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
      `}</style>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} className="text-gray-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Prism</h1>
            </div>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Compass className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Understanding Prism
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A guide to seeing the bigger picture: how political ethics shape
            news coverage, and how this helps you understand yourself and others
          </p>
        </div>

        {/* Core Purpose */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Eye size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Prism Is Not a News Rewriter
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Think of Prism as a compass, not a map. We don't claim to show
                you "the truth"—we help you navigate the landscape of political
                ethics and values.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <p className="text-gray-800 font-semibold mb-3">Our Mission:</p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Help you understand{" "}
              <strong>how political ethics shape coverage</strong>, so you can:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">→</span>
                <span>Identify your own political values and priorities</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">→</span>
                <span>Understand why others see things differently</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">→</span>
                <span>
                  See beyond surface-level "facts" to the ethical frameworks
                  beneath
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">→</span>
                <span>
                  Make more informed decisions about what you believe and why
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What the Analysis Shows You
              </h2>

              <div className="space-y-6">
                {/* Point 1 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">1.</span>
                    Spot Framing Differences
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    The same policy or event gets described in vastly different
                    ways:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold text-rose-600">Left:</span>{" "}
                      "Climate Bill Passes: Major Victory for Green Energy"
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-600">
                        Center:
                      </span>{" "}
                      "Senate Approves Climate Legislation After Months of
                      Negotiations"
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-blue-600">
                        Right:
                      </span>{" "}
                      "New Regulations to Burden Small Businesses Approved by
                      Senate"
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>What this reveals:</strong> Left values
                    environmental collective action, right values economic
                    freedom and business autonomy. Neither is "lying"—they're
                    highlighting what matters most to their ethical framework.
                  </p>
                </div>

                {/* Point 2 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">2.</span>
                    Understand Coverage Gaps
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    When only one side covers a story, that's information in
                    itself:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2 ml-4">
                    <li>
                      • If only left outlets cover police reform protests →
                      might indicate right outlets don't see it as priority
                    </li>
                    <li>
                      • If only right outlets cover small business tax concerns
                      → might indicate left outlets focus on different economic
                      priorities
                    </li>
                    <li>
                      • If center outlets ignore something → might indicate it's
                      considered fringe or unverified
                    </li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>What this reveals:</strong> Different political
                    ethics mean different things are considered "newsworthy."
                    Understanding what's <em>not</em> covered helps you see each
                    side's priorities and blind spots.
                  </p>
                </div>

                {/* Point 3 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">3.</span>
                    Make Informed Decisions
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Instead of trusting one aggregated summary, you can:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2 ml-4">
                    <li>
                      • Read the actual source articles from each perspective
                    </li>
                    <li>• Compare which facts each side emphasizes or omits</li>
                    <li>
                      • Check credibility scores to assess source reliability
                    </li>
                    <li>
                      • Form your own opinion based on multiple viewpoints
                    </li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>What this reveals:</strong> You become an active
                    participant in understanding the news, not a passive
                    consumer. This builds critical thinking and media literacy.
                  </p>
                </div>

                {/* Point 4 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">4.</span>
                    Map Political Ethics
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    By seeing patterns across many stories, you'll recognize
                    core value differences:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-rose-600 mb-2">
                          Left Values
                        </p>
                        <ul className="text-gray-700 space-y-1 text-xs">
                          <li>• Collective wellbeing</li>
                          <li>• Systemic change</li>
                          <li>• Social equity</li>
                          <li>• Environmental protection</li>
                          <li>• Government intervention</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 mb-2">
                          Center Values
                        </p>
                        <ul className="text-gray-700 space-y-1 text-xs">
                          <li>• Balanced approach</li>
                          <li>• Incremental reform</li>
                          <li>• Institutional stability</li>
                          <li>• Fact-based policy</li>
                          <li>• Pragmatic solutions</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-600 mb-2">
                          Right Values
                        </p>
                        <ul className="text-gray-700 space-y-1 text-xs">
                          <li>• Individual liberty</li>
                          <li>• Traditional values</li>
                          <li>• Economic freedom</li>
                          <li>• Limited government</li>
                          <li>• Personal responsibility</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>What this reveals:</strong> Politics isn't just
                    about "right vs wrong"—it's about competing values. You can
                    respect different ethics even when you disagree with
                    conclusions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Bigger Picture */}
        <section className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-lg text-white mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                The Bigger Picture: Understanding Yourself and Others
              </h2>
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p>
                  <strong className="text-white">
                    Prism helps you answer:
                  </strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>
                      <strong className="text-white">
                        What are my political ethics?
                      </strong>{" "}
                      Notice which framings resonate with you emotionally—that
                      reveals your values
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>
                      <strong className="text-white">
                        Why do others see it differently?
                      </strong>{" "}
                      When you understand the ethical framework behind opposing
                      views, disagreement becomes less adversarial
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>
                      <strong className="text-white">
                        Where are my blind spots?
                      </strong>{" "}
                      Perspectives you initially dismiss might highlight
                      concerns you hadn't considered
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>
                      <strong className="text-white">
                        What's the complete picture?
                      </strong>{" "}
                      No single perspective captures all truth—synthesis
                      requires seeing multiple angles
                    </span>
                  </li>
                </ul>
                <div className="bg-white/10 rounded-lg p-4 mt-4">
                  <p className="text-white font-semibold">
                    This isn't about becoming "neutral" or abandoning your
                    values. It's about:
                  </p>
                  <p className="mt-2">
                    <em>
                      Understanding the landscape of political ethics so you can
                      navigate it with clarity, empathy, and informed
                      conviction.
                    </em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart size={24} className="text-rose-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How to Use Prism Effectively
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    1. Enter a topic you care about
                  </p>
                  <p className="text-sm">
                    Search for something you already have an opinion on—this
                    helps you notice your own biases
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    2. Read all three perspectives
                  </p>
                  <p className="text-sm">
                    Don't just read the one that aligns with your views. The
                    discomfort of opposing framings is where learning happens
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    3. Notice the language and emphasis
                  </p>
                  <p className="text-sm">
                    What words are used? What aspects are highlighted? What's
                    omitted? This reveals underlying values
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    4. Click through to read full sources
                  </p>
                  <p className="text-sm">
                    Our analysis is a starting point, not the destination. Read
                    the actual articles to form your own view
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    5. Reflect on what resonates and why
                  </p>
                  <p className="text-sm">
                    Which framing feels "right" to you? Why? That reveals your
                    political ethics and priorities
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    6. Practice empathy, not just analysis
                  </p>
                  <p className="text-sm">
                    Try to understand why someone with different values would
                    see it differently—not to agree, but to comprehend
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Start Investigating
            <Shield size={20} />
          </a>
          <p className="text-sm text-gray-500 mt-4">
            See the news from every angle. Understand the bigger picture.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Prism is built to help you understand how political ethics shape
            news coverage.
          </p>
        </div>
      </footer>
    </div>
  );
}
