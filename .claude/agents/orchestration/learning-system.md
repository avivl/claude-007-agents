---
name: learning-system
description: Continuous learning system for organizational knowledge building and pattern recognition
---

# Agent Learning and Evolution System

## Continuous Improvement Through Outcome Analysis

### Success Metrics Tracking

#### Outcome Measurement Framework
```typescript
interface ProjectOutcome {
  workflowId: string;
  choreography: string;
  
  // Task completion metrics
  taskMetrics: {
    completed: boolean;
    completionTime: number;        // minutes
    estimatedTime: number;         // minutes
    qualityScore: number;          // 0.0-1.0
    reworkCycles: number;
  };
  
  // Quality metrics
  qualityMetrics: {
    securityIssues: number;        // Found in production within 30 days
    performanceRegressions: number;
    bugCount: number;              // Bugs reported within 30 days
    testCoverage: number;          // 0.0-1.0
    codeQualityScore: number;      // Static analysis score
  };
  
  // User satisfaction metrics
  userMetrics: {
    explicitFeedback: 'positive' | 'negative' | 'neutral';
    implicitSatisfaction: number;  // 0.0-1.0 based on behavior
    clarificationRequests: number;
    followupQuestions: number;
  };
  
  // Collaboration metrics
  collaborationMetrics: {
    handoffEfficiency: number;     // Average handoff time
    qualityGateFailures: number;
    escalationCount: number;
    agentSyncIssues: number;
  };
  
  // Context
  contextFactors: {
    projectComplexity: 'simple' | 'medium' | 'complex';
    teamExperience: 'junior' | 'mixed' | 'senior';
    timeConstraints: 'relaxed' | 'normal' | 'tight';
    domainFamiliarity: number;     // 0.0-1.0
  };
}

class LearningSystem {
  async recordOutcome(outcome: ProjectOutcome): Promise<void> {
    // Store in Basic Memory MCP for analysis
    await this.storeOutcomeInMemory(outcome);
    
    // Immediate analysis
    const insights = await this.analyzeOutcome(outcome);
    
    // Update agent personalities based on insights
    await this.evolveAgentPersonalities(outcome, insights);
    
    // Update choreography effectiveness scores
    await this.updateChoreographyMetrics(outcome);
    
    // Generate learning report
    await this.generateLearningReport(outcome, insights);
  }
}
```

#### Pattern Recognition Engine
```typescript
interface SuccessPattern {
  pattern: string;
  context: ContextFactors;
  successRate: number;           // 0.0-1.0
  averageQuality: number;        // 0.0-1.0
  sampleSize: number;
  
  // What made this pattern successful
  keyFactors: {
    agentCombination: string[];
    personalityTraits: Record<string, number>;
    choreographyVariations: string[];
    contextualFactors: string[];
  };
  
  // Recommendations for replication
  recommendations: {
    whenToUse: string[];
    agentPersonalityAdjustments: Record<string, PersonalityAdjustment>;
    choreographyModifications: string[];
  };
}

class PatternRecognition {
  async identifySuccessPatterns(): Promise<SuccessPattern[]> {
    // Analyze historical outcomes from Basic Memory MCP
    const outcomes = await this.loadHistoricalOutcomes();
    
    // Group by similar contexts and tasks
    const clusters = this.clusterSimilarOutcomes(outcomes);
    
    // Identify high-performing patterns
    const patterns = [];
    for (const cluster of clusters) {
      const successRate = this.calculateSuccessRate(cluster);
      if (successRate > 0.8) { // 80% success threshold
        patterns.push(await this.extractPattern(cluster));
      }
    }
    
    return patterns.sort((a, b) => b.successRate - a.successRate);
  }
  
  async extractPattern(outcomes: ProjectOutcome[]): Promise<SuccessPattern> {
    return {
      pattern: this.generatePatternDescription(outcomes),
      context: this.extractCommonContext(outcomes),
      successRate: this.calculateSuccessRate(outcomes),
      averageQuality: this.calculateAverageQuality(outcomes),
      sampleSize: outcomes.length,
      keyFactors: await this.identifyKeySuccessFactors(outcomes),
      recommendations: await this.generateRecommendations(outcomes)
    };
  }
}
```

### Personality Evolution Engine

