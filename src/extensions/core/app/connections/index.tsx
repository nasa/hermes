import React from 'react';
import { createRoot } from 'react-dom/client';

import ConnectionUi from './connections';

import './global.scss';

const dom = document.getElementById('root');
if (dom) {
    const root = createRoot(dom);
    root.render(<ConnectionUi />);
} else {
    console.error("No 'root' element");
}
