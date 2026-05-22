import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      q: "How does the Agentic AI actually work?",
      a: "Unlike static tools, our AI acts as an autonomous agent. When you provide an objective (e.g., 'Prep for Google SWE interview in 7 days'), it breaks the goal down, creates a schedule, sources links, sets up calendar events, and actively tracks your completion, adjusting if you fall behind.",
    },
    {
      q: "Is my resume and data kept private?",
      a: "Absolutely. We use enterprise-grade encryption and strict data policies. Your resume is parsed strictly to configure your personal agent and is never used to train generalized models.",
    },
    {
      q: "Does it support non-tech roles?",
      a: "Yes! While highly popular among engineers, the dynamic engine works for Product Management, Design, Finance, and generic study goals. You just provide the context, and the agent builds the relevant workflow.",
    },
    {
      q: "Can it integrate with my existing calendar?",
      a: "Yes, AgentFlow integrates seamlessly with Google Calendar and Outlook to automatically block out study sessions based on your availability.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 relative z-10 bg-[#f8fbff]" id="faq">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 font-medium">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-colors">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-extrabold text-[#0f172a]">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-500 font-medium leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};