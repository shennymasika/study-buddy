import type { QuizData } from '../types/quiz';

export const initialQuizData: QuizData = {
  "app_name": "Computer Studies Quest",
  "version": "1.0",
  "topics": [
    {
      "topic": "Computer Hardware",
      "description": "Learn about the physical components of computer systems, their functions, input, processing, output and storage.",
      "key_terms": [
        "Hardware",
        "System Unit",
        "Peripherals",
        "Micro-computer",
        "Mini-computer",
        "Macro-computer",
        "Server",
        "Supercomputer",
        "Input Devices",
        "QWERTY Keyboard",
        "Dvorak Keyboard",
        "Optical Mouse",
        "Trackball",
        "GIGO",
        "Central Processing Unit (CPU)",
        "Arithmetic Logic Unit (ALU)",
        "Control Unit (CU)",
        "Machine Cycle",
        "Pipelining",
        "Output Devices",
        "Soft Copy",
        "Hard Copy",
        "CRT Monitor",
        "LCD Monitor",
        "Resolution",
        "RAM",
        "ROM",
        "Secondary Storage",
        "Hard Disk",
        "Floppy Disk",
        "Flash Memory",
        "Tracks and Sectors",
        "Head Crash"
      ],
      "levels": [
        {
          "level": 1,
          "name": "Hardware Rookie",
          "difficulty": "easy",
          "question_ids": ["HW001"]
        },
        {
          "level": 2,
          "name": "Hardware Explorer",
          "difficulty": "medium",
          "question_ids": ["HW002"]
        },
        {
          "level": 3,
          "name": "Hardware Master",
          "difficulty": "hard",
          "question_ids": ["HW003"]
        }
      ]
    },
    {
      "topic": "Computer Software",
      "description": "Understand software types, operating systems, application programs, software ownership and utility programs.",
      "key_terms": [
        "System Software",
        "Application Software",
        "Software License",
        "EULA",
        "Open Source Software",
        "Commercial Software",
        "Shareware",
        "Freeware",
        "Public Domain Software",
        "Operating System",
        "Kernel",
        "Multitasking",
        "Virtual Memory",
        "Buffering",
        "Spooling",
        "Software Suite",
        "Desktop Software",
        "Mobile Apps",
        "Word Processing",
        "Spreadsheet",
        "Database",
        "Utility Program",
        "File Management Program",
        "Cleanup Utility",
        "Antivirus",
        "Firewall",
        "File Compression Utility"
      ],
      "levels": [
        {
          "level": 1,
          "name": "Software Rookie",
          "difficulty": "easy",
          "question_ids": ["SW001"]
        },
        {
          "level": 2,
          "name": "Software Explorer",
          "difficulty": "medium",
          "question_ids": ["SW002"]
        },
        {
          "level": 3,
          "name": "Software Master",
          "difficulty": "hard",
          "question_ids": ["SW003"]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "HW001",
      "topic": "Computer Hardware",
      "level": 1,
      "question": "Which component of the Central Processing Unit (CPU) is specifically responsible for executing computer commands?",
      "options": [
        {
          "id": "A",
          "text": "Control Unit"
        },
        {
          "id": "B",
          "text": "Arithmetic Logic Unit (ALU)"
        },
        {
          "id": "C",
          "text": "Secondary Storage Unit"
        },
        {
          "id": "D",
          "text": "Output Unit"
        }
      ],
      "answer": "B",
      "explanation": "The Arithmetic Logic Unit (ALU) performs arithmetic and logical operations during instruction execution, while the Control Unit coordinates and directs the execution process."
    },
    {
      "id": "HW002",
      "topic": "Computer Hardware",
      "level": 2,
      "question": "What occurs during the formatting process of a magnetic storage disk?",
      "options": [
        {
          "id": "A",
          "text": "Program pages are permanently moved to virtual memory."
        },
        {
          "id": "B",
          "text": "All data is erased, defects are identified, a root directory is created, and the disk is divided into tracks and sectors."
        },
        {
          "id": "C",
          "text": "Data is converted from soft copy into hard copy."
        },
        {
          "id": "D",
          "text": "The read/write head is locked to prevent head crashes."
        }
      ],
      "answer": "B",
      "explanation": "Disk formatting prepares a disk for data storage by establishing its file system structure, including tracks, sectors and directory information. A full format may also check for defective sectors; a quick format does not necessarily erase all underlying data."
    },
    {
      "id": "HW003",
      "topic": "Computer Hardware",
      "level": 3,
      "question": "What is the precise four-step sequence undertaken by a computer system to access data stored on a magnetic hard disk drive?",
      "options": [
        {
          "id": "A",
          "text": "Fetch, Decode, Execute, Store"
        },
        {
          "id": "B",
          "text": "Rotate, Seek, Data transfer, Settle"
        },
        {
          "id": "C",
          "text": "Seek, Rotate, Settle, Data transfer"
        },
        {
          "id": "D",
          "text": "Settle, Seek, Rotate, Data transfer"
        }
      ],
      "answer": "C",
      "explanation": "The read/write head first seeks the required track, the disk rotates until the required sector is positioned, the head settles into position, and the requested data is transferred into main memory."
    },
    {
      "id": "SW001",
      "topic": "Computer Software",
      "level": 1,
      "question": "Which category of software ownership consists of copyrighted programs that are provided free of charge on a trial basis, requiring payment if used beyond the trial period?",
      "options": [
        {
          "id": "A",
          "text": "Public domain software"
        },
        {
          "id": "B",
          "text": "Shareware"
        },
        {
          "id": "C",
          "text": "Open source software"
        },
        {
          "id": "D",
          "text": "Commercial software"
        }
      ],
      "answer": "B",
      "explanation": "Shareware is copyrighted software distributed for free evaluation. Users are generally expected to pay for continued use after the trial period."
    },
    {
      "id": "SW002",
      "topic": "Computer Software",
      "level": 2,
      "question": "How does an operating system utilize virtual memory when primary RAM capacity is full?",
      "options": [
        {
          "id": "A",
          "text": "It permanently converts Read Only Memory (ROM) into RAM modules."
        },
        {
          "id": "B",
          "text": "It uses available hard drive space as extra RAM by swapping pages of data back and forth with main memory."
        },
        {
          "id": "C",
          "text": "It compresses operating system drivers directly inside the CPU."
        },
        {
          "id": "D",
          "text": "It routes print requests directly to the spooler buffer."
        }
      ],
      "answer": "B",
      "explanation": "Virtual memory uses storage space to hold memory pages that are not currently in physical RAM. The operating system transfers pages between storage and RAM as needed."
    },
    {
      "id": "SW003",
      "topic": "Computer Software",
      "level": 3,
      "question": "What is the principal functional difference between buffering/spooling and multitasking in an operating system?",
      "options": [
        {
          "id": "A",
          "text": "Buffering holds data waiting for a device in designated RAM or hard disk areas, while multitasking allows the computer to execute multiple programs simultaneously."
        },
        {
          "id": "B",
          "text": "Buffering cleans temporary installation files, while multitasking compresses files for Internet transfer."
        },
        {
          "id": "C",
          "text": "Buffering is used exclusively on mobile operating systems, while multitasking is only used on network servers."
        },
        {
          "id": "D",
          "text": "Buffering loads the kernel during booting, while multitasking checks for physical disk defects."
        }
      ],
      "answer": "A",
      "explanation": "Buffering temporarily stores data while it waits to be processed or transferred. Spooling queues jobs for devices such as printers, while multitasking allows multiple programs to share CPU processing time."
    }
  ],
  "game_mechanics": {
    "progression": {
      "levels_per_topic": 3,
      "difficulty_order": [
        "easy",
        "medium",
        "hard"
      ],
      "unlock_rule": "Players must complete the previous level to unlock the next level.",
      "completion_rule": "A player must answer all questions in a level and achieve at least 70 percent accuracy to pass.",
      "replay_rule": "Players can replay completed levels to improve their scores and earn additional XP."
    },
    "experience_points": {
      "easy_correct": 10,
      "medium_correct": 20,
      "hard_correct": 30,
      "incorrect_answer": 0,
      "level_completion_bonus": 20,
      "topic_completion_bonus": 50,
      "streak_bonus": {
        "trigger": "Every 3 consecutive correct answers",
        "points": 5
      }
    },
    "streak_rules": {
      "definition": "A streak counts consecutive correctly answered questions.",
      "increment": "Increase streak by 1 for every correct answer.",
      "reset": "Reset streak to 0 after an incorrect answer.",
      "bonus": "Award 5 additional XP for every third consecutive correct answer.",
      "daily_streak": "A daily streak increases when the player completes at least one quiz on a new calendar day.",
      "streak_protection": "Optional streak freeze can protect one missed day."
    },
    "hearts_and_lives": {
      "starting_hearts": 5,
      "maximum_hearts": 5,
      "correct_answer": "No heart lost.",
      "incorrect_answer": "Lose 1 heart.",
      "zero_hearts": "Pause quiz attempts until a heart is restored.",
      "recovery": "Restore 1 heart every 30 minutes.",
      "full_recovery": "Restore all hearts when the player returns after the recovery period has elapsed.",
      "optional_reward": "Players can earn bonus hearts through achievements or daily challenges."
    },
    "leaderboard": {
      "types": [
        "Global Leaderboard",
        "Friends Leaderboard",
        "Weekly Leaderboard",
        "Topic Leaderboard"
      ],
      "ranking_metric": "Total XP earned during the selected leaderboard period.",
      "tie_breaker": "Higher quiz accuracy, followed by fewer attempts.",
      "reset_schedule": "Weekly leaderboard resets every Monday.",
      "rewards": {
        "first_place": "Gold Trophy",
        "second_place": "Silver Trophy",
        "third_place": "Bronze Trophy"
      }
    },
    "rewards_and_achievements": [
      {
        "name": "First Steps",
        "condition": "Complete your first quiz."
      },
      {
        "name": "Perfect Score",
        "condition": "Answer every question in a level correctly."
      },
      {
        "name": "On Fire",
        "condition": "Achieve 5 consecutive correct answers."
      },
      {
        "name": "Hardware Master",
        "condition": "Complete all Computer Hardware levels."
      },
      {
        "name": "Software Master",
        "condition": "Complete all Computer Software levels."
      },
      {
        "name": "Computer Studies Champion",
        "condition": "Complete all available topics and levels."
      }
    ]
  },
  "user_flow": [
    {
      "step": 1,
      "screen": "Home",
      "purpose": "Welcome players and display their progress.",
      "elements": [
        "Player profile",
        "Total XP",
        "Current daily streak",
        "Available hearts",
        "Continue Learning button",
        "Topic Map button",
        "Leaderboard button"
      ],
      "next": "Topic Map"
    },
    {
      "step": 2,
      "screen": "Topic Map",
      "purpose": "Allow players to select a Computer Studies topic.",
      "elements": [
        "Computer Hardware",
        "Computer Software",
        "Topic completion percentage",
        "Locked and unlocked levels",
        "Earned topic badges"
      ],
      "next": "Level Selection"
    },
    {
      "step": 3,
      "screen": "Level",
      "purpose": "Display the available difficulty levels within a selected topic.",
      "elements": [
        "Level 1: Easy",
        "Level 2: Medium",
        "Level 3: Hard",
        "Level descriptions",
        "Required XP",
        "Level progress"
      ],
      "next": "Quiz"
    },
    {
      "step": 4,
      "screen": "Quiz",
      "purpose": "Present questions and evaluate player answers.",
      "elements": [
        "Question number",
        "Question text",
        "Four multiple-choice options",
        "Submit Answer button",
        "Remaining hearts",
        "Current XP",
        "Streak counter",
        "Progress bar"
      ],
      "behavior": [
        "Allow one answer per question.",
        "Highlight the correct answer after submission.",
        "Display an explanation.",
        "Award XP for correct answers.",
        "Deduct a heart for incorrect answers.",
        "Move to the next question."
      ],
      "next": "Result"
    },
    {
      "step": 5,
      "screen": "Result",
      "purpose": "Show the player's performance after completing a level.",
      "elements": [
        "Final score",
        "Correct answers",
        "Incorrect answers",
        "Accuracy percentage",
        "XP earned",
        "Streak achieved",
        "Level completion status",
        "Retry Level button",
        "Continue button"
      ],
      "next": "Streak and Leaderboard"
    },
    {
      "step": 6,
      "screen": "Streak and Leaderboard",
      "purpose": "Encourage continued learning and friendly competition.",
      "elements": [
        "Current daily streak",
        "Longest streak",
        "Total XP",
        "Global rankings",
        "Friends rankings",
        "Weekly rankings",
        "Achievement badges",
        "Return Home button"
      ],
      "next": "Home"
    }
  ]
};
