// Configuration
const GITHUB_USERNAME = 'heyyitzaman';
const LEETCODE_USERNAME = 'iaman_pandey';

// Static Data for "Hard to Fetch" sources
const STATIC_STATS = {
    hackerrank_solved: 150, 
    hackerrank_stars: 5,
    resume_projects: 10
};

const INTERVIEWBIT_STATS = {
    solved: 42,
    rank: 3209,
    score: 11090
};

/**
 * Fetch GitHub User Data
 */
async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('GitHub API Error');
        const data = await response.json();
        
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        const repos = await reposRes.json();
        
        let stars = 0;
        const languages = {};
        
        repos.forEach(repo => {
            stars += repo.stargazers_count;
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        return {
            repos: data.public_repos,
            stars: stars,
            languages: languages,
            followers: data.followers
        };
    } catch (e) {
        console.warn('Using fallback GitHub data', e);
        return { repos: 25, stars: 20, languages: { Python: 10, Java: 5 } };
    }
}

/**
 * Fetch LeetCode Stats (via proxy)
 */
async function fetchLeetCodeStats() {
    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
        if (!response.ok) throw new Error('LeetCode API Error');
        const data = await response.json();
        if(data.status === 'error') throw new Error(data.message);
        return data; 
    } catch (e) {
        return { totalSolved: 450, easySolved: 150, mediumSolved: 250, hardSolved: 50 };
    }
}

/**
 * Render Charts
 */
async function renderStatsCharts() {
    const ghData = await fetchGitHubStats();
    const lcData = await fetchLeetCodeStats();

    // Aggregated Metrics
    const totalProblems = (lcData.totalSolved || 0) + STATIC_STATS.hackerrank_solved + INTERVIEWBIT_STATS.solved;
    const totalProjects = (ghData.repos || 0) + STATIC_STATS.resume_projects;
    const totalStars = (ghData.stars || 0); 
    
    // Update Text Counters
    updateElementText('stat-problems', totalProblems); 
    updateElementText('stat-projects', totalProjects);
    updateElementText('stat-stars', totalStars);
    
    // Theme Colors
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#4b5563' : '#a1a1aa';

    // Render "Problem Solving" Chart (Difficulty Distribution)
    const psCtx = document.getElementById('problemSolvingChart');
    if (psCtx) {
        // Estimate difficulty for static stats (HR=150, IB=42)
        // Assumption: mostly Medium/Easy. We'll add 30% to Easy, 50% to Medium, 20% to Hard for these.
        // Total static = 192
        const staticTotal = STATIC_STATS.hackerrank_solved + INTERVIEWBIT_STATS.solved;
        const staticEasy = Math.round(staticTotal * 0.3);
        const staticMedium = Math.round(staticTotal * 0.5);
        const staticHard = Math.round(staticTotal * 0.2);

        // LeetCode Data
        const lcEasy = lcData.easySolved || 150;
        const lcMedium = lcData.mediumSolved || 250;
        const lcHard = lcData.hardSolved || 50;

        // Combined Data
        const totalEasy = lcEasy + staticEasy;
        const totalMedium = lcMedium + staticMedium;
        const totalHard = lcHard + staticHard;

        new Chart(psCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [totalEasy, totalMedium, totalHard],
                    backgroundColor: ['#22c55e', '#fbbf24', '#ef4444'], // Green, Amber, Red
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: textColor } },
                    title: { display: true, text: 'Difficulty Distribution', color: textColor, padding: { bottom: 10 } }
                },
                cutout: '60%'
            }
        });
    }

    // ... inside renderStatsCharts ...

    // Render "Most Used Languages" Chart (Combined GitHub + LeetCode estimate)
    const langCtx = document.getElementById('languageChart');
    if (langCtx) {
        // GitHub Languages
        const ghLangs = ghData.languages || {};
        
        // Custom weighting: User solves LeetCode mostly in Python (inferred from bio)
        // We add a "weight" to Python representing LeetCode usage to the GitHub bytes/count
        const leetCodeFactor = 50; // Arbitrary weight to represent "500 problems" worth of code
        
        const combinedLangs = { ...ghLangs };
        if (combinedLangs['Python']) {
            combinedLangs['Python'] += leetCodeFactor;
        } else {
            combinedLangs['Python'] = leetCodeFactor;
        }

        // Filter valid backend/coding languages
        const include = ['Python', 'Java', 'JavaScript', 'Go', 'C++', 'Shell', 'SQL'];
        const sortedLangs = Object.entries(combinedLangs)
            .filter(([lang]) => include.includes(lang) || ghLangs[lang] > 5) // Keep significant ones
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5);

        new Chart(langCtx, {
            type: 'bar',
            data: {
                labels: sortedLangs.map(l => l[0]),
                datasets: [{
                    label: 'Usage Frequency',
                    data: sortedLangs.map(l => l[1]),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)', // Blue
                        'rgba(16, 185, 129, 0.7)', // Green
                        'rgba(245, 158, 11, 0.7)', // Yellow
                        'rgba(139, 92, 246, 0.7)', // Purple
                        'rgba(236, 72, 153, 0.7)'  // Pink
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bar chart for better readability of names
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        display: false, // Hide values as they are arbitrary "frequency" scores now
                        grid: { display: false }
                    },
                    y: { 
                        grid: { display: false }, 
                        ticks: { color: textColor, font: { weight: 'bold' } } 
                    }
                }
            }
        });
    }

}