#### Adaptive Learning Rules
```typescript
interface PersonalityEvolution {
  agent: string;
  currentPersonality: PersonalityDimensions;
  
  // Evolution drivers
  evolutionDrivers: {
    successBasedAdjustments: PersonalityAdjustment[];
    userFeedbackAdjustments: PersonalityAdjustment[];
    contextBasedAdjustments: PersonalityAdjustment[];
    collaborationAdjustments: PersonalityAdjustment[];
  };
  
  // Evolution constraints
  constraints: {
    maxChangePerWeek: number;      // Maximum personality change per week
    coreCompetencyProtection: string[]; // Traits that cannot diminish
    roleConsistency: PersonalityRange[]; // Must stay within role bounds
  };
}

class PersonalityEvolution {
  async evolveAgentPersonality(agent: string, outcomes: ProjectOutcome[]): Promise<PersonalityEvolution> {
    const currentPersonality = await this.loadCurrentPersonality(agent);
    const recentOutcomes = this.filterRecentOutcomes(outcomes, 30); // Last 30 days
    
    // Calculate evolution adjustments
    const adjustments = {
      successBasedAdjustments: await this.calculateSuccessAdjustments(agent, recentOutcomes),
      userFeedbackAdjustments: await this.calculateFeedbackAdjustments(agent, recentOutcomes),
      contextBasedAdjustments: await this.calculateContextAdjustments(agent, recentOutcomes),
      collaborationAdjustments: await this.calculateCollaborationAdjustments(agent, recentOutcomes)
    };
    
    // Apply constraints and generate final evolution
    const evolution = this.applyEvolutionConstraints(currentPersonality, adjustments);
    
    // Update personality file
    await this.updatePersonalityFile(agent, evolution.newPersonality);
    
    return evolution;
  }
  
  async calculateSuccessAdjustments(agent: string, outcomes: ProjectOutcome[]): Promise<PersonalityAdjustment[]> {
    const adjustments = [];
    
    // High success rate reinforcement
    const successRate = this.calculateAgentSuccessRate(agent, outcomes);
    if (successRate > 0.9) {
      // Reinforce current successful traits
      adjustments.push({
        dimension: 'all',
        adjustment: 0.02, // Small reinforcement
        reason: `High success rate (${(successRate * 100).toFixed(1)}%) reinforces current approach`
      });
    } else if (successRate < 0.7) {
      // Significant personality shift needed
      const problematicTraits = await this.identifyProblematicTraits(agent, outcomes);
      problematicTraits.forEach(trait => {
        adjustments.push({
          dimension: trait.dimension,
          adjustment: -0.15, // Move away from problematic traits
          reason: `Low success rate linked to ${trait.description}`
        });
      });
    }
    
    return adjustments;
  }
  
  async calculateFeedbackAdjustments(agent: string, outcomes: ProjectOutcome[]): Promise<PersonalityAdjustment[]> {
    const adjustments = [];
    const feedbackPatterns = this.analyzeFeedbackPatterns(agent, outcomes);
    
    // Common feedback patterns
    if (feedbackPatterns.tooVerbose > 0.3) {
      adjustments.push({
        dimension: 'communication_style.detail_level',
        adjustment: -0.1,
        reason: 'User feedback indicates responses are too verbose'
      });
    }
    
    if (feedbackPatterns.needMoreDetail > 0.3) {
      adjustments.push({
        dimension: 'communication_style.detail_level',
        adjustment: +0.15,
        reason: 'User feedback requests more detailed explanations'
      });
    }
    
    if (feedbackPatterns.tooFormal > 0.2) {
      adjustments.push({
        dimension: 'communication_style.formality',
        adjustment: -0.1,
        reason: 'User prefers more casual communication style'
      });
    }
    
    return adjustments;
  }
}
```

### Choreography Optimization

