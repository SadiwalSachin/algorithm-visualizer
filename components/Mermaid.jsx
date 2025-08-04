'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({chart}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!chart || typeof chart !== 'string') return;

    // Initialize Mermaid only once
    mermaid.initialize({ startOnLoad: false });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('generatedDiagram', chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering failed:', error);
        if (ref.current) {
          ref.current.innerHTML = `<pre style="color: red;">Invalid Mermaid diagram</pre>`;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return <div className='bg-zinc-100 min-h-6xl' ref={ref} />;
}
