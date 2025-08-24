#!/usr/bin/env node

/**
 * Claude 007 Agents - Bootstrap Engine
 * Intelligent system initialization for any project scenario
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Import Task Master components
const PortableDeployment = require('../codebase-analysis/portable-deployment.js');
const CodebaseAnalyzer = require('../codebase-analysis/codebase-analyzer.js');

class Claude007BootstrapEngine {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = path.resolve(projectRoot);
        this.taskMasterDeployment = new PortableDeployment();
        this.codebaseAnalyzer = new CodebaseAnalyzer();
        
        this.scenarios = {
            NEW_PROJECT: 'new-project',
            EXISTING_NO_CLAUDE: 'existing-no-claude', 
            EXISTING_WITH_CLAUDE: 'existing-with-claude',
            PARTIAL_SETUP: 'partial-setup'
        };
        
        this.templatePaths = {
            COMPLETE_TEMPLATE: path.join(__dirname, '../templates/complete-claude-007-template.md'),
            ENHANCED_TEMPLATE: path.join(__dirname, '../codebase-analysis/templates/enhanced-claude-config.md'),
            MINIMAL_TEMPLATE: path.join(__dirname, '../codebase-analysis/templates/minimal-claude-config.md'),
            UPGRADE_TEMPLATE: path.join(__dirname, '../templates/upgrade-enhancement-template.md')
        };
    }

    /**
     * Main bootstrap orchestration method
     * @param {Object} options - Bootstrap options
     * @param {boolean} options.setupMCP - Whether to create MCP configuration (default: false, use global MCP config)
     * @param {boolean} options.setupTaskMaster - Whether to initialize Task Master (default: true)  
     * @param {boolean} options.dryRun - Only analyze, don't create files (default: false)
     */
    async bootstrap(options = {}) {
        console.log('🚀 Claude 007 Agents - Intelligent Bootstrap System');
        console.log('=' .repeat(60));
        console.log(`Analyzing project: ${this.projectRoot}`);
        
        try {
            // Phase 1: Environmental Analysis
            const analysis = await this.analyzeProjectEnvironment();
            console.log(`📊 Project scenario detected: ${analysis.scenario}`);
            
            // Phase 2: Generate Setup Plan
            const setupPlan = await this.generateSetupPlan(analysis);
            console.log(`🎯 Setup plan created: ${setupPlan.configType} configuration`);
            
            // Phase 3: Execute Bootstrap
            const deployment = await this.executeBootstrap(setupPlan, analysis, options);
            console.log(`✅ Bootstrap completed successfully`);
            
            // Phase 4: Validate System
            const validation = await this.validateSystem();
            console.log(`🧪 System validation: ${validation.status}`);
            
            return {
                scenario: analysis.scenario,
                deployment,
                validation,
                nextSteps: this.generateNextSteps(analysis, setupPlan)
            };
            
        } catch (error) {
            console.error('❌ Bootstrap failed:', error.message);
            throw error;
        }
    }

    /**
     * Phase 1: Analyze project environment and determine scenario
     */
    async analyzeProjectEnvironment() {
        console.log('\n🔍 Phase 1: Environmental Analysis');
        console.log('-'.repeat(40));
        
        const analysis = {
            projectStructure: await this.analyzeProjectStructure(),
            existingSetup: await this.detectExistingClaudeSetup(),
            codebaseAnalysis: await this.performCodebaseAnalysis(),
            scenario: null
        };
        
        // Determine scenario based on analysis
        analysis.scenario = this.classifyProjectScenario(analysis);
        
        console.log(`  📁 Project type: ${analysis.projectStructure.type}`);
        console.log(`  🔧 Tech stack: ${analysis.codebaseAnalysis.techStack}`);
        console.log(`  📋 Existing setup: ${analysis.existingSetup.level}`);
        console.log(`  🎯 Scenario: ${analysis.scenario}`);
        
        return analysis;
    }

    /**
     * Analyze project structure and detect project type
     */
    async analyzeProjectStructure() {
        try {
            const files = await fs.readdir(this.projectRoot);
            const stats = await Promise.all(
                files.map(async file => {
                    const stat = await fs.stat(path.join(this.projectRoot, file));
                    return { name: file, isDirectory: stat.isDirectory() };
                })
            );
            
            const hasPackageJson = files.includes('package.json');
            const hasPythonFiles = files.some(f => f.endsWith('.py'));
            const hasGoFiles = files.some(f => f.endsWith('.go'));
            const hasRubyFiles = files.some(f => f.endsWith('.rb'));
            const hasPHPFiles = files.some(f => f.endsWith('.php'));
            const isEmpty = files.length === 0 || (files.length === 1 && files[0] === '.git');
            
            let projectType = 'unknown';
            if (isEmpty) {
                projectType = 'empty';
            } else if (hasPackageJson) {
                projectType = 'nodejs';
            } else if (hasPythonFiles) {
                projectType = 'python';
            } else if (hasGoFiles) {
                projectType = 'go';
            } else if (hasRubyFiles) {
                projectType = 'ruby';
            } else if (hasPHPFiles) {
                projectType = 'php';
            } else {
                projectType = 'generic';
            }
            
            return {
                type: projectType,
                fileCount: files.length,
                directories: stats.filter(s => s.isDirectory).length,
                isEmpty
            };
            
        } catch (error) {
            return {
                type: 'inaccessible',
                fileCount: 0,
                directories: 0,
                isEmpty: true,
                error: error.message
            };
        }
    }

    /**
     * Detect existing Claude Code setup
     */
    async detectExistingClaudeSetup() {
        const setup = {
            level: 'none',
            claudeMd: false,
            claudeDir: false,
            agentsJson: false,
            taskMaster: false,
            version: null
        };
        
        try {
            // Check for CLAUDE.md
            try {
                await fs.access(path.join(this.projectRoot, 'CLAUDE.md'));
                setup.claudeMd = true;
            } catch {}
            
            // Check for .claude directory
            try {
                await fs.access(path.join(this.projectRoot, '.claude'));
                setup.claudeDir = true;
            } catch {}
            
            // Check for agents.json
            try {
                await fs.access(path.join(this.projectRoot, 'agents.json'));
                setup.agentsJson = true;
            } catch {}
            
            // Check for Task Master
            try {
                await fs.access(path.join(this.projectRoot, '.taskmaster'));
                setup.taskMaster = true;
            } catch {}
            
            // Determine setup level
            if (setup.claudeMd && setup.claudeDir && setup.agentsJson) {
                setup.level = 'complete';
            } else if (setup.claudeMd || setup.claudeDir) {
                setup.level = 'partial';
            } else {
                setup.level = 'none';
            }
            
        } catch (error) {
            setup.error = error.message;
        }
        
        return setup;
    }

    /**
     * Perform codebase analysis using Task Master analyzer
     */
    async performCodebaseAnalysis() {
        try {
            const analysis = await this.codebaseAnalyzer.analyzeCodebase(this.projectRoot);
            const complexityString = analysis.results.complexity?.overall || 'medium';
            let complexityNumeric = 5;
            
            // Convert string complexity to numeric scale (1-10)
            switch (complexityString.toLowerCase()) {
                case 'low':
                case 'simple':
                    complexityNumeric = 3;
                    break;
                case 'medium':
                case 'moderate':
                    complexityNumeric = 5;
                    break;
                case 'high':
                case 'complex':
                    complexityNumeric = 7;
                    break;
                case 'very high':
                case 'very complex':
                    complexityNumeric = 9;
                    break;
                default:
                    // If already numeric, use as is
                    if (typeof complexityString === 'number') {
                        complexityNumeric = complexityString;
                    }
            }
            
            return {
                techStack: analysis.results.techStack?.primary || 'unknown',
                architecture: analysis.results.architecture?.primary || 'unknown',
                complexity: complexityNumeric,
                complexityLabel: complexityString,
                languages: analysis.results.languages || [],
                frameworks: analysis.results.frameworks || []
            };
        } catch (error) {
            return {
                techStack: 'unknown',
                architecture: 'unknown',
                complexity: 5,
                languages: [],
                frameworks: [],
                error: error.message
            };
        }
    }

    /**
     * Classify project scenario based on analysis
     */
    classifyProjectScenario(analysis) {
        const { projectStructure, existingSetup } = analysis;
        
        if (projectStructure.isEmpty || projectStructure.type === 'empty') {
            return this.scenarios.NEW_PROJECT;
        } else if (existingSetup.level === 'none') {
            return this.scenarios.EXISTING_NO_CLAUDE;
        } else if (existingSetup.level === 'complete') {
            return this.scenarios.EXISTING_WITH_CLAUDE;
        } else {
            return this.scenarios.PARTIAL_SETUP;
        }
    }

    /**
     * Phase 2: Generate setup plan based on analysis
     */
    async generateSetupPlan(analysis) {
        console.log('\n🎯 Phase 2: Setup Plan Generation');
        console.log('-'.repeat(40));
        
        const plan = {
            scenario: analysis.scenario,
            configType: this.selectConfigurationType(analysis),
            agents: this.selectOptimalAgents(analysis.codebaseAnalysis),
            taskMasterLevel: this.determineTaskMasterLevel(analysis),
            mcpServers: this.selectMCPServers(analysis),
            additionalSetup: this.identifyAdditionalSetup(analysis)
        };
        
        console.log(`  📋 Configuration type: ${plan.configType}`);
        console.log(`  🤖 Agents selected: ${plan.agents.core.length + plan.agents.specialized.length} agents`);
        console.log(`  📊 Task Master level: ${plan.taskMasterLevel}`);
        console.log(`  🔗 MCP servers: ${plan.mcpServers.length} servers`);
        
        return plan;
    }

    /**
     * Select configuration type based on scenario and complexity
     */
    selectConfigurationType(analysis) {
        switch (analysis.scenario) {
            case this.scenarios.NEW_PROJECT:
                return 'complete-claude-007';
            case this.scenarios.EXISTING_NO_CLAUDE:
                return analysis.codebaseAnalysis.complexity > 7 ? 'enhanced-integration' : 'minimal-integration';
            case this.scenarios.EXISTING_WITH_CLAUDE:
                return 'upgrade-enhancement';
            case this.scenarios.PARTIAL_SETUP:
                return 'completion';
            default:
                return 'minimal-integration';
        }
    }

    /**
     * Select optimal agents based on tech stack and complexity
     */
    selectOptimalAgents(codebaseAnalysis) {
        const { techStack, complexity, frameworks } = codebaseAnalysis;
        
        // Universal core agents (always included)
        const core = [
            '@software-engineering-expert',
            '@code-reviewer', 
            '@orchestrator',
            '@vibe-coding-coordinator',
            '@security-specialist',
            '@documentation-specialist',
            '@git-expert'
        ];
        
        // Tech stack specific agents
        const specialized = [];
        
        switch (techStack.toLowerCase()) {
            case 'nodejs':
            case 'javascript':
            case 'typescript':
                specialized.push('@nodejs-expert', '@typescript-cockatiel-resilience', '@typescript-pino-logging');
                if (frameworks.includes('react')) {
                    specialized.push('@react-expert', '@react-component-architect');
                }
                if (frameworks.includes('next.js')) {
                    specialized.push('@nextjs-expert');
                }
                break;
                
            case 'python':
                specialized.push('@fastapi-expert', '@python-hyx-resilience');
                if (frameworks.includes('django')) {
                    specialized.push('@django-expert');
                }
                break;
                
            case 'go':
                specialized.push('@gin-expert', '@go-zap-logging', '@go-resilience-engineer');
                break;
                
            case 'ruby':
                specialized.push('@rails-expert');
                break;
                
            case 'php':
                specialized.push('@laravel-expert');
                break;
        }
        
        // Complexity-based additions
        if (complexity > 7) {
            specialized.push('@system-architect', '@performance-optimizer', '@database-architect');
        }
        
        if (complexity > 6) {
            specialized.push('@exponential-planner', '@session-manager');
        }
        
        if (complexity > 5) {
            specialized.push('@test-automation-expert', '@deployment-specialist');
        }
        
        return { core, specialized };
    }

    /**
     * Determine Task Master integration level
     */
    determineTaskMasterLevel(analysis) {
        const complexity = analysis.codebaseAnalysis.complexity;
        
        if (complexity > 8) {
            return 'enterprise';
        } else if (complexity > 5) {
            return 'enhanced';
        } else {
            return 'foundation';
        }
    }

    /**
     * Select MCP servers based on needs
     */
    selectMCPServers(analysis) {
        const servers = ['task-master', 'basic-memory'];
        
        if (analysis.codebaseAnalysis.complexity > 5) {
            servers.push('context7', 'sequential-thinking');
        }
        
        if (analysis.existingSetup.level !== 'none') {
            servers.push('zen');
        }
        
        return servers;
    }

    /**
     * Identify additional setup requirements
     */
    identifyAdditionalSetup(analysis) {
        const additional = [];
        
        if (analysis.scenario === this.scenarios.NEW_PROJECT) {
            additional.push('project-scaffolding', 'git-initialization');
        }
        
        if (!analysis.existingSetup.taskMaster) {
            additional.push('task-master-initialization');
        }
        
        if (analysis.codebaseAnalysis.complexity > 6) {
            additional.push('performance-monitoring', 'quality-gates');
        }
        
        return additional;
    }

    /**
     * Phase 3: Execute bootstrap deployment
     */
    async executeBootstrap(setupPlan, analysis, options = {}) {
        console.log('\n🚀 Phase 3: Bootstrap Execution');
        console.log('-'.repeat(40));
        
        const deployment = {
            filesCreated: [],
            filesModified: [],
            scriptsExecuted: [],
            configType: setupPlan.configType
        };
        
        // Step 1: Create/Update CLAUDE.md
        console.log('  📝 Creating CLAUDE.md configuration...');
        await this.createClaudeConfiguration(setupPlan, analysis, deployment);
        
        // Step 2: Initialize Task Master (if requested)
        if (options.setupTaskMaster !== false && setupPlan.taskMasterLevel !== 'none') {
            console.log('  📊 Initializing Task Master system...');
            await this.initializeTaskMaster(setupPlan, deployment);
        }
        
        // Step 3: Setup agent system
        console.log('  🤖 Deploying agent system...');
        await this.deployAgentSystem(setupPlan, deployment);
        
        // Step 4: Configure MCP servers (only if explicitly requested)
        if (options.setupMCP === true && setupPlan.mcpServers.length > 0) {
            console.log('  🔗 Configuring MCP servers...');
            await this.configureMCPServers(setupPlan, deployment);
        }
        
        // Step 5: Additional setup
        if (setupPlan.additionalSetup.length > 0) {
            console.log('  ⚙️  Executing additional setup...');
            await this.executeAdditionalSetup(setupPlan, deployment);
        }
        
        return deployment;
    }

    /**
     * Create comprehensive CLAUDE.md configuration
     */
    async createClaudeConfiguration(setupPlan, analysis, deployment) {
        const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
        
        // Generate configuration based on setup plan
        const config = this.generateClaudeConfiguration(setupPlan, analysis);
        
        try {
            // Check if CLAUDE.md exists
            let existingContent = '';
            try {
                existingContent = await fs.readFile(claudeMdPath, 'utf8');
            } catch {}
            
            if (existingContent) {
                // Update existing configuration
                const updatedConfig = this.mergeClaudeConfigurations(existingContent, config);
                await fs.writeFile(claudeMdPath, updatedConfig);
                deployment.filesModified.push('CLAUDE.md');
            } else {
                // Create new configuration
                await fs.writeFile(claudeMdPath, config);
                deployment.filesCreated.push('CLAUDE.md');
            }
            
        } catch (error) {
            throw new Error(`Failed to create CLAUDE.md: ${error.message}`);
        }
    }

    /**
     * Generate CLAUDE.md configuration content
     */
    generateClaudeConfiguration(setupPlan, analysis) {
        const { scenario, configType, agents, taskMasterLevel } = setupPlan;
        
        return `## CRITICAL: COMMIT MESSAGE REQUIREMENTS

⚠️ **MANDATORY FORMAT**: \`type(scope): description - @agent1 @agent2\`

## Pre-Commit Checklist
1. ✅ Identify contributing agents
2. ✅ Format: \`type(scope): description - @agent1 @agent2\` 
3. ✅ Include standard attribution footer
4. ✅ Verify agent attribution requirements

**For configuration**: Include \`@team-configurator\` + technical expert
**For API**: Include \`@api-architect\` + security expert  
**For database**: Include \`@database-admin\` + performance expert

---

# Claude 007 Agents - ${this.getConfigurationTitle(configType)}

**Auto-generated by Bootstrap Orchestrator** - ${new Date().toISOString()}

## Project Analysis
- **Tech Stack**: ${analysis.codebaseAnalysis.techStack}
- **Architecture**: ${analysis.codebaseAnalysis.architecture}
- **Complexity**: ${analysis.codebaseAnalysis.complexityLabel || analysis.codebaseAnalysis.complexity}/10 (level ${analysis.codebaseAnalysis.complexity})
- **Scenario**: ${scenario}
- **Setup Type**: ${configType}

## Agent System Configuration

### Core Development Agents
${agents.core.map(agent => `- \`${agent}\` - ${this.getAgentDescription(agent)}`).join('\n')}