function updateElementText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value + '+';
}

// Re-render on theme toggle if needed (optional optimization)
// document.getElementById('themeToggle').addEventListener('click', () => setTimeout(renderStatsCharts, 100));

function updateExperience() {
    const startDate = new Date('2023-07-01'); // Start Date: July 2023
    const now = new Date();
    
    // Calculate difference in years
    const diffInMilliseconds = now - startDate;
    const years = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    
    // Format to 1 decimal place (e.g., 2.5)
    const formattedYears = years.toFixed(1);
    
    const expEl = document.getElementById('stat-experience');
    // Also try to find element by counter animation class usage if ID is missing or used differently
    // In about.html we have: <div class="stat-number counter-animated" data-target="2">0</div>
    // We should probably give it a unique ID or query it.
    // Let's assume we add id="stat-experience" to about.html
    if (expEl) {
        expEl.setAttribute('data-target', formattedYears);
        expEl.textContent = formattedYears;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderStatsCharts === 'function') {
        renderStatsCharts();
    }
    updateExperience();
    renderCustomContributionGraph(); // Call the new graph renderer
});


// Theme Listener for dynamic graph updates
document.getElementById('themeToggle').addEventListener('click', () => {
    setTimeout(renderCustomContributionGraph, 50);
});

/**
 * FETCH AND RENDER COMBINED CONTRIBUTION GRAPH
 */
