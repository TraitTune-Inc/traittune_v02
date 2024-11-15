import { QuestionSet } from '../types/questions';

export const questions: Record<string, QuestionSet> = {
  personal: {
    title: 'Personal Assessment',
    description: 'Individual assessment for personal development, focusing on personal traits, challenges, and goals.',
    questions: [
      {
        id: 'primaryGoal',
        header: 'Primary Goal',
        description: 'What is your primary goal for this assessment?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'professionalBackground',
        header: 'Professional Background',
        description: 'Please provide a brief description of your professional background.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'currentRole',
        header: 'Current Role',
        description: 'What is your current position or occupation?',
        type: 'textarea',
        maxLength: 100
      },
      {
        id: 'strengths',
        header: 'Strengths',
        description: 'What do you consider your main strengths?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'areasForImprovement',
        header: 'Areas for Improvement',
        description: 'What areas would you like to improve or develop?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'motivation',
        header: 'Motivation',
        description: 'What motivates you in your personal and professional life?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'currentChallenges',
        header: 'Current Challenges',
        description: 'What specific challenges are you currently facing?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'goals',
        header: 'Short-term and Long-term Goals',
        description: 'What are your short-term and long-term goals?',
        type: 'textarea',
        maxLength: 400
      },
      {
        id: 'workEnvironment',
        header: 'Ideal Work Environment',
        description: 'Describe your ideal work environment.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'communicationStyle',
        header: 'Communication Style',
        description: 'How would you describe your communication style?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'stressManagement',
        header: 'Stress Management',
        description: 'How do you typically handle stress and pressure?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'decisionMaking',
        header: 'Decision Making',
        description: 'How do you approach decision-making in personal and professional settings?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'learningPreferences',
        header: 'Learning Preferences',
        description: 'What learning methods do you prefer?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'feedbackReception',
        header: 'Feedback Reception',
        description: 'How do you perceive and respond to feedback from others?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'interests',
        header: 'Interests and Hobbies',
        description: 'What are your interests and hobbies outside of work?',
        type: 'textarea',
        maxLength: 200
      }
    ]
  },
  pair: {
    title: 'Pair Assessment',
    description: 'Assessment of the relationship dynamics between two individuals, focusing on collaboration, communication, and shared goals.',
    questions: [
      {
        id: 'relationshipDescription',
        header: 'Relationship Description',
        description: 'What is your relationship with the other person (e.g., colleague, partner, mentor)?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'durationAcquaintance',
        header: 'Duration of Acquaintance',
        description: 'How long have you known each other?',
        type: 'textarea',
        maxLength: 100
      },
      {
        id: 'interactionContext',
        header: 'Context of Interaction',
        description: 'In what context do you work or interact together?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'sharedGoals',
        header: 'Shared Goals',
        description: 'What goals are you aiming to achieve together?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'relationshipStrengths',
        header: 'Strengths of the Relationship',
        description: 'What do you see as the strengths in your relationship?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'relationshipChallenges',
        header: 'Challenges in the Relationship',
        description: 'What challenges or conflicts have you encountered?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'communicationStyle',
        header: 'Communication Style',
        description: 'How would you describe your communication style with this person?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'conflictResolution',
        header: 'Conflict Resolution',
        description: 'How do you handle disagreements or conflicts between you?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'trustLevel',
        header: 'Level of Trust',
        description: 'How would you rate the level of trust between you?',
        type: 'textarea',
        maxLength: 100
      },
      {
        id: 'feedbackExchange',
        header: 'Feedback Exchange',
        description: 'How comfortable are you exchanging feedback with this person?',
        type: 'textarea',
        maxLength: 200
      },
      {
        id: 'expectations',
        header: 'Expectations',
        description: 'What are your expectations from this assessment?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'pastProjects',
        header: 'Past Collaborative Projects',
        description: 'Have you worked together on projects before? If so, describe the experience.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'complementarySkills',
        header: 'Complementary Skills',
        description: 'Do you believe your skills complement each other? How so?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'decisionMaking',
        header: 'Decision-Making Process',
        description: 'How do you make decisions together?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'futurePlans',
        header: 'Future Plans',
        description: 'What are your future plans involving this person?',
        type: 'textarea',
        maxLength: 300
      }
    ]
  },
  group: {
    title: 'Group Assessment',
    description: 'Analysis of interactions within a group, focusing on group dynamics, roles, and collective goals.',
    questions: [
      {
        id: 'groupComposition',
        header: 'Group Composition',
        description: 'How many members are in the group?',
        type: 'textarea',
        maxLength: 50
      },
      {
        id: 'groupPurpose',
        header: 'Purpose of the Group',
        description: 'What is the main purpose or task of the group?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'rolesResponsibilities',
        header: 'Roles and Responsibilities',
        description: 'Please describe the roles and responsibilities of each group member.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'workingDuration',
        header: 'Duration of Working Together',
        description: 'How long has the group been working together?',
        type: 'textarea',
        maxLength: 100
      },
      {
        id: 'groupCommunication',
        header: 'Group Communication',
        description: 'How would you describe the communication style within the group?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'groupStrengths',
        header: 'Strengths of the Group',
        description: 'What are the strengths of your group?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'groupChallenges',
        header: 'Group Challenges',
        description: 'What problems or difficulties is the group facing?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'conflictResolution',
        header: 'Conflict Resolution',
        description: 'How does the group handle conflicts or disagreements?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'decisionMaking',
        header: 'Decision-Making Process',
        description: 'How are decisions made within the group?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'groupDynamics',
        header: 'Group Dynamics',
        description: 'Are there specific dynamics (positive or negative) affecting the group\'s work?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'motivationEngagement',
        header: 'Motivation and Engagement',
        description: 'How motivated and engaged are group members in achieving the goals?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'feedbackMechanisms',
        header: 'Feedback Mechanisms',
        description: 'Is there a system for providing feedback within the group?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'externalFactors',
        header: 'External Factors',
        description: 'Are there external factors impacting the group\'s effectiveness?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'assessmentExpectations',
        header: 'Expectations from the Assessment',
        description: 'What do you hope to gain from this group assessment?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'futureGoals',
        header: 'Future Goals',
        description: 'What are the group\'s short-term and long-term goals?',
        type: 'textarea',
        maxLength: 300
      }
    ]
  },
  team: {
    title: 'Team Building Assessment',
    description: 'Formation and optimization of a project team, focusing on project requirements, team roles, and success criteria.',
    questions: [
      {
        id: 'projectDescription',
        header: 'Project Description',
        description: 'Please provide a detailed description of the upcoming project.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'projectGoals',
        header: 'Project Goals and Objectives',
        description: 'What are the main goals and objectives of the project?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'requiredSkills',
        header: 'Required Skills and Expertise',
        description: 'What specific skills and expertise are needed for this project?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'projectTimeline',
        header: 'Project Timeline',
        description: 'What is the expected project schedule and key milestones?',
        type: 'textarea',
        maxLength: 100
      },
      {
        id: 'successCriteria',
        header: 'Success Criteria',
        description: 'How will the success of the project be measured?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'availableParticipants',
        header: 'Available Participants',
        description: 'List the available participants and their current roles or expertise.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'resourceConstraints',
        header: 'Resource Constraints',
        description: 'Are there any constraints (budget, time, personnel) that need to be considered?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'teamDynamics',
        header: 'Team Dynamics',
        description: 'Are there known dynamics between potential team members that should be considered?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'pastProjects',
        header: 'Past Projects',
        description: 'Have similar projects been implemented before? If yes, what were the outcomes?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'communicationPlan',
        header: 'Communication Plan',
        description: 'What is the planned communication strategy for the team?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'projectRisks',
        header: 'Risks',
        description: 'Identify potential risks that could impact the project.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'stakeholders',
        header: 'Stakeholder Involvement',
        description: 'Who are the key stakeholders, and what is their involvement?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'teamExpectations',
        header: 'Expectations from Team Members',
        description: 'What are your expectations regarding team members\' engagement and performance?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'teamCulture',
        header: 'Team Culture',
        description: 'What kind of team culture are you aiming to establish?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'additionalInfo',
        header: 'Additional Information',
        description: 'Is there any additional information that will help in forming an optimal team?',
        type: 'textarea',
        maxLength: 300
      }
    ]
  },
  startup: {
    title: 'Startup Validation Assessment',
    description: 'Assessment of the startup team and project for investors, focusing on team capabilities, project viability, and success potential.',
    questions: [
      {
        id: 'startupOverview',
        header: 'Startup Overview',
        description: 'Provide a brief description of your startup and its mission.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'foundersBackground',
        header: 'Founders\' Backgrounds',
        description: 'Describe the professional experience and expertise of the founders.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'productDescription',
        header: 'Product or Service Description',
        description: 'Describe the product or service your startup offers.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'marketAnalysis',
        header: 'Market Analysis',
        description: 'Summarize any market analysis conducted, including target market and competitors.',
        type: 'textarea',
        maxLength: 500
      },
      {
        id: 'valueProposition',
        header: 'Unique Value Proposition',
        description: 'What sets your product or service apart from competitors?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'currentStage',
        header: 'Current Stage',
        description: 'What stage of development is your startup in (idea, prototype, revenue-generating, etc.)?',
        type: 'textarea',
        maxLength: 100
      },
      {
        id: 'fundingHistory',
        header: 'Funding History',
        description: 'Have you received funding before? If yes, provide details.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'teamComposition',
        header: 'Team Composition',
        description: 'Describe your current team, including roles and expertise.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'skillGaps',
        header: 'Team Skill Gaps',
        description: 'Are there any skill gaps in your team? If so, what are they?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'businessModel',
        header: 'Business Model',
        description: 'What is your business model and revenue generation strategy?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'achievements',
        header: 'Achievements and Milestones',
        description: 'Provide information on achievements and key milestones reached.',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'currentChallenges',
        header: 'Current Challenges',
        description: 'What are the main challenges your startup is currently facing?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'fundUse',
        header: 'Use of Funds',
        description: 'How do you plan to use investment funds if received?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'exitStrategy',
        header: 'Exit Strategy',
        description: 'What is your exit strategy for investors?',
        type: 'textarea',
        maxLength: 300
      },
      {
        id: 'assessmentExpectations',
        header: 'Expectations from the Assessment',
        description: 'What do you hope to gain from this assessment?',
        type: 'textarea',
        maxLength: 300
      }
    ]
  }
};