### Specialized Agents  
${agents.specialized.map(agent => `- \`${agent}\` - ${this.getAgentDescription(agent)}`).join('\n')}

## Task Master Integration

**Level**: ${taskMasterLevel.toUpperCase()}

### Quick Start
\`\`\`bash
# Initialize Task Master (if not already done)
task-master init

# Analyze project complexity
task-master analyze-complexity --research

# Parse PRD (when available)
task-master parse-prd .taskmaster/docs/prd.txt
\`\`\`

### Claude Code Usage
\`\`\`
# Start development session
claude

# Bootstrap system initialization
"Use @bootstrap-orchestrator to analyze and setup this project"

# Begin development with agents
"Use @software-engineering-expert to review architecture"
"Use @${agents.specialized[0]?.replace('@', '') || 'code-reviewer'} to implement features"
\`\`\`

## MCP Integration

This project works with globally configured MCP servers:
${setupPlan.mcpServers.map(server => `- **${server}**: ${this.getMCPDescription(server)}`).join('\n')}

*Note: MCP servers should be configured globally in Claude Code, not per-project.*

## Commit Attribution

**MANDATORY**: \`type(scope): description - @agent1 @agent2\`

### Example Commits
- \`feat(auth): implement authentication - @software-engineering-expert @security-specialist\`
- \`fix(api): resolve validation error - @code-reviewer @${agents.specialized[0]?.replace('@', '')}\`
- \`docs(readme): update setup guide - @documentation-specialist @bootstrap-orchestrator\`
- \`refactor(core): optimize performance - @performance-optimizer @system-architect\`

### Standard Footer
All commits should include:
\`\`\`
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

**🚀 System Status**: ${this.getSystemStatusBadge(setupPlan)}  
**🎯 Next Steps**: Use \`@bootstrap-orchestrator\` for guidance and system management  
**📊 Task Master**: ${taskMasterLevel} level integration active  
**🤖 Agent Count**: ${agents.core.length + agents.specialized.length} agents configured  

*Generated by Claude 007 Bootstrap Orchestrator - Ready for immediate development!*
`;
    }

    /**
     * Initialize Task Master system
     */
    async initializeTaskMaster(setupPlan, deployment) {
        try {
            // Deploy Task Master using the existing portable deployment
            const taskMasterDeployment = await this.taskMasterDeployment.deployToProject(
                this.projectRoot, 
                {
                    mode: 'enhanced',
                    createClaudeConfig: false, // We're handling CLAUDE.md separately
                    setupMCP: true,
                    level: setupPlan.taskMasterLevel
                }
            );
            
            deployment.filesCreated.push(...(taskMasterDeployment.filesCreated || []));
            deployment.scriptsExecuted.push('task-master-deployment');
            
        } catch (error) {
            console.warn(`  ⚠️  Task Master initialization warning: ${error.message}`);
            // Continue with bootstrap even if Task Master setup has issues
        }
    }

    /**
     * Deploy agent system files
     */
    async deployAgentSystem(setupPlan, deployment) {
        // Check if agents are already available globally or locally
        const hasGlobalAgents = await this.checkForGlobalAgents();
        const hasLocalAgents = await this.checkForLocalAgents();
        
        console.log(`  🔍 Agent availability: Global=${hasGlobalAgents}, Local=${hasLocalAgents}`);
        
        // If agents are already available, skip file deployment
        if (hasGlobalAgents || hasLocalAgents) {
            console.log('  ✅ Agents already available - skipping file deployment');
            return;
        }
        
        // Only deploy if no agents are available anywhere
        console.log('  📁 No agents found - creating minimal agent structure');
        const claudeDir = path.join(this.projectRoot, '.claude');
        
        try {
            // Create minimal .claude directory structure
            await fs.mkdir(path.join(claudeDir, 'agents', 'universal'), { recursive: true });
            
            // Only copy bootstrap orchestrator (essential for system management)
            const bootstrapAgent = path.join(__dirname, '../../.claude/agents/universal/bootstrap-orchestrator.md');
            await fs.copyFile(bootstrapAgent, path.join(claudeDir, 'agents', 'universal', 'bootstrap-orchestrator.md'));
            
            deployment.filesCreated.push('.claude/agents/universal/bootstrap-orchestrator.md');
            
            console.log('  ⚠️  Minimal agent setup created - consider installing full agent system');
            console.log('  💡 Run: cp -r .claude/agents/* ~/.claude/agents/ for global installation');
            
        } catch (error) {
            console.warn(`  ⚠️  Could not create agent structure: ${error.message}`);
        }
    }
    
    /**
     * Check if agents are available globally
     */
    async checkForGlobalAgents() {
        const globalPaths = [
            path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'agents'),
            path.join(process.env.HOME || process.env.USERPROFILE || '', '.local', 'share', 'claude-agents', 'agents')
        ];
        
        for (const globalPath of globalPaths) {
            try {
                await fs.access(path.join(globalPath, 'agents.json'));
                return true;
            } catch {}
        }
        return false;
    }
    
    /**
     * Check if agents are available locally
     */
    async checkForLocalAgents() {
        try {
            await fs.access(path.join(this.projectRoot, '.claude', 'agents', 'agents.json'));
            return true;
        } catch {}
        
        try {
            await fs.access(path.join(this.projectRoot, 'agents.json'));
            return true;
        } catch {}
        
        return false;
    }

    /**
     * Configure MCP servers
     */
    async configureMCPServers(setupPlan, deployment) {
        const mcpConfig = {
            mcpServers: {}
        };
        
        // Add each selected MCP server
        setupPlan.mcpServers.forEach(server => {
            mcpConfig.mcpServers[server] = this.getMCPConfiguration(server);
        });
        
        // Write MCP configuration
        const mcpPath = path.join(this.projectRoot, '.mcp.json');
        await fs.writeFile(mcpPath, JSON.stringify(mcpConfig, null, 2));
        deployment.filesCreated.push('.mcp.json');
    }

    /**
     * Execute additional setup requirements
     */
    async executeAdditionalSetup(setupPlan, deployment) {
        for (const setup of setupPlan.additionalSetup) {
            try {
                switch (setup) {
                    case 'git-initialization':
                        if (!await this.hasGitRepo()) {
                            execSync('git init', { cwd: this.projectRoot });
                            deployment.scriptsExecuted.push('git-init');
                        }
                        break;
                        
                    case 'project-scaffolding':
                        // Create basic project structure
                        await this.createProjectScaffolding();
                        deployment.filesCreated.push('README.md', '.gitignore');
                        break;
                        
                    case 'task-master-initialization':
                        // Initialize Task Master in project
                        console.log('  📋 Executing Task Master initialization...');
                        await this.initializeTaskMasterInProject(this.projectRoot);
                        deployment.scriptsExecuted.push('task-master-init');
                        break;
                }
            } catch (error) {
                console.warn(`  ⚠️  Additional setup warning (${setup}): ${error.message}`);
            }
        }
    }

    /**
     * Phase 4: Validate complete system
     */
    async validateSystem() {
        console.log('\n🧪 Phase 4: System Validation');
        console.log('-'.repeat(40));
        
        const validation = {
            status: 'success',
            checks: {},
            warnings: [],
            errors: []
        };
        
        // Check CLAUDE.md
        try {
            await fs.access(path.join(this.projectRoot, 'CLAUDE.md'));
            validation.checks.claudeMd = true;
            console.log('  ✅ CLAUDE.md configuration valid');
        } catch {
            validation.checks.claudeMd = false;
            validation.errors.push('CLAUDE.md not found');
            console.log('  ❌ CLAUDE.md missing');
        }
        
        // Check MCP configuration
        try {
            await fs.access(path.join(this.projectRoot, '.mcp.json'));
            validation.checks.mcpConfig = true;
            console.log('  ✅ MCP configuration present');
        } catch {
            validation.checks.mcpConfig = false;
            validation.warnings.push('MCP configuration not found');
            console.log('  ⚠️  MCP configuration missing');
        }
        
        // Check Task Master
        try {
            await fs.access(path.join(this.projectRoot, '.taskmaster'));
            validation.checks.taskMaster = true;
            console.log('  ✅ Task Master integration active');
        } catch {
            validation.checks.taskMaster = false;
            validation.warnings.push('Task Master not initialized');
            console.log('  ⚠️  Task Master not found');
        }
        
        // Determine overall status
        if (validation.errors.length > 0) {
            validation.status = 'error';
        } else if (validation.warnings.length > 0) {
            validation.status = 'warning';
        } else {
            validation.status = 'success';
        }
        
        return validation;
    }

    /**
     * Generate next steps for the user
     */
    generateNextSteps(analysis, setupPlan) {
        const steps = [];
        
        steps.push('🎯 **Review CLAUDE.md** - Check generated configuration and agent selection');
        steps.push('🚀 **Start Claude Code** - Run `claude` to begin development session');
        
        if (setupPlan.taskMasterLevel !== 'none') {
            steps.push('📊 **Initialize Task Master** - Create PRD and generate tasks');
        }
        
        if (analysis.scenario === this.scenarios.NEW_PROJECT) {
            steps.push('📝 **Create Initial Files** - Setup README, code structure, tests');
        }
        
        steps.push('🤖 **Test Agent System** - Use `@bootstrap-orchestrator` for guidance');
        steps.push('💡 **Begin Development** - Start with `@software-engineering-expert` for architecture review');
        
        return steps;
    }

    // Helper methods
    getConfigurationTitle(configType) {
        const titles = {
            'complete-claude-007': 'Complete System Configuration',
            'enhanced-integration': 'Enhanced Integration Setup', 
            'minimal-integration': 'Minimal Integration Setup',
            'upgrade-enhancement': 'System Upgrade & Enhancement',
            'completion': 'Setup Completion'
        };
        return titles[configType] || 'Custom Configuration';
    }

    getAgentDescription(agent) {
        const descriptions = {
            '@software-engineering-expert': 'Code quality and architecture guidance',
            '@code-reviewer': 'Quality assurance and code review',
            '@orchestrator': 'Multi-dimensional analysis and coordination',
            '@vibe-coding-coordinator': 'Autonomous development preparation',
            '@security-specialist': 'Security analysis and best practices',
            '@documentation-specialist': 'Technical documentation and guides',
            '@git-expert': 'Version control and collaboration',
            '@nodejs-expert': 'Node.js development and best practices',
            '@react-expert': 'React development and components',
            '@python-expert': 'Python development and architecture',
            '@go-expert': 'Go development and performance'
        };
        return descriptions[agent] || 'Specialized development assistance';
    }

    getMCPDescription(server) {
        const descriptions = {
            'task-master': 'Project management and intelligent task coordination',
            'basic-memory': 'Persistent knowledge and organizational learning',
            'context7': 'Live library documentation and code examples',
            'sequential-thinking': 'Complex multi-step reasoning and analysis',
            'zen': 'Multi-AI model collaboration and enhanced intelligence'
        };
        return descriptions[server] || 'Enhanced development capabilities';
    }

    getMCPConfiguration(server) {
        const configs = {
            'task-master': {
                command: 'npx',
                args: ['-y', '--package=task-master-ai', 'task-master-ai'],
                env: {
                    ANTHROPIC_API_KEY: 'your_anthropic_key_here'
                }
            },
            'basic-memory': {
                command: 'npx', 
                args: ['-y', '@modelcontextprotocol/server-memory'],
                env: {}
            }
        };
        return configs[server] || { command: 'echo', args: ['server-not-configured'] };
    }

    getSystemStatusBadge(setupPlan) {
        return `✅ READY FOR DEVELOPMENT`;
    }

    async hasGitRepo() {
        try {
            await fs.access(path.join(this.projectRoot, '.git'));
            return true;
        } catch {
            return false;
        }
    }

    async createProjectScaffolding() {
        // Create basic README if it doesn't exist
        const readmePath = path.join(this.projectRoot, 'README.md');
        try {
            await fs.access(readmePath);
        } catch {
            const readme = `# Project

Auto-generated project structure with Claude 007 Agents system.

## Getting Started

1. Review the CLAUDE.md configuration
2. Start development with: \`claude\`
3. Use \`@bootstrap-orchestrator\` for guidance

## Agent System

This project includes the Claude 007 Agents ecosystem for intelligent development assistance.
`;
            await fs.writeFile(readmePath, readme);
        }
        
        // Create basic .gitignore
        const gitignorePath = path.join(this.projectRoot, '.gitignore');
        try {
            await fs.access(gitignorePath);
        } catch {
            const gitignore = `# Dependencies
node_modules/
.env
.env.local

# Task Master
.taskmaster/cache/
.taskmaster/logs/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
`;
            await fs.writeFile(gitignorePath, gitignore);
        }
    }

    async initializeTaskMasterInProject(projectRoot) {
        try {
            const { execSync } = require('child_process');
            
            // Always create basic Task Master directory structure
            await fs.mkdir(path.join(projectRoot, '.taskmaster', 'docs'), { recursive: true });
            await fs.mkdir(path.join(projectRoot, '.taskmaster', 'tasks'), { recursive: true });
            
            // Check if task-master CLI is available
            let cliAvailable = false;
            try {
                execSync('task-master --version', { stdio: 'ignore' });
                cliAvailable = true;
            } catch {
                console.log('  📋 Task Master CLI not found - creating basic structure');
                console.log('  💡 Install with: npm install -g task-master-ai');
            }
            
            if (cliAvailable) {
                // Initialize Task Master with CLI
                console.log('  📋 Initializing Task Master with CLI...');
                execSync('task-master init', { cwd: projectRoot, stdio: 'inherit' });
            } else {
                // Create basic config manually
                const basicConfig = {
                    "models": {
                        "main": "claude-3-5-sonnet-20241022",
                        "research": "perplexity-llama-3.1-sonar-large-128k-online", 
                        "fallback": "gpt-4o-mini"
                    },
                    "rules": ["cursor", "claude"],
                    "project": {
                        "name": path.basename(projectRoot),
                        "initialized": new Date().toISOString()
                    }
                };
                
                await fs.writeFile(
                    path.join(projectRoot, '.taskmaster', 'config.json'), 
                    JSON.stringify(basicConfig, null, 2)
                );
                console.log('  ⚙️  Created basic Task Master configuration');
            }
            
            // Create example PRD template
            const examplePRD = `# Project Requirements Document

## Project Overview
[Describe your project goals and objectives]

## Features
1. [Feature 1 description]
2. [Feature 2 description]
3. [Feature 3 description]

## Technical Requirements
- [Technical requirement 1]
- [Technical requirement 2]

## Acceptance Criteria
- [ ] [Criteria 1]
- [ ] [Criteria 2]

## Notes
[Additional notes and considerations]

## Getting Started
After editing this PRD, run:
\`\`\`bash
# If you have task-master CLI installed:
task-master parse-prd .taskmaster/docs/prd.txt

# Or use Claude Code:
claude "Use @task-orchestrator to generate tasks from this PRD"
\`\`\`
`;
            
            await fs.writeFile(path.join(projectRoot, '.taskmaster', 'docs', 'prd.txt'), examplePRD);
            console.log('  📄 Created example PRD template at .taskmaster/docs/prd.txt');
            
            // Create basic tasks.json if CLI not available
            if (!cliAvailable) {
                const basicTasks = {
                    "version": "1.0.0",
                    "tasks": [],
                    "metadata": {
                        "created": new Date().toISOString(),
                        "source": "bootstrap-orchestrator"
                    }
                };
                
                await fs.writeFile(
                    path.join(projectRoot, '.taskmaster', 'tasks', 'tasks.json'), 
                    JSON.stringify(basicTasks, null, 2)
                );
                console.log('  📋 Created basic tasks database');
            }
            
            console.log('  ✅ Task Master structure initialized successfully');
            
        } catch (error) {
            console.warn(`  ⚠️  Task Master initialization warning: ${error.message}`);
        }
    }

    mergeClaudeConfigurations(existing, generated) {
        // Simple merge strategy - replace if existing is shorter, otherwise append
        if (existing.length < 500) {
            return generated;
        } else {
            return `${existing}\n\n---\n\n## Updated Configuration\n\n${generated}`;
        }
    }
}

// CLI interface
if (require.main === module) {
    const projectRoot = process.argv[2] || process.cwd();
    const bootstrap = new Claude007BootstrapEngine(projectRoot);
    
    bootstrap.bootstrap()
        .then(result => {
            console.log('\n🎉 Bootstrap Complete!');
            console.log(`Scenario: ${result.scenario}`);
            console.log(`Files created: ${result.deployment.filesCreated.length}`);
            console.log(`System status: ${result.validation.status}`);
            
            console.log('\n📋 Next Steps:');
            result.nextSteps.forEach(step => console.log(`  ${step}`));
            
            process.exit(0);
        })
        .catch(error => {
            console.error('\n💥 Bootstrap failed:', error.message);
            process.exit(1);
        });
}

module.exports = Claude007BootstrapEngine;