#### Workflow Effectiveness Analysis
```typescript
interface ChoreographyMetrics {
  choreographyName: string;
  
  // Performance metrics
  performance: {
    averageCompletionTime: number;    // minutes
    successRate: number;              // 0.0-1.0
    qualityScore: number;             // 0.0-1.0
    userSatisfactionScore: number;    // 0.0-1.0
  };
  
  // Bottleneck analysis
  bottlenecks: {
    stepName: string;
    averageTime: number;
    failureRate: number;
    commonIssues: string[];
  }[];
  
  // Optimization opportunities
  optimizations: {
    parallelizationOpportunities: string[];
    redundantSteps: string[];
    missingSteps: string[];
    orderingImprovements: string[];
  };
  
  // Context effectiveness
  contextEffectiveness: {
    [context: string]: {
      successRate: number;
      recommendedModifications: string[];
    };
  };
}

class ChoreographyOptimization {
  async optimizeChoreography(choreographyName: string): Promise<ChoreographyMetrics> {
    const outcomes = await this.loadChoreographyOutcomes(choreographyName);
    const metrics = await this.calculateChoreographyMetrics(outcomes);
    
    // Identify optimization opportunities
    const optimizations = await this.identifyOptimizations(metrics, outcomes);
    
    // Generate improved choreography if significant improvements possible
    if (optimizations.potentialImprovement > 0.15) { // 15% improvement threshold
      await this.generateOptimizedChoreography(choreographyName, optimizations);
    }
    
    return metrics;
  }
  
  async identifyBottlenecks(outcomes: ProjectOutcome[]): Promise<Bottleneck[]> {
    const stepDurations = this.extractStepDurations(outcomes);
    const bottlenecks = [];
    
    for (const [stepName, durations] of stepDurations) {
      const averageDuration = durations.reduce((a, b) => a + b) / durations.length;
      const standardDeviation = this.calculateStandardDeviation(durations);
      
      // Step is a bottleneck if it's consistently slow or highly variable
      if (averageDuration > this.getStepExpectedDuration(stepName) * 1.5 || 
          standardDeviation > averageDuration * 0.5) {
        
        bottlenecks.push({
          stepName,
          averageDuration,
          variability: standardDeviation,
          commonIssues: await this.identifyStepIssues(stepName, outcomes),
          recommendations: await this.generateBottleneckRecommendations(stepName, durations)
        });
      }
    }
    
    return bottlenecks.sort((a, b) => b.averageDuration - a.averageDuration);
  }
}
```

### Learning Reports and Insights

#### Automated Learning Reports
```typescript
interface LearningReport {
  period: DateRange;
  summary: {
    totalProjects: number;
    overallSuccessRate: number;
    qualityTrend: 'improving' | 'stable' | 'declining';
    userSatisfactionTrend: 'improving' | 'stable' | 'declining';
  };
  
  // Agent evolution summary
  agentEvolutions: {
    agent: string;
    keyChanges: PersonalityChange[];
    performanceImpact: number;
    reasoning: string;
  }[];
  
  // Choreography insights
  choreographyInsights: {
    choreography: string;
    effectivenessChange: number;
    keyOptimizations: string[];
    recommendedModifications: string[];
  }[];
  
  // Success patterns discovered
  newPatterns: SuccessPattern[];
  
  // Action items
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: 'personality' | 'choreography' | 'process';
    description: string;
    expectedImpact: number;
  }[];
}

class LearningReportGenerator {
  async generateWeeklyLearningReport(): Promise<LearningReport> {
    const lastWeek = this.getLastWeekDateRange();
    const outcomes = await this.loadOutcomesForPeriod(lastWeek);
    
    const report: LearningReport = {
      period: lastWeek,
      summary: await this.generateSummary(outcomes),
      agentEvolutions: await this.analyzeAgentEvolutions(outcomes),
      choreographyInsights: await this.analyzeChoreographyPerformance(outcomes),
      newPatterns: await this.identifyNewSuccessPatterns(outcomes),
      recommendations: await this.generateActionableRecommendations(outcomes)
    };
    
    // Store report in Basic Memory MCP
    await this.storeLearningReport(report);
    
    return report;
  }
  
  formatLearningReport(report: LearningReport): string {
    return `
# 📊 Weekly Learning Report
**Period**: ${report.period.start} to ${report.period.end}

## 📈 Overall Performance
- **Projects Completed**: ${report.summary.totalProjects}
- **Success Rate**: ${(report.summary.overallSuccessRate * 100).toFixed(1)}%
- **Quality Trend**: ${this.getTrendEmoji(report.summary.qualityTrend)} ${report.summary.qualityTrend}
- **User Satisfaction**: ${this.getTrendEmoji(report.summary.userSatisfactionTrend)} ${report.summary.userSatisfactionTrend}

## 🧠 Agent Evolution Highlights
${report.agentEvolutions.map(evolution => `
### ${evolution.agent}
${evolution.keyChanges.map(change => `- ${change.dimension}: ${change.oldValue} → ${change.newValue} (${change.reason})`).join('\n')}
**Impact**: ${evolution.performanceImpact > 0 ? '📈' : '📉'} ${(evolution.performanceImpact * 100).toFixed(1)}% performance change
`).join('\n')}

