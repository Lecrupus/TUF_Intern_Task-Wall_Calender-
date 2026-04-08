import React, { useState, useEffect, useRef } from 'react';

const BasketballCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [notesDict, setNotesDict] = useState({});
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const flipAudio = useRef(null);

  // --- 2026 INDIAN HOLIDAYS DATA ---
  const indianHolidays2026 = {
    "2026-01-26": "Republic Day",
    "2026-03-04": "Holi",
    "2026-03-21": "Id-ul-Fitr",
    "2026-03-26": "Ram Navami",
    "2026-03-31": "Mahavir Jayanti",
    "2026-04-03": "Good Friday",
    "2026-05-01": "Buddha Purnima",
    "2026-05-27": "Bakrid",
    "2026-06-26": "Muharram",
    "2026-08-15": "Independence Day",
    "2026-08-26": "Milad-un-Nabi",
    "2026-09-04": "Janmashtami",
    "2026-10-02": "Gandhi Jayanti",
    "2026-10-20": "Dussehra",
    "2026-11-08": "Diwali",
    "2026-11-24": "Guru Nanak Jayanti",
    "2026-12-25": "Christmas Day"
  };

  const today = new Date();
  const isToday = (date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const formatDateKey = (d) => {
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getNoteKey = (start, end) => {
    if (!start) return 'general';
    if (!end) return formatDateKey(start);
    return `${formatDateKey(start)}_to_${formatDateKey(end)}`;
  };

  const getDisplayDateText = (start, end) => {
    if (!start) return "General Notes";
    const options = { month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', options).toUpperCase();
    if (!end) return startStr;
    const endStr = end.toLocaleDateString('en-US', options).toUpperCase();
    return `${startStr} - ${endStr}`;
  };

  useEffect(() => {
    flipAudio.current = new Audio('/audiomass-output.mp3'); 
    flipAudio.current.volume = 0.4;
    
    const savedNotes = localStorage.getItem('basketballNotesDict');
    if (savedNotes) {
      try { setNotesDict(JSON.parse(savedNotes)); } catch (e) { console.error(e); }
    }

    const savedTheme = localStorage.getItem('calendarTheme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('calendarTheme', newMode ? 'dark' : 'light');
  };

  const playFlipSound = () => {
    if (flipAudio.current) {
      flipAudio.current.currentTime = 0;
      flipAudio.current.play().catch(err => console.log("Audio play blocked."));
    }
  };

  const handleNotesChange = (e) => {
    const key = getNoteKey(selectionStart, selectionEnd);
    const updatedDict = { ...notesDict, [key]: e.target.value };
    setNotesDict(updatedDict);
    localStorage.setItem('basketballNotesDict', JSON.stringify(updatedDict));
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthKey = `${currentYear}-${currentMonth}`;

  useEffect(() => {
    playFlipSound();
  }, [monthKey]);

  const getMonthData = (monthIndex) => {
    const legends = [
      { name: "Dwyane Wade", img: "/WhatsApp Image 2026-04-08 at 6.24.57 PM (1).jpeg" },
      { name: "Luka Dončić", img: "/WhatsApp Image 2026-04-08 at 6.29.02 PM.jpeg" },
      { name: "Shaquille O'Neal", img: "/WhatsApp Image 2026-04-08 at 6.34.07 PM.jpeg" },
      { name: "Kareem Abdul-Jabbar", img: "/WhatsApp Image 2026-04-08 at 6.38.29 PM.jpeg" },
      { name: "Kevin Garnett", img: "/WhatsApp Image 2026-04-09 at 1.41.47 AM.jpeg" },
      { name: "Dirk Nowitzki", img: "/WhatsApp Image 2026-04-08 at 6.41.07 PM.jpeg" },
      { name: "Damian Lillard", img: "/WhatsApp Image 2026-04-08 at 6.42.14 PM (1).jpeg" },
      { name: "Kobe Bryant", img: "/WhatsApp Image 2026-04-08 at 6.42.59 PM.jpeg" },
      { name: "Kevin Durant", img: "/WhatsApp Image 2026-04-08 at 6.44.42 PM.jpeg" },
      { name: "Devin Booker", img: "/WhatsApp Image 2026-04-08 at 6.45.25 PM.jpeg" },
      { name: "Russell Westbrook", img: "/WhatsApp Image 2026-04-08 at 6.46.02 PM.jpeg" },
      { name: "LeBron James", img: "/WhatsApp Image 2026-04-08 at 6.46.31 PM.jpeg" }
    ];
    return legends[(monthIndex % 12 + 12) % 12];
  };

  const monthData = getMonthData(currentMonth);
  const currentNoteKey = getNoteKey(selectionStart, selectionEnd);
  const currentNoteText = notesDict[currentNoteKey] || "";
  const displayDateText = getDisplayDateText(selectionStart, selectionEnd);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayRaw = new Date(currentYear, currentMonth, 1).getDay();
  const firstDayOfMonth = (firstDayRaw === 0 ? 6 : firstDayRaw - 1);

  const calendarDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, type: 'prev', date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i) });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, type: 'current', date: new Date(currentYear, currentMonth, i) });
  }
  const remainingSlots = calendarDays.length % 7;
  if (remainingSlots !== 0) {
    for (let i = 1; i <= (7 - remainingSlots); i++) {
      calendarDays.push({ day: i, type: 'next', date: new Date(currentYear, currentMonth + 1, i) });
    }
  }

  const handleDateClick = (clickedDate) => {
    if (selectionStart && clickedDate.getTime() === selectionStart.getTime() && !selectionEnd) {
      setSelectionStart(null); setSelectionEnd(null); return;
    }
    if (clickedDate.getMonth() !== currentMonth) {
      setCurrentDate(new Date(clickedDate.getFullYear(), clickedDate.getMonth(), 1));
    }
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(clickedDate); setSelectionEnd(null);
    } else if (clickedDate >= selectionStart) {
      setSelectionEnd(clickedDate);
    } else {
      setSelectionStart(clickedDate);
    }
  };

  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className={`h-screen w-full flex items-center justify-center p-6 font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-300'}`}>
      
      {/* Dark Mode Toggle Button */}
      <button 
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-[60] p-3 rounded-full shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-white text-zinc-800'}`}
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
        )}
      </button>

      {/* Modal Overlay */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isNotesExpanded ? 'bg-black/80 backdrop-blur-md opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-2xl p-8 rounded-xl shadow-2xl transition-all duration-500 transform ${isNotesExpanded ? 'scale-100' : 'scale-90'} ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6 border-b border-zinc-100/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-sky-500 italic uppercase">Strategist Notebook</h3>
              <p className={`text-[10px] font-black tracking-[0.2em] mt-1 uppercase ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{displayDateText}</p>
            </div>
            <button onClick={() => setIsNotesExpanded(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <textarea 
            value={currentNoteText}
            onChange={handleNotesChange}
            autoFocus={isNotesExpanded}
            className={`w-full h-[55vh] p-6 text-lg font-medium rounded-lg focus:outline-none leading-relaxed border ${isDarkMode ? 'bg-zinc-950 text-zinc-300 border-zinc-800' : 'bg-zinc-50 text-zinc-700 border-sky-100'}`}
            placeholder={`Log strategy for ${displayDateText}...`}
          />
        </div>
      </div>

      <div className="absolute top-[2%] left-1/2 -translate-x-1/2 flex flex-col items-center">
         <div className={`w-3.5 h-3.5 rounded-full shadow-md border z-30 ${isDarkMode ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-800 border-zinc-600'}`}></div>
         <div className={`w-44 h-24 border-t-2 border-l-2 border-r-2 rounded-t-full -mt-2 ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-500/30'}`}></div>
      </div>

      <div className={`perspective-container relative w-full max-w-[460px] h-[90vh] rounded-sm shadow-[30px_50px_80px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transform rotate-[-0.3deg] transition-colors duration-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
        
        {/* Spiral Binding */}
        <div className="absolute top-0 left-0 w-full h-10 flex justify-between px-8 items-start z-20 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
                <div className={`w-[4px] h-8 rounded-full -mt-4 shadow-[1px_2px_2px_rgba(0,0,0,0.2)] ${isDarkMode ? 'bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900' : 'bg-gradient-to-b from-zinc-500 via-zinc-200 to-zinc-400'}`}></div>
                <div className={`w-2 h-2.5 rounded-full shadow-inner mt-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
            </div>
          ))}
        </div>

        <div key={monthKey} className="flex-grow flex flex-col animate-page-flip origin-top">
          {/* TOP: Image Section */}
          <div className="w-full h-[40%] p-4 pb-0 shrink-0">
            <div className={`relative w-full h-full overflow-hidden shadow-inner group ${isDarkMode ? 'opacity-80' : 'opacity-100'}`}>
              <img src={monthData.img} alt={monthData.name} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="flex items-end justify-between text-white">
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter leading-none">{monthNames[currentMonth]}</h2>
                    <p className="text-[10px] font-bold tracking-[0.6em] opacity-60 mt-1">{currentYear}</p>
                  </div>
                  <div className="flex gap-2 mb-1">
                    <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))} className="p-1.5 hover:bg-white/20 rounded-full border border-white/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))} className="p-1.5 hover:bg-white/20 rounded-full border border-white/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM: Grid Section */}
          <div className={`flex-grow flex flex-col px-10 py-10 relative transition-colors duration-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="flex items-center gap-4 mb-8 shrink-0">
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] whitespace-nowrap ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>MVP: {monthData.name}</span>
              <div className={`h-[1px] flex-grow ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}></div>
            </div>

            <div className="flex flex-grow gap-8 overflow-hidden">
              {/* Note Sidebar */}
              <div onClick={() => setIsNotesExpanded(true)} className={`w-[15%] flex flex-col shrink-0 border-r pr-4 cursor-pointer group relative ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                 <div className={`flex flex-col items-center justify-center gap-1 w-full py-1.5 rounded border border-sky-500 transition-colors shadow-sm ${isDarkMode ? 'bg-zinc-900 group-hover:bg-zinc-800' : 'bg-white group-hover:bg-sky-50'}`}>
                    <span className="text-sky-500 text-[12px] font-black leading-none">+</span>
                    <span className="text-[6px] font-black uppercase text-sky-500 tracking-widest text-center leading-none">Add<br/>Note</span>
                 </div>
                 <div className="mt-2 mb-3 text-center">
                   <span className={`text-[5px] font-black uppercase tracking-widest block leading-tight ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                     {displayDateText.replace(' - ', '\n-\n')}
                   </span>
                 </div>
                 <div className="relative w-full flex-grow overflow-hidden">
                   <div className={`absolute inset-0 z-10 transition-all duration-500 ${isDarkMode ? 'bg-zinc-900/60 group-hover:bg-transparent' : 'bg-white/30 group-hover:backdrop-blur-none'}`}></div>
                   <div className={`w-full text-[10px] font-medium leading-[24px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} style={{ backgroundImage: isDarkMode ? 'linear-gradient(#18181b 1px, transparent 1px)' : 'linear-gradient(#fbfbfb 1px, transparent 1px)', backgroundSize: '100% 24px' }}>
                     {currentNoteText || "No logs..."}
                   </div>
                 </div>
              </div>

              {/* Days Grid */}
              <div className="flex-grow flex flex-col">
                <div className="grid grid-cols-7 mb-6">
                  {daysOfWeek.map((day, i) => (
                    <div key={day} className={`text-center font-black text-[10px] tracking-widest ${i > 4 ? 'text-sky-400' : (isDarkMode ? 'text-zinc-700' : 'text-zinc-300')}`}>
                      {day[0]}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2 gap-x-1 flex-grow items-center">
                  {calendarDays.map((dayObj, index) => {
                    const dateKey = formatDateKey(dayObj.date);
                    const holidayName = indianHolidays2026[dateKey];
                    const isSel = selectionStart && (selectionEnd ? (dayObj.date >= selectionStart && dayObj.date <= selectionEnd) : dayObj.date.getTime() === selectionStart.getTime());
                    const isCurr = isToday(dayObj.date);
                    const inMonth = dayObj.type === 'current';
                    const hasNote = notesDict[dateKey]?.trim().length > 0;

                    return (
                      <div key={index} onClick={() => handleDateClick(dayObj.date)}
                        className={`group relative flex items-center justify-center aspect-square cursor-pointer transition-all duration-200 rounded-sm
                          ${inMonth ? (isDarkMode ? 'text-zinc-300' : 'text-zinc-800') : (isDarkMode ? 'text-zinc-800' : 'text-zinc-200')}
                          ${isSel ? 'bg-sky-500 !text-white shadow-lg z-10 scale-110' : (isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50')}
                          ${isCurr && !isSel ? 'border-b-2 border-sky-500 text-sky-600 font-bold' : ''}`}
                      >
                        <span className={`text-[13px] ${isSel ? 'font-black' : 'font-semibold'}`}>{dayObj.day}</span>
                        
                        {/* NOTE DOT */}
                        {hasNote && !isSel && <div className="absolute top-0 right-0.5 w-1 h-1 bg-sky-400 rounded-full"></div>}

                        {/* HOLIDAY MARKER - ORANGE DOT */}
                        {holidayName && (
                          <>
                            <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></div>
                            {/* Hover label for holiday name */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                              {holidayName}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className={`mt-8 pt-4 border-t flex justify-between items-center text-[7px] font-bold uppercase tracking-[0.4em] shrink-0 ${isDarkMode ? 'border-zinc-800 text-zinc-700' : 'border-zinc-50 text-zinc-300'}`}>
              <span>Basketball Anthology • 2026 Indian Holidays</span>
              <span>Ref: 2026-V11</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .perspective-container {
          perspective: 1200px;
        }

        @keyframes pageFlip {
          0% { transform: rotateX(-90deg); opacity: 0; }
          100% { transform: rotateX(0deg); opacity: 1; }
        }

        .animate-page-flip {
          animation: pageFlip 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default BasketballCalendar;