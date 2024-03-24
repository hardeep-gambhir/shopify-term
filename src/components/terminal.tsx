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
- **whyhardeep:** Why I am unsually confident that I am a good fit for this
- **clear:** clear the terminal`;
    }
  },
  {
    command: 'whydevdegree',
    description: 'Reasons I want to get into this program so badly.',
    action: () => {
      return `

    I come from a low-income family from India/Canada but I have never let 
    my environment hinder my creativity and ambition.

    At age 13, I moved to Canada to my truck-driving father who was away
    from home six days a week. I learned to take care of myself early
    and work hard to eventually be a recipient of three full-ride 
    scholarships for universities in Canada.

    I had a 3.7/4.0 GPA in my first year but it didn't feel right. I 
    realized I wanted to apply the knowledge I was learning to solve
    real world problems and university wasn't giving me the time to do that. 
    
    Thus, DevDegree program is a perfect fit for me. Type whyhardeep to 
    know why I am confident I am a good fit for your program too.

    I am disappointed I got rejected after my personal statements 
    evaluation. But I am not quitting - this is important.`;
    }
  },
  {
    command: 'whyhardeep',
    description: 'Why I am unsually confident that I am a good fit for this',
    action: () => {
      return `I know I am just one of the many names in your database of applicants. 
      
      I do not know much about MongoDB, Svelt or whatever technology you use 
      to be honest. 
      
      But what I do know is every single alumini of yours from the 20 
      I have talked to has been an internet kid. 

      They are not necessarily the kids who got a perfect GPA. Rather the kids 
      who were fixing weird errors on their laptops growing up.

      I do not know much, but I do know I fall in that category. 
      
      Only through being this internet kid I was able to scrape emails of almost all 
      DevDegree interns from DUC through LinkedIn and cold-email them 
      to be able to get on calls with some of them. 

      Ony through this persistence, I have been able to make this website in 
      2 days and send it to Shopify Employees by scrapping all of your emails
      through the web. 

      I know and respect that you do not look at grades. And I am not sure 
      what it was in my application that got me screened out. But for once,
      my intuition/spidey-sense tells me I can make something work here.
      
      And whoever is reading this, I would just appreciate if in any way 
      you can send an email with this website to canny.chiu@shopify.com who
      is in charge of this year's admissions so far as I have heard.`;
    }
  },
  {
    command: 'whythis',
    description: 'About me.',
    action: () => {
      return `Hello, I\’m Hardeep. 
    
    I'm 20. I am a community-builder, software engineer, product-designer, 
    artist, videographer, cinematographer, writer, human.

    This website is designed and engineered to show my creativity and 
    desire to get into DevDegree Program.

    DevDegree is the only program I applied to transfer because 
    it seems as the only program that would help me accomplish my desire
    to practially apply my skills learned. I am disappoitned of my 
    rejection but I am not giving up just yet.

    I think this website will be a good example to show a little bit 
    more of my personality and creativity with hopes I can atleast 
    get an interview to turn things around for myself :)`;
    }
  },
  {
    command: 'proj',
    description: 'List of projects.',
    action: () => {
      return `Building side projects is my favorite thing to do. Here’s a list of some, all are linked in the carousal below:
- **The Residency:** A home for ambitious young people. Backed by Sam Altman. Companies have come out to be accepted in YC and raised $2M+.
- **Numeracy Screener:** A software I made for the Brain and Mind Institute at my university - anticipated to be used by UNESCO in Africa and Ministry of Education in Canada impacting around 300,000+ children.
- **FO.CUS:** A hackathon project, which is a web application connected to a BCI which tracks focus and notifies user of distractions for people with ADHD.
- **Stay Woke Non Profit:** A non-profit organization I led in high school and helped scale from provincially to federally in Canada. 1600+ members.

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