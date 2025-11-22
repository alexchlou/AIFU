import React, { useEffect, useState } from 'react';

const StarWarsIntro = ({ onComplete }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSkip();
        }, 80000); // Animation duration

        return () => clearTimeout(timer);
    }, []);

    const handleSkip = () => {
        window.open('https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5458615', '_blank');
        setShow(false);
        setTimeout(onComplete, 500); // Allow fade out
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black z-[100] overflow-hidden font-sans flex items-center justify-center">
            <style>{`
        @keyframes crawl {
          0% {
            top: 0;
            transform: rotateX(20deg) translateZ(0);
          }
          100% {
            top: -6000px;
            transform: rotateX(25deg) translateZ(-2500px);
          }
        }
        
        .star-wars-container {
          display: flex;
          justify-content: center;
          position: relative;
          height: 800px;
          color: #feda4a;
          font-family: 'Pathway Gothic One', sans-serif;
          font-size: 500%;
          font-weight: 600;
          letter-spacing: 6px;
          line-height: 150%;
          perspective: 400px;
          text-align: justify;
        }

        .crawl {
          position: relative;
          top: 9999px;
          transform-origin: 50% 100%;
          animation: crawl 80s linear;
        }

        .fade-out {
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }

`}</style>

            <div className="star-wars-container w-full max-w-3xl">
                <div className="crawl text-center">
                    <div className="title mb-12">
                        <p>Episode I</p>
                        <h1 className="uppercase text-6xl mt-4">Develop-Fair Use</h1>
                    </div>

                    <div className="text-justify text-4xl leading-relaxed">
                        <h2 className="text-center text-5xl mb-4">Develop-Fair Use for Artificial Intelligence</h2>
                        <h3 className="text-center text-3xl mb-8">A Sino-U.S. Copyright Law Comparison Based on the Ultraman, Bartz v. Anthropic, and Kadrey v. Meta Cases</h3>
                        <p className="text-center text-2xl mb-12 italic">Chanhou Lou</p>

                        <p>
                            Traditional fair use can no longer respond to the challenges posed by generative AI. Drawing on a comparative analysis of China's Ultraman and the U.S. cases Bartz v. Anthropic and Kadrey v. Meta, this article proposes "Develop-Fair Use" (DFU).
                        </p>
                        <br />
                        <p>
                            DFU treats <span className="text-indigo-400 font-bold mx-1" style={{ textShadow: '0 0 10px rgba(129, 140, 248, 0.5)' }}>AI fair use (AIFU)</span> not as a fixed exception but as a dynamic tool of judicial balancing that shifts analysis from closed scenarios to an evaluative rule for open-ended contexts. The judicial focus moves from formal classification of facts to a substantive balancing of competition in relevant markets.
                        </p>
                        <br />
                        <p>
                            Although China and the U.S. follow different paths, both reveal this logic: Ultraman, by articulating a "four-context analysis," creates institutional space for AI industry development; the debate over the fourth factor, market impact, in the two U.S. cases, especially Kadrey's "market dilution" claim, expands review from substitution in copyright markets to wider industrial competition.
                        </p>
                        <br />
                        <p>
                            The core of DFU is to recognize and balance the tension in relevant markets between an emerging AI industry that invokes fair use to build its markets and a publishing industry that develops markets, including one for "training licenses," to resist fair use. The boundary of fair use is therefore not a product of pure legal deduction but a case-specific factual judgment grounded in evolving market realities. This approach aims both to trim excess copyright scope and to remedy shortfalls in market competition.
                        </p>

                        <div className="mt-16 text-center">
                            <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5458615" className="text-blue-400 hover:text-blue-300 underline decoration-2 underline-offset-8 text-3xl">
                                https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5458615
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSkip}
                className="absolute bottom-8 right-8 px-6 py-2 bg-transparent border border-[#feda4a] text-[#feda4a] hover:bg-[#feda4a] hover:text-black transition-all duration-300 rounded uppercase tracking-widest text-sm font-bold z-50"
            >
                Skip Intro
            </button>

            {/* Audio could go here if requested */}
        </div>
    );
};

export default StarWarsIntro;
