/* ==========================================================================
   DEVOPS PORTFOLIO - CORE INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     LOADING SCREEN WITH DEVOPS SOUND EFFECTS
     ========================================================================== */
  const initLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const loadingStatus = document.getElementById('loading-status');
    const terminalLines = [
      document.getElementById('terminal-line-1'),
      document.getElementById('terminal-line-2'),
      document.getElementById('terminal-line-3')
    ];

    // Web Audio API for DevOps sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playDevOpsSound = (type) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'boot') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'progress') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } else if (type === 'complete') {
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    };

    // DevOps loading messages
    const loadingMessages = [
      'Initializing Kubernetes cluster...',
      'Loading container images...',
      'Configuring CI/CD pipeline...',
      'Setting up monitoring stack...',
      'Provisioning cloud resources...',
      'Deploying microservices...',
      'Running health checks...',
      'Environment ready!'
    ];

    let progress = 0;
    let messageIndex = 0;

    const updateProgress = () => {
      if (progress >= 100) {
        playDevOpsSound('complete');
        loadingStatus.textContent = loadingMessages[loadingMessages.length - 1];
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }, 500);
        return;
      }

      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;

      progressFill.style.width = `${progress}%`;
      progressPercentage.textContent = `${Math.round(progress)}%`;

      if (progress > (messageIndex + 1) * (100 / loadingMessages.length)) {
        messageIndex = Math.min(messageIndex + 1, loadingMessages.length - 1);
        loadingStatus.textContent = loadingMessages[messageIndex];
        playDevOpsSound('progress');
      }

      setTimeout(updateProgress, 200 + Math.random() * 300);
    };

    // Update terminal lines with DevOps commands
    const terminalCommands = [
      '> kubectl cluster-info',
      '> docker-compose up -d',
      '> terraform apply -auto-approve'
    ];

    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        line.textContent = terminalCommands[index];
        line.style.color = '#10B981';
      }, 500 + index * 500);
    });

    // Start loading sequence
    playDevOpsSound('boot');
    setTimeout(updateProgress, 500);
  };

  initLoadingScreen();

  // Global State Tracker
  const STATE = {
    pipelineActive: false,
    selectedPod: null,
    k8sPods: [
      { id: 'pod-fe', name: 'frontend-ui-78f9c', status: 'running', cpu: '1.2%', ram: '142MB', restarts: 0, logs: 'frontend nginx is listening on port 80\n[INFO] GET /index.html 200 OK\n[INFO] GET /style.css 200 OK\n[INFO] GET /app.js 200 OK' },
      { id: 'pod-auth', name: 'auth-api-f88d2', status: 'running', cpu: '2.4%', ram: '185MB', restarts: 1, logs: 'auth-api running on port 8080\n[INFO] DB Connection pool initialized\n[INFO] Token validation service active' },
      { id: 'pod-pay', name: 'payment-srv-921c3', status: 'running', cpu: '0.8%', ram: '240MB', restarts: 0, logs: 'payment microservice waiting for queue...\n[INFO] Listening on AMQP queue "payments"\n[INFO] Stripe API gateway online' },
      { id: 'pod-db', name: 'db-postgres-0', status: 'running', cpu: '4.5%', ram: '812MB', restarts: 0, logs: 'PostgreSQL Database Server initialized\n[INFO] Database system is ready to accept connections\n[INFO] Autovacuum daemon started' },
      { id: 'pod-redis', name: 'cache-redis-a', status: 'running', cpu: '0.4%', ram: '98MB', restarts: 0, logs: 'Redis cache listening on port 6379\n[INFO] Maxmemory set to 256mb\n[INFO] Cache eviction policy: volatile-lru' },
      { id: 'pod-worker', name: 'analytics-worker-2d', status: 'running', cpu: '5.1%', ram: '310MB', restarts: 2, logs: 'analytics worker spawned\n[INFO] Starting batch compression routine...\n[INFO] Data pipeline synced successfully' }
    ]
  };

  /* ==========================================================================
     1. TELEMETRY MONITORING CHARTS (HTML5 CANVAS)
     ========================================================================== */
  const initTelemetryCharts = () => {
    const cpuCanvas = document.getElementById('cpu-chart');
    const ramCanvas = document.getElementById('ram-chart');
    if (!cpuCanvas || !ramCanvas) return;

    const cpuCtx = cpuCanvas.getContext('2d');
    const ramCtx = ramCanvas.getContext('2d');

    // Resize Canvas logic to match CSS container
    const resizeCanvas = (canvas) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas(cpuCanvas);
    resizeCanvas(ramCanvas);
    window.addEventListener('resize', () => {
      resizeCanvas(cpuCanvas);
      resizeCanvas(ramCanvas);
    });

    const dataPoints = 25;
    const cpuHistory = Array(dataPoints).fill(20);
    const ramHistory = Array(dataPoints).fill(4.1);

    const drawChart = (ctx, canvas, history, min, max, labelColor, glowColor) => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Filled Gradient Line Chart
      ctx.beginPath();
      ctx.moveTo(0, h);
      
      const step = w / (dataPoints - 1);
      
      for (let i = 0; i < dataPoints; i++) {
        const val = history[i];
        const normalized = (val - min) / (max - min);
        const x = i * step;
        const y = h - (normalized * (h - 20)) - 10;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(w, h);
      ctx.closePath();

      // Create Gradient Fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, glowColor);
      grad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw Top Stroke Line
      ctx.beginPath();
      for (let i = 0; i < dataPoints; i++) {
        const val = history[i];
        const normalized = (val - min) / (max - min);
        const x = i * step;
        const y = h - (normalized * (h - 20)) - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = labelColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = labelColor;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    // Update Telemetry metrics loop
    const updateMetrics = () => {
      // Fluctuate CPU metrics
      const currentCpu = Math.max(10, Math.min(95, Math.floor(cpuHistory[cpuHistory.length - 1] + (Math.random() * 20 - 10))));
      cpuHistory.shift();
      cpuHistory.push(currentCpu);
      document.getElementById('cpu-value').innerText = `${currentCpu}%`;

      // Fluctuate Memory metrics
      const currentRam = Math.max(3.8, Math.min(7.9, parseFloat((ramHistory[ramHistory.length - 1] + (Math.random() * 0.2 - 0.1)).toFixed(2))));
      ramHistory.shift();
      ramHistory.push(currentRam);
      document.getElementById('ram-value').innerText = `${currentRam} GB`;

      // Draw charts
      drawChart(cpuCtx, cpuCanvas, cpuHistory, 0, 100, '#06b6d4', 'rgba(6, 182, 212, 0.25)');
      drawChart(ramCtx, ramCanvas, ramHistory, 3.0, 8.0, '#8b5cf6', 'rgba(139, 92, 246, 0.25)');

      setTimeout(updateMetrics, 1000);
    };

    updateMetrics();
  };

  /* ==========================================================================
     2. LIVE ACCESS LOGS STREAM (GRAFANA PANEL)
     ========================================================================== */
  const initSystemLogsStream = () => {
    const logsFeed = document.getElementById('dashboard-logs-feed');
    if (!logsFeed) return;

    const ips = ['192.168.1.104', '84.22.183.92', '172.56.21.8', '54.210.92.143', '10.244.3.45', '8.8.8.8'];
    const services = ['frontend-ui', 'auth-api', 'payment-srv', 'db-postgres', 'analytics-worker'];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const endpoints = ['/api/v1/projects', '/api/v1/auth/session', '/api/v1/contact', '/health', '/ready', '/metrics'];
    const codes = ['200 OK', '201 Created', '200 OK', '304 Not Modified', '200 OK', '404 Not Found'];

    const appendLog = (message, customClass = '') => {
      const line = document.createElement('div');
      line.className = `log-entry-line ${customClass}`;
      line.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
      logsFeed.appendChild(line);
      logsFeed.scrollTop = logsFeed.scrollHeight;

      // Maintain reasonable buffer (cap at 60 lines)
      while (logsFeed.children.length > 60) {
        logsFeed.removeChild(logsFeed.firstChild);
      }
    };

    // Make it available globally for API forms & pod restarts to hook into
    window.appendSystemLog = appendLog;

    const generateRandomLog = () => {
      const randIp = ips[Math.floor(Math.random() * ips.length)];
      const randSrv = services[Math.floor(Math.random() * services.length)];
      const randMethod = methods[Math.floor(Math.random() * methods.length)];
      const randEnd = endpoints[Math.floor(Math.random() * endpoints.length)];
      const randCode = codes[Math.floor(Math.random() * codes.length)];

      let msg = '';
      const r = Math.random();
      if (r < 0.6) {
        // Nginx Traffic Request
        let colorClass = 'text-green';
        if (randCode.startsWith('4')) colorClass = 'text-red';
        if (randCode.startsWith('3')) colorClass = 'text-yellow';
        msg = `<span class="text-cyan">${randSrv}</span> - Nginx gateway: ${randIp} - ${randMethod} <span class="text-muted">${randEnd}</span> - <span class="${colorClass}">${randCode}</span>`;
      } else if (r < 0.8) {
        // Pod metrics alert status log
        msg = `<span class="text-purple">[SYSTEM]</span> Service mesh status check: ${randSrv} healthy. Latency 12ms.`;
      } else {
        // Database queries
        msg = `<span class="text-green">[DB-REPLICA]</span> postgres query executed successfully (SELECT * FROM user_profile LIMIT 1)`;
      }

      appendLog(msg);
      setTimeout(generateRandomLog, 1500 + Math.random() * 3000);
    };

    // Prepopulate with a few lines
    appendLog('Initializing System Logging Gateway Agent...');
    appendLog('Cluster telemetry connection: <span class="text-green">ONLINE</span>');
    appendLog('Pod listener registered on prod namespaces.');
    
    generateRandomLog();
  };

  /* ==========================================================================
     3. KUBERNETES CONTAINER POD GRID
     ========================================================================== */
  const initK8sClusterGrid = () => {
    const grid = document.getElementById('k8s-pods-grid');
    const placeholder = document.getElementById('pod-placeholder');
    const infoPanel = document.getElementById('pod-info');
    
    const infoName = document.getElementById('pod-info-name');
    const infoStatus = document.getElementById('pod-info-status');
    const infoCpu = document.getElementById('pod-cpu');
    const infoRam = document.getElementById('pod-ram');
    const infoRestarts = document.getElementById('pod-restarts');

    const btnLogs = document.getElementById('btn-pod-logs');
    const btnRestart = document.getElementById('btn-pod-restart');

    const renderGrid = () => {
      grid.innerHTML = '';
      STATE.k8sPods.forEach(pod => {
        const el = document.createElement('div');
        el.className = `k8s-pod ${pod.status}`;
        el.dataset.id = pod.id;
        if (STATE.selectedPod && STATE.selectedPod.id === pod.id) {
          el.classList.add('active');
        }

        el.innerHTML = `
          <span class="k8s-pod-light"></span>
          <span class="k8s-pod-label">${pod.name.split('-')[0]}</span>
        `;

        el.addEventListener('click', () => selectPod(pod));
        grid.appendChild(el);
      });

      // Update healthy count in header stats
      const healthyCount = STATE.k8sPods.filter(p => p.status === 'running').length;
      document.getElementById('k8s-healthy-count').innerText = healthyCount;
    };

    const selectPod = (pod) => {
      STATE.selectedPod = pod;
      
      // Update UI active styling highlights
      document.querySelectorAll('.k8s-pod').forEach(el => {
        if (el.dataset.id === pod.id) el.classList.add('active');
        else el.classList.remove('active');
      });

      placeholder.classList.add('hidden');
      infoPanel.classList.remove('hidden');

      // Populate pod metadata panel
      infoName.innerText = pod.name;
      infoStatus.innerText = pod.status.toUpperCase();
      infoStatus.className = `pod-info-status ${pod.status}`;
      infoCpu.innerText = pod.cpu;
      infoRam.innerText = pod.ram;
      infoRestarts.innerText = pod.restarts;

      // Handle custom disabled buttons based on states
      if (pod.status !== 'running') {
        btnRestart.disabled = true;
      } else {
        btnRestart.disabled = false;
      }
    };

    // Restart pod orchestrator triggers rolling deployment simulation
    btnRestart.addEventListener('click', () => {
      if (!STATE.selectedPod || STATE.selectedPod.status !== 'running') return;
      
      const pod = STATE.selectedPod;
      pod.status = 'terminating';
      pod.cpu = '0%';
      pod.ram = '0MB';
      
      renderGrid();
      selectPod(pod);

      window.appendSystemLog(`<span class="text-red">[K8S-EVENT]</span> Evicting Pod <span class="text-yellow">${pod.name}</span>. SIGTERM signal issued...`, 'text-yellow');

      // Stage 1: Terminating to Pending (Creating)
      setTimeout(() => {
        pod.status = 'pending';
        pod.restarts += 1;
        pod.name = `${pod.name.split('-')[0]}-${pod.name.split('-')[1]}-${Math.random().toString(16).substring(2, 6)}`;
        renderGrid();
        selectPod(pod);
        window.appendSystemLog(`<span class="text-yellow">[K8S-EVENT]</span> Container destroyed. Scheduling replacement replica. Spawning container replica...`);
      }, 2500);

      // Stage 2: Pending to Running (Healthy)
      setTimeout(() => {
        pod.status = 'running';
        pod.cpu = `${(Math.random() * 4 + 0.5).toFixed(1)}%`;
        pod.ram = `${Math.floor(Math.random() * 150 + 100)}MB`;
        renderGrid();
        selectPod(pod);
        window.appendSystemLog(`<span class="text-green">[K8S-EVENT]</span> Pod <span class="text-green">${pod.name}</span> health checks passed: 3/3 container readiness OK.`, 'text-cyan');
      }, 5500);
    });

    // Pod Logs display
    btnLogs.addEventListener('click', () => {
      if (!STATE.selectedPod) return;
      alert(`=== CONTAINER LOG STREAM FOR: ${STATE.selectedPod.name} ===\n\n${STATE.selectedPod.logs}\n\n[LOGGER END - STREAM DISCONNECTED]`);
    });

    renderGrid();
  };

  /* ==========================================================================
     4. INTERACTIVE TERMINAL ENGINE
     ========================================================================== */
  const initTerminal = () => {
    const termInput = document.getElementById('terminal-input');
    const termBody = document.getElementById('terminal-body');
    const termWrapper = document.querySelector('.terminal-wrapper');
    if (!termInput || !termBody) return;

    // Command History Store
    const history = [];
    let historyIdx = -1;

    // Command callbacks registry
    const commands = {
      help: () => {
        return `
Available commands:
  <span class="text-cyan">about</span>       - Print professional DevOps bio & profile info.
  <span class="text-cyan">skills</span>      - Render active metrics core skills.
  <span class="text-cyan">projects</span>    - List microservice deployments.
  <span class="text-cyan">deploy</span>      - Trigger full CI/CD deployment pipeline.
  <span class="text-cyan">uptime</span>      - Print virtual cluster load stats & uptime metrics.
  <span class="text-cyan">theme</span>       - Toggle visual shell terminal themes (<span class="text-yellow">classic</span>, <span class="text-yellow">neon</span>, <span class="text-yellow">matrix</span>).
  <span class="text-cyan">clear</span>       - Clear shell console logs screen.
  <span class="text-cyan">help</span>        - Display this operations manual documentation.
`;
      },
      about: () => {
        return `
<span class="text-purple">=== USER SPEC PROFILE MODULE ===</span>
Name:        Jayanth C
Role:        DevOps & Cloud Site Reliability Engineer
Status:      Actively looking for exciting projects & roles
Bio:         I specialize in building bridges between software development and IT infrastructure
             to streamline release workflows, optimize server performance, and maintain 99.9% uptime.
             I treat infrastructure as software code, configurations as templates, and systems
             monitoring as mandatory business intelligence.
`;
      },
      skills: () => {
        return `
<span class="text-purple">=== INFRASTRUCTURE CORE SKILL SETS ===</span>
  Kubernetes  [██████████████████] 100% - Production Orchestrator, ArgoCD GitOps
  Docker      [████████████████░░]  90% - Lightweight Containers, Multi-stage builds
  Terraform   [██████████████░░░░]  80% - Declarative Multi-cloud infrastructure provisioning
  AWS Cloud   [████████████████░░]  90% - VPC networks, EC2 clusters, Route53, IAM security
  Prometheus  [██████████████░░░░]  80% - Grafana monitoring, Prometheus metrics scrape targets
  Python/Go   [██████████░░░░░░░░]  60% - Automation scripts, REST APIs, Operator patterns
`;
      },
      projects: () => {
        return `
<span class="text-purple">=== RUNNING DEPLOYED SERVICE REGISTRY ===</span>
  * <span class="text-cyan">service-k8s-gitops</span>       - ArgoCD Automated K8s deployment cluster. [v1.4.2] -> <span class="text-green">ONLINE</span>
  * <span class="text-cyan">service-tf-multi-cloud</span>   - Active-Active global Route53 VPC setups. [v2.1.0] -> <span class="text-green">ONLINE</span>
  * <span class="text-cyan">service-monitoring-stack</span> - Thanos prometheus automated pod recycling. [v3.0.4] -> <span class="text-green">ONLINE</span>

For granular detail, view the Featured highlights card grids below or run '<span class="text-cyan">deploy</span>'.
`;
      },
      uptime: () => {
        return `
node-prod-cluster status:
  Uptime: 324 days, 14 hours, 5 minutes.
  Local time: ${new Date().toString()}
  Load average: 0.12, 0.08, 0.05
  Container processes: 42 active, 0 zombie, 0 failed.
  Cluster connectivity: AWS public internet gateway ping - <span class="text-green">OK (4.2ms)</span>
`;
      },
      theme: (args) => {
        if (!args || args.length === 0) {
          return `Usage: <span class="text-cyan">theme &lt;classic | neon | matrix&gt;</span>\nCurrent theme: ${termWrapper.className.replace('terminal-wrapper', '').trim() || 'default'}`;
        }
        const theme = args[0].toLowerCase();
        termWrapper.classList.remove('classic-theme', 'neon-theme', 'matrix-theme');
        
        if (theme === 'classic') {
          termWrapper.classList.add('classic-theme');
          return 'Theme configuration updated to classic terminal retro cyan-white.';
        } else if (theme === 'neon') {
          termWrapper.classList.add('neon-theme');
          return 'Theme configuration updated to neon purple console layout.';
        } else if (theme === 'matrix') {
          termWrapper.classList.add('matrix-theme');
          return 'Theme configuration updated to Matrix digital green rain terminal.';
        } else {
          return `Unknown theme configuration: <span class="text-red">${theme}</span>. Choose 'classic', 'neon', or 'matrix'.`;
        }
      },
      deploy: () => {
        setTimeout(() => {
          document.getElementById('btn-trigger-pipeline').click();
        }, 300);
        return 'Issuing trigger payload to CI/CD pipeline automation webhook gateway...';
      },
      clear: () => {
        const welcomed = termBody.querySelectorAll('.terminal-welcome, .terminal-welcome-tip');
        welcomed.forEach(el => el.remove());
        
        // Remove all previous inputs and outputs
        termBody.querySelectorAll('.cmd-input-line, .cmd-output').forEach(el => el.remove());
        return '';
      }
    };

    const parseCommand = (inputVal) => {
      const cleanInput = inputVal.trim();
      if (!cleanInput) return;

      history.push(cleanInput);
      historyIdx = history.length;

      const tokens = cleanInput.split(/\s+/);
      const cmd = tokens[0].toLowerCase();
      const args = tokens.slice(1);

      // Render execution line in history output
      const cmdLine = document.createElement('div');
      cmdLine.className = 'cmd-input-line';
      cmdLine.innerHTML = `
        <span class="prompt">visitor@devops-node:~$</span>
        <span class="text">${cleanInput}</span>
      `;
      
      const lastInputLine = termInput.parentElement;
      termBody.insertBefore(cmdLine, lastInputLine);

      let output = '';
      if (commands[cmd]) {
        output = commands[cmd](args);
      } else {
        output = `bash: command not found: <span class="text-red">${cmd}</span>. Type '<span class="text-cyan">help</span>' to read available operations.`;
      }

      if (cmd !== 'clear') {
        const outDiv = document.createElement('div');
        outDiv.className = 'cmd-output';
        outDiv.innerHTML = output;
        termBody.insertBefore(outDiv, lastInputLine);
      }

      // Auto scroll to bottom
      termBody.scrollTop = termBody.scrollHeight;
      termInput.value = '';
    };

    // Events Listeners
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        parseCommand(termInput.value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIdx > 0) {
          historyIdx--;
          termInput.value = history[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx < history.length - 1) {
          historyIdx++;
          termInput.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          termInput.value = '';
        }
      }
    });

    // Focus textbox when clicking anywhere inside terminal body
    termBody.addEventListener('click', () => {
      termInput.focus();
    });

    termInput.addEventListener('focus', () => {
      termWrapper.classList.add('focused');
    });
    termInput.addEventListener('blur', () => {
      termWrapper.classList.remove('focused');
    });
  };

  /* ==========================================================================
     5. CI/CD PIPELINE AUTOMATION SIMULATOR
     ========================================================================== */
  const initPipelineSimulator = () => {
    const btnTrigger = document.getElementById('btn-trigger-pipeline');
    const indicator = document.getElementById('pipeline-status-indicator');
    const statusText = document.getElementById('pipeline-status-text');
    const progressLine = document.getElementById('pipeline-progress-line');
    const logConsole = document.getElementById('pipeline-log-output');
    const durationLabel = document.getElementById('pipeline-duration');

    if (!btnTrigger) return;

    // Detailed Stage Log Contents
    const stepLogs = [
      // Step 0: Source Code Trigger
      [
        '[GITOPS] GitWebhook hook payload detected from master branch.',
        '[GITOPS] Commit ID: c9ca69e3 - Author: Jayanth C - "feat: optimize database connections"',
        '[SYSTEM] Initializing build agent virtual workspace environment...',
        '[SYSTEM] Pulling base repository manifest configs from git HEAD...'
      ],
      // Step 1: Lint & Code Quality Audit
      [
        '[AUDIT] Fetching ESLint linter definitions, configuring sonar-project.properties...',
        '[AUDIT] running: "npm run lint:security" code scanner...',
        '[AUDIT] SUCCESS - 0 structural errors, 0 static analyzer faults found.',
        '[AUDIT] running: "sonarqube-scanner" project coverage validation...',
        '[AUDIT] SUCCESS - Code quality gate: PASSED (98.4% unit coverage, 0 vulnerabilities).'
      ],
      // Step 2: Docker Build Container Image
      [
        '[DOCKER] parsing configuration profile Dockerfile specs...',
        '[DOCKER] step 1/8: FROM node:20-alpine AS build-stage',
        '[DOCKER] step 2/8: WORKDIR /app && COPY package*.json .',
        '[DOCKER] step 3/8: RUN npm ci --only=production',
        '[DOCKER] step 4/8: COPY . . && RUN npm run build',
        '[DOCKER] step 5/8: FROM nginx:alpine-slim',
        '[DOCKER] step 6/8: COPY --from=build-stage /app/dist /usr/share/nginx/html',
        '[DOCKER] step 7/8: EXPOSE 80 && CMD ["nginx", "-g", "daemon off;"]',
        '[DOCKER] Docker daemon build successfully completed. Image ID: sha256:7b92f9f82d',
        '[DOCKER] Image size: 24.2 MB. Multi-stage compression: REDUCED by 85%.'
      ],
      // Step 3: Run Unit & Integration Tests
      [
        '[TEST] Spawning mock node unit testing harness runner context...',
        '[TEST] running: "jest --config jest.config.json" on auth modules...',
        '[TEST]   PASS  src/__tests__/auth-token.test.js (4.2s)',
        '[TEST]   PASS  src/__tests__/api-routing.test.js (3.8s)',
        '[TEST] Running component UI integration tests: "cypress run --headless"...',
        '[TEST]   PASS  cypress/e2e/contact-api-response.spec.js (7.1s)',
        '[TEST] Overall results: 48/48 tests executed successfully. Coverage rate: 100%.'
      ],
      // Step 4: Push to Registry
      [
        '[REGISTRY] Authenticating secure session keys for AWS ECR registry...',
        '[REGISTRY] docker push 1024523910.dkr.ecr.us-east-1.amazonaws.com/Jayanth-profile:latest',
        '[REGISTRY] preparing image layer: 832f83a042 - Pushed',
        '[REGISTRY] preparing image layer: f48d28a05c - Pushed',
        '[REGISTRY] preparing image layer: 28da9810a9 - Connection cached',
        '[REGISTRY] SUCCESS - Image tagged latest pushed to us-east-1 registry repository.'
      ],
      // Step 5: ArgoCD GitOps Kubernetes Deploy
      [
        '[DEPLOY] Syncing ArgoCD manifest registry files...',
        '[DEPLOY] kubectl set image deployment/engineer-profile-deployment cloud-architect-profile=1024523910.dkr.ecr.us-east-1.amazonaws.com/Jayanth-profile:v1.4.3 --namespace=prod',
        '[DEPLOY] Rolling update deployment trigger issued on namespace prod.',
        '[DEPLOY] 3 replicas scheduling replacement tasks. Rolling update: 33% ... 66% ... 100%.',
        '[DEPLOY] System verification: HTTP status checks response - 200 OK. Dynamic DNS healthy.',
        '[SUCCESS] ========================================================',
        '[SUCCESS]   DEPLOYMENT COMPLETED - DEVOPS PORTFOLIO ONLINE & SECURED',
        '[SUCCESS] ========================================================'
      ]
    ];

    const writeLog = (message, customClass = '') => {
      const line = document.createElement('div');
      line.className = `log-line ${customClass}`;
      line.innerHTML = message;
      logConsole.appendChild(line);
      logConsole.scrollTop = logConsole.scrollHeight;
    };

    const runPipeline = () => {
      if (STATE.pipelineActive) return;
      STATE.pipelineActive = true;

      // Lock buttons
      btnTrigger.disabled = true;
      btnTrigger.classList.add('disabled');
      
      // Setup Visual elements
      indicator.className = 'pipeline-indicator running';
      statusText.innerText = 'Pipeline Status: Running Build...';
      logConsole.innerHTML = '';
      progressLine.style.width = '0%';
      durationLabel.innerText = 'Duration: 0.0s';

      const steps = document.querySelectorAll('.pipeline-step');
      steps.forEach(el => el.className = 'pipeline-step');

      let startTime = Date.now();
      let timerInterval = setInterval(() => {
        let dur = ((Date.now() - startTime) / 1000).toFixed(1);
        durationLabel.innerText = `Duration: ${dur}s`;
      }, 100);

      let currentStepIdx = 0;

      const executeStep = () => {
        if (currentStepIdx >= steps.length) {
          // Pipeline fully complete
          clearInterval(timerInterval);
          STATE.pipelineActive = false;
          btnTrigger.disabled = false;
          btnTrigger.classList.remove('disabled');
          indicator.className = 'pipeline-indicator success';
          statusText.innerText = 'Pipeline Status: Success (Deploy Healthy)';
          
          window.appendSystemLog(`<span class="text-cyan">[PIPELINE]</span> ArgoCD auto-sync webhooks completed. Profile registry updated.`, 'text-green');
          return;
        }

        // Active state visual update
        const stepEl = steps[currentStepIdx];
        stepEl.classList.add('active');
        
        // Progress bar expansion
        const percentage = (currentStepIdx / (steps.length - 1)) * 100;
        progressLine.style.width = `${percentage}%`;

        writeLog(`<span class="text-cyan">>>> Entering pipeline stage: ${stepEl.querySelector('.step-name').innerText}</span>`);

        // Stream logs lines with minor time differences
        let logLineIdx = 0;
        const currentLogs = stepLogs[currentStepIdx];

        const streamLogs = () => {
          if (logLineIdx >= currentLogs.length) {
            // Step complete
            stepEl.classList.remove('active');
            stepEl.classList.add('success');
            
            // Trigger system log stream webhook alert
            window.appendSystemLog(`Pipeline stage: <strong class="text-cyan">${stepEl.querySelector('.step-name').innerText}</strong> completed successfully.`);

            currentStepIdx++;
            setTimeout(executeStep, 1000);
            return;
          }

          let logStr = currentLogs[logLineIdx];
          let color = '';
          if (logStr.startsWith('[DOCKER]')) color = 'text-muted';
          if (logStr.startsWith('[SUCCESS]')) color = 'text-green';
          if (logStr.startsWith('[AUDIT]')) color = 'text-yellow';
          if (logStr.startsWith('[TEST]')) color = 'text-purple';

          writeLog(logStr, color);
          logLineIdx++;

          // Variable timing to simulate real operations
          setTimeout(streamLogs, 300 + Math.random() * 400);
        };

        streamLogs();
      };

      executeStep();
    };

    btnTrigger.addEventListener('click', runPipeline);
  };

  /* ==========================================================================
     6. IaC SPECIFICATION TABS & COPY CONFIG
     ========================================================================== */
  const initHeroHeadlineRotator = () => {
    const rotatorText = document.getElementById('hero-headline-text');
    if (!rotatorText) return;

    const headlines = [
      "DevOps | Specializing in GitOps Automation & Self-Healing Telemetry | Terraform • Kubernetes • AWS • GenAI MLOps",
      "DevOps Engineer | SRE | Kubernetes & GitOps Architect | Terraform • AWS • Google Cloud • Prometheus • MLOps ",
      "DevOps Engineer | Architecting High-Availability Cloud Infrastructure & Zero-Downtime CI/CD Pipelines | Reducing Latency & Scaling Kubernetes Replicas Natively"
    ];

    let headlineIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingSpeed = 35; // typing speed in ms
    
    const type = () => {
      const current = headlines[headlineIdx];
      if (isDeleting) {
        rotatorText.innerHTML = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        rotatorText.innerHTML = current.substring(0, charIdx + 1);
        charIdx++;
      }

      let delta = typingSpeed;
      if (isDeleting) { delta /= 2; }

      if (!isDeleting && charIdx === current.length) {
        delta = 3000; // hold for 3s
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        headlineIdx = (headlineIdx + 1) % headlines.length;
        delta = 500; // pause before typing next
      }

      setTimeout(type, delta);
    };

    type();
  };

  /* ==========================================================================
     7. REST API CONTACT CLIENT REQUEST BUILDER
     ========================================================================== */
  const initContactApiForm = () => {
    const btnSend = document.getElementById('btn-api-send');
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactMsg = document.getElementById('contact-message');
    
    const responseDisplay = document.getElementById('response-display');
    const responseBadge = document.getElementById('response-status-badge');

    if (!btnSend) return;

    const mockSubmitPayload = (e) => {
      e.preventDefault();

      const name = contactName.value.trim();
      const email = contactEmail.value.trim();
      const msg = contactMsg.value.trim();

      if (!name || !email || !msg) {
        alert('Please fill out all request body parameters (name, email, message) before sending payload.');
        return;
      }

      // API Client loading status
      btnSend.disabled = true;
      btnSend.innerText = 'Sending Request Transaction...';
      responseBadge.innerText = 'WAITING FOR GATEWAY...';
      responseBadge.className = 'response-status text-yellow';
      responseDisplay.innerHTML = `<span class="text-yellow">// Sending TLS Handshake... Establishing encrypted session to API gateway...</span>`;

      // Simulating API network delays
      setTimeout(() => {
        responseBadge.innerText = '201 CREATED';
        responseBadge.className = 'response-status text-green';

        const jsonResponse = {
          success: true,
          status: 201,
          message: "Request transaction recorded successfully on cluster storage.",
          timestamp: new Date().toISOString(),
          data: {
            assigned_id: `contact_${Math.random().toString(36).substring(2, 10)}`,
            metadata: {
              ip_origin: "172.64.12.83",
              user_agent: navigator.userAgent,
              ingress_controller: "nginx-ingress-prod-c82"
            },
            payload_echo: {
              sender_name: name,
              sender_email: email,
              message_preview: msg.length > 50 ? `${msg.substring(0, 50)}...` : msg
            }
          }
        };

        responseDisplay.innerHTML = JSON.stringify(jsonResponse, null, 2)
          .replace(/"(success|status|message|timestamp|data|assigned_id|metadata|ip_origin|user_agent|ingress_controller|payload_echo|sender_name|sender_email|message_preview)"/g, '<span class="text-cyan">"$1"</span>')
          .replace(/: (\d+)/g, ': <span class="text-yellow">$1</span>')
          .replace(/: (true|false)/g, ': <span class="text-purple">$1</span>')
          .replace(/: ("[^"]+")/g, ': <span class="text-green">$1</span>');

        btnSend.disabled = false;
        btnSend.innerText = 'Send Request Payload';

        // Clear input form
        contactName.value = '';
        contactEmail.value = '';
        contactMsg.value = '';

        // Hook into live System Log stream!
        if (window.appendSystemLog) {
          window.appendSystemLog(`<span class="text-green">[GATEWAY]</span> API POST request <span class="text-green">201 CREATED</span> - Inbound email: ${email}`, 'text-cyan');
        }

      }, 2000);
    };

    btnSend.addEventListener('click', mockSubmitPayload);
  };

  /* ==========================================================================
     8. PROJECT WIDGET TELEMETRY TRIGGERS
     ========================================================================== */
  const initFeaturedSection = () => {
    const btnStudy = document.querySelector('.btn-view-study');
    if (!btnStudy) return;

    btnStudy.addEventListener('click', () => {
      alert(`
=== ARCHITECTURE CASE STUDY: SELF-HEALING K8S CLUSTER ===

Objectives:
  - Automate pod recycling for memory-leaking container processes.
  - Reduce Mean Time to Recovery (MTTR) from minutes to zero seconds.

Workflow:
  1. Prometheus scrapes container memory metrics from GKE/EKS cluster.
  2. Alertmanager evaluates rules; if RAM > 512Mi for 5m, triggers critical alert.
  3. Webhook receiver captures Alertmanager JSON payload.
  4. Automation controller triggers rolling restart of deployment via Kubernetes API.
  5. Traffic is rerouted dynamically to healthy pods without downtime.

Results:
  - MTTR reduced by 98%. Uptime maintained at 99.99%.
`);
      if (window.appendSystemLog) {
        window.appendSystemLog(`<span class="text-purple">[PROM]</span> Triggered case study architectural simulation. Uptime: 99.99%`);
      }
    });
  };

  /* ==========================================================================
     9. INTERACTIVE CREDENTIALS & CERTIFICATIONS REGISTRY
     ========================================================================== */
  const initCredentialsRegistry = () => {
    // Extensive Credentials Database (48 items)
    const CREDENTIALS = [
      { id: 'cred-1', title: 'Model Context Protocol: Advanced Topics', issuer: 'Anthropic', date: 'Mar 2026', credentialId: 'e6i98wuuewev', class: 'anthropic', category: 'ai-ml' },
      { id: 'cred-2', title: 'AWS Educate Getting Started with Cloud Ops - Training Badge', issuer: 'Amazon Web Services (AWS)', date: 'Mar 2026', credentialId: 'N/A', class: 'aws', category: 'cloud-devops' },
      { id: 'cred-3', title: 'Introduction to Model Context Protocol', issuer: 'Anthropic', date: 'Mar 2026', credentialId: 'oxfxzumfun5c', class: 'anthropic', category: 'ai-ml' },
      { id: 'cred-4', title: 'Harness Certified Continuous Delivery & GitOps Developer', issuer: 'Harness', date: 'Jan 2026', credentialId: 'N/A', class: 'harness', category: 'cloud-devops' },
      { id: 'cred-5', title: 'Site Reliability Engineer Learning Path', issuer: 'Datadog', date: 'Jan 2026', credentialId: 'N/A', class: 'datadog', category: 'cloud-devops' },
      { id: 'cred-6', title: 'Generative AI Leader Certification', issuer: 'Google', date: 'Jan 2026', expiry: 'Jan 2029', credentialId: 'N/A', class: 'google', category: 'ai-ml' },
      { id: 'cred-7', title: 'Kubernetes Monitoring Learning Path', issuer: 'Datadog', date: 'Dec 2025', credentialId: 'N/A', class: 'datadog', category: 'cloud-devops' },
      { id: 'cred-8', title: 'Red Hat AI Foundations Technologist Certificate', issuer: 'Red Hat', date: 'Dec 2025', credentialId: 'N/A', class: 'redhat', category: 'ai-ml' },
      { id: 'cred-9', title: 'Red Hat AI Foundations Executive Certificate', issuer: 'Red Hat', date: 'Dec 2025', credentialId: 'N/A', class: 'redhat', category: 'ai-ml' },
      { id: 'cred-10', title: 'LFEL1012: Secure AI/ML-Driven Software Development', issuer: 'The Linux Foundation', date: 'Nov 2025', credentialId: 'N/A', class: 'linux', category: 'systems-security' },
      { id: 'cred-11', title: 'Generative AI Overview for Project Managers', issuer: 'Project Management Institute', date: 'Sep 2025', credentialId: 'N/A', class: 'pmi', category: 'ai-ml' },
      { id: 'cred-12', title: 'AWS Educate Introduction to Generative AI', issuer: 'Amazon Web Services (AWS)', date: 'Aug 2025', credentialId: 'N/A', class: 'aws', category: 'ai-ml' },
      { id: 'cred-13', title: 'Prompt Design in Vertex AI Skill Badge', issuer: 'Google', date: 'Jun 2025', credentialId: 'N/A', class: 'google', category: 'ai-ml' },
      { id: 'cred-14', title: 'Google Cloud Cybersecurity Certificate', issuer: 'Google', date: 'Mar 2025', credentialId: 'N/A', class: 'google', category: 'systems-security' },
      { id: 'cred-15', title: 'LFS118: Ethical Principles for Conversational AI', issuer: 'The Linux Foundation', date: 'Feb 2025', credentialId: 'N/A', class: 'linux', category: 'systems-security' },
      { id: 'cred-16', title: 'LFS148: Getting Started with OpenTelemetry', issuer: 'The Linux Foundation', date: 'Feb 2025', credentialId: 'N/A', class: 'linux', category: 'cloud-devops' },
      { id: 'cred-17', title: 'Google Cloud Computing Foundations Certificate', issuer: 'Google', date: 'Jan 2025', credentialId: 'N/A', class: 'google', category: 'cloud-devops' },
      { id: 'cred-18', title: 'LFS162: Introduction to DevOps and Site Reliability Engineering', issuer: 'The Linux Foundation', date: 'Dec 2024', credentialId: 'N/A', class: 'linux', category: 'cloud-devops' },
      { id: 'cred-19', title: 'LFS147: Introduction to AI/ML Toolkits with Kubeflow', issuer: 'The Linux Foundation', date: 'Oct 2024', credentialId: 'N/A', class: 'linux', category: 'cloud-devops' },
      { id: 'cred-20', title: 'Artificial Intelligence Fundamentals', issuer: 'IBM', date: 'May 2024', credentialId: 'N/A', class: 'ibm', category: 'ai-ml' },
      { id: 'cred-21', title: 'Machine Learning Operations (MLOps): Getting Started', issuer: 'Google Cloud Skills Boost', date: 'Nov 2023', credentialId: '6314627', class: 'google', category: 'cloud-devops' },
      { id: 'cred-22', title: 'Intermediate Kubernetes Operators', issuer: 'IBM', date: 'Sep 2023', credentialId: 'N/A', class: 'ibm', category: 'cloud-devops' },
      { id: 'cred-23', title: 'Academy Accreditation - Generative AI Fundamentals', issuer: 'Databricks', date: 'Oct 2023', expiry: 'Oct 2025', credentialId: 'N/A', class: 'datadog', category: 'ai-ml' },
      { id: 'cred-24', title: 'AWS Educate Getting Started with Storage', issuer: 'Amazon Web Services (AWS)', date: 'Sep 2023', credentialId: 'N/A', class: 'aws', category: 'cloud-devops' },
      { id: 'cred-25', title: 'AWS Educate Introduction to Cloud 101', issuer: 'Amazon Web Services (AWS)', date: 'Aug 2023', credentialId: 'N/A', class: 'aws', category: 'cloud-devops' },
      { id: 'cred-26', title: 'Docker Essentials: A Developer Introduction', issuer: 'IBM', date: 'Aug 2023', credentialId: 'N/A', class: 'ibm', category: 'cloud-devops' },
      { id: 'cred-27', title: 'Containers & Kubernetes Essentials', issuer: 'IBM', date: 'Aug 2023', credentialId: 'N/A', class: 'ibm', category: 'cloud-devops' },
      { id: 'cred-28', title: 'LFQ101: Fundamentals of Quantum Computing', issuer: 'The Linux Foundation', date: 'Jul 2023', credentialId: 'N/A', class: 'linux', category: 'systems-security' },
      { id: 'cred-29', title: 'LFC108: Cybersecurity Fundamentals', issuer: 'The Linux Foundation', date: 'Jul 2023', credentialId: 'N/A', class: 'linux', category: 'systems-security' },
      { id: 'cred-30', title: 'LFS169: Introduction to GitOps', issuer: 'The Linux Foundation', date: 'Jul 2023', credentialId: 'N/A', class: 'linux', category: 'cloud-devops' },
      { id: 'cred-31', title: 'Associate Cloud Engineer', issuer: 'Google Cloud', date: 'Jul 2023', expiry: 'Jul 2026', credentialId: '76869754', class: 'google', category: 'cloud-devops' },
      { id: 'cred-32', title: 'AWS Cloud Quest: Cloud Practitioner', issuer: 'Amazon Web Services (AWS)', date: 'May 2023', credentialId: 'N/A', class: 'aws', category: 'cloud-devops' },
      { id: 'cred-33', title: 'Learn to Earn Cloud Challenge: ML Engineering Skills', issuer: 'Google Cloud Skills Boost', date: 'Jul 2022', credentialId: '2406424', class: 'google', category: 'ai-ml' },
      { id: 'cred-34', title: 'Build and Optimize Data Warehouses with BigQuery', issuer: 'Qwiklabs', date: 'Jun 2022', credentialId: '2315336', class: 'google', category: 'cloud-devops' },
      { id: 'cred-35', title: 'Learn to Earn Cloud Security Challenge: Level 2', issuer: 'Qwiklabs', date: 'Jan 2022', credentialId: '1653610', class: 'google', category: 'systems-security' },
      { id: 'cred-36', title: 'Learn to Earn Cloud Security Challenge: Level 3', issuer: 'Qwiklabs', date: 'Jan 2022', credentialId: '1656595', class: 'google', category: 'systems-security' },
      { id: 'cred-37', title: 'Learn to Earn Cloud Security Challenge: Level 1', issuer: 'Qwiklabs', date: 'Jan 2022', credentialId: '1659690', class: 'google', category: 'systems-security' },
      { id: 'cred-38', title: 'Introduction to Industry 4.0 and Industrial IoT', issuer: 'NPTEL', date: 'Sep 2021', credentialId: 'NPTEL21CS20S23231486', class: 'nptel', category: 'systems-security' },
      { id: 'cred-39', title: 'SQL Fundamentals', issuer: 'Sololearn', date: 'Mar 2019', credentialId: '1060-12798520', class: 'sololearn', category: 'systems-security' },
      { id: 'cred-40', title: 'Git Course', issuer: 'Progate', date: 'Sep 2020', credentialId: '7a1653d5qg0qi8', class: 'progate', category: 'systems-security' },
      { id: 'cred-41', title: 'Command Line Course', issuer: 'Progate', date: 'Sep 2020', credentialId: '8c5882bdqg0o9g', class: 'progate', category: 'systems-security' },
      { id: 'cred-42', title: 'Google Cloud Computing Foundations', issuer: 'NPTEL', date: 'Sep 2020', credentialId: 'NPTEL20CS96551210497', class: 'nptel', category: 'cloud-devops' },
      { id: 'cred-43', title: 'Create and Manage Cloud Resources', issuer: 'Qwiklabs', date: 'Oct 2020', credentialId: '464213', class: 'google', category: 'cloud-devops' },
      { id: 'cred-44', title: 'Perform Foundational Infrastructure Tasks in Google Cloud', issuer: 'Qwiklabs', date: 'Oct 2020', credentialId: '526774', class: 'google', category: 'cloud-devops' },
      { id: 'cred-45', title: 'Build and Secure Networks in Google Cloud', issuer: 'Qwiklabs', date: 'Oct 2020', credentialId: '526938', class: 'google', category: 'cloud-devops' },
      { id: 'cred-46', title: 'Perform Foundational Data, ML, and AI Tasks in Google Cloud', issuer: 'Qwiklabs', date: 'Nov 2020', credentialId: '531421', class: 'google', category: 'ai-ml' },
      { id: 'cred-47', title: 'Neural Networks and Deep Learning', issuer: 'Coursera', date: 'May 2020', credentialId: 'WVEANVESU8Z2', class: 'coursera', category: 'ai-ml' },
      { id: 'cred-48', title: 'HTML, CSS, and Javascript for Web Developers', issuer: 'Coursera', date: 'Aug 2020', credentialId: 'YQY84ECHVUZB', class: 'coursera', category: 'systems-security' }
    ];

    // Local Registry States
    let activeCategory = 'all';
    let searchQuery = '';
    let visibleItemsCount = 6;
    const itemsPerPage = 6;

    // Elements
    const grid = document.getElementById('credentials-grid');
    const tabs = document.getElementById('credentials-tabs');
    const searchInput = document.getElementById('credentials-search');
    const btnLoadMore = document.getElementById('btn-load-more-creds');
    const paginationContainer = document.getElementById('credentials-pagination');

    const modal = document.getElementById('verification-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('btn-close-modal');
    const verificationTerminal = document.getElementById('verification-terminal');
    const certWrapper = document.getElementById('verification-certificate-wrapper');

    // Dynamic certificate details displays inside modal
    const certDisplayTitle = document.getElementById('cert-display-title');
    const certDisplayDate = document.getElementById('cert-display-date');
    const certDisplayId = document.getElementById('cert-display-id');
    const certIssuerBadge = document.getElementById('cert-issuer-badge');
    const certWatermarkLogo = document.getElementById('cert-watermark-logo');

    if (!grid) return;

    // Filter, Slice, and Re-render Cards list logic
    const renderCredentials = () => {
      // 1. Filtering database
      const filtered = CREDENTIALS.filter(cred => {
        const matchesCategory = activeCategory === 'all' || cred.category === activeCategory;
        
        const term = searchQuery.toLowerCase().trim();
        const matchesSearch = !term || 
          cred.title.toLowerCase().includes(term) ||
          cred.issuer.toLowerCase().includes(term) ||
          cred.credentialId.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
      });

      // 2. Clear previous nodes
      grid.innerHTML = '';

      if (filtered.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-muted text-center';
        emptyState.style.gridColumn = 'span 3';
        emptyState.style.padding = '40px';
        emptyState.style.fontFamily = 'var(--font-mono)';
        emptyState.innerHTML = `[ALERT] No matching certificates found in registry database.`;
        grid.appendChild(emptyState);
        paginationContainer.style.display = 'none';
        return;
      }

      // 3. Pagination limits
      const sliced = filtered.slice(0, visibleItemsCount);

      // 4. Render sliced list
      sliced.forEach(cred => {
        const card = document.createElement('div');
        card.className = `credential-card ${cred.class}`;
        
        // Expiry detail tag
        const expiryText = cred.expiry ? ` &middot; <span class="text-red">Expires ${cred.expiry.split(' ')[0]} ${cred.expiry.split(' ')[1]}</span>` : '';
        
        // Credential ID UI panel
        const credIdContent = cred.credentialId !== 'N/A' ? `
          <div class="cred-id-wrapper">
            <span class="cred-id-label">ID:</span>
            <span class="cred-id-value">${cred.credentialId}</span>
            <button class="cred-id-copy" data-text="${cred.credentialId}" title="Copy to clipboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        ` : `
          <div class="cred-id-wrapper">
            <span class="cred-id-label">ID:</span>
            <span class="cred-id-value text-muted" style="font-style: italic;">Accreditation Badge</span>
            <span></span>
          </div>
        `;

        card.innerHTML = `
          <div class="cred-header-meta">
            <span class="cred-issuer-text">${cred.issuer.split(' ')[0]}</span>
            <span class="cred-date">${cred.date}${expiryText}</span>
          </div>
          <h3 class="cred-title">${cred.title}</h3>
          ${credIdContent}
          <div class="cred-actions">
            <button class="btn btn-primary btn-xs btn-show-cred" data-id="${cred.id}">
              Show Credential
            </button>
          </div>
        `;

        grid.appendChild(card);
      });

      // 5. Toggle Pagination controls view
      if (filtered.length > visibleItemsCount) {
        paginationContainer.style.display = 'flex';
      } else {
        paginationContainer.style.display = 'none';
      }

      // Re-register inner events
      registerCardEvents();
    };

    // Card Specific Action handlers
    const registerCardEvents = () => {
      // Credential ID clipboard Copy triggers
      document.querySelectorAll('.cred-id-copy').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const txt = btn.dataset.text;
          navigator.clipboard.writeText(txt).then(() => {
            const originalColor = btn.style.color;
            btn.style.color = 'var(--green)';
            
            if (window.appendSystemLog) {
              window.appendSystemLog(`<span class="text-green">[SYSTEM]</span> Copied credential key to clipboard: <span class="text-yellow">${txt}</span>`);
            }

            setTimeout(() => {
              btn.style.color = originalColor;
            }, 1500);
          }).catch(err => {
            console.error('Failed to copy ID: ', err);
          });
        });
      });

      // Verification Handshake execution modal triggers
      document.querySelectorAll('.btn-show-cred').forEach(btn => {
        btn.addEventListener('click', () => {
          const credId = btn.dataset.id;
          const cred = CREDENTIALS.find(c => c.id === credId);
          if (cred) triggerVerificationFlow(cred);
        });
      });
    };

    // Stepped cryptographic TLS verification diagnostics routine
    const triggerVerificationFlow = (cred) => {
      // 1. Show modal container
      modal.classList.add('active');
      certWrapper.classList.add('hidden');
      certWrapper.classList.remove('active');
      verificationTerminal.innerHTML = '';
      
      // Hook system log stream
      if (window.appendSystemLog) {
        window.appendSystemLog(`<span class="text-purple">[AUTH]</span> Initializing cryptographic handshake verification sequence...`);
      }

      // Step text diagnostic outputs
      const diagLogs = [
        `[CONNECTING] Connecting to security-auth.gateway.net:443 (CID: ${cred.id})...`,
        `[RESOLVING] Target verified IP: 104.244.42.1 (Domain: gatekeeper.auth.sh)...`,
        `[HANDSHAKE] Initializing SSL/TLS Handshake protocol...`,
        `[SECURITY] Certificate authority: Let's Encrypt / SHA-256 G5 Public Key Encryption...`,
        `[SECURITY] Active cipher suite: TLS_AES_256_GCM_SHA384 (Version: TLSv1.3)...`,
        `[SECURITY] TLS Handshake session established successfully. Code: 0x2A493`,
        `[TRANSACTION] Pulling credential ledger entry for ID: ${cred.credentialId !== 'N/A' ? cred.credentialId : 'training-badge'}...`,
        `[AUDIT] Validating cryptographic digital signature matching issuer profile: ${cred.issuer}...`,
        `[AUDIT] Match signature algorithm: RSA-4096 / Public-Key signature match SUCCESS.`,
        `[DECRYPT] Decrypting validation record payload metadata...`,
        `[SUCCESS] --------------------------------------------------------`,
        `[SUCCESS]   CREDENTIAL AUTHENTICATION COMPLETED SUCCESSFULLY`,
        `[SUCCESS]   ISSUER: ${cred.issuer.toUpperCase()}`,
        `[SUCCESS]   STATUS: VALID / SECURE / ACTIVE RECORD`,
        `[SUCCESS] --------------------------------------------------------`
      ];

      let logLineIdx = 0;
      const printDiagLines = () => {
        if (logLineIdx >= diagLogs.length) {
          // Completed verification diagnostics, now render certificate mockup card
          setTimeout(() => {
            // Update certificate fields
            certDisplayTitle.innerText = cred.title;
            certDisplayDate.innerText = cred.date;
            certDisplayId.innerText = cred.credentialId !== 'N/A' ? `ID: ${cred.credentialId}` : 'ACCREDITED TRAINING BADGE';
            certIssuerBadge.innerText = cred.issuer;
            certWatermarkLogo.innerText = cred.issuer.split(' ')[0].toUpperCase();

            // Style and show cert
            certWrapper.classList.remove('hidden');
            setTimeout(() => {
              certWrapper.classList.add('active');
            }, 50);

            // Hook system log stream
            if (window.appendSystemLog) {
              window.appendSystemLog(`<span class="text-green">[AUTH]</span> Verified active credential issued by <strong class="text-cyan">${cred.issuer}</strong> - Title: ${cred.title}`, 'text-green');
            }
          }, 800);
          return;
        }

        const line = document.createElement('div');
        line.className = 'verif-line';
        
        let text = diagLogs[logLineIdx];
        if (text.startsWith('[SUCCESS]')) {
          line.className = 'verif-line text-green';
        } else if (text.startsWith('[CONNECTING]') || text.startsWith('[HANDSHAKE]')) {
          line.className = 'verif-line text-yellow';
        } else if (text.startsWith('[SECURITY]')) {
          line.className = 'verif-line text-muted';
        } else if (text.startsWith('[AUDIT]')) {
          line.className = 'verif-line text-purple';
        }

        line.innerHTML = text;
        verificationTerminal.appendChild(line);
        verificationTerminal.scrollTop = verificationTerminal.scrollHeight;
        
        logLineIdx++;
        // Dynamic timed scroll text
        setTimeout(printDiagLines, 120 + Math.random() * 200);
      };

      printDiagLines();
    };

    // Close Modal handles
    const closeModal = () => {
      modal.classList.remove('active');
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Filtering Tabs event triggers
    tabs.querySelectorAll('.cred-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle highlight tabs
        tabs.querySelectorAll('.cred-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Set state and render
        activeCategory = btn.dataset.category;
        visibleItemsCount = itemsPerPage;
        renderCredentials();
      });
    });

    // Live search event trigger
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      visibleItemsCount = itemsPerPage;
      renderCredentials();
    });

    // Pagination Load More event trigger
    btnLoadMore.addEventListener('click', () => {
      visibleItemsCount += itemsPerPage;
      renderCredentials();
    });

    // Boot execution
    renderCredentials();
  };

  /* ==========================================================================
     SYSTEM INITIALIZATION EXECUTION
     ========================================================================== */
  initTelemetryCharts();
  initSystemLogsStream();
  initK8sClusterGrid();
  initTerminal();
  initPipelineSimulator();
  initHeroHeadlineRotator();
  initFeaturedSection();
  initContactApiForm();
  initCredentialsRegistry();

  // Scroll Header indicator highlights active section
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + varHeaderHeight();

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  const varHeaderHeight = () => {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 70;
  };

  /* ==========================================================================
     MOBILE MENU TOGGLE
     ========================================================================== */
  const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (mobileMenuBtn && header && overlay) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        header.classList.toggle('open');
        overlay.classList.toggle('active');
      });

      // Close menu when clicking on nav links
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuBtn.classList.remove('active');
          header.classList.remove('open');
          overlay.classList.remove('active');
        });
      });

      // Close menu when clicking overlay
      overlay.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        header.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  };

  initMobileMenu();

  // Hero Trigger Pipeline Integration Action
  const btnDeployProfile = document.getElementById('btn-deploy-profile');
  if (btnDeployProfile) {
    btnDeployProfile.addEventListener('click', () => {
      // Smooth scroll to Pipeline simulator section
      const target = document.getElementById('pipeline');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Automatically run pipeline
        setTimeout(() => {
          document.getElementById('btn-trigger-pipeline').click();
        }, 800);
      }
    });
  }

});