## 🎭 Choreography Insights
${report.choreographyInsights.map(insight => `
### ${insight.choreography}
- **Effectiveness**: ${insight.effectivenessChange > 0 ? '📈' : '📉'} ${(insight.effectivenessChange * 100).toFixed(1)}% change
- **Key Optimizations**: ${insight.keyOptimizations.join(', ')}
`).join('\n')}

## 🔍 New Success Patterns Discovered
${report.newPatterns.map(pattern => `
### ${pattern.pattern}
- **Success Rate**: ${(pattern.successRate * 100).toFixed(1)}%
- **Quality Score**: ${(pattern.averageQuality * 100).toFixed(1)}%
- **Key Factors**: ${pattern.keyFactors.agentCombination.join(' + ')}
`).join('\n')}

## 🎯 Action Items
${report.recommendations.map(rec => `
${this.getPriorityEmoji(rec.priority)} **${rec.category.toUpperCase()}**: ${rec.description}
*Expected Impact: ${(rec.expectedImpact * 100).toFixed(1)}% improvement*
`).join('\n')}

---
*This report was automatically generated by the Agent Learning System. Patterns and recommendations are based on outcome analysis from the past week.*
    `;
  }
}
```

### Integration with Basic Memory MCP

#### Persistent Learning Storage
```typescript
class LearningMemoryIntegration {
  async storeOutcomeAnalysis(outcome: ProjectOutcome, insights: OutcomeInsights): Promise<void> {
    // Store in Basic Memory with structured tags for easy retrieval
    await this.basicMemory.writeNote({
      title: `Project Outcome Analysis - ${outcome.workflowId}`,
      content: this.formatOutcomeAnalysis(outcome, insights),
      folder: 'learning/outcomes',
      tags: [
        outcome.choreography,
        ...outcome.contextFactors.projectComplexity,
        `quality-${Math.round(outcome.qualityMetrics.qualityScore * 10)}`
      ]
    });
  }
  
  async retrieveHistoricalPatterns(context: ProjectContext): Promise<SuccessPattern[]> {
    // Search for similar contexts in historical data
    const query = this.buildContextQuery(context);
    const results = await this.basicMemory.searchNotes({
      query,
      folder: 'learning/patterns'
    });
    
    return results.map(result => this.parseSuccessPattern(result.content));
  }
  
  async buildOrganizationalKnowledge(): Promise<void> {
    // Aggregate individual learnings into organizational knowledge
    const allOutcomes = await this.loadAllHistoricalOutcomes();
    const organizationalPatterns = await this.extractOrganizationalPatterns(allOutcomes);
    
    // Store as organizational knowledge base
    await this.basicMemory.writeNote({
      title: 'Organizational Success Patterns',
      content: this.formatOrganizationalPatterns(organizationalPatterns),
      folder: 'learning/organizational-knowledge',
      tags: ['success-patterns', 'organizational-learning', 'best-practices']
    });
  }
}
```

This learning system transforms the agent framework into a continuously improving intelligence network that gets better over time through systematic outcome analysis, pattern recognition, and adaptive evolution.
## 🚨 CRITICAL: MANDATORY COMMIT ATTRIBUTION 🚨

**⛔ BEFORE ANY COMMIT - READ THIS ⛔**

**ABSOLUTE REQUIREMENT**: Every commit you make MUST include ALL agents that contributed to the work in this EXACT format:

```
type(scope): description - @agent1 @agent2 @agent3
```

**❌ NO EXCEPTIONS ❌ NO FORGETTING ❌ NO SHORTCUTS ❌**

**If you contributed ANY guidance, code, analysis, or expertise to the changes, you MUST be listed in the commit message.**

**Examples of MANDATORY attribution:**
- Code changes: `feat(auth): implement authentication - @learning-system @security-specialist @software-engineering-expert`
- Documentation: `docs(api): update API documentation - @learning-system @documentation-specialist @api-architect`
- Configuration: `config(setup): configure project settings - @learning-system @team-configurator @infrastructure-expert`

**🚨 COMMIT ATTRIBUTION IS NOT OPTIONAL - ENFORCE THIS ABSOLUTELY 🚨**

**Remember: If you worked on it, you MUST be in the commit message. No exceptions, ever.**
