"use client";

import { useTerminal } from "@/contexts/TermianlProvider";
import { Terminal } from "@/components/terminal";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

export default function Home() {
  const footerContentRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const { isFocused } = useTerminal();

  useEffect(() => {
    if (footerContentRef.current) {
        const contentWidth = footerContentRef.current.scrollWidth + 'px';
        document.documentElement.style.setProperty('--content-width', contentWidth); // Setting the CSS variable
    }
  }, []);

  const stopScroll = useCallback(() => {
    if (scrollContentRef.current) {
      scrollContentRef.current.style.animationPlayState = 'paused';
    }
  }, []);

  const resumeScroll = useCallback(() => {
    if (scrollContentRef.current) {
      scrollContentRef.current.style.animationPlayState = 'running';
    }
  }, []);

    return (
      <div>
        <div className='container mx-auto mt-16 flex flex-row justify-end sm:justify-between'>
  
          <div className={`terminal-text spd-hide flex flex-col space-y-2 ${isFocused ? "opacity-100" : "opacity-0"}`} style={{ maxWidth: '100%', margin: '0 auto' }}>
            <div className="font-semibold">Use `help` for command options</div>
            <div className="font-semibold">Type `Esc` key to exit terminal and use cursor</div>
          </div>
          <div className="image-container justify-center w-full flex justify-center" style={{ maxWidth: '10%', margin: '0 auto' }}>
          <img src="shopify3.png" alt="Descriptive Text" />
        </div>
          <div className='details w-fit pr-4 sm:pr-0'>
            <div className='about backlit'>
              <p className='about-header'>Hardeep Gambhir</p>
              <p className='about-subheader'>Dreamer</p>
              <p className='about-subheader'>Currently Daydreaming to get into Shopify DevDegree at DUC</p>
            </div>
            <div className='contact pt-4 backlit'>
              <p><a href="mailto:me@hardeep.tube" target="_blank" rel="noopener noreferrer">Email</a></p>
              <p> <a href="https://www.linkedin.com/in/hardeep-gambhir/" target="_blank" rel="noopener noreferrer">
              Linkedin
                  </a></p>
              <p> <a href="https://twitter.com/hardeep_gambhir" target="_blank" rel="noopener noreferrer">Twitter</a></p>
            </div>
          </div>
        </div>
        <Terminal />
        <div className="spd-show spd-message flex flex-col space-y-8">
          <div className="font-bold text-xl">This website is not meant to be experienced on mobile.</div>
          <div className="font-normal text-lg">Please pull out your laptop :)</div>
        </div>
        <div className='footer' onMouseEnter={stopScroll} onMouseLeave={resumeScroll}>
          <div className='footer-content backlit py-4 flex flex-row' ref={scrollContentRef}>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex flex-row space-x-32 pl-32" ref={footerContentRef}>
                <Link className="link" target="_blank" href="https://www.livetheresidency.com/" rel="noopener noreferrer"><p className="footer-text">The Residency</p></Link>
                <Link className="link" target="_blank" href="https://www.hardeepgambhir.substack.com/" rel="noopener noreferrer"><p className="footer-text">Read My <span className="m1-bold">Substack</span></p></Link>
                <Link className="link" target="_blank" href="https://hardeeps-iphone-notes.super.site/" rel="noopener noreferrer"><p className="footer-text">Notes from my iPhone</p></Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