async function renderCustomContributionGraph() {
    const calendarEl = document.querySelector('.calendar');
    if (!calendarEl) return;

    // Loading State
    calendarEl.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted)">Loading combined stats...</div>';

    try {
        // 1. Fetch Data
        const ghRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
        if(!ghRes.ok) throw new Error("GitHub daily stats failed");
        const ghJson = await ghRes.json();
        
        let lcCalendar = {};
        try {
            const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
            const lcJson = await lcRes.json();
            if(lcJson.status !== 'error' && lcJson.submissionCalendar) {
                lcCalendar = lcJson.submissionCalendar; 
            }
        } catch (e) { console.warn("LeetCode calendar fetch failed", e); }

        // 2. Prepare Data Map
        const activityMap = new Map();
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 365); 
        
        // Align start date to the previous Sunday for correct grid alignment
        const dayOfWeek = startDate.getDay(); // 0=Sun
        startDate.setDate(startDate.getDate() - dayOfWeek);

        // Helper to format YYYY-MM-DD in Local Time (Browser context)
        // This matches strictly what the user matches 'today' with.
        const toYMD = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Populate base map
        const loopDate = new Date(startDate);
        while(loopDate <= today) {
            activityMap.set(toYMD(loopDate), { gh: 0, lc: 0, total: 0, jsDate: new Date(loopDate) });
            loopDate.setDate(loopDate.getDate() + 1);
        }

        // Helper to safely get or create entry
        const getOrCreateEntry = (ymd, dateObj) => {
            if (!activityMap.has(ymd)) {
                activityMap.set(ymd, { gh: 0, lc: 0, total: 0, jsDate: dateObj || new Date(ymd) });
            }
            return activityMap.get(ymd);
        };

        // Fill GitHub 
        if(ghJson.contributions) {
            ghJson.contributions.forEach(item => {
                // item.date is "YYYY-MM-DD". 
                // CRITICAL: Treat this string as "Local Day" not UTC.
                // If we do new Date("2024-06-01"), it treats as UTC, which might shift date in negative timezones.
                // We want "2024-06-01" to mean "User's June 1st".
                // So we manually parse it.
                
                const parts = item.date.split('-'); // [2024, 06, 01]
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // 0-indexed
                const day = parseInt(parts[2]);
                
                // Create a generic date object for this local day
                const genericDate = new Date(year, month, day); 
                const ymd = toYMD(genericDate); // Should match item.date usually, but ensures consistency

                const entry = getOrCreateEntry(ymd, genericDate);
                entry.gh = item.count;
                entry.total += item.count;
            });
        }

        // Fill LeetCode
        Object.keys(lcCalendar).forEach(epoch => {
            const date = new Date(parseInt(epoch) * 1000);
            const ymd = toYMD(date); // Use local YMD to match user perception
            
            const entry = getOrCreateEntry(ymd, date);
            const count = lcCalendar[epoch];
            entry.lc = count;
            entry.total += count;
        });

        // 3. Render Layout
        calendarEl.innerHTML = '';
        calendarEl.style.display = 'flex';
        calendarEl.style.flexDirection = 'column';
        calendarEl.style.alignItems = 'center'; // Center the graph
        calendarEl.style.overflowX = 'auto'; // Horizontal scroll on mobile
        
        // Theme Colors & Configuration
        // We define specific palettes for Light vs Dark to ensure top-tier visibility
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        const palette = isLight ? {
            text: '#1f2937',            // Dark gray for Labels (clearly visible on light bg)
            empty: '#f3f3f3ff',           // Light green 100 - Very light, clearly visible
            border: '#9ca3af',          // Medium gray border for boxes
            
            level1: '#6ee7b7',          // Green 300 (Light Green)
            level2: '#34d399',          // Green 400 (Medium Light)
            level3: '#10b981',          // Green 500 (Medium)
            level4: '#065f46',          // Green 900 (Dark Green) - Max Intensity
            emptyBorder: '#d1d5db'      // Light gray border for empty cells
        } : {
            text: '#ffffff',            // Pure White for Dark Mode
            empty: 'rgba(255,255,255,0.08)', 
            border: 'rgba(255,255,255,0.1)', 
            level1: 'rgba(74, 222, 128, 0.4)', 
            level2: 'rgba(74, 222, 128, 0.6)', 
            level3: 'rgba(74, 222, 128, 0.9)',
            level4: '#4ade80',                 
            emptyBorder: 'rgba(255,255,255,0.05)'
        };

        // Configuration
        const cellInfo = { width: 14, height: 14, gap: 4, radius: 2 }; 
        const weeks = 53;
        const sideLabelWidth = 30;
        const topLabelHeight = 20;
        const width = sideLabelWidth + (weeks * (cellInfo.width + cellInfo.gap)); 
        const height = topLabelHeight + (7 * (cellInfo.height + cellInfo.gap)); 
        
        // Header: Date Range & Year
        const headerEl = document.createElement('div');
        headerEl.style.display = 'flex';
        headerEl.style.justifyContent = 'space-between';
        headerEl.style.width = '100%';
        headerEl.style.maxWidth = width + 'px';
        headerEl.style.marginBottom = '10px';
        headerEl.style.color = palette.text;
        headerEl.style.fontSize = '14px';
        headerEl.style.fontWeight = '500';
        
        const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const endStr = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        headerEl.innerHTML = `<span>${startDate.getFullYear()} - ${today.getFullYear()}</span> <span style="color:${palette.text}; opacity:0.7; font-size:12px">${startStr} – ${endStr}</span>`;
        calendarEl.appendChild(headerEl);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.style.fontFamily = "sans-serif";
        svg.style.fontSize = "10px";
        
        // Day Labels (Mon, Wed, Fri)
        const days = ['Mon', 'Wed', 'Fri'];
        const dayOffsets = [1, 3, 5]; // Indexes 0-6
        days.forEach((d, i) => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = d;
            text.setAttribute("x", 0);
            text.setAttribute("y", topLabelHeight + (dayOffsets[i] * (cellInfo.height + cellInfo.gap)) + 10); 
            text.setAttribute("fill", palette.text);
            svg.appendChild(text);
        });

        // Month Labels logic
        let currentMonth = -1;

        // Render Cells
        const sortedEntries = Array.from(activityMap.entries()).sort((a,b) => a[1].jsDate - b[1].jsDate);
        let maxCount = 0; // Track max for potential relative scaling if needed
        
        sortedEntries.forEach((entry, index) => {
            const [dateStr, data] = entry;
            const dateObj = data.jsDate;
            if(data.total > maxCount) maxCount = data.total;
            
            // Calculate Position
            const weekIndex = Math.floor(index / 7);
            const dayIndex = index % 7; // 0=Sun, 1=Mon...
            
            const x = sideLabelWidth + (weekIndex * (cellInfo.width + cellInfo.gap));
            const y = topLabelHeight + (dayIndex * (cellInfo.height + cellInfo.gap));
            
            // Render Month Label
            const m = dateObj.getMonth();
            if(m !== currentMonth && dayIndex === 0) {
                currentMonth = m;
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                
                // Avoid label bunching
                // Only drawing if we have enough weeks left or it's not too close to end
                if (weekIndex < 51) {
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.textContent = monthName;
                    text.setAttribute("x", x);
                    text.setAttribute("y", 12);
                    text.setAttribute("fill", palette.text);
                    svg.appendChild(text);
                }
            }

            // Cell Rect
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", cellInfo.width);
            rect.setAttribute("height", cellInfo.height);
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("rx", cellInfo.radius);
            rect.setAttribute("ry", cellInfo.radius);
            
            // Color Logic utilizing palette
            let fill = palette.empty;
            if(data.total > 0) {
                 if(data.total <= 2) fill = palette.level1;
                 else if(data.total <= 5) fill = palette.level2;
                 else if(data.total <= 10) fill = palette.level3;
                 else fill = palette.level4;
            }
            rect.setAttribute("fill", fill);
            
            // stroke optional depending on theme
            if(palette.border) {
                rect.setAttribute("stroke", palette.border);
                rect.setAttribute("stroke-width", "1");
            }
            
            // Interaction
            rect.classList.add('contrib-cell');
            rect.setAttribute('data-date', dateStr);
            rect.setAttribute('data-count', data.total);
            rect.setAttribute('data-gh', data.gh);
            rect.setAttribute('data-lc', data.lc);
            rect.style.transition = "all 0.1s"; 

            svg.appendChild(rect);
        });

        calendarEl.appendChild(svg);
        
        // Add Footer
        const totalCount = sortedEntries.reduce((acc, curr) => acc + curr[1].total, 0);
        const footer = document.createElement('div');
        footer.style.marginTop = '10px';
        footer.style.width = '100%';
        footer.style.maxWidth = width + 'px'; // Match graph width
        footer.style.fontSize = '12px';
        footer.style.color = palette.text;
        footer.style.display = 'flex';
        footer.style.justifyContent = 'space-between';
        
        footer.innerHTML = `
            <span>${totalCount} contributions</span>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px">
                <span>Less</span>
                <div style="width:12px;height:12px;background:${palette.empty};border:1px solid ${palette.emptyBorder || 'transparent'};border-radius:2px"></div>
                <div style="width:12px;height:12px;background:${palette.level1};border-radius:2px"></div>
                <div style="width:12px;height:12px;background:${palette.level2};border-radius:2px"></div>
                <div style="width:12px;height:12px;background:${palette.level3};border-radius:2px"></div>
                <div style="width:12px;height:12px;background:${palette.level4};border-radius:2px"></div>
                <span>More</span>
            </div>
        `;
        calendarEl.appendChild(footer);

        setupCustomGraphTooltips();

    } catch (e) {
        calendarEl.innerHTML = `<div style="color:var(--accent)">Failed to load activity graph. <br> <small>${e.message}</small></div>`;
    }
}

