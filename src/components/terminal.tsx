import { useTerminal } from "@/contexts/TermianlProvider";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown';

interface TerminalProps {
  // onEscape: (event: KeyboardEvent) => void;
}

const terminalCommands = [
  {
    command: 'help',
    description: 'List available commands.',
    action: () => {
      return `This is an interactive terminal for accessing data on this website.

Available Commands:
- **help:** you\’re reading what this one does :)
- **whythis:** who am I and why this website?
- **whydevdegree:** why I want to get into the DevDegree program at Shopify
- **proj:** see a list of my featured projects
- **view reading:** You can see what I'm reading by typing this command
- **clear:** clear the terminal`;
    }
  },
  {
    command: 'whydevdegree',
    description: 'Reasons I want to get into this program so badly.',
    action: () => {
      return `

    I come from a low-income family in India/Canada but i have never let 
    it hinder my creativity and ambition.

    After working hard to get into university, I was able to
    get full-ride scholarships to 3 universities in Canada.

    I had a 3.7/4.0 GPA but it didn't feel right. I realized I wanted to do 
    more practical things and this wasn't my place.

    Like i'd had done all my life before the uni applications season.
    
    DevDegree is the only program I applied to transfer because 
    it seems as the only program that would help me accomplish my desire
    to practially apply my skills learned.

    I amd disappointed I got rejected after my personal statements 
    evaluation. But i am not quitting, just yet.`;
    }
  },
  {
    command: 'whythis',
    description: 'About me.',
    action: () => {
      return `Hello, I\’m Hardeep. 
      
    This website is designed and engineered to show my creativity and 
    desire to get into the DevDegree.
    
    I'm 20. I have made software for the Brain and 
    Mind Institute in Canada that will be used globally by UNESCO to 
    improve mathematical skills in children.

    Deep down though, I love building communities! 
    
    DevDegree is the only program I applied to transfer and am 
    disappointed I got rejected after my personal statements evaluation. 
    
    I think this will be a good example to showcase that and show 
    a little bit more of my personality with hopes I can atleast
    get an interview :)`;
    }
  },
  {
    command: 'proj',
    description: 'List of projects.',
    action: () => {
      return `Building side projects is my favorite thing to do. Here’s a list of some of my favs; in no particular order:
- **The Residency:** A home for ambitious young people. Backed by Sam Altman. Companies have come out to be accepted in YC and raised $2M+. You can check it out at the carousal below.
- **Numeracy Screener:** A software I made for the Brain and Mind Institute at my university - anticipated to be used by UNESCO in Africa amongst other places to 300,000+ children.
- **FO.CUS:** A hackathon project, which is a web application connected to a BCI which tracks focus and notifies user of distractions for people with ADHD.
- **Stay Woke Non Profit:** A non-profit organization I led in high school and helped scale from provincially to federally in Canada. 1600+ members. You can check it out at [Stay Woke](https://www.staywokeevent.com/)

You may have noticed I have a default naming convention :)`;
    }
  },
  {
    command: 'contact',
    description: 'Contact information.',
    action: () => {
      return `The best and fastest way to reach me is usually **twitter**, but you are also welcome to send me an **email**.`;
    }
  },
  {
    command: 'view',
    description: 'Visit a URL.',
    action: (args: string[]) => {
      if (args.length === 0) {
        return `You must provide a argument for link to visit. 
        
Use **view --help** for available options`
      } else {
        switch (args[0]) {
          case '--help':
            return `You might have noticed you lost your cursor. The view command will allow you to open links without having to click.

Usage: **view <subcommand>**

Subcommands: email, substack, reading, notes, residency, twitter`;
          case 'twitter':
            window.open('https://twitter.com/hardeep_gambhir');
            return "Opening hhttps://twitter.com/hardeep_gambhir";
          case 'substack':
            window.open('https://hardeepgambhir.substack.com/');
            return "Opening https://hardeepgambhir.substack.com/";
          case 'notes':
            window.open('https://hardeeps-iphone-notes.super.site/');
            return "Opening https://hardeeps-iphone-notes.super.site/";
          case 'residency':
            window.open('https://www.livetheresidency.com/');
            return "Opening https://www.livetheresidency.com/";
          case 'reading':
            window.open('https://curius.app/hardeep-gambhir');
            return "Opening https://curius.app/hardeep-gambhir";
          case 'email':
            window.open('mailto:hardeep.tube');
            return "Opening email to hardeep.tube"
          default:
            return "Invalid subcommand. Use **view --help** for available options";
        }
      }
    }
  }
]

