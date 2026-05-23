import agentBus from '../lib/agent-bus';
import SessionModel from '../models/Session';

// Company interview patterns based on real interview data
const COMPANY_INTELLIGENCE_LIBRARY: Record<string, {
  rounds: string[];
  difficulty: number;
  focusAreas: string[];
  frequentTopics: string[];
  estimatedPrep: number;
  interviewPattern: string;
}> = {
  faang: {
    rounds: ['phone-screen', 'coding-round-1', 'coding-round-2', 'system-design', 'behavioral'],
    difficulty: 8.5,
    focusAreas: ['Algorithm optimization', 'System design at scale', 'Behavioral excellence'],
    frequentTopics: ['Tree/Graph algorithms', 'Dynamic programming', 'Database sharding', 'Cache invalidation'],
    estimatedPrep: 360,
    interviewPattern: 'Leetcode Hard, system design focus',
  },
  startup: {
    rounds: ['phone-screen', 'take-home', 'coding-round', 'behavioral'],
    difficulty: 6.0,
    focusAreas: ['Full stack capability', 'Rapid prototyping', 'Product thinking'],
    frequentTopics: ['Full stack implementation', 'APIs', 'Database design', 'Frontend performance'],
    estimatedPrep: 240,
    interviewPattern: 'Practical focus, some system design',
  },
  enterprise: {
    rounds: ['technical-screen', 'coding-round', 'architecture-review', 'behavioral', 'culture-fit'],
    difficulty: 6.5,
    focusAreas: ['Enterprise patterns', 'Code quality', 'Scalability'],
    frequentTopics: ['Design patterns', 'Database transactions', 'Monitoring', 'Deployment'],
    estimatedPrep: 280,
    interviewPattern: 'Code quality, patterns, scalability',
  },
  fintech: {
    rounds: ['coding-round-1', 'coding-round-2', 'system-design', 'domain-knowledge', 'behavioral'],
    difficulty: 8.0,
    focusAreas: ['Correctness critical', 'Concurrency', 'System reliability'],
    frequentTopics: ['Concurrency patterns', 'SQL optimization', 'Money handling', 'Transactions'],
    estimatedPrep: 320,
    interviewPattern: 'Hard + domain-specific + system design',
  },
  dataeng: {
    rounds: ['sql-test', 'pipeline-design', 'optimization', 'behavioral'],
    difficulty: 7.5,
    focusAreas: ['Data modeling', 'SQL fluency', 'ETL design'],
    frequentTopics: ['Window functions', 'ETL patterns', 'Data quality', 'Schema design'],
    estimatedPrep: 280,
    interviewPattern: 'Heavy SQL, pipeline architecture',
  },
};

function inferCompanyProfile(company?: string, role?: string): string {
  if (!company) return 'general';

  const companyLower = company.toLowerCase();
  const roleLower = role?.toLowerCase() || '';

  if (/google|facebook|amazon|apple|netflix|microsoft|meta/i.test(companyLower)) return 'faang';
  if (/fintech|finance|trading|payment|blockchain|crypto/i.test(companyLower)) return 'fintech';
  if (/data engineer|analytics|etl|warehouse|datalake/i.test(roleLower)) return 'dataeng';
  if (/bank|enterprise|corp|fortune|industry/i.test(companyLower)) return 'enterprise';
  if (/startup|founder|seed|series|growth/i.test(companyLower)) return 'startup';

  return 'general';
}

export async function initializeCompanyAgent() {
  agentBus.on('profile.analyzed', async (payload) => {
    try {
      agentBus.emitCognitiveEvent({
        agent: 'CompanyAgent',
        event: 'analysis.started',
        stage: 'company.analyze',
        message: 'Beginning company interview pattern analysis',
        sessionId: payload.sessionId,
        confidence: 1,
      });

      const session = await SessionModel.findById(payload.sessionId);
      if (!session) {
        agentBus.emitCognitiveEvent({
          agent: 'CompanyAgent',
          event: 'analysis.failed',
          stage: 'company.analyze',
          message: 'Session not found',
          sessionId: payload.sessionId,
          confidence: 0,
        });
        return;
      }

      // Infer company profile
      const companyProfile = inferCompanyProfile(session.company, session.role);
      const companyData = COMPANY_INTELLIGENCE_LIBRARY[companyProfile] || COMPANY_INTELLIGENCE_LIBRARY.startup;

      agentBus.emitCognitiveEvent({
        agent: 'CompanyAgent',
        event: 'profile.inferred',
        stage: 'company.analyze',
        message: `Inferred company profile: ${companyProfile}`,
        sessionId: payload.sessionId,
        confidence: 0.85,
      });

      // Analyze rounds and difficulty
      agentBus.emitCognitiveEvent({
        agent: 'CompanyAgent',
        event: 'interview.structure_analyzed',
        stage: 'company.analyze',
        message: `Identified ${companyData.rounds.length} interview rounds with difficulty ${companyData.difficulty}/10`,
        sessionId: payload.sessionId,
        confidence: 0.9,
        evidence: companyData.rounds,
      });

      // Analyze frequent topics
      agentBus.emitCognitiveEvent({
        agent: 'CompanyAgent',
        event: 'topics.identified',
        stage: 'company.analyze',
        message: `Common interview topics: ${companyData.frequentTopics.join(', ')}`,
        sessionId: payload.sessionId,
        confidence: 0.8,
        evidence: companyData.frequentTopics,
      });

      // Update session with company context
      if (!session.sharedContext) {
        session.sharedContext = { cognitiveEvents: [] };
      }

      session.sharedContext.companyContext = {
        company: session.company || 'Unknown',
        role: session.role || 'Unknown',
        rounds: companyData.rounds,
        difficulty: companyData.difficulty,
        focusAreas: companyData.focusAreas,
      };

      await session.save();

      agentBus.emitCognitiveEvent({
        agent: 'CompanyAgent',
        event: 'analysis.completed',
        stage: 'company.analyzed',
        message: 'Company analysis complete',
        sessionId: payload.sessionId,
        confidence: 0.95,
        evidence: [
          `Profile: ${companyProfile}`,
          `Rounds: ${companyData.rounds.length}`,
          `Difficulty: ${companyData.difficulty}/10`,
        ],
      });

      // Emit company analyzed event
      agentBus.emit('company.analyzed', {
        sessionId: payload.sessionId,
        focusAreas: companyData.focusAreas,
        difficulty: companyData.difficulty,
      });
    } catch (error) {
      console.error('[CompanyAgent] Error analyzing company:', error);
      agentBus.emitCognitiveEvent({
        agent: 'CompanyAgent',
        event: 'analysis.failed',
        stage: 'error',
        message: `Company analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sessionId: payload.sessionId,
        confidence: 0,
      });
    }
  });

  console.log('[CompanyAgent] Initialized and listening for profile.analyzed events');
}
