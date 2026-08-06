import React from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function MobileWhatsAppBar() {
  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "12px 16px",
        background: "rgba(245,241,234,0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(138,133,120,0.28)",
      }}
    >
      <WhatsAppButton style={{ width: "100%" }}>
        Chamar no WhatsApp
      </WhatsAppButton>
    </div>
  );
}