export const Terminal = ({ }: TerminalProps) => {
  const [userInput, setUserInput] = useState<string>('')
  const [commandIndex, setCommandIndex] = useState<number>(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [displayHistory, setDisplayHistory] = useState<string[]>([]);
  const [outputHistory, setOutputHistory] = useState<string[]>([]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { isFocused, toggleFocus } = useTerminal();

  const handleTerminalClick = useCallback(() => {
    document.body.style.cursor = 'none';
    terminalRef.current?.focus();
    focusCursor();
  }, []);

  const handleBlur = useCallback(() => {
    document.body.style.cursor = '';
    toggleFocus(false);
    blurCursor();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      terminalRef.current?.blur();
    } else if (event.key === 'Backspace') {
      setUserInput(userInput.slice(0, userInput.length - 1));
    } else if (event.key === 'ArrowUp') {
      if (commandHistory.length > commandIndex) {
        setUserInput(commandHistory[commandHistory.length - (commandIndex + 1)]);
        setCommandIndex(commandIndex + 1);
      }
    } else if (event.key === 'ArrowDown') {
      if (commandIndex <= 1) {
        setUserInput('');
        setCommandIndex(0);
      } else if (commandIndex <= commandHistory.length) {
        setUserInput(commandHistory[commandHistory.length - (commandIndex - 1)]);
        setCommandIndex(commandIndex - 1);
      } 
    } else if (event.key === 'Enter') {
      setCommandIndex(0);
      setCommandHistory([...commandHistory, userInput]);
      setDisplayHistory([...displayHistory, userInput]);
      const command = userInput.split(' ')[0];

      if (!command) {
        setUserInput('');
        setOutputHistory([...outputHistory, '']);
        return;
      }

      if (command === 'clear') {
        setUserInput('');
        setDisplayHistory([]);
        setOutputHistory([]);
        return;
      }

      if (command && terminalCommands.map(c => c.command).includes(command)) {
        const args = userInput.split(' ').slice(1);
        const commandObj = terminalCommands.find(c => c.command === command);
        if (commandObj) {
          setOutputHistory([...outputHistory, commandObj.action(args)]);
        }
      } else {
        setOutputHistory([...outputHistory, `Command not found: ${command}`]);
      }

      setUserInput('');
    } else if (event.key === ' ') {
      setUserInput(userInput + ' ');
    } else if (event.key.length === 1) {
      setUserInput(userInput + event.key);
    }
  }, [userInput, commandHistory, displayHistory, outputHistory, commandIndex]);

  const focusCursor = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.animationPlayState = 'running';
      cursorRef.current.style.backgroundColor = "#FFF";
      cursorRef.current.style.outline = "none";
    }
  }, []);

  const blurCursor = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.animationPlayState = 'paused';
      cursorRef.current.style.backgroundColor = 'transparent';
      cursorRef.current.style.outline = "1px solid #FFF";
    }
  }, []);

  const renderInput = useCallback((input: string) => {
    return { __html: input.replace(/ /g, '&nbsp;') };
  }, [userInput]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [commandHistory, outputHistory]);

  return (
    <div>
      <div className="terminal mx-auto sm:mt-16 md:mt-20 lg:mt-4" tabIndex={0} onClick={handleTerminalClick} onBlur={handleBlur} onKeyDown={handleKeyDown} ref={terminalRef}>
        <div className="terminal-overlay" />
        {!isFocused && (
          <div className="terminal-blur flex justify-center items-center" onClick={() => toggleFocus(true)}>
            <p className="terminal-blur-text backlit">Click to Interact</p>
          </div>
        )}
        <div className="terminal-content terminal-text flex flex-col py-2 px-6" ref={contentRef}>
          <div className="flex flex-col">
            {displayHistory.map((command, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex flex-row items-center h-fit">
                  <span className="terminal-prompt mr-2 ">shopify@hardeep.dev<span id="terminal-prompt-symbol">$</span></span> <span className="terminal-text" dangerouslySetInnerHTML={renderInput(command)} />
                </div>
                <ReactMarkdown className="terminal-text" >{outputHistory[i]}</ReactMarkdown>
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center h-fit">
            <span className="terminal-prompt mr-2 ">shopify@hardeep.dev<span id="terminal-prompt-symbol">$</span></span> <span className="terminal-text" dangerouslySetInnerHTML={renderInput(userInput)} /> <div id="terminal-cursor" ref={cursorRef} />
          </div>
        </div>
      </div>
    </div>
  )
}