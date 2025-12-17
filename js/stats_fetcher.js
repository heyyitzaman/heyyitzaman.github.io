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
        return { repos: 25, stars: 5, languages: { Python: 10, Java: 6 } };
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
        if (data.status === 'error') throw new Error(data.message);

        return data;
    } catch (e) {
        return { totalSolved: 100, easySolved: 50, mediumSolved: 42, hardSolved: 8 };
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
        const staticTotal = STATIC_STATS.hackerrank_solved + INTERVIEWBIT_STATS.solved;
        const staticEasy = Math.round(staticTotal * 0.37);
        const staticMedium = Math.round(staticTotal * 0.5);
        const staticHard = Math.round(staticTotal * 0.13);

        // LeetCode Data
        const lcEasy = lcData.easySolved || 100;
        const lcMedium = lcData.mediumSolved || 125;
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
        const ghLangs = ghData.languages || {};

        const lcLangs = {
            Python: 5,
            JavaScript: 1,
            Java: 2,
            SQL: 3,
            "C++": 8
        };
        const allowedLangs = ['Python', 'JavaScript', 'Java', 'C++', 'SQL'];

        const FALLBACK = 1;

        const applyFallback = source => {
            const out = {};
            allowedLangs.forEach(lang => {
                out[lang] = source[lang] ?? FALLBACK;
            });
            return out;
        };

        const normalize = source => {
            const total = Object.values(source).reduce((a, b) => a + b, 0) || 1;
            const out = {};
            allowedLangs.forEach(lang => {
                out[lang] = (source[lang] || 0) / total;
            });
            return out;
        };

        const ghNorm = normalize(ghLangs);
        const lcNorm = normalize(lcLangs);

        const combined = {};
        allowedLangs.forEach(lang => {
            combined[lang] =
                (ghNorm[lang] * 0.5) +
                (lcNorm[lang] * 0.5);
        });

        // Convert to percentages (ORDER PRESERVED)
        const totalScore = Object.values(combined).reduce((a, b) => a + b, 0);
        const percentages = allowedLangs.map(lang =>
            Math.round((combined[lang] / totalScore) * 100)
        );

        new Chart(langCtx, {
            type: 'bar',
            data: {
                labels: allowedLangs,
                datasets: [{
                    data: percentages,
                    borderRadius: 4,
                    backgroundColor: [
                        'rgba(59,130,246,0.7)',  // Python
                        'rgba(245,158,11,0.7)',  // JavaScript
                        'rgba(16,185,129,0.7)',  // Java
                        'rgba(236,72,153,0.7)',  // SQL
                        'rgba(139,92,246,0.7)'   // C++
                    ]
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    x: {
                        max: 100,
                        ticks: { callback: v => `${v}%` },
                        grid: { display: false }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: textColor,
                            font: { weight: 'bold' }
                        }
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
        // ===== 1. FETCH DATA FROM APIs =====
        // Fetch GitHub contributions from the past year
        const ghRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
        if (!ghRes.ok) throw new Error("GitHub daily stats failed");
        const ghJson = await ghRes.json();

        // Fetch LeetCode submissions calendar (submissions by date)
        let lcCalendar = {};
        try {
            const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
            const lcJson = await lcRes.json();
            if (lcJson.status !== 'error' && lcJson.submissionCalendar) {
                lcCalendar = lcJson.submissionCalendar; // Object: {epochTimestamp: count}
            }
        } catch (e) { console.warn("LeetCode calendar fetch failed", e); }

        // ===== 2. PREPARE DATA STRUCTURE =====
        // Create a Map to store combined activity for each day
        const activityMap = new Map();
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 365); // Go back 365 days

        // Align start date to the previous Sunday for correct grid alignment
        // (Contribution graphs traditionally start on Sunday)
        const dayOfWeek = startDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        startDate.setDate(startDate.getDate() - dayOfWeek);

        // Helper function to format dates as YYYY-MM-DD in Local Time
        // This matches strictly what the user perceives as 'today'
        const toYMD = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Populate base map with all dates in the range (initialize with 0 counts)
        const loopDate = new Date(startDate);
        while (loopDate <= today) {
            activityMap.set(toYMD(loopDate), { gh: 0, lc: 0, total: 0, jsDate: new Date(loopDate) });
            loopDate.setDate(loopDate.getDate() + 1);
        }

        // Helper to safely get or create an entry in the activity map
        const getOrCreateEntry = (ymd, dateObj) => {
            if (!activityMap.has(ymd)) {
                activityMap.set(ymd, { gh: 0, lc: 0, total: 0, jsDate: dateObj || new Date(ymd) });
            }
            return activityMap.get(ymd);
        };

        // ===== 3. POPULATE GITHUB DATA =====
        // Fill GitHub contribution counts into the activity map
        if (ghJson.contributions) {
            ghJson.contributions.forEach(item => {
                // item.date is "YYYY-MM-DD" string
                // CRITICAL: Treat this string as "Local Day" not UTC
                // If we do new Date("2024-06-01"), it treats as UTC, which might shift date in negative timezones
                // We want "2024-06-01" to mean "User's June 1st"
                // So we manually parse it to avoid timezone issues

                const parts = item.date.split('-'); // [2024, 06, 01]
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // 0-indexed (Jan=0)
                const day = parseInt(parts[2]);

                // Create a date object for this local day
                const genericDate = new Date(year, month, day);
                const ymd = toYMD(genericDate); // Should match item.date, ensures consistency

                const entry = getOrCreateEntry(ymd, genericDate);
                entry.gh = item.count; // Store GitHub contribution count
                entry.total += item.count; // Add to total
            });
        }

        // ===== 4. POPULATE LEETCODE DATA =====
        // Fill LeetCode submission counts into the activity map
        Object.keys(lcCalendar).forEach(epoch => {
            // Convert Unix epoch timestamp to Date object
            const date = new Date(parseInt(epoch) * 1000);
            const ymd = toYMD(date); // Use local YMD to match user perception

            const entry = getOrCreateEntry(ymd, date);
            const count = lcCalendar[epoch];
            entry.lc = count; // Store LeetCode submission count
            entry.total += count; // Add to total
        });

        // ===== 5. SETUP CONTAINER LAYOUT =====
        // Clear loading state and setup responsive container
        calendarEl.innerHTML = '';
        calendarEl.style.display = 'flex';
        calendarEl.style.flexDirection = 'column';
        calendarEl.style.alignItems = 'center';
        calendarEl.style.width = '100%'; // Full width container for responsiveness

        // ===== 6. THEME CONFIGURATION =====
        // Define color palettes for Light vs Dark mode
        // Ensures optimal visibility and aesthetics for both themes
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        const palette = isLight ? {
            text: '#1f2937',            // Dark gray for labels (clearly visible on light bg)
            empty: '#f3f3f3ff',         // Light green 100 - Very light, clearly shows empty days
            border: '#9ca3af',          // Medium gray border for boxes
            level1: '#6ee7b7',          // Green 300 (Light Green) - Low activity
            level2: '#34d399',          // Green 400 (Medium Light) - Moderate activity
            level3: '#10b981',          // Green 500 (Medium) - Good activity
            level4: '#065f46',          // Green 900 (Dark Green) - Max activity
            emptyBorder: '#d1d5db'      // Light gray border for empty cells
        } : {
            text: '#ffffff',                        // Pure White for Dark Mode labels
            empty: 'rgba(255,255,255,0.08)',        // Subtle white tint for empty
            border: 'rgba(255,255,255,0.1)',        // Subtle border
            level1: 'rgba(74, 222, 128, 0.4)',      // Green with 40% opacity
            level2: 'rgba(74, 222, 128, 0.6)',      // Green with 60% opacity
            level3: 'rgba(74, 222, 128, 0.9)',      // Green with 90% opacity
            level4: '#4ade80',                       // Solid green - Max activity
            emptyBorder: 'rgba(255,255,255,0.05)'   // Very subtle border
        };

        // ===== 7. CALCULATE RESPONSIVE DIMENSIONS =====
        // Dynamically calculate cell size based on available container width
        // This ensures the graph fits perfectly without horizontal scroll on all screens (including 1080p)
        const containerWidth = calendarEl.parentElement.offsetWidth - 48; // Account for container padding + border (24px each side)
        const weeks = 53; // Number of weeks to display (1 year)
        const sideLabelWidth = 30; // Space reserved for day labels (Mon, Wed, Fri)

        // Calculate optimal cell size that fits the container width
        // Formula: (available width - label space - total gaps) / number of weeks
        // We need to account for: cellWidth * 53 + gap * 52 (gaps between cells)
        const gapSize = 3; // Gap between cells
        const totalGapSpace = 52 * gapSize; // Total space taken by gaps
        const availableSpace = containerWidth - sideLabelWidth - totalGapSpace;
        let cellSize = Math.floor(availableSpace / weeks);
        cellSize = Math.max(8, Math.min(14, cellSize)); // Clamp between 8-14px to ensure no scroll

        // Configure cell properties based on calculated size
        const cellInfo = {
            width: cellSize,                    // Cell width in pixels
            height: cellSize,                   // Cell height in pixels (square)
            gap: gapSize,                       // Fixed gap for consistency
            radius: 2                           // Border radius for rounded corners
        };

        const topLabelHeight = 20; // Space reserved for month labels at top

        // Calculate total SVG dimensions based on cell size and count
        const width = sideLabelWidth + (weeks * (cellInfo.width + cellInfo.gap));
        const height = topLabelHeight + (7 * (cellInfo.height + cellInfo.gap)); // 7 days per week

        // ===== 8. CREATE SCROLL WRAPPER =====
        // Wrapper div to enable horizontal scroll on very small screens if needed
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '100%'; // Prevent wrapper from exceeding container
        wrapper.style.overflowX = 'auto';    // Enable horizontal scroll if content exceeds width
        wrapper.style.overflowY = 'visible'; // Allow tooltips to overflow vertically

        // ===== 9. CREATE HEADER =====
        // Header shows date range and year span
        const headerEl = document.createElement('div');
        headerEl.style.display = 'flex';
        headerEl.style.justifyContent = 'space-between';
        headerEl.style.width = '100%';
        headerEl.style.minWidth = width + 'px'; // Ensure header matches graph width
        headerEl.style.marginBottom = '10px';
        headerEl.style.color = palette.text;
        headerEl.style.fontSize = cellSize < 11 ? '12px' : '14px'; // Responsive font size
        headerEl.style.fontWeight = '500';

        // Format date range strings
        const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const endStr = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        headerEl.innerHTML = `<span>${startDate.getFullYear()} - ${today.getFullYear()}</span> <span style="color:${palette.text}; opacity:0.7; font-size:${cellSize < 11 ? '11px' : '12px'}">${startStr} – ${endStr}</span>`;

        // ===== 10. CREATE SVG ELEMENT =====
        // Main SVG canvas for the contribution graph
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.style.fontFamily = "sans-serif";
        svg.style.fontSize = cellSize < 11 ? "9px" : "10px"; // Responsive font size
        svg.style.minWidth = width + 'px'; // Prevent SVG from shrinking below calculated width

        // ===== 11. RENDER DAY LABELS =====
        // Add day labels on the left side (Mon, Wed, Fri)
        // Only showing 3 labels to avoid cluttering
        const days = ['Mon', 'Wed', 'Fri'];
        const dayOffsets = [1, 3, 5]; // Row indices for these days (0=Sun, 1=Mon, ...)
        days.forEach((d, i) => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = d;
            text.setAttribute("x", 0); // Left-aligned
            text.setAttribute("y", topLabelHeight + (dayOffsets[i] * (cellInfo.height + cellInfo.gap)) + 10); // Vertical position
            text.setAttribute("fill", palette.text);
            text.style.fontSize = cellSize < 11 ? "8px" : "10px"; // Responsive font
            svg.appendChild(text);
        });

        // Track current month for label rendering (to avoid duplicate labels)
        let currentMonth = -1;

        // ===== 12. RENDER CONTRIBUTION CELLS =====
        // Sort all activity entries by date and render each as a cell
        const sortedEntries = Array.from(activityMap.entries()).sort((a, b) => a[1].jsDate - b[1].jsDate);
        let maxCount = 0; // Track maximum count for potential relative scaling

        sortedEntries.forEach((entry, index) => {
            const [dateStr, data] = entry;
            const dateObj = data.jsDate;
            if (data.total > maxCount) maxCount = data.total; // Update max count

            // ===== Calculate Cell Position =====
            // Grid layout: 7 rows (days) × 53 columns (weeks)
            const weekIndex = Math.floor(index / 7);  // Which week column (0-52)
            const dayIndex = index % 7;                // Which day row (0=Sun, 6=Sat)

            // Calculate pixel position in the SVG
            const x = sideLabelWidth + (weekIndex * (cellInfo.width + cellInfo.gap));
            const y = topLabelHeight + (dayIndex * (cellInfo.height + cellInfo.gap));

            // ===== Render Month Label =====
            // Add month label at the start of each month (only on first row to avoid clutter)
            const m = dateObj.getMonth();
            if (m !== currentMonth && dayIndex === 0) {
                currentMonth = m;
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });

                // Avoid label bunching near the end
                if (weekIndex < 51) {
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.textContent = monthName;
                    text.setAttribute("x", x);
                    text.setAttribute("y", 12); // Position at top
                    text.setAttribute("fill", palette.text);
                    text.style.fontSize = cellSize < 11 ? "8px" : "10px"; // Responsive font
                    svg.appendChild(text);
                }
            }

            // ===== Create Cell Rectangle =====
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", cellInfo.width);
            rect.setAttribute("height", cellInfo.height);
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("rx", cellInfo.radius); // Rounded corners
            rect.setAttribute("ry", cellInfo.radius);

            // ===== Apply Color Based on Activity Level =====
            // Color intensity represents contribution count
            let fill = palette.empty; // Default for 0 contributions
            if (data.total > 0) {
                if (data.total <= 2) fill = palette.level1;       // 1-2: Light green
                else if (data.total <= 5) fill = palette.level2;  // 3-5: Medium-light green
                else if (data.total <= 10) fill = palette.level3; // 6-10: Medium green
                else fill = palette.level4;                      // 11+: Dark green (max intensity)
            }
            rect.setAttribute("fill", fill);

            // Add border for definition (if palette specifies)
            if (palette.border) {
                rect.setAttribute("stroke", palette.border);
                rect.setAttribute("stroke-width", "1");
            }

            // ===== Add Interaction Data Attributes =====
            // Store data for tooltips and interactions
            rect.classList.add('contrib-cell');
            rect.setAttribute('data-date', dateStr);        // Store date string
            rect.setAttribute('data-count', data.total);    // Total contributions
            rect.setAttribute('data-gh', data.gh);          // GitHub count
            rect.setAttribute('data-lc', data.lc);          // LeetCode count
            rect.style.transition = "all 0.1s";             // Smooth hover effect

            svg.appendChild(rect);
        });

        // ===== 13. APPEND SVG TO WRAPPER =====
        wrapper.appendChild(headerEl);
        wrapper.appendChild(svg);

        // ===== 14. CREATE FOOTER WITH STATS =====
        // Footer shows total contributions and color legend
        const totalCount = sortedEntries.reduce((acc, curr) => acc + curr[1].total, 0);
        const footer = document.createElement('div');
        footer.style.marginTop = '10px';
        footer.style.width = '100%';
        footer.style.minWidth = width + 'px';
        footer.style.fontSize = cellSize < 11 ? '11px' : '12px'; // Responsive font
        footer.style.color = palette.text;
        footer.style.display = 'flex';
        footer.style.justifyContent = 'space-between';
        footer.style.flexWrap = 'wrap'; // Wrap on very small screens
        footer.style.gap = '8px';

        // Scale legend box size with cell size
        const legendSize = cellSize < 11 ? 10 : 12;
        footer.innerHTML = `
            <span>${totalCount} contributions</span>
            <div style="display:flex; align-items:center; gap:4px; font-size:${cellSize < 11 ? '10px' : '11px'}">
                <span>Less</span>
                <div style="width:${legendSize}px;height:${legendSize}px;background:${palette.empty};border:1px solid ${palette.emptyBorder || 'transparent'};border-radius:2px"></div>
                <div style="width:${legendSize}px;height:${legendSize}px;background:${palette.level1};border-radius:2px"></div>
                <div style="width:${legendSize}px;height:${legendSize}px;background:${palette.level2};border-radius:2px"></div>
                <div style="width:${legendSize}px;height:${legendSize}px;background:${palette.level3};border-radius:2px"></div>
                <div style="width:${legendSize}px;height:${legendSize}px;background:${palette.level4};border-radius:2px"></div>
                <span>More</span>
            </div>
        `;

        // ===== 15. FINALIZE LAYOUT =====
        wrapper.appendChild(footer);
        calendarEl.appendChild(wrapper);

        // ===== 16. SETUP TOOLTIPS =====
        // Initialize tooltip functionality (defined elsewhere)
        setupCustomGraphTooltips();

    } catch (e) {
        // ===== ERROR HANDLING =====
        // Display user-friendly error message if something fails
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
            if (!dateStr) return;

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
