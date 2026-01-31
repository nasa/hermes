import React from "react";
import { createRoot } from "react-dom/client";

import { Downlink } from "./downlink";
import { Uplink } from "./uplink";

import './style.css';

declare const kind: "uplink" | "downlink";

const rootDoc = document.getElementById('root');
if (rootDoc) {
    const root = createRoot(rootDoc);
    root.render(kind === "uplink" ? <Uplink /> : <Downlink />);
} else {
    console.error("No 'root' element");
}
