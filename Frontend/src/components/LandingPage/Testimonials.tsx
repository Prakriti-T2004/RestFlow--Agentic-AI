import React from "react";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const reviews = [
    {
      name: "Michael Chen",
      role: "Software Eng @ Meta",
      body: "I uploaded my resume and the job description. Within seconds, the agent built a 2-week prep schedule and even sourced the exact system design resources I needed. Landed the offer.",
    },
    {
      name: "Sarah Jenkins",
      role: "Product Manager",
      body: "The dynamic reprioritization is insane. I missed two days of prep due to illness, and the agent automatically restructured my timeline to focus strictly on high-yield topics.",
    },
    {
      name: "David Alaba",
      role: "CS Student",
      body: "It feels like having a senior engineer mentoring me full time. It scheduled mock interviews for me right when I needed them and tracked my weak spots flawlessly.",
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-200/60 transition-colors duration-500" id="testimonials">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Engineered for Top Performers
          </h2>
          <p className="text-slate-500 font-medium">
            Join thousands of professionals who automated their prep and landed their dream roles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, i) => (
            <div key={i} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1">"{review.body}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`}
                  alt={review.name}
                  className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">{review.name}</h4>
                  <p className="text-xs font-bold text-indigo-600">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};