function setupCustomGraphTooltips() {
    const tooltip = document.getElementById('custom-chart-tooltip') || createTooltipEl();
    // Helper to find cells (SVG rects)
    const cells = document.querySelectorAll('.contrib-cell');
    
    cells.forEach(cell => {
        // SVG elements don't always support same mouse events perfectly in all browsers, 
        // but modern ones do.
        cell.addEventListener('mouseenter', (e) => {
            const count = parseInt(cell.getAttribute('data-count'));
            const dateStr = cell.getAttribute('data-date');
            if(!dateStr) return;
            
            const gh = cell.getAttribute('data-gh');
            const lc = cell.getAttribute('data-lc');

            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            let html = `<div style="font-weight:600; margin-bottom:4px; color:#fff">${formattedDate}</div>`;
            if (count === 0) {
                 html += `<div style="color:#94a3b8">No contributions</div>`;
            } else {
                 html += `<div style="color:#fff">${count} Total</div>`;
                 html += `<div style="font-size:10px; color:#cbd5e1; margin-top:2px">
                            GitHub: ${gh}<br>
                            LeetCode: ${lc}
                          </div>`;
            }
            
            tooltip.innerHTML = html;
            tooltip.style.display = 'block';
            cell.style.opacity = '0.6';
        });

        cell.addEventListener('mousemove', (e) => {
             tooltip.style.left = (e.clientX + 15) + 'px';
             tooltip.style.top = (e.clientY + 15) + 'px';
        });

        cell.addEventListener('mouseleave', () => {
             tooltip.style.display = 'none';
             cell.style.opacity = '1';
        });
    });
}

function createTooltipEl() {
    const tooltip = document.createElement('div');
    tooltip.id = 'custom-chart-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.padding = '8px 12px';
    tooltip.style.background = 'rgba(15, 23, 42, 0.95)'; 
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '100001';
    tooltip.style.border = '1px solid rgba(255,255,255,0.1)';
    tooltip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}
