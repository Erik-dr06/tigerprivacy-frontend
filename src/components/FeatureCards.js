import React from "react";

export default function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto">
      <div className="glass p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300">
        <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
          <span className="text-primary" role="img">👁️</span>
        </div>
        <h3 className="text-2xl font-semibold mb-3">Privacy Visibility</h3>
        <p className="text-muted-foreground">
          See exactly what data each platform has collected about you in one unified dashboard.
        </p>
      </div>

      <div className="glass p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300">
        <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
          <span className="text-success" role="img">📈</span>
        </div>
        <h3 className="text-2xl font-semibold mb-3">Risk Analysis</h3>
        <p className="text-muted-foreground">
          Get a personalized privacy risk score and understand where you're most vulnerable.
        </p>
      </div>

      <div className="glass p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300">
        <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
          <span className="text-accent" role="img">🔒</span>
        </div>
        <h3 className="text-2xl font-semibold mb-3">End-to-End Encryption</h3>
        <p className="text-muted-foreground">
          Your data is encrypted client-side before it ever leaves your device. Total privacy guaranteed.
        </p>
      </div>
    </div>
  );
}
