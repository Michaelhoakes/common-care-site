"use client";

import { useEffect } from "react";

const TYPEKIT_URL = "https://use.typekit.net/swf7sdg.css";

export default function TypekitFonts() {
  useEffect(() => {
    const id = "typekit-adobe-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = TYPEKIT_URL;
    document.head.appendChild(link);
  }, []);
  return null